export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  category: string
  image_url: string
  created_at: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product: Product
}

export interface Order {
  id: number
  user_id: number
  total_amount: number
  status: "pending" | "completed" | "cancelled"
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_purchase: number
  product: Product
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: "admin" | "customer"
  phone?: string
}
