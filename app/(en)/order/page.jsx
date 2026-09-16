"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import { LogoDefs, Mark } from "@/components/Logo";
import { INQUIRY_OPTIONS, inquiryEmail } from "@/lib/inquiry";
export default function OrderPage() {
  const [flavor,setFlavor]=useState("unsure");
  const [status,setStatus]=useState("idle");
  const [fallback,setFallback]=useState("");
  useEffect(()=>{const q=new URLSearchParams(window.location.search);if(INQUIRY_OPTIONS[q.get("flavor")])setFlavor(q.get("flavor"));},[]);
  async function submit(e){
    e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget).entries());setFallback(inquiryEmail(body));setStatus("sending");
    try{const r=await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});setStatus(r.ok?"done":"fallback");}catch{setStatus("fallback");}
  }
  return <><LogoDefs/><header><div className="navwrap"><Link className="brand" href="/" aria-label="Glazed Web home"><Mark/><span className="bw">glazed<span>web</span></span></Link><nav aria-label="Main"><Link href="/#work">Work</Link><Link href="/#menu">Pricing</Link></nav></div></header>
    <main className="order-wrap">{status==="done"?<div className="order-done" role="status"><h1>Good things start here.</h1><p>Your inquiry is with Kevin. I’ll reply within one business day to talk through what you need. There’s no payment or commitment at this stage.</p><Link href="/" className="btn big">Back to the studio</Link></div>:<><div className="order-head"><div className="sec-kicker" style={{color:"var(--fern)"}}>Let’s work it out together</div><h1>What could work better?</h1><p className="sec-sub">Tell me about your business and the tools you’re working with. I’ll reply within one business day. No payment or agreement needed to start a conversation.</p></div>
    <form className="order-form" action="/api/order" method="post" onSubmit={submit}>
      <section className="ostep"><h2>What brings you here?</h2><label className="full"><span className="flabel">I’m interested in</span><select name="flavorChoice" value={flavor} onChange={e=>setFlavor(e.target.value)}>{Object.entries(INQUIRY_OPTIONS).map(([key,v])=><option key={key} value={key}>{v.name}{v.price?` · ${v.price}`:""}</option>)}</select></label><p className="hint">A starting point is enough. We’ll work out the right scope together.</p></section>
      <section className="ostep"><h2>A little about you.</h2><div className="fgrid">
        <label><span className="flabel">Your name <span className="req">*</span></span><input name="name" required autoComplete="name" maxLength={120}/></label>
        <label><span className="flabel">Business name <span className="req">*</span></span><input name="business" required autoComplete="organization" maxLength={160}/></label>
        <label><span className="flabel">Email <span className="req">*</span></span><input name="email" type="email" required autoComplete="email" maxLength={254}/></label>
        <label><span className="flabel">Phone</span><input name="phone" type="tel" autoComplete="tel" maxLength={60}/></label>
        <label><span className="flabel">Town</span><input name="town" autoComplete="address-level2" maxLength={120}/></label>
        <label><span className="flabel">Current website</span><input name="currentSite" placeholder="If you have one" maxLength={500}/></label>
      </div><label className="full"><span className="flabel">What do you want to make easier? <span className="req">*</span></span><textarea name="details" required rows={4} maxLength={6000} placeholder="The orders you retype, the tools that don’t talk, the idea you haven’t found a good way to build…"/></label><label className="full"><span className="flabel">What tools do you use today?</span><textarea name="register" rows={2} maxLength={2000} placeholder="Your POS, booking software, spreadsheets, ordering apps, or anything else your team relies on."/></label><label className="full"><span className="flabel">When would you like to start?</span><select name="timeline" defaultValue="Just exploring"><option>Just exploring</option><option>As soon as possible</option><option>In the next month</option><option>In the next few months</option></select></label></section>
      <div className="order-submit"><button className="btn big" type="submit" disabled={status==="sending"}>{status==="sending"?"Sending…":"Start the conversation ↗"}</button><span className="submit-note">We agree on scope and terms before any work starts.</span></div><p className="hint">Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can also <Link href="/agreement">read the service terms</Link> ahead of time.</p><noscript><p className="hint">You can send this form without JavaScript. If delivery is unavailable, the next page keeps your answers ready to send by email.</p></noscript>{status==="fallback"&&<div className="order-note" role="status"><b>Your message hasn’t been delivered yet.</b><p>Your answers are ready in the email link below. Open it and hit send to get them to Kevin.</p><a className="btn" href={fallback}>Open your prepared email</a></div>}
    </form></>}</main><footer className="order-foot"><Link href="/">← glazedweb</Link><span>Marshall, Michigan · {CONTACT_EMAIL}</span></footer></>;
}
