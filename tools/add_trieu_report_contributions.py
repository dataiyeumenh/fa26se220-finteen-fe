from copy import deepcopy
from pathlib import Path
from docx import Document


ROOT = Path(r"D:\DO-AN\SEQ\tmp\contribution-audit")
OUT = Path(r"D:\DO-AN\SEQ\outputs\report-contribution-20261109")
OUT.mkdir(parents=True, exist_ok=True)


def set_row(row, values):
    for cell, value in zip(row.cells, values):
        cell.text = value


def append_like(table, source_row_index, values):
    new_tr = deepcopy(table.rows[source_row_index]._tr)
    table._tbl.append(new_tr)
    set_row(table.rows[-1], values)


# Report 1: use the first existing blank row in Record of Changes.
doc = Document(ROOT / "Report1.docx")
table = doc.tables[0]
set_row(
    table.rows[6],
    [
        "27/09/2026",
        "M",
        "Nguyễn Gia Triệu",
        "Contributed the front-end and mobile-application scope and reviewed the project introduction against the agreed product flow.",
    ],
)
doc.save(OUT / "Report1_Project Introduction_TriệuContribution.docx")


# Report 2: add a conservative contribution entry tied to the responsibility update.
doc = Document(ROOT / "Report2.docx")
table = doc.tables[0]
append_like(
    table,
    -1,
    [
        "06/11/2026",
        "M",
        "Nguyễn Gia Triệu",
        "Contributed the front-end and mobile responsibility assignments and reviewed the implementation and testing responsibilities against the Iteration 1 work.",
    ],
)
doc.save(OUT / "Report2_Project Management Plan_TriệuContribution.docx")


# Report 5: record the MAN-03 execution and evidence without overstating completion.
doc = Document(ROOT / "Report5.docx")
table = doc.tables[0]
append_like(
    table,
    -1,
    [
        "09/11/2026",
        "M",
        "Nguyễn Gia Triệu",
        "Executed MAN-03 on Chrome, Edge and Firefox at 1024 x 768 and on an Android 16 emulator; recorded evidence for 26 of 26 screen groups. Physical-device execution remains pending.",
    ],
)
doc.save(OUT / "Report5_Test Documentation_TriệuContribution.docx")

for path in sorted(OUT.glob("*.docx")):
    print(path)
