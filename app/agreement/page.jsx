import Link from "next/link";
import { LogoDefs, Mark } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = {
  title: "Service Agreement | glazedweb",
  description:
    "The Glazed Web service agreement in plain English: you own your website, your domain, and your accounts. No lock-in, no hostage-taking.",
  alternates: { canonical: "/agreement" },
};

export default function AgreementPage() {
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
          Service agreement · v1.0
        </div>
        <h1>The deal, in plain English.</h1>
        <p className="legal-lead">
          Every Glazed Web project runs on these terms. No surprises, no fine print designed to trap you. If anything
          here is unclear, ask before you sign. <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <div className="legal-highlights">
          <div>
            <b>You own it all</b>
            <span>Code, content, and accounts transfer to you when the build is paid in full.</span>
          </div>
          <div>
            <b>No lock-in</b>
            <span>Month-to-month after launch. Cancel anytime and keep your site.</span>
          </div>
          <div>
            <b>Your domain, your name</b>
            <span>Registered for you, transferred to you free, whenever you ask.</span>
          </div>
        </div>

        <section className="legal">
          <h2>1. What we build</h2>
          <p>
            Glazed Web designs, builds, and launches a custom website for your business. The pages, features, and scope
            are whatever we agree to in writing before work starts, usually the flavor you picked from the menu, plus
            anything we add by mutual agreement. Your build includes <b>two rounds of revisions</b> to the design before
            launch. Work beyond the agreed scope is quoted and approved by you before it begins; nothing gets added to
            your bill by surprise.
          </p>

          <h2>2. What it costs</h2>
          <p>
            The build fee and monthly care fee are the ones shown on the menu at the time you order, unless we agree to
            something else in writing. A deposit starts the project; the balance is due at launch. The monthly fee begins
            the first of the month after your site goes live and covers hosting, an SSL certificate, software and
            security updates, backups, and a reasonable amount of small content edits (hours, prices, photos, text). Big
            new work (extra pages, redesigns, new features) is quoted separately.
          </p>
          <p>
            If an invoice goes more than fifteen days past due, we may pause work and, after letting you know in writing,
            pause hosting until the account is current. Pausing doesn&apos;t erase what&apos;s owed.
          </p>

          <h2>3. Who owns what</h2>
          <p>
            <b>You own your content.</b> Your name, logos, photos, text, menus, and prices are yours always, from the
            start.
          </p>
          <p>
            <b>You own the website.</b> When the build fee is paid in full, all rights in the site we built for you
            (the design, the layout, the code, the configuration) transfer to you. On request we&apos;ll hand over the
            complete working project: the code repository, the hosting project, and the logins for any accounts we set up
            on your behalf. Not a static snapshot. The real thing.
          </p>
          <p>
            The monthly fee buys hosting and care, not the right to hold your website. If you stop paying it, your site
            is still yours; we just stop hosting and maintaining it, and we&apos;ll help you move it somewhere else.
          </p>
          <p>
            We keep the right to show your finished site in our portfolio and to mention that we built it, and we may add
            a small &quot;site baked by glazedweb&quot; credit in the footer. Ask us and we&apos;ll remove the credit.
          </p>

          <h2>4. Your domain</h2>
          <p>
            If we register a domain for you, it exists for your business, not ours. We&apos;ll put it in your name where
            the registrar allows, keep it renewed while you&apos;re with us, and transfer it to any registrar account you
            name, free, within fourteen days of your asking. We will never hold a domain hostage, sell it, or let it
            lapse on purpose.
          </p>

          <h2>5. How long this lasts</h2>
          <p>
            The agreement starts when you accept it and runs through launch, then continues month to month. Either of us
            can end the monthly service with thirty days&apos; written notice. No termination fee, no remaining-months
            penalty, no auto-renewing multi-year term. If either of us materially breaks the agreement, the other can end
            it after giving fifteen days&apos; written notice and a chance to fix the problem.
          </p>

          <h2>6. What we need from you</h2>
          <p>
            Timely content, feedback, and a single point of contact who can approve designs. You confirm you own or have
            permission to use everything you send us. Projects stall on content more than anything else, so the faster
            you get us words and photos, the faster you launch.
          </p>

          <h2>7. What we promise, and what we don&apos;t</h2>
          <p>
            We&apos;ll do professional, careful work and keep your site up and functioning to the best of our ability.
            We can&apos;t promise perfect uptime, specific Google rankings, traffic numbers, or business results.
            Nobody honestly can. Neither of us is liable to the other for indirect or consequential damages, and our
            total liability is capped at what you paid us in the twelve months before a claim.
          </p>

          <h2>8. Housekeeping</h2>
          <p>
            Glazed Web is an independent contractor, not your employee or partner. This agreement is governed by
            Michigan law. If a court finds part of it unenforceable, the rest still stands. Changes have to be in
            writing, and either of us can assign this agreement only with the other&apos;s consent.
          </p>
        </section>

        <div className="legal-cta">
          <p>
            <b>Version 1.0</b> · effective August 2026. Accepting this on the order form creates a binding agreement; we
            record the version and timestamp with your order and email you a copy. Want it for your records, or for your
            attorney? Download the signable document below. Nothing here changes between the page and the paper.
          </p>
          <div className="legal-actions">
            <Link className="btn big" href="/order">
              Start your order →
            </Link>
            <a className="btn big ghost" href="/glazed-web-agreement-v1.pdf" target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
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
