import {
  ClipboardList,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  ActionForm,
  Empty,
  Heading,
  Modal,
  Notice,
} from "../../../../features/workspace/ui";
import {
  useTeacherQuestionBank,
  useTeacherQuizDetail,
  useTeacherQuizResults,
} from "../hooks/useTeacherQuizzes";

const kindLabel = (quiz) =>
  quiz.kind === "POST_TEST"
    ? `Hậu trắc chương ${quiz.chapter}`
    : "Đề giáo viên";
const dateTime = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "Không có hạn";

export default function TeacherQuizContent({ quizState }) {
  const {
    groups,
    groupId,
    setGroupId,
    quizzes,
    currentGroup,
    loading,
    message,
    error,
    reload,
    refresh,
    publishQuiz,
    deleteQuiz,
  } = quizState;
  const [modal, setModal] = useState(null);
  const done = async (text) => {
    setModal(null);
    await refresh(text);
  };
  return (
    <>
      <Heading
        title="Quản lý Quiz"
        description="Tạo đề, phát hành cho lớp và theo dõi kết quả."
      >
        <button className="ws-btn" onClick={reload}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      {(message || error) && (
        <div className={`ws-toast ${error ? "error" : "success"}`}>
          {error || message}
        </div>
      )}
      {modal?.type === "edit" ? (
        <QuizEditor
          groups={groups}
          quiz={modal.quiz}
          onClose={() => setModal(null)}
          onSaved={done}
        />
      ) : (
        <>
          <div className="ws-toolbar">
            <label>
              Lớp học
              <select
                value={groupId}
                onChange={(event) => setGroupId(event.target.value)}
              >
                {groups.map((group) => (
                  <option value={group.id} key={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
            {currentGroup && !currentGroup.closedAt && (
              <button
                className="ws-btn primary"
                onClick={() => setModal({ type: "edit" })}
              >
                <Plus size={16} /> Tạo đề
              </button>
            )}
          </div>
          {loading ? (
            <Empty>Đang tải danh sách Quiz…</Empty>
          ) : quizzes.length ? (
            <div className="ws-grid two">
              {quizzes.map((quiz) => (
                <article className="ws-card" key={quiz.id}>
                  <div className="ws-row">
                    <span className="ws-pill">{kindLabel(quiz)}</span>
                    <span className="ws-pill">
                      {quiz.publishedAt ? "Đã phát hành" : "Bản nháp"}
                    </span>
                  </div>
                  <h2>{quiz.title}</h2>
                  <p>
                    {quiz.questionCount} câu · Hạn {dateTime(quiz.dueAt)}
                  </p>
                  <p>{quiz.submittedCount || 0} học sinh đã nộp</p>
                  <div className="ws-actions">
                    <button
                      className="ws-btn"
                      onClick={() => setModal({ type: "detail", quiz })}
                    >
                      <Eye size={16} /> Xem đề
                    </button>
                    {!quiz.publishedAt && quiz.kind !== "POST_TEST" && (
                      <>
                        <button
                          className="ws-btn"
                          onClick={() => setModal({ type: "edit", quiz })}
                        >
                          <Pencil size={16} /> Sửa
                        </button>
                        <button
                          className="ws-btn primary"
                          onClick={() => setModal({ type: "publish", quiz })}
                        >
                          <Send size={16} /> Phát hành
                        </button>
                        <button
                          className="ws-btn danger"
                          onClick={() => setModal({ type: "delete", quiz })}
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </>
                    )}
                    {quiz.publishedAt && (
                      <button
                        className="ws-btn"
                        onClick={() => setModal({ type: "results", quiz })}
                      >
                        <ClipboardList size={16} /> Kết quả
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty>Lớp này chưa có đề Quiz.</Empty>
          )}
        </>
      )}
      {modal?.type === "detail" && (
        <QuizDetail quiz={modal.quiz} onClose={() => setModal(null)} />
      )}{" "}
      {modal?.type === "results" && (
        <QuizResults quiz={modal.quiz} onClose={() => setModal(null)} />
      )}{" "}
      {["publish", "delete"].includes(modal?.type) && (
        <Modal
          title={modal.type === "publish" ? "Phát hành đề?" : "Xóa đề nháp?"}
          onClose={() => setModal(null)}
        >
          <button
            className={`ws-btn ${modal.type === "delete" ? "danger" : "primary"}`}
            onClick={() =>
              void (
                modal.type === "publish"
                  ? publishQuiz(modal.quiz.id)
                  : deleteQuiz(modal.quiz.id)
              ).then((ok) => {
                if (ok) setModal(null);
              })
            }
          >
            Xác nhận
          </button>
        </Modal>
      )}
    </>
  );
}

function QuizEditor({ groups, quiz, onClose, onSaved }) {
  const [filters, setFilters] = useState({
    q: "",
    standard: "",
    concept: "",
    pool: "",
  });
  const [applied, setApplied] = useState(filters);
  const [selected, setSelected] = useState(
    () =>
      new Set(
        quiz?.questionIds || quiz?.questions?.map((item) => item.id) || [],
      ),
  );
  const { questions, loading, error, saveQuiz } =
    useTeacherQuestionBank(applied);
  const toggle = (id) =>
    setSelected((old) => {
      const next = new Set(old);
      next.has(id) ? next.delete(id) : next.size < 100 && next.add(id);
      return next;
    });
  return (
    <section className="ws-card ws-quiz-editor-page">
      <header>
        <div>
          <span className="ws-pill">
            {quiz ? "Chỉnh sửa đề" : "Tạo đề mới"}
          </span>
          <h2>{quiz ? "Chỉnh sửa đề nháp" : "Tạo đề kiểm tra"}</h2>
        </div>
        <button className="ws-btn" onClick={onClose}>
          ← Danh sách đề
        </button>
      </header>
      <ActionForm
        submit={quiz ? "Lưu thay đổi" : "Tạo đề nháp"}
        onSubmit={async (form) => {
          if (!selected.size) throw new Error("Hãy chọn ít nhất một câu hỏi.");
          const dueAt = new Date(form.get("dueAt")).toISOString();
          await saveQuiz(quiz?.id, {
            groupId: form.get("groupId"),
            title: form.get("title"),
            questionIds: [...selected],
            dueAt,
          });
          await onSaved(quiz ? "Đã cập nhật đề nháp." : "Đã tạo đề nháp.");
        }}
      >
        <label>
          Lớp
          <select
            name="groupId"
            defaultValue={
              quiz?.groupId || groups.find((item) => !item.closedAt)?.id
            }
            disabled={Boolean(quiz)}
          >
            {groups
              .filter((item) => !item.closedAt)
              .map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Tên đề
          <input name="title" defaultValue={quiz?.title || ""} required />
        </label>
        <label>
          Hạn nộp
          <input name="dueAt" type="datetime-local" required />
        </label>
        <fieldset>
          <legend>Kho câu hỏi · đã chọn {selected.size}/100</legend>
          <div className="ws-toolbar">
            <label>
              Tìm
              <input
                value={filters.q}
                onChange={(event) =>
                  setFilters((old) => ({ ...old, q: event.target.value }))
                }
              />
            </label>
            <button
              type="button"
              className="ws-btn"
              onClick={() => setApplied({ ...filters })}
            >
              Lọc
            </button>
          </div>
          <Notice text={error} />
          {loading ? (
            <Empty>Đang tải kho câu hỏi…</Empty>
          ) : (
            <div className="ws-checks">
              {questions.map((question) => (
                <label key={question.id}>
                  <input
                    type="checkbox"
                    checked={selected.has(question.id)}
                    onChange={() => toggle(question.id)}
                  />
                  <span>
                    <strong>{question.externalId || "Câu hỏi"}</strong> ·{" "}
                    {question.stem}
                  </span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      </ActionForm>
    </section>
  );
}

function QuizDetail({ quiz, onClose }) {
  const { detail, error } = useTeacherQuizDetail(quiz.id);
  return (
    <Modal title={detail?.quiz?.title || "Chi tiết đề"} onClose={onClose}>
      <Notice text={error} />
      {detail?.questions?.map((question, index) => (
        <section className="ws-question" key={question.id}>
          <h3>
            {index + 1}. {question.stem}
          </h3>
          {question.options?.map((option, optionIndex) => (
            <p key={option}>
              {String.fromCharCode(65 + optionIndex)}. {option}
              {question.correctIndex === optionIndex ? " ✓" : ""}
            </p>
          ))}
        </section>
      ))}
    </Modal>
  );
}

function QuizResults({ quiz, onClose }) {
  const { data, slotResult, setSlotResult, error, viewSlot } =
    useTeacherQuizResults(quiz.id);
  return (
    <Modal title={`Kết quả · ${quiz.title}`} onClose={onClose}>
      <Notice text={error} />
      {data ? (
        <div className="ws-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Trạng thái</th>
                <th>Điểm</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.slotId}>
                  <td>{row.displayName || "Đã xóa"}</td>
                  <td>{row.attempted ? "Đã nộp" : "Chưa nộp"}</td>
                  <td>
                    {row.attempted ? `${row.score}/${row.totalQuestions}` : "—"}
                  </td>
                  <td>
                    {row.attempted && (
                      <button
                        className="ws-btn compact"
                        onClick={() => void viewSlot(row.slotId)}
                      >
                        Xem bài
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>Đang tải kết quả…</Empty>
      )}
      {slotResult && (
        <section className="ws-slot-result-detail">
          <button className="ws-btn" onClick={() => setSlotResult(null)}>
            Đóng chi tiết
          </button>
          {slotResult.answers.map((answer, index) => (
            <article className="ws-question" key={answer.questionId}>
              <strong>
                {index + 1}. {answer.stem}
              </strong>
              <p>{answer.correct ? "✓ Trả lời đúng" : "✕ Trả lời sai"}</p>
            </article>
          ))}
        </section>
      )}
    </Modal>
  );
}
