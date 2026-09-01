import ServicePage, { serviceSchema } from "@/components/ServicePage";

// The third exact-match service page, and the one that speaks to the studio's
// forward focus (glaze/standards.md, "Who the menu is for now"): the register
// as the brain, the site wired into it. Same shell and playbook as the other
// two: one service and one state in the title, H1, and URL.
//
// The fee sentence follows the standing public wording ruled 2026-09-01 (also
// in standards.md): no percentage commission, a flat 99¢ order fee added at
// checkout, paid by the customer and named plainly. Never "we never charge
// per order."
export const metadata = {
  title: "Restaurant POS Integration in Michigan | glazedweb",
  description:
    "Your website wired into the register you already ring on: orders from your site land in your POS, menus stay in sync, and every sale sits in one ledger. Square integration for Michigan restaurants by glazedweb.",
  alternates: { canonical: "/restaurant-pos-integration-michigan" },
  openGraph: {
    title: "Restaurant POS Integration in Michigan | glazedweb",
    description:
      "Your website wired into the register you already ring on: online orders in your POS, menus in sync, one ledger.",
    type: "website",
    url: "https://www.glazedweb.com/restaurant-pos-integration-michigan",
  },
};

const schema = serviceSchema({
  name: "Restaurant POS Integration",
  description:
    "POS integration for restaurant websites: online orders delivered into the restaurant's own register, menu and price sync from the POS to the site, and one ledger for counter and online sales.",
  url: "https://www.glazedweb.com/restaurant-pos-integration-michigan",
});

export default function RestaurantPosIntegrationMI() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServicePage
        kicker="POS integration"
        title="Restaurant POS integration in Michigan."
        lead="Your website and your register, working one counter. Orders from your site land in the system you already ring on, menus stay in sync, and every sale sits in one ledger."
        highlights={[
          { title: "One ledger", body: "Counter sales and online orders land in the same register. Nothing is counted twice." },
          { title: "Menu synced", body: "Your items live in the register and flow to the site. Change a price once." },
          { title: "Orders where you work", body: "A screen by the line or a printer. Online orders arrive like any other ticket." },
        ]}
        related={[
          { href: "/online-ordering-website-michigan", label: "online ordering websites" },
          { href: "/restaurant-website-design-michigan", label: "restaurant website design" },
        ]}
      >
        <h2>The register is the brain</h2>
        <p>
          Most restaurant software treats the website and the POS as strangers: a menu typed twice, an ordering
          tablet on its own shelf, totals reconciled by hand at close. We wire them together instead. The register
          stays the source of truth for items and prices, the website sells from it, and an order placed online
          shows up beside the walk-in tickets. No retyping, no second tablet, no ledger that almost matches.
        </p>

        <h2>Square first, honest about the rest</h2>
        <p>
          Square is the register we integrate deepest, through Square&apos;s own APIs on your own account: your
          catalog syncs to the site, online orders and payments land in your Square, and counter and online share
          one ledger from the first day. Some other registers are closed to outside software. If you ring on one of
          those, we tell you plainly what is possible with yours before anything is promised, and build the honest
          version rather than a workaround that breaks on a Friday night.
        </p>

        <h2>What it looks like in service</h2>
        <p>
          A customer orders on your site. The ticket prints or lands on the kitchen screen with everything else,
          priced from the same menu the counter uses. When the line is slammed you can pause online ordering, and
          when a price changes you change it once, in the register, and the website follows. At close, the totals
          are already in the system you reconcile every night.
        </p>

        <h2>What it costs</h2>
        <p>
          Integration is scoped with your build and priced before any work starts, because every counter is a
          little different. On the orders themselves there is no percentage commission: a flat 99¢ order fee is
          added at checkout, paid by your customer and shown plainly before they pay. The menu price of everything
          you sell reaches you whole.
        </p>
      </ServicePage>
    </>
  );
}
