"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import { BatchCard } from "./batch-card"
import type { IBatch } from "@/models/Batch";

export function BestBatchContent() {
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBatches = useCallback(async () => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/batches');
        if (!res.ok) throw new Error("Błąd pobierania batchy");
        setBatches(await res.json() as IBatch[]);
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const filteredBatches = batches.filter(batch =>
    batch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.batch_name.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Szukaj produktów lub batchy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBatches.map((batch, index) => (
          <motion.div
            key={batch.id.toString()} // POPRAWKA: Konwersja _id na string
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <BatchCard batch={batch} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}