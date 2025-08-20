import { EnhancedHeroSection } from "@/components/sections/enhanced-hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { BentoFeaturesSection } from "@/components/sections/bento-features-section"
import { InfiniteTestimonialsSection } from "@/components/sections/infinite-testimonials-section"
import { CTASection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <EnhancedHeroSection />
      <StatsSection />
      <BentoFeaturesSection />
      {/* <InfiniteTestimonialsSection /> */}
      <CTASection />
    </div>
  )
}
