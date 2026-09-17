/** Read the public registry on main without executing downloaded JavaScript.
 * Usage: loadMainRegistry(); fixtureRegistry(file) is for --fixture only.
 * Failures return an explicit unchecked result, never a silent local fallback.
 */
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require = createRequire(import.meta.url);
const ENDPOINT = 'https://api.github.com/repos/hershock48/glazedweb/contents/lib/customOrders.js?ref=main';
const MAX_SOURCE = 256 * 1024, MAX_RESPONSE = 512 * 1024;

export function parseRegistrySource(source) {
  if (typeof source !== 'string' || Buffer.byteLength(source, 'utf8') > MAX_SOURCE) throw Error('Registry source exceeds its size limit.');
  // Next already supplies Babel's parser. Parse only literal CUSTOM_ORDERS data;
  // reject getters, spreads, computed keys and calls instead of evaluating code.
  const {parse} = require('next/dist/compiled/babel/parser');
  const tree = parse(source, {sourceType:'module'}), matches = [];
  for (const statement of tree.program.body) {
    if (statement.type !== 'ExportNamedDeclaration' || statement.declaration?.type !== 'VariableDeclaration') continue;
    for (const item of statement.declaration.declarations) if (item.id.type === 'Identifier' && item.id.name === 'CUSTOM_ORDERS') matches.push(item.init);
  }
  if (matches.length !== 1 || matches[0]?.type !== 'ObjectExpression') throw Error('Registry must export one literal CUSTOM_ORDERS object.');
  function literal(node, depth = 0) {
    if (!node || depth > 30) throw Error('Registry contains unsupported data.');
    if (['StringLiteral','BooleanLiteral','NumericLiteral'].includes(node.type)) return node.value;
    if (node.type === 'NullLiteral') return null;
    if (node.type === 'ArrayExpression') return node.elements.map(item => literal(item, depth + 1));
    if (node.type === 'ObjectExpression') {
      const value = Object.create(null);
      for (const item of node.properties) {
        if (item.type !== 'ObjectProperty' || item.computed || item.method || item.shorthand || !['Identifier','StringLiteral'].includes(item.key.type)) throw Error('Registry contains executable or computed data.');
        const key = item.key.name ?? item.key.value;
        if (['__proto__','constructor','prototype'].includes(key) || Object.hasOwn(value,key)) throw Error('Registry contains an unsafe or duplicate key.');
        value[key] = literal(item.value, depth + 1);
      }
      return value;
    }
    throw Error('Registry contains executable or unsupported data.');
  }
  return validateOrders(literal(matches[0]));
}

function validateOrders(orders) {
  if (!orders || typeof orders !== 'object' || Array.isArray(orders) || Object.keys(orders).length > 1000) throw Error('Registry orders are invalid.');
  for (const [id, order] of Object.entries(orders)) {
    if (!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(id) || !order || typeof order !== 'object' || Array.isArray(order)) throw Error('Registry account is invalid.');
    for (const key of ['buildFee','monthly']) if (order[key] !== undefined && order[key] !== null &&
      (!Number.isFinite(order[key]) || order[key] < 0)) throw Error('Registry price is invalid.');
  }
  return orders;
}

async function boundedText(response) {
  if (Number(response.headers.get('content-length')) > MAX_RESPONSE) throw Error('Registry response exceeds its size limit.');
  const reader = response.body.getReader(), chunks = []; let size = 0;
  try {
    for (;;) {
      const {done,value} = await reader.read(); if (done) break;
      size += value.length; if (size > MAX_RESPONSE) throw Error('Registry response exceeds its size limit.');
      chunks.push(Buffer.from(value));
    }
  } finally { await reader.cancel().catch(() => {}); }
  return Buffer.concat(chunks).toString('utf8');
}

