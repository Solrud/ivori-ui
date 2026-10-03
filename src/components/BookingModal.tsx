import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../admin/api/mockApi';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await adminApi.createBooking({
        clientName: name,
        clientPhone: phone,
        preferredDate: date || new Date().toISOString().split('T')[0],
        preferredTime: time
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName('');
        setPhone('');
        setDate('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      setError('Не удалось отправить заявку. Попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  };

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
            
            {success ? (
              <div className="py-8 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 size={56} className="text-emerald-500 mb-4" />
                <h3 className="font-serif text-2xl text-gray-900 mb-2">Заявка принята!</h3>
                <p className="font-sans text-gray-600 text-sm">
                  Спасибо! Наш стилист свяжется с вами в ближайшее время для подтверждения записи.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-3xl text-gray-900 mb-2">Запись на примерку</h2>
                <p className="font-sans text-gray-600 text-sm mb-6">
                  Оставьте свои данные, и мы свяжемся с вами для подтверждения времени.
                </p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Ваше имя *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-sans text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Телефон *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-sans text-sm"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <label className="block text-[10px] uppercase font-semibold text-gray-400 mb-1">Дата примерки</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-2 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-rose-500 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-gray-400 mb-1">Удобное время</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-rose-500 font-sans"
                      >
                        <option value="11:00">11:00</option>
                        <option value="12:30">12:30</option>
                        <option value="14:00">14:00</option>
                        <option value="15:30">15:30</option>
                        <option value="17:00">17:00</option>
                        <option value="18:30">18:30</option>
                      </select>
                    </div>
                  </div>
                  
                  <label className="flex items-start gap-3 mt-1 cursor-pointer group">
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
                      Я соглашаюсь с <a href="/#privacy" className="text-rose-600 hover:underline" onClick={(e) => e.stopPropagation()}>политикой конфиденциальности</a> и обработкой данных.
                    </span>
                  </label>

                  {error && <p className="text-red-500 text-xs">{error}</p>}

                  <button
                    type="submit"
                    disabled={!agreed || submitting}
                    className="w-full bg-rose-500 text-white py-3.5 rounded-xl font-medium mt-2 hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-rose-300 shadow-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Отправка...</span>
                    ) : (
                      <span>Отправить заявку</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
