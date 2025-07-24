"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Package, Loader2, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./ProductForm"; // Zakładamy, że ten plik istnieje w tym samym folderze

// Typ produktu zgodny z modelem i API
type Product = { 
    _id: string; 
    name: string; 
    sourceUrl: string; 
    shopInfo: { ShopName: string };
};

// Komponent dla "thumbnaila" w stylu kodu
const CodeThumbnail = () => (
    <div className="w-16 h-16 flex-shrink-0 rounded-md flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-emerald-600/20">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500/40">
            <path d="M10 20.25L4.75 15L10 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 20.25L19.25 15L14 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

export function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { data: session } = useSession();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error("Błąd pobierania produktów z serwera.");
            const data = await res.json();
            setProducts(data);
        } catch (error) { 
            console.error(error); 
            setProducts([]); 
        } finally { 
            setIsLoading(false); 
        }
    }, []);

    useEffect(() => { 
        fetchProducts(); 
    }, [fetchProducts]);

    const handleOpenFormForEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleOpenFormForAdd = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (product: Product) => {
        if (!confirm(`Czy na pewno chcesz usunąć produkt "${product.name}"? Tej akcji nie można cofnąć.`)) return;

        try {
            const res = await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Wystąpił błąd podczas usuwania produktu.");

            // Wywołanie webhooka po pomyślnym usunięciu
            await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: product.name,
                    action: 'delete',
                    user: session?.user?.name || 'Nieznany użytkownik',
                })
            });
            
            // Odśwież listę produktów
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Nie udało się usunąć produktu.");
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <>
            {isFormOpen && (
                <ProductForm 
                    product={editingProduct}
                    onSave={() => {
                        setIsFormOpen(false);
                        fetchProducts();
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            <Card className="glass-morphism border-white/10 text-white">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Produkty w Katalogu ({products.length})</span>
                        <Button onClick={handleOpenFormForAdd}><Package className="w-4 h-4 mr-2" /> Dodaj Nowy Produkt</Button>
                    </CardTitle>
                    <CardDescription className="text-white/60">Zarządzaj produktami dostępnymi w katalogu W2C.</CardDescription>
                </CardHeader>
                <CardContent>
                    {products.length > 0 ? (
                        <div className="space-y-4">
                            {products.map(product => (
                                <div key={product._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <CodeThumbnail />
                                        <div>
                                            <p className="font-semibold text-white">{product.name}</p>
                                            <p className="text-sm text-white/60">Sprzedawca: {product.shopInfo?.ShopName || 'Brak danych'}</p>
                                            <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                                                Link do źródła
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Button size="sm" variant="ghost" title="Edytuj" onClick={() => handleOpenFormForEdit(product)}><Edit className="w-4 h-4 text-blue-400" /></Button>
                                       <Button size="sm" variant="ghost" title="Usuń" onClick={() => handleDelete(product)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-white/70 py-10">
                            <Package className="mx-auto w-12 h-12 mb-4 opacity-30" />
                            Brak produktów w bazie danych. Kliknij przycisk powyżej, aby dodać pierwszy.
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}