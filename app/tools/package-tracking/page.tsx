import { PackageTracking } from "@/components/tools/package-tracking"

export default function PackageTrackingPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Tracking Paczek</h1>
          <p className="text-white/70">Śledź status swoich przesyłek z różnych kurierów w jednym miejscu</p>
        </div>

        <PackageTracking />
      </div>
    </div>
  )
}
