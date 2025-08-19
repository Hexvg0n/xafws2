// components/context/WishlistProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface WishlistContextType {
  wishlist: any[];
  setWishlist: React.Dispatch<React.SetStateAction<any[]>>;
  toggleFavorite: (product: any) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (status === 'authenticated') {
        setIsLoading(true);
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            setWishlist(data.wishlist || []);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        } finally {
          setIsLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setWishlist([]);
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [status]);

  const toggleFavorite = async (product: any) => {
    if (!session) {
      alert("Musisz być zalogowany, aby zarządzać ulubionymi.");
      return;
    }

    const isCurrentlyFavorited = wishlist.some(item => item._id === product._id);
    const originalWishlist = [...wishlist];

    // Optymistyczna aktualizacja UI
    const newWishlist = isCurrentlyFavorited
      ? wishlist.filter(item => item._id !== product._id)
      : [...wishlist, product];
    setWishlist(newWishlist);

    try {
      await Promise.all([
        fetch('/api/profile/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        }),
        fetch('/api/stats/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: !isCurrentlyFavorited ? 'productFavorite' : 'productUnfavorite',
            id: product._id
          }),
        })
      ]);
    } catch (error) {
      alert("Wystąpił błąd. Przywracanie poprzedniego stanu.");
      setWishlist(originalWishlist);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, toggleFavorite, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
};