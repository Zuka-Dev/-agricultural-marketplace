import Image from "next/image"
import Link from "next/link"
import pool from "@/lib/db"
import type { Product } from "@/lib/types"
import { Edit, Package } from "lucide-react"
import DeleteProductButton from "./DeleteProductButton"

async function getProducts(): Promise<Product[]> {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC")
    return result.rows
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function AdminProductList() {
  const products = await getProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-24 w-24 text-soil-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-soil-700 mb-2">No products yet</h3>
        <p className="text-soil-500 mb-6">Add your first product to get started!</p>
        <Link href="/admin/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-earth-200">
            <th className="text-left py-3 px-4 font-medium text-soil-700">Product</th>
            <th className="text-left py-3 px-4 font-medium text-soil-700">Category</th>
            <th className="text-left py-3 px-4 font-medium text-soil-700">Price</th>
            <th className="text-left py-3 px-4 font-medium text-soil-700">Quantity</th>
            <th className="text-left py-3 px-4 font-medium text-soil-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-earth-100 hover:bg-earth-50">
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg?height=48&width=48"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-soil-800">{product.name}</p>
                    <p className="text-sm text-soil-500 line-clamp-1">{product.description}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="bg-forest-100 text-forest-700 px-2 py-1 rounded-full text-xs font-medium">
                  {product.category}
                </span>
              </td>
              <td className="py-4 px-4 font-medium text-soil-800">₦{product.price.toLocaleString()}</td>
              <td className="py-4 px-4">
                <span
                  className={`font-medium ${
                    product.quantity > 10
                      ? "text-forest-600"
                      : product.quantity > 0
                        ? "text-harvest-600"
                        : "text-red-600"
                  }`}
                >
                  {product.quantity} kg
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-2 hover:bg-earth-100 rounded-lg text-soil-600 hover:text-forest-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
