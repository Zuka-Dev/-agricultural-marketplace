"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  ShoppingBag,
  User,
  MapPin,
} from "lucide-react";

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

interface CheckoutData {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export default function CheckoutProcess() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
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

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Initialize payment with Paystack
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          email: checkoutData.email,
          metadata: {
            cart_items: cartItems.length,
            delivery_address: `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state}`,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        alert(data.error || "Payment initialization failed");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return cartItems.length > 0;
      case 2:
        return (
          checkoutData.email &&
          checkoutData.phone &&
          checkoutData.address &&
          checkoutData.city &&
          checkoutData.state
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

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
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                currentStep >= step
                  ? "bg-forest-600 text-white"
                  : "bg-earth-200 text-soil-600"
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > step ? "bg-forest-600" : "bg-earth-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Review Cart */}
          {currentStep === 1 && (
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-soil-800 mb-6 flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6" />
                <span>Review Your Order</span>
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-earth-50 rounded-lg"
                  >
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={
                          item.image_url ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-soil-800">{item.name}</h3>
                      <p className="text-sm text-soil-600">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-soil-800">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-forest-600 font-semibold">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Delivery Information */}
          {currentStep === 2 && (
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-soil-800 mb-6 flex items-center space-x-2">
                <User className="h-6 w-6" />
                <span>Delivery Information</span>
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-soil-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={checkoutData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-soil-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={checkoutData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-soil-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={checkoutData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-soil-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={checkoutData.city}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-soil-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={checkoutData.state}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-soil-800 mb-6 flex items-center space-x-2">
                <CreditCard className="h-6 w-6" />
                <span>Payment</span>
              </h2>
              <div className="space-y-6">
                <div className="bg-earth-50 p-4 rounded-lg">
                  <h3 className="font-medium text-soil-800 mb-2">
                    Payment Method
                  </h3>
                  <p className="text-soil-600 text-sm mb-4">
                    You will be redirected to Paystack to complete your payment
                    securely.
                  </p>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-forest-600" />
                    <span className="text-soil-700">
                      Card Payment via Paystack
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Test Mode
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    This is a test environment. Use test card:{" "}
                    <strong>4084084084084081</strong> with any future date and
                    CVV.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={processing || !isStepValid(currentStep)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>{processing ? "Processing..." : "Pay Now"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit">
          <h3 className="text-xl font-semibold text-soil-800 mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-soil-600">
              <span>Items ({cartItems.length})</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-soil-600">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-earth-200 pt-3">
              <div className="flex justify-between text-lg font-semibold text-soil-800">
                <span>Total</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {currentStep >= 2 && checkoutData.address && (
            <div className="mt-6 pt-6 border-t border-earth-200">
              <h4 className="font-medium text-soil-800 mb-2 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Delivery Address</span>
              </h4>
              <p className="text-soil-600 text-sm">
                {checkoutData.address}, {checkoutData.city},{" "}
                {checkoutData.state}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
