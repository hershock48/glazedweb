# Contracts

Reference copies of the Glazed Web client agreement.

> ⚠️ **This repository is public.** Anything committed here is readable by anyone.
> Never put a filled-in client agreement, a client's pricing, or a competitor's
> terms in this folder — only the blank template belongs here. Signed contracts
> live in your own files (or a private repo).

## What's here

| File | What it is |
|---|---|
| `Glazed_Web_Client_Agreement_v1.docx` | **The master.** Editable template with bracketed fields. This is the source of truth for the terms. |
| `Glazed_Web_Client_Agreement_v1.pdf` | Rendered copy of the same text. A duplicate is served publicly at `/glazed-web-agreement-v1.pdf` (from `public/`). |
| `build-agreement.js` | Script that generates the .docx. Run it to regenerate the document after editing the terms in code rather than in Word. |

## The three places the terms live — keep them in sync

1. **`contracts/*.docx`** — the master text, and the paper that gets signed for Custom Orders.
2. **`app/agreement/page.jsx`** → published at **glazedweb.com/agreement** — the web mirror. This is what menu-order clients actually accept via the clickwrap on `/order`.
3. **`public/glazed-web-agreement-v1.pdf`** — the downloadable copy linked from that page.

If the terms change, all three change together and the version number goes up in all three. Drift between the page and the paper is exactly the problem v1.0 was written to fix.

## How a client actually agrees

**Menu orders (The Original, The Baker's Dozen).** No document changes hands. The client reads `/agreement`, ticks the unchecked box on `/order`, and the order email records the agreement version and an acceptance timestamp. That's a formed agreement under ESIGN/UETA — the same mechanism as a SaaS signup.

**Custom Orders.** Fill in the bracketed fields in the .docx, complete Exhibit A with the agreed scope and pricing, export to PDF, and send it through an e-signature service. The client signs there; they never open Word.

## Regenerating the document

```bash
node contracts/build-agreement.js          # writes the .docx next to the script's cwd
```

To also refresh the PDF and the public copy:

```bash
soffice --headless --convert-to pdf Glazed_Web_Client_Agreement_v1.docx
cp Glazed_Web_Client_Agreement_v1.pdf public/glazed-web-agreement-v1.pdf
```

## Version history

- **v1.0** (August 2026) — First real version. Client owns the code, content, and accounts on payment in full, with handover of the repo, hosting project, and account logins. Month-to-month after launch, 30 days' notice, no early-termination penalty. Domain held in the client's name and transferred free on request. Deposit-then-balance payment structure. Annual adjustment capped at one increase per twelve months with 30 days' notice. Carve-out preserving Glazed Web's reusable tooling, licensed into the site. Portfolio and footer-credit rights. Michigan law.

  Replaces an earlier unsigned draft in which Glazed Web retained ownership of the website with a $1,000 client buyout — that model was dropped because it contradicted the ownership promise made on the site.

---

*Not legal advice. Worth an hour with a Michigan attorney before real money runs through it.*
