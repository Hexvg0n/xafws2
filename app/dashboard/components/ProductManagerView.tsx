"use client";

import { useState, useCallback, useEffect } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { AddProductForm } from "./AddProductForm";
import { EditProductForm } from "./EditProductForm";
import { Package, Loader2, Edit, Send, Trash2 } from "lucide-react";

export function ProductManagerView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isNotifying, setIsNotifying] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error("Błąd pobierania produktów");
            setProducts(await res.json());
        } catch (error) { console.error(error); setProducts([]); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;
        const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        if (response.ok) { alert("Produkt usunięty."); fetchProducts(); }
        else { alert("Błąd podczas usuwania produktu."); }
    };

    const handleSendToDiscord = async (productId: string) => {
        if (!confirm("Czy na pewno chcesz opublikować ten produkt na Discordzie?")) return;
        setIsNotifying(productId);
        try {
            const response = await fetch(`/api/products/${productId}/notify-discord`, { method: 'POST' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Wystąpił nieznany błąd.');
            alert(result.message);
        } catch (error) {
            alert(`Błąd: ${(error as Error).message}`);
        } finally {
            setIsNotifying(null);
        }
    };
    
    if (isLoading) return <p className="text-center text-white/70">Ładowanie...</p>;

    return (
        <div className="glass-morphism rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Zarządzaj Produktami ({products.length})</h3>
                <Button onClick={() => setShowAddForm(true)}><Package className="w-4 h-4 mr-2" /> Dodaj Produkt</Button>
            </div>
            
            <div className="space-y-4">
                {products.length > 0 ? products.map(product => (
                    <div key={product._id.toString()} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                            <Image 
                                src={product.thumbnailUrl || product.mainImages?.[0] || '/placeholder.png'} 
                                alt={product.name} 
                                width={64} 
                                height={64} 
                                className="rounded-md object-cover w-16 h-16"
                            />
                            <div>
                                <p className="font-semibold text-white">{product.name}</p>
                                <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Link do źródła</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button onClick={() => handleSendToDiscord(product._id.toString())} size="sm" variant="ghost" title="Wyślij na Discorda" disabled={isNotifying === product._id}>
                                {isNotifying === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-purple-400" />}
                           </Button>
                           <Button onClick={() => setEditingProduct(product)} size="sm" variant="ghost" title="Edytuj"><Edit className="w-4 h-4 text-blue-400" /></Button>
                           <Button onClick={() => handleDeleteProduct(product._id.toString())} size="sm" variant="ghost" title="Usuń"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                    </div>
                )) : <p className="text-white/70 text-center py-8">Brak produktów. Dodaj pierwszy!</p>}
            </div>
            
            {showAddForm && <AddProductForm onSave={() => { setShowAddForm(false); fetchProducts(); }} onCancel={() => setShowAddForm(false)} />}
            {editingProduct && <EditProductForm productToEdit={editingProduct} onSave={() => { setEditingProduct(null); fetchProducts(); }} onCancel={() => setEditingProduct(null)}/>}
        </div>
    )
}