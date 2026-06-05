import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="font-serif text-3xl text-gray-900 mb-2">Запись на примерку</h2>
            <p className="font-sans text-gray-600 text-sm mb-8">
              Оставьте свои данные, и мы свяжемся с вами для подтверждения времени.
            </p>

            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
              <input
                type="text"
                placeholder="Ваше имя"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-sans"
              />
              <input
                type="tel"
                placeholder="Телефон"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-sans"
              />
              
              <label className="flex items-start gap-3 mt-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 border border-gray-300 rounded bg-white group-hover:border-rose-500 transition-colors shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  {agreed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-rose-500 rounded-sm"
                    />
                  )}
                </div>
                <span className="font-sans text-xs text-gray-600 leading-relaxed select-none group-hover:text-gray-800 transition-colors">
                  Я соглашаюсь с <a href="/#privacy" className="text-rose-600 hover:underline" onClick={(e) => e.stopPropagation()}>политикой конфиденциальности</a> и даю согласие на обработку персональных данных.
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreed}
                className="w-full bg-rose-500 text-white py-4 rounded-xl font-medium mt-4 hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-rose-300 shadow-sm"
              >
                Отправить заявку
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
