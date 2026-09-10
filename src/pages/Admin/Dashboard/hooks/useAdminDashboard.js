import { useCallback, useEffect, useState } from 'react'
import { getAdminOverview } from '@/api/dashboard.api'

export default function useAdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getAdminOverview()
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
    stats: data?.systemStats?.slice(0, 4) || [],
    health: data?.health || [],
    recentUsers: data?.recentUsers || [],
    logs: data?.logs || [],
    systemOk: !(data?.logs || []).some(l => l.level === 'error'),
    loading,
    error,
    refetch: load,
  }
}
