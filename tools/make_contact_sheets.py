from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import sys


root = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
font = ImageFont.load_default()

groups = {
    "chrome": sorted((root / "chrome").glob("*.png")),
    "edge": sorted((root / "edge").glob("*.png")),
    "firefox": sorted((root / "firefox").glob("*.png")),
    "android": sorted((root / "android-emulator").glob("*.png")),
}

for name, paths in groups.items():
    thumb_w, thumb_h = 600, 380
    cols = 2
    rows = (len(paths) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + 30)), "white")
    draw = ImageDraw.Draw(canvas)
    for index, path in enumerate(paths):
        image = Image.open(path).convert("RGB")
        image.thumbnail((thumb_w - 12, thumb_h - 12))
        x = (index % cols) * thumb_w + (thumb_w - image.width) // 2
        y = (index // cols) * (thumb_h + 30) + 24 + (thumb_h - image.height) // 2
        canvas.paste(image, (x, y))
        draw.text(((index % cols) * thumb_w + 6, (index // cols) * (thumb_h + 30) + 4), path.name, fill="black", font=font)
    canvas.save(out / f"{name}.jpg", quality=88)
