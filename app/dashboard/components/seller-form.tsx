"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { ISeller } from "@/models/Seller";

export function SellerForm({ seller, onSave, onCancel }: { seller: ISeller | null; onSave: (data: Partial<ISeller>) => void; onCancel: () => void; }) {
    const [formData, setFormData] = useState({
        name: seller?.name || '',
        image: seller?.image || '',
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{seller ? 'Edytuj Sprzedawcę' : 'Dodaj Sprzedawcę'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nazwa" required />
                    <Input name="image" value={formData.image} onChange={handleChange} placeholder="URL obrazka" required />
                    <Input name="rating" value={formData.rating} onChange={handleChange} placeholder="Ocena (0-5)" type="number" step="0.1" min="0" max="5" required />
                    <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Opis" />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'Zapisz'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}