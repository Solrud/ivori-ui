import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Gift, Scissors, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';

const SLIDES = [
  {
    id: 'main',
    is2Gis: true,
    badgeText: 'Топ-салон Перми · 600+ отзывов в 2GIS',
    badgeIcon: Star,
    title1: 'Ваше идеальное',
    title2: 'платье ждет',
    desc: 'Эксклюзивные свадебные коллекции, созданные подчеркнуть вашу уникальность. Запишитесь на примерку в наш салон.',
    ctaText: 'Смотреть коллекции',
    ctaLink: '/#collections'
  },
  {
    id: 'promo-2',
    is2Gis: false,
    badgeText: 'Специальное предложение',
    badgeIcon: Scissors,
    title1: 'Акция на',
    title2: 'предзаказ',
    desc: 'Планируете свадьбу заранее? Оформите заказ на создание вашего идеального платья по специальным и очень выгодным условиям.',
    ctaText: 'Узнать подробности',
    ctaLink: '/catalog'
  },
  {
    id: 'promo-3',
    is2Gis: false,
    badgeText: 'Специальные расценки',
    badgeIcon: Tag,
    title1: 'Платья',
    title2: 'по акции',
    desc: 'Ограниченное предложение! Роскошные модели из предыдущих коллекций по специальным ценам. Успейте найти свое платье.',
    ctaText: 'Перейти к акции',
    ctaLink: '/catalog'
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current]); // Reset timer if manually changed

  const slide = SLIDES[current];

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-screen min-h-[550px] sm:min-h-[650px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Bride in elegant wedding dress"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-28 sm:pt-32 md:pt-40 pb-4 flex-1 flex flex-col justify-center w-full">
        {/* Navigation Arrows */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-0 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all pointer-events-auto"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {slide.is2Gis ? (
              <a
                href="https://2gis.ru/perm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 bg-white/20 backdrop-blur-lg border border-white/20 px-5 py-3 sm:px-4 sm:py-2 rounded-2xl sm:rounded-full mb-6 sm:mb-8 hover:bg-white/30 transition-all shadow-xl"
              >
                <div className="flex gap-0.5 text-rose-500">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="font-sans text-[11px] sm:text-sm font-medium text-white text-center leading-tight">
                  {slide.badgeText}
                </span>
              </a>
            ) : (
              <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-lg border border-white/20 px-5 py-3 sm:px-5 sm:py-2.5 rounded-2xl sm:rounded-full mb-6 sm:mb-8 shadow-xl">
                <div className="flex gap-0.5 text-rose-300">
                  <slide.badgeIcon size={16} />
                </div>
                <span className="font-sans text-[11px] sm:text-sm font-medium text-white text-center leading-tight">
                  {slide.badgeText}
                </span>
              </div>
            )}

            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4 sm:mb-6 leading-[1.1]">
              {slide.title1} <br />
              <span className="italic text-white/80">{slide.title2}</span>
            </h1>

            <p className="font-sans text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-10 max-w-2xl mx-auto font-light min-h-[100px] sm:min-h-[80px] md:min-h-[60px]">
              {slide.desc}
            </p>

            <div>
              <Link
                to={slide.ctaLink}
                className="group inline-flex items-center gap-3 bg-rose-500 text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-rose-600 transition-all shadow-sm"
              >
                <AnimatedText text={slide.ctaText} />
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots navigation */}
      <div className="relative z-10 pb-8 sm:pb-12 flex gap-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              current === idx ? 'w-8 bg-rose-500' : 'bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
