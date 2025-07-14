"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Users, Star, BarChart3, Settings, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductManager } from "./product-manager"
import { SellerManager } from "./seller-manager"
import { BatchManager } from "./batch-manager"
import { PromoManager } from "./promo-manager"
import { AdminStats } from "./admin-stats"

type AdminTab = "stats" | "products" | "sellers" | "batches" | "promos" | "settings"

const tabs = [
  { id: "stats" as AdminTab, name: "Statystyki", icon: BarChart3 },
  { id: "products" as AdminTab, name: "Produkty W2C", icon: Package },
  { id: "sellers" as AdminTab, name: "Sprzedawcy", icon: Users },
  { id: "batches" as AdminTab, name: "Best Batches", icon: Star },
  { id: "promos" as AdminTab, name: "Promocje", icon: Percent },
  { id: "settings" as AdminTab, name: "Ustawienia", icon: Settings },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("stats")

  const renderContent = () => {
    switch (activeTab) {
      case "stats":
        return <AdminStats />
      case "products":
        return <ProductManager />
      case "sellers":
        return <SellerManager />
      case "batches":
        return <BatchManager />
      case "promos":
        return <PromoManager />
      case "settings":
        return (
          <div className="glass-morphism rounded-2xl p-8 text-center">
            <Settings className="w-16 h-16 text-white/60 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Ustawienia</h3>
            <p className="text-white/70">Panel ustawień będzie dostępny wkrótce</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="glass-morphism rounded-2xl p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  )
}
