"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Package, Link as LinkIcon, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Typ dla danych zeskrapowanych i finalnego produktu
interface ScrapedData {
  colors?: string[];
  sizes?: string[];
  weightInGrams?: number;
  volumeCm3?: { length: number; width: number; height: number };
  avgDeliveryDays?: number;
  salesCount?: number;
}

interface ProductFormProps {
  // Nie potrzebujemy już edycji, bo dane są pobierane na nowo
  onSave: () => void; // Funkcja do odświeżenia listy po zapisaniu
  onCancel: () => void;
}

export function ProductForm({ onSave, onCancel }: ProductFormProps) {
  const [sourceUrl, setSourceUrl] = useState("");
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do scrapowania danych
  const handleScrape = async () => {
    if (!sourceUrl) {
      alert("Proszę wkleić link do produktu.");
      return;
    }
    setIsScraping(true);
    setError(null);
    setScrapedData(null);

    try {
      // W przyszłości ten endpoint będzie scrapował dane
      // Na razie symulujemy jego działanie
      console.log("Rozpoczynanie scrapowania dla:", sourceUrl);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Symulacja opóźnienia sieciowego

      const mockData: ScrapedData = {
          colors: ["Black - Chicago", "Dark green-London", "Green-Rome", "Royal Blue-New York"],
          sizes: ["S", "M", "L", "XL", "2XL"],
          weightInGrams: 300,
          volumeCm3: { length: 29, width: 27, height: 6 },
          avgDeliveryDays: 3,
          salesCount: 15,
      };
      
      setScrapedData(mockData);

    } catch (err) {
      setError("Nie udało się pobrać danych ze strony. Sprawdź link i spróbuj ponownie.");
      console.error(err);
    } finally {
      setIsScraping(false);
    }
  };

  // Funkcja do zapisu produktu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!imageFile && !imageUrl) || !sourceUrl) {
        alert("Nazwa, link do produktu i obrazek są wymagane.");
        return;
    }
    setIsSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('sourceUrl', sourceUrl);
    if (imageFile) {
        formData.append('imageFile', imageFile);
    } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Wystąpił nieznany błąd');
        }

        alert("Produkt został pomyślnie dodany!");
        onSave(); // Wywołujemy funkcję odświeżającą listę w komponencie nadrzędnym
        onCancel(); // Zamykamy formularz

    } catch (err) {
        setError((err as Error).message);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-morphism rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Dodaj Nowy Produkt</h2>
          <Button onClick={onCancel} variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* KROK 1: Wklejenie linku i scrapowanie */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Link do produktu</label>
            <div className="flex items-center space-x-2">
              <Input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://... (np. z Kakobuy)"
                className="flex-1"
              />
              <Button type="button" onClick={handleScrape} disabled={isScraping}>
                {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span className="ml-2">Pobierz dane</span>
              </Button>
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* KROK 2: Uzupełnienie reszty danych i podgląd */}
          {scrapedData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-6 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lewa kolumna: Nazwa i obrazek */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Nazwa produktu *</label>
                    <Input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="np. XaffReps T-shirt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Obrazek produktu *</label>
                    <Input type="file" accept="image/*" onChange={(e) => { setImageFile(e.target.files?.[0] || null); setImageUrl(""); }} className="mb-2" />
                    <div className="text-center text-xs text-white/60 my-2">LUB</div>
                    <Input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); }} placeholder="Wklej link do obrazka" />
                  </div>
                </div>

                {/* Prawa kolumna: Zeskrapowane dane */}
                <div className="glass-morphism rounded-xl p-4 space-y-3 text-sm">
                    <h4 className="font-semibold text-white">Pobrane dane:</h4>
                    <p className="text-white/80"><strong>Kolory:</strong> {scrapedData.colors?.join(', ') || 'Brak'}</p>
                    <p className="text-white/80"><strong>Rozmiary:</strong> {scrapedData.sizes?.join(', ') || 'Brak'}</p>
                    <p className="text-white/80"><strong>Waga:</strong> {scrapedData.weightInGrams}g</p>
                    <p className="text-white/80"><strong>Objętość:</strong> {`${scrapedData.volumeCm3?.length}x${scrapedData.volumeCm3?.width}x${scrapedData.volumeCm3?.height} cm³`}</p>
                    <p className="text-white/80"><strong>Sprzedaż:</strong> {scrapedData.salesCount} szt.</p>
                    <p className="text-white/80"><strong>Dostawa:</strong> ~{scrapedData.avgDeliveryDays} dni</p>
                </div>
              </div>

              {/* KROK 3: Zapis */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
                <Button onClick={onCancel} type="button" variant="ghost">Anuluj</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                  <span className="ml-2">Zapisz Produkt</span>
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}