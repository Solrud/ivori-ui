import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';
import { useSettings } from '../context/SettingsContext';

export default function Collections() {
  const { settings } = useSettings();
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const collectionsMedia = settings?.collectionsMedia;

  const COLLECTIONS = [
    {
      id: 1,
      title: 'А-силуэт',
      image: collectionsMedia?.['А-силуэт']?.url || '',
      mediaType: collectionsMedia?.['А-силуэт']?.type || 'image',
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1',
      link: '/catalog?category=%D0%90-%D1%81%D0%B8%D0%BB%D1%83%D1%8D%D1%82',
    },
    {
      id: 2,
      title: 'Рыбка',
      image: collectionsMedia?.['Рыбка']?.url || '',
      mediaType: collectionsMedia?.['Рыбка']?.type || 'image',
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1',
      link: '/catalog?category=%D0%A0%D1%8B%D0%B1%D0%BA%D0%B0',
    },
    {
      id: 3,
      title: 'По акции',
      image: collectionsMedia?.['По акции']?.url || collectionsMedia?.['С акцией']?.url || '',
      mediaType: collectionsMedia?.['По акции']?.type || collectionsMedia?.['С акцией']?.type || 'image',
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1',
      link: '/catalog?sort=sale',
      isPromo: true,
    },
    {
      id: 4,
      title: 'Пышные',
      image: collectionsMedia?.['Пышные']?.url || '',
      mediaType: collectionsMedia?.['Пышные']?.type || 'image',
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1',
      link: '/catalog?category=%D0%9F%D1%8B%D1%88%D0%BD%D1%8B%D0%B5',
    },
    {
      id: 5,
      title: 'Минимализм',
      image: collectionsMedia?.['Минимализм']?.url || '',
      mediaType: collectionsMedia?.['Минимализм']?.type || 'image',
      colSpan: 'col-span-1 md:col-span-2',
      rowSpan: 'row-span-1',
      link: '/catalog?category=%D0%9C%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D0%B8%D0%B7%D0%BC',
    },
  ];

  return (
    <section id="collections" className="py-24 md:py-32 px-6 md:px-16 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-6xl text-gray-900 font-light">Коллекции</h2>
            <p className="font-sans text-gray-600 mt-6 max-w-md text-lg">
              Каждое платье — это произведение искусства, созданное для вашего идеального дня.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/catalog" className="group flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors font-sans uppercase tracking-widest text-sm">
              <AnimatedText text="Все силуэты" />
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid with 5 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[360px] gap-6">
          {COLLECTIONS.map((collection, index) => {
            const isPromo = collection.isPromo;

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative group overflow-hidden rounded-3xl bg-transparent ${collection.colSpan} ${collection.rowSpan} ${
                  isPromo 
                    ? 'border border-rose-200 shadow-md shadow-rose-50/50 bg-gradient-to-tr from-rose-100 to-white' 
                    : 'cursor-pointer'
                }`}
              >
                <Link to={collection.link} className="absolute inset-0 z-30" />
                
                {isPromo ? (
                  /* Custom Gorgeous Promo Design for "Платья по акции" Card */
                  <>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors z-10" />
                    {collection.mediaType === 'video' ? (
                      <video
                        src={collection.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115 grayscale-[10%] group-hover:grayscale-0"
                      />
                    ) : collection.image ? (
                      <img
                        src={collection.image}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, [collection.id]: true }))}
                        className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-115 grayscale-[10%] group-hover:grayscale-0 ${
                          loadedImages[collection.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    ) : null}

                    <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end pointer-events-none">
                      <h3 className="font-serif text-3xl md:text-4xl text-white font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-500 leading-normal">
                        Платья по акции
                      </h3>
                      <div className="overflow-hidden mt-2">
                        <p className="font-sans text-rose-300 group-hover:text-white text-xs uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100 font-semibold">
                          Смотреть скидки %
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Standard Collection Card */
                  <>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/45 transition-colors z-10" />
                    {collection.mediaType === 'video' ? (
                      <video
                        src={collection.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : collection.image ? (
                      <img
                        src={collection.image}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, [collection.id]: true }))}
                        className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                          loadedImages[collection.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end pointer-events-none">
                      <h3 className="font-serif text-3xl md:text-4xl text-white font-light translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {collection.title}
                      </h3>
                      <div className="overflow-hidden mt-4">
                        <p className="font-sans text-white/90 text-sm uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          Смотреть платья
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
