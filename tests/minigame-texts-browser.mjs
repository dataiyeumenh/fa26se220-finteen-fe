import assert from "node:assert/strict";
import { createServer } from "vite";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const server = await createServer({ server: { host: "127.0.0.1", port: 5197, strictPort: true, hmr: false } });
const folder = path.resolve("output/minigame-texts/browser");
mkdirSync(folder, { recursive: true });
await server.listen();
const scenarios = [
  ["json-overrides", "minigame-texts", "minigame-texts-result"],
  ["chapter-five", "chapter-five", "ch5-browser-result"],
  ["chapter-six", "chapter-six", "ch6-browser-result"],
  ["chapter-eight", "chapter-eight", "ch8-browser-result"],
  ["chapter-eight-feedback", "chapter-eight-feedback", "ch8-feedback-result"],
];
try {
  for (const [name, fixture, id] of scenarios) {
    const child = spawn(process.env.BROWSER_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
      "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
      `--user-data-dir=${path.join(folder, "profile")}`, "--window-size=1440,1200", "--virtual-time-budget=180000", "--dump-dom",
      `http://127.0.0.1:5197/tests/fixtures/${fixture}-browser.html`,
    ], { windowsHide: true });
    let html = "", error = "";
    child.stdout.on("data", chunk => html += chunk);
    child.stderr.on("data", chunk => error += chunk);
    await new Promise((resolve, reject) => { child.on("error", reject); child.on("exit", code => code === 0 ? resolve() : reject(Error(error.slice(-1500)))); });
    writeFileSync(path.join(folder, name + ".html"), html);
    const encoded = html.match(new RegExp(`<pre id="${id}">([\\s\\S]*?)<\\/pre>`))?.[1];
    const decoded = encoded?.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
    assert.ok(decoded?.startsWith("{"), `${name}: ${decoded || error.slice(-800)}`);
    const result = JSON.parse(decoded);
    writeFileSync(path.join(folder, name + ".json"), JSON.stringify(result, null, 2));
    console.log(name, JSON.stringify(result));
    assert.equal(result.status, "PASS", name);
  }
} finally { await server.close(); }
