// lib/types.ts

export type UserRole = 'root' | 'admin' | 'adder';

export type User = { 
  _id: string; 
  nickname: string; 
  role: UserRole; 
  status: 'aktywny' | 'oczekujący' | 'zawieszony' | 'zablokowany'; 
  createdAt: string; 
};

export type Product = {
  _id: string;
  name: string;
  sourceUrl: string;
  thumbnailUrl?: string;
  //platform: string;
  mainImages: string[];
  descriptionImages: string[];
  priceCNY: number;
  availableColors: string[];
  availableSizes: string[];
  shopInfo?: {
    shopName?: string;
    shopLogo?: string;
    shopId?: string;
  };
  views?: number;
  favorites?: number;
};

export type Seller = {
  _id: string;
  name: string;
  image: string;
  link: string;
  rating: number;
  description: string;
  clicks: number;
};

export type Batch = {
  _id: string;
  title: string;
  image: string;
  price: number;
  link: string;
  batch_name: string;
  views: number;
  favorites: number;
  clicks: number;
};

export type AdminTab = "stats" | "products" | "user-management" | "user-approval" | "promos" | "sellers" | "batches" | "role-management";