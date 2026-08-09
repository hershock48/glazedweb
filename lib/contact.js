// One place for the address the business is reachable at.
//
// Confirmed by Kevin on 9 August 2026: both kevin@glazedweb.com and
// hello@glazedweb.com reach him, and kevin@ is the one to use. It also suits
// the site's voice, which is first person throughout: /order promises "a real
// reply from Kevin" and "I read every one myself", so a generic hello@ was
// pulling against that.
//
// hello@ still works, so anything already sent there and any card or email
// signature carrying it keeps landing. Nothing had to be migrated.
//
// This was hardcoded in eight places before this file existed, including the
// ProfessionalService JSON-LD in app/layout.jsx that Google reads as the
// studio's contact address. Change it here and every one of them follows.
export const CONTACT_EMAIL = "kevin@glazedweb.com";

// Where /order notifications are delivered. Defaults to the address above,
// which is safe now that it is a confirmed working mailbox rather than a guess:
// the danger was only ever sending to an address nobody reads, because Resend
// would accept the message, the route would answer ok:true, the customer would
// be told we had their order, and it would be gone with no bounce anyone sees.
//
// Set ORDER_TO_EMAIL in Vercel to send somewhere else, which is what to do the
// day orders should go to a shared inbox instead of a person.
export const ORDER_TO = process.env.ORDER_TO_EMAIL || CONTACT_EMAIL;
