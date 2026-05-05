import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { resend, FROM_EMAIL } from "@/app/lib/resend";
import { seederWelcomeEmail } from "@/app/lib/emails/seederWelcome";
import { isHandleAvailable } from "@/app/lib/reservedHandles";

// ── Types ──

type CreateSeederInput = {
  name: string;
  email: string;
  url_handle: string;
};

type CreateSeederResult =
  | { success: true; seeder_id: string; sent_at: string }
  | { error: string; status: number };

type SendWelcomeInput = {
  seeder_id: string;
  force?: boolean;
};

type SendWelcomeResult =
  | { success: true; sent_at: string; to: string }
  | { error: string; status: number };

// ── Create seeder + send welcome ──

export async function createSeeder(
  input: CreateSeederInput
): Promise<CreateSeederResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const url_handle = input.url_handle.trim().toLowerCase();

  if (!name) return { error: "Name is required.", status: 400 };
  if (!email || !email.includes("@"))
    return { error: "Valid email is required.", status: 400 };
  if (!url_handle)
    return { error: "Handle is required.", status: 400 };

  // Validate handle format + uniqueness
  const available = await isHandleAvailable(url_handle);
  if (!available)
    return {
      error: "Handle is unavailable (reserved or already taken).",
      status: 409,
    };

  // Check email uniqueness
  const { data: existingEmail } = await supabaseAdmin
    .from("seeders")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (existingEmail && existingEmail.length > 0)
    return { error: "A seeder with this email already exists.", status: 409 };

  // Create seeder row
  const referral_code = `${url_handle}-ref`;
  const { data: newSeeder, error: insertError } = await supabaseAdmin
    .from("seeders")
    .insert({
      name,
      email,
      url_handle,
      referral_code,
      active: true,
    })
    .select("id")
    .single();

  if (insertError || !newSeeder)
    return {
      error: `Failed to create seeder: ${insertError?.message || "unknown"}`,
      status: 500,
    };

  // Send welcome email
  const emailContent = seederWelcomeEmail({
    name,
    handle: url_handle,
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
  } catch (emailErr) {
    console.error("Seeder welcome email failed to send:", emailErr);
    // Row is created but email failed — welcomed_at stays null
    return {
      error:
        "Seeder created but welcome email failed to send. Use resend welcome to retry.",
      status: 207,
    };
  }

  // Mark as welcomed
  const now = new Date().toISOString();
  await supabaseAdmin
    .from("seeders")
    .update({ welcomed_at: now })
    .eq("id", newSeeder.id);

  return { success: true, seeder_id: newSeeder.id, sent_at: now };
}

// ── Send welcome email (existing or resend) ──

export async function sendWelcome(
  input: SendWelcomeInput
): Promise<SendWelcomeResult> {
  const { seeder_id, force } = input;

  if (!seeder_id || typeof seeder_id !== "string")
    return { error: "seeder_id is required.", status: 400 };

  // Look up seeder
  const { data: seeder, error: lookupError } = await supabaseAdmin
    .from("seeders")
    .select("id, name, email, url_handle, welcomed_at")
    .eq("id", seeder_id)
    .single();

  if (lookupError || !seeder)
    return { error: `Seeder not found: ${seeder_id}`, status: 404 };

  // Duplicate check (skipped when force=true)
  if (!force && seeder.welcomed_at)
    return {
      error: `This seeder has already received the welcome email at ${seeder.welcomed_at}. Clear welcomed_at in the database to re-send, or use force=true.`,
      status: 409,
    };

  // Send email
  const emailContent = seederWelcomeEmail({
    name: seeder.name || "Seeder",
    handle: seeder.url_handle,
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: seeder.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
  } catch (emailErr) {
    console.error("Seeder welcome email failed to send:", emailErr);
    return {
      error: "Failed to send welcome email. welcomed_at NOT updated.",
      status: 500,
    };
  }

  // Mark as welcomed
  const now = new Date().toISOString();
  await supabaseAdmin
    .from("seeders")
    .update({ welcomed_at: now })
    .eq("id", seeder.id);

  console.log(
    `Seeder welcome email sent to ${seeder.email} (${seeder.url_handle})`
  );

  return { success: true, sent_at: now, to: seeder.email };
}
