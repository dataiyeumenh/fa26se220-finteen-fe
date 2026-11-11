// No browser automation package required. Uses an installed Chrome/Edge in headless mode.
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const allCases = ['home', 'login', 'register', 'internal-login', 'parent', 'teacher', 'kid', 'kid-child', 'quiz', 'quiz-preview', 'admin', 'editor', 'reviewer', 'manager', 'game', 'teacher-menu', 'admin-menu', 'editor-menu', ...Array.from({ length: 8 }, (_, i) => `minigame-${i + 1}`)];
allCases.push('game-dialogue', 'game-choice');
allCases.push('editor-chapter', 'editor-chapter-menu');
const cases = process.env.RESPONSIVE_CASES ? process.env.RESPONSIVE_CASES.split(',') : allCases;
assert.ok(cases.every(name => allCases.includes(name)), 'Unknown responsive case');
const widths = [320, 390, 768, 1024, 1440, 1920];
const server = await createServer({ appType: 'custom', server: { host: '127.0.0.1', port: 5194, strictPort: true, hmr: false } });
server.middlewares.use('/__responsive-case', async (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(await server.transformIndexHtml('/__responsive-case', '<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/tests/responsive-fixture.jsx"></script></body></html>'));
});
server.middlewares.use('/__responsive-audit', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!doctype html><html><body><pre id="result">RUNNING</pre><script>
  const queue=${JSON.stringify(widths.flatMap(width => cases.map(name => ({ width, name }))))};
  const results=[]; let frame;
  function next(){if(!queue.length){document.getElementById('result').textContent=JSON.stringify(results);document.title='DONE';return;}const item=queue.shift();frame?.remove();frame=document.createElement('iframe');frame.width=item.width;frame.height=900;frame.style.border=0;frame.src='/__responsive-case?case='+item.name;document.body.append(frame);}
  addEventListener('message',event=>{if(event.source!==frame?.contentWindow||!event.data.responsiveResult)return;results.push(event.data.responsiveResult);document.getElementById('result').textContent=JSON.stringify(results);next();});next();
  </script></body></html>`);
});
server.middlewares.use('/__responsive-capture', (req, res) => {
  const params = new URL(req.url, 'http://localhost').searchParams;
  const name = params.get('case');
  const width = Number(params.get('width'));
  if (!allCases.includes(name) || !widths.includes(width)) { res.statusCode = 400; res.end(); return; }
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!doctype html><html><body style="margin:0;background:#e2e8f0"><iframe style="border:0;display:block;width:${width}px;height:900px" src="/__responsive-case?case=${name}"></iframe></body></html>`);
});
await server.listen();
fs.mkdirSync('output', { recursive: true });
const executable = process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = path.resolve('output/responsive-browser-profile');
try {
  const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--disable-software-rasterizer', '--no-sandbox', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, '--window-size=1600,1000', '--virtual-time-budget=300000', '--dump-dom', 'http://127.0.0.1:5194/__responsive-audit'], { windowsHide: true });
  let html = '';
  let error = '';
  browser.stdout.on('data', chunk => { html += chunk; });
  browser.stderr.on('data', chunk => { error += chunk; });
  await new Promise((resolve, reject) => { browser.on('error', reject); browser.on('exit', code => code === 0 ? resolve() : reject(new Error(error.slice(-2000)))); });
  fs.writeFileSync('output/responsive-browser.html', html);
  const encoded = html.match(/<pre id="result">([\s\S]*?)<\/pre>/)?.[1];
  assert.ok(encoded?.startsWith('['), `Browser audit did not complete: ${encoded || error.slice(-500)}`);
  const results = JSON.parse(encoded.replaceAll('&quot;', '"').replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>'));
  fs.writeFileSync('output/responsive-browser-audit.json', JSON.stringify(results, null, 2));
  assert.ok(results.every(result => result.gameLayout !== false), 'Game backdrop must fill the player and dialogue/choices must remain overlays');
  assert.ok(results.every(result => !result.editorLayout || (result.editorLayout.rendered && result.editorLayout.overlap <= 1 && result.editorLayout.menuReadable && result.editorLayout.contentVisible)), 'Chapter editor must render beside the sidebar without overlap or hidden menu text; see output/responsive-browser-audit.json');
  const failures = results.filter(result => result.scrollWidth > result.width + 1 || result.overflowing.length || result.imagesFailed.length || !result.rendered || !result.preview || !result.navigation || (result.activeNavigationContrast !== null && result.activeNavigationContrast < 4.5) || (result.navigationCenterOffset !== null && result.navigationCenterOffset > 1) || !result.overlayScrollbars || !result.previewScrollWorks);
  console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
  if (process.env.RESPONSIVE_SCREENSHOTS) {
    for (const [name, width] of [['kid', 1920], ['kid', 1024], ['kid', 768], ['kid-child', 1920], ['quiz-preview', 390], ['teacher-menu', 390]]) {
      const capture = spawn(executable, ['--headless=new', '--disable-gpu', '--disable-software-rasterizer', '--no-sandbox', '--no-first-run', `--user-data-dir=${profile}`, `--window-size=${Math.max(500, width)},900`, '--virtual-time-budget=12000', `--screenshot=${path.resolve(`output/responsive-${name}-${width}.png`)}`, `http://127.0.0.1:5194/__responsive-capture?case=${name}&width=${width}`], { windowsHide: true, stdio: 'ignore' });
      await new Promise((resolve, reject) => { capture.on('error', reject); capture.on('exit', code => code === 0 ? resolve() : reject(new Error(`Screenshot failed: ${name}`))); });
    }
  }
  assert.equal(results.length, cases.length * widths.length);
  assert.equal(failures.length, 0, 'Responsive regressions; see output/responsive-browser-audit.json');
} finally { await server.close(); }
