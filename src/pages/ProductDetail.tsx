import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Star, ShieldCheck, Scissors, RefreshCw, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useSettings();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [recLoaded, setRecLoaded] = useState<Record<string, boolean>>({});

  // Scroll to top on load or ID change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const dress = useMemo(() => {
    return products.find(p => p.id === id);
  }, [products, id]);

  const recommendedDresses = useMemo(() => {
    if (!dress) return [];
    return products
      .filter(p => p.category === dress.category && p.id !== dress.id)
      .slice(0, 3);
  }, [products, dress]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  if (loading) {
    return (
      <div className="relative min-h-screen text-gray-900 bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-sans text-gray-500 text-sm">Загрузка платья мечты...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!dress) {
    return (
      <div className="relative min-h-screen text-gray-900 bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center h-screen px-6 text-center gap-6">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-gray-900">Платье не найдено</h2>
          <p className="font-sans text-gray-600 max-w-sm">Извините, запрашиваемое платье временно отсутствует в каталоге или было перемещено.</p>
          <Link to="/catalog" className="px-6 py-3 bg-gray-900 text-white rounded-full font-sans text-sm tracking-widest uppercase hover:bg-rose-600 transition-colors">
            Вернуться в каталог
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-gray-900 bg-white">
      <Header />

      <main className="pt-20 md:pt-24 px-6 md:px-16 max-w-7xl mx-auto pb-24">
        {/* Navigation Breadcrumbs & Back Option */}
        <div className="flex items-center justify-between gap-4 mb-4 md:mb-6">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-sans text-sm tracking-wide">
            <ArrowLeft size={16} />
            <span>Назад в каталог</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-sans tracking-wide">
            <Link to="/" className="hover:text-gray-600 transition-colors">Главная</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-gray-600 transition-colors">Каталог</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{dress.name}</span>
          </div>
        </div>

        {/* Product Inner Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Massive Gorgeous Image */}
          <div className="lg:col-span-6 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-gray-100 bg-transparent shadow-sm group"
            >
              {dress.image && (
                <img
                  src={dress.image}
                  onLoad={() => setMainLoaded(true)}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                    mainLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  referrerPolicy="no-referrer"
                />
              )}
              
              {/* Luxury Badge overlay */}
              {dress.badge && (
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-gray-200">
                    {dress.badge}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Premium Details & Call-To-Action form context */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="font-sans text-xs text-gray-500 tracking-widest uppercase mb-2 block">
                {dress.category} · Премиум Свадебный Стиль
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight mb-4">
                {dress.name}
              </h1>

              {/* Price Container */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-serif text-3xl md:text-4xl text-rose-600 font-light">
                  {formatPrice(dress.price)}
                </span>
                {dress.oldPrice && (
                  <span className="font-sans text-lg text-gray-400 line-through">
                    {formatPrice(dress.oldPrice)}
                  </span>
                )}
                {dress.oldPrice && (
                  <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-0.5 rounded-full font-sans text-xs font-semibold">
                    Со скидкой
                  </span>
                )}
              </div>

              {/* Interactive Boutique Description */}
              <p className="font-sans text-gray-600 text-base leading-relaxed mb-8 border-l-2 border-rose-200 pl-4">
                Изысканное свадебное платье коллекции «Айвори». Утонченный крой подчеркивает фигуру, а премиальные ткани обеспечивают неверояную легкость движений на протяжении всего торжественного дня. Доступна индивидуальная примерка и подгонка в нашем роскошном салоне.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={() => {
                    // setIsBookingOpen(true);
                    window.open('https://mst.link/primerka59', '_blank');
                  }}
                  className="flex-1 bg-rose-500 text-white font-sans text-sm font-semibold tracking-wider uppercase py-4 rounded-full hover:bg-rose-600 active:scale-95 transition-all shadow-md shadow-rose-200 text-center flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  <span>Записаться на примерку</span>
                </button>
                <button 
                  onClick={() => toggleFavorite(parseInt(dress.id))}
                  className={`px-6 py-4 rounded-full transition-all border flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-sans font-medium ${
                    isFavorite(parseInt(dress.id))
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:text-rose-600 hover:bg-rose-50/50'
                  }`}
                >
                  <Heart size={18} fill={isFavorite(parseInt(dress.id)) ? "currentColor" : "none"} />
                  <span>{isFavorite(parseInt(dress.id)) ? 'В избранном' : 'В избранное'}</span>
                </button>
              </div>

              {/* Salon Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-500 shrink-0">
                    <Scissors size={18} />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-gray-900">Подгонка силуэта</h5>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">Подгон по вашей фигуре нашими портными. Услуга платная.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-500 shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-gray-900">Гарантия качества</h5>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">Только оригинальные сертифицированные российские бренды.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-500 shrink-0">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-gray-900">Изменения по запросу</h5>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">Возможность добавить рукава, изменить вырез или шлейф. Услуга платная.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-500 shrink-0">
                    <Star size={18} fill="currentColor" className="text-amber-400" />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-gray-900">Примерка в Перми</h5>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">Личная VIP примерочная комната для вас и ваших гостей. Услуга бесплатная.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section: Recommended Similar Items (You May Also Like) */}
        {recommendedDresses.length > 0 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-light text-center mb-12">
              Вам также может понравиться
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {recommendedDresses.map((item, index) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/catalog/${item.id}`)}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-transparent shadow-sm">
                    {item.image && (
                      <img
                        src={item.image}
                        onLoad={() => setRecLoaded(prev => ({ ...prev, [item.id]: true }))}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                          recLoaded[item.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {item.badge && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold border border-gray-100">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-lg text-gray-900 mt-4 leading-normal group-hover:text-rose-600 transition-colors">{item.name}</h4>
                  <p className="font-sans text-xs text-gray-500 mt-0.5">{item.category}</p>
                  <span className="font-sans text-sm text-rose-600 mt-1">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
