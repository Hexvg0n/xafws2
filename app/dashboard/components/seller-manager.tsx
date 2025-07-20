"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SellerForm } from "./seller-form"

interface Seller {
  id: string
  name: string
  specialties: string[]
  rating: number
  reviews: number
  verified: boolean
  responseTime: string
  languages: string[]
  contact: {
    whatsapp: string
    wechat: string
  }
  topBatches: string[]
  image: string
  createdAt: string
}

const mockSellers: Seller[] = [
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
    createdAt: "2024-01-15",
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
    createdAt: "2024-01-14",
  },
]

export function SellerManager() {
  const [sellers, setSellers] = useState<Seller[]>(mockSellers)
  const [showForm, setShowForm] = useState(false)
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddSeller = (sellerData: Omit<Seller, "id" | "createdAt">) => {
    const newSeller: Seller = {
      ...sellerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setSellers([newSeller, ...sellers])
    setShowForm(false)
  }

  const handleEditSeller = (sellerData: Omit<Seller, "id" | "createdAt">) => {
    if (editingSeller) {
      setSellers(
        sellers.map((s) =>
          s.id === editingSeller.id ? { ...sellerData, id: editingSeller.id, createdAt: s.createdAt } : s,
        ),
      )
      setEditingSeller(null)
      setShowForm(false)
    }
  }

  const handleDeleteSeller = (id: string) => {
    setSellers(sellers.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Zarządzanie Sprzedawcami</h2>
          <p className="text-white/60">Dodawaj, edytuj i usuwaj zaufanych sprzedawców</p>
        </div>
        <Button
          onClick={() => {
            setEditingSeller(null)
            setShowForm(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj Sprzedawcę
        </Button>
      </div>

      {/* Search */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj sprzedawców..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.map((seller, index) => (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                    <span className="text-white font-bold">{seller.name.charAt(0)}</span>
                  </div>
                  {seller.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{seller.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white/80">{seller.rating}</span>
                    <span className="text-white/60">({seller.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingSeller(seller)
                    setShowForm(true)
                  }}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteSeller(seller.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-white/60 text-sm mb-1">Specjalizacje:</p>
                <div className="flex flex-wrap gap-1">
                  {seller.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-1">Top Batches:</p>
                <div className="flex flex-wrap gap-1">
                  {seller.topBatches.map((batch) => (
                    <span
                      key={batch}
                      className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded border border-white/20"
                    >
                      {batch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Odpowiedź: {seller.responseTime}</span>
                <div className="flex space-x-1">
                  {seller.languages.map((lang) => (
                    <span key={lang} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seller Form Modal */}
      {showForm && (
        <SellerForm
          seller={editingSeller}
          onSave={editingSeller ? handleEditSeller : handleAddSeller}
          onCancel={() => {
            setShowForm(false)
            setEditingSeller(null)
          }}
        />
      )}
    </div>
  )
}
