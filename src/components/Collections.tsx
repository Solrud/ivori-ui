import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';

const COLLECTIONS = [
  {
    id: 1,
    title: 'А-силуэт',
    image: 'https://images.unsplash.com/photo-1546804784-81667efb343e?auto=format&fit=crop&q=80&w=1200',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1 md:row-span-2',
  },
  {
    id: 2,
    title: 'Рыбка',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
  },
  {
    id: 3,
    title: 'Пышные',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
  },
  {
    id: 4,
    title: 'Минимализм',
    image: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&q=80&w=1200',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1',
  },
];

export default function Collections() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] md:auto-rows-[400px] gap-6">
          {COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative group overflow-hidden rounded-3xl cursor-pointer ${collection.colSpan} ${collection.rowSpan}`}
            >
              <Link to={`/catalog?category=${encodeURIComponent(collection.title)}`} className="absolute inset-0 z-30" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
