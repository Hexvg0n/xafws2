"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { GuideCard } from "./guide-card"

const mockGuides = [
  {
    id: "1",
    title: "Jak kupić swoje pierwsze repliki - Kompletny przewodnik",
    description: "Wszystko co musisz wiedzieć przed pierwszym zakupem replik. Od wyboru sprzedawcy po odbiór paczki.",
    category: "Dla początkujących",
    readTime: "15 min",
    author: "RepMafia Team",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Łatwy",
    tags: ["Podstawy", "Zakupy", "Sprzedawcy"],
  },
  {
    id: "2",
    title: "QC Guide - Jak sprawdzać jakość replik",
    description: "Naucz się profesjonalnie oceniać jakość replik na podstawie zdjęć QC od sprzedawców.",
    category: "QC i Jakość",
    readTime: "20 min",
    author: "QC Expert",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Średni",
    tags: ["QC", "Jakość", "Ocena"],
  },
  {
    id: "3",
    title: "Shipping Guide - Wysyłka i cła",
    description: "Wszystko o wysyłce replik do Polski, deklarowaniu wartości i unikaniu problemów celnych.",
    category: "Wysyłka",
    readTime: "12 min",
    author: "Shipping Pro",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Średni",
    tags: ["Wysyłka", "Cła", "Polska"],
  },
  {
    id: "4",
    title: "Size Guide - Jak dobrać rozmiar",
    description: "Kompletny przewodnik po rozmiarach replik. Tabele rozmiarów i porady dotyczące dopasowania.",
    category: "Rozmiary",
    readTime: "10 min",
    author: "Size Expert",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Łatwy",
    tags: ["Rozmiary", "Dopasowanie", "Tabele"],
  },
  {
    id: "5",
    title: "Batch Guide - Różnice między batchami",
    description: "Poznaj różnice między popularnymi batchami i dowiedz się, który wybrać dla konkretnego produktu.",
    category: "Batche",
    readTime: "18 min",
    author: "Batch Specialist",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Zaawansowany",
    tags: ["Batche", "Porównania", "Jakość"],
  },
  {
    id: "6",
    title: "Agent vs Direct - Który sposób wybrać",
    description: "Porównanie zakupów przez agenta vs bezpośrednio od sprzedawcy. Zalety i wady każdego rozwiązania.",
    category: "Zakupy",
    readTime: "14 min",
    author: "Shopping Guide",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Średni",
    tags: ["Agent", "Direct", "Zakupy"],
  },
]

export function HowToContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  const categories = ["Dla początkujących", "QC i Jakość", "Wysyłka", "Rozmiary", "Batche", "Zakupy"]
  const difficulties = ["Łatwy", "Średni", "Zaawansowany"]

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj przewodników..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Kategorie:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === null
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                }`}
              >
                Wszystkie
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Poziom trudności:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedDifficulty === null
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                }`}
              >
                Wszystkie
              </button>
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedDifficulty === difficulty
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGuides.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GuideCard guide={guide} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
