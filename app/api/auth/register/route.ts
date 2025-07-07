import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { first_name, last_name, email, password, phone } = await request.json()

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, phone, role) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, first_name, last_name, email, role, phone`,
      [first_name, last_name, email, hashedPassword, phone, "customer"],
    )

    const user = result.rows[0]

    // Generate JWT token
    const token = generateToken(user)

    // Set HTTP-only cookie
    await setAuthCookie(token)

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
