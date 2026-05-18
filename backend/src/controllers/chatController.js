const axios = require('axios');
const { getSystemPrompt } = require('../prompts/systemPrompt');

const handleChat = async (req, res, next) => {
  try {
    const apiKey = process.env.GOOGLE_AI_KEY;
    if (!apiKey) {
      throw new Error('Chave Google AI Studio não encontrada em GOOGLE_AI_KEY');
    }

    const incomingMessages = req.body.messages ? JSON.parse(req.body.messages) : [];
    const systemPrompt = getSystemPrompt();

    // Construir histórico apenas com mensagens do usuário e assistente
    const history = incomingMessages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    // Preparar a requisição para Gemini API
    const payload = {
      system: systemPrompt,
      contents: history.length > 0 ? history : [{ role: 'user', parts: [{ text: 'Oi!' }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta agora.';
    res.json({ response: text });
  } catch (error) {
    console.error('Erro ao chamar Gemini API:', error.response?.data || error.message);
    next(error);
  }
};

module.exports = { handleChat };
