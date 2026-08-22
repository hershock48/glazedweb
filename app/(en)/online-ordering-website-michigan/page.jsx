import ServicePage, { serviceSchema } from "@/components/ServicePage";

export const metadata = {
  title: "Online Ordering Websites for Michigan Restaurants | glazedweb",
  description:
    "Online ordering built into your own website — no third-party app taking a cut of every order. Custom-built for Michigan restaurants, pizzerias, and food trucks by glazedweb.",
  alternates: { canonical: "/online-ordering-website-michigan" },
  openGraph: {
    title: "Online Ordering Websites for Michigan Restaurants | glazedweb",
    description:
      "Online ordering built into your own website — no third-party app taking a cut of every order. Custom-built for Michigan restaurants.",
    type: "website",
    url: "https://www.glazedweb.com/online-ordering-website-michigan",
  },
};

const schema = serviceSchema({
  name: "Online Ordering Website Development",
  description:
    "Online ordering websites for Michigan restaurants: order-ahead and pickup ordering built directly into the restaurant's own website, with no per-order commission to a third-party app.",
  url: "https://www.glazedweb.com/online-ordering-website-michigan",
});

export default function OnlineOrderingMI() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServicePage
        kicker="Online ordering · Michigan"
        title="Online ordering websites for Michigan restaurants."
        lead="Order-ahead and pickup ordering built into your own website — on your domain, in your brand, with no app between you and your customers taking a bite of every ticket."
        highlights={[
          { title: "No per-order cut", body: "The order goes from your customer to your kitchen. Nobody skims it." },
          { title: "Your site, your brand", body: "Ordering lives on your domain, styled like your place." },
          { title: "Kitchen-ready", body: "Orders arrive where you work — screen or printer, your call." },
        ]}
        related={[
          { href: "/restaurant-website-design-michigan", label: "restaurant website design" },
          { href: "/small-business-web-design-michigan", label: "small business web design" },
        ]}
      >
        <h2>The math on third-party ordering apps</h2>
        <p>
          The big ordering apps charge commission on every order that runs through them — on food you cooked, for a
          customer who was already yours. A restaurant doing steady pickup volume hands over thousands a year for a
          form. The alternative isn&apos;t going without online ordering; it&apos;s owning it. We build the ordering
          into your website, so the money stays on your side of the counter.
        </p>

        <h2>How it works</h2>
        <p>
          Your menu becomes an order builder on your own site: customers pick their items, see the total assemble, and
          send the order in. It lands in your kitchen the way your kitchen works — on a screen by the line or straight
          to a printer. You control the menu, the prices, the hours ordering is open, and when the kitchen is slammed,
          you can pause it. No tablet farm on the counter, no separate system to log into, no commission taken off the
          top.
        </p>

        <h2>Who this is for</h2>
        <p>
          Pizzerias, sandwich shops, food trucks, coffee shops, bakeries — any Michigan food business where people call
          ahead or line up. If your phone rings all lunch with read-back orders, this replaces the read-backs. If a
          delivery app is your only online ordering, this gives your regulars a way to order that doesn&apos;t cost you
          a percentage.
        </p>

        <h2>What it costs</h2>
        <p>
          Ordering ships as part of a full glazedweb build — it&apos;s one of the things baked into the $1,900 package
          on the menu, alongside the site itself, your Google setup, and a monthly that covers hosting and edits. No
          per-order fees from us, ever; the whole point is that nobody stands between your customer and your kitchen.
          We&apos;re a small-batch studio in Marshall, Michigan, and we build this for restaurants across the state.
        </p>
      </ServicePage>
    </>
  );
}
