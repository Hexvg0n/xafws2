"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link2, Search, Loader2, AlertCircle, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from 'isomorphic-dompurify';

// Definicja typów na podstawie JSONa
interface QcGroup {
  order_no: string;
  image_list: string[];
}

function QcGalleryModal({ group, onClose }: { group: QcGroup; onClose: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % group.image_list.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + group.image_list.length) % group.image_list.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // ZMIANA 1: z-50 -> z-[100]
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ZMIANA 2: Zmieniono pozycję przycisku */}
                <Button onClick={onClose} variant="ghost" size="icon" className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/20 hover:bg-black/40 rounded-full">
                    <X className="w-6 h-6" />
                </Button>
                
                <div className="relative w-full h-full">
                    <AnimatePresence mode="wait">
                         <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full"
                        >
                            <Image
                                src={group.image_list[currentIndex]}
                                alt={`QC Image ${currentIndex + 1}`}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Przyciski nawigacyjne */}
                <Button onClick={handlePrev} variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 sm:-translate-x-12 bg-white/10 hover:bg-white/20 rounded-full">
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button onClick={handleNext} variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 sm:translate-x-12 bg-white/10 hover:bg-white/20 rounded-full">
                    <ChevronRight className="w-6 h-6" />
                </Button>

                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-3 py-1 rounded-full">
                    {currentIndex + 1} / {group.image_list.length}
                </div>
            </motion.div>
        </motion.div>
    );
}


export function QCChecker() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qcGroups, setQcGroups] = useState<QcGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<QcGroup | null>(null);

  const handleFetchQc = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError(null);
    setQcGroups([]);
    
  try {
        const response = await fetch('/api/qc', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY! 
            },
            body: JSON.stringify({ url }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Wystąpił nieznany błąd");
        }
        
        let allQcGroups: QcGroup[] = [];
        if (data.cnfans && data.cnfans.qc_data && data.cnfans.qc_data.data) {
            allQcGroups = [...allQcGroups, ...data.cnfans.qc_data.data];
        }

        setQcGroups(allQcGroups);
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {selectedGroup && <QcGalleryModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />}
      </AnimatePresence>

      <div className="glass-morphism rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Wklej link do produktu (Taobao, Weidian, 1688)</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://item.taobao.com/item.htm?id=..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <Button
            onClick={handleFetchQc}
            disabled={!url.trim() || isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 px-6 py-3 text-base h-auto"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="ml-2">Szukaj QC</span>
          </Button>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error) }}></span>
        </motion.div>
      )}

      {qcGroups.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Znaleziono {qcGroups.length} grup zdjęć QC:</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {qcGroups.map((group, index) => (
                    <motion.div
                        key={group.order_no}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-morphism rounded-2xl overflow-hidden hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
                        onClick={() => setSelectedGroup(group)}
                    >
                        <div className="relative aspect-square">
                            <Image
                                src={group.image_list[0]}
                                alt={`QC for order ${group.order_no}`}
                                layout="fill"
                                objectFit="cover"
                                className="group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                              <div className="absolute bottom-4 left-4 text-white">
                                  <p className="text-sm text-white/70 flex items-center gap-1.5">
                                      <ImageIcon className="w-4 h-4" />
                                      {group.image_list.length} zdjęć
                                  </p>
                              </div>
                        </div>
                    </motion.div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
}