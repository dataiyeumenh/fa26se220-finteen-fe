import { useState, useCallback, useEffect } from 'react'

/**
 * Hook cho User Lessons page - bản đồ game 8 chương.
 */
export function useUserLessons() {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 8 chương của trò chơi
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Dữ liệu 8 chương - có thể lấy từ API hoặc mock data
      const chaptersData = [
        {
          id: 1,
          title: 'Chương 1',
          subtitle: 'Tiết Kiệm Đầu Tiên',
          description: 'Học cách tiết kiệm từ những đồng tiền nhỏ nhất',
          icon: '🐷',
          color: '#22c55e',
          status: 'completed', // completed | current | locked | available
          progress: 100,
          lessonsCompleted: 5,
          totalLessons: 5,
        },
        {
          id: 2,
          title: 'Chương 2',
          subtitle: 'Cuộc Sống Tự Lập',
          description: 'Quản lý chi tiêu khi sống xa gia đình',
          icon: '🏠',
          color: '#3b82f6',
          status: 'current',
          progress: 60,
          lessonsCompleted: 3,
          totalLessons: 5,
        },
        {
          id: 3,
          title: 'Chương 3',
          subtitle: 'Đại Học Đầu Tiên',
          description: 'Bước vào đời sống sinh viên với những thử thách mới',
          icon: '🎓',
          color: '#8b5cf6',
          status: 'locked',
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 5,
        },
        {
          id: 4,
          title: 'Chương 4',
          subtitle: 'Công Việc Đầu Tay',
          description: 'Những bài học về thu nhập và chi tiêu hợp lý',
          icon: '💼',
          color: '#f59e0b',
          status: 'locked',
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 5,
        },
        {
          id: 5,
          title: 'Chương 5',
          subtitle: 'Tiết Kiệm Thông Minh',
          description: 'Học cách đầu tư và tiết kiệm hiệu quả',
          icon: '📈',
          color: '#ec4899',
          status: 'locked',
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 5,
        },
        {
          id: 6,
          title: 'Chương 6',
          subtitle: 'Kinh Doanh Nhỏ',
          description: 'Bắt đầu con đường khởi nghiệp',
          icon: '🏪',
          color: '#06b6d4',
          status: 'locked',
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 5,
        },
        {
          id: 7,
          title: 'Chương 7',
          subtitle: 'Đầu Tư Tài Chính',
          description: 'Hiểu về chứng khoán, vàng và các kênh đầu tư',
          icon: '💰',
          color: '#ef4444',
          status: 'locked',
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 5,
        },
        {
          id: 8,
          title: 'Chương 8',
          subtitle: 'Thành Công Cuối Cùng',
          description: 'Hoàn thành hành trình trở thành người quản lý tài chính thông minh',
          icon: '🏆',
          color: '#fbbf24',
          status: 'locked',
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 5,
        },
      ]

      setChapters(chaptersData)
    } catch (e) {
      setError(e.message || 'Không thể tải dữ liệu bài học.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    chapters,
    loading,
    error,
    refetch: load,
  }
}
