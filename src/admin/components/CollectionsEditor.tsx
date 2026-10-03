import React, { useState, useRef, useEffect } from 'react';
import { Save, Image as ImageIcon, Video as VideoIcon, Plus, Trash2 } from 'lucide-react';
import { SiteSettings } from '../api/mockApi';
import { compressImage } from '../utils/compressImage';

interface Props {
  media: SiteSettings['collectionsMedia'];
  onSave: (media: SiteSettings['collectionsMedia']) => Promise<void>;
}

const DEFAULT_CATEGORIES = ['А-силуэт', 'Рыбка', 'По акции', 'Пышные', 'Минимализм'];

export default function CollectionsEditor({ media, onSave }: Props) {
  const [data, setData] = useState<SiteSettings['collectionsMedia']>(media || {});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setData(media || {});
  }, [media]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  const isChanged = JSON.stringify(data) !== JSON.stringify(media || {});

  // Combine default categories with any existing keys in data
  const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...Object.keys(data)]));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingKey) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 60) {
            alert('Видео должно быть не более 1 минуты');
            return;
          }
          saveFile(file, type);
        };
        video.src = URL.createObjectURL(file);
      } else {
        saveFile(file, type);
      }
    }
  };

  const saveFile = (file: File, type: 'video' | 'image') => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (ev.target?.result && editingKey) {
        let resultUrl = ev.target.result as string;
        if (type === 'image') {
          resultUrl = await compressImage(resultUrl);
        }
        setData(prev => ({
          ...prev,
          [editingKey]: { type, url: resultUrl }
        }));
      }
      setEditingKey(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = (cat: string) => {
    const updated = { ...data };
    delete updated[cat];
    setData(updated);
  };

  const handleAddCustomCategory = () => {
    if (!newCatName.trim()) return;
    setEditingKey(newCatName.trim());
    setNewCatName('');
    setShowAddModal(false);
    fileRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif text-gray-900 dark:text-white">Коллекции (медиа)</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-medium py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors text-xs"
        >
          <Plus size={14} /> Добавить категорию
        </button>
      </div>

      <input 
        type="file" 
        accept="image/*,video/*" 
        className="hidden" 
        ref={fileRef}
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {allCategories.map(cat => {
          const item = data[cat];
          const hasMedia = item && item.url;

          return (
            <div key={cat} className="flex flex-col gap-2">
              <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden group border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                {hasMedia ? (
                  <>
                    {item.type === 'image' ? (
                      <img src={item.url} alt={cat} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingKey(cat);
                          fileRef.current?.click();
                        }}
                        className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(cat)}
                        className="bg-red-500 text-white p-1.5 rounded-lg text-xs hover:bg-red-600 transition-colors"
                        title="Удалить медиа"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur p-1.5 rounded-md text-white">
                      {item.type === 'video' ? <VideoIcon size={14} /> : <ImageIcon size={14} />}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingKey(cat);
                      fileRef.current?.click();
                    }}
                    className="w-full h-full flex flex-col items-center justify-center p-4 text-gray-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-gray-600/50 transition-all gap-2 text-center"
                  >
                    <Plus size={24} />
                    <span className="text-xs font-medium">Загрузить медиа</span>
                  </button>
                )}
              </div>
              <h3 className="font-serif text-center text-sm font-medium text-gray-900 dark:text-white truncate" title={cat}>{cat}</h3>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving || !isChanged}
          className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={18} />
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-serif text-lg text-gray-900 dark:text-white mb-4">Добавить новую коллекцию</h3>
            <input
              type="text"
              placeholder="Название коллекции..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={handleAddCustomCategory}
                disabled={!newCatName.trim()}
                className="px-4 py-2 text-xs font-medium bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-lg"
              >
                Выбрать медиа
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
