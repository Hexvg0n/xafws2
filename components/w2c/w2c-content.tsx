"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Grid, List, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"

const mockProducts = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High Chicago",
    brand: "Nike",
    price: 580,
    image: "/placeholder.svg?height=300&width=300",
    seller: "Mr. Hou",
    batch: "LJR Batch",
    rating: 4.9,
    reviews: 234,
    category: "Jordan",
    size: ["40", "41", "42", "43", "44", "45"],
    colors: ["Red/White", "Black/White"],
    inStock: true,
  },
  {
    id: "2",
    name: "Dior B23 High-Top",
    brand: "Dior",
    price: 720,
    image: "/placeholder.svg?height=300&width=300",
    seller: "Kevin",
    batch: "God Batch",
    rating: 4.8,
    reviews: 156,
    category: "Designer",
    size: ["39", "40", "41", "42", "43"],
    colors: ["White/Blue"],
    inStock: true,
  },
  {
    id: "3",
    name: "Travis Scott x Air Jordan 1 Low",
    brand: "Nike",
    price: 650,
    image: "/placeholder.svg?height=300&width=300",
    seller: "Coco",
    batch: "GD Batch",
    rating: 4.7,
    reviews: 189,
    category: "Jordan",
    size: ["40", "41", "42", "43", "44"],
    colors: ["Brown/Black"],
    inStock: false,
  },
  {
    id: "4",
    name: "Off-White x Nike Air Force 1",
    brand: "Nike",
    price: 590,
    image: "/placeholder.svg?height=300&width=300",
    seller: "Monica",
    batch: "OWF Batch",
    rating: 4.6,
    reviews: 98,
    category: "Off-White",
    size: ["40", "41", "42", "43", "44", "45"],
    colors: ["White/Black"],
    inStock: true,
  },
  {
    id: "5",
    name: "Balenciaga Triple S",
    brand: "Balenciaga",
    price: 680,
    image: "/placeholder.svg?height=300&width=300",
    seller: "Bean",
    batch: "GT Batch",
    rating: 4.5,
    reviews: 67,
    category: "Designer",
    size: ["39", "40", "41", "42", "43", "44"],
    colors: ["White", "Black", "Beige"],
    inStock: true,
  },
  {
    id: "6",
    name: "Yeezy Boost 350 V2 Zebra",
    brand: "Adidas",
    price: 520,
    image: "/placeholder.svg?height=300&width=300",
    seller: "Vicky",
    batch: "PK BASF",
    rating: 4.8,
    reviews: 312,
    category: "Yeezy",
    size: ["40", "41", "42", "43", "44", "45", "46"],
    colors: ["White/Black"],
    inStock: true,
  },
]

const categories = ["Wszystkie", "Jordan", "Nike", "Adidas", "Designer", "Off-White", "Yeezy"]
const brands = ["Wszystkie", "Nike", "Adidas", "Dior", "Balenciaga", "Off-White"]
const batches = ["Wszystkie", "LJR Batch", "God Batch", "GD Batch", "OWF Batch", "GT Batch", "PK BASF"]
const sellers = ["Wszystkie", "Mr. Hou", "Kevin", "Coco", "Monica", "Bean", "Vicky"]

export function W2CContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie")
  const [selectedBrand, setSelectedBrand] = useState("Wszystkie")
  const [selectedBatch, setSelectedBatch] = useState("Wszystkie")
  const [selectedSeller, setSelectedSeller] = useState("Wszystkie")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("name")

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Wszystkie" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "Wszystkie" || product.brand === selectedBrand
    const matchesBatch = selectedBatch === "Wszystkie" || product.batch === selectedBatch
    const matchesSeller = selectedSeller === "Wszystkie" || product.seller === selectedSeller
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesRating = product.rating >= minRating
    const matchesStock = !inStockOnly || product.inStock

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesBatch &&
      matchesSeller &&
      matchesPrice &&
      matchesRating &&
      matchesStock
    )
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviews - a.reviews
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const clearFilters = () => {
    setSelectedCategory("Wszystkie")
    setSelectedBrand("Wszystkie")
    setSelectedBatch("Wszystkie")
    setSelectedSeller("Wszystkie")
    setPriceRange([0, 1000])
    setMinRating(0)
    setInStockOnly(false)
    setSearchTerm("")
  }

  return (
    <div className="space-y-6">
      {/* Search and View Controls */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sortuj: Nazwa</option>
              <option value="price-low">Sortuj: Cena rosnąco</option>
              <option value="price-high">Sortuj: Cena malejąco</option>
              <option value="rating">Sortuj: Ocena</option>
              <option value="reviews">Sortuj: Liczba recenzji</option>
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
                className={viewMode === "grid" ? "bg-blue-500 hover:bg-blue-600" : "text-white/60 hover:text-white"}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-500 hover:bg-blue-600" : "text-white/60 hover:text-white"}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-morphism rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Zaawansowane Filtry</h3>
            <div className="flex items-center space-x-2">
              <Button onClick={clearFilters} variant="ghost" size="sm" className="text-white/60 hover:text-white">
                <X className="w-4 h-4 mr-2" />
                Wyczyść
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Kategoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Marka</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            {/* Seller Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Sprzedawca</label>
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sellers.map((seller) => (
                  <option key={seller} value={seller}>
                    {seller}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Cena: {priceRange[0]} - {priceRange[1]} zł
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Min. ocena: {minRating}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Stock Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <label htmlFor="inStock" className="text-sm text-white/80">
                Tylko dostępne
              </label>
            </div>
          </div>

          <div className="mt-4 text-sm text-white/60">Znaleziono {sortedProducts.length} produktów</div>
        </motion.div>
      )}

      {/* Products Grid */}
      <div
        className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
      >
        {sortedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </motion.div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white/60 text-lg mb-4">Nie znaleziono produktów</div>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            Wyczyść filtry
          </Button>
        </div>
      )}
    </div>
  )
}
