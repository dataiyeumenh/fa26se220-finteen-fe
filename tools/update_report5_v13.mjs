import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = process.argv[2];
const output = process.argv[3];
const outputDir = output.slice(0, output.lastIndexOf("/"));

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const cover = wb.worksheets.getItem("Cover");
const stats = wb.worksheets.getItem("Test Statistics");
const cases = wb.worksheets.getItem("Test Cases");
const manual = wb.worksheets.getItem("NFR & Manual");

cover.getRange("B6").values = [["FA26SE220_Test Report_v1.3"]];
cover.getRange("F5").values = [["09/11/2026"]];
cover.getRange("F6").values = [["1.3"]];
cover.getRange("A14:F14").values = [[
  "09/11/2026",
  "1.3",
  "MAN-03; Test Cases; Test Statistics; NFR & Manual",
  "M",
  "Nguyễn Gia Triệu recorded the partial MAN-03 execution: Chrome, Edge and Firefox passed at 1024 x 768; Android 16 emulator was run; physical-device execution remains pending. Report 5 totals and BE/FE run descriptions were aligned with v1.2.",
  "Evidence folder reviewed on 09/11/2026 but not linked: current screenshots contain personal data and require privacy cleanup before submission."
]];
cover.getRange("A14:F14").format.rowHeight = 96;
cover.getRange("A14:F14").format.wrapText = true;

stats.getRange("C5").values = [["FA26SE220_Test Report_v1.3"]];
stats.getRange("H5").values = [["09/11/2026"]];
stats.getRange("C6").values = [[
  "BE commit 29dc607: 193 test cases (test methods) produce 195 JUnit executions because ContentSchemaTest.realChaptersPassWithLegacyWarnings is a @ValueSource parameterized test over three chapter file names; 195/195 passed locally on 07/11/2026 and in GitHub Actions run 41499442723 on 03/11/2026. FE commit 0d825d7: 222/222 passed locally on 07/11/2026 (221 node:test cases and FE-222 layout check). FE Browser UI retains its separate 31/10/2026 run (115 passed, UI-112 failed). Eight manual cases remain Pending; MAN-03 was partially executed on 09/11/2026."
]];

const manualSummary = "8 manual cases: MAN-03 partially executed on 09/11/2026 (web passed on Chrome, Edge and Firefox; Android 16 emulator run; physical-device run pending), final status pending; the other 7 not executed.";
cases.getRange("E42").values = [[manualSummary]];
manual.getRange("B3").values = [["Manual cases defined here; MAN-03 partially executed on 09/11/2026, final status Pending; the other seven cases were not executed."]];
manual.getRange("Q14").values = [[
  "Browser runs on 09/11/2026: Chrome live run 01:08 and 26-screen audit 02:32; Edge live run 01:13 and audit 02:33; Firefox live run 01:12 and audit 02:35 (Asia/Saigon). Tested web checkout: b955db6. Android 16 emulator (AVD) through Expo Go; mobile commit 04b3d3a. Runs in CI: no. Evidence folder exists on Drive, but the link is withheld until screenshots containing personal data are replaced with privacy-safe demo evidence."
]];

wb.recalculate();

for (const [sheetName, range, fileName] of [
  ["Cover", "A4:F14", "Cover_preview.png"],
  ["Test Statistics", "B3:H35", "Statistics_preview.png"],
  ["NFR & Manual", "A2:R19", "NFR_Manual_preview.png"],
]) {
  const preview = await wb.render({ sheetName, range, scale: 1.2, format: "png" });
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(`${outputDir}/${fileName}`, new Uint8Array(await preview.arrayBuffer()));
}

const keyCheck = await wb.inspect({
  kind: "table",
  sheetId: "Test Statistics",
  range: "B3:H35",
  include: "values,formulas",
  tableMaxRows: 40,
  tableMaxCols: 8,
  maxChars: 18000,
});
console.log(keyCheck.ndjson);

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  maxChars: 12000,
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(output);
console.log(output);
