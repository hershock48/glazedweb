import "../globals.css";
import { CONTACT_EMAIL } from "@/lib/contact";
import { PRICING, usd } from "@/lib/pricing";

export const metadata = {
  metadataBase: new URL("https://www.glazedweb.com"),
  // Statewide targeting, Kevin's call on 22 Aug 2026: "web design Michigan"
  // casts the whole-state net; the old Marshall & Battle Creek title fished
  // one county. Marshall stays in the copy as where we bake, not who we serve.
  title: "Web Design in Michigan | glazedweb",
  description: `Hand-built websites for Michigan small businesses from ${usd(PRICING.us.original.build)}, live in 2 weeks. Small-batch studio in Marshall serving all of Michigan. Start your order today.`,
  // languages tells Google the Dominican page at /do is this page in Spanish,
  // not duplicate content. x-default keeps the English site as the answer for
  // every country we haven't localized.
  alternates: {
    canonical: "/",
    languages: { en: "/", "es-DO": "/do", "x-default": "/" },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Web Design in Michigan | glazedweb",
    description: `Hand-built websites for Michigan small businesses from ${usd(PRICING.us.original.build)}, live in 2 weeks. Order it like a donut: pick a flavor, we bake it fresh, it ships glazed.`,
    type: "website",
    url: "https://www.glazedweb.com",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "glazedweb: a pink donut with a green glaze dripping off it, over the line Websites, fresh daily." }],
  },
  // Only the card type. Deliberately no title, description or image here: a
  // twitter block with those set at the root gets inherited by every sub-page,
  // so pages that override openGraph would still advertise the homepage's card
  // to any scraper that prefers twitter:*. Without this line the image is still
  // found, but rendered as a small square thumbnail rather than a wide card.
  twitter: {
    card: "summary_large_image",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.glazedweb.com/#business",
  name: "glazedweb",
  description:
    "Small-batch web design studio building hand-made custom websites for small businesses. Based in Marshall, Michigan, serving the entire state of Michigan.",
  url: "https://www.glazedweb.com",
  email: CONTACT_EMAIL,
  image: "https://www.glazedweb.com/brand/logo-800.png",
  logo: "https://www.glazedweb.com/brand/logo-800.png",
  priceRange: `${usd(PRICING.us.original.build)} - ${usd(PRICING.us.dozen.build)}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marshall",
    addressRegion: "MI",
    addressCountry: "US",
  },
  areaServed: { "@type": "State", name: "Michigan" },
  makesOffer: [
    {
      "@type": "Offer",
      name: "The Original, one-page custom website",
      price: String(PRICING.us.original.build),
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "The Baker's Dozen, full custom website (up to 6 pages)",
      price: String(PRICING.us.dozen.build),
      priceCurrency: "USD",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
