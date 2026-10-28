import { canEdit, canManage, canWriteLibrary } from "./permissions.js";

// Mô tả viết cho người soạn nội dung: màn này để làm gì, bằng lời thường.
export function getStudioMenu(actor) {
  const roles = actor?.roles || [];
  if (
    !roles.some((role) =>
      ["ADMIN", "GAME_EDITOR", "GAME_REVIEWER", "GAME_MANAGER"].includes(role),
    )
  )
    return [];
  const edit = canEdit(actor);
  const manage = canManage(actor);
  const review = roles.includes("ADMIN") || roles.includes("GAME_REVIEWER");
  const writeLibrary = canWriteLibrary(actor);
  const items = [
    ...(review
      ? [
          {
            path: "/internal/reviews",
            title: "Chờ duyệt",
            icon: "review",
            description:
              "Chương người khác gửi lên. Chơi thử, rồi chấm Đạt hoặc Trả về kèm góp ý cho người soạn.",
          },
        ]
      : []),
    {
      path: "/internal/chapters",
      title: edit ? "Chương" : "Chương (xem)",
      icon: "chapter",
      description: edit
        ? "Soạn, duyệt và theo dõi các chương trong game."
        : "Xem các chương và trạng thái phát hành.",
    },
    ...(manage
      ? [
          {
            path: "/internal/releases",
            title: "Phát hành",
            icon: "release",
            description:
              "Đưa các chương đã duyệt vào game. Số bản do hệ thống tự tính.",
          },
        ]
      : []),
    ...(manage || review
      ? [
          {
            path: "/internal/history",
            title: "Lịch sử bản",
            icon: "history",
            description: manage
              ? "Các bản đã phát hành. Chọn bản game đang dùng, hoặc thu hồi bản có lỗi."
              : "Các bản đã phát hành và bản nào đang chạy trong game.",
          },
        ]
      : []),
    {
      path: "/internal/assets",
      title: writeLibrary ? "Kho ảnh" : "Kho ảnh (xem)",
      icon: "asset",
      group: "library",
      description: writeLibrary
        ? "Ảnh dùng trong các chương. Tải ảnh mới, đặt tên dễ nhớ, xoá ảnh không còn dùng."
        : "Ảnh dùng trong các chương. Bạn xem và sao chép mã ảnh, không tải lên hay xoá.",
    },
    {
      path: "/internal/questions",
      title: writeLibrary ? "Kho câu hỏi" : "Kho câu hỏi (xem)",
      icon: "question",
      group: "library",
      description: writeLibrary
        ? "Câu hỏi trắc nghiệm cho bài kiểm tra. Thêm, sửa, ngừng dùng hoặc khôi phục câu hỏi."
        : "Câu hỏi trắc nghiệm cho bài kiểm tra. Bạn xem câu hỏi và đáp án, không sửa.",
    },
  ];
  const order =
    manage && !edit && !review
      ? ["release", "history", "chapter", "asset", "question"]
      : ["review", "chapter", "release", "history", "asset", "question"];
  return items.sort((a, b) => order.indexOf(a.icon) - order.indexOf(b.icon));
}
