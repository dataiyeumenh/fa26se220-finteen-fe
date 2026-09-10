/**
 * Mock API — giả lập các API backend sẽ được gọi từ hook của từng page.
 * Sau này thay bằng axios/fetch thật là chạy được luôn.
 *
 * Mỗi hàm trả về Promise, có delay nhỏ để mô phỏng network.
 */
const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms))

// =========================
// USER — Học sinh
// =========================
export async function getUserOverview() {
  await delay()
  return {
    user: { name: 'Minh Tuấn', avatar: 'T' },
    streak: 7,
    lessonsThisWeek: 12,
    lessonsTarget: 15,
    stats: [
      { label: 'Bài đã học', value: '24', emoji: '📚', accent: 'purple', trend: '+3' },
      { label: 'Streak hiện tại', value: '7 ngày', emoji: '🔥', accent: 'orange' },
      { label: 'Điểm thưởng', value: '1,250', emoji: '⭐', accent: 'yellow', trend: '+120' },
      { label: 'Xếp hạng', value: '#42', emoji: '🏆', accent: 'blue', trend: '+5' },
    ],
    continueLessons: [
      { id: '1', title: 'Lãi kép thần kỳ', subject: 'Tiết kiệm', progress: 65, emoji: '💰' },
      { id: '2', title: 'Trả góp vs Mua thẳng', subject: 'Tín dụng', progress: 30, emoji: '📱' },
      { id: '3', title: 'Lạm phát là gì?', subject: 'Kinh tế học', progress: 80, emoji: '🌏' },
    ],
    achievements: [
      { id: 'a1', emoji: '🔥', title: 'Streak 7 ngày', desc: 'Học liên tục 1 tuần' },
      { id: 'a2', emoji: '🧠', title: 'Bậc thầy đoán', desc: 'Đoán đúng trên 80%' },
      { id: 'a3', emoji: '💸', title: 'Tiết kiệm pro', desc: 'Hoàn thành 5 bài tiết kiệm' },
      { id: 'a4', emoji: '🏆', title: 'Top 10 tuần', desc: 'Đứng trong top 10 bảng xếp hạng' },
    ],
  }
}

// =========================
// PARENT — Phụ huynh
// =========================
export async function getParentOverview() {
  await delay()
  return {
    user: { name: 'Phụ huynh Lan', avatar: 'L' },
    weeklyGrowth: 18,
    stats: [
      { label: 'Tổng thời gian tuần', value: '6h 45m', emoji: '⏱️', accent: 'blue', trend: '+1h 20m' },
      { label: 'Bài hoàn thành', value: '14', emoji: '✅', accent: 'lime', trend: '+3' },
      { label: 'Streak dài nhất', value: '7 ngày', emoji: '🔥', accent: 'orange' },
      { label: 'Điểm TB', value: '8.5', emoji: '⭐', accent: 'yellow', trend: '+0.3' },
    ],
    children: [
      { id: 'c1', name: 'Minh Tuấn', grade: 'Lớp 11A1', avatar: 'T', progress: 78, streak: 7, weeklyTime: '4h 30m', color: 'gradient-primary' },
      { id: 'c2', name: 'Hoàng Yến', grade: 'Lớp 10A3', avatar: 'Y', progress: 62, streak: 3, weeklyTime: '2h 15m', color: 'gradient-accent' },
    ],
    activities: [
      { id: '1', time: '10 phút trước', text: 'Tuấn hoàn thành bài "Lãi kép thần kỳ"', emoji: '✅' },
      { id: '2', time: '2 giờ trước', text: 'Yến bắt đầu bài "Trả góp vs Mua thẳng"', emoji: '📚' },
      { id: '3', time: 'Hôm qua', text: 'Tuấn đạt thành tích "Streak 7 ngày"', emoji: '🔥' },
      { id: '4', time: '2 ngày trước', text: 'Yến hoàn thành bài kiểm tra tuần 3', emoji: '🎯' },
    ],
  }
}

