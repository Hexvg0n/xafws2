"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FeedCard } from "./feed-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Mock data
const mockPurchases = [
  {
    id: "1",
    user: {
      name: "Michał K.",
      image: "/placeholder.svg?height=40&width=40",
    },
    item: {
      name: "Air Jordan 1 Retro High Chicago",
      brand: "Nike",
      images: ["/placeholder.svg?height=300&width=300"],
    },
    batch: {
      name: "LJR Batch",
      seller: "Mr. Hou",
    },
    price: 580,
    rating: 5,
    review: "Niesamowita jakość! Skóra jest premium, a kształt idealny. Polecam każdemu!",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user: {
      name: "Anna W.",
      image: "/placeholder.svg?height=40&width=40",
    },
    item: {
      name: "Dior B23 High-Top",
      brand: "Dior",
      images: ["/placeholder.svg?height=300&width=300"],
    },
    batch: {
      name: "God Batch",
      seller: "Kevin",
    },
    price: 720,
    rating: 5,
    review: "Perfekcyjna replika! Nie można odróżnić od oryginału. Szybka wysyłka i świetna komunikacja.",
    createdAt: "2024-01-14T15:20:00Z",
  },
  {
    id: "3",
    user: {
      name: "Tomasz L.",
      image: "/placeholder.svg?height=40&width=40",
    },
    item: {
      name: "Travis Scott x Air Jordan 1 Low",
      brand: "Nike",
      images: ["/placeholder.svg?height=300&width=300"],
    },
    batch: {
      name: "GD Batch",
      seller: "Coco",
    },
    price: 650,
    rating: 4,
    review: "Bardzo dobra jakość, ale suede mogłby być nieco lepszy. Ogólnie jestem zadowolony.",
    createdAt: "2024-01-13T09:45:00Z",
  },
]

export function FeedContent() {
  const [purchases, setPurchases] = useState<typeof mockPurchases>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPurchases(mockPurchases)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {purchases.map((purchase, index) => (
        <motion.div
          key={purchase.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <FeedCard purchase={purchase} />
        </motion.div>
      ))}
    </div>
  )
}
