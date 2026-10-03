import React, { useState, useRef } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../utils/compressImage';

interface Props {
  photo: string;
  onSave: (url: string) => Promise<void>;
}

export default function MainPhotoEditor({ photo, onSave }: Props) {
  const [current, setCurrent] = useState(photo);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload by converting to Data URL
      const reader = new FileReader();
      reader.onload = async (ev) => {
        if (ev.target?.result) {
          // Для главной фотографии на первом экране сжимаем только на 20% (качество 80% / 0.8 и разрешение до 1920px)
          const compressed = await compressImage(ev.target.result as string, 1920, 1920, 0.8);
          setCurrent(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(current);
    setSaving(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-4">Главная фотография</h2>
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="relative w-full sm:w-48 aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shrink-0">
          {current ? (
            <img src={current} alt="Main" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <ImageIcon className="text-gray-400" size={32} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4 w-full">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileRef}
            onChange={handleFileChange}
          />
          <button 
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
          >
            Изменить фото
          </button>
          <button 
            type="button"
            onClick={handleSave}
            disabled={saving || current === photo}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={18} />
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
