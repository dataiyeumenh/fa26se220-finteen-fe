// No dashboard endpoint is available in the supplied backend contract yet.
export default function useTeacherDashboard() {
  return {
    user: undefined, rating: undefined, totalStudents: undefined,
    stats: [], classes: [], submissions: [],
    loading: false,
    error: 'Dashboard giáo viên chưa kết nối API. Dữ liệu mô phỏng đã được gỡ bỏ.',
    refetch: () => {},
  }
}
