export function reportRows(db, ownerId, { learnerId = '', groupId = '', status = '', from = '', to = '' } = {}) {
  const ids = groupId ? db.groups.find(g => g.id === groupId && g.ownerId === ownerId)?.learnerIds || [] : null
  const learners = db.learners.filter(l => l.ownerId === ownerId && (!learnerId || l.id === learnerId) && (!status || l.status === status) && (!ids || ids.includes(l.id)))
  return learners.map(l => {
    const results = db.submissions.filter(s => s.ownerId === ownerId && s.learnerId === l.id && (!from || localDate(s.submittedAt) >= from) && (!to || localDate(s.submittedAt) <= to))
    return { id: l.id, name: l.name, code: l.code, status: l.status, createdAt: l.createdAt, revokedAt: l.revokedAt || null, quizSubmitted: results.length, averagePercent: results.length ? Math.round(results.reduce((sum, s) => sum + s.correct / s.total * 100, 0) / results.length) : null, results: results.map(({ title, correct, total, submittedAt }) => ({ title, correct, total, submittedAt })), progress: l.progress || [], accountHistory: db.events.filter(e => e.ownerId === ownerId && e.learnerId === l.id).map(({ type, detail, at }) => ({ type, detail, at })) }
  })
}
function localDate(value) { const d = new Date(value); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
// Escape spreadsheet formulas as well as RFC 4180 quotes/newlines.
export function csvCell(value) { let text = String(value ?? ''); if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"` }
export function reportCsv(rows) {
  const data = [['Học sinh','Mã đăng nhập','Trạng thái','Quiz đã nộp','Trung bình (%)','Bài kiểm tra','Số câu đúng','Tổng câu','Ngày nộp']]
  rows.forEach(r => (r.results.length ? r.results : [{}]).forEach(s => data.push([r.name,r.code,r.status === 'active' ? 'Hoạt động' : 'Đã thu hồi',r.quizSubmitted,r.averagePercent ?? '',s.title || '',s.correct ?? '',s.total ?? '',s.submittedAt || ''])))
  return '\uFEFF' + data.map(row => row.map(csvCell).join(',')).join('\r\n')
}
export function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
