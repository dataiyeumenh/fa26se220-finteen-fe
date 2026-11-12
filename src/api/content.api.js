// Nội dung game từ BE (công khai, không token): GET /api/content/current → version, rồi
// GET /api/content/releases/{version}/chapters/{code} → đúng object chapterNV2GameData như file data cũ
// (ảnh đã là URL CDN). Có version trên URL nên trình duyệt cache chương vĩnh viễn; bản mới = URL mới.
// Giữ releaseVersion của lúc bắt đầu chơi cho hết chương (xem build/api-docs/content.md của BE).
import { apiConfig } from "./config.js";
import { resolveContentImages } from "../lib/imageAssets.js";
import { vietnameseApiMessage } from "../lib/vietnameseMessages.js";

let currentRelease = null;

async function getJson(path) {
  let response;
  try {
    response = await fetch(`${apiConfig.baseUrl}${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "Không kết nối được máy chủ nội dung. Kiểm tra mạng rồi thử lại.",
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.code !== 0)
    throw new Error(
      vietnameseApiMessage(data?.message, data?.code, response.status,
        "Không tải được nội dung. Vui lòng thử lại."),
    );
  return data.result;
}

export function getCurrentRelease() {
  currentRelease ??= getJson("/api/content/current").catch((error) => {
    currentRelease = null;
    throw error;
  });
  return currentRelease;
}

export async function getChapterContent(code) {
  const { version } = await getCurrentRelease();
  return resolveContentImages(await getJson(`/api/content/releases/${version}/chapters/${code}`));
}
