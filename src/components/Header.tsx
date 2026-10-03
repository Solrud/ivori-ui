import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Heart, X, MessageCircle, Phone, MapPin, Send, Youtube } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedText from './AnimatedText';
import BookingModal from './BookingModal';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const { settings } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favoriteIds } = useFavorites();
  const location = useLocation();

  const contacts = settings?.contacts || {
    phone: '+7 (999) 123-45-67',
    email: 'info@ivory-salon.ru'
  };

  const links = settings?.links || {
    vk: 'https://vk.com/ivory',
    max: '',
    youtube: '',
    tg: 'https://t.me/ivory',
  };

  const rawPhone = contacts.phone.replace(/[^\d+]/g, '');

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
    { name: 'Каталог', href: '/catalog' },
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
              onClick={() => {
                // setIsModalOpen(true);
                window.open('https://mst.link/primerka59', '_blank');
              }}
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
                    <a href={`tel:${rawPhone}`} className="font-sans text-lg">{contacts.phone}</a>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <MapPin size={20} className="text-rose-500" />
                    <span className="font-sans text-sm leading-relaxed">Пермь, ул. Ленина, 90<br/>Салон «Айвори»</span>
                  </div>
                  <div className="flex gap-4 pt-4 flex-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {links.vk && (
                      <a 
                        href={links.vk} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all" 
                        title="ВКонтакте"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.073 2H8.927C3.34 2 2 3.34 2 8.927v6.146C2 20.66 3.34 22 8.927 22h6.146C20.66 22 22 20.66 22 15.073V8.927C22 3.34 20.66 2 15.073 2zM17.12 15.65c.44.46.89.91 1.31 1.39.23.26.44.53.59.86.11.23.04.46-.18.57-.14.07-.3.1-.46.1h-1.99c-.48-.02-.85-.2-1.15-.56-.37-.43-.73-.87-1.12-1.28-.15-.16-.32-.3-.53-.4-.36-.16-.65-.05-.83.31-.15.3-.2.63-.22.96-.03.4-.18.57-.58.6-.96.06-1.88-.08-2.74-.53-1.1-.58-1.95-1.4-2.62-2.38-1.4-2.05-2.4-4.28-3.13-6.64-.1-.31.02-.48.34-.49h2.02c.3 0 .52.14.63.43.43 1.25.96 2.45 1.66 3.56.33.52.7.99 1.2 1.34.25.17.47.11.58-.18.1-.25.13-.52.14-.78.02-1.05-.08-2.08-.5-3.05-.15-.35-.04-.56.32-.64.24-.05.49-.07.74-.07h1.4c.34.05.46.2.5.55.05.65.03 1.3.03 1.95 0 .37.05.74.22 1.07.12.23.33.26.54.1.3-.22.53-.5.74-.78.68-.94 1.18-1.97 1.55-3.06.1-.3.26-.43.58-.43h2.06c.35 0 .5.12.46.48-.04.38-.18.73-.33 1.08-.43.98-.98 1.9-1.6 2.78-.26.37-.28.66.02.97z"/>
                        </svg>
                      </a>
                    )}
                    {links.tg && (
                      <a 
                        href={links.tg} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all" 
                        title="Telegram"
                      >
                        <Send size={22} className="ml-[-2px] mt-[2px]" />
                      </a>
                    )}
                    {links.youtube && (
                      <a 
                        href={links.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all" 
                        title="YouTube"
                      >
                        <Youtube size={22} />
                      </a>
                    )}
                    {links.max && (
                      <a 
                        href={links.max} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all" 
                        title="Messenger"
                      >
                        <MessageCircle size={22} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // setIsModalOpen(true);
                    window.open('https://mst.link/primerka59', '_blank');
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
