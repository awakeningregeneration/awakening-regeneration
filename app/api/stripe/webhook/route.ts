import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { resend, FROM_EMAIL } from "@/app/lib/resend";
import { welcomeFounderEmail } from "@/app/lib/emails/welcomeFounder";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

/** Map tier string to monthly amount in cents */
const TIER_AMOUNTS: Record<string, number> = {
  tier_1: 900,
  tier_2: 1800,
  tier_3: 2700,
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  // --- Verify the webhook signature ---
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(
      "Stripe webhook signature verification failed:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: "Invalid signature." },
      { status: 400 }
    );
  }

  // --- Handle event types ---
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      }

      default:
        // We don't handle this event type — that's fine.
        break;
    }
  } catch (err) {
    // Log the error but still return 200. The signature was valid so Stripe
    // should not retry — we'll investigate from the server logs.
    console.error(
      `Stripe webhook handler error [${event.type}]:`,
      err instanceof Error ? err.message : err
    );
  }

  return NextResponse.json({ received: true });
}

// ─────────────────────────────────────────────────────────────
// checkout.session.completed
// ─────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email =
    session.customer_details?.email || session.customer_email || "";
  const name = session.customer_details?.name || "";
  const tier = (session.metadata?.tier as string) || "";
  const referralCode = (session.metadata?.referral_code as string) || "";
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || "";
  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id || "";

  const amountCents = TIER_AMOUNTS[tier] || 0;
  // The founders table stores amount in whole dollars (matching existing schema)
  const amountDollars = Math.round(amountCents / 100);

  // --- Insert founder row ---
  const { error: founderError } = await supabaseAdmin
    .from("founders")
    .insert([
      {
        name,
        email,
        tier,
        amount: amountDollars,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        subscription_status: "active",
        referral_code: referralCode || null,
        referred_by: null,
        status: "active",
        city: null,
        state: null,
        why: null,
      },
    ]);

  if (founderError) {
    console.error("Failed to insert founder:", founderError.message);
    // Don't throw — we still want to attempt the seeder link below.
    // But skip the welcome email since the founder record didn't save.
  } else {
    console.log(`Founder created: ${email} (${tier})`);
  }

  // --- Link to seeder if a referral code was used ---
  if (referralCode) {
    await linkSeederReferral({
      referralCode,
      founderEmail: email,
      founderName: name,
      stripeCustomerId,
      tier,
      amountCents,
    });
  }

  // --- Send welcome email (only if founder insert succeeded) ---
  if (!founderError && email) {
    try {
      const {
        subject,
        html: emailHtml,
        text: emailText,
      } = welcomeFounderEmail({
        name: name || undefined,
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html: emailHtml,
        text: emailText,
      });

      console.log(`Welcome email sent to ${email}`);
    } catch (emailErr) {
      console.error("Welcome email failed to send:", emailErr, { email });
    }
  }
}

async function linkSeederReferral(params: {
  referralCode: string;
  founderEmail: string;
  founderName: string;
  stripeCustomerId: string;
  tier: string;
  amountCents: number;
}) {
  const {
    referralCode,
    founderEmail,
    founderName,
    stripeCustomerId,
    tier,
    amountCents,
  } = params;

  // Look up the seeder (case-insensitive)
  const { data: seeder, error: lookupError } = await supabaseAdmin
    .from("seeders")
    .select("id, active")
    .ilike("referral_code", referralCode)
    .maybeSingle();

  if (lookupError) {
    console.error("Seeder lookup error:", lookupError.message);
    return;
  }

  if (!seeder) {
    console.warn(
      `Referral code not matched: "${referralCode}" (founder: ${founderEmail})`
    );
    return;
  }

  if (!seeder.active) {
    console.warn(
      `Seeder found but inactive: "${referralCode}" (seeder id: ${seeder.id})`
    );
    return;
  }

  // 25% payout in cents
  const payoutAmountCents = Math.round(amountCents * 0.25);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { error: referralError } = await supabaseAdmin
    .from("seeder_referrals")
    .insert([
      {
        seeder_id: seeder.id,
        founder_email: founderEmail,
        founder_name: founderName,
        stripe_customer_id: stripeCustomerId,
        month_joined: today,
        status: "active",
        tier,
        amount: amountCents,
        payout_amount: payoutAmountCents,
        payouts_paid: 0,
      },
    ]);

  if (referralError) {
    console.error("Failed to insert seeder referral:", referralError.message);
  } else {
    console.log(
      `Seeder referral linked: seeder ${seeder.id} ← founder ${founderEmail} (${tier}, payout ${payoutAmountCents}¢/mo)`
    );
  }
}

// ─────────────────────────────────────────────────────────────
// customer.subscription.deleted
// ─────────────────────────────────────────────────────────────

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id || "";

  // --- Update the founder's status ---
  const { error: founderError } = await supabaseAdmin
    .from("founders")
    .update({
      subscription_status: "canceled",
      status: "canceled",
    })
    .eq("stripe_subscription_id", subscriptionId);

  if (founderError) {
    console.error(
      "Failed to update founder on cancellation:",
      founderError.message
    );
  } else {
    console.log(`Founder subscription canceled: ${subscriptionId}`);
  }

  // --- Cancel any active seeder referrals for this customer ---
  if (stripeCustomerId) {
    const { error: referralError } = await supabaseAdmin
      .from("seeder_referrals")
      .update({ status: "canceled" })
      .eq("stripe_customer_id", stripeCustomerId)
      .eq("status", "active");

    if (referralError) {
      console.error(
        "Failed to cancel seeder referrals:",
        referralError.message
      );
    } else {
      console.log(
        `Seeder referrals canceled for customer: ${stripeCustomerId}`
      );
    }
  }
}
