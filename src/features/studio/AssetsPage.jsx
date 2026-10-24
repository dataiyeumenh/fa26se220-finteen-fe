import { useCallback, useState } from 'react'
import { auth } from '../../api/auth.api'
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog'
import { canWriteLibrary } from './permissions'
import { fetchAssets, uploadFiles } from './assetsApi'
import { fmtTime, studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'
import Pagination from './Pagination'

const statuses = { IN_USE: 'Đang dùng', NEW: 'Mới', OLD: 'Cũ', ORPHAN: 'Chưa được sử dụng' }

function AssetGrid({ rows, onPick }) {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">{rows.map(asset => <button type="button" key={asset.id || asset.ref} className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left hover:border-emerald-600" onClick={() => onPick(asset)}>
    {asset.kind === 'AUDIO' ? <div className="p-6">Âm thanh</div> : <img src={asset.url} alt={asset.label || 'Ảnh Studio'} loading="lazy" className="h-36 w-full bg-slate-50 object-contain" />}
    <div className="p-3 text-xs"><Tag tone={asset.status}>{statuses[asset.status] || asset.status}</Tag><strong className="mt-2 block break-all">{asset.label || asset.ref?.split('/').pop()}</strong><small>{asset.chapterCode} {asset.width ? `· ${asset.width}×${asset.height}` : ''}</small></div>
  </button>)}{!rows.length && <p className="text-sm text-slate-500">Không có tài nguyên phù hợp.</p>}</div>
}

function UploadForm({ notify, chapter = '', onDone }) {
  const { busy, run } = useStudioAction(notify)
  if (!canWriteLibrary(auth.getSnapshot().actor)) return null
  return <form className="my-4 grid gap-3 rounded-lg bg-emerald-50 p-4" onSubmit={event => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    void run(async () => {
      const assets = await uploadFiles(fields.getAll('file'), { label: fields.get('label'), chapterCode: fields.get('chapterCode') }, notify)
      if (!assets.length) throw new Error('Không có ảnh nào tải lên thành công. Kiểm tra thông báo lỗi và thử lại.')
      form.reset(); onDone(assets)
      return assets
    }, result => `Đã xử lý ${result.length} ảnh.`)
  }}><fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2">
    <label>Ảnh PNG/JPEG/WebP, tối đa 5 MB mỗi tệp<input name="file" type="file" accept="image/png,image/jpeg,image/webp" multiple required /></label>
    <label>Nhãn ảnh<input className={`${inputCls} w-full`} name="label" /></label>
    <label>Mã chương<input className={`${inputCls} w-full`} name="chapterCode" defaultValue={chapter} placeholder="CH04" /></label>
    <Btn type="submit" tone="primary" disabled={busy}>{busy ? 'Đang tải…' : 'Tải ảnh lên'}</Btn>
  </fieldset></form>
}

export function AssetPicker({ chapter, onPick, onClose, notify }) {
  const [all, setAll] = useState(false)
  const loader = useCallback(() => fetchAssets({ kind: 'IMAGE', chapter: all ? '' : chapter }), [all, chapter])
  const query = useStudioResource(loader)
  return <Dialog open onOpenChange={open => { if (!open) onClose() }}><DialogContent className="max-h-[85vh] max-w-4xl overflow-auto" aria-describedby={undefined}>
    <DialogTitle>Chọn ảnh cho {chapter}</DialogTitle>
    <label className="text-sm"><input type="checkbox" checked={all} onChange={event => setAll(event.target.checked)} /> Hiển thị mọi chương</label>
    <UploadForm notify={notify} chapter={chapter} onDone={assets => onPick(assets[0])} />
    {query.loading ? <p role="status">Đang tải ảnh…</p> : query.error ? <p role="alert">{query.error}</p> : <AssetGrid rows={query.data || []} onPick={onPick} />}
    <Btn onClick={query.reload}>Tải lại</Btn>
  </DialogContent></Dialog>
}

