import "../globals.css";
import {
  CONTACT_EMAIL,
  DO_REP_NAME,
  WHATSAPP_DO_DISPLAY,
  WHATSAPP_US_DISPLAY,
} from "@/lib/contact";
import { PRICING, rd } from "@/lib/pricing";

// Root layout for the Dominican Republic market, served at /do. It exists as
// a second root layout (route group) for one reason a nested layout can't
// deliver: <html lang="es">. Screen readers pronounce the page wrong and
// Google reads a weaker language signal if the Spanish page ships under
// lang="en".
export const metadata = {
  metadataBase: new URL("https://www.glazedweb.com"),
  title: "Diseño de Páginas Web en República Dominicana | glazedweb",
  description: `Páginas web hechas a mano para negocios dominicanos desde ${rd(PRICING.do.original.build)}, listas en 2 semanas. Escríbele por WhatsApp a Angel, nuestro representante en RD.`,
  alternates: {
    canonical: "/do",
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
    title: "Diseño de Páginas Web en República Dominicana | glazedweb",
    description: `Páginas web hechas a mano para negocios dominicanos desde ${rd(PRICING.do.original.build)}, listas en 2 semanas. Pídela como una dona: eliges el sabor, la horneamos fresca y te la entregamos glaseada.`,
    type: "website",
    url: "https://www.glazedweb.com/do",
    locale: "es_DO",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "glazedweb: una dona rosada con glaseado verde, sobre la línea Websites, fresh daily.",
      },
    ],
  },
  // Card type only, same reasoning as the English layout: a full twitter block
  // here would be inherited by any future /do sub-page and override its own
  // openGraph in scrapers that prefer twitter:*.
  twitter: {
    card: "summary_large_image",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.glazedweb.com/do#business",
  name: "glazedweb",
  description:
    "Estudio de diseño web artesanal. Páginas web hechas a mano para negocios en República Dominicana, con representante local y atención por WhatsApp.",
  url: "https://www.glazedweb.com/do",
  email: CONTACT_EMAIL,
  image: "https://www.glazedweb.com/brand/logo-800.png",
  logo: "https://www.glazedweb.com/brand/logo-800.png",
  priceRange: `${rd(PRICING.do.original.build)} - ${rd(PRICING.do.dozen.build)}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marshall",
    addressRegion: "MI",
    addressCountry: "US",
  },
  areaServed: { "@type": "Country", name: "República Dominicana" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      name: DO_REP_NAME,
      telephone: WHATSAPP_DO_DISPLAY,
      areaServed: "DO",
      availableLanguage: "es",
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: WHATSAPP_US_DISPLAY,
      areaServed: ["US", "DO"],
      availableLanguage: ["en", "es"],
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      name: "La Original, página web de una sola página",
      price: String(PRICING.do.original.build),
      priceCurrency: "DOP",
    },
    {
      "@type": "Offer",
      name: "La Docena del Panadero, página web completa (hasta 6 páginas)",
      price: String(PRICING.do.dozen.build),
      priceCurrency: "DOP",
    },
  ],
};

export default function DoRootLayout({ children }) {
  // suppressHydrationWarning + the .js gate script: same as the English
  // layout, see the comment there. Keep the two in sync.
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
