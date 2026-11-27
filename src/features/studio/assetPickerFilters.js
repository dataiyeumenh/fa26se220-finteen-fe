import { assetDisplayName } from './assetNames.js';

export const normalizeAssetText = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
export const assetChapters = asset => [...new Set([asset.chapterCode, ...(asset.usage || []).map(item => item.chapterCode)].filter(Boolean))];

export function filterPickerAssets(assets, filters) {
  const words = normalizeAssetText(filters.q).split(/\s+/).filter(Boolean);
  return assets.filter(asset => {
    const text = normalizeAssetText([assetDisplayName(asset), asset.label, asset.ref, asset.url].filter(Boolean).join(' '));
    if (!words.every(word => text.includes(word))) return false;
    if (filters.chapter && !assetChapters(asset).includes(filters.chapter)) return false;
    if (filters.status && asset.status !== filters.status) return false;
    if (filters.gender && !new RegExp(`(?:^|[^a-z])${filters.gender}(?:$|[^a-z])`).test(text)) return false;
    if (filters.age && !new RegExp(`cap[\\s_-]*${filters.age}(?:$|[^0-9])`).test(text)) return false;
    if (filters.shape) {
      if (!(asset.width > 0 && asset.height > 0)) return false;
      const ratio = asset.width / asset.height;
      if (filters.shape === 'landscape' && ratio <= 1.05) return false;
      if (filters.shape === 'portrait' && ratio >= 0.95) return false;
      if (filters.shape === 'square' && (ratio < 0.95 || ratio > 1.05)) return false;
    }
    return true;
  }).sort((a, b) => filters.sort === 'name'
    ? (assetDisplayName(a) || a.ref || a.url || '').localeCompare(assetDisplayName(b) || b.ref || b.url || '', 'vi', { numeric: true })
    : filters.sort === 'size' ? (b.sizeBytes || 0) - (a.sizeBytes || 0)
      : filters.sort === 'resolution' ? (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0)
        : (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
}
