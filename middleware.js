import { NextResponse } from "next/server";

// Language routing for the Dominican Republic page at /do.
//
// The order of precedence, most binding first:
//   1. ?lang= on a toggle link: the visitor just chose. Store it in a
//      cookie for a year and redirect to the clean URL.
//   2. The gw-locale cookie, a choice made earlier, on any visit.
//   3. Geography: Vercel stamps every request with x-vercel-ip-country.
//      A first-time visitor from the DR gets the Spanish page.
//
// Geo-IP is only ~95% right (VPNs, carriers routing through Miami), which is
// exactly why the header toggle exists and why its cookie outranks geography.
// Locally the header is absent, so dev always sees the English page unless
// the cookie or ?lang= says otherwise.
const COOKIE = "gw-locale";
const YEAR = 60 * 60 * 24 * 365;

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const lang = searchParams.get("lang");

  if ((pathname === "/" && lang === "en") || (pathname === "/do" && lang === "es")) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("lang");
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE, lang, { maxAge: YEAR, path: "/" });
    return res;
  }

  if (pathname === "/") {
    const saved = req.cookies.get(COOKIE)?.value;
    if (saved === "es") return NextResponse.redirect(new URL("/do", req.url));
    if (saved === "en") return NextResponse.next();
    if (req.headers.get("x-vercel-ip-country") === "DO") {
      // No cookie set here: this is a default, not a choice. If geo guessed
      // wrong, the visitor taps EN once and the cookie takes over for good.
      return NextResponse.redirect(new URL("/do", req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/do"] };
