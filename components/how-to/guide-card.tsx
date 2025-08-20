// components/how-to/guide-card.tsx

"use client"

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Zmieniamy definicję propsów, aby pasowała do naszego nowego modelu
interface GuideCardProps {
  guide: {
    _id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    tags: string[];
  }
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group h-full flex flex-col"
    >
      <Link href={`/how-to/${guide.slug}`} className="block">
        <div className="relative aspect-video bg-white/5">
          <Image
            src={guide.image || "/placeholder.svg"}
            alt={guide.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-emerald-400 mb-2 font-medium">{guide.category}</p>
        <Link href={`/how-to/${guide.slug}`}>
            <h3 className="text-lg font-semibold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-emerald-300 group-hover:bg-clip-text transition-all duration-300">
            {guide.title}
            </h3>
        </Link>
        <p className="text-white/70 text-sm mb-4 leading-relaxed flex-grow">{guide.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {guide.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-white font-medium group">
            <Link href={`/how-to/${guide.slug}`}>
              <BookOpen className="w-4 h-4 mr-2" />
              Czytaj Poradnik
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}