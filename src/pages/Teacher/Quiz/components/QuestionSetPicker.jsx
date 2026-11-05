import { useMemo, useState } from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import { Empty, Notice } from "@/features/workspace/ui";
import { groupQuestionSets, toggleQuestionSet } from "../questionSets.js";
import QuestionSetPreview from "./QuestionSetPreview.jsx";

export default function QuestionSetPicker({ questions, selected, onChange, loading, error }) {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(null);
  const sets = useMemo(() => groupQuestionSets(questions), [questions]);
  const visible = sets.filter((set) => set.code.toLowerCase().includes(query.trim().toLowerCase()));
  const knownIds = new Set(questions.map((question) => question.id));
  const missingCount = [...selected].filter((id) => !knownIds.has(id)).length;
  const selectedSetCount = sets.filter((set) => set.questions.every((question) => selected.has(question.id))).length;

  const toggle = (set) => onChange(toggleQuestionSet(selected, set.questions));

  return (
    <fieldset className="ws-question-sets">
      <legend>Chọn bộ câu hỏi</legend>
      <p className="ws-question-sets__intro">Chọn theo mã để thêm toàn bộ câu hỏi của bộ vào đề. Có thể kết hợp nhiều bộ câu hỏi.</p>
      <div className="ws-question-sets__toolbar">
        <label>
          Tìm mã bộ câu hỏi
          <input type="search" placeholder="Ví dụ: FDIC, PISA, CFPB, OECD" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="ws-btn" disabled={!selected.size} onClick={() => onChange(new Set())}>Bỏ chọn tất cả</button>
      </div>
      <p className="ws-question-sets__status" role="status">Đã chọn {selectedSetCount} bộ đầy đủ · {selected.size} câu hỏi</p>
      <Notice text={error} />
      {loading ? <Empty>Đang tải các bộ câu hỏi…</Empty> : error ? null : (
        <>
          {missingCount > 0 && <p>Có {missingCount} câu trong đề cũ không có trong kho hiện tại. Các câu này vẫn được giữ; dùng “Bỏ chọn tất cả” nếu muốn chọn lại đề.</p>}
          {visible.length ? <div className="ws-question-sets__list">
            {visible.map((set) => {
              const count = set.questions.filter((question) => selected.has(question.id)).length;
              const checked = count === set.questions.length;
              const partial = count > 0 && !checked;
              return (
                <article className={`ws-question-set${count ? " is-selected" : ""}`} key={set.code}>
                  <label className="ws-question-set__choice">
                    <input type="checkbox" checked={checked} ref={(node) => { if (node) node.indeterminate = partial; }} onChange={() => toggle(set)} />
                    <span>
                      <strong>{set.code}</strong>
                      <span>{set.questions.length} câu hỏi{partial ? ` · Đã chọn ${count}/${set.questions.length} câu trong đề cũ` : checked ? " · Đã chọn cả bộ" : " · Chọn toàn bộ"}</span>
                    </span>
                  </label>
                  {count > 0 && <button className="ws-btn compact" type="button" onClick={() => { const next = new Set(selected); set.questions.forEach((question) => next.delete(question.id)); onChange(next); }}>Bỏ chọn bộ {set.code}</button>}
                  <button type="button" className="ws-question-set__preview" aria-haspopup="dialog" aria-label={`Xem nội dung bộ ${set.code}, ${set.questions.length} câu hỏi`} onClick={() => setPreview(set)}>
                    <Eye size={17} aria-hidden="true" />
                    Xem nội dung
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div> : <Empty>{sets.length ? "Không tìm thấy bộ phù hợp với mã bạn nhập." : "Kho câu hỏi chưa có bộ nào để chọn."}</Empty>}
        </>
      )}
      {preview && <QuestionSetPreview key={preview.code} set={preview} onClose={() => setPreview(null)} />}
    </fieldset>
  );
}
