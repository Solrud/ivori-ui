import React, { useState, useMemo } from 'react';
import { adminApi, Product } from '../api/mockApi';
import { Plus, GripVertical, Save, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  products: Product[];
  onSave: (ids: string[]) => Promise<void>;
}

function SortableItem({ 
  id, 
  product, 
  onRemove, 
  onMoveUp, 
  onMoveDown 
}: { 
  key?: string | number;
  id: string; 
  product: Product; 
  onRemove: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-600">
      <button {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing p-1 shrink-0">
        <GripVertical size={20} />
      </button>
      <img src={product.image} className="w-12 h-12 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-sm text-gray-900 dark:text-white truncate">{product.name}</h4>
        <p className="text-xs text-gray-500 truncate">{product.category}</p>
      </div>
      
      {/* Mobile-friendly Arrow Controls */}
      <div className="flex items-center gap-0.5 sm:gap-1 pl-1 pr-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/60 dark:border-gray-600 shrink-0">
        <button 
          onClick={onMoveUp}
          disabled={!onMoveUp}
          className="text-gray-500 dark:text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1 sm:p-1.5 rounded disabled:opacity-20 transition-colors"
          title="Вверх"
        >
          <ChevronUp size={16} />
        </button>
        <button 
          onClick={onMoveDown}
          disabled={!onMoveDown}
          className="text-gray-500 dark:text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1 sm:p-1.5 rounded disabled:opacity-20 transition-colors"
          title="Вниз"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <button 
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 p-2 transition-colors shrink-0"
        title="Убрать"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default function NoveltiesEditor({ products, onSave }: Props) {
  const initialQueue = useMemo(() => {
    return [...products].filter(p => p.inQueue).sort((a, b) => a.queueOrder - b.queueOrder).map(p => p.id);
  }, [products]);

  const [queueIds, setQueueIds] = useState<string[]>(initialQueue);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = queueIds.indexOf(active.id as string);
      const newIndex = queueIds.indexOf(over.id as string);
      setQueueIds(arrayMove(queueIds, oldIndex, newIndex));
    }
  };

  const handleMoveUp = (id: string) => {
    const idx = queueIds.indexOf(id);
    if (idx > 0) {
      const nextQueue = [...queueIds];
      const temp = nextQueue[idx];
      nextQueue[idx] = nextQueue[idx - 1];
      nextQueue[idx - 1] = temp;
      setQueueIds(nextQueue);
    }
  };

  const handleMoveDown = (id: string) => {
    const idx = queueIds.indexOf(id);
    if (idx !== -1 && idx < queueIds.length - 1) {
      const nextQueue = [...queueIds];
      const temp = nextQueue[idx];
      nextQueue[idx] = nextQueue[idx + 1];
      nextQueue[idx + 1] = temp;
      setQueueIds(nextQueue);
    }
  };

  const handleRemoveClick = (id: string) => {
    setItemToRemove(id);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      setQueueIds(prev => prev.filter(x => x !== itemToRemove));
      setItemToRemove(null);
    }
  };

  const handleAdd = (id: string) => {
    setQueueIds(prev => [...prev, id]);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(queueIds);
    setSaving(false);
  };

  const isChanged = JSON.stringify(queueIds) !== JSON.stringify(initialQueue);
  const availableToAdd = products.filter(p => !queueIds.includes(p.id));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-gray-900 dark:text-white">Новинки и популярное</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>

      {queueIds.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Очередь пуста</div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={queueIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-6">
              {queueIds.map((id, index) => {
                const product = products.find(p => p.id === id);
                if (!product) return null;
                return (
                  <SortableItem 
                    key={id} 
                    id={id} 
                    product={product} 
                    onRemove={handleRemoveClick} 
                    onMoveUp={index > 0 ? () => handleMoveUp(id) : undefined}
                    onMoveDown={index < queueIds.length - 1 ? () => handleMoveDown(id) : undefined}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
        <button 
          onClick={handleSave}
          disabled={saving || !isChanged}
          className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={18} />
          {saving ? 'Сохранение...' : 'Сохранить очередь'}
        </button>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-serif text-lg text-gray-900 dark:text-white">Добавить товар в очередь</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900"><X size={20} /></button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {availableToAdd.length === 0 && (
                <div className="text-center py-8 text-gray-500">Нет доступных товаров для добавления</div>
              )}
              {availableToAdd.map(p => (
                <button 
                  key={p.id}
                  onClick={() => handleAdd(p.id)}
                  className="w-full flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-600 transition-colors text-left"
                >
                  <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-gray-900 dark:text-white truncate">{p.name}</h4>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  <Plus size={18} className="text-rose-500 mr-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {itemToRemove && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden animate-in zoom-in-95 duration-200 text-center">
            <h3 className="font-serif text-lg text-gray-900 dark:text-white mb-2">Убрать из очереди?</h3>
            <p className="text-sm text-gray-500 mb-6">Вы действительно хотите убрать выбранный товар из очереди новинок?</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setItemToRemove(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={confirmRemove}
                className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors animate-in fade-in"
              >
                Убрать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
