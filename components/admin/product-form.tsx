"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Upload, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  seller: string
  batch: string
  category: string
  inStock: boolean
  createdAt: string
}

interface ProductFormProps {
  product?: Product | null
  onSave: (product: Omit<Product, "id" | "createdAt">) => void
  onCancel: () => void
}

const categories = ["Jordan", "Nike", "Adidas", "Designer", "Off-White", "Yeezy", "Dunk", "Travis Scott"]
const sellers = ["Mr. Hou", "Kevin", "Coco", "Monica", "Bean", "Vicky", "Tony", "Muks"]
const batches = ["LJR Batch", "God Batch", "GD Batch", "OWF Batch", "GT Batch", "PK BASF", "H12 Batch"]

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: 0,
    image: "",
    seller: "",
    batch: "",
    category: "",
    inStock: true,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        seller: product.seller,
        batch: product.batch,
        category: product.category,
        inStock: product.inStock,
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // W prawdziwej aplikacji tutaj byłby upload do serwera
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
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
        className="glass-morphism rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{product ? "Edytuj Produkt" : "Dodaj Nowy Produkt"}</h2>
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
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Batch *</label>
              <select
                required
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
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
          </div>

          {/* Stock Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <span className="text-white/80">Produkt dostępny w magazynie</span>
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
              <Package className="w-4 h-4 mr-2" />
              {product ? "Zapisz Zmiany" : "Dodaj Produkt"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
