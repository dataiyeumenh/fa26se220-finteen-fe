import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const base = process.env.STUDIO_TEST_BASE || 'http://localhost:5173';
const folder = path.resolve('output/studio-qa');
mkdirSync(folder, { recursive: true });
const results = [];
const verifyFixes = process.argv.includes('--verify-fixes');
try {
  for (const [testCase, width] of [['navigation', 1440], ['fallback', 1440], ['empty-background', 1440], ['upload-cancel', 1440], ['upload-reopen', 1440], ['navigation', 390], ['upload-cancel', 390], ['upload-reopen', 390]]) {
    if (verifyFixes && !['navigation', 'upload-cancel', 'upload-reopen'].includes(testCase)) continue;
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 } });
    const page = await context.newPage();
    // The fixture replaces auth.accountRequest. Also block all external writes as a safety net.
    await page.route('**/*', route => route.request().method() !== 'GET' && !route.request().url().startsWith(base) ? route.abort() : route.continue());
    await page.goto(`${base}/tests/fixtures/studio-exploratory-browser.html?case=${testCase}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.studioExploratoryResult, { timeout: 60000 });
    const result = await page.evaluate(() => window.studioExploratoryResult);
    results.push({ ...result, width });
    await page.screenshot({ path: path.join(folder, `${testCase}-${width}.png`), fullPage: true });
    console.log(JSON.stringify({ ...result, width }));
    await context.close();
  }
  assert.ok(results.every(r => r.completed), 'An exploratory scenario did not complete');
  if (verifyFixes) assert.ok(results.every(r => !r.bugReproduced), 'A fixed regression is still reproducible');
} finally {
  writeFileSync(path.join(folder, verifyFixes ? 'fixed-regressions.json' : 'exploratory.json'), JSON.stringify({ results, reproducedCases: results.filter(r => r.bugReproduced).length }, null, 2));
  await browser.close();
}
