import fs from 'node:fs';
import crypto from 'node:crypto';
const root='D:/DO-AN/SEQ';
const out=`${root}/output/age-review`;
const base=`${root}/public/images/finteen-v2`;
const jobs=JSON.parse(fs.readFileSync(`${out}/chibi-jobs.json`,'utf8'));
if(jobs.length!==60||jobs.some(j=>!['draft-ready','installed'].includes(j.status)||!fs.existsSync(j.draft)))throw Error('Incomplete image set');
const files=[];
for(const j of jobs){
  const bytes=fs.readFileSync(j.draft);
  if(bytes.toString('hex',0,8)!=='89504e470d0a1a0a')throw Error(`Invalid PNG: ${j.id}`);
  const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  for(const target of j.targets){
    if(!target.startsWith(base+'/chapter-'))throw Error(`Unexpected destination ${target}`);
    fs.copyFileSync(j.draft,target);
    files.push({file:target.slice(base.length+1),kind:j.kind,character:j.who,scenarioAge:['an','minh','scene'].includes(j.who)?j.age:null,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256});
  }
  j.status='installed';
}
const manifest={updated:'2026-10-03',source:'GDD v2: 8 independent chapters',style:'All characters chibi; age communicated by clothing and facial cues, not growing bodies. Fixed adult models across chapters.',tool:'built-in image_gen',uniqueImages:jobs.length,files};
fs.writeFileSync(`${base}/character-age-manifest.json`,JSON.stringify(manifest,null,2));
fs.writeFileSync(`${out}/chibi-jobs.json`,JSON.stringify(jobs,null,2));
const ages={1:14,2:16,3:17,4:16,5:16,6:18};
for(let ch=1;ch<=6;ch++){
  const folder=`chapter-${String(ch).padStart(2,'0')}`;
  const file=`${base}/${folder}/README.md`;
  let md=fs.readFileSync(file,'utf8');
  const subset=files.filter(f=>f.file.startsWith(folder+'/'));
  const note=`\n\n<!-- chibi-age-update -->\n## Cập nhật tạo hình ngày 03/10/2026\n\n**Tất cả nhân vật đều chibi.** An/Minh trong tình huống này là **${ages[ch]} tuổi** theo GDD v2. Khác tuổi thể hiện qua quần áo và nét mặt; giữ tỷ lệ cơ thể chibi nhất quán, không dùng tăng chiều cao để phân biệt tuổi. Mẹ/cô/NPC dùng mẫu người lớn chibi cố định giữa các chương.\n\nĐã thay **${subset.filter(f=>f.kind==='sprite').length} sprite và ${subset.filter(f=>f.kind==='scene').length} tranh scene** bằng imagegen tích hợp tại đúng đường dẫn cũ. Các sprite giữ nền trong suốt. Xem [manifest kích thước và checksum hiện tại](../character-age-manifest.json), [quy tắc tạo hình](../README.md) và [nguồn độ tuổi](../../../../docs/finteen-v2-character-ages.md).\n\nThông tin nguồn tái sử dụng, kích thước và prompt cũ bên dưới là lịch sử của đợt tạo trước, được cập nhật này thay thế đối với **nhân vật và tranh scene**. Các hướng dẫn bối cảnh, đạo cụ, mini-game và tình huống vẫn dùng được. Bộ art này chưa được tích hợp thêm vào gameplay trong đợt sửa hình.\n<!-- /chibi-age-update -->\n`;
  md=md.replace(/\n*<!-- chibi-age-update -->[\s\S]*?<!-- \/chibi-age-update -->\n*/,'\n');
  const firstBreak=md.indexOf('\n');
  md=md.slice(0,firstBreak)+note+'\n'+md.slice(firstBreak+1).trimStart();
  fs.writeFileSync(file,md);
}
fs.writeFileSync(`${base}/README.md`,`# Bộ nhân vật chibi FinTeen v2\n\nCập nhật 03/10/2026 theo yêu cầu người dùng: **toàn bộ nhân vật dùng chibi; khác tuổi qua quần áo và nét mặt**. Giữ tỷ lệ cơ thể chibi nhất quán, không kéo dài chân/thân hoặc tạo thang chiều cao theo tuổi. Mẹ, cô Linh và các NPC người lớn có mẫu cố định dùng lại giữa các chương.\n\nĐã thay **84 PNG: 60 sprite và 24 tranh scene**, từ 60 ảnh riêng biệt tạo/chỉnh bằng imagegen tích hợp. Giữ đường dẫn cũ và alpha của sprite. Background trống, đạo cụ và ảnh mini-game không thuộc đợt sửa này.\n\n| Chương | Tuổi An/Minh | Trang phục nhận diện |\n| --- | --- | --- |\n| [1](chapter-01/README.md) | 14 | Áo thun/polo, quần short |\n| [2](chapter-02/README.md) | 16 | Áo khoác sơ mi ngắn tay, áo trong sáng, quần dài |\n| [3](chapter-03/README.md) | 17 | Polo và quần dài |\n| [4](chapter-04/README.md) | 16 | Cùng bộ chương 2 |\n| [5](chapter-05/README.md) | 16 | Cùng bộ chương 2 |\n| [6](chapter-06/README.md) | 18 | Sơ mi xắn tay và quần dài |\n\nGDD v2 có 8 **tình huống độc lập**. Chương 7 là 17 tuổi, chương 8 là 18 tuổi; hai chương này chưa nằm trong bộ ảnh hiện tại. Không nối số chương thành một hành trình lớn lên.\n\n- [Nguồn và quy tắc độ tuổi](../../../docs/finteen-v2-character-ages.md).\n- [Manifest ảnh hiện tại](character-age-manifest.json).\n- [Bảng kiểm tra sprite](../../../output/age-review/final-sprites-review.png).\n- [Bảng kiểm tra scene](../../../output/age-review/final-scenes-review.png).\n- [Bộ prompt cuối](../../../output/age-review/final-prompt-set.md).\n\nKhi ghép sprite, dùng contain và canh chân; không đặt hệ số tăng chiều cao theo tuổi. Dùng scene có sẵn nhân vật thì ẩn sprite rời. Việc sửa asset không tự tích hợp nội dung v2 vào gameplay main.\n`);
console.log(JSON.stringify({installed:files.length,sprites:files.filter(f=>f.kind==='sprite').length,scenes:files.filter(f=>f.kind==='scene').length,uniqueImages:jobs.length}));
