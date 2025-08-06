"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Copy, Check, Gift, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { IPromo } from "@/models/Promo";

export function PromotionsPage() {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/promos');
      if (!res.ok) throw new Error("Błąd pobierania danych");
      setPromos(await res.json() as IPromo[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const filteredPromos = promos.filter((promo) =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-10 w-10 animate-spin text-blue-400" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj promocji po nazwie lub kodzie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo, index) => (
          <motion.div
            key={promo.id.toString()} // POPRAWKA: Konwersja _id na string
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-morphism rounded-2xl p-6 group"
          >
            <img src={promo.image} alt={promo.title} className="w-full h-40 object-cover rounded-lg mb-4"/>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{promo.title}</h3>
            <p className="text-sm text-neutral-400 mb-2">Od: {promo.seller}</p>
            <p className="text-lg font-semibold text-blue-400 mb-4">{promo.price} PLN</p>
            
            <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                <span className="font-mono text-lg text-white">{promo.code}</span>
                <Button size="sm" onClick={() => copyCode(promo.code)}>
                    {copiedCode === promo.code ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4" />}
                </Button>
            </div>
          </motion.div>
        ))}
      </div>
       {filteredPromos.length === 0 && !isLoading && (
        <div className="text-center py-12 col-span-full">
          <Gift className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Brak promocji</h3>
          <p className="text-white/60">Nie znaleziono promocji spełniających kryteria.</p>
        </div>
      )}
    </div>
  )
}