// components/sections/enhanced-hero-section.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Star, Users, Package, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Spotlight } from "@/components/ui/spotlight"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Meteors } from "@/components/ui/meteors"
import { Counter } from "@/components/ui/counter"
import { ParallaxScroll } from "@/components/ui/parallax-scroll"

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};


export function EnhancedHeroSection() {
    const [stats, setStats] = useState({
        memberCount: 15000,
        totalItems: 3500,
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [heroImages, setHeroImages] = useState<{ src: string; id: string; type: 'product' | 'batch' }[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [statsRes, imagesRes] = await Promise.all([
                    fetch('/api/stats/homepage'),
                    fetch('/api/images')
                ]);

                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }
                
                if (imagesRes.ok) {
                    const data = await imagesRes.json();
                    if (data.images && data.images.length > 0) {
                        const shuffledImages = shuffleArray(data.images);
                        setHeroImages(shuffledImages.slice(0, 6));
                    }
                }

            } catch (error) {
                console.error("Nie udało się załadować danych początkowych", error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchInitialData();
    }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="green" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]" />
      <Meteors number={20} />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-300/5 rounded-full blur-2xl animate-ping" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/80">Najlepsza społeczność replik w Polsce</span>
            </motion.div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <TextGenerateEffect words="Odkryj najlepsze repliki w Polsce" className="text-white" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-white/70 mb-8 max-w-2xl"
            >
              Dołącz do tysięcy zadowolonych członków w najbardziej kompleksowej społeczności replik. Odkrywaj
              najwyższej jakości repliki, łącz się z zaufanymi sprzedawcami i uzyskuj dostęp do ekskluzywnych batchy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <MagneticButton>
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 group">
                  <Link href="/w2c">
                    Przeglądaj Katalog
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </MagneticButton>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-lg bg-transparent">
                <Link href="/tools">Zobacz Narzędzia</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start space-x-8 mt-12"
            >
            {isLoadingStats ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500"/> : (
              <>
                <div className="text-center">
                    <div className="flex items-center space-x-1 text-emerald-400">
                    <Users className="w-5 h-5" />
                    <span className="text-2xl font-bold"><Counter value={stats.memberCount} />+</span>
                    </div>
                    <p className="text-sm text-white/60">Aktywnych Członków</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center space-x-1 text-emerald-500">
                    <Package className="w-5 h-5" />
                    <span className="text-2xl font-bold"><Counter value={stats.totalItems} />+</span>
                    </div>
                    <p className="text-sm text-white/60">Zweryfikowanych Itemów</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-2xl font-bold">4.9</span>
                    </div>
                    <p className="text-sm text-white/60">Średnia Ocena</p>
                </div>
              </>
            )}
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {heroImages.length > 0 && (
                <div className="glass-morphism rounded-2xl p-4 relative overflow-hidden h-[600px]">
                    <ParallaxScroll images={heroImages} className="h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl pointer-events-none" />
                </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}