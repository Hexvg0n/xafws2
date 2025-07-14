import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Panel Administracyjny</h1>
          <p className="text-white/70">Zarządzaj produktami, sprzedawcami i batchami RepMafia</p>
        </div>

        <AdminDashboard />
      </div>
    </div>
  )
}
