"use client"

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BatchForm } from "./batch-form";
import type { IBatch } from "@/models/Batch";

export function BatchManager() {
    const [batches, setBatches] = useState<IBatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBatch, setEditingBatch] = useState<IBatch | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleSave = async (batchData: Partial<IBatch>) => {
        const method = editingBatch ? 'PATCH' : 'POST';
        const url = editingBatch ? `/api/batches/${editingBatch._id}` : '/api/batches';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batchData),
            });
            if (!response.ok) throw new Error('Błąd zapisu batcha');
            setShowForm(false);
            setEditingBatch(null);
            fetchBatches();
        } catch (error) { alert('Nie udało się zapisać batcha.'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć ten batch?')) return;
        try {
            const response = await fetch(`/api/batches/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Błąd usuwania batcha');
            fetchBatches();
        } catch (error) { alert('Nie udało się usunąć batcha.'); }
    };
    
    const filteredBatches = batches.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Zarządzanie "Best Batches"</h2>
                    <p className="text-white/60">Dodawaj, edytuj i usuwaj najlepsze batche.</p>
                </div>
                <Button onClick={() => { setEditingBatch(null); setShowForm(true); }} className="bg-gradient-to-r from-blue-600 to-blue-400">
                    <Plus className="w-4 h-4 mr-2" /> Dodaj Batch
                </Button>
            </div>
             <div className="glass-morphism rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input type="text" placeholder="Szukaj batchy..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBatches.map((batch) => (
                    <motion.div key={batch.id.toString()} className="glass-morphism rounded-2xl overflow-hidden">
                        <img src={batch.image || "/placeholder.svg"} alt={batch.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-white">{batch.title}</h3>
                            <p className="text-sm text-blue-400">{batch.batch_name}</p>
                            <p className="text-lg font-semibold text-white mt-2">{batch.price} PLN</p>
                            <a href={batch.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Link</a>
                            <div className="flex text-xs text-white/50 mt-2 gap-4">
                                <span>Views: {batch.views}</span>
                                <span>Favs: {batch.favorites}</span>
                                <span>Clicks: {batch.clicks}</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button size="sm" variant="outline" onClick={() => { setEditingBatch(batch); setShowForm(true); }}><Edit className="w-4 h-4 mr-2" /> Edytuj</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(batch.id.toString())}><Trash2 className="w-4 h-4 mr-2" /> Usuń</Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            {showForm && <BatchForm batch={editingBatch} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingBatch(null); }} />}
        </div>
    );
}