"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Clock, User, Package, Heart, MessageCircle, Share } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedCardProps {
  purchase: {
    id: string
    user: {
      name: string
      image: string
    }
    item: {
      name: string
      brand: string
      images: string[]
    }
    batch?: {
      name: string
      seller: string
    }
    price: number
    rating?: number
    review?: string
    createdAt: string
  }
}

export function FeedCard({ purchase }: FeedCardProps) {
  const timeAgo = new Date(purchase.createdAt).toLocaleDateString("pl-PL")

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white">{purchase.user.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <Clock className="w-4 h-4" />
                <span>{timeAgo}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-400">{purchase.price} zł</div>
              {purchase.rating && (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < purchase.rating! ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Item Info */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={purchase.item.images[0] || "/placeholder.svg"}
                alt={purchase.item.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{purchase.item.name}</h4>
              <p className="text-white/60 text-sm mb-2">{purchase.item.brand}</p>
              {purchase.batch && (
                <div className="flex items-center space-x-2 text-sm">
                  <Package className="w-4 h-4 text-violet-400" />
                  <span className="text-violet-400 font-medium">{purchase.batch.name}</span>
                  <span className="text-white/60">od {purchase.batch.seller}</span>
                </div>
              )}
            </div>
          </div>

          {/* Review */}
          {purchase.review && (
            <div className="bg-white/5 rounded-lg p-4 mb-4 group-hover:bg-white/10 transition-colors duration-300">
              <p className="text-white/80 leading-relaxed">"{purchase.review}"</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4 pt-2 border-t border-white/10">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-emerald-400 hover:bg-emerald-400/10">
              <Heart className="w-4 h-4 mr-2" />
              Polub
            </Button>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-violet-400 hover:bg-violet-400/10">
              <MessageCircle className="w-4 h-4 mr-2" />
              Komentarz
            </Button>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <Share className="w-4 h-4 mr-2" />
              Udostępnij
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
