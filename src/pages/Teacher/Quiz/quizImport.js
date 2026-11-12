// File import has no backend endpoint yet. These records are browser-only mocks.
export const MOCK_QUIZ_PREFIX = "mock-import-";
// UTF-8 BOM lets Excel detect Vietnamese correctly; CRLF is Excel's CSV newline.
export const QUIZ_CSV_TEMPLATE = '\uFEFFCâu hỏi,Lựa chọn A,Lựa chọn B,Lựa chọn C,Lựa chọn D,Đáp án đúng\r\nTiền tiết kiệm dùng để làm gì?,Dự phòng,Mua mọi thứ,Bỏ đi,Cho vay hết,A\r\nKhi có người lạ xin mã OTP em nên làm gì?,Gửi ngay,Không chia sẻ mã OTP,Đăng lên mạng,Hỏi người lạ,B\r\n';
export function parseQuizFile(text, filename) {
  let rows;
  if (/\.json$/i.test(filename)) {
    let value;
    try {
      value = JSON.parse(text.replace(/^\uFEFF/, ""));
    } catch {
      throw new Error("Tệp JSON chưa hợp lệ. Vui lòng kiểm tra dấu ngoặc, dấu nháy và dấu phẩy.");
    }
    rows = Array.isArray(value) ? value : value?.questions;
  } else if (/\.csv$/i.test(filename)) {
    const table = [];
    let row = [], cell = "", quoted = false;
    const input = text.replace(/^\uFEFF/, "");
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      if (c === '"') {
        if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
        else if (quoted || !cell) quoted = !quoted;
        else throw new Error("CSV có dấu nháy không hợp lệ.");
      } else if (!quoted && (c === "," || c === "\n")) {
        row.push(cell.replace(/\r$/, "")); cell = "";
        if (c === "\n") { table.push(row); row = []; }
      } else cell += c;
    }
    if (quoted) throw new Error("CSV chưa đóng dấu nháy.");
    row.push(cell.replace(/\r$/, "")); table.push(row);
    const columnNames = { "Câu hỏi": "stem", "Lựa chọn A": "A", "Lựa chọn B": "B", "Lựa chọn C": "C", "Lựa chọn D": "D", "Đáp án đúng": "answer" };
    const headers = table.shift().map((s) => columnNames[s.trim()] || s.trim());
    if (["stem", "A", "B", "C", "D"].some((h) => !headers.includes(h)) || (!headers.includes("answer") && !headers.includes("correctIndex")))
      throw new Error("Hãy dùng file mẫu có các cột Câu hỏi, Lựa chọn A, Lựa chọn B, Lựa chọn C, Lựa chọn D, Đáp án đúng.");
    rows = table.filter((r) => r.some((v) => v.trim())).map((r) => {
      const obj = Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]));
      const answer = String(obj.answer || "").trim().toUpperCase();
      return { stem: obj.stem, options: [obj.A, obj.B, obj.C, obj.D], correctIndex: headers.includes("answer") ? (answer.length === 1 ? "ABCD".indexOf(answer) : -1) : obj.correctIndex === "" ? null : Number(obj.correctIndex) };
    });
  } else throw new Error("Chỉ hỗ trợ file .json hoặc .csv.");
  if (!Array.isArray(rows) || !rows.length || rows.length > 100)
    throw new Error("File cần từ 1 đến 100 câu hỏi.");
  return rows.map((q, i) => {
    const stem = String(q?.stem ?? q?.text ?? "").trim();
    const options = Array.isArray(q?.options) ? q.options.map((v) => typeof v === "string" ? v.trim() : "") : [];
    if (!stem || options?.length !== 4 || options.some((v) => !v) || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3)
      throw new Error(`Câu ${i + 1}: hãy điền nội dung, đủ 4 lựa chọn và đáp án đúng A, B, C hoặc D (JSON: correctIndex từ 0 đến 3).`);
    return { id: `question-${i + 1}`, stem, options, correctIndex: q.correctIndex };
  });
}

export function createMockQuizApi(storage, accountId) {
  const key = () => `finteen:mock-quiz-import:v1:${accountId()}`;
  const read = () => JSON.parse(storage.getItem(key()) || "[]");
  const write = (rows) => storage.setItem(key(), JSON.stringify(rows));
  const get = (id) => {
    const quiz = read().find((q) => q.id === id);
    if (!quiz) throw new Error("Không tìm thấy đề mô phỏng trên trình duyệt này.");
    return quiz;
  };
  return {
    list: (groupId) => read().filter((q) => q.groupId === groupId),
    get: (id) => { const quiz = get(id); return { quiz, questions: quiz.questions }; },
    create: ({ groupId, title, dueAt, questions }) => {
      if (!accountId() || !groupId || !title.trim()) throw new Error("Hãy chọn lớp và nhập tên đề.");
      const quiz = { id: MOCK_QUIZ_PREFIX + crypto.randomUUID(), groupId, title: title.trim(), dueAt, questions, questionCount: questions.length, kind: "TEACHER", source: "mock", submittedCount: 0 };
      write([...read(), quiz]); return quiz;
    },
    delete: (id) => { get(id); write(read().filter((q) => q.id !== id)); },
  };
}
