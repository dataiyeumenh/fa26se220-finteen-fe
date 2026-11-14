from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import sys


root = Path(sys.argv[1])
output = Path(sys.argv[2])
paths = sorted(root.glob("page-*.png"))
font = ImageFont.load_default()
cols = 3
cell_w, cell_h = 500, 720
rows = (len(paths) + cols - 1) // cols
canvas = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
draw = ImageDraw.Draw(canvas)
for index, path in enumerate(paths):
    image = Image.open(path).convert("RGB")
    image.thumbnail((cell_w - 20, cell_h - 35))
    x = (index % cols) * cell_w + (cell_w - image.width) // 2
    y = (index // cols) * cell_h + 25
    canvas.paste(image, (x, y))
    draw.text(((index % cols) * cell_w + 8, (index // cols) * cell_h + 6), path.name, fill="black", font=font)
canvas.save(output, quality=88)
