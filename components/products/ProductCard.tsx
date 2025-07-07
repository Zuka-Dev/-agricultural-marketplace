import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { ShoppingCart, Package } from "lucide-react"

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
}

export default function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  return (
    <div className="card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-forest-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-soil-800 mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-soil-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-forest-600">
            ₦{product.price.toLocaleString()}
            <span className="text-sm font-normal text-soil-500">/kg</span>
          </div>
          <div className="flex items-center space-x-1 text-soil-500">
            <Package className="h-4 w-4" />
            <span className="text-sm">{product.quantity} available</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link href={`/product/${product.id}`} className="flex-1 btn-outline text-center">
            View Details
          </Link>
          {showAddToCart && (
            <button className="btn-primary flex items-center space-x-1">
              <ShoppingCart className="h-4 w-4" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
