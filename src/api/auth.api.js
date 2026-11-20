import { createAuthClient } from "./auth.client.js";
import { apiConfig } from "./config.js";

export const auth = createAuthClient({
  baseUrl: apiConfig.baseUrl,
  storage: {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  },
  contextStorage: {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  },
  slotStorage: {
    getItem: (key) => sessionStorage.getItem(key),
    setItem: (key, value) => sessionStorage.setItem(key, value),
  },
  sharedStorage: {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  },
  beforeSlotSignOut: async (slotSession) => {
    const { flushPendingBatches } = await import(
      "../pages/Kid/Dashboard/components/game/playBatch.js"
    );
    await flushPendingBatches(slotSession?.code);
  },
  clearSlotData: (slotSession) => {
    const slotId = slotSession?.slot?.id;
    const prefixes = [
      slotId ? `finteen:quiz-attempt:${encodeURIComponent(slotId)}:` : null,
      slotId ? `finteen:vn:v2:${encodeURIComponent(`slot:${slotId}`)}:` : null,
    ].filter(Boolean);
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);
      if (key && prefixes.some((prefix) => key.startsWith(prefix)))
        localStorage.removeItem(key);
    }
  },
});

export function startAuth(client = auth) {
  const refresh = () => {
    client.syncBrowserSession();
    if (client.hasSession()) void client.refresh().catch(() => {});
  };
  const synchronize = (event) => {
    if (client.isSessionStorageEvent(event)) client.syncBrowserSession();
  };
  refresh();
  window.addEventListener("focus", refresh);
  window.addEventListener("storage", synchronize);
  const timer = window.setInterval(() => client.checkExpiry(), 1000);
  return () => {
    window.removeEventListener("focus", refresh);
    window.removeEventListener("storage", synchronize);
    window.clearInterval(timer);
  };
}
