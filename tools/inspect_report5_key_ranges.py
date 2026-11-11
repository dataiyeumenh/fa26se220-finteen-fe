from openpyxl import load_workbook
import sys

path = sys.argv[1]
form = load_workbook(path, data_only=False)
data = load_workbook(path, data_only=True)


def show(sheet, cell_range):
    wsf = form[sheet]
    wsd = data[sheet]
    print(f"\n[{sheet}!{cell_range}]")
    for rf, rd in zip(wsf[cell_range], wsd[cell_range]):
        parts = []
        for cf, cd in zip(rf, rd):
            value = cd.value if isinstance(cf.value, str) and cf.value.startswith("=") else cf.value
            parts.append(f"{cf.coordinate}={value!r}")
        print(" | ".join(parts))


for target in [
    ("Cover", "B8:F15"),
    ("Test Cases", "B35:F44"),
    ("Test Statistics", "B3:H35"),
    ("NFR & Manual", "A1:R20"),
    ("FE Automated", "A1:R10"),
    ("FE Browser UI", "A1:R10"),
]:
    show(*target)

for name in ["Auth & Accounts", "Plans & Payment", "Groups & Seats", "Play & Dashboard", "Quiz & Reports", "Content Studio", "Admin Console", "Platform", "FE Automated", "FE Browser UI", "NFR & Manual"]:
    show(name, "A2:R8")
