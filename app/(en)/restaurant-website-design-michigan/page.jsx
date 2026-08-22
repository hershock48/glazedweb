import ServicePage, { serviceSchema } from "@/components/ServicePage";

export const metadata = {
  title: "Restaurant Website Design in Michigan | glazedweb",
  description:
    "Custom restaurant website design for Michigan restaurants, food trucks, and breweries from $750, live in 2 weeks. Menus, hours, and online ordering built in — never a template.",
  alternates: { canonical: "/restaurant-website-design-michigan" },
  openGraph: {
    title: "Restaurant Website Design in Michigan | glazedweb",
    description:
      "Custom restaurant website design for Michigan restaurants, food trucks, and breweries from $750, live in 2 weeks.",
    type: "website",
    url: "https://www.glazedweb.com/restaurant-website-design-michigan",
  },
};

const schema = serviceSchema({
  name: "Restaurant Website Design",
  description:
    "Custom restaurant website design for Michigan restaurants, food trucks, breweries, and cafés: menus, hours, photos, and online ordering, hand-built and live in about two weeks.",
  url: "https://www.glazedweb.com/restaurant-website-design-michigan",
});

export default function RestaurantWebDesignMI() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServicePage
        kicker="Restaurant website design · Michigan"
        title="Restaurant website design in Michigan."
        lead="Hand-built websites for Michigan restaurants, food trucks, breweries, and cafés. Your menu, your hours, your photos — live in about two weeks, never from a template."
        highlights={[
          { title: "From $750", body: "One build price, one small monthly. No surprise invoices, ever." },
          { title: "Live in ~2 weeks", body: "Menu, hours, map, and photos, done right and found on Google." },
          { title: "You own everything", body: "Code, content, domain, and accounts — yours, with no lock-in." },
        ]}
        related={[
          { href: "/online-ordering-website-michigan", label: "online ordering websites" },
          { href: "/small-business-web-design-michigan", label: "small business web design" },
        ]}
      >
        <h2>A restaurant website has one job</h2>
        <p>
          Somebody is hungry, they search your name or &quot;food near me,&quot; and in about eight seconds they decide.
          Your website&apos;s job is to win those eight seconds: the menu one tap away, tonight&apos;s hours correct,
          photos that look like the food actually looks, and a phone number that dials when a thumb hits it. That is
          what we build — a fast, mobile-first restaurant website where nothing gets between a hungry person and your
          door.
        </p>

        <h2>What&apos;s in a glazedweb restaurant site</h2>
        <p>
          A menu that&apos;s real text, not a blurry PDF, so Google reads it and phones render it. Hours that are easy
          for you to change the week a holiday moves them. A map, tap-to-call, and the links to wherever your customers
          already are. If you take orders — pickup, delivery, catering — we build the ordering in rather than renting it
          from an app that takes a cut of every ticket. And it looks like your place, because we design it from your
          room, your food, and your name, never from a theme with a stock photo of somebody else&apos;s pasta.
        </p>

        <h2>Built in Michigan, for Michigan</h2>
        <p>
          glazedweb is a small-batch web studio in Marshall, Michigan. We build for restaurants, food trucks, breweries,
          bakeries, and the shops around them across the whole state — from Detroit to Grand Rapids to the U.P. You talk
          to the person who builds your site, you watch it come together on a live link, and it ships in about two
          weeks, not six months.
        </p>

        <h2>What it costs</h2>
        <p>
          A one-page restaurant site starts at $750 with a small monthly that covers hosting, security, and edits —
          when your prices change, send them over and they&apos;re updated. A full site with online ordering, galleries,
          and catering pages is $1,900. Both are on the menu with everything they include, and both come with the same
          promise: you own the code, the content, and every account. No lock-in, no hostage-taking.
        </p>
      </ServicePage>
    </>
  );
}
