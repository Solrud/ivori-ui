// API Integration for Ivory Backend (https://cj718300.tw1.ru)

const API_BASE_URL = 'https://cj718300.tw1.ru';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'А-силуэт' | 'Рыбка' | 'Пышные' | 'Минимализм';
  order: number;
  inQueue: boolean;
  queueOrder: number;
  oldPrice?: number;
  badge?: string;
  description?: string;
  images?: string[];
  sizes?: string[];
  brand?: string;
}

export interface Booking {
  id: string | number;
  clientName: string;
  clientPhone: string;
  preferredDate?: string;
  preferredTime?: string;
  status?: string;
  adminComment?: string;
  createdAt?: string;
}

export interface SiteSettings {
  mainPhoto: string;
  discount: number;
  contacts: {
    description: string;
    phone: string;
    email: string;
  };
  links: {
    vk: string;
    max: string;
    youtube: string;
    tg: string;
  };
  collectionsMedia: Record<string, { type: 'image' | 'video'; url: string }>;
  salonMedia: Record<string, { type: 'image' | 'video'; url: string }>;
}

const defaultSettings: SiteSettings = {
  mainPhoto: '',
  discount: 10,
  contacts: {
    description: 'Мы с радостью поможем вам с выбором платья мечты!',
    phone: '+7 (999) 123-45-67',
    email: 'info@ivory-salon.ru',
  },
  links: {
    vk: 'https://vk.com/ivory',
    max: 'https://2gis.ru/perm/search/%D0%BB%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0%2090/firm/70000001047906981/56.209228%2C58.005686?m=56.209108%2C58.005644%2F19.84',
    youtube: '',
    tg: 'https://t.me/ivory',
  },
  collectionsMedia: {},
  salonMedia: {}
};

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private getAuthHeaders(isJson = true): Record<string, string> {
    const headers: Record<string, string> = {};
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // 1. AUTH
  async login(email: string, password: string): Promise<{ token: string; user?: { email: string } }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const resData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg = resData.error || resData.message || 'Неверный email или пароль';
      throw new Error(msg);
    }

    if (resData.token) {
      this.setToken(resData.token);
    }

    return { token: resData.token, user: resData.user || { email } };
  }

  async register(email: string, password: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const resData = await response.json().catch(() => ({}));
      throw new Error(resData.error || ' Ошибка при регистрации пользователя');
    }
    return await response.json();
  }

  async getMe(): Promise<{ email: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: this.getAuthHeaders(false)
    });
    if (!response.ok) {
      throw new Error('Сессия недействительна');
    }
    return await response.json();
  }

  // 2. SETTINGS
  async fetchSettings(): Promise<SiteSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();

      return {
        mainPhoto: data.mainPhotoUrl || data.mainPhoto || defaultSettings.mainPhoto,
        discount: typeof data.discount === 'number' ? data.discount : defaultSettings.discount,
        contacts: {
          description: data.contacts?.description || defaultSettings.contacts.description,
          phone: data.contacts?.phone || defaultSettings.contacts.phone,
          email: data.contacts?.email || defaultSettings.contacts.email,
        },
        links: {
          vk: data.links?.vk ?? defaultSettings.links.vk,
          max: data.links?.max ?? defaultSettings.links.max,
          youtube: data.links?.youtube ?? defaultSettings.links.youtube,
          tg: data.links?.tg ?? defaultSettings.links.tg,
        },
        collectionsMedia: data.collectionsMedia || {},
        salonMedia: data.salonMedia || {},
      };
    } catch (e) {
      console.warn('API settings error, using default layout:', e);
      return defaultSettings;
    }
  }

  async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    // Process media files to upload base64 images to server first
    const processedUpdates = { ...updates };

    if (processedUpdates.mainPhoto && processedUpdates.mainPhoto.startsWith('data:')) {
      processedUpdates.mainPhoto = await this.uploadFile(processedUpdates.mainPhoto);
    }

    if (processedUpdates.collectionsMedia) {
      const updatedMedia: Record<string, { type: 'image' | 'video'; url: string }> = {};
      for (const [key, item] of Object.entries(processedUpdates.collectionsMedia)) {
        if (item.url && item.url.startsWith('data:')) {
          const uploadedUrl = await this.uploadFile(item.url);
          updatedMedia[key] = { ...item, url: uploadedUrl };
        } else {
          updatedMedia[key] = item;
        }
      }
      processedUpdates.collectionsMedia = updatedMedia;
    }

    if (processedUpdates.salonMedia) {
      const updatedSalon: Record<string, { type: 'image' | 'video'; url: string }> = {};
      for (const [key, item] of Object.entries(processedUpdates.salonMedia)) {
        if (item.url && item.url.startsWith('data:')) {
          const uploadedUrl = await this.uploadFile(item.url);
          updatedSalon[key] = { ...item, url: uploadedUrl };
        } else {
          updatedSalon[key] = item;
        }
      }
      processedUpdates.salonMedia = updatedSalon;
    }

    const body: Record<string, any> = { ...processedUpdates };
    if (processedUpdates.mainPhoto) {
      body.mainPhotoUrl = processedUpdates.mainPhoto;
    }

    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'POST',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      throw new Error(errRes.error || ' Ошибка сохранения настроек на сервере');
    }

    return this.fetchSettings();
  }

  // 3. PRODUCTS CATALOG
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item: any, idx: number) => ({
        id: String(item.id),
        name: item.name || '',
        price: Number(item.price) || 0,
        oldPrice: item.oldPrice ? Number(item.oldPrice) : undefined,
        badge: item.badge || undefined,
        category: (item.silhouette || item.category || 'А-силуэт') as any,
        image: (Array.isArray(item.images) && item.images[0]) || item.image || '',
        order: item.queueOrder ?? idx,
        inQueue: Boolean(item.inQueue),
        queueOrder: typeof item.queueOrder === 'number' ? item.queueOrder : -1,
        description: item.description || '',
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : []),
        sizes: Array.isArray(item.sizes) ? item.sizes : ['42', '44', '46'],
        brand: item.brand || 'Ivory'
      }));
    } catch (e) {
      console.warn('Backend API products error:', e);
      return [];
    }
  }

  async fetchProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!response.ok) return null;
      const item = await response.json();
      return {
        id: String(item.id),
        name: item.name || '',
        price: Number(item.price) || 0,
        oldPrice: item.oldPrice ? Number(item.oldPrice) : undefined,
        badge: item.badge || undefined,
        category: (item.silhouette || item.category || 'А-силуэт') as any,
        image: (Array.isArray(item.images) && item.images[0]) || item.image || '',
        order: item.queueOrder ?? 0,
        inQueue: Boolean(item.inQueue),
        queueOrder: typeof item.queueOrder === 'number' ? item.queueOrder : -1,
        description: item.description || '',
        images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
        sizes: Array.isArray(item.sizes) ? item.sizes : [],
        brand: item.brand || ''
      };
    } catch (e) {
      return null;
    }
  }

  async addProduct(p: Omit<Product, 'id'>): Promise<Product> {
    let mainImg = p.image;
    if (mainImg && mainImg.startsWith('data:')) {
      mainImg = await this.uploadFile(mainImg);
    }

    let allImgs = p.images || [mainImg];
    if (Array.isArray(allImgs)) {
      allImgs = await Promise.all(
        allImgs.map(img => (img && img.startsWith('data:') ? this.uploadFile(img) : Promise.resolve(img)))
      );
    }

    const payload = {
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      badge: p.badge ?? null,
      silhouette: p.category,
      brand: p.brand || 'Ivory',
      description: p.description || '',
      images: allImgs,
      sizes: p.sizes || ['42', '44', '46']
    };

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || ' Ошибка добавления товара на сервер');
    }

    const res = await response.json();

    return {
      ...p,
      id: String(res.id || Date.now()),
      image: mainImg,
      images: allImgs
    };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    let newImage = updates.image;
    if (newImage && newImage.startsWith('data:')) {
      newImage = await this.uploadFile(newImage);
    }

    let newImages = updates.images;
    if (Array.isArray(newImages)) {
      newImages = await Promise.all(
        newImages.map(img => (img && img.startsWith('data:') ? this.uploadFile(img) : Promise.resolve(img)))
      );
    }

    const payload = {
      name: updates.name,
      price: updates.price,
      oldPrice: updates.oldPrice ?? null,
      badge: updates.badge ?? null,
      silhouette: updates.category,
      brand: updates.brand || 'Ivory',
      description: updates.description || '',
      images: newImages || (newImage ? [newImage] : []),
      sizes: updates.sizes || ['42', '44']
    };

    const response = await fetch(`${API_BASE_URL}/api/products/${id}?action=update`, {
      method: 'POST',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || ' Ошибка обновления товара на сервере');
    }

    return {
      id,
      name: updates.name || '',
      price: updates.price || 0,
      oldPrice: updates.oldPrice,
      badge: updates.badge,
      category: (updates.category || 'А-силуэт') as any,
      image: newImage || '',
      images: newImages || [],
      order: updates.order || 0,
      inQueue: !!updates.inQueue,
      queueOrder: updates.queueOrder ?? -1
    };
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}?action=delete`, {
      method: 'POST',
      headers: this.getAuthHeaders(false)
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || ' Ошибка удаления товара с сервера');
    }
  }

  // 4. QUEUE / NOVELTIES
  async updateQueueOrder(orderedIds: string[]): Promise<void> {
    const numericIds = orderedIds.map(id => isNaN(Number(id)) ? id : Number(id));
    const response = await fetch(`${API_BASE_URL}/api/queue/order`, {
      method: 'POST',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify({ orderedIds: numericIds })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || ' Ошибка сохранения порядка новинок');
    }
  }

  // 5. BOOKINGS
  async createBooking(data: { clientName: string; clientPhone: string; preferredDate?: string; preferredTime?: string }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Ошибка создания заявки');
  }

  async fetchBookings(): Promise<Booking[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: this.getAuthHeaders(false)
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.warn('Failed to fetch bookings:', e);
      return [];
    }
  }

  async updateBookingStatus(id: string | number, status: string, adminComment?: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      method: 'POST',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify({ status, adminComment })
    });
    if (!response.ok) throw new Error('Ошибка обновления статуса заявки');
  }

  // 6. UPLOAD
  async uploadFile(fileBase64: string): Promise<string> {
    if (!fileBase64 || !fileBase64.startsWith('data:')) {
      return fileBase64;
    }
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify({ file: fileBase64 })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || ' Ошибка загрузки файла на сервер');
    }
    const res = await response.json();
    return res.url || res.path || fileBase64;
  }
}

export const adminApi = new ApiService();
