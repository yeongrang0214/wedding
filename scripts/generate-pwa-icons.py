from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "icons"
SERIF = Path(r"C:\Windows\Fonts\georgiai.ttf")
SANS = Path(r"C:\Windows\Fonts\arial.ttf")


def centered_text(draw, xy, text, font, fill, spacing=0):
    if spacing == 0:
        box = draw.textbbox((0, 0), text, font=font)
        draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2 - box[1]), text, font=font, fill=fill)
        return

    widths = [draw.textlength(char, font=font) for char in text]
    total = sum(widths) + spacing * (len(text) - 1)
    cursor = xy[0] - total / 2
    for char, width in zip(text, widths):
        box = draw.textbbox((0, 0), char, font=font)
        draw.text((cursor, xy[1] - (box[3] - box[1]) / 2 - box[1]), char, font=font, fill=fill)
        cursor += width + spacing


def make_icon(size, maskable=False):
    scale = 4
    canvas_size = size * scale
    image = Image.new("RGB", (canvas_size, canvas_size), "#f6f5f0")
    draw = ImageDraw.Draw(image)

    inset = int(canvas_size * (0.13 if maskable else 0.09))
    ring = int(canvas_size * 0.012)
    draw.ellipse((inset, inset, canvas_size - inset, canvas_size - inset), fill="#d4dbc8", outline="#64715b", width=ring)

    inner = int(canvas_size * 0.21)
    draw.ellipse((inner, inner, canvas_size - inner, canvas_size - inner), outline="#f6f5f0", width=max(2, ring // 2))

    serif = ImageFont.truetype(str(SERIF), int(canvas_size * 0.225))
    sans = ImageFont.truetype(str(SANS), int(canvas_size * 0.031))
    centered_text(draw, (canvas_size / 2, canvas_size * 0.49), "y&s", serif, "#171814")
    centered_text(draw, (canvas_size / 2, canvas_size * 0.69), "WEDDING  2026", sans, "#64715b", spacing=int(canvas_size * 0.008))

    return image.resize((size, size), Image.Resampling.LANCZOS)


OUTPUT.mkdir(parents=True, exist_ok=True)
make_icon(192).save(OUTPUT / "icon-192.png", optimize=True)
make_icon(512).save(OUTPUT / "icon-512.png", optimize=True)
make_icon(512, maskable=True).save(OUTPUT / "icon-maskable-512.png", optimize=True)
make_icon(180).save(OUTPUT / "apple-touch-icon.png", optimize=True)
