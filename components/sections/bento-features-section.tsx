"use client"

import { motion } from "framer-motion"
import { Search, Shield, Users, Calculator } from "lucide-react"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"

const features = [
  {
    title: "W2C Katalog",
    description: "Przeszukuj tysiące zweryfikowanych replik z zaawansowanymi filtrami.",
    header: <FeatureHeader icon={Search} />,
    className: "md:col-span-2",
    icon: <Search className="h-4 w-4 text-blue-400" />,
  },
  {
    title: "Zaufani Sprzedawcy",
    description: "Tylko sprawdzeni sprzedawcy z wysokimi ocenami społeczności.",
    header: <FeatureHeader icon={Shield} />,
    className: "md:col-span-1",
    icon: <Shield className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Społeczność",
    description: "Aktywna społeczność dzieląca się doświadczeniami.",
    header: <FeatureHeader icon={Users} />,
    className: "md:col-span-1",
    icon: <Users className="h-4 w-4 text-blue-400" />,
  },
  {
    title: "Narzędzia",
    description: "Kalkulator wysyłki, QC checker i więcej przydatnych narzędzi.",
    header: <FeatureHeader icon={Calculator} />,
    className: "md:col-span-2",
    icon: <Calculator className="h-4 w-4 text-blue-600" />,
  },
]

function FeatureHeader({ icon: Icon }: { icon: any }) {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-900/20 to-blue-600/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/10" />
      <div className="flex items-center justify-center w-full h-full">
        <Icon className="w-12 h-12 text-blue-400" />
      </div>
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500/20 rounded-full" />
      <div className="absolute top-2 left-2 w-4 h-4 bg-blue-400/30 rounded-full" />
    </div>
  )
}

export function BentoFeaturesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
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
            RepMafia oferuje kompletny ekosystem narzędzi i funkcji w nowoczesnym interfejsie.
          </p>
        </motion.div>

        <BentoGrid className="max-w-4xl mx-auto">
          {features.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={`${item.className} glass-morphism border-white/10 hover:bg-white/10 transition-all duration-300`}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
