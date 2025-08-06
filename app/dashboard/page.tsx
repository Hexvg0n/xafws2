"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AdminTab, UserRole } from "@/lib/types";

// Importy głównych komponentów-widoków
import { ProductManagerView } from "./components/ProductManagerView";
import { UserManagementView } from "./components/UserManagementView";
import { UserApprovalView } from "./components/UserApprovalView";
import { PromoManager } from "./components/promo-manager";
import { SellerManager } from "./components/seller-manager";
import { BatchManager } from "./components/batch-manager";

import { BarChart3, Package, Users, UserCheck, Tag, Shield, Star } from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const tabs: { id: AdminTab; name: string; icon: ReactNode; roles: UserRole[] }[] = [
    { id: "stats", name: "Statystyki", icon: <BarChart3 className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "products", name: "Produkty", icon: <Package className="w-4 h-4" />, roles: ["admin", "root", "adder"] },
    { id: "promos", name: "Promocje", icon: <Tag className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "sellers", name: "Sprzedawcy", icon: <Shield className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "batches", name: "Best Batches", icon: <Star className="w-4 h-4" />, roles: ["admin", "root"] },
    { id: "user-approval", name: "Zatwierdź Użytkowników", icon: <UserCheck className="w-4 h-4" />, roles: ["root"] },
    { id: "user-management", name: "Zarządzaj Użytkownikami", icon: <Users className="w-4 h-4" />, roles: ["admin", "root"] },
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
      case "products": return <ProductManagerView />;
      case "promos": return <PromoManager />;
      case "sellers": return <SellerManager />;
      case "batches": return <BatchManager />;
      case "user-approval": return <UserApprovalView />;
      case "user-management": return <UserManagementView />;
      default: return <div className="text-white text-center p-8">Wybierz zakładkę</div>;
    }
  };

  if (status === 'loading') return <p className="text-center text-2xl text-white/70 pt-20">Ładowanie panelu...</p>;
  if (status === 'unauthenticated') return <p className="text-center text-2xl text-white/70 pt-20">Brak dostępu.</p>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8 mt-20">
            <div className="glass-morphism rounded-2xl p-2">
                <div className="flex flex-wrap gap-2">
                    {availableTabs.map((tab) => (
                        <Button key={tab.id} onClick={() => setActiveTab(tab.id)} variant={activeTab === tab.id ? "default" : "ghost"} className={`flex items-center space-x-2 ${activeTab === tab.id ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
                            {tab.icon}<span>{tab.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {renderContent()}
            </motion.div>
        </div>
    </div>
  );
}