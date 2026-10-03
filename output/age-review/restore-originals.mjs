import fs from 'node:fs';
import path from 'node:path';
const root='D:/DO-AN/SEQ';
const base=`${root}/public/images/finteen-v2`;
const out=`${root}/output/age-review`;
const entries=JSON.parse(fs.readFileSync(`${out}/original-hashes.json`,'utf8'));
const changed=[];
for(const e of entries){
  const rel=e.path.slice(base.length+1);
  const original=`${out}/originals/${rel}`;
  if(!fs.existsSync(original))throw Error(`Missing original ${rel}`);
  if(!fs.readFileSync(original).equals(fs.readFileSync(e.path))){
    const draft=`${out}/tall-drafts/${rel}`;
    fs.mkdirSync(path.dirname(draft),{recursive:true});
    fs.copyFileSync(e.path,draft);
    fs.copyFileSync(original,e.path);
    changed.push(rel);
  }
}
fs.writeFileSync(`${out}/restored-files.json`,JSON.stringify(changed,null,2));
console.log(JSON.stringify({restored:changed.length,originalsPreserved:entries.length}));
