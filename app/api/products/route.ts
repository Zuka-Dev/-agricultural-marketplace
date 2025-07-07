import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")

    let query = "SELECT * FROM products WHERE 1=1"
    const params: any[] = []
    let paramCount = 0

    if (category && category !== "All") {
      paramCount++
      query += ` AND category = $${paramCount}`
      params.push(category)
    }

    if (search) {
      paramCount++
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`
      params.push(`%${search}%`)
    }

    query += " ORDER BY created_at DESC"

    if (limit) {
      paramCount++
      query += ` LIMIT $${paramCount}`
      params.push(Number.parseInt(limit))
    }

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, price, quantity, category, image_url } = await request.json()

    if (!name || !price || !quantity || !category) {
      return NextResponse.json({ error: "Name, price, quantity, and category are required" }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, quantity, category, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description, price, quantity, category, image_url],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
