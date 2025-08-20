// components/best-batch/best-batch-content.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BatchCard } from "./batch-card";
import { useWishlist } from "../context/WishlistProvider";
import { usePreferences } from "../context/PreferencesProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Batch = any;

export function BestBatchContent() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { wishlist, toggleFavorite } = useWishlist();
  const { isLoading: isLoadingPreferences } = usePreferences();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("createdAt");

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const batchesRes = await fetch('/api/batches');
      
      if (!batchesRes.ok) throw new Error('Nie udało się pobrać batchy.');
      
      setBatches(await batchesRes.json());
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  
  const filteredBatches = batches
    .filter((batch) => {
        return batch.name.toLowerCase().includes(searchTerm.toLowerCase()) || batch.batch.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const sortedBatches = [...filteredBatches].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return (a.priceCNY || 0) - (b.priceCNY || 0);
        case "price-high": return (b.priceCNY || 0) - (a.priceCNY || 0);
        case "hearts": return (b.favorites || 0) - (a.favorites || 0);
        case "views": return (b.views || 0) - (a.views || 0);
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (isLoading || isLoadingPreferences) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-emerald-500" /></div>;
  }
  
  if (error) {
    return <div className="text-center text-red-400 py-12">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj batchy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white">
              <option value="createdAt">Sortuj: Najnowsze</option>
              <option value="price-low">Sortuj: Cena rosnąco</option>
              <option value="price-high">Sortuj: Cena malejąco</option>
              <option value="hearts">Sortuj: Polubienia</option>
              <option value="views">Sortuj: Wyświetlenia</option>
            </select>
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-emerald-500" : "text-white/60"}><Grid className="w-4 h-4" /></Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-emerald-500" : "text-white/60"}><List className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {sortedBatches.map((batch, index) => (
          <motion.div key={batch._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <BatchCard
              batch={batch}
              viewMode={viewMode}
              isFavorited={wishlist.batches.some((item: any) => item._id === batch._id)}
              onToggleFavorite={() => toggleFavorite(batch, 'batch')}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}