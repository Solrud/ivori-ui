import { useState } from 'react';
import { Save, Percent, X } from 'lucide-react';

interface Props {
  discount: number;
  onSave: (val: number) => Promise<void>;
}

export default function DiscountEditor({ discount, onSave }: Props) {
  const [val, setVal] = useState(discount.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setSaving(true);
      await onSave(num);
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-4">Скидка (предзаказ)</h2>
      <div className="space-y-4">
        <div className="relative">
          <input 
            type="number" 
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full pl-4 pr-16 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Размер скидки"
          />
          {val && (
            <button
              type="button"
              onClick={() => setVal('')}
              className="absolute right-9 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
              title="Очистить"
            >
              <X size={16} />
            </button>
          )}
          <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || parseInt(val, 10) === discount}
          className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={18} />
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
