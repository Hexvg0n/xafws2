import { QCChecker } from "@/components/tools/qc-checker"

export default function QCCheckerPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">QC Checker</h1>
          <p className="text-white/70">Sprawdź jakość swoich QC zdjęć i otrzymaj szczegółową analizę</p>
        </div>

        <QCChecker />
      </div>
    </div>
  )
}
