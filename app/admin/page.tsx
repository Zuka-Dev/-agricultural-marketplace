import AdminRequired from "@/components/auth/AdminRequired"
import AdminDashboard from "@/components/admin/AdminDashboard"

export default function AdminPage() {
  return (
    <AdminRequired>
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </AdminRequired>
  )
}
