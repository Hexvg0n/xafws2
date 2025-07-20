"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Star, Trophy, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BatchForm } from "./batch-form"

interface Batch {
  id: string
  product: string
  brand: string
  batchName: string
  seller: string
  rating: number
  price: number
  image: string
  pros: string[]
  cons: string[]
  reviews: number
  category: string
  rank: number
  createdAt: string
}

const mockBatches: Batch[] = [
  {
    id: "1",
    product: "Air Jordan 1 Retro High Chicago",
    brand: "Nike",
    batchName: "LJR Batch",
    seller: "Mr. Hou",
    rating: 9.8,
    price: 580,
    image: "/placeholder.svg?height=300&width=300",
    pros: ["Perfekcyjna skóra", "Idealny kształt", "Świetne wykończenie"],
    cons: ["Wysoka cena"],
    reviews: 234,
    category: "Jordan",
    rank: 1,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    product: "Travis Scott x Air Jordan 1 Low",
    brand: "Nike",
    batchName: "GD Batch",
    seller: "Coco",
    rating: 9.5,
    price: 650,
    image: "/placeholder.svg?height=300&width=300",
    pros: ["Dobry suede", "Prawidłowe kolory", "Solidne wykonanie"],
    cons: ["Suede mógłby być lepszy", "Długi czas oczekiwania"],
    reviews: 189,
    category: "Travis Scott",
    rank: 2,
    createdAt: "2024-01-14",
  },
]

export function BatchManager() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches)
  const [showForm, setShowForm] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBatches = batches.filter(
    (batch) =>
      batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.seller.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddBatch = (batchData: Omit<Batch, "id" | "createdAt" | "rank">) => {
    const newBatch: Batch = {
      ...batchData,
      id: Date.now().toString(),
      rank: batches.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setBatches([newBatch, ...batches])
    setShowForm(false)
  }

  const handleEditBatch = (batchData: Omit<Batch, "id" | "createdAt" | "rank">) => {
    if (editingBatch) {
      setBatches(
        batches.map((b) =>
          b.id === editingBatch.id
            ? { ...batchData, id: editingBatch.id, rank: editingBatch.rank, createdAt: b.createdAt }
            : b,
        ),
      )
      setEditingBatch(null)
      setShowForm(false)
    }
  }

  const handleDeleteBatch = (id: string) => {
    setBatches(batches.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Zarządzanie Best Batches</h2>
          <p className="text-white/60">Dodawaj, edytuj i usuwaj najlepsze batche</p>
        </div>
        <Button
          onClick={() => {
            setEditingBatch(null)
            setShowForm(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj Batch
        </Button>
      </div>

      {/* Search */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj batchy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBatches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
          >
            {/* Image and Rank */}
            <div className="relative">
              <div className="aspect-square bg-white/5">
                <img
                  src={batch.image || "/placeholder.svg"}
                  alt={batch.product}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-3 py-1 rounded-full flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span className="font-bold text-sm">#{batch.rank}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
                  <span className="font-bold text-sm">{batch.rating}/10</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{batch.product}</h3>
              <p className="text-white/60 mb-3">{batch.brand}</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-blue-400 font-medium text-sm">{batch.batchName}</div>
                  <div className="text-white/60 text-sm">by {batch.seller}</div>
                </div>
                <div className="text-xl font-bold text-blue-400">{batch.price} zł</div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white/80 text-sm">{batch.rating}/10</span>
                </div>
                <div className="text-white/60 text-sm">{batch.reviews} recenzji</div>
              </div>

              {/* Pros and Cons Preview */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">{batch.pros.length} zalet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ThumbsDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium text-sm">{batch.cons.length} wad</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingBatch(batch)
                      setShowForm(true)
                    }}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBatch(batch.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-white/60 text-xs">{batch.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Batch Form Modal */}
      {showForm && (
        <BatchForm
          batch={editingBatch}
          onSave={editingBatch ? handleEditBatch : handleAddBatch}
          onCancel={() => {
            setShowForm(false)
            setEditingBatch(null)
          }}
        />
      )}
    </div>
  )
}
