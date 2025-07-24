"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, Package, Users, UserCheck, KeyRound } from "lucide-react";

// Importujemy dedykowane komponenty dla każdej zakładki
import { ProductManager } from "./ProductManager";
import { UserManager } from "./UserManager";
import { UserApproval } from "./UserApproval";
import { RoleManager } from "./RoleManager";

// Definicje typów
type UserRole = 'root' | 'admin' | 'adder' | 'user';
type AdminTab = "stats" | "products" | "user-management" | "user-approval" | "role-management";

const StatsView = () => <div className="text-white text-center p-8 glass-morphism rounded-2xl">Widok Statystyk (w budowie)</div>;

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const tabs: { id: AdminTab; name: string; icon: ReactNode; roles: UserRole[] }[] = [
    { id: "stats", name: "Statystyki", icon: <BarChart3 className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "products", name: "Produkty", icon: <Package className="w-4 h-4" />, roles: ["admin", "root", "adder"] },
    { id: "user-management", name: "Użytkownicy", icon: <Users className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "user-approval", name: "Do zatwierdzenia", icon: <UserCheck className="w-4 h-4" />, roles: ["root"] },
    { id: "role-management", name: "Zarządzaj Rolami", icon: <KeyRound className="w-4 h-4" />, roles: ["root"] },
  ];

  const availableTabs = tabs.filter(tab => userRole && tab.roles.includes(userRole));

  useEffect(() => {
    if (userRole && availableTabs.length > 0 && !availableTabs.some(tab => tab.id === activeTab)) {
        setActiveTab(availableTabs[0].id);
    }
  }, [userRole, activeTab, availableTabs]);

  const renderContent = () => {
    switch (activeTab) {
      case "stats": return <StatsView />;
      case "products": return <ProductManager />;
      case "user-management": return <UserManager />;
      case "user-approval": return <UserApproval />;
      case "role-management": return <RoleManager />;
      default: return <div className="text-white text-center p-8 glass-morphism rounded-2xl">Wybierz zakładkę</div>;
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-emerald-500" /></div>;
  }
  
  if (status === 'unauthenticated' || !userRole) {
    return <p className="text-center text-2xl text-red-400">Brak dostępu.</p>;
  }

  return (
    <div className="space-y-8">
        <div className="glass-morphism rounded-2xl p-2">
            <div className="flex flex-wrap gap-2">
            {availableTabs.map((tab) => (
                <Button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                variant={activeTab === tab.id ? "default" : "ghost"} 
                className={`flex items-center space-x-2 ${activeTab === tab.id ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                >
                {tab.icon}<span>{tab.name}</span>
                </Button>
            ))}
            </div>
        </div>
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
        </motion.div>
    </div>
  );
}