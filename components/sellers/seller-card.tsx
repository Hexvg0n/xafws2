// components/sellers/seller-card.tsx

"use client"

import Link from "next/link";
import { Star, Link as LinkIcon, BarChart } from "lucide-react";
import { type Seller } from "@/lib/types";
import { pluralizePolish } from "@/lib/utils"; 
interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {

  // --- NOWA FUNKCJA DO ŚLEDZENIA KLIKNIĘĆ ---
  const handleTrackClick = async () => {
    try {
      await fetch('/api/stats/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sellerClick', id: seller._id }),
      });
    } catch (error) {
      console.error("Failed to track seller click:", error);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 flex flex-col h-full hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={seller.image || '/placeholder.svg'}
            alt={seller.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
          />
          <div>
            <h3 className="text-xl font-bold text-white">{seller.name}</h3>
            <div className="flex items-center space-x-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < seller.rating ? 'fill-current' : 'text-yellow-400/30'}`}
                />
              ))}
              <span className="text-white/80 text-sm ml-1">{seller.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-white/70 flex-grow mb-4">{seller.description}</p>
      
      <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
         <div className="flex items-center text-sm text-white/60 space-x-2">
            <BarChart className="w-4 h-4" />
            <span>{pluralizePolish(seller.clicks || 0, ['kliknięcie', 'kliknięcia', 'kliknięć'])}</span>
        </div>
        <Link
          href={seller.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
          // ZMIANA: Dodajemy obsługę kliknięcia
          onClick={handleTrackClick}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Przejdź do sklepu</span>
        </Link>
      </div>
    </div>
  )
}