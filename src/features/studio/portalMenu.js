import { canEdit, canManage, canWriteLibrary } from './permissions.js'

export function getStudioMenu(actor) {
  const roles = actor?.roles || []
  if (!roles.some(role => ['ADMIN', 'GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER'].includes(role))) return []
  const edit = canEdit(actor)
  const manage = canManage(actor)
  const review = roles.includes('ADMIN') || roles.includes('GAME_REVIEWER')
  const writeLibrary = canWriteLibrary(actor)
  const items = [
    ...(review ? [{ path: '/internal/reviews', title: 'Chờ duyệt', icon: 'review', description: 'Xem và chơi thử nháp SUBMITTED, đánh giá Đạt hoặc Trả về kèm lý do.' }] : []),
    { path: '/internal/chapters', title: edit ? 'Chương' : 'Chương (xem / chơi thử)', icon: 'chapter', description: edit ? 'Soạn và sửa nháp, gửi duyệt hoặc rút nháp đang chờ do mình gửi.' : 'Xem nội dung và chơi thử bản nháp. Không có chức năng soạn hoặc gửi duyệt.' },
    ...(manage ? [{ path: '/internal/releases', title: 'Phát hành', icon: 'release', description: 'Xem kế hoạch phát hành và phát hành các nháp đã duyệt; backend tự tính phiên bản.' }] : []),
    ...(manage || review ? [{ path: '/internal/history', title: 'Lịch sử bản', icon: 'history', description: manage ? 'Theo dõi các bản, đổi bản đang chạy và thu hồi bản lỗi kèm lý do.' : 'Xem lịch sử và trạng thái các bản phát hành.' }] : []),
    { path: '/internal/assets', title: writeLibrary ? 'Kho ảnh' : 'Kho ảnh (xem)', icon: 'asset', group: 'library', description: writeLibrary ? 'Tải ảnh, sửa thông tin và xóa tài nguyên chưa được sử dụng.' : 'Tra cứu, xem trước và lấy ref ảnh. Không được tải, sửa hoặc xóa ảnh.' },
    { path: '/internal/questions', title: writeLibrary ? 'Kho câu hỏi' : 'Kho câu hỏi (xem)', icon: 'question', group: 'library', description: writeLibrary ? 'Thêm, sửa, ngừng dùng hoặc khôi phục câu hỏi.' : 'Tra cứu câu hỏi và đáp án. Không được thay đổi kho câu hỏi.' },
  ]
  const order = manage && !edit && !review
    ? ['release', 'history', 'chapter', 'asset', 'question']
    : ['review', 'chapter', 'release', 'history', 'asset', 'question']
  return items.sort((a, b) => order.indexOf(a.icon) - order.indexOf(b.icon))
}
