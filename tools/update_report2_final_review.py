from pathlib import Path
import sys

from docx import Document


source = Path(sys.argv[1])
target = Path(sys.argv[2])
doc = Document(source)


def put(table, row, col, text):
    doc.tables[table].cell(row, col).text = str(text)


for paragraph in doc.paragraphs:
    text = paragraph.text.strip()
    if text.startswith("Reviewing: Changes reach the main branch through pull requests."):
        paragraph.text = (
            "Reviewing: Changes reach the main branch through pull requests. As of 09/11/2026, the front-end history includes merged pull requests through PR #49 and the back-end history through PR #56. "
            "A reviewer is expected to read the change and run the branch, not only inspect the diff. Documents follow the same peer-review rule."
        )

# WBS corrections.
put(1, 10, 3, 6)
put(1, 11, 3, 31)
put(1, 16, 1, "FR-19: Reward shop — removed by supervisor instruction of 01/10/2026, recorded in registration Final v2 (14/10/2026)")

# Risks 5 and 6: remove unsupported training and CI-migration claims.
put(3, 5, 1, "Pull-request discipline remains an ongoing process risk as the repositories continue to change.")
put(3, 5, 2, "Medium")
put(3, 5, 3, "Medium")
put(3, 5, 4, "Require review before merging pull requests. The current BE workflow runs mvn test only; no Flyway database-migration check is configured.")
put(3, 6, 4, "Maintain PostgreSQL backups and periodically verify that they can be restored; keep H2 isolated to tests and local development.")

# Training table: preserve the plan but do not claim that a training session occurred.
put(4, 1, 2, "As needed during implementation; no formal session recorded")
put(4, 1, 3, "—")

# Update today's record precisely.
put(0, 7, 3, "Aligned RP2 with verified code and production; corrected FR-20 effort, reward-shop source/date wording, pull-request counts, and removed unsupported PostgreSQL-training and CI-migration claims. Final-v3 scope and total effort remain pending.")

target.parent.mkdir(parents=True, exist_ok=True)
doc.save(target)
print(target)
