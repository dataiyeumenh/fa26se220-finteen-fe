// TODO(REMOVE-WORKSPACE-MOCK): Xóa file này khi API học sinh, nhóm, báo cáo và Quiz hoàn thiện.
const questions = [
  { text: 'Khoản nào là nhu cầu thiết yếu?', options: ['Tiền thuê nhà', 'Vé xem phim', 'Giày phiên bản giới hạn', 'Đồ trang trí'], correct: 0 },
  { text: 'Quỹ khẩn cấp nên dùng khi nào?', options: ['Flash sale', 'Sửa xe đột xuất', 'Mua quà', 'Đi chơi cuối tuần'], correct: 1 },
  { text: 'Cách tiết kiệm hiệu quả nhất?', options: ['Để dành phần còn lại', 'Tiết kiệm trước khi chi', 'Vay để tiết kiệm', 'Không ghi chép'], correct: 1 },
]

export function workspaceMockData(actor) {
  if (!actor || !['parent', 'teacher'].includes(actor.role)) return { version: 1, accounts: [], slots: [], learners: [], groups: [], quizzes: [], assignments: [], submissions: [], events: [] }
  const ownerId = actor.id
  const names = actor.role === 'teacher' ? ['Nguyễn Minh Anh', 'Trần Gia Huy', 'Lê Khánh Linh', 'Phạm Bảo An'] : ['Bé Minh', 'Bé An']
  const learners = names.map((name, index) => ({ id: `mock-learner-${index + 1}`, ownerId, slotId: `mock-slot-${index + 1}`, plan: actor.role, name, code: `FT${2601 + index}`, status: 'active', createdAt: `2026-09-${String(12 + index).padStart(2, '0')}T08:00:00+07:00`, progress: [1, 2, ...(index < 2 ? [3] : [])] }))
  const slotCount = actor.role === 'teacher' ? 8 : 4
  const slots = Array.from({ length: slotCount }, (_, index) => ({ id: `mock-slot-${index + 1}`, ownerId, plan: actor.role, number: index + 1, learnerId: learners[index]?.id || null }))
  const groups = actor.role === 'teacher' ? [
    { id: 'mock-group-1', ownerId, name: 'Lớp 10A1', learnerIds: learners.slice(0, 3).map(item => item.id) },
    { id: 'mock-group-2', ownerId, name: 'CLB Tài chính trẻ', learnerIds: learners.slice(1).map(item => item.id) },
  ] : []
  const quizzes = actor.role === 'teacher' ? [{ id: 'mock-quiz-1', ownerId, title: 'Kiểm tra: Chi tiêu thông minh', questions, updatedAt: '2026-10-05T09:30:00+07:00' }, { id: 'mock-quiz-2', ownerId, title: 'Ôn tập: Quỹ khẩn cấp', questions: questions.slice(0, 2), updatedAt: '2026-10-02T14:20:00+07:00' }] : []
  const assignments = actor.role === 'teacher' ? [{ id: 'mock-assignment-1', ownerId, quizId: 'mock-quiz-1', title: quizzes[0].title, questions, learnerIds: learners.map(item => item.id), createdAt: '2026-10-05T10:00:00+07:00' }] : []
  const submissions = learners.slice(0, actor.role === 'teacher' ? 3 : 2).map((learner, index) => ({ id: `mock-submission-${index + 1}`, ownerId, learnerId: learner.id, assignmentId: 'mock-assignment-1', title: 'Kiểm tra: Chi tiêu thông minh', correct: 3 - (index % 2), total: 3, answers: [0, 1, 1], submittedAt: `2026-10-0${6 + index}T19:15:00+07:00` }))
  const events = learners.flatMap((learner, index) => [{ id: `mock-event-${index + 1}`, ownerId, learnerId: learner.id, plan: actor.role, type: 'learner_created', detail: 'Tài khoản học sinh được kích hoạt', at: learner.createdAt }, { id: `mock-progress-${index + 1}`, ownerId, learnerId: learner.id, plan: actor.role, type: 'chapter_completed', detail: `Hoàn thành chương ${2 + (index % 2)}`, at: `2026-10-0${3 + index}T18:20:00+07:00` }])
  return { version: 1, accounts: [], slots, learners, groups, quizzes, assignments, submissions, events }
}
