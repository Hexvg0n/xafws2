"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfejs dla kategorii, aby TypeScript wiedział, jakiego typu danych się spodziewać
interface Category {
  _id: string;
  name: string;
}

export function EditProductForm({ onSave, onCancel, productToEdit }: { onSave: () => void; onCancel: () => void; productToEdit: Product }) {
  const [name, setName] = useState(productToEdit.name);
  const [sourceUrl, setSourceUrl] = useState(productToEdit.sourceUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const initialPreview = productToEdit.thumbnailUrl || productToEdit.mainImages?.[0] || null;
  const [imagePreview, setImagePreview] = useState<string | null>(initialPreview);

  // --- NOWY KOD START ---
  const [categoryId, setCategoryId] = useState<string | undefined>(productToEdit.category);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                setCategories(await res.json());
            }
        } catch (error) {
            console.error("Błąd pobierania kategorii", error);
        }
    };
    fetchCategories();
  }, []);
  // --- NOWY KOD KONIEC ---


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setImagePreview(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      let finalThumbnailUrl = productToEdit.thumbnailUrl;

      if (imageFile || (imageUrl && imageUrl !== initialPreview)) {
        const formData = new FormData();
        if (imageFile) formData.append('file', imageFile);
        else if (imageUrl) formData.append('imageUrl', imageUrl);

        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "Błąd przesyłania zdjęcia.");
        finalThumbnailUrl = uploadResult.thumbnailUrl;
      }

      const response = await fetch(`/api/products/${productToEdit._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // Zaktualizowano body, aby zawierało kategorię
        body: JSON.stringify({ name, sourceUrl, thumbnailUrl: finalThumbnailUrl, category: categoryId }),
      });

      if (!response.ok) throw new Error((await response.json()).error || 'Błąd serwera');
      
      alert("Produkt zaktualizowany!");
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
      <DialogContent className="max-w-lg glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Edytuj Produkt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Nazwa</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/5 border-white/10"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Link źródłowy</label>
            <Input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} required className="bg-white/5 border-white/10"/>
          </div>
          
          {/* --- NOWY KOD START --- */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Kategoria</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full bg-white/5 border-white/10">
                    <SelectValue placeholder="Wybierz kategorię..." />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          {/* --- NOWY KOD KONIEC --- */}

          <div>
             <label className="block text-sm font-medium text-white/80 mb-2">Zmień zdjęcie główne</label>
             <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Prześlij plik</TabsTrigger>
                    <TabsTrigger value="url">Wklej URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-2">
                   <Input type="file" accept="image/*" onChange={handleFileChange} className="bg-white/5 border-white/10"/>
                </TabsContent>
                <TabsContent value="url" className="pt-2">
                   <Input type="url" placeholder="https://..." value={imageUrl} onChange={handleUrlChange} className="bg-white/5 border-white/10"/>
                </TabsContent>
            </Tabs>
            {imagePreview && (
                <div className="mt-4 flex justify-center">
                    <Image src={imagePreview} alt="Podgląd" width={150} height={150} className="rounded-md object-cover w-36 h-36"/>
                </div>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
            <Button type="submit" disabled={isSaving} className="bg-blue-500 hover:bg-blue-600">{isSaving ? <Loader2 className="animate-spin" /> : "Zapisz zmiany"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}