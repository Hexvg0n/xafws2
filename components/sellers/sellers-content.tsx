"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import { SellerCard } from "./seller-card"
import type { ISeller } from "@/models/Seller";

export function SellersContent() {
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSellers = useCallback(async () => {
      setIsLoading(true);
      try {
          const res = await fetch('/api/sellers');
          if (!res.ok) throw new Error("Błąd pobierania sprzedawców");
          setSellers(await res.json());
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-10 w-10 animate-spin text-blue-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj sprzedawców..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.map((seller, index) => (
          <motion.div
            key={seller.id.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SellerCard seller={seller} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}