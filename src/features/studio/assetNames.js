import contentNames from './assetContentNames.json';

export function assetDisplayName(asset) {
  if (asset.label?.trim()) return asset.label;
  for (const source of [asset.url, asset.ref]) {
    if (!source) continue;
    const key = source.split('/assets/')[1]?.split(/[?#]/)[0];
    if (key && contentNames[key]) return contentNames[key];
  }
  return '';
}
