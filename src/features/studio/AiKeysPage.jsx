import { useCallback } from 'react'
import { studioApi, fmtTime } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { useToast } from './useToast'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'

export default function AiKeysPage() {
  const { notify, view } = useToast()
  const loader = useCallback(() => studioApi.get('/api/admin/ai-keys'), [])
  const query = useStudioResource(loader)
  const { busy, run } = useStudioAction(notify)
  const act = (id, action) => void run(async () => {
    const result = await (action === 'delete' ? studioApi.del(`/api/admin/ai-keys/${encodeURIComponent(id)}`) : studioApi.post(`/api/admin/ai-keys/${encodeURIComponent(id)}/${action}`))
    if (action === 'test' && result?.lastTestOk === false) { query.reload(); throw new Error(`Kiểm tra thất bại: ${result.lastError || 'Không có chi tiết'}`) }
    return result
  }, action === 'test' ? 'Đã kiểm tra khóa. Xem kết quả trong danh sách.' : 'Đã cập nhật khóa AI.', query.reload)
  return <div className="studio-api-content">
    <Panel title="Quản lý khóa AI" actions={<Btn disabled={busy || query.loading} onClick={query.reload}>Tải lại</Btn>}>
      <p className="mb-4 text-sm text-slate-500">Chỉ hiển thị khóa đã che từ máy chủ. Khóa mới chỉ được gửi khi bạn bấm Thêm.</p>
      <form onSubmit={event => {
        event.preventDefault()
        const form = event.currentTarget
        const fields = new FormData(form)
        void run(() => studioApi.post('/api/admin/ai-keys', { provider: fields.get('provider'), alias: fields.get('alias').trim(), key: fields.get('key').trim(), priority: Number(fields.get('priority')) }), 'Đã thêm khóa AI.', () => { form.reset(); query.reload() })
      }}><fieldset disabled={busy} className="mb-5 grid gap-3 sm:grid-cols-2">
        <label>Nhà cung cấp<select name="provider" className={`${inputCls} w-full`}><option>GEMINI</option><option>OPENROUTER</option></select></label>
        <label>Tên gợi nhớ<input name="alias" className={`${inputCls} w-full`} required /></label>
        <label>Khóa bí mật<input name="key" type="password" autoComplete="off" className={`${inputCls} w-full`} required /></label>
        <label>Độ ưu tiên<input name="priority" type="number" step="1" defaultValue="0" className={`${inputCls} w-full`} required /></label>
        <Btn type="submit" disabled={busy} tone="primary">Thêm khóa</Btn>
      </fieldset></form>
      {query.loading ? <p role="status">Đang tải khóa AI…</p> : query.error ? <p role="alert" className="text-red-700">{query.error}</p> : <table className="w-full text-sm"><thead><tr>{['Khóa', 'Trạng thái', 'Kiểm tra gần nhất', 'Thao tác'].map(label => <th key={label} className="p-2 text-left">{label}</th>)}</tr></thead><tbody>
        {(query.data || []).map(key => <tr key={key.id} className="border-t border-slate-100 align-top"><td className="p-2"><strong>{key.alias}</strong><small className="block">{key.provider} · Ưu tiên {key.priority}</small><code>{key.masked}</code></td><td className="p-2"><Tag tone={key.enabled ? 'APPROVED' : 'REJECTED'}>{key.enabled ? 'Đang bật' : 'Đã tắt'}</Tag>{key.coolDownUntil && <small className="block">Tạm nghỉ đến {fmtTime(key.coolDownUntil)}</small>}</td><td className="p-2">{fmtTime(key.lastTestAt)}<p>{key.lastTestOk == null ? 'Chưa kiểm tra' : key.lastTestOk ? 'Thành công' : 'Thất bại'}</p><p className="text-red-700">{key.lastError}</p></td><td className="p-2"><div className="flex flex-wrap gap-2"><Btn disabled={busy} onClick={() => act(key.id, 'test')}>Kiểm tra</Btn><Btn disabled={busy} onClick={() => act(key.id, key.enabled ? 'disable' : 'enable')}>{key.enabled ? 'Tắt' : 'Bật'}</Btn><Btn disabled={busy} tone="danger" onClick={() => { if (window.confirm(`Xóa khóa ${key.alias}?`)) act(key.id, 'delete') }}>Xóa</Btn></div></td></tr>)}
        {!query.data?.length && <tr><td colSpan={4} className="p-4">Chưa có khóa AI.</td></tr>}
      </tbody></table>}
    </Panel>{view}
  </div>
}
