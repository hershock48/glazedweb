"use client";

import { LogoDefs, Mark, AnimatedMark, DripDivider, BeANumberMark, ChismEggs } from "@/components/Logo";
import {
  CONTACT_EMAIL,
  DO_REP_NAME,
  WHATSAPP_DO,
  WHATSAPP_DO_DISPLAY,
  WHATSAPP_US,
  WHATSAPP_US_DISPLAY,
  waLink,
} from "@/lib/contact";
import { PRICING, rd, num } from "@/lib/pricing";
import { useHomeEffects } from "@/components/homeEffects";

// The homepage for the Dominican Republic, written for that market rather
// than translated from the English page. The differences that matter:
//
//  - Every CTA is WhatsApp, not /order. Business in the DR runs on WhatsApp,
//    and the /order flow is in English anyway. Leads go to Angel, the rep on
//    the ground, with a prefilled message naming the package.
//  - Prices are in Dominican pesos (RD$), Kevin's call on 22 Aug 2026 after
//    the page first shipped quoting US$. Set at ~RD$58.5/US$ and rounded to
//    clean numbers that keep the half-the-market story: RD$45,000 ≈ US$770,
//    RD$115,000 ≈ US$1,965. Costs are in dollars, so if the peso moves far
//    from that rate the numbers are due a nudge, and lib/pricing.js is the
//    one place they live.
//  - Angel is named on the page. "A US studio with a person here you can
//    write to in Spanish" is the pitch; an anonymous foreign site is not.
//
// Structure, ids and classes mirror app/(en)/page.jsx exactly so the shared
// scroll effects in components/homeEffects.js bind to both pages unchanged.
const waAngel = (text) => waLink(WHATSAPP_DO, text);

