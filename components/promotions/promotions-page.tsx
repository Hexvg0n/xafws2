"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Copy, Check, Calendar, Tag, Percent, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Promo {
  id: string
  title: string
  description: string
  code: string
  discount: number
  discountType: "percentage" | "fixed"
  minOrder: number
  maxUses: number
  currentUses: number
  startDate: string
  endDate: string
  isActive: boolean
  seller: string
  category: string
  image: string
}

const mockPromos: Promo[] = [
  {
    id: "1",
    title: "Zniżka na Jordan 1",
    description: "Specjalna promocja na wszystkie modele Air Jordan 1. Najwyższa jakość w najlepszej cenie!",
    code: "JORDAN50",
    discount: 50,
    discountType: "fixed",
    minOrder: 500,
    maxUses: 100,
    currentUses: 23,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    isActive: true,
    seller: "Mr. Hou",
    category: "Jordan",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "15% na Designer",
    description: "Rabat na wszystkie produkty Designer od najlepszych sprzedawców",
    code: "DESIGNER15",
    discount: 15,
    discountType: "percentage",
    minOrder: 800,
    maxUses: 50,
    currentUses: 12,
    startDate: "2024-01-10",
    endDate: "2024-01-31",
    isActive: true,
    seller: "Kevin",
    category: "Designer",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Darmowa wysyłka",
    description: "Bezpłatna wysyłka przy zamówieniu powyżej 300zł. Oszczędź na kosztach dostawy!",
    code: "FREESHIP",
    discount: 0,
    discountType: "fixed",
    minOrder: 300,
    maxUses: 200,
    currentUses: 89,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    isActive: true,
    seller: "Wszyscy",
    category: "Wszystkie",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Travis Scott Special",
    description: "Ekskluzywna zniżka na wszystkie produkty Travis Scott",
    code: "TRAVIS20",
    discount: 20,
    discountType: "percentage",
    minOrder: 600,
    maxUses: 75,
    currentUses: 34,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    isActive: true,
    seller: "Coco",
    category: "Travis Scott",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "Yeezy Madness",
    description: "Szalone ceny na wszystkie modele Yeezy. Nie przegap okazji!",
    code: "YEEZY100",
    discount: 100,
    discountType: "fixed",
    minOrder: 700,
    maxUses: 60,
    currentUses: 18,
    startDate: "2024-01-25",
    endDate: "2024-02-25",
    isActive: true,
    seller: "Vicky",
    category: "Yeezy",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    title: "Off-White Weekend",
    description: "Weekendowa promocja na produkty Off-White",
    code: "OFFWHITE25",
    discount: 25,
    discountType: "percentage",
    minOrder: 900,
    maxUses: 40,
    currentUses: 8,
    startDate: "2024-01-26",
    endDate: "2024-01-28",
    isActive: true,
    seller: "Monica",
    category: "Off-White",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function PromotionsPage() {
  const [promos] = useState<Promo[]>(mockPromos)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const categories = ["Wszystkie", "Jordan", "Designer", "Travis Scott", "Yeezy", "Off-White"]
  const sellers = ["Wszyscy", "Mr. Hou", "Kevin", "Coco", "Vicky", "Monica"]

  const filteredPromos = promos.filter((promo) => {
    const matchesSearch =
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || selectedCategory === "Wszystkie" || promo.category === selectedCategory
    const matchesSeller = !selectedSeller || selectedSeller === "Wszyscy" || promo.seller === selectedSeller

    return matchesSearch && matchesCategory && matchesSeller && promo.isActive
  })

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getDiscountText = (promo: Promo) => {
    if (promo.discount === 0) return "Darmowa wysyłka"
    return promo.discountType === "percentage" ? `${promo.discount}%` : `${promo.discount} zł`
  }

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <Gift className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{filteredPromos.length}</div>
          <div className="text-white/60 text-sm">Aktywne promocje</div>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <Percent className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(
              filteredPromos.reduce(
                (acc, promo) => acc + (promo.discountType === "percentage" ? promo.discount : 0),
                0,
              ) / filteredPromos.filter((p) => p.discountType === "percentage").length || 0,
            )}
            %
          </div>
          <div className="text-white/60 text-sm">Średnia zniżka</div>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <Tag className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{categories.length - 1}</div>
          <div className="text-white/60 text-sm">Kategorii</div>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {filteredPromos.length > 0 ? Math.min(...filteredPromos.map((p) => getDaysLeft(p.endDate))) : "–"}
          </div>
          <div className="text-white/60 text-sm">Dni do końca</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj promocji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent w-full md:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtry
          </Button>
        </div>

        {/* Category and Seller filters */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Kategorie:</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category || (selectedCategory === null && category === "Wszystkie")
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
            <h4 className="text-sm font-medium text-white/80 mb-2">Sprzedawcy:</h4>
            <div className="flex flex-wrap gap-2">
              {sellers.map((seller) => (
                <button
                  key={seller}
                  onClick={() => setSelectedSeller(selectedSeller === seller ? null : seller)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedSeller === seller || (selectedSeller === null && seller === "Wszyscy")
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {seller}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
          >
            {/* Image and Discount Badge */}
            <div className="relative">
              <div className="aspect-video bg-white/5">
                <img
                  src={promo.image || "/placeholder.svg"}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-4 left-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1 rounded-full">
                  <span className="font-bold text-sm">{getDiscountText(promo)}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-black/20 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs">
                  {getDaysLeft(promo.endDate)} dni
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                {promo.title}
              </h3>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">{promo.description}</p>

              {/* Code Section */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Kod promocyjny:</p>
                    <p className="text-white font-mono font-bold text-lg">{promo.code}</p>
                  </div>
                  <Button
                    onClick={() => copyCode(promo.code)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    {copiedCode === promo.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Min. zamówienie:</span>
                  <span className="text-white">{promo.minOrder} zł</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Wykorzystane:</span>
                  <span className="text-white">
                    {promo.currentUses}/{promo.maxUses}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Ważna do:</span>
                  <span className="text-white">{promo.endDate}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Wykorzystanie</span>
                  <span>{Math.round((promo.currentUses / promo.maxUses) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(promo.currentUses / promo.maxUses) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                    {promo.category}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                    {promo.seller}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPromos.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Brak promocji</h3>
          <p className="text-white/60">Nie znaleziono promocji spełniających kryteria wyszukiwania.</p>
        </div>
      )}

      {/* Tips */}
      <div className="glass-morphism rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">💡 Wskazówki dotyczące promocji</h4>
        <ul className="space-y-2 text-white/70 text-sm">
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            Sprawdź minimalną wartość zamówienia przed użyciem kodu
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            Niektóre promocje mogą się wykluczać wzajemnie
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            Kody promocyjne są ważne tylko przez ograniczony czas
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            Skontaktuj się ze sprzedawcą, aby potwierdzić dostępność promocji
          </li>
        </ul>
      </div>
    </div>
  )
}
