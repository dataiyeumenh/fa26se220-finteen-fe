// Run with: node tests/studio-personalization-browser.mjs
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Node 20 supports the built-in client behind this flag; newer Node needs no flag.
if (typeof globalThis.WebSocket === 'undefined') {
  const rerun = spawnSync(process.execPath, ['--experimental-websocket', ...process.argv.slice(1)], { stdio: 'inherit', windowsHide: true });
  process.exit(rerun.status ?? 1);
}

const folder = path.resolve('output/studio-personalization');
mkdirSync(folder, { recursive: true });
// Serve the clip locally so playback acceptance does not wait for an external
// media connection. STUDIO_VOICE_SAMPLE can point to an actual downloaded MP3.
function silentWav() {
  const bytes = Buffer.alloc(8044, 128);
  bytes.fill(0, 0, 44);
  bytes.write('RIFF', 0); bytes.writeUInt32LE(8036, 4); bytes.write('WAVE', 8); bytes.write('fmt ', 12);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(8000, 24); bytes.writeUInt32LE(8000, 28); bytes.writeUInt16LE(1, 32); bytes.writeUInt16LE(8, 34);
  bytes.write('data', 36); bytes.writeUInt32LE(8000, 40);
  return bytes;
}
const sampleAudio = process.env.STUDIO_VOICE_SAMPLE ? readFileSync(process.env.STUDIO_VOICE_SAMPLE) : silentWav();
process.env.VITE_API_BASE_URL = 'http://127.0.0.1:5197/finteen';
const server = await createServer({
  plugins: [{ name: 'voice-playback-fixture', configureServer(vite) {
    vite.middlewares.use('/finteen/assets/v/364b59d6f1d5c5faccc5.mp3', (_request, response) => {
      response.setHeader('Content-Type', process.env.STUDIO_VOICE_SAMPLE ? 'audio/mpeg' : 'audio/wav');
      response.setHeader('Content-Length', sampleAudio.length);
      response.end(sampleAudio);
    });
  } }],
  server: { host: '127.0.0.1', port: 5197, strictPort: true, hmr: false, watch: null },
});
await server.listen();
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function browserCheck(width) {
  const child = spawn(process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--remote-debugging-port=0',
    `--user-data-dir=${path.join(folder, `profile-${process.pid}-${width}`)}`, `--window-size=${width},1000`, 'about:blank',
  ], { windowsHide: true });
  let socket, stderr = '';
  const pending = new Map();
  try {
    const endpoint = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error(`Chrome startup timeout: ${stderr.slice(-800)}`)), 20000);
      child.on('error', error => { clearTimeout(timer); reject(error); });
      child.on('exit', code => { clearTimeout(timer); reject(Error(`Chrome exited: ${code}`)); });
      child.stderr.on('data', chunk => {
        stderr += chunk;
        const url = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];
        if (url) { clearTimeout(timer); resolve(url); }
      });
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id); clearTimeout(entry.timer);
      if (message.error) entry.reject(Error(message.error.message));
      else entry.resolve(message.result);
    });
    let sequence = 0;
    const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
    const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
    await call('Page.navigate', { url: `http://127.0.0.1:5197/tests/fixtures/studio-personalization-browser.html?width=${width}` }, sessionId);
    const deadline = Date.now() + 60000;
    let result;
    while (Date.now() < deadline) {
      const value = await call('Runtime.evaluate', { expression: 'document.getElementById("result")?.textContent', returnByValue: true }, sessionId);
      if (value.result?.value?.startsWith('{')) { result = JSON.parse(value.result.value); break; }
      await wait(100);
    }
    const html = await call('Runtime.evaluate', { expression: 'document.documentElement.outerHTML', returnByValue: true }, sessionId);
    writeFileSync(path.join(folder, `${width}.html`), html.result.value);
    const screenshot = await call('Page.captureScreenshot', { format: 'png' }, sessionId);
    writeFileSync(path.join(folder, `${width}.png`), Buffer.from(screenshot.data, 'base64'));
    assert.ok(result, 'Browser acceptance did not finish within 60 seconds');
    console.log(JSON.stringify({ width, ...result }, null, 2));
    assert.equal(result.status, 'PASS');
  } finally {
    for (const entry of pending.values()) { clearTimeout(entry.timer); entry.reject(Error('Browser closed')); }
    socket?.close();
    child.kill();
    child.stdin.destroy(); child.stdout.destroy(); child.stderr.destroy();
  }
}
try {
  const sampleResponse = await fetch('http://127.0.0.1:5197/finteen/assets/v/364b59d6f1d5c5faccc5.mp3');
  assert.equal(sampleResponse.status, 200);
  assert.ok(sampleResponse.headers.get('content-type')?.startsWith('audio/'));
  assert.equal((await sampleResponse.arrayBuffer()).byteLength, sampleAudio.length);
  for (const width of [1440, 390]) await browserCheck(width);
} catch (error) {
  console.error(error); process.exitCode = 1;
} finally {
  server.httpServer?.closeAllConnections();
  const shutdownTimeout = setTimeout(() => process.exit(process.exitCode ?? 0), 10000);
  shutdownTimeout.unref();
  await server.close(); clearTimeout(shutdownTimeout);
}
process.exit(process.exitCode ?? 0);
