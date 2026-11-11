from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


OUT = Path(r"D:\DO-AN\SEQ\tmp\report1-update-assets")
OUT.mkdir(parents=True, exist_ok=True)
FONT = Path(r"C:\Windows\Fonts\arial.ttf")
FONT_B = Path(r"C:\Windows\Fonts\arialbd.ttf")


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_B if bold else FONT), size)


def rounded(draw, box, fill, outline="#152744", radius=24, width=3):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def centered(draw, xy, text, f, fill="#152744"):
    draw.multiline_text(xy, text, font=f, fill=fill, anchor="mm", align="center", spacing=8)


# Figure 4 — current plan model.
im = Image.new("RGB", (2046, 1005), "white")
d = ImageDraw.Draw(im)
centered(d, (1023, 65), "PARENT and TEACHER plans", font(42, True))
rounded(d, (90, 145, 880, 760), "#f3b3b5")
rounded(d, (1166, 145, 1956, 760), "#ffdc75")
d.text((145, 195), "PARENT", font=font(40, True), fill="#111111")
d.multiline_text((145, 290), "• FAMILY group\n• Up to 4 child seats\n• Chapter game\n• Learner reports", font=font(31), fill="#111111", spacing=18)
d.text((1220, 195), "TEACHER", font=font(40, True), fill="#111111")
d.multiline_text((1220, 290), "• CLASS group\n• Up to 40 child seats\n• Parental consent before first seat\n• Class quizzes and reports", font=font(31), fill="#111111", spacing=18)
centered(d, (1023, 845), "PayOS purchases grant time-limited entitlements.\nOne open group is allowed per owner and context.", font(30))
centered(d, (1023, 945), "Current production prices are administrator-set test values.", font(25), "#5b6472")
im.save(OUT / "figure4-plans.png", optimize=True)


# Figure 3 — concise current system context.
im = Image.new("RGB", (2046, 920), "white")
d = ImageDraw.Draw(im)
centered(d, (1023, 48), "FinTeen system context", font(40, True))
rounded(d, (760, 245, 1286, 685), "#ffdc75", radius=60)
centered(d, (1023, 465), "FinTeen\nWeb application and API", font(42, True), "#111111")

boxes = [
    ((55, 115, 495, 300), "Guest / Adult", "Register, sign in, buy a plan"),
    ((55, 365, 495, 550), "Child", "Seat code + PIN; play chapters"),
    ((55, 615, 495, 800), "Internal users", "Admin and Content Studio"),
    ((1550, 115, 1990, 300), "PayOS", "Production payment integration"),
    ((1550, 365, 1990, 550), "SMTP server", "Verification and account mail"),
    ((1550, 615, 1990, 800), "Language-model service", "Stretch item; not implemented"),
]
for box, title, detail in boxes:
    rounded(d, box, "#f3b3b5")
    x = (box[0] + box[2]) // 2
    y = (box[1] + box[3]) // 2
    centered(d, (x, y - 25), title, font(27, True), "#111111")
    centered(d, (x, y + 35), detail, font(20), "#111111")

for y in (205, 455, 705):
    d.line((495, y, 760, y), fill="#152744", width=4)
    d.polygon([(760, y), (740, y - 10), (740, y + 10)], fill="#152744")
for y in (205, 455, 705):
    d.line((1286, y, 1550, y), fill="#152744", width=4)
    d.polygon([(1550, y), (1530, y - 10), (1530, y + 10)], fill="#152744")

centered(d, (1023, 860), "The Android application remains in scope for a later iteration; a prototype exists.", font(25), "#5b6472")
im.save(OUT / "figure3-context.png", optimize=True)


# Figure 5 — current records and planned learner-model use.
im = Image.new("RGB", (2046, 670), "white")
d = ImageDraw.Draw(im)
top = [
    (90, 65, 525, 205, "Dialogue choice", "Preference; no right answer"),
    (805, 65, 1240, 205, "Mini-game answer", "Has a correct answer"),
    (1520, 65, 1955, 205, "Quiz answer", "Scored against answer key"),
]
bottom = [
    (90, 430, 525, 580, "Five indicators", "Wealth, saving, happiness, risk, goal"),
    (805, 430, 1240, 580, "Knowledge tracing", "Planned mastery by concept"),
    (1520, 430, 1955, 580, "Learner and class results", "Read by the group owner"),
]
for x1, y1, x2, y2, title, detail in top:
    rounded(d, (x1, y1, x2, y2), "#f3b3b5", radius=8, width=2)
    centered(d, ((x1+x2)//2, y1+52), title, font(27, True), "#111111")
    centered(d, ((x1+x2)//2, y1+100), detail, font(21), "#111111")
for i, (x1, y1, x2, y2, title, detail) in enumerate(bottom):
    rounded(d, (x1, y1, x2, y2), "#ffdc75" if i == 1 else "#ffffff", radius=6, width=2)
    centered(d, ((x1+x2)//2, y1+52), title, font(27, True), "#111111")
    centered(d, ((x1+x2)//2, y1+105), detail, font(20), "#111111")
for x in (307, 1022, 1737):
    d.line((x, 205, x, 430), fill="#152744", width=3)
    d.polygon([(x, 430), (x-10, 410), (x+10, 410)], fill="#152744")
d.line((1240, 505, 1520, 505), fill="#152744", width=3)
d.polygon([(1520, 505), (1500, 495), (1500, 515)], fill="#152744")
centered(d, (1380, 470), "planned mastery display", font(18), "#5b6472")
im.save(OUT / "figure5-records.png", optimize=True)

print(OUT)
