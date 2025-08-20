// components/profile/FavoritesTab.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Loader2, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistProvider"; // <<< DODANY IMPORT

export default function FavoritesTab() {
  const { wishlist, toggleFavorite, isLoading } = useWishlist(); // <<< ZMIENIONA LINIA

  const allFavorites = [...(wishlist.products || []), ...(wishlist.batches || [])];

  const handleRemoveFavorite = async (item: any) => {
    const itemType = item.batch ? 'batch' : 'product';
    await toggleFavorite(item, itemType);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle>Twoje Polubione Przedmioty ({allFavorites.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {allFavorites.length > 0 ? (
          <div className="space-y-4">
            {allFavorites.map(item => (
              <div key={item._id} className="flex items-center gap-4 glass-morphism p-4 rounded-lg">
                <Link href={item.batch ? `/bb/${item._id}` : `/w2c/${item._id}`}>
                  <Image src={item.thumbnailUrl || '/placeholder.svg'} alt={item.name} width={64} height={64} className="w-16 h-16 rounded-md object-cover"/>
                </Link>
                <div className="flex-grow">
                  <Link href={item.batch ? `/bb/${item._id}` : `/w2c/${item._id}`}>
                    <p className="font-semibold hover:text-emerald-400 transition-colors">{item.name}</p>
                  </Link>
                  <p className="text-sm text-white/60">{item.shopInfo?.ShopName || 'Brak sprzedawcy'}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-emerald-400">{item.priceCNY} ¥</p>
                </div>
                <Button onClick={() => handleRemoveFavorite(item)} variant="ghost" size="sm" className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-white/20 rounded-lg">
            <Info className="w-8 h-8 text-white/50 mb-2" />
            <p className="text-white/70">Nie masz jeszcze żadnych polubionych przedmiotów.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}