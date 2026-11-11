from pathlib import Path
import sys

from docx import Document


source = Path(sys.argv[1])
target = Path(sys.argv[2])
doc = Document(source)


def set_paragraph(starts_with, text):
    for paragraph in doc.paragraphs:
        normalized = " ".join(paragraph.text.replace("\u00a0", " ").split())
        normalized_key = " ".join(starts_with.replace("\u00a0", " ").split())
        if normalized.startswith(normalized_key):
            paragraph.text = text
            return
    raise ValueError(f"Paragraph not found: {starts_with}")


def put(table_index, row, col, text):
    doc.tables[table_index].cell(row, col).text = str(text)


set_paragraph("– Hồ Chí Minh, October 2026 –", "– Hồ Chí Minh, November 2026 –")
set_paragraph(
    "This document covers the testing of FinTeen as it stood for Review 2:",
    "This document covers the Review 2 test baseline recorded in Test Report v1.3. The back-end baseline is commit 29dc607, run locally on 07/11/2026 and in GitHub Actions run 41499442723 on 03/11/2026. The front-end automated baseline is commit 0d825d7, run locally on 07/11/2026. The separate FE Browser UI run remains the 31/10/2026 run recorded in the workbook. Requirement identifiers follow Final v2 (14/10/2026) and the traceability matrix in docs/testing/test-matrix.md.",
)
set_paragraph(
    "•  NFR-1 performance and compatibility",
    "•  NFR-1 performance and compatibility, and the operational parts of NFR-2. Eight manual cases remain Pending. MAN-03 was partially executed on 09/11/2026: the web checks passed on Chrome, Edge and Firefox at 1024 x 768 and Android 16 was run in an emulator; the physical-device run remains pending. The other seven manual cases were not executed.",
)
set_paragraph(
    "•  Browsers other than Chrome and Edge on Windows",
    "•  The separate FE Browser UI suite of 31/10/2026 used headless Chrome and Edge. MAN-03 later added compatibility checks on Chrome, Edge and Firefox at 1024 x 768. No physical phone or tablet was used; Android 16 was exercised in an emulator through Expo Go.",
)
set_paragraph(
    "•  The FE unit tests run on Node.js.",
    "•  The FE automated baseline at commit 0d825d7 contains 222 cases: 221 node:test cases and the FE-222 headless-browser layout check. All 222 passed locally on 07/11/2026. The FE repository has no CI workflow. The separate 116-case FE Browser UI run of 31/10/2026 used a local development server connected to the production back end and is not part of CI.",
)
set_paragraph(
    "Unit tests run without the Spring context.",
    "Unit tests run without the Spring context. Integration tests start the whole BE application with an in-memory database and call it over HTTP; this level holds 153 of the 193 BE test methods. ContentSchemaTest.realChaptersPassWithLegacyWarnings is a @ValueSource parameterized unit test over three chapter file names, so 193 methods produce 195 JUnit executions.",
)
set_paragraph(
    "The fields required by the Review 2 guide",
    "The fields required by the Review 2 guide (section 9.3) map to the workbook columns as follows: ID to Test Case ID; feature or workflow to Covers; preconditions to Pre-conditions; steps and data to Test Case Procedure; expected result to Expected Results; execution details to Execution and source; and actual results to the round columns and Actual result / Note. For the v1.2 baseline, BE commit 29dc607 was run locally on 07/11/2026 and in CI run 41499442723 on 03/11/2026; FE commit 0d825d7 was run locally on 07/11/2026. The FE Browser UI sheet retains its separate 31/10/2026 run and has no second round.",
)
set_paragraph(
    "The BE suite has 29 test classes",
    "The BE suite contains 193 test cases, one per test method. ContentSchemaTest.realChaptersPassWithLegacyWarnings uses @ValueSource with three chapter file names; therefore the 193 methods produce 195 JUnit executions. All 195 executions passed locally on commit 29dc607 on 07/11/2026 and in GitHub Actions run 41499442723 on 03/11/2026.",
)
set_paragraph(
    "Two conditions of the FE run are recorded",
    "The FE automated baseline is commit 0d825d7. It contains 221 node:test cases and one headless-browser layout check (FE-222), for 222 cases in total. All 222 passed locally on 07/11/2026. The FE repository has no CI workflow.",
)
set_paragraph(
    "Of the 507 cases",
    "Of the 539 workbook cases, 530 passed, one failed and eight remain Pending. The failed case is UI-112. The eight Pending cases are manual; MAN-03 was partially executed on 09/11/2026 but remains Pending because the physical-device run was not performed. The other seven manual cases were not executed. The pass rate is 99.8% of executed cases and 98.3% of all cases.",
)
set_paragraph(
    "Over the 90 minimum cases required by the guide",
    "Over the 90 minimum cases required by the guide, 89 (98.9%) are traced to an automated test that runs in CI. The BE baseline contains 193 test methods and 195 JUnit executions, all passing in CI. Across the workbook, 531 of 539 cases (98.5%) are automated; the eight manual cases are not automated.",
)
set_paragraph(
    "•  NFR-1 is partly tested.",
    "•  NFR-1 is partly tested. MAN-03 passed the web compatibility checks on Chrome, Edge and Firefox at 1024 x 768 and ran the adult application on an Android 16 emulator. Chapter-load time, API response time under 50 concurrent learners and a physical-device Android run remain Pending.",
)
set_paragraph(
    "The FE suite was run locally from a clean copy",
    "The FE automated suite was run locally at commit 0d825d7 on 07/11/2026: 221 node:test cases and FE-222, a headless-browser layout check, all passed. This is the v1.2 baseline and is separate from the later RP4 run on commit 86d8e90. The FE Browser UI cases are reported separately below.",
)

