import { useCallback, useEffect, useState } from 'react'
import { getParentOverview } from '@/api/dashboard.api'

export default function useParentDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getParentOverview()
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
    weeklyGrowth: data?.weeklyGrowth,
    streakChild: data?.children?.[0]?.name,
    stats: data?.stats || [],
    children: data?.children || [],
    activities: data?.activities || [],
    loading,
    error,
    refetch: load,
  }
}
