import { randomBytes } from "crypto";

/**
 * Generate a URL-safe random verification token (~32 characters).
 * Uses crypto.randomBytes for cryptographic randomness.
 */
export function generateVerificationToken(): string {
  return randomBytes(24).toString("base64url");
}

/**
 * Check whether a token has expired by comparing its expiry
 * timestamp (ISO string) against the current time.
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}
