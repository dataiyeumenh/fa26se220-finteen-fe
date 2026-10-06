/**
 * Adapter để load Chapter 2 v2 config vào VisualNovelPlayer
 * Sử dụng: loadChapter2V2RuntimeData()
 */

import { chapter2V2GameData } from "./chapter2V2VisualNovel.js";

export async function loadChapter2V2RuntimeData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...chapter2V2GameData,
        loadedAt: new Date().toISOString(),
      });
    }, 100);
  });
}

export function chapter2V2Config() {
  return chapter2V2GameData;
}
