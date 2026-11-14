import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Node 20 on Windows does not expand tests/*.test.mjs; pass every file explicitly.
const root = fileURLToPath(new URL("../", import.meta.url));
const tests = readdirSync(new URL("../tests/", import.meta.url))
  .filter((name) => name.endsWith(".test.mjs"))
  .sort()
  .map((name) => `tests/${name}`);
if (!tests.length) throw new Error("No test files found.");
// Vite render tests share the HMR port; run files sequentially to avoid conflicts.
const result = spawnSync(process.execPath, ["--test", "--test-concurrency=1", ...process.argv.slice(2), ...tests], {
  cwd: root,
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
