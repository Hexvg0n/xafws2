// components/profile/SettingsTab.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePreferences } from "../context/PreferencesProvider"; // <-- WAŻNY IMPORT
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

interface Agent { key: string; name: string; }
const currencies = [
    { code: 'PLN', name: 'Polski Złoty' },
    { code: 'USD', name: 'Dolar Amerykański' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CNY', name: 'Chiński Yuan' },
];

export default function SettingsTab() {
  const [agents, setAgents] = useState<Agent[]>([]);
  // ZMIANA: Używamy globalnego stanu z PreferencesProvider
  const { preferredAgent, preferredCurrency, updateAgent, updateCurrency, isLoading: isLoadingPrefs } = usePreferences();
  
  const [selectedAgent, setSelectedAgent] = useState(preferredAgent);
  const [selectedCurrency, setSelectedCurrency] = useState(preferredCurrency);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronizuj stan lokalny z globalnym, gdy ten się załaduje
  useEffect(() => {
    setSelectedAgent(preferredAgent);
    setSelectedCurrency(preferredCurrency);
  }, [preferredAgent, preferredCurrency]);

  useEffect(() => {
    const fetchAgents = async () => {
        try {
            const agentsRes = await fetch('/api/converter');
            if (agentsRes.ok) setAgents((await agentsRes.json()).agents || []);
        } catch (error) { console.error("Błąd pobierania agentów", error); }
    };
    fetchAgents();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredAgent: selectedAgent, preferredCurrency: selectedCurrency }),
      });
      if (!res.ok) throw new Error("Błąd zapisu ustawień");

      // ZMIANA: Aktualizujemy globalny stan natychmiast po zapisie
      updateAgent(selectedAgent);
      updateCurrency(selectedCurrency);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) { 
      alert("Wystąpił błąd podczas zapisywania ustawień.");
    } finally { 
      setIsSaving(false); 
    }
  };

  if (isLoadingPrefs) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-white/70" />
      </div>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle>Preferencje</CardTitle>
        <CardDescription className="text-white/60">
          Ustawienia te będą używane w całej aplikacji do konwersji linków i przeliczania walut.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Preferowany Agent</label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full bg-white/5 border-white/20"><SelectValue placeholder="Wybierz agenta..." /></SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (<SelectItem key={agent.key} value={agent.key}>{agent.name}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preferowana Waluta</label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-full bg-white/5 border-white/20"><SelectValue placeholder="Wybierz walutę..." /></SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (<SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving || !selectedAgent || !selectedCurrency}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saveSuccess && <CheckCircle className="mr-2 h-4 w-4" />}
                {saveSuccess ? 'Zapisano!' : 'Zapisz zmiany'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}