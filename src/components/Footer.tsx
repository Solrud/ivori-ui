import { MapPin, Phone, Mail, Star, Youtube, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  const contacts = settings?.contacts || {
    description: 'Салон изысканных свадебных платьев. Мы создаем идеальные образы для самых важных моментов в вашей жизни.',
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

  return (
    <footer id="contacts" className="bg-gray-50 text-gray-900 pt-24 md:pt-32 pb-12 px-6 md:px-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
        
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-3xl uppercase tracking-widest">АЙВОРИ</h2>
          <p className="font-sans text-gray-600 text-sm leading-relaxed max-w-xs">
            {contacts.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            {links.vk && (
              <a href={links.vk} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600 hover:text-rose-600" title="ВКонтакте">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.073 2H8.927C3.34 2 2 3.34 2 8.927v6.146C2 20.66 3.34 22 8.927 22h6.146C20.66 22 22 20.66 22 15.073V8.927C22 3.34 20.66 2 15.073 2zM17.12 15.65c.44.46.89.91 1.31 1.39.23.26.44.53.59.86.11.23.04.46-.18.57-.14.07-.3.1-.46.1h-1.99c-.48-.02-.85-.2-1.15-.56-.37-.43-.73-.87-1.12-1.28-.15-.16-.32-.3-.53-.4-.36-.16-.65-.05-.83.31-.15.3-.2.63-.22.96-.03.4-.18.57-.58.6-.96.06-1.88-.08-2.74-.53-1.1-.58-1.95-1.4-2.62-2.38-1.4-2.05-2.4-4.28-3.13-6.64-.1-.31.02-.48.34-.49h2.02c.3 0 .52.14.63.43.43 1.25.96 2.45 1.66 3.56.33.52.7.99 1.2 1.34.25.17.47.11.58-.18.1-.25.13-.52.14-.78.02-1.05-.08-2.08-.5-3.05-.15-.35-.04-.56.32-.64.24-.05.49-.07.74-.07h1.4c.34.05.46.2.5.55.05.65.03 1.3.03 1.95 0 .37.05.74.22 1.07.12.23.33.26.54.1.3-.22.53-.5.74-.78.68-.94 1.18-1.97 1.55-3.06.1-.3.26-.43.58-.43h2.06c.35 0 .5.12.46.48-.04.38-.18.73-.33 1.08-.43.98-.98 1.9-1.6 2.78-.26.37-.28.66.02.97z"/>
                </svg>
              </a>
            )}
            {links.tg && (
              <a href={links.tg} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600 hover:text-rose-600" title="Telegram">
                <Send size={18} className="ml-[-2px] mt-[2px]" />
              </a>
            )}
            {links.youtube && (
              <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600 hover:text-rose-600" title="YouTube">
                <Youtube size={18} />
              </a>
            )}
            {links.max && (
              <a href={links.max} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600 hover:text-rose-600" title="Messenger">
                <MessageCircle size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Dynamic Navigation */}
        <div className="flex flex-col gap-6">
          <h3 className="font-serif text-xl text-rose-500">Навигация</h3>
          <ul className="flex flex-col gap-3 font-sans text-gray-600 text-sm">
            <li><Link to="/catalog" className="hover:text-rose-600 transition-colors">Каталог платьев</Link></li>
            <li><Link to="/#collections" className="hover:text-rose-600 transition-colors">Наши коллекции</Link></li>
            <li><Link to="/favorites" className="hover:text-rose-600 transition-colors">Избранное</Link></li>
            <li><Link to="/#advantages" className="hover:text-rose-600 transition-colors">Преимущества</Link></li>
            <li><Link to="/#faq" className="hover:text-rose-600 transition-colors">Частые вопросы</Link></li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="flex flex-col gap-6">
          <h3 className="font-serif text-xl text-rose-500">Контакты</h3>
          <ul className="flex flex-col gap-4 font-sans text-gray-700 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 mt-0.5 text-gray-500" />
              <span>г. Пермь, ул. Ленина, 90<br />Ежедневно с 11:00 до 20:00</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-gray-500" />
              <a href={`tel:${rawPhone}`} className="hover:text-rose-600 transition-colors">{contacts.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-gray-500" />
              <a href={`mailto:${contacts.email}`} className="hover:text-rose-600 transition-colors">{contacts.email}</a>
            </li>
          </ul>
        </div>

        {/* Map */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-serif text-xl text-rose-500">Как нас найти</h3>
            <div className="flex flex-wrap items-center gap-2">
              <a 
                href="https://yandex.ru/maps/50/perm/?ll=56.209172%2C58.005695&mode=poi&poi%5Bpoint%5D=56.209232%2C58.005626&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D104725863461&pt=56.2086596%2C58.0057116&z=21" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-amber-50/60 hover:border-amber-300 transition-colors"
                title="Открыть в Яндекс.Картах"
              >
                <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px] leading-none shrink-0">Я</span>
                <span className="font-sans text-xs font-medium text-gray-800 group-hover:text-red-600 transition-colors">
                  Яндекс.Карты
                </span>
              </a>
              <a 
                href="https://maps.app.goo.gl/RcyUj9m7FiUjK7u87" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors"
                title="Открыть точный вход на Google Maps"
              >
                <MapPin size={14} className="text-rose-500 group-hover:scale-110 transition-transform" />
                <span className="font-sans text-xs font-medium text-gray-800 group-hover:text-rose-600 transition-colors">
                  Google Maps
                </span>
              </a>
              <a 
                href="https://2gis.ru/perm/search/%D0%BB%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0%2090/firm/70000001047906981/56.209228%2C58.005686?m=56.209108%2C58.005644%2F19.84" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                title="Открыть в 2GIS"
              >
                <div className="flex gap-0.5 text-rose-500">
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                </div>
                <span className="font-sans text-xs font-medium text-gray-800 group-hover:text-gray-900">
                  2GIS
                </span>
              </a>
            </div>
          </div>

          <div>
            <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-gray-200 relative shadow-inner bg-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d350!2d56.208884!3d58.0056104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43e8c7292a8515f1%3A0x7bcae416c272c3df!2z0JDQmdCS0J7QoNCYLCDRgdCw0LvQvtC9INGB0LLQsNC00LXQsdC90YvRhSDQv9C70LDRgtGM0LXQsg!5e0!3m2!1sru!2sru!4v1727183600000!5m2!1sru!2sru" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="АЙВОРИ на Google Maps — г. Пермь, ул. Ленина, 90"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-sans">
        <p>&copy; {new Date().getFullYear()} Салон АЙВОРИ. Все права защищены.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-600 transition-colors">Политика конфиденциальности</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Публичная оферта</a>
        </div>
      </div>
    </footer>
  );
}
