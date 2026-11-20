import { useMemo, useState } from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import { Empty, Notice } from "@/features/workspace/ui";
import { groupQuestionSets, toggleQuestionSet } from "../questionSets.js";
import QuestionSetPreview from "./QuestionSetPreview.jsx";

export default function QuestionSetPicker({ questions, selected, onChange, loading, error, source = "shared" }) {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(null);
  const sets = useMemo(() => source === "mine" && questions.length ? [{ code: "KHO CÂU HỎI RIÊNG", questions }] : groupQuestionSets(questions), [questions, source]);
  const term = query.trim().toLocaleLowerCase("vi-VN");
  const visible = source === "mine"
    ? sets.map((set) => ({ ...set, questions: set.questions.filter((question) => `${question.stem || ""} ${question.externalId || ""}`.toLocaleLowerCase("vi-VN").includes(term)) })).filter((set) => set.questions.length)
    : sets.filter((set) => set.code.toLowerCase().includes(term));
  const knownIds = new Set(questions.map((question) => question.id));
  const missingCount = [...selected].filter((id) => !knownIds.has(id)).length;
  const selectedSetCount = sets.filter((set) => set.questions.every((question) => selected.has(question.id))).length;
  const sourceIds = new Set(questions.map((question) => question.id));
  const selectedSourceCount = questions.filter((question) => selected.has(question.id)).length;

  const toggle = (set) => onChange(toggleQuestionSet(selected, set.questions));

  return (
    <fieldset className="ws-question-sets">
      <legend>{source === "mine" ? "Chọn từ Kho câu hỏi riêng" : "Chọn câu hỏi từ kho chung"}</legend>
      <p className="ws-question-sets__intro">{source === "mine" ? "Chọn những câu thầy cô đã tự tạo hoặc nhập trước đó." : "Thầy cô có thể chọn nhanh cả bộ hoặc mở bộ để tích từng câu phù hợp với đề."}</p>
      <div className="ws-question-sets__toolbar">
        <label>
          {source === "mine" ? "Tìm trong câu hỏi riêng" : "Tìm mã bộ câu hỏi"}
          <input type="search" placeholder={source === "mine" ? "Nhập nội dung câu hỏi cần tìm" : "Ví dụ: FDIC, PISA, CFPB, OECD"} value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="ws-btn" disabled={!selectedSourceCount} onClick={() => { const next = new Set([...selected].filter((id) => !sourceIds.has(id))); onChange(next); }}>Bỏ chọn trong kho này</button>
      </div>
      <p className="ws-question-sets__status" role="status">Kho này: đã chọn {selectedSourceCount}/{questions.length} câu · Tổng cả đề: {selected.size} câu{selectedSetCount ? ` · ${selectedSetCount} bộ được chọn đầy đủ` : ""}</p>
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
                      <span>{set.questions.length} câu hỏi{partial ? ` · Đã chọn ${count}/${set.questions.length} câu` : checked ? " · Đã chọn cả bộ" : " · Có thể chọn từng câu"}</span>
                    </span>
                  </label>
                  {count > 0 && <button className="ws-btn compact" type="button" onClick={() => { const next = new Set(selected); set.questions.forEach((question) => next.delete(question.id)); onChange(next); }}>Bỏ chọn bộ {set.code}</button>}
                  <button type="button" className="ws-question-set__preview" aria-haspopup="dialog" aria-label={`Xem nội dung bộ ${set.code}, ${set.questions.length} câu hỏi`} onClick={() => setPreview(set)}>
                    <Eye size={17} aria-hidden="true" />
                    Chọn từng câu
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div> : <Empty>{sets.length ? "Không tìm thấy câu hỏi phù hợp." : source === "mine" ? "Thầy cô chưa có câu hỏi riêng. Hãy tạo ở tab Kho câu hỏi riêng hoặc nhập câu mới bên trên." : "Kho câu hỏi chưa có bộ nào để chọn."}</Empty>}
        </>
      )}
      {preview && <QuestionSetPreview key={preview.code} set={preview} selected={selected} onChange={onChange} onClose={() => setPreview(null)} />}
    </fieldset>
  );
}
