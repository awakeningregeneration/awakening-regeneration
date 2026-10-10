import crypto from "crypto";

/**
 * Shared per-IP rate-limiting helpers — the exact pattern already proven
 * in the Online Resources application endpoint, factored out so the
 * public listings / geocode-preview / steward-claim endpoints can reuse
 * it instead of each re-implementing the same ~20 lines.
 *
 * In-memory, per-server-instance — resets on redeploy/restart. This is a
 * modest, human-scale deterrent against scripted abuse, not a hard
 * distributed guarantee. That matches the goal: block machine-scale
 * hammering, never add friction a real person would notice.
 */

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

/**
 * Creates an independent sliding-window rate limiter. Each call site
 * gets its own in-memory log, so limits on one endpoint never interact
 * with another.
 */
export function createRateLimiter(windowMs: number, max: number) {
  const log = new Map<string, number[]>();

  return function isRateLimited(ipHash: string): boolean {
    const now = Date.now();
    const timestamps = (log.get(ipHash) || []).filter(
      (t) => now - t < windowMs
    );
    timestamps.push(now);
    log.set(ipHash, timestamps);
    return timestamps.length > max;
  };
}
