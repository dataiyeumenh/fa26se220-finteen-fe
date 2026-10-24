import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { studioApi, fmtTime } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { useToast } from './useToast'
import { Btn, ConfirmDialog, PageHeader, StateBox, StudioDialog, Tag } from './ui'

const PROVIDERS = { GEMINI: 'Google Gemini', OPENROUTER: 'OpenRouter' }

// Trạng thái khoá nói bằng một câu: dùng được không, vì sao.
function keyState(key) {
  if (!key.enabled) return { tag: ['Đã tắt', 'DRAFT'], line: 'Hàng đợi AI không dùng khoá này. Khoá vẫn được giữ.' }
  if (key.coolDownUntil && new Date(key.coolDownUntil) > new Date()) return { tag: ['Tạm nghỉ', 'warn'], line: `Hết lượt tạm thời, dùng lại từ ${fmtTime(key.coolDownUntil)}.` }
  if (key.lastTestOk === false) return { tag: ['Lỗi', 'bad'], line: `Lần thử ${fmtTime(key.lastTestAt)} thất bại: ${key.lastError || 'không có chi tiết'}`, bad: true }
  if (key.lastTestOk) return { tag: ['Đang bật', 'APPROVED'], line: `Thử lần cuối ${fmtTime(key.lastTestAt)}: Thành công` }
  return { tag: ['Đang bật', 'APPROVED'], line: 'Chưa thử lần nào. Bấm Kiểm tra để chắc khoá dùng được.' }
}

function AddKeyDialog({ busy, error, onClose, onAdd }) {
  return <StudioDialog title="Thêm khoá AI" onClose={onClose} busy={busy}>
    <form className="sp-dialog-body" onSubmit={event => {
      event.preventDefault()
      const fields = new FormData(event.currentTarget)
      onAdd({ provider: fields.get('provider'), alias: fields.get('alias').trim(), key: fields.get('key').trim(), priority: Number(fields.get('priority')) })
    }}><fieldset disabled={busy} className="sp-dialog-body">
      <div className="sp-grid-2">
        <label className="sp-field">Nhà cung cấp<select name="provider" className="sp-input">{Object.entries(PROVIDERS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="sp-field">Tên gợi nhớ<input name="alias" className="sp-input" required placeholder="Ví dụ: Gemini của Hưng" /></label>
      </div>
      <label className="sp-field">Khoá bí mật<input name="key" type="password" autoComplete="off" className="sp-input" required /></label>
      <label className="sp-field">Thứ tự dùng<small>Số nhỏ được dùng trước. Để 0 nếu không cần.</small><input name="priority" type="number" step="1" defaultValue="0" className="sp-input" required style={{ maxWidth: 140 }} /></label>
      <p className="sp-hint">Khoá được thử ngay khi thêm. Sau khi lưu, khoá thật không bao giờ hiện lại; danh sách chỉ hiện 4 ký tự cuối.</p>
      {error && <div className="sp-inline-error" role="alert">{error}</div>}
      <div className="sp-dialog-actions"><Btn onClick={onClose}>Huỷ</Btn><Btn type="submit" tone="primary">{busy ? 'Đang thêm…' : 'Thêm khoá'}</Btn></div>
    </fieldset></form>
  </StudioDialog>
}

export default function AiKeysPage() {
  const { notify, view } = useToast()
  const loader = useCallback(() => studioApi.get('/api/admin/ai-keys'), [])
  const query = useStudioResource(loader)
  const { busy, run, error, clearError } = useStudioAction(notify)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const rows = query.data || []
  const act = (id, action) => run(async () => {
    const result = await (action === 'delete' ? studioApi.del(`/api/admin/ai-keys/${encodeURIComponent(id)}`) : studioApi.post(`/api/admin/ai-keys/${encodeURIComponent(id)}/${action}`))
    if (action === 'test' && result?.lastTestOk === false) { query.reload(); throw new Error(`Khoá chưa dùng được: ${result.lastError || 'không có chi tiết'}`) }
    return result
  }, { test: 'Khoá dùng được.', enable: 'Đã bật khoá.', disable: 'Đã tắt khoá.', delete: 'Đã xoá khoá.' }[action], () => { setDeleting(null); query.reload() })
  const add = body => void run(() => studioApi.post('/api/admin/ai-keys', body), result => result?.lastTestOk === false ? `Đã thêm khoá, nhưng lần thử đầu thất bại: ${result.lastError || 'không có chi tiết'}` : 'Đã thêm khoá AI.', () => { setAdding(false); query.reload() })
  return <div className="sp-scope">
    <PageHeader title="Khoá AI" intro="Khoá dùng cho gợi ý giọng đọc và báo cáo. Hàng đợi AI dùng khoá đang bật theo thứ tự, khoá lỗi hoặc hết lượt thì chuyển sang khoá kế tiếp."
      actions={<Btn tone="primary" disabled={busy} onClick={() => { clearError(); setAdding(true) }}><Plus size={17} aria-hidden="true" />Thêm khoá</Btn>} />
    {query.loading && !query.data ? <StateBox kind="loading">Đang tải khoá AI…</StateBox>
      : query.error ? <StateBox kind="error" title="Chưa tải được danh sách khoá" actions={<Btn onClick={query.reload}>Thử lại</Btn>}>{query.error}</StateBox>
      : !rows.length ? <StateBox title="Chưa có khoá AI" actions={<Btn tone="primary" onClick={() => setAdding(true)}>Thêm khoá đầu tiên</Btn>}>Khi chưa có khoá, gợi ý giọng đọc chỉ dùng luật có sẵn.</StateBox>
      : <ul className="sp-keys" aria-label="Danh sách khoá AI">{rows.map(key => {
        const state = keyState(key)
        return <li className="sp-key" key={key.id}>
          <div><div className="sp-key-name"><strong>{key.alias}</strong><Tag tone={state.tag[1]}>{state.tag[0]}</Tag><span className="sp-hint">{PROVIDERS[key.provider] || key.provider}, thứ tự {key.priority}</span><code>{key.masked}</code></div>
            <p className={state.bad ? 'is-bad' : undefined}>{state.line}</p></div>
          <div className="sp-key-actions"><Btn disabled={busy} onClick={() => void act(key.id, 'test')}>Kiểm tra</Btn>
            <Btn disabled={busy} onClick={() => void act(key.id, key.enabled ? 'disable' : 'enable')}>{key.enabled ? 'Tắt' : 'Bật'}</Btn>
            <Btn tone="danger" disabled={busy} onClick={() => { clearError(); setDeleting(key) }}>Xoá</Btn></div>
        </li>
      })}</ul>}
    {adding && <AddKeyDialog busy={busy} error={error} onClose={() => setAdding(false)} onAdd={add} />}
    {deleting && <ConfirmDialog tone="danger" title={`Xoá khoá ${deleting.alias}?`} confirmLabel="Xoá khoá" busy={busy} error={error} onConfirm={() => void act(deleting.id, 'delete')} onClose={() => setDeleting(null)}>
      Khoá bị xoá hẳn và không lấy lại được; muốn dùng lại phải nhập khoá thật lần nữa. Nếu chỉ muốn tạm ngưng, bấm Tắt thay vì xoá.
    </ConfirmDialog>}
    {view}
  </div>
}
