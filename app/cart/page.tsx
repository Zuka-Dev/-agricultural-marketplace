import LoginRequired from "@/components/auth/LoginRequired";
import CartContent from "@/components/cart/CartContent";
import CustomerOnly from "@/components/auth/CustomerOnly";
export default function CartPage() {
  return (
    <LoginRequired>
      <CustomerOnly>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-soil-800 mb-8">
              Shopping Cart
            </h1>
            <CartContent />
          </div>
        </div>
      </CustomerOnly>
    </LoginRequired>
  );
}
