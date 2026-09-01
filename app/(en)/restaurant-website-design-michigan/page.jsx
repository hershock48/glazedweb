import ServicePage, { serviceSchema } from "@/components/ServicePage";
import { PRICING, usd } from "@/lib/pricing";

export const metadata = {
  title: "Restaurant Website Design in Michigan | glazedweb",
  description: `Custom restaurant website design for Michigan restaurants, food trucks, and breweries from ${usd(PRICING.us.original.build)}, live in 2 weeks. Menus, hours, and online ordering built in, never from a template.`,
  alternates: { canonical: "/restaurant-website-design-michigan" },
  openGraph: {
    title: "Restaurant Website Design in Michigan | glazedweb",
    description: `Custom restaurant website design for Michigan restaurants, food trucks, and breweries from ${usd(PRICING.us.original.build)}, live in 2 weeks.`,
    type: "website",
    url: "https://www.glazedweb.com/restaurant-website-design-michigan",
  },
};

const schema = serviceSchema({
  name: "Restaurant Website Design",
  description:
    "Custom restaurant website design for restaurants, food trucks, breweries, and cafés: menus, hours, photos, and online ordering, hand-built and live in about two weeks.",
  url: "https://www.glazedweb.com/restaurant-website-design-michigan",
});

export default function RestaurantWebDesignMI() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServicePage
        kicker="For restaurants"
        title="Restaurant website design in Michigan."
        lead="Hand-built websites for restaurants, food trucks, breweries, and cafés. Your menu, your hours, your photos, live in about two weeks."
        highlights={[
          { title: `From ${usd(PRICING.us.original.build)}`, body: "One build price, one small monthly. No surprise invoices, ever." },
          { title: "Live in ~2 weeks", body: "Menu, hours, map, and photos, done right and found on Google." },
          { title: "You own everything", body: "Code, content, domain, and accounts, with no lock-in." },
        ]}
        related={[
          { href: "/online-ordering-website-michigan", label: "online ordering websites" },
          { href: "/small-business-web-design-michigan", label: "small business web design" },
        ]}
      >
        <h2>A restaurant website has one job</h2>
        <p>
          Somebody is hungry, they search your name or &quot;food near me,&quot; and in about eight seconds they
          decide. Your website&apos;s job is to win those eight seconds: the menu one tap away, tonight&apos;s hours
          correct, photos that look like the food, and a phone number that dials when a thumb hits it. We build fast,
          mobile-first sites where nothing gets between a hungry person and your door.
        </p>

        <h2>What&apos;s in the build</h2>
        <p>
          A menu that is real text, not a blurry PDF, so Google reads it and phones render it well. Hours that are
          easy to change the week a holiday moves them. A map, tap-to-call, and links to wherever your customers
          already are. If you take orders for pickup, delivery, or catering, we build the ordering into the site
          itself, with no percentage commission. And it looks like your place, because we design from your room, your
          food, and your name.
        </p>

        <h2>Baked in Marshall, serving the whole state</h2>
        <p>
          glazedweb is a small-batch web studio in Marshall. We build for restaurants, breweries, bakeries, and the
          shops around them across the whole state, from Detroit to Grand Rapids to the U.P. You talk to the person
          building your site, you watch it come together on a live link, and it ships in about two weeks.
        </p>

        <h2>What it costs</h2>
        <p>
          A one-page site starts at {usd(PRICING.us.original.build)} with a small monthly that covers hosting,
          security, and edits. When your prices change, send them over and they are updated. A full site with online
          ordering, galleries, and catering pages is {usd(PRICING.us.dozen.build)}. Both are on the menu with
          everything they include, and both come with the same promise: you own the code, the content, and every
          account.
        </p>
      </ServicePage>
    </>
  );
}
