"use client"

import { motion } from "framer-motion"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const testimonials = [
  {
    quote: "RepMafia to najlepsza społeczność replik w Polsce. Znalazłem tutaj wszystko czego potrzebowałem!",
    name: "Michał K.",
    title: "Kolekcjoner sneakersów",
  },
  {
    quote:
      "Dzięki RepMafia kupiłem swoje pierwsze repliki i jestem zachwycony jakością. Społeczność jest bardzo pomocna.",
    name: "Anna W.",
    title: "Miłośniczka mody",
  },
  {
    quote: "Narzędzia dostępne na RepMafia oszczędziły mi mnóstwo czasu i pieniędzy. Szczególnie kalkulator wysyłki!",
    name: "Tomasz L.",
    title: "Doświadczony kupujący",
  },
  {
    quote: "Najlepsze batche, zaufani sprzedawcy i świetna społeczność. RepMafia to must-have dla każdego fana replik.",
    name: "Karolina M.",
    title: "Influencerka modowa",
  },
  {
    quote: "Od kiedy dołączyłem do RepMafia, moje zakupy replik stały się o wiele łatwiejsze i bezpieczniejsze.",
    name: "Paweł S.",
    title: "Student",
  },
]

export function InfiniteTestimonialsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
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
            Dołącz do tysięcy zadowolonych członków, którzy już odkryli moc RepMafia.
          </p>
        </motion.div>

        <div className="h-[40rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
        </div>
      </div>
    </section>
  )
}
