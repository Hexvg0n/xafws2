// app/best-batch/page.tsx
import { BestBatchContent } from "@/components/best-batch/best-batch-content";

export default function BestBatchPage() {
  return (
    <div className="min-h-screen pt-20 pb-24"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Best Batches</h1>
          <p className="text-white/70">Najlepsze dostępne batche, wybrane przez społeczność.</p>
        </div>
        <BestBatchContent />
      </div>
    </div>
  );
}