# Record of Changes.
put(0, 3, 3, "Executed MAN-03 on Chrome, Edge and Firefox at 1024 x 768 and on an Android 16 emulator; synchronized Report 5 with Test Report v1.2 totals and run baselines. Physical-device execution remains pending. Evidence link withheld pending privacy cleanup of screenshots.")

# NFR-1 status.
put(2, 1, 2, "Partly. MAN-03 passed the web checks on Chrome, Edge and Firefox at 1024 x 768 and ran the adult application on an Android 16 emulator. Chapter-load time, the 50-concurrent-learner API measurement and the physical-device Android run remain Pending.")

# Module inventory.
put(10, 6, 2, 36)
put(10, 9, 2, 222)
put(10, 11, 3, "Manual; MAN-03 partially executed, all eight final statuses Pending")
put(10, 12, 2, 539)
put(10, 12, 3, "193 BE test methods in CI (195 JUnit executions); 531 automated cases overall")

# Test runs.
for col, value in enumerate(["BE, local", "07/11/2026", "mvn test on commit 29dc607; 193 test methods, with ContentSchemaTest.realChaptersPassWithLegacyWarnings producing three @ValueSource runs", 195, 195, 0, 0, "100 %"]):
    put(11, 1, col, value)
for col, value in enumerate(["BE, CI", "03/11/2026", "GitHub Actions run 41499442723 on commit 29dc607; 193 test methods, 195 JUnit executions", 195, 195, 0, 0, "100 %"]):
    put(11, 2, col, value)
for col, value in enumerate(["FE, local", "07/11/2026", "Commit 0d825d7: 221 node:test cases plus FE-222 headless-browser layout check", 222, 222, 0, 0, "100 %"]):
    put(11, 3, col, value)

# Results by module.
put(12, 6, 1, 36); put(12, 6, 2, 36)
put(12, 9, 1, 222); put(12, 9, 2, 222)
for col, value in enumerate(["Total", 539, 530, 1, 8, ""]):
    put(12, 12, col, value)

# Automation and minimum coverage.
put(13, 2, 0, "BE test methods and JUnit executions run in CI")
put(13, 2, 1, "193 methods; 195 of 195 executions passed (100 %)")
put(13, 3, 1, "531 of 539 (98.5 %)")
put(14, 4, 2, 2); put(14, 4, 3, 3)
put(14, 4, 5, "NFR-1 partial; NFR-2 and NFR-3 partial")
put(14, 5, 2, 81); put(14, 5, 3, 9)

target.parent.mkdir(parents=True, exist_ok=True)
doc.save(target)
print(target)
