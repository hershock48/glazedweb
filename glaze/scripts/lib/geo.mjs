/**
 * Geography and sourcing bones for the scout and the selector.
 *
 * Two free services, no keys: Nominatim geocodes a town name, Overpass lists
 * the food and drink businesses OpenStreetMap knows around a point, with
 * whatever tags mappers gave them. Both want a real User-Agent and a polite
 * pace; Nominatim's published limit is one request a second, so anchors are
 * cached in the pool and looked up once.
 *
 * OpenStreetMap is a seed, not a census. Around Jackson it knew Hinkley
 * Bakery and not Schlenker's. The scout fills the pool; a name that is not
 * there gets added by hand with `ledger.mjs add`, the way the statewide scan
 * names were.
 */

export const UA = "glazedweb-scout/0.1 (kevin@glazedweb.com)";

// The studio. Distances in the pool are measured from here, because that is
// what the proximity signal on the scorecard is about (30 minutes: 2 points,
// 60 minutes: 1, farther: 0). Kevin, 2026-09-13: pair a letter with a stop-in,
// so the day's five sit within one drive.
export const HOME = { name: "Marshall, Michigan", lat: 42.2723, lon: -84.9633 };

export const EARTH_MI = 3958.8;
export function miles(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_MI * Math.asin(Math.sqrt(h));
}

export async function geocode(place) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1&countrycodes=us`;
  const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`geocode: ${r.status} for "${place}"`);
  const j = await r.json();
  if (!j.length) throw new Error(`geocode: nothing found for "${place}"`);
  return { name: place, lat: Number(j[0].lat), lon: Number(j[0].lon), label: j[0].display_name };
}

// The kinds the studio sells to (standards.md, "Who the menu is for now"):
// places that take or could take orders. Bars are in because most have a
// kitchen; the order-shaped signal sorts them later.
export const AMENITIES = ["restaurant", "cafe", "fast_food", "bar", "pub", "ice_cream"];
export const SHOPS = ["bakery", "florist", "butcher", "deli", "confectionery", "coffee", "pastry", "farm", "greengrocer", "cheese", "chocolate"];

export async function overpass(center, radiusMiles) {
  const m = Math.round(radiusMiles * 1609.34);
  const at = `(around:${m},${center.lat},${center.lon})`;
  const q = `[out:json][timeout:90];(nwr["amenity"~"^(${AMENITIES.join("|")})$"]${at};nwr["shop"~"^(${SHOPS.join("|")})$"]${at};);out center tags;`;
  const r = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(q)}`,
    signal: AbortSignal.timeout(120000),
  });
  if (!r.ok) throw new Error(`overpass: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  return j.elements
    .filter((e) => e.tags?.name)
    .map((e) => {
      const t = e.tags;
      const lat = e.lat ?? e.center?.lat;
      const lon = e.lon ?? e.center?.lon;
      return {
        id: `${e.type}/${e.id}`,
        name: t.name,
        kind: t.amenity || t.shop,
        cuisine: t.cuisine || "",
        brand: t.brand || t["brand:wikidata"] ? t.brand || "brand" : "",
        lat,
        lon,
        town: t["addr:city"] || "",
        address: [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" "),
        phone: t.phone || t["contact:phone"] || "",
        website: t.website || t["contact:website"] || "",
        facebook: t["contact:facebook"] || "",
        hours: t.opening_hours || "",
        takeaway: t.takeaway || "",
        delivery: t.delivery || "",
      };
    })
    .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon));
}

// Chains without a brand tag still slip through OSM. A short list of the
// ones that showed up in the first scans; add as they appear. Frosty Boy and
// Lefty's are Michigan franchises and the card disqualifies a franchise
// whoever owns the unit.
export const CHAIN_NAMES = /^(frosty boy|lefty's|mcdonald|burger king|wendy|taco bell|subway|arby|panera|biggby|starbucks|dunkin|tim hortons|little caesars|domino|pizza hut|papa john|jimmy john|jet's pizza|hungry howie|culver|dairy queen|kfc|popeyes|chick-fil-a|sonic|a&w|applebee|olive garden|red lobster|buffalo wild wings|chili's|ihop|denny|bob evans|cracker barrel|big boy|steak 'n shake|qdoba|chipotle|five guys|firehouse|penn station|potbelly|noodles|cottage inn|marco's|tropical smoothie|smoothie king|jersey mike|wingstop|leo's coney|national coney|coney island|speedway|7-eleven|kroger|meijer|walmart|sam's club|costco|whole foods|trader joe|aldi|save-a-lot)/i;

// ---------------------------------------------------------------- site check

// What a domain says about a business, the way prospecting.md scores it:
// none (no site anywhere) and dead/parked both mean the top of the presence
// gap; a free builder subdomain or a Facebook page is a 2; a live site with
// third-party ordering is the rented-stack hook; a live site with its own
// ordering is a stop.
// Calibrated 2026-09-13 against masondepotdiner.com (title "MasonDepotDiner.com
// Is For Sale", no "domain" in it), mikesplace.com (200 with a 114-byte body
// and no title: squatted), jacksoncoffeeco.com (404, "Squarespace - Website
// Expired"), nipnsipdrive-in.com (connection refused).
export const PARKED = /(\bis for sale\b|buy this domain|hugedomains|godaddy\.com\/domainsearch|parked free|sedoparking|afternic|dan\.com|this domain is parked|domain parking|make an offer on this domain|website expired|coming soon<\/title>|under construction<\/title>)/i;
export const FREE_HOST = /(wixsite\.com|weebly\.com|squarespace\.com|godaddysites\.com|business\.site|wordpress\.com|webnode|site123|strikingly|carrd\.co|linktr\.ee|facebook\.com|instagram\.com|yelp\.com|doordash\.com|grubhub\.com|toasttab\.com)/i;
export const THIRD_PARTY = /(doordash|grubhub|ubereats|uber eats|postmates|slice(life)?\.com|chownow|ezcater)/i;
export const OWN_ORDERING = /(toasttab\.com|order\.toasttab|clover\.com|clovercom|squareup\.com|square\.site|order\.online|olo\.com|popmenu|bentobox|menufy|hungerrush|revel|skytab|heartland)/i;

export function guessDomain(name) {
  const base = name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
  return base ? `${base}.com` : "";
}

export async function probeSite(hostOrUrl) {
  const urls = /^https?:\/\//.test(hostOrUrl) ? [hostOrUrl] : [`https://${hostOrUrl}`, `http://${hostOrUrl}`];
  let err = "";
  for (const url of urls) {
    try {
      const r = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; glazedweb-scout/0.1)" },
      });
      const body = (await r.text()).slice(0, 300000);
      const title = (body.match(/<title[^>]*>([^<]*)/i) || [])[1]?.trim() || "";
      const finalUrl = r.url || url;
      let state;
      if (r.status >= 400) state = "dead";
      else if (PARKED.test(body) || PARKED.test(title)) state = "parked";
      else if (body.length < 600 && !title) state = "empty";
      else if (FREE_HOST.test(finalUrl)) state = "free-host";
      else state = "live";
      const ownOrdering = OWN_ORDERING.test(body);
      const thirdParty = THIRD_PARTY.test(body);
      return { url: finalUrl, status: r.status, state, title, bytes: body.length, ownOrdering, thirdParty, scripts: (body.match(/<script/gi) || []).length };
    } catch (e) {
      err = `${e.name}: ${e.message}`;
    }
  }
  return { url: urls[0], state: "dead", err };
}
