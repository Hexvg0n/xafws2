"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Clock, User, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuideCardProps {
  guide: {
    id: string
    title: string
    description: string
    category: string
    readTime: string
    author: string
    image: string
    difficulty: string
    tags: string[]
  }
}

export function GuideCard({ guide }: GuideCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Łatwy":
        return "text-green-400 bg-green-400/20 border-green-400/30"
      case "Średni":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
      case "Zaawansowany":
        return "text-red-400 bg-red-400/20 border-red-400/30"
      default:
        return "text-blue-400 bg-blue-400/20 border-blue-400/30"
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="relative">
        <div className="aspect-video bg-white/5">
          <Image
            src={guide.image || "/placeholder.svg"}
            alt={guide.title}
            width={300}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(guide.difficulty)}`}>
            {guide.difficulty}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-black/20 backdrop-blur-md text-white text-xs rounded-full">
            {guide.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
          {guide.title}
        </h3>

        <p className="text-white/70 text-sm mb-4 leading-relaxed">{guide.description}</p>

        <div className="flex items-center space-x-4 mb-4 text-xs text-white/60">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{guide.readTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{guide.author}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium group">
          <BookOpen className="w-4 h-4 mr-2" />
          Czytaj Przewodnik
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  )
}
