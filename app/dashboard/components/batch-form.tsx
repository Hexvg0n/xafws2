"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Upload, Star, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Batch {
  id: string
  product: string
  brand: string
  batchName: string
  seller: string
  rating: number
  price: number
  image: string
  pros: string[]
  cons: string[]
  reviews: number
  category: string
  rank: number
  createdAt: string
}

interface BatchFormProps {
  batch?: Batch | null
  onSave: (batch: Omit<Batch, "id" | "createdAt" | "rank">) => void
  onCancel: () => void
}

const categories = ["Jordan", "Nike", "Adidas", "Designer", "Off-White", "Yeezy", "Travis Scott", "Dunk"]
const sellers = ["Mr. Hou", "Kevin", "Coco", "Monica", "Bean", "Vicky", "Tony", "Muks"]
const batches = ["LJR Batch", "God Batch", "GD Batch", "OWF Batch", "GT Batch", "PK BASF", "H12 Batch"]

export function BatchForm({ batch, onSave, onCancel }: BatchFormProps) {
  const [formData, setFormData] = useState({
    product: "",
    brand: "",
    batchName: "",
    seller: "",
    rating: 8.0,
    price: 0,
    image: "",
    pros: [] as string[],
    cons: [] as string[],
    reviews: 0,
    category: "",
  })

  const [newPro, setNewPro] = useState("")
  const [newCon, setNewCon] = useState("")

  useEffect(() => {
    if (batch) {
      setFormData({
        product: batch.product,
        brand: batch.brand,
        batchName: batch.batchName,
        seller: batch.seller,
        rating: batch.rating,
        price: batch.price,
        image: batch.image,
        pros: batch.pros,
        cons: batch.cons,
        reviews: batch.reviews,
        category: batch.category,
      })
    }
  }, [batch])

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

  const addPro = () => {
    if (newPro.trim() && !formData.pros.includes(newPro.trim())) {
      setFormData({ ...formData, pros: [...formData.pros, newPro.trim()] })
      setNewPro("")
    }
  }

  const removePro = (index: number) => {
    setFormData({ ...formData, pros: formData.pros.filter((_, i) => i !== index) })
  }

  const addCon = () => {
    if (newCon.trim() && !formData.cons.includes(newCon.trim())) {
      setFormData({ ...formData, cons: [...formData.cons, newCon.trim()] })
      setNewCon("")
    }
  }

  const removeCon = (index: number) => {
    setFormData({ ...formData, cons: formData.cons.filter((_, i) => i !== index) })
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
          <h2 className="text-2xl font-bold text-white">{batch ? "Edytuj Batch" : "Dodaj Nowy Batch"}</h2>
          <Button onClick={onCancel} variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Zdjęcie produktu</label>
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
                  id="batch-image-upload"
                />
                <label
                  htmlFor="batch-image-upload"
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
              <label className="block text-sm font-medium text-white/80 mb-2">Nazwa produktu *</label>
              <input
                type="text"
                required
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Air Jordan 1 Chicago"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Marka *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Nike"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Batch *</label>
              <select
                required
                value={formData.batchName}
                onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz batch</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Ocena (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Cena (zł) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="580"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Liczba recenzji</label>
              <input
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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

          {/* Pros */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Zalety</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPro())}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dodaj zaletę..."
                />
                <Button type="button" onClick={addPro} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-500/20 rounded-lg p-3">
                    <span className="text-green-400">{pro}</span>
                    <Button
                      type="button"
                      onClick={() => removePro(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cons */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Wady</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCon())}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dodaj wadę..."
                />
                <Button type="button" onClick={addCon} size="sm" className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-500/20 rounded-lg p-3">
                    <span className="text-red-400">{con}</span>
                    <Button
                      type="button"
                      onClick={() => removeCon(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
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
              <Star className="w-4 h-4 mr-2" />
              {batch ? "Zapisz Zmiany" : "Dodaj Batch"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
