import { webpAssets } from "./webpAssets.js";

/** Only rewrite known local images; uploaded/CDN URLs keep their server contract. */
export function webpImageUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return value;
  const pathname = value.split(/[?#]/)[0];
  return webpAssets[pathname] ? webpAssets[pathname] + value.slice(pathname.length) : value;
}

export function resolveContentImages(value) {
  if (typeof value === "string") return webpImageUrl(value);
  if (Array.isArray(value)) return value.map(resolveContentImages);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolveContentImages(child)]));
  }
  return value;
}
