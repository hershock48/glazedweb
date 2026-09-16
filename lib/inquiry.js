import { PRICING, usd } from "./pricing";
import { CONTACT_EMAIL } from "./contact";
// New inquiries only; existing scopes and agreement acceptance are separate.
export const INQUIRY_OPTIONS = {
  unsure: {name:"Let’s figure it out together",price:""},
  systems: {name:"The connected business",price:`from ${usd(PRICING.us.systems.build)}; support scoped separately`},
  custom: {name:"Custom apps, tools, or integrations",price:"quoted to fit"},
  dozen: {name:"A custom website",price:`from ${usd(PRICING.us.dozen.build)} + ${usd(PRICING.us.dozen.monthly)}/mo care`},
  original: {name:"The Original: a focused one-page site",price:`from ${usd(PRICING.us.original.build)} + ${usd(PRICING.us.original.monthly)}/mo care`},
};
export function inquiryEmail(data){
  const opt=INQUIRY_OPTIONS[data.flavorChoice]||INQUIRY_OPTIONS.unsure;
  const text=["New project inquiry (no agreement accepted)",`Interested in: ${opt.name} ${opt.price}`,`Name: ${data.name||""}`,`Business: ${data.business||""}`,`Email: ${data.email||""}`,`Phone: ${data.phone||""}`,`Town: ${data.town||""}`,`Website: ${data.currentSite||""}`,`Current tools: ${data.register||""}`,`Timing: ${data.timeline||""}`,"",data.details||""].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project inquiry: "+(data.business||data.name||"Hello"))}&body=${encodeURIComponent(text)}`;
}
