"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, DollarSign, Hash, Tag, FileText, ImageIcon } from "lucide-react"

interface ProductFormProps {
  product?: {
    id: number
    name: string
    description: string
    price: number
    quantity: number
    category: string
    image_url: string
  }
}

export default function ProductForm({ product }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    quantity: product?.quantity || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const categories = ["Vegetables", "Fruits", "Dairy", "Poultry", "Grains", "Herbs", "Legumes"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price as string),
          quantity: Number.parseInt(formData.quantity as string),
        }),
      })

      if (response.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save product")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="card p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-soil-700 mb-2">
            Product Name
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soil-400 h-5 w-5" />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Enter product name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-soil-700 mb-2">
            Description
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-soil-400 h-5 w-5" />
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input-field pl-10 resize-none"
              placeholder="Enter product description"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-soil-700 mb-2">
              Price (₦ per kg)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soil-400 h-5 w-5" />
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-soil-700 mb-2">
              Available Quantity (kg)
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soil-400 h-5 w-5" />
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-soil-700 mb-2">
            Category
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soil-400 h-5 w-5" />
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="input-field pl-10"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-soil-700 mb-2">
            Image URL
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soil-400 h-5 w-5" />
            <input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="flex-1 btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