export default function HomeDO() {
  useHomeEffects();

  return (
    <>
      <LogoDefs />

      <header>
        <div className="navwrap">
          <a className="brand" href="/do">
            <Mark />
            <span className="bw">
              glazed<span>web</span>
            </span>
          </a>
          <nav>
            <a href="#menu">Menú</a>
            <a href="#process">Proceso</a>
            <a href="#work">Trabajos</a>
            <a
              className="btn"
              href={waAngel("Hola Angel, quiero información para hacer la página web de mi negocio.")}
            >
              Pídela
            </a>
            {/* ?lang=en / ?lang=es are handled by middleware.js: it stores the
                choice in a cookie so a Dominican visitor who prefers English
                stops being auto-routed here, then redirects to the clean URL. */}
            <a className="lang" href="/?lang=en" lang="en" title="View in English">
              EN
            </a>
          </nav>
        </div>
      </header>

      <div className="hero">
        <div>
          <div className="kicker">Estudio web artesanal · Ahora en República Dominicana</div>
          <h1>
            Páginas web que dan{" "}
            <em>
              antojo
              <svg viewBox="0 0 200 14" preserveAspectRatio="none">
                <path
                  d="M4 10 C 40 2, 90 2, 120 7 C 150 11, 180 9, 196 5"
                  fill="none"
                  stroke="#BFE07A"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </em>
          </h1>
          <p className="sub">
            Páginas web hechas a mano para negocios dominicanos. Sin plantillas, sin relleno, sin esperar seis meses.
            Pídela como una dona: eliges el sabor, la horneamos fresca y te la entregamos glaseada.
          </p>
          <div className="ctas">
            <a
              className="btn big"
              href={waAngel("Hola Angel, quiero información para hacer la página web de mi negocio.")}
            >
              Escríbenos por WhatsApp
            </a>
            <a className="btn big ghost" href="#menu">
              Ver el menú
            </a>
          </div>
          <div className="proof">
            Lista en tan solo <b>2 semanas</b> · Precios claros en RD$ · Todo queda a tu nombre
          </div>
        </div>
        <div className="mark">
          <AnimatedMark />
        </div>
      </div>

      {/* Slime glaze drip in place of the old scrolling ticker, same as the EN
          page: hero is --cream and #menu is --cream-2, so the band is slime. */}
      <div className="hero-drip" aria-hidden="true">
        <DripDivider fill="var(--slime)" bg="var(--cream-2)" />
      </div>

      <section id="menu">
        <div className="inner">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            El menú
          </div>
          <h2 className="sec-title">Pídela como una dona.</h2>
          <p className="sec-sub">
            Tres sabores. Un precio de construcción y una mensualidad pequeña que mantiene tu página alojada, segura y
            al día, sin facturas sorpresa. Cada página se hornea desde cero, nunca de una plantilla.
          </p>
          <div className="menu-grid">
            <div className="mcard reveal">
              <h3>La Original</h3>
              <div className="flavor">Una sola página · glaseado clásico</div>
              <div className="price">
                <span className="was" aria-hidden="true">
                  mercado <s>{rd(PRICING.do.original.market)}</s>
                </span>
                RD$<span className="price-num" data-from={PRICING.do.original.market} data-to={PRICING.do.original.build}>{num(PRICING.do.original.build)}</span> <small>+ {rd(PRICING.do.original.monthly)}/mes</small>
              </div>
              <ul>
                <li>Una página clara que dice quién eres y hace que la gente te escriba</li>
                <li>Rápida, hecha para el celular y visible en Google</li>
                <li>Botón de WhatsApp, mapa, horario. Lo esencial, bien hecho</li>
                <li>Lista en 2 semanas; la mensualidad cubre alojamiento, seguridad y ediciones pequeñas para siempre</li>
              </ul>
              <a
                className="btn ghost"
                href={waAngel(`Hola Angel, me interesa La Original (${rd(PRICING.do.original.build)}) para mi negocio.`)}
              >
                Pedir por WhatsApp
              </a>
            </div>
            <div className="mcard featured reveal">
              <div className="tag">La más pedida</div>
              <h3>La Docena del Panadero</h3>
              <div className="flavor">Página completa · doble glaseado</div>
              <div className="price">
                <span className="was" aria-hidden="true">
                  mercado <s>{rd(PRICING.do.dozen.market)}</s>
                </span>
                RD$<span className="price-num" data-from={PRICING.do.dozen.market} data-to={PRICING.do.dozen.build}>{num(PRICING.do.dozen.build)}</span> <small>+ {rd(PRICING.do.dozen.monthly)}/mes</small>
              </div>
              <ul>
                <li>Hasta 6 páginas: servicios, nosotros, galería, lo que haga falta</li>
                <li>Diseño propio que se ve como tu negocio, no como un tema genérico</li>
                <li>Reservas, menú digital o tienda básica, una incluida</li>
                <li>Base de SEO + puesta a punto de tu perfil de Google</li>
                <li>La mensualidad cubre alojamiento, actualizaciones, ediciones y seguimiento</li>
              </ul>
              <a
                className="btn"
                href={waAngel(`Hola Angel, me interesa La Docena del Panadero (${rd(PRICING.do.dozen.build)}) para mi negocio.`)}
              >
                Pedir por WhatsApp
              </a>
            </div>
            <div className="mcard reveal">
              <h3>Pedido Especial</h3>
              <div className="flavor">Receta especial</div>
              <div className="price">Hablemos</div>
              <ul>
                <li>Tiendas online, membresías, aplicaciones web</li>
                <li>Rediseños de páginas que ya existen</li>
                <li>Plan de cuidado a tu medida: alojamiento, actualizaciones y ediciones</li>
                <li>Si lo puedes dibujar en una servilleta, lo podemos hornear</li>
              </ul>
              <a
                className="btn ghost"
                href={waAngel("Hola Angel, quiero cotizar un pedido especial para mi negocio.")}
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <DripDivider fill="#FFFDF8" bg="var(--cream)" />

      <section id="process">
        <div className="inner">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            El proceso
          </div>
          <h2 className="sec-title">Recién salida del freidor en cuatro pasos.</h2>
          <div className="steps">
            <div className="step reveal">
              <div className="num">1</div>
              <h4>Elige tu sabor</h4>
              <div className="sub">Descubrimiento</div>
              <p>
                Una llamada o un WhatsApp de 30 minutos. Tú hablas de tu negocio; nosotros tomamos nota y elegimos el
                paquete juntos.
              </p>
            </div>
            <div className="step reveal">
              <div className="num">2</div>
              <h4>Mezclamos la masa</h4>
              <div className="sub">Diseño</div>
              <p>Diseñamos tu página principal primero y te la enseñamos. Tú reaccionas, nosotros ajustamos. Sin sorpresas.</p>
            </div>
            <div className="step reveal">
              <div className="num">3</div>
              <h4>Al freidor</h4>
              <div className="sub">Construcción</div>
              <p>
                Construimos la página de verdad: rápida, para el celular, accesible. Sigues el avance en un enlace en
                vivo todo el tiempo.
              </p>
            </div>
            <div className="step reveal">
              <div className="num">4</div>
              <h4>Glaseada y entregada</h4>
              <div className="sub">Lanzamiento</div>
              <p>
                Dominio conectado, Google configurado, todo entregado. Todo queda a tu nombre: código, contenido,
                cuentas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DripDivider fill="#FDF6EC" bg="var(--chocolate-2)" />

      <section id="work">
        <div className="inner">
          <div className="sec-kicker">La vitrina</div>
          <h2 className="sec-title" style={{ color: "#F3EAE1" }}>
            Recién horneadas.
          </h2>
          <p className="sec-sub">Trabajos recientes, y espacio en la vitrina para el tuyo.</p>
          <div className="work-grid">
            <a
              id="chism-card"
              className="wcard reveal"
              href="https://www.chismchickenranch.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bok-bubble" aria-hidden="true">
                clo clo clo
              </div>
              <div
                className="thumb"
                style={{
                  background: "linear-gradient(135deg,#B5532A,#8A3C1C)",
                  color: "#FFF7EA",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <svg
                  viewBox="0 0 220 54"
                  width="200"
                  height="49"
                  aria-hidden="true"
                  style={{ overflow: "visible", marginBottom: -10 }}
                >
                  <defs>
                    {/* Own id per page: the English page defines chismArcPath,
                        and although the two pages never render together, a
                        distinct id keeps the fragment reference unambiguous. */}
                    <path id="chismArcPathDo" d="M 14 48 Q 110 6 206 48" fill="none" />
                  </defs>
                  <text fill="#FFF7EA" fontSize="13.5" fontWeight="800" letterSpacing="2">
                    <textPath href="#chismArcPathDo" startOffset="50%" textAnchor="middle">
                      CHISM CHICKEN RANCH
                    </textPath>
                  </text>
                </svg>
                <ChismEggs className="chism-eggs" />
              </div>
              <div className="meta">
                <b>Chism Chicken Ranch</b>
                <span>Avícola de pastoreo · Michigan, EE. UU.</span>
              </div>
            </a>
            <a
              id="cac-card"
              className="wcard reveal"
              href="https://copperac.glazedweb.com/demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="thumb"
                style={{
                  background: "linear-gradient(150deg,#191919,#0d0d0d)",
                  color: "#e8e2d8",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                <span className="cac-glow" aria-hidden="true" />
                <span className="cac-lockup">
                  <span className="cac-word">COPPER</span>
                  <span className="cac-sub">ATHLETIC CLUB</span>
                </span>
                <span className="cac-rule" aria-hidden="true" />
                {/* Kept in sync with the English card by hand; see the notes
                    there before changing this line. */}
                <span className="cac-spec">EVERY WALL · EVERY SCREEN</span>
              </div>
              <div className="meta">
                <b>Copper Athletic Club</b>
                <span>Bar deportivo · Michigan, EE. UU. · en construcción</span>
              </div>
            </a>
            <a
              id="ban-card"
              className="wcard reveal"
              href="https://www.beanumber.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="thumb"
                style={{
                  background: "linear-gradient(160deg,#1E1B17,#0d0d0d)",
                  color: "#FFF8F0",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <BeANumberMark size={54} style={{ color: "#D4A843" }} className="ban-logo" />
                <span className="ban-counter" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px" }}>
                  № <span id="ban-num">001</span>
                </span>
                <span style={{ fontSize: 10.5, letterSpacing: ".22em", opacity: 0.8 }}>CADA NÚMERO ES UN NIÑO</span>
              </div>
              <div className="meta">
                <b>Be A Number International</b>
                <span>Sin fines de lucro · apadrinamiento infantil · beanumber.org</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <DripDivider fill="#201712" bg="var(--raspberry)" />

      <section className="ctaband" id="contacto">
        <div className="inner">
          <h2>¿Se te antojó?</h2>
          <p>
            Escríbele a <b>{DO_REP_NAME}</b>, nuestro representante en República Dominicana. Cuéntale de tu negocio por
            WhatsApp y en menos de un día tienes un plan y un precio, en tu idioma y sin compromiso.
          </p>
          {/* .btn is nowrap, so the button text has to fit a 320px screen;
              the full number lives in the line below and in the footer. */}
          <a
            className="btn big"
            href={waAngel("Hola Angel, quiero información para hacer la página web de mi negocio.")}
          >
            Escríbele a Angel por WhatsApp →
          </a>
          {/* Full-strength white: this band is --raspberry-deep, where white
              measures 4.78 and passes AA only unfaded. The 0.85 opacity this
              paragraph first shipped with put all three elements below 4.5,
              and the auditor caught it. */}
          <p style={{ fontSize: 14, marginTop: 22, marginBottom: 0 }}>
            Angel: {WHATSAPP_DO_DISPLAY} · ¿Prefieres el estudio en EE. UU.? Kevin:{" "}
            <a
              href={waLink(WHATSAPP_US, "Hi Kevin, I'd like a website for my business in the Dominican Republic.")}
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              {WHATSAPP_US_DISPLAY}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#fff", textDecoration: "underline" }}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <DripDivider fill="#E84D8A" bg="var(--chocolate-2)" />

      <footer>
        <div className="inner">
          <div className="foot-top">
            <div>
              <div className="foot-brand">
                <Mark width={30} height={38} hole="#201712" />
                <span className="bw">
                  glazed<span>web</span>
                </span>
              </div>
              <p style={{ marginTop: 14, fontSize: 13.5, maxWidth: 260, lineHeight: 1.6 }}>
                Páginas web artesanales para negocios. Horneadas en Michigan, servidas calientes en República
                Dominicana.
              </p>
            </div>
            <div className="foot-links">
              <div className="col">
                <b>La tienda</b>
                <a href="#menu">El menú</a>
                <a href="#process">Proceso</a>
                <a href="#work">Trabajos</a>
              </div>
              <div className="col">
                <b>Contacto</b>
                <span style={{ display: "block", color: "#A6907F", fontSize: 14, marginBottom: 8 }}>
                  República Dominicana
                </span>
                <a href={waAngel("Hola Angel, quiero información para hacer la página web de mi negocio.")}>
                  Angel · {WHATSAPP_DO_DISPLAY}
                </a>
                <span style={{ display: "block", color: "#A6907F", fontSize: 14, margin: "12px 0 8px" }}>
                  EE. UU.
                </span>
                <a href={waLink(WHATSAPP_US, "Hi Kevin, I'd like a website for my business in the Dominican Republic.")}>
                  Kevin · {WHATSAPP_US_DISPLAY}
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 glazedweb. Todos los derechos reservados.</span>
            <span>Páginas web, frescas todos los días.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
