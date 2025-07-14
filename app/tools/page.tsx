import { ToolsContent } from "@/components/tools/tools-content"

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Narzędzia RepMafia</h1>
          <p className="text-white/70">Pomocne narzędzia dla każdego miłośnika replik</p>
        </div>

        <ToolsContent />
      </div>
    </div>
  )
}
