export interface Dress {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge: string;
  available: boolean;
  category: string;
  dateAdded: string;
}

export const ALL_DRESSES: Dress[] = [];
