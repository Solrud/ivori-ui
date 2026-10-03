import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi, SiteSettings, Product } from '../admin/api/mockApi';
import { preloadImage } from '../utils/imageCache';

interface SettingsContextType {
  settings: SiteSettings | null;
  products: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(() => {
    try {
      const cached = localStorage.getItem('ivory_site_settings');
      if (cached) {
        const parsed = JSON.parse(cached) as SiteSettings;
        if (parsed?.mainPhoto) {
          preloadImage(parsed.mainPhoto);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached site settings', e);
    }
    return null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('ivory_products');
      if (cached) {
        return JSON.parse(cached) as Product[];
      }
    } catch {}
    return [];
  });

  const [loading, setLoading] = useState(!settings);

  const refresh = async () => {
    try {
      const [s, p] = await Promise.all([
        adminApi.fetchSettings(),
        adminApi.fetchProducts()
      ]);
      setSettings(s);
      setProducts(p);

      try {
        localStorage.setItem('ivory_site_settings', JSON.stringify(s));
        localStorage.setItem('ivory_products', JSON.stringify(p));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }

      if (s?.mainPhoto) {
        preloadImage(s.mainPhoto);
      }
    } catch (err) {
      console.error("Failed to load site settings or products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, products, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
