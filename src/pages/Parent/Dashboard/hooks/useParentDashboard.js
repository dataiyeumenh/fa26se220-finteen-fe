// No dashboard endpoint is available in the supplied backend contract yet.
export default function useParentDashboard() {
  return {
    user: undefined, weeklyGrowth: undefined, streakChild: undefined,
    stats: [], children: [], activities: [],
    loading: false,
    error: 'Dashboard phụ huynh chưa kết nối API. Dữ liệu mô phỏng đã được gỡ bỏ.',
    refetch: () => {},
  }
}
