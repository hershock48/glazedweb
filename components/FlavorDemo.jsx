"use client";
import { useState } from "react";

// A self-contained illustration of Scooplist's case/feed model. Never writes
// to a customer's account or presents example inventory as a live client feed.
export default function FlavorDemo() {
  const [available, setAvailable] = useState(true);
  return <div className="flavor-demo">
    <div className="demo-label"><span className="demo-dot" /> Interactive example · Scooplist</div>
    <div className="demo-screens">
      <div className="owner-screen">
        <span className="screen-eyebrow">01 / At the counter</span>
        <h3>Your case.</h3>
        <p>The last scoop just sold. Give it a tap.</p>
        <div className="flavor-row"><span className="scoop strawberry" aria-hidden="true" /><div><b>Strawberry</b><span>{available ? "In the case" : "Tub’s empty"}</span></div></div>
        <button type="button" aria-pressed={!available} onClick={() => setAvailable(v => !v)}>{available ? "Mark strawberry sold out" : "Put strawberry back"}<span aria-hidden="true"> ↗</span></button>
      </div>
      <span className="demo-arrow" aria-hidden="true">→</span>
      <div className="customer-screen">
        <span className="screen-eyebrow">02 / On your website</span>
        <h3>Today’s scoops.</h3>
        <div className="flavor-row"><span className="scoop vanilla" aria-hidden="true"/><div><b>Vanilla bean</b><span>Scooping today</span></div></div>
        <div className={`flavor-row ${!available ? "sold-out" : ""}`}><span className="scoop strawberry" aria-hidden="true"/><div><b>Strawberry</b><span>{available ? "Scooping today" : "Sold out for today"}</span></div></div>
        <p className="demo-status" role="status">{available ? "The board matches the case." : "Updated. Your customers see it too."}</p>
      </div>
    </div>
    <noscript><p>This example is interactive with JavaScript enabled. In Scooplist, marking a flavor sold out updates the customer board.</p></noscript>
  </div>;
}
