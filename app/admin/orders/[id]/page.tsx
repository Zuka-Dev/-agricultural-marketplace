import AdminRequired from "@/components/auth/AdminRequired";
import OrderDetails from "@/components/admin/OrderDetails";

export default function AdminOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminRequired>
      <div className="container mx-auto px-4 py-8">
        <OrderDetails orderId={params.id} />
      </div>
    </AdminRequired>
  );
}