export async function loadMainRegistry({fetchImpl = fetch, now = () => new Date()} = {}) {
  const check = {source:'GitHub main',url:'https://github.com/hershock48/glazedweb/blob/main/lib/customOrders.js',checkedAt:now().toISOString()};
  try {
    const response = await fetchImpl(ENDPOINT, {signal:AbortSignal.timeout(5000),cache:'no-store',redirect:'error',headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
    if (!response.ok) throw Error('GitHub returned HTTP ' + response.status + '.');
    const payload = JSON.parse(await boundedText(response));
    if (payload.path !== 'lib/customOrders.js' || payload.encoding !== 'base64' || !/^[a-f0-9]{40}$/.test(payload.sha) || typeof payload.content !== 'string') throw Error('Registry response has an unexpected shape.');
    const source = Buffer.from(payload.content, 'base64').toString('utf8');
    const actualSha = createHash('sha1').update('blob ' + Buffer.byteLength(source,'utf8') + '\0').update(source).digest('hex');
    if (actualSha !== payload.sha) throw Error('Registry content does not match its source blob.');
    return {orders:parseRegistrySource(source),source,check:{...check,status:'checked',blobSha:payload.sha}};
  } catch (error) {
    return {orders:null,source:'',check:{...check,status:'unavailable',message:'REGISTRY NOT CHECKED: ' + (error.name === 'TimeoutError' ? 'GitHub check timed out.' : error.message)}};
  }
}

export function fixtureRegistry(file) {
  const input = file ? JSON.parse(fs.readFileSync(file,'utf8')) : {orders:{}};
  return {orders:validateOrders(input.orders),todos:input.todos || {},check:{status:'fixture',source:'Explicit isolated fixture'}};
}

export function registryReview(registry, slug, row, operations) {
  const source = registry?.check || {status:'fixture',source:'Supplied registry'};
  if (!registry?.orders || source.status === 'unavailable') return {status:'unavailable',source,differences:[]};
  const matches = Object.keys(registry.orders).filter(id => id === slug || (row.aliases || []).includes(id));
  const id = Object.hasOwn(registry.orders,slug) ? slug : matches.length === 1 ? matches[0] : null;
  if (!id) return {status:matches.length > 1 ? 'ambiguous' : 'not-listed',source,differences:[]};
  const order = registry.orders[id], differences = [];
  const prices = row._studio ? row.commercial : row.price;
  for (const [field, current, expected] of row._studio ? [['build',prices?.build ?? null,order.buildFee ?? null],['monthly',prices?.monthly ?? null,order.monthly ?? null]] : []) {
    if (current !== expected) differences.push({field,dashboard:current,registry:expected});
  }
  // An omitted/false registry flag cannot disprove a newer receipt or launch.
  if (row._studio && order.buildFeePaid === true && operations.buildPayment !== 'paid') differences.push({field:'buildPayment',dashboard:operations.buildPayment,registry:'paid'});
  if (row._studio && order.live === true && !['live','support'].includes(operations.delivery)) differences.push({field:'delivery',dashboard:operations.delivery,registry:'live'});
  return {status:differences.length ? 'differs' : 'matched',registryId:id,source,differences};
}

export function registryWarnings(review) {
  if (review?.status === 'differs') return ['REGISTRY DIFFERS'];
  if (review?.status === 'ambiguous') return ['REGISTRY MATCH AMBIGUOUS'];
  if (review?.status === 'unavailable') return ['REGISTRY NOT CHECKED'];
  return [];
}

export function registryReviewLines(review) {
  const warnings = registryWarnings(review);
  if (!warnings.length) return [];
  const lines = [warnings.join('; ')];
  for (const difference of review.differences) lines.push(difference.field + ': dashboard=' + String(difference.dashboard ?? 'not recorded') + ', registry=' + String(difference.registry ?? 'not recorded'));
  if (review.source?.message) lines.push(review.source.message);
  lines.push('Review the source and reconcile with dated evidence before using these facts in a proposal or agreement. No records were changed.');
  return lines;
}
