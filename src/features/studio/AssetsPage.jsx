import { useCallback, useState } from 'react'
import { ArrowDownWideNarrow, CheckCircle2, Copy, FolderOpen, ImageOff, Images, ListFilter, Music, Search, Upload, X } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { canWriteLibrary } from './permissions'
import { fetchAssets, uploadFiles } from './assetsApi'
import { fmtTime, studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { Btn, ConfirmDialog, PageHeader, StateBox, StudioDialog, Tag } from './ui'
import Pagination from './Pagination'

const STATUS = {
  IN_USE: ['Đang dùng', 'Có trong bản game đang chạy.'],
  NEW: ['Mới', 'Chỉ có trong bản nháp, chưa phát hành.'],
  OLD: ['Bản cũ', 'Chỉ còn ở bản phát hành trước. Giữ lại để có thể quay về bản đó.'],
  ORPHAN: ['Chưa dùng', 'Chưa nội dung nào dùng ảnh này. Có thể xoá.'],
}
const WHERE = { CURRENT: 'bản đang chạy', DRAFT: 'bản nháp', OLD: 'bản cũ' }
const nameOf = asset => asset.label || ''
const fileNameOf = asset => (asset.ref || asset.url || '').split('?')[0].split('/').pop() || 'Chưa đặt tên'
// Chương gắn tay, nếu không có thì lấy từ nơi đang dùng.
const chapterOf = asset => asset.chapterCode || [...new Set((asset.usage || []).map(usage => usage.chapterCode).filter(Boolean))].join(', ')

function AssetCard({ asset, onPick }) {
  const [broken, setBroken] = useState(false)
  const name = nameOf(asset)
  return <button type="button" className={`sp-asset${asset.kind === 'AUDIO' ? ' is-audio' : ''}`} onClick={() => onPick(asset)} aria-label={`${name || fileNameOf(asset)}${chapterOf(asset) ? `, ${chapterOf(asset)}` : ''}, ${STATUS[asset.status]?.[0] || ''}`}>
    <span className="sp-asset-img">{asset.kind === 'AUDIO' ? <span className="sp-asset-audio-art"><Music size={34} aria-hidden="true" /><span aria-hidden="true">▂ ▅ ▃ ▇ ▄ ▆ ▂ ▅ ▃</span></span> : broken ? <ImageOff size={32} aria-hidden="true" /> : <img src={asset.url} alt="" loading="lazy" onError={() => setBroken(true)} />}<span className="sp-asset-kind">{asset.kind === 'AUDIO' ? 'Âm thanh' : 'Ảnh'}</span><span className="sp-asset-open">{asset.kind === 'AUDIO' ? 'Nghe và xem chi tiết' : 'Xem chi tiết'}</span></span>
    <span className="sp-asset-info"><strong title={name || fileNameOf(asset)}>{name || fileNameOf(asset)}</strong>
      <span className="sp-asset-file-meta">{asset.kind === 'AUDIO' ? 'Bản ghi âm thanh' : asset.width && asset.height ? `${asset.width} × ${asset.height}` : 'Hình ảnh'}{asset.sizeBytes ? ` · ${Math.max(1, Math.round(asset.sizeBytes / 1024))} KB` : ''}</span>
      <span><span className="sp-asset-chapter">{chapterOf(asset) || 'Chưa gắn chương'}</span>{asset.status && <Tag tone={asset.status}>{STATUS[asset.status]?.[0] || asset.status}</Tag>}</span></span>
  </button>
}

function AssetGrid({ rows, onPick, empty }) {
  if (!rows.length) return empty
  return <div className="sp-asset-grid">{rows.map(asset => <AssetCard key={asset.id || asset.ref} asset={asset} onPick={onPick} />)}</div>
}

function UploadForm({ notify, chapter = '', onDone, onCancel }) {
  const { busy, run } = useStudioAction(notify)
  const [files, setFiles] = useState([])
  return <form className="sp-dialog-body" onSubmit={event => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    void run(async () => {
      const assets = await uploadFiles(fields.getAll('file'), { label: fields.get('label'), chapterCode: fields.get('chapterCode') }, notify)
      if (!assets.length) throw new Error('Chưa tải lên được ảnh nào. Xem thông báo lỗi của từng tệp rồi thử lại.')
      form.reset(); setFiles([]); onDone(assets)
      return assets
    }, result => `Đã xong ${result.length} ảnh.`)
  }}><fieldset disabled={busy} className="sp-dialog-body">
    <label className="sp-drop"><Upload size={26} aria-hidden="true" /><strong>{files.length ? `Đã chọn ${files.length} ảnh` : 'Chọn ảnh từ máy'}</strong>
      <span>{files.length ? files.map(file => file.name).join(', ') : 'PNG, JPEG hoặc WebP, tối đa 5 MB mỗi ảnh. Chọn được nhiều ảnh một lúc.'}</span>
      <input name="file" type="file" accept="image/png,image/jpeg,image/webp" multiple required onChange={event => setFiles([...event.target.files])} /></label>
    <div className="sp-grid-2">
      <label className="sp-field">Tên ảnh<small>Để trống thì lấy tên tệp.</small><input className="sp-input" name="label" placeholder="Ví dụ: Phòng khách nhà An" /></label>
      <label className="sp-field">Thuộc chương<small>Ví dụ CH04 hoặc 4.</small><input className="sp-input" name="chapterCode" defaultValue={chapter} placeholder="CH04" /></label>
    </div>
    <p className="sp-hint">Ảnh tự đổi sang WebP cho nhẹ. Ảnh đã có trong kho sẽ không lưu thêm bản thứ hai.</p>
    <div className="sp-dialog-actions">{onCancel && <Btn onClick={onCancel}>Huỷ</Btn>}<Btn type="submit" tone="primary">{busy ? 'Đang tải lên…' : 'Tải ảnh lên'}</Btn></div>
  </fieldset></form>
}

