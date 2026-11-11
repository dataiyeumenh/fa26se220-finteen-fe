import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/images/finteen-middle-school");
const roleLabels = { an: "An", minh: "Minh", "co-linh": "Cô Linh", me: "Mẹ của An", "tu-van": "Tư vấn viên nghề nghiệp", "shop-assistant": "Nhân viên cửa hàng", "bank-guide": "Hướng dẫn viên ngân hàng" };
const emotionLabels = { neutral: "Trung tính", thinking: "Suy nghĩ", relieved: "Nhẹ nhõm", "worried-money": "Lo lắng về tiền", inviting: "Mời gọi", explaining: "Giải thích", encouraging: "Khích lệ", presenting: "Trình bày", concerned: "Lo lắng" };
const assets = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith(".png") && full.includes(`${path.sep}chapter-`)) {
      const file = path.relative(root, full).split(path.sep).join("/");
      const [scope, chapter, , character] = file.split("/");
      const emotion = path.basename(file, ".png").slice(character.length + 1);
      const gender = scope === "male" ? "Bản nam" : scope === "female" ? "Bản nữ" : "Dùng chung bản nam/nữ";
      const chapterCode = `CH${chapter.slice(-2)}`;
      assets.push({ file, label: `${roleLabels[character]} – Cấp 2 – ${gender} – Chương ${chapter.slice(-2)} – ${emotionLabels[emotion]}`, chapterCode });
    }
  }
}

await walk(root);
assets.sort((a, b) => a.file.localeCompare(b.file, "vi"));
const manifest = { schoolLevel: "MIDDLE_SCHOOL", schoolLevelLabel: "Cấp 2", api: "POST /api/studio/assets", namingRule: "Nhân vật – Cấp 2 – Bản giới tính hoặc dùng chung – Chương – Biểu cảm", assets };
await writeFile(path.join(root, "upload-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
