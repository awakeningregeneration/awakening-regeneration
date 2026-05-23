import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { resend, FROM_EMAIL } from "@/app/lib/resend";
import { seederOutreach1Email } from "@/app/lib/emails/seederOutreach1Recognition";

/**
 * Send Email 1 (Recognition + Claim) for a listing.
 *
 * Extracted from /api/seeder/place-listing so both the placement
 * flow and the retroactive trigger use the same logic.
 *
 * Does exactly four things:
 * 1. Looks up seeder name from seeders table
 * 2. Builds email via seederOutreach1Email()
 * 3. Sends via Resend
 * 4. Updates listing: outreach_status, outreach_started_at, last_outreach_at
 *
 * Throws on Resend failure — caller decides whether to swallow or propagate.
 */

export async function sendEmail1(params: {
  listingId: string;
  businessName: string;
  stewardEmail: string;
  removalToken: string;
  seederId: string;
}): Promise<void> {
  const { listingId, businessName, stewardEmail, removalToken, seederId } =
    params;

  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("name")
    .eq("id", seederId)
    .single();

  const emailContent = seederOutreach1Email({
    businessName,
    listingId,
    removalToken,
    seederName: seeder?.name || "A seeder",
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: stewardEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  await supabaseAdmin
    .from("listings")
    .update({
      outreach_status: "email_1_sent",
      outreach_started_at: new Date().toISOString(),
      last_outreach_at: new Date().toISOString(),
    })
    .eq("id", listingId);
}
