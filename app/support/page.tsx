import { cookies } from "next/headers";
import SupportPageClient from "./SupportPageClient";

/**
 * /support — Online Resources page.
 *
 * Thin Server Component wrapper that reads the cc_support_intro_acknowledged
 * cookie and passes the initial state to the client component. This avoids
 * a flash of the wrong intro state on hydration.
 */

export default async function SupportPage() {
  const cookieStore = await cookies();
  const introAcknowledged = !!cookieStore.get("cc_support_intro_acknowledged");

  return <SupportPageClient introAcknowledged={introAcknowledged} />;
}
