import { OverlayScrollbars } from "overlayscrollbars";

/** Enhance existing viewports without wrapping or moving React-owned children. */
export function startScrollbars() {
  const instances = new Map();
  const pending = new Set();
  const internalSelector = '[class^="os-"], [class*=" os-"]';
  let frame;
  const options = {
    scrollbars: { theme: "os-theme-finteen", autoHide: "leave", autoHideDelay: 600, autoHideSuspend: false, dragScroll: true },
  };
  const enhance = (element) => {
    if (instances.has(element) || element.closest(internalSelector) || element.matches("input, textarea, select, svg, [data-native-scroll]")) return;
    const style = getComputedStyle(element);
    if (element !== document.body && ![style.overflowX, style.overflowY].some(value => value === "auto" || value === "scroll")) return;
    const instance = OverlayScrollbars({ target: element, elements: { viewport: element }, cancel: { body: null } }, {
      ...options,
      overflow: {
        x: element === document.body || ["auto", "scroll"].includes(style.overflowX) ? "scroll" : "hidden",
        y: element === document.body || ["auto", "scroll"].includes(style.overflowY) ? "scroll" : "hidden",
      },
    });
    instances.set(element, instance);
  };
  const flush = () => {
    frame = undefined;
    for (const [element, instance] of instances) {
      if (!element.isConnected) { instance.destroy(); instances.delete(element); }
    }
    for (const root of pending) {
      if (!root.isConnected || root.closest(internalSelector)) continue;
      enhance(root);
      root.querySelectorAll("*").forEach(element => { if (element instanceof HTMLElement) enhance(element); });
    }
    pending.clear();
  };
  const schedule = (root) => {
    pending.add(root);
    frame ??= requestAnimationFrame(flush);
  };
  enhance(document.body);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.target instanceof Element && record.target.closest(internalSelector)) continue;
      if (record.target instanceof HTMLElement && !instances.has(record.target)) schedule(record.target);
      for (const node of record.addedNodes) if (node instanceof HTMLElement && !node.matches(internalSelector)) schedule(node);
      if (record.removedNodes.length && frame === undefined) frame = requestAnimationFrame(flush);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const onResize = () => schedule(document.body);
  window.addEventListener("resize", onResize, { passive: true });
  schedule(document.body);
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    if (frame !== undefined) cancelAnimationFrame(frame);
    instances.forEach(instance => instance.destroy());
    instances.clear();
  };
}
