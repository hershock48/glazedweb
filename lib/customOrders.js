/**
 * CUSTOM ORDERS, ONE PLACE EACH.
 *
 * A Custom Order is a client whose deal is not a menu flavor: their scope,
 * their numbers, and any terms the master agreement has no clause for. Each
 * one is an entry here, and /agreement/{slug} renders it: Exhibit A in plain
 * English, where things stand (build fee paid or not, monthly plan running
 * or not), the button that starts the monthly plan on glazedweb's Stripe,
 * and the clickwrap acceptance.
 *
 * The general terms are NOT restated per client. They are the glazedweb
 * Client Agreement v1.1 at /agreement, incorporated by reference the same
 * way the menu-order clickwrap does. One text, one home, no drift.
 *
 * SURFACES THAT CANNOT READ FROM HERE: the paper draft for each client in
 * the private contracts folder (build-{slug}-agreement.js) carries its own
 * copy of every number. If a number here changes, both change by hand in
 * the same commit.
 *
 * `slug` is the URL and the Stripe metadata key (metadata.client) that ties
 * a subscription back to the client, so it never changes once a plan has
 * started.
 */

export const AGREEMENT_VERSION = "glazedweb Client Agreement v1.1";
export const AGREEMENT_URL = "https://www.glazedweb.com/agreement";
export const AGREEMENT_PDF = "https://www.glazedweb.com/glazed-web-agreement-v1-1.pdf";
export const PROVIDER = "glazedweb LLC";

export const CUSTOM_ORDERS = {
  chism: {
    slug: "chism",
    client: "Chism Chicken Ranch",
    /** As registered. Confirm the form (sole proprietorship or LLC) with Derek. */
    clientLegal: "Chism Chicken Ranch",
    contactName: "Derek Chism",
    contactTitle: "Owner",
    email: "chismchickenranch@gmail.com",
    town: "Marshall, Michigan",
    domain: "www.chismchickenranch.com",
    exhibit: "Exhibit A: Chism Chicken Ranch, prepared 2026-09-03",
    /** The site was live before the agreement existed; Chism is the first client. */
    live: true,

    buildFee: 500,
    /** Kevin, 2026-09-03: the $500 is paid. */
    buildFeePaid: true,
    monthly: 50,
    /** The $150 orders carry 2 hours. One hour suits a $50 order whose
     *  recurring edit is opening the next round. Confirm. */
    editAllowance: "1 hour per month",
    hourlyRate: 125,

    scope: [
      "The site: home, products (broilers, roasters and free-range eggs), how it works, reserve, FAQ, about, wholesale, and contact.",
      "The reservation flow: the estimator that prices a reservation by bird size and quantity as a range (deposit now, balance by dressed weight at pickup), the reservation email to the farm before any payment, and the Square-hosted deposit checkout described in part 3.",
      "The contact form, delivered to your email.",
      "The seasonal round. Which round is open, its pickup window, the prices, the sizes and the weight ranges live in one place, and updating them for each new round is included in the monthly care.",
      "Your logo prepared for the web from your own artwork (the hen kept as supplied, the wordmark traced to vector); search, maps and link-preview setup; structured data; and the small studio credit in the footer, which on your site reads “Double Dipped by”.",
      "Redirects from the old order and QR paths to the reserve page, so printed materials keep working.",
    ],
    notIncluded:
      "photography; copywriting beyond the pages listed; your Square account, its fees and its payout schedule, which are yours (part 3); Google Business Profile ownership, which you hold and we help set up; printed materials; and a second website or store on any other platform.",

    /** Part 3 of Exhibit A: the reservation and deposit flow. Terms, not scope. */
    payments: [
      {
        lead: "Your Square account.",
        text: "You own your own account with Square, the card processor. The site creates each checkout on that account using credentials you set in the hosting project, and every deposit settles to the bank account you designate, on Square’s schedule. glazedweb holds no money, takes no fee from any payment, and is not a party to the sale of any bird. Square’s processing fees are set by Square, shown in your Square account, and are your cost. You are responsible for Square’s terms and for the tax and reporting on your own sales.",
      },
      {
        lead: "Prices, deposits and estimates are your terms.",
        text: "The deposit per bird, the price per pound, the sizes and the weight ranges shown on the site are yours, set by you and entered by us at your direction. Estimates are shown as ranges because the final price depends on dressed weight; the site says so, and the balance is settled between you and your customer at pickup. Whether a deposit is refundable, and what happens if a round comes up short, is your policy, stated on the site as you direct.",
      },
      {
        lead: "The reservation email is the record.",
        text: "Every reservation emails you before the customer pays, with the name, phone, size, quantity and the estimate shown. Square is not the order record. You keep those emails and are responsible for contacting each buyer about pickup, and for honoring or declining a reservation. Until you have a mailbox on your own domain, reservation and contact emails are sent from an address we control, with replies routed to your email.",
      },
      {
        lead: "When checkout is degraded.",
        text: "If the Square credentials are missing or Square declines the request, the site falls back to your static Square payment link and tells the customer that the total shown will not carry over. You set the credentials and keep them current, and we will help.",
      },
      {
        lead: "The records and card data.",
        text: "Reservation records, customer names and contact details, and the record of each payment are your content under Section 4(a). Card numbers are never entered on or stored by the site; the card is entered on Square’s pages. If we ever part ways we hand over the whole project under Section 4(c), and your Square account, its history and its payouts remain yours.",
      },
      {
        lead: "Availability and responsibility.",
        text: "The flow runs on Square, on the email service, and on the hosting the monthly fee covers, and Section 7 applies to it. glazedweb is not responsible for a missed pickup, a bird count, a dressed weight, or a refund, or for a reservation lost to a failed or misdirected email or payment.",
      },
    ],
  },
};

export function getCustomOrder(slug) {
  return Object.prototype.hasOwnProperty.call(CUSTOM_ORDERS, slug) ? CUSTOM_ORDERS[slug] : null;
}

export const money = (n) => `$${n.toLocaleString("en-US")}`;
