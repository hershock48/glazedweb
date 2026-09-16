import fs from 'node:fs';
import path from 'node:path';

export function studioAuthority(file){
 const marker=file+'.authority.json';
 if(!fs.existsSync(marker))return null;
 const config=JSON.parse(fs.readFileSync(marker,'utf8'));
 if(config.version!==1||config.mode!=='studio-local'||typeof config.file!=='string'||!config.file)throw Error('Invalid ledger authority marker; refusing to fall back to old records.');
 return {file:path.resolve(path.dirname(marker),config.file)};
}
export function assertLegacyWritable(file){
 if(studioAuthority(file))throw Error('This ledger is archived. Record changes in the studio dashboard. Research may use --draft --json; selection remains a read-only shortlist.');
 if(fs.existsSync(file)){
  const value=JSON.parse(fs.readFileSync(file,'utf8'));
  if(Object.hasOwn(value,'revision')&&value.book)throw Error('Legacy writers cannot edit dashboard storage. Use the studio dashboard.');
 }
}
export function studioProjection(envelope){
 if(!Number.isInteger(envelope?.revision)||envelope.revision<0||!envelope.book?.rows||typeof envelope.book.rows!=='object'||Array.isArray(envelope.book.rows))throw Error('Authoritative studio ledger is unavailable or invalid.');
 const book=structuredClone(envelope.book);
 for(const row of Object.values(book.rows)){
  // Retain historical research for brief preparation, without promoting its
  // proposed prices, stages or next actions into current account facts.
  for(const record of row.sourceRecords||[]){
   if(!record.id?.startsWith('legacy-'))continue;
   try{const original=JSON.parse(record.content);for(const key of ['research','price','scoreAuto','poolId','lat','lon'])if(Object.hasOwn(original,key)&&!Object.hasOwn(row,key))row[key]=original[key];}catch{}
  }
  row._studio=true;
  const o=row.operations||{};
  if(o.sales==='lost')row.stage='passed';
  else if(o.sales==='parked')row.stage='dormant';
  else if(o.delivery==='live'||o.delivery==='support')row.stage='live';
  else if(o.buildPayment==='paid')row.stage='paid';
  else if(o.buildPayment==='partial')row.stage='paid-part';
  else if(o.sales==='won')row.stage='confirmed';
 }
 book.authority={source:'studio-dashboard',revision:envelope.revision};
 return book;
}
export function readAuthoritative(file){
 const authority=studioAuthority(file);
 if(!authority)return null;
 return studioProjection(JSON.parse(fs.readFileSync(authority.file,'utf8')));
}
