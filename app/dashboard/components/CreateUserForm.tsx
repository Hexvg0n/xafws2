"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface CreateUserFormProps {
    onFormSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    creatingUserRole: 'root' | 'admin' | undefined;
}

export function CreateUserForm({ onFormSubmit, onCancel, creatingUserRole }: CreateUserFormProps) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("adder");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !password || !role) {
        alert("Wszystkie pola są wymagane.");
        return;
    }
    setIsLoading(true);
    await onFormSubmit({ nickname, password, role });
    setIsLoading(false);
  };

  const buttonText = creatingUserRole === 'root' ? "Dodaj użytkownika" : "Wyślij prośbę";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Pseudonim</label>
        <Input type="text" value={nickname} onChange={e => setNickname(e.target.value)} required placeholder="np. xaff_user" className="bg-white/5 border-white/10" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Hasło</label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="bg-white/5 border-white/10"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Rola</label>
        <Select onValueChange={(value) => setRole(value as UserRole)} defaultValue="adder">
          <SelectTrigger className="w-full bg-white/5 border-white/10"><SelectValue placeholder="Wybierz rolę" /></SelectTrigger>
          <SelectContent>
            {creatingUserRole === 'root' && <SelectItem value="admin">Admin</SelectItem>}
            <SelectItem value="adder">Adder</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
        <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">{isLoading ? <Loader2 className="animate-spin" /> : buttonText}</Button>
      </DialogFooter>
    </form>
  );
}