import AdminRequired from "@/components/auth/AdminRequired";
import OrdersManagement from "@/components/admin/OrdersManagement";

export default function AdminOrdersPage() {
  return (
    <AdminRequired>
      <div className="container mx-auto px-4 py-8">
        <OrdersManagement />
      </div>
    </AdminRequired>
  );
}
