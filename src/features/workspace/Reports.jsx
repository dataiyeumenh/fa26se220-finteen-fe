import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPinned, RefreshCw } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { useWorkspace } from './useWorkspace'
import { groupReportCsv, download } from './reporting'
import { Heading, Empty } from './ui'
import { dateLabel } from './format'

const statusLabel = status => ({ ACTIVE: 'Hoạt động', ARCHIVED: 'Đã thu hồi', WIPED: 'Đã xoá' })[status] || status
const indicatorLevel = value => value < 34 ? 'thấp' : value < 67 ? 'vừa' : 'cao'
const indicatorLabels = { wealth: 'Tài sản', saving: 'Tiết kiệm', happiness: 'Hạnh phúc', risk: 'Rủi ro', goal: 'Mục tiêu' }
const indicatorText = indicators => indicators
  ? Object.entries(indicators).map(([key, value]) => `${indicatorLabels[key] || key}: ${indicatorLevel(value)}`).join(' · ')
  : 'Chưa có dữ liệu'

export default function Reports() {
  const { actor } = useWorkspace()
  const [searchParams] = useSearchParams()
  const requestedGroupId = searchParams.get('group') || ''
  const [reports, setReports] = useState([])
  const [groupId, setGroupId] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const stamp = new Date().toISOString().slice(0, 10)

  const load = useCallback(async () => {
    setLoading(true)
    setError(''); setWarning('')
    try {
      const context = actor.role === 'teacher' ? 'CLASS' : 'FAMILY'
      const groups = (await auth.listGroups() || []).filter(group => group.context === context)
      groups.sort((a, b) => Number(Boolean(a.closedAt)) - Number(Boolean(b.closedAt)))
      const settled = await Promise.allSettled(groups.map(group => auth.getGroupReport(group.id)))
      const values = settled.filter(item => item.status === 'fulfilled').map(item => item.value).filter(Boolean)
      const failed = settled.length - values.length
      if (failed) setWarning(`${failed} nhóm chưa tải được báo cáo. Các nhóm còn lại vẫn được hiển thị.`)
      if (!values.length && failed) throw settled.find(item => item.status === 'rejected')?.reason || new Error('Không tải được báo cáo nhóm.')
      setReports(values)
      setGroupId(current => current && values.some(item => item.group.id === current) ? current : values.some(item => item.group.id === requestedGroupId) ? requestedGroupId : (values[0]?.group.id || ''))
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [actor.role, requestedGroupId])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])
  const report = reports.find(item => item.group.id === groupId) || reports[0]
  const rows = useMemo(() => (report?.rows || []).filter(row => !status || row.status === status), [report, status])

  if (loading) return <Empty>Đang tải báo cáo từ máy chủ…</Empty>
  if (error) return <Empty>{error} <button className="ws-btn" onClick={() => void load()}>Thử lại</button></Empty>
  if (!report) return <><Heading title="Tiến độ & báo cáo" description="Theo dõi tiến độ học tập của trẻ."/><Empty>Chưa có nhóm để hiển thị báo cáo.</Empty></>

  return <>
    <Heading title="Tiến độ & báo cáo" description="Dữ liệu trực tiếp từ báo cáo của nhóm."><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/> Làm mới</button></Heading>
    {warning && <p className="ws-notice" role="status">{warning}</p>}
    <div className="ws-toolbar ws-report-filters">
      <label>Nhóm<select value={report.group.id} onChange={event => setGroupId(event.target.value)}>{reports.map(item => <option key={item.group.id} value={item.group.id}>{item.group.name}{item.group.closedAt ? ' · Đã đóng' : ''}</option>)}</select></label>
      <label>Trạng thái<select value={status} onChange={event => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option><option value="ACTIVE">Hoạt động</option><option value="ARCHIVED">Đã thu hồi</option><option value="WIPED">Đã xoá</option></select></label>
    </div>
    <div className="ws-actions ws-export"><button disabled={!rows.length} className="ws-btn" onClick={() => download(groupReportCsv(rows), `finteen-report-${stamp}.csv`, 'text/csv;charset=utf-8')}>Xuất CSV (Excel)</button><button disabled={!rows.length} className="ws-btn primary" onClick={() => window.print()}>In / Lưu PDF</button></div>
    <section className="ws-card ws-print-report">
      <h2>Báo cáo học tập · {report.group.name}</h2>
      <p>{report.summary.learners} học sinh · {report.summary.active} đang hoạt động · {report.summary.activeLast7Days} hoạt động trong 7 ngày</p>
      <p className="ws-muted">Đã hoàn thành {report.summary.chaptersCompleted} chương · Nội dung hiện có {report.summary.totalChapters} chương{report.frozenAt ? ` · Đóng băng ${dateLabel(report.frozenAt)}` : ' · Dữ liệu trực tiếp'}.</p>
      {rows.length ? <div className="ws-table-wrap"><table><thead><tr><th>Học sinh</th><th>Trạng thái</th><th>Tiến độ</th><th>5 chỉ số</th><th>Hoạt động gần nhất</th><th>Chi tiết</th></tr></thead><tbody>{rows.map(row => <tr key={row.slotId}><td><strong>{row.displayName || 'Đã xoá'}</strong><small>{row.code || '—'}</small></td><td>{statusLabel(row.status)}</td><td>{row.completedChapters}/{report.summary.totalChapters} chương</td><td>{indicatorText(row.indicators)}</td><td>{row.lastActiveAt ? dateLabel(row.lastActiveAt) : 'Chưa chơi'}</td><td><Link className="ws-report-detail-button" to={`/dashboard/learners/${row.slotId}`}><MapPinned/> Xem hành trình</Link></td></tr>)}</tbody></table></div> : <Empty>Không có học sinh phù hợp bộ lọc.</Empty>}
    </section>
  </>
}
