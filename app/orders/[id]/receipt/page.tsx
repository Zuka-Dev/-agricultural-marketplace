import LoginRequired from "@/components/auth/LoginRequired";
import OrderReceipt from "@/components/orders/OrderReceipt";

export default function ReceiptPage({ params }: { params: { id: string } }) {
  return (
    <LoginRequired>
      <div className="container mx-auto px-4 py-8">
        <OrderReceipt orderId={params.id} />
      </div>
    </LoginRequired>
  );
}
