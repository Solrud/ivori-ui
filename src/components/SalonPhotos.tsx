import { motion } from 'motion/react';
import AnimatedText from './AnimatedText';

const SALON_PHOTOS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80',
    title: 'Наш уютный зал'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1606131326442-f281229cc166?auto=format&fit=crop&q=80',
    title: 'Зона примерки'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&q=80',
    title: 'Интерьер'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80',
    title: 'Аксессуары'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80',
    title: 'Наши коллекции'
  }
];

export default function SalonPhotos() {
  return (
    <section className="py-24 px-6 md:px-16 bg-white overflow-hidden" id="salon">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-sans text-[10px] md:text-xs text-rose-500 uppercase tracking-[0.3em] font-medium block mb-4">
              <AnimatedText text="Атмосфера" />
            </span>
            <h2 className="font-serif text-4xl md:text-7xl text-gray-900 font-light leading-[1.1]">
              <AnimatedText text="Загляните к нам в гости" />
            </h2>
          </div>
          <p className="font-sans text-gray-500 text-base md:text-lg max-w-sm leading-relaxed">
            Мы создали пространство, где каждая примерка превращается в праздник. 
            Уют, комфорт и внимание к деталям.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 h-[400px] md:h-[600px]">
          {/* Main large photo */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl"
          >
            <img 
              src={SALON_PHOTOS[0].url} 
              alt={SALON_PHOTOS[0].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6 md:p-8">
              <p className="font-sans text-white text-sm md:text-lg font-medium">{SALON_PHOTOS[0].title}</p>
            </div>
          </motion.div>

          {/* Right top */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
          >
            <img 
              src={SALON_PHOTOS[1].url} 
              alt={SALON_PHOTOS[1].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Right bottom */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
          >
            <img 
              src={SALON_PHOTOS[2].url} 
              alt={SALON_PHOTOS[2].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Special wide or narrow bottom piece depending on layout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:block relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
          >
            <img 
              src={SALON_PHOTOS[3].url} 
              alt={SALON_PHOTOS[3].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hidden md:block relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
          >
            <img 
              src={SALON_PHOTOS[4].url} 
              alt={SALON_PHOTOS[4].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
