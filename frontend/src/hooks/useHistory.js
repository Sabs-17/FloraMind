import { useEffect, useState } from 'react';
import { detectPlant, updateMemory } from '../utils/memoryManager';

const STORAGE_KEY = 'floramind_chat_sessions';

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const sanitizeMessage = (message) => {
  if (!message || typeof message !== 'object') {
    return {
      role: 'system',
      content: String(message || ''),
      imagePreviews: [],
      createdAt: Date.now(),
    };
  }

  const role = message.role || 'user';
  let content = '';
  if (typeof message.content === 'string') {
    content = message.content;
  } else if (message.content != null) {
    try {
      content = JSON.stringify(message.content);
    } catch {
      content = String(message.content);
    }
  }

  return {
    ...message,
    role,
    content,
    imagePreviews: Array.isArray(message.imagePreviews) ? message.imagePreviews : [],
    createdAt: message.createdAt || Date.now(),
  };
};

const summarizePrompt = (text) => {
  if (!text || typeof text !== 'string') return '';

  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[?!.]/g, '')
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const cleaned = normalize(text);
  if (!cleaned) return '';

  const removalPatterns = [
    /^o que e (um |uma |um |uma )?/, 
    /^o que sao (os |as |um |uma )?/, 
    /^quais sao (os |as |um |uma )?/, 
    /^quais sao /,
    /^qual e (o |a |os |as )?/, 
    /^como (eu )?(devo |posso |faco |faço |manter |cuidar |cuidar de )?/, 
    /^devo /,
    /^posso /,
    /^me ajude a /,
    /^me diga /,
  ];

  let summary = cleaned;
  for (const pattern of removalPatterns) {
    summary = summary.replace(pattern, '');
  }
  summary = summary.trim();

  if (!summary) return cleaned.slice(0, 40).trim();

  if (summary.startsWith('cuidados') && summary.includes(' para ')) {
    const afterPara = summary.split(' para ').slice(1).join(' para ').trim();
    if (afterPara) {
      summary = `cuidados para ${afterPara}`;
    }
  }

  const stopwords = new Set([
    'os', 'as', 'um', 'uma', 'me', 'ajude', 'a', 'ao', 'aos', 'por', 'do', 'da', 'dos', 'das', 'de', 'em', 'que', 'qual', 'como', 'com', 'se', 'sem', 'sobre', 'no', 'na', 'nos', 'nas', 'e', 'é', 'sera', 'foi', 'sao', 'são', 'para'
  ]);

  const keepPara = summary.startsWith('cuidados');
  const tokens = summary
    .split(' ')
    .filter((token) => keepPara ? token !== 'de' && token !== 'do' && token !== 'da' : !stopwords.has(token));

  if (tokens.length === 0) {
    return cleaned.slice(0, 40).trim();
  }

  if (/^(o que e|o que sao|quais sao|qual e|como)/.test(cleaned)) {
    summary = tokens.slice(-3).join(' ');
  } else {
    summary = tokens.slice(0, 5).join(' ');
  }

  const singularize = (word) => {
    if (word.endsWith('oes')) return word.slice(0, -3) + 'ao';
    if (word.endsWith('aes')) return word.slice(0, -3) + 'ao';
    if (word.endsWith('is')) return word.slice(0, -2) + 'l';
    if (word.endsWith('res')) return word.slice(0, -2);
    if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);
    return word;
  };

  const finalTokens = summary
    .split(' ')
    .map((token, index) => {
      if (index === 0 && token === 'cuidados') return token;
      return singularize(token);
    })
    .filter(Boolean);

  summary = finalTokens.join(' ');
  if (summary.length > 40) {
    summary = summary.slice(0, 40).trim();
  }

  return summary;
};

const createSessionRecord = ({ name, messages = [], createdAt = Date.now(), updatedAt = Date.now(), memory = {} } = {}) => ({
  id: createId(),
  name: name || `Chat ${Math.floor(Math.random() * 10000)}`,
  messages: Array.isArray(messages) ? messages.map(sanitizeMessage) : [],
  memory: memory || {},
  createdAt,
  updatedAt,
});

export function useHistory() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const initial = createSessionRecord({ name: 'Chat 1' });
        setSessions([initial]);
        setActiveSessionId(initial.id);
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (parsed[0]?.messages) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setIsHydrated(true);
          return;
        }

        const initial = createSessionRecord({ name: 'Chat 1', messages: parsed });
        setSessions([initial]);
        setActiveSessionId(initial.id);
        setIsHydrated(true);
        return;
      }

      const initial = createSessionRecord({ name: 'Chat 1' });
      setSessions([initial]);
      setActiveSessionId(initial.id);
      setIsHydrated(true);
    } catch (e) {
      console.error('Erro lendo histórico do localStorage, removendo entrada corrompida:', e);
      localStorage.removeItem(STORAGE_KEY);
      const initial = createSessionRecord({ name: 'Chat 1' });
      setSessions([initial]);
      setActiveSessionId(initial.id);
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    // Persist only sessions that contain messages so empty chats aren't kept in storage
    const sessionsToPersist = sessions.filter((s) => Array.isArray(s.messages) && s.messages.length > 0);
    if (sessionsToPersist.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionsToPersist));
    }
  }, [isHydrated, sessions]);

  const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0] || null;
  const activeMessages = activeSession?.messages || [];

  const createSession = () => {
    const nextIndex = sessions.length + 1;
    const newSession = createSessionRecord({ name: `Chat ${nextIndex}` });
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const selectSession = (id) => {
    if (!sessions.some((session) => session.id === id)) return;
    setActiveSessionId(id);
  };

  const addMessage = (message) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== activeSession?.id) return session;

        const sanitized = sanitizeMessage(message);
        const isFirstUserMessage =
          session.messages.length === 0 && sanitized.role === 'user' && sanitized.content;

        const nextName = isFirstUserMessage
          ? summarizePrompt(sanitized.content) || session.name
          : session.name;

        const shouldRename = isFirstUserMessage && /^Chat \d+$/i.test(session.name);

        // Update memory when a user message contains a plant
        let nextMemory = session.memory || {};
        if (sanitized.role === 'user' && sanitized.content) {
          const detected = detectPlant(sanitized.content);
          if (detected) {
            nextMemory = updateMemory(nextMemory, detected);
          }
        }

        return {
          ...session,
          name: shouldRename ? nextName : session.name,
          messages: [...session.messages, sanitized],
          memory: nextMemory,
          updatedAt: Date.now(),
        };
      })
    );
  };

  const clearHistory = () => {
    const initial = createSessionRecord({ name: 'Chat 1' });
    setSessions([initial]);
    setActiveSessionId(initial.id);
  };

  const deleteSession = (id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const initial = createSessionRecord({ name: 'Chat 1' });
        setActiveSessionId(initial.id);
        return [initial];
      }

      if (!next.some((s) => s.id === activeSessionId)) {
        setActiveSessionId(next[0].id);
      }

      return next;
    });
  };

  return {
    sessions,
    activeSession,
    activeMessages,
    createSession,
    selectSession,
    addMessage,
    clearHistory,
    deleteSession,
  };
}
