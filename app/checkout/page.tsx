import LoginRequired from "@/components/auth/LoginRequired";
import CheckoutProcess from "@/components/checkout/CheckoutProcess";

export default function CheckoutPage() {
  return (
    <LoginRequired>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-soil-800 mb-8">Checkout</h1>
          <CheckoutProcess />
        </div>
      </div>
    </LoginRequired>
  );
}
