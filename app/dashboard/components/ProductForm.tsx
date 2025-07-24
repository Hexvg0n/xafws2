"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Package, Wand2 } from "lucide-react";

type Product = { 
    _id?: string; 
    name: string; 
    sourceUrl: string; 
    shopInfo?: { ShopName: string };
};

interface ProductFormProps {
    product?: Product | null;
    onSave: () => void;
    onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [shopInfo, setShopInfo] = useState<{ ShopName: string } | undefined>(undefined);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isScraping, setIsScraping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setSourceUrl(product.sourceUrl || '');
            setShopInfo(product.shopInfo);
        }
    }, [product]);
    
    const handleScrape = async () => {
        if (!sourceUrl) {
            setError("Wklej link, aby pobrać dane.");
            return;
        }
        setIsScraping(true);
        setError(null);
        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: sourceUrl }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Nie udało się pobrać danych.");
            const data = await res.json();
            setName(data.name || ''); // Ustawiamy nazwę pobraną z API
            setShopInfo(data.shopInfo);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsScraping(false);
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            setError("Nazwa produktu jest wymagana.");
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            const isEditing = !!product?._id;
            const url = isEditing ? `/api/products/${product._id}` : '/api/products';
            const method = isEditing ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    sourceUrl, 
                    shopInfo 
                    // W przyszłości można tu dodać więcej pól z formularza
                }),
            });

            if (!response.ok) throw new Error((await response.json()).error || 'Wystąpił błąd podczas zapisu.');
            
            // Wywołanie webhooka
            await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: name,
                    action: isEditing ? 'edit' : 'add',
                    user: session?.user?.name || 'Użytkownik',
                    sourceUrl: sourceUrl,
                })
            });
            
            onSave();
            onCancel();

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="glass-morphism border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edytuj Produkt' : 'Dodaj Nowy Produkt'}</DialogTitle>
                    <DialogDescription className="text-white/60">Wklej link, pobierz dane, a następnie zapisz produkt w katalogu.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Link do Produktu</label>
                        <div className="flex items-center space-x-2">
                            <Input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://item.taobao.com/..." className="bg-white/5 flex-grow" />
                            <Button type="button" onClick={handleScrape} disabled={isScraping || !sourceUrl}>
                                {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Nazwa Produktu</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pobierz dane lub wpisz ręcznie..." className="bg-white/5" />
                    </div>
                    {shopInfo?.ShopName && (
                        <p className="text-sm text-white/70">Wykryty sprzedawca: <span className="font-semibold text-emerald-400">{shopInfo.ShopName}</span></p>
                    )}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onCancel}>Anuluj</Button>
                    <Button onClick={handleSubmit} disabled={isSaving || !name || !sourceUrl}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
                        {product ? 'Zapisz zmiany' : 'Dodaj produkt'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}