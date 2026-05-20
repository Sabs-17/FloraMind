import { useState } from 'react';
import { chatApi, mediaApi } from '../services/api';

const BOTANICAL_QUERY_MAP = {
  rosa: 'rose',
  rosas: 'rose',
  roseira: 'rose plant',
  roseiras: 'rose plant',
  roseiral: 'rose plant',
  flor: 'flower',
  planta: 'plant',
  folha: 'leaf',
  cacto: 'cactus',
  orquídea: 'orchid',
  orquidea: 'orchid',
  suculenta: 'succulent',
  folhagem: 'foliage',
  raiz: 'root',
  semente: 'seed',
  botânica: 'plant',
  botanica: 'plant',
  erva: 'herb',
  fruto: 'fruit',
  árvore: 'tree',
  arvore: 'tree',
  jardim: 'garden',
  grama: 'grass',
  manjericão: 'basil',
  manjericao: 'basil',
  trepadeira: 'vine',
  gramínea: 'grass',
  samambaia: 'fern',
};

const normalizeBotanicalQuery = (text) => {
  if (!text || typeof text !== 'string') return null;
  const normalized = text.toLowerCase();
  const matches = Object.keys(BOTANICAL_QUERY_MAP).filter((keyword) => normalized.includes(keyword));
  if (matches.length === 0) return null;
  return BOTANICAL_QUERY_MAP[matches[0]];
};

const searchPlantImage = async (query) => {
  if (!query || !query.trim()) return [];

  const fetchUrls = async (searchQuery) => {
    const response = await mediaApi.get('/images', {
      params: { query: searchQuery },
    });
    return (response.data?.images || []).slice(0, 4).map((img) => img.url).filter(Boolean);
  };

  try {
    console.debug('[Pexels] buscando imagem para:', query);
    const urls = await fetchUrls(query);
    if (urls.length > 0) {
      console.debug('[Pexels] imagens encontradas para', query, urls);
      return urls;
    }

    const fallbackMap = {
      'rose plant': 'rose',
      rose: 'rose plant',
      flower: 'flower',
      orchid: 'orchid',
      succulent: 'succulent',
      fern: 'fern',
      herb: 'herb',
      basil: 'basil',
      tree: 'tree',
    };

    const fallbackQuery = fallbackMap[query.toLowerCase()];
    if (fallbackQuery) {
      console.debug('[Pexels] fallback de consulta para:', fallbackQuery);
      const fallbackUrls = await fetchUrls(fallbackQuery);
      return fallbackUrls;
    }

    return [];
  } catch (err) {
    console.warn('Falha ao buscar imagem de planta:', err.response?.data || err?.message || err);
    return [];
  }
};

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const filesToBase64 = async (files) => {
    return Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                data: reader.result,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
  };

  const sendMessage = async ({ content, files = [], previousMessages = [], memory = {} }) => {
    if (!content?.trim() && files.length === 0) return;

    // Sanitize user message to ensure content is a string and image previews array exists
    const userMessage = {
      role: 'user',
      content: typeof content === 'string' ? content : (content != null ? String(content) : ''),
      imagePreviews: [],
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const messageHistory = previousMessages.length > 0 ? previousMessages : messages;

      // Sanitize message history to ensure we only send { role, content } where content is a string
      const sanitizedHistory = (messageHistory || []).map((m) => ({
        role: m?.role || 'user',
        content: typeof m?.content === 'string' ? m.content : (m?.content != null ? JSON.stringify(m.content) : ''),
      }));
      
      // Convert files to base64 if present
      const imagesData = files.length > 0 ? await filesToBase64(files) : [];

      // If this is a botanical query, try to fetch an image from Pexels.
      const botanicalQuery = normalizeBotanicalQuery(userMessage.content);
      const plantImageUrls = files.length === 0 && botanicalQuery
        ? await searchPlantImage(botanicalQuery)
        : [];

      const response = await chatApi.post('/', {
        history: sanitizedHistory,
        message: userMessage,
        memory: memory || {},
        images: imagesData,
      });

      // Normalize assistant response content to a string to avoid passing objects
      let assistantContent = response.data.response;
      if (typeof assistantContent !== 'string') {
        try {
          // If it's an object/array, stringify to keep UI safe
          assistantContent = JSON.stringify(assistantContent, null, 2);
        } catch (e) {
          assistantContent = String(assistantContent);
        }
      }

      const assistantMessage = {
        role: 'assistant',
        content: assistantContent,
        intent: response.data.intent || 'general',
        plant: response.data.plant || null,
        imagePreviews: Array.isArray(plantImageUrls) ? plantImageUrls : [],
      };

      // Simula um pequeno tempo de digitação antes de exibir a resposta
      await new Promise((res) => setTimeout(res, 1000));
      setMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (err) {
      console.error('Erro na API:', err.response?.data || err.message);
      
      // Show specific error message from backend if available; otherwise include
      // HTTP status + response or a network error message to help debugging.
      let backendError = err.response?.data?.detail || err.response?.data?.error;
      if (!backendError && err.response) {
        try {
          backendError = `Status ${err.response.status}: ${JSON.stringify(err.response.data)}`;
        } catch (e) {
          backendError = `Status ${err.response.status}`;
        }
      }

      if (!backendError) {
        // Fallback to the generic error message from axios (network, timeout, CORS, etc.)
        backendError = err.message || null;
      }

      const errorMessage = backendError || 'Ops! Não consegui responder agora 🌿 Tente novamente.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, error };
}
