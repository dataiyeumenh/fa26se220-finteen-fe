import { chapterMiniGameSummary } from './miniGameRules.js';
const ART = '/images/finteen-v2/chapter-07';
export const insurancePayments = [100000, 200000, 300000, 500000];
export const insuranceDocuments = [
  { id: 'receipt', label: 'Hóa đơn đã thanh toán', image: `${ART}/props/medical-receipt.png` },
  { id: 'appointment', label: 'Lịch hẹn buổi sau', image: `${ART}/asset-mini-game/scam-or-safe/time-pressure.png` },
  { id: 'medicalRecord', label: 'Giấy ghi nhận xử lý y tế', image: `${ART}/props/medical-receipt.png` },
  { id: 'otp', label: 'Mã OTP người nhắn tin hỏi', image: `${ART}/asset-mini-game/scam-or-safe/message-phone.png` },
  { id: 'claim', label: 'Mẫu yêu cầu chi trả', image: `${ART}/props/insurance-terms-folder.png` },
];
export const requiredDocuments = ['receipt', 'medicalRecord', 'claim'];
export const safetyMessages = [
  { id: 'instantRefund', channel: 'SMS từ số chưa lưu', text: 'Hồ sơ được hoàn 200.000đ. Gửi mã OTP để nhận ngay; sau 5 phút quyền nhận tiền sẽ hết.', context: 'An không yêu cầu giao dịch nào. Người gửi muốn nhận mã xác thực.', answer: 'check', explanation: 'Yêu cầu OTP và thúc ép thời gian là dấu hiệu cần dừng. Tự mở ứng dụng hoặc dùng thông tin liên hệ đã có trong hợp đồng, không gọi theo tin nhắn.' },
  { id: 'claimStatus', channel: 'Ứng dụng bảo hiểm An đang dùng', text: 'Hồ sơ đã tiếp nhận, đang chờ xét. Bạn có thể xem danh sách chứng từ tại mục Hồ sơ của tôi.', context: 'Ứng dụng đã cài từ trước; An mở trực tiếp, không qua đường dẫn trong tin lạ.', answer: 'continue', explanation: 'Có thể tiếp tục xem trạng thái trong ứng dụng bảo hiểm An tự mở. Đã tiếp nhận vẫn chưa đồng nghĩa được duyệt hay đã nhận tiền.' },
  { id: 'fakeLink', channel: 'Tin nhắn tự xưng hỗ trợ bảo hiểm', text: 'Bổ sung hồ sơ tại bao-hiem-hoan-tien.example/xac-minh, nhập mật khẩu ngân hàng để đối chiếu.', context: 'Địa chỉ không trùng trang web ghi trong hợp đồng. Đây chỉ là tên miền giả lập, không phải liên kết để mở.', answer: 'check', explanation: 'Tên người gửi và chữ “bảo hiểm” trong địa chỉ chưa đủ để biết ai đứng sau tin nhắn. Hồ sơ y tế không cần gửi mật khẩu ngân hàng cho người nhắn tin.' },
  { id: 'officialDesk', channel: 'Bàn hỗ trợ của trường', text: 'Mang hóa đơn và giấy xử lý y tế đến bàn hướng dẫn. Không gửi ảnh giấy tờ vào nhóm chat công khai.', context: 'An và Cô Linh đang đứng tại bàn đã được nhà trường giới thiệu.', answer: 'continue', explanation: 'An đang hỏi trực tiếp tại bàn do nhà trường giới thiệu nên có thể tiếp tục và đưa giấy tờ cần thiết. Người hướng dẫn giúp chuẩn bị hồ sơ, nhưng không quyết định bên bảo hiểm có trả tiền hay không.' },
  { id: 'remoteApp', channel: 'Cuộc gọi từ người lạ', text: 'Cài ứng dụng hỗ trợ từ tệp tôi gửi và bật quyền điều khiển màn hình, tôi sẽ làm hồ sơ thay.', context: 'An chưa từng liên hệ người này; An không tìm thấy ứng dụng này trên kho ứng dụng hay trang web của bên bảo hiểm.', answer: 'check', explanation: 'Không cài tệp lạ hay cấp quyền điều khiển thiết bị. Dừng cuộc gọi, rồi tự tìm số hỗ trợ trong hợp đồng để hỏi lại bên bảo hiểm.' },
  { id: 'verifiedSupport', channel: 'Mục hỗ trợ của ứng dụng bảo hiểm', text: 'Bạn có thể gửi yêu cầu giải thích hồ sơ, kèm mã hồ sơ và hóa đơn. Không gửi mật khẩu hoặc OTP cho nhân viên.', context: 'An tự mở ứng dụng bảo hiểm đã dùng từ trước rồi vào mục hỗ trợ.', answer: 'continue', explanation: 'An đã tự mở ứng dụng bảo hiểm và được hướng dẫn gửi giấy tờ liên quan, nên có thể tiếp tục. Chỉ gửi những gì hồ sơ yêu cầu và chờ phản hồi; nộp hồ sơ chưa có nghĩa chắc chắn được trả tiền.' },
];
export const responseActions = [
  { id: 'save', label: 'Lưu chứng từ, thời điểm và gửi báo cáo', image: `${ART}/asset-mini-game/scam-or-safe/save-evidence.png` },
  { id: 'payFee', label: 'Chuyển phí cho người hứa lấy lại tiền', image: `${ART}/asset-mini-game/scam-or-safe/message-phone.png` },
  { id: 'protect', label: 'Khóa thẻ hoặc tài khoản trong ứng dụng ngân hàng', image: `${ART}/asset-mini-game/scam-or-safe/protect-account.png` },
  { id: 'stop', label: 'Dừng lại, không gửi thêm mã hay thông tin', image: `${ART}/asset-mini-game/scam-or-safe/stop-transaction.png` },
  { id: 'reply', label: 'Trả lời số lạ để nhờ họ xử lý tiếp', image: `${ART}/asset-mini-game/scam-or-safe/message-phone.png` },
  { id: 'contact', label: 'Báo ngân hàng qua số trên thẻ hoặc ứng dụng', image: `${ART}/asset-mini-game/scam-or-safe/official-contact.png` },
];
export const safetyTasks = [
  { id: 'insurancePayment', round: 0 }, { id: 'insurancePacket', round: 0 },
  ...safetyMessages.map(message => ({ id: message.id, round: 1 })),
  ...['stop', 'contact', 'protect', 'save'].map(id => ({ id: `response_${id}`, round: 2 })),
];
export function createSafetyState(rounds) {
  return { round: rounds[0], payment: null, documents: [], messages: {}, activeMessage: 0,
    response: [], submittedRounds: {}, history: {}, feedback: '' };
}
export function applySafetyAction(state, action) {
  if (action.type === 'ROUND') return state.submittedRounds[state.round] && action.round === state.round + 1 ? { ...state, round: action.round, feedback: '' } : state;
  // Reading another inbox card remains possible after submission; answers stay locked.
  if (action.type === 'MESSAGE' && state.round === 1 && Number.isInteger(action.index) && action.index >= 0 && action.index < safetyMessages.length) return { ...state, activeMessage: action.index };
  if (state.submittedRounds[state.round]) return state;
  const next = { ...state, feedback: '' };
  const grade = (id, correct) => { next.history = { ...next.history, [id]: { firstAttemptCorrect: correct, finalCorrect: correct, attemptCount: 1 } }; };
  const submit = () => { next.submittedRounds = { ...state.submittedRounds, [state.round]: true }; };
  if (action.type === 'PAYMENT' && state.round === 0 && insurancePayments.includes(action.amount)) next.payment = action.amount;
  else if (action.type === 'DOCUMENT' && state.round === 0 && insuranceDocuments.some(item => item.id === action.id)) next.documents = state.documents.includes(action.id) ? state.documents.filter(id => id !== action.id) : [...state.documents, action.id];
  else if (action.type === 'SUBMIT_INSURANCE' && state.round === 0 && insurancePayments.includes(state.payment)) {
    grade('insurancePayment', state.payment === 300000);
    grade('insurancePacket', state.documents.length === requiredDocuments.length && requiredDocuments.every(id => state.documents.includes(id)));
    submit(); next.feedback = 'Đã nhận bài nộp. Xem phần tiền cần trả hôm nay và hồ sơ cần giữ bên dưới.';
  } else if (action.type === 'ANSWER_MESSAGE' && state.round === 1 && safetyMessages.some(item => item.id === action.id) && ['check', 'continue'].includes(action.answer)) {
    next.messages = { ...state.messages, [action.id]: action.answer };
    next.activeMessage = Math.min(safetyMessages.length - 1, state.activeMessage + 1);
  } else if (action.type === 'SUBMIT_MESSAGES' && state.round === 1 && safetyMessages.every(item => state.messages[item.id])) {
    for (const message of safetyMessages) grade(message.id, state.messages[message.id] === message.answer);
    submit(); next.feedback = 'Đã kiểm tra hộp thư. Chọn từng tin để xem dấu hiệu và lý do.';
  } else if (action.type === 'ADD_RESPONSE' && state.round === 2 && state.response.length < 4 && responseActions.some(item => item.id === action.id) && !state.response.includes(action.id)) next.response = [...state.response, action.id];
  else if (action.type === 'REMOVE_RESPONSE' && state.round === 2) next.response = state.response.filter(id => id !== action.id);
  else if (action.type === 'SUBMIT_RESPONSE' && state.round === 2 && state.response.length === 4) {
    grade('response_stop', state.response[0] === 'stop');
    grade('response_contact', [1, 2].includes(state.response.indexOf('contact')));
    grade('response_protect', [1, 2].includes(state.response.indexOf('protect')));
    grade('response_save', state.response[3] === 'save');
    submit(); next.feedback = 'Đã nhận kế hoạch. Báo ngân hàng và khóa thẻ hoặc tài khoản đều cần làm ngay. Việc nào làm được trước thì làm, đừng đợi gom đủ giấy tờ.';
  } else return state;
  return next;
}
export function safetyResult(history, rounds) {
  const tasks = safetyTasks.filter(task => rounds.includes(task.round));
  const score = tasks.filter(task => history[task.id]?.finalCorrect).length;
  return { score, total: tasks.length, completed: tasks.every(task => Boolean(history[task.id])),
    passed: score === tasks.length, firstPercent: Math.round(score * 100 / tasks.length), answers: history, revised: false };
}
export function chapterSevenLearning(ledger, results, config) {
  const groups = Object.entries(config.choiceGroupMaxima);
  const sum = entry => Object.values(entry || {}).reduce((total, value) => total + value, 0);
  const max = groups.reduce((total, [, value]) => total + value, 0);
  const choicePercent = groups.reduce((total, [id]) => total + sum(ledger[id]?.evidenceScores), 0) * 100 / max;
  const firstPercent = groups.reduce((total, [id]) => total + sum(ledger[id]?.firstEvidenceScores || ledger[id]?.evidenceScores), 0) * 100 / max;
  const miniGames = chapterMiniGameSummary(results, config);
  const { miniPercent } = miniGames;
  return { ...miniGames, choicePercent, firstPercent, miniPercent, reflectionPercent: null,
    learningScore: choicePercent * config.weights.choices + miniPercent * config.weights.miniGame };
}
