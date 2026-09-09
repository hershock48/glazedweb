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
      "Online pickup orders, built and switched off until you want them. Turning them on for pay-at-the-counter is included. Letting customers pay by card on the website runs on the Square account you already ring your counter on, and is quoted separately: your card rate stays whatever you already pay Square, and the only thing added is a flat 99¢ order fee at checkout, paid by the customer and named before they pay.",
      "Search, maps, structured data and link previews set up, and a pass over your Google Business Profile including the Friday midnight typo on the Marshall listing.",
      "The small studio credit in the footer, which on your site reads “Double Dipped by”.",
    ],
    notIncluded:
      "photography; copywriting beyond the pages listed; online card processing, which runs on your own Square account at your own Square rates and is quoted separately; point of sale or in-store hardware; printed materials; and a second website on any other platform.",

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

    /**
     * Part 4: online ordering and the order fee. Kevin, 9 Sep 2026: "add the
     * ordering fee clause to the agreement now, because this will basically
     * all be one build out." The 99¢ had been NAMED in the scope line but
     * never made a term: nothing said whose money it is, that it is a
     * customer line item rather than a deduction, that it applies to website
     * orders only, or what notice a change carries. glaze/standards.md says
     * the fee is named in the client agreement before cards go live; this is
     * that, in the shape of Chism's Square terms and in the voice of part 3.
     * The terms apply the day ordering is switched on, so they are true
     * whether that is launch day or later.
     */
    moreTerms: [
      {
        title: "online ordering and the order fee",
        summary: "how online ordering and its fee work",
        intro:
          "The site can take pickup orders paid in advance by card, on the Square account you already ring your counter on. These terms apply to that service from the day it is switched on, whether that is launch day or later, and are part of the agreement.",
        items: [
          {
            lead: "Your Square account, your money.",
            text: "Orders placed on the website are paid through your own Square account and settle to the bank account you designate, on Square’s schedule, exactly like a sale at the register. glazedweb holds none of the money from a sale, takes no percentage of any ticket, and is not a party to the sale of anything you make. Your card processing rate is whatever Square charges you, shown in your Square account, and is your cost, unchanged by us.",
          },
          {
            lead: "The order fee.",
            text: "A flat order fee of 99¢ is added at checkout to each order placed through the website, shown as its own line and named before the customer pays. The customer pays it; it is never deducted from your proceeds. It is collected by glazedweb through our Square developer application as an application fee on that payment, and it is glazedweb’s revenue, covering the ordering service. It applies only to orders placed through the website. A phone order written up at the counter, a walk-up, and anything rung at the register carry no fee, because none of them came through the site.",
          },
          {
            lead: "Tax and reporting.",
            text: "Sales tax on website orders is calculated and collected on your Square account under your own tax settings, on the items and, where Michigan requires it, on the order fee. You remain responsible for the tax and the reporting on your own sales, as you are for every register sale; glazedweb is responsible for the tax on its own fee revenue.",
          },
          {
            lead: "Changing the fee.",
            text: "The fee is fixed at 99¢. If it ever changes we tell you in writing thirty days before, the change never applies to an order already placed, and you may end online ordering, or the agreement, under the usual thirty days’ notice with nothing further owed.",
          },
          {
            lead: "What the service is, and is not.",
            text: "Pickup only, paid in advance, on the menu you publish. Turning it on for pay-at-the-counter is included in the build. Connecting your Square account for card payment is scoped with you before it is switched on; nothing takes a card until you have said so and seen it work. Whether a pickup can be changed or refunded is your policy, stated on the site as you direct, and honored by you at the counter.",
          },
          {
            lead: "Records, card data, and responsibility.",
            text: "Order records and customer contact details are your content under Section 4(a). Card numbers are never entered on or stored by the site; the card is entered on Square’s form. If we part ways, your order history is already in your Square account and stays there with the rest of the project under Section 4(c). Section 7 applies to the ordering service as it does to the site: glazedweb is not responsible for a missed pickup, a wrong order, a refund, or an order lost to a failed or declined payment.",
          },
        ],
      },
    ],

    /**
     * THE PROJECT PAGE, /build/truenorth (glaze/project-page.md). What a
     * signed client opens instead of texting "any update?": where things
     * stand, what we still need from him, what happens in what order, and
     * where his stuff is. It NEVER restates scope; scope is Exhibit A above
     * and the page links to it. Every line here is for him, not for us.
     *
     * `needs` boxes are OURS to tick, by editing `done` here, because the
     * honest state is what we have actually received, not what he believes
     * he sent. Ticking one moves the count on the page. `accepted` is hand
     * kept too: acceptance is an email record, not a database row.
     */
    project: {
      since: "2026-09-09",
      accepted: false,
      liveOnDomain: false,
      needs: [
        {
          id: "who",
          ask: "Your name, your title, and the business’s registered name.",
          why: "They go on the agreement. Nothing else waits on this, and everything else waits on this.",
          done: false,
        },
        {
          id: "hours",
          ask: "Confirm the hours.",
          why: "We have Marshall noon to 9 and Battle Creek 2 to 9, both read off your own Google listings on August 21. Right, or not?",
          done: false,
        },
        {
          id: "prices",
          ask: "Confirm the prices.",
          why: "Every price on the menu page came off your published list. One read-through is all this needs.",
          done: false,
        },
        {
          id: "machines",
          ask: "Which shop runs the soft serve machine, and which runs the espresso bar.",
          why: "We have both in Marshall, from a Choose Marshall article rather than from you.",
          done: false,
        },
        {
          id: "matcha",
          ask: "The matcha price, and the rest of the espresso lineup while we are there.",
          why: "It currently reads “Ask”, which is a placeholder and looks like one.",
          done: false,
        },
        {
          id: "bc-year",
          ask: "The year the Battle Creek shop opened.",
          why: "One sentence on the about page is waiting on it.",
          done: false,
        },
        {
          id: "instagram",
          ask: "Your Instagram handle.",
          why: "The footer links to a placeholder today.",
          done: false,
        },
        {
          id: "photos",
          ask: "Three or four of your brightest photos.",
          why: "Blue Moon is blue, the sorbets are pink and purple, sprinkle cones exist. The set we have skews chocolate-and-vanilla, and one viewer called the page clinical.",
          done: false,
        },
        {
          id: "inbox",
          ask: "The inbox catering and contact should land in, and whether each shop wants its own.",
          why: "Confirmed by you and actually watched by a person. A form that lands in a mailbox nobody opens is worse than no form.",
          done: false,
        },
        {
          id: "cases",
          ask: "Fill both cases in Scooplist.",
          why: "Not homework we can do for you. Battle Creek shows twelve flavors against Marshall’s thirty-one because nobody has tapped it in yet. Fifteen minutes on a phone, and it is the same fifteen minutes you would spend every week from then on.",
          done: false,
        },
        {
          id: "domain",
          ask: "Who holds truenorthicecream.com, and the login when it is time to point it.",
          why: "Not needed until launch week.",
          done: false,
        },
      ],
      steps: [
        {
          title: "You sign.",
          detail: "The agreement page. The build fee is invoiced, half now and half at launch, or paid in one go on the same page.",
        },
        {
          title: "Content in.",
          detail: "The list above. This is the step that decides the date, and it is the only step we cannot do for you.",
        },
        {
          title: "Forms pointed at your real inbox.",
          detail: "And tested by sending real messages through them, not by trusting that they work.",
        },
        {
          title: "The domain moves.",
          detail: "truenorthicecream.com points at the new site. Old addresses redirect, so nothing anybody has bookmarked or printed breaks.",
        },
        {
          title: "Search switched on.",
          detail: "The site is deliberately hidden from Google today, because a copy of your content on our address would compete with you for your own name. That comes off on launch day and not before, and your real domain goes into every link and every listing.",
        },
        { title: "Live.", detail: "" },
        {
          title: "Ordering, when you want it.",
          detail: "Separately, and not on launch day. Prepaid pickup on the Square you already run, confirmed on your own printer before it goes on.",
        },
      ],
      freebies: [
        {
          lead: "The Friday typo.",
          text: "Your Marshall Google listing says 12 AM to 9 PM on Fridays. We fix it with you, and send you every third-party listing that copied it so they can be corrected at the source.",
        },
        {
          lead: "Mail on your own domain.",
          text: "A catering quote arriving from an address at truenorthicecream.com instead of a Gmail address reads differently to somebody comparing three caterers. About an hour, and we do it with you at the shop.",
        },
      ],
      links: [
        { label: "The site", href: "https://truenorth.glazedweb.com/demo", note: "Where it lives until it is on your domain." },
        { label: "Scooplist sign-in", href: "https://scooplist.glazedweb.com/login/truenorth", note: "Your flavor cases, both shops. Your PIN, not ours." },
        { label: "Marshall board", href: "https://scooplist.glazedweb.com/board/truenorth/marshall", note: "The case, sized for a screen behind the counter." },
        { label: "Battle Creek board", href: "https://scooplist.glazedweb.com/board/truenorth/battlecreek", note: "Same, for the other shop." },
      ],
      monthlyIs: [
        "Send a text, get an edit. Prices, hours, a photo, a new catering tier.",
        "Flavors are not an edit. You change those yourself, as often as you like.",
        "Hosting, security, backups, the domain, and the Scooplist account for both shops.",
      ],
    },
  },

  copperac: {
    slug: "copperac",
    client: "Copper Athletic Club",
    /** TODO Kevin: the legal entity as registered, and the form. */
    clientLegal: "Copper Athletic Club",
    /** TODO Kevin: the owner's name for the signature line. */
    contactName: "",
    contactTitle: "Owner",
    email: "reserve@copperac.com",
    town: "Marshall, Michigan",
    domain: "copperac.com",
    exhibit: "Exhibit A: Copper Athletic Club, prepared 2026-09-08",
    /** A spec build, live at copperac.glazedweb.com/demo, waiting on DNS. */
    live: false,

    /** The published menu price on 2026-09-08 (Baker's Dozen: 2000/150). */
    buildFee: 2000,
    buildFeePaid: false,
    monthly: 150,
    editAllowance: "2 hours per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security updates, backups, domain renewal where we hold it, the Scooplist tap-board account, and the workroom.",
    editExamples:
      "prices, hours, a photo, a line of copy, a new special. Taps, events and menu prices are not edits; you change those yourselves in the workroom and in Scooplist, as often as you like.",

    scope: [
      "The site: home, menu, on tap, Sunday brunch, the Copper Reserve, events, and contact, on copperac.com, with the old site’s addresses redirected so nothing indexed breaks.",
      "The Board: live scores and tonight’s games for the Tigers, Lions, Pistons and Red Wings, and for Michigan and Michigan State in football, basketball and hockey, on the homepage, read from ESPN, with a headline line under it.",
      "The live status line on every page: open now with the kitchen on, bar open with the kitchen closed, or closed, read from the clock in Marshall.",
      "Your Scooplist account: the tap board and the cocktail list, kept by the bar from a phone, with the website following within a minute. Descriptions, running-low flags and on-deck kegs included.",
      "The workroom: a passcode-locked page of the site where your events person adds events (photo, details, the Toast ticket link) and changes menu prices, and reaches the tap board without a second code.",
      "The enquiry forms on the Reserve and contact pages, delivered to reserve@copperac.com, working with or without JavaScript, and honest about it when a message cannot be sent.",
      "The printed menu, the daily specials, happy hour and the month’s chalkboard specials on the site; search, maps, structured data and link previews set up; and a pass over your Google Business Profile including the kitchen hours.",
      "Online ordering stays on Toast: every Order Online button and the /order address go to your existing Toast store. The in-house ordering system we built stays parked, switched off, and is not part of this scope.",
      "The small studio credit in the footer.",
    ],
    notIncluded:
      "photography; copywriting beyond the pages listed; card processing and its fees, which need a Stripe account of yours and are quoted separately; switching online ordering off Toast onto the in-house system, which is quoted separately when and if you want it; point of sale or in-store hardware; printed materials; and a second website on any other platform.",

    /** Part 3: the master agreement has no clause for a live data feed or for
     *  an owner-edited site, so these say what each is and who holds what. */
    payments: [
      {
        lead: "What Scooplist and the workroom hold is yours.",
        text: "The tap library, every description and photo you add, the events you write, the menu prices you set, and the record of what was on tap and when are your content under Section 4(a). We do not sell it, and we do not use it for anything but running your site.",
      },
      {
        lead: "You can take it out whenever you want.",
        text: "Scooplist will hand you the whole tap library and every board entry ever recorded, as one file, at any time, from a button in your own account. The workroom’s events and menu edits are in your site’s database, which is part of the hosting project that transfers to you under Section 4(c).",
      },
      {
        lead: "The feed is an enhancement, never a dependency.",
        text: "If Scooplist is slow or unreachable, the website shows the taps-rotate panel and the printed cocktail list, and nothing on the page breaks. We do not promise the feed is never down. We do promise your website does not go down with it.",
      },
      {
        lead: "The accounts, and what happens if we part ways.",
        text: "glazedweb holds the Scooplist account for you and it is covered by the monthly fee. If either of us ends the agreement, we hand you the complete export of your tap library and board history along with the rest of the project under Section 4(c), and the Scooplist account closes thirty days after. The export is yours to keep and to load anywhere.",
      },
      {
        lead: "Toast stays yours and stays separate.",
        text: "Online ordering runs on your Toast account under Toast’s terms, not ours. The site links to it; it does not process an order, take a payment, or hold a customer’s card. Section 7 applies to the link the same way it applies to any other link off the site.",
      },
      {
        lead: "Availability.",
        text: "The feed, the boards, the workroom and the forms run on the same hosting and services the monthly fee covers, and Section 7 applies to them the same way it applies to the site.",
      },
    ],
  },
};

export function getCustomOrder(slug) {
  return Object.prototype.hasOwnProperty.call(CUSTOM_ORDERS, slug) ? CUSTOM_ORDERS[slug] : null;
}

export const money = (n) => `$${n.toLocaleString("en-US")}`;

/**
 * "Your content: 3 of 11." The one number on the project page that goes
 * up, computed from the registry so it cannot disagree with the list under
 * it. Missing or malformed `needs` counts as nothing to collect, never as a
 * crash on a page a client was sent a link to.
 */
export function contentProgress(order) {
  const needs = Array.isArray(order?.project?.needs) ? order.project.needs : [];
  return { done: needs.filter((n) => n && n.done === true).length, total: needs.length };
}
