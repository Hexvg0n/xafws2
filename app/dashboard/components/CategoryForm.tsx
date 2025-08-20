// app/dashboard/components/CategoryForm.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormProps {
  onSave: () => void; // Funkcja do odświeżenia listy
  onCancel: () => void;
}

export function CategoryForm({ onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        toast.error("Nazwa kategorii nie może być pusta.");
        return;
    }
    setIsAdding(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Błąd dodawania kategorii.');
      }
      toast.success(`Kategoria "${name.trim()}" została dodana!`);
      onSave(); // Wywołujemy funkcję odświeżającą listę
      onCancel(); // Zamykamy formularz
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Dodaj Nową Kategorię</DialogTitle>
          <DialogDescription>Wpisz nazwę dla nowej kategorii produktów.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. T-Shirty, Spodnie, Buty..."
            className="bg-white/5 border-white/10"
            autoFocus
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
            <Button type="submit" disabled={isAdding} className="bg-blue-500 hover:bg-blue-600">
              {isAdding ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
              Dodaj Kategorię
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}