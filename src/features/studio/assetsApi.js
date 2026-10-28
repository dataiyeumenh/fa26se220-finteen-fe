// Gọi API kho ảnh — tách khỏi AssetsPage.jsx để file component chỉ export component (react-refresh).
import { studioApi, formatError } from "./studioClient";
import { ApiError } from "../../api/auth.client";

export async function fetchAssets(params) {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
  return studioApi.get("/api/studio/assets?" + q);
}

/** Tải nhiều tệp; trùng ảnh đã có → BE trả bản cũ (duplicate). Trả các asset đã có / đã tải. */
export async function uploadFiles(files, { label, chapterCode }, notify) {
  const out = [];
  for (const f of files) {
    try {
      if (
        !["image/png", "image/jpeg", "image/webp"].includes(f.type) ||
        !f.size ||
        f.size > 5 * 1024 * 1024
      ) {
        throw new ApiError(
          "Chá»n áº£nh PNG, JPEG hoáº·c WebP, tá»‘i Ä‘a 5 MB.",
          6008,
          400,
        );
      }
      const body = new FormData();
      body.append("file", f);
      if (label.trim()) body.append("label", label.trim());
      if (chapterCode.trim()) body.append("chapterCode", chapterCode.trim());
      const r = await studioApi.upload("/api/studio/assets", body);
      notify(
        r.duplicate
          ? `${f.name}: đã có trong kho — dùng lại bản cũ`
          : `${f.name}: đã tải lên`,
        true,
      );
      out.push(r.asset);
    } catch (e) {
      notify(`${f.name}: ${formatError(e)}`);
    }
  }
  return out;
}
