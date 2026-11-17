// UTF-8 BOM lets Excel detect Vietnamese correctly; CRLF is Excel's CSV newline.
export const QUIZ_CSV_TEMPLATE = '\uFEFFCâu hỏi,Đáp án A,Đáp án B,Đáp án C,Đáp án D,Đáp án đúng\r\nTiền tiết kiệm dùng để làm gì?,A. Dự phòng cho tình huống cần thiết,B. Mua mọi thứ ngay lập tức,C. Bỏ đi không sử dụng,D. Cho người khác vay hết,A\r\nKhi có người lạ xin mã OTP em nên làm gì?,A. Gửi mã ngay cho người đó,B. Không chia sẻ mã OTP,C. Đăng mã lên mạng xã hội,D. Hỏi người lạ cách sử dụng,B\r\n';
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
    const columnNames = {
      "Câu hỏi": "stem",
      "Lựa chọn A": "A", "Đáp án A": "A",
      "Lựa chọn B": "B", "Đáp án B": "B",
      "Lựa chọn C": "C", "Đáp án C": "C",
      "Lựa chọn D": "D", "Đáp án D": "D",
      "Đáp án đúng": "answer",
    };
    const headers = table.shift().map((s) => columnNames[s.trim()] || s.trim());
    if (["stem", "A", "B"].some((h) => !headers.includes(h)) || (!headers.includes("answer") && !headers.includes("correctIndex")))
      throw new Error("Hãy dùng file mẫu có ít nhất các cột Câu hỏi, Đáp án A, Đáp án B và Đáp án đúng.");
    rows = table.filter((r) => r.some((v) => v.trim())).map((r) => {
      const obj = Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]));
      const answer = String(obj.answer || "").trim().toUpperCase();
      const options = [obj.A, obj.B, obj.C, obj.D]
        .map((value, index) => String(value || "").trim().replace(new RegExp(`^${"ABCD"[index]}\\s*[.):-]\\s*`, "i"), ""))
        .filter(Boolean);
      return { stem: obj.stem, options, correctIndex: headers.includes("answer") ? (answer.length === 1 ? "ABCD".indexOf(answer) : -1) : obj.correctIndex === "" ? null : Number(obj.correctIndex) };
    });
  } else throw new Error("Chỉ hỗ trợ file .json hoặc .csv.");
  if (!Array.isArray(rows) || !rows.length || rows.length > 100)
    throw new Error("File cần từ 1 đến 100 câu hỏi.");
  return rows.map((q, i) => {
    const stem = String(q?.stem ?? q?.text ?? "").trim();
    const options = Array.isArray(q?.options) ? q.options.map((v) => typeof v === "string" ? v.trim() : "") : [];
    if (!stem || stem.length > 500 || options.length < 2 || options.length > 4 || options.some((v) => !v || v.length > 200) || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= options.length)
      throw new Error(`Câu ${i + 1}: hãy điền nội dung, từ 2 đến 4 lựa chọn và một đáp án đúng hợp lệ.`);
    return { stem, options, correctIndex: q.correctIndex };
  });
}
