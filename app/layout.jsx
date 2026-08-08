import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.glazedweb.com"),
  title: "glazedweb — Web Design in Marshall & Battle Creek, MI | Websites, Fresh Daily",
  description:
    "Small-batch web design studio in Marshall, Michigan serving Battle Creek and small businesses across Michigan. Hand-built custom websites from $750 — no templates, no bloat, live in as little as 2 weeks.",
  alternates: { canonical: "/" },
  keywords: [
    "web design Marshall MI",
    "web designer Battle Creek MI",
    "website design Calhoun County",
    "small business websites Michigan",
    "custom website Michigan",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "glazedweb — Web Design in Marshall & Battle Creek, MI",
    description:
      "Hand-built websites for small businesses in Marshall, Battle Creek, and across Michigan. Order it like a donut: pick a flavor, we bake it fresh, it ships glazed.",
    type: "website",
    url: "https://www.glazedweb.com",
    images: [{ url: "/brand/logo-800.png", width: 800, height: 1000, alt: "glazedweb — pink donut with green glaze" }],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.glazedweb.com/#business",
  name: "glazedweb",
  description:
    "Small-batch web design studio building hand-made custom websites for small businesses. Based in Marshall, Michigan, serving Battle Creek, Albion, Coldwater, and all of Michigan.",
  url: "https://www.glazedweb.com",
  email: "hello@glazedweb.com",
  image: "https://www.glazedweb.com/brand/logo-800.png",
  logo: "https://www.glazedweb.com/brand/logo-800.png",
  priceRange: "$750 - $1,900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marshall",
    addressRegion: "MI",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Marshall" },
    { "@type": "City", name: "Battle Creek" },
    { "@type": "City", name: "Albion" },
    { "@type": "City", name: "Coldwater" },
    { "@type": "State", name: "Michigan" },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      name: "The Original — one-page custom website",
      price: "750",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "The Baker's Dozen — full custom website (up to 6 pages)",
      price: "1900",
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
