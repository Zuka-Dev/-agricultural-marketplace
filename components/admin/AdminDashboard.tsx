import Link from "next/link";
import pool from "@/lib/db";
import { Users, Package, ShoppingCart, TrendingUp, Plus } from "lucide-react";
import AdminProductList from "./AdminProductList";

async function getDashboardStats() {
  try {
    const [usersResult, productsResult, ordersResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = $1", ["customer"]),
      pool.query("SELECT COUNT(*) FROM products"),
      pool.query(
        "SELECT COUNT(*), SUM(total_amount) FROM orders WHERE status = $1",
        ["completed"]
      ),
    ]);

    return {
      totalCustomers: Number.parseInt(usersResult.rows[0].count),
      totalProducts: Number.parseInt(productsResult.rows[0].count),
      totalOrders: Number.parseInt(ordersResult.rows[0].count || 0),
      totalRevenue: Number.parseFloat(ordersResult.rows[0].sum || 0),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalCustomers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soil-800">Admin Dashboard</h1>
          <p className="text-soil-600 mt-2">Manage your farm marketplace</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">
                Total Customers
              </p>
              <p className="text-3xl font-bold text-soil-800">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="bg-forest-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-forest-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">
                Total Products
              </p>
              <p className="text-3xl font-bold text-soil-800">
                {stats.totalProducts}
              </p>
            </div>
            <div className="bg-harvest-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-harvest-600" />
            </div>
          </div>
        </div>

        <Link
          href="/admin/orders"
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-soil-800">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-earth-100 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-earth-600" />
            </div>
          </div>
        </Link>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-soil-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-soil-800">
                ₦{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-forest-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-forest-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/orders"
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-forest-100 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-forest-600" />
            </div>
            <div>
              <h3 className="font-semibold text-soil-800">Manage Orders</h3>
              <p className="text-soil-600 text-sm">
                View and update order status
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/products/new"
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-harvest-100 p-3 rounded-full">
              <Plus className="h-6 w-6 text-harvest-600" />
            </div>
            <div>
              <h3 className="font-semibold text-soil-800">Add Product</h3>
              <p className="text-soil-600 text-sm">
                Add new products to inventory
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Products Section */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-soil-800">Products</h2>
          <Link href="/admin/products/new" className="btn-outline">
            Add New Product
          </Link>
        </div>
        <AdminProductList />
      </div>
    </div>
  );
}
