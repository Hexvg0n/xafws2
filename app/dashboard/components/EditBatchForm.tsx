"use client";

import { useState } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Batch } from "@/lib/types";

export function EditBatchForm({ onSave, onCancel, batchToEdit }: { onSave: () => void; onCancel: () => void; batchToEdit: Batch }) {
  const [name, setName] = useState(batchToEdit.name);
  const [sourceUrl, setSourceUrl] = useState(batchToEdit.sourceUrl);
  const [batch, setBatch] = useState(batchToEdit.batch);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const initialPreview = batchToEdit.thumbnailUrl || batchToEdit.mainImages?.[0] || null;
  const [imagePreview, setImagePreview] = useState<string | null>(initialPreview);

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
      let finalThumbnailUrl = batchToEdit.thumbnailUrl;

      if (imageFile || (imageUrl && imageUrl !== initialPreview)) {
        const formData = new FormData();
        if (imageFile) formData.append('file', imageFile);
        else if (imageUrl) formData.append('imageUrl', imageUrl);

        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "Błąd przesyłania zdjęcia.");
        finalThumbnailUrl = uploadResult.thumbnailUrl;
      }

      const response = await fetch(`/api/batches/${batchToEdit._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sourceUrl, batch, thumbnailUrl: finalThumbnailUrl }),
      });

      if (!response.ok) throw new Error((await response.json()).error || 'Błąd serwera');

      alert("Batch zaktualizowany!");
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
          <DialogTitle>Edytuj Batch</DialogTitle>
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
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Nazwa Batcha</label>
            <Input value={batch} onChange={(e) => setBatch(e.target.value)} required className="bg-white/5 border-white/10"/>
          </div>
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