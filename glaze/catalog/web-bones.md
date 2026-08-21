# Web bones: components and flows worth a session

| Bone | Lives in | What it is |
|---|---|---|
| Glazed credit + plate | `glaze/assets/glazed-credit/` | The studio credit, JSX/TSX/CSS, drip edge included. Already canonical — the model for how a bone graduates. |
| Year counter | `Schulers/components/YearCount.jsx` | Count-up number with a visibility-gated rAF clock and a solved cubic-bezier. Survived three broken mechanisms (scroll-scrubbed, fired-once timer, WebKit-frozen CSS counter); its header records all three. Read it before building ANY count-up. |
| Inline reserve strip | `Schulers/components/ReserveStrip.jsx` | Homepage booking entry that carries choices into the real form instead of pretending to check availability. The mobile grid layout is load-bearing — see the 620px comment for the iOS collapse it fixes. |
| Reservation + host stand | `Schulers/app/reservations/`, `app/host/` | Booking form on one side, tonight's covers by half-hour on any tablet on the other; slots self-mark full. |
| Banquet inquiry | `Schulers/components/BanquetInquiry.jsx` | Event inquiry that narrows to the rooms that fit and reroutes oversize parties. |
| Gift card flow | `Schulers/components/GiftCardForm.jsx` | Amount / recipient / message / delivery-date with demo checkout. |
| Open-now badge | `Schulers/components/OpenNow.jsx` | Hours logic rendered as a live open/closed state. |
| Self-drawing artwork | `Schulers/components/BuildingInk.jsx`, `CrestSignature.jsx` | The rendered halves of the pipelines in pipelines.md. |
| Magic-link auth | `beanumber/src/app/signin/` + `/api/sponsor/recover/` | Email link → session cookie → deep-link to the page the email promised; the token carries the destination. Sign-in-first with intent passthrough (`?intent=sponsor` rides to checkout). |
| Gated documents | `beanumber/src/app/children/[number]/ChildDocuments.tsx` + the gate in `page.tsx` | Entitlement enforced at the data layer so public-by-URL storage links never reach an anon payload. The pattern, not just the component. |
| Penpal engine | `beanumber/src/app/children/[number]/` (PenpalBox and kin) | Correspondence UI with per-viewer states (anon / holder / sponsor), each carrying exactly one ask. |
| Dietary/menu data | `pjs`, `cookinwithbeans`, `copperac`, `stagecoach`, `Schulers` | Menu-as-data with prices in mono, leaders drawn by scroll. The shape recurs; the newest copy is usually the best. |
| Cart + checkout (Stripe) | `sprinklesandsparklesbb/app/` (digital downloads, webhook-gated), `louies/app/` (physical + shipping), `superduper/app/`, `kidniche/app/` | Four carts at different weights. sprinkles is the reference for digital delivery: `/api/download/[slug]` gated on the Stripe webhook. |
| Quote engine | `anchor/app/quote/`, `/api/quote` | Multi-step insurance quote intake with a received state and a ledger. |
| PIP calculator | `anchor/app/tools/michigan-pip/` | A public calculator as a content-marketing tool — the shape for "useful widget that earns links." |
