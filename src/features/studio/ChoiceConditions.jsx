import { hasCondition, parseCondition } from './draftV2'

export default function ChoiceConditions({ option, index, raw, onCondition, onReason }) {
  const value = raw ?? (option.condition == null ? '' : JSON.stringify(option.condition, null, 2))
  let error = ''
  try { parseCondition(value) } catch { error = 'JSON điều kiện chưa hợp lệ. Nội dung đang nhập vẫn được giữ lại.' }
  const required = hasCondition(option)
  return <div className="scene-choice-condition">
    <label>Điều kiện mở khóa (JSON)<textarea aria-label={`Điều kiện lựa chọn ${index + 1}`} rows={3} value={value} spellCheck={false} aria-invalid={!!error} aria-describedby={`choice-condition-help-${index}`} onChange={event => onCondition(event.target.value)} placeholder="Để trống nếu không có điều kiện" /></label>
    <small id={`choice-condition-help-${index}`}>Biến <code>choice:&lt;nhóm&gt;</code>: lựa chọn cuối của một câu hỏi. Biến <code>inspected:&lt;mã thẻ&gt;</code>: thẻ đã xem. Dùng cấu trúc điều kiện trong schema máy chủ.</small>
    {error && <small className="scene-field-warning">{error}</small>}
    <label>Lý do khóa {required && '(bắt buộc)'}<textarea aria-label={`Lý do khóa lựa chọn ${index + 1}`} rows={2} value={option.lockedReason || ''} required={required} onChange={event => onReason(event.target.value)} placeholder="Câu trẻ nhìn thấy khi chưa đủ điều kiện" /></label>
    {required && !option.lockedReason?.trim() && <small className="scene-field-warning">Lựa chọn có condition cần lockedReason. Bạn vẫn có thể lưu nháp để hoàn thiện sau.</small>}
  </div>
}
