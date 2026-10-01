const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
const sharp = require('sharp');
const { PGlite } = require('@electric-sql/pglite');
const root = path.resolve(__dirname, '..');
const paths = {'lib/workroom/events-def.ts':'event-fields/1.0.0/events-def.ts','lib/workroom/owner-request.ts':'owner-request/1.0.0/owner-request.ts','lib/workroom/event-cas.ts':'event-cas/1.0.0/event-cas.ts','lib/workroom/content-cas.ts':'content-cas/1.0.0/content-cas.ts','lib/workroom/event-photo.ts':'event-photo/1.0.0/event-photo.ts'};
function load(file, mocks = {}, env = { NODE_ENV: 'development' }) {
  const source = ts.transpileModule(fs.readFileSync(path.join(root, paths[file]), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} }, context = vm.createContext({ module, exports: module.exports, process: { env }, Buffer, Request, Response, URL, Date, structuredClone, AbortController, setTimeout, clearTimeout, fetch: () => { throw Error('Unexpected network'); },
    require(name) { if (Object.hasOwn(mocks, name)) return mocks[name]; if (name === 'server-only') return {}; if (name === 'node:crypto') return crypto; if (name === 'sharp') return sharp; throw Error('Unexpected dependency: ' + name); }
  });
  new vm.Script(source, { filename: file }).runInContext(context); return module.exports;
}
const json = value => JSON.parse(JSON.stringify(value));
const draft = fields => ({ ...fields.blankEvent(), title: 'Fixture event', date: '2026-10-12', startTime: '19:00' });
test('event validation rejects impossible dates, times, omitted fields and oversized content', () => {
  const fields = load('lib/workroom/events-def.ts'), valid = draft(fields);
  assert.equal(fields.parseEventDraft({ ...valid, published: undefined }), null);
  assert.equal(fields.parseEventDraft({ ...valid, price: 1 }), null);
  for (const [key, value] of [['date', '2026-02-31'], ['date', '2025-02-29'], ['startTime', '24:00'], ['endTime', '19:99'], ['title', 'x'.repeat(81)], ['ticketUrl', 'javascript:alert(1)']]) assert(fields.parseEventDraft({ ...valid, [key]: value }).errors[key]);
  assert.equal(Object.keys(fields.parseEventDraft({ ...valid, date: '2028-02-29' }).errors).length, 0);
  assert(fields.parseEventDraft({ ...valid, date: '2026-03-08', startTime: '02:30' }).errors.startTime);
  assert.equal(Object.keys(fields.parseEventDraft({ ...valid, date: '2026-11-01', startTime: '01:30' }).errors).length, 0);
  assert.equal(fields.parseEventsContact({ name: 'Only a name' }), null);
  assert(fields.parseEventsContact({ name: '', email: 'x'.repeat(121), phone: '' }).errors.email);
});

test('PostgreSQL event writes and their audit records are atomic, with duplicate/stale writes rejected', async () => {
  const db = new PGlite(), { compareEvent } = load('lib/workroom/event-cas.ts'), { CONTENT_HISTORY_SCHEMA } = load('lib/workroom/content-cas.ts');
  try {
    await db.exec('CREATE TABLE workroom_events(key text PRIMARY KEY,data jsonb NOT NULL);' + CONTENT_HISTORY_SCHEMA);
    const query = (sql, params) => db.query(sql, params), key = 'evt_sqltest';
    assert.deepEqual(await Promise.all([compareEvent(query, key, null, { title: 'First' }), compareEvent(query, key, null, { title: 'Second' })]), [true, false]);
    assert.equal(await compareEvent(query, key, { title: 'Stale' }, { title: 'Wrong' }), false);
    assert.equal(await compareEvent(query, key, { title: 'First' }, { title: 'Archived', archivedAt: 1 }), true);
    await db.exec("ALTER TABLE workroom_content_history ADD CONSTRAINT fail_fixture CHECK (actor <> 'owner') NOT VALID");
    await assert.rejects(compareEvent(query, key, { title: 'Archived', archivedAt: 1 }, { title: 'Should roll back' }));
    assert.deepEqual((await db.query('SELECT data FROM workroom_events')).rows[0].data, { title: 'Archived', archivedAt: 1 });
    assert.equal((await db.query('SELECT * FROM workroom_content_history')).rows.length, 2);
  } finally { await db.close(); }
});

test('generic owner requests require validated acknowledgement and never retry an uncertain write', async () => {
  const { ownerRequest } = load('lib/workroom/owner-request.ts'); let calls = 0;
  const valid = value => value?.ok === true && value.id === 'fixture';
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const result = await ownerRequest('/fixture', method, {}, valid, async (_url, init) => { calls++; assert.equal(init.method, method); return Response.json({ ok: true, id: 'fixture' }); });
    assert.equal(result.kind, 'saved');
  }
  assert.equal(calls, 3);
  assert.equal((await ownerRequest('/fixture', 'PUT', {}, valid, async () => Response.json({ ok: true }))).kind, 'uncertain');
  for (const [status, kind] of [[401, 'locked'], [409, 'conflict'], [400, 'invalid'], [503, 'uncertain']]) assert.equal((await ownerRequest('/fixture', 'PUT', {}, valid, async () => Response.json({}, { status }))).kind, kind);
  let timeoutCalls = 0;
  const timeout = await ownerRequest('/fixture', 'POST', {}, valid, (_url, init) => { timeoutCalls++; return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(Error('timeout')))); }, 5);
  assert.equal(timeout.kind, 'uncertain'); assert.equal(timeoutCalls, 1);
});
test('canonical event photos decode real bytes, reject corrupt/mismatched types and deduplicate normalized output', async () => {
 const {prepareEventPhoto}=load('lib/workroom/event-photo.ts');
 await assert.rejects(prepareEventPhoto('data:image/png;base64,aGVsbG8='));
 const png=await sharp({create:{width:1400,height:10,channels:3,background:'#754acc'}}).png().toBuffer();
 await assert.rejects(prepareEventPhoto('data:image/jpeg;base64,'+png.toString('base64')));
 const input='data:image/png;base64,'+png.toString('base64'),a=await prepareEventPhoto(input),b=await prepareEventPhoto(input);
 assert.equal(a.id,b.id);assert.equal(a.contentType,'image/jpeg');assert.match(a.id,/^img_[a-f0-9]{64}$/);
 const meta=await sharp(Buffer.from(a.base64,'base64')).metadata();assert.equal(meta.format,'jpeg');assert.equal(meta.width,1200);
 await assert.rejects(prepareEventPhoto('x'.repeat(2_600_101)));
});
