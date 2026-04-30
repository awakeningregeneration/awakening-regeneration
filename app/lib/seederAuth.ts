import { createHmac } from "crypto";

/**
 * Seeder session authentication.
 *
 * Reads and verifies the cc_seeder_session HMAC-signed cookie.
 * The cookie payload contains { seeder_id, handle, exp }.
 * Sessions last 30 days.
 */

const SESSION_SECRET = process.env.SEEDER_SESSION_SECRET!;

export type SeederSession = {
  seeder_id: string;
  handle: string;
};

function verifyPayload(signed: string): SeederSession | null {
  const parts = signed.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const json = Buffer.from(payloadB64, "base64url").toString();
  const expectedSig = createHmac("sha256", SESSION_SECRET)
    .update(json)
    .digest("base64url");

  if (sig !== expectedSig) return null;

  try {
    const payload = JSON.parse(json);
    if (typeof payload.exp === "number" && payload.exp < Date.now() / 1000) {
      return null;
    }
    return { seeder_id: payload.seeder_id, handle: payload.handle };
  } catch {
    return null;
  }
}

/**
 * Extract and verify the seeder session from the request cookie.
 * Returns null if no session or invalid/expired.
 */
export function getSeederSession(req: Request): SeederSession | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    })
  );

  const token = cookies["cc_seeder_session"];
  if (!token) return null;

  return verifyPayload(token);
}
