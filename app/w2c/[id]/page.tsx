import { ProductDetails } from "@/components/w2c/product-details"
import { notFound } from "next/navigation"

// Mock data - w prawdziwej aplikacji pobierałbyś to z bazy danych
const mockProducts = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High Chicago",
    brand: "Nike",
    price: 580,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    seller: "Mr. Hou",
    batch: "LJR Batch",
    rating: 4.9,
    reviews: 234,
    category: "Jordan",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Red/White", "Black/White"],
    inStock: true,
    description:
      "Kultowe Air Jordan 1 w kolorystyce Chicago. Wykonane z wysokiej jakości skóry naturalnej, z perfekcyjnie odwzorowanymi detalami. LJR Batch to najwyższa jakość dostępna na rynku replik.",
    features: [
      "Skóra naturalna premium",
      "Perfekcyjne odwzorowanie kształtu",
      "Wysokiej jakości podeszwa",
      "Oryginalne opakowanie",
      "QC zdjęcia przed wysyłką",
    ],
    specifications: {
      Materiał: "Skóra naturalna + syntetyk",
      Podeszwa: "Guma",
      "Kraj produkcji": "Chiny",
      Batch: "LJR",
      "Czas produkcji": "3-5 dni",
      Wysyłka: "DHL/EMS",
    },
  },
  // Dodaj więcej produktów...
]

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <ProductDetails product={product} />
    </div>
  )
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }))
}
