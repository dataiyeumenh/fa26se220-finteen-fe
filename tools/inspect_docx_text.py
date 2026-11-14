from pathlib import Path
import sys

from docx import Document


path = Path(sys.argv[1])
document = Document(path)

for index, paragraph in enumerate(document.paragraphs):
    text = paragraph.text.strip().replace("\n", " ")
    if text:
        print(f"P{index}: {text}")

for table_index, table in enumerate(document.tables):
    print(f"\nTABLE {table_index} ({len(table.rows)}x{len(table.columns)})")
    for row_index, row in enumerate(table.rows):
        cells = [cell.text.strip().replace("\n", " / ") for cell in row.cells]
        print(f"R{row_index}: " + " | ".join(cells))
