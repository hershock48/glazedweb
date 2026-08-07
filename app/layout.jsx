import "./globals.css";

export const metadata = {
  title: "glazedweb — websites, fresh daily",
  description:
    "Small-batch websites for small businesses. No templates, no bloat, no six-month timelines. Baked in Michigan, served everywhere.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "glazedweb — websites, fresh daily",
    description:
      "Hand-built sites for small businesses. Order it like a donut: pick a flavor, we bake it fresh, it ships glazed.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
