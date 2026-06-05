import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldAlert, Check } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    // Check local storage for previous decisions using a new key to force it to show up again
    const status = localStorage.getItem('cookieConsent_v2');
    if (status === 'rejected') {
      setIsRejected(true);
    } else if (status !== 'accepted') {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    if (!policyAccepted) return;
    localStorage.setItem('cookieConsent_v2', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent_v2', 'rejected');
    setIsVisible(false);
    setIsRejected(true);
  };

  const handleReconsider = () => {
    localStorage.removeItem('cookieConsent_v2');
    setIsRejected(false);
    setPolicyAccepted(false);
    setIsVisible(true);
  };

  if (isRejected) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
          <ShieldAlert size={48} strokeWidth={1.5} className="text-rose-500" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-gray-900 font-light mb-6 text-balance">
          Доступ ограничен
        </h1>
        <p className="font-sans text-gray-600 max-w-md mb-10 text-lg md:text-xl leading-relaxed">
          Вы отказались от нашей Политики конфиденциальности и использования файлов cookie. Без вашего согласия мы не можем гарантировать корректную работу сайта и вынуждены ограничить доступ к коллекциям.
        </p>
        <button
          onClick={handleReconsider}
          className="bg-rose-500 text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 hover:-translate-y-0.5"
        >
          Пересмотреть решение
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Mobile backdrop overlay to draw attention to bottom sheet */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/20 z-[998] md:hidden backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-10 z-[999] md:w-[440px] bg-white md:bg-white/95 md:backdrop-blur-2xl border-t md:border border-gray-100 rounded-t-3xl md:rounded-3xl p-6 pb-8 md:p-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] md:shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Grab handle for mobile bottom sheet aesthetic */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
            
            <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-50 rounded-full flex items-center justify-center mb-4 md:mb-6 border border-rose-100">
            <Cookie className="text-rose-500 w-6 h-6 md:w-7 md:h-7" />
          </div>
          
          <h3 className="text-xl md:text-2xl font-serif mb-2 md:mb-3 text-gray-900 leading-tight">Мы уважаем ваш выбор</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-5 md:mb-6 font-sans leading-relaxed">
            Наш сайт использует файлы cookie для корректной работы, персонализации сервисов и удобства пользователей. Пожалуйста, ознакомьтесь с нашей политикой перед тем, как продолжить.
          </p>

          <div className="flex flex-col gap-4 mb-5 md:mb-8 bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-100">
            <label className="flex items-start gap-3 md:gap-4 cursor-pointer group">
              <div className={`relative shrink-0 w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors shadow-sm ${
                policyAccepted 
                  ? 'bg-rose-500 border-rose-500' 
                  : 'border-gray-300 group-hover:border-rose-400 bg-white'
              }`}>
                {policyAccepted && <Check size={14} className="text-white" strokeWidth={3} />}
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                />
              </div>
              <span className="font-sans text-[11px] md:text-xs text-gray-600 leading-relaxed select-none">
                Я подтверждаю, что ознакомлен и согласен с{' '}
                <a href="#privacy" className="text-rose-600 hover:text-rose-700 underline underline-offset-4 transition-colors font-medium">
                  Политикой конфиденциальности
                </a>
                {' '}и правилами обработки персональных данных.
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3">
            <button
              onClick={handleReject}
              className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 md:py-3.5 rounded-xl font-medium text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors order-2 sm:order-1"
            >
              Отказаться
            </button>
            <button
              onClick={handleAccept}
              disabled={!policyAccepted}
              className={`flex-1 py-3 md:py-3.5 rounded-xl font-medium text-sm transition-all order-1 sm:order-2 ${
                policyAccepted 
                  ? 'bg-rose-500 text-white hover:bg-rose-600 cursor-pointer shadow-lg shadow-rose-200/50' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Принять
            </button>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
