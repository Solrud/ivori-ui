import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFavorites } from '../context/FavoritesContext';
import { ALL_DRESSES } from '../data/dresses';

export default function Favorites() {
  const { favoriteIds, toggleFavorite, clearFavorites } = useFavorites();
  
  const favoriteDresses = ALL_DRESSES.filter(dress => favoriteIds.includes(dress.id));

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
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl font-light text-gray-900"
          >
            Избранное
          </motion.h1>
          
          {favoriteDresses.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearFavorites}
              className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors font-sans text-sm tracking-widest uppercase pb-2"
            >
              <Trash2 size={16} />
              <span>Очистить</span>
            </motion.button>
          )}
        </div>

        {favoriteDresses.length === 0 ? (
          <div className="text-center py-32">
            <Heart size={48} className="mx-auto text-gray-200 mb-6" />
            <h2 className="font-serif text-3xl mb-4 text-gray-900">Список пуст</h2>
            <p className="font-sans text-gray-600 text-lg mb-8">Вы еще не добавили ни одного платья в избранное.</p>
            <Link 
              to="/catalog" 
              className="inline-flex items-center justify-center bg-rose-500 text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-rose-600 transition-all shadow-sm"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {favoriteDresses.map((dress, index) => (
              <motion.div 
                key={dress.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50">
                  <img
                    src={dress.image}
                    alt={dress.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges */}
                  {dress.badge && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-white/80 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-gray-200">
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
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-rose-600 hover:bg-white transition-colors border border-gray-200 z-10 shadow-sm"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>

                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-2xl text-gray-900">{dress.name}</h3>
                    <p className="font-sans text-sm text-gray-600 mt-1">{dress.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-sans text-lg text-rose-600">{formatPrice(dress.price)}</span>
                      {dress.oldPrice && (
                        <span className="font-sans text-sm text-gray-500 line-through">{formatPrice(dress.oldPrice)}</span>
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
