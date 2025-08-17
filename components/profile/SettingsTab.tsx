// app/profile/components/SettingsTab.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

// Definicja typów dla agentów i walut
interface Agent {
  name: string;
  url: string;
}

interface Currency {
  code: string;
  name: string;
}

const currencies: Currency[] = [
    { code: 'PLN', name: 'Polski Złoty' },
    { code: 'USD', name: 'Dolar Amerykański' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CNY', name: 'Chiński Yuan' },
];

export default function SettingsTab() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Pobieranie agentów
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/converter');
        if (!response.ok) throw new Error('Nie udało się pobrać agentów');
        const data = await response.json();
        setAgents(data.agents);
      } catch (error) {
        console.error(error);
      }
    };

    // Ładowanie zapisanych ustawień (z localStorage dla przykładu)
    const loadSettings = () => {
        const savedAgent = localStorage.getItem('preferredAgent');
        const savedCurrency = localStorage.getItem('preferredCurrency');
        if (savedAgent) setSelectedAgent(savedAgent);
        if (savedCurrency) setSelectedCurrency(savedCurrency);
    };
    
    Promise.all([fetchAgents(), loadSettings()]).finally(() => setIsLoading(false));

  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Zapisywanie ustawień (w localStorage dla przykładu)
    // W docelowej aplikacji powinno to być wysłane do API i zapisane w bazie danych
    localStorage.setItem('preferredAgent', selectedAgent);
    localStorage.setItem('preferredCurrency', selectedCurrency);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000); // Ukryj komunikat po 2s
    }, 1000);
  };

  if (isLoading) {
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
          Wybierz domyślną walutę i agenta. Ustawienia te będą używane w kalkulatorach i przy wyświetlaniu cen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Preferowany Agent</label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full bg-white/5 border-white/20">
              <SelectValue placeholder="Wybierz agenta..." />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.name} value={agent.name}>{agent.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preferowana Waluta</label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-full bg-white/5 border-white/20">
              <SelectValue placeholder="Wybierz walutę..." />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </SelectItem>
              ))}
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