"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SellerCard } from "./seller-card"

const mockSellers = [
  {
    id: "1",
    name: "Mr. Hou",
    specialties: ["Jordan", "Nike", "Dunk"],
    rating: 4.9,
    reviews: 1250,
    verified: true,
    responseTime: "2-4h",
    languages: ["EN", "CN"],
    contact: {
      whatsapp: "+86 181 8333 8814",
      wechat: "MrHou-rep",
    },
    topBatches: ["LJR", "OG", "GET"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Coco",
    specialties: ["Travis Scott", "Off-White", "Jordan"],
    rating: 4.8,
    reviews: 980,
    verified: true,
    responseTime: "1-3h",
    languages: ["EN", "CN"],
    contact: {
      whatsapp: "+86 180 5957 6801",
      wechat: "coco-dis",
    },
    topBatches: ["GD", "GP", "PK"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Kevin",
    specialties: ["Dior", "Balenciaga", "Designer"],
    rating: 4.7,
    reviews: 756,
    verified: true,
    responseTime: "3-6h",
    languages: ["EN", "CN", "FR"],
    contact: {
      whatsapp: "+86 131 6080 5690",
      wechat: "kevin-reps",
    },
    topBatches: ["God", "H12", "PK"],
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function SellersContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)

  const specialties = ["Jordan", "Nike", "Dior", "Travis Scott", "Off-White", "Balenciaga", "Designer"]

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj sprzedawców..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filtry
          </Button>
        </div>

        {/* Specialty filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSpecialty === null ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedSpecialty(null)}
            className={
              selectedSpecialty === null
                ? "bg-blue-500 hover:bg-blue-600"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }
          >
            Wszystkie
          </Button>
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedSpecialty(specialty)}
              className={
                selectedSpecialty === specialty
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSellers.map((seller, index) => (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SellerCard seller={seller} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
