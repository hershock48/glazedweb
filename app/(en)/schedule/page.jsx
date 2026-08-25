import Link from "next/link";
import { LogoDefs, Mark } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";
import { AVAILABILITY, SESSIONS, slotGrid } from "@/lib/schedule";

// The booking page every proposal's "what happens next" points at. A native
// HTML form: the slot grid is server-rendered radio inputs, so booking works
// with JavaScript off, on the oldest phone in the room. The one script on
// the page is an enhancement that shows a picked time in the visitor's own
// timezone, labelled, because a proposal reader may be in Kampala or Santo
// Domingo and a silent conversion is how somebody dials in an hour late.
export const metadata = {
  title: "Book a call | glazedweb",
  description:
    "Pick a time and Kevin confirms by email with the meeting link. An intro call or a project walkthrough, built on our own scheduler, not a rented one.",
  alternates: { canonical: "/schedule" },
};

// The grid depends on the current date, so this page cannot be a static
// snapshot; a cached copy quietly ages until its earliest day is in the
// past. Same rule as the failure log's "route caching and time do not mix".
export const dynamic = "force-dynamic";

export default function SchedulePage() {
  const days = slotGrid();
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

      <main className="order-wrap">
        <div className="order-head">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            Book a call
          </div>
          <h1>Pick a time. Kevin answers.</h1>
          <p className="legal-lead">
            Choose a slot and it lands in both calendars; Kevin confirms by email with the meeting link. Times are{" "}
            {AVAILABILITY.timeZoneLabel}.
          </p>
        </div>

        <form className="order-form" method="post" action="/api/schedule">
          <div className="ostep">
            <h2>
              <span className="onum">1</span>The call
            </h2>
            <div className="schedule-sessions">
              {SESSIONS.map((s, i) => (
                <label className="session-pick" key={s.slug}>
                  <input type="radio" name="session" value={s.slug} defaultChecked={i === 0} required />
                  <span>
                    <b>
                      {s.name} · {s.minutes} min
                    </b>
                    <small>{s.summary}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="ostep">
            <h2>
              <span className="onum">2</span>The time
            </h2>
            <div className="slot-days">
              {days.map((day) => (
                <fieldset className="slot-day" key={day.date}>
                  <legend>
                    {day.weekday} · {day.label}
                  </legend>
                  <div className="slot-grid">
                    {day.slots.map((s) => (
                      <label className="slot" key={s.value}>
                        <input type="radio" name="slot" value={s.value} data-max={s.maxMinutes} required />
                        <span>{s.time}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <p className="slot-note" id="tz-note">
              Times are {AVAILABILITY.timeZoneLabel}.
            </p>
          </div>

          <div className="ostep">
            <h2>
              <span className="onum">3</span>You
            </h2>
            <div className="fgrid">
              <label>
                Name
                <input type="text" name="name" autoComplete="name" required />
              </label>
              <label>
                Business
                <input type="text" name="business" autoComplete="organization" required />
              </label>
              <label>
                Email
                <input type="email" name="email" autoComplete="email" required />
              </label>
              <label>
                What is the project?
                <textarea name="note" rows={3} placeholder="A sentence or two is plenty." />
              </label>
            </div>
          </div>

          <div className="order-submit">
            <button className="btn big" type="submit">
              Request this time →
            </button>
            <p className="done-small">
              This requests the time rather than hard-booking it; if it clashes with something the grid cannot see,
              Kevin replies with alternatives. Or just email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </form>
      </main>

      <footer className="order-foot">
        <Link href="/">← glazedweb</Link>
        <span>Marshall, Michigan · {CONTACT_EMAIL}</span>
      </footer>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  // Enhancement only: when a slot is picked, say what that time is in the
  // visitor's own timezone, labelled. The server-rendered Eastern labels
  // stay authoritative; this line is a translation, never a replacement.
  var note = document.getElementById("tz-note");
  if (!note || !window.Intl) return;
  var zone;
  try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return; }
  if (!zone || zone === "${AVAILABILITY.timeZone}") return;
  var offsetAt = function (d) {
    var name = new Intl.DateTimeFormat("en-US", { timeZone: "${AVAILABILITY.timeZone}", timeZoneName: "longOffset" })
      .formatToParts(d).find(function (p) { return p.type === "timeZoneName"; });
    var m = /GMT([+-])(\\d{2}):(\\d{2})/.exec(name ? name.value : "");
    if (!m) return 0;
    return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
  };
  document.addEventListener("change", function (e) {
    if (!e.target || e.target.name !== "slot") return;
    var v = e.target.value.split("T");
    var d = v[0].split("-").map(Number), t = v[1].split(":").map(Number);
    var naive = Date.UTC(d[0], d[1] - 1, d[2], t[0], t[1]);
    var ms = naive;
    for (var i = 0; i < 2; i++) ms = naive - offsetAt(new Date(ms)) * 60000;
    var local = new Intl.DateTimeFormat("en-US", {
      timeZone: zone, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    }).format(new Date(ms));
    note.textContent = "Times are ${AVAILABILITY.timeZoneLabel}. Your pick is " + local + " in your timezone (" + zone + ").";
  });
})();
`,
        }}
      />
    </>
  );
}
