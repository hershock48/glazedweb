import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.glazedweb.com"),
  title: "Web Design in Marshall & Battle Creek, MI | glazedweb",
  description:
    "Hand-built websites for Michigan small businesses from $750, live in 2 weeks. Small-batch studio in Marshall serving Battle Creek. Start your order today.",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Web Design in Marshall & Battle Creek, MI | glazedweb",
    description:
      "Hand-built websites for Michigan small businesses from $750, live in 2 weeks. Order it like a donut: pick a flavor, we bake it fresh, it ships glazed.",
    type: "website",
    url: "https://www.glazedweb.com",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "glazedweb — small-batch web design in Marshall, Michigan" }],
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
