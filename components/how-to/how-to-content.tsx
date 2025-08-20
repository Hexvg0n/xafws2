// components/how-to/how-to-content.tsx

"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import { GuideCard } from "./guide-card"

export function HowToContent() {
  const [guides, setGuides] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/guides');
        if (res.ok) {
          setGuides(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuides();
  }, [])

  const categories = useMemo(() => {
    const allCategories = guides.map(guide => guide.category);
    return [...new Set(allCategories)];
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || guide.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [guides, searchTerm, selectedCategory]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj poradników..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-2">Kategorie:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === null
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
              }`}
            >
              Wszystkie
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide, index) => (
          <motion.div
            key={guide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GuideCard guide={guide} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}