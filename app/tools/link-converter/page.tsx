import { LinkConverter } from "@/components/tools/link-converter"

export default function LinkConverterPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Konwerter Linków</h1>
          <p className="text-white/70">Konwertuj linki między różnymi platformami sprzedażowymi</p>
        </div>

        <LinkConverter />
      </div>
    </div>
  )
}
