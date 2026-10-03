import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { SiteSettings } from '../api/mockApi';

interface Props {
  contacts: SiteSettings['contacts'];
  onSave: (contacts: SiteSettings['contacts']) => Promise<void>;
}

export default function ContactsEditor({ contacts, onSave }: Props) {
  const [data, setData] = useState(contacts);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});

  const validate = () => {
    let isValid = true;
    const newErrors: typeof errors = {};

    // Basic ru phone (+7 and 10 digits approx)
    if (!/^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(data.phone)) {
      newErrors.phone = 'Неверный формат (+7XXX...)';
      isValid = false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Неверный формат email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  const isChanged = JSON.stringify(data) !== JSON.stringify(contacts);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-4">Контакты</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Описание</label>
          <div className="relative">
            <textarea 
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none h-24"
            />
            {data.description && (
              <button
                type="button"
                onClick={() => setData({ ...data, description: '' })}
                className="absolute top-2.5 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                title="Очистить"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Телефон</label>
            <div className="relative">
              <input 
                type="tel" 
                value={data.phone}
                onChange={(e) => {
                  setData({ ...data, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="+7 (999) 123-45-67"
              />
              {data.phone && (
                <button
                  type="button"
                  onClick={() => {
                    setData({ ...data, phone: '' });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                  title="Очистить"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={data.email}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {data.email && (
                <button
                  type="button"
                  onClick={() => {
                    setData({ ...data, email: '' });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                  title="Очистить"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        
        <div className="pt-2">
          <button 
            onClick={handleSave}
            disabled={saving || !isChanged}
            className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ml-auto"
          >
            <Save size={18} />
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </div>
  );
}
