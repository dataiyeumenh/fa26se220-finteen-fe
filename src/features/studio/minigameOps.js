// Soạn mini-game ở chế độ đơn giản: tìm chữ trẻ đọc, con số, ảnh và đáp án (grade) trong game của một cảnh.
// Hàm thuần — trả danh sách { path, ... } để form sửa theo đường dẫn; không đụng React.

const SECTION = { texts: 'Chữ chung trên màn chơi', questions: 'Câu hỏi', rounds: 'Các vòng chơi', timeline: 'Dòng thời gian', howto: 'Hướng dẫn chơi', competencies: 'Kỹ năng',
  steps: 'Các bước', inspections: 'Mục kiểm tra', criteria: 'Tiêu chí chấm', decision: 'Quyết định', items: 'Các thẻ', phones: 'Các mẫu điện thoại', jobs: 'Các việc làm thêm',
  tasks: 'Các nhiệm vụ', inbox: 'Hộp tin nhắn', messages: 'Tin nhắn', insurance: 'Bảo hiểm', response: 'Cách xử lý', cart: 'Giỏ hàng', portfolio: 'Danh mục đầu tư', claims: 'Lời quảng cáo',
  planner: 'Kế hoạch tháng', months: 'Các tháng', reference: 'Tài liệu tham khảo', zones: 'Các giỏ', draggables: 'Thẻ kéo', dropZones: 'Ô thả', expenses: 'Khoản chi bất ngờ', offers: 'Lời mời vay', config: 'Đầu màn chơi' }
const WORDS = { title: 'Tiêu đề', heading: 'Tiêu đề', label: 'Tên', name: 'Tên', text: 'Nội dung', prompt: 'Câu hỏi', instruction: 'Hướng dẫn', intro: 'Giới thiệu', description: 'Mô tả',
  explanation: 'Giải thích', hint: 'Gợi ý', feedback: 'Phản hồi khi trả lời', detail: 'Chi tiết', caption: 'Chú thích', note: 'Ghi chú', review: 'Nhận xét', context: 'Bối cảnh', channel: 'Kênh gửi',
  passed: 'Khi đạt', failed: 'Khi chưa đạt', formula: 'Công thức', eyebrow: 'Dòng nhỏ phía trên', facts: 'Dữ kiện', help: 'Trợ giúp', yearLabel: 'Nhãn năm', progressLabel: 'Nhãn tiến độ',
  timeLimitSeconds: 'Thời gian chơi (giây)', passScore: 'Điểm đạt', maxScore: 'Điểm tối đa', weeklyLimit: 'Giới hạn giờ mỗi tuần', targetAmount: 'Số tiền mục tiêu', durationSeconds: 'Thời lượng (giây)',
  expenseChance: 'Khả năng có khoản chi bất ngờ', coinStep: 'Mỗi lần tiết kiệm', coinMaxSteps: 'Số lần tiết kiệm tối đa', budget: 'Ngân sách', reserve: 'Quỹ dự phòng', firstYearBudget: 'Ngân sách năm đầu',
  estimatedMinutes: 'Thời gian ước tính (phút)', hours: 'Số giờ', amount: 'Số tiền', price: 'Giá', principal: 'Tiền gốc', ratePercent: 'Lãi suất (%)', expectedValue: 'Giá trị đúng', income: 'Thu nhập',
  essential: 'Chi bắt buộc', installment: 'Trả góp mỗi kỳ', image: 'Ảnh', goalImage: 'Ảnh mục tiêu', calendarImage: 'Ảnh lịch', timeImage: 'Ảnh đồng hồ', src: 'Ảnh' }
const SKIP = /^(id|kind|type|icon|tone|variant|key|flag|correctId|groupId|ariaLabel|grade|answer|category|mechanic|view|round|part|competency|backgroundId|correct)$/i
const isImageValue = value => typeof value === 'string' && (/\.(png|webp|jpe?g|svg)(\?|$)/i.test(value) || value.includes('{{ASSET_BASE}}/a/'))
const isReadable = value => typeof value === 'string' && !isImageValue(value) && value.trim().length > 1 && (/\s/.test(value.trim()) || /[À-ỹ]/.test(value))
export const wordFor = key => WORDS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())
const itemName = item => (item && typeof item === 'object' ? String(item.label || item.name || item.title || item.prompt || item.text || item.id || '').slice(0, 60) : '')

function walk(node, path, visit, context) {
  if (Array.isArray(node)) node.forEach((item, i) => walk(item, [...path, i], visit, { ...context, item: itemName(item) || `${i + 1}` }))
  else if (node && typeof node === 'object') for (const [key, value] of Object.entries(node)) {
    if (key === 'grade' || key === 'onComplete') continue
    if (value && typeof value === 'object') walk(value, [...path, key], visit, context.section && context.section !== 'config' ? context : { section: key })
    else visit(key, value, [...path, key], context)
  }
}

