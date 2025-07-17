import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY || "sk_test_your_test_secret_key";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, email, metadata } = await request.json();

    if (!amount || !email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 }
      );
    }

    // Initialize payment with Paystack
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
          currency: "NGN",
          callback_url: `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/checkout/success`,
          metadata: {
            user_id: user.id,
            ...metadata,
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.status) {
      return NextResponse.json({
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      });
    } else {
      return NextResponse.json(
        { error: data.message || "Payment initialization failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
