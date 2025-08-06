"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Trophy, Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { IBatch } from "@/models/Batch";

interface BatchCardProps {
  batch: IBatch
}

export function BatchCard({ batch }: BatchCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl overflow-hidden h-full flex flex-col hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="relative">
        <div className="aspect-square bg-white/5">
          <Image
            src={batch.image || "/placeholder.svg"}
            alt={batch.title}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current"/>
            <span className="font-bold text-sm">{batch.rating}/10</span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{batch.title}</h3>
        <p className="text-white/60 mb-3 text-sm">{batch.batch_name}</p>
        
        <div className="flex-grow"></div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xl font-bold text-blue-400">{batch.price} zł</div>
          <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-blue-400">
             <a href={batch.link} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Kup
             </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}