"use client";

import { useState, useEffect, useCallback } from "react";
import { UserCheck, Loader2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserRole = 'root' | 'admin' | 'adder' | 'user';
type User = { _id: string; nickname: string; role: UserRole; status: 'aktywny' | 'oczekujący' | 'zawieszony' | 'zablokowany'; };

export function UserApproval() {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users?status=oczekujący');
            if (!res.ok) throw new Error("Błąd pobierania danych");
            setPendingUsers(await res.json());
        } catch (error) { 
            console.error(error); 
        } finally { 
            setIsLoading(false); 
        }
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
                                <div>
                                    <p className="font-semibold text-white">{user.nickname}</p>
                                    <p className="text-sm text-white/60">Prośba o rolę: {user.role}</p>
                                </div>
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