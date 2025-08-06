"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, UserRole } from "@/lib/types";
import { CreateUserForm } from "./CreateUserForm";
import { UserPlus, Trash2, Clock, ShieldOff, ShieldCheck } from "lucide-react";

export function UserManagementView() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { data: session } = useSession();
    const userRole = session?.user?.role as UserRole | undefined;

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error("Błąd pobierania danych");
            setUsers(await res.json());
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleCreateUser = async (data: any) => {
        const response = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await response.json();
        alert(result.message || result.error);
        if (response.ok) { setShowCreateForm(false); fetchUsers(); }
    };

    const handleStatusChange = async (userId: string, newStatus: string) => {
        if (!confirm(`Czy na pewno chcesz zmienić status na "${newStatus}"?`)) return;
        const res = await fetch(`/api/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
        if (res.ok) { alert("Status zaktualizowany."); fetchUsers(); }
        else { alert("Błąd podczas aktualizacji."); }
    };
    
    const handleDeleteUser = async (userId: string) => {
        if (!confirm(`CZY NA PEWNO chcesz TRWALE usunąć tego użytkownika?`)) return;
        const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        if (res.ok) { alert("Użytkownik usunięty."); fetchUsers(); }
        else { alert("Błąd podczas usuwania."); }
    };
    
    if (isLoading) return <p className="text-center text-white/70">Ładowanie...</p>;

    const buttonText = userRole === 'root' ? "Dodaj użytkownika" : "Poproś o użytkownika";
    const creatingUserRole = (userRole === 'root' || userRole === 'admin') ? userRole : undefined;

    return (
        <div className="glass-morphism rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Zarządzaj Użytkownikami</h3>
                <Button onClick={() => setShowCreateForm(true)}><UserPlus className="w-4 h-4 mr-2" /> {buttonText}</Button>
            </div>
            <div className="space-y-4">
                {users.map(user => (
                    <div key={user._id.toString()} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <p className="font-semibold text-white">{user.nickname}</p>
                            <p className="text-sm text-white/60">Rola: {user.role} | Status: <span className={user.status === 'aktywny' ? 'text-green-400' : 'text-yellow-400'}>{user.status}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                             {userRole === 'root' && user.role !== 'root' && (<Button onClick={() => handleDeleteUser(user._id.toString())} size="sm" variant="ghost" title="Usuń"><Trash2 className="w-4 h-4 text-red-500" /></Button>)}
                             <Button onClick={() => handleStatusChange(user._id.toString(), 'zawieszony')} size="sm" variant="ghost" title="Zawieś"><Clock className="w-4 h-4 text-yellow-500" /></Button>
                             <Button onClick={() => handleStatusChange(user._id.toString(), 'zablokowany')} size="sm" variant="ghost" title="Zablokuj"><ShieldOff className="w-4 h-4 text-red-500" /></Button>
                             {user.status !== 'aktywny' && <Button onClick={() => handleStatusChange(user._id.toString(), 'aktywny')} size="sm" variant="ghost" title="Aktywuj"><ShieldCheck className="w-4 h-4 text-green-500" /></Button>}
                        </div>
                    </div>
                ))}
            </div>
             <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{userRole === 'root' ? 'Dodaj użytkownika' : 'Prośba o użytkownika'}</DialogTitle>
                        <DialogDescription>{userRole === 'admin' && 'Prośba zostanie wysłana do roota w celu zatwierdzenia.'}</DialogDescription>
                    </DialogHeader>
                    <CreateUserForm onFormSubmit={handleCreateUser} onCancel={() => setShowCreateForm(false)} creatingUserRole={creatingUserRole} />
                </DialogContent>
            </Dialog>
        </div>
    );
}