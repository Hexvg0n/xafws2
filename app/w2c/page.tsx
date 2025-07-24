// app/w2c/page.tsx

import { W2CContent } from "@/components/w2c/w2c-content"

export default function W2CPage() {
  return (
    // Zwiększamy padding na dole, aby karty nie były ucięte
    <div className="min-h-screen pt-20 pb-24"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">W2C Katalog</h1>
          <p className="text-white/70">Znajdź najlepsze repliki z zaufanych źródeł</p>
        </div>

        <W2CContent />
      </div>
    </div>
  )
}