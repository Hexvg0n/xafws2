// app/w2c/[id]/page.tsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react"; // <-- DODAJ useRef
import { useSession } from "next-auth/react";
import { ProductDetails } from "@/components/w2c/product-details";
import { Loader2 } from "lucide-react";

type Product = any;

async function getProductById(id: string): Promise<Product | null> {
    const res = await fetch('/api/products');
    if (!res.ok) {
        throw new Error("Błąd pobierania danych z API");
    }
    const products = await res.json();
    return products.find((p: any) => p._id === id) || null;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { data: session } = useSession();
  
  // ZMIANA: Dodajemy flagę useRef, aby śledzić, czy wyświetlenie zostało już zliczone
  const hasTrackedView = useRef(false);

  const fetchProductAndWishlist = useCallback(async () => {
    // Nie resetujemy tutaj ładowania, aby uniknąć migotania
    try {
      const foundProduct = await getProductById(params.id);

      if (foundProduct) {
        setProduct(foundProduct);
        // ZMIANA: Zliczamy wyświetlenie tylko wtedy, gdy flaga jest fałszywa
        if (!hasTrackedView.current) {
          fetch('/api/stats/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'productView', id: params.id }),
          });
          hasTrackedView.current = true; // Ustawiamy flagę na true po zliczeniu
        }
      } else {
        setError("Nie znaleziono produktu o podanym ID.");
      }

      if (session) {
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setWishlist(profileData.wishlist?.map((p: any) => p._id) || []);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, session]);

  useEffect(() => {
    if (params.id) {
      fetchProductAndWishlist();
    }
  }, [params.id, fetchProductAndWishlist]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
       <div className="flex justify-center items-center min-h-screen">
        <p className="text-white/70">Nie znaleziono produktu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <ProductDetails 
        product={product} 
        initialWishlist={wishlist}
        onWishlistChange={setWishlist}
      />
    </div>
  );
}