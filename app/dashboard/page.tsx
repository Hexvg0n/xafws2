// app/dashboard/page.tsx

"use client";

import { useState, useEffect, type ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BarChart3, Package, Tag, Shield, Star, KeyRound, // <-- Dodaj KeyRound
  Loader2, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductManagerView } from "./components/ProductManagerView";
import { PromoManager } from "./components/promo-manager";
import { SellerManager } from "./components/seller-manager";
import { BatchManager } from "./components/batch-manager";

// --- Typy ---
type UserRole = 'root' | 'admin' | 'adder' | 'user';
type AdminTab = "stats" | "products" | "promos" | "sellers" | "batches" | "role-management";
interface DiscordRole { id: string; name: string; color: number; }
interface RoleSettings { rootRoleId: string; adminRoleId: string; adderRoleId: string; }

// ====================================================================
// --- NOWY KOMPONENT DO ZARZĄDZANIA ROLAMI ---
// ====================================================================
function RoleManager() {
    const [discordRoles, setDiscordRoles] = useState<DiscordRole[]>([]);
    const [settings, setSettings] = useState<RoleSettings>({ rootRoleId: '', adminRoleId: '', adderRoleId: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [rolesRes, settingsRes] = await Promise.all([
                    fetch('/api/discord/roles'),
                    fetch('/api/settings')
                ]);
                
                if (!rolesRes.ok) {
                    const err = await rolesRes.json();
                    throw new Error(err.error || 'Nie udało się pobrać ról z Discorda.');
                }
                if (!settingsRes.ok) throw new Error('Nie udało się pobrać ustawień.');
                
                const rolesData = await rolesRes.json();
                const settingsData = await settingsRes.json();

                setDiscordRoles(rolesData.roles || []);
                setSettings(settingsData);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Błąd zapisu');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>;

    const renderRoleSelect = (roleType: keyof RoleSettings, label: string) => (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <Select 
                value={settings[roleType] || ''} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, [roleType]: value }))}
            >
                <SelectTrigger className="w-full bg-white/5 border-white/20">
                    <SelectValue placeholder="Wybierz rolę z Discorda..." />
                </SelectTrigger>
                <SelectContent>
                    {discordRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                            <span style={{ color: `#${role.color.toString(16).padStart(6, '0')}` }}>●</span> {role.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <Card className="glass-morphism border-white/10 text-white">
            <CardHeader>
                <CardTitle>Zarządzaj Rolami Aplikacji</CardTitle>
                <CardDescription className="text-white/60">Przypisz role z serwera Discord do uprawnień w aplikacji. Zmiany będą widoczne dla użytkowników przy ich następnym logowaniu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && <p className="text-red-400 text-sm p-4 bg-red-500/10 rounded-md">{error}</p>}
                
                <div className="grid md:grid-cols-3 gap-6">
                    {renderRoleSelect('rootRoleId', 'Rola Root')}
                    {renderRoleSelect('adminRoleId', 'Rola Admin')}
                    {renderRoleSelect('adderRoleId', 'Rola Adder')}
                </div>
                
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving || !settings.rootRoleId || !settings.adminRoleId || !settings.adderRoleId}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {success && <CheckCircle className="mr-2 h-4 w-4" />}
                        {success ? 'Zapisano!' : 'Zapisz Ustawienia'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}


export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const tabs: { id: AdminTab; name: string; icon: ReactNode; roles: UserRole[] }[] = [
    { id: "stats", name: "Statystyki", icon: <BarChart3 className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "products", name: "Produkty", icon: <Package className="w-4 h-4" />, roles: ["admin", "root", "adder"] },
    { id: "promos", name: "Promocje", icon: <Tag className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "sellers", name: "Sprzedawcy", icon: <Shield className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "batches", name: "Best Batches", icon: <Star className="w-4 h-4" />, roles: ["admin", "root"] },
    // --- NOWA ZAKŁADKA ---
    { id: "role-management", name: "Zarządzaj Rolami", icon: <KeyRound className="w-4 h-4" />, roles: ["root"] },
  ];

  const availableTabs = tabs.filter(tab => userRole && tab.roles.includes(userRole));

  useEffect(() => {
    if (userRole && availableTabs.length > 0 && !availableTabs.some(tab => tab.id === activeTab)) {
        setActiveTab(availableTabs[0].id);
    }
  }, [userRole, activeTab, availableTabs]);

  const renderContent = () => {
    switch (activeTab) {
      case "stats": return <div className="text-white text-center p-8">Widok Statystyk (do zaimplementowania)</div>;
      case "products": return <ProductManagerView />;
      case "promos": return <PromoManager />;
      case "sellers": return <SellerManager />;
      case "batches": return <BatchManager />;
      // --- NOWY WIDOK ---
      case "role-management": return <RoleManager />;
      default: return <div className="text-white text-center p-8">Wybierz zakładkę</div>;
    }
  };

  if (status === 'loading') return <p className="text-center text-2xl text-white/70 pt-20">Ładowanie panelu...</p>;
  if (status === 'unauthenticated'  || !userRole || availableTabs.length === 0) return <p className="text-center text-2xl text-white/70 pt-20">Brak dostępu.</p>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8 mt-20">
            <div className="glass-morphism rounded-2xl p-2">
                <div className="flex flex-wrap gap-2">
                    {availableTabs.map((tab) => (
                        <Button key={tab.id} onClick={() => setActiveTab(tab.id)} variant={activeTab === tab.id ? "default" : "ghost"} className={`flex items-center space-x-2 ${activeTab === tab.id ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
                            {tab.icon}<span>{tab.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {renderContent()}
            </motion.div>
        </div>
    </div>
  );
}