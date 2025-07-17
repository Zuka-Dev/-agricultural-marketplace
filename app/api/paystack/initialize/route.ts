import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const BACKEND_BASE_URL =
  process.env.RENDER_BACKEND_URL || "https://your-backend.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Append user to the metadata
    const payload = {
      ...body,
      metadata: {
        ...(body.metadata || {}),
        user_id: user.id,
      },
    };

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/paystack/initialize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Wrapper initialization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
