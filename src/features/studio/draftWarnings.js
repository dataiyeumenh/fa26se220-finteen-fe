import { DIMENSION_LABELS, VALUE_LABELS } from '../personalization/model.js';

const FIELD_NAMES = {
  text: 'Lời thoại', spokenText: 'Cách đọc cho giọng', prompt: 'Câu hỏi',
  speaker: 'Tên người nói', title: 'Tiêu đề', label: 'Nội dung hiển thị',
  image: 'Ảnh', src: 'Ảnh nhân vật', popupImage: 'Ảnh khi bấm xem', background: 'Ảnh nền',
  nextSceneId: 'Cảnh tiếp theo', dataText: 'Nội dung khi mở', buttonText: 'Chữ trên nút',
};
const labelsIn = message => [...message.matchAll(/\b(gender|age|interest):([A-Z0-9_]+)/g)].map(([, dim, value]) => `${dim}:${value}`);
const scopeText = labels => labels.map(label => {
  const [dim, value] = label.split(':');
  return `${DIMENSION_LABELS[dim]}: ${VALUE_LABELS[value] || 'nhãn chưa có tên hiển thị'}`;
}).join(' · ');
const readPath = (node, path) => path.split(/[.[\]]+/).filter(Boolean).reduce((value, key) => value?.[key], node);
const numbersIn = value => value.split(/,\s+/).map(part => part.trim()).filter(Boolean);
const quoteNumbers = numbers => numbers.map(value => `“${value}”`).join(', ');

/** Interpret warnings at save time, preserving scene IDs if scenes later move. */
export function describeDraftWarnings(warnings = [], scenes = []) {
  const groups = new Map();
  for (const raw of warnings) {
    const message = typeof raw === 'string' ? raw : JSON.stringify(raw);
    const location = /scenes\[(\d+)\](?:\.([A-Za-z_]\w*(?:(?:\[\d+\])|(?:\.[A-Za-z_]\w*))*))?/.exec(message);
    const sceneIndex = location ? Number(location[1]) : null;
    const scene = sceneIndex == null ? null : scenes[sceneIndex];
    const path = location?.[2] || '';
    const field = path.split('.').at(-1);
    let fieldName = FIELD_NAMES[field] || (path.startsWith('game') ? 'Nội dung mini-game' : 'Nội dung');
    const option = /^options\[(\d+)\]/.exec(path);
    if (option) fieldName = `Lựa chọn ${Number(option[1]) + 1}`;
    const numeric = /số trong chữ khác bản gốc\s*\[([^\]]*)\]\s*(?:→|->)\s*\[([^\]]*)\]/iu.exec(message);
    let description, action;
    if (numeric) {
      const expected = numbersIn(numeric[1]), actual = numbersIn(numeric[2]);
      if (expected.length && !actual.length) {
        description = `${fieldName} của bản cá nhân hóa đã bỏ mất số ${quoteNumbers(expected)} có trong bản gốc.`;
        action = `Thêm lại số ${quoteNumbers(expected)} vào ${fieldName.toLowerCase()}. Có thể đổi cách diễn đạt nhưng cần giữ các con số như bản gốc.`;
      } else if (!expected.length && actual.length) {
        description = `${fieldName} của bản cá nhân hóa có thêm số ${quoteNumbers(actual)} so với bản gốc.`;
        action = field === 'spokenText'
          ? 'Viết các số bằng chữ như trong cách đọc của bản gốc, thay vì dùng chữ số.'
          : 'Bỏ các con số được thêm vào hoặc sửa nội dung để giữ các con số như bản gốc.';
      } else {
        description = `${fieldName} có các con số chưa khớp. Bản gốc: ${quoteNumbers(expected) || 'không có chữ số'}; bản cá nhân hóa: ${quoteNumbers(actual) || 'không có chữ số'}.`;
        action = `Sửa ${fieldName.toLowerCase()} để giữ đúng các con số và thứ tự của chúng như bản gốc.`;
      }
    } else {
      const technical = /scenes\[|variants|personalization|\b(?:gender|age|interest):|spokenText|nextSceneId/.test(message);
      description = technical ? `${fieldName} chưa đáp ứng yêu cầu của chương.` : message;
      action = scene ? 'Mở cảnh để kiểm tra nội dung. Nếu chưa rõ cách sửa, gửi phần chi tiết kỹ thuật cho người quản lý nội dung.'
        : 'Kiểm tra lại nội dung chương. Nếu chưa rõ cách sửa, gửi phần chi tiết kỹ thuật cho người quản lý nội dung.';
    }
    const labels = [...new Set(labelsIn(message))].sort();
    const withoutScope = message.replace(/\s*\((?:gender|age|interest):[^)]*\)\s*$/, '');
    const key = JSON.stringify([scene?.id ?? sceneIndex, path, numeric ? numeric.slice(1) : withoutScope]);
    if (!groups.has(key)) groups.set(key, {
      sceneId: scene?.id, sceneIndex, sceneTitle: scene?.title || '', path, field, fieldName,
      description, action, sourceText: scene && typeof readPath(scene, path) === 'string' ? readPath(scene, path) : '',
      scopes: [], rawMessages: [],
    });
    const group = groups.get(key);
    if (!group.scopes.some(scope => JSON.stringify(scope) === JSON.stringify(labels))) group.scopes.push(labels);
    if (!group.rawMessages.includes(message)) group.rawMessages.push(message);
  }
  return [...groups.values()].map(group => {
    // A generic interest warning already covers its male/female combinations.
    const scopes = group.scopes.filter((scope, i, all) => !all.some((other, j) => i !== j && other.length < scope.length && other.every(label => scope.includes(label))));
    return { ...group, scopes, scopeText: scopes.map(scopeText).filter(Boolean).join('; ') };
  });
}