/** chữ trẻ đọc, nhóm theo phần (vùng) của màn chơi */
export function textGroups(game) {
  const groups = new Map()
  walk(game, [], (key, value, path, context) => {
    if (SKIP.test(key) || !isReadable(value)) return
    const section = context.section || '_'
    if (!groups.has(section)) groups.set(section, { section, label: section === '_' ? 'Tiêu đề và giới thiệu' : SECTION[section] || `Phần “${wordFor(section)}”`, fields: [] })
    groups.get(section).fields.push({ path, label: `${context.item ? `${context.item} · ` : ''}${wordFor(key)}`, value })
  }, {})
  return [...groups.values()]
}

/** con số và ảnh chỉnh được (không gồm đáp án) */
export function settingFields(game) {
  const numbers = [], images = []
  walk(game, [], (key, value, path, context) => {
    if (SKIP.test(key)) return
    const label = `${context.item ? `${context.item} · ` : ''}${wordFor(key)}`
    if (typeof value === 'number') numbers.push({ path, label, value })
    else if (isImageValue(value)) images.push({ path, label, value })
  }, {})
  return { numbers, images }
}

export const getAt = (object, path) => path.reduce((node, key) => node?.[key], object)
export function setAt(object, path, value) {
  const parent = getAt(object, path.slice(0, -1))
  if (parent) parent[path.at(-1)] = value
}

// mã đáp án hay gặp → lời thường
const ANSWER_WORDS = { over: 'Quá sức / vượt giờ', fit: 'Phù hợp', shortfall: 'Thiếu', check: 'Dừng lại kiểm tra', continue: 'Tiếp tục được', NEEDS: 'Cần', WANTS: 'Muốn',
  minimum: 'Trả tối thiểu', half: 'Trả một nửa', threeQuarters: 'Trả ba phần tư', partial: 'Trả một phần', almostFull: 'Trả gần hết', full: 'Trả hết' }

/**
 * Câu có đáp án (đối tượng mang `grade`). Luật một phép eq / in → tích chọn được; còn lại → nâng cao.
 * Lựa chọn đáp án lấy từ chính game: options của câu, hoặc mảng có id trùng đáp án, hoặc đáp án của các câu cùng loạt.
 */
export function gradeItems(game) {
  const found = []
  const visit = (node, siblings, path) => {
    if (Array.isArray(node)) return node.forEach((item, i) => visit(item, node, [...path, i]))
    if (!node || typeof node !== 'object') return
    if (node.grade?.rule) found.push({ object: node, siblings, path })
    for (const [key, value] of Object.entries(node)) if (key !== 'grade' && value && typeof value === 'object') visit(value, null, [...path, key])
  }
  visit(game, null, [])
  return found.map(({ object, siblings, path }) => {
    const rule = object.grade.rule, keys = Object.keys(rule)
    const simple = keys.length === 1 && (keys[0] === 'eq' || keys[0] === 'in')
    const base = { path, label: itemName(object) || 'Câu', round: object.round ?? object.part, simple }
    if (!simple) return base
    const values = rule.eq !== undefined ? [rule.eq] : rule.in
    const numeric = rule.eq !== undefined && typeof rule.eq === 'number' && !Array.isArray(object.options)
    return { ...base, multi: rule.in !== undefined, numeric, choices: numeric ? [] : choicesFor(game, object, siblings, values) }
  })
}
function choicesFor(game, object, siblings, values) {
  const fromList = list => list.map(item => (item && typeof item === 'object' ? { value: item.id ?? item.value, label: item.text || item.label || item.title || item.name || item.id } : { value: item, label: item })).filter(choice => choice.value !== undefined)
  if (Array.isArray(object.options) && object.options.length) return fromList(object.options)
  let list = null
  const search = node => { if (list) return; if (Array.isArray(node)) { if (node.some(item => item && typeof item === 'object' && values.includes(item.id))) list = node; else node.forEach(search) } else if (node && typeof node === 'object') Object.values(node).forEach(search) }
  search(game)
  if (list) return fromList(list)
  const pool = new Set(values)
  for (const item of siblings || []) { const rule = item?.grade?.rule; if (rule?.eq !== undefined) pool.add(rule.eq); for (const value of rule?.in || []) pool.add(value) }
  return [...pool].map(value => ({ value, label: ANSWER_WORDS[value] || value }))
}
/** khung FE cũ còn đọc đáp án ở answer / correctId / category — đổi theo để game chạy đúng */
export function setAnswer(game, path, rule) {
  const object = getAt(game, path), old = object.grade.rule.eq
  object.grade.rule = rule
  if (rule.eq !== undefined) for (const key of ['answer', 'correctId', 'category']) if (object[key] === old) object[key] = rule.eq
}
