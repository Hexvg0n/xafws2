"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/lib/types";

export function CreateUserForm({ onFormSubmit, onCancel, creatingUserRole }: { onFormSubmit: (data: any) => Promise<void>, onCancel: () => void, creatingUserRole: 'root' | 'admin' | undefined }) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("adder");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onFormSubmit({ nickname, password, role });
    setIsLoading(false);
  };

  const buttonText = creatingUserRole === 'root' ? "Dodaj użytkownika" : "Wyślij prośbę";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-white/80 mb-2">Pseudonim</label><Input type="text" value={nickname} onChange={e => setNickname(e.target.value)} required placeholder="np. xaff_user" /></div>
      <div><label className="block text-sm font-medium text-white/80 mb-2">Hasło</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" /></div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Rola</label>
        <Select onValueChange={(value) => setRole(value as UserRole)} defaultValue="adder">
          <SelectTrigger className="w-full"><SelectValue placeholder="Wybierz rolę" /></SelectTrigger>
          <SelectContent>
            {creatingUserRole === 'root' && <SelectItem value="admin">Admin</SelectItem>}
            <SelectItem value="adder">Adder</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Przetwarzanie..." : buttonText}</Button>
      </DialogFooter>
    </form>
  );
}