// =========================
// TEACHER — Giáo viên
// =========================
export async function getTeacherOverview() {
  await delay()
  return {
    user: { name: 'Cô Hương', avatar: 'H' },
    rating: 4.9,
    stats: [
      { label: 'Tổng học sinh', value: '115', emoji: '👥', accent: 'orange', trend: '+12' },
      { label: 'Lớp đang dạy', value: '3', emoji: '📚', accent: 'yellow' },
      { label: 'Bài cần chấm', value: '5', emoji: '📝', accent: 'pink' },
      { label: 'Điểm TB lớp', value: '8.3', emoji: '⭐', accent: 'blue', trend: '+0.4' },
    ],
    classes: [
      { id: 'c1', name: '11A1 - Kinh tế & Tài chính', students: 38, avgScore: 8.4, emoji: '⭐', color: 'from-[#ffd93d] to-[#ff8e53]' },
      { id: 'c2', name: '10A3 - Tài chính cá nhân', students: 42, avgScore: 7.9, emoji: '💼', color: 'from-[#ff6b9d] to-[#a855f7]' },
      { id: 'c3', name: '12A2 - Đầu tư cơ bản', students: 35, avgScore: 8.7, emoji: '📈', color: 'from-[#b8ff3d] to-[#4dabff]' },
    ],
    submissions: [
      { id: '1', name: 'Trần Minh Tuấn', task: 'Bài tập: Lãi kép', time: '5 phút trước', status: 'done', score: 9.5 },
      { id: '2', name: 'Lê Hoàng Yến', task: 'Bài tập: Lạm phát', time: '12 phút trước', status: 'done', score: 8.0 },
      { id: '3', name: 'Nguyễn Phương Linh', task: 'Bài tập: Trả góp', time: '1 giờ trước', status: 'pending', score: null },
      { id: '4', name: 'Phạm Quang Vinh', task: 'Bài tập: Lãi kép', time: '2 giờ trước', status: 'done', score: 7.5 },
    ],
  }
}

// =========================
// ADMIN — Quản trị
// =========================
export async function getAdminOverview() {
  await delay()
  return {
    user: { name: 'Admin Root', avatar: 'A' },
    systemStats: [
      { label: 'Tổng người dùng', value: '12,438', emoji: '👥', accent: 'purple', trend: '+8.2%' },
      { label: 'Học sinh', value: '10,124', emoji: '🎓', accent: 'pink', trend: '+5.4%' },
      { label: 'Giáo viên', value: '342', emoji: '👩‍🏫', accent: 'orange', trend: '+12' },
      { label: 'Phụ huynh', value: '1,972', emoji: '👨‍👩‍👧', accent: 'blue', trend: '+128' },
    ],
    health: [
      { label: 'Uptime', value: '99.98%', emoji: '🟢', accent: 'lime' },
      { label: 'API Latency', value: '142ms', emoji: '⚡', accent: 'yellow' },
      { label: 'Storage', value: '64%', emoji: '💾', accent: 'blue' },
      { label: 'CPU', value: '38%', emoji: '🖥️', accent: 'purple' },
    ],
    recentUsers: [
      { id: '1', name: 'Trần Minh Tuấn', role: 'Học sinh', time: '2 phút trước', avatar: 'T' },
      { id: '2', name: 'Cô Hương Nguyễn', role: 'Giáo viên', time: '15 phút trước', avatar: 'H' },
      { id: '3', name: 'Phụ huynh Lan', role: 'Phụ huynh', time: '1 giờ trước', avatar: 'L' },
      { id: '4', name: 'Admin Beta', role: 'Quản trị', time: '3 giờ trước', avatar: 'B' },
    ],
    logs: [
      { id: '1', level: 'info', msg: 'Backup database thành công', time: '14:30' },
      { id: '2', level: 'success', msg: 'Deploy v2.4.1 lên production', time: '13:12' },
      { id: '3', level: 'warn', msg: 'API rate limit gần đạt ngưỡng (85%)', time: '12:45' },
      { id: '4', level: 'info', msg: '12 báo cáo lỗi mới từ người dùng', time: '11:20' },
    ],
  }
}
