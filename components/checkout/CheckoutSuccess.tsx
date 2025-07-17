"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Eye, Home } from "lucide-react";

interface Order {
  id: number;
  total_amount: number;
  created_at: string;
  payment_reference: string;
}

export default function CheckoutSuccess() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      verifyPayment(reference);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  const verifyPayment = async (reference: string) => {
    setVerifying(true);
    try {
      const response = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        alert(data.error || "Payment verification failed");
        router.push("/cart");
      }
    } catch (error) {
      alert("An error occurred during payment verification");
      router.push("/cart");
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  if (loading || verifying) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600 mb-4"></div>
        <p className="text-soil-600 font-medium">
          {verifying ? "Verifying your payment..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-soil-700 mb-2">
          Payment verification failed
        </h2>
        <p className="text-soil-500 mb-6">
          Please contact support if you believe this is an error.
        </p>
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-soil-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-soil-600">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>
      </div>

      <div className="card p-8 mb-8">
        <h2 className="text-xl font-semibold text-soil-800 mb-6">
          Order Details
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-soil-600">Order Number:</span>
            <span className="font-mono font-medium text-soil-800">
              #{order.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-soil-600">Payment Reference:</span>
            <span className="font-mono text-sm text-soil-800">
              {order.payment_reference}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-soil-600">Total Amount:</span>
            <span className="font-semibold text-forest-600">
              ₦{order.total_amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-soil-600">Order Date:</span>
            <span className="text-soil-800">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-earth-50 p-6 rounded-lg mb-8">
        <h3 className="font-semibold text-soil-800 mb-2">What's Next?</h3>
        <ul className="text-soil-600 space-y-1 text-sm">
          <li>• You will receive an email confirmation shortly</li>
          <li>• Your order will be prepared for delivery</li>
          <li>• You can track your order status in your account</li>
          <li>• Delivery typically takes 1-2 business days</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/orders/${order.id}/receipt`}
          className="btn-outline flex items-center justify-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download Receipt</span>
        </Link>
        <Link
          href="/orders"
          className="btn-outline flex items-center justify-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>View All Orders</span>
        </Link>
        <Link
          href="/"
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
