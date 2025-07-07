import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Start transaction
    await pool.query("BEGIN")

    try {
      // Get cart items
      const cartResult = await pool.query(
        `SELECT ci.*, p.name, p.price, p.quantity as available_quantity
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = $1`,
        [user.id],
      )

      if (cartResult.rows.length === 0) {
        await pool.query("ROLLBACK")
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
      }

      const cartItems = cartResult.rows
      let totalAmount = 0

      // Check availability and calculate total
      for (const item of cartItems) {
        if (item.available_quantity < item.quantity) {
          await pool.query("ROLLBACK")
          return NextResponse.json({ error: `Insufficient quantity for ${item.name}` }, { status: 400 })
        }
        totalAmount += item.price * item.quantity
      }

      // Create order
      const orderResult = await pool.query(
        `INSERT INTO orders (user_id, total_amount, status) 
         VALUES ($1, $2, 'completed') 
         RETURNING *`,
        [user.id, totalAmount],
      )

      const order = orderResult.rows[0]

      // Create order items and update product quantities
      for (const item of cartItems) {
        // Create order item
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.product_id, item.quantity, item.price],
        )

        // Update product quantity
        await pool.query("UPDATE products SET quantity = quantity - $1 WHERE id = $2", [item.quantity, item.product_id])
      }

      // Clear cart
      await pool.query("DELETE FROM cart_items WHERE user_id = $1", [user.id])

      // Commit transaction
      await pool.query("COMMIT")

      return NextResponse.json({
        message: "Order placed successfully",
        order: order,
      })
    } catch (error) {
      await pool.query("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
