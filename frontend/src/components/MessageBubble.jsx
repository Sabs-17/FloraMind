import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ message, onSuggestionClick }) {
  const isUser = message.role === 'user';

  // Normalize content to a string when possible to avoid runtime errors
  const contentText = typeof message.content === 'string' ? message.content : '';
  const suggestionMatch = contentText.match(/Pergunte-me sobre:\s*([\s\S]*)$/i);
  const mainContent = suggestionMatch ? contentText.slice(0, suggestionMatch.index).trim() : contentText;
  const suggestionText = suggestionMatch ? suggestionMatch[1].trim() : null;

  const suggestions = suggestionText
    ? suggestionText
        .replace(/\b(ou|and)\b/gi, ',')
        .split(',')
        .map((item) => item.replace(/^[\*"'\s]+|[\*"'\s]+$/g, '').trim())
        .filter(Boolean)
    : [];

  // FIX: render image previews sent alongside user messages
  const imagePreviews = message.imagePreviews || [];
  const intent = message.intent || 'general';
  const intentMap = {
    explanation: { emoji: '📚', title: 'Explicação Botânica', subtitle: 'Uma resposta educativa e informativa.' },
    care: { emoji: '🌱', title: 'Guia de Cuidados', subtitle: 'Recomendações práticas para cuidar da planta.' },
    identification: { emoji: '🔎', title: 'Identificação', subtitle: 'Ajuda para reconhecer a planta.' },
    disease: { emoji: '🩺', title: 'Possíveis doenças', subtitle: 'Sintomas e sinais a observar.' },
    watering: { emoji: '💧', title: 'Rega', subtitle: 'Rotina de irrigação e sinais de água.' },
    fertilization: { emoji: '🌿', title: 'Adubação', subtitle: 'Nutrição e fertilização adequadas.' },
    toxicity: { emoji: '⚠️', title: 'Toxicidade', subtitle: 'Segurança para pets e pessoas.' },
    general: { emoji: '🌿', title: 'Botânica', subtitle: 'Resposta clara e direta.' },
  };
  const responseIntent = intentMap[intent] || intentMap.general;
  const plantLabel = message.plant ? ` · ${message.plant}` : '';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-[28px] border px-5 py-5 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blush to-blush/80 text-night border-blush/70'
            : 'bg-white text-night border-blush/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white animate-assistant-appear'
        }`}
      >
        <div className="space-y-4 text-sm leading-7 break-words">
          {!isUser && (
            <div className="rounded-3xl border border-blush/20 bg-blush/5 p-3 text-xs font-semibold text-night dark:border-slate-700 dark:bg-slate-900/70 dark:text-white">
              <p>{`${responseIntent.emoji} ${responseIntent.title}${plantLabel}`}</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{responseIntent.subtitle}</p>
            </div>
          )}
          {/* Show image previews for user messages */}
          {imagePreviews.length > 0 && (
            <div className="flex w-full flex-nowrap items-start gap-3 overflow-hidden">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`imagem ${index + 1}`}
                  className={`rounded-xl object-cover border border-blush/30 ${imagePreviews.length === 1 ? 'h-52 w-full' : 'h-40 flex-1 min-w-0'}`}
                />
              ))}
            </div>
          )}

          {mainContent && (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainContent}</ReactMarkdown>
          )}

          {suggestions.length > 0 && (
            <div className="rounded-3xl border border-blush/30 bg-blush/10 p-4 text-sm text-night dark:border-slate-600 dark:bg-slate-900/70 dark:text-white">
              <p className="mb-3 font-semibold">Sugestões de perguntas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    className="rounded-full border border-blush/50 bg-white px-4 py-2 text-xs font-semibold text-night transition hover:border-blush hover:bg-blush/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    onClick={() => onSuggestionClick?.(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
