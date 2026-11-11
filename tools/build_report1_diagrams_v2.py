from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, ElementTree

from PIL import Image, ImageDraw, ImageFont


OUT = Path(r"D:\DO-AN\SEQ\outputs\rp1-rp2-final-20261109")
OUT.mkdir(parents=True, exist_ok=True)
FONT = Path(r"C:\Windows\Fonts\arial.ttf")
FONT_B = Path(r"C:\Windows\Fonts\arialbd.ttf")
PINK = "#f3b3b5"
YELLOW = "#ffdc75"
INK = "#152744"


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_B if bold else FONT), size)


def rounded(draw, box, fill, radius=20, width=3):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=INK, width=width)


def centered(draw, xy, text, f, fill="#111111", spacing=7):
    draw.multiline_text(xy, text, font=f, fill=fill, anchor="mm", align="center", spacing=spacing)


def arrow(draw, start, end):
    draw.line((*start, *end), fill=INK, width=4)
    x, y = end
    if start[0] < end[0]:
        draw.polygon([(x, y), (x - 18, y - 10), (x - 18, y + 10)], fill=INK)
    else:
        draw.polygon([(x, y), (x + 18, y - 10), (x + 18, y + 10)], fill=INK)


def poly_arrow(draw, points):
    draw.line(points, fill=INK, width=4, joint="curve")
    x, y = points[-1]
    px, py = points[-2]
    if px < x:
        draw.polygon([(x, y), (x - 18, y - 10), (x - 18, y + 10)], fill=INK)
    elif px > x:
        draw.polygon([(x, y), (x + 18, y - 10), (x + 18, y + 10)], fill=INK)
    elif py < y:
        draw.polygon([(x, y), (x - 10, y - 18), (x + 10, y - 18)], fill=INK)
    else:
        draw.polygon([(x, y), (x - 10, y + 18), (x + 10, y + 18)], fill=INK)


def drawio(name, width, height, vertices, edges):
    mxfile = Element("mxfile", host="app.diagrams.net", modified="2026-11-09T08:00:00.000Z", agent="Codex", version="24.7.17")
    diagram = SubElement(mxfile, "diagram", id=name, name="Page-1")
    model = SubElement(diagram, "mxGraphModel", dx="1200", dy="800", grid="1", gridSize="10", guides="1", tooltips="1", connect="1", arrows="1", fold="1", page="1", pageScale="1", pageWidth=str(width), pageHeight=str(height), math="0", shadow="0")
    root = SubElement(model, "root")
    SubElement(root, "mxCell", id="0")
    SubElement(root, "mxCell", id="1", parent="0")
    for vertex in vertices:
        vid, label, x, y, w, h, fill, rounded_shape = vertex
        style = f"rounded={1 if rounded_shape else 0};whiteSpace=wrap;html=1;fillColor={fill};strokeColor={INK};fontColor=#111111;fontFamily=Arial;fontSize=18;align=center;verticalAlign=middle;strokeWidth=2;"
        cell = SubElement(root, "mxCell", id=vid, value=label, style=style, vertex="1", parent="1")
        SubElement(cell, "mxGeometry", x=str(x), y=str(y), width=str(w), height=str(h), **{"as": "geometry"})
    for index, (source, target) in enumerate(edges, start=1):
        style = f"edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor={INK};strokeWidth=2;"
        cell = SubElement(root, "mxCell", id=f"e{index}", style=style, edge="1", parent="1", source=source, target=target)
        SubElement(cell, "mxGeometry", relative="1", **{"as": "geometry"})
    ElementTree(mxfile).write(OUT / f"{name}.drawio", encoding="utf-8", xml_declaration=True)


# Figure 3: system context. No footnote or explanatory sentence inside the figure.
im = Image.new("RGB", (2046, 1040), "white")
d = ImageDraw.Draw(im)
centered(d, (1023, 52), "FinTeen system context", font(40, True))
rounded(d, (790, 330, 1256, 730), YELLOW, radius=55)
centered(d, (1023, 530), "FinTeen\nWeb application and API", font(38, True))

left = [
    ((55, 120, 515, 290), "Guest / Adult", "Register, sign in, buy a plan"),
    ((55, 435, 515, 605), "Child", "Seat code + PIN; play chapters"),
    ((55, 750, 515, 920), "Internal users", "Admin and Content Studio"),
]
right = [
    ((1530, 85, 1990, 225), "PayOS", "Payments"),
    ((1530, 270, 1990, 410), "Firebase", "Google sign-in"),
    ((1530, 455, 1990, 595), "Brevo", "SMTP mail"),
    ((1530, 640, 1990, 780), "Cloudflare", "CDN"),
    ((1530, 825, 1990, 965), "Gemini / OpenRouter", "Studio reading suggestions"),
]
for box, title, detail in left + right:
    rounded(d, box, PINK, radius=18)
    x = (box[0] + box[2]) // 2
    y = (box[1] + box[3]) // 2
    centered(d, (x, y - 25), title, font(25, True))
    centered(d, (x, y + 29), detail, font(19))
for (box, _, _), core_y in zip(left, (400, 530, 660)):
    source_y = (box[1] + box[3]) // 2
    poly_arrow(d, [(box[2], source_y), (660, source_y), (660, core_y), (790, core_y)])
for (box, _, _), core_y in zip(right, (370, 450, 530, 610, 690)):
    target_y = (box[1] + box[3]) // 2
    poly_arrow(d, [(1256, core_y), (1390, core_y), (1390, target_y), (box[0], target_y)])
