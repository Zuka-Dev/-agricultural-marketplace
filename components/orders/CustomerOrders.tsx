"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Package, Eye, Download, ShoppingBag } from "lucide-react";

interface Order {
  id: number;
  total_amount: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  payment_reference: string;
  item_count: number;
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders/customer");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-24 w-24 text-soil-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-soil-700 mb-2">
          No orders yet
        </h2>
        <p className="text-soil-500 mb-6">
          Start shopping to see your orders here!
        </p>
        <Link href="/" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div>
                <h3 className="font-semibold text-soil-800">
                  Order #{order.id}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-soil-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{order.item_count} items</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <div className="text-right">
                <p className="font-semibold text-forest-600">
                  ₦{order.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* <Link
              href={`/orders/${order.id}`}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Link> */}
            <Link
              href={`/orders/${order.id}/receipt`}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Receipt</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
