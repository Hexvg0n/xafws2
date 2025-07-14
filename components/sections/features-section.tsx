"use client"

import { motion } from "framer-motion"
import { Search, Shield, Users, Zap, Star, TrendingUp } from "lucide-react"
import { TiltCard } from "@/components/ui/tilt-card"

const features = [
  {
    icon: Search,
    title: "W2C Katalog",
    description: "Przeszukuj tysiące zweryfikowanych replik z zaawansowanymi filtrami i wyszukiwaniem.",
    color: "from-blue-600 to-blue-400",
  },
  {
    icon: Shield,
    title: "Zaufani Sprzedawcy",
    description: "Tylko sprawdzeni i zaufani sprzedawcy z wysokimi ocenami społeczności.",
    color: "from-blue-700 to-blue-500",
  },
  {
    icon: Users,
    title: "Społeczność",
    description: "Dołącz do aktywnej społeczności i dziel się swoimi doświadczeniami.",
    color: "from-slate-700 to-blue-600",
  },
  {
    icon: Zap,
    title: "Narzędzia",
    description: "Korzystaj z naszych narzędzi: kalkulator wysyłki, QC checker i więcej.",
    color: "from-blue-500 to-blue-300",
  },
  {
    icon: Star,
    title: "Best Batch",
    description: "Odkryj najlepsze batche wybrane przez ekspertów i społeczność.",
    color: "from-blue-800 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Trendy",
    description: "Bądź na bieżąco z najnowszymi trendami i najpopularniejszymi produktami.",
    color: "from-indigo-600 to-blue-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Wszystko czego <span className="gradient-text">potrzebujesz</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            RepMafia oferuje kompletny ekosystem narzędzi i funkcji, które pomogą Ci znaleźć idealne repliki i podjąć
            świadome decyzje zakupowe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TiltCard className="h-full">
                <div className="glass-morphism rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 group">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
