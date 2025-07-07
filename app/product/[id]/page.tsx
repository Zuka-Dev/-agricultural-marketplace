import Image from "next/image"
import { notFound } from "next/navigation"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Product } from "@/lib/types"
import AddToCartButton from "@/components/products/AddToCartButton"
import AdminProductActions from "@/components/products/AdminProductActions"
import { Package, Star, Shield, Truck } from "lucide-react"

async function getProduct(id: string): Promise<Product | null> {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  const user = await getCurrentUser()

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden">
            <Image
              src={product.image_url || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-forest-100 text-forest-700 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
              {user?.role === "admin" && <AdminProductActions product={product} />}
            </div>
            <h1 className="text-3xl font-bold text-soil-800 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl font-bold text-forest-600">
                ₦{product.price.toLocaleString()}
                <span className="text-lg font-normal text-soil-500">/kg</span>
              </div>
              <div className="flex items-center space-x-1 text-soil-500">
                <Package className="h-5 w-5" />
                <span>{product.quantity} available</span>
              </div>
            </div>
          </div>

          <div className="prose prose-soil max-w-none">
            <p className="text-soil-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-forest-600">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2 text-forest-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">100% Organic</span>
            </div>
            <div className="flex items-center space-x-2 text-forest-600">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Fresh Delivery</span>
            </div>
          </div>

          {/* Add to Cart */}
          {user ? (
            user.role === "customer" ? (
              <AddToCartButton product={product} />
            ) : (
              <div className="bg-earth-100 border border-earth-300 rounded-lg p-4">
                <p className="text-soil-600 text-center">Admin users cannot add items to cart</p>
              </div>
            )
          ) : (
            <div className="bg-earth-100 border border-earth-300 rounded-lg p-4">
              <p className="text-soil-600 text-center mb-4">Please log in to add items to your cart</p>
              <div className="flex space-x-2 justify-center">
                <a href="/auth/login" className="btn-primary">
                  Login
                </a>
                <a href="/auth/register" className="btn-outline">
                  Register
                </a>
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="bg-earth-50 rounded-lg p-6">
            <h3 className="font-semibold text-soil-800 mb-4">Product Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-soil-600">Category:</span>
                <span className="font-medium text-soil-800">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soil-600">Available Quantity:</span>
                <span className="font-medium text-soil-800">{product.quantity} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soil-600">Price per kg:</span>
                <span className="font-medium text-soil-800">₦{product.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
