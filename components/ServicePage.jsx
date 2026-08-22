import Link from "next/link";
import { LogoDefs, Mark } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";

// The shell for the SEO service pages (/restaurant-website-design-michigan
// and friends). These pages exist to say exactly the words a searcher types
// — one service, one state, in the title, H1, and URL — because that is the
// whole playbook that lets a four-page site own an uncrowded query. The
// shell reuses the agreement page's article layout so a new service page is
// just metadata plus copy, and adding the next one stays a ten-minute job.
//
// Server component, no hooks: these pages must carry their full text in the
// initial HTML, since their entire job is being read by a crawler.
export default function ServicePage({ kicker, title, lead, highlights, related, children }) {
  return (
    <>
      <LogoDefs />
      <header>
        <div className="navwrap">
          <Link className="brand" href="/">
            <Mark />
            <span className="bw">
              glazed<span>web</span>
            </span>
          </Link>
          <nav>
            <Link href="/#menu">Menu</Link>
            <Link className="btn" href="/order">
              Start your order
            </Link>
          </nav>
        </div>
      </header>

      <main className="legal-wrap">
        <div className="sec-kicker" style={{ color: "var(--fern)" }}>
          {kicker}
        </div>
        <h1>{title}</h1>
        <p className="legal-lead">{lead}</p>

        {highlights && (
          <div className="legal-highlights">
            {highlights.map((h) => (
              <div key={h.title}>
                <b>{h.title}</b>
                <span>{h.body}</span>
              </div>
            ))}
          </div>
        )}

        <section className="legal">{children}</section>

        <div className="legal-cta">
          <p>
            Pricing is on the menu: one build price, one small monthly, no surprise invoices. Every site is baked from
            scratch in Marshall, Michigan, and everything — code, content, accounts — is yours.
            {related && related.length > 0 && (
              <>
                {" "}
                Also see{" "}
                {related.map((r, i) => (
                  <span key={r.href}>
                    <Link href={r.href}>{r.label}</Link>
                    {i < related.length - 1 ? " and " : "."}
                  </span>
                ))}
              </>
            )}
          </p>
          <div className="legal-actions">
            <Link className="btn big" href="/order">
              Start your order →
            </Link>
            <Link className="btn big ghost" href="/#menu">
              See the menu
            </Link>
          </div>
        </div>
      </main>

      <footer className="order-foot">
        <Link href="/">← glazedweb</Link>
        <span>Marshall, Michigan · {CONTACT_EMAIL}</span>
      </footer>
    </>
  );
}

// Service JSON-LD shared by the service pages: same shape each time, only
// the service name and page URL change. areaServed is the state, matching
// the statewide targeting these pages exist for.
export function serviceSchema({ name, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    serviceType: name,
    areaServed: { "@type": "State", name: "Michigan" },
    provider: {
      "@type": "ProfessionalService",
      "@id": "https://www.glazedweb.com/#business",
      name: "glazedweb",
      url: "https://www.glazedweb.com",
    },
  };
}
