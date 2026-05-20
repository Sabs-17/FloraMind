import MessageBubble from './MessageBubble';

function TypingFlowers() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex items-end gap-2">
        <span className="flower w-6 h-6" aria-hidden>🌸</span>
        <span className="flower w-6 h-6" aria-hidden>🌼</span>
        <span className="flower w-6 h-6" aria-hidden>🌺</span>
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, onSuggestionClick, isLoading }) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-[32px] border border-blush bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-twilight/90">
      {messages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-blush bg-gradient-to-br from-blush/10 to-mint/10 p-8 text-center text-night dark:border-slate-600 dark:bg-gradient-to-br dark:from-blush/5 dark:to-mint/5 dark:text-white">
          <p className="text-lg font-semibold">Comece sua conversa com a FloraMind 🌿</p>
          <p className="mt-2 text-sm leading-relaxed">Fale sobre sua planta, dúvida de rega, luz ou pragas.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages
            .map((m, i) => ({ m, i }))
            .filter(({ m }) => m && typeof m === 'object')
            .map(({ m, i }) => (
              <MessageBubble key={m.createdAt || i} message={m} onSuggestionClick={onSuggestionClick} />
            ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[60%] rounded-[20px] border px-4 py-3 bg-white text-night border-blush/20 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <TypingFlowers />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
