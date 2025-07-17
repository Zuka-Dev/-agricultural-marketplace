import LoginRequired from "@/components/auth/LoginRequired";
import CustomerOrders from "@/components/orders/CustomerOrders";

export default function OrdersPage() {
  return (
    <LoginRequired>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-soil-800 mb-8">My Orders</h1>
          <CustomerOrders />
        </div>
      </div>
    </LoginRequired>
  );
}
