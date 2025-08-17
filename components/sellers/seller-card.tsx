"use client"

import { motion } from "framer-motion"
import { Star, Shield, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ISeller } from "@/models/Seller"; // Używamy typu z modelu

interface SellerCardProps {
  seller: ISeller
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl p-6 h-full flex flex-col hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="flex items-start space-x-4 mb-4">
        <img src={seller.image} alt={seller.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/20"/>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{seller.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white/80 font-medium">{seller.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-white/70 text-sm mb-4 leading-relaxed flex-grow">{seller.description}</p>
      
      <div className="border-t border-white/10 pt-4 flex items-center justify-between">
          <p className="text-xs text-white/50">Kliknięcia: {seller.clicks}</p>
           <Button size="sm" variant="outline">Zobacz profil</Button>
      </div>
    </motion.div>
  )
}