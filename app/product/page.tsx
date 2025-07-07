import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/db";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/products/ProductGrid";
import { Leaf, Truck, Shield, Users } from "lucide-react";

async function getProducts(): Promise<Product[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC LIMIT 8"
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <section id="products" className="py-16 bg-earth-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-soil-800 mb-4">
              Featured Products
            </h2>
            <p className="text-soil-600 max-w-2xl mx-auto">
              Explore our selection of fresh, organic produce grown with care on
              our campus farm.
            </p>
          </div>

          <ProductGrid products={products} showAddToCart={!!user} />
        </div>
      </section>
    </div>
  );
}
