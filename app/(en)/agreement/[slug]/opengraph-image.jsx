import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getCustomOrder, money } from "@/lib/customOrders";
import { installments, partFee } from "@/lib/buildfee";

/**
 * The link card for /agreement/{slug}: what a client sees when Kevin texts
 * them their agreement to sign or to pay the next part of the build fee.
 * Before this the route inherited the homepage's card ("Web Design in
 * Michigan", the donut ad), which read as a sales pitch inside a bill.
 *
 * glaze/link-cards.md: 1200 x 630, everything that must be read inside the
 * centre 630 band (x 285 to 915), nothing under 28px. The amounts come from
 * the registry only, never from Stripe, so a card cached by a messaging app
 * can never show a payment count that has since gone stale.
 */
export const runtime = "nodejs";
export const alt = "Your agreement and build payments, from Glazed Web.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#FDF6EC";
const CHOCOLATE = "#2B1E16";
const RASPBERRY_INK = "#C9356F";
const TAUPE = "#7F6D5B";

function feeLine(order) {
  if (!order || !order.buildFee) return "Your agreement with Glazed Web";
  const n = installments(order);
  if (order.installments && n > 2) return `Build fee: ${n} payments of ${money(partFee(order))}`;
  return `Build fee: ${money(order.buildFee)}`;
}

export default async function Image({ params }) {
  const { slug } = await params;
  const order = getCustomOrder(slug);
  const logo = await readFile(join(process.cwd(), "public/brand/logo-800.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const name = order?.client || "Glazed Web";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
          color: CHOCOLATE,
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        {/* The painted part of logo-800.png is x 171-469, y 51-571; crop to it. */}
        <div style={{ display: "flex", width: 150, height: 262, overflow: "hidden", position: "relative" }}>
          <img
            src={logoSrc}
            width={320}
            height={400}
            style={{ position: "absolute", left: -85, top: -25 }}
          />
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, marginTop: 22, maxWidth: 620, lineHeight: 1.05 }}>
          {name}
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: RASPBERRY_INK, marginTop: 18, maxWidth: 620 }}>
          Agreement and payments
        </div>
        <div style={{ display: "flex", fontSize: 32, color: TAUPE, marginTop: 14, maxWidth: 620 }}>{feeLine(order)}</div>
      </div>
    ),
    size
  );
}
