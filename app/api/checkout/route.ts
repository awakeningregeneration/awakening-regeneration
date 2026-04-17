import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const PRICE_MAP: Record<string, string | undefined> = {
  tier_1: process.env.STRIPE_PRICE_TIER_1,
  tier_2: process.env.STRIPE_PRICE_TIER_2,
  tier_3: process.env.STRIPE_PRICE_TIER_3,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tier: string = body.tier?.trim();
    const oneTimeAmount: number | undefined = body.oneTimeAmount;
    const referralCode: string | undefined = body.referralCode?.trim() || undefined;

    const priceId = PRICE_MAP[tier];
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid tier selected." },
        { status: 400 }
      );
    }

    // Determine origin for redirect URLs
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    // Build line items
    const lineItems: {
      price?: string;
      price_data?: {
        currency: string;
        product_data: { name: string };
        unit_amount: number;
      };
      quantity: number;
    }[] = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    // Optional one-time additional contribution
    if (oneTimeAmount && oneTimeAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Additional one-time contribution to the foundation",
          },
          unit_amount: Math.round(oneTimeAmount * 100),
        },
        quantity: 1,
      });
    }

    // Metadata — stored on both the session and the subscription
    const metadata: Record<string, string> = { tier };
    if (referralCode) {
      metadata.referral_code = referralCode;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${origin}/founders/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/founders`,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session.",
      },
      { status: 500 }
    );
  }
}
