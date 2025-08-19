// components/profile/FavoritesTab.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Loader2, Trash2 } from "lucide-react";

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.wishlist || []);
      }
    } catch (error) {
      console.error(error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (productId: string) => {
    const originalFavorites = [...favorites];
    setFavorites(prev => prev.filter(p => p._id !== productId));

    try {
      await Promise.all([
        fetch('/api/profile/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        }),
        fetch('/api/stats/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'productUnfavorite', id: productId }),
        })
      ]);
    } catch (error) {
      alert("Wystąpił błąd. Odśwież stronę.");
      setFavorites(originalFavorites);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle>Twoje Polubione Przedmioty ({favorites.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map(product => (
              <div key={product._id} className="flex items-center gap-4 glass-morphism p-4 rounded-lg">
                <Link href={`/w2c/${product._id}`}>
                  <Image src={product.thumbnailUrl || '/placeholder.svg'} alt={product.name} width={64} height={64} className="w-16 h-16 rounded-md object-cover"/>
                </Link>
                <div className="flex-grow">
                  <Link href={`/w2c/${product._id}`}>
                    <p className="font-semibold hover:text-emerald-400 transition-colors">{product.name}</p>
                  </Link>
                  <p className="text-sm text-white/60">{product.shopInfo?.ShopName || 'Brak sprzedawcy'}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-emerald-400">{product.priceCNY} ¥</p>
                </div>
                <Button onClick={() => handleRemoveFavorite(product._id)} variant="ghost" size="sm" className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
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