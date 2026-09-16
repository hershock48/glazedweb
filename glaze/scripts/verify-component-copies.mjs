import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),root=path.dirname(repo);
const registry=JSON.parse(await fs.readFile(path.join(repo,'glaze/catalog/components.json'),'utf8'));
const hash=async file=>createHash('sha256').update((await fs.readFile(file,'utf8')).replaceAll('\r\n','\n')).digest('hex');
let failures=0;
for(const component of registry.components){
 const canonical=await hash(path.join(repo,component.file));
 if(canonical!==component.sha256LF){console.error(`${component.id}@${component.version}: canonical hash mismatch`);failures++;}
 for(const copy of component.copies){
  try{const actual=await hash(path.join(root,copy.repo,copy.file));if(actual!==component.sha256LF)throw Error('local changes or drift');console.log(`${copy.repo}: ${component.id}@${component.version} matches`);}
  catch(error){console.error(`${copy.repo}: ${component.id}: ${error.message}`);failures++;}
 }
}
process.exitCode=failures?1:0;
