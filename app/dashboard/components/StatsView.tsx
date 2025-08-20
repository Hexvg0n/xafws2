// app/dashboard/components/StatsView.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, Star, Shield, Users, Heart, Eye, Award } from "lucide-react";

// Usunęliśmy importy związane z Chart.js, bo nie są już potrzebne

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card className="glass-morphism border-white/10 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
            <Icon className="h-4 w-4 text-white/70" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value.toLocaleString('pl-PL')}</div>
        </CardContent>
    </Card>
);

export function StatsView() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/stats/dashboard');
            if (!res.ok) throw new Error("Błąd pobierania statystyk");
            setStats(await res.json());
        } catch (error) {
            console.error(error);
            setStats(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }
    
    if (!stats) {
        return <p className="text-center text-red-400 py-8">Nie udało się załadować statystyk.</p>;
    }

    return (
        <div className="space-y-6">
            {/* Kluczowe wskaźniki (bez zmian) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Produkty w W2C" value={stats.keyIndicators.totalProducts} icon={Package} />
                <StatCard title="Best Batches" value={stats.keyIndicators.totalBatches} icon={Star} />
                <StatCard title="Sprzedawcy" value={stats.keyIndicators.totalSellers} icon={Shield} />
                <StatCard title="Użytkownicy" value={stats.keyIndicators.totalUsers} icon={Users} />
                <StatCard title="Polubienia" value={stats.keyIndicators.totalFavorites} icon={Heart} />
                <StatCard title="Wyświetlenia" value={stats.keyIndicators.totalViews} icon={Eye} />
            </div>

            {/* Nowy ranking aktywności */}
            <Card className="glass-morphism border-white/10 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Award /> Ranking Najaktywniejszych Użytkowników</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.userActivity.length > 0 ? (
                            stats.userActivity.map((user: any, index: number) => (
                                <div key={user.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-white/70 w-6 text-center">{index + 1}.</span>
                                        <p className="font-semibold text-white">{user.name}</p>
                                    </div>
                                    <p className="text-lg font-bold text-emerald-400">{user.count.toLocaleString('pl-PL')} <span className="text-sm font-normal text-white/60">akcji</span></p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-white/70 py-4">Brak zarejestrowanych akcji użytkowników.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}