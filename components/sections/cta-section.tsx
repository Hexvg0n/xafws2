"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-600/10 to-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-morphism rounded-3xl p-12 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-4 left-4">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div className="absolute top-4 right-4">
            <Users className="w-6 h-6 text-emerald-500 animate-pulse delay-500" />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Zap className="w-6 h-6 text-emerald-300 animate-pulse delay-1000" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Gotowy na <span className="gradient-text">przygodę</span> z replikami?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Dołącz do XaffReps już dziś i odkryj świat najwyższej jakości replik. Bezpłatne członkostwo,
              nieograniczony dostęp do wszystkich funkcji.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticButton>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 group text-lg"
              >
                Dołącz za Darmo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </MagneticButton>

            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-lg bg-transparent text-lg"
            >
              Dowiedz się więcej
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 text-sm text-white/60"
          >
            <p>✨ Bezpłatne członkostwo • 🚀 Natychmiastowy dostęp • 🔒 100% bezpieczne</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}