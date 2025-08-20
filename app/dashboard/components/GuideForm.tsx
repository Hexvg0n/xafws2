// app/dashboard/components/GuideForm.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { type IGuide } from "@/models/Guide";

type GuideFormProps = {
  guide: Partial<IGuide> | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
};

export function GuideForm({ guide, onSave, onCancel }: GuideFormProps) {
    const [formData, setFormData] = useState({
        title: guide?.title || '',
        slug: guide?.slug || '',
        description: guide?.description || '',
        category: guide?.category || '',
        image: guide?.image || '',
        tags: guide?.tags?.join(', ') || '',
        sections: guide?.sections || [{ title: '', content: '' }],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!formData.slug && formData.title) {
            const newSlug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 50);
            setFormData(prev => ({ ...prev, slug: newSlug }));
        }
    }, [formData.title]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const dataToSave = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };
        await onSave(dataToSave);
        setIsLoading(false);
    };

    const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
        const newSections = [...formData.sections];
        newSections[index][field] = value;
        setFormData(prev => ({ ...prev, sections: newSections }));
    };
    
    const addSection = () => {
        setFormData(prev => ({ ...prev, sections: [...prev.sections, { title: '', content: '' }] }));
    };

    const removeSection = (index: number) => {
        const newSections = formData.sections.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, sections: newSections }));
    };

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="glass-morphism border-white/10 text-white max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{guide?._id ? 'Edytuj Poradnik' : 'Dodaj Nowy Poradnik'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto flex-grow pr-6">
                    <Input value={formData.title} onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))} placeholder="Tytuł poradnika" required className="bg-white/5 border-white/10" />
                    <Input value={formData.slug} onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))} placeholder="Link (slug)" required className="bg-white/5 border-white/10" />
                    <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} placeholder="Krótki opis" required className="bg-white/5 border-white/10" />
                    <Input value={formData.category} onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))} placeholder="Kategoria (np. Dla początkujących)" required className="bg-white/5 border-white/10" />
                    <Input value={formData.image} onChange={(e) => setFormData(prev => ({...prev, image: e.target.value}))} placeholder="URL do obrazka" className="bg-white/5 border-white/10" />
                    <Input value={formData.tags} onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))} placeholder="Tagi (oddzielone przecinkiem)" className="bg-white/5 border-white/10" />

                    <h3 className="text-lg font-semibold pt-4">Sekcje Poradnika</h3>
                    {formData.sections.map((section, index) => (
                        <div key={index} className="space-y-2 p-4 border border-white/10 rounded-lg relative">
                            <Input value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} placeholder={`Tytuł sekcji ${index + 1}`} required className="bg-white/10 border-white/20" />
                            <Textarea value={section.content} onChange={(e) => handleSectionChange(index, 'content', e.target.value)} placeholder={`Treść sekcji ${index + 1} (możesz używać Markdown)`} required className="bg-white/10 border-white/20 h-32" />
                             <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                     <Button type="button" variant="outline" onClick={addSection} className="border-white/20 hover:bg-white/10"><Plus className="w-4 h-4 mr-2" /> Dodaj sekcję</Button>

                </form>
                 <DialogFooter className="pt-4 flex-shrink-0">
                    <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
                    <Button type="submit" form="guideForm" onClick={handleSubmit} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Zapisz'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}