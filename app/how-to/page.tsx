import { HowToContent } from "@/components/how-to/how-to-content"

export default function HowToPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Przewodniki How To</h1>
          <p className="text-white/70">Wszystko co musisz wiedzieć o świecie replik</p>
        </div>

        <HowToContent />
      </div>
    </div>
  )
}