/** Dùng trong trình soạn: chọn ảnh cho cảnh. Giữ nguyên API (chapter, onPick, onClose, notify). */
export function AssetPicker({ chapter, onPick, onClose, notify }) {
  const [all, setAll] = useState(false)
  const loader = useCallback(() => fetchAssets({ kind: 'IMAGE', chapter: all ? '' : chapter }), [all, chapter])
  const query = useStudioResource(loader)
  const write = canWriteLibrary(auth.getSnapshot().actor)
  return <StudioDialog title={`Chọn ảnh cho ${chapter}`} onClose={onClose} wide>
    <div className="sp-dialog-body">
      <label className="sp-check"><input type="checkbox" checked={all} onChange={event => setAll(event.target.checked)} />Hiện ảnh của mọi chương</label>
      {write && <details className="sp-more"><summary>Tải ảnh mới lên</summary><UploadForm notify={notify} chapter={chapter} onDone={assets => onPick(assets[0])} /></details>}
      {query.loading ? <StateBox kind="loading">Đang tải ảnh…</StateBox>
        : query.error ? <StateBox kind="error" title="Chưa tải được ảnh" actions={<Btn onClick={query.reload}>Thử lại</Btn>}>{query.error}</StateBox>
        : <AssetGrid rows={query.data || []} onPick={onPick} empty={<StateBox title={`Chưa có ảnh nào của ${chapter}`} actions={!all && <Btn onClick={() => setAll(true)}>Xem ảnh mọi chương</Btn>}>Bật "Hiện ảnh của mọi chương" hoặc tải ảnh mới lên.</StateBox>} />}
    </div>
  </StudioDialog>
}

