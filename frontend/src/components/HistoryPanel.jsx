export default function HistoryPanel({ sessions, activeSessionId, onSelectSession, onCreateSession, onDeleteSession }) {
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="grid gap-4">
      <div className="rounded-[32px] border border-blush bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-twilight/90">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blush dark:text-blush/80">Histórico</p>
            <h3 className="mt-2 text-xl font-semibold text-night dark:text-white">Chats salvos</h3>
          </div>
          <button
            type="button"
            onClick={onCreateSession}
            className="rounded-3xl bg-gradient-to-r from-mint to-blush px-4 py-3 text-sm font-semibold text-night transition hover:opacity-90"
          >
            Novo chat
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Selecione um chat antigo para retomar a conversa ou crie um novo para começar do zero.
        </p>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="rounded-[32px] border border-blush bg-white/90 p-6 text-center text-slate-600 shadow-xl dark:border-slate-700 dark:bg-twilight/90 dark:text-slate-300">
          Ainda não há chats salvos.
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedSessions.map((session) => {
            const lastMessage = session.messages.length > 0
              ? session.messages[session.messages.length - 1].content
              : 'Sem mensagens nesta conversa.';

            return (
              <div
                key={session.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectSession(session.id)}
                className={`w-full rounded-[28px] border p-6 text-left transition ${
                  session.id === activeSessionId
                    ? 'border-blush bg-blush/10 shadow-md'
                    : 'border-blush/20 bg-white hover:border-blush/40 hover:bg-blush/5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-night dark:text-white">{session.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {session.messages.length} mensagem{session.messages.length === 1 ? '' : 's'} · atualizado em {new Date(session.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blush/10 px-3 py-1 text-xs font-semibold text-blush">Abrir</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!onDeleteSession) return;
                        if (window.confirm('Remover este chat do histórico?')) {
                          onDeleteSession(session.id);
                        }
                      }}
                      className="rounded-3xl px-3 py-1 text-xs font-semibold text-red-600 hover:opacity-90"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-2">
                  {lastMessage}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
