"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Trophy, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BatchCard } from "./batch-card"

const mockBatches = [
  {
    id: "1",
    product: "Air Jordan 1 Retro High Chicago",
    brand: "Nike",
    batchName: "LJR Batch",
    seller: "Mr. Hou",
    rating: 9.8,
    price: 580,
    image: "/placeholder.svg?height=300&width=300",
    pros: ["Perfekcyjna skóra", "Idealny kształt", "Świetne wykończenie"],
    cons: ["Wysoka cena"],
    reviews: 234,
    category: "Jordan",
    rank: 1,
  },
  {
    id: "2",
    product: "Travis Scott x Air Jordan 1 Low",
    brand: "Nike",
    batchName: "GD Batch",
    seller: "Coco",
    rating: 9.5,
    price: 650,
    image: "/placeholder.svg?height=300&width=300",
    pros: ["Dobry suede", "Prawidłowe kolory", "Solidne wykonanie"],
    cons: ["Suede mógłby być lepszy", "Długi czas oczekiwania"],
    reviews: 189,
    category: "Travis Scott",
    rank: 2,
  },
  {
    id: "3",
    product: "Dior B23 High-Top",
    brand: "Dior",
    batchName: "God Batch",
    seller: "Kevin",
    rating: 9.3,
    price: 720,
    image: "/placeholder.svg?height=300&width=300",
    pros: ["Luksusowe materiały", "Perfekcyjne detale", "Identyczne z oryginałem"],
    cons: ["Bardzo wysoka cena", "Długa dostawa"],
    reviews: 156,
    category: "Designer",
    rank: 3,
  },
]

export function BestBatchContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"rating" | "price" | "reviews">("rating")

  const categories = ["Jordan", "Nike", "Dior", "Travis Scott", "Off-White", "Designer"]

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">156</div>
          <div className="text-white/60 text-sm">Przetestowanych Batchy</div>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">9.2</div>
          <div className="text-white/60 text-sm">Średnia Ocena</div>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-sm">RM</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">2.5K</div>
          <div className="text-white/60 text-sm">Recenzji Społeczności</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
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
              onChange={(e) => setSortBy(e.target.value as "rating" | "price" | "reviews")}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Sortuj po ocenie</option>
              <option value="price">Sortuj po cenie</option>
              <option value="reviews">Sortuj po recenzjach</option>
            </select>

            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filtry
            </Button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={
              selectedCategory === null
                ? "bg-blue-500 hover:bg-blue-600"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }
          >
            Wszystkie
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockBatches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BatchCard batch={batch} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
