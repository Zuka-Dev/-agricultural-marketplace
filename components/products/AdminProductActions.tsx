"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import type { Product } from "@/lib/types"

interface AdminProductActionsProps {
  product: Product
}

export default function AdminProductActions({ product }: AdminProductActionsProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-earth-100 rounded-lg">
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-earth-200 rounded-lg shadow-lg z-10 min-w-[150px]">
          <button
            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
            className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-earth-50"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>{loading ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
