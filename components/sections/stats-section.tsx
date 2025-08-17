"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Counter } from "@/components/ui/counter"
import { TrendingUp, Users, Package, Star, Shield, Globe } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: 15000,
    label: "Aktywnych Członków",
    suffix: "+",
    color: "text-emerald-400",
  },
  {
    icon: Package,
    value: 3500,
    label: "Zweryfikowanych Batchy",
    suffix: "+",
    color: "text-emerald-500",
  },
  {
    icon: Star,
    value: 4.9,
    label: "Średnia Ocena",
    suffix: "",
    decimal: true,
    color: "text-yellow-400",
  },
  {
    icon: TrendingUp,
    value: 98,
    label: "Wskaźnik Sukcesu",
    suffix: "%",
    color: "text-emerald-400",
  },
  {
    icon: Shield,
    value: 24,
    label: "Godzinne Wsparcie",
    suffix: "/7",
    color: "text-emerald-600",
  },
  {
    icon: Globe,
    value: 50,
    label: "Krajów Obsługiwanych",
    suffix: "+",
    color: "text-emerald-500",
  },
]

export function StatsSection() {
  const ref = useRef(null)
  // ZMIANA TUTAJ - usunięto 'threshold'
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Zaufana przez <span className="gradient-text">społeczność</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Dołącz do tysięcy zadowolonych członków, którzy ufają XaffReps w swoich potrzebach związanych z replikami.
            Nasza platforma zapewnia jakość, niezawodność i wyjątkową obsługę.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="glass-morphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600/20 to-emerald-400/20 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>

                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {isInView && <Counter value={stat.value} duration={2000} decimal={stat.decimal} />}
                    {stat.suffix}
                  </div>
                  <p className="text-sm text-white/60 font-medium">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}