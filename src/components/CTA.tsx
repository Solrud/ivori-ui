import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import AnimatedText from './AnimatedText';
import BookingModal from './BookingModal';
import { useSettings } from '../context/SettingsContext';

export default function CTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const { settings } = useSettings();
  const bgImage = settings?.mainPhoto;

  return (
    <>
      <section className="relative py-32 md:py-48 px-6 md:px-16 overflow-hidden flex items-center justify-center bg-transparent">
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              onLoad={() => setBgLoaded(true)}
              className={`w-full h-full object-cover opacity-20 grayscale transition-opacity duration-1000 ${
                bgLoaded ? 'opacity-20' : 'opacity-0'
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-white" />
          </div>
        )}

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-8xl font-light text-gray-900 mb-8 leading-[1.1]"
          >
            Готовы найти <br />
            <span className="italic text-rose-500">свое платье?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-sans text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto font-light"
          >
            Запишитесь на индивидуальную примерку в наш салон. Мы уделим вам максимум внимания и поможем сделать правильный выбор.
          </motion.p>

          <motion.button
            onClick={() => {
              // setIsModalOpen(true);
              window.open('https://mst.link/primerka59', '_blank');
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.4 }}
            className="group inline-flex items-center justify-center text-center gap-3 sm:gap-4 bg-rose-500 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-full font-medium text-base sm:text-lg hover:bg-rose-600 transition-all shadow-md max-w-full"
          >
            <AnimatedText text="Записаться на примерку" />
            <ArrowRight size={20} className="shrink-0 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>
      </section>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
