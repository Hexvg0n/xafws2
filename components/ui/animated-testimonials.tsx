"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  quote: string
  name: string
  designation: string
  src: string
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[]
  autoplay?: boolean
}

export function AnimatedTestimonials({ testimonials, autoplay = true }: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0)

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000)
      return () => clearInterval(interval)
    }
  }, [autoplay])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-morphism rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <blockquote className="text-xl text-white/90 mb-8 leading-relaxed">
              "{testimonials[active].quote}"
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{testimonials[active].name.charAt(0)}</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">{testimonials[active].name}</div>
                <div className="text-white/60 text-sm">{testimonials[active].designation}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === active ? "bg-gradient-to-r from-violet-500 to-emerald-400 w-8" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
