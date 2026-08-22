import ServicePage, { serviceSchema } from "@/components/ServicePage";

export const metadata = {
  title: "Small Business Web Design in Michigan | glazedweb",
  description:
    "Hand-built websites for Michigan small businesses from $750, live in 2 weeks. Custom design, simple pricing, and you own everything — code, content, and domain.",
  alternates: { canonical: "/small-business-web-design-michigan" },
  openGraph: {
    title: "Small Business Web Design in Michigan | glazedweb",
    description:
      "Hand-built websites for Michigan small businesses from $750, live in 2 weeks. Custom design, simple pricing, and you own everything.",
    type: "website",
    url: "https://www.glazedweb.com/small-business-web-design-michigan",
  },
};

const schema = serviceSchema({
  name: "Small Business Web Design",
  description:
    "Custom small business web design for Michigan companies: hand-built one-page and full websites with hosting, security, and edits covered by one small monthly fee.",
  url: "https://www.glazedweb.com/small-business-web-design-michigan",
});

export default function SmallBusinessWebDesignMI() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServicePage
        kicker="Small business web design · Michigan"
        title="Small business web design in Michigan."
        lead="A website hand-built for your business — not a template with your logo dropped in. Simple pricing, live in about two weeks, and everything ends up in your name."
        highlights={[
          { title: "From $750", body: "One build price, one small monthly for hosting, security, and edits." },
          { title: "Never a template", body: "Designed from your business, so it looks like you and nobody else." },
          { title: "No lock-in", body: "Month-to-month after launch. Leave anytime and keep your whole site." },
        ]}
        related={[
          { href: "/restaurant-website-design-michigan", label: "restaurant website design" },
          { href: "/online-ordering-website-michigan", label: "online ordering websites" },
        ]}
      >
        <h2>What a small business actually needs from a website</h2>
        <p>
          Not a forty-page site. A sharp one: who you are, what you do, where you are, and the fastest possible path to
          a call, a booking, or a visit. Fast on a phone, found on Google, correct about your hours. Most Michigan small
          businesses are carrying either no website, a Facebook page doing a website&apos;s job, or a template site that
          looks like four other businesses in town. We fix that with a site built from scratch around yours.
        </p>

        <h2>How glazedweb works</h2>
        <p>
          Pick a flavor from the menu, tell us about your business, and we get to work. We design your homepage first
          and show you — you react, we adjust, nothing lands as a surprise. Then we build the real thing while you watch
          progress on a live link, and in about two weeks it ships: domain connected, Google set up, everything handed
          over. The monthly covers hosting, security, backups, and small edits, so when your prices or hours change, you
          send a text and it&apos;s handled.
        </p>

        <h2>You own all of it</h2>
        <p>
          The code, the content, the domain, the accounts — yours, in writing, in a plain-English agreement. The
          monthly buys hosting and care, not the right to hold your website hostage. If you ever leave, you take the
          whole site with you and we help you move it.
        </p>

        <h2>Serving all of Michigan</h2>
        <p>
          We&apos;re a small-batch studio in Marshall, and we build for businesses across the whole state — trades,
          shops, farms, salons, nonprofits, and a lot of restaurants. One-page sites start at $750; full sites with up
          to six pages, booking or ordering, and an SEO foundation are $1,900. Both are on the menu with exactly what
          they include.
        </p>
      </ServicePage>
    </>
  );
}
