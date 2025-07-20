"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Upload, Percent } from "lucide-react"
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
  createdAt: string
}

interface PromoFormProps {
  promo?: Promo | null
  onSave: (promo: Omit<Promo, "id" | "createdAt" | "currentUses">) => void
  onCancel: () => void
}

const categories = ["Wszystkie", "Jordan", "Nike", "Adidas", "Designer", "Off-White", "Yeezy", "Travis Scott"]
const sellers = ["Wszystkie", "Mr. Hou", "Kevin", "Coco", "Monica", "Bean", "Vicky", "Tony", "Muks"]

export function PromoForm({ promo, onSave, onCancel }: PromoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    discount: 0,
    discountType: "percentage" as "percentage" | "fixed",
    minOrder: 0,
    maxUses: 100,
    startDate: "",
    endDate: "",
    isActive: true,
    seller: "",
    category: "",
    image: "",
  })

  useEffect(() => {
    if (promo) {
      setFormData({
        title: promo.title,
        description: promo.description,
        code: promo.code,
        discount: promo.discount,
        discountType: promo.discountType,
        minOrder: promo.minOrder,
        maxUses: promo.maxUses,
        startDate: promo.startDate,
        endDate: promo.endDate,
        isActive: promo.isActive,
        seller: promo.seller,
        category: promo.category,
        image: promo.image,
      })
    }
  }, [promo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code: result })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-morphism rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{promo ? "Edytuj Promocję" : "Dodaj Nową Promocję"}</h2>
          <Button onClick={onCancel} variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Zdjęcie promocji</label>
            <div className="flex items-center space-x-4">
              {formData.image && (
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="promo-image-upload"
                />
                <label
                  htmlFor="promo-image-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors"
                >
                  <Upload className="w-5 h-5 text-white/60 mr-2" />
                  <span className="text-white/60">Wybierz zdjęcie</span>
                </label>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Tytuł promocji *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Zniżka na Jordan 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Kod promocyjny *</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="JORDAN50"
                />
                <Button type="button" onClick={generateCode} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Generuj
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Opis promocji</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opisz promocję..."
            />
          </div>

          {/* Discount Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Typ zniżki *</label>
              <select
                required
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Procent (%)</option>
                <option value="fixed">Kwota (zł)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Wartość zniżki * {formData.discountType === "percentage" ? "(%)" : "(zł)"}
              </label>
              <input
                type="number"
                required
                min="0"
                max={formData.discountType === "percentage" ? "100" : undefined}
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={formData.discountType === "percentage" ? "15" : "50"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Min. wartość zamówienia (zł)</label>
              <input
                type="number"
                min="0"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="500"
              />
            </div>
          </div>

          {/* Usage and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Max. liczba użyć</label>
              <input
                type="number"
                min="1"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Data rozpoczęcia *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Data zakończenia *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category and Seller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Kategoria *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz kategorię</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Sprzedawca *</label>
              <select
                required
                value={formData.seller}
                onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz sprzedawcę</option>
                {sellers.map((seller) => (
                  <option key={seller} value={seller}>
                    {seller}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <span className="text-white/80">Promocja aktywna</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
            <Button onClick={onCancel} variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
              Anuluj
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
            >
              <Percent className="w-4 h-4 mr-2" />
              {promo ? "Zapisz Zmiany" : "Dodaj Promocję"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
