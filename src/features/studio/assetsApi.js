// Gọi API kho ảnh — tách khỏi AssetsPage.jsx để file component chỉ export component (react-refresh).
import { studioApi, formatError } from './studioClient'
import { auth } from '../../api/auth.api'

export async function fetchAssets(params) {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v))
  return studioApi.get('/api/studio/assets?' + q)
}

/** Tải nhiều tệp; trùng ảnh đã có → BE trả bản cũ (duplicate). Trả các asset đã có / đã tải. */
export async function uploadFiles(files, { label, chapterCode }, notify) {
  const out = []
  for (const f of files) {
    try {
      const r = await auth.uploadStudioAsset(f, { label, chapterCode })
      notify(r.duplicate ? `${f.name}: đã có trong kho — dùng lại bản cũ` : `${f.name}: đã tải lên`, true)
      out.push(r.asset)
    } catch (e) {
      notify(`${f.name}: ${formatError(e)}`)
    }
  }
  return out
}
