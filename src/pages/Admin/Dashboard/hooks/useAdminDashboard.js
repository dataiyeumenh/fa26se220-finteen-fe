// No dashboard endpoint is available in the supplied backend contract yet.
export default function useAdminDashboard() {
  return {
    user: undefined, systemOk: false,
    stats: [], health: [], recentUsers: [], logs: [],
    loading: false,
    error: 'Dashboard quản trị chưa kết nối API. Dữ liệu mô phỏng đã được gỡ bỏ.',
    refetch: () => {},
  }
}
