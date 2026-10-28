export const INTERNAL_ROLES = {
  ADMIN: "Quản trị hệ thống và Content Studio.",
  GAME_EDITOR: "Soạn nháp chương và gửi duyệt trong Studio.",
  GAME_REVIEWER: "Chơi thử nháp, đánh giá Đạt / Trả về trong Studio.",
  GAME_MANAGER: "Phát hành, thu hồi và đổi bản đang chạy trong Studio.",
};

export const hasInternalAccess = (actor) =>
  Object.keys(INTERNAL_ROLES).some((role) => actor?.roles?.includes(role));
export const accountDestination = (actor) =>
  hasInternalAccess(actor)
    ? "/internal"
    : actor?.role === "kid"
      ? "/dashboard/kid"
      : "/dashboard";
