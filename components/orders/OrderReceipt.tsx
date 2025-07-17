"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Download, ArrowLeft, Wheat } from "lucide-react";

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
}

interface OrderDetails {
  id: number;
  user_id: number;
  total_amount: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  payment_reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  items: OrderItem[];
}

interface OrderReceiptProps {
  orderId: string;
}

export default function OrderReceipt({ orderId }: OrderReceiptProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/customer/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        console.log(data);
      } else {
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-soil-700 mb-2">
          Order not found
        </h2>
        <button onClick={() => router.push("/orders")} className="btn-primary">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Print/Download Actions */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button
          onClick={() => router.push("/orders")}
          className="flex items-center space-x-2 text-soil-600 hover:text-forest-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Orders</span>
        </button>
        <button
          onClick={handlePrint}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Receipt */}
      <div className="bg-white p-8 shadow-lg print:shadow-none">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wheat className="h-10 w-10 text-forest-600" />
            <div>
              <h1 className="text-2xl font-bold text-forest-700">
                GreenHarvest
              </h1>
              <p className="text-sm text-soil-600">McPherson University Farm</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-soil-800">RECEIPT</h2>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-soil-800 mb-3">
              Order Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-soil-600">Order Number:</span>
                <span className="font-mono font-medium">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soil-600">Order Date:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soil-600">Payment Reference:</span>
                <span className="font-mono text-xs">
                  {order.payment_reference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-soil-600">Status:</span>
                <span className="capitalize font-medium text-green-600">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-soil-800 mb-3">
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-soil-600">Name:</span>
                <span>
                  {order.first_name} {order.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-soil-600">Email:</span>
                <span>{order.email}</span>
              </div>
              {order.phone && (
                <div className="flex justify-between">
                  <span className="text-soil-600">Phone:</span>
                  <span>{order.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="font-semibold text-soil-800 mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-earth-200">
                  <th className="text-left py-3 text-soil-700 font-medium">
                    Item
                  </th>
                  <th className="text-center py-3 text-soil-700 font-medium">
                    Qty
                  </th>
                  <th className="text-right py-3 text-soil-700 font-medium">
                    Price
                  </th>
                  <th className="text-right py-3 text-soil-700 font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-earth-100">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden print:hidden">
                          <Image
                            src={
                              item.image_url ||
                              "/placeholder.svg?height=48&width=48"
                            }
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-soil-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-soil-600">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">
                      ₦{item.price_at_purchase.toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-medium">
                      ₦
                      {(
                        item.price_at_purchase * item.quantity
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-earth-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-soil-800">
              Total Amount:
            </span>
            <span className="text-2xl font-bold text-forest-600">
              ₦{order.total_amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-earth-200 text-center text-sm text-soil-600">
          <p>Thank you for shopping with GreenHarvest!</p>
          <p>McPherson University Farm • Seriki Sotayo, Ogun State</p>
          <p>Email: farm@mcpherson.edu.ng • Phone: +234-800-FARM-001</p>
        </div>
      </div>
    </div>
  );
}
