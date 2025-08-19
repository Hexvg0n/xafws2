// components/w2c/w2c-content.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Grid, List, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { useWishlist } from "../context/WishlistProvider";
import { usePreferences } from "../context/PreferencesProvider";

type Product = any; // Uproszczony typ dla elastyczności

export function W2CContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { wishlist, toggleFavorite } = useWishlist();
  const { isLoading: isLoadingPreferences } = usePreferences();
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const productsRes = await fetch('/api/products');
      if (!productsRes.ok) throw new Error('Nie udało się pobrać produktów.');
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sortedProducts = [...products]
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
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
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="createdAt">Sortuj: Najnowsze</option>
              <option value="price-low">Sortuj: Cena rosnąco</option>
              <option value="price-high">Sortuj: Cena malejąco</option>
              <option value="hearts">Sortuj: Polubienia</option>
              <option value="views">Sortuj: Wyświetlenia</option>
            </select>
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-emerald-500 hover:bg-emerald-600" : "text-white/60 hover:text-white"}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-emerald-500 hover:bg-emerald-600" : "text-white/60 hover:text-white"}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {sortedProducts.map((product, index) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <ProductCard
              product={product}
              viewMode={viewMode}
              isFavorited={wishlist.some(item => item._id === product._id)}
              onToggleFavorite={() => toggleFavorite(product)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}