import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: 'Нужно ли записываться на примерку?',
    answer: 'Да, вы можете забронировать удобное время, нажав на кнопку «Записаться». Мы также рады гостям без предварительной записи, однако просим учесть: если все примерочные будут заняты, вам придется немного подождать.'
  },
  {
    question: 'Можно ли прийти с сопровождающими?',
    answer: 'Конечно! Мы будем рады видеть вас с мамой, сестрой или подругами. Для комфортного размещения мы рекомендуем приглашать не более 3-4 человек.'
  },
  {
    question: 'Сколько длится примерка?',
    answer: 'Первичная примерка длится 1 час, а повторная — 30 минут. Этого времени достаточно, чтобы вы успели примерить понравившиеся модели в спокойной и максимально комфортной обстановке, а также обсудить все детали со стилистом.'
  },
  {
    question: 'Нужно ли брать с собой туфли?',
    answer: 'Брать с собой туфли совершенно не обязательно. В нашем салоне представлены удобные примерочные туфли всех необходимых размеров, поэтому вы с легкостью сможете оценить полный образ и длину платья.'
  },
  {
    question: 'А у вас большой выбор?',
    answer: 'Огромный! У нас представлены платья самых разных фасонов, моделей и оттенков. Мы стараемся обновлять ассортимент еженедельно, поэтому даже не всегда успеваем выставить фото всех новинок на сайт. Именно поэтому 90% наших гостей уходят с покупками после личного визита в салон.'
  },
  {
    question: 'Примерка бесплатная?',
    answer: 'Да, примерка всех свадебных платьев в нашем салоне абсолютно бесплатна.'
  },
  {
    question: 'Можно ли в салоне фотографироваться?',
    answer: 'Конечно! Вы можете свободно фотографироваться и снимать видео во время примерки, чтобы запечатлеть образы и сделать правильный выбор.'
  },
  {
    question: 'Возможно ли взять платье напрокат?',
    answer: 'Нет, мы не предоставляем услугу проката платьев, так как считаем, что каждая невеста достойна своего собственного, нового платья. При этом в нашем салоне представлен широкий ассортимент платьев в продаже стоимостью от 20 000 рублей.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-16 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl text-gray-900 font-light mb-4"
          >
            Частые вопросы
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-gray-600"
          >
            Всё, что нужно знать перед визитом в наш салон
          </motion.p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`border border-gray-200 rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-gray-50' : 'bg-transparent hover:bg-gray-50'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <span className="font-serif text-xl md:text-2xl text-gray-800 pr-8">{faq.question}</span>
                  <div className={`shrink-0 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180 bg-gray-100' : ''}`}>
                    {isOpen ? <Minus size={18} className="text-gray-900" /> : <Plus size={18} className="text-gray-900" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 md:px-8 pb-8 font-sans text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
