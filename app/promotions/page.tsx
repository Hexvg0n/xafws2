import { PromotionsPage } from "@/components/promotions/promotions-page"

export default function PromotionsToolPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Aktualne Promocje</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Najlepsze kody rabatowe i okazje od zaufanych sprzedawców, zebrane w jednym miejscu.
          </p>
        </div>

        <PromotionsPage />
      </div>
    </div>
  )
}
