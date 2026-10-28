export function reportRows(
  db,
  ownerId,
  { learnerId = "", groupId = "", status = "", from = "", to = "" } = {},
) {
  const ids = groupId
    ? db.groups.find((g) => g.id === groupId && g.ownerId === ownerId)
        ?.learnerIds || []
    : null;
  const learners = db.learners.filter(
    (l) =>
      l.ownerId === ownerId &&
      (!learnerId || l.id === learnerId) &&
      (!status || l.status === status) &&
      (!ids || ids.includes(l.id)),
  );
  return learners.map((l) => {
    const results = db.submissions.filter(
      (s) =>
        s.ownerId === ownerId &&
        s.learnerId === l.id &&
        (!from || localDate(s.submittedAt) >= from) &&
        (!to || localDate(s.submittedAt) <= to),
    );
    return {
      id: l.id,
      name: l.name,
      code: l.code,
      status: l.status,
      createdAt: l.createdAt,
      revokedAt: l.revokedAt || null,
      quizSubmitted: results.length,
      averagePercent: results.length
        ? Math.round(
            results.reduce((sum, s) => sum + (s.correct / s.total) * 100, 0) /
              results.length,
          )
        : null,
      results: results.map(({ title, correct, total, submittedAt }) => ({
        title,
        correct,
        total,
        submittedAt,
      })),
      progress: l.progress || [],
      accountHistory: db.events
        .filter((e) => e.ownerId === ownerId && e.learnerId === l.id)
        .map(({ type, detail, at }) => ({ type, detail, at })),
    };
  });
}
function localDate(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// Escape spreadsheet formulas as well as RFC 4180 quotes/newlines.
export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

const CSV_SEPARATOR = "\t";
const utf16Le = (text) => {
  const bytes = new Uint8Array(2 + text.length * 2);
  bytes[0] = 0xff;
  bytes[1] = 0xfe;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    bytes[2 + index * 2] = code & 0xff;
    bytes[3 + index * 2] = code >> 8;
  }
  return bytes;
};
const excelCsv = (data) =>
  utf16Le(
    `${data.map((row) => row.map(csvCell).join(CSV_SEPARATOR)).join("\r\n")}`,
  );

const csvDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(value))
    : "";

const csvStatus = (status) =>
  ({
    active: "Hoạt động",
    revoked: "Đã thu hồi",
    ACTIVE: "Hoạt động",
    ARCHIVED: "Đã thu hồi",
    WIPED: "Đã xoá",
  })[status] ||
  status ||
  "";

export function reportCsv(rows) {
  const data = [
    [
      "Học sinh",
      "Mã đăng nhập",
      "Trạng thái",
      "Quiz đã nộp",
      "Trung bình (%)",
      "Bài kiểm tra",
      "Số câu đúng",
      "Tổng câu",
      "Ngày nộp",
    ],
  ];
  rows.forEach((r) =>
    (r.results.length ? r.results : [{}]).forEach((s) =>
      data.push([
        r.name,
        r.code,
        csvStatus(r.status),
        r.quizSubmitted,
        r.averagePercent ?? "",
        s.title || "",
        s.correct ?? "",
        s.total ?? "",
        csvDateTime(s.submittedAt),
      ]),
    ),
  );
  return excelCsv(data);
}
export function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function groupReportCsv(rows) {
  const data = [
    [
      "Học sinh",
      "Mã đăng nhập",
      "Trạng thái",
      "Chương đã hoàn thành",
      "Lần chơi",
      "Hoạt động gần nhất",
      "Tài sản",
      "Tiết kiệm",
      "Hạnh phúc",
      "Rủi ro",
      "Mục tiêu",
      "Quiz đã giao",
      "Quiz đã nộp",
      "Điểm trung bình",
    ],
  ];
  rows.forEach((row) =>
    data.push([
      row.displayName || "Đã xoá",
      row.code || "",
      csvStatus(row.status),
      row.completedChapters ?? 0,
      row.attemptIndex ?? 1,
      csvDateTime(row.lastActiveAt),
      row.indicators?.wealth ?? "",
      row.indicators?.saving ?? "",
      row.indicators?.happiness ?? "",
      row.indicators?.risk ?? "",
      row.indicators?.goal ?? "",
      row.quizAssigned ?? 0,
      row.quizSubmitted ?? 0,
      row.averageScore ?? "",
    ]),
  );
  return excelCsv(data);
}
