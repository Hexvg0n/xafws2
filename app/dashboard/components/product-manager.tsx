"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductForm } from "./product-form"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  seller: string
  batch: string
  category: string
  inStock: boolean
  createdAt: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High Chicago",
    brand: "Nike",
    price: 580,
    image: "/placeholder.svg?height=100&width=100",
    seller: "Mr. Hou",
    batch: "LJR Batch",
    category: "Jordan",
    inStock: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Dior B23 High-Top",
    brand: "Dior",
    price: 720,
    image: "/placeholder.svg?height=100&width=100",
    seller: "Kevin",
    batch: "God Batch",
    category: "Designer",
    inStock: true,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Travis Scott x Air Jordan 1 Low",
    brand: "Nike",
    price: 650,
    image: "/placeholder.svg?height=100&width=100",
    seller: "Coco",
    batch: "GD Batch",
    category: "Jordan",
    inStock: false,
    createdAt: "2024-01-13",
  },
]

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = (productData: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setProducts([newProduct, ...products])
    setShowForm(false)
  }

  const handleEditProduct = (productData: Omit<Product, "id" | "createdAt">) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...productData, id: editingProduct.id, createdAt: p.createdAt } : p,
        ),
      )
      setEditingProduct(null)
      setShowForm(false)
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Zarządzanie Produktami W2C</h2>
          <p className="text-white/60">Dodawaj, edytuj i usuwaj produkty z katalogu</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj Produkt
        </Button>
      </div>

      {/* Search */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-morphism rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Produkty ({filteredProducts.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left text-white/80 p-4">Produkt</th>
                <th className="text-left text-white/80 p-4">Marka</th>
                <th className="text-left text-white/80 p-4">Cena</th>
                <th className="text-left text-white/80 p-4">Sprzedawca</th>
                <th className="text-left text-white/80 p-4">Batch</th>
                <th className="text-left text-white/80 p-4">Status</th>
                <th className="text-left text-white/80 p-4">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-white/60 text-sm">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/80">{product.brand}</td>
                  <td className="p-4 text-blue-400 font-medium">{product.price} zł</td>
                  <td className="p-4 text-white/80">{product.seller}</td>
                  <td className="p-4 text-white/80">{product.batch}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock
                          ? "bg-green-400/20 text-green-400 border border-green-400/30"
                          : "bg-red-400/20 text-red-400 border border-red-400/30"
                      }`}
                    >
                      {product.inStock ? "Dostępny" : "Brak"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingProduct(product)
                          setShowForm(true)
                        }}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
