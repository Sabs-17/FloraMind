import { useState, useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';

export default function MessageInput({ onSend, loading, error, text, setText }) {
  const [localText, setLocalText] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const inputText = text !== undefined ? text : localText;
  const updateText = setText || setLocalText;

  const addFiles = (newFiles) => {
    const fileArray = Array.from(newFiles).filter((f) => f.type.startsWith('image/'));
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFiles((prev) => [...prev, file]);
        setPreviews((prev) => [...prev, { name: file.name, src: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (event) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const handlePaste = (event) => {
    const clipboardItems = event.clipboardData?.items;
    if (!clipboardItems) return;
    const imageFiles = [];
    for (let i = 0; i < clipboardItems.length; i++) {
      if (clipboardItems[i].kind === 'file' && clipboardItems[i].type.startsWith('image/')) {
        imageFiles.push(clipboardItems[i].getAsFile());
      }
    }
    if (imageFiles.length > 0) {
      event.preventDefault();
      addFiles(imageFiles);
    }
  };

  const submitMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText && files.length === 0) return;
    await onSend({ content: trimmedText, files });
    updateText('');
    setFiles([]);
    setPreviews([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitMessage();
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await submitMessage();
    }
  };

  return (
    <div className="rounded-[32px] border border-blush bg-white/90 p-5 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-twilight/90">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="min-h-[120px] rounded-3xl border border-blush/30 bg-white px-4 py-3 text-sm text-night outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blush dark:focus:ring-blush/30"
          placeholder="Escreva sua dúvida sobre plantas... (ou cole imagens)"
          value={inputText}
          onChange={(event) => updateText(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded-2xl bg-blush/10 p-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.src}
                  alt={preview.name}
                  className="h-20 w-20 rounded-lg object-cover border border-blush/30"
                  title={preview.name}
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-blush/50 bg-blush/10 px-4 py-3 text-sm text-night transition hover:border-blush hover:bg-blush/20 dark:border-blush/30 dark:bg-blush/5 dark:text-white dark:hover:border-blush/50 dark:hover:bg-blush/10">
            <Paperclip className="h-4 w-4" />
            {files.length > 0 ? `${files.length} imagem(ns)` : 'Anexar imagens'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <button
            type="submit"
            disabled={loading || (!inputText.trim() && files.length === 0)}
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
