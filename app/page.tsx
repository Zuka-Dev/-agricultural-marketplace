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

async function getCategories(): Promise<string[]> {
  try {
    const result = await pool.query(
      "SELECT DISTINCT category FROM products ORDER BY category"
    );
    return result.rows.map((row) => row.category);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Fresh Farm Produce
                <br />
                <span className="text-earth-200">From Our Campus</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Discover the finest organic vegetables, fruits, and dairy
                products grown right here at McPherson University Farm. Fresh,
                sustainable, and delivered with care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/product" className="btn-secondary text-center">
                  Shop Now
                </Link>
                {!user && (
                  <Link
                    href="/auth/register"
                    className="btn-outline bg-white text-forest-600 hover:bg-earth-100 text-center"
                  >
                    Join Our Community
                  </Link>
                )}
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Fresh farm produce"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-soil-800 mb-4">
              Why Choose GreenHarvest?
            </h2>
            <p className="text-soil-600 max-w-2xl mx-auto">
              We're committed to providing the freshest, highest quality produce
              while supporting sustainable farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-forest-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-forest-600" />
              </div>
              <h3 className="text-xl font-semibold text-soil-800 mb-2">
                100% Organic
              </h3>
              <p className="text-soil-600">
                All our produce is grown using organic farming methods without
                harmful chemicals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-harvest-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-harvest-600" />
              </div>
              <h3 className="text-xl font-semibold text-soil-800 mb-2">
                Fresh Delivery
              </h3>
              <p className="text-soil-600">
                Harvested daily and delivered fresh to ensure maximum nutrition
                and taste.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-earth-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-earth-600" />
              </div>
              <h3 className="text-xl font-semibold text-soil-800 mb-2">
                Quality Assured
              </h3>
              <p className="text-soil-600">
                Every product is carefully inspected to meet our high quality
                standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-forest-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-forest-600" />
              </div>
              <h3 className="text-xl font-semibold text-soil-800 mb-2">
                Community Focused
              </h3>
              <p className="text-soil-600">
                Supporting our university community and local sustainable
                agriculture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
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

          <div className="text-center mt-12">
            <Link href="/product" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-forest-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-green-100">
              Join our community and start enjoying fresh, organic produce
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-secondary">
                Create Account
              </Link>
              <Link
                href="/auth/login"
                className="btn-outline bg-white text-forest-600 hover:bg-earth-100"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
