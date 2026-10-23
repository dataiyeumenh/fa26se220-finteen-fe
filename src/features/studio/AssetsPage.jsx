// Kho ảnh (BE: build/api-docs/assets.md). Trạng thái do BE tính: đang dùng / mới / cũ / mồ côi.
import { useCallback, useEffect, useState } from 'react'
import { fmtTime, hasRole, studioApi } from './studioClient'
import { fetchAssets, uploadFiles } from './assetsApi'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'

const ST = { IN_USE: 'Đang dùng', NEW: 'Mới', OLD: 'Cũ', ORPHAN: 'Mồ côi' }
const WHERE = { CURRENT: 'bản đang chạy', DRAFT: 'nháp', OLD: 'bản trước' }
const kb = (n) => (n == null ? '' : n < 1024 ? `${n} B` : `${Math.round(n / 1024)} KB`)

export function AssetCard({ a, onClick }) {
  const chapters = [...new Set(a.usage.map((u) => u.chapterCode))].join(', ') || a.chapterCode || ''
  return (
    <button type="button" onClick={onClick} className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left hover:border-blue-500">
      <div className="aspect-[4/3] bg-slate-100 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${a.url}")` }} />
      <div className="p-2 text-xs">
        <Tag tone={a.status}>{ST[a.status]}</Tag> {!a.registered && <span className="text-slate-400">chưa đăng ký</span>}
        <div className="truncate font-semibold">{a.label || a.ref.split('/').pop()}</div>
        <div className="text-slate-500">
          {chapters} {a.width ? `· ${a.width}×${a.height}` : ''} {kb(a.sizeBytes)}
        </div>
      </div>
    </button>
  )
}

/** Hộp chọn ảnh cho màn soạn cảnh: lọc sẵn chương đang soạn, tải lên ngay trong hộp. */
export function AssetPicker({ chapter, onPick, onClose, notify }) {
  const [all, setAll] = useState(false)
  const [rows, setRows] = useState([])
  useEffect(() => {
    fetchAssets({ kind: 'IMAGE', chapter: all ? '' : chapter }).then(setRows, (e) => notify(e.message))
  }, [all, chapter, notify])
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-5xl overflow-auto rounded-xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-[#1f3864]">Chọn ảnh {all ? '(mọi chương)' : `cho ${chapter}`}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Btn onClick={() => setAll(!all)}>{all ? `Chỉ ${chapter}` : 'Mọi chương'}</Btn>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={async (e) => {
                const up = await uploadFiles([...e.target.files], { chapterCode: chapter }, notify)
                if (up[0]) onPick(up[0])
              }}
            />
            <Btn onClick={onClose}>Đóng</Btn>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
          {rows.map((a) => (
            <AssetCard key={a.ref} a={a} onClick={() => onPick(a)} />
          ))}
          {rows.length === 0 && <p className="text-sm text-slate-500">Chưa có ảnh — tải lên ở nút bên trên.</p>}
        </div>
      </div>
    </div>
  )
}

function AssetDetail({ a, onClose, onChanged, notify }) {
  const [label, setLabel] = useState(a.label || '')
  const [ch, setCh] = useState(a.chapterCode || '')
  const write = hasRole('ADMIN', 'GAME_EDITOR', 'GAME_MANAGER')
  const save = async () => {
    try {
      await studioApi.put('/api/studio/assets/' + a.id, { label, chapterCode: ch || null })
      notify('Đã lưu', true)
      onChanged()
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }
  const remove = async () => {
    if (!window.confirm('Xoá hẳn ảnh mồ côi này?')) return
    try {
      await studioApi.del('/api/studio/assets/' + a.id)
      notify('Đã xoá', true)
      onChanged()
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="grid max-h-[85vh] w-full max-w-4xl gap-4 overflow-auto rounded-xl bg-white p-4 md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        <img src={a.url} alt={a.label || ''} className="w-full rounded-lg bg-slate-100" />
        <div className="text-sm">
          <div className="mb-2 flex items-center justify-between">
            <Tag tone={a.status}>{ST[a.status]}</Tag>
            <Btn onClick={onClose}>Đóng</Btn>
          </div>
          <p className="text-slate-500">
            {a.width ? `${a.width}×${a.height} · ` : ''}
            {kb(a.sizeBytes)}
            {a.uploadedByName ? ` · tải bởi ${a.uploadedByName} ${fmtTime(a.createdAt)}` : ''}
            {!a.registered && ' · chưa có phiếu trong bảng Asset (tệp chuyển nhà 22/10)'}
          </p>
          <label className="mt-2 block text-xs text-slate-500">Chuỗi dán vào JSON</label>
          <input className={`${inputCls} w-full`} readOnly value={a.ref} onFocus={(e) => e.target.select()} />
          <h3 className="mt-3 font-semibold">Đang dùng ở</h3>
          {a.usage.length ? (
            <ul className="list-disc pl-5">
              {a.usage.map((u) => (
                <li key={u.chapterCode + u.where}>
                  <b>{u.chapterCode}</b> · {WHERE[u.where]} {u.versions.join(', ')}
                  {u.sceneIds.length > 0 && ` · cảnh ${u.sceneIds.join(', ')}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">Chưa chỗ nào dùng.</p>
          )}
          {a.registered && write && (
            <>
              <label className="mt-3 block text-xs text-slate-500">Nhãn</label>
              <input className={`${inputCls} w-full`} value={label} onChange={(e) => setLabel(e.target.value)} />
              <label className="mt-2 block text-xs text-slate-500">Chương gợi ý</label>
              <input className={`${inputCls} w-full`} value={ch} onChange={(e) => setCh(e.target.value)} />
              <div className="mt-3 flex gap-2">
                <Btn tone="primary" onClick={save}>
                  Lưu nhãn
                </Btn>
                <Btn tone="danger" onClick={remove} disabled={a.status !== 'ORPHAN'} title={a.status !== 'ORPHAN' ? 'Chỉ xoá được ảnh mồ côi (6009)' : ''}>
                  Xoá
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AssetsPage({ notify }) {
  const [filter, setFilter] = useState({ chapter: '', status: '', kind: 'IMAGE', q: '' })
  const [rows, setRows] = useState([])
  const [chapters, setChapters] = useState([])
  const [detail, setDetail] = useState(null)
  const [files, setFiles] = useState([])
  const [meta, setMeta] = useState({ label: '', chapterCode: '' })

  const load = useCallback(async () => {
    try {
      setRows(await fetchAssets(filter))
    } catch (e) {
      notify(e.message)
    }
  }, [filter, notify])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])
  useEffect(() => {
    studioApi.get('/api/studio/chapters').then((r) => setChapters(r.map((c) => c.code)), () => {})
  }, [])

  return (
    <>
      <Panel
        title="Kho ảnh"
        actions={
          <>
            <select className={inputCls} value={filter.chapter} onChange={(e) => setFilter({ ...filter, chapter: e.target.value })}>
              <option value="">Mọi chương</option>
              {chapters.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select className={inputCls} value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">Mọi trạng thái</option>
              {Object.entries(ST).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select className={inputCls} value={filter.kind} onChange={(e) => setFilter({ ...filter, kind: e.target.value })}>
              <option value="IMAGE">Ảnh</option>
              <option value="AUDIO">Giọng</option>
              <option value="">Tất cả</option>
            </select>
            <input className={inputCls} placeholder="tìm nhãn…" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
          </>
        }
      >
        {hasRole('ADMIN', 'GAME_EDITOR', 'GAME_MANAGER') && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => setFiles([...e.target.files])} />
            <input className={inputCls} placeholder="nhãn (trống = tên tệp)" value={meta.label} onChange={(e) => setMeta({ ...meta, label: e.target.value })} />
            <input className={`${inputCls} w-36`} placeholder="chương gợi ý CH04" value={meta.chapterCode} onChange={(e) => setMeta({ ...meta, chapterCode: e.target.value })} />
            <Btn
              tone="primary"
              disabled={!files.length}
              onClick={async () => {
                await uploadFiles(files, meta, notify)
                setFiles([])
                void load()
              }}
            >
              Tải lên
            </Btn>
            <span className="text-xs text-slate-500">PNG / JPEG tự đổi sang WebP (rộng ≤ 1920, giữ nền trong suốt). Trùng → dùng lại bản cũ.</span>
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
          {rows.map((a) => (
            <AssetCard key={a.ref} a={a} onClick={() => setDetail(a)} />
          ))}
          {rows.length === 0 && <p className="text-sm text-slate-500">Không có tệp nào.</p>}
        </div>
      </Panel>
      {detail && (
        <AssetDetail
          a={detail}
          notify={notify}
          onClose={() => setDetail(null)}
          onChanged={() => {
            setDetail(null)
            void load()
          }}
        />
      )}
    </>
  )
}
