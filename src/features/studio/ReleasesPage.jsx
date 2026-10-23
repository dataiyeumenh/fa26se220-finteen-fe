// Phát hành theo duyệt (BE PR C): xem trước bản sắp phát hành → phát hành; đặt lại bản hiện tại; thu hồi bản lỗi.
import { useCallback, useEffect, useState } from 'react'
import { fmtTime, hasRole, studioApi } from './studioClient'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'

export default function ReleasesPage({ notify }) {
  const [plan, setPlan] = useState(null)
  const [planErr, setPlanErr] = useState('')
  const [rows, setRows] = useState([])
  const [note, setNote] = useState('')
  const manager = hasRole('ADMIN', 'GAME_MANAGER')

  const load = useCallback(async () => {
    try {
      setPlan(await studioApi.get('/api/studio/releases/next'))
      setPlanErr('')
    } catch (e) {
      setPlan(null)
      setPlanErr(`${e.code ?? ''} ${e.message}`)
    }
    try {
      setRows(await studioApi.get('/api/studio/releases'))
    } catch (e) {
      notify(e.message)
    }
  }, [notify])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const act = async (fn, ok) => {
    try {
      const r = await fn()
      notify(typeof ok === 'function' ? ok(r) : ok, true)
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
    void load()
  }

  return (
    <>
      <Panel title="Bản sắp phát hành">
        {plan ? (
          <>
            <p className="text-sm">
              Phát hành <b className="text-lg">{plan.version}</b> <Tag tone="info">{plan.changeClass}</Tag>{' '}
              {plan.currentVersion ? `trên nền ${plan.currentVersion}` : '(bản đầu tiên)'} gồm:{' '}
              {plan.drafts.map((d) => `${d.code} rev ${d.revision} (${d.changeClass}, duyệt bởi ${d.reviewerName || '?'})`).join(', ')}. Chương
              khác giữ nguyên bản đang chạy.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input className={`${inputCls} w-80`} placeholder="ghi chú bản phát hành" value={note} onChange={(e) => setNote(e.target.value)} />
              <Btn
                tone="primary"
                disabled={!manager}
                title={manager ? '' : 'Chỉ Manager / ADMIN'}
                onClick={() =>
                  window.confirm(`Phát hành ${plan.version}?`) &&
                  act(() => studioApi.post('/api/studio/releases', { version: plan.version, note }), `Đã phát hành ${plan.version}`)
                }
              >
                Phát hành {plan.version}
              </Btn>
            </div>
          </>
        ) : (
          <p className="rounded-md border border-orange-200 bg-orange-50 p-2 text-sm text-orange-800">Chưa phát hành được — {planErr}</p>
        )}
      </Panel>
      <Panel title="Các bản đã phát hành" actions={<Btn onClick={load}>Tải lại</Btn>}>
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-slate-500 uppercase">
            <tr>
              <th className="p-2">Bản</th>
              <th className="p-2">Loại</th>
              <th className="p-2">Lúc</th>
              <th className="p-2">Chương</th>
              <th className="p-2">Ghi chú</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.version} className="border-t border-slate-100">
                <td className="p-2 font-semibold">{r.version}</td>
                <td className="p-2">{r.changeClass}</td>
                <td className="p-2">{fmtTime(r.releasedAt)}</td>
                <td className="p-2">{r.chapters.map((c) => c.code).join(', ')}</td>
                <td className="p-2">{r.note}</td>
                <td className="p-2">
                  {r.current && <Tag tone="APPROVED">Đang chạy</Tag>} {r.recalledAt && <Tag tone="REJECTED">Thu hồi {fmtTime(r.recalledAt)}</Tag>}
                </td>
                <td className="p-2">
                  {!r.current && !r.recalledAt && (
                    <Btn disabled={!manager} onClick={() => act(() => studioApi.post(`/api/studio/releases/${r.version}/current`), `Bản hiện tại: ${r.version}`)}>
                      Đặt làm hiện tại
                    </Btn>
                  )}
                  {r.current && (
                    <Btn
                      tone="danger"
                      disabled={!manager}
                      onClick={() => {
                        const reason = window.prompt(`Thu hồi ${r.version}: lý do (bắt buộc)`)
                        if (reason)
                          void act(
                            () => studioApi.post(`/api/studio/releases/${r.version}/recall`, { reason }),
                            (x) => `Đã thu hồi, bản hiện tại ${x.version}`,
                          )
                      }}
                    >
                      Thu hồi
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-3 text-slate-500">
                  Chưa phát hành bản nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </>
  )
}
