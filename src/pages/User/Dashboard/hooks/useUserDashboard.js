import { useCallback, useEffect, useState } from 'react'
import { getUserOverview } from '@/api/dashboard.api'

/**
 * Hook cho User dashboard.
 * - Gọi API 1 lần khi mount
 * - Quản lý loading / error / refetch
 */
export default function useUserDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getUserOverview()
      setData(response)
    } catch (e) {
      setError(e.message || 'Không thể tải dữ liệu dashboard.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    user: data?.user,
    streak: data?.streak,
    lessonsThisWeek: data?.lessonsThisWeek,
    lessonsTarget: data?.lessonsTarget,
    stats: data?.stats || [],
    continueLessons: data?.continueLessons || [],
    achievements: data?.achievements || [],
    loading,
    error,
    refetch: load,
  }
}
