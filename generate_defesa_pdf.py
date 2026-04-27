from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "RESPOSTAS_DEFESA_ANGOSTART.md"
OUTPUT = ROOT / "RESPOSTAS_DEFESA_ANGOSTART.pdf"


def register_font():
    # Fonte com suporte a acentos para portugues.
    font_name = "DejaVuSans"
    font_path = Path("C:/Windows/Fonts/DejaVuSans.ttf")
    if font_path.exists():
        pdfmetrics.registerFont(TTFont(font_name, str(font_path)))
        return font_name
    return "Helvetica"


def wrap_text(text, font_name, font_size, max_width):
    words = text.split()
    if not words:
        return [""]

    lines = []
    current = words[0]
    for word in words[1:]:
        test_line = f"{current} {word}"
        if pdfmetrics.stringWidth(test_line, font_name, font_size) <= max_width:
            current = test_line
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def main():
    markdown = SOURCE.read_text(encoding="utf-8")
    font_name = register_font()

    page_w, page_h = A4
    margin_x = 48
    margin_top = 54
    margin_bottom = 48
    line_h = 15
    max_width = page_w - (margin_x * 2)

    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    y = page_h - margin_top

    def new_page():
        nonlocal y
        c.showPage()
        if font_name != "Helvetica":
            c.setFont(font_name, 11)
        y = page_h - margin_top

    if font_name != "Helvetica":
        c.setFont(font_name, 11)
    else:
        c.setFont("Helvetica", 11)

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()

        if line.startswith("# "):
            font_size = 15
            text = line[2:].strip()
        elif line.startswith("## "):
            font_size = 13
            text = line[3:].strip()
        elif line.startswith("### "):
            font_size = 12
            text = line[4:].strip()
        else:
            font_size = 11
            text = line

        if not text:
            y -= line_h * 0.8
            if y < margin_bottom:
                new_page()
            continue

        c.setFont(font_name, font_size)
        wrapped = wrap_text(text, font_name, font_size, max_width)
        for chunk in wrapped:
            if y < margin_bottom:
                new_page()
                c.setFont(font_name, font_size)
            c.drawString(margin_x, y, chunk)
            y -= line_h

    c.save()
    print(f"PDF gerado: {OUTPUT}")


if __name__ == "__main__":
    main()
