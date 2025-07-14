"use client"

import { motion } from "framer-motion"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

const testimonials = [
  {
    quote: "RepMafia to najlepsza społeczność replik w Polsce. Znalazłem tutaj wszystko czego potrzebowałem i więcej!",
    name: "Michał K.",
    designation: "Kolekcjoner sneakersów",
    src: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "Dzięki RepMafia kupiłem swoje pierwsze repliki i jestem zachwycony jakością. Społeczność jest bardzo pomocna.",
    name: "Anna W.",
    designation: "Miłośniczka mody",
    src: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "Narzędzia dostępne na RepMafia oszczędziły mi mnóstwo czasu i pieniędzy. Szczególnie kalkulator wysyłki!",
    name: "Tomasz L.",
    designation: "Doświadczony kupujący",
    src: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "Najlepsze batche, zaufani sprzedawcy i świetna społeczność. RepMafia to must-have dla każdego fana replik.",
    name: "Karolina M.",
    designation: "Influencerka modowa",
    src: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "Od kiedy dołączyłem do RepMafia, moje zakupy replik stały się o wiele łatwiejsze i bezpieczniejsze.",
    name: "Paweł S.",
    designation: "Student",
    src: "/placeholder.svg?height=100&width=100",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl" />
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
            Co mówią nasi <span className="gradient-text">członkowie</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Dołącz do tysięcy zadowolonych członków, którzy już odkryli moc RepMafia. Przeczytaj ich historie i
            doświadczenia.
          </p>
        </motion.div>

        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </section>
  )
}
