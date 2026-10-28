import { useCallback, useState } from "react";
import {
  Archive,
  Check,
  CircleHelp,
  LibraryBig,
  Plus,
  Search,
  X,
} from "lucide-react";
import { auth } from "../../api/auth.api";
import { canWriteLibrary } from "./permissions";
import { studioApi } from "./studioClient";
import { useStudioAction, useStudioResource } from "./useStudioResource";
import {
  Btn,
  ConfirmDialog,
  PageHeader,
  StateBox,
  StudioDialog,
  Tag,
} from "./ui";
import Pagination from "./Pagination";

const LETTERS = "ABCDEFGH";
const MORE_FIELDS = {
  standard: ["Chuẩn kiến thức", "Ví dụ CEE-V"],
  concept: ["Khái niệm", "Ví dụ D04.03"],
  source: ["Nguồn", "Câu lấy từ đâu"],
  license: ["Giấy phép", "Ví dụ FinTeen team, 2026"],
  externalId: ["Mã câu hỏi", "Để trống thì hệ thống tự đặt"],
  replacesId: [
    "Thay cho câu nào",
    "Mã câu cũ, nếu câu này thay câu đã dùng trong đề",
  ],
};

function QuestionForm({ question, notify, onClose, onSaved }) {
  const [options, setOptions] = useState(question?.options || ["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(question?.correctIndex || 0);
  const { busy, run, error } = useStudioAction(notify);
  const remove = (index) => {
    setOptions((values) => values.filter((_, i) => i !== index));
    setCorrectIndex((value) =>
      value === index ? 0 : value > index ? value - 1 : value,
    );
  };
  return (
    <StudioDialog
      title={question ? "Sửa câu hỏi" : "Thêm câu hỏi"}
      onClose={onClose}
      busy={busy}
      wide
    >
      <form
        className="sp-dialog-body"
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          const body = Object.fromEntries(
            ["pool", ...Object.keys(MORE_FIELDS)].map((key) => [
              key,
              String(values.get(key) || "").trim() || null,
            ]),
          );
          body.chapter = values.get("chapter")
            ? Number(values.get("chapter"))
            : null;
          body.stem = String(values.get("stem")).trim();
          body.options = options.map((option) => option.trim());
          body.correctIndex = correctIndex;
          if (
            !body.stem ||
            body.options.length < 2 ||
            body.options.some((option) => !option)
          )
            return notify("Nhập câu hỏi và ít nhất hai lựa chọn có nội dung.");
          void run(
            () =>
              question?.id
                ? studioApi.put(
                    `/api/studio/questions/${encodeURIComponent(question.id)}`,
                    body,
                  )
                : studioApi.post("/api/studio/questions", body),
            "Đã lưu câu hỏi.",
            onSaved,
          );
        }}
      >
        <fieldset disabled={busy} className="sp-dialog-body">
          <label className="sp-field">
            Nội dung câu hỏi
            <textarea
              name="stem"
              className="sp-input"
              rows={3}
              required
              defaultValue={question?.stem || ""}
            />
          </label>
          <fieldset className="sp-choices">
            <legend>Các lựa chọn (đánh dấu đáp án đúng)</legend>
            {options.map((option, index) => (
              <div className="sp-option-row" key={index}>
                <label>
                  <input
                    type="radio"
                    name="correct"
                    aria-label={`Đáp án đúng là lựa chọn ${index + 1}`}
                    checked={correctIndex === index}
                    onChange={() => setCorrectIndex(index)}
                  />
                  Đúng
                </label>
                <b aria-hidden="true">{LETTERS[index]}.</b>
                <input
                  className="sp-input"
                  aria-label={`Nội dung lựa chọn ${index + 1}`}
                  value={option}
                  required
                  onChange={(event) =>
                    setOptions((values) =>
                      values.map((value, i) =>
                        i === index ? event.target.value : value,
                      ),
                    )
                  }
                />
                <Btn
                  tone="quiet"
                  aria-label={`Bỏ lựa chọn ${index + 1}`}
                  title="Bỏ lựa chọn này"
                  disabled={options.length <= 2}
                  onClick={() => remove(index)}
                >
                  <X size={16} aria-hidden="true" />
                </Btn>
              </div>
            ))}
            <div>
              <Btn
                tone="quiet"
                disabled={options.length >= 8}
                onClick={() => setOptions((values) => [...values, ""])}
              >
                <Plus size={16} aria-hidden="true" />
                Thêm lựa chọn
              </Btn>
            </div>
          </fieldset>
          <div className="sp-grid-2">
            <label className="sp-field">
              Chương<small>Để trống nếu là câu dùng chung.</small>
              <input
                className="sp-input"
                name="chapter"
                type="number"
                min={1}
                step={1}
                defaultValue={question?.chapter ?? ""}
              />
            </label>
            <label className="sp-field">
              Kho<small>Nhóm câu hỏi, ví dụ CEE hoặc FINTEEN_POST.</small>
              <input
                className="sp-input"
                name="pool"
                required
                defaultValue={question?.pool ?? "CEE"}
              />
            </label>
          </div>
          <details className="sp-more" open={Boolean(question?.replacesId)}>
            <summary>Thông tin thêm (không bắt buộc)</summary>
            <div className="sp-grid-2">
              {Object.entries(MORE_FIELDS).map(([key, [label, hint]]) => (
                <label className="sp-field" key={key}>
                  {label}
                  <small>{hint}</small>
                  <input
                    className="sp-input"
                    name={key}
                    defaultValue={question?.[key] ?? ""}
                  />
                </label>
              ))}
            </div>
          </details>
          <p className="sp-hint">
            Câu đã nằm trong đề đã phát thì không đổi được chữ, lựa chọn hay đáp
            án. Khi cần, thêm câu mới và ghi mã câu cũ ở "Thay cho câu nào".
          </p>
          {error && (
            <div className="sp-inline-error" role="alert">
              {error}
            </div>
          )}
          <div className="sp-dialog-actions">
            <Btn onClick={onClose}>Huỷ</Btn>
            <Btn type="submit" tone="primary">
              {busy ? "Đang lưu…" : "Lưu câu hỏi"}
            </Btn>
          </div>
        </fieldset>
      </form>
    </StudioDialog>
  );
}

