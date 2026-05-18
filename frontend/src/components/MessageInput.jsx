import { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';

export default function MessageInput({ onSend, loading, error }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    await onSend({ content: text, file });
    setText('');
    setFile(null);
  };

  return (
    <div className="rounded-[32px] border border-blush bg-white/90 p-5 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-twilight/90">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-[120px] rounded-3xl border border-blush/30 bg-white px-4 py-3 text-sm text-night outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blush dark:focus:ring-blush/30"
          placeholder="Escreva sua dúvida sobre plantas..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-blush/50 bg-blush/10 px-4 py-3 text-sm text-night transition hover:border-blush hover:bg-blush/20 dark:border-blush/30 dark:bg-blush/5 dark:text-white dark:hover:border-blush/50 dark:hover:bg-blush/10">
            <Paperclip className="h-4 w-4" />
            {file ? file.name : 'Anexar imagem (opcional)'}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-blush to-blush/80 px-5 py-3 text-sm font-semibold text-night transition hover:from-blush hover:to-blush disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gradient-to-r dark:from-blush/70 dark:to-blush/50 dark:text-white dark:hover:from-blush dark:hover:to-blush/70"
          >
            {loading ? 'Pensando...' : 'Enviar'}
            <Send className="h-4 w-4" />
          </button>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </div>
  );
}
