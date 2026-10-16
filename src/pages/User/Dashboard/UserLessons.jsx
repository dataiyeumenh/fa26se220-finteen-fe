import { useNavigate } from 'react-router-dom'
import { MapPinned } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useUserLessons } from './hooks/useUserLessons'
import GameMap from './components/GameMapReal'

export default function UserLessons() {
  const navigate = useNavigate()
  const { chapters, loading, error } = useUserLessons()

  const handleChapterClick = (chapter) => {
    navigate(`/dashboard/kid/play?chapter=${chapter.id}`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-sm text-[#1a3a1a]/60 py-12">
          Đang tải bản đồ...
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: '#f8717115',
            borderColor: '#f87171',
            color: '#dc2626',
          }}
        >
          {error}
        </div>
      </DashboardLayout>
    )
  }

  // Quick stats (compact)
  const completedCount = chapters.filter((c) => c.status === 'completed').length

  const totalLessonsCompleted = chapters.reduce((sum, c) => sum + c.lessonsCompleted, 0)
  const totalLessons = chapters.reduce((sum, c) => sum + c.totalLessons, 0)
  const overallProgress = Math.round((totalLessonsCompleted / totalLessons) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="journey-page-heading text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                <MapPinned className="w-5 h-5 text-amber-600" />
                Hành trình của bạn
              </h1>
              <p className="text-gray-500 text-xs md:text-sm font-medium">
                Cuộc phiêu lưu tài chính qua 8 chương · {overallProgress}% hoàn thành
              </p>
            </div>
          </div>

          <div className="journey-overall">
            <span><span>{completedCount}/8 chương hoàn thành</span><strong>{overallProgress}%</strong></span>
            <div className="journey-overall-track" role="progressbar" aria-label="Tiến độ hành trình" aria-valuenow={overallProgress} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${overallProgress}%` }} /></div>
          </div>
        </div>
        {/* ADVENTURE MAP */}
        <GameMap chapters={chapters} onChapterClick={handleChapterClick} />
      </div>
    </DashboardLayout>
  )
}
