from copy import deepcopy
from pathlib import Path
import sys

from docx import Document


source = Path(sys.argv[1])
target = Path(sys.argv[2])
doc = Document(source)


def put(cell, text):
    cell.text = text


def replace_all(old, new):
    for paragraph in doc.paragraphs:
        if old in paragraph.text:
            for run in paragraph.runs:
                if old in run.text:
                    run.text = run.text.replace(old, new)
                    break
            else:
                paragraph.text = paragraph.text.replace(old, new)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if old in cell.text:
                    cell.text = cell.text.replace(old, new)


# WBS: current names and status. Scope-dependent AI items remain unchanged until Final v3.
wbs = doc.tables[1]
put(wbs.cell(5, 1), "FR-04: PARENT or TEACHER plan, or an upgrade, granted when PayOS confirms payment (implemented and running in production)")
put(wbs.cell(16, 1), "FR-19: Reward shop — removed from scope on 01/10/2026 (Final v2)")
put(wbs.cell(16, 2), "Removed")
put(wbs.cell(16, 3), "0")
put(wbs.cell(10, 3), "31")
put(wbs.cell(21, 1), "FR-15: Aggregate figures of a group for its TEACHER-plan user")
put(wbs.cell(24, 1), "FR-17: TEACHER-plan user assembles a quiz from a shared pool and reads each result")
put(wbs.cell(25, 1), "Mobile application for adults — planned for a later iteration; Expo/React Native prototype source exists (5 commits, 03/10–18/10); no APK has been built")
put(wbs.cell(26, 1), "FR-22: Adult manages seats and reads results on mobile (later iteration; prototype only)")
put(wbs.cell(27, 1), "FR-23: TEACHER-plan user reads group figures on mobile (later iteration; prototype only)")
put(wbs.cell(28, 1), "FR-24: TEACHER-plan user builds a quiz from the shared pool on mobile (later iteration; prototype only)")
put(wbs.cell(29, 1), "NFR-07: Mobile application shell, build and release pipeline (later iteration; no APK built)")
put(wbs.cell(35, 0), "")
put(wbs.cell(35, 1), "Total estimated effort — pending recalculation after Final v3 scope approval; 174 was the pre-01/10 estimate")
put(wbs.cell(35, 2), "")
put(wbs.cell(35, 3), "TBD")

# Effort narrative must not present the obsolete total as current.
for p in doc.paragraphs:
    if p.text.startswith("Allocated Effort (man-days):"):
        p.text = (
            "Allocated Effort (man-days): pending recalculation after Final v3 scope approval. "
            "The previous total of 259 man-days included 174 man-days for coding and unit testing under the pre-01/10 scope; "
            "it is retained only as a historical estimate and is not a current commitment."
        )

# Risks: reflect verified production state without changing unresolved Final-v3 decisions.
risks = doc.tables[3]
put(risks.cell(1, 1), "PayOS is implemented and running in production. Nine production package purchases had passed through PayOS by 09/11/2026; current TEACHER and PARENT prices are administrator-set test values.")
put(risks.cell(1, 2), "Resolved")
put(risks.cell(1, 3), "Low")
put(risks.cell(1, 4), "Keep webhook and transaction monitoring enabled; replace test prices only after the business model is approved.")
put(risks.cell(4, 4), "Keep a runnable local front-end build on at least two laptops before every review. Only a chapter already loaded in the browser is expected to remain playable when the server becomes unreachable (NFR-02).")
put(risks.cell(5, 1), "PostgreSQL training was completed before the production migration on 07/10/2026. Pull-request discipline remains an ongoing process risk as the repositories continue to change.")
put(risks.cell(5, 2), "Medium")
put(risks.cell(5, 3), "Medium")
put(risks.cell(5, 4), "Keep database migration checks in CI and require review before merging pull requests.")
put(risks.cell(6, 1), "Production has used PostgreSQL 16 in a Docker container on the VPS since 07/10/2026. H2 remains limited to tests and local development.")
put(risks.cell(6, 2), "Resolved")
put(risks.cell(6, 3), "Low")
put(risks.cell(6, 4), "Maintain PostgreSQL backups and migration checks; keep H2 isolated to tests and local development.")
put(risks.cell(8, 1), "The mobile application was moved out of Iteration 1 to a later iteration (BM03 change 2). A five-commit Expo/React Native prototype exists, but no APK has been built. AI scope beyond Gemini reading suggestions remains subject to Final v3.")
put(risks.cell(8, 4), "Do not count the mobile prototype as a delivered build. Recalculate effort only after Final v3 fixes the remaining AI and learner-model scope.")
put(risks.cell(9, 1), "The product uses PARENT and TEACHER plans for individual adult customers. Standard/Edu names were withdrawn in Final v2 on 14/10/2026.")
put(risks.cell(9, 4), "Use PARENT and TEACHER consistently in requirements, UI, tests and reports; retain test prices until the business model is approved.")

