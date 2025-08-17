"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { UserCheck, X } from "lucide-react";

export function UserApprovalView() {
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

    const handleApproval = async (userId: string, decision: 'aktywny' | 'odrzucony') => {
        const action = decision === 'aktywny' ? 'zatwierdzić' : 'odrzucić';
        if (!confirm(`Czy na pewno chcesz ${action} tę prośbę?`)) return;

        if (decision === 'aktywny') {
            const response = await fetch(`/api/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'aktywny' }) });
            if(response.ok) { alert("Użytkownik zatwierdzony!"); fetchPendingUsers(); } 
            else { alert("Błąd."); }
        } else {
            const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
            if(response.ok) { alert("Prośba odrzucona."); fetchPendingUsers(); }
            else { alert("Błąd."); }
        }
    };
    
    if (isLoading) return <p className="text-center text-white/70">Ładowanie...</p>;

    return (
        <div className="glass-morphism rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Zatwierdź Nowych Użytkowników</h3>
            <div className="space-y-4">
                {pendingUsers.length > 0 ? pendingUsers.map(user => (
                    <div key={user._id.toString()} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div><p className="font-semibold text-white">{user.nickname}</p><p className="text-sm text-white/60">Prośba o rolę: {user.role}</p></div>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => handleApproval(user._id.toString(), 'aktywny')} size="sm" variant="ghost" className="text-green-400"><UserCheck className="w-4 h-4 mr-2" /> Zatwierdź</Button>
                            <Button onClick={() => handleApproval(user._id.toString(), 'odrzucony')} size="sm" variant="ghost" className="text-red-400"><X className="w-4 h-4 mr-2" /> Odrzuć</Button>
                        </div>
                    </div>
                )) : <p className="text-white/70">Brak nowych próśb.</p>}
            </div>
        </div>
    );
}