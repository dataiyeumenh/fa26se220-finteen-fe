import { Copy, Pencil, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import QuestionFileImport from "@/components/public/QuestionFileImport.jsx";
import { teacherQuizApi } from "../api/teacherQuizApi";
import { Empty, Modal, Notice } from "@/features/workspace/ui";

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
    detail: [reference.page && `trang ${reference.page}`, reference.location, reference.accessedOn && `truy cập ${reference.accessedOn}`].filter(Boolean).join(" · "),
  };
};

export default function MyQuestionBank({ shared = false }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState(null);
  const [importing, setImporting] = useState(false);

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
      setEditor(null); setNotice("Đã lưu câu hỏi vào Câu của tôi."); await load();
    } catch (value) { setError(errorText(value)); }
  };

  return <section className="ws-card ws-question-bank-v3">
    <header className="ws-bank-head">
      <div><span className="ws-pill">{shared ? "Kho dùng chung" : "Kho riêng"}</span><h2>{shared ? "Kho câu hỏi chung" : "Câu của tôi"}</h2>
      <p>{shared ? "Xem nguồn tham khảo hoặc sao chép một câu trước khi chỉnh sửa." : "Tạo, nhập và chỉnh sửa câu hỏi riêng; không ảnh hưởng kho chung."}</p></div>
      <div className="ws-actions"><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/>Làm mới</button>
      {!shared && <><button className="ws-btn" onClick={() => setImporting(true)}><Upload size={16}/>Nhập tệp</button><button className="ws-btn primary" onClick={() => setEditor(blank())}><Plus size={16}/>Thêm câu</button></>}</div>
    </header>
    <Notice text={error || notice}/>
    {loading ? <Empty>Đang tải câu hỏi…</Empty> : rows.length ? <div className="ws-bank-list">{rows.map((q, index) => <article key={q.id || index}>
      <div><small>Câu {index + 1}</small><h3>{q.stem}</h3><ol type="A">{q.options?.map((option, i) => <li className={i === q.correctIndex ? "correct" : ""} key={i}>{option}</li>)}</ol>
      {shared && <QuestionReference value={q.reference}/>}</div>
      <div className="ws-actions">{shared ? <button className="ws-btn" onClick={async () => { try { await teacherQuizApi.copyQuestion(q.id); setNotice("Đã sao chép vào Câu của tôi."); } catch (e) { setError(errorText(e)); } }}><Copy size={15}/>Sao chép để sửa</button> : <><button className="ws-btn" onClick={() => setEditor({...q, options:[...q.options]})}><Pencil size={15}/>Sửa</button><button className="ws-btn danger" onClick={async () => { if (!confirm("Xóa câu hỏi này?")) return; try { await teacherQuizApi.deleteMyQuestion(q.id); await load(); } catch(e) { setError(errorText(e)); } }}><Trash2 size={15}/>Xóa</button></>}</div>
    </article>)}</div> : <Empty>Chưa có câu hỏi.</Empty>}
    {editor && <QuestionEditor value={editor} onClose={() => setEditor(null)} onSave={save}/>} 
    {importing && <ImportQuestions onClose={() => setImporting(false)} onSaved={async () => { setImporting(false); setNotice("Đã nhập câu hỏi vào kho riêng."); await load(); }}/>} 
  </section>;
}

function QuestionReference({ value }) {
  const reference = normalizeReference(value);
  if (!reference) return <p className="ws-question-reference">Nguồn: Chưa cập nhật</p>;
  return <p className="ws-question-reference">Nguồn: {reference.url ? <a href={reference.url} target="_blank" rel="noreferrer">{reference.title}</a> : reference.title}{reference.detail ? ` · ${reference.detail}` : ""}</p>;
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
  return <Modal title="Nhập câu hỏi từ tệp" onClose={onClose}><p>Tải danh sách câu hỏi lên, kiểm tra lại nội dung rồi lưu vào “Câu của tôi”.</p><QuestionFileImport questions={questions} onChange={setQuestions}/><Notice text={error}/>{questions.length>0&&<button className="ws-btn primary" onClick={async()=>{try{await teacherQuizApi.createMyQuestions(questions.map(({stem,options,correctIndex})=>({stem,options,correctIndex})));await onSaved();}catch(e){setError(errorText(e));}}}>Lưu {questions.length} câu vào Câu của tôi</button>}</Modal>;
}