# Training and tools/infrastructure.
training = doc.tables[4]
put(training.cell(1, 2), "Completed before production migrated to PostgreSQL 16 on 07/10/2026")
put(training.cell(1, 3), "Completed")

tools = doc.tables[8]
put(tools.cell(2, 1), "React Native with Expo, Android; prototype source only, planned for a later iteration; no APK built.")
put(tools.cell(3, 1), "PostgreSQL 16 in Docker on the production VPS; H2 for tests and local development only.")
put(tools.cell(12, 1), "Gemini is used in Studio to suggest reading guidance for generated narration. Other AI/learner-model scope awaits Final v3.")
put(tools.cell(13, 1), "PayOS, implemented and running in production; current plan prices are test values set by the administrator.")

# Responsibility matrix: preserve the verified D/S split and make Triệu's omitted work explicit.
resp = doc.tables[6]
put(resp.cell(13, 0), "Adult-facing front end (auth/API client, parent, teacher and admin consoles, workspace, plans, payment and landing)")
put(resp.cell(13, 2), "D")
mobile = resp.add_row()
values = [
    "Mobile application prototype for parent and teacher monitoring (later iteration)",
    "R", "D", "I", "I",
]
for index, value in enumerate(values):
    put(mobile.cells[index], value)

for p in doc.paragraphs:
    if p.text.startswith("The four columns are the four team members."):
        p.text = (
            "The four columns are the four team members. Four rows follow the split agreed at the meeting of 17/09/2026; "
            "the remaining rows record the later allocation. On 06/11/2026 the front-end rows were aligned with Iteration 1 commit history: "
            "Anh leads the eight-chapter gameplay, while Triệu supports chapter/simulation refactoring and leads the adult-facing front end. "
            "On 09/11/2026 Triệu's auth/API client, workspace, plans, payment, landing and five-commit mobile prototype were made explicit; "
            "the mobile application remains scheduled for a later iteration and has no APK build."
        )
    if p.text.startswith("Reviewing: No change reaches the main branch directly."):
        p.text = (
            "Reviewing: Changes reach the main branch through pull requests. The front-end history includes merged pull requests through PR #45 as of 09/11/2026. "
            "A reviewer is expected to read the change and run the branch, not only inspect the diff. Documents follow the same peer-review rule."
        )
    if p.text.startswith("System Testing: A full run through the use cases"):
        p.text = (
            "System Testing: A full run through the use cases is performed on the deployed build. Offline behaviour is checked only for a chapter already loaded in the browser, "
            "because NFR-02 does not promise first-time loading without the server."
        )

# Detailed, truthful record for today's changes; do not backdate into 27/09.
record = doc.tables[0]
row = record.add_row()
for index, value in enumerate([
    "09/11/2026",
    "M",
    "Nguyễn Gia Triệu",
    "Aligned RP2 with verified code and production: PayOS live; PostgreSQL 16 production/H2 test-only; PARENT/TEACHER names; reward shop removed; mobile moved to a later iteration with prototype source only and no APK; clarified Triệu's front-end/mobile responsibilities, pull-request status and offline scope. Effort total awaits Final v3.",
]):
    put(row.cells[index], value)

target.parent.mkdir(parents=True, exist_ok=True)
doc.save(target)
print(target)
