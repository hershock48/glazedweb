/** Shared authority seam for ledger/readers and session writers.
 * Usage: readAuthoritative(archive), saveSessionBook(archive, before, after, date).
 * The archive marker is configuration; all new records belong in its target.
 */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function studioAuthority(file){
 const marker=file+'.authority.json';
 if(!fs.existsSync(marker))return null;
 const config=JSON.parse(fs.readFileSync(marker,'utf8'));
 if(config.version!==1||config.mode!=='studio-local'||typeof config.file!=='string'||!config.file)throw Error('Invalid ledger authority marker; refusing to fall back to old records.');
 if(config.adapter!==undefined&&(typeof config.adapter!=='string'||!config.adapter))throw Error('Invalid session adapter path in the authority marker.');
 return {file:path.resolve(path.dirname(marker),config.file),...(config.adapter?{adapter:path.resolve(path.dirname(marker),config.adapter)}:{})};
}
export function assertLegacyWritable(file){
 if(studioAuthority(file))throw Error('This ledger is archived. Use the session writer or studio dashboard to update its authority target.');
 if(fs.existsSync(file)){
  const value=JSON.parse(fs.readFileSync(file,'utf8'));
  if(Object.hasOwn(value,'revision')&&value.book)throw Error('Legacy writers cannot edit dashboard storage. Use the studio dashboard.');
 }
}
// Same legacy fallbacks as the dashboard's operations(). An absent operations
// object means an older import, not proof that its payment was never received.
export function projectedOperations(row){
 const source=row.operations||{};
 const sales={scouted:'lead',audited:'lead',built:'proposal',sent:'proposal',replied:'conversation',meeting:'meeting',confirmed:'won','paid-part':'won',paid:'won',live:'won',retained:'won',passed:'lost',dormant:'parked'}[row.stage]||'unknown';
 const build=row.stage==='paid'||row.events?.some(e=>e.type==='pay')?'paid':row.stage==='paid-part'||row.events?.some(e=>e.type==='pay-part')?'partial':'unknown';
 return {...source,sales:source.sales||sales,buildPayment:source.buildPayment||build,delivery:source.delivery||(['live','retained'].includes(row.stage)?'live':'unknown'),agreement:source.agreement||'unknown'};
}
export function studioProjection(envelope){
 if(!Number.isInteger(envelope?.revision)||envelope.revision<0||!envelope.book?.rows||typeof envelope.book.rows!=='object'||Array.isArray(envelope.book.rows))throw Error('Authoritative studio ledger is unavailable or invalid.');
 const book=structuredClone(envelope.book);
 for(const row of Object.values(book.rows)){
  // Retain historical research for brief preparation, without promoting its
  // proposed prices, stages or next actions into current account facts.
  const records=[...(row.sourceRecords||[])].sort((a,b)=>(b.id==='session-prospect')-(a.id==='session-prospect'));
  for(const record of records){
   if(record.id!=='session-prospect'&&!record.id?.startsWith('legacy-'))continue;
   try{const original=JSON.parse(record.content);for(const key of ['research','scoreAuto','poolId','lat','lon','businessKind'])if(Object.hasOwn(original,key)&&!Object.hasOwn(row,key))row[key]=original[key];if(!row.businessKind&&original.kind&&!['client','prospect','product','internal','experiment','unclassified'].includes(original.kind))row.businessKind=original.kind;}catch{}
  }
  row._studio=true;
  row.price={build:row.commercial?.build??null,monthly:row.commercial?.monthly??null};
  const o=row.operations=projectedOperations(row);
  // Keep advanced legacy stages. If the dashboard explicitly un-parks an
  // account, discard only the obsolete terminal stage before projecting.
  const ladder=['untracked','scouted','audited','built','sent','replied','meeting','confirmed','paid-part','paid','live','retained'];
  let stage=['dormant','passed'].includes(row.stage)?'untracked':row.stage;
  const advance=target=>{if(ladder.indexOf(target)>ladder.indexOf(stage))stage=target;};
  advance({lead:'scouted',proposal:'built',conversation:'replied',meeting:'meeting',won:'confirmed'}[o.sales]);
  if(o.buildPayment==='partial')advance('paid-part');
  if(o.buildPayment==='paid')advance('paid');
  if(['live','support'].includes(o.delivery))advance('live');
  if(row.commercial?.monthlyStatus==='active')advance('retained');
  row.stage=stage;
  if(o.sales==='lost')row.stage='passed';
  else if(o.sales==='parked')row.stage='dormant';
 }
 book.authority={source:'studio-dashboard',revision:envelope.revision};
 return book;
}
export async function saveSessionBook(file,before,after,date){
 const authority=studioAuthority(file);
 if(!authority)return false;
 if(before?.authority?.source!=='studio-dashboard')throw Error('Reload the authoritative ledger before writing.');
 // An explicit adapter path allows disposable storage outside the app's data
 // directory. Existing pilot markers keep their original adjacent-app default.
 const adapter=authority.adapter||path.resolve(path.dirname(authority.file),'..','lib','session-writer.mjs');
 if(!fs.existsSync(adapter))throw Error('Session adapter missing. Install the matching glazedweb-admin version before enabling session writes.');
 const {writeSessionBook,SESSION_ADAPTER}=await import(pathToFileURL(adapter).href);
 if(SESSION_ADAPTER?.id!=='glazedweb-studio-session'||SESSION_ADAPTER.version!==1||typeof writeSessionBook!=='function'){
  throw Error('Session adapter is incompatible. This reader requires glazedweb-studio-session version 1. Update glazedweb-admin first; no account was changed.');
 }
 await writeSessionBook(authority.file,before.authority.revision,before,after,date);
 return true;
}
export function readAuthoritative(file){
 const authority=studioAuthority(file);
 if(!authority)return null;
 return studioProjection(JSON.parse(fs.readFileSync(authority.file,'utf8')));
}
