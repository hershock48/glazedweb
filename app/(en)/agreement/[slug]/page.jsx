import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoDefs, Mark } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";
import { getCustomOrder, money, AGREEMENT_VERSION, PROVIDER } from "@/lib/customOrders";
import { monthlyStatus } from "@/lib/monthly";
import CustomOrderAccept from "@/components/CustomOrderAccept";

/**
 * A Custom Order's own agreement page: /agreement/{slug}.
 *
 * SHAPE: the general terms are NOT restated here. They are the published
 * glazedweb Client Agreement v1.1 at /agreement, linked and incorporated by
 * reference, exactly the way the menu-order clickwrap works. What this page
 * adds is what the master leaves blank: Exhibit A with the client's scope
 * and numbers, where things stand (build fee paid, monthly plan running),
 * the button that starts the monthly plan on glazedweb's Stripe, and the
 * acceptance itself.
 *
 * Everything about the client comes from lib/customOrders.js. The monthly
 * status is read live from Stripe on every view (lib/monthly.js), so the
 * circle becomes a check the moment the plan starts, with no database.
 *
 * Noindex, not in the sitemap, not in any nav: the link Kevin sends is the
 * only way in. The URL is not a secret, and does not need to be; there is
 * nothing on it a client would mind their competitor reading, and the
 * acceptance and the card form both stand on their own.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const order = getCustomOrder(slug);
  return {
    title: order ? `Agreement for ${order.client} | glazedweb` : "Agreement | glazedweb",
    description: order ? `The custom-order agreement for ${order.client}: scope, pricing, and acceptance.` : undefined,
    robots: { index: false, follow: false },
  };
}

const Check = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function niceDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function CustomOrderPage({ params, searchParams }) {
  const { slug } = await params;
  const order = getCustomOrder(slug);
  if (!order) notFound();
  const sp = (await searchParams) || {};
  const status = await monthlyStatus(order, typeof sp.session_id === "string" ? sp.session_id : undefined);
  const payHref = `/api/pay/${order.slug}`;
  const monthlyRunning = status.state === "active";

  let payNote = null;
  if (sp.pay === "cancelled") payNote = "No charge was made. The button is here whenever you are ready.";
  if (sp.pay === "failed") payNote = `The card page could not be opened just now. Try again in a minute, or email ${CONTACT_EMAIL}.`;

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
            <Link href="/agreement">The terms</Link>
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
              Ask Kevin
            </a>
          </nav>
        </div>
      </header>

      <main className="legal-wrap">
        <div className="sec-kicker" style={{ color: "var(--fern)" }}>
          Custom Order · {order.client}
        </div>
        <h1>Your agreement, in plain English.</h1>
        <p className="legal-lead">
          Two documents make the whole deal, and both are on this page or one tap from it. The first is the{" "}
          <Link href="/agreement">{AGREEMENT_VERSION}</Link>, the same published terms every glazedweb client gets: you
          own the site outright, month to month, thirty days&rsquo; notice, no penalty, Michigan law. The second is the
          Exhibit A below, which fills in what was built for you, what it costs, and how the reservations and deposits
          work. Accepting at the bottom accepts both together.
        </p>
        <p className="agr-note">
          If anything is unclear, ask before accepting: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or a
          text.
        </p>

        <section className="legal">
          <h2>Where things stand</h2>
          <ul className="agr-status">
            <li>
              <span className={`st-ic ${order.buildFeePaid ? "done" : "open"}`} aria-hidden="true">
                {order.buildFeePaid ? <Check /> : null}
              </span>
              <div>
                <b>
                  Build fee, {money(order.buildFee)}
                  {order.buildFeePaid ? ": paid" : ""}
                </b>
                <span>
                  {order.buildFeePaid
                    ? "Paid in full. The site is yours: code, content, and accounts."
                    : "Due on acceptance. We invoice it; nothing is owed until the invoice arrives."}
                </span>
              </div>
            </li>
            <li>
              <span className={`st-ic ${monthlyRunning ? "done" : "open"}`} aria-hidden="true">
                {monthlyRunning ? <Check /> : null}
              </span>
              <div>
                <b>
                  Monthly care, {money(order.monthly)} a month{monthlyRunning ? ": running" : ""}
                  {status.mode === "test" ? <span className="agr-mode">test mode</span> : null}
                </b>
                {monthlyRunning ? (
                  <span>
                    Started {niceDate(status.since)}. Charged to your card on the same day each month. Stop it any time
                    with thirty days&rsquo; notice, and the site stays yours.
                    {status.pastDue ? " The last payment did not go through; Stripe will retry and email you." : ""}
                  </span>
                ) : status.state === "off" ? (
                  <span>
                    Not started yet. The card link is not switched on yet; Kevin will text you when it is, and this page
                    will show a check once the plan is running.
                  </span>
                ) : (
                  <span>
                    Not started yet. One card form, the same as any online checkout, and it runs month to month from
                    today. You will get a receipt each month, and you can stop it any time.
                    {status.unsure ? " (We could not reach Stripe to check just now; if you already started it, refresh in a minute.)" : ""}
                  </span>
                )}
                {!monthlyRunning && status.state !== "off" ? (
                  <a className="btn" href={payHref}>
                    Start the monthly plan
                  </a>
                ) : null}
                {payNote && !monthlyRunning ? <span className="agr-paynote">{payNote}</span> : null}
              </div>
            </li>
          </ul>

          <h2>Exhibit A, part 1: what was built</h2>
          <p>
            Custom Order, prepared for {order.clientLegal}, {order.town}. The site is {order.live ? "live" : "to be published"} at{" "}
            <a href={`https://${order.domain}`} target="_blank" rel="noopener noreferrer">
              {order.domain}
            </a>
            {order.live
              ? ". Design, build and launch are done, the two pre-launch revision rounds were used, and what continues is the hosting and care the monthly fee covers. Changes from here are included edits or quoted work, as in part 2."
              : "."}
          </p>
          <ol className="agr-scope">
            {order.scope.map((s) => (
              <li key={s.slice(0, 40)}>{s}</li>
            ))}
          </ol>
          <p>
            <b>Not included</b>, and quoted separately if wanted: {order.notIncluded}
          </p>

          <h2>Exhibit A, part 2: what it costs</h2>
          <table className="agr-terms">
            <tbody>
              <tr>
                <td>Build fee</td>
                <td>
                  {money(order.buildFee)}, one time.{" "}
                  {order.buildFeePaid
                    ? "Paid in full; nothing further is owed on it."
                    : "Due on acceptance and invoiced separately."}
                </td>
              </tr>
              <tr>
                <td>Monthly service fee</td>
                <td>
                  {money(order.monthly)} a month, starting the day you start it above. Hosting, SSL, security updates,
                  backups, domain renewal where we hold it, and each season&rsquo;s round opened for you. Month to month;
                  thirty days&rsquo; notice ends it, and the site stays yours.
                </td>
              </tr>
              <tr>
                <td>Included edits</td>
                <td>
                  Up to {order.editAllowance} of small edits: prices, the pickup window, a photo, a line of copy. Opening
                  the next round is within it.
                </td>
              </tr>
              <tr>
                <td>Beyond scope</td>
                <td>
                  {money(order.hourlyRate)} per hour, always quoted and approved by you in writing before any work starts.
                  Nothing lands on a bill unannounced.
                </td>
              </tr>
              <tr>
                <td>The domain</td>
                <td>
                  {order.domain}. Yours, for the benefit of your business; transferred to any registrar account you name,
                  free, whenever you ask.
                </td>
              </tr>
            </tbody>
          </table>

          <h2>Exhibit A, part 3: reservations and deposits</h2>
          <p>
            The site lets your customers reserve birds from the open round, see an estimate, and pay the reservation
            deposit by card on a checkout page hosted by Square. These terms apply to that flow and are part of the
            agreement.
          </p>
          <ol className="agr-scope">
            {order.payments.map((p) => (
              <li key={p.lead}>
                <b>{p.lead}</b> {p.text}
              </li>
            ))}
          </ol>

          <h2>Accept</h2>
          <p>
            Typing your name and checking the box forms the agreement, the same way checking out online forms one. You
            will get a copy of the signed record by email, and so will we. That email records the version, the scope,
            the numbers, your name, and the time.
          </p>
          <CustomOrderAccept
            slug={order.slug}
            business={order.client}
            contactName={order.contactName}
            contactTitle={order.contactTitle}
            email={order.email}
            payHref={!monthlyRunning && status.state !== "off" ? payHref : null}
          />

          <p className="agr-note agr-foot">
            {PROVIDER} · Kevin Hershock · Marshall, Michigan · {CONTACT_EMAIL} · {AGREEMENT_VERSION}
          </p>
        </section>
      </main>

      <footer className="order-foot">
        <Link href="/">← glazedweb</Link>
        <span>Marshall, Michigan · {CONTACT_EMAIL}</span>
      </footer>
    </>
  );
}
