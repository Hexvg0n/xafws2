// app/dashboard/components/GuideManager.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideForm } from "./GuideForm";

// Definiujemy prosty typ, aby pomóc TypeScriptowi
interface Guide {
    _id: string;
    title: string;
    category: string;
    sections: any[];
    [key: string]: any; // Pozwala na inne właściwości
}

export function GuideManager() {
    const [guides, setGuides] = useState<Guide[]>([]); // <<< Używamy nowego typu
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingGuide, setEditingGuide] = useState<Partial<Guide> | null>(null);

    const fetchGuides = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/guides');
            if (!res.ok) throw new Error("Błąd pobierania poradników");
            setGuides(await res.json());
        } catch (error) { 
            console.error(error); 
            setGuides([]); 
        } finally { 
            setIsLoading(false); 
        }
    }, []);

    useEffect(() => { fetchGuides(); }, [fetchGuides]);

    const handleSave = async (guideData: any) => {
        const method = editingGuide?._id ? 'PATCH' : 'POST';
        const url = editingGuide?._id ? `/api/guides/${editingGuide._id}` : '/api/guides';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guideData),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Błąd zapisu poradnika');
            }
            setShowForm(false);
            setEditingGuide(null);
            await fetchGuides();
        } catch (error) { 
            alert((error as Error).message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć ten poradnik?')) return;
        try {
            const response = await fetch(`/api/guides/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Błąd usuwania poradnika');
            await fetchGuides();
        } catch (error) { 
            alert('Nie udało się usunąć poradnika.'); 
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen /> Zarządzanie Poradnikami</h2>
                    <p className="text-white/60">Dodawaj, edytuj i usuwaj poradniki "How To".</p>
                </div>
                <Button onClick={() => { setEditingGuide(null); setShowForm(true); }} className="bg-gradient-to-r from-blue-600 to-blue-400">
                    <Plus className="w-4 h-4 mr-2" /> Dodaj Poradnik
                </Button>
            </div>
            
            <div className="space-y-4">
                {guides.map((guide) => (
                    <motion.div key={guide._id} className="glass-morphism rounded-lg p-4 flex items-center justify-between">
                       <div>
                           <h3 className="font-semibold text-white">{guide.title}</h3>
                           <p className="text-sm text-white/60">{guide.category} • {guide.sections.length} sekcji</p>
                       </div>
                       <div className="flex items-center gap-2">
                           <Button size="sm" variant="ghost" onClick={() => { setEditingGuide(guide); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                           <Button size="sm" variant="ghost" onClick={() => handleDelete(guide._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                       </div>
                    </motion.div>
                ))}
            </div>

            {showForm && <GuideForm guide={editingGuide} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingGuide(null); }} />}
        </div>
    );
}