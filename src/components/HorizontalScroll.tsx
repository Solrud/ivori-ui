import { useRef, useState, useMemo, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import AnimatedText from './AnimatedText';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';

export default function HorizontalScroll() {
  const navigate = useNavigate();
  const { products } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeCardId, setActiveCardId] = useState<string | 'see-more' | null>(null);
  const hasDragged = useRef(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Load the "Новинки & Популярное" items as configured in the Admin queue
  const DRESSES = useMemo(() => {
    return products
      .filter(p => p.inQueue)
      .sort((a, b) => a.queueOrder - b.queueOrder);
  }, [products]);

  // Always reset scroll to the very start (left) on initial mount and when items update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [DRESSES.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const handleMouseDown = (e: ReactMouseEvent, id: string | 'see-more') => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    hasDragged.current = false;
    setActiveCardId(id);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setActiveCardId(null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveCardId(null);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCardClick = (id: string) => {
    if (!hasDragged.current) {
      navigate(`/catalog/${id}`);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="new" className="relative z-20 py-24 md:py-32 bg-transparent">
      <div className="px-6 md:px-16 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/catalog?sort=new" className="group inline-flex items-center gap-3">
            <h2 className="font-serif text-4xl md:text-5xl text-gray-900 font-light group-hover:text-rose-600 transition-colors">
              Новинки & Популярное
            </h2>
            <ArrowRight size={28} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-rose-500 hidden sm:inline-block" />
          </Link>
          <p className="font-sans text-gray-600 mt-4 max-w-md">
            Откройте для себя платья, которые выбирают наши невесты.
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-4 hidden sm:flex"
        >
          <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
            <ChevronRight size={24} />
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.3 }}
        ref={scrollRef}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex py-12 -my-12 overflow-x-auto hide-scrollbar select-none scroll-smooth ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'
        }`}
      >
        {/* Left Spacing Buffer to align with header without clipping */}
        <div className="shrink-0 w-6 md:w-16 pointer-events-none snap-start" aria-hidden="true" />

        {DRESSES.map((dress) => (
          <div 
            key={dress.id} 
            onMouseDown={(e) => handleMouseDown(e, dress.id)}
            onClick={() => handleCardClick(dress.id)}
            className={`mr-4 md:mr-8 relative w-[280px] md:w-[400px] group shrink-0 snap-start transition-transform duration-500 cursor-pointer ${
              activeCardId === dress.id ? 'scale-95' : isDragging ? 'scale-100' : 'hover:scale-[1.03] scale-100'
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-transparent pointer-events-none shadow-sm">
              {dress.image && (
                <img
                  src={dress.image}
                  onLoad={() => setLoadedImages(prev => ({ ...prev, [dress.id]: true }))}
                  onDragStart={(e) => e.preventDefault()}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                    loadedImages[dress.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  referrerPolicy="no-referrer"
                />
              )}
              
              {/* Badges */}
              {dress.badge && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-white/85 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-gray-200">
                    {dress.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Favorite */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(parseInt(dress.id));
              }}
              className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-full transition-colors border z-10 ${
                isFavorite(parseInt(dress.id)) 
                  ? 'bg-white/90 text-rose-600 border-gray-200' 
                  : 'bg-white/50 text-gray-500 hover:text-rose-600 hover:bg-white/90 border-gray-200'
              }`}
            >
              <Heart size={18} fill={isFavorite(parseInt(dress.id)) ? "currentColor" : "none"} />
            </button>

            <div className="mt-6 flex justify-between items-start pointer-events-none">
              <div>
                <h3 className="font-serif text-2xl text-gray-950 group-hover:text-rose-600 transition-colors">{dress.name}</h3>
                <p className="font-sans text-sm text-gray-400 mt-1">{dress.category}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-sans text-lg text-rose-600 font-semibold">{formatPrice(dress.price)}</span>
                  {dress.oldPrice && (
                    <span className="font-sans text-sm text-gray-400 line-through">{formatPrice(dress.oldPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* "See More" Card */}
        <div 
          onMouseDown={(e) => handleMouseDown(e, 'see-more')}
          onClickCapture={(e) => {
            if (hasDragged.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={`mr-6 md:mr-16 relative w-[280px] md:w-[400px] shrink-0 snap-center md:snap-start transition-transform duration-500 cursor-pointer ${
            activeCardId === 'see-more' ? 'scale-95' : isDragging ? 'scale-100' : 'hover:scale-[1.03] scale-100'
          }`}
        >
          <Link to="/catalog?sort=new" className="group flex flex-col items-center justify-center gap-6 w-full aspect-[3/4] rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors backdrop-blur-sm shadow-sm">
            <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform bg-white pointer-events-none shadow-sm">
              <ArrowRight size={24} className="text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="font-serif text-2xl text-gray-700 group-hover:text-gray-900 pointer-events-none">
              <AnimatedText text="Смотреть все" />
            </span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
