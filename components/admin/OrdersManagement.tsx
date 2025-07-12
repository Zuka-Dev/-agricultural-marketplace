"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Eye,
  Filter,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";

interface Order {
  id: number;
  user_id: number;
  total_amount: string;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  item_count: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const url =
        statusFilter === "all"
          ? "/api/orders"
          : `/api/orders?status=${statusFilter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        console.log(data);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soil-800">Order Management</h1>
          <p className="text-soil-600 mt-2">View and manage customer orders</p>
        </div>
        <Link href="/admin" className="btn-outline">
          Back to Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-soil-800">
                {orders.length}
              </p>
            </div>
            <div className="bg-forest-100 p-3 rounded-full">
              <ShoppingCart className="h-5 w-5 text-forest-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <ShoppingCart className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-forest-600">
                ₦
                {orders
                  .filter((order) => order.status === "completed")
                  .reduce(
                    (sum, order) => sum + parseFloat(order.total_amount),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-forest-100 p-3 rounded-full">
              <DollarSign className="h-5 w-5 text-forest-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-soil-600" />
          <span className="font-medium text-soil-700">Filter by status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 text-soil-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-soil-700 mb-2">
              No orders found
            </h3>
            <p className="text-soil-500">
              {statusFilter === "all"
                ? "No orders have been placed yet."
                : `No ${statusFilter} orders found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-earth-200">
                  <th className="text-left py-3 px-4 font-medium text-soil-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-soil-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-soil-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-soil-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-soil-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-soil-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-soil-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-earth-100 hover:bg-earth-50"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm font-medium text-soil-800">
                        #{order.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-soil-400" />
                        <div>
                          <p className="font-medium text-soil-800">
                            {order.first_name} {order.last_name}
                          </p>
                          <p className="text-sm text-soil-500">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-soil-600">
                        {order.item_count} items
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-soil-800">
                        ₦{order.total_amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1 text-soil-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center space-x-1 text-forest-600 hover:text-forest-700 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
