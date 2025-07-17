import LoginRequired from "@/components/auth/LoginRequired";
import CheckoutSuccess from "@/components/checkout/CheckoutSuccess";

export default function CheckoutSuccessPage() {
  return (
    <LoginRequired>
      <div className="container mx-auto px-4 py-8">
        <CheckoutSuccess />
      </div>
    </LoginRequired>
  );
}
