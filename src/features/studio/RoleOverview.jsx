import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCheck, PenLine, Rocket } from 'lucide-react'
import { studioApi, STATUS_LABEL } from './studioClient'
import { useStudioResource } from './useStudioResource'
import { Tag } from './ui'

const work = {
  GAME_EDITOR: { label: 'KHÔNG GIAN BIÊN TẬP', title: 'Hoàn thiện từng cảnh.\nKể những câu chuyện hay.', description: 'Soạn nội dung, chỉnh sửa chương được trả về và gửi bản nháp hoàn chỉnh cho đội kiểm duyệt.', action: 'Mở bàn biên tập', path: '/internal/chapters', icon: PenLine, states: ['DRAFT', 'REJECTED'], metrics: [['DRAFT', 'Nháp đang soạn'], ['REJECTED', 'Cần chỉnh sửa'], ['SUBMITTED', 'Đang chờ duyệt']], steps: ['Soạn cảnh và chọn tài nguyên', 'Chơi thử, kiểm tra nội dung', 'Gửi nháp đi duyệt'], queue: 'Chương cần biên tập' },
  GAME_REVIEWER: { label: 'KHÔNG GIAN KIỂM DUYỆT', title: 'Đọc kỹ từng câu chuyện.\nGiữ chất lượng nội dung.', description: 'Xem và chơi thử nháp được gửi đến. Ghi nhận xét, đánh giá Đạt hoặc trả về để biên tập viên hoàn thiện.', action: 'Mở hàng chờ duyệt', path: '/internal/reviews', icon: CheckCheck, states: ['SUBMITTED'], metrics: [['SUBMITTED', 'Chờ đánh giá'], ['APPROVED', 'Đã duyệt đạt'], ['REJECTED', 'Đã trả về']], steps: ['Mở nháp đang chờ duyệt', 'Chơi thử và kiểm tra chất lượng', 'Đánh giá kèm nhận xét'], queue: 'Hàng chờ kiểm duyệt' },
  GAME_MANAGER: { label: 'KHÔNG GIAN PHÁT HÀNH', title: 'Sẵn sàng phát hành.\nĐưa nội dung đến người học.', description: 'Kiểm tra kế hoạch phát hành, quản lý phiên bản đang chạy và thu hồi khi phát hiện vấn đề.', action: 'Mở quản lý phát hành', path: '/internal/releases', icon: Rocket, states: ['APPROVED'], metrics: [['APPROVED', 'Sẵn sàng phát hành'], ['SUBMITTED', 'Đang chờ kiểm duyệt'], ['RELEASED', 'Đã phát hành']], steps: ['Kiểm tra các nháp đã duyệt', 'Xác nhận kế hoạch phát hành', 'Theo dõi và quản lý phiên bản'], queue: 'Nội dung đã duyệt chờ phát hành' },
}

export default function RoleOverview({ role }) {
  const config = work[role] || work.GAME_EDITOR
  const loader = useCallback(() => studioApi.get('/api/studio/chapters'), [])
  const query = useStudioResource(loader)
  const rows = query.data || []
  const queue = rows.filter(draft => config.states.includes(draft.status))
  const Icon = config.icon
  return <div className={`studio-role-overview role-${role.toLowerCase()}`}>
    <section className="studio-role-hero"><div><span>{config.label}</span><h2>{config.title}</h2><p>{config.description}</p><Link to={config.path}>{config.action}<ArrowRight size={17} /></Link></div><Icon size={100} strokeWidth={1} aria-hidden="true" /></section>
    <section className="studio-role-metrics" aria-label="Tình trạng công việc">{config.metrics.map(([status, label]) => <div key={status}><span>{label}</span><strong>{query.loading || query.error ? '—' : rows.filter(draft => draft.status === status).length}</strong></div>)}</section>
    <section className="studio-role-process" aria-label="Quy trình công việc">{config.steps.map((step, index) => <div key={step}><b>{String(index + 1).padStart(2, '0')}</b><span>{step}</span></div>)}</section>
    <section className="studio-role-queue"><header><h2>{config.queue}</h2><Link to={config.path}>Xem tất cả <ArrowRight size={14} /></Link></header>
      {query.loading ? <p role="status">Đang tải công việc…</p> : query.error ? <p role="alert">{query.error} <button onClick={query.reload}>Thử lại</button></p> : queue.length ? queue.slice(0, 5).map(draft => <Link key={draft.code} className="studio-role-queue-item" to={role === 'GAME_EDITOR' ? `/internal/editor/${encodeURIComponent(draft.code)}` : config.path}><span><strong>{draft.title || draft.code}</strong><small>{draft.code} · Revision {draft.revision}</small></span><Tag tone={draft.status}>{STATUS_LABEL[draft.status]}</Tag><ArrowRight size={16} /></Link>) : <p>Hiện không có chương cần xử lý trong hàng công việc này.</p>}
    </section>
    <p className="studio-role-help">{role === 'GAME_REVIEWER' ? 'Kho ảnh và câu hỏi chỉ để tra cứu. Bạn không chỉnh sửa bản nháp hoặc phát hành nội dung.' : role === 'GAME_MANAGER' ? 'Bản nháp do Editor soạn và Reviewer đánh giá. Bạn quản lý phát hành cùng kho tài nguyên.' : 'Reviewer đánh giá bản nháp sau khi gửi; Manager phụ trách phát hành nội dung đã được duyệt.'}</p>
  </div>
}
