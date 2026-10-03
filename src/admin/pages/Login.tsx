import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await login('admin@ivory.ru', password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Неверный пароль от сервера API');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-2 text-center">Ivory Admin</h1>
        <p className="text-xs text-gray-500 text-center mb-6">Авторизация в панели управления</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder="Введите пароль"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rose-500 text-white py-2.5 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
          >
            {loading ? 'Обработка...' : 'Войти в панель'}
          </button>
        </form>
      </div>
    </div>
  );
}
