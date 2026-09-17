/**
 * The REGISTRY DIFFERS flag, end to end through the two CLIs.
 *
 * registry-reader.test.mjs proves the comparison; this file proves the digest
 * and the closing brief actually print it, carry both values in --json, and
 * touch nothing. It runs the real scripts as child processes against an
 * isolated fixture store and a fixture registry (--fixture --file
 * --registry-file), so it never reaches the authority marker or GitHub main.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const scripts=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const run=(script,args)=>{
 const result=spawnSync(process.execPath,[path.join(scripts,script),...args],{encoding:'utf8'});
 assert.equal(result.status,0,`${script} failed: ${result.stderr}`);
 return result.stdout;
};

test('digest and closing brief print REGISTRY DIFFERS with both values, carry it in --json, and change nothing',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'registry-flag-')),store=path.join(dir,'store.json'),registry=path.join(dir,'registry.json');
 try{
  // beanumber mirrors the real row on 2026-09-17: prices match the registry,
  // the registry says live, the dashboard has no delivery record.
  // anchor is a closing-stage row whose build price disagrees.
  fs.writeFileSync(store,JSON.stringify({revision:7,book:{rows:{
   beanumber:{name:'Be A Number',kind:'client',stage:'built',commercial:{build:0,monthly:50,monthlyStatus:'not-started'},next:{action:'',due:''},events:[{date:'2026-09-10',type:'build',note:'fixture'}]},
   anchor:{name:'Anchor',kind:'prospect',stage:'sent',commercial:{build:2000,monthly:100,monthlyStatus:'not-started'},next:{action:'',due:''},events:[{date:'2026-09-10',type:'send',note:'fixture'}]},
  }}}));
  fs.writeFileSync(registry,JSON.stringify({orders:{beanumber:{buildFee:0,monthly:50,live:true},anchor:{buildFee:2500,monthly:100,project:{needs:[]}}},todos:{}}));
  const before=fs.readFileSync(store,'utf8');
  const common=['--fixture','--file',store,'--registry-file',registry,'--today','2026-09-17'];

  const digest=JSON.parse(run('ledger.mjs',['digest','--json',...common]));
  const bean=digest.rows.find(r=>r.slug==='beanumber'),anchor=digest.rows.find(r=>r.slug==='anchor');
  assert.ok(bean.flags.includes('REGISTRY DIFFERS'));
  assert.deepEqual(bean.registry.registryReview.differences,[{field:'delivery',dashboard:'unknown',registry:'live'}]);
  assert.ok(anchor.flags.includes('REGISTRY DIFFERS'));
  assert.deepEqual(anchor.registry.registryReview.differences,[{field:'build',dashboard:2000,registry:2500}]);
  assert.equal(digest.registryCheck.status,'fixture');

  const text=run('ledger.mjs',['digest',...common]);
  assert.match(text,/REGISTRY REVIEW/);
  assert.match(text,/beanumber\r?\n\s+REGISTRY DIFFERS\r?\n\s+delivery: dashboard=unknown, registry=live/);
  assert.match(text,/build: dashboard=2000, registry=2500/);
  assert.match(text,/No records were changed/);

  const close=JSON.parse(run('close.mjs',['--all','--json',...common]));
  const brief=close.rows.find(r=>r.slug==='anchor');
  assert.ok(brief.reasons.includes('REGISTRY DIFFERS'));
  assert.equal(brief.registryReview.status,'differs');
  assert.deepEqual(brief.registryReview.differences,[{field:'build',dashboard:2000,registry:2500}]);
  assert.equal(brief.readyForDraft,false);
  assert.equal(brief.draft.source,'withheld');
  assert.equal(brief.afterSending.length,0);
  const closeText=run('close.mjs',['--all',...common]);
  assert.match(closeText,/REGISTRY DIFFERS/);
  assert.match(closeText,/build: dashboard=2000, registry=2500/);
  assert.match(closeText,/Follow-up withheld/);

  // Read-only: the store is byte-identical and nothing appeared beside it.
  assert.equal(fs.readFileSync(store,'utf8'),before);
  assert.deepEqual(fs.readdirSync(dir).sort(),['registry.json','store.json']);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
