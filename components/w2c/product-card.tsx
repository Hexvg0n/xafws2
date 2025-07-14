"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Eye, Heart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: {
    id: string
    name: string
    brand: string
    price: number
    image: string
    seller: string
    batch: string
    rating: number
    reviews: number
    category?: string
    inStock?: boolean
  }
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="glass-morphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
      >
        <div className="flex items-center space-x-6">
          <Link href={`/w2c/${product.id}`} className="block">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 hover:scale-105 transition-transform duration-300">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          <div className="flex-1">
            <Link href={`/w2c/${product.id}`}>
              <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-white/60 mb-2">{product.brand}</p>
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white/80">{product.rating}</span>
                <span className="text-white/60">({product.reviews})</span>
              </div>
              <span className="text-blue-400 font-medium">{product.batch}</span>
              <span className="text-white/60">by {product.seller}</span>
              {product.inStock !== undefined && (
                <div className={`flex items-center space-x-1 ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                  <Package className="w-4 h-4" />
                  <span className="text-sm">{product.inStock ? "Dostępne" : "Brak"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400 mb-4">{product.price} zł</div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                <Heart className="w-4 h-4" />
              </Button>
              <Link href={`/w2c/${product.id}`}>
                <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-400">
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="relative">
        <Link href={`/w2c/${product.id}`}>
          <div className="aspect-square bg-white/5 cursor-pointer">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="absolute top-4 right-4">
          <Button size="sm" variant="ghost" className="bg-black/20 backdrop-blur-md text-white hover:bg-black/40">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        {product.inStock !== undefined && !product.inStock && (
          <div className="absolute top-4 left-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full px-2 py-1">
            <span className="text-red-400 text-xs font-medium">Brak</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <Link href={`/w2c/${product.id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-white/60 mb-3">{product.brand}</p>

        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white/80 text-sm">{product.rating}</span>
            <span className="text-white/60 text-sm">({product.reviews})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-blue-400 font-medium text-sm">{product.batch}</div>
            <div className="text-white/60 text-sm">by {product.seller}</div>
          </div>
          <div className="text-xl font-bold text-blue-400">{product.price} zł</div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/w2c/${product.id}`} className="flex-1">
            <Button size="sm" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10">
              <Eye className="w-4 h-4 mr-2" />
              Zobacz
            </Button>
          </Link>
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
            disabled={product.inStock === false}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            W2C
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
