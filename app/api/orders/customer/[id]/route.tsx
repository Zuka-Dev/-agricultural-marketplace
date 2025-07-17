import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get order details - ensure it belongs to the current user
    const orderResult = await pool.query(
      `SELECT 
        o.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1 AND o.user_id = $2`,
      [params.id, user.id]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get order items
    const itemsResult = await pool.query(
      `SELECT 
        oi.*,
        p.name,
        p.description,
        p.image_url,
        p.category
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1`,
      [params.id]
    );

    const order = orderResult.rows[0];
    order.items = itemsResult.rows;

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching customer order details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
