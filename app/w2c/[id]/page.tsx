
"use client";

import { useState, useEffect, type ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Users, UserCheck, BarChart3, Package, Loader2, KeyRound, Edit, Trash2,
  Shield, UserPlus, CheckCircle, X, Clock, ShieldOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ====================================================================
// --- DEFINICJE TYPÓW ---
// ====================================================================
type UserRole = 'root' | 'admin' | 'adder' | 'user';
type AdminTab = "stats" | "products" | "user-management" | "user-approval" | "role-management";
type Product = { 
  _id: string; 
  name: string; 
  sourceUrl: string; 
  shopInfo: { ShopName: string };
};
type User = { _id: string; nickname: string; role: UserRole; status: 'aktywny' | 'oczekujący' | 'zawieszony' | 'zablokowany'; };
interface DiscordRole { id: string; name: string; color: number; }
interface RoleSettings { rootRoleId: string; adminRoleId: string; adderRoleId: string; }


// ====================================================================
// --- KOMPONENTY-WIDOKI DLA ZAKŁADEK ---
// ====================================================================

// --- WIDOK ZARZĄDZANIA PRODUKTAMI ---
function ProductManagerView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const CodeThumbnail = () => (
        <div className="w-16 h-16 flex-shrink-0 rounded-md flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-emerald-600/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500/40">
                <path d="M10 20.25L4.75 15L10 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 20.25L19.25 15L14 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error("Błąd pobierania produktów");
            setProducts(await res.json());
        } catch (error) { console.error(error); setProducts([]); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <Card className="glass-morphism border-white/10 text-white">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Produkty w Katalogu ({products.length})</span>
                    <Button><Package className="w-4 h-4 mr-2" /> Dodaj Nowy Produkt</Button>
                </CardTitle>
                <CardDescription className="text-white/60">Zarządzaj produktami dostępnymi w katalogu W2C.</CardDescription>
            </CardHeader>
            <CardContent>
                {products.length > 0 ? (
                    <div className="space-y-4">
                        {products.map(product => (
                            <div key={product._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <CodeThumbnail />
                                    <div>
                                        <p className="font-semibold text-white">{product.name}</p>
                                        <p className="text-sm text-white/60">Sprzedawca: {product.shopInfo?.ShopName || 'Brak danych'}</p>
                                        <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                                            Link do źródła
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <Button size="sm" variant="ghost" title="Edytuj"><Edit className="w-4 h-4 text-blue-400" /></Button>
                                   <Button size="sm" variant="ghost" title="Usuń"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-white/70 py-10">
                        <Package className="mx-auto w-12 h-12 mb-4 opacity-30" />
                        Brak produktów w bazie danych.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- WIDOK ZARZĄDZANIA UŻYTKOWNIKAMI ---
function UserManagementView() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error("Błąd pobierania użytkowników");
            setUsers(await res.json());
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <Card className="glass-morphism border-white/10 text-white">
            <CardHeader>
                <CardTitle>Zarządzaj Użytkownikami ({users.length})</CardTitle>
                <CardDescription className="text-white/60">Zarządzaj statusami i uprawnieniami użytkowników.</CardDescription>
            </CardHeader>
            <CardContent>
                 {users.length > 0 ? (
                    <div className="space-y-4">
                        {users.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <p className="font-semibold text-white">{user.nickname}</p>
                                    <p className="text-sm text-white/60">Rola: {user.role} | Status: <span className={user.status === 'aktywny' ? 'text-green-400' : 'text-yellow-400'}>{user.status}</span></p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Button size="sm" variant="ghost" title="Zawieś"><Clock className="w-4 h-4 text-yellow-500" /></Button>
                                     <Button size="sm" variant="ghost" title="Zablokuj"><ShieldOff className="w-4 h-4 text-red-500" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-white/70 py-10">
                        <Users className="mx-auto w-12 h-12 mb-4 opacity-30" />
                        Brak użytkowników do zarządzania.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- WIDOK ZATWIERDZANIA UŻYTKOWNIKÓW ---
function UserApprovalView() {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users?status=oczekujący');
            if (!res.ok) throw new Error("Błąd pobierania danych");
            setPendingUsers(await res.json());
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchPendingUsers(); }, [fetchPendingUsers]);

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <Card className="glass-morphism border-white/10 text-white">
            <CardHeader>
                <CardTitle>Zatwierdź Użytkowników ({pendingUsers.length})</CardTitle>
                <CardDescription className="text-white/60">Przeglądaj i zatwierdzaj prośby o dołączenie.</CardDescription>
            </CardHeader>
            <CardContent>
                {pendingUsers.length > 0 ? (
                    <div className="space-y-4">
                        {pendingUsers.map(user => (
                             <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div><p className="font-semibold text-white">{user.nickname}</p><p className="text-sm text-white/60">Prośba o rolę: {user.role}</p></div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="text-green-400"><UserCheck className="w-4 h-4 mr-2" /> Zatwierdź</Button>
                                    <Button size="sm" variant="ghost" className="text-red-400"><X className="w-4 h-4 mr-2" /> Odrzuć</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-white/70 py-10">
                        <UserCheck className="mx-auto w-12 h-12 mb-4 opacity-30" />
                        Brak oczekujących próśb o dołączenie.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- WIDOK ZARZĄDZANIA ROLAMI ---
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
            try {
                const [rolesRes, settingsRes] = await Promise.all([
                    fetch('/api/discord/roles'),
                    fetch('/api/settings')
                ]);
                if (!rolesRes.ok) throw new Error('Nie udało się pobrać ról z Discorda. Sprawdź token bota.');
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
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    const renderRoleSelect = (roleType: keyof RoleSettings, label: string, icon: React.ReactNode) => (
        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium">{icon} {label}</label>
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
                <CardTitle>Przypisz Role Aplikacji do Ról Discord</CardTitle>
                <CardDescription className="text-white/60">Wybierz, która rola na serwerze Discord odpowiada za uprawnienia w aplikacji.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {renderRoleSelect('rootRoleId', 'Rola Root', <KeyRound className="w-4 h-4 mr-2 text-yellow-400" />)}
                {renderRoleSelect('adminRoleId', 'Rola Admin', <Shield className="w-4 h-4 mr-2 text-emerald-400" />)}
                {renderRoleSelect('adderRoleId', 'Rola Adder', <UserPlus className="w-4 h-4 mr-2 text-blue-400" />)}
                
                {error && <p className="text-red-400 text-sm">{error}</p>}
                
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


// ====================================================================
// --- GŁÓWNY KOMPONENT STRONY DASHBOARDU ---
// ====================================================================
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const tabs: { id: AdminTab; name: string; icon: ReactNode; roles: UserRole[] }[] = [
    { id: "stats", name: "Statystyki", icon: <BarChart3 className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "products", name: "Produkty", icon: <Package className="w-4 h-4" />, roles: ["admin", "root", "adder"] },
    { id: "user-management", name: "Użytkownicy", icon: <Users className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "user-approval", name: "Do zatwierdzenia", icon: <UserCheck className="w-4 h-4" />, roles: ["root"] },
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
      case "stats": return <div className="text-white text-center p-8 glass-morphism rounded-2xl">Widok Statystyk (w budowie)</div>;
      case "products": return <ProductManagerView />;
      case "user-management": return <UserManagementView />;
      case "user-approval": return <UserApprovalView />;
      case "role-management": return <RoleManager />;
      default: return <div className="text-white text-center p-8 glass-morphism rounded-2xl">Wybierz zakładkę</div>;
    }
  };

  if (status === 'loading') {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        </div>
    );
  }
  
  if (status === 'unauthenticated' || !userRole || availableTabs.length === 0) {
    return (
        <div className="flex justify-center items-center min-h-screen">
             <p className="text-center text-2xl text-red-400">Brak dostępu lub uprawnień do wyświetlenia panelu.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Panel Zarządzania</h1>
            <p className="text-white/70">Zarządzaj treścią i użytkownikami XaffReps</p>
        </div>
        <div className="space-y-8">
            <div className="glass-morphism rounded-2xl p-2">
                <div className="flex flex-wrap gap-2">
                {availableTabs.map((tab) => (
                    <Button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    variant={activeTab === tab.id ? "default" : "ghost"} 
                    className={`flex items-center space-x-2 ${activeTab === tab.id ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                    >
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
    </div>
  );
}