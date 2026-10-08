import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkspace } from './useWorkspace'
import { reportRows, reportCsv, download } from './reporting'
import { DataSourceNote, Heading, Empty } from './ui'
import { dateLabel } from './format'

export default function Reports() {
  const { actor, db } = useWorkspace()
  const [filters, setFilters] = useState({ learnerId: '', groupId: '', status: '', from: '', to: '' })
  const update = (key, value) => setFilters(old => ({ ...old, [key]: value }))
  const invalidDates = Boolean(filters.from && filters.to && filters.from > filters.to)
  const rows = reportRows(db, actor.id, filters)
  const submitted = rows.reduce((sum, row) => sum + row.quizSubmitted, 0)
  const stamp = new Date().toISOString().slice(0, 10)

  return <>
    <Heading title="Tiến độ & báo cáo" description="Theo dõi từng học sinh, xem lịch sử và xuất dữ liệu trong phạm vi tài khoản của bạn."/>
    <DataSourceNote>Giao diện minh họa contract BE cần cung cấp: learnerId, displayName, code, groupId, status, quizSubmitted, averagePercent, results và submittedAt.</DataSourceNote>
    <div className="ws-toolbar ws-report-filters">
      <label>Học sinh<select value={filters.learnerId} onChange={event => update('learnerId', event.target.value)}><option value="">Tất cả học sinh</option>{db.learners.filter(learner => learner.ownerId === actor.id).map(learner => <option key={learner.id} value={learner.id}>{learner.name} · {learner.code}</option>)}</select></label>
      {actor.role === 'teacher' && <label>Nhóm hiện tại<select value={filters.groupId} onChange={event => update('groupId', event.target.value)}><option value="">Tất cả nhóm</option>{db.groups.filter(group => group.ownerId === actor.id).map(group => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>}
      <label>Trạng thái<select value={filters.status} onChange={event => update('status', event.target.value)}><option value="">Tất cả trạng thái</option><option value="active">Hoạt động</option><option value="revoked">Đã thu hồi</option></select></label>
      <label>Ngày nộp từ<input type="date" value={filters.from} onChange={event => update('from', event.target.value)}/></label>
      <label>Đến ngày<input type="date" value={filters.to} min={filters.from} onChange={event => update('to', event.target.value)}/></label>
    </div>
    {invalidDates && <p role="alert">Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.</p>}
    <div className="ws-actions ws-export"><button disabled={invalidDates || !rows.length} className="ws-btn" onClick={() => download(reportCsv(rows), `finteen-report-${stamp}.csv`, 'text/csv;charset=utf-8')}>Xuất CSV (Excel)</button><button disabled={invalidDates || !rows.length} className="ws-btn primary" onClick={() => window.print()}>In / Lưu PDF</button></div>
    <section className="ws-card ws-print-report"><h2>Báo cáo học tập · {actor.name}</h2><p>{rows.length} tài khoản · {submitted} bài đã nộp · Ngày nộp: {filters.from || 'Tất cả'} → {filters.to || 'Hiện tại'}</p><p className="ws-muted">Dữ liệu trò chơi chưa kết nối. Các chỉ số dưới đây chỉ tính bài kiểm tra Quiz đã nộp; tài khoản đã thu hồi vẫn giữ kết quả.</p>{rows.length ? <div className="ws-table-wrap"><table><thead><tr><th>Học sinh</th><th>Trạng thái</th><th>Quiz đã nộp</th><th>Trung bình</th><th>Chi tiết</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.code}</small></td><td>{row.status === 'active' ? 'Hoạt động' : 'Đã thu hồi'}</td><td>{row.quizSubmitted}</td><td>{row.averagePercent === null ? 'Chưa có' : `${row.averagePercent}%`}</td><td><Link className="ws-text-link" to={`/dashboard/learners/${row.id}`}>Xem hành trình</Link>{row.results.map((result, index) => <small key={index}>{result.title}: {result.correct}/{result.total} · {dateLabel(result.submittedAt)}</small>)}</td></tr>)}</tbody></table></div> : <Empty>Không có học sinh phù hợp bộ lọc.</Empty>}</section>
  </>
}
