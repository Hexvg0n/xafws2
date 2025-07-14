"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PromoForm } from "./promo-form"
import type { Promo } from "@/types/promo"
import { mockPromos } from "@/data/promos"

export function PromoManager() {
  const [promos, setPromos] = useState<Promo[]>(mockPromos)
  const [showForm, setShowForm] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPromos = promos.filter(
    (promo) =>
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.seller.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPromo = (promoData: Omit<Promo, "id" | "createdAt" | "currentUses">) => {
    const newPromo: Promo = {
      ...promoData,
      id: Date.now().toString(),
      currentUses: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setPromos([newPromo, ...promos])
    setShowForm(false)
  }

  const handleEditPromo = (promoData: Omit<Promo, "id" | "createdAt" | "currentUses">) => {
    if (editingPromo) {
      setPromos(
        promos.map((p) =>
          p.id === editingPromo.id
            ? { ...promoData, id: editingPromo.id, currentUses: editingPromo.currentUses, createdAt: p.createdAt }
            : p,
        ),
      )
      setEditingPromo(null)
      setShowForm(false)
    }
  }

  const handleDeletePromo = (id: string) => {
    setPromos(promos.filter((p) => p.id !== id))
  }

  const togglePromoStatus = (id: string) => {
    setPromos(promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const getDiscountText = (promo: Promo) => {
    if (promo.discount === 0) return "Darmowa wysyłka"
    return promo.discountType === "percentage" ? `${promo.discount}%` : `${promo.discount} zł`
  }

  const getStatusColor = (promo: Promo) => {
    if (!promo.isActive) return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    const now = new Date()
    const endDate = new Date(promo.endDate)
    if (endDate < now) return "bg-red-500/20 text-red-400 border-red-500/30"
    return "bg-green-500/20 text-green-400 border-green-500/30"
  }

  const getStatusText = (promo: Promo) => {
    if (!promo.isActive) return "Nieaktywna"
    const now = new Date()
    const endDate = new Date(promo.endDate)
    if (endDate < now) return "Wygasła"
    return "Aktywna"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Zarządzanie Promocjami</h2>
          <p className="text-white/60">Dodawaj, edytuj i zarządzaj kodami promocyjnymi</p>
        </div>
        <Button
          onClick={() => {
            setEditingPromo(null)
            setShowForm(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj Promocję
        </Button>
      </div>

      {/* Search */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj promocji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative">
              <div className="aspect-video bg-white/5">
                <img src={promo.image || "/placeholder.svg"} alt={promo.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(promo)}`}>
                  {getStatusText(promo)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
                  <span className="font-bold text-sm">{getDiscountText(promo)}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{promo.title}</h3>
              <p className="text-white/70 text-sm mb-4">{promo.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Kod:</span>
                  <span className="text-blue-400 font-mono font-bold">{promo.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Min. zamówienie:</span>
                  <span className="text-white">{promo.minOrder} zł</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Wykorzystane:</span>
                  <span className="text-white">
                    {promo.currentUses}/{promo.maxUses}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Ważna do:</span>
                  <span className="text-white">{promo.endDate}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">{promo.category}</span>
                <span className="text-white/60 text-sm">• {promo.seller}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>Wykorzystanie</span>
                  <span>{Math.round((promo.currentUses / promo.maxUses) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(promo.currentUses / promo.maxUses) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingPromo(promo)
                      setShowForm(true)
                    }}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletePromo(promo.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={() => togglePromoStatus(promo.id)}
                  className={
                    promo.isActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }
                >
                  {promo.isActive ? "Dezaktywuj" : "Aktywuj"}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Promo Form Modal */}
      {showForm && (
        <PromoForm
          promo={editingPromo}
          onSave={editingPromo ? handleEditPromo : handleAddPromo}
          onCancel={() => {
            setShowForm(false)
            setEditingPromo(null)
          }}
        />
      )}
    </div>
  )
}
