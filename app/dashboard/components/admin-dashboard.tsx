"use client";

import { useState, useEffect, type ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserPlus,
  Trash2,
  X,
  ShieldCheck,
  ShieldOff,
  Clock,
  BarChart3,
  Package,
  Loader2,
  Edit,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ====================================================================
// --- DEFINICJE TYPÓW ---
// ====================================================================
type UserRole = 'root' | 'admin' | 'adder';
type User = { _id: string; nickname: string; role: UserRole; status: 'aktywny' | 'oczekujący' | 'zawieszony' | 'zablokowany'; createdAt: string; };
type Product = { _id: string; name: string; thumbnailUrl?: string; mainImages: string[]; sourceUrl: string; };
type AdminTab = "stats" | "products" | "user-management" | "user-approval";

// ====================================================================
// --- KOMPONENTY FORMULARZY ---
// ====================================================================

function CreateUserForm({ onFormSubmit, onCancel, creatingUserRole }: { onFormSubmit: (data: any) => Promise<void>, onCancel: () => void, creatingUserRole: 'root' | 'admin' | undefined }) {
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

function AddProductForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [sourceUrl, setSourceUrl] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setImagePreview(e.target.value);
  };

  const handleAddProduct = async () => {
    if (!name || !sourceUrl) {
      setError("Nazwa produktu oraz link źródłowy są wymagane.");
      return;
    }
    if (!imageFile && !imageUrl) {
      setError("Zdjęcie główne (z pliku lub URL) jest wymagane.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('file', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Błąd przesyłania zdjęcia.");
      }
      
      const { thumbnailUrl } = uploadResult;

      const productData = { name, sourceUrl, thumbnailUrl };

      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const productResult = await productResponse.json();
      if (!productResponse.ok) {
        throw new Error(productResult.error || "Nieznany błąd API podczas zapisu produktu.");
      }

      alert(`Produkt "${productResult.name}" został pomyślnie dodany!`);
      onSave();
      onCancel();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Dodaj Nowy Produkt</DialogTitle>
          <DialogDescription>Wypełnij dane, dodaj zdjęcie główne i link. Reszta danych zostanie pobrana automatycznie.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Nazwa Produktu *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="np. XaffReps T-Shirt"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Link do produktu (1688, Taobao, Weidian) *</label>
            <Input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Wklej link..."/>
          </div>
          <div>
             <label className="block text-sm font-medium text-white/80 mb-2">Zdjęcie główne *</label>
             <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Prześlij plik</TabsTrigger>
                    <TabsTrigger value="url">Wklej URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-2">
                   <Input type="file" accept="image/*" onChange={handleFileChange} />
                </TabsContent>
                <TabsContent value="url" className="pt-2">
                   <Input type="url" placeholder="https://..." value={imageUrl} onChange={handleUrlChange} />
                </TabsContent>
            </Tabs>
            {imagePreview && (
                <div className="mt-4 flex justify-center">
                    <Image src={imagePreview} alt="Podgląd" width={150} height={150} className="rounded-md object-cover w-36 h-36"/>
                </div>
            )}
          </div>
          {error && <p className="text-red-400 text-sm pt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={onCancel} variant="ghost">Anuluj</Button>
          <Button onClick={handleAddProduct} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
            <span className="ml-2">{isProcessing ? "Przetwarzanie..." : "Dodaj Produkt"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditProductForm({ onSave, onCancel, productToEdit }: { onSave: () => void; onCancel: () => void; productToEdit: Product }) {
  const [name, setName] = useState(productToEdit.name);
  const [sourceUrl, setSourceUrl] = useState(productToEdit.sourceUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const initialPreview = productToEdit.thumbnailUrl || productToEdit.mainImages?.[0] || null;
  const [imagePreview, setImagePreview] = useState<string | null>(initialPreview);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setImagePreview(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      let finalThumbnailUrl = productToEdit.thumbnailUrl;

      if (imageFile || (imageUrl && imageUrl !== initialPreview)) {
        const formData = new FormData();
        if (imageFile) formData.append('file', imageFile);
        else if (imageUrl) formData.append('imageUrl', imageUrl);

        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "Błąd przesyłania zdjęcia.");
        finalThumbnailUrl = uploadResult.thumbnailUrl;
      }

      const response = await fetch(`/api/products/${productToEdit._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sourceUrl, thumbnailUrl: finalThumbnailUrl }),
      });

      if (!response.ok) throw new Error((await response.json()).error || 'Błąd serwera');
      
      alert("Produkt zaktualizowany!");
      onSave();
      onCancel();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edytuj Produkt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Nazwa</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Link źródłowy</label>
            <Input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} required />
          </div>
          <div>
             <label className="block text-sm font-medium text-white/80 mb-2">Zmień zdjęcie główne</label>
             <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Prześlij plik</TabsTrigger>
                    <TabsTrigger value="url">Wklej URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-2">
                   <Input type="file" accept="image/*" onChange={handleFileChange} />
                </TabsContent>
                <TabsContent value="url" className="pt-2">
                   <Input type="url" placeholder="https://..." value={imageUrl} onChange={handleUrlChange} />
                </TabsContent>
            </Tabs>
            {imagePreview && (
                <div className="mt-4 flex justify-center">
                    <Image src={imagePreview} alt="Podgląd" width={150} height={150} className="rounded-md object-cover w-36 h-36"/>
                </div>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="animate-spin" /> : "Zapisz zmiany"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// ====================================================================
// --- WIDOKI ZAKŁADEK ---
// ====================================================================

function ProductManagerView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isNotifying, setIsNotifying] = useState<string | null>(null);

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

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;
        const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        if (response.ok) { alert("Produkt usunięty."); fetchProducts(); }
        else { alert("Błąd podczas usuwania produktu."); }
    };

    const handleSendToDiscord = async (productId: string) => {
        if (!confirm("Czy na pewno chcesz opublikować ten produkt na Discordzie?")) return;

        setIsNotifying(productId);
        try {
            const response = await fetch(`/api/products/${productId}/notify-discord`, {
                method: 'POST',
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Wystąpił nieznany błąd.');
            }
            alert(result.message);
        } catch (error) {
            console.error(error);
            alert(`Błąd: ${(error as Error).message}`);
        } finally {
            setIsNotifying(null);
        }
    };
    
    if (isLoading) return <p className="text-center text-white/70">Ładowanie...</p>;

    return (
        <div className="glass-morphism rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Zarządzaj Produktami ({products.length})</h3>
                <Button onClick={() => setShowAddForm(true)}><Package className="w-4 h-4 mr-2" /> Dodaj Produkt</Button>
            </div>
            
            <div className="space-y-4">
                {products.length > 0 ? products.map(product => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                            <Image 
                                src={product.thumbnailUrl || product.mainImages?.[0] || '/placeholder.png'} 
                                alt={product.name} 
                                width={64} 
                                height={64} 
                                className="rounded-md object-cover w-16 h-16"
                            />
                            <div>
                                <p className="font-semibold text-white">{product.name}</p>
                                <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Link do źródła</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button 
                                onClick={() => handleSendToDiscord(product._id)} 
                                size="sm" 
                                variant="ghost" 
                                title="Wyślij na Discorda"
                                disabled={isNotifying === product._id}
                            >
                                {isNotifying === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-purple-400" />}
                           </Button>
                           <Button onClick={() => setEditingProduct(product)} size="sm" variant="ghost" title="Edytuj"><Edit className="w-4 h-4 text-blue-400" /></Button>
                           <Button onClick={() => handleDeleteProduct(product._id)} size="sm" variant="ghost" title="Usuń"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                    </div>
                )) : <p className="text-white/70 text-center py-8">Brak produktów. Dodaj pierwszy!</p>}
            </div>
            
            {showAddForm && <AddProductForm onSave={() => { setShowAddForm(false); fetchProducts(); }} onCancel={() => setShowAddForm(false)} />}
            {editingProduct && <EditProductForm productToEdit={editingProduct} onSave={() => { setEditingProduct(null); fetchProducts(); }} onCancel={() => setEditingProduct(null)}/>}
        </div>
    )
}

function UserManagementView() {
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
                    <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <p className="font-semibold text-white">{user.nickname}</p>
                            <p className="text-sm text-white/60">Rola: {user.role} | Status: <span className={user.status === 'aktywny' ? 'text-green-400' : 'text-yellow-400'}>{user.status}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                             {userRole === 'root' && user.role !== 'root' && (<Button onClick={() => handleDeleteUser(user._id)} size="sm" variant="ghost" title="Usuń"><Trash2 className="w-4 h-4 text-red-500" /></Button>)}
                             <Button onClick={() => handleStatusChange(user._id, 'zawieszony')} size="sm" variant="ghost" title="Zawieś"><Clock className="w-4 h-4 text-yellow-500" /></Button>
                             <Button onClick={() => handleStatusChange(user._id, 'zablokowany')} size="sm" variant="ghost" title="Zablokuj"><ShieldOff className="w-4 h-4 text-red-500" /></Button>
                             {user.status !== 'aktywny' && <Button onClick={() => handleStatusChange(user._id, 'aktywny')} size="sm" variant="ghost" title="Aktywuj"><ShieldCheck className="w-4 h-4 text-green-500" /></Button>}
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
                    <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div><p className="font-semibold text-white">{user.nickname}</p><p className="text-sm text-white/60">Prośba o rolę: {user.role}</p></div>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => handleApproval(user._id, 'aktywny')} size="sm" variant="ghost" className="text-green-400"><UserCheck className="w-4 h-4 mr-2" /> Zatwierdź</Button>
                            <Button onClick={() => handleApproval(user._id, 'odrzucony')} size="sm" variant="ghost" className="text-red-400"><X className="w-4 h-4 mr-2" /> Odrzuć</Button>
                        </div>
                    </div>
                )) : <p className="text-white/70">Brak nowych próśb.</p>}
            </div>
        </div>
    );
}

// ====================================================================
// --- GŁÓWNY KOMPONENT DASHBOARDU ---
// ====================================================================
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const tabs: { id: AdminTab; name: string; icon: ReactNode; roles: UserRole[] }[] = [
    { id: "stats", name: "Statystyki", icon: <BarChart3 className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "user-approval", name: "Zatwierdź Użytkowników", icon: <UserCheck className="w-4 h-4" />, roles: ["root"] },
    { id: "user-management", name: "Zarządzaj Użytkownikami", icon: <Users className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "products", name: "Produkty", icon: <Package className="w-4 h-4" />, roles: ["admin", "root", "adder"] },
  ];

  const availableTabs = tabs.filter(tab => userRole && tab.roles.includes(userRole));

  useEffect(() => {
    if (userRole && availableTabs.length > 0 && !availableTabs.some(tab => tab.id === activeTab)) {
        setActiveTab(availableTabs[0].id);
    }
  }, [userRole, activeTab, availableTabs]);

  const renderContent = () => {
    switch (activeTab) {
      case "stats": return <div className="text-white text-center p-8">Widok Statystyk (do zaimplementowania)</div>;
      case "user-approval": return <UserApprovalView />;
      case "user-management": return <UserManagementView />;
      case "products": return <ProductManagerView />;
      default: return <div className="text-white text-center p-8">Wybierz zakładkę</div>;
    }
  };

  if (status === 'loading') return <p className="text-center text-2xl text-white/70 pt-20">Ładowanie panelu...</p>;
  if (status === 'unauthenticated') return <p className="text-center text-2xl text-white/70 pt-20">Brak dostępu.</p>;

  return (
    <div className="space-y-8">
      <div className="glass-morphism rounded-2xl p-2"><div className="flex flex-wrap gap-2">
        {availableTabs.map((tab) => (
          <Button key={tab.id} onClick={() => setActiveTab(tab.id)} variant={activeTab === tab.id ? "default" : "ghost"} className={`flex items-center space-x-2 ${activeTab === tab.id ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
            {tab.icon}<span>{tab.name}</span>
          </Button>
        ))}
      </div></div>
      <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {renderContent()}
      </motion.div>
    </div>
  );
}