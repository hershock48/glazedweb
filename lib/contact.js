// One place for the address the business is reachable at.
//
// CONFIRM THIS RECEIVES MAIL. It was hardcoded in eight places across the site
// before this file existed, including the ProfessionalService JSON-LD in
// app/layout.jsx, which is what Google reads as the studio's contact address.
// Nothing has ever verified that it lands in an inbox. Kevin's working mailbox
// is kevin@glazedweb.com; hello@ may be an alias of it, may be planned, or may
// not exist.
//
// This matters more than it looks. The /order form's fallback opens a
// pre-filled email addressed here, and that fallback is the only working path
// for orders until RESEND_API_KEY is set. If this address is dead, a prospect
// fills in the whole form, hits send, and the order evaporates with no bounce
// anyone sees.
//
// It is also the reply-to target on the "something went wrong" state and the
// address in the footer of /order and /agreement.
export const CONTACT_EMAIL = "hello@glazedweb.com";

// Where order notifications are delivered. Set ORDER_TO_EMAIL in Vercel to
// override; it is deliberately NOT defaulted to CONTACT_EMAIL. If the sending
// address were guessed wrong, Resend would accept the message, the API would
// answer ok:true, the form would tell the customer we had it, and the order
// would be gone. A missing value has to fail loudly instead, so the route
// answers 503 and the customer gets the mailto fallback.
export const ORDER_TO = process.env.ORDER_TO_EMAIL || "";
