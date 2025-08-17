"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    brand: string;
    priceCNY: number;
    seller: string;
    batch: string;
    hearts: number;
    views: number;
    category?: string;
    inStock?: boolean;
    sourceUrl: string;
  }
  viewMode: "grid" | "list"
}

// Komponent dla "thumbnaila" w stylu kodu
const CodeThumbnail = () => (
    <div className="aspect-square w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-emerald-600/20 group-hover:from-emerald-900/30 group-hover:to-emerald-600/30 transition-all duration-300">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500/40">
            <path d="M10 20.25L4.75 15L10 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 20.25L19.25 15L14 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);


export function ProductCard({ product, viewMode }: ProductCardProps) {
  // Widok listy
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="glass-morphism rounded-2xl p-6 hover:bg-white/10"
      >
        <div className="flex items-center space-x-6">
            <Link href={`/w2c/${product._id}`} className="block flex-shrink-0">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5">
                    <CodeThumbnail />
                </div>
            </Link>
            <div className="flex-1 min-w-0">
                 <Link href={`/w2c/${product._id}`}>
                    <h3 className="text-xl font-semibold text-white mb-2 hover:text-emerald-400 transition-colors truncate">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm mb-3">
                    <span className="text-white/60">{product.brand}</span>
                    <span className="text-emerald-400 font-medium">{product.batch}</span>
                    <span className="text-white/60">by {product.seller}</span>
                </div>
                 <div className="flex items-center space-x-4 text-white/70 text-sm">
                    <div className="flex items-center space-x-1.5"><Heart className="w-4 h-4 text-red-400/70" /> <span>{product.hearts}</span></div>
                    <div className="flex items-center space-x-1.5"><Eye className="w-4 h-4" /> <span>{product.views}</span></div>
                </div>
            </div>
             <div className="text-right flex flex-col items-end">
                <div className="text-2xl font-bold text-emerald-400 mb-4">{product.priceCNY} ¥</div>
                <Button asChild size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-400">
                    <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <ShoppingCart className="w-4 h-4 mr-2" /> Kup teraz
                    </a>
                </Button>
            </div>
        </div>
      </motion.div>
    )
  }

  // Widok siatki
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 group h-full flex flex-col"
    >
      <Link href={`/w2c/${product._id}`} aria-label={`Zobacz szczegóły ${product.name}`} className="cursor-pointer">
        <div className="relative">
            <CodeThumbnail />
            {product.inStock === false && (
                <div className="absolute top-4 left-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full px-2 py-1">
                <span className="text-red-400 text-xs font-medium">Brak</span>
                </div>
            )}
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/w2c/${product._id}`} className="cursor-pointer">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-emerald-300 group-hover:bg-clip-text transition-all duration-300">
              {product.name}
            </h3>
        </Link>
        <p className="text-white/60 mb-3">{product.brand}</p>

        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-white/70 text-sm">
                <div className="flex items-center space-x-1.5"><Heart className="w-4 h-4 text-red-400/70" /> <span>{product.hearts}</span></div>
                <div className="flex items-center space-x-1.5"><Eye className="w-4 h-4" /> <span>{product.views}</span></div>
            </div>
            <div className="text-xl font-bold text-emerald-400">{product.priceCNY} ¥</div>
        </div>
        
        <div className="flex items-center space-x-2 mt-auto pt-4 border-t border-white/10">
          <Button
            size="sm"
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Dodaj do ulubionych"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500"
            disabled={product.inStock === false}
            onClick={(e) => e.stopPropagation()}
          >
            <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Kup teraz
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}