import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoDefs, Mark } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";
import { getCustomOrder, money, contentProgress } from "@/lib/customOrders";
import { monthlyStatus } from "@/lib/monthly";
import { buildStatus } from "@/lib/buildfee";

/**
 * A signed client's project page: /build/{slug}. Spec: glaze/project-page.md.
 *
 * WHAT IT IS. The page a client opens for the six weeks after yes instead of
 * texting "any update?": where things stand, what we still need from them,
 * what happens in what order, and where their stuff is.
 *
 * WHAT IT IS NOT. Not a proposal (that job ended at yes), and not a second
 * scope document. Scope lives ONCE, in Exhibit A on /agreement/{slug}, and
 * this page links there. Two descriptions of one job drift, and the day they
 * disagree the client quotes whichever helps him. Same rule as three copies
 * of a price.
 *
 * Everything on the page comes from the client's row in lib/customOrders.js
 * (the `project` block) or live from Stripe (the same monthlyStatus and
 * buildStatus the agreement page reads), so the name, the numbers and the
 * slug exist once. A client without a `project` block 404s: an empty page
 * with a client's name on it is worse than no page.
 *
 * The "what we need from you" boxes are ticked by US, by editing `done` in
 * the registry. The honest state is what we have actually received, not
 * what he believes he sent, and a client-editable list would need a login.
 *
 * Noindex, not in the sitemap, not in any nav. The link Kevin sends is the
 * only way in, same as the agreement page.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const order = getCustomOrder(slug);
  return {
    title: order ? `Your build | ${order.client} and glazedweb` : "Your build | glazedweb",
    description: order ? `Where the ${order.client} build stands, what we need, and what happens next.` : undefined,
    robots: { index: false, follow: false },
  };
}

function Circle({ done }) {
  return <span className={`st-ic ${done ? "done" : "open"}`} aria-hidden="true" />;
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const order = getCustomOrder(slug);
  if (!order || !order.project) notFound();
  const p = order.project;

  const [monthly, build] = await Promise.all([monthlyStatus(order), buildStatus(order)]);
  const monthlyRunning = monthly.state === "active";
  const buildPaid = build.state === "paid" || order.buildFeePaid === true;
  const progress = contentProgress(order);
  const contentDone = progress.total > 0 && progress.done === progress.total;

  /* A missing array is a registry typo, not a reason to 500 a page a client
     was sent a link to. Same guard as the agreement page. */
  const needs = Array.isArray(p.needs) ? p.needs : [];
  const steps = Array.isArray(p.steps) ? p.steps : [];
  const freebies = Array.isArray(p.freebies) ? p.freebies : [];
  const links = Array.isArray(p.links) ? p.links : [];
  const monthlyIs = Array.isArray(p.monthlyIs) ? p.monthlyIs : [];
  const agreementHref = `/agreement/${order.slug}`;

  return (
    <>
      <LogoDefs />
      <header>
        <div className="navwrap">
          {/* Same rule as the agreement page: the mark goes back to the
              proposal he arrived from, not to the studio's homepage. */}
          <a className="brand" href={order.pitchUrl || "/"} aria-label={order.pitchUrl ? "Back to the proposal" : "glazedweb home"}>
            <Mark />
            <span className="bw">
              glazed<span>web</span>
            </span>
          </a>
          <nav>
            <Link href={agreementHref}>The agreement</Link>
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
              Ask Kevin
            </a>
          </nav>
        </div>
      </header>

      <main className="legal-wrap">
        <div className="sec-kicker" style={{ color: "var(--fern)" }}>
          Your build · {order.client}
        </div>
        <h1>Your build.</h1>
        <p className="legal-lead">
          One page for the next few weeks: where things stand, what we still need from you, what happens in what
          order, and where your stuff is. What was agreed, and for how much, lives on{" "}
          <Link href={agreementHref}>the agreement</Link> and nowhere else, so nothing here can quietly disagree with
          it.
        </p>
        <p className="agr-note">
          Anything unclear, ask: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or a text. This page is
          updated by us as things land, so if a circle is still open, we have not received it yet.
        </p>

        <section className="legal">
          <h2>Where things stand</h2>
          <ul className="agr-status">
            <li>
              <Circle done={p.accepted === true} />
              <div>
                <b>The agreement{p.accepted ? ": accepted" : ""}</b>
                <span>
                  {p.accepted
                    ? "Accepted. Both of us have the signed record by email."
                    : "Not yet accepted. It is written and waiting; typing your name at the bottom is the whole ceremony."}
                </span>
                {!p.accepted ? (
                  <Link className="btn" href={agreementHref}>
                    Read and accept the agreement
                  </Link>
                ) : null}
              </div>
            </li>
            <li>
              <span className={`st-ic ${buildPaid ? "done" : build.state === "half" ? "half" : "open"}`} aria-hidden="true" />
              <div>
                <b>
                  Build fee, {money(order.buildFee)}
                  {buildPaid ? ": paid" : build.state === "half" ? ": half paid" : ""}
                </b>
                <span>
                  {buildPaid
                    ? "Paid in full. The site is yours: code, content, and accounts."
                    : build.state === "half"
                      ? `Half paid, ${money(build.paid)}. The balance, ${money(build.remaining)}, is due at launch, from the agreement page.`
                      : "Due on acceptance. Half to start and half at launch, or all of it in one go, by card on the agreement page; or we invoice it. Nothing is owed until you choose."}
                </span>
              </div>
            </li>
            <li>
              <Circle done={monthlyRunning} />
              <div>
                <b>
                  Monthly care, {money(order.monthly)} a month{monthlyRunning ? ": running" : ""}
                </b>
                <span>
                  {monthlyRunning
                    ? "Running. Charged to your card on the same day each month; stop it any time with thirty days’ notice, and the site stays yours."
                    : "Not due yet. It begins once the build fee is paid in full and the site is live on your domain; we send you the link then."}
                </span>
              </div>
            </li>
            <li>
              <Circle done={contentDone} />
              <div>
                <b>
                  Your content: {progress.done} of {progress.total}
                </b>
                <span>
                  {contentDone
                    ? "Everything we asked for is in. From here the date is ours to hit, not yours."
                    : "The list is below, with why each thing is needed. This is the only step we cannot do for you, and it is the one that decides the launch date."}
                </span>
              </div>
            </li>
            <li>
              <Circle done={p.liveOnDomain === true} />
              <div>
                <b>Live on {order.domain}</b>
                <span>
                  {p.liveOnDomain
                    ? "Live, on your own domain, indexed under your own name."
                    : "Not yet. Until launch day the site answers at the address in Your stuff below, hidden from search on purpose."}
                </span>
              </div>
            </li>
          </ul>

          <h2>What we need from you</h2>
          <p>
            Eleven things, none of them long, in the order they block other work. Each says why it is needed, because a
            list without reasons reads like paperwork. We tick them as they arrive.
          </p>
          <ul className="agr-status">
            {needs.map((n) => (
              <li key={n.id ?? n.ask}>
                <Circle done={n.done === true} />
                <div>
                  <b>{n.ask}</b>
                  <span>{n.why}</span>
                </div>
              </li>
            ))}
          </ul>

          <h2>What happens, in order</h2>
          <p>
            The sequence, not the scope. The scope is <Link href={agreementHref}>Exhibit A</Link>. No dates here until
            your content is in, because the content is the only real variable and a schedule written before it lands
            is a broken promise waiting for week two.
          </p>
          <ol className="agr-scope">
            {steps.map((s) => (
              <li key={s.title}>
                <b>{s.title}</b>
                {s.detail ? ` ${s.detail}` : ""}
              </li>
            ))}
          </ol>

          {freebies.length ? (
            <>
              <h2>What we are doing anyway</h2>
              <p>Whether or not any of the rest of this happens on schedule. In the proposal these were an offer; here they are a receipt.</p>
              <ol className="agr-scope">
                {freebies.map((f) => (
                  <li key={f.lead}>
                    <b>{f.lead}</b> {f.text}
                  </li>
                ))}
              </ol>
            </>
          ) : null}

          <h2>Your stuff</h2>
          <table className="agr-terms">
            <tbody>
              {links.map((l) => (
                <tr key={l.href}>
                  <td>{l.label}</td>
                  <td>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.href.replace(/^https?:\/\//, "")}
                    </a>
                    {l.note ? <>. {l.note}</> : null}
                  </td>
                </tr>
              ))}
              <tr>
                <td>The agreement</td>
                <td>
                  <Link href={agreementHref}>glazedweb.com{agreementHref}</Link>. Scope, numbers, and the record of your
                  acceptance.
                </td>
              </tr>
              <tr>
                <td>Kevin</td>
                <td>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or a text.
                </td>
              </tr>
            </tbody>
          </table>

          {monthlyIs.length ? (
            <>
              <h2>What the monthly actually is</h2>
              <ol className="agr-scope">
                {monthlyIs.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ol>
            </>
          ) : null}

          <p className="agr-note">
            Page kept since {p.since}. The numbers on it are the agreement’s numbers, read from the same place, so they
            cannot drift from what you signed.
          </p>
        </section>
      </main>
    </>
  );
}
