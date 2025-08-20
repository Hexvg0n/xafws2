// app/dashboard/components/CategoryManager.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, Tags, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { CategoryForm } from "./CategoryForm"; // <-- IMPORTUJEMY NOWY FORMULARZ

interface Category {
    _id: string;
    name: string;
    productCount: number;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false); // <-- Stan do pokazywania formularza

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Nie udało się pobrać kategorii.');
            setCategories(await res.json());
        } catch (err) { setError((err as Error).message); }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleDelete = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć tę kategorię?')) return;
        try {
            const res = await fetch('/api/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
             if (!res.ok) throw new Error('Błąd usuwania kategorii.');
            toast.success("Kategoria została usunięta.");
            await fetchCategories();
        } catch (err) { 
            toast.error((err as Error).message);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Tags /> Zarządzanie Kategoriami</h2>
                    <p className="text-white/60">Dodawaj i usuwaj kategorie produktów.</p>
                </div>
                {/* --- GŁÓWNY PRZYCISK "DODAJ" --- */}
                <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-600 to-blue-400">
                    <Plus className="w-4 h-4 mr-2" /> Dodaj Kategorię
                </Button>
            </div>
            
            <Card className="glass-morphism border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Istniejące Kategorie</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg border-white/10">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">Nazwa Kategorii</TableHead>
                                    <TableHead className="text-white">Liczba Produktów</TableHead>
                                    <TableHead className="text-right text-white">Akcje</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 && (
                                    <TableRow><TableCell colSpan={3} className="text-center text-white/60 py-8">Brak zdefiniowanych kategorii.</TableCell></TableRow>
                                )}
                                {categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-white/80">
                                                <Package className="w-4 h-4 text-white/60" />{category.productCount}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(category._id)} disabled={category.productCount > 0} title={category.productCount > 0 ? "Nie można usunąć kategorii, do której przypisane są produkty" : "Usuń kategorię"}>
                                                <Trash2 className="w-4 h-4 text-red-500/80 hover:text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                </CardContent>
            </Card>

            {/* --- WYŚWIETLANIE FORMULARZA W POPUPIE --- */}
            {showForm && <CategoryForm onSave={fetchCategories} onCancel={() => setShowForm(false)} />}
        </div>
    );
}