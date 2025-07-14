import { SellersContent } from "@/components/sellers/sellers-content"

export default function SellersPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Zaufani Sprzedawcy</h1>
          <p className="text-white/70">Sprawdzeni sprzedawcy z najwyższymi ocenami społeczności</p>
        </div>

        <SellersContent />
      </div>
    </div>
  )
}
