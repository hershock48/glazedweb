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
    /**
     * Where the brand mark in the corner of his agreement and build pages
     * goes. He arrives at both from the proposal, and clicking the logo to
     * go back is the expectation (Kevin, 9 Sep 2026: "I am expecting it to
     * take me back to the proposal I clicked off of"). Studio home is the
     * wrong answer for a page that exists for one client. When the pitch
     * folder is deleted at launch, point this at the build page instead.
     */
    pitchUrl: "https://truenorth.glazedweb.com/",

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
     * customer line item rather than a deduction, or that it applies to
     * website orders only. (A "changing the fee" item, thirty days' notice and
     * never on an order already placed, was drafted and removed the same day
     * on Kevin's instruction; the agreement is silent on fee changes, and that
     * silence is deliberate.) glaze/standards.md says
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

  anchor: {
    slug: "anchor",
    client: "Anchor Insurance",
    /** The licensed entity (anchor/lib/site.ts). TODO Kevin: the registered
     *  form (LLC or otherwise) from her paperwork. */
    clientLegal: "Anchor Insurance and Risk Management",
    /** TODO Kevin: the owner's name. Nothing on file names her. */
    contactName: "",
    contactTitle: "Agent and owner",
    /** TODO Kevin: no agency mailbox exists yet; the intake sheet asks. */
    email: "",
    town: "Manchester, Michigan",
    /** Not bought. anchor/lib/site.ts carries the same assumption and flags it. */
    domain: "anchorinsurancemi.com",
    exhibit: "Exhibit A: Anchor Insurance, prepared 2026-09-10",
    /** A spec build, live at anchor.glazedweb.com/demo, not on her domain. */
    live: false,
    pitchUrl: "https://anchor.glazedweb.com/",

    /** The proposal's numbers (August 2026): $3,500 to build, $150 a month. */
    buildFee: 3500,
    buildFeePaid: false,
    monthly: 150,
    editAllowance: "2 hours per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security updates, backups, domain renewal where we hold it, the workroom, the customer reminder emails, and the online payment service; there is no separate platform, per-policy or per-customer charge.",
    editExamples:
      "hours, a new carrier row, a guide correction, a line of copy. Your phone, hours, address, license numbers and links you change yourself in the workroom, which never counts against it.",

    scope: [
      "The site: home, a page for each coverage line written (auto, home, renters, umbrella, life, business), the about page written from a recorded conversation with the owner in her own words, contact, privacy, the Michigan PIP tool, and four local guides.",
      "The giving page, stating the program plainly and pointing at the agency’s social accounts. The agency posts the causes; the site carries no ledger, percentage, or write-ups to maintain.",
      "The quote flow: a two-step form whose submissions land in the workroom’s leads queue, with call and text consent language.",
      "Pay your bill: one row per appointed carrier pointing at that carrier’s own payment site and billing line, and the online payment service in part 3 for what the agency may collect itself, with the customer’s bill prefilled from a link, one-time or autopay, and the small add-ons worth asking about offered on the bill.",
      "The workroom, the agency’s own tool behind a passcode: the leads queue, the book of customers and policies (with import from the agency management system’s export), the payments view, the site facts editor, and the customer reminder emails sent seven days out and on the day.",
      "The logo prepared for the web from the agency’s own artwork; search, maps and link-preview setup; structured data; and the small studio credit in the footer.",
      "Email on the agency’s own domain, set up at no charge once the domain exists.",
    ],
    notIncluded:
      "text-message reminders (a paid third-party service you would hear the cost of first); photography; copywriting beyond the recorded-hour story and the pages listed; carrier logos and marketing-review approvals, which the agency obtains from each carrier; Google Business Profile ownership, which the agency holds and we help set up; and a second website on any other platform.",

    /** Part 3: the online payment service. The master has no clause for a
     *  fee collected by the studio from the client's customers, and this is
     *  the first client on that rail. The part to show an attorney. */
    paymentsSummary: "how the online payments and the fee work",
    paymentsTitle: "the online payment service",
    paymentsIntro:
      "The site lets your customers see and pay the installments you enter in the workroom (the book), by card, on a checkout page under your name, with optional automatic payment on each due date and reminder emails before it. These terms apply to that service and are part of the agreement.",
    payments: [
      {
        lead: "Your Stripe account.",
        text: "You open and own your own account with Stripe, the card processor, and connect it under glazedweb’s Stripe platform so the site can create charges on it. Every payment settles to the bank account you designate, on Stripe’s schedule. Stripe’s processing fees are set by Stripe, shown in your Stripe account, and are your cost. You are responsible for Stripe’s terms, for the tax reporting on your own receipts, and for settling premium into a trust or premium account where Michigan law requires it.",
      },
      {
        lead: "The online payment fee.",
        text: "Each successful online payment carries a flat $0.99 online payment fee, paid by the paying customer as its own line item, shown on the bill page before the customer continues and itemized on the checkout page and receipt. glazedweb, as the payment technology provider, collects it through Stripe at the moment of payment, from that customer’s payment and never from you. We do not invoice you for it and you never hold it. The amount changes only by written agreement of both of us, or under the annual adjustment clause (Section 2(f)) applied to the fee the same way it applies to the monthly fee.",
      },
      {
        lead: "Authority to collect, and the fee’s posture.",
        text: "You alone decide which premiums you may lawfully collect: your own agency-billed invoices, and premium for carriers whose agency agreements authorize the agency to collect it. You set the per-carrier switch in the site accordingly and keep it current. Premium collected through the site is yours to remit to the carrier. glazedweb is not an insurance producer, holds no premium, does not give legal advice, and makes no representation that any fee structure is permitted for your license. The fee is charged by the payment technology provider for the online channel, the structure used by the processor the Michigan Association of Insurance Agents endorses; whether to offer that channel is your decision, made with whatever review you choose, and your acceptance records it.",
      },
      {
        lead: "The book, the records, and card data.",
        text: "The book (customer names, contact details, policy numbers, installment amounts and due dates) and the record of each payment made through the site are your content under Section 4(a). Card numbers are never entered on or stored by the site; the card is entered on Stripe’s pages. We access the book only to do this work. On termination we give you an export of the book and the payment records in a common file format at no charge, end the platform connection to your Stripe account, and stop the pay links; your Stripe account, its history and its payouts remain yours.",
      },
      {
        lead: "Messages to customers.",
        text: "Reminder and receipt emails go out in your name. Until you have a mailbox on your own domain, we send them from an address we control with replies routed to your email, and move them to your domain when it exists. Text messages are not included.",
      },
      {
        lead: "Availability and responsibility.",
        text: "The service runs on Stripe and on the hosting in Section 2(d), and Section 7 applies to it. glazedweb is not a party to any insurance contract and is not responsible for a lapse or cancellation caused by a late, failed, or misdirected customer payment, or by an installment amount or due date entered in the book; the site tells customers that a payment is not proof of coverage.",
      },
      {
        lead: "Your part.",
        text: "You keep the book accurate and current, by entering installments or importing your agency system’s export, and tell us promptly if a carrier’s collection authority changes.",
      },
    ],

    /** Three real screens, sample data, rendered from the build on 2026-09-02
     *  (anchor/public/agreement/ before the move; served from public/agreement/anchor/
     *  here). Kevin: "just so they can see what we're talking about." */
    figures: [
      {
        src: "/agreement/anchor/workroom-book.png",
        width: 1100,
        height: 760,
        alt: "The workroom’s book: a customer with two policies, each showing the installment, the next due date, where it is paid, and buttons to copy the pay link or email the bill.",
        caption: "The workroom: your book of customers and policies, with a pay link and an email-the-bill button on each.",
      },
      {
        src: "/agreement/anchor/bill-phone.png",
        width: 390,
        height: 1240,
        alt: "A customer’s bill on a phone: the amount and due date, the policy details, the choice to pay once or turn on autopay, and the add-ons worth asking about.",
        caption: "What your customer sees from the link: their bill, prefilled, paid right here under your name. No account, no password.",
      },
      {
        src: "/agreement/anchor/workroom-facts.png",
        width: 1100,
        height: 760,
        alt: "The workroom’s site facts screen: boxes for phone, email, address, hours and license numbers.",
        caption: "Site facts: your phone, hours, address and license numbers, edited by you and live on the site within seconds.",
      },
    ],

    /** The project page, /build/anchor. Kevin, 2026-09-10: set up the same way
     *  as True North, with a try-it-yourself list on it. */
    project: {
      since: "2026-09-10",
      accepted: false,
      liveOnDomain: false,
      needs: [
        {
          id: "who",
          ask: "Your name, your title, and the agency’s registered name.",
          why: "They go on the agreement and on the about page. Nothing else waits on this, and everything else waits on this.",
          done: false,
        },
        {
          id: "reach",
          ask: "The phone number and email address for the site, and which inbox quote requests should land in.",
          why: "Every call-us button and every form points at these. A form that lands in a mailbox nobody opens is worse than no form.",
          done: false,
        },
        {
          id: "address",
          ask: "The street address and ZIP, and whether there is a walk-in office or visits are by appointment.",
          why: "The contact page, the footer, and the map listing all read from it.",
          done: false,
        },
        {
          id: "hours",
          ask: "Your hours, including the day that is different.",
          why: "Printed on the contact page and sent to Google as opening hours.",
          done: false,
        },
        {
          id: "license",
          ask: "Your Michigan producer license number and NPN.",
          why: "Required on the site, and checked by the people who check.",
          done: false,
        },
        {
          id: "carriers",
          ask: "Your carrier appointments, and for each one whether the agency may accept premium payments.",
          why: "Each carrier gets a row on the pay page pointing at its own portal. Whether a customer pays a carrier’s bill on your site or at the carrier is decided by that carrier’s agreement, per carrier, and only you can read those.",
          done: false,
        },
        {
          id: "story",
          ask: "An hour on the phone, recorded, for the about page.",
          why: "It is the one page that cannot be written without you. In your words, why you started the agency and why the giving is built in.",
          done: false,
        },
        {
          id: "google",
          ask: "Your Google Business Profile’s review link, and your Facebook page.",
          why: "The review ask on the site stays hidden until the link exists, and the giving page points at Facebook for the causes.",
          done: false,
        },
        {
          id: "stripe",
          ask: "Open your Stripe account when we send the link.",
          why: "About fifteen minutes. Premium settles to the bank account you choose; the fee never touches it. Nothing can be paid on the site until this exists.",
          done: false,
        },
        {
          id: "book",
          ask: "Your customers and policies: the export from your agency system, or the first few typed in.",
          why: "The book is what makes a bill payable from a link. A spreadsheet with a row per policy imports in one go, and re-importing next month’s export keeps it current.",
          done: false,
        },
        {
          id: "domain",
          ask: "Who holds anchorinsurancemi.com, or which domain to buy, and the login when it is time to point it.",
          why: "Not needed until launch week.",
          done: false,
        },
        {
          id: "retention",
          ask: "How long quote requests you do not write should be kept.",
          why: "One sentence on the privacy page is waiting on it.",
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
          title: "Stripe connected.",
          detail: "Your account under our platform, then one test payment together, with a test card, so you see the split land before a real customer does.",
        },
        {
          title: "Forms pointed at your real inbox.",
          detail: "Quote requests, the payment notices and the reminder replies, tested by sending real ones through, not by trusting that they work.",
        },
        {
          title: "The domain moves.",
          detail: "anchorinsurancemi.com, or whichever you choose, points at the new site.",
        },
        {
          title: "Search switched on.",
          detail: "The site is deliberately hidden from Google today, because a copy of your content on our address would compete with you for your own name. That comes off on launch day and not before.",
        },
        { title: "Live.", detail: "" },
        {
          title: "Reminders start.",
          detail: "Once the book is in, the nightly job emails each customer seven days before a due date and on the day, with their bill one tap away.",
        },
      ],
      freebies: [
        {
          lead: "Mail on your own domain.",
          text: "A quote reply arriving from an address at your own domain instead of a Gmail address reads differently. About an hour, and we do it with you.",
        },
        {
          lead: "The review ask, built in.",
          text: "The site asks happy customers for a Google review on the homepage, the contact page and the payment thank-you, the moment your review link exists. Getting your first twenty reviews will do more for you than half of this website.",
        },
      ],
      links: [
        { label: "The site", href: "https://anchor.glazedweb.com/demo", note: "Where it lives until it is on your domain." },
        { label: "The workroom", href: "https://anchor.glazedweb.com/workroom", note: "Leads, the book, payments, site facts. Passcode sent separately." },
        { label: "The intake sheet", href: "https://anchor.glazedweb.com/intake", note: "Most of the list above, as a form you can fill in at your own pace." },
      ],
      tryIt: [
        {
          lead: "Walk a quote.",
          text: "Fill in the quote form as a customer would. It lands in the workroom’s Leads tab within a minute, with your notes box beside it.",
          href: "https://anchor.glazedweb.com/demo/quote",
        },
        {
          lead: "Pay a bill, in test mode.",
          text: "In the workroom’s Book, add yourself as a customer with a policy, copy the pay link, open it, and pay with the test card 4242 4242 4242 4242. No real charge. The book records it and rolls the due date; try autopay the same way.",
          href: "https://anchor.glazedweb.com/workroom/book",
        },
        {
          lead: "Ask about an add-on.",
          text: "On that bill, tick one of the small additions before you pay. It becomes a lead in your queue and an email to you, and the thank-you page repeats it.",
        },
        {
          lead: "Change a fact.",
          text: "In Site facts, change the phone number and save, then open the site. It updates within seconds, and clearing the box puts it back.",
          href: "https://anchor.glazedweb.com/workroom/facts",
        },
      ],
      monthlyIs: [
        "Send a text, get an edit. Hours, a carrier row, a guide correction, a line of copy.",
        "Most facts are not an edit. Your phone, hours, address and license numbers you change yourself in the workroom, as often as you like.",
        "Hosting, security, backups, the domain, the workroom, the customer reminders, and the online payment service.",
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
    pitchUrl: "https://copperac.glazedweb.com/",
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

    /**
     * THE PROJECT PAGE, /build/copperac (glaze/project-page.md). Kevin,
     * 10 Sep 2026: "i want to integrate a launch element into the coppers
     * proposal", the True North pattern. The proposal's one action is this
     * page; its first circle sends him to the agreement. Same rules as True
     * North's block: never restates scope, the `needs` boxes are OURS to
     * tick, `accepted` and `liveOnDomain` are hand kept.
     */
    project: {
      since: "2026-09-10",
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
          id: "prices",
          ask: "A read-through of the menu prices.",
          why: "We copied the printed menu word for word on 2 September. One pass at the bar is all this needs; anything that has moved since, your events person can change herself in the workroom.",
          done: false,
        },
        {
          id: "planner",
          ask: "Your events person’s name and email.",
          why: "Shown on the events page as the person to ask about hosting something, and she is who gets the workroom passcode.",
          done: false,
        },
        {
          id: "event",
          ask: "The next event.",
          why: "So the events page does not launch empty. Name, date, a flyer if there is one, or hand it to your events person once she has the passcode and she adds it herself.",
          done: false,
        },
        {
          id: "photos",
          ask: "Any photographs you love that are not on the site.",
          why: "The ones there now are from 2019. Phone photos are fine; we size them.",
          done: false,
        },
        {
          id: "google",
          ask: "Ten minutes with your Google listing.",
          why: "To add the kitchen’s ten o’clock cutoff, so the listing people read from the car says it. We do it with you at the bar; it needs your login, not ours.",
          done: false,
        },
        {
          id: "domain",
          ask: "Who holds copperac.com, and the login when it is time to point it.",
          why: "Not needed until launch week. Ten minutes wherever it is registered.",
          done: false,
        },
      ],
      steps: [
        {
          title: "You sign.",
          detail: "The agreement page. The build fee is paid there by card, in full or half now and half at launch, or we invoice it.",
        },
        {
          title: "Content in.",
          detail: "The list above. It decides the date, and it is the only step we cannot do for you.",
        },
        {
          title: "The domain moves.",
          detail: "copperac.com points at the new site. The old site’s addresses redirect, so nothing anybody has bookmarked or printed breaks.",
        },
        {
          title: "Search switched on.",
          detail: "The site is deliberately hidden from Google today, because a copy of your menu on our address would compete with you for your own name. That comes off on launch day and not before.",
        },
        { title: "Live.", detail: "" },
        {
          title: "The workroom handed over.",
          detail: "Your events person gets the passcode and a walk-through at the bar: events, menu prices, the tap board. From then on nothing waits on us.",
        },
      ],
      freebies: [
        {
          lead: "The six findings, handed over.",
          text: "Everything in part two of the proposal, with the link to each, goes to whoever looks after the current site today. The Copper Bash line and the kitchen hours are each a few minutes to fix from inside WordPress once someone knows where to look.",
        },
        {
          lead: "The kitchen hours on Google.",
          text: "Your Google listing shows the bar’s hours and nothing about the kitchen. We sit with you and add the note, so the ten o’clock cutoff is on the listing people actually read from the car.",
        },
      ],
      links: [
        { label: "The site", href: "https://copperac.glazedweb.com/demo", note: "Where it lives until it is on your domain." },
        {
          label: "The workroom",
          href: "https://copperac.glazedweb.com/workroom",
          note: "Events, menu prices and the tap board, behind the passcode we hand your events person.",
        },
        { label: "Scooplist sign-in", href: "https://scooplist.glazedweb.com/login/copperac", note: "The tap board, from a phone. Your PIN, not ours." },
      ],
      monthlyIs: [
        "Send a text, get an edit. Prices, hours, a photo, a new special.",
        "Taps, events and menu prices are not edits. You change those yourselves, as often as you like.",
        "Hosting, security, backups, the domain, the Scooplist account, and the workroom.",
      ],
    },
  },

  /**
   * RETROACTIVE. beanumber.org has been live since January 2026 and this
   * row papers what already exists (Kevin, 2026-09-10: "a retroactive
   * proposal for beanumber; we own the repo"). No build fee at all, and $50
   * a month from the day it is started on the agreement page. Kevin
   * founded Be A Number and runs glazedweb, so he is on both sides of this
   * one; the `needs` list says who has to sign for the nonprofit.
   *
   * Scope is written as an inventory of the live site, read from the repo
   * on 2026-09-10 (hershock48/beanumber at 3e34f7e), not from memory.
   */
  beanumber: {
    slug: "beanumber",
    client: "Be A Number",
    /** As printed in the site footer, the terms and the privacy page:
     *  a U.S. 501(c)(3) public charity, EIN 93-1948872, incorporated 2023. */
    clientLegal: "Be A Number, International",
    /** TODO Kevin: who signs for the nonprofit. Kevin is the founder AND the
     *  provider, so the board approves this and someone else signs. */
    contactName: "",
    contactTitle: "Board member",
    email: "kevin@beanumber.org",
    town: "Marshall, Michigan",
    domain: "www.beanumber.org",
    exhibit: "Exhibit A: Be A Number, prepared 2026-09-10",
    live: true,
    pitchUrl: "https://beanumber.glazedweb.com/",

    /** No build fee. lib/buildfee.js reports it paid with nothing to pay,
     *  and the pages say "No build fee" rather than "$0: paid". */
    buildFee: 0,
    monthly: 50,
    /** One hour, the same as Chism's $50 order. Sponsor, roster and
     *  newsletter work is not an edit; that is done in the admin. */
    editAllowance: "1 hour per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security and dependency updates, backups, the database and photo storage the site runs on, the daily jobs, the Stripe webhook kept working, and domain renewal where we hold it.",
    editExamples:
      "a price, a page of copy, a photo, a new report, a redirect. Children, sponsors, newsletters, orders and penpal notes are not edits; you run those yourselves in the admin, as often as you like.",

    scope: [
      "The public site: home, shirts, the founder story, impact, partnerships, governance, the 2025 annual report and the impact and financial summary, news (the campus newsletter archive, each issue its own page), contact, privacy and terms, and the Youth Development Organisation pages under /ydo with their own navigation.",
      "The number: the shirt shop (one design, four colorways, $25), the number-to-name reveal at /children/{number} behind the Hold-to-Meet button, a public page for each child at /meet with no number on it, the sign-in-gated campus grid, and the batch system that maps numbers above 53 back onto the roster without anybody ever assigning a child to a buyer.",
      "Sponsor accounts: sign-in by emailed link with no passwords, the /me hub with every child a sponsor knows, notes to a child with translation on the campus side, report cards and letters, the campus newsfeed, awards, and the holder-versus-sponsor split that keeps a child’s personal updates for monthly sponsors.",
      "Payments, all on Be A Number’s own Stripe account: one-time and monthly donations, shirt checkout with the optional $25 a month continuation, the $25 a month sponsorship, gift sponsorships, the farmers-market booth checkout at /market, repeat shirts and numbered merch for sponsors, promo codes, and the webhook that records every order, creates sponsor codes, and sends the receipts.",
      "Email, sent through Be A Number’s own Gmail with a SendGrid fallback: receipts and confirmations, the six drip sequences, the campus newsletter with scheduling and one-click unsubscribe, and the alerts to Kevin and the campus.",
      "The admin: the roster with intake by the campus and review by Kevin, the penpal queue with translation and a print sheet, fulfillment with a Pirate Ship import file and packing slips, the newsletter editor, donors, the sponsor reveal status, retention, Stripe sync, batches, student of the month, and the thermal bag labels.",
      "The data: a Postgres database of 24 tables with an audit log, photo and document storage, and the five daily jobs plus the Sunday batch that keep reminders, newsletters, drips and push notices moving.",
      "The API the mobile app talks to (sign-in with Apple and Google, push, claims, threads, the campus feed) and the deep-link files, served from the same project.",
      "Search, structured data, sitemaps and link previews set up; the print files kept in the repository (the shirt insert card, the bag labels, the booth kit, the founder letters, the cut files); and the small studio credit in the footer, which on your site reads “Double Dipped by”.",
    ],
    notIncluded:
      "photography and video production (the impact report and reel render locally from the repository and are not a hosted service); copywriting beyond the pages listed; the Stripe account, its fees and its payout schedule, which are yours (part 3); the Google account the mail sends from; the Apple and Google developer accounts and the app store submissions; printing and shirt production; and a second website on any other platform.",

    /** Part 3: a nonprofit's money, its donors, and children's records. The
     *  master has no clause for any of the three. */
    paymentsSummary: "how the donations, the records and the accounts work",
    paymentsTitle: "the donations, the records and the accounts",
    paymentsIntro:
      "The site takes donations, sells shirts and runs monthly sponsorships on Be A Number’s own accounts, and holds records about donors, sponsors and children. These terms apply to that and are part of the agreement.",
    payments: [
      {
        lead: "Your Stripe account, your money.",
        text: "Every gift, shirt and sponsorship is charged on Be A Number’s own Stripe account and settles to the bank account you designate, on Stripe’s schedule. glazedweb holds none of it, takes no fee and no percentage from any payment, and is not a party to any gift or sale. Stripe’s processing fees are set by Stripe, shown in your Stripe account, and are your cost.",
      },
      {
        lead: "Receipts and tax are yours.",
        text: "The receipt and acknowledgment emails go out in Be A Number’s name with the wording you set. What a receipt must say, what part of a shirt purchase is deductible, and the reporting on your own revenue are your responsibility as the charity; glazedweb gives no tax or legal advice and the site’s copy on those points is yours to direct.",
      },
      {
        lead: "The children’s records.",
        text: "Names, photographs, numbers, report cards, letters and notes about children are your content under Section 4(a) and are the most sensitive thing on the site. We access them only to do this work, never copy them anywhere else, and never use them in our own marketing. The site keeps the numbered pages out of search and off the sitemap, and that stays so.",
      },
      {
        lead: "Donor and sponsor data.",
        text: "Donor and sponsor records, the sponsorship history, the order history and every email the site sends are your content under Section 4(a). We do not sell or share them and use them only to run the site. On termination you get an export of the database and the storage in a common file format at no charge.",
      },
      {
        lead: "The accounts.",
        text: "Stripe, the Google account the mail sends from, the domain and the app store accounts are Be A Number’s. The hosting project and the database run under glazedweb’s accounts today, are paid for by the monthly fee, and transfer to accounts you name under Section 4(c) on request, with the repository and every login.",
      },
      {
        lead: "Availability and responsibility.",
        text: "The site runs on Stripe, on Google’s mail, on the database and storage service, and on the hosting the monthly fee covers, and Section 7 applies to all of it. glazedweb is not responsible for a failed or refunded payment, a lost or late shirt, an email that did not arrive, or a gift lost to any of those.",
      },
    ],

    /** The project page, /build/beanumber. The site is live, so most of the
     *  page is already green; what remains is the signature and two pieces
     *  of housekeeping we owe the site. */
    project: {
      since: "2026-09-10",
      accepted: false,
      liveOnDomain: true,
      needs: [
        {
          id: "who",
          ask: "Who signs for Be A Number, and the board’s approval.",
          why: "Kevin is the founder of Be A Number and the owner of glazedweb, so he is on both sides of this agreement. A charity paying a related party needs the board to approve it and someone other than Kevin to sign. Nothing else waits on this, and everything else waits on this.",
          done: false,
        },
        {
          id: "domain",
          ask: "Who holds beanumber.org, and the registrar login.",
          why: "Two DNS records are missing (the email authentication below), and the agreement records where the domain lives.",
          done: false,
        },
        {
          id: "accounts",
          ask: "Confirm the accounts are in the charity’s name: Stripe, the Google account the mail sends from, and the app store accounts.",
          why: "Part 3 of the agreement says they are yours. One read-through of the account owners is all this needs.",
          done: false,
        },
      ],
      steps: [
        {
          title: "The board approves and someone signs.",
          detail: "The agreement page. There is no build fee, so nothing is invoiced.",
        },
        {
          title: "The monthly starts.",
          detail: "From the same page, by card, the day you choose. It runs month to month from that day.",
        },
        {
          title: "Airtable comes out.",
          detail: "The site no longer uses it as a data source, but it still needs Airtable keys to boot and still calls it from the rep portal. We remove both, so the site depends on nothing you do not use.",
        },
        {
          title: "Email authentication.",
          detail: "The two DNS records that stop mail from kevin@beanumber.org showing an authentication warning in Gmail. Ten minutes once we have the registrar login.",
        },
        {
          title: "From then on: send a text, get an edit.",
          detail: "",
        },
      ],
      freebies: [
        {
          lead: "Airtable retired.",
          text: "The boot requirement, the dead library, and the four routes that still call it. The rep portal moves onto the database with everything else.",
        },
        {
          lead: "Email authentication.",
          text: "SPF and DKIM on beanumber.org, so a newsletter or a receipt from kevin@beanumber.org lands without a warning.",
        },
      ],
      links: [
        { label: "The site", href: "https://www.beanumber.org", note: "Live, on your own domain." },
        { label: "The admin", href: "https://www.beanumber.org/admin", note: "Roster, penpal queue, fulfillment, newsletter, donors. The password you already have." },
      ],
      monthlyIs: [
        "Send a text, get an edit. A price, a page, a photo, a redirect, a new report.",
        "Children, sponsors, orders, newsletters and penpal notes are not edits. You run those yourselves in the admin, as often as you like.",
        "Hosting, security, backups, the database and storage, the daily jobs, the Stripe webhook, and the domain where we hold it.",
      ],
    },
  },

  /**
   * MI GAS. The proposal at migas.glazedweb.com (August 2026, revised after
   * the 2026-08-27 owner call) closes on "Launch", which is /build/migas.
   * Numbers: $3,500 to build (the letter's), $150 a month (Kevin, 2026-09-10,
   * up from the letter's $99; the letter was revised the same day). The paper draft
   * in contracts-private (v1.0, 2026-08-28) predates this row and carries
   * the same two numbers; its bracketed fields are the TODOs below.
   */
  migas: {
    slug: "migas",
    client: "MI Gas",
    /** TODO Kevin: the registered entity behind MI Gas, and its form. The
     *  paper draft left it bracketed and nothing on file names it. */
    clientLegal: "MI Gas",
    /** TODO Kevin: Jake's last name. The draft has "Jake [LAST NAME]". */
    contactName: "",
    contactTitle: "Director",
    /** TODO Kevin: no email address exists anywhere on mi-gas.net; the site's
     *  own SITE.email is a placeholder for the same reason. First item on the
     *  needs list below. */
    email: "",
    /** TODO Kevin: the town. Michigan is all the site says. */
    town: "Michigan",
    domain: "mi-gas.net",
    exhibit: "Exhibit A: MI Gas, prepared 2026-09-10",
    /** A spec build, live at migas.glazedweb.com/demo; mi-gas.net still points at Squarespace. */
    live: false,
    pitchUrl: "https://migas.glazedweb.com/",

    /** The letter's numbers. The $3,500 was set before the call and held
     *  after the call added co-management, the editor, the feed and the
     *  Patreon section (the letter says so in its cost section). */
    buildFee: 3500,
    buildFeePaid: false,
    monthly: 150,
    /** House numbers, not his: the same two the in-repo draft of 2026-09-03
     *  carried (lib/agreement.ts in the migas repo before it was retired to
     *  this row). The paper draft left both bracketed. Confirm with Kevin. */
    editAllowance: "2 hours per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security patching, backups, domain renewal where we hold it, the storage behind the availability editor, and the booking system kept working. Nothing inside the site is rented from a third party, so nothing inside it can send you a separate bill.",
    editExamples:
      "a price, a session, a line of copy, a photo, an answered FAQ. Your hours, days off and lead time you change yourself in the availability editor, which never counts against it.",

    scope: [
      "The site: home, consulting, co-management, reviews, connect, and a 404 that routes somewhere useful, with titles and descriptions written per page, structured data (ProfessionalService and two Service records), and a link-preview card for the site and another for the co-management page.",
      "The booking: session length, the eight-question room intake, photos off a phone downscaled in the browser before they leave the device, slot lengths that never offer a session the window cannot hold, times labelled Eastern, and a written brief with the photos attached plus a calendar invite to both sides. It works with JavaScript off.",
      "Availability you edit yourself: a PIN-gated editor for weekly hours, days off, lead time and horizon, saved without a deploy; and your own calendar’s private feed read back, so every event on it removes the slots it covers.",
      "Consulting at $250 an hour, your number from the August 27 call, with the 30 and 90 minute sessions derived from it rather than typed; and the request-a-call capture for the visitor who would rather talk first.",
      "Co-management in your own terms: the service list, $50 to $150 per light by project size, the sensor requirement, the head-grower condition, the extras, a FAQ, the application that collects the room and still sends on a disqualifying answer, and the printable one-pager for handing to a partner.",
      "The Patreon section: your public member and post counts, your room photographs, and a growth section that renders when you supply the member history.",
      "Reviews as text, the question form on connect with a topic attached, and your email address wired everywhere it appears once it exists.",
      "The words, adjusted with you. You said on September 3 that there is a lot of wording to adjust, on more than one section, and that we would go through it together. That pass, section by section until every page reads as yours, is part of the build fee: not an edit against the monthly allowance, and not billed by the hour.",
      "Mail sent over SMTP through a mailbox you already own, and no scheduling subscription, mail service, analytics script or other third-party service inside the site; and the small studio credit in the footer, which on your site reads “Baked by”.",
    ],
    notIncluded:
      "online payment or checkout, which waits on which processor will underwrite your category, so the site takes booking requests and applications and you invoice; the co-management venture discussed on the August 27 call, a separate engagement with its own agreement if it proceeds; merch and direct guide sales, removed from scope at your direction on that call; photography; copywriting and content beyond the pages listed and the monthly edit allowance; and a second website on any other platform.",

    /** Part 3: the master has no clause for holding a client's mailbox
     *  login and private calendar address, for what a grower sends through
     *  the intake, or for a site in a licensed category that takes no card. */
    paymentsSummary: "how the booking, your calendar and your mail work",
    paymentsTitle: "the booking, your calendar and your mail",
    paymentsIntro:
      "The site books consults, takes co-management applications and questions, reads your own calendar to keep the grid honest, and sends everything through a mailbox you own. These terms apply to that and are part of the agreement.",
    payments: [
      {
        lead: "Your mailbox sends the mail.",
        text: "The briefs, applications, questions and calendar invites leave through a mailbox you already own, over SMTP. We hold its login only to connect the site and to change it when you ask; it lives in the hosting dashboard, never in the code, and you give it to us by phone, never in a text. Changing the password on your side closes that door at any time.",
      },
      {
        lead: "Your calendar’s private address is a secret.",
        text: "It lets the site read every event on your calendar, and anyone holding it can do the same. It is stored the same way as the mailbox login, used only to remove taken times from the grid, and nothing it returns is copied, published or kept beyond the page load that read it. Reset it on your side whenever you like; the grid falls back to your windows.",
      },
      {
        lead: "What a grower sends you is yours.",
        text: "The intake answers, the photographs of somebody’s room, and the application details are your content under Section 4(a). The site keeps no database of them: the record is the email in your inbox and the invite on your calendar. Until your mailbox is connected the site writes each submission to its own log so nothing is lost, and we read those back to you rather than keep them.",
      },
      {
        lead: "Your hours are your data.",
        text: "The availability you set in the editor is one small document in the hosting project’s storage, covered by the monthly fee, and it leaves with the rest of the project under Section 4(c).",
      },
      {
        lead: "No card is taken, and nothing on the site is legal advice.",
        text: "The site takes no payment; you invoice. What the site may say about your licence, your facility and cultivation is yours to decide with whatever review you choose. glazedweb gives no legal advice and makes no representation about what a licensed operator may publish.",
      },
      {
        lead: "Availability.",
        text: "The booking, the editor and the forms run on the hosting in Section 2(d), and Section 7 applies to them. Every failure of the calendar feed or the mail is open: the grid renders from your windows alone and the form stays up. Two visitors taking the same slot in the same minute both pass, and you confirm by reply, so that costs an apology rather than a no-show.",
      },
    ],

    /** The project page, /build/migas. Same shape as Anchor. No try-it list:
     *  the editor is switched off until the PIN exists and the mail until the
     *  mailbox does, so nothing on the demo leaves a trace he could find
     *  afterwards, and the page's try-it intro promises exactly that. Add one
     *  the day both are on. */
    project: {
      since: "2026-09-10",
      accepted: false,
      liveOnDomain: false,
      needs: [
        {
          id: "who",
          ask: "Your full name, your title, and the registered name and address of the business behind MI Gas.",
          why: "They go on the agreement. Nothing else waits on this, and everything else waits on this.",
          done: false,
        },
        {
          id: "email",
          ask: "An email address you will read, and whether bookings, applications and questions should all land in it.",
          why: "There is no address anywhere on mi-gas.net today, so nothing on the site can reach you without this. It is also what makes the calendar invite a true invitation; without a sender, Outlook refuses it.",
          done: false,
        },
        {
          id: "mailbox",
          ask: "The mailbox the site sends from: which provider, and its login, by phone.",
          why: "Every brief, application and invite leaves through a mailbox you already pay for, which is why nothing on this list is a new bill. The login is spoken, never typed into a text.",
          done: false,
        },
        {
          id: "calendar",
          ask: "Your calendar’s private iCal address, by phone as well.",
          why: "It is what removes a booked or busy time from the grid. Anyone holding it can read your calendar, so it travels the same way as a password.",
          done: false,
        },
        {
          id: "pin",
          ask: "A PIN for the availability editor.",
          why: "It signs you in to set your own hours, days off and lead time from your phone. Your hours themselves are not on this list; you set them there.",
          done: false,
        },
        {
          id: "reviews",
          ask: "The text of your six reviews.",
          why: "They are pictures on the current site. The cards render as visible empty slots until the words arrive, because inventing a testimonial is not a placeholder.",
          done: false,
        },
        {
          id: "faq",
          ask: "Answers to the drafted FAQ questions on the consulting and co-management pages, confidentiality first.",
          why: "Whether what a client tells you stays private is the question a facility asks before it books. The drafts are marked as drafts on the pages until you answer.",
          done: false,
        },
        {
          id: "minimum",
          ask: "The co-management project minimum, and how the per-light fee is billed: monthly, per run, or otherwise.",
          why: "The page says a minimum exists and prints no number until you set one.",
          done: false,
        },
        {
          id: "sessions",
          ask: "Whether calls start at a full hour.",
          why: "$250 an hour is yours. $125 and $375 for the 30 and 90 minute sessions are arithmetic on it, and if a full hour is the floor the 30-minute session comes off.",
          done: false,
        },
        {
          id: "figures",
          ask: "Confirmation of the figures on the credentials strip and the feed and runoff numbers on the diagram.",
          why: "They came from your own posts, and posts have dates on them. A runoff target on your page reads as your recommendation, so it is yours or it goes generic.",
          done: false,
        },
        {
          id: "patreon",
          ask: "The member history from your Patreon dashboard, and any member quotes you want used.",
          why: "The growth section renders only with it. If the line does not rise, we ship no strip.",
          done: false,
        },
        {
          id: "logo",
          ask: "Your logo as a file, a vector if one exists, and the typeface name if you know it.",
          why: "The wordmark in the build is set in our display face. Yours goes in the day it lands, and if there is no vector we trace one from the black-on-white artwork.",
          done: false,
        },
        {
          id: "signoffs",
          ask: "Three sign-offs: whether to name the facility, what the site may say about your licence, and whether the footer credit stays “Baked by Glazed Web”.",
          why: "The first is your strongest credibility asset and plenty of people keep their employer separate on purpose. The second is your lawyer’s answer. The third is our joke in your footer, so it is your call.",
          done: false,
        },
        {
          id: "domain",
          ask: "The Squarespace login that holds mi-gas.net, when it is time to point it.",
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
          title: "The words, adjusted with you.",
          detail: "Page by page, section by section, until each one reads as yours. Your September 3 note put this inside the build fee, so it is owed work, not a request.",
        },
        {
          title: "The booking switched on.",
          detail: "Four settings in the hosting dashboard: your mailbox, the inbox, the PIN and your calendar feed. Then one real test booking together, from your phone, with photos: the brief lands in your inbox, the invite lands on your calendar, and the slot is gone from the grid.",
        },
        {
          title: "Forms pointed at your real inbox.",
          detail: "The co-management application, the request-a-call and the question form, tested by sending real ones through, not by trusting that they work.",
        },
        {
          title: "The domain moves.",
          detail: "mi-gas.net leaves Squarespace and points at the new site. The old store and guide links land on the 404 that routes.",
        },
        {
          title: "Search switched on.",
          detail: "The site is deliberately hidden from Google today, because a copy of your content on our address would compete with you for your own name. That comes off on launch day and not before, and a sitemap goes in the same day.",
        },
        { title: "Live.", detail: "" },
      ],
      freebies: [
        {
          lead: "The work added after the call, at the August price.",
          text: "Co-management with its application and one-pager, the availability editor, the calendar feed and the Patreon section all arrived after the $3,500 was set, and the number did not move. That is ours to stand behind, not yours to absorb.",
        },
      ],
      links: [
        { label: "The site", href: "https://migas.glazedweb.com/demo", note: "Where it lives until it is on mi-gas.net." },
        {
          label: "The availability editor",
          href: "https://migas.glazedweb.com/admin",
          note: "Your hours, days off and lead time. PIN told by phone; until one is set the page says it is not switched on.",
        },
        {
          label: "The one-pager",
          href: "https://migas.glazedweb.com/co-management/one-pager",
          note: "The co-management model as a printable page, for handing to a partner.",
        },
      ],
      monthlyIs: [
        "Send a text, get an edit. A price, a session, a line of copy, a photo, an answered FAQ.",
        "Your hours are not an edit. Windows, days off and lead time you change yourself in the availability editor, as often as you like.",
        "Hosting, security, backups, the domain where we hold it, the editor’s storage, and the booking system kept working.",
      ],
    },
  },

  /**
   * PAY-RAIL-ONLY ENTRY. DeVine's agreement does not live here: her Exhibit
   * A, the clickwrap and the acceptance records all live in the devine repo
   * at devine.glazedweb.com/agreement, and duplicating the scope here would
   * be exactly the two-descriptions drift the header forbids. This entry
   * exists so /api/pay/devine can open Checkout with her numbers, and
   * `agreementUrl` sends every page render and every Stripe return trip to
   * the one agreement home instead of a sparse twin on this host. The
   * numbers must match devine/src/lib/agreement.ts by hand, same rule as
   * the paper drafts.
   */
  devine: {
    slug: "devine",
    client: "DeVine's Flowers & Botanicals",
    /** TODO Kevin: the legal entity as registered, and the form. */
    clientLegal: "DeVine's Flowers & Botanicals",
    /** TODO Kevin: the owner's name for the signature line. */
    contactName: "",
    contactTitle: "Owner",
    email: "devinesflowersandbotanicals@gmail.com",
    town: "Marshall, Michigan",
    domain: "devinesflowersandbotanicals.com",
    exhibit: "Exhibit A: DeVine's Flowers & Botanicals, prepared 2026-08-31, revised 2026-09-09",
    live: false,
    pitchUrl: "https://devine.glazedweb.com/",
    agreementUrl: "https://devine.glazedweb.com/agreement",

    buildFee: 2000,
    buildFeePaid: false,
    monthly: 150,
    editAllowance: "2 hours per month",
    hourlyRate: 125,
  },

  griffinclaw: {
    slug: "griffinclaw",
    client: "Griffin Claw Brewing Company",
    /** TODO Kevin: the registered entity, and confirmation of who may sign it.
     *  Press coverage of the 2024 Chapter 11 names the filer as Eton Street
     *  Brewery LLC, and the same coverage is why this one matters more than
     *  usual: ownership is split 50/50 between two family trusts, the filing
     *  was dismissed in about October 2024 for going ahead without the other
     *  side's consent, and the state case resumed. A vendor contract signed by
     *  one side may not bind the company. Ask before the proposal goes out,
     *  not after a yes. See docs/deep-audit-v2.md section 1 in the pitch repo. */
    clientLegal: "Eton Street Brewery LLC",
    /** TODO Kevin: your contact there, and their title. */
    contactName: "",
    contactTitle: "",
    /** TODO Kevin: there is no email address published anywhere on
     *  griffinclawbrewingcompany.com, which is finding seven in the audit and
     *  the second item on the needs list below. */
    email: "",
    town: "Birmingham",
    domain: "griffinclawbrewingcompany.com",
    exhibit: "Exhibit A: Griffin Claw Brewing Company, prepared 2026-09-10",
    /** A spec build. Two of them, in fact: griffinclaw.glazedweb.com/demo and
     *  /demo-classic. The live site is still the 2023 Craftpeak build. */
    live: false,
    pitchUrl: "https://griffinclaw.glazedweb.com/",

    buildFee: 4500,
    buildFeePaid: false,
    monthly: 195,
    /** TODO Kevin: the letter's price box says the monthly covers "content
     *  edits whenever you would rather we made them" and names no cap, which
     *  is looser than every other row here. Either the letter gains a number
     *  or this row loses one; two descriptions of one promise drift, and the
     *  day they disagree the client quotes whichever helps them. The number
     *  below is the house default, parked here until you rule. */
    editAllowance: "2 hours per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security patching, backups, domain renewal where we hold it, the storage behind the workroom, and the tap feed kept connected to your Untappd account. Nothing inside the site is rented from a third party, so nothing inside it can send you a separate bill.",
    editExamples:
      "a line of copy, a photo, a new page, a change to how something works. Events, dishes, prices and holiday hours are not edits at all; your staff make those themselves in the workroom, as often as they like, and none of it counts against the allowance.",

    scope: [
      "The site: home, a page each for Birmingham and Rochester Hills, the drink pages for beer, spirits, Blackgrass cider, vodka soda and zero-proof, events, story, a shop hub and contact, with titles and descriptions written per page, venue and opening-hours structured data for both taprooms, and link-preview cards.",
      "Live tap lists for both taprooms, read from your own Untappd for Business account and rendered into your pages in your type, so the boards your staff already keep are on the homepage and readable by Google instead of injected into an empty panel.",
      "A workroom of your own: one passcode-protected page where your staff post an event, change a dish or a price, or set holiday hours, from a phone, with nothing waiting on a developer. It is the answer to the maintenance problem the audit found, and it is part of the build rather than an extra.",
      "Both food menus as structured pages, 108 dishes as of 20 August 2026, open rather than behind collapsed panels, filterable, with vegetarian, vegan and kids tags and a dish-level prompt to ask staff about allergies. Birmingham's nut-free kitchen is said out loud where a parent looking for it will find it.",
      "An events calendar with your weekly programming and dated events, where a past event retires on its own. The 2021 pages and the 2023 campaign that are still live and indexed today cannot happen again by construction.",
      "Ordering that goes straight into each taproom's own page on Toast, from anywhere on the site, rather than the one fixed link the current site uses on every page including Rochester Hills.",
      "One shop hub: eat tonight, pick up today, ship it to your door, gift cards, and find it near you, in your brand and on your site, with the buy and the balance check for gift cards next to each other instead of on separate pages.",
      "A retail finder built into your own pages rather than an embedded third-party tool, showing distance from the visitor's ZIP, running on a store list you supply.",
      "Hours that know what day it is, per location, plus the whole week; and six social links including TikTok, which you run and never link, and Untappd, where 596,000 check-ins live.",
      "Two looks, both built before you decided anything: the full rebuild at /demo, and your own site rebuilt section for section at /demo-classic. You pick one. The price is the same either way, and everything above is in both.",
      "The words, adjusted with you until every page reads as yours. That pass is part of the build fee, not an edit against the monthly allowance and not billed by the hour.",
      "The code and the domain in your name from day one, and the small studio credit in the footer.",
    ],
    notIncluded:
      "product photography, which is the one thing we cannot generate and the reason the vodka soda and cider tiles are colour panels in the demo today; card checkout for shipped alcohol, which waits on the licensing and compliance question and is a separate engagement if it proceeds, so the shop hub routes to the flows you already run; the live feed from your distributor, so the finder ships on a store list you supply until that is scoped; the Untappd for Business subscription itself, which stays your account and your bill; any change to Toast, your registers or your POS; copywriting and content beyond the pages listed and the monthly edit allowance; and a second website on any other platform.",

    /** Part 3: the master has no clause for holding a client's Untappd login
     *  and read-only token, for a passcode their staff share, or for what
     *  those staff type into a workroom. */
    paymentsSummary: "the accounts the site reads, and what your staff type into it",
    paymentsTitle: "your accounts, your workroom and your staff",
    paymentsIntro:
      "The site reads a tap board you already maintain, hands ordering to a system you already run, and gives your staff a page they type into. These terms apply to that and are part of the agreement.",
    payments: [
      {
        lead: "The Untappd account stays yours.",
        text: "The tap lists come from your own Untappd for Business account over a read-only token. We hold that token only to connect the site and to change it when you ask; it lives in the hosting dashboard, never in the code, and you give it to us by phone. Revoking it on your side closes that door at any time, and the tap sections fall back to the last boards we read rather than going blank. The subscription is yours, on your bill, and if it lapses the feed stops with it.",
      },
      {
        lead: "The workroom passcode is spoken, never written down.",
        text: "One passcode signs your staff in to post events and change dishes, prices and holiday hours. We set it to whatever you choose and tell it to you by phone; it is not in a text, an email or a page. Anyone holding it can change what the site says, so treat it the way you treat a register code, and tell us whenever you want it changed.",
      },
      {
        lead: "What your staff enter is your content.",
        text: "Every event, dish, price and hour typed into the workroom is your content under Section 4(a), stored in the hosting project's storage that the monthly fee covers, and it leaves with the rest of the project under Section 4(c). We do not review it before it goes live, which is the point of you having it.",
      },
      {
        lead: "Ordering and gift cards are hand-offs, not our checkout.",
        text: "Order buttons open your own Toast pages and the gift card buttons open your own gift card pages. No card is taken on the site, no online payment fee arises, and what happens after the hand-off, including the order, the payment, the refund and the balance, is between you, your customer and that provider.",
      },
      {
        lead: "The finder shows what you give it.",
        text: "Distances are calculated from the visitor's ZIP against a list of stockists you supply, and it is shown as approximate. Retail stock moves faster than any list, so the site says so rather than promising a shelf.",
      },
      {
        lead: "Availability.",
        text: "The tap feed, the workroom and the site run on the hosting in Section 2(d), and Section 7 applies to them. Every failure of the Untappd feed is open: the page renders the last boards we read, with the time it read them, rather than an empty panel or an error.",
      },
    ],

    /** The project page, /build/griffinclaw. Same shape as MI Gas, and no
     *  try-it list for the same reason: the workroom is not wired to either
     *  demo, and the demo cart says out loud that checkout is not real, so
     *  nothing on either demo leaves a trace they could find afterwards. Add
     *  one the day a workroom exists for them. */
    project: {
      since: "2026-09-10",
      accepted: false,
      liveOnDomain: false,
      needs: [
        {
          id: "who",
          ask: "Your full name and title, the registered name of the company, and who is able to sign a vendor agreement for it.",
          why: "The first two go on the agreement and nothing else waits on them. The third is on this list because of the ownership case: a signature from one side of a 50/50 split may not bind the company, and neither of us wants to find that out after the build. One answer settles it.",
          done: false,
        },
        {
          id: "email",
          ask: "An email address you will read, and whether contact, careers and wholesale should land in one inbox or three.",
          why: "There is no address published anywhere on your site today, which is why the contact page is four forms instead. One address, routed, replaces all four.",
          done: false,
        },
        {
          id: "untappd",
          ask: "Access to the Untappd for Business account, and which plan it is on.",
          why: "It is what makes the tap lists live rather than a snapshot, and you already pay for it. The read-only token we need is on a Premium plan, so if yours is not, we would rather know now and price the alternative than promise a live board we cannot wire.",
          done: false,
        },
        {
          id: "menus",
          ask: "The current food and drink menus in any format, and a read-through of the 108 dishes we already typed in.",
          why: "They came off your site on 20 August 2026 and kitchens move. The read-through is the only part that needs a person who knows the food.",
          done: false,
        },
        {
          id: "logos",
          ask: "The original logo files, at the size they were drawn.",
          why: "Every logo and photograph on your site today is served from your vendor's image CDN rather than a domain you control. Asking for the originals now, while the relationship is good, is worth doing whoever builds the next site.",
          done: false,
        },
        {
          id: "photos",
          ask: "Product photography, and whichever vodka soda lineup shot is current.",
          why: "It is the one thing we cannot generate. We built the demos with the shot on your site today and left the cider and soda tiles as colour panels rather than invent a can. Tell us what you have and we will build around it, or we will tell you the sizes the layouts want if you would rather shoot fresh.",
          done: false,
        },
        {
          id: "toast",
          ask: "Confirmation of the two Toast ordering pages, one per taproom.",
          why: "Deep linking each taproom to its own page is a two-minute fix and one of the plainer faults in the audit. We have the links; we want you to confirm they are the ones you want people landing on.",
          done: false,
        },
        {
          id: "passcode",
          ask: "A passcode for the workroom, told to us by phone.",
          why: "It signs your staff in to post events and change dishes, prices and hours from a phone. Your events and prices themselves are not on this list; you enter those there.",
          done: false,
        },
        {
          id: "hours",
          ask: "Confirmation of the taproom hours, the two happy hour windows, and any holiday closures you already know about.",
          why: "The demos carry your published hours to the minute. Happy hour is Tuesday to Friday, 3 to 6 in Birmingham and 2 to 6 at the Clubhouse, per your menus; one line confirms both.",
          done: false,
        },
        {
          id: "stockists",
          ask: "A list of the retailers who stock you, or the contact at Indiana Beverage and your Michigan distributor who can produce one.",
          why: "The finder is built and running on a sample list. Your real list turns it on. A live distributor feed is a separate piece of work and this is what makes the page useful without it.",
          done: false,
        },
        {
          id: "domain",
          ask: "The registrar login for griffinclawbrewingcompany.com.",
          why: "Not needed until launch week, and it is the last thing that moves. Until then the site sits on our address and stays hidden from Google, because a copy of your content on our address would compete with you for your own name.",
          done: false,
        },
      ],
      steps: [
        {
          title: "Read and accept the agreement",
          detail:
            "Two documents: the plain-English terms every client gets, and an Exhibit A carrying your scope and your numbers. You type your name and both of us have the record. The build fee is invoiced half now and half at launch, or paid in one go on the same page.",
        },
        {
          title: "Pick a look",
          detail:
            "The full rebuild or your own site rebuilt. Both are live and both carry everything in Exhibit A, so this is taste rather than scope, and the price does not move either way.",
        },
        {
          title: "Content, in the order it blocks things",
          detail:
            "The list above, roughly top to bottom. The menus and the Untappd access are the two that hold up the most, and the photography is the one that decides how the pages look rather than whether they work.",
        },
        {
          title: "Build",
          detail:
            "Four to six weeks from a signed scope, and the variable is how fast the menus and photography come together on your side rather than the build itself. No dates go on this page until the content is in, because a schedule published before it lands is a promise waiting to break.",
        },
        {
          title: "The workroom, with your staff",
          detail:
            "A short walk-through with whoever will actually use it, on their own phones, before launch rather than after. The site is only as current as the people who keep it, which is the whole argument of the proposal.",
        },
        {
          title: "Launch",
          detail:
            "The domain moves, every old address redirects to its new home so nothing that is indexed today goes dead, the site becomes visible to Google, and the monthly starts from the agreement page.",
        },
      ],
      links: [
        {
          label: "The full rebuild",
          href: "https://griffinclaw.glazedweb.com/demo",
          note: "The new direction. Gold and black, the pour, the tap lists on the front page.",
        },
        {
          label: "Your site, rebuilt",
          href: "https://griffinclaw.glazedweb.com/demo-classic",
          note: "The same site you have today, section for section, with every fault in the audit fixed underneath.",
        },
        {
          label: "The proposal",
          href: "https://griffinclaw.glazedweb.com/",
          note: "What we found, what it costs, and the reasoning. It stays up.",
        },
        {
          label: "The agreement",
          href: "/agreement/griffinclaw",
          note: "The terms and your Exhibit A. Scope lives here and nowhere else.",
        },
        {
          label: "Kevin",
          href: "mailto:kevin@glazedweb.com",
          note: "One person in Marshall. You would be working with him start to finish.",
        },
      ],
      monthlyIs: [
        "The site stays up, patched, backed up and on a current certificate, and the domain renews where we hold it.",
        "The workroom keeps working, and so does the connection to your Untappd account, so the boards on your site stay the boards your staff keep.",
        "Edits you would rather we made, and a person in Michigan who answers when something looks wrong.",
      ],
    },
  },

  sprinkles: {
    slug: "sprinkles",
    client: "Sprinkles & Sparkles BB",
    /** TODO Kevin: as registered. Nothing on her site or her Shopify names an
     *  entity; the sole-proprietorship guess is the same one Chism carries. */
    clientLegal: "Sprinkles & Sparkles BB",
    contactName: "Brittany Bennett",
    contactTitle: "Owner",
    email: "sprinklesandsparklesbb@gmail.com",
    town: "Marshall, Michigan",
    /** Her live domain drops the ampersand and the "and". Kevin's call, on
     *  file in glaze/clients/sprinkles.md: leave the spelling alone. */
    domain: "sprinklessparklesbb.com",
    exhibit: "Exhibit A: Sprinkles & Sparkles BB, prepared 2026-09-11",
    /** A spec build at sprinkles.glazedweb.com/demo. The live site is a
     *  Shopify Dawn store. */
    live: false,
    pitchUrl: "https://sprinkles.glazedweb.com/",

    /** Kevin, 2026-09-03: an old friend-price pitch that predates the menu,
     *  the same bracket as Chism. */
    buildFee: 500,
    buildFeePaid: false,
    monthly: 50,
    /** Same house guess as Chism's $50 order: one hour suits a monthly whose
     *  recurring edits are a new shade, a new tutorial and workshop dates.
     *  The letter's price box says "Send a text" and names no cap; this row
     *  gives it one. Confirm. */
    editAllowance: "1 hour per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security updates, backups, domain renewal where we hold it, and the shop kept connected to your Stripe account. Nothing inside the site is rented from a third party, so nothing inside it can send you a separate bill.",
    editExamples:
      "a new sugar shade or tutorial added to the shop, a price, workshop dates, a photo, a line of copy.",

    scope: [
      "The site: home, shop, a page for every product, the bag, checkout, the order confirmation page, and the workshops, retailers, about and list sections of the homepage, with a title and description written per page and a link-preview card in your own colors.",
      "The shop, off Shopify and on your own site: the six products you sell today at your current prices, one bag, and checkout on a page hosted by Stripe, described in part 3. Tutorials, the preset and the label appear on the confirmation page the moment a payment clears and go out again by email, and a download link only works for an order that paid for it.",
      "The sugar shelf: all ten Sparkling Sanding Sugar shades, a page each, priced and shipping from Michigan, if you want to sell them direct. If your retailer agreements keep direct sales off the table, the shelf comes out and the ten shades stay as a page. Your call, made once, before launch.",
      "Your six retailers, with what each one carries, on the homepage and in their own section.",
      "Workshops on the site: a section of their own, a button that puts people on your list for dates, and one that emails you to host a class.",
      "The list: a signup on the homepage that emails you each address. The addresses are yours, exportable any time.",
      "Redirects from every product, collection and page address on your Shopify store to its new home, so nothing Google or Pinterest has indexed goes dead when the domain moves.",
      "The words, adjusted with you until every page reads as yours. That pass is part of the build fee, not an edit against the monthly allowance.",
      "The code and the domain in your name from day one, and the small studio credit in the footer, which on your site reads “Double Dipped by”.",
    ],
    notIncluded:
      "photography, which is yours and already good; the tutorial, preset and label files themselves, which you supply; your Stripe account, its fees and its payout schedule, which are yours (part 3); closing your Shopify plan, which you do on your side once the new shop is live; the sending of email campaigns to the list, which is a separate tool if you ever want one; your arrangements with the six retailers; copywriting and content beyond the pages listed and the monthly edit allowance; and a second website or store on any other platform.",

    /** Part 3: the master has no clause for a shop on the client's own Stripe
     *  account, for digital goods delivered by a link, or for the files that
     *  link points at. */
    paymentsSummary: "how the shop, the downloads and the payments work",
    paymentsTitle: "the shop, the downloads and your Stripe account",
    paymentsIntro:
      "The site sells your tutorials, downloads, sheets and (if you choose) sugars, takes the card on a checkout page hosted by Stripe, and delivers digital products by link. These terms apply to that and are part of the agreement.",
    payments: [
      {
        lead: "Your Stripe account.",
        text: "You own your own account with Stripe, the card processor. The site creates each checkout on that account using a key you set in the hosting project, and every payment settles to the bank account you designate, on Stripe’s schedule. glazedweb holds no money, takes no fee from any sale, and is not a party to any sale. Stripe’s processing fees are set by Stripe, shown in your Stripe account, and are your cost. You are responsible for Stripe’s terms and for the tax and reporting on your own sales.",
      },
      {
        lead: "Prices, shipping and refunds are your terms.",
        text: "Every price, the shipping rate, the free-shipping threshold and whether a download can be refunded are yours, set by you and entered by us at your direction. Where the demo carries a stand-in price it says so, and nothing goes live with one. Your refund and shipping policies are stated on the site as you direct.",
      },
      {
        lead: "Downloads are delivered by link, and the files are yours.",
        text: "A digital product is delivered as a link on the confirmation page and in the buyer’s email, and the link serves the file only for an order Stripe records as paid. The files themselves are yours: you supply them, they live where you choose, and the site points at them. If a file is missing the buyer is told it will be emailed rather than shown a broken button, and it is your responsibility to send it. Whether a buyer may share a file is your policy, stated on the site as you direct.",
      },
      {
        lead: "Order emails and the list.",
        text: "Every paid order emails the buyer their receipt and links and emails you the order, and every list signup emails you the address. Until you have a mailbox on your own domain those emails are sent from an address we control, with replies routed to your email. Your customers’ names, addresses and emails are your content under Section 4(a).",
      },
      {
        lead: "When checkout is degraded.",
        text: "If the Stripe key is missing or Stripe declines the request, the shop says plainly that checkout is not connected rather than pretending. You set the key and keep it current, and we will help.",
      },
      {
        lead: "Card data and responsibility.",
        text: "Card numbers are never entered on or stored by the site; the card is entered on Stripe’s pages. The shop runs on Stripe, on the email service, and on the hosting the monthly fee covers, and Section 7 applies to it. glazedweb is not responsible for a lost package, a chargeback, a refund, or an order lost to a failed or misdirected email or payment. If we ever part ways we hand over the whole project under Section 4(c), and your Stripe account, its history and its payouts remain yours.",
      },
    ],

    /** The project page, /build/sprinkles. No try-it list: her Stripe key is
     *  not in the hosting project, so the demo's checkout answers "not
     *  connected yet" and nothing on it leaves a trace she could find
     *  afterwards. Add one the day her test key is in and a $0.50 test order
     *  lands in her Stripe dashboard. */
    project: {
      since: "2026-09-11",
      accepted: false,
      liveOnDomain: false,
      needs: [
        {
          id: "who",
          ask: "Your full name as it should appear, and the registered name of the business, or that it is you trading as Sprinkles & Sparkles BB.",
          why: "They go on the agreement and nothing else waits on them.",
          done: false,
        },
        {
          id: "stripe",
          ask: "Your Stripe login, or ten minutes on a call to open one.",
          why: "It is the account the money lands in. Shopify Payments stays behind with Shopify; Stripe charges the same 2.9% and 30 cents a sale, and the key goes in the hosting project, never in the code.",
          done: false,
        },
        {
          id: "files",
          ask: "The five files people buy: the cake pop tutorial, the bar mold tutorial, the Lightroom preset, the Instagram guide and the dumpling label.",
          why: "Until they are in, a paid order says “emailed to you shortly” instead of showing a download button. Send them however you like; we will put them where the links point.",
          done: false,
        },
        {
          id: "sugar",
          ask: "The sugar decision: sell it direct from your own site, or leave it with the retailers. If direct, the price of a jar and what it costs to ship.",
          why: "The shelf is built and every price on it is a stand-in. This is the one question in the proposal only you can answer, and nothing goes live with a placeholder on it.",
          done: false,
        },
        {
          id: "prices",
          ask: "A read-through of the six prices we carried over from your Shopify.",
          why: "They were checked against your store on 3 September 2026. One look from you and they are yours rather than ours.",
          done: false,
        },
        {
          id: "logo",
          ask: "Your logo file, at the size it was drawn.",
          why: "The demo sets your name in type because the only logo we could reach is the small black script on your Shopify. The original, if there is one, goes on the site and on the link card.",
          done: false,
        },
        {
          id: "workshops",
          ask: "Any workshop or pop-up dates you already know about, and where people should write to book you.",
          why: "The section is built and pointing at your email. Dates make it real; without them it says dates go to the list first, which is also true.",
          done: false,
        },
        {
          id: "domain",
          ask: "The login for wherever sprinklessparklesbb.com is registered, which may be Shopify itself.",
          why: "Not needed until launch week, and it is the last thing that moves. If Shopify holds the domain we transfer it to your name first, because the plan cannot close while it does.",
          done: false,
        },
      ],
      steps: [
        {
          title: "Read and accept the agreement",
          detail:
            "Two documents: the plain-English terms every client gets, and an Exhibit A carrying your scope and your numbers. You type your name and both of us have the record. The build fee is half now and half at launch, or all of it in one go, on the same page.",
        },
        {
          title: "Content, in the order it blocks things",
          detail:
            "The list above, top to bottom. The Stripe account and the five files are the two that decide whether the shop works on day one; the sugar decision decides what is on the shelf.",
        },
        {
          title: "Connect the shop and place a test order",
          detail:
            "Your Stripe test key goes in, we buy a tutorial with the test card, and you watch the order land in your Stripe dashboard, the download arrive, and the order email reach you. Then the live key replaces it.",
        },
        {
          title: "Launch",
          detail:
            "About two weeks from a signed scope, most of it waiting on the list above. The domain moves, every Shopify address redirects to its new home, the site becomes visible to Google, and the monthly starts from the agreement page. Your Shopify store stays up until that moment, so there is never a day without a shop, and you close the plan afterwards.",
        },
      ],
      links: [
        {
          label: "The site",
          href: "https://sprinkles.glazedweb.com/demo",
          note: "Built and live. Open it on your phone.",
        },
        {
          label: "The proposal",
          href: "https://sprinkles.glazedweb.com/",
          note: "What we found, what it costs, and the reasoning. It stays up.",
        },
      ],
      monthlyIs: [
        "The site stays up, patched, backed up and on a current certificate, and the domain renews where we hold it.",
        "The shop stays connected to your Stripe account, and the order and signup emails keep arriving.",
        "Edits you would rather we made, and a person in Marshall who answers when something looks wrong.",
      ],
    },
  },
  mikesplace: {
    slug: "mikesplace",
    client: "Mike’s Place",
    /** TODO Kevin: the registered entity. Nothing public names one; the Facebook
     *  page says "Mike's Place" and the email is mikesplace116@yahoo.com. */
    clientLegal: "Mike’s Place",
    /** TODO Kevin: the owner's name. A 2016 Tripadvisor review mentions meeting
     *  "the owner and his parents" and names nobody. Ask at the bar. */
    contactName: "",
    contactTitle: "Owner",
    email: "mikesplace116@yahoo.com",
    town: "Marshall, Michigan",
    /** PLACEHOLDER until registered: available at $11.25/yr on 2026-09-11 (Vercel
     *  registrar check). Registered in THEIR name on signing, per the letter. */
    domain: "mikesplacemarshall.com",
    exhibit: "Exhibit A: Mike’s Place, prepared 2026-09-11",
    /** A pitch. The demo is not built yet; the letter points at
     *  mikesplace.glazedweb.com/demo and the repo README says not to send until
     *  that answers. */
    live: false,
    /** The mark in the corner of the agreement and build pages goes back to the
     *  proposal, never the studio home (Kevin, 9 Sep 2026). */
    pitchUrl: "https://mikesplace.glazedweb.com/",

    /** The published Baker's Dozen: $2,000 build, $150 a month, ordering built in. */
    buildFee: 2000,
    buildFeePaid: false,
    monthly: 150,
    editAllowance: "2 hours per month",
    hourlyRate: 125,
    monthlyCovers:
      "Hosting, SSL, security updates, backups, the domain renewal, and the workroom where you post specials and change prices yourself.",
    editExamples:
      "prices, hours, a photo, a line of copy, a holiday closure. A special is not an edit; you post those yourself in the workroom, as often as you like.",

    scope: [
      "The site: home, menu, order ahead, specials, contact, about, on mikesplacemarshall.com, registered in your name the day you sign.",
      "Hours in one place: bar hours and kitchen hours, a live open-or-closed badge computed from the clock, and holiday closures set once and shown everywhere.",
      "The menu, typed from your printed menu at the prices you set, readable by search engines as a menu.",
      "Order-ahead pickup, built and switched off until you want it. The guest picks from the menu, pays, and gets a pickup time; the ticket appears on a passcode-protected kitchen screen behind the bar with a one-tap accept and an 86 button. Turning it on for pay-at-the-bar is included. Card payment on the site runs on your own processor account and is scoped with you before it goes live: your card rate stays whatever that processor charges you, and the only thing added is a flat 99¢ order fee at checkout, paid by the customer and named before they pay.",
      "A specials board you update from a phone in the workroom: tonight’s special, the Keno night, the game on the TVs. It shows on the homepage.",
      "The contact page: map, tap to call, tap to email, the rear entrance and the parking behind the building.",
      "Listings: Yelp claimed with you, the Website field on Tripadvisor and Bing repointed at your domain, a pass over your Google Business Profile, and a bar-and-grill business record with hours, address and menu in the form search engines read.",
      "The small studio credit in the footer, which on your site reads “Double Dipped by”.",
    ],
    notIncluded:
      "photography; copywriting beyond the pages listed; online card processing, which runs on your own processor account at that processor’s rates and is scoped separately before it is switched on; point of sale or in-store hardware; delivery of any kind; printed materials; and a second website on any other platform.",

    /**
     * Part 3: online ordering and the order fee. The True North terms (Kevin,
     * 9 Sep 2026), rail-neutral because nobody has asked which register Mike's
     * rings. Stripe is the studio default; Square only if we place the POS
     * (payments memory). The clause names "your processor" so it is true either
     * way and gets pinned to one name when the register is known.
     */
    moreTerms: [
      {
        title: "online ordering and the order fee",
        summary: "how online ordering and its fee work",
        intro:
          "The site can take pickup orders paid in advance by card, on a payment processor account in your name. These terms apply to that service from the day it is switched on, whether that is launch day or later, and are part of the agreement.",
        items: [
          {
            lead: "Your processor account, your money.",
            text: "Orders placed on the website are paid through your own processor account and settle to the bank account you designate, on the processor’s schedule, exactly like a sale at the register. glazedweb holds none of the money from a sale, takes no percentage of any ticket, and is not a party to the sale of anything you make. Your card processing rate is whatever the processor charges you, shown in your own account, and is your cost, unchanged by us.",
          },
          {
            lead: "The order fee.",
            text: "A flat order fee of 99¢ is added at checkout to each order placed through the website, shown as its own line and named before the customer pays. The customer pays it; it is never deducted from your proceeds. It is collected by glazedweb as an application fee on that payment through our developer connection to your processor, and it is glazedweb’s revenue, covering the ordering service. It applies only to orders placed through the website. A phone order, a walk-up, and anything rung at the bar carry no fee, because none of them came through the site.",
          },
          {
            lead: "Tax and reporting.",
            text: "Sales tax on website orders is calculated and collected on your processor account under your own tax settings, on the items and, where Michigan requires it, on the order fee. You remain responsible for the tax and the reporting on your own sales, as you are for every register sale; glazedweb is responsible for the tax on its own fee revenue.",
          },
          {
            lead: "What the service is, and is not.",
            text: "Pickup only, paid in advance, on the menu you publish, inside the hours you set for the kitchen. Turning it on for pay-at-the-bar is included in the build. Connecting your processor account for card payment is scoped with you before it is switched on; nothing takes a card until you have said so and seen it work. Whether a pickup can be changed or refunded is your policy, stated on the site as you direct, and honored by you at the bar.",
          },
          {
            lead: "Records, card data, and responsibility.",
            text: "Order records and customer contact details are your content under Section 4(a). Card numbers are never entered on or stored by the site; the card is entered on the processor’s form. If we part ways, your order history is already in your processor account and stays there with the rest of the project under Section 4(c). Section 7 applies to the ordering service as it does to the site: glazedweb is not responsible for a missed pickup, a wrong order, a refund, or an order lost to a failed or declined payment.",
          },
        ],
      },
    ],

    /**
     * THE BUILD PAGE, /build/mikesplace (glaze/launch-page.md). Never restates
     * scope; that is Exhibit A above. `needs` boxes are OURS to tick.
     */
    project: {
      since: "2026-09-11",
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
          id: "menu",
          ask: "The printed menu, with today’s prices.",
          why: "A photo of it is enough. Every price on the demo is a marked placeholder, because the only menu of yours on the internet is a scraper’s list and we will not copy it.",
          done: false,
        },
        {
          id: "hours",
          ask: "Confirm the bar hours, and tell us the kitchen hours.",
          why: "We have 11 AM to 2 AM Monday through Saturday and noon to 2 AM Sunday, read off Yelp and Tripadvisor rather than from you. Nobody anywhere publishes when the kitchen stops, and that is the most useful line on the whole site.",
          done: false,
        },
        {
          id: "inbox",
          ask: "The inbox the contact form should land in, and who reads it.",
          why: "Your Facebook page lists mikesplace116@yahoo.com. If a person opens that, it is the answer. If not, tell us which one a person opens.",
          done: false,
        },
        {
          id: "register",
          ask: "Which register you ring: Square, Toast, Clover, something else.",
          why: "It decides which processor the order-ahead payments run on. Nothing about your register changes; we only need to know its name.",
          done: false,
        },
        {
          id: "photos",
          ask: "Whatever photos exist: the room, the bar, the burgers, the patio.",
          why: "The demo uses the ones on your Facebook page at the sizes Facebook serves them. Originals look better and they are yours to give.",
          done: false,
        },
        {
          id: "specials",
          ask: "Who at the bar will post the specials, and a phone number for them.",
          why: "The workroom passcode is spoken to that person, never written down. Thirty seconds a day from a phone is the whole job.",
          done: false,
        },
        {
          id: "facebook",
          ask: "Who holds the Facebook login.",
          why: "We do not need it. You do, and it should be more than one person, so the page is never on vacation with somebody.",
          done: false,
        },
        {
          id: "domain",
          ask: "A registrar login in your name, or permission to make one for you.",
          why: "mikesplacemarshall.com gets registered the day you sign, in your name, not ours. Ten minutes and $11.25 a year.",
          done: false,
        },
      ],
      steps: [
        {
          title: "You sign.",
          detail: "The agreement page. The build fee is invoiced, half now and half at launch, or paid in one go on the same page.",
        },
        {
          title: "The domain is registered.",
          detail: "Same day, in your name. It is the one piece of this nobody can rent back to you.",
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
          title: "Live on mikesplacemarshall.com.",
          detail: "The site is deliberately hidden from Google today, because a copy of your bar on our address would compete with you for your own name. That comes off on launch day and not before.",
        },
        {
          title: "Listings repointed.",
          detail: "Yelp claimed with you, Tripadvisor and Bing pointed at your domain, the Google Business Profile pass. The same week.",
        },
        {
          title: "Ordering, when you want it.",
          detail: "Separately, and not on launch day. Pay-at-the-bar first if you like, card payment once your processor is connected and you have watched a test order land on the kitchen screen.",
        },
      ],
      freebies: [
        {
          lead: "Claiming Yelp.",
          text: "Free, ten minutes, done with you at the bar whether or not you buy anything else. It is the page that scores you lowest and the only one you cannot answer on.",
        },
        {
          lead: "The mikesplace.com problem.",
          text: "Menus With Price tells people your official website is a domain that is for sale. There is nobody to write to there; the fix is a real website for it to find. Once yours is live we check that the listing has followed, and chase it if it has not.",
        },
      ],
      links: [
        { label: "The proposal", href: "https://mikesplace.glazedweb.com/", note: "What we found, what it costs, and the reasoning. It stays up." },
        { label: "The site", href: "https://mikesplace.glazedweb.com/demo", note: "Where it lives until it is on your domain." },
      ],
      monthlyIs: [
        "Send a text, get an edit. Prices, hours, a photo, a holiday closure.",
        "Specials are not an edit. You post those yourself, from a phone, as often as you like.",
        "Hosting, security, backups, the domain, and a person four doors down who answers when something looks wrong.",
      ],
    },
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
