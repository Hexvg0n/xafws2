"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { IBatch } from "@/models/Batch";

interface BatchFormProps {
    batch: IBatch | null;
    onSave: (data: Partial<IBatch>) => void;
    onCancel: () => void;
}

export function BatchForm({ batch, onSave, onCancel }: BatchFormProps) {
    const [formData, setFormData] = useState({
        title: batch?.title || '',
        image: batch?.image || '',
        price: batch?.price || 0,
        link: batch?.link || '',
        batch_name: batch?.batch_name || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave(formData);
        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    };

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="glass-morphism border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>{batch ? 'Edytuj Batch' : 'Dodaj Nowy Batch'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" value={formData.title} onChange={handleChange} placeholder="Tytuł produktu" required className="bg-white/5 border-white/10" />
                    <Input name="image" value={formData.image} onChange={handleChange} placeholder="URL obrazka" required className="bg-white/5 border-white/10" />
                    <Input name="price" value={formData.price} onChange={handleChange} placeholder="Cena" type="number" required className="bg-white/5 border-white/10" />
                    <Input name="link" value={formData.link} onChange={handleChange} placeholder="Link do produktu" required className="bg-white/5 border-white/10" />
                    <Input name="batch_name" value={formData.batch_name} onChange={handleChange} placeholder="Nazwa batcha" required className="bg-white/5 border-white/10" />
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