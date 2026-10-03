/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import CookieConsent from './components/CookieConsent';
import { FavoritesProvider } from './context/FavoritesContext';
import { SettingsProvider } from './context/SettingsContext';
import AdminApp from './admin/AdminApp';

function ScrollHandler() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.pathname === window.location.pathname) {
        const element = document.getElementById(anchor.hash.replace('#', ''));
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', anchor.href);
        }
      }
    };
    
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return null;
}

export default function App() {
  return (
    <SettingsProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ScrollHandler />
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<MainApp />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </SettingsProvider>
  );
}

function MainApp() {
  return (
    <div className="relative min-h-screen selection:bg-rose-200 selection:text-gray-900">
      {/* Static Background */}
      <div className="bg-dynamic" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<ProductDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <CookieConsent />
    </div>
  );
}
