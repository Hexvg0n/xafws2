// app/dashboard/components/AddProductForm.tsx

"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  _id: string;
  name: string;
}

export function AddProductForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [sourceUrl, setSourceUrl] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
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

  const handleAddProduct = async () => {
    if (!name || !sourceUrl || !categoryId) {
      setError("Nazwa, link oraz kategoria są wymagane.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      let finalThumbnailUrl = "";
      if (imageFile || imageUrl) {
          const formData = new FormData();
          if (imageFile) {
            formData.append('file', imageFile);
          } else if (imageUrl) {
            formData.append('imageUrl', imageUrl);
          }
    
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
    
          const uploadResult = await uploadResponse.json();
          if (!uploadResponse.ok) {
            throw new Error(uploadResult.error || "Błąd przesyłania zdjęcia.");
          }
          finalThumbnailUrl = uploadResult.thumbnailUrl;
      }

      const productData = { 
          name, 
          sourceUrl, 
          thumbnailUrl: finalThumbnailUrl,
          category: categoryId,
      };

      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const productResult = await productResponse.json();
      if (!productResponse.ok) {
        throw new Error(productResult.error || "Nieznany błąd API podczas zapisu produktu.");
      }

      alert(`Produkt "${productResult.name}" został pomyślnie dodany!`);
      onSave();
      onCancel();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Dodaj Nowy Produkt</DialogTitle>
          <DialogDescription>Wypełnij dane, dodaj zdjęcie główne i link. Reszta danych zostanie pobrana automatycznie w tle.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Nazwa Produktu *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="np. XaffReps T-Shirt" className="bg-white/5 border-white/10"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Link do produktu (1688, Taobao, Weidian) *</label>
            <Input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Wklej link..." className="bg-white/5 border-white/10"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Kategoria *</label>
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
          <div>
             <label className="block text-sm font-medium text-white/80 mb-2">Zdjęcie główne</label>
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
          {error && <p className="text-red-400 text-sm pt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={onCancel} variant="ghost">Anuluj</Button>
          <Button onClick={handleAddProduct} disabled={isProcessing} className="bg-blue-500 hover:bg-blue-600">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
            <span className="ml-2">{isProcessing ? "Przetwarzanie..." : "Dodaj Produkt"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}