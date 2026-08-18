const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, LevelFormat, Table, TableRow, TableCell, WidthType, ShadingType,
} = require("docx");
const fs = require("fs");

const INK = "2B1E16";
const PINK = "CE3672";
const FERN = "55974A";
const GREY = "8A7663";

const FONT = "Calibri";

// ---------- helpers ----------
const t = (text, opts = {}) => new TextRun({ text, font: FONT, ...opts });

const p = (children, opts = {}) =>
  new Paragraph({ children: Array.isArray(children) ? children : [children], spacing: { after: 160, line: 276 }, ...opts });

const body = (text, opts = {}) => p(t(text, { size: 21, color: "3A2C22" }), opts);

const h1 = (text) =>
  new Paragraph({
    children: [t(text, { size: 26, bold: true, color: INK })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 140 },
  });

// numbered clause: "1. Title" then paragraphs
const clause = (n, title) =>
  new Paragraph({
    children: [t(`${n}. ${title}`, { size: 24, bold: true, color: INK })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 130 },
  });

const sub = (letter, text, lead) =>
  new Paragraph({
    children: [
      ...(letter ? [t(`${letter}. `, { size: 21, bold: true, color: INK })] : []),
      ...(lead ? [t(lead + " ", { size: 21, bold: true, color: INK })] : []),
      t(text, { size: 21, color: "3A2C22" }),
    ],
    spacing: { after: 150, line: 276 },
    indent: { left: 340 },
  });

const bullet = (text) =>
  new Paragraph({
    children: [t(text, { size: 21, color: "3A2C22" })],
    numbering: { reference: "gw-bullets", level: 0 },
    spacing: { after: 90, line: 276 },
  });

const rule = () =>
  new Paragraph({
    text: "",
    spacing: { before: 60, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 6, color: "E0D5C7" } },
  });

const fill = (label, width = 34) =>
  p([
    t(label, { size: 21, color: GREY }),
    t(" " + "_".repeat(width), { size: 21, color: INK }),
  ], { spacing: { after: 240 } });

// signature block cell
const sigCell = (heading, lines) =>
  new TableCell({
    width: { size: 4680, type: WidthType.DXA },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    },
    children: [
      p(t(heading, { size: 20, bold: true, color: FERN, allCaps: true }), { spacing: { after: 260 } }),
      ...lines.map((l) =>
        p([t("_".repeat(30), { size: 21, color: INK })], { spacing: { after: 40 } }) &&
        new Paragraph({
          children: [t("_".repeat(30), { size: 21, color: "C9BBAA" })],
          spacing: { after: 30 },
        })
      ).flatMap((para, i) => [para, p(t(lines[i], { size: 18, color: GREY }), { spacing: { after: 200 } })]),
    ],
  });

// ---------- document ----------
const doc = new Document({
  creator: "Glazed Web",
  title: "Website Design & Services Agreement",
  description: "Glazed Web client agreement, v1.0",
  numbering: {
    config: [
      {
        reference: "gw-bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 620, hanging: 260 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: 21, color: "3A2C22" } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1100, bottom: 1100, left: 1200, right: 1200 },
        },
      },
      children: [
        // ---- masthead ----
        p([t("GLAZED WEB", { size: 22, bold: true, color: INK, characterSpacing: 60 })], {
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
        }),
        p([t("websites, fresh daily  ·  Marshall, Michigan  ·  glazedweb.com", { size: 17, color: GREY })], {
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
        p([t("Website Design & Services Agreement", { size: 34, bold: true, color: INK })], {
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        p([t("Version 1.0  ·  Effective August 2026", { size: 18, color: PINK })], {
          alignment: AlignmentType.CENTER,
          spacing: { after: 260 },
        }),
        rule(),

        // ---- parties ----
        body(
          "This Website Design & Services Agreement (the “Agreement”) is made effective as of the date of the last signature below (the “Effective Date”), by and between:"
        ),
        sub("", "Kevin Hershock, doing business as Glazed Web (“Glazed Web” or “Provider”), of Marshall, Michigan; and", "Provider:"),
        sub("", "[CLIENT LEGAL NAME] (“Client”), of [CLIENT ADDRESS], represented by [CONTACT NAME], [TITLE].", "Client:"),
        body(
          "Provider and Client may each be referred to as a “Party” and together as the “Parties.” This Agreement is written to be read and understood without a lawyer. If anything in it is unclear, ask before signing."
        ),

        // ---- the short version ----
        h1("The short version"),
        body("The full terms follow, but here is the whole deal in five lines:"),
        bullet("You own it all. When the build fee is paid in full, the website is yours: code, content, and accounts."),
        bullet("No lock-in. The monthly fee covers hosting and care. It is month-to-month; cancel anytime and keep your site."),
        bullet("Your domain is yours, held in your name where possible, and transferred to you free whenever you ask."),
        bullet("Two revision rounds are included in the build. Anything beyond the agreed scope is quoted before work starts."),
        bullet("No surprise invoices. Prices are what is written below."),
        body(
          "If any part of this summary ever appears to conflict with the detailed terms below, the detailed terms govern, though they were written to say the same thing."
        ),

        // ---- 1 SERVICES ----
        clause(1, "The Work"),
        sub("a", "Provider will design, develop, and launch a custom website for Client (the “Website”), to be published at [DOMAIN]. The Website will include the pages and features described in Exhibit A (Scope), or, if no Exhibit A is attached, the package selected by Client from Provider’s published menu at glazedweb.com.", "Website."),
        sub("b", "The build fee includes up to two (2) rounds of revisions to the design before launch. Additional revision rounds, new pages, or features beyond the agreed scope will be quoted and approved by Client in writing before any work begins.", "Revisions."),
        sub("c", "Provider will use reasonable efforts to launch the Website within the timeframe the Parties agree in writing, subject to Client meeting its responsibilities in Section 6. Projects most often stall on content; timelines assume Client provides materials and feedback promptly.", "Launch."),
        sub("d", "Provider will build the Website to be mobile-responsive, reasonably fast, and technically prepared for search engines (including submission of a sitemap and basic on-page structure). Provider does not guarantee rankings. See Section 7.", "Standards."),

        // ---- 2 FEES ----
        clause(2, "Fees & Payment"),
        sub("a", "Client will pay a one-time build fee of $[BUILD FEE] for the design and development of the Website.", "Build fee."),
        sub("b", "A deposit of $[DEPOSIT] is due before work begins and is credited against the build fee. The remaining balance is due upon launch of the Website. Provider will invoice each amount; invoices are payable within fifteen (15) days of receipt.", "Deposit and balance."),
        sub("c", "Beginning the first day of the month following launch, Client will pay a monthly service fee of $[MONTHLY FEE], due on the first (1st) of each month.", "Monthly service fee."),
        sub("d", "The monthly fee includes: (i) website hosting, including an SSL certificate; (ii) software and security updates, monitoring, and periodic backups; (iii) registration and renewal of the Domain, if Provider registers it under Section 5; and (iv) minor content edits requested by Client, for example updated hours, prices, photos, or text, up to [EDIT ALLOWANCE] per month. Unused edit time does not roll over.", "What the monthly fee covers."),
        sub("e", "Work beyond the included services will be billed at Provider’s then-current rate of $[HOURLY RATE] per hour, quoted and approved by Client in advance. Nothing is added to Client’s bill without approval.", "Additional work."),
        sub("f", "Provider may adjust the monthly service fee no more than once per twelve (12) months, by no more than [ANNUAL ADJUSTMENT]%, with at least thirty (30) days’ written notice. If Client does not accept an adjustment, Client may terminate under Section 3(b) with no penalty.", "Annual adjustment."),
        sub("g", "If any payment is more than fifteen (15) days past due, Provider may, after written notice to Client, pause work and pause hosting until the account is brought current. Pausing does not waive amounts owed, and Provider will not delete Client Content or the Website during a pause.", "Late payment."),

        // ---- 3 TERM ----
        clause(3, "Term & Termination"),
        sub("a", "This Agreement begins on the Effective Date and continues through launch of the Website, then continues on a month-to-month basis.", "Term."),
        sub("b", "Either Party may end the monthly service for any reason with thirty (30) days’ written notice. There is no minimum term after launch, no early-termination fee, no penalty for remaining months, and no automatically renewing multi-year commitment.", "Ending the monthly service."),
        sub("c", "Either Party may terminate this Agreement if the other Party materially breaches it and fails to cure the breach within fifteen (15) days of receiving written notice describing it.", "Termination for breach."),
        sub("d", "On termination, Client will pay all amounts owed through the effective date of termination. Sections 4 (Ownership), 5 (Domain), 7 (Warranties & Limitations), and 8 (General) survive termination. If the build fee has been paid in full, Client keeps the Website under Section 4. Termination of hosting and care does not affect Client’s ownership.", "Effect of termination."),

        // ---- 4 OWNERSHIP ----
        clause(4, "Ownership: You Own It All"),
        sub("a", "Client owns all content it provides, including its business name, logos, photographs, text, menus, and pricing (“Client Content”), at all times and without condition. Provider claims no rights in Client Content and will return or make it available at no charge on request.", "Client content."),
        sub("b", "Upon payment of the build fee in full, Provider assigns to Client all of Provider’s right, title, and interest in the Website created for Client, including its design, layout, source code, templates, and configuration (together the “Deliverables”), and the Deliverables become Client’s property. Provider will execute any documents reasonably needed to confirm this assignment.", "You own the Website."),
        sub("c", "On Client’s request, Provider will hand over the complete working project: the source-code repository, the hosting project, and the login credentials for any accounts Provider created on Client’s behalf. Client receives the live, working project, not a static snapshot or an export.", "Handover."),
        sub("d", "The monthly service fee buys hosting and care. It does not buy the right to hold the Website. If Client stops paying the monthly fee, the Website remains Client’s property, and Provider will reasonably assist in moving it to a host of Client’s choosing (migration work beyond a reasonable handover may be quoted under Section 2(e)).", "The monthly fee is not a leash."),
        sub("e", "Provider retains ownership of general-purpose tools, libraries, and know-how that pre-existed this project or that Provider develops for general use, and grants Client a perpetual, royalty-free license to use those components as incorporated in the Website. This clause exists so Provider can keep using its own toolkit. It does not limit Client’s ownership of the Website itself.", "Provider’s general tools."),
        sub("f", "Provider may display the completed Website in its portfolio and state that Provider built it, and may include a small “site baked by glazedweb” credit in the Website footer. Provider will remove the credit at Client’s request. Provider will not use Client Content in marketing materials beyond portfolio display without Client’s consent.", "Portfolio & credit."),

        // ---- 5 DOMAIN ----
        clause(5, "Domain Name"),
        sub("a", "If Provider registers the Domain on Client’s behalf, Provider will register it in Client’s name where the registrar allows and will keep it renewed for the duration of this Agreement. Registration and renewal costs are included in the monthly service fee.", "Registration."),
        sub("b", "The Domain exists for the benefit of Client’s business. On Client’s request, Provider will transfer the Domain to a registrar account Client designates, at no charge, within fourteen (14) days. If a balance is outstanding, Provider will complete the transfer promptly once it is paid.", "Transfer."),
        sub("c", "Provider will not sell, encumber, or withhold the Domain, and will not intentionally allow it to lapse during the term of this Agreement.", "No hostage-taking."),

        // ---- 6 CLIENT RESPONSIBILITIES ----
        clause(6, "Client Responsibilities"),
        sub("a", "Client will provide the content, images, information, and feedback reasonably needed for Provider to build and maintain the Website, in a timely manner.", "Materials."),
        sub("b", "Client represents that it owns or has permission to use all Client Content it provides, that it is accurate, and that it does not infringe the rights of any third party.", "Rights."),
        sub("c", "Client will designate one primary point of contact authorized to approve designs and request changes.", "Point of contact."),

        // ---- 7 WARRANTIES ----
        clause(7, "Warranties & Limitations"),
        sub("a", "Provider will perform all services in a professional and workmanlike manner and will use reasonable efforts to keep the Website available and functioning.", "Provider’s commitment."),
        sub("b", "Provider does not guarantee uninterrupted availability, specific search-engine rankings, traffic levels, or business results. No one honestly can.", "No guarantees."),
        sub("c", "To the maximum extent permitted by law, neither Party will be liable to the other for indirect, incidental, or consequential damages, and Provider’s total liability under this Agreement will not exceed the total fees paid by Client to Provider in the twelve (12) months preceding the claim.", "Limitation of liability."),
        sub("d", "Each Party will keep confidential the non-public business information of the other that it learns through this Agreement, and will use it only to perform under this Agreement.", "Confidentiality."),

        // ---- 8 GENERAL ----
        clause(8, "General"),
        sub("a", "Provider is an independent contractor, not an employee, partner, or agent of Client.", "Independent contractor."),
        sub("b", "This Agreement is governed by the laws of the State of Michigan, without regard to its conflict-of-laws rules.", "Governing law."),
        sub("c", "This Agreement, together with any Exhibit A, is the entire agreement between the Parties on this subject and replaces any prior drafts, proposals, or discussions. Changes must be in writing and signed by both Parties.", "Entire agreement."),
        sub("d", "If any provision is found unenforceable, the rest of this Agreement remains in effect.", "Severability."),
        sub("e", "Neither Party may assign this Agreement without the other’s written consent, except that Client’s rights transfer with a sale of Client’s business.", "Assignment."),
        sub("f", "Neither Party is liable for delays caused by events beyond its reasonable control.", "Force majeure."),
        sub("g", "Notices under this Agreement may be sent by email to the addresses below and are effective on the day sent.", "Notices."),

        // ---- signatures ----
        h1("Signatures"),
        body("The Parties agree to the terms above as of the last date signed."),
        new Table({
          columnWidths: [4680, 4680],
          width: { size: 9360, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4680, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 0, right: 200 },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    p(t("PROVIDER", { size: 19, bold: true, color: FERN }), { spacing: { after: 300 } }),
                    p(t("_".repeat(32), { size: 21, color: "C9BBAA" }), { spacing: { after: 30 } }),
                    p(t("Kevin Hershock, Glazed Web", { size: 18, color: GREY }), { spacing: { after: 240 } }),
                    p(t("_".repeat(32), { size: 21, color: "C9BBAA" }), { spacing: { after: 30 } }),
                    p(t("Date", { size: 18, color: GREY }), { spacing: { after: 200 } }),
                    p(t("kevin@glazedweb.com", { size: 18, color: GREY })),
                  ],
                }),
                new TableCell({
                  width: { size: 4680, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 200, right: 0 },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    p(t("CLIENT", { size: 19, bold: true, color: FERN }), { spacing: { after: 300 } }),
                    p(t("_".repeat(32), { size: 21, color: "C9BBAA" }), { spacing: { after: 30 } }),
                    p(t("Name / Title", { size: 18, color: GREY }), { spacing: { after: 240 } }),
                    p(t("_".repeat(32), { size: 21, color: "C9BBAA" }), { spacing: { after: 30 } }),
                    p(t("Date", { size: 18, color: GREY }), { spacing: { after: 200 } }),
                    p(t("Email", { size: 18, color: GREY })),
                  ],
                }),
              ],
            }),
          ],
        }),

        // ---- Exhibit A ----
        new Paragraph({ children: [t("", { size: 21 })], pageBreakBefore: true }),
        p([t("Exhibit A: Scope & Pricing", { size: 30, bold: true, color: INK })], { spacing: { after: 60 } }),
        p([t("Attach or complete this page. It controls what gets built.", { size: 18, color: PINK })], { spacing: { after: 240 } }),
        rule(),
        p(t("Package", { size: 22, bold: true, color: INK }), { spacing: { after: 120 } }),
        fill("Flavor / package:", 44),
        fill("Domain:", 52),
        p(t("Pages & features included", { size: 22, bold: true, color: INK }), { spacing: { before: 120, after: 120 } }),
        ...Array.from({ length: 6 }, () =>
          p(t("_".repeat(88), { size: 21, color: "D8CCBD" }), { spacing: { after: 190 } })
        ),
        p(t("Pricing", { size: 22, bold: true, color: INK }), { spacing: { before: 160, after: 120 } }),
        fill("Build fee:  $", 22),
        fill("Deposit due before work begins:  $", 22),
        fill("Monthly service fee:  $", 22),
        fill("Monthly edit allowance:", 26),
        fill("Hourly rate for additional work:  $", 22),
        p(t("Timeline", { size: 22, bold: true, color: INK }), { spacing: { before: 160, after: 120 } }),
        fill("Target launch date:", 32),
        fill("Client materials due by:", 32),
        rule(),
        p([t("Glazed Web  ·  Marshall, Michigan  ·  kevin@glazedweb.com  ·  glazedweb.com", { size: 17, color: GREY })], {
          alignment: AlignmentType.CENTER,
        }),
        p([t("Agreement v1.0, matches the published terms at glazedweb.com/agreement", { size: 16, color: GREY, italics: true })], {
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("Glazed_Web_Client_Agreement_v1.docx", buf);
  console.log("wrote Glazed_Web_Client_Agreement_v1.docx", buf.length, "bytes");
});
