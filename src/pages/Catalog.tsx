import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';

export default function Catalog() {
  const navigate = useNavigate();
  const { products, settings, loading } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  // Choose sort state (supporting 'new', 'sale', 'price' query params)
  const [sort, setSort] = useState<'default' | 'new' | 'price' | 'sale'>(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam === 'sale') return 'sale';
    if (sortParam === 'new') return 'new';
    if (sortParam === 'price') return 'price';
    return 'default';
  });

  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam === 'sale') {
      setSort('sale');
    } else if (sortParam === 'new') {
      setSort('new');
    } else if (sortParam === 'price') {
      setSort('price');
    } else if (!sortParam) {
      setSort('default');
    }
  }, [searchParams]);

  const { toggleFavorite, isFavorite } = useFavorites();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const CATEGORIES = useMemo(() => {
    const baseCategories = ['А-силуэт', 'Рыбка', 'Пышные', 'Минимализм'];
    const customCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    const allUnique = Array.from(new Set([...baseCategories, ...customCategories]));
    return ['Все', ...allUnique];
  }, [products]);

  // Check if there are any products on sale/with discounts inside our current products catalog
  const hasSaleDresses = useMemo(() => {
    return products.some(dress => (dress.oldPrice && dress.oldPrice > dress.price) || dress.badge === 'Скидка');
  }, [products]);

  const filteredAndSortedDresses = useMemo(() => {
    let result = [...products];
    
    if (category && category !== 'Все') {
      result = result.filter(dress => dress.category === category);
    }

    if (sort === 'sale') {
      // Filter out products that have discount prices
      result = result.filter(dress => (dress.oldPrice && dress.oldPrice > dress.price) || dress.badge === 'Скидка');
    } else if (sort === 'new') {
      // Sort by newest addition (by id or dateAdded if available)
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } else if (sort === 'price') {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort((a, b) => a.order - b.order);
    }

    return result;
  }, [products, category, sort]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const discountPercent = settings?.discount ?? 10;

  return (
    <div className="relative min-h-screen text-gray-900 bg-white">
      <Header />
      
      <main className="pt-20 md:pt-24 px-6 md:px-16 max-w-7xl mx-auto min-h-screen pb-24">
        {/* Navigation Breadcrumb Link */}
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 md:mb-6 transition-colors font-sans text-sm tracking-wide cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft size={16} />
          <span>На главную</span>
        </button>
        
        {/* Header Title with Dynamic Promo Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-light text-gray-900"
          >
            Каталог платьев
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4 bg-rose-50/60 backdrop-blur-sm border border-rose-100/80 rounded-2xl p-4 md:p-5 max-w-md w-full shadow-sm"
          >
            <div className="flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white font-serif font-semibold text-sm md:text-base shadow-sm">
              -{discountPercent}%
            </div>
            <div className="text-left">
              <h4 className="font-sans font-semibold text-xs md:text-sm text-gray-900 uppercase tracking-widest mb-1">Скидка по предзаказу</h4>
              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                Получите <span className="font-medium text-rose-600">скидку {discountPercent}%</span> на пошив платья при предварительном оформлении заказа.
              </p>
              <p className="font-sans text-xs text-gray-500 mt-1">
                Условия узнавайте в салоне.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6 md:mx-0 md:px-0">
          {CATEGORIES.map(cat => {
            const isActive = category === cat || (!category && cat === 'Все');
            return (
              <button
                key={cat}
                onClick={() => {
                  if (cat === 'Все') {
                    searchParams.delete('category');
                    setSearchParams(searchParams);
                  } else {
                    setSearchParams({ category: cat });
                  }
                }}
                className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full font-sans text-xs md:text-sm tracking-widest uppercase transition-all duration-300 border whitespace-nowrap ${
                  isActive 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md cursor-pointer' 
                    : 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Sorting Controls */}
        <div className="flex items-center gap-4 md:gap-6 mb-12 border-b border-gray-200 / src/pages/Catalog.tsx pb-4 overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <span className="font-sans text-[10px] md:text-xs text-gray-500 uppercase tracking-widest whitespace-nowrap">Сортировка:</span>
          <div className="flex gap-4 md:gap-6">
            <button 
              onClick={() => {
                setSort('default');
                searchParams.delete('sort');
                setSearchParams(searchParams);
              }}
              className={`font-sans text-xs md:text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap cursor-pointer ${sort === 'default' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              По умолчанию
              {sort === 'default' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-[17px] left-0 right-0 h-[1.5px] bg-rose-500" />
              )}
            </button>
            <button 
              onClick={() => {
                setSort('new');
                searchParams.set('sort', 'new');
                setSearchParams(searchParams);
              }}
              className={`font-sans text-xs md:text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap cursor-pointer ${sort === 'new' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              По новизне
              {sort === 'new' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-[17px] left-0 right-0 h-[1.5px] bg-rose-500" />
              )}
            </button>
            <button 
              onClick={() => {
                setSort('price');
                searchParams.set('sort', 'price');
                setSearchParams(searchParams);
              }}
              className={`font-sans text-xs md:text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap cursor-pointer ${sort === 'price' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              По цене
              {sort === 'price' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-[17px] left-0 right-0 h-[1.5px] bg-rose-500" />
              )}
            </button>

            {/* Render "По акции" button ONLY if sale items actually exist in catalog */}
            {hasSaleDresses && (
              <button 
                onClick={() => {
                  setSort('sale');
                  searchParams.set('sort', 'sale');
                  setSearchParams(searchParams);
                }}
                className={`font-sans text-xs md:text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap cursor-pointer ${sort === 'sale' ? 'text-rose-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
              >
                По акции %
                {sort === 'sale' && (
                  <motion.div layoutId="sort-indicator" className="absolute -bottom-[17px] left-0 right-0 h-[1.5px] bg-rose-500" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Catalog Items Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-rose-500 w-8 h-8" />
            <p className="font-sans text-gray-500 text-sm">Синхронизация каталога...</p>
          </div>
        ) : filteredAndSortedDresses.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-gray-600 text-lg">В данной категории пока нет платьев.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 mb-32">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedDresses.map((dress, index) => (
                <motion.div 
                  key={dress.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => navigate(`/catalog/${dress.id}`)}
                  className="relative group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-transparent shadow-sm">
                    {dress.image && (
                      <img
                        src={dress.image}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, [dress.id]: true }))}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                          loadedImages[dress.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    {/* Badges */}
                    {dress.badge && (
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2">
                        <span className="bg-white/95 backdrop-blur-md text-gray-900 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs font-semibold uppercase tracking-wider border border-gray-200">
                          {dress.badge}
                        </span>
                      </div>
                    )}

                    {/* Favorite Button Toggle */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Parse id as primitive or handle standard conversion
                        toggleFavorite(parseInt(dress.id));
                      }}
                      className={`absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 backdrop-blur-md rounded-full transition-colors border z-10 ${
                        isFavorite(parseInt(dress.id)) 
                          ? 'bg-white/90 text-rose-600 border-gray-200' 
                          : 'bg-white/50 text-gray-500 hover:text-rose-600 hover:bg-white/90 border-gray-200'
                      }`}
                    >
                      <Heart size={16} className="md:w-[18px] md:h-[18px]" fill={isFavorite(parseInt(dress.id)) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Text Description Block */}
                  <div className="mt-3 md:mt-6 flex flex-col justify-between items-start gap-1">
                    <div className="min-w-0 flex-1 w-full">
                      <h3 className="font-serif text-base md:text-2xl text-gray-900 truncate group-hover:text-rose-600 transition-colors">{dress.name}</h3>
                      <p className="font-sans text-[10px] md:text-sm text-gray-400 mt-0.5 md:mt-1">{dress.category}</p>
                      <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                        <span className="font-sans text-sm md:text-lg text-rose-600 font-semibold whitespace-nowrap">{formatPrice(dress.price)}</span>
                        {dress.oldPrice && (
                          <span className="font-sans text-[10px] md:text-sm text-gray-400 line-through whitespace-nowrap">{formatPrice(dress.oldPrice)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
