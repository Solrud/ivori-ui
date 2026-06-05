import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Heart, X, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedText from './AnimatedText';
import BookingModal from './BookingModal';
import { useFavorites } from '../context/FavoritesContext';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favoriteIds } = useFavorites();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Коллекции', href: '/#collections' },
    { name: 'Новинки', href: '/#new' },
    { name: 'Преимущества', href: '/#advantages' },
    { name: 'Контакты', href: '/#contacts' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] md:w-[90%] max-w-5xl"
      >
        <div className="flex items-center justify-between p-1.5 md:p-2 bg-white/80 backdrop-blur-2xl border border-gray-200 rounded-full shadow-sm">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-900"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="font-serif text-lg md:text-xl tracking-widest uppercase text-gray-900 ml-1 md:ml-6">АЙВОРИ</Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-sans text-sm text-gray-700">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="hover:text-rose-600 transition-colors">{link.name}</Link>
            ))}
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Link 
              to="/favorites"
              className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-900"
            >
              <Heart size={20} className={favoriteIds.length > 0 ? "fill-gray-900 text-gray-900" : ""} />
              {favoriteIds.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group bg-rose-500 text-white h-10 md:h-11 px-4 md:px-6 rounded-full font-medium text-xs md:text-sm hover:bg-rose-600 transition-colors shadow-sm"
            >
              <AnimatedText text="Записаться" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-[85%] max-w-sm bg-white shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <span className="font-serif text-xl tracking-widest uppercase text-gray-900">АЙВОРИ</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-6">
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.href} 
                      className="font-serif text-3xl text-gray-900 hover:text-rose-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-16 pt-8 border-t border-gray-100 space-y-6">
                  <div className="flex items-center gap-4 text-gray-600">
                    <Phone size={20} className="text-rose-500" />
                    <a href="tel:+79991234567" className="font-sans text-lg">+7 (999) 123-45-67</a>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <MapPin size={20} className="text-rose-500" />
                    <span className="font-sans text-sm leading-relaxed">Москва, ул. Свадебная, 15<br/>Салон «Айвори»</span>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all" title="Max Messenger">
                      <MessageCircle size={24} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-rose-500 text-white py-4 rounded-2xl font-medium text-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                >
                  Записаться на примерку
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
