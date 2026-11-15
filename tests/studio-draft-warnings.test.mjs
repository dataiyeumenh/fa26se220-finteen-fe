import test from 'node:test';
import assert from 'node:assert/strict';
import { describeDraftWarnings } from '../src/features/studio/draftWarnings.js';

const scenes = Array.from({ length: 6 }, (_, i) => ({ id: `S${i + 1}`, title: i === 5 ? 'Minh rủ mua ngay' : `Cảnh ${i + 1}`, text: 'Mua online có 7 đô nghe còn rẻ hơn nữa kìa!' }));
const warning = scope => `cá nhân hoá: scenes[5].text: số trong chữ khác bản gốc [7] → [] (${scope})`;

test('the three screenshot warnings become one plain-language problem for scene 6 and Music', () => {
  const input = [warning('interest:MUSIC'), warning('gender:MALE|interest:MUSIC'), warning('gender:FEMALE|interest:MUSIC')];
  const result = describeDraftWarnings(input, scenes);
  assert.equal(result.length, 1);
  const issue = result[0];
  assert.equal(issue.sceneId, 'S6');
  assert.equal(issue.sceneIndex, 5);
  assert.equal(issue.sceneTitle, 'Minh rủ mua ngay');
  assert.equal(issue.fieldName, 'Lời thoại');
  assert.equal(issue.scopeText, 'Sở thích: Âm nhạc');
  assert.match(issue.description, /bỏ mất số “7”/);
  assert.match(issue.action, /Thêm lại số “7”/);
  assert.equal(issue.sourceText, scenes[5].text);
  assert.deepEqual(issue.scopes, [['interest:MUSIC']]);
  assert.deepEqual(issue.rawMessages, input);
});

test('additional digits in a spoken reading explain writing numbers out in words', () => {
  const result = describeDraftWarnings(['cá nhân hoá: scenes[0].spokenText: số trong chữ khác bản gốc [] → [250.000] (interest:GAME)'], [{ id: 'S1', spokenText: 'Hai trăm năm mươi nghìn đồng' }]);
  assert.equal(result[0].fieldName, 'Cách đọc cho giọng');
  assert.match(result[0].description, /có thêm số “250.000”/);
  assert.match(result[0].action, /Viết các số bằng chữ/);
  assert.equal(result[0].sourceText, 'Hai trăm năm mươi nghìn đồng');
});

test('different numbers, fields and scene locations remain separate problems', () => {
  const result = describeDraftWarnings([
    warning('interest:MUSIC'),
    'cá nhân hoá: scenes[5].text: số trong chữ khác bản gốc [7] → [8] (interest:MUSIC)',
    'cá nhân hoá: scenes[5].spokenText: số trong chữ khác bản gốc [7] → [] (interest:MUSIC)',
    'cá nhân hoá: scenes[4].text: số trong chữ khác bản gốc [7] → [] (interest:MUSIC)',
  ], scenes);
  assert.equal(result.length, 4);
  assert.match(result[1].description, /Bản gốc: “7”; bản cá nhân hóa: “8”/);
});

test('scope combinations are preserved when no generic warning covers them', () => {
  const result = describeDraftWarnings([warning('gender:FEMALE|interest:MUSIC'), warning('gender:MALE|interest:SPORT')], scenes);
  assert.equal(result[0].scopes.length, 2);
  assert.match(result[0].scopeText, /Giới tính: Nữ/);
  assert.match(result[0].scopeText, /Sở thích: Thể thao/);
});

test('unknown technical errors retain details without merging unrelated causes', () => {
  const result = describeDraftWarnings([
    'cá nhân hoá: scenes[0].text: token không tồn tại (interest:GAME)',
    'cá nhân hoá: scenes[0].text: phải là chuỗi (interest:GAME)',
    'Tên chương không được để trống.',
  ], scenes);
  assert.equal(result.length, 3);
  assert.equal(result[0].description, 'Lời thoại chưa đáp ứng yêu cầu của chương.');
  assert.match(result[0].action, /người quản lý nội dung/);
  assert.equal(result[2].description, 'Tên chương không được để trống.');
  assert.deepEqual(describeDraftWarnings([], scenes), []);
});

test('nested options and missing scene references are handled without unsafe navigation', () => {
  const result = describeDraftWarnings([
    'cá nhân hoá: scenes[0].options[0].text: số trong chữ khác bản gốc [7] → [] (interest:MUSIC)',
    'cá nhân hoá: scenes[40].text: số trong chữ khác bản gốc [7] → [] (interest:MUSIC)',
  ], [{ id: 'S1', options: [{ text: 'Chọn 7 đồng' }] }]);
  assert.equal(result[0].fieldName, 'Lựa chọn 1');
  assert.equal(result[0].sourceText, 'Chọn 7 đồng');
  assert.equal(result[1].sceneId, undefined);
});