function AssetDetail({ asset, notify, onClose, onChanged }) {
  const loader = useCallback(() => asset.id ? studioApi.get(`/api/studio/assets/${encodeURIComponent(asset.id)}`) : Promise.resolve(asset), [asset])
  const query = useStudioResource(loader)
  const { busy, run } = useStudioAction(notify)
  const value = query.data
  const write = canWriteLibrary(auth.getSnapshot().actor)
  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose() }}><DialogContent className="max-h-[85vh] max-w-3xl overflow-auto" aria-describedby={undefined}>
    <DialogTitle>Chi tiết tài nguyên</DialogTitle>
    {query.loading ? <p role="status">Đang tải chi tiết…</p> : query.error ? <><p role="alert">{query.error}</p><Btn onClick={query.reload}>Thử lại</Btn></> : value && <>
      {value.kind === 'AUDIO' ? <audio controls src={value.url} /> : <img className="max-h-64 w-full object-contain" src={value.url} alt={value.label || 'Ảnh Studio'} />}
      <Tag tone={value.status}>{statuses[value.status] || value.status}</Tag>
      <p className="text-xs text-slate-500">{value.uploadedByName} · {fmtTime(value.createdAt)}</p>
      <label>Ref dùng trong JSON<input className={`${inputCls} w-full`} readOnly value={value.ref || ''} onFocus={event => event.target.select()} /></label>
      <label>URL<input className={`${inputCls} w-full`} readOnly value={value.url || ''} onFocus={event => event.target.select()} /></label>
      <Btn onClick={async () => { try { await navigator.clipboard.writeText(value.ref); notify('Đã sao chép ref.', true) } catch { notify('Hãy chọn ô ref và sao chép thủ công.') } }}>Sao chép ref</Btn>
      <h3 className="font-semibold">Đang dùng ở</h3>
      <ul>{value.usage?.map((usage, index) => <li key={index}>{usage.chapterCode} · {usage.where} · {usage.versions?.join(', ')} · {usage.sceneIds?.join(', ')}</li>)}</ul>
      {!value.usage?.length && <p>Chưa có nơi sử dụng.</p>}
      {write && value.registered && <form onSubmit={event => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        void run(() => studioApi.put(`/api/studio/assets/${encodeURIComponent(value.id)}`, { label: form.get('label').trim(), chapterCode: form.get('chapterCode').trim() || null }), 'Đã lưu thông tin ảnh.', onChanged)
      }}><fieldset disabled={busy} className="grid gap-3"><label>Nhãn<input className={`${inputCls} w-full`} name="label" defaultValue={value.label || ''} /></label><label>Mã chương<input className={`${inputCls} w-full`} name="chapterCode" defaultValue={value.chapterCode || ''} /></label><div className="flex gap-2"><Btn disabled={busy} type="submit" tone="primary">Lưu nhãn</Btn><Btn disabled={busy || value.status !== 'ORPHAN'} tone="danger" title="Chỉ xóa ảnh mồ côi" onClick={() => {
        if (window.confirm('Xóa vĩnh viễn ảnh không còn được nội dung nào tham chiếu?')) void run(() => studioApi.del(`/api/studio/assets/${encodeURIComponent(value.id)}`), 'Đã xóa ảnh.', onChanged)
      }}>Xóa ảnh</Btn></div></fieldset></form>}
    </>}
  </DialogContent></Dialog>
}

export default function AssetsPage({ notify }) {
  const [filters, setFilters] = useState({ kind: 'IMAGE' })
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(12)
  const [selected, setSelected] = useState(null)
  const loader = useCallback(() => fetchAssets(filters), [filters])
  const query = useStudioResource(loader)
  const rows = query.data || []
  const activePage = Math.min(page, Math.max(0, Math.ceil(rows.length / size) - 1))
  return <>
    <Panel title="Kho tài nguyên" actions={<Btn disabled={query.loading} onClick={query.reload}>Tải lại</Btn>}>
      <UploadForm notify={notify} onDone={() => query.reload()} />
      <form className="mb-4 flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); setFilters(Object.fromEntries(new FormData(event.currentTarget))); setPage(0) }}>
        <label>Loại<select className={inputCls} name="kind"><option value="IMAGE">Ảnh</option><option value="AUDIO">Âm thanh</option><option value="">Tất cả</option></select></label>
        <label>Mã chương<input className={`${inputCls} w-28`} name="chapter" placeholder="CH04" /></label>
        <label>Trạng thái<select className={inputCls} name="status"><option value="">Tất cả</option>{Object.entries(statuses).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
        <label>Tìm nhãn<input className={inputCls} name="q" /></label><Btn type="submit">Tìm kiếm</Btn>
      </form>
      <p className="mb-4 text-xs text-slate-500">“Chưa được sử dụng”: hiện không được nội dung nào tham chiếu, theo kiểm tra của máy chủ. Chỉ tài nguyên ở trạng thái này mới được phép xóa.</p>
      {query.loading ? <p role="status">Đang tải thư viện…</p> : query.error ? <p role="alert" className="text-red-700">{query.error}</p> : <><div className="studio-library-scroll" role="region" aria-label="Danh sách tài nguyên" tabIndex={0}><AssetGrid rows={rows.slice(activePage * size, (activePage + 1) * size)} onPick={setSelected} /></div><Pagination total={rows.length} page={activePage} size={size} sizes={[12, 24, 48]} onPage={setPage} onSize={value => { setSize(value); setPage(0) }} noun="tài nguyên" /></>}
    </Panel>
    {selected && <AssetDetail asset={selected} notify={notify} onClose={() => setSelected(null)} onChanged={() => { setSelected(null); query.reload() }} />}
  </>
}
