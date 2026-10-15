export function normalizeHotspot(value = {}) {
  const number = (key, fallback) => Number.isFinite(Number(value[key])) ? Number(value[key]) : fallback;
  const width = Math.max(2, Math.min(100, number("width", 30)));
  const height = Math.max(2, Math.min(100, number("height", 20)));
  return {
    x: Math.max(0, Math.min(100 - width, number("x", 0))),
    y: Math.max(0, Math.min(100 - height, number("y", 0))),
    width, height,
  };
}
