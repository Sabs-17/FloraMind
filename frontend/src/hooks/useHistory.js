import { useEffect, useState } from 'react';

const STORAGE_KEY = 'floramind_chat_history';

export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addMessage = (message) => setHistory((prev) => [...prev, message]);
  const clearHistory = () => setHistory([]);

  return { history, addMessage, clearHistory };
}
