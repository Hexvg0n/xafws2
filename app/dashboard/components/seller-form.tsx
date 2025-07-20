"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface SellerFormProps {
  seller?: Seller | null
  onSave: (seller: Omit<Seller, "id" | "createdAt">) => void
  onCancel: () => void
}

const availableSpecialties = ["Jordan", "Nike", "Adidas", "Designer", "Off-White", "Yeezy", "Dunk", "Travis Scott"]
const availableBatches = ["LJR", "God", "GD", "OWF", "GT", "PK", "H12", "OG", "GET", "GP"]
const availableLanguages = ["EN", "CN", "PL", "FR", "DE", "ES", "RU"]

export function SellerForm({ seller, onSave, onCancel }: SellerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    specialties: [] as string[],
    rating: 4.0,
    reviews: 0,
    verified: false,
    responseTime: "",
    languages: [] as string[],
    contact: {
      whatsapp: "",
      wechat: "",
    },
    topBatches: [] as string[],
    image: "",
  })

  useEffect(() => {
    if (seller) {
      setFormData({
        name: seller.name,
        specialties: seller.specialties,
        rating: seller.rating,
        reviews: seller.reviews,
        verified: seller.verified,
        responseTime: seller.responseTime,
        languages: seller.languages,
        contact: seller.contact,
        topBatches: seller.topBatches,
        image: seller.image,
      })
    }
  }, [seller])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addSpecialty = (specialty: string) => {
    if (!formData.specialties.includes(specialty)) {
      setFormData({ ...formData, specialties: [...formData.specialties, specialty] })
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData({ ...formData, specialties: formData.specialties.filter((s) => s !== specialty) })
  }

  const addBatch = (batch: string) => {
    if (!formData.topBatches.includes(batch)) {
      setFormData({ ...formData, topBatches: [...formData.topBatches, batch] })
    }
  }

  const removeBatch = (batch: string) => {
    setFormData({ ...formData, topBatches: formData.topBatches.filter((b) => b !== batch) })
  }

  const addLanguage = (language: string) => {
    if (!formData.languages.includes(language)) {
      setFormData({ ...formData, languages: [...formData.languages, language] })
    }
  }

  const removeLanguage = (language: string) => {
    setFormData({ ...formData, languages: formData.languages.filter((l) => l !== language) })
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
          <h2 className="text-2xl font-bold text-white">{seller ? "Edytuj Sprzedawcę" : "Dodaj Nowego Sprzedawcę"}</h2>
          <Button onClick={onCancel} variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Nazwa sprzedawcy *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Mr. Hou"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Czas odpowiedzi</label>
              <input
                type="text"
                value={formData.responseTime}
                onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. 2-4h"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Ocena (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
                />
                <span className="text-white/80">Zweryfikowany sprzedawca</span>
              </label>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">WhatsApp</label>
              <input
                type="text"
                value={formData.contact.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, contact: { ...formData.contact, whatsapp: e.target.value } })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+86 181 8333 8814"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">WeChat</label>
              <input
                type="text"
                value={formData.contact.wechat}
                onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, wechat: e.target.value } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MrHou-rep"
              />
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Specjalizacje</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableSpecialties.map((specialty) => (
                  <Button
                    key={specialty}
                    type="button"
                    size="sm"
                    variant={formData.specialties.includes(specialty) ? "default" : "ghost"}
                    onClick={() =>
                      formData.specialties.includes(specialty) ? removeSpecialty(specialty) : addSpecialty(specialty)
                    }
                    className={
                      formData.specialties.includes(specialty)
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded border border-blue-500/30 flex items-center space-x-1"
                  >
                    <span>{specialty}</span>
                    <button type="button" onClick={() => removeSpecialty(specialty)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Batches */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Najlepsze Batches</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableBatches.map((batch) => (
                  <Button
                    key={batch}
                    type="button"
                    size="sm"
                    variant={formData.topBatches.includes(batch) ? "default" : "ghost"}
                    onClick={() => (formData.topBatches.includes(batch) ? removeBatch(batch) : addBatch(batch))}
                    className={
                      formData.topBatches.includes(batch)
                        ? "bg-green-500 hover:bg-green-600"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  >
                    {batch}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.topBatches.map((batch) => (
                  <span
                    key={batch}
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded border border-green-500/30 flex items-center space-x-1"
                  >
                    <span>{batch}</span>
                    <button type="button" onClick={() => removeBatch(batch)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Języki</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((language) => (
                  <Button
                    key={language}
                    type="button"
                    size="sm"
                    variant={formData.languages.includes(language) ? "default" : "ghost"}
                    onClick={() =>
                      formData.languages.includes(language) ? removeLanguage(language) : addLanguage(language)
                    }
                    className={
                      formData.languages.includes(language)
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  >
                    {language}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((language) => (
                  <span
                    key={language}
                    className="px-2 py-1 bg-purple-500/20 text-purple-400 text-sm rounded border border-purple-500/30 flex items-center space-x-1"
                  >
                    <span>{language}</span>
                    <button type="button" onClick={() => removeLanguage(language)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
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
              <Users className="w-4 h-4 mr-2" />
              {seller ? "Zapisz Zmiany" : "Dodaj Sprzedawcę"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
