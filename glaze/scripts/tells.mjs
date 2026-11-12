#!/usr/bin/env node
/**
 * The machine-writing checker. Reads the copy a visitor can actually read and flags
 * the patterns that make writing sound like a language model wrote it.
 *
 * Kevin's ruling of 2026-09-13 ("it reads like an AI wrote it") put a list of tells
 * in glaze/standards.md. A list in a document is only as good as the last careful
 * read, and MI Gas's owner reads every line of his site looking for exactly this. So
 * this reads the rendered pages, every time, the same way. The catalog behind each
 * rule, with the sources and the fix for each, is glaze/writing-tells.md.
 *
 * WHAT A HIT MEANS. A "hard" hit is a pattern the house has banned outright
 * (the em dash, the negation reframe, the stock phrases and the worst of the model
 * vocabulary) and fails the run. A "check" hit is a construction that is fine once and
 * a tell as a habit: a list of three, an "X, not Y", a short sentence landing a
 * paragraph. Read those in context and decide. The per-page counts are the point:
 * one antithesis on a page is a style, five is the machine.
 *
 * WHAT IT READS. Everything in <body> once every display:none element is shown and
 * every <details> is opened, because a visitor who opens the FAQ reads the answers and
 * a booking wizard's later steps are copy too. Plus the title, the meta and og
 * descriptions, alt text, placeholders and aria-labels. Lines that repeat on every
 * route (nav, footer) are reported once, under "(shared)".
 *
 * Usage:
 *   node glaze/scripts/tells.mjs --base http://127.0.0.1:4517 --routes /,/consulting
 *   node glaze/scripts/tells.mjs --text draft.txt        # a letter, an email, a note
 *   add --all to list every hit (default: the first 8 per rule per page)
 *   add --json for machine-readable output
 *
 * Point it at a production build, like the auditor (see the top of audit.mjs). Run it
 * from the project being checked; the browser resolves the way the auditor's does.
 * Exit code 1 when any hard hit is found, so it can gate a commit.
 */
import fs from "node:fs";
import { arg } from "./lib/browser.mjs";

const SHOW_ALL = process.argv.includes("--all");
const AS_JSON = process.argv.includes("--json");
const LIMIT = SHOW_ALL ? Infinity : 8;

/* ── Text in ─────────────────────────────────────────────────────────────── */

async function readRoutes(base, routes) {
  const { loadChromium, desktopLaunchOpts } = await import("./lib/browser.mjs");
  const chromium = await loadChromium();
  const browser = await chromium.launch(desktopLaunchOpts());
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const out = [];
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    const got = await page.evaluate(() => {
      const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "HEAD", "META", "LINK", "TITLE", "SVG"]);
      for (const el of document.body.querySelectorAll("*")) {
        if (skip.has(el.tagName.toUpperCase())) continue;
        if (getComputedStyle(el).display === "none") el.style.setProperty("display", "block", "important");
      }
      document.querySelectorAll("details").forEach((d) => (d.open = true));
      const meta = (n) => document.querySelector(`meta[name="${n}"], meta[property="${n}"]`)?.content || "";
      const attrs = (sel, a) => [...document.querySelectorAll(sel)].map((e) => e.getAttribute(a)).filter(Boolean);
      return {
        body: document.body.innerText,
        extra: [
          ["title", document.title],
          ["meta", meta("description")],
          ["og", meta("og:description")],
          ...attrs("img[alt]", "alt").map((t) => ["alt", t]),
          ...attrs("[placeholder]", "placeholder").map((t) => ["placeholder", t]),
          ...attrs("[aria-label]", "aria-label").map((t) => ["aria", t]),
        ],
      };
    });
    const lines = got.body.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const [kind, t] of got.extra) if (t && t.trim()) lines.push(`[${kind}] ${t.trim()}`);
    out.push({ route, lines });
  }
  await browser.close();
  return out;
}

