import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const names=['copperac','devine','truenorth','louies','pjs','mikesplace','stagecoach','cookinwithbeans','anchor'];
const repositories=[];
async function walk(dir,prefix=''){
 let entries;try{entries=await fs.readdir(dir,{withFileTypes:true});}catch(error){if(error.code==='ENOENT')return [];throw error;}
 const files=[];
 for(const entry of entries){if(entry.isSymbolicLink()||entry.name.startsWith('.')||entry.name==='node_modules')continue;const relative=prefix+entry.name;if(entry.isDirectory())files.push(...await walk(path.join(dir,entry.name),relative+'/'));else files.push(relative);}
 return files;
}
async function head(cwd){
 let git=path.join(cwd,'.git');const info=await fs.stat(git);
 if(info.isFile())git=path.resolve(cwd,(await fs.readFile(git,'utf8')).trim().replace(/^gitdir: /,''));
 const value=(await fs.readFile(path.join(git,'HEAD'),'utf8')).trim();if(!value.startsWith('ref: '))return value;
 const ref=value.slice(5);try{return (await fs.readFile(path.join(git,ref),'utf8')).trim();}catch(error){if(error.code!=='ENOENT')throw error;}
 const packed=await fs.readFile(path.join(git,'packed-refs'),'utf8');return packed.split('\n').find(line=>line.endsWith(' '+ref))?.split(' ')[0]||null;
}
for(const name of names){
 const cwd=path.join(root,name);let sourceFiles=[],commit;
 try{commit=await head(cwd);for(const tree of ['app','src','lib','components','pages'])sourceFiles.push(...await walk(path.join(cwd,tree),tree+'/'));}
 catch(error){repositories.push({name,error:error.code||error.message});continue;}
 const selected=sourceFiles.filter(file=>/\.(?:[cm]?js|tsx?)$/.test(file)&&/(?:^|\/)(?:ordering|workroom|square|kitchen|order|checkout)(?:\/|\.)|(?:^|\/)(?:money|cart|availability|mail|board|intake|liveCase|caseFeed|taplist)\.[cm]?[jt]s$/.test(file)).sort();
 const files=[];
 for(const file of selected){const source=(await fs.readFile(path.join(cwd,file),'utf8')).replaceAll('\r\n','\n');files.push({path:file,sha256LF:createHash('sha256').update(source).digest('hex')});}
 repositories.push({name,commit,files});
}
console.log(JSON.stringify({version:1,capturedAt:new Date().toISOString(),note:'Working-copy source inventory (including uncommitted files); hashes do not prove deployment or runtime equivalence.',repositories},null,2));
