import { useEffect, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useChat } from '../hooks/useChat';
import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import HistoryPanel from '../components/HistoryPanel';

export default function ChatPage() {
  const {
    sessions,
    activeSession,
    activeMessages,
    createSession,
    selectSession,
    addMessage,
    deleteSession,
  } = useHistory();
  const { sendMessage, isLoading, error } = useChat();
  const [draft, setDraft] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Debugging aid: warn if any message is malformed to help detect blank-screen causes
  useEffect(() => {
    activeMessages.forEach((m, i) => {
      if (!m || typeof m !== 'object') {
        console.warn(`Mensagem inválida no índice ${i}: não é um objeto`, m);
      } else if (m.content != null && typeof m.content !== 'string') {
        console.warn(`Mensagem com content não string no índice ${i}:`, m);
      }
    });
  }, [activeMessages]);

  const handleSend = async ({ content, files = [] }) => {
    const trimmedContent = content?.trim();
    if (!trimmedContent && files.length === 0) return;

    setDraft('');
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    const userMsg = { role: 'user', content: trimmedContent, imagePreviews };

    addMessage(userMsg);

    const messageHistory = [...activeMessages, userMsg];
    const assistantMessage = await sendMessage({ content: trimmedContent, files, previousMessages: messageHistory, memory: activeSession?.memory });
    if (assistantMessage) addMessage(assistantMessage);
  };

  const handleSuggestionClick = async (suggestion) => {
    setDraft('');
    await handleSend({ content: suggestion });
  };

  const handleCreateNewChat = () => {
    createSession();
    setActiveTab('chat');
  };

  const handleSelectSession = (sessionId) => {
    selectSession(sessionId);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8 dark:bg-night">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <Header />
        <div className="flex min-h-[640px] flex-col gap-6">
          <div className="rounded-[32px] border border-blush bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-twilight/90">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blush dark:text-blush/80">Histórico de chats</p>
                <h2 className="mt-2 text-3xl font-semibold text-night dark:text-white">
                  {activeTab === 'chat'
                    ? activeSession?.name || 'Chat atual'
                    : 'Conversas salvas'}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === 'chat'
                      ? 'bg-blush text-night'
                      : 'border border-blush/20 bg-white text-night hover:bg-blush/10 dark:bg-slate-800 dark:text-white'
                  }`}
                >
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === 'history'
                      ? 'bg-blush text-night'
                      : 'border border-blush/20 bg-white text-night hover:bg-blush/10 dark:bg-slate-800 dark:text-white'
                  }`}
                >
                  Histórico
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewChat}
                  className="rounded-3xl bg-gradient-to-r from-mint to-blush px-4 py-3 text-sm font-semibold text-night transition hover:opacity-90"
                >
                  Novo chat
                </button>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {activeTab === 'chat'
                ? 'Continue a conversa com a sessão atual ou abra um chat anterior pelo histórico.'
                : 'Acesse as mensagens anteriores e retome qualquer conversa salva.'}
            </p>
          </div>

          {activeTab === 'history' ? (
            <HistoryPanel
              sessions={sessions}
              activeSessionId={activeSession?.id}
              onSelectSession={handleSelectSession}
              onCreateSession={handleCreateNewChat}
              onDeleteSession={deleteSession}
            />
          ) : (
            <>
              <ChatWindow
                messages={activeMessages}
                onSuggestionClick={handleSuggestionClick}
                isLoading={isLoading}
              />
              <MessageInput
                onSend={handleSend}
                loading={isLoading}
                error={error}
                text={draft}
                setText={setDraft}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