rounded(d, (720, 825, 1326, 965), "#ffffff", radius=15)
centered(d, (1023, 870), "GitHub Actions + VieNeu-TTS", font(25, True))
centered(d, (1023, 920), "Pre-generated narration audio", font(19))
arrow(d, (1023, 825), (1023, 730))
im.save(OUT / "figure3-context.png", optimize=True)

fig3_vertices = [
    ("core", "<b>FinTeen</b><br>Web application and API", 390, 270, 300, 260, YELLOW, True),
    ("adult", "<b>Guest / Adult</b><br>Register, sign in, buy a plan", 20, 70, 280, 110, PINK, True),
    ("child", "<b>Child</b><br>Seat code + PIN; play chapters", 20, 285, 280, 110, PINK, True),
    ("internal", "<b>Internal users</b><br>Admin and Content Studio", 20, 500, 280, 110, PINK, True),
    ("payos", "<b>PayOS</b><br>Payments", 780, 20, 280, 90, PINK, True),
    ("firebase", "<b>Firebase</b><br>Google sign-in", 780, 135, 280, 90, PINK, True),
    ("brevo", "<b>Brevo</b><br>SMTP mail", 780, 250, 280, 90, PINK, True),
    ("cloudflare", "<b>Cloudflare</b><br>CDN", 780, 365, 280, 90, PINK, True),
    ("gemini", "<b>Gemini / OpenRouter</b><br>Studio reading suggestions", 780, 480, 280, 100, PINK, True),
    ("voice", "<b>GitHub Actions + VieNeu-TTS</b><br>Pre-generated narration audio", 390, 610, 300, 100, "#ffffff", True),
]
drawio("Figure 3 System Context", 1100, 760, fig3_vertices, [(x, "core") for x in ["adult", "child", "internal"]] + [("core", x) for x in ["payos", "firebase", "brevo", "cloudflare", "gemini"]] + [("voice", "core")])


# Figure 4: plan capabilities. No caption-like prose inside the figure.
im = Image.new("RGB", (2046, 850), "white")
d = ImageDraw.Draw(im)
centered(d, (1023, 62), "PARENT and TEACHER plans", font(42, True))
rounded(d, (90, 145, 880, 780), PINK)
rounded(d, (1166, 145, 1956, 780), YELLOW)
d.text((145, 195), "PARENT", font=font(40, True), fill="#111111")
d.multiline_text((145, 290), "• FAMILY group\n• Up to 4 child seats\n• Chapter game\n• Learner reports", font=font(31), fill="#111111", spacing=22)
d.text((1220, 195), "TEACHER", font=font(40, True), fill="#111111")
d.multiline_text((1220, 290), "• CLASS group\n• Up to 40 child seats\n• Parental consent before first seat\n• Chapter game\n• Learner reports\n• Class quizzes and reports", font=font(30), fill="#111111", spacing=18)
im.save(OUT / "figure4-plans.png", optimize=True)

fig4_vertices = [
    ("parent", "<b>PARENT</b><br><br>FAMILY group<br>Up to 4 child seats<br>Chapter game<br>Learner reports", 60, 120, 420, 470, PINK, True),
    ("teacher", "<b>TEACHER</b><br><br>CLASS group<br>Up to 40 child seats<br>Parental consent before first seat<br>Chapter game<br>Learner reports<br>Class quizzes and reports", 620, 120, 420, 470, YELLOW, True),
]
drawio("Figure 4 Plan Capabilities", 1100, 700, fig4_vertices, [])


# Figure 5: retain current wording while Final v3 is pending.
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
    rounded(d, (x1, y1, x2, y2), PINK, radius=8, width=2)
    centered(d, ((x1+x2)//2, y1+52), title, font(27, True))
    centered(d, ((x1+x2)//2, y1+100), detail, font(21))
for i, (x1, y1, x2, y2, title, detail) in enumerate(bottom):
    rounded(d, (x1, y1, x2, y2), YELLOW if i == 1 else "#ffffff", radius=6, width=2)
    centered(d, ((x1+x2)//2, y1+52), title, font(27, True))
    centered(d, ((x1+x2)//2, y1+105), detail, font(20))
for x in (307, 1022, 1737):
    d.line((x, 205, x, 430), fill=INK, width=3)
    d.polygon([(x, 430), (x-10, 410), (x+10, 410)], fill=INK)
d.line((1240, 505, 1520, 505), fill=INK, width=3)
d.polygon([(1520, 505), (1500, 495), (1500, 515)], fill=INK)
centered(d, (1380, 470), "planned mastery display", font(18), "#5b6472")
im.save(OUT / "figure5-records.png", optimize=True)

fig5_vertices = [
    ("choice", "<b>Dialogue choice</b><br>Preference; no right answer", 30, 40, 260, 100, PINK, False),
    ("game", "<b>Mini-game answer</b><br>Has a correct answer", 420, 40, 260, 100, PINK, False),
    ("quiz", "<b>Quiz answer</b><br>Scored against answer key", 810, 40, 260, 100, PINK, False),
    ("indicators", "<b>Five indicators</b><br>Wealth, saving, happiness, risk, goal", 30, 320, 260, 110, "#ffffff", False),
    ("tracing", "<b>Knowledge tracing</b><br>Planned mastery by concept", 420, 320, 260, 110, YELLOW, False),
    ("results", "<b>Learner and class results</b><br>Read by the group owner", 810, 320, 260, 110, "#ffffff", False),
]
drawio("Figure 5 Learning Records", 1100, 500, fig5_vertices, [("choice", "indicators"), ("game", "tracing"), ("quiz", "results"), ("tracing", "results")])

print(OUT)
