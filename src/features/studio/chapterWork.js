// "Đến lượt ai": chương nào đang chờ chính người đang xem làm gì. Dùng cho menu, Tổng quan và màn Chương.
import { canEdit, canManage, canReview } from './permissions.js'

export const ROLE_LABELS = { ADMIN: 'Quản trị viên', GAME_EDITOR: 'Biên tập viên', GAME_REVIEWER: 'Người duyệt', GAME_MANAGER: 'Người phát hành' }

const time = value => value ? new Date(value).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : ''

/** Việc người đang xem cần làm với nháp này: 'review' | 'fix' | 'submit' | 'publish' | null. */
export function turnOf(actor, draft) {
  if (canReview(actor, draft)) return 'review'
  if (canEdit(actor) && draft?.status === 'REJECTED') return 'fix'
  if (canEdit(actor) && draft?.status === 'DRAFT') return 'submit'
  if (canManage(actor) && draft?.status === 'APPROVED' && draft.editorId !== actor?.id) return 'publish'
  return null
}

export const TURN_LABEL = { review: 'Chờ bạn duyệt', fix: 'Cần bạn sửa', submit: 'Bạn đang soạn', publish: 'Chờ bạn phát hành' }

/** Vị trí trên dải tiến trình 4 bước (Đang soạn → Chờ duyệt → Đã duyệt → Đã phát hành). */
export const stepOf = status => ({ DRAFT: 0, REJECTED: 0, SUBMITTED: 1, APPROVED: 2, RELEASED: 3 })[status] ?? 0

/** Một câu nói chương đang ở đâu, ai làm gì, lúc nào. */
export function statusLine(draft) {
  const editor = draft.editorName || 'Người soạn'
  const reviewer = draft.reviewerName || 'Người duyệt'
  switch (draft.status) {
    case 'SUBMITTED': return `${editor} gửi duyệt ${time(draft.submittedAt)}. Đang chờ người duyệt chơi thử.`
    case 'APPROVED': return `${reviewer} chấm Đạt ${time(draft.reviewedAt)}. Chờ phát hành vào game.`
    case 'REJECTED': return `${reviewer} trả về ${time(draft.reviewedAt)}. Người soạn cần sửa rồi gửi lại.`
    case 'RELEASED': return `Đã vào game. ${editor} soạn, ${reviewer} duyệt.`
    default: return `${editor} sửa lần cuối ${time(draft.updatedAt)}.`
  }
}

/** "Đã duyệt bản nháp số N" chỉ khi bản hiện tại thật sự đã được chấm Đạt. */
export const reviewedNote = draft => ['APPROVED', 'RELEASED'].includes(draft.status) && draft.reviewedRevision != null
  ? `Duyệt ở bản nháp số ${draft.reviewedRevision}` : ''
