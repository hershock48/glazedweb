import { LogoDefs, Mark, AnimatedMark, HeroDrip } from "@/components/Logo";
import FlavorDemo from "@/components/FlavorDemo";
import { CONTACT_EMAIL } from "@/lib/contact";
import { PRICING, usd } from "@/lib/pricing";
import "./home.css";

const projects = [
  {id:"chism", name:"Chism Chicken Ranch", type:"Farm website + reservations", status:"Live site", url:"https://www.chismchickenranch.com", description:"From fresh pasture to a place at the table. A warm, down-to-earth site with bird reservations and wholesale inquiries."},
  {id:"copper", name:"Copper Athletic Club", type:"Restaurant website + live tap list", status:"In progress", url:"https://copperac.glazedweb.com/demo", description:"All the character of a neighborhood sports bar, with its menu, game-day board, and what’s pouring."},
  {id:"beanumber", name:"Be A Number", type:"Nonprofit + sponsorship platform", status:"Live site", url:"https://www.beanumber.org", description:"A shirt starts the connection. A custom platform brings child sponsorships, donations, and the stories together."},
];

export default function Home() {
 return <div className="studio-home">
  <LogoDefs />
  <a className="studio-skip" href="#main">Skip to content</a>
  <header><div className="navwrap"><a className="brand" href="/" aria-label="Glazed Web home"><Mark/><span className="bw">glazed<span>web</span></span></a><nav aria-label="Main"><a href="#work">Work</a><a href="#menu">Menu</a><a href="#about" className="about-nav">The studio</a><a className="btn" href="/order">Let’s talk <span aria-hidden="true">↗</span></a></nav></div></header>
  <main id="main">
   <section className="studio-hero" aria-labelledby="hero-title">
    <div className="hero-copy"><div className="kicker">Your technology partner / Marshall, MI</div><h1 id="hero-title">Your business.<br/>Better <em>connected.</em></h1><p>Your website, ordering, POS, and the tools your team uses every day. We bring them together around the way you work, with a customer experience that feels effortless.</p><div className="ctas"><a className="btn big" href="#work">See what we build <span aria-hidden="true">↘</span></a><a className="hero-link" href="/order">Let’s untangle your tools <span aria-hidden="true">↗</span></a></div><div className="hero-proof">Built around your business. <span>Owned by you.</span></div></div>
    <div className="hero-composition"><div className="hero-sticker"><AnimatedMark width={140} height={175}/><span>Fresh from<br/>the studio.</span></div><div className="browser-frame hero-browser"><div className="browser-chrome"><i/><i/><i/><span>chismchickenranch.com</span></div><img src="/work/chism.webp" width="1200" height="675" alt="Chism Chicken Ranch website, with warm farm photography and a reservation button" fetchPriority="high"/></div><div className="hero-detail"><span>Made for real businesses.</span><b>Beautiful. Inside and out.</b><span aria-hidden="true">✳</span></div></div>
   </section>
   <div className="studio-ribbon"><span>Good looks.</span><span aria-hidden="true">✳</span><span>Tools that work together.</span><span aria-hidden="true">✳</span><span>Your name on the door.</span></div>
   <section id="work" className="studio-work"><div className="studio-inner"><div className="section-heading"><div><span className="eyebrow">01 / Selected work</span><h2>A little taste<br/>of what’s possible.</h2></div><p>Different businesses. Different personalities.<br/>Every one built around the people behind it.</p></div><div className="project-grid">{projects.map((p,i)=><article className={"project project-"+p.id} key={p.id}><a href={p.url} target="_blank" rel="noopener noreferrer" className="project-image" aria-label={"Visit "+p.name+" (opens in a new tab)"}><div className="project-top"><span>{p.type}</span><span>{p.status} ↗</span></div><div className="browser-frame"><div className="browser-chrome"><i/><i/><i/><span>{new URL(p.url).hostname}</span></div><img src={"/work/"+p.id+".webp"} width="1200" height="675" loading="lazy" alt={p.name+" website homepage"}/></div></a><div className="project-caption"><span className="project-number">0{i+1}</span><div><h3><a href={p.url} target="_blank" rel="noopener noreferrer">{p.name} <span aria-hidden="true">↗</span></a></h3><p>{p.description}</p></div></div></article>)}</div></div></section>
   <section className="studio-tools" id="tools"><div className="studio-inner"><div className="section-heading"><div><span className="eyebrow">02 / Less busywork. More business.</span><h2>One business.<br/>Let’s connect the pieces.</h2></div><p>Retyping orders. Updating the same menu twice. Another login for another task. We work with you to simplify the daily routine.</p></div><div className="integration-story"><div><span className="eyebrow">Meet Jelly</span><h3>From their first tap<br/>to your next ticket.</h3><p>Jelly is our ordering system, built into your website and shaped around your counter. Customers order in your brand. Your team gets a clear ticket and controls the menu, pickup windows, and availability.</p><p>We start with the register and services you already use. Where they support integration, we connect them. Where they don’t, we plan the workflow with you before the build.</p><a className="text-link" href="/restaurant-pos-integration-michigan">See how it fits your business ↗</a></div><ol className="workflow"><li><span>01</span><div><b>Your customer</b><p>An easy order on your website.</p></div></li><li><span>02</span><div><b>Your team</b><p>A kitchen ticket with the details they need.</p></div></li><li><span>03</span><div><b>You, in control</b><p>Manage the menu, availability, and incoming orders.</p></div></li></ol></div><FlavorDemo/><div className="tools-bottom"><p>Scooplist is a Glazed Web product. One update at the counter feeds the website and the shop’s display.</p><a href="/restaurant-pos-integration-michigan">Explore ordering &amp; owner tools <span aria-hidden="true">↗</span></a></div></div></section>
   <HeroDrip/>
   <section id="menu" className="studio-menu"><div className="studio-inner"><div className="section-heading"><div><span className="eyebrow">03 / Ways to work together</span><h2>Start where you are.</h2></div><p>We scope it together, build what you need,<br/>and stay involved as your business grows.</p></div><div className="menu-grid">
    <article className="mcard"><span className="menu-index">01 / Your digital home</span><h3>The website</h3><p className="package-fit">A beautiful, custom home for your business, ready for what comes next.</p><div className="price">{usd(PRICING.us.dozen.build)}<small>Builds start here · care from {usd(PRICING.us.dozen.monthly)}/mo</small></div><ul><li>Up to six custom pages, built around your customers</li><li>Menus, services, inquiries, and search foundations</li><li>Ownership, launch support, and ongoing care</li></ul><a className="btn ghost" href="/order?flavor=dozen">Build your foundation ↗</a></article>
    <article className="mcard featured"><span className="menu-index">02 / Better together</span><h3>The connected business</h3><p className="package-fit">Your website and the daily work behind it, designed as one experience.</p><div className="price">{usd(PRICING.us.systems.build)}<small>Projects start here · ongoing support scoped with you</small></div><ul><li>Website + Jelly ordering or an integrated workflow</li><li>POS connections, where your provider supports them</li><li>Owner tools for the way your team actually works</li></ul><a className="btn" href="/order?flavor=systems">Let’s connect the pieces ↗</a></article>
    <article className="mcard"><span className="menu-index">03 / Made to fit</span><h3>Custom solutions</h3><p className="package-fit">For the workflow you keep working around. Let’s build a better way.</p><div className="price">Let’s talk<small>A written scope, a clear quote, and a plan</small></div><ul><li>Custom web apps and admin panels</li><li>Memberships, payments, and service integrations</li><li>A phased build and an ongoing technical partner</li></ul><a className="btn ghost" href="/order?flavor=custom">Show me how you work ↗</a></article>
   </div><div className="care-note"><b>A partner after launch.</b><p>Website care covers hosting, security updates, and small content edits. Connected systems get a support scope of their own. New features are quoted before work starts. You own the custom code once the build is paid in full.</p><a href="/agreement">Read the terms ↗</a></div><p className="small-site-note">Just need a focused one-page site? <a href="/order?flavor=original">The Original starts at {usd(PRICING.us.original.build)} + {usd(PRICING.us.original.monthly)}/mo ↗</a></p><p className="small-site-note">Jelly ordering has a flat 99¢ customer-paid fee per order, disclosed at checkout. Payment processor fees and any agreed third-party services are separate.</p></div></section>
   <section id="about" className="studio-about"><div className="studio-inner about-grid"><figure><img src="/work/kevin.webp" width="900" height="1200" loading="lazy" alt="Kevin Hershock with a community elder in Northern Uganda"/><figcaption>Kevin in Northern Uganda with Be A Number.</figcaption></figure><div><span className="eyebrow">04 / The person behind the glaze</span><h2>Hey, I’m Kevin.</h2><p className="about-lead">I’m the person who learns how your business works, builds the tools, and answers when you need something changed.</p><p>I run Glazed Web from Marshall, Michigan. I work with independent business owners who have good ideas and a collection of tools that could work better together. We figure out what’s getting in the way, then build around your team and your customers.</p><p>I also founded Be A Number, a nonprofit working in Northern Uganda. Building things that people actually use matters to me.</p><a className="text-link" href={"mailto:"+CONTACT_EMAIL}>Say hello ↗</a><div id="process" className="studio-process"><h3>We build it with you.</h3><ol><li><b>Walk me through your day.</b><span>We look at your tools, your customers, and the work you repeat.</span></li><li><b>Connect what matters.</b><span>We agree on a scope and build in stages you can try.</span></li><li><b>Keep making it better.</b><span>We launch, get your team comfortable, and plan what comes next.</span></li></ol></div></div></div></section>
   <section className="studio-contact" id="order"><div className="studio-inner"><span className="eyebrow">Your turn.</span><h2>What could<br/>work <em>better?</em></h2><div><p>Tell me what your team keeps doing the hard way. I’ll reply within one business day, and we’ll start there.</p><a className="btn big" href="/order">Start a conversation ↗</a><span className="contact-note">No payment. No commitment. Just a first hello.</span></div></div></section>
  </main>
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
                Websites, connected systems, and custom tools for independent businesses. Built in Marshall, Michigan.
              </p>
            </div>
            <div className="foot-links">
              <div className="col">
                <b>Shop</b>
                <a href="#menu">The menu</a>
                <a href="#process">Process</a>
                <a href="#work">Work</a>
              </div>
              {/* Internal links are how Google discovers and weighs the
                  service pages; the sitemap alone is a hint, not a vote. */}
              <div className="col">
                <b>Services</b>
                <a href="/restaurant-website-design-michigan">Restaurant websites</a>
                <a href="/online-ordering-website-michigan">Online ordering</a>
                <a href="/restaurant-pos-integration-michigan">POS integration</a>
                <a href="/small-business-web-design-michigan">Small business sites</a>
              </div>
              <div className="col">
                <b>Contact</b>
                <span style={{ display: "block", color: "#A6907F", fontSize: 14, marginBottom: 8 }}>
                  Marshall, Michigan
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                {/* Instagram and Facebook links lived here as href="#".
                    Neither account exists yet, so they went nowhere at all.
                    When the accounts are real, add them back here and add a
                    sameAs array to the Organization JSON-LD in layout.jsx at
                    the same time, which is what actually tells Google the
                    profiles belong to this business. */}
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 glazedweb. All rights reserved.</span>
            <span>Websites, fresh daily.</span>
          </div>
        </div>
      </footer>
 </div>;
}