export default function QuestionsPage({
  notify,
  title = "Kho câu hỏi",
  intro,
}) {
  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(undefined);
  const [retiring, setRetiring] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const write = canWriteLibrary(auth.getSnapshot().actor);
  const loader = useCallback(() => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== ""),
    );
    return studioApi.get(`/api/studio/questions?${query}`);
  }, [filters]);
  const query = useStudioResource(loader);
  const { busy, run, error, clearError } = useStudioAction(notify);
  const rows = query.data || [];
  const activeCount = rows.filter((question) => !question.retiredAt).length;
  const poolCount = new Set(
    rows.map((question) => question.pool).filter(Boolean),
  ).size;
  const activePage = Math.min(
    page,
    Math.max(0, Math.ceil(rows.length / size) - 1),
  );
  const filtered = Object.entries(filters).some(
    ([key, value]) => value && key !== "includeRetired",
  );
  const toggle = (question) =>
    void run(
      () =>
        studioApi.post(
          `/api/studio/questions/${encodeURIComponent(question.id)}/${question.retiredAt ? "restore" : "retire"}`,
        ),
      question.retiredAt ? "Đã khôi phục câu hỏi." : "Đã ngừng dùng câu hỏi.",
      () => {
        setRetiring(null);
        query.reload();
      },
    );
  return (
    <>
      <PageHeader
        title={title}
        intro={intro}
        actions={
          write && (
            <Btn
              tone="primary"
              disabled={busy}
              onClick={() => setEditing(null)}
            >
              <Plus size={17} aria-hidden="true" />
              Thêm câu hỏi
            </Btn>
          )
        }
      />
      {!query.loading && !query.error && (
        <section
          className="sp-question-overview"
          aria-label="Tổng quan kho câu hỏi"
        >
          <div>
            <CircleHelp size={19} aria-hidden="true" />
            <span>
              <strong>{rows.length}</strong>Kết quả
            </span>
          </div>
          <div>
            <Check size={19} aria-hidden="true" />
            <span>
              <strong>{activeCount}</strong>Đang sử dụng
            </span>
          </div>
          <div>
            <LibraryBig size={19} aria-hidden="true" />
            <span>
              <strong>{poolCount}</strong>Nhóm câu hỏi
            </span>
          </div>
        </section>
      )}
      <form
        className="sp-question-filters"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setFilters(Object.fromEntries(new FormData(event.currentTarget)));
          setPage(0);
        }}
      >
        <label className="sp-question-search">
          <Search size={18} aria-hidden="true" />
          <input name="q" type="search" placeholder="Tìm nội dung câu hỏi…" />
        </label>
        <label className="sp-field sp-question-chapter">
          <span>Chương</span>
          <input
            className="sp-input"
            name="chapter"
            type="number"
            min={1}
            placeholder="Tất cả"
          />
        </label>
        <details className="sp-more sp-question-more">
          <summary>Lọc nâng cao</summary>
          <div className="sp-question-more-grid">
            {[
              ["pool", "Kho"],
              ["standard", "Chuẩn"],
              ["concept", "Khái niệm"],
            ].map(([key, label]) => (
              <label className="sp-field" key={key}>
                {label}
                <input className="sp-input" name={key} />
              </label>
            ))}
            <label className="sp-check">
              <input name="includeRetired" type="checkbox" value="true" />
              Hiện câu đã ngừng dùng
            </label>
          </div>
        </details>
        <Btn type="submit" tone="primary">
          Áp dụng
        </Btn>
      </form>
      {query.loading && !query.data ? (
        <StateBox kind="loading">Đang tải câu hỏi…</StateBox>
      ) : query.error ? (
        <StateBox
          kind="error"
          title="Chưa tải được kho câu hỏi"
          actions={<Btn onClick={query.reload}>Thử lại</Btn>}
        >
          {query.error}
        </StateBox>
      ) : !rows.length ? (
        <StateBox
          title={
            filtered
              ? "Không có câu hỏi khớp bộ lọc"
              : "Kho chưa có câu hỏi nào"
          }
          actions={
            write &&
            !filtered && (
              <Btn tone="primary" onClick={() => setEditing(null)}>
                Thêm câu hỏi
              </Btn>
            )
          }
        >
          {filtered
            ? "Thử từ khoá khác, hoặc xoá bớt điều kiện lọc rồi bấm Lọc."
            : "Câu hỏi thêm vào sẽ dùng được cho bài kiểm tra của giáo viên."}
        </StateBox>
      ) : (
        <>
          <div
            className="sp-question-list"
            role="region"
            aria-label="Danh sách câu hỏi"
          >
            {rows
              .slice(activePage * size, (activePage + 1) * size)
              .map((question, index) => (
                <article
                  key={question.id}
                  className={`sp-question-card${question.retiredAt ? " is-retired" : ""}`}
                >
                  <header className="sp-question-card-head">
                    <span className="sp-question-index">
                      {String(activePage * size + index + 1).padStart(2, "0")}
                    </span>
                    <p className="sp-q-stem">{question.stem}</p>
                    {question.retiredAt ? (
                      <Tag tone="REJECTED">Đã ngừng dùng</Tag>
                    ) : (
                      <Tag tone="APPROVED">Đang dùng</Tag>
                    )}
                  </header>
                  <ol className="sp-q-options">
                    {question.options?.map((option, index) => (
                      <li
                        key={index}
                        className={
                          index === question.correctIndex
                            ? "is-correct"
                            : undefined
                        }
                      >
                        <b>{LETTERS[index]}.</b>
                        {option}
                        {index === question.correctIndex && (
                          <>
                            <Check size={16} aria-hidden="true" />
                            <span className="sr-only">(đáp án đúng)</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ol>
                  <footer className="sp-question-card-foot">
                    <div className="sp-q-meta">
                      <span>#{question.externalId || question.id}</span>
                      <span>{question.pool}</span>
                      <span>
                        {question.chapter
                          ? `Chương ${question.chapter}`
                          : "Dùng chung"}
                      </span>
                      {question.standard && <span>{question.standard}</span>}
                      {question.concept && <span>{question.concept}</span>}
                    </div>
                    {write && (
                      <div className="sp-q-actions">
                        <Btn
                          disabled={busy}
                          onClick={() => setEditing(question)}
                        >
                          Chỉnh sửa
                        </Btn>
                        {question.retiredAt ? (
                          <Btn disabled={busy} onClick={() => toggle(question)}>
                            Khôi phục
                          </Btn>
                        ) : (
                          <Btn
                            tone="quiet"
                            disabled={busy}
                            onClick={() => {
                              clearError();
                              setRetiring(question);
                            }}
                          >
                            <Archive size={15} aria-hidden="true" />
                            Ngừng dùng
                          </Btn>
                        )}
                      </div>
                    )}
                  </footer>
                </article>
              ))}
          </div>
          <Pagination
            total={rows.length}
            page={activePage}
            size={size}
            sizes={[10, 20, 50]}
            onPage={setPage}
            onSize={(value) => {
              setSize(value);
              setPage(0);
            }}
            noun="câu hỏi"
          />
        </>
      )}
      {editing !== undefined && write && (
        <QuestionForm
          key={editing?.id || "new"}
          question={editing}
          notify={notify}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            query.reload();
          }}
        />
      )}
      {retiring && (
        <ConfirmDialog
          tone="danger"
          title="Ngừng dùng câu hỏi này?"
          confirmLabel="Ngừng dùng"
          busy={busy}
          error={error}
          onConfirm={() => toggle(retiring)}
          onClose={() => setRetiring(null)}
        >
          <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{retiring.stem}</p>
          <ul>
            <li>Đề mới và kho của giáo viên sẽ không thấy câu này nữa.</li>
            <li>Đề đã phát giữ nguyên.</li>
            <li>Có thể khôi phục lại bất cứ lúc nào.</li>
          </ul>
        </ConfirmDialog>
      )}
    </>
  );
}
