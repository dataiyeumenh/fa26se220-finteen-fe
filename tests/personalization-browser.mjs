import assert from "node:assert/strict";
import { createServer } from "vite";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const folder = path.resolve("output/personalization");
mkdirSync(folder, { recursive: true });
const server = await createServer({ server: { host: "127.0.0.1", port: 5198, strictPort: true, hmr: false } });
await server.listen();
try {
  const child = spawn(process.env.BROWSER_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    `--user-data-dir=${path.join(folder, `profile-${process.pid}`)}`, "--window-size=390,844", "--virtual-time-budget=60000", "--dump-dom",
    "http://127.0.0.1:5198/tests/fixtures/personalization-browser.html",
  ], { windowsHide: true });
  let html = "", stderr = "";
  child.stdout.on("data", (chunk) => { html += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  const timeout = setTimeout(() => child.kill(), 90000);
  try {
    await new Promise((resolve, reject) => { child.on("error", reject); child.on("exit", (code) => code === 0 ? resolve() : reject(Error(stderr.slice(-1500)))); });
  } finally { clearTimeout(timeout); }
  writeFileSync(path.join(folder, "browser.html"), html);
  const encoded = html.match(/<pre id="personalization-result"[^>]*>([\s\S]*?)<\/pre>/)?.[1];
  const decoded = encoded?.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
  assert.ok(decoded?.startsWith("{"), decoded || stderr.slice(-800));
  const result = JSON.parse(decoded);
  writeFileSync(path.join(folder, "browser.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  assert.equal(result.status, "PASS");
} finally { await server.close(); }
