import { createHmac } from "crypto";

/**
 * Seeder session authentication.
 *
 * The cc_seeder_session cookie contains an HMAC-signed JSON payload
 * with { seeder_id, handle, exp }. Sessions last 30 days.
 *
 * Two entry points:
 * - getSeederSession(req)          — for API routes (reads from Request)
 * - getSeederSessionFromCookieValue(value) — for Server Components
 *   (accepts the raw cookie string from next/headers cookies())
 */

const SESSION_SECRET = process.env.SEEDER_SESSION_SECRET!;

export type SeederSession = {
  seeder_id: string;
  handle: string;
};

/**
 * Core verification: takes the raw signed cookie string,
 * verifies HMAC signature and expiry, returns session or null.
 */
export function verifySeederCookie(signed: string): SeederSession | null {
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
 * For API routes: extract and verify session from a Request object.
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

  return verifySeederCookie(token);
}

/**
 * For Server Components: accepts the raw cookie value string
 * (from cookies().get("cc_seeder_session")?.value).
 */
export function getSeederSessionFromCookieValue(
  value: string | undefined
): SeederSession | null {
  if (!value) return null;
  return verifySeederCookie(value);
}
