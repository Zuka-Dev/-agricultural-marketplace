import AdminRequired from "@/components/auth/AdminRequired"
import ProductForm from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return (
    <AdminRequired>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-soil-800 mb-8">Add New Product</h1>
          <ProductForm />
        </div>
      </div>
    </AdminRequired>
  )
}