function AssetDetail({ asset, notify, onClose, onChanged }) {
  const loader = useCallback(() => asset.id ? studioApi.get(`/api/studio/assets/${encodeURIComponent(asset.id)}`) : Promise.resolve(asset), [asset])
  const query = useStudioResource(loader)
  const { busy, run, error, clearError } = useStudioAction(notify)
  const [deleting, setDeleting] = useState(false)
  const value = query.data
  const write = canWriteLibrary(auth.getSnapshot().actor)
  const copy = async () => { try { await navigator.clipboard.writeText(value.ref); notify('Đã sao chép mã ảnh.', true) } catch { notify('Chưa sao chép được. Mở "Thông tin kỹ thuật" và chép tay.') } }
  return <StudioDialog title={value ? nameOf(value) || 'Ảnh chưa đặt tên' : 'Chi tiết ảnh'} onClose={onClose} busy={busy} wide>
    {query.loading ? <StateBox kind="loading">Đang tải chi tiết…</StateBox>
      : query.error ? <StateBox kind="error" title="Chưa tải được chi tiết ảnh" actions={<Btn onClick={query.reload}>Thử lại</Btn>}>{query.error}</StateBox>
      : value && <div className="sp-asset-detail">
        <div className="sp-asset-img">{value.kind === 'AUDIO' ? <audio controls src={value.url} /> : <img src={value.url} alt={nameOf(value) || 'Ảnh chưa đặt tên'} />}</div>
        <div className="sp-dialog-body">
          <div><Tag tone={value.status}>{STATUS[value.status]?.[0] || value.status}</Tag><p className="sp-hint" style={{ marginTop: 6 }}>{STATUS[value.status]?.[1]}</p></div>
          <p className="sp-hint">{[value.width && `${value.width} × ${value.height} px`, value.sizeBytes && `${Math.round(value.sizeBytes / 1024)} KB`, value.uploadedByName && `tải lên bởi ${value.uploadedByName}`, value.createdAt && fmtTime(value.createdAt)].filter(Boolean).join(', ')}</p>
          <div><h3 className="sp-field" style={{ marginBottom: 6 }}>Đang được dùng ở</h3>
            {value.usage?.length ? <ul className="sp-usage">{value.usage.map((usage, index) => <li key={index}>{usage.chapterCode}, {WHERE[usage.where] || usage.where}
              {usage.versions?.length > 0 && <small>Bản {usage.versions.join(', ')}</small>}{usage.sceneIds?.length > 0 && <small>Cảnh {usage.sceneIds.join(', ')}</small>}</li>)}</ul>
              : <p className="sp-hint">Chưa chương nào dùng ảnh này.</p>}</div>
          <div className="sp-head-actions"><Btn onClick={copy}><Copy size={16} aria-hidden="true" />Sao chép mã ảnh</Btn></div>
          {write && (value.registered ? <form className="sp-dialog-body" onSubmit={event => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            void run(() => studioApi.put(`/api/studio/assets/${encodeURIComponent(value.id)}`, { label: form.get('label').trim(), chapterCode: form.get('chapterCode').trim() || null }), 'Đã lưu thông tin ảnh.', onChanged)
          }}><fieldset disabled={busy} className="sp-dialog-body">
            <div className="sp-grid-2"><label className="sp-field">Tên ảnh<input className="sp-input" name="label" defaultValue={value.label || ''} /></label>
              <label className="sp-field">Thuộc chương<input className="sp-input" name="chapterCode" defaultValue={value.chapterCode || ''} placeholder="CH04" /></label></div>
            <div className="sp-dialog-actions">
              {value.status === 'ORPHAN' ? <Btn tone="danger" onClick={() => { clearError(); setDeleting(true) }}>Xoá ảnh</Btn> : <span className="sp-hint" style={{ marginRight: 'auto' }}>Ảnh đang được dùng nên không xoá được.</span>}
              <Btn type="submit" tone="primary">Lưu nhãn</Btn></div>
          </fieldset></form> : <p className="sp-hint">Ảnh này chuyển từ kho cũ, chưa có phiếu trong kho mới nên chưa sửa tên hay xoá được.</p>)}
          <details className="sp-tech"><summary>Thông tin kỹ thuật</summary>
            <label className="sp-field">Mã ảnh dùng trong nội dung<input className="sp-input" readOnly value={value.ref || ''} onFocus={event => event.target.select()} /></label>
            <label className="sp-field">Đường dẫn<input className="sp-input" readOnly value={value.url || ''} onFocus={event => event.target.select()} /></label></details>
        </div>
      </div>}
    {deleting && <ConfirmDialog tone="danger" title="Xoá vĩnh viễn ảnh này?" confirmLabel="Xoá vĩnh viễn" busy={busy} error={error} onClose={() => setDeleting(false)}
      onConfirm={() => void run(() => studioApi.del(`/api/studio/assets/${encodeURIComponent(value.id)}`), 'Đã xoá ảnh.', () => { setDeleting(false); onChanged() })}>
      Ảnh bị xoá khỏi kho và không khôi phục được. Hiện chưa nội dung nào dùng ảnh này.
    </ConfirmDialog>}
  </StudioDialog>
}

