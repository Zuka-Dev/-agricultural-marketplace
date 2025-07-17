import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY || "sk_test_your_test_secret_key";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.status && data.data.status === "success") {
      // Payment successful, process the order
      await pool.query("BEGIN");

      try {
        // Get cart items
        const cartResult = await pool.query(
          `SELECT ci.*, p.name, p.price, p.quantity as available_quantity
           FROM cart_items ci
           JOIN products p ON ci.product_id = p.id
           WHERE ci.user_id = $1`,
          [user.id]
        );

        if (cartResult.rows.length === 0) {
          await pool.query("ROLLBACK");
          return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const cartItems = cartResult.rows;
        let totalAmount = 0;

        // Check availability and calculate total
        for (const item of cartItems) {
          if (item.available_quantity < item.quantity) {
            await pool.query("ROLLBACK");
            return NextResponse.json(
              { error: `Insufficient quantity for ${item.name}` },
              { status: 400 }
            );
          }
          totalAmount += item.price * item.quantity;
        }

        // Verify amount matches
        const paidAmount = data.data.amount / 100; // Convert from kobo to naira
        if (Math.abs(paidAmount - totalAmount) > 0.01) {
          await pool.query("ROLLBACK");
          return NextResponse.json(
            { error: "Payment amount mismatch" },
            { status: 400 }
          );
        }

        // Create order
        const orderResult = await pool.query(
          `INSERT INTO orders (user_id, total_amount, status, payment_reference) 
           VALUES ($1, $2, 'completed', $3) 
           RETURNING *`,
          [user.id, totalAmount, reference]
        );

        const order = orderResult.rows[0];

        // Create order items and update product quantities
        for (const item of cartItems) {
          // Create order item
          await pool.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
             VALUES ($1, $2, $3, $4)`,
            [order.id, item.product_id, item.quantity, item.price]
          );

          // Update product quantity
          await pool.query(
            "UPDATE products SET quantity = quantity - $1 WHERE id = $2",
            [item.quantity, item.product_id]
          );
        }

        // Clear cart
        await pool.query("DELETE FROM cart_items WHERE user_id = $1", [
          user.id,
        ]);

        // Commit transaction
        await pool.query("COMMIT");

        return NextResponse.json({
          message: "Payment verified and order created successfully",
          order: order,
          payment_data: data.data,
        });
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }
    } else {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
