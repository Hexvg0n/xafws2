// components/context/WishlistProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Define the shape of our wishlist state
interface WishlistState {
  products: any[];
  batches: any[];
}

interface WishlistContextType {
  wishlist: WishlistState;
  toggleFavorite: (item: any, itemType: 'product' | 'batch') => Promise<void>;
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
  const [wishlist, setWishlist] = useState<WishlistState>({ products: [], batches: [] });
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
            setWishlist({
              products: data.wishlist || [],
              batches: data.batchWishlist || [],
            });
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        } finally {
          setIsLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setWishlist({ products: [], batches: [] });
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [status]);

  const toggleFavorite = async (item: any, itemType: 'product' | 'batch') => {
    if (!session) {
      alert("Musisz być zalogowany, aby zarządzać ulubionymi.");
      return;
    }

    const listKey = itemType === 'product' ? 'products' : 'batches';
    const isCurrentlyFavorited = wishlist[listKey].some(i => i._id === item._id);
    const originalWishlist = { ...wishlist };

    // Optimistic UI update
    const newList = isCurrentlyFavorited
      ? wishlist[listKey].filter(i => i._id !== item._id)
      : [...wishlist[listKey], item];
    
    setWishlist(prev => ({ ...prev, [listKey]: newList }));

    try {
      await Promise.all([
        fetch('/api/profile/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: item._id, itemType }),
        }),
        fetch('/api/stats/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: !isCurrentlyFavorited ? `${itemType}Favorite` : `${itemType}Unfavorite`,
            id: item._id
          }),
        })
      ]);
    } catch (error) {
      alert("Wystąpił błąd. Przywracanie poprzedniego stanu.");
      setWishlist(originalWishlist);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleFavorite, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
};