import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stripe over raw REST, on GLAZEDWEB'S OWN account. No SDK: a handful of
 * calls, one fewer dependency to patch (anchor and louies use the same
 * shape). The key is read per call, so a deployment without one degrades to
 * "not switched on" rather than crashing at import.
 *
 * This is the studio's money, not a client's: the monthly care fee on a
 * Custom Order, paid by the client to glazedweb. There is no Connect
 * account header here on purpose; anchor's lib/stripe.ts is the one that
 * charges on a client's connected account.
 *
 * Configure in Vercel, never in a file:
 *   STRIPE_SECRET_KEY      sk_live_... (or sk_test_ to walk the flow first)
 *   STRIPE_WEBHOOK_SECRET  whsec_... from the endpoint in Stripe's dashboard
 *
 * The webhook check is the part worth reading twice. Stripe signs the RAW
 * request body; the signature covers `${timestamp}.${body}`, and the check
 * must run on the bytes as received, before any JSON parsing, or a
 * re-serialized body verifies nothing.
 */

export function stripeKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || null;
}

/** "off" | "test" | "live". A test key can never move real money. */
export function stripeMode() {
  const key = stripeKey();
  if (!key) return "off";
  return key.startsWith("sk_test_") || key.startsWith("rk_test_") ? "test" : "live";
}

function apiBase() {
  return process.env.STRIPE_API_BASE?.trim() || "https://api.stripe.com";
}

/**
 * The client's address for Checkout's customer_email, or null to leave the field
 * out. Stripe answers an empty or malformed customer_email with a 400 ("Invalid
 * email address: "), and the pay route can only report that as "the card page
 * could not be opened". Left out, Checkout asks the client for an address on its
 * own page, and the webhook reads it from customer_details.email as it already
 * does. MI Gas, 2026-11-12: the registry has no address for them yet (email: ""),
 * and the client's three tries at the build fee all failed this way; so would
 * every door for every order with an empty email.
 */
export function checkoutEmail(email) {
  const e = String(email ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null;
}

export class StripeError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function stripe(path, opts = {}) {
  const key = stripeKey();
  if (!key) throw new StripeError(0, "STRIPE_SECRET_KEY is not set.");
  const res = await fetch(`${apiBase()}${path}`, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers: {
      Authorization: `Bearer ${key}`,
      ...(opts.body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: opts.body,
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new StripeError(res.status, json.error?.message ?? `Stripe ${res.status}`);
  return json;
}

/**
 * Verify a Stripe-Signature header against the raw body. Tolerance guards
 * replay; the comparison is constant time. Returns false rather than
 * throwing, so a bad signature is a quiet 400 and never a stack trace in a
 * log an attacker can read.
 */
export function verifyStripeSignature(rawBody, header, secret, toleranceSec = 300) {
  if (!header) return false;
  const parts = {};
  for (const kv of header.split(",")) {
    const i = kv.indexOf("=");
    if (i > 0) parts[kv.slice(0, i).trim()] = kv.slice(i + 1).trim();
  }
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  // Several v1 signatures can be present during a secret rotation.
  return header
    .split(",")
    .map((kv) => kv.trim())
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => Buffer.from(kv.slice(3)))
    .some((b) => a.length === b.length && timingSafeEqual(a, b));
}
