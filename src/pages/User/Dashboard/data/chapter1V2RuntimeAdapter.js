/**
 * Adapter để load Chapter 1 v2 config vào VisualNovelPlayer
 * Sử dụng: loadChapter1V2RuntimeData()
 */

import { chapter1V2GameData } from './chapter1V2VisualNovel.js';

export async function loadChapter1V2RuntimeData() {
  // Trong tương lai, có thể load từ API backend
  // Hiện tại chỉ return config tĩnh
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...chapter1V2GameData,
        loadedAt: new Date().toISOString(),
      });
    }, 100);
  });
}

export function chapter1V2Config() {
  return chapter1V2GameData;
}
