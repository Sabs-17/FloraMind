import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome para continuar.');
      return;
    }
    login(name.trim());
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 dark:bg-night">
      <div className="w-full max-w-md rounded-[32px] border border-blush bg-white/90 p-10 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-twilight/90">
        <h1 className="mb-3 text-3xl font-bold text-night dark:text-white">Bem-vinda/o ao FloraMind</h1>
        <p className="mb-8 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Um chatbot fofo para cuidar das suas plantas com carinho. Informe seu nome para começar.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Seu nome</label>
          <input
            className="rounded-3xl border border-blush/30 bg-white px-4 py-3 text-sm text-night outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blush dark:focus:ring-blush/30"
            placeholder="Ex: Mariana"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="rounded-3xl bg-gradient-to-r from-blush to-blush/80 px-4 py-3 text-sm font-semibold text-night transition hover:from-blush hover:to-blush dark:bg-gradient-to-r dark:from-blush/70 dark:to-blush/50 dark:text-white dark:hover:from-blush dark:hover:to-blush/70"
          >
            Entrar no jardim
          </button>
        </form>
      </div>
    </div>
  );
}
