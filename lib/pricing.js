// Every price the studio publishes, in one place, per glaze.md's "facts live
// in one place" rule. A price change is an edit here and nowhere else.
//
// Two markets. US prices are the menu in dollars. DR prices are pesos, set
// 22 Aug 2026 at ~RD$58.5/US$ and rounded so the market anchor is exactly
// double the build price; if the peso drifts far from that rate, this file
// is where the nudge happens.
//
// Surfaces that CANNOT read from this file, so a price change must visit
// them by hand:
//   - glaze.md section 2 (the menu table, prose)
//   - glaze/proposal.md and any sent proposal documents
//   - contracts/ (prices ride in per-order Exhibit A, not the master)
export const PRICING = {
  us: {
    // Monthlies raised and the dozen build rounded to 2k per Kevin
    // 2026-09-01: "2k and 150/mo has almost been the standard for me
    // lately". Market anchors unchanged.
    original: { build: 750, market: 1500, monthly: 99 },
    dozen: { build: 2000, market: 3900, monthly: 150 },
  },
  do: {
    original: { build: 45000, market: 90000, monthly: 3500 },
    dozen: { build: 115000, market: 230000, monthly: 6000 },
  },
};

// Display helpers. The DR writes thousands with commas the same way the US
// does, so one grouping format serves both markets.
export const usd = (n) => `$${n.toLocaleString("en-US")}`;
export const rd = (n) => `RD$${n.toLocaleString("en-US")}`;
export const num = (n) => n.toLocaleString("en-US");
