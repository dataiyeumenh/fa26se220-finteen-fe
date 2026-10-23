// Gọi API kho ảnh — tách khỏi AssetsPage.jsx để file component chỉ export component (react-refresh).
import { studioApi } from './studioClient'

export async function fetchAssets(params) {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v))
  return studioApi.get('/api/studio/assets?' + q)
}

/** Tải nhiều tệp; trùng ảnh đã có → BE trả bản cũ (duplicate). Trả các asset đã có / đã tải. */
export async function uploadFiles(files, { label, chapterCode }, notify) {
  const out = []
  for (const f of files) {
    const form = new FormData()
    form.append('file', f)
    if (label) form.append('label', label)
    if (chapterCode) form.append('chapterCode', chapterCode)
    try {
      const r = await studioApi.upload('/api/studio/assets', form)
      notify(r.duplicate ? `${f.name}: đã có trong kho — dùng lại bản cũ` : `${f.name}: đã tải lên`, true)
      out.push(r.asset)
    } catch (e) {
      notify(`${f.name}: ${e.code ?? ''} ${e.message}`)
    }
  }
  return out
}
