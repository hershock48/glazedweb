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
    monthlyCovers:
      "Hosting, SSL, security updates, backups, domain renewal where we hold it, and each season’s round opened for you.",
    editExamples: "prices, the pickup window, a photo, a line of copy. Opening the next round is within it.",
    paymentsSummary: "how the reservations and deposits work",
    paymentsTitle: "reservations and deposits",
    paymentsIntro:
      "The site lets your customers reserve birds from the open round, see an estimate, and pay the reservation deposit by card on a checkout page hosted by Square. These terms apply to that flow and are part of the agreement.",

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

  truenorth: {
    slug: "truenorth",
    client: "True North Ice Cream",
    /** TODO Kevin: the legal entity as registered, and the form. */
    clientLegal: "True North Ice Cream",
    /** TODO Kevin: the owner's name. Nothing on file names him. */
    contactName: "",
    contactTitle: "Owner",
    email: "truenorthicecream@gmail.com",
    town: "Marshall, Michigan",
    domain: "truenorthicecream.com",
    exhibit: "Exhibit A: True North Ice Cream, prepared 2026-09-04",
    /** A spec build. It is live at truenorth.glazedweb.com/demo, not on their domain. */
    live: false,

    /** Kevin's ruling, 2026-09-04: today's published menu price. The August
     *  letter promised "straight off our public menu", and the menu moved to
     *  2000/150 on 2026-09-01, so honoring it is what keeps that sentence true. */
    buildFee: 2000,
    buildFeePaid: false,
    monthly: 150,
    editAllowance: "2 hours per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security updates, backups, domain renewal where we hold it, and the Scooplist flavor board account for both shops.",
    editExamples:
      "prices, hours, a photo, a line of copy, a new catering tier. Flavors are not an edit; you change those yourself in Scooplist, as often as you like.",

    scope: [
      "The site: home, a page for each shop (Marshall and Battle Creek), menu, flavors, catering, contact, about, and the pickup order page.",
      "Per shop, told separately: its own hours, address, map, live open or closed badge, its own filtered menu, and its own flavor case. Search engines are given each shop as its own listing rather than one business with two addresses.",
      "The catering inquiry form and the contact form, delivered to your email, working with or without JavaScript, and honest about it when a message cannot be sent.",
      "Your Scooplist account: the flavor library, both shops’ cases, the history of what was in the case and when, and the public board page for each shop. You change the flavors; the website follows within a minute, with no deploy and nobody to call.",
      "Online pickup orders, built and switched off until you want them. Turning them on is included; taking cards is quoted separately because it needs a payment account of yours.",
      "Search, maps, structured data and link previews set up, and a pass over your Google Business Profile including the Friday midnight typo on the Marshall listing.",
      "The small studio credit in the footer, which on your site reads “Double Dipped by”.",
    ],
    notIncluded:
      "photography; copywriting beyond the pages listed; card processing and its fees, which need a Stripe or Square account of yours and are quoted separately; point of sale or in-store hardware; printed materials; and a second website on any other platform.",

    /** Part 3: the master agreement has no clause for a live data feed or for
     *  who owns the flavor library, and True North's whole deal turns on it. */
    paymentsSummary: "how the flavor feed and your data work",
    paymentsTitle: "the flavor feed and your data",
    paymentsIntro:
      "The flavor boards on your website are fed by Scooplist, the flavor board app we run, from the case you keep at the counter. These terms apply to that feed and are part of the agreement.",
    payments: [
      {
        lead: "Your flavor data is your content.",
        text: "The library, every flavor, every description and photo you add, and the record of every time a flavor went into or came out of a case are your content under Section 4(a). We do not sell it, and we do not use it for anything but running your site.",
      },
      {
        lead: "You can take it out whenever you want.",
        text: "Scooplist will hand you the whole library and every case entry ever recorded, as one file, at any time, with no request to us and no waiting. That is a button in your own account, not a favor.",
      },
      {
        lead: "The feed is an enhancement, never a dependency.",
        text: "If Scooplist is slow or unreachable, the website keeps rendering the last board it published and nothing on the page breaks. We do not promise the feed is never down. We do promise your website does not go down with it.",
      },
      {
        lead: "The account, and what happens if we part ways.",
        text: "glazedweb holds the Scooplist account for you and it is covered by the monthly fee. If either of us ends the agreement, we hand you the complete export of your flavor library and case history along with the rest of the project under Section 4(c), and the Scooplist account closes thirty days after. The export is yours to keep and to load anywhere.",
      },
      {
        lead: "Availability.",
        text: "The feed, the boards and the forms run on the same hosting and services the monthly fee covers, and Section 7 applies to them the same way it applies to the site.",
      },
    ],
  },
};

export function getCustomOrder(slug) {
  return Object.prototype.hasOwnProperty.call(CUSTOM_ORDERS, slug) ? CUSTOM_ORDERS[slug] : null;
}

export const money = (n) => `$${n.toLocaleString("en-US")}`;
