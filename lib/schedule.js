// The call scheduler behind /schedule, ported from the MI Gas build
// (hershock48/migas, lib/slots.ts + lib/ics.ts), where the reasoning for
// every non-obvious choice lives in full. The short version of what this is:
// slots generated from a weekly pattern and rendered as real radio inputs so
// the form works with JavaScript off, and calendar invites hand-written to
// RFC 5545 because that is the part a scheduling service is mostly selling
// and it is eighty lines of a text format from 1998.
//
// What this deliberately is NOT: live availability. It does not know what is
// already booked and does not pretend to. A submission is a REQUEST for a
// time; Kevin confirms by email with the meeting link, and the ICS landing
// in his calendar makes the calendar itself the record. That framing is why
// double-booking is an inconvenience here rather than a lie.

export const AVAILABILITY = {
  timeZone: "America/Detroit",
  timeZoneLabel: "Eastern (Michigan)",
  // PLACEHOLDER: these windows are a plausible pattern, not Kevin's answer.
  // Confirm and correct before leaning on the page. 0 = Sunday.
  windows: [
    { day: 1, from: "10:00", to: "16:00" },
    { day: 2, from: "10:00", to: "16:00" },
    { day: 3, from: "10:00", to: "16:00" },
    { day: 4, from: "10:00", to: "16:00" },
  ],
  horizonDays: 14,
  leadDays: 1,
  stepMinutes: 30,
};

export const SESSIONS = [
  {
    slug: "intro",
    name: "Intro call",
    minutes: 20,
    summary: "A first conversation about your project. Phone, WhatsApp, or Zoom, your pick.",
  },
  {
    slug: "walkthrough",
    name: "Project walkthrough",
    minutes: 45,
    summary: "A Zoom working session: your current site, the plan, and the preview if one exists.",
  },
];

const DAY_MS = 86_400_000;
const LENGTHS = [...new Set(SESSIONS.map((s) => s.minutes))].sort((a, b) => b - a);

const parts = (d) => {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: AVAILABILITY.timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const out = {};
  for (const p of f.formatToParts(d)) if (p.type !== "literal") out[p.type] = p.value;
  return out;
};

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

const minutesOf = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const pad = (n) => String(n).padStart(2, "0");
const clock = (mins) => {
  const h24 = Math.floor(mins / 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad(mins % 60)} ${h24 < 12 ? "AM" : "PM"}`;
};

// Days are stepped by anchoring at 12:00 UTC: noon UTC lands on the same
// calendar day in the target zone whether or not the clocks changed
// overnight. Anchoring at midnight is the classic form of that bug.
export function slotGrid(now = new Date()) {
  const days = [];
  const start = now.getTime() + AVAILABILITY.leadDays * DAY_MS;
  const firstNoon = Math.floor(start / DAY_MS) * DAY_MS + 12 * 60 * 60 * 1000;

  for (let i = 0; i < AVAILABILITY.horizonDays; i++) {
    const p = parts(new Date(firstNoon + i * DAY_MS));
    const windows = AVAILABILITY.windows.filter((w) => w.day === WEEKDAY_INDEX[p.weekday]);
    if (windows.length === 0) continue;

    const date = `${p.year}-${MONTHS[p.month]}-${pad(Number(p.day))}`;
    const slots = [];
    for (const w of windows) {
      const close = minutesOf(w.to);
      for (let t = minutesOf(w.from); t + LENGTHS[LENGTHS.length - 1] <= close; t += AVAILABILITY.stepMinutes) {
        const maxMinutes = LENGTHS.find((m) => t + m <= close);
        if (!maxMinutes) continue;
        slots.push({ value: `${date}T${pad(Math.floor(t / 60))}:${pad(t % 60)}`, time: clock(t), maxMinutes });
      }
    }
    if (slots.length === 0) continue;
    days.push({ date, weekday: p.weekday, label: `${p.month} ${p.day}`, slots });
  }
  return days;
}

// A posted slot is just a string a visitor typed until this says otherwise,
// and the no-JS path genuinely reaches here with slots too short for the
// longer session, because there is no client to grey them out.
export function slotIsBookable(value, sessionMinutes, now = new Date()) {
  for (const day of slotGrid(now)) {
    const hit = day.slots.find((s) => s.value === value);
    if (hit) return hit.maxMinutes >= sessionMinutes;
  }
  return false;
}

// One formatter shared by the form, the confirmation, and the emails, so
// they can never disagree about when the call is.
export function describeSlot(value) {
  const [date, time] = value.split("T");
  if (!date || !time) return value;
  const [y, m, d] = date.split("-").map(Number);
  const p = parts(new Date(Date.UTC(y, m - 1, d, 12)));
  return `${p.weekday}, ${p.month} ${p.day} at ${clock(minutesOf(time))} ${AVAILABILITY.timeZoneLabel}`;
}

/* ---- ICS. See migas lib/ics.ts for the two silent failure modes this
   avoids: TZID without VTIMEZONE (emit Zulu instants instead, resolved
   twice because the offset depends on the instant), and unfolded lines
   past 75 octets. */

function offsetMinutes(at) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: AVAILABILITY.timeZone, timeZoneName: "longOffset" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(name ?? "");
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

export function toInstant(local) {
  const [d, t] = local.split("T");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi] = (t ?? "00:00").split(":").map(Number);
  const naive = Date.UTC(y, mo - 1, da, h, mi);
  let ms = naive;
  for (let i = 0; i < 2; i++) ms = naive - offsetMinutes(new Date(ms)) * 60_000;
  return new Date(ms);
}

const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (v) => v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

function fold(line) {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const out = [];
  let start = 0;
  while (start < bytes.length) {
    const take = start === 0 ? 75 : 74;
    let end = Math.min(start + take, bytes.length);
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    out.push((start === 0 ? "" : " ") + bytes.subarray(start, end).toString("utf8"));
    start = end;
  }
  return out.join("\r\n");
}

// glazedweb has a real mailbox, so unlike the migas build this always emits
// a true REQUEST with an ORGANIZER, which is what makes mail clients offer
// Accept/Decline instead of a read-only entry.
export function buildIcs(ev, organiserEmail, now = new Date()) {
  const start = toInstant(ev.localStart);
  const end = new Date(start.getTime() + ev.minutes * 60_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//glazedweb//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${ev.uid}`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(ev.title)}`,
    `DESCRIPTION:${esc(ev.description)}`,
    `ORGANIZER;CN=glazedweb:mailto:${organiserEmail}`,
    ev.attendeeEmail ? `ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${ev.attendeeEmail}` : null,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(ev.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((l) => l !== null);
  return lines.map(fold).join("\r\n") + "\r\n";
}

export const icsDataUrl = (ics) => `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
