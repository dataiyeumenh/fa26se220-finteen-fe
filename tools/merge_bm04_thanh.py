from pathlib import Path
from docx import Document


BASE = Path(r"D:\DO-AN\SEQ\outputs\bm04-final-20261109\SEP490_FA26SE220_R2_Commitment.docx")
OUT = Path(r"D:\DO-AN\SEQ\outputs\bm04-final-20261109\SEP490_FA26SE220_R2_Commitment_v1.0_Thanh7.2Merged.docx")


def put(table, row, col, value):
    table.cell(row, col).text = value


doc = Document(BASE)

# 7.2 Member 2 — Nguyễn Phương Thanh. Keep the v1.0 table heading "Notes".
ownership = doc.tables[41]
put(ownership, 2, 2, "Confirmed by member, 09/11/2026")
put(ownership, 4, 2, "Confirmed by member, 09/11/2026")
put(ownership, 5, 1, "NFR-3, NFR-4, NFR-5")
put(ownership, 5, 2, "Confirmed by member, 09/11/2026")

delivery = doc.tables[42]
put(delivery, 1, 1, "16 (WF-01 13 + NFR-3/4/5 3)")
put(delivery, 1, 2, "Written; kept passing until Defense 1.1")
put(delivery, 2, 1, "16 of 16")
put(delivery, 2, 2, "Kept passing in CI until Defense 1.1")
put(delivery, 3, 1, "DS-01a, DS-01b")
put(delivery, 3, 2, "At Defense 1.1")
put(delivery, 4, 1, "SR-02, SR-03 (BE), SR-04, SR-08, SR-18, SR-19, SR-32, SR-33")
put(delivery, 4, 2, "Before Defense 1.1")
put(delivery, 5, 1, "SRS: knowledge tracing and OS-01 (SR-02), FR achievements (SR-04), guest play (SR-08), LearnerGroup state machine (SR-18), RunState 3.3.4 (SR-19); SDD 1.2.1 and Table 4-1 (SR-32), two 501 endpoints (SR-33)")
put(delivery, 5, 2, "Before Defense 1.1")

# Reviewer-only verification cells remain fully blank.
verification = doc.tables[43]
for col in range(len(verification.columns)):
    put(verification, 1, col, "")

# Member confirmation has no signature; date only.
confirmation = doc.tables[44]
put(confirmation, 0, 0, "Date")
put(confirmation, 0, 1, "09/11/2026")

# 8.2 By member — Thanh row only.
summary = doc.tables[56]
put(summary, 2, 3, "16")
put(summary, 2, 4, "16 of 16")
put(summary, 2, 5, "DS-01a, DS-01b")
put(summary, 2, 6, "")

doc.save(OUT)
print(OUT)
