import React, { useState, useRef, useEffect } from 'react';
import { Save, Image as ImageIcon, Video as VideoIcon, Plus, Trash2 } from 'lucide-react';
import { SiteSettings } from '../api/mockApi';
import { compressImage } from '../utils/compressImage';

interface Props {
  media: SiteSettings['salonMedia'];
  onSave: (media: SiteSettings['salonMedia']) => Promise<void>;
}

const DEFAULT_SALON_CATEGORIES = [
  'Наш уютный зал',
  'Зона примерки',
  'Интерьер',
  'Аксессуары',
  'Наши коллекции'
];

export default function SalonPhotosEditor({ media, onSave }: Props) {
  const [data, setData] = useState<SiteSettings['salonMedia']>(media || {});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    setData(media || {});
  }, [media]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  const isChanged = JSON.stringify(data) !== JSON.stringify(media || {});

  const allCategories = Array.from(new Set([...DEFAULT_SALON_CATEGORIES, ...Object.keys(data)]));

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

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-4">Атмосфера: Загляните к нам в гости (медиа)</h2>
      
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
                    <span className="text-xs font-medium">Загрузить</span>
                  </button>
                )}
              </div>
              <h3 className="font-sans text-xs text-center text-gray-600 dark:text-gray-400 font-medium truncate" title={cat}>{cat}</h3>
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
    </div>
  );
}
