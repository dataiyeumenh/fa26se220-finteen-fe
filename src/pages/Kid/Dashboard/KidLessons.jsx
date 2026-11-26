import { useNavigate } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { useKidLessons } from "./hooks/useKidLessons";
import GameMap from "./components/GameMapReal";

export default function KidLessons() {
  const navigate = useNavigate();
  const { chapters, loading, error, retry, postTestRequired } = useKidLessons();

  const handleChapterClick = (chapter) => {
    if (chapter.lockReason === "post-test" && chapter.postTestRequired?.quizId) {
      navigate(`/dashboard/kid/quiz/${chapter.postTestRequired.quizId}`, { state: { quiz: { id: chapter.postTestRequired.quizId, chapter: chapter.postTestRequired.chapter, kind: "POST_TEST" } } });
      return;
    }
    navigate(`/dashboard/kid/play?chapter=${chapter.id}`);
  };

  if (loading) {
    return (
      <>
        <div className="text-center text-sm text-[#1a3a1a]/60 py-12">
          Đang tải bản đồ...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: "#f8717115",
            borderColor: "#f87171",
            color: "#dc2626",
          }}
        >
          {error}
          <button className="ws-btn" onClick={retry}>Thử lại</button>
        </div>
      </>
    );
  }

  if (!chapters.length) return <p className="py-12 text-center">Chưa có chương nào được phát hành.</p>;

  // Quick stats (compact)
  const completedCount = chapters.filter(
    (c) => c.status === "completed",
  ).length;

  const totalLessonsCompleted = chapters.reduce(
    (sum, c) => sum + c.lessonsCompleted,
    0,
  );
  const totalLessons = chapters.reduce((sum, c) => sum + c.totalLessons, 0);
  const overallProgress = Math.round(
    totalLessons ? (totalLessonsCompleted / totalLessons) * 100 : 0,
  );

  return (
    <>
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
                Cuộc phiêu lưu tài chính qua {chapters.length} chương · {overallProgress}% hoàn
                thành
              </p>
            </div>
          </div>

          <div className="journey-overall">
            <span>
              <span>{completedCount}/{chapters.length} chương hoàn thành</span>
              <strong>{overallProgress}%</strong>
            </span>
            <div
              className="journey-overall-track"
              role="progressbar"
              aria-label="Tiến độ hành trình"
              aria-valuenow={overallProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>
        {/* ADVENTURE MAP */}
        {postTestRequired?.quizId && <aside className="journey-post-test-notice" role="status">
          <div><strong>Còn một bước để mở chương tiếp theo!</strong><p>Em cần hoàn thành hậu trắc chương {postTestRequired.chapter} để tiếp tục hành trình.</p></div>
          <button type="button" className="ws-btn primary" onClick={() => navigate(`/dashboard/kid/quiz/${postTestRequired.quizId}`, { state: { quiz: { id: postTestRequired.quizId, chapter: postTestRequired.chapter, kind: "POST_TEST" } } })}>Làm hậu trắc chương {postTestRequired.chapter}</button>
        </aside>}
        <GameMap chapters={chapters} onChapterClick={handleChapterClick} />
      </div>
    </>
  );
}
