const DEFAULT_HISTORY_SIZE = 6;

const normalizeHistoryMessage = (message) => {
  if (!message || typeof message !== 'object') {
    return {
      role: 'user',
      content: String(message || ''),
    };
  }

  return {
    role: message.role || 'user',
    content: typeof message.content === 'string'
      ? message.content
      : message.content != null
      ? JSON.stringify(message.content)
      : '',
  };
};

const normalizeMessage = (message) => {
  if (!message || typeof message !== 'object') {
    return {
      role: 'user',
      content: String(message || ''),
    };
  }

  return {
    role: message.role || 'user',
    content: message.content != null ? message.content : '',
  };
};

const buildConversation = ({ history = [], message }, systemPrompt, userPromptHint, maxHistory = DEFAULT_HISTORY_SIZE) => {
  const normalizedHistory = Array.isArray(history)
    ? history
        .map(normalizeHistoryMessage)
        .filter((m) => typeof m.content === 'string' && m.content.trim().length > 0)
        .slice(-maxHistory)
    : [];

  const normalizedMessage = normalizeMessage(message);
  const conversation = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'system',
      content: userPromptHint,
    },
    ...normalizedHistory,
  ];

  if (normalizedMessage.content !== '' || normalizedMessage.role) {
    conversation.push(normalizedMessage);
  }

  return conversation;
};

module.exports = {
  buildConversation,
};
