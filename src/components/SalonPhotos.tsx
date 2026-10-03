import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function SalonPhotos() {
  const { settings } = useSettings();
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const salonMedia = settings?.salonMedia;

  const photos = [
    {
      id: 1,
      url: salonMedia?.['Наш уютный зал']?.url || '',
      type: salonMedia?.['Наш уютный зал']?.type || 'image',
      title: 'Наш уютный зал'
    },
    {
      id: 2,
      url: salonMedia?.['Зона примерки']?.url || '',
      type: salonMedia?.['Зона примерки']?.type || 'image',
      title: 'Зона примерки'
    },
    {
      id: 3,
      url: salonMedia?.['Интерьер']?.url || '',
      type: salonMedia?.['Интерьер']?.type || 'image',
      title: 'Интерьер'
    },
    {
      id: 4,
      url: salonMedia?.['Аксессуары']?.url || '',
      type: salonMedia?.['Аксессуары']?.type || 'image',
      title: 'Аксессуары'
    },
    {
      id: 5,
      url: salonMedia?.['Наши коллекции']?.url || '',
      type: salonMedia?.['Наши коллекции']?.type || 'image',
      title: 'Наши коллекции'
    }
  ];

  // Filter only items that have a valid url for the viewer
  const validPhotos = photos.filter(p => !!p.url);

  const openLightbox = (photoId: number) => {
    const idx = validPhotos.findIndex(p => p.id === photoId);
    if (idx !== -1) {
      setActivePhotoIndex(idx);
    }
  };

  const closeLightbox = useCallback(() => {
    setActivePhotoIndex(null);
  }, []);

  const nextPhoto = useCallback(() => {
    if (validPhotos.length === 0) return;
    setActivePhotoIndex(prev => (prev === null ? 0 : (prev + 1) % validPhotos.length));
  }, [validPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (validPhotos.length === 0) return;
    setActivePhotoIndex(prev => (prev === null ? 0 : (prev - 1 + validPhotos.length) % validPhotos.length));
  }, [validPhotos.length]);

  // Handle keyboard navigation (Left/Right arrow, Escape)
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock background scroll while lightbox is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activePhotoIndex, closeLightbox, nextPhoto, prevPhoto]);

  // Touch swipe handlers for mobile
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextPhoto();
    } else if (isRightSwipe) {
      prevPhoto();
    }
  };

  return (
    <section className="pt-20 md:pt-24 pb-14 md:pb-16 px-6 md:px-16 bg-white overflow-hidden" id="salon">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl w-full">
            <span className="font-sans text-[10px] md:text-xs text-rose-500 uppercase tracking-[0.3em] font-medium block mb-3 md:mb-4">
              Атмосфера
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gray-900 font-light leading-[1.15] break-words">
              Загляните к нам в гости
            </h2>
          </div>
          <p className="font-sans text-gray-500 text-sm sm:text-base md:text-lg max-w-sm leading-relaxed">
            Мы создали пространство, где каждая примерка превращается в праздник. 
            Уют, комфорт и внимание к деталям.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:h-[600px]">
          {/* Main large photo */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            onClick={() => photos[0].url && openLightbox(photos[0].id)}
            className="col-span-2 row-span-2 aspect-square md:aspect-auto relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl bg-gray-100 cursor-pointer group"
          >
            {photos[0].type === 'video' ? (
              <video 
                src={photos[0].url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : photos[0].url ? (
              <img 
                src={photos[0].url} 
                onLoad={() => setLoadedImages(prev => ({ ...prev, [photos[0].id]: true }))}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ease-out ${
                  loadedImages[photos[0].id] ? 'opacity-100' : 'opacity-0'
                }`}
                referrerPolicy="no-referrer"
                alt={photos[0].title}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end justify-between p-6 md:p-8 transition-opacity duration-300">
              <p className="font-sans text-white text-sm md:text-lg font-medium">{photos[0].title}</p>
              <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={16} />
              </span>
            </div>
          </motion.div>

          {/* Right top */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={() => photos[1].url && openLightbox(photos[1].id)}
            className="aspect-square md:aspect-auto relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg bg-gray-100 cursor-pointer group"
          >
            {photos[1].type === 'video' ? (
              <video 
                src={photos[1].url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : photos[1].url ? (
              <img 
                src={photos[1].url} 
                onLoad={() => setLoadedImages(prev => ({ ...prev, [photos[1].id]: true }))}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ease-out ${
                  loadedImages[photos[1].id] ? 'opacity-100' : 'opacity-0'
                }`}
                referrerPolicy="no-referrer"
                alt={photos[1].title}
              />
            ) : null}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                <Maximize2 size={18} />
              </span>
            </div>
          </motion.div>

          {/* Right bottom */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => photos[2].url && openLightbox(photos[2].id)}
            className="aspect-square md:aspect-auto relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg bg-gray-100 cursor-pointer group"
          >
            {photos[2].type === 'video' ? (
              <video 
                src={photos[2].url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : photos[2].url ? (
              <img 
                src={photos[2].url} 
                onLoad={() => setLoadedImages(prev => ({ ...prev, [photos[2].id]: true }))}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ease-out ${
                  loadedImages[photos[2].id] ? 'opacity-100' : 'opacity-0'
                }`}
                referrerPolicy="no-referrer"
                alt={photos[2].title}
              />
            ) : null}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                <Maximize2 size={18} />
              </span>
            </div>
          </motion.div>

          {/* Item 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={() => photos[3].url && openLightbox(photos[3].id)}
            className="aspect-square md:aspect-auto relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg bg-gray-100 cursor-pointer group"
          >
            {photos[3].type === 'video' ? (
              <video 
                src={photos[3].url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : photos[3].url ? (
              <img 
                src={photos[3].url} 
                onLoad={() => setLoadedImages(prev => ({ ...prev, [photos[3].id]: true }))}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ease-out ${
                  loadedImages[photos[3].id] ? 'opacity-100' : 'opacity-0'
                }`}
                referrerPolicy="no-referrer"
                alt={photos[3].title}
              />
            ) : null}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                <Maximize2 size={18} />
              </span>
            </div>
          </motion.div>

          {/* Item 5 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={() => photos[4].url && openLightbox(photos[4].id)}
            className="aspect-square md:aspect-auto relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg bg-gray-100 cursor-pointer group"
          >
            {photos[4].type === 'video' ? (
              <video 
                src={photos[4].url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : photos[4].url ? (
              <img 
                src={photos[4].url} 
                onLoad={() => setLoadedImages(prev => ({ ...prev, [photos[4].id]: true }))}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ease-out ${
                  loadedImages[photos[4].id] ? 'opacity-100' : 'opacity-0'
                }`}
                referrerPolicy="no-referrer"
                alt={photos[4].title}
              />
            ) : null}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                <Maximize2 size={18} />
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && validPhotos[activePhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 select-none"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Top Bar with Title, Counter and Close Button */}
            <div 
              className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between text-white z-20 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-sans tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {activePhotoIndex + 1} / {validPhotos.length}
                </span>
                <span className="text-sm sm:text-base font-serif font-light text-white/90 truncate max-w-[200px] sm:max-w-md">
                  {validPhotos[activePhotoIndex].title}
                </span>
              </div>

              <button
                onClick={closeLightbox}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                aria-label="Закрыть"
              >
                <X size={22} />
              </button>
            </div>

            {/* Left Prev Arrow Button */}
            {validPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer z-20"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Right Next Arrow Button */}
            {validPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer z-20"
                aria-label="Следующее фото"
              >
                <ChevronRight size={28} />
              </button>
            )}

            {/* Active Media Container */}
            <div 
              className="relative max-w-5xl max-h-[82vh] w-full h-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={validPhotos[activePhotoIndex].id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {validPhotos[activePhotoIndex].type === 'video' ? (
                    <video
                      src={validPhotos[activePhotoIndex].url}
                      controls
                      autoPlay
                      playsInline
                      className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                    />
                  ) : (
                    <img
                      src={validPhotos[activePhotoIndex].url}
                      alt={validPhotos[activePhotoIndex].title}
                      className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl pointer-events-none"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom thumbnail selector / hint on mobile */}
            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 overflow-x-auto max-w-full px-4 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {validPhotos.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative rounded-lg overflow-hidden h-11 w-11 sm:h-14 sm:w-14 shrink-0 transition-all border-2 ${
                    activePhotoIndex === idx ? 'border-rose-500 scale-105 shadow-md' : 'border-white/20 opacity-50 hover:opacity-80'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-[10px] text-white">Видео</div>
                  ) : (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

