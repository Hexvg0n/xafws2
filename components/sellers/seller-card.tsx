"use client"

import { motion } from "framer-motion"
import { Star, Shield, Clock, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SellerCardProps {
  seller: {
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
  }
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{seller.name.charAt(0)}</span>
          </div>
          {seller.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
            {seller.name}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white/80 font-medium">{seller.rating}</span>
              <span className="text-white/60 text-sm">({seller.reviews})</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <Clock className="w-4 h-4" />
            <span>Odpowiada w {seller.responseTime}</span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white/80 mb-2">Specjalizacje:</h4>
        <div className="flex flex-wrap gap-2">
          {seller.specialties.map((specialty) => (
            <span
              key={specialty}
              className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Top Batches */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white/80 mb-2">Najlepsze Batche:</h4>
        <div className="flex flex-wrap gap-2">
          {seller.topBatches.map((batch) => (
            <span
              key={batch}
              className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20"
            >
              {batch}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/80 mb-2">Języki:</h4>
        <div className="flex space-x-2">
          {seller.languages.map((lang) => (
            <span key={lang} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="space-y-2">
        <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white">
          <Phone className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
          <MessageCircle className="w-4 h-4 mr-2" />
          WeChat
        </Button>
      </div>
    </motion.div>
  )
}
