import { useEffect, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useChat } from '../hooks/useChat';
import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';

export default function ChatPage() {
  const { history, addMessage, clearHistory } = useHistory();
  const { messages, sendMessage, isLoading, error } = useChat();
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    setAllMessages(history.length > 0 ? history : messages);
  }, [history, messages]);

  const handleSend = async ({ content, file }) => {
    const assistantMessage = await sendMessage({ content, file, previousMessages: history });
    addMessage({ role: 'user', content });
    if (assistantMessage) addMessage(assistantMessage);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8 dark:bg-night">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <Header />
        <div className="flex min-h-[640px] flex-col gap-6">
          <ChatWindow messages={allMessages} />
          <MessageInput onSend={handleSend} loading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
}
