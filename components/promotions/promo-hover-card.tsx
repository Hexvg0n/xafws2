"use client"

import { Gift, Percent, Calendar, Tag, Info } from "lucide-react"
import { TiltCard } from "@/components/ui/tilt-card"
import { mockPromos } from "@/data/promos"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const getCategoryStyle = (category: string) => {
  switch (category.toLowerCase()) {
    case "jordan":
      return { icon: <Gift className="w-5 h-5" />, colorClass: "text-blue-400" }
    case "designer":
      return { icon: <Percent className="w-5 h-5" />, colorClass: "text-purple-400" }
    case "travis scott":
      return { icon: <Gift className="w-5 h-5" />, colorClass: "text-amber-600" }
    case "yeezy":
      return { icon: <Gift className="w-5 h-5" />, colorClass: "text-yellow-400" }
    case "off-white":
      return { icon: <Percent className="w-5 h-5" />, colorClass: "text-teal-400" }
    default:
      return { icon: <Tag className="w-5 h-5" />, colorClass: "text-gray-400" }
  }
}

const getDaysLeft = (endDate: string) => {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function PromoHoverCard() {
  const activePromos = mockPromos
    .filter((p) => {
      const daysLeft = getDaysLeft(p.endDate)
      const usesLeft = p.maxUses - p.currentUses
      return p.isActive && daysLeft > 0 && usesLeft > 0
    })
    .slice(0, 2)

  if (activePromos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <Gift className="w-12 h-12 text-white/30 mb-4" />
        <h4 className="font-bold text-white">Brak aktywnych promocji</h4>
        <p className="text-sm text-white/60">Sprawdź ponownie później!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-bold text-lg text-white">Gorące Promocje 🔥</h3>
        <Button variant="link" asChild className="text-blue-400 hover:text-blue-300 p-0 h-auto">
          <Link href="/promotions">Zobacz wszystkie</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePromos.map((promo) => {
          const { icon, colorClass } = getCategoryStyle(promo.category)
          const daysLeft = getDaysLeft(promo.endDate)
          const usesLeft = promo.maxUses - promo.currentUses

          return (
            <TiltCard key={promo.id} className="rounded-xl w-full h-52">
              <div className="glass-morphism p-4 rounded-xl border border-white/10 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={colorClass}>{icon}</span>
                      <h4 className={`font-bold text-md truncate ${colorClass}`}>{promo.title}</h4>
                    </div>
                    <p className="text-xs text-white/60 mb-3 leading-relaxed">{promo.description}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-white/80">
                      <Tag className="w-3 h-3 text-white/50" />
                      <span>
                        Partia: <span className="font-semibold">{promo.category}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-3 h-3 text-white/50" />
                      <span>
                        Wygasa za: <span className="font-semibold">{daysLeft} dni</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Info className="w-3 h-3 text-white/50" />
                      <span>
                        Pozostało: <span className="font-semibold">{usesLeft} użyć</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 font-mono text-lg font-bold text-white/20 select-none">
                  {promo.code}
                </div>
              </div>
            </TiltCard>
          )
        })}
      </div>
    </div>
  )
}
