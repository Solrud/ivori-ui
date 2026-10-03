import { useState } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import { SiteSettings } from '../api/mockApi';

interface Props {
  links: SiteSettings['links'];
  onSave: (links: SiteSettings['links']) => Promise<void>;
}

export default function LinksEditor({ links, onSave }: Props) {
  const [data, setData] = useState(links);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  const handleClearAll = () => {
    setData({
      vk: '',
      max: '',
      youtube: '',
      tg: ''
    });
  };

  const isChanged = JSON.stringify(data) !== JSON.stringify(links);

  const platforms = [
    { key: 'vk' as const, label: 'VKontakte', icon: 'VK' },
    { key: 'max' as const, label: 'MAX', icon: 'M' },
    { key: 'youtube' as const, label: 'YouTube', icon: 'YT' },
    { key: 'tg' as const, label: 'Telegram', icon: 'TG' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif text-gray-900 dark:text-white">Социальные сети</h2>
        <button 
          onClick={handleClearAll}
          className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <Trash2 size={16} />
          Стереть все
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map(p => (
          <div key={p.key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{p.label}</label>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-l-lg flex items-center justify-center font-bold text-gray-500 dark:text-gray-300">
                {p.icon}
              </div>
              <input 
                type="url"
                value={data[p.key]}
                onChange={(e) => setData({ ...data, [p.key]: e.target.value })}
                className="w-full pl-12 pr-10 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={`Ссылка на ${p.label}`}
              />
              {data[p.key] && (
                <button
                  type="button"
                  onClick={() => setData({ ...data, [p.key]: '' })}
                  className="absolute top-1/2 -translate-y-1/2 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all font-sans"
                  title="Очистить"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-6">
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
  );
}
