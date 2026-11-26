import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QuestionFileImport from "../../../../components/public/QuestionFileImport.jsx";
import QuestionSetPicker from "./QuestionSetPicker.jsx";
import MyQuestionBank from "./MyQuestionBank.jsx";
import {
  ActionForm,
  Empty,
  Heading,
  Modal,
  Notice,
  DataSourceNote,
} from "../../../../features/workspace/ui";
import {
  useTeacherQuestionBank,
  useTeacherQuizDetail,
  useTeacherQuizResults,
} from "../hooks/useTeacherQuizzes";

const kindLabel = (quiz) =>
  quiz.kind === "POST_TEST"
    ? `Bài trắc nghiệm sau chương ${quiz.chapter}`
    : "Đề giáo viên";
const dateTime = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "Không có hạn";
const localDateTimeInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
};
const quizQuestionSummary = (quiz) => {
  const sourceCount = Number(quiz?.questionCount) || 0;
  const assignedCount = quiz?.mode === "TEST" && Number(quiz?.drawCount) > 0
    ? Number(quiz.drawCount)
    : sourceCount;
  return { sourceCount, assignedCount };
};
const QUESTION_BANK_FILTERS = {};

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
    requestedQuizId,
    requestedSlotId,
  } = quizState;
  const [modal, setModal] = useState(null);
  const [view, setView] = useState("overview");
  const openedRequestedQuiz = useRef("");
  useEffect(() => {
    if (!requestedQuizId || openedRequestedQuiz.current === requestedQuizId) return;
    const quiz = quizzes.find((item) => String(item.id) === String(requestedQuizId));
    if (!quiz) return;
    openedRequestedQuiz.current = requestedQuizId;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView("results");
    setModal({ type: "results", quiz, slotId: requestedSlotId });
  }, [quizzes, requestedQuizId, requestedSlotId]);
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
      <nav className="ws-quiz-v3-nav" aria-label="Chức năng Quiz">
        {[["overview","Tổng quan"],["create","Tạo đề"],["shared","Kho câu hỏi chung"],["mine","Kho câu hỏi riêng"],["results","Kết quả đề"]].map(([id,label]) => <button key={id} className={view===id?"active":""} onClick={()=>{setModal(null); setView(id); if(id==="create") setModal({type:"edit"});}}>{label}</button>)}
      </nav>
      {view === "shared" && <MyQuestionBank shared />}
      {view === "mine" && <MyQuestionBank />}
      {modal?.type === "edit" ? (
        <QuizEditLoader
          groups={groups}
          quiz={modal.quiz}
          onClose={() => { setModal(null); setView("overview"); }}
          onSaved={done}
        />
      ) : !["shared", "mine"].includes(view) ? (
        <>
          <div className="ws-toolbar">
            {view === "overview" && currentGroup && !currentGroup.closedAt && (
              <button className="ws-btn" onClick={() => setModal({ type: "edit" })}>
                Nhập từ tệp
              </button>
            )}
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
            {view === "overview" && currentGroup && !currentGroup.closedAt && (
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
          ) : view === "results" ? (
            <QuizResultsList quizzes={quizzes.filter((quiz) => quiz.publishedAt)} onOpen={(quiz) => setModal({ type: "results", quiz })} />
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
                  {quiz.source === "mock" && <DataSourceNote>Đề import chỉ lưu trên trình duyệt này. Chưa thể giao cho học sinh hoặc đồng bộ máy chủ.</DataSourceNote>}
                  {quiz.mode === "TEST" && quiz.drawCount ? <p><strong>Mỗi học sinh làm {quizQuestionSummary(quiz).assignedCount} câu</strong> · hệ thống chọn từ {quizQuestionSummary(quiz).sourceCount} câu đã chuẩn bị</p> : <p>{quizQuestionSummary(quiz).sourceCount} câu · Hạn {dateTime(quiz.dueAt)}</p>}
                  {quiz.mode === "TEST" && quiz.drawCount && <p>Hạn {dateTime(quiz.dueAt)}</p>}
                  <p>{quiz.submittedCount || 0} học sinh đã nộp</p>
                  <div className="ws-actions">
                    <button
                      className="ws-btn"
                      onClick={() => setModal({ type: "detail", quiz })}
                    >
                      <Eye size={16} /> Xem đề
                    </button>
                    {!quiz.publishedAt && quiz.kind !== "POST_TEST" && quiz.source !== "mock" && (
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
                    {quiz.source === "mock" && (
                      <button className="ws-btn danger" onClick={() => setModal({ type: "delete", quiz })}>
                        <Trash2 size={16} /> Xóa mock
                      </button>
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
      ) : null}
      {modal?.type === "detail" && (
        <QuizDetail quiz={modal.quiz} onClose={() => setModal(null)} />
      )}{" "}
      {modal?.type === "results" && (
        <QuizResults quiz={modal.quiz} requestedSlotId={modal.slotId} onClose={() => setModal(null)} />
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
function QuizResultsList({ quizzes, onOpen }) {
  const totalSubmitted = quizzes.reduce((sum, quiz) => sum + Number(quiz.submittedCount || 0), 0);
  return <section className="ws-quiz-result-page">
    <div className="ws-quiz-result-summary">
      <article><span>Đề đang theo dõi</span><strong>{quizzes.length}</strong><small>đề đã phát hành</small></article>
      <article><span>Lượt đã nộp</span><strong>{totalSubmitted}</strong><small>trên tất cả đề</small></article>
    </div>
    <div className="ws-card ws-quiz-result-list">
      <header><div><h2>Kết quả theo từng đề</h2><p>Chọn một đề để xem trạng thái và bài làm của từng học sinh.</p></div></header>
      {quizzes.length ? <div className="ws-table-wrap"><table><thead><tr><th>Tên đề</th><th>Hình thức</th><th>Số câu học sinh làm</th><th>Đã nộp</th><th>Hạn nộp</th><th><span className="sr-only">Thao tác</span></th></tr></thead><tbody>{quizzes.map((quiz) => { const counts = quizQuestionSummary(quiz); return <tr key={quiz.id}><td><strong>{quiz.title}</strong><small>{kindLabel(quiz)}</small></td><td>{quiz.mode === "TEST" ? "Kiểm tra" : quiz.mode === "PRACTICE" ? "Luyện tập" : "Đề cũ"}</td><td><strong>{counts.assignedCount} câu</strong>{counts.sourceCount !== counts.assignedCount && <small>từ {counts.sourceCount} câu nguồn</small>}</td><td><strong>{quiz.submittedCount || 0}</strong></td><td>{dateTime(quiz.dueAt)}</td><td><button className="ws-btn primary compact" onClick={() => onOpen(quiz)}><ClipboardList size={15}/>Xem kết quả</button></td></tr>; })}</tbody></table></div> : <Empty>Chưa có đề nào được phát hành để xem kết quả.</Empty>}
    </div>
  </section>;
}
function QuizEditLoader(props) {
  const { quiz } = props;
  const { detail, error } = useTeacherQuizDetail(quiz?.id);
  if (!quiz) return <QuizEditor {...props} />;
  if (error)
    return (
      <section className="ws-card">
        <Notice text={error} />
        <button className="ws-btn" onClick={props.onClose}>
          Quay lại
        </button>
      </section>
    );
  if (!detail) return <Empty>Đang tải chi tiết đề…</Empty>;
  return (
    <QuizEditor
      {...props}
      quiz={{ ...quiz, ...detail.quiz, questions: detail.questions || [] }}
    />
  );
}
function QuizEditor({ groups, quiz, onClose, onSaved }) {
  const [selected, setSelected] = useState(
    () =>
      new Set(
        quiz?.questionIds || quiz?.questions?.map((item) => item.id) || [],
      ),
  );
  const { questions, myQuestions, loading, error, saveQuiz } =
    useTeacherQuestionBank(QUESTION_BANK_FILTERS);
  const [mode, setMode] = useState(quiz?.mode || "PRACTICE");
  const [newQuestions, setNewQuestions] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formValues, setFormValues] = useState(() => ({
    groupId: quiz?.groupId || groups.find((item) => !item.closedAt)?.id || "",
    title: quiz?.title || "",
    dueAt: localDateTimeInput(quiz?.dueAt),
    drawCount: quiz?.drawCount ? String(quiz.drawCount) : "",
    durationMinutes: quiz?.durationSeconds ? String(Math.ceil(quiz.durationSeconds / 60)) : "",
  }));
  const updateFormValue = (name, value) => {
    setFormValues((old) => ({ ...old, [name]: value }));
    clearFieldError(name);
  };
  const clearFieldError = (name) => setFieldErrors((old) => old[name] ? { ...old, [name]: "" } : old);
  const updateSelected = (next) => { setSelected(next); clearFieldError("questions"); };
  const updateNewQuestions = (next) => { setNewQuestions(next); clearFieldError("questions"); };
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
        noValidate
        submit={quiz ? "Lưu thay đổi" : "Tạo đề nháp"}
        onSubmit={async () => {
          const groupId = formValues.groupId.trim();
          const title = formValues.title.trim();
          const dueValue = formValues.dueAt.trim();
          const dueDate = dueValue ? new Date(dueValue) : null;
          const totalQuestions = selected.size + newQuestions.length;
          const drawRaw = formValues.drawCount.trim();
          const durationRaw = formValues.durationMinutes.trim();
          const nextErrors = {};
          if (!groupId) nextErrors.groupId = "Vui lòng chọn lớp sẽ nhận đề.";
          if (!title) nextErrors.title = "Vui lòng nhập tên đề để giáo viên và học sinh dễ nhận biết.";
          else if (title.length > 200) nextErrors.title = "Tên đề không được dài quá 200 ký tự.";
          if (!dueValue) nextErrors.dueAt = "Vui lòng chọn hạn nộp bài.";
          else if (!dueDate || Number.isNaN(dueDate.getTime())) nextErrors.dueAt = "Hạn nộp chưa đúng định dạng ngày và giờ.";
          else if (!quiz && dueDate.getTime() <= Date.now()) nextErrors.dueAt = "Hạn nộp phải muộn hơn thời điểm hiện tại.";
          if (totalQuestions < 1) nextErrors.questions = "Vui lòng chọn hoặc thêm ít nhất một câu hỏi.";
          else if (totalQuestions > 100) nextErrors.questions = `Đề đang có ${totalQuestions} câu; tối đa là 100 câu.`;
          if (mode === "TEST" && drawRaw) {
            const drawCount = Number(drawRaw);
            if (!Number.isInteger(drawCount) || drawCount < 1) nextErrors.drawCount = "Số câu mỗi học sinh làm phải là số nguyên từ 1 trở lên.";
            else if (drawCount > totalQuestions) nextErrors.drawCount = `Thầy cô mới chuẩn bị ${totalQuestions} câu. Vui lòng nhập từ 1 đến ${totalQuestions}.`;
          }
          if (mode === "TEST" && durationRaw) {
            const duration = Number(durationRaw);
            if (!Number.isInteger(duration) || duration < 1 || duration > 180) nextErrors.durationMinutes = "Thời gian làm bài phải là số nguyên từ 1 đến 180 phút.";
          }
          setFieldErrors(nextErrors);
          if (Object.keys(nextErrors).length) throw new Error("Một số thông tin chưa đầy đủ hoặc chưa hợp lệ. Vui lòng kiểm tra các dòng màu đỏ.");
          if (loading || error) throw new Error("Kho câu hỏi chưa tải xong. Hãy thử lại sau.");
          const dueAt = dueDate.toISOString();
          await saveQuiz(quiz?.id, {
            groupId,
            title,
            questionIds: [...selected],
            newQuestions: newQuestions.map(({ stem, options, correctIndex }) => ({ stem, options, correctIndex })),
            dueAt,
            mode,
            drawCount: mode === "TEST" && drawRaw ? Number(drawRaw) : null,
            durationMinutes: mode === "TEST" && durationRaw ? Number(durationRaw) : null,
          });
          await onSaved(quiz ? "Đã cập nhật đề nháp." : "Đã tạo đề nháp.");
        }}
      >
        <label>
          Lớp
          <select
            name="groupId"
            value={formValues.groupId}
            disabled={Boolean(quiz)}
            onChange={(event) => updateFormValue("groupId", event.target.value)}
          >
            {groups
              .filter((item) => !item.closedAt)
              .map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          {fieldErrors.groupId && <small className="ws-field-error">{fieldErrors.groupId}</small>}
        </label>
        <label>
          Tên đề
          <input name="title" value={formValues.title} required onChange={(event) => updateFormValue("title", event.target.value)} />
          {fieldErrors.title && <small className="ws-field-error">{fieldErrors.title}</small>}
        </label>
        <label>
          Hạn nộp
          <input
            name="dueAt"
            type="datetime-local"
            value={formValues.dueAt}
            required
            onChange={(event) => updateFormValue("dueAt", event.target.value)}
          />
          {fieldErrors.dueAt && <small className="ws-field-error">{fieldErrors.dueAt}</small>}
        </label>
        <fieldset className="ws-quiz-mode"><legend>Hình thức làm bài</legend><label className={mode==="PRACTICE"?"active":""}><input type="radio" checked={mode==="PRACTICE"} onChange={()=>setMode("PRACTICE")}/> <strong>Luyện tập</strong><span>Học sinh có thể làm lại nhiều lần trước hạn nộp.</span></label><label className={mode==="TEST"?"active":""}><input type="radio" checked={mode==="TEST"} onChange={()=>setMode("TEST")}/> <strong>Kiểm tra</strong><span>Mỗi học sinh làm một lần; hệ thống tạo đề riêng và tính giờ.</span></label></fieldset>
        {mode === "TEST" && <section className="ws-test-settings"><h3>Cài đặt bài kiểm tra</h3><div className="ws-grid two"><label>Số câu mỗi học sinh làm<input name="drawCount" type="number" min="1" max={Math.max(1, selected.size + newQuestions.length)} value={formValues.drawCount} placeholder="Ví dụ: 30" onChange={(event) => updateFormValue("drawCount", event.target.value)}/><small className="ws-field-help">Thầy cô đang chuẩn bị {selected.size + newQuestions.length} câu. Để trống nếu muốn mỗi em làm tất cả; nhập ít hơn để hệ thống tạo bộ câu khác nhau cho từng em.</small>{fieldErrors.drawCount && <small className="ws-field-error">{fieldErrors.drawCount}</small>}</label><label>Thời gian làm bài (phút)<input name="durationMinutes" type="number" min="1" max="180" value={formValues.durationMinutes} placeholder="Ví dụ: 30" onChange={(event) => updateFormValue("durationMinutes", event.target.value)}/><small className="ws-field-help">Để trống, hệ thống tự tính khoảng 1 phút cho mỗi câu học sinh phải làm.</small>{fieldErrors.durationMinutes && <small className="ws-field-error">{fieldErrors.durationMinutes}</small>}</label></div></section>}
        <section className="ws-import-inline"><h3>Thêm câu hỏi từ tệp</h3><p>Nếu đã có danh sách câu hỏi trong Excel, thầy cô có thể tải lên để không phải nhập từng câu.</p><QuestionFileImport questions={newQuestions} onChange={updateNewQuestions}/></section>
        <div className="ws-quiz-question-sources">
          {fieldErrors.questions && <p className="ws-field-error" role="alert">{fieldErrors.questions}</p>}
          <QuestionSetPicker questions={questions} selected={selected} onChange={updateSelected} loading={loading} error={error} />
          <QuestionSetPicker source="mine" questions={myQuestions} selected={selected} onChange={updateSelected} loading={loading} error={error} />
        </div>
      </ActionForm>
    </section>
  );
}

function QuizDetail({ quiz, onClose }) {
  const { detail, error } = useTeacherQuizDetail(quiz.id);
  const questions = detail?.questions || [];
  const title = detail?.quiz?.title || quiz.title;
  const quizInfo = detail?.quiz || quiz;
  const counts = quizQuestionSummary({ ...quiz, ...quizInfo, questionCount: quizInfo.questionCount || questions.length || quiz.questionCount });
  return (
    <Modal
      title="Xem đề Quiz"
      className="ws-quiz-preview-modal"
      onClose={onClose}
    >
      <div className="ws-quiz-preview">
        <header className="ws-quiz-preview-head">
          <div>
            <span className="ws-pill">{kindLabel(detail?.quiz || quiz)}</span>
            <h2>{title}</h2>
            <p>{quizInfo.mode === "TEST" && quizInfo.drawCount ? `Mỗi học sinh làm ${counts.assignedCount} câu được hệ thống chọn từ ${counts.sourceCount} câu đã chuẩn bị.` : "Xem toàn bộ nội dung và đáp án đúng trước khi sử dụng đề."}</p>
          </div>
          <div className="ws-quiz-preview-stats">
            <span>
              <ClipboardList size={18} />
              <strong>{counts.assignedCount}</strong>
              {quizInfo.mode === "TEST" && quizInfo.drawCount ? "câu mỗi học sinh" : "câu hỏi"}
            </span>
            <span>
              <Clock3 size={18} />
              <strong>{dateTime(detail?.quiz?.dueAt || quiz.dueAt)}</strong>
              hạn nộp
            </span>
          </div>
        </header>
        <Notice text={error} />
        {quizInfo.mode === "TEST" && quizInfo.drawCount && detail && <div className="ws-quiz-source-note"><strong>Danh sách {counts.sourceCount} câu nguồn</strong><span>Mỗi học sinh chỉ nhận {counts.assignedCount} câu. Thứ tự câu và đáp án do hệ thống xáo riêng khi em bắt đầu làm bài.</span></div>}
        {!detail && !error ? (
          <Empty>Đang tải nội dung đề…</Empty>
        ) : questions.length ? (
          <div className="ws-quiz-preview-list">
            {questions.map((question, index) => (
              <article className="ws-quiz-preview-question" key={question.id}>
                <div className="ws-quiz-preview-number">{index + 1}</div>
                <div className="ws-quiz-preview-body">
                  <div className="ws-quiz-preview-question-head">
                    <h3>{question.stem}</h3>
                    {question.externalId && (
                      <small>{question.externalId}</small>
                    )}
                  </div>
                  <div className="ws-quiz-preview-options">
                    {question.options?.map((option, optionIndex) => {
                      const correct = question.correctIndex === optionIndex;
                      return (
                        <div
                          className={correct ? "is-correct" : ""}
                          key={`${question.id}-${optionIndex}`}
                        >
                          <span>{String.fromCharCode(65 + optionIndex)}</span>
                          <p>{option}</p>
                          {correct && (
                            <strong>
                              <CheckCircle2 size={17} /> Đáp án đúng
                            </strong>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          !error && <Empty>Đề chưa có câu hỏi.</Empty>
        )}
      </div>
    </Modal>
  );
}
export function QuizResults({ quiz, onClose, family = false, requestedSlotId = "" }) {
  const learnerLabel = family ? "trẻ" : "học sinh";
  const { data, slotResult, setSlotResult, viewingSlotId, error, viewSlot } =
    useTeacherQuizResults(quiz.id);
  const { detail } = useTeacherQuizDetail(quiz.id);
  const openedRequestedSlot = useRef("");
  useEffect(() => {
    if (!requestedSlotId || openedRequestedSlot.current === requestedSlotId) return;
    openedRequestedSlot.current = requestedSlotId;
    void viewSlot(requestedSlotId);
  }, [requestedSlotId, viewSlot]);
  const questionsById = new Map((detail?.questions || []).map((question) => [question.id, question]));
  const rows = data?.rows || [];
  const submitted = rows.filter((row) => row.attempted || row.state === "SUBMITTED");
  const average = submitted.length
    ? Math.round(
        submitted.reduce(
          (sum, row) =>
            sum +
            (row.totalQuestions
              ? (Number(row.score || 0) / Number(row.totalQuestions)) * 100
              : 0),
          0,
        ) / submitted.length,
      )
    : 0;
  return (
    <Modal
      className="ws-quiz-results-modal"
      title={`Kết quả · ${quiz.title}`}
      description={`Theo dõi tình trạng nộp bài và kết quả của từng ${learnerLabel}.`}
      onClose={onClose}
    >
      {!slotResult && <div className="ws-quiz-results">
        <Notice text={error} />
        {data ? (
          <>
            <div className="ws-quiz-results-summary" aria-label="Tổng quan kết quả">
              <article>
                <span>{family ? "Số trẻ" : "Sĩ số"}</span>
                <strong>{rows.length}</strong>
                <small>{family ? "trẻ trong gia đình" : "học sinh trong lớp"}</small>
              </article>
              <article className="highlight">
                <span>Đã nộp</span>
                <strong>{submitted.length}/{rows.length}</strong>
                <small>{rows.length - submitted.length} {learnerLabel} chưa nộp</small>
              </article>
              <article>
                <span>Điểm trung bình</span>
                <strong>{submitted.length ? `${average}%` : "—"}</strong>
                <small>tính trên các bài đã nộp</small>
              </article>
            </div>

            <div className="ws-quiz-results-toolbar">
              <div>
                <h3>Bài làm của {learnerLabel}</h3>
                <p>Chọn “Xem bài” để kiểm tra chi tiết từng câu trả lời.</p>
              </div>
              <span className="ws-result-count">{rows.length} {learnerLabel}</span>
            </div>

            {rows.length ? (
              <div className="ws-quiz-results-table">
                <table>
                  <thead>
                    <tr>
                      <th>{family ? "Trẻ" : "Học sinh"}</th>
                      <th>Trạng thái</th>
                      <th>Điểm</th>
                      <th><span className="sr-only">Thao tác</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const name = row.displayName || "Hồ sơ đã xóa";
                      return (
                        <tr key={row.slotId}>
                          <td>
                            <div className="ws-student-cell">
                              <span aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
                              <div>
                                <strong>{name}</strong>
                                <small>{row.code || `Đã xóa thông tin ${learnerLabel}`}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`ws-result-status ${row.attempted ? "done" : "pending"}`}>
                              {row.state === "IN_PROGRESS" ? "Đang làm" : (row.attempted || row.state === "SUBMITTED") ? "Đã nộp" : "Chưa mở"}
                            </span>
                          </td>
                          <td>
                            {(row.attempted || row.state === "SUBMITTED") ? (
                              <strong className="ws-grade">{row.score == null ? "Kết quả có sau hạn nộp" : `${row.score}/${row.totalQuestions}`}</strong>
                            ) : (
                              <span className="ws-table-empty">Chưa có điểm</span>
                            )}
                          </td>
                          <td>
                            {(row.attempted || row.state === "SUBMITTED") && (
                              <button
                                className="ws-btn compact"
                                disabled={Boolean(viewingSlotId)}
                                onClick={() => void viewSlot(row.slotId)}
                              >
                                <Eye size={15} /> {viewingSlotId === row.slotId ? "Đang mở…" : "Xem bài"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty>Chưa có {learnerLabel} trong danh sách kết quả.</Empty>
            )}
          </>
        ) : (
          !error && <Empty>Đang tải kết quả…</Empty>
        )}
      </div>}
      {slotResult && (
        <section className="ws-slot-result-detail" ref={(node) => node?.scrollIntoView({ block: "start" })}>
          <button className="ws-btn" onClick={() => setSlotResult(null)}>
            ← Quay lại danh sách {learnerLabel}
          </button>
          {(slotResult.paper || slotResult.answers || []).map((result, index) => {
            const question = questionsById.get(result.questionId);
            const answer = {
              ...question,
              ...result,
              options: result.options ?? question?.options,
              chosenIndex: result.chosen ?? result.chosenIndex,
              correctIndex: result.correctPos ?? result.correctIndex,
            };
            const correctnessAvailable = typeof answer.correct === "boolean";
            return (
              <article className={`ws-quiz-answer ${!correctnessAvailable ? "is-pending" : answer.correct ? "is-correct" : "is-wrong"}`} key={answer.questionId || answer.pos || index}>
                <strong>
                  {index + 1}. {answer.stem}
                </strong>
                <p className="ws-quiz-answer-status">
                  {correctnessAvailable ? (answer.correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />) : <Clock3 size={18} aria-hidden="true" />}
                  {correctnessAvailable ? (answer.correct ? "Trả lời đúng" : "Trả lời sai") : "Đã ghi nhận câu trả lời"}
                </p>
                <div className="ws-quiz-answer-choice">
                  <span>{family ? "Trẻ" : "Học sinh"} đã chọn</span>
                  <strong>
                    {Number.isInteger(answer.chosenIndex) && answer.chosenIndex >= 0
                      ? `${String.fromCharCode(65 + answer.chosenIndex)}. ${answer.options?.[answer.chosenIndex] ?? "Không có nội dung đáp án"}`
                      : "Chưa trả lời"}
                  </strong>
                </div>
                {correctnessAvailable && !answer.correct && Number.isInteger(answer.correctIndex) && answer.correctIndex >= 0 && answer.options?.[answer.correctIndex] != null && (
                  <div className="ws-quiz-answer-solution">
                    <span>Đáp án đúng</span>
                    <strong>{String.fromCharCode(65 + answer.correctIndex)}. {answer.options[answer.correctIndex]}</strong>
                  </div>
                )}
              </article>
            );
          })}
          {!(slotResult.paper || slotResult.answers || []).length && <Empty>Chưa có nội dung bài làm để hiển thị.</Empty>}
        </section>
      )}
    </Modal>
  );
}
