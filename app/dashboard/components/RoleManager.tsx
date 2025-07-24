"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, Shield, UserPlus, KeyRound } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DiscordRole { id: string; name: string; color: number; }
interface RoleSettings { rootRoleId: string; adminRoleId: string; adderRoleId: string; }

export function RoleManager() {
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
                        {success && <CheckCircle className="w-4 h-4 mr-2" />}
                        {success ? 'Zapisano!' : 'Zapisz Ustawienia'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}