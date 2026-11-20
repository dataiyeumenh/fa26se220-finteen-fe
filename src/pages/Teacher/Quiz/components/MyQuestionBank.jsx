import { Copy, ExternalLink, Pencil, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import QuestionFileImport from "@/components/public/QuestionFileImport.jsx";
import { teacherQuizApi } from "../api/teacherQuizApi";
import { Empty, Modal, Notice } from "@/features/workspace/ui";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const blank = () => ({ stem: "", options: ["", ""], correctIndex: 0 });
const errorText = (error) => error?.message || "Không thể hoàn thành yêu cầu.";
const normalizeReference = (reference) => {
  if (!reference) return null;
  if (typeof reference === "string") {
    try { return normalizeReference(JSON.parse(reference)); }
    catch { return { title: reference }; }
  }
  if (typeof reference !== "object") return { title: String(reference) };
  return {
    title: reference.title || reference.standardFromSource || "Nguồn tham khảo",
    url: typeof reference.url === "string" ? reference.url : "",
    page: reference.page,
    location: reference.location,
  };
};

export default function MyQuestionBank({ shared = false }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState(null);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const value = await (shared ? teacherQuizApi.listQuestions() : teacherQuizApi.listMyQuestions());
      const items = Array.isArray(value) ? value : value?.items;
      setRows(Array.isArray(items) ? items : []);
    } catch (value) { setError(errorText(value)); }
    finally { setLoading(false); }
  }, [shared]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const save = async (question) => {
    setError("");
    try {
      if (question.id) await teacherQuizApi.updateMyQuestion(question.id, question);
      else await teacherQuizApi.createMyQuestions([question]);
      setEditor(null); setNotice("Đã lưu câu hỏi vào Kho câu hỏi riêng."); await load();
    } catch (value) { setError(errorText(value)); }
  };

  return <section className="ws-card ws-question-bank-v3">
    <header className="ws-bank-head">
      <div><span className="ws-pill">{shared ? "Kho dùng chung" : "Kho riêng"}</span><h2>{shared ? "Kho câu hỏi chung" : "Kho câu hỏi riêng"}</h2>
      <p>{shared ? "Thêm câu hỏi vào kho riêng để chỉnh sửa và sử dụng trong đề của bạn." : "Tạo, nhập và chỉnh sửa câu hỏi riêng; không ảnh hưởng kho chung."}</p></div>
      <div className="ws-actions"><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/>Làm mới</button>
      {!shared && <><button className="ws-btn" onClick={() => setImporting(true)}><Upload size={16}/>Nhập tệp</button><button className="ws-btn primary" onClick={() => setEditor(blank())}><Plus size={16}/>Thêm câu</button></>}</div>
    </header>
    <Notice text={error || notice}/>
    {loading ? <Empty>Đang tải câu hỏi…</Empty> : rows.length ? <div className="ws-bank-list">{rows.map((q, index) => <article key={q.id || index}>
      <div><small>Câu {index + 1}</small><h3>{q.stem}</h3><ol className="ws-bank-options" type="A">{q.options?.map((option, i) => <li className={i === q.correctIndex ? "correct" : ""} key={i}>
        <span className="ws-bank-option-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
        <span className="ws-bank-option-text">{option}</span>
        {i === q.correctIndex && <span className="ws-bank-option-correct">Đáp án đúng</span>}
      </li>)}</ol>
      {shared && <QuestionReference value={q.reference || q.source}/>}</div>
      <div className="ws-actions">{shared ? <button className="ws-btn" onClick={async () => { try { await teacherQuizApi.copyQuestion(q.id); setNotice("Đã thêm câu hỏi vào Kho câu hỏi riêng. Bạn có thể chỉnh sửa tại đó."); } catch (e) { setError(errorText(e)); } }}><Copy size={15}/>Thêm vào kho riêng</button> : <><button className="ws-btn" onClick={() => setEditor({...q, options:[...q.options]})}><Pencil size={15}/>Sửa</button><button className="ws-btn danger" onClick={() => setDeleting(q)}><Trash2 size={15}/>Xóa</button></>}</div>
    </article>)}</div> : <Empty>Chưa có câu hỏi.</Empty>}
    {editor && <QuestionEditor value={editor} onClose={() => setEditor(null)} onSave={save}/>} 
    {deleting && <ConfirmDialog className="ft-question-delete-confirm" title="Xóa câu hỏi này?" description="Câu hỏi sẽ bị xóa khỏi Kho câu hỏi riêng. Thao tác này không thể hoàn tác." confirmLabel="Xóa câu hỏi" busyLabel="Đang xóa…" onClose={() => setDeleting(null)} onConfirm={async () => {
      await teacherQuizApi.deleteMyQuestion(deleting.id);
      setNotice("Đã xóa câu hỏi khỏi Kho câu hỏi riêng.");
      await load();
    }}><p className="ft-confirm-preview">{deleting.stem}</p></ConfirmDialog>}
    {importing && <ImportQuestions onClose={() => setImporting(false)} onSaved={async () => { setImporting(false); setNotice("Đã nhập câu hỏi vào kho riêng."); await load(); }}/>} 
  </section>;
}

function QuestionReference({ value }) {
  const reference = normalizeReference(value);
  if (!reference) return <p className="ws-question-reference-empty">Nguồn tham khảo chưa cập nhật.</p>;
  const details = [
    ["Trang tài liệu", reference.page],
    ["Mục / câu hỏi", reference.location],
  ].filter(([, text]) => text != null && text !== "");
  const url = /^https?:\/\//i.test(reference.url || "") ? reference.url : null;
  return <aside className="ws-question-reference" aria-label="Nguồn tham khảo">
    <div className="ws-question-reference-body">
      <span className="ws-question-reference-label">Nguồn tham khảo</span>
      <div className="ws-question-reference-title">
        {url ? <a href={url} target="_blank" rel="noreferrer" aria-label={`${reference.title} (mở trong tab mới)`}>{reference.title}<ExternalLink size={13} aria-hidden="true" /></a> : reference.title}
      </div>
      {details.length > 0 && <details className="ws-question-reference-details">
        <summary>Chi tiết trích dẫn</summary>
        <dl>{details.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
      </details>}
    </div>
  </aside>;
}

function QuestionEditor({ value, onClose, onSave }) {
  const [question, setQuestion] = useState(value);
  const [error, setError] = useState("");
  const updateOption = (index, text) => setQuestion((old) => ({...old, options: old.options.map((v,i) => i === index ? text : v)}));
  return <Modal title={question.id ? "Sửa câu hỏi" : "Thêm câu hỏi"} onClose={onClose}><form className="ws-question-form" onSubmit={(e) => { e.preventDefault(); const options=question.options.map(v=>v.trim()); const normalized=options.map(v=>v.toLocaleLowerCase("vi-VN")); if(new Set(normalized).size!==normalized.length){setError("Các lựa chọn phải khác nhau. Vui lòng sửa nội dung bị trùng.");return;} setError(""); void onSave({...question, stem:question.stem.trim(), options}); }}>
    <label>Nội dung<textarea required maxLength={500} value={question.stem} onChange={(e)=>setQuestion({...question,stem:e.target.value})}/></label>
    {question.options.map((option,index)=><label key={index}>Lựa chọn {String.fromCharCode(65+index)}<span><input type="radio" name="correct" checked={question.correctIndex===index} onChange={()=>setQuestion({...question,correctIndex:index})}/><input required maxLength={200} value={option} onChange={(e)=>updateOption(index,e.target.value)}/>{question.options.length>2 && <button type="button" className="ws-btn compact" onClick={()=>setQuestion((old)=>({...old,options:old.options.filter((_,i)=>i!==index),correctIndex:old.correctIndex===index?0:Math.min(old.correctIndex,old.options.length-2)}))}>Bỏ</button>}</span></label>)}
    {question.options.length<4 && <button type="button" className="ws-btn" onClick={()=>setQuestion({...question,options:[...question.options,""]})}>+ Thêm lựa chọn</button>}
    <Notice text={error}/>
    <div className="ws-actions"><button type="button" className="ws-btn" onClick={onClose}>Hủy</button><button className="ws-btn primary">Lưu câu hỏi</button></div>
  </form></Modal>;
}

function ImportQuestions({ onClose, onSaved }) {
  const [questions,setQuestions]=useState([]); const [error,setError]=useState("");
  return <Modal title="Nhập câu hỏi từ tệp" onClose={onClose}><p>Tải danh sách câu hỏi lên, kiểm tra lại nội dung rồi lưu vào “Kho câu hỏi riêng”.</p><QuestionFileImport questions={questions} onChange={setQuestions}/><Notice text={error}/>{questions.length>0&&<button className="ws-btn primary" onClick={async()=>{try{await teacherQuizApi.createMyQuestions(questions.map(({stem,options,correctIndex})=>({stem,options,correctIndex})));await onSaved();}catch(e){setError(errorText(e));}}}>Lưu {questions.length} câu vào Kho câu hỏi riêng</button>}</Modal>;
}
