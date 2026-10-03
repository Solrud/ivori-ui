import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div id="not-found-page" className="relative min-h-screen text-gray-900 flex flex-col justify-between">
      <Header />
      
      <main className="pt-40 pb-24 px-6 md:px-16 max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <span className="font-sans text-rose-500 font-semibold tracking-widest text-sm uppercase block">
            Код ошибки 404
          </span>
          
          <h1 className="font-serif text-6xl md:text-8xl font-light text-gray-900 leading-tight">
            Страница не найдена
          </h1>
          
          <p className="font-sans text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            К сожалению, запрашиваемая страница не существует или была перемещена по другому адресу.
          </p>
          
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-rose-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <ArrowLeft size={16} />
              <span>Вернуться на главную</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
