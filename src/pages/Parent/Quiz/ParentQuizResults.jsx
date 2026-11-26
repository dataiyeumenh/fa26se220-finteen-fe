import { useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { Empty, Heading, Notice } from "../../../features/workspace/ui";
import { teacherQuizApi } from "../../Teacher/Quiz/api/teacherQuizApi";
import { QuizResults } from "../../Teacher/Quiz/components/TeacherQuizContent";

export default function ParentQuizResults() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const groups = await teacherQuizApi.listGroups();
        const families = (groups || []).filter((group) => group.context === "FAMILY");
        const rows = await Promise.all(families.map(async (group) => {
          const items = await teacherQuizApi.listQuizzes(group.id);
          return (items || [])
            .filter((quiz) => quiz.kind === "POST_TEST")
            .map((quiz) => ({ ...quiz, familyName: group.name }));
        }));
        if (active) setQuizzes(rows.flat());
      } catch (value) {
        if (active) {
          setQuizzes([]);
          setError(value.message || "Không thể tải kết quả bài trắc nghiệm sau chương. Vui lòng thử lại.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [revision]);

  return <>
    <Heading title="Quản lý Quiz" description="Xem kết quả bài trắc nghiệm sau chương và bài làm của các con trong gia đình.">
      <button className="ws-btn" disabled={loading} onClick={() => setRevision((value) => value + 1)}>
        <RefreshCw size={16} /> Làm mới
      </button>
    </Heading>
    <Notice text={error} />
    {loading ? <Empty>Đang tải danh sách bài trắc nghiệm sau chương…</Empty> : !error && (
      <section className="ws-card ws-quiz-result-list">
        <header><h2>Kết quả bài trắc nghiệm sau chương</h2><p>Chọn một bài trắc nghiệm sau chương để xem điểm và chi tiết câu trả lời của trẻ.</p></header>
        {quizzes.length ? <div className="ws-table-wrap"><table>
          <thead><tr><th>Bài trắc nghiệm sau chương</th><th>Gia đình</th><th>Đã nộp</th><th><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>{quizzes.map((quiz) => <tr key={quiz.id}>
            <td><strong>{quiz.title}</strong></td>
            <td>{quiz.familyName || "Gia đình"}</td>
            <td>{quiz.submittedCount ?? "—"}</td>
            <td><button className="ws-btn compact" onClick={() => setSelectedQuiz(quiz)}><Eye size={15} /> Xem kết quả</button></td>
          </tr>)}</tbody>
        </table></div> : <Empty>Chưa có bài trắc nghiệm sau chương. Bài sẽ xuất hiện theo tiến trình học của các con.</Empty>}
      </section>
    )}
    {selectedQuiz && <QuizResults key={selectedQuiz.id} quiz={selectedQuiz} family onClose={() => setSelectedQuiz(null)} />}
  </>;
}
