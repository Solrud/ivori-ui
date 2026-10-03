import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';
import { adminApi, Product } from '../api/mockApi';
import clsx from 'clsx';
import { compressImage } from '../utils/compressImage';

interface Props {
  products: Product[];
  onRefresh: () => Promise<void>;
}

const CATEGORIES = ['А-силуэт', 'Рыбка', 'Пышные', 'Минимализм'] as const;

export default function CatalogEditor({ products, onRefresh }: Props) {
  const [activeTab, setActiveTab] = useState<typeof CATEGORIES[number]>(CATEGORIES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>(activeTab);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => p.category === activeTab);

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setName(p.name);
      setPrice(p.price.toString());
      setOldPrice(p.oldPrice ? p.oldPrice.toString() : '');
      setImage(p.image);
      setCategory(p.category);
    } else {
      setEditingProduct(null);
      setName('');
      setPrice('');
      setOldPrice('');
      setImage('');
      setCategory(activeTab);
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        if (ev.target?.result) {
          const compressed = await compressImage(ev.target.result as string);
          setImage(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Название обязательно.');
      return;
    }
    if (!price) {
      setError('Цена обязательна.');
      return;
    }
    const numPrice = parseInt(price, 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Неверная цена.');
      return;
    }
    if (!category) {
      setError('Категория обязательна.');
      return;
    }
    if (!image) {
      setError('Выделите фотографию.');
      return;
    }

    let numOldPrice: number | undefined = undefined;
    if (oldPrice) {
      numOldPrice = parseInt(oldPrice, 10);
      if (isNaN(numOldPrice) || numOldPrice <= 0) {
        setError('Неверная старая цена.');
        return;
      }
      if (numOldPrice <= numPrice) {
        setError('Старая цена должна быть выше текущей цены.');
        return;
      }
    }
    
    setSaving(true);
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, { 
          name, 
          price: numPrice, 
          oldPrice: numOldPrice !== undefined ? numOldPrice : undefined, 
          image, 
          category 
        });
      } else {
        await adminApi.addProduct({ 
          name, 
          price: numPrice, 
          oldPrice: numOldPrice !== undefined ? numOldPrice : undefined, 
          image, 
          category, 
          order: 0, 
          inQueue: false, 
          queueOrder: -1 
        });
      }
      await onRefresh();
      closeModal();
    } catch(e) {
      console.error(e);
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await adminApi.deleteProduct(productToDelete);
      setProductToDelete(null);
      await onRefresh();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-gray-900 dark:text-white">Каталог платьев</h2>
        <button 
          onClick={() => openModal()}
          className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={clsx(
              "px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2",
              activeTab === cat 
                ? "border-rose-500 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20" 
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(p => (
          <div key={p.id} className="group relative bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600">
            <div className="aspect-[3/4] relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => openModal(p)}
                  className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-serif text-sm truncate text-gray-900 dark:text-white">{p.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 text-xs font-semibold">{p.price.toLocaleString('ru-RU')} ₽</span>
                {p.oldPrice && (
                  <span className="text-gray-400 text-xs line-through">{p.oldPrice.toLocaleString('ru-RU')} ₽</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            Нет товаров в этой категории
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-serif text-lg text-gray-900 dark:text-white">
                {editingProduct ? 'Редактировать платье' : 'Добавить платье'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div 
                className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-rose-400 dark:hover:border-rose-500 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {image ? (
                  <img src={image} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <span>Выберите фото</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFileChange} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Название</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => setName('')}
                      className="absolute top-1/2 -translate-y-1/2 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                      title="Очистить"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Цена (₽)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {price && (
                      <button
                        type="button"
                        onClick={() => setPrice('')}
                        className="absolute top-1/2 -translate-y-1/2 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                        title="Очистить"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Старая цена (₽)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={oldPrice}
                      onChange={(e) => setOldPrice(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Опционально"
                    />
                    {oldPrice && (
                      <button
                        type="button"
                        onClick={() => setOldPrice('')}
                        className="absolute top-1/2 -translate-y-1/2 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                        title="Очистить"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Категория</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-2">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={16} /> Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden animate-in zoom-in-95 duration-200 text-center">
            <h3 className="font-serif text-lg text-gray-900 dark:text-white mb-2">Удалить товар?</h3>
            <p className="text-sm text-gray-500 mb-6">Вы действительно хотите безвозвратно удалить этот товар из каталога?</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
