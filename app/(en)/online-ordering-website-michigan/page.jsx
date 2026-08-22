import ServicePage, { serviceSchema } from "@/components/ServicePage";
import { PRICING, usd } from "@/lib/pricing";

export const metadata = {
  title: "Online Ordering Websites for Michigan Restaurants | glazedweb",
  description:
    "Online ordering built into your own website, with no third-party app taking a cut of every order. Custom-built for Michigan restaurants, pizzerias, and food trucks by glazedweb.",
  alternates: { canonical: "/online-ordering-website-michigan" },
  openGraph: {
    title: "Online Ordering Websites for Michigan Restaurants | glazedweb",
    description:
      "Online ordering built into your own website, with no third-party app taking a cut of every order. Custom-built for Michigan restaurants.",
    type: "website",
    url: "https://www.glazedweb.com/online-ordering-website-michigan",
  },
};

const schema = serviceSchema({
  name: "Online Ordering Website Development",
  description:
    "Online ordering websites for restaurants: order-ahead and pickup ordering built directly into the restaurant's own website, with no per-order commission to a third-party app.",
  url: "https://www.glazedweb.com/online-ordering-website-michigan",
});

export default function OnlineOrderingMI() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServicePage
        kicker="Online ordering"
        title="Online ordering websites for Michigan restaurants."
        lead="Order-ahead and pickup ordering built into your own website, on your domain, in your brand. No app between you and your customers taking a bite of every ticket."
        highlights={[
          { title: "No per-order cut", body: "The order goes from your customer to your kitchen. Nobody skims it." },
          { title: "Your site, your brand", body: "Ordering lives on your domain, styled like your place." },
          { title: "Kitchen-ready", body: "Orders arrive where you work, on a screen or a printer. Your call." },
        ]}
        related={[
          { href: "/restaurant-website-design-michigan", label: "restaurant website design" },
          { href: "/small-business-web-design-michigan", label: "small business web design" },
        ]}
      >
        <h2>The math on ordering apps</h2>
        <p>
          The big ordering apps charge commission on every order that runs through them, on food you cooked, for a
          customer who was already yours. A restaurant doing steady pickup volume hands over thousands a year for a
          form. We build the ordering into your website instead, so the money stays on your side of the counter.
        </p>

        <h2>How it works</h2>
        <p>
          Your menu becomes an order builder on your own site: customers pick their items, see the total assemble,
          and send the order in. It lands in your kitchen the way your kitchen works, on a screen by the line or
          straight to a printer. You control the menu, the prices, and the hours ordering is open, and when the
          kitchen is slammed you can pause it.
        </p>

        <h2>Who this is for</h2>
        <p>
          Pizzerias, sandwich shops, food trucks, coffee shops, bakeries, any Michigan food business where people
          call ahead or line up. If your phone rings all lunch with read-back orders, this replaces the read-backs.
          If a delivery app is your only online ordering, this gives your regulars a way to order that costs you
          nothing per ticket.
        </p>

        <h2>What it costs</h2>
        <p>
          Ordering ships as part of a full glazedweb build. It is one of the things baked into the{" "}
          {usd(PRICING.us.dozen.build)} package on the menu, alongside the site itself, your Google setup, and a
          monthly that covers hosting and edits. We never charge per order; the whole point is that nobody stands
          between your customer and your kitchen. We are a small-batch studio in Marshall, and we build this for
          restaurants across the state.
        </p>
      </ServicePage>
    </>
  );
}
