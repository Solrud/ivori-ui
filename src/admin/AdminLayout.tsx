import { Outlet, Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { LogOut, Moon, Sun, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <span className="font-serif text-xl font-medium text-gray-900 dark:text-white">Admin Panel</span>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 hover:border-rose-200 dark:hover:border-rose-800/50 rounded-lg transition-all"
                title="Вернуться на главную страницу"
              >
                <ArrowLeft size={14} />
                <span>На сайт</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
