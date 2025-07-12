"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

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
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  items: OrderItem[];
}

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        router.push("/admin/orders");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder({ ...order, status: newStatus as any });
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      alert("An error occurred while updating the order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
        <Link href="/admin/orders" className="btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-earth-100 rounded-lg text-soil-600 hover:text-forest-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-soil-800">
              Order #{order.id}
            </h1>
            <p className="text-soil-600 mt-1">Order details and management</p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusIcon(order.status)}
          <span className="font-medium">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-soil-800 mb-4 flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Order Items</span>
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-earth-50 rounded-lg"
                >
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                    <Image
                      src={
                        item.image_url || "/placeholder.svg?height=64&width=64"
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-soil-800">{item.name}</h3>
                    <p className="text-sm text-soil-600">{item.description}</p>
                    <span className="inline-block bg-forest-100 text-forest-700 px-2 py-1 rounded-full text-xs font-medium mt-1">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-soil-800">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-soil-600">
                      ₦{item.price_at_purchase.toLocaleString()} each
                    </p>
                    <p className="font-semibold text-forest-600">
                      ₦
                      {(
                        item.price_at_purchase * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-earth-200 mt-6 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-soil-800">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-forest-600">
                  ₦{order.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-soil-800 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Details</span>
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-soil-400" />
                <span className="text-soil-700">
                  {order.first_name} {order.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-soil-400" />
                <span className="text-soil-700">{order.email}</span>
              </div>
              {order.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-soil-400" />
                  <span className="text-soil-700">{order.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-soil-800 mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Order Information</span>
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-soil-600">Order Date</p>
                <p className="font-medium text-soil-800">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-soil-600">Order ID</p>
                <p className="font-mono font-medium text-soil-800">
                  #{order.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-soil-600">Total Items</p>
                <p className="font-medium text-soil-800">
                  {order.items.length} items
                </p>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-soil-800 mb-4">
              Update Status
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => updateOrderStatus("pending")}
                disabled={updating || order.status === "pending"}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  order.status === "pending"
                    ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                    : "border-yellow-200 hover:bg-yellow-50 text-yellow-700"
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Mark as Pending</span>
                </div>
              </button>

              <button
                onClick={() => updateOrderStatus("completed")}
                disabled={updating || order.status === "completed"}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  order.status === "completed"
                    ? "bg-green-100 border-green-300 text-green-800"
                    : "border-green-200 hover:bg-green-50 text-green-700"
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark as Completed</span>
                </div>
              </button>

              <button
                onClick={() => updateOrderStatus("cancelled")}
                disabled={updating || order.status === "cancelled"}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  order.status === "cancelled"
                    ? "bg-red-100 border-red-300 text-red-800"
                    : "border-red-200 hover:bg-red-50 text-red-700"
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <XCircle className="h-4 w-4" />
                  <span>Mark as Cancelled</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
