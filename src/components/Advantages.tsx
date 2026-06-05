import { motion } from 'motion/react';
import { Sparkles, Scissors, HeartHandshake, Clock } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: <Sparkles size={32} strokeWidth={1} />,
    title: 'Российские бренды',
    description: 'Мы сотрудничаем только с лучшими российскими дизайнерами свадебной моды.',
  },
  {
    icon: <Scissors size={32} strokeWidth={1} />,
    title: 'Идеальная посадка',
    description: 'Наши мастера подгонят платье по вашей фигуре с точностью до миллиметра.',
  },
  {
    icon: <HeartHandshake size={32} strokeWidth={1} />,
    title: 'Индивидуальный подход',
    description: 'Персональный стилист поможет подобрать образ, отражающий вашу суть.',
  },
  {
    icon: <Clock size={32} strokeWidth={1} />,
    title: 'Примерка без спешки',
    description: 'Мы выделяем достаточно времени, чтобы вы могли насладиться процессом выбора.',
  },
];

export default function Advantages() {
  return (
    <section id="advantages" className="py-24 md:py-32 px-6 md:px-16 bg-transparent text-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">Почему выбирают нас</h2>
          <p className="font-sans text-gray-600 max-w-2xl mx-auto text-lg">
            Мы создаем не просто платья, мы создаем воспоминания, которые останутся с вами навсегда.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {ADVANTAGES.map((adv, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center mb-8 text-rose-500 group-hover:bg-rose-50 transition-colors duration-500">
                {adv.icon}
              </div>
              <h3 className="font-serif text-2xl mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                {adv.title}
              </h3>
              <p className="font-sans text-gray-600 leading-relaxed text-sm">
                {adv.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
