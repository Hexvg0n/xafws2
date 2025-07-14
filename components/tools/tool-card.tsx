"use client"

import type React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/ui/tilt-card"

interface ToolCardProps {
  tool: {
    id: string
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    features: string[]
    href: string
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon

  return (
    <TiltCard>
      <motion.div
        whileHover={{ y: -5 }}
        className="glass-morphism rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 group"
      >
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
          {tool.name}
        </h3>

        <p className="text-white/70 mb-6 leading-relaxed">{tool.description}</p>

        <div className="space-y-3 mb-8">
          {tool.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-white/80 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Link href={tool.href}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium group">
            Użyj Narzędzia
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </TiltCard>
  )
}
