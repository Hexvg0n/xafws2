// components/w2c/w2c-content.tsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Grid, List, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { useWishlist } from "../context/WishlistProvider";
import { usePreferences } from "../context/PreferencesProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = any;
type Category = {
    _id: string;
    name: string;
};

const ITEMS_PER_PAGE = 24;

export function W2CContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { wishlist, toggleFavorite } = useWishlist();
  const { isLoading: isLoadingPreferences } = usePreferences();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore]);


  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      
      if (!productsRes.ok) throw new Error('Nie udało się pobrać produktów.');
      if (!categoriesRes.ok) throw new Error('Nie udało się pobrać kategorii.');
      
      const allProducts = await productsRes.json();
      setProducts(allProducts);
      setCategories(await categoriesRes.json());
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const applyFiltersAndSorting = useCallback(() => {
    const filtered = products
      .filter((product) => {
          const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
          return matchesSearch && matchesCategory;
      });

    const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "price-low": return (a.priceCNY || 0) - (b.priceCNY || 0);
          case "price-high": return (b.priceCNY || 0) - (a.priceCNY || 0);
          case "hearts": return (b.favorites || 0) - (a.favorites || 0);
          case "views": return (b.views || 0) - (a.views || 0);
          default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
      
      setPage(1);
      setDisplayedProducts(sorted.slice(0, ITEMS_PER_PAGE));
      setHasMore(sorted.length > ITEMS_PER_PAGE);

  }, [products, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [applyFiltersAndSorting]);

  useEffect(() => {
    if (page > 1 && hasMore && !isFetchingMore) {
      setIsFetchingMore(true);
      const filtered = products
        .filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "price-low": return (a.priceCNY || 0) - (b.priceCNY || 0);
          case "price-high": return (b.priceCNY || 0) - (a.priceCNY || 0);
          case "hearts": return (b.favorites || 0) - (a.favorites || 0);
          case "views": return (b.views || 0) - (a.views || 0);
          default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
      const nextPageProducts = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
      
      setTimeout(() => { // Symulacja opóźnienia sieciowego dla lepszego UX
        setDisplayedProducts(prev => [...prev, ...nextPageProducts]);
        setHasMore(sorted.length > page * ITEMS_PER_PAGE);
        setIsFetchingMore(false);
      }, 500);
    }
  }, [page, products, hasMore, isFetchingMore, searchTerm, selectedCategory, sortBy]);


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
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-auto bg-white/5 border-white/10">
                    <SelectValue placeholder="Filtruj po kategorii..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Wszystkie Kategorie</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-auto bg-white/5 border-white/10">
                  <SelectValue placeholder="Sortuj..." />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="createdAt">Sortuj: Najnowsze</SelectItem>
                  <SelectItem value="price-low">Sortuj: Cena rosnąco</SelectItem>
                  <SelectItem value="price-high">Sortuj: Cena malejąco</SelectItem>
                  <SelectItem value="hearts">Sortuj: Polubienia</SelectItem>
                  <SelectItem value="views">Sortuj: Wyświetlenia</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-emerald-500" : "text-white/60"}><Grid className="w-4 h-4" /></Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-emerald-500" : "text-white/60"}><List className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {displayedProducts.map((product, index) => {
          if (displayedProducts.length === index + 1) {
            return (
              <motion.div ref={lastProductElementRef} key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <ProductCard
                  product={product}
                  viewMode={viewMode}
                  isFavorited={wishlist.products.some((item: any) => item._id === product._id)}
                  onToggleFavorite={() => toggleFavorite(product, 'product')}
                />
              </motion.div>
            )
          } else {
            return (
              <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <ProductCard
                  product={product}
                  viewMode={viewMode}
                  isFavorited={wishlist.products.some((item: any) => item._id === product._id)}
                  onToggleFavorite={() => toggleFavorite(product, 'product')}
                />
              </motion.div>
            )
          }
        })}
      </div>

      {isFetchingMore && (
        <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      )}

      {!hasMore && displayedProducts.length > 0 && (
        <div className="text-center text-white/70 py-8">
            <p>To już wszystko!</p>
        </div>
      )}
    </div>
  )
}