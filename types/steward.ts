/**
 * Stewardship layer types for Canary Commons.
 *
 * A steward is someone who has claimed care of a listing —
 * they can update it, respond to it, and be contacted about it.
 */

// ── Union types ──────────────────────────────────────────────

export type StewardStatus =
  | "pending"
  | "verified_waiting_grace"
  | "active"
  | "revoked"
  | "disputed";

export type VerificationPath = "domain_match" | "declaration";

export type DisputeStatus = "open" | "upheld" | "rejected";

// ── Table types ──────────────────────────────────────────────

export type Steward = {
  id: string;
  listing_id: string;
  email: string;
  display_name?: string | null;
  declared_at: string;
  verified_at?: string | null;
  activated_at?: string | null;
  verification_path: VerificationPath;
  status: StewardStatus;
};

export type StewardshipClaim = {
  id: string;
  steward_id: string;
  verification_token: string;
  token_expires_at: string;
  grace_period_ends_at?: string | null;
  declaration_text?: string | null;
  created_at: string;
};

export type StewardshipDispute = {
  id: string;
  listing_id: string;
  disputed_steward_id: string;
  disputer_email: string;
  disputer_context?: string | null;
  created_at: string;
  resolved_at?: string | null;
  resolution_notes?: string | null;
  status: DisputeStatus;
};
