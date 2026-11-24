// Run from any directory: node --experimental-websocket docs/diagrams/render.mjs
// Uses installed Chrome and pinned Mermaid; does not install application dependencies.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const engine = 'Mermaid 11.12.0';
const files = (await readdir(dir)).filter(file => file.endsWith('.mmd')).sort();
const server = createServer((_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:white}#diagram{padding:24px;display:inline-block}svg{max-width:none!important}</style><div id="diagram"></div>');
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const profile = await mkdtemp(path.join(tmpdir(), 'finteen-architecture-'));
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
let launchError;
chrome.on('error', error => { launchError = error; });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let ws;
try {
  let debugPort;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (launchError) throw launchError;
    try { debugPort = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch { await delay(200); }
  }
  if (!debugPort) throw new Error('Chrome failed to start; set CHROME_PATH if needed.');
  const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
  ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id;
    const timer = setTimeout(() => { pending.delete(key); reject(new Error(`CDP timeout: ${method}`)); }, 45000);
    pending.set(key, { resolve, reject, timer });
    ws.send(JSON.stringify({ id: key, method, params }));
  });
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    clearTimeout(item.timer);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  };
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result?.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: `http://127.0.0.1:${server.address().port}` });
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await evaluate('Boolean(document.getElementById("diagram"))')) break;
    await delay(100);
  }
  await evaluate(`(async () => {
    const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs');
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base',
      themeVariables: { fontFamily: 'Arial, sans-serif', fontSize: '16px', primaryColor: '#eff6ff', primaryTextColor: '#0f172a', primaryBorderColor: '#64748b', lineColor: '#64748b', clusterBkg: '#f8fafc', clusterBorder: '#94a3b8', actorBkg: '#dbeafe', actorBorder: '#2563eb', actorTextColor: '#172554', signalTextColor: '#0f172a', noteBkgColor: '#fef3c7', noteBorderColor: '#b45309' },
      flowchart: { htmlLabels: false, curve: 'linear', nodeSpacing: 32, rankSpacing: 55, useMaxWidth: false },
      sequence: { useMaxWidth: false, wrap: true, actorMargin: 55, messageMargin: 32 }
    });
    window.mermaid = mermaid;
  })()`);
  const diagrams = [];
  for (const [index, file] of files.entries()) {
    const source = await readFile(path.join(dir, file), 'utf8');
    const result = await evaluate(`(async () => {
      const source = ${JSON.stringify(source)};
      await window.mermaid.parse(source);
      const { svg } = await window.mermaid.render('architecture_${index}', source);
      const target = document.getElementById('diagram'); target.innerHTML = svg;
      await document.fonts.ready;
      const element = target.querySelector('svg');
      const box = element.getBoundingClientRect();
      return { svg: new XMLSerializer().serializeToString(element), width: box.width, height: box.height };
    })()`);
    if (!(result.width > 0 && result.height > 0) || result.svg.includes('Syntax error')) throw new Error(`Invalid render: ${file}`);
    await writeFile(path.join(dir, file.replace('.mmd', '.svg')), result.svg);
    const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: Math.ceil(result.width + 48), height: Math.ceil(result.height + 48), scale: Math.min(1, 2200 / Math.max(result.width + 48, result.height + 48)) } });
    await writeFile(path.join(dir, file.replace('.mmd', '.png')), Buffer.from(screenshot.data, 'base64'));
    const { svg, ...dimensions } = result;
    diagrams.push({ file, parsed: true, rendered: true, ...dimensions });
    console.log(`${file}: parsed, rendered ${Math.round(result.width)}x${Math.round(result.height)}`);
  }
  await writeFile(path.join(dir, 'validation.json'), JSON.stringify({ engine, diagrams }, null, 2) + '\n');
} finally {
  ws?.close();
  chrome.kill();
  await new Promise(resolve => server.close(resolve));
}
