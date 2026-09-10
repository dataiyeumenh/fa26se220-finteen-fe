import { useCallback, useEffect, useState } from 'react'
import { getTeacherOverview } from '@/api/dashboard.api'

export default function useTeacherDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getTeacherOverview()
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
    rating: data?.rating,
    totalStudents: data?.stats?.find(s => s.label === 'Tổng học sinh')?.value,
    stats: data?.stats || [],
    classes: data?.classes || [],
    submissions: data?.submissions || [],
    loading,
    error,
    refetch: load,
  }
}