function readText(file) {
  const raw = fs.readFileSync(file, "utf8");
  return [{ route: file, lines: raw.split(/\n\s*\n|\n(?=[-*•] )/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean) }];
}

/* ── Units ───────────────────────────────────────────────────────────────── */

// Curly apostrophes become straight ones first: sites render &rsquo;, and a phrase
// written "let's connect" would otherwise never match "let’s connect".
const strip = (l) => l.replace(/^\[(title|meta|og|alt|placeholder|aria)\] /, "").replace(/[‘’]/g, "'");
// Placeholders, aria-labels and alt text are labels, not prose; the rhythm rules
// (fragments, landings, colons, questions) skip them, the vocabulary rules do not.
const isLabel = (l) => /^\[(placeholder|aria|alt)\] /.test(l) || /^©/.test(l);
const words = (s) => (s.match(/[A-Za-z0-9$%][A-Za-z0-9$%'’.,-]*/g) || []).length;
function sentences(line) {
  return strip(line)
    .split(/(?<=[.!?])\s+(?=[“"‘(A-Z0-9$])/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z]/.test(s));
}

/* ── Rules ───────────────────────────────────────────────────────────────── */
/* Each rule: id, tier, what it is, and a test over a line (paragraph) that returns
   the matching excerpts. Word lists are in glaze/writing-tells.md with sources;
   change them there and here together. */

const W = (list) => new RegExp(`\\b(?:${list.join("|")})\\b`, "gi");

// The model vocabulary. Hard: the words the excess-vocabulary studies and the editors'
// lists agree on, which almost never appear in an owner's own writing about his trade.
const VOCAB_HARD = [
  "delve[sd]?", "delving", "tapestry", "testament", "underscor(?:e|es|ed|ing)", "pivotal", "realm",
  "meticulous(?:ly)?", "seamless(?:ly)?", "elevat(?:e|es|ed|ing)", "unlock(?:s|ed|ing)?", "unleash(?:es|ed|ing)?",
  "empower(?:s|ed|ing|ment)?", "game[- ]chang(?:er|ing)", "transformative", "cutting[- ]edge", "state[- ]of[- ]the[- ]art",
  "supercharg(?:e|es|ed|ing)", "revolutioni[sz](?:e|es|ed|ing)", "groundbreaking", "unparalleled", "synerg(?:y|ies)",
  "paradigm", "ever[- ]evolving", "fast[- ]paced", "nestled", "boasts?", "showcas(?:e|es|ed|ing)", "intricate",
  "commendable", "embark(?:s|ed|ing)?", "harness(?:es|ed|ing)?", "bespoke", "holistic", "myriad", "plethora",
  // 2026: rising on Wikipedia's model-era table, or on the claudisms.ai banlist
  "multifaceted", "north star", "pressure[- ]test(?:s|ed|ing)?", "right[- ]siz(?:e|es|ed|ing)", "load[- ]bearing",
  "earns? (?:its|their) keep",
];
// Check: ordinary words the models lean on. Fine where they are the right word; a cluster is the tell.
const VOCAB_CHECK = [
  "journey", "landscape", "navigat(?:e|es|ed|ing)", "foster(?:s|ed|ing)?", "crucial", "vital", "comprehensive",
  "robust", "leverag(?:e|es|ed|ing)", "streamlin(?:e|es|ed|ing)", "tailored", "curated", "nuanced", "enhanc(?:e|es|ed|ing)",
  "ensur(?:e|es|ed|ing)", "optimi[sz](?:e|es|ed|ing)", "innovative", "dynamic", "vibrant", "invaluable", "proven",
  "trusted", "premier", "world[- ]class", "best[- ]in[- ]class", "industry[- ]leading", "effortless(?:ly)?",
  "moreover", "furthermore", "additionally", "notably", "ultimately", "essentially", "key",
  "dependable", "meaningful", "thoughtful", "steady", "quietly", "prioriti[sz](?:e|es|ed|ing)", "data[- ]driven",
  "expertise", "passionate", "tailored solutions?", "data[- ]driven solutions?",
];

const RULES = [
  {
    id: "em-dash", tier: "hard",
    what: "Em dash, or a spaced en dash used as one. House rule: a period or a comma.",
    test: (l) => (strip(l).match(/[^.]{0,40}(?:\u2014|\s\u2013\s|\s--\s)[^.]{0,40}/g) || []),
  },
  {
    id: "vocab", tier: "hard",
    what: "Model vocabulary the studies and the editors' lists agree on.",
    test: (l) => [...strip(l).matchAll(W(VOCAB_HARD))].map((m) => ctx(l, m)),
  },
  {
    id: "stock-phrase", tier: "hard",
    what: "Stock phrases: openers, reassurances and signposts nobody says out loud.",
    test: (l) => [...strip(l).matchAll(W([
      "whether you(?:'re| are)", "in today's", "look no further", "rest assured", "peace of mind",
      "take (?:it|your \\w+) to the next level", "here's the thing", "the truth is", "let's be honest",
      "at the end of the day", "more than just", "it(?:'s| is) worth noting", "in conclusion", "in summary",
      "simply put", "the best part", "you're not alone", "we've got you covered", "say goodbye to",
      "your one[- ]stop", "not only\\b[^.]{1,60}\\bbut also", "a testament to", "plays? a (?:crucial|key|vital|pivotal) role",
      "in the world of", "when it comes to", "dive (?:in|into|deeper)", "deep dive", "let's (?:dive|explore|break)",
      "it's important to (?:note|remember)", "we'?re (?:passionate|committed|dedicated) (?:about|to)",
      "this matters", "why [\\w' -]{1,30} matters", "is more than (?:a|an|just)", "rather than simply", "looking ahead",
      "adds? another layer", "what comes next", "perhaps the most", "does not (?:by itself )?establish",
      "should not be confused with", "get started today", "let's connect", "feel free to (?:reach out|contact)",
      "we'd love to hear from you", "great question", "the result(?=\\?)", "why choose us", "ready to (?:take|transform|elevate|level)",
      "next level", "in short", "overall(?=,)", "here's why", "here's how",
      "bridges? the gap", "gold standard", "half the battle", "heavy lifting", "crystal clear", "absolutely essential",
      "this comprehensive guide", "together,? these", "ultimately,? this", "another dimension", "is genuinely",
      "every single", "single most", "arguably the most", "one of the best", "paving the way", "simple yet",
      "in the heart of", "commitment to (?:excellence|quality)", "renowned", "diverse array", "what sets us apart",
      "trusted by", "featured in (?:leading|top)", "customers rave", "picture this", "imagine a world",
      "don't hesitate to", "we'd be (?:delighted|happy) to",
    ]))].map((m) => ctx(l, m)),
  },
  {
    id: "negation-reframe", tier: "hard",
    what: "The reframe: \"not X, but Y\", \"it's not X, it's Y\", \"X is not A. It is B.\" The single most reliable tell.",
    test: (l) => {
      const s = strip(l), hits = [];
      for (const re of [
        /\bnot (?:just|only|merely|simply)\b[^.]{0,60}/gi,
        /\b(?:it|this|that)(?:'s| is) not (?:about )?[^.,;]{1,50}[,;.]\s*(?:it|this|that)(?:'s| is)\b[^.]{0,40}/gi,
        /\b(?:is|are|was|were)(?:n't| not) [^.,;]{1,40}\.\s+(?:It|They|That|This|We|You)(?:'s|'re| is| are| was| were)\b[^.]{0,40}/g,
        /\bisn't about\b[^.]{0,60}/gi,
        /\bless (?:about|a matter of) [^.,]{1,40}(?:,| and) more (?:about|a matter of)\b[^.]{0,40}/gi,
      ]) for (const m of s.matchAll(re)) hits.push(m[0]);
      return hits;
    },
  },
  {
    id: "tautology", tier: "hard",
    what: "A tautology dressed as insight (\"remote steering is remote\").",
    test: (l) => [...strip(l).matchAll(/\b([A-Za-z]{4,})\b[^.;:,]{0,24}\b(?:is|are) \1\b/gi)].map((m) => m[0]),
  },
  {
    id: "x-not-y", tier: "check",
    what: "The verdict ending \"..., not Y\" or \"X rather than Y\". Fine rationed (twice a site); a tic past that.",
    test: (l) => {
      const out = [];
      for (const s of sentences(l)) {
        if (/,\s+not\s+(?:a |an |the |on |in )?[\w’' -]{2,48}[.!]?$/i.test(s)) out.push(s);
        else if (/\brather than\b/i.test(s)) out.push(s);
        else if (/\bnot the [\w’' -]{2,30},?\s+(?:but )?the\b/i.test(s)) out.push(s);
      }
      return out;
    },
  },
  {
    id: "vague-authority", tier: "hard",
    what: "Claims credited to nobody: \"studies show\", \"experts agree\", \"industry research\".",
    test: (l) => [...strip(l).matchAll(/\b(?:studies (?:show|suggest|have shown)|research (?:shows|suggests)|experts (?:agree|say|recommend)|industry (?:reports?|research|data) (?:show|suggest)s?|according to (?:experts|industry)|it is widely (?:known|accepted)|many (?:growers|experts|people) (?:say|agree|believe))\b/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "up-to-claim", tier: "check",
    what: "\"Up to N%\" and \"N% more\": trace every number to a record, with its conditions and date.",
    test: (l) => [...strip(l).matchAll(/\b(?:up to|as much as|over|more than)\s+\d[\d,.]*\s*(?:%|x|percent|times)/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "worth", tier: "check",
    what: "\"Worth\" constructions (\"worth noting\", \"worth getting right\"): a 2026 model habit on the banlists.",
    test: (l) => [...strip(l).matchAll(/\b(?:it'?s|it is|is|are|they'?re|that'?s|well) worth (?!\$)\w+/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "team-speak", tier: "check",
    what: "\"Our team\", \"our experts\": true only if there is a team. Match the owner's own pronoun.",
    test: (l) => [...strip(l).matchAll(/\b(?:our (?:team|experts|specialists|professionals)|team of (?:experts|professionals|specialists)|seasoned (?:experts|professionals))\b/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "from-to-sweep", tier: "check",
    what: "A breadth sweep (\"from clone to cure, from design to harvest\"). List what is actually done.",
    test: (l) => [...strip(l).matchAll(/\bfrom [\w-]+(?: [\w-]+)? to [\w-]+(?: [\w-]+)?,\s*(?:and )?from\b[^.]{0,40}/gi)].map((m) => m[0]),
  },
  {
    id: "tradeoff-denial", tier: "check",
    what: "\"X without sacrificing Y\": a 2026 model favorite. State the real mechanism or the real tradeoff.",
    test: (l) => [...strip(l).matchAll(/\bwithout (?:sacrificing|compromising|losing|requiring|the (?:cost|hassle|need))\b[^.]{0,40}/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "counting", tier: "check",
    what: "Announce-then-deliver: \"Three things set us apart\", \"Four things we take over\". Start with the first thing.",
    test: (l) => [...strip(l).matchAll(/\b(?:two|three|four|five|six|seven) (?:things|reasons|ways|steps|keys|pillars|secrets|questions)\b(?! to\b)[^.]{0,40}/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "vague-association", tier: "check",
    what: "A stated relationship replaced by a vague one: \"associated with\", \"in connection with\", \"has worked across\".",
    test: (l) => [...strip(l).matchAll(/\b(?:associated with|in connection with|has worked across|involved in (?:many|various|numerous))\b[^.]{0,40}/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "aphorism", tier: "check",
    what: "A maxim: \"X; it cannot Y\", \"X beats Y\", \"worth more than\". The owner does not talk in them.",
    test: (l) => {
      const s = strip(l), hits = [];
      for (const re of [
        /[^.;]{3,60};\s*(?:it|they|we|you|that) (?:can't|cannot|won't|doesn't|does not|isn't|is not|never)\b[^.]{0,40}/gi,
        /\b[\w”"’']+ beats [\w“"‘']+[^.]{0,30}/gi,
        /[^.]{0,50}\bworth more than\b[^.]{0,50}/gi,
      ]) for (const m of s.matchAll(re)) hits.push(m[0].trim());
      return hits;
    },
  },
  {
    id: "strawman", tier: "check",
    what: "The contrast that corrects nobody: \"Most X do Y. This one does Z.\"",
    test: (l) => [...strip(l).matchAll(/\b(?:most|many|other|typical|every other)\s+[\w-]+(?:\s+[\w-]+)?\s+(?:spend|do|are|make|give|sell|treat|charge|start|waste|ask)\b[^.]*\.\s+(?:this one|we|ours|here)\b[^.]{0,60}/gi)].map((m) => m[0]),
  },
  {
    id: "triad", tier: "check",
    what: "A list of three by habit. Real lists have however many things there are.",
    test: (l) => sentences(l).filter(triad),
  },
  {
    id: "fragments", tier: "check",
    what: "Punchy fragments in a row: two or more sentences of five words or fewer.",
    test: (l) => {
      if (isLabel(l)) return [];
      const ss = sentences(l), out = [];
      for (let i = 0; i + 1 < ss.length; i++) if (words(ss[i]) <= 5 && words(ss[i + 1]) <= 5) out.push(`${ss[i]} ${ss[i + 1]}`);
      return out;
    },
  },
  {
    id: "neat-landing", tier: "check",
    what: "A paragraph that lands on a short closing line. Once is fine; as a rhythm it is a machine.",
    test: (l) => {
      const ss = sentences(l);
      if (ss.length < 3) return [];
      const last = ss[ss.length - 1], rest = ss.slice(0, -1);
      const avg = rest.reduce((n, s) => n + words(s), 0) / rest.length;
      return words(last) <= 8 && words(last) < avg * 0.6 ? [last] : [];
    },
  },
  {
    id: "colon-reveal", tier: "check",
    what: "A short setup, a colon, then the reveal.",
    // A label ("Lights: type and wattage") or a list after the colon is fine. The tell is
    // a short setup and a short payoff: "One rule: the room comes first."
    test: (l) => (isLabel(l) ? [] : sentences(l).filter((s) => {
      const m = s.match(/^([^:]{3,48}): (.+?)[.!]$/);
      return m && words(m[1]) <= 7 && words(m[2]) <= 6 && !m[2].includes(",");
    })),
  },
  {
    id: "rhetorical-q", tier: "check",
    what: "A question the copy then answers itself (\"Not sure yet? ...\").",
    test: (l) => {
      if (isLabel(l)) return [];
      const s = strip(l);
      return [...s.matchAll(/(?:^|[.!]\s+)([^.?!]{3,80}\?)\s+([A-Z][^?]*?[.!])(?=\s|$)/g)].map((m) => `${m[1]} ${m[2]}`);
    },
  },
  {
    id: "personification", tier: "check",
    what: "Things doing what people do. Say who did what.",
    test: (l) => [...strip(l).matchAll(/\b(?:the|your|our|this|a|every) (?:room|page|form|call|site|data|numbers?|program|loop|plan|feed|canopy|calendar|grid|intake|profile|tier|sensors?|kitchen|menu|brand|website|work|light|plant)s? (?:answers?|knows?|decides?|prices?|argues?|wants?|believes?|earns?|speaks?|listens?|remembers?|waits?|demands?|deserves?|loves?|thinks?|breathes?|forgives?|rewards?|promises?|lands?)\b/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "chiasmus", tier: "check",
    what: "Mirror construction (\"the room never waits on the crew and the crew never waits on the room\").",
    test: (l) => sentences(l).filter(chiasmus),
  },
  {
    id: "sincerity", tier: "check",
    what: "Sincerity markers and intensifiers: honest, actually, truly, genuinely, really.",
    test: (l) => [...strip(l).matchAll(/\b(?:honest(?:ly)?|genuine(?:ly)?|truly|actually|really|literally)\b/gi)].map((m) => ctx(l, m)),
  },
  {
    id: "ing-tail", tier: "check",
    what: "A participle tail that editorializes (\", highlighting its importance\").",
    test: (l) => [...strip(l).matchAll(/, (?:highlighting|underscoring|showcasing|emphasizing|reflecting|demonstrating|ensuring|making it|allowing (?:you|them|us)|enabling|cementing|solidifying)\b[^.]{0,60}/gi)].map((m) => m[0]),
  },
  {
    id: "soft-vocab", tier: "check",
    what: "Ordinary words the models lean on. Right word sometimes; a cluster is the tell.",
    test: (l) => [...strip(l).matchAll(W(VOCAB_CHECK))].map((m) => ctx(l, m)),
  },
  {
    id: "exclamation", tier: "check",
    what: "Exclamation marks in copy.",
    test: (l) => (strip(l).includes("!") ? [strip(l).slice(0, 90)] : []),
  },
];

/* Exactly three short items, the last joined by "and" or "or": the rhythmic triad
   ("one room, one problem, an answer this week"). The tail of a longer list ("rooms,
   lights, media, feed and photos") is a real list and is left alone. So are three
   clauses ("your sensors report, we set the numbers, and your grower runs them"), which
   is a sentence, and three numbers in a row, which is usually a spec. The first item
   is judged by its last few words, because a list usually starts after the verb. */
const CLAUSE = /^(?:set|by|from|with|for|to|in|on|at|of|when|if|so|that|which|who|where|because|while|as|we|you|they|it|i|he|she)\b/i;
function triad(s) {
  const body = s.replace(/^[^:]{1,40}:\s*/, "").replace(/[.!?]$/, "");
  const parts = body.split(/,\s*/);
  const last = parts[parts.length - 1];
  let items;
  if (/^(?:and|or) /.test(last)) items = [...parts.slice(0, -1), last.replace(/^(?:and|or) /, "")];
  else {
    const m = last.match(/^(.*) (?:and|or) (.*)$/);
    if (!m) return false;
    items = [...parts.slice(0, -1), m[1], m[2]];
  }
  if (items.length !== 3 || /\d.*\d.*\d/.test(body)) return false;
  const len = (t) => t.trim().split(/\s+/).length;
  return len(items[1]) <= 5 && len(items[2]) <= 5 && items.slice(1).every((t) => !CLAUSE.test(t.trim()));
}

const STOP = new Set("the a an and or of to in on for with your our we you is are it that this be as at by from it's".split(" "));
function chiasmus(s) {
  const t = (s.toLowerCase().match(/[a-z’']+/g) || []).filter((w) => w.length >= 4 && !STOP.has(w));
  const pos = {};
  t.forEach((w, i) => (pos[w] = pos[w] || []).push(i));
  const twice = Object.entries(pos).filter(([, p]) => p.length === 2);
  // A B ... B A, with the two halves built the same way: the gap between A and B on
  // the way in about equal to the gap between B and A on the way out.
  for (const [, [a1, a2]] of twice)
    for (const [, [b1, b2]] of twice)
      if (a1 < b1 && b1 < b2 && b2 < a2 && a2 - a1 <= 20 && Math.abs((b1 - a1) - (a2 - b2)) <= 2) return true;
  return false;
}
function ctx(l, m) {
  const s = strip(l), i = m.index ?? 0;
  return (i > 30 ? "…" : "") + s.slice(Math.max(0, i - 30), i + m[0].length + 30) + (i + m[0].length + 30 < s.length ? "…" : "");
}

/* ── Repetition, counted the way glaze.md says copy is counted ───────────── */

function repeats(lines) {
  const counts = new Map();
  for (const l of lines) {
    const t = strip(l).toLowerCase().match(/[a-z0-9’']+/g) || [];
    const seen = new Set();
    for (let n = 3; n <= 4; n++)
      for (let i = 0; i + n <= t.length; i++) {
        const g = t.slice(i, i + n);
        if (STOP.has(g[0]) || STOP.has(g[n - 1]) || g.some((w) => /\d/.test(w))) continue;
        const k = g.join(" ");
        if (seen.has(k)) continue;
        seen.add(k);
        counts.set(k, (counts.get(k) || 0) + 1);
      }
  }
  return [...counts].filter(([, c]) => c > 2).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${c}x "${k}"`);
}

/* ── Rhythm: uniform sentence length is the "burstiness" detectors measure ─ */

function rhythm(lines) {
  const lens = lines.flatMap(sentences).map(words).filter((n) => n >= 3);
  if (lens.length < 5) return null;
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
  return { sentences: lens.length, mean: +mean.toFixed(1), sd: +sd.toFixed(1), cv: +(sd / mean).toFixed(2) };
}

/* ── Run ─────────────────────────────────────────────────────────────────── */

const textFile = arg("text", null);
const pages = textFile
  ? readText(textFile)
  : await readRoutes(arg("base", "http://127.0.0.1:4490"), arg("routes", "/").split(",").map((r) => r.trim()).filter(Boolean));

// Lines on two or more routes are site chrome; report them once.
const seenOn = new Map();
for (const p of pages) for (const l of new Set(p.lines)) seenOn.set(l, (seenOn.get(l) || 0) + 1);
const shared = pages.length > 1 ? [...seenOn].filter(([, n]) => n > 1).map(([l]) => l) : [];
const units = [
  ...pages.map((p) => ({ route: p.route, lines: [...new Set(p.lines)].filter((l) => !shared.includes(l)) })),
  ...(shared.length ? [{ route: "(shared)", lines: shared }] : []),
];

const report = units.map((u) => {
  const hits = RULES.map((r) => ({ id: r.id, tier: r.tier, what: r.what, found: u.lines.flatMap((l) => r.test(l)) })).filter((h) => h.found.length);
  const wordCount = u.lines.reduce((n, l) => n + words(strip(l)), 0);
  return { route: u.route, words: wordCount, rhythm: rhythm(u.lines), repeats: repeats(u.lines), hits };
});

if (AS_JSON) {
  console.log(JSON.stringify(report, null, 1));
} else {
  for (const r of report) {
    const rh = r.rhythm ? `, sentences ${r.rhythm.mean} ± ${r.rhythm.sd} words (cv ${r.rhythm.cv})` : "";
    console.log(`\n=== ${r.route}  ${r.words} words${rh}`);
    for (const h of r.hits) {
      console.log(`  ${h.tier === "hard" ? "HARD " : "check"}  ${h.id} x${h.found.length}`);
      for (const f of h.found.slice(0, LIMIT)) console.log(`         ${f.length > 150 ? f.slice(0, 147) + "..." : f}`);
      if (h.found.length > LIMIT) console.log(`         (+${h.found.length - LIMIT} more, --all to list)`);
    }
    if (r.repeats.length) console.log(`  check  repeats  ${r.repeats.slice(0, 6).join(", ")}`);
  }
  console.log("\n--- summary (hard / check / per 100 words)");
  for (const r of report) {
    const hard = r.hits.filter((h) => h.tier === "hard").reduce((n, h) => n + h.found.length, 0);
    const check = r.hits.filter((h) => h.tier === "check").reduce((n, h) => n + h.found.length, 0) + r.repeats.length;
    console.log(`  ${r.route.padEnd(28)} ${String(hard).padStart(3)} ${String(check).padStart(4)}   ${r.words ? ((100 * (hard + check)) / r.words).toFixed(1) : "-"}`);
  }
}
const anyHard = report.some((r) => r.hits.some((h) => h.tier === "hard"));
process.exit(anyHard ? 1 : 0);
