from pathlib import Path
from docx import Document


OUT = Path(r"D:\DO-AN\SEQ\outputs\record-cleanup-20261109")
OUT.mkdir(parents=True, exist_ok=True)


# Report 1: clear the generic 27/09 contribution row; retain the factual 09/11 row.
r1_src = Path(r"D:\DO-AN\SEQ\outputs\report1-audit-20261109\Report1_Project Introduction.docx")
r1 = Document(r1_src)
for cell in r1.tables[0].rows[6].cells:
    cell.text = ""
r1_out = OUT / "Report1_Project Introduction.docx"
r1.save(r1_out)


# Report 2: remove the appended generic contribution row completely.
r2_src = Path(r"D:\DO-AN\SEQ\tmp\contribution-audit\verify_report2.docx")
r2 = Document(r2_src)
table = r2.tables[0]
last = table.rows[-1]
text = " | ".join(cell.text for cell in last.cells)
if "Nguyễn Gia Triệu" not in text or "Contributed the front-end" not in text:
    raise RuntimeError(f"Unexpected last Record of Changes row: {text}")
table._tbl.remove(last._tr)
r2_out = OUT / "Report2_Project Management Plan.docx"
r2.save(r2_out)

print(r1_out)
print(r2_out)
