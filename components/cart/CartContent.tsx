"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available_quantity: number;
}

export default function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(cartItemId);
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_item_id: cartItemId,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems((items) => items.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-24 w-24 text-soil-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-soil-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-soil-500 mb-6">
          Add some fresh produce to get started!
        </p>
        <button onClick={() => router.push("/")} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                <Image
                  src={item.image_url || "/placeholder.svg?height=80&width=80"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-soil-800">{item.name}</h3>
                <p className="text-soil-600 text-sm">{item.description}</p>
                <p className="text-forest-600 font-medium">
                  ₦{item.price.toLocaleString()}/kg
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || updating === item.id}
                  className="p-1 hover:bg-earth-100 rounded disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={
                    item.quantity >= item.available_quantity ||
                    updating === item.id
                  }
                  className="p-1 hover:bg-earth-100 rounded disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="font-semibold text-soil-800">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-soil-800">Total:</span>
          <span className="text-2xl font-bold text-forest-600">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>
        <button onClick={handleCheckout} className="w-full btn-primary">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
