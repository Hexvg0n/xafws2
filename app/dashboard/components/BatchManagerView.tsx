"use client";

import { useState, useCallback, useEffect } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Batch } from "@/lib/types";
import { AddBatchForm } from "./AddBatchForm";
import { EditBatchForm } from "./EditBatchForm";
import { Star, Loader2, Edit, Send, Trash2 } from "lucide-react";

export function BatchManagerView() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

    const fetchBatches = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/batches');
            if (!res.ok) throw new Error("Błąd pobierania batchy");
            setBatches(await res.json());
        } catch (error) { console.error(error); setBatches([]); }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchBatches(); }, [fetchBatches]);

    const handleDeleteBatch = async (batchId: string) => {
        if (!confirm("Czy na pewno chcesz usunąć ten batch?")) return;
        const response = await fetch(`/api/batches/${batchId}`, { method: 'DELETE' });
        if (response.ok) { alert("Batch usunięty."); fetchBatches(); }
        else { alert("Błąd podczas usuwania batcha."); }
    };

    if (isLoading) return <p className="text-center text-white/70">Ładowanie...</p>;

    return (
        <div className="glass-morphism rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Zarządzaj Best Batches ({batches.length})</h3>
                <Button onClick={() => setShowAddForm(true)}><Star className="w-4 h-4 mr-2" /> Dodaj Batch</Button>
            </div>

            <div className="space-y-4">
                {batches.length > 0 ? batches.map(batch => (
                    <div key={batch._id.toString()} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                            <Image
                                src={batch.thumbnailUrl || batch.mainImages?.[0] || '/placeholder.png'}
                                alt={batch.name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover w-16 h-16"
                            />
                            <div>
                                <p className="font-semibold text-white">{batch.name} <span className="text-sm text-blue-400">({batch.batch})</span></p>
                                <a href={batch.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Link do źródła</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button onClick={() => setEditingBatch(batch)} size="sm" variant="ghost" title="Edytuj"><Edit className="w-4 h-4 text-blue-400" /></Button>
                           <Button onClick={() => handleDeleteBatch(batch._id.toString())} size="sm" variant="ghost" title="Usuń"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                    </div>
                )) : <p className="text-white/70 text-center py-8">Brak batchy. Dodaj pierwszy!</p>}
            </div>

            {showAddForm && <AddBatchForm onSave={() => { setShowAddForm(false); fetchBatches(); }} onCancel={() => setShowAddForm(false)} />}
            {editingBatch && <EditBatchForm batchToEdit={editingBatch} onSave={() => { setEditingBatch(null); fetchBatches(); }} onCancel={() => setEditingBatch(null)}/>}
        </div>
    )
}