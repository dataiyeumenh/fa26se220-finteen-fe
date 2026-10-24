// Chuẩn hoá JSON chương theo bộ khuôn BE trước khi game dùng (Hưng 24/10: "thay hết bằng bản mới").
// - Tên loại cảnh mới của khuôn: inspect (cũ: scene), reflection (cũ: activity) — game vẫn dùng tên cũ bên trong.
// - Vị trí nhân vật chữ thường (left / center / right); dữ liệu cũ "LEFT" trước đây làm nhân vật đứng sát mép.
// Dữ liệu cũ (bản 1.1.0) đi qua đây không đổi hành vi, chỉ sửa vị trí viết hoa.
const TYPE_ALIAS = { inspect: "scene", reflection: "activity" };

const lowerPosition = (item) =>
  typeof item?.position === "string" ? { ...item, position: item.position.toLowerCase() } : item;

export function normalizeChapter(data) {
  if (!data || !Array.isArray(data.scenes)) return data;
  return {
    ...data,
    scenes: data.scenes.map((scene) => ({
      ...scene,
      type: TYPE_ALIAS[scene.type] ?? scene.type,
      ...(Array.isArray(scene.characters) ? { characters: scene.characters.map(lowerPosition) } : {}),
    })),
    ...(data.endingRules?.endings
      ? { endingRules: { ...data.endingRules, endings: data.endingRules.endings.map(lowerPosition) } }
      : {}),
  };
}