const KINDS = [['IMAGE', 'Ảnh'], ['AUDIO', 'Âm thanh']]

export default function AssetsPage({ notify, title = 'Kho ảnh', intro }) {
  const [filters, setFilters] = useState({ kind: 'IMAGE', chapter: '', status: '', q: '' })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(24)
  const [selected, setSelected] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [sort, setSort] = useState('newest')
  const write = canWriteLibrary(auth.getSnapshot().actor)
  const loader = useCallback(() => fetchAssets(filters), [filters])
  const query = useStudioResource(loader)
  const chaptersLoader = useCallback(() => studioApi.get('/api/studio/chapters'), [])
  const chapters = useStudioResource(chaptersLoader).data || []
  const rows = query.data || []
  const sorted = [...rows].sort((a, b) => sort === 'name'
    ? (nameOf(a) || fileNameOf(a)).localeCompare(nameOf(b) || fileNameOf(b), 'vi', { numeric: true })
    : sort === 'size' ? (b.sizeBytes || 0) - (a.sizeBytes || 0)
      : (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
  const inUseCount = rows.filter(asset => asset.status === 'IN_USE').length
  const chapterCount = new Set(rows.flatMap(asset => chapterOf(asset).split(',').map(value => value.trim()).filter(Boolean))).size
  const activePage = Math.min(page, Math.max(0, Math.ceil(rows.length / size) - 1))
  const filter = patch => { setFilters(value => ({ ...value, ...patch })); setPage(0) }
  const filtered = filters.chapter || filters.status || filters.q
  const resetFilters = () => { setSearch(''); filter({ chapter: '', status: '', q: '' }) }
  return <div className="sp-library-page">
    <PageHeader className="sp-chapter-page-head" title={title} intro={intro || 'Quản lý hình ảnh và âm thanh dùng trong các chương. Chọn tài nguyên để xem trước và kiểm tra nơi sử dụng.'} actions={write && <Btn tone="primary" onClick={() => setUploading(true)}><Upload size={17} aria-hidden="true" />Tải ảnh lên</Btn>} />
    {!query.loading && !query.error && <section className="sp-asset-overview" aria-label="Tổng quan kho tài nguyên">
      <div><Images size={21} aria-hidden="true" /><span><small>{filtered ? 'Khớp bộ lọc' : filters.kind === 'AUDIO' ? 'Tệp âm thanh' : 'Tệp hình ảnh'}</small><strong>{rows.length}</strong></span></div>
      <div><CheckCircle2 size={21} aria-hidden="true" /><span><small>Đang dùng trong game</small><strong>{inUseCount}</strong></span></div>
      <div><FolderOpen size={21} aria-hidden="true" /><span><small>Chương trong kết quả</small><strong>{chapterCount}</strong></span></div>
    </section>}
    <section className="sp-library-filters" aria-label="Bộ lọc tài nguyên">
      <div className="sp-library-filter-head"><div className="sp-chips sp-asset-kinds" role="group" aria-label="Loại tệp">{KINDS.map(([value, label]) => <button type="button" key={value} className="sp-chip" aria-pressed={filters.kind === value} onClick={() => filter({ kind: value })}>{value === 'AUDIO' ? <Music size={17} aria-hidden="true" /> : <Images size={17} aria-hidden="true" />}{label}</button>)}</div><span><ListFilter size={15} aria-hidden="true" />Lọc tài nguyên</span></div>
    <div className="sp-asset-toolbar">
      <form role="search" className="sp-asset-search" onSubmit={event => { event.preventDefault(); filter({ q: search.trim() }) }}>
        <Search size={18} aria-hidden="true" /><input id="sp-asset-search" aria-label="Tìm tài nguyên theo tên" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nhập tên tài nguyên…" /><button type="submit">Tìm kiếm</button>
      </form>
      <label className="sp-field sp-asset-filter">Chương<select className="sp-input" value={filters.chapter} onChange={event => filter({ chapter: event.target.value })}>
        <option value="">Mọi chương</option>{chapters.map(draft => <option key={draft.code} value={draft.code}>{draft.code}: {draft.title}</option>)}</select></label>
      <label className="sp-field sp-asset-filter">Trạng thái<select className="sp-input" value={filters.status} onChange={event => filter({ status: event.target.value })}>
        <option value="">Mọi trạng thái</option>{Object.entries(STATUS).map(([key, [label]]) => <option value={key} key={key}>{label}</option>)}</select></label>
    </div>
    {filtered && <div className="sp-library-active-filters"><span>Đang lọc:</span>{filters.chapter && <button type="button" onClick={() => filter({ chapter: '' })}>Chương {filters.chapter}<X size={13} aria-hidden="true" /><span className="sr-only">Bỏ lọc chương</span></button>}{filters.status && <button type="button" onClick={() => filter({ status: '' })}>{STATUS[filters.status][0]}<X size={13} aria-hidden="true" /><span className="sr-only">Bỏ lọc trạng thái</span></button>}{filters.q && <button type="button" onClick={() => { setSearch(''); filter({ q: '' }) }}>“{filters.q}”<X size={13} aria-hidden="true" /><span className="sr-only">Bỏ từ khóa</span></button>}<button type="button" className="sp-library-reset" onClick={resetFilters}>Xóa bộ lọc</button></div>}
    {filters.status && <p className="sp-hint">{STATUS[filters.status][0]}: {STATUS[filters.status][1]}</p>}
    </section>
    <div className="sp-library-results"><h2>{filters.kind === 'AUDIO' ? 'Thư viện âm thanh' : 'Thư viện hình ảnh'} <span aria-live="polite">{query.loading ? 'Đang tải…' : `${rows.length} tài nguyên`}</span></h2><label><ArrowDownWideNarrow size={16} aria-hidden="true" /><select aria-label="Sắp xếp tài nguyên" value={sort} onChange={event => { setSort(event.target.value); setPage(0) }}><option value="newest">Mới nhất trước</option><option value="name">Tên A → Z</option><option value="size">Dung lượng lớn nhất</option></select></label></div>
    {query.loading ? <StateBox kind="loading">Đang tải tài nguyên…</StateBox>
      : query.error ? <StateBox kind="error" title="Chưa tải được kho tài nguyên" actions={<Btn onClick={query.reload}>Thử lại</Btn>}>{query.error}</StateBox>
      : <>
        <div role="region" aria-label="Danh sách tài nguyên"><AssetGrid rows={sorted.slice(activePage * size, (activePage + 1) * size)} onPick={setSelected}
          empty={<StateBox title={filtered ? 'Không có tài nguyên khớp bộ lọc' : 'Chưa có tài nguyên loại này'} actions={filtered ? <Btn onClick={resetFilters}>Xóa bộ lọc</Btn> : filters.kind === 'IMAGE' && write && <Btn tone="primary" onClick={() => setUploading(true)}>Tải ảnh lên</Btn>}>
            {filtered ? 'Thử từ khóa khác hoặc bỏ bớt điều kiện lọc.' : filters.kind === 'AUDIO' ? 'Các bản ghi âm thanh sẽ xuất hiện tại đây khi được thêm vào kho.' : 'Tải hình ảnh lên để bắt đầu xây dựng nội dung cho các chương.'}</StateBox>} /></div>
        {rows.length > 0 && <Pagination total={rows.length} page={activePage} size={size} sizes={[24, 48, 96]} onPage={setPage} onSize={value => { setSize(value); setPage(0) }} noun="tài nguyên" />}
      </>}
    {uploading && <StudioDialog title="Tải ảnh lên kho" onClose={() => setUploading(false)}><UploadForm notify={notify} chapter={filters.chapter} onCancel={() => setUploading(false)} onDone={() => { setUploading(false); query.reload() }} /></StudioDialog>}
    {selected && <AssetDetail asset={selected} notify={notify} onClose={() => setSelected(null)} onChanged={() => { setSelected(null); query.reload() }} />}
  </div>
}
