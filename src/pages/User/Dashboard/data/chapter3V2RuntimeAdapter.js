/**
 * Adapter để load Chapter 3 v2 config vào VisualNovelPlayer
 * Sử dụng: loadChapter3V2RuntimeData()
 * Từ 09/10 lấy từ API nội dung của BE (bản phát hành hiện tại), không còn import file data tĩnh.
 */

import { getChapterContent } from '@/api/content.api'

export async function loadChapter3V2RuntimeData() {
  return {
    ...(await getChapterContent('CH03')),
    loadedAt: new Date().toISOString(),
  };
}
