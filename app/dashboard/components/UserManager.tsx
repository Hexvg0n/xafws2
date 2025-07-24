"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Loader2, Clock, ShieldOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserRole = 'root' | 'admin' | 'adder' | 'user';
type User = { _id: string; nickname: string; role: UserRole; status: 'aktywny' | 'oczekujący' | 'zawieszony' | 'zablokowany'; };

export function UserManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error("Błąd pobierania użytkowników");
            setUsers(await res.json());
        } catch (error) { 
            console.error(error); 
        } finally { 
            setIsLoading(false); 
        }
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
                                    <p className="text-sm text-white/60">
                                        Rola: {user.role} | Status: <span className={user.status === 'aktywny' ? 'text-green-400' : 'text-yellow-400'}>{user.status}</span>
                                    </p>
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