from pathlib import Path
from docx import Document


SRC = Path(r"D:\DO-AN\SEQ\outputs\lead-handoff-20261109\SWP490_FA26SE220_R2_Commitment_Draft0.4.docx")
OUT_DIR = Path(r"D:\DO-AN\SEQ\outputs\bm04-final-20261109")
OUT = OUT_DIR / "SEP490_FA26SE220_R2_Commitment.docx"


def replace_in_paragraph(paragraph, old, new):
    for run in paragraph.runs:
        if old in run.text:
            run.text = run.text.replace(old, new)


def set_cell(table, row, col, text):
    table.cell(row, col).text = text


doc = Document(SRC)
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Replace the course code everywhere while retaining run formatting.
for paragraph in doc.paragraphs:
    replace_in_paragraph(paragraph, "SWP490", "SEP490")
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                replace_in_paragraph(paragraph, "SWP490", "SEP490")
for section in doc.sections:
    for container in (section.header, section.footer):
        for paragraph in container.paragraphs:
            replace_in_paragraph(paragraph, "SWP490", "SEP490")
        for table in container.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        replace_in_paragraph(paragraph, "SWP490", "SEP490")

# Document information.
set_cell(doc.tables[0], 7, 1, "1.0")
set_cell(doc.tables[0], 8, 1, "09/11/2026")

# Section 7.1 — proposed commitments for the team leader.
t = doc.tables[36]
set_cell(t, 2, 2, "Member must confirm final ownership")
set_cell(t, 4, 2, "Member must confirm")
set_cell(t, 5, 2, "Member must confirm")
t = doc.tables[37]
set_cell(t, 1, 1, "46 (WF-04: 19; WF-05: 25; NFR-1: 1; NFR-2: 1)")
set_cell(t, 1, 2, "Written; kept passing until Defense 1.1")
set_cell(t, 2, 1, "45 of 46 (NFR-1 is manual)")
set_cell(t, 2, 2, "Written; kept passing until Defense 1.1")
set_cell(t, 3, 1, "4: DS-04a, DS-04b, DS-05a, DS-05b")
set_cell(t, 3, 2, "At Defense 1.1")
set_cell(t, 4, 1, "SR-05, SR-07, SR-09, SR-10, SR-11, SR-13, SR-15, SR-16, SR-17, SR-21, SR-23–SR-31; RV2-01–RV2-06")
set_cell(t, 4, 2, "Before Defense 1.1")
set_cell(t, 5, 1, "Report 3 sections 3.4–3.5 and overview (RV2-01–RV2-05); Report 4 sections 1.2.1, 3.5, 4.3–4.4, C4 and state machines; Report 5 test counts (SR-30)")
set_cell(t, 5, 2, "Before Defense 1.1")

# Section 7.3 — Triệu has confirmed feasibility.
set_cell(doc.tables[47], 4, 2, "Before Defense 1.1")

# Section 7.4 — no NFR is assigned to HA.
set_cell(doc.tables[51], 5, 1, "None")
set_cell(doc.tables[51], 5, 2, "")

# Reviewer-only fields are intentionally blank.
for idx in (38, 43, 48, 53):
    table = doc.tables[idx]
    for col in range(len(table.columns)):
        set_cell(table, 1, col, "")
for idx in (10, 16, 22, 28, 34):
    set_cell(doc.tables[idx], 0, 1, "")
doc.paragraphs[74].text = ""

# Member confirmation: no signatures; date only.
for idx in (39, 44, 49, 54):
    table = doc.tables[idx]
    set_cell(table, 0, 0, "Date")
    set_cell(table, 0, 1, "09/11/2026")

# Section 8.2 summary.
t = doc.tables[56]
set_cell(t, 1, 3, "46")
set_cell(t, 1, 4, "45 of 46")
set_cell(t, 1, 6, "")
set_cell(t, 2, 3, "16")
set_cell(t, 2, 4, "16 of 16")
set_cell(t, 2, 6, "")
set_cell(t, 3, 2, "TCH-1 (FE of ADL-2, LRN-1)")
set_cell(t, 3, 6, "")
set_cell(t, 4, 3, "10")
set_cell(t, 4, 4, "10 of 10")
set_cell(t, 4, 6, "")
set_cell(t, 5, 6, "")

# Section 11: only team leader name/date; all signature cells remain blank.
t = doc.tables[60]
for row in (1, 2, 3):
    for col in (1, 2, 3):
        set_cell(t, row, col, "")
set_cell(t, 4, 1, "Vũ Nam Hưng")
set_cell(t, 4, 2, "")
set_cell(t, 4, 3, "09/11/2026")

doc.core_properties.title = "SEP490 FA26SE220 Review 2 Commitment"
doc.save(OUT)
print(OUT)
