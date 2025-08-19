// app/dashboard/components/seller-form.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { type Seller } from "@/lib/types"; // <-- ZMIANA: Importujemy nowy typ

// ZMIANA: Używamy nowego typu w propsach
export function SellerForm({ seller, onSave, onCancel }: { seller: Seller | null; onSave: (data: Partial<Seller>) => Promise<void>; onCancel: () => void; }) {
    const [formData, setFormData] = useState({
        name: seller?.name || '',
        image: seller?.image || '',
        link: seller?.link || '',
        rating: seller?.rating || 0,
        description: seller?.description || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave(formData);
        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
    };

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="glass-morphism border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>{seller ? 'Edytuj Sprzedawcę' : 'Dodaj Nowego Sprzedawcę'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nazwa sprzedawcy" required className="bg-white/5 border-white/10" />
                    <Input name="image" value={formData.image} onChange={handleChange} placeholder="URL do zdjęcia/logo" required className="bg-white/5 border-white/10" />
                    <Input name="link" value={formData.link} onChange={handleChange} placeholder="Link do sklepu (np. Weidian)" required className="bg-white/5 border-white/10" />
                    <Input name="rating" value={formData.rating} onChange={handleChange} placeholder="Ocena (0-5)" type="number" step="0.1" min="0" max="5" required className="bg-white/5 border-white/10" />
                    <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Krótki opis" className="bg-white/5 border-white/10" />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Zapisz'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}