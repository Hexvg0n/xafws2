// app/bb/[id]/page.tsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BatchDetails } from "@/components/best-batch/batch-details";
import { Loader2 } from "lucide-react";
import { Batch } from "@/lib/types";

async function getBatchById(id: string): Promise<Batch | null> {
    const res = await fetch('/api/batches');
    if (!res.ok) {
        throw new Error("Błąd pobierania danych z API");
    }
    const batches = await res.json();
    return batches.find((b: any) => b._id === id) || null;
}

export default function BatchPage({ params }: { params: { id: string } }) {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasTrackedView = useRef(false);

  const fetchBatch = useCallback(async () => {
    try {
      const foundBatch = await getBatchById(params.id);

      if (foundBatch) {
        setBatch(foundBatch);
        if (!hasTrackedView.current) {
          fetch('/api/stats/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'batchView', id: params.id }), // ZMIANA Z batchClick NA batchView
          });
          hasTrackedView.current = true;
        }
      } else {
        setError("Nie znaleziono batcha o podanym ID.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchBatch();
    }
  }, [params.id, fetchBatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!batch) {
    return (
       <div className="flex justify-center items-center min-h-screen">
        <p className="text-white/70">Nie znaleziono batcha.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <BatchDetails 
        batch={batch} 
      />
    </div>
  );
}