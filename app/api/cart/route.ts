import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await pool.query(
      `SELECT ci.*, p.name, p.description, p.price, p.image_url, p.quantity as available_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [user.id],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { product_id, quantity } = await request.json()

    if (!product_id || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Product ID and valid quantity are required" }, { status: 400 })
    }

    // Check if product exists and has enough quantity
    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [product_id])

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = productResult.rows[0]
    if (product.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient product quantity" }, { status: 400 })
    }

    // Add to cart or update existing item
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [user.id, product_id, quantity],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cart_item_id, quantity } = await request.json()

    if (!cart_item_id || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Cart item ID and valid quantity are required" }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1 
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, cart_item_id, user.id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cart_item_id = searchParams.get("id")

    if (!cart_item_id) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    const result = await pool.query("DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *", [
      cart_item_id,
      user.id,
    ])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
