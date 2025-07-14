"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  MessageCircle,
  Phone,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    brand: string
    price: number
    images: string[]
    seller: string
    batch: string
    rating: number
    reviews: number
    category: string
    sizes: string[]
    colors: string[]
    inStock: boolean
    description: string
    features: string[]
    specifications: Record<string, string>
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">
            Strona główna
          </Link>
          <span>/</span>
          <Link href="/w2c" className="hover:text-white transition-colors">
            W2C
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      {/* Back Button */}
      <div className="mb-6">
        <Link href="/w2c">
          <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Powrót do W2C
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-2xl p-4"
          >
            <div className="aspect-square bg-white/5 rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index ? "border-blue-400" : "border-white/10 hover:border-white/30"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-morphism rounded-2xl p-8">
              <div className="mb-4">
                <span className="text-blue-400 text-sm font-medium">{product.category}</span>
                <h1 className="text-3xl font-bold text-white mt-2 mb-2">{product.name}</h1>
                <p className="text-white/60">{product.brand}</p>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-white/80 ml-2">{product.rating}</span>
                  <span className="text-white/60">({product.reviews} recenzji)</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-blue-400 mb-6">{product.price} zł</div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-blue-400 font-medium text-sm">{product.batch}</span>
                  <div className="text-white/60 text-sm">by {product.seller}</div>
                </div>

                <div className={`flex items-center space-x-2 ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                  <Package className="w-5 h-5" />
                  <span className="font-medium">{product.inStock ? "Dostępne" : "Brak w magazynie"}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Rozmiar:</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-lg border transition-all duration-200 ${
                        selectedSize === size
                          ? "border-blue-400 bg-blue-400/20 text-blue-400"
                          : "border-white/20 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <h3 className="text-white font-medium mb-3">Kolor:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-4 rounded-lg border transition-all duration-200 ${
                        selectedColor === color
                          ? "border-blue-400 bg-blue-400/20 text-blue-400"
                          : "border-white/20 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Dodaj do koszyka
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Contact Seller */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-medium mb-3">Kontakt ze sprzedawcą:</h3>
                <div className="flex space-x-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WeChat
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12 space-y-8">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-morphism rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Opis produktu</h2>
          <p className="text-white/70 leading-relaxed">{product.description}</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-morphism rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Cechy produktu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-morphism rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Specyfikacja</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white/60">{key}:</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-morphism rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Informacje o wysyłce</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-white font-medium">Szybka wysyłka</div>
                <div className="text-white/60 text-sm">3-5 dni roboczych</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-white font-medium">Gwarancja jakości</div>
                <div className="text-white/60 text-sm">QC przed wysyłką</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-white font-medium">Bezpieczne opakowanie</div>
                <div className="text-white/60 text-sm">Dyskretna wysyłka</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
