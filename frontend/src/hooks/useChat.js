import { useState } from 'react';
import { chatApi } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async ({ content, file, previousMessages = [] }) => {
    if (!content?.trim()) return;

    const userMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const messageHistory = previousMessages.length > 0 ? previousMessages : messages;
      const formData = new FormData();
      formData.append('messages', JSON.stringify([...messageHistory, userMessage]));
      if (file) formData.append('file', file);

      const response = await chatApi.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const assistantMessage = { role: 'assistant', content: response.data.response };
      setMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (err) {
      setError('Ops! Não consegui responder agora 🌿 Tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, error };
}
