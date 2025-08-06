"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PromoForm } from "./promo-form" 
import type { IPromo } from "@/models/Promo" 

export function PromoManager() {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<IPromo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/promos');
      if (!res.ok) throw new Error("Błąd pobierania promocji");
      const data = await res.json();
      setPromos(data);
    } catch (error) {
      console.error(error);
      setPromos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);
  
  const handleSave = async (promoData: Partial<IPromo>) => {
    const method = editingPromo ? 'PATCH' : 'POST';
    const url = editingPromo ? `/api/promos/${editingPromo._id}` : '/api/promos';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoData),
      });

      if (!response.ok) throw new Error('Błąd zapisu promocji');
      
      setShowForm(false);
      setEditingPromo(null);
      fetchPromos();
    } catch (error) {
      alert('Nie udało się zapisać promocji.');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę promocję?')) return;
    try {
      const response = await fetch(`/api/promos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Błąd usuwania promocji');
      fetchPromos();
    } catch (error) {
      alert('Nie udało się usunąć promocji.');
    }
  };

  const filteredPromos = promos.filter(promo =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Zarządzanie Promocjami</h2>
          <p className="text-white/60">Dodawaj, edytuj i usuwaj promocje.</p>
        </div>
        <Button onClick={() => { setEditingPromo(null); setShowForm(true); }} className="bg-gradient-to-r from-blue-600 to-blue-400">
          <Plus className="w-4 h-4 mr-2" /> Dodaj Promocję
        </Button>
      </div>
      <div className="glass-morphism rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input type="text" placeholder="Szukaj promocji..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo) => (
          <motion.div key={promo.id.toString()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-morphism rounded-2xl overflow-hidden">
            <img src={promo.image || "/placeholder.svg"} alt={promo.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-white">{promo.title}</h3>
              <p className="text-sm text-neutral-400">Sprzedawca: {promo.seller}</p>
              <p className="text-lg font-semibold text-blue-400 mt-2">{promo.price} PLN</p>
              <a href={promo.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Przejdź do oferty</a>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => { setEditingPromo(promo); setShowForm(true); }}><Edit className="w-4 h-4 mr-2" /> Edytuj</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(promo.id.toString())}><Trash2 className="w-4 h-4 mr-2" /> Usuń</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {showForm && <PromoForm promo={editingPromo} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingPromo(null); }} />}
    </div>
  )
}