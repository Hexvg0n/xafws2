// app/dashboard/components/RoleManager.tsx

"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
            setError(null);
            try {
                const [rolesRes, settingsRes] = await Promise.all([
                    fetch('/api/discord/roles'),
                    fetch('/api/settings')
                ]);
                if (!rolesRes.ok) throw new Error((await rolesRes.json()).error || 'Nie udało się pobrać ról z Discorda.');
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
            <Select value={settings[roleType] || ''} onValueChange={(value) => setSettings(prev => ({ ...prev, [roleType]: value }))}>
                <SelectTrigger className="w-full bg-white/5 border-white/20"><SelectValue placeholder="Wybierz rolę..." /></SelectTrigger>
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
                <CardDescription className="text-white/60">Przypisz role z serwera Discord do uprawnień w aplikacji.</CardDescription>
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