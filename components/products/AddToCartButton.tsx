"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleAddToCart = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Added to cart successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage(data.error || "Failed to add to cart")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-soil-700 font-medium">Quantity:</span>
        <div className="flex items-center border border-earth-300 rounded-lg">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-2 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.quantity}
            className="p-2 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-soil-500 text-sm">(Max: {product.quantity} kg)</span>
      </div>

      {/* Total Price */}
      <div className="text-2xl font-bold text-forest-600">Total: ₦{(product.price * quantity).toLocaleString()}</div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading || product.quantity === 0}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>{loading ? "Adding..." : "Add to Cart"}</span>
      </button>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-center ${
            message.includes("success")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
