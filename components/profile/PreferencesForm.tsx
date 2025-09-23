// components/profile/PreferencesForm.tsx

"use client";

import { useState, useEffect } from "react";
import { usePreferences } from "../context/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";

interface Agent { key: string; name: string; }
const currencies = [
    { code: 'PLN', name: 'Polski Złoty' },
    { code: 'USD', name: 'Dolar Amerykański' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CNY', name: 'Chiński Yuan' },
];

interface PreferencesFormProps {
    onSave?: () => void; // Callback to run after saving
}

export function PreferencesForm({ onSave }: PreferencesFormProps) {
  const { preferredAgent, preferredCurrency, updateAgent, updateCurrency } = usePreferences();
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState(preferredAgent);
  const [selectedCurrency, setSelectedCurrency] = useState(preferredCurrency);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

      updateAgent(selectedAgent);
      updateCurrency(selectedCurrency);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (onSave) onSave();
      }, 2000);
    } catch (error) { 
      alert("Wystąpił błąd podczas zapisywania ustawień.");
    } finally { 
      setIsSaving(false); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">Preferowany Agent</label>
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-full bg-white/5 border-white/20"><SelectValue placeholder="Wybierz agenta..." /></SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (<SelectItem key={agent.key} value={agent.key}>{agent.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">Preferowana Waluta</label>
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
            {saveSuccess ? 'Zapisano!' : 'Zapisz preferencje'}
        </Button>
      </div>
    </div>
  );
}