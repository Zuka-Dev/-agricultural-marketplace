import Link from "next/link";
import { ShoppingCart, User, Settings, Wheat } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="bg-white shadow-md border-b-2 border-forest-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Wheat className="h-8 w-8 text-forest-600" />
            <div>
              <h1 className="text-2xl font-bold text-forest-700">
                GreenHarvest
              </h1>
              <p className="text-sm text-soil-600">McPherson University Farm</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-soil-700 hover:text-forest-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="text-soil-700 hover:text-forest-600 font-medium transition-colors"
            >
              Products
            </Link>
            {user && (
              <Link
                href="/cart"
                className="flex items-center space-x-1 text-soil-700 hover:text-forest-600 font-medium transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
              </Link>
            )}
            {user?.role === "admin" && (
              <>
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-soil-700 hover:text-forest-600 font-medium transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-1 text-soil-700 hover:text-forest-600 font-medium transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-forest-600" />
                  <span className="text-soil-700 font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="btn-outline">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
