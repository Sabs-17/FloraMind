const axios = require('axios');
require('dotenv').config();

const { getSystemPrompt } = require('../prompts/systemPrompt');
const { detectIntent, detectPlant, buildPrompt } = require('../utils/intentClassifier');
const { generateDynamicSuggestions, filterSuggestions } = require('../utils/suggestionGenerator');
const { buildConversation } = require('../services/conversationManager');

// Max image size: 20MB (base64 will be ~33% larger)
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

const handleChat = async (req, res) => {
  try {
    const historyPayload = Array.isArray(req.body.history)
      ? req.body.history
      : Array.isArray(req.body.messages)
      ? req.body.messages
      : [];

    let images = [];
    if (Array.isArray(req.body.images)) {
      images = req.body.images.filter((img) => {
        const size = img.data.length;
        if (size > MAX_IMAGE_SIZE) {
          console.warn(`[Chat] Imagem ${img.name} excede tamanho máximo: ${size} bytes`);
          return false;
        }
        return true;
      });
    }

    const lastUserMessage = req.body.message || [...historyPayload].reverse().find((m) => m.role === 'user');
    const userText = typeof lastUserMessage?.content === 'string'
      ? lastUserMessage.content
      : String(lastUserMessage?.content || '');
    const intent = detectIntent(userText);
    const plant = detectPlant(userText);
    const userPromptHint = buildPrompt(intent, userText, plant);

    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_KEY) {
      return res.status(500).json({
        error: 'GROQ_API_KEY não configurada'
      });
    }

    // Incorporate structured memory (if provided) into the system prompt so the model
    // receives important facts without needing to reread the entire history.
    const memory = req.body.memory || {};
    const memoryLines = [];
    if (memory.firstPlantMentioned) memoryLines.push(`- Primeira planta: ${memory.firstPlantMentioned}`);
    if (memory.currentPlant) memoryLines.push(`- Planta atual: ${memory.currentPlant}`);
    if (Array.isArray(memory.mentionedPlants) && memory.mentionedPlants.length > 0) {
      memoryLines.push(`- Plantas mencionadas: ${memory.mentionedPlants.join(', ')}`);
    }
    if (memory.currentIntent) memoryLines.push(`- Intenção atual: ${memory.currentIntent}`);

    const memoryText = memoryLines.length > 0 ? `Memória da conversa:\n${memoryLines.join('\n')}` : '';
    const systemPromptFull = memoryText ? `${memoryText}\n\n${getSystemPrompt()}` : getSystemPrompt();

    const conversation = buildConversation(
      {
        history: historyPayload,
        message: req.body.message || lastUserMessage,
      },
      systemPromptFull,
      userPromptHint
    );

    const messages = conversation.map((msg) => {
      if (!msg || typeof msg !== 'object') {
        return {
          role: 'user',
          content: String(msg || ''),
        };
      }

      return {
        role: msg.role || 'user',
        content: typeof msg.content === 'string'
          ? msg.content
          : msg.content != null
          ? msg.content
          : '',
      };
    });

    if (images.length > 0) {
      const lastUserIndex = messages
        .map((msg) => msg.role)
        .lastIndexOf('user');

      if (lastUserIndex !== -1) {
        const originalContent = messages[lastUserIndex].content;
        const textContent = typeof originalContent === 'string'
          ? originalContent || 'Analise as imagens enviadas.'
          : String(originalContent || 'Analise as imagens enviadas.');

        messages[lastUserIndex] = {
          role: 'user',
          content: [
            {
              type: 'text',
              text: textContent,
            },
            ...images.map((image) => ({
              type: 'image_url',
              image_url: {
                url: image.data,
              },
            })),
          ],
        };
      }
    }

    // FIX: llava models were deprecated by Groq.
    // Use meta-llama/llama-4-scout-17b-16e-instruct which supports vision.
    let model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    if (images.length > 0) {
      model = process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
    }

    console.log(`[Chat] Intenção detectada: ${intent}`);
    console.log(`[Chat] Planta detectada: ${plant || 'nenhuma'}`);
    console.log(`[Chat] Usando modelo: ${model}`);
    console.log(`[Chat] Número de imagens: ${images.length}`);
    console.log(`[Chat] Número de mensagens: ${messages.length}`);

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiText = response.data?.choices?.[0]?.message?.content;

    if (!aiText) {
      return res.status(500).json({
        error: 'Resposta vazia da Groq'
      });
    }

    const cleanedText = aiText
      .replace(/###\s*📋\s*O que está acontecendo\?[\s\S]*?(?=\n###|$)/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Try to use suggestions from the AI model first
    let finalText = cleanedText;
    try {
      const hasSuggestions = /Pergunte-me sobre:/i.test(finalText);
      if (!hasSuggestions) {
        // Generate dynamic suggestions based on the response content
        const historyLength = incomingMessages.filter(m => m.role === 'user').length;
        let generatedSuggestions = generateDynamicSuggestions(
          cleanedText,
          intent,
          plant,
          historyLength
        );

        // Filter out suggestions that repeat the user's question
        generatedSuggestions = filterSuggestions(generatedSuggestions, userText);

        if (generatedSuggestions.length > 0) {
          finalText = `${finalText}\n\nPergunte-me sobre: ${generatedSuggestions.join(', ')}`;
        }
      }
    } catch (e) {
      console.warn('[Chat] Erro ao gerar sugestões dinâmicas:', e);
    }

    return res.json({ response: finalText, intent, plant });

  } catch (error) {
    console.error('Erro ao chamar a API da Groq:');
    console.error('Status:', error.response?.status);
    console.error('Dados da resposta:', JSON.stringify(error.response?.data, null, 2));
    console.error('Mensagem:', error.message);

    let errorDetail = error.response?.data || error.message;
    if (error.response?.status === 400) {
      // Retorna a mensagem de erro bruta da API quando a requisição é inválida
      // Evita mensagens enganosas sobre visão quando o usuário enviou apenas texto.
      errorDetail = error.response?.data || 'Requisição inválida. Verifique `GROQ_MODEL`, payload e formatos enviados.';
    } else if (error.response?.status === 429) {
      errorDetail = 'Limite de requisições atingido. Tente novamente em alguns segundos.';
    }

    // Ensure detail is a string to make client-side rendering safer
    const detailSafe = typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail);

    return res.status(500).json({
      error: 'Erro ao chamar a API da Groq',
      detail: detailSafe,
    });
  }
};

module.exports = { handleChat };
