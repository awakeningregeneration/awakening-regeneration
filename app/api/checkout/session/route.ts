import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

/**
 * GET /api/checkout/session?session_id=cs_...
 *
 * Returns the checkout session mode ("payment" or "subscription")
 * so the confirmation page can branch its copy. Exposes only the
 * mode — no amounts, no customer details, no secrets.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id." },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ mode: session.mode });
  } catch {
    return NextResponse.json(
      { error: "Session not found." },
      { status: 404 }
    );
  }
}
