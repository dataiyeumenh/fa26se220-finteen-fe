import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../../api/auth.api'
import './assets.css'

const errorText = error => `${error.message}${error.status ? ` (HTTP ${error.status}, code ${error.code ?? '—'})` : ''}`

export default function AssetLibrary({ actor, embedded = false }) {
  const [assets, setAssets] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const requestId = useRef(0)
  const canUpload = ['ADMIN', 'GAME_EDITOR', 'GAME_MANAGER'].some(role => actor.roles.includes(role))
  async function load(filters = {}) {
    const id = ++requestId.current
    setLoading(true); setError('')
    try {
      const result = await auth.listStudioAssets(filters)
      if (id === requestId.current) setAssets(result || [])
    } catch (err) { if (id === requestId.current) setError(errorText(err)) }
    finally { if (id === requestId.current) setLoading(false) }
  }
  useEffect(() => {
    let active = true
    const id = ++requestId.current
    auth.listStudioAssets().then(result => {
      if (active && id === requestId.current) setAssets(result || [])
    }).catch(err => {
      if (active && id === requestId.current) setError(errorText(err))
    }).finally(() => {
      if (active && id === requestId.current) setLoading(false)
    })
    return () => { active = false }
  }, [])
  async function upload(event) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setUploading(true); setError(''); setNotice('')
    try {
      const result = await auth.uploadStudioAsset(form.get('file'), { label: form.get('label'), chapterCode: form.get('chapterCode') })
      setSelected(result.asset)
      setNotice(result.duplicate ? 'Ảnh đã tồn tại. Đã chọn bản cũ, không tải thêm bản trùng.' : 'Đã tải ảnh lên. Bạn có thể sao chép ref để dùng trong JSON chương.')
      formElement.reset()
      await load()
    } catch (err) { setError(errorText(err)) }
    finally { setUploading(false) }
  }
  return <main className="studio-assets">
    {!embedded && <nav><Link to="/internal">← Không gian nội bộ</Link><button onClick={() => auth.logout()}>Đăng xuất</button></nav>}
    <h1>Thư viện ảnh Studio</h1>
    <p>Tải ảnh, xem trước và lấy ref để dùng cho nền hoặc nhân vật trong JSON chương.</p>
    {canUpload ? <form onSubmit={upload}>
      <fieldset disabled={uploading}>
        <legend>Tải ảnh mới</legend>
        <label>Ảnh PNG / JPEG / WebP, tối đa 5 MB<input name="file" type="file" accept="image/png,image/jpeg,image/webp" required /></label>
        <label>Nhãn ảnh<input name="label" placeholder="Phòng khách nhà An" /></label>
        <label>Mã chương<input name="chapterCode" placeholder="CH04" /></label>
        <button type="submit">{uploading ? 'Đang tải ảnh…' : 'Tải ảnh lên'}</button>
      </fieldset>
    </form> : <p>Vai trò hiện tại không được tải ảnh lên.</p>}
    {error && <p role="alert">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {selected && <section aria-label="Ảnh đã chọn">
      <h2>{selected.label || 'Ảnh đã chọn'}</h2>
      <img className="studio-asset-preview" src={selected.url} alt={selected.label || 'Ảnh đã chọn'} />
      <label>Ref dùng trong JSON<input readOnly value={selected.ref || ''} onFocus={e => e.target.select()} /></label>
      <label>URL ảnh<input readOnly value={selected.url || ''} onFocus={e => e.target.select()} /></label>
      <button onClick={async () => {
        try { await navigator.clipboard.writeText(selected.ref); setNotice('Đã sao chép ref.') }
        catch { setError('Không thể sao chép tự động. Hãy chọn và sao chép ô ref.') }
      }}>Sao chép ref</button>
    </section>}
    <h2>Chọn ảnh có sẵn</h2>
    <form onSubmit={event => {
      event.preventDefault()
      const form = new FormData(event.currentTarget)
      void load({ chapter: form.get('chapter'), q: form.get('q') })
    }}><label>Mã chương<input name="chapter" placeholder="CH04" /></label><label>Tìm ảnh<input name="q" placeholder="Nhập từ khóa" /></label><button disabled={loading}>Tìm kiếm / Tải lại</button></form>
    {loading ? <p role="status">Đang tải thư viện…</p> : <>
      {!assets.length && <p>Không có ảnh phù hợp.</p>}
      <div className="studio-asset-grid">{assets.map(asset => <button key={asset.id || asset.ref} onClick={() => setSelected(asset)} aria-pressed={selected?.ref === asset.ref}>
        <img src={asset.url} alt={asset.label || 'Ảnh Studio'} loading="lazy" /><strong>{asset.label || asset.ref}</strong><span>{asset.chapterCode}</span>
      </button>)}</div>
    </>}
  </main>
}
