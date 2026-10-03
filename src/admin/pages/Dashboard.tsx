import { useState, useEffect } from 'react';
import { adminApi, SiteSettings, Product } from '../api/mockApi';
import MainPhotoEditor from '../components/MainPhotoEditor';
import DiscountEditor from '../components/DiscountEditor';
import ContactsEditor from '../components/ContactsEditor';
import LinksEditor from '../components/LinksEditor';
import CollectionsEditor from '../components/CollectionsEditor';
import SalonPhotosEditor from '../components/SalonPhotosEditor';
import CatalogEditor from '../components/CatalogEditor';
import NoveltiesEditor from '../components/NoveltiesEditor';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, p] = await Promise.all([
        adminApi.fetchSettings(),
        adminApi.fetchProducts()
      ]);
      setSettings(s);
      setProducts(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (updates: Partial<SiteSettings>) => {
    try {
      await adminApi.updateSettings(updates);
      await loadData();
    } catch (err: any) {
      console.error('Save settings error:', err);
      alert(' Ошибка сохранения на сервере: ' + (err.message || 'Проверьте авторизацию'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-rose-500 w-8 h-8" />
      </div>
    );
  }

  if (!settings) return <div>Load failed</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-serif text-gray-900 dark:text-white">Настройки сайта</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MainPhotoEditor 
          photo={settings.mainPhoto} 
          onSave={async (url) => {
            await handleSaveSettings({ mainPhoto: url });
          }} 
        />
        
        <DiscountEditor 
          discount={settings.discount} 
          onSave={async (val) => {
            await handleSaveSettings({ discount: val });
          }} 
        />
      </div>

      <ContactsEditor 
        contacts={settings.contacts} 
        onSave={async (contacts) => {
          await handleSaveSettings({ contacts });
        }} 
      />

      <LinksEditor 
        links={settings.links} 
        onSave={async (links) => {
          await handleSaveSettings({ links });
        }} 
      />

      <CollectionsEditor 
        media={settings.collectionsMedia} 
        onSave={async (collectionsMedia) => {
          await handleSaveSettings({ collectionsMedia });
        }} 
      />

      <SalonPhotosEditor 
        media={settings.salonMedia} 
        onSave={async (salonMedia) => {
          await handleSaveSettings({ salonMedia });
        }} 
      />

      <NoveltiesEditor 
        products={products}
        onSave={async (orderedIds) => {
          try {
            await adminApi.updateQueueOrder(orderedIds);
            await loadData();
          } catch (err: any) {
            alert(' Ошибка сохранения порядка: ' + (err.message || ' Ошибка API'));
          }
        }} 
      />

      <CatalogEditor 
        products={products}
        onRefresh={loadData}
      />
    </div>
  );
}
