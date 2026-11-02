// Mock only: no learner assistant backend contract exists in this frontend.
export const assistantTopics = [
  { id: "saving", question: "Làm sao để bắt đầu tiết kiệm?", answer: "Bạn hãy chọn một mục tiêu nhỏ, ghi lại số tiền cần và dành một phần tiền nhận được cho mục tiêu đó. Ví dụ, dành 5.000 đồng mỗi tuần thì sau 4 tuần bạn có 20.000 đồng." },
  { id: "needs", question: "Phân biệt nhu cầu và mong muốn thế nào?", answer: "Nhu cầu là thứ cần cho cuộc sống và học tập, như bữa ăn hoặc đồ dùng học tập cần thiết. Mong muốn là thứ bạn thích nhưng có thể chờ, như một món đồ chơi mới. Hãy ưu tiên nhu cầu trước nhé!" },
  { id: "safety", question: "Làm gì khi có người xin mã OTP?", answer: "Đừng gửi mã OTP, mật khẩu hoặc thông tin tài khoản cho người khác. Hãy dừng trò chuyện và nhờ bố mẹ hoặc người lớn đáng tin cậy kiểm tra cùng bạn." },
];
export const kidAssistantMockApi = {
  ask: async (topicId) => {
    const topic = assistantTopics.find((item) => item.id === topicId);
    if (!topic) throw new Error("Hãy chọn một chủ đề mẫu.");
    return { answer: topic.answer, source: "mock" };
  },
};
