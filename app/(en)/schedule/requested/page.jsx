import Link from "next/link";
import { LogoDefs, Mark } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";
import { SESSIONS, describeSlot, slotIsBookable, buildIcs, icsDataUrl } from "@/lib/schedule";

// The confirmation. Everything it needs rides in the query string, so this
// page can rebuild the calendar file itself: the visitor gets their invite
// as a data URL with no storage and no extra round trip, even on the mailto
// fallback path where no email went anywhere.
export const metadata = {
  title: "Time requested | glazedweb",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function RequestedPage({ searchParams }) {
  const params = await searchParams;
  const slot = String(params?.slot ?? "");
  const name = String(params?.name ?? "");
  const session = SESSIONS.find((s) => s.slug === params?.session);
  const mailtoMode = params?.delivery === "mailto";

  if (!session || !slotIsBookable(slot, session.minutes)) {
    return (
      <>
        <LogoDefs />
        <main className="order-wrap">
          <h1>That time has moved on.</h1>
          <p className="legal-lead" style={{ marginTop: 12 }}>
            The link that brought you here is stale. <Link href="/schedule">Pick a fresh time</Link>.
          </p>
        </main>
      </>
    );
  }

  const when = describeSlot(slot);
  const ics = buildIcs(
    {
      uid: `${slot.replace(/[^0-9]/g, "")}-view@glazedweb.com`,
      localStart: slot,
      minutes: session.minutes,
      title: `glazedweb ${session.name}`,
      description: "Kevin sends the meeting link by email before the call.",
    },
    CONTACT_EMAIL
  );

  const mailtoBody = encodeURIComponent(
    `Hi Kevin,\n\nRequesting a ${session.name} (${session.minutes} min) at ${when}.\n\nName: ${name}\n\n(Sent by hand because the schedule form could not reach the mailbox.)`
  );

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
        </div>
      </header>

      <main className="order-wrap">
        <div className="order-head">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            {session.name} · {session.minutes} min
          </div>
          <h1>{when}.</h1>
          {mailtoMode ? (
            <p className="legal-lead">
              One more step, honestly stated: the form could not reach the mailbox just now, so nothing has been sent
              yet.{" "}
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Call request: ${session.name} · ${when}`)}&body=${mailtoBody}`}>
                Send the request by email
              </a>{" "}
              and it is with Kevin; the time above rides along prefilled.
            </p>
          ) : (
            <p className="legal-lead">
              Requested{name ? `, ${name.split(" ")[0]}` : ""}. Kevin confirms by email with the meeting link, and the
              invite is already in his inbox. If the time clashes with something the calendar could not see, he replies
              with alternatives instead.
            </p>
          )}
          <p style={{ marginTop: 18 }}>
            <a className="btn" href={icsDataUrl(ics)} download="glazedweb-call.ics">
              Add it to your calendar
            </a>
          </p>
        </div>
      </main>

      <footer className="order-foot">
        <Link href="/">← glazedweb</Link>
        <span>Marshall, Michigan · {CONTACT_EMAIL}</span>
      </footer>
    </>
  );
}
