import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    let query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const params = [user.id];

    if (limit) {
      query += ` LIMIT $2`;
      params.push(Number(limit));
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
