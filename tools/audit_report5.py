from collections import Counter
from pathlib import Path
import re
import sys

from docx import Document
from openpyxl import load_workbook


docx_path = Path(sys.argv[1])
xlsx_path = Path(sys.argv[2])

doc = Document(docx_path)
print("=== DOCX PARAGRAPHS ===")
for i, p in enumerate(doc.paragraphs):
    text = " ".join(p.text.split())
    if text and re.search(r"pending|todo|tbd|195|221|222|539|530|90|89|MAN-03|CI|Triệu|Trieu", text, re.I):
        print(f"P{i}: {text}")

print("=== DOCX TABLE MATCHES ===")
for ti, table in enumerate(doc.tables):
    for ri, row in enumerate(table.rows):
        text = " | ".join(" ".join(c.text.split()) for c in row.cells)
        if re.search(r"pending|todo|tbd|195|221|222|539|530|90|89|MAN-03|CI|Triệu|Trieu", text, re.I):
            print(f"T{ti}R{ri}: {text}")

wb = load_workbook(xlsx_path, data_only=False)
print("=== XLSX SHEETS ===")
for ws in wb.worksheets:
    print(f"{ws.title}: {ws.max_row}x{ws.max_column}")

keywords = re.compile(r"pending|todo|tbd|not run|not executed|hưng|confirm|manual|MAN-03|195|221|222|539|530|90|89|Triệu|Trieu", re.I)
print("=== XLSX MATCHES ===")
for ws in wb.worksheets:
    for row in ws.iter_rows():
        for cell in row:
            value = cell.value
            if value is not None and keywords.search(str(value)):
                print(f"{ws.title}!{cell.coordinate}: {value}")

print("=== STATUS COUNTS ===")
for ws in wb.worksheets:
    counts = Counter()
    for row in ws.iter_rows():
        for cell in row:
            if isinstance(cell.value, str):
                value = cell.value.strip().lower()
                if value in {"passed", "failed", "pending", "not run", "blocked", "pass", "fail"}:
                    counts[value] += 1
    if counts:
        print(ws.title, dict(counts))

print("=== FORMULA ERRORS / FORMULAS ===")
for ws in wb.worksheets:
    formulas = []
    for row in ws.iter_rows():
        for cell in row:
            if isinstance(cell.value, str) and cell.value.startswith("="):
                formulas.append((cell.coordinate, cell.value))
            if isinstance(cell.value, str) and re.search(r"#REF!|#DIV/0!|#VALUE!|#NAME\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", cell.value):
                print(f"ERROR {ws.title}!{cell.coordinate}: {cell.value}")
    if formulas:
        print(ws.title, len(formulas), formulas[:12])
