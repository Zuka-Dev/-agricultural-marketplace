import type { Product } from "@/lib/types"
import ProductCard from "./ProductCard"

interface ProductGridProps {
  products: Product[]
  showAddToCart?: boolean
}

export default function ProductGrid({ products, showAddToCart = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌾</div>
        <h3 className="text-xl font-semibold text-soil-700 mb-2">No products found</h3>
        <p className="text-soil-500">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showAddToCart={showAddToCart} />
      ))}
    </div>
  )
}
