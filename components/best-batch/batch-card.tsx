"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Trophy, ThumbsUp, ThumbsDown, Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BatchCardProps {
  batch: {
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
  }
}

export function BatchCard({ batch }: BatchCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
    >
      {/* Rank Badge */}
      <div className="relative">
        <div className="aspect-square bg-white/5">
          <Image
            src={batch.image || "/placeholder.svg"}
            alt={batch.product}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-3 py-1 rounded-full flex items-center space-x-1">
            <Trophy className="w-4 h-4" />
            <span className="font-bold text-sm">#{batch.rank}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
            <span className="font-bold text-sm">{batch.rating}/10</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
          {batch.product}
        </h3>
        <p className="text-white/60 mb-3">{batch.brand}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-blue-400 font-medium text-sm">{batch.batchName}</div>
            <div className="text-white/60 text-sm">by {batch.seller}</div>
          </div>
          <div className="text-xl font-bold text-blue-400">{batch.price} zł</div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white/80 text-sm">{batch.rating}/10</span>
          </div>
          <div className="text-white/60 text-sm">{batch.reviews} recenzji</div>
        </div>

        {/* Pros and Cons */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium text-sm">Zalety</span>
            </div>
            <ul className="space-y-1">
              {batch.pros.slice(0, 2).map((pro, index) => (
                <li key={index} className="text-white/70 text-xs flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ThumbsDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium text-sm">Wady</span>
            </div>
            <ul className="space-y-1">
              {batch.cons.slice(0, 2).map((con, index) => (
                <li key={index} className="text-white/70 text-xs flex items-center space-x-2">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" className="flex-1 text-white/60 hover:text-white hover:bg-white/10">
            <Eye className="w-4 h-4 mr-2" />
            Szczegóły
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Kup
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
