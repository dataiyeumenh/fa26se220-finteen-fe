import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { Modal } from "./ui";

const indicators = [
  ["Tài sản", "Cách trẻ nhìn nhận, sử dụng và bảo vệ những nguồn lực mình đang có."],
  ["Tiết kiệm", "Khả năng dành lại nguồn lực cho nhu cầu và mục tiêu trong tương lai."],
  ["Hạnh phúc", "Mức độ trẻ cân bằng giữa tiền bạc, nhu cầu và cảm xúc trong các lựa chọn."],
  ["Rủi ro", "Cách trẻ nhận biết và cân nhắc điều có thể xảy ra trước khi quyết định."],
  ["Mục tiêu", "Khả năng xác định điều muốn đạt được và lựa chọn cách thực hiện phù hợp."],
];

export default function ReportIndicatorHelp() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="ws-indicator-help-button" aria-label="Giải thích 5 chỉ số" onClick={() => setOpen(true)}>
        <CircleHelp size={15} />
      </button>
      {open && (
        <Modal
          className="ws-indicator-help-modal"
          title="5 chỉ số có ý nghĩa gì?"
          description="Các chỉ số mô tả xu hướng lựa chọn của trẻ trong hành trình học tài chính."
          onClose={() => setOpen(false)}
        >
          <div className="ws-indicator-help-list">
            {indicators.map(([title, description]) => (
              <article key={title}><strong>{title}</strong><p>{description}</p></article>
            ))}
          </div>
          <p className="ws-notice" role="note">Đây không phải điểm số và không dùng để xếp hạng hay so sánh các trẻ với nhau.</p>
          <button type="button" className="ws-btn primary" onClick={() => setOpen(false)}>Đã hiểu</button>
        </Modal>
      )}
    </>
  );
}
