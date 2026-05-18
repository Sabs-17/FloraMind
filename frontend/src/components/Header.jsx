import { LogOut, Sparkles, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex flex-col gap-4 rounded-[32px] border border-blush bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-twilight/90">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blush dark:text-blush/80">FloraMind</p>
          <h1 className="text-3xl font-semibold text-night dark:text-white">Seu assistente de plantas</h1>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center justify-center rounded-full border border-blush bg-blush/20 p-3 text-night transition hover:bg-blush/30 dark:border-blush/50 dark:bg-blush/10 dark:text-white dark:hover:bg-blush/20"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-mint/20 to-blush/20 p-4 text-sm text-night dark:from-mint/10 dark:to-blush/10 dark:text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-blush" />
          <span>Olá, {user?.name || 'amiga/o das plantas'}! Pergunte algo sobre seus cuidados.</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-2xl bg-blush/80 px-4 py-2 text-sm font-semibold text-night shadow-sm transition hover:bg-blush dark:bg-blush/20 dark:text-white dark:hover:bg-blush/30"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </header>
  );
}
