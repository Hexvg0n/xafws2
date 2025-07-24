"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Grid, List, SlidersHorizontal, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"

// Zaktualizowany typ produktu
type Product = {
  _id: string;
  name: string;
  brand: string;
  priceCNY: number;
  seller: string;
  batch: string;
  hearts: number;
  views: number;
  category?: string;
  inStock?: boolean;
  sourceUrl: string;
};

const categories = ["Wszystkie", "Jordan", "Nike", "Adidas", "Designer", "Off-White", "Yeezy"];
const brands = ["Wszystkie", "Nike", "Adidas", "Dior", "Balenciaga", "Off-White"];
const batches = ["Wszystkie", "LJR Batch", "God Batch", "GD Batch", "OWF Batch", "GT Batch", "PK BASF"];
const sellers = ["Wszystkie", "Mr. Hou", "Kevin", "Coco", "Monica", "Bean", "Vicky"];

export function W2CContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Stany filtrów
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [selectedBrand, setSelectedBrand] = useState("Wszystkie");
  const [selectedBatch, setSelectedBatch] = useState("Wszystkie");
  const [selectedSeller, setSelectedSeller] = useState("Wszystkie");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("name");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać produktów z serwera.');
      }
      const data = await response.json();
      const mappedData = data.map((p: any) => ({
        ...p,
        brand: p.platform || 'Nieznana',
        seller: p.shopInfo?.shopName || 'Nieznany',
        batch: 'N/A',
        hearts: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 5000),
        inStock: true,
      }));
      setProducts(mappedData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Logika filtrowania
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Wszystkie" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "Wszystkie" || product.brand === selectedBrand;
    const matchesBatch = selectedBatch === "Wszystkie" || product.batch === selectedBatch;
    const matchesSeller = selectedSeller === "Wszystkie" || product.seller === selectedSeller;
    const matchesPrice = product.priceCNY >= priceRange[0] && product.priceCNY <= priceRange[1];
    
    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesBatch &&
      matchesSeller &&
      matchesPrice
    );
  });

  // Logika sortowania
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.priceCNY - b.priceCNY;
      case "price-high":
        return b.priceCNY - a.priceCNY;
      case "hearts":
        return b.hearts - a.hearts;
      case "views":
        return b.views - a.views;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const clearFilters = () => {
    setSelectedCategory("Wszystkie");
    setSelectedBrand("Wszystkie");
    setSelectedBatch("Wszystkie");
    setSelectedSeller("Wszystkie");
    setPriceRange([0, 1000]);
    setSearchTerm("");
  };

  if (isLoading) {
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
              <option value="name">Sortuj: Nazwa</option>
              <option value="price-low">Sortuj: Cena rosnąco</option>
              <option value="price-high">Sortuj: Cena malejąco</option>
              <option value="hearts">Sortuj: Polubienia</option>
              <option value="views">Sortuj: Wyświetlenia</option>
            </select>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtry
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-emerald-500 hover:bg-emerald-600" : "text-white/60 hover:text-white"}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-emerald-500 hover:bg-emerald-600" : "text-white/60 hover:text-white"}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-morphism rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Zaawansowane Filtry</h3>
            <Button onClick={clearFilters} variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <X className="w-4 h-4 mr-2" />
              Wyczyść
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Kategoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Marka</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {batches.map((batch) => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Sprzedawca</label>
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {sellers.map((seller) => (
                  <option key={seller} value={seller}>{seller}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Cena: {priceRange[0]} - {priceRange[1]} ¥</label>
              <div className="flex items-center space-x-2">
                <input type="range" min="0" max="1000" value={priceRange[0]} onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])} className="flex-1" />
                <input type="range" min="0" max="1000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])} className="flex-1" />
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-white/60">Znaleziono {sortedProducts.length} produktów</div>
        </motion.div>
      )}

      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {sortedProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </motion.div>
        ))}
      </div>

      {sortedProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">Nie znaleziono produktów spełniających kryteria.</div>
            <Button onClick={clearFilters} variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">Wyczyść filtry</Button>
        </div>
      )}
    </div>
  )
}