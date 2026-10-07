/**
 * Adapter để load Chapter 3 v2 config vào VisualNovelPlayer
 * Sử dụng: loadChapter3V2RuntimeData()
 */

import { chapter3V2GameData } from "./chapter3V2VisualNovel.js";

export async function loadChapter3V2RuntimeData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...chapter3V2GameData,
        loadedAt: new Date().toISOString(),
      });
    }, 100);
  });
}

export function chapter3V2Config() {
  return chapter3V2GameData;
}
