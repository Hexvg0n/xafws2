// app/dashboard/components/seller-manager.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Loader2, Star, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SellerForm } from "./seller-form";
import { type Seller } from "@/lib/types"; // <-- ZMIANA: Importujemy nowy, prosty typ
import Link from 'next/link';

export function SellerManager() {
    // ZMIANA: Używamy nowego typu w stanie
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSellers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/sellers');
            if (!res.ok) throw new Error("Błąd pobierania sprzedawców");
            // Rzutujemy odpowiedź na nasz nowy, bezpieczny typ
            setSellers(await res.json() as Seller[]);
        } catch (error) { console.error(error); setSellers([]); }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchSellers(); }, [fetchSellers]);

    const handleSave = async (sellerData: Partial<Seller>) => {
        const method = editingSeller ? 'PATCH' : 'POST';
        const url = editingSeller ? `/api/sellers/${editingSeller._id}` : '/api/sellers';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sellerData),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Błąd zapisu sprzedawcy');
            }
            setShowForm(false);
            setEditingSeller(null);
            fetchSellers();
        } catch (error) {
            alert((error as Error).message);
        }
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
                    // Teraz TypeScript wie, że seller._id to string - nie potrzeba .toString()
                    <motion.div key={seller._id} className="glass-morphism rounded-2xl p-6 flex flex-col">
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
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(seller._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                            </div>
                        </div>
                        <p className="text-sm text-white/70 flex-grow">{seller.description}</p>
                        <div className="border-t border-white/10 pt-4 mt-4">
                            <Link href={seller.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                <span>Przejdź do sklepu</span>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
            {showForm && <SellerForm seller={editingSeller} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingSeller(null); }} />}
        </div>
    );
}