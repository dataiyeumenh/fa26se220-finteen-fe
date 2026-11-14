// Release metadata is public. Learners load personalized chapters with their SLOT token;
// adults and guests keep using the public content endpoint.
// Giữ releaseVersion của lúc bắt đầu chơi cho hết chương (xem build/api-docs/content.md của BE).
import { apiConfig } from "./config.js";
import { resolveContentImages } from "../lib/imageAssets.js";
import { vietnameseApiMessage } from "../lib/vietnameseMessages.js";
import { auth } from "./auth.api.js";
import { personalizationApi } from "./personalization.api.js";

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
  const learnerId = auth.getSnapshot().actor?.kind === "learner" ? auth.getSnapshot().actor.id : null;
  const { version } = await getCurrentRelease();
  if (learnerId) {
    if (auth.getSnapshot().actor?.id !== learnerId || auth.getSnapshot().actor?.kind !== "learner")
      throw new Error("Phiên học đã thay đổi. Vui lòng mở lại chương.");
    return resolveContentImages(await personalizationApi.chapterForChild(version, code));
  }
  return resolveContentImages(await getJson(`/api/content/releases/${encodeURIComponent(version)}/chapters/${encodeURIComponent(code)}`));
}
