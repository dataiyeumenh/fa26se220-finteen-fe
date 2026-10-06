import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = 'D:/DO-AN/SEQ';
const base = `${root}/public/images/finteen-v2`;
const out = `${root}/output/age-review`;
const ages = {1:14,2:16,3:17,4:16,5:16,6:18};
const walk = p => fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${p}/${e.name}`):[`${p}/${e.name}`]);
const files=walk(base).filter(p=>p.endsWith('.png')&&/\/(char|scene)\//.test(p));
const jobs=[];
const dedupe=new Map();
for(const target of files){
  const rel=target.slice(base.length+1), chapter=Number(rel.match(/chapter-(\d+)/)[1]);
  const backup=`${out}/originals/${rel}`;
  fs.mkdirSync(path.dirname(backup),{recursive:true});
  if(!fs.existsSync(backup)) fs.copyFileSync(target,backup);
  // The first edited neutral was already installed; recover its identical old source from chapter 2.
  if(rel==='chapter-01/char/an/an-neutral.png') fs.copyFileSync(`${base}/chapter-02/char/an/an-neutral.png`,backup);
  const isScene=rel.includes('/scene/');
  const who=isScene?'scene':rel.split('/')[2];
  const teen=['an','minh'].includes(who);
  const pose=path.basename(target,'.png');
  const key=isScene?rel:teen?`${ages[chapter]}-${pose}`:`adult-${pose}`;
  if(dedupe.has(key)){dedupe.get(key).targets.push(target);continue;}
  const job={id:key,kind:isScene?'scene':'sprite',chapter,age:ages[chapter],who,pose,original:backup,targets:[target],status:rel==='chapter-01/char/an/an-neutral.png'?'done':'pending'};
  if(job.status==='done')job.generated='C:/Users/ADMIN/.codex/generated_images/01a0ff0e-4046-7d33-807c-8bd8c85ad200/exec-7c3cd2b4-d21c-4bb4-a1ea-fb9628170e0b.png';
  jobs.push(job);dedupe.set(key,job);
}
fs.writeFileSync(`${out}/jobs.json`,JSON.stringify(jobs,null,2));
fs.writeFileSync(`${out}/original-hashes.json`,JSON.stringify(files.map(p=>({path:p,sha256:crypto.createHash('sha256').update(fs.readFileSync(`${out}/originals/${p.slice(base.length+1)}`)).digest('hex')})),null,2));
console.log(JSON.stringify({jobs:jobs.length,sprites:jobs.filter(j=>j.kind==='sprite').length,scenes:jobs.filter(j=>j.kind==='scene').length,files:files.length}));
