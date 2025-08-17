"use client"

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SellerForm } from "./seller-form";
import type { ISeller } from "@/models/Seller";

export function SellerManager() {
    const [sellers, setSellers] = useState<ISeller[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSeller, setEditingSeller] = useState<ISeller | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSellers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/sellers');
            if (!res.ok) throw new Error("Błąd pobierania sprzedawców");
            setSellers(await res.json());
        } catch (error) { console.error(error); setSellers([]); }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchSellers(); }, [fetchSellers]);

    const handleSave = async (sellerData: Partial<ISeller>) => {
        const method = editingSeller ? 'PATCH' : 'POST';
        const url = editingSeller ? `/api/sellers/${editingSeller._id}` : '/api/sellers';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sellerData),
            });
            if (!response.ok) throw new Error('Błąd zapisu sprzedawcy');
            setShowForm(false);
            setEditingSeller(null);
            fetchSellers();
        } catch (error) { alert('Nie udało się zapisać sprzedawcy.'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć tego sprzedawcę?')) return;
        try {
            const response = await fetch(`/api/sellers/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Błąd usuwania sprzedawcy');
            fetchSellers();
        } catch (error) { alert('Nie udało się usunąć sprzedawcy.'); }
    };

    const filteredSellers = sellers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Zarządzanie Sprzedawcami</h2>
                    <p className="text-white/60">Dodawaj, edytuj i usuwaj zaufanych sprzedawców.</p>
                </div>
                <Button onClick={() => { setEditingSeller(null); setShowForm(true); }} className="bg-gradient-to-r from-blue-600 to-blue-400">
                    <Plus className="w-4 h-4 mr-2" /> Dodaj Sprzedawcę
                </Button>
            </div>
             <div className="glass-morphism rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input type="text" placeholder="Szukaj sprzedawców..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSellers.map((seller) => (
                    <motion.div key={seller.id.toString()} className="glass-morphism rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <img src={seller.image || '/placeholder.svg'} alt={seller.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{seller.name}</h3>
                                    <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-white/80">{seller.rating}</span></div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Button size="sm" variant="ghost" onClick={() => { setEditingSeller(seller); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(seller.id.toString())}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                            </div>
                        </div>
                        <p className="text-sm text-white/70">{seller.description}</p>
                        <p className="text-xs text-white/50 mt-4">Kliknięcia: {seller.clicks}</p>
                    </motion.div>
                ))}
            </div>
            {showForm && <SellerForm seller={editingSeller} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingSeller(null); }} />}
        </div>
    );
}