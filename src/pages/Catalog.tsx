import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedText from '../components/AnimatedText';
import { ALL_DRESSES } from '../data/dresses';
import { useFavorites } from '../context/FavoritesContext';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [sort, setSort] = useState<'default' | 'new' | 'price'>('default');
  const { toggleFavorite, isFavorite } = useFavorites();

  const CATEGORIES = ['Все', 'А-силуэт', 'Рыбка', 'Пышные', 'Минимализм'];

  const filteredAndSortedDresses = useMemo(() => {
    let result = [...ALL_DRESSES];
    
    if (category && category !== 'Все') {
      result = result.filter(dress => dress.category === category);
    }

    if (sort === 'new') {
      result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (sort === 'price') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [category, sort]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  return (
    <div className="relative min-h-screen text-gray-900">
      <Header />
      
      <main className="pt-40 px-6 md:px-16 max-w-7xl mx-auto min-h-screen">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors font-sans text-sm tracking-wide">
          <ArrowLeft size={16} />
          <span>На главную</span>
        </Link>
        
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
              -10%
            </div>
            <div className="text-left">
              <h4 className="font-sans font-semibold text-xs md:text-sm text-gray-900 uppercase tracking-widest mb-1">Скидка по предзаказу</h4>
              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                Получите <span className="font-medium text-rose-600">скидку 10%</span> на пошив платья при предварительном оформлении заказа.
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
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                    : 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sorting (Secondary) */}
        <div className="flex items-center gap-4 md:gap-6 mb-12 border-b border-gray-200 pb-4 overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <span className="font-sans text-[10px] md:text-xs text-gray-500 uppercase tracking-widest whitespace-nowrap">Сортировка:</span>
          <div className="flex gap-4 md:gap-6">
            <button 
              onClick={() => setSort('default')}
              className={`font-sans text-xs md:text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap ${sort === 'default' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              По умолчанию
              {sort === 'default' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-[17px] left-0 right-0 h-[1px] bg-rose-500" />
              )}
            </button>
            <button 
              onClick={() => setSort('new')}
              className={`font-sans text-xs md:text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap ${sort === 'new' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              По новизне
              {sort === 'new' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-[17px] left-0 right-0 h-[1px] bg-rose-500" />
              )}
            </button>
            <button 
              onClick={() => setSort('price')}
              className={`font-sans text-xs md:text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap ${sort === 'price' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              По цене
              {sort === 'price' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-[17px] left-0 right-0 h-[1px] bg-rose-500" />
              )}
            </button>
          </div>
        </div>

        {filteredAndSortedDresses.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-gray-600 text-lg">В данной категории пока нет платьев.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 mb-32">
            {filteredAndSortedDresses.map((dress, index) => (
              <motion.div 
                key={dress.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-gray-50">
                  <img
                    src={dress.image}
                    alt={dress.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges */}
                  {dress.badge && (
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2">
                      <span className="bg-white/80 backdrop-blur-md text-gray-900 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs font-medium uppercase tracking-wider border border-gray-200">
                        {dress.badge}
                      </span>
                    </div>
                  )}

                  {/* Favorite */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(dress.id);
                    }}
                    className={`absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 backdrop-blur-md rounded-full transition-colors border z-10 ${
                      isFavorite(dress.id) 
                        ? 'bg-white/90 text-rose-600 border-gray-200' 
                        : 'bg-white/50 text-gray-500 hover:text-rose-600 hover:bg-white/90 border-gray-200'
                    }`}
                  >
                    <Heart size={16} className="md:w-[18px] md:h-[18px]" fill={isFavorite(dress.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="mt-3 md:mt-6 flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-base md:text-2xl text-gray-900 truncate">{dress.name}</h3>
                    <p className="font-sans text-[10px] md:text-sm text-gray-600 mt-0.5 md:mt-1">{dress.category}</p>
                    <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                      <span className="font-sans text-sm md:text-lg text-rose-600 whitespace-nowrap">{formatPrice(dress.price)}</span>
                      {dress.oldPrice && (
                        <span className="font-sans text-[10px] md:text-sm text-gray-500 line-through whitespace-nowrap">{formatPrice(dress.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
