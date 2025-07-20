"use client"

import { motion } from "framer-motion"
import { Package, Users, Star, Eye, ShoppingCart, Percent } from "lucide-react"

const stats = [
  {
    title: "Produkty W2C",
    value: "1,247",
    change: "+12%",
    icon: Package,
    color: "text-blue-400",
    bgColor: "bg-blue-400/20",
  },
  {
    title: "Sprzedawcy",
    value: "89",
    change: "+3%",
    icon: Users,
    color: "text-green-400",
    bgColor: "bg-green-400/20",
  },
  {
    title: "Best Batches",
    value: "156",
    change: "+8%",
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/20",
  },
  {
    title: "Promocje",
    value: "23",
    change: "+15%",
    icon: Percent,
    color: "text-purple-400",
    bgColor: "bg-purple-400/20",
  },
  {
    title: "Wyświetlenia",
    value: "45.2K",
    change: "+24%",
    icon: Eye,
    color: "text-orange-400",
    bgColor: "bg-orange-400/20",
  },
  {
    title: "Konwersje",
    value: "2.8K",
    change: "+18%",
    icon: ShoppingCart,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/20",
  },
]

export function AdminStats() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/60 text-sm">{stat.title}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="glass-morphism rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6">Ostatnia aktywność</h3>
        <div className="space-y-4">
          {[
            { action: "Dodano nową promocję", item: "JORDAN50 - 50zł zniżki", time: "2 min temu", type: "promo" },
            { action: "Dodano nowy produkt", item: "Air Jordan 1 Chicago", time: "15 min temu", type: "product" },
            { action: "Zaktualizowano sprzedawcę", item: "Mr. Hou", time: "1 godz. temu", type: "seller" },
            { action: "Dodano batch", item: "LJR Batch - Dunk Low", time: "2 godz. temu", type: "batch" },
            { action: "Usunięto promocję", item: "EXPIRED10", time: "3 godz. temu", type: "delete" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === "product"
                    ? "bg-blue-400"
                    : activity.type === "seller"
                      ? "bg-green-400"
                      : activity.type === "batch"
                        ? "bg-yellow-400"
                        : activity.type === "promo"
                          ? "bg-purple-400"
                          : "bg-red-400"
                }`}
              />
              <div className="flex-1">
                <p className="text-white">{activity.action}</p>
                <p className="text-white/60 text-sm">{activity.item}</p>
              </div>
              <span className="text-white/60 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
