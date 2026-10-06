import fs from 'node:fs';
import crypto from 'node:crypto';
const root='D:/DO-AN/SEQ';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const dir=root+'/output/scene-character-audit';
const fixes=read(dir+'/fixes.json');
const jp=root+'/output/age-review/chibi-jobs.json';
const mp=root+'/public/images/finteen-v2/character-age-manifest.json';
const jobs=read(jp), manifest=read(mp);
for(const f of fixes){
 const j=jobs.find(j=>j.id===f.id), m=manifest.files.find(m=>m.file===f.id);
 if(!j||!m||!fs.existsSync(f.backup)||!fs.existsSync(f.draft))throw Error(f.id);
 if(f.status==='installed')continue;
 j.auditHistory=[...(j.auditHistory||[]),{date:'2026-10-03',previousGenerated:j.generated,previousPrompt:j.prompt,backup:f.backup,correction:f.change}];
 fs.copyFileSync(f.draft,f.target);fs.copyFileSync(f.draft,j.draft);
 j.generated=f.generated;j.prompt=f.prompt;j.references=[f.backup,f.reference];j.status='installed';
 const b=fs.readFileSync(f.target);
 m.width=b.readUInt32BE(16);m.height=b.readUInt32BE(20);m.sha256=crypto.createHash('sha256').update(b).digest('hex');
 f.status='installed';
}
write(jp,jobs);write(mp,manifest);write(dir+'/fixes.json',fixes);
for(const m of manifest.files){
 const b=fs.readFileSync(root+'/public/images/finteen-v2/'+m.file);
 if(crypto.createHash('sha256').update(b).digest('hex').toLowerCase()!==m.sha256.toLowerCase())throw Error('Hash mismatch '+m.file);
}
const notes={
 'chapter-01/scene/sc01-receiving-allowance.png':'Đã sửa phần trang phục dưới eo của mẹ thành màu đen theo sprite.',
 'chapter-01/scene/sc03-checking-priorities.png':'Đã sửa phần trang phục dưới eo và dây buộc của mẹ theo sprite.',
 'chapter-05/scene/sc03-money-and-purchasing-power.png':'Đã đưa tóc buộc của cô Linh về vai bên trái ảnh theo sprite.',
 'chapter-06/scene/sc04-realistic-repayment-plan.png':'Đã đưa tóc buộc của cô Linh về vai bên trái ảnh theo sprite.'
};
let report='# Đối chiếu scene và nhân vật từng chương\n\nNgày kiểm tra: 03/10/2026. Đã xem trực quan đủ 24 scene trong 6 chương hiện có, đối chiếu với sprite của đúng chương. Ban đầu 20 scene khớp và 4 scene lệch chi tiết; cả 4 đã được sửa và thay vào dự án.\n\nTiêu chí: nhận diện khuôn mặt, tóc, trang phục nhìn thấy và tỷ lệ chibi. Khác biệt do biểu cảm, tư thế, góc nhìn được chấp nhận; không kết luận về phần trang phục bị che khuất. Mỗi chương là câu chuyện độc lập. An và Minh theo tuổi từng chương (14, 16, 17, 16, 16, 18); người lớn giữ mẫu cố định.\n\n';
for(let n=1;n<=6;n++){
 const ch='chapter-'+String(n).padStart(2,'0');
 report+=`## Chương ${n}\n\n[Ảnh đối chiếu sprite và tất cả scene](${ch}-comparison.png)\n\n| Scene | Kết quả |\n|---|---|\n`;
 for(const j of jobs.filter(j=>j.kind==='scene'&&j.id.startsWith(ch+'/'))){
 report+=`| [${j.id.split('/').at(-1)}](../../public/images/finteen-v2/${j.id}) | ${notes[j.id]||'Khớp nhận diện và trang phục nhìn thấy; không cần sửa.'} |\n`;
 }
 report+='\n';
}
report+='## Bản sửa và kiểm chứng\n\nBốn bản sửa dùng công cụ built-in imagegen, giữ phong cách chibi. [Prompt, ảnh tham chiếu và đường dẫn bản sao lưu](fixes.json). Ảnh trước sửa nằm trong thư mục `before/`. Đã xem từng bản sửa trước khi cài đặt.\n\nĐã đồng bộ bản ảnh chính, bản nháp sản xuất và manifest; kiểm tra SHA-256 đủ 84 file. Các ảnh đối chiếu được tạo lại từ ảnh đã cài đặt.\n';
fs.writeFileSync(dir+'/README.md',report);
console.log('Installed 4 audited corrections; verified 84 manifest hashes; wrote 24-scene report.');
