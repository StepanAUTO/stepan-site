"""Конвертирует фотографии сайта в WebP (кроме og-cover.jpg).
Запуск: python tools/convert-webp.py
"""
from PIL import Image, ImageOps
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIRS = [os.path.join(ROOT, "portfolio-img"), os.path.join(ROOT, "img")]

def files():
    for root in DIRS:
        for dirpath, _, names in os.walk(root):
            for name in names:
                if name.lower().endswith((".jpg", ".jpeg")) and name.lower() != "og-cover.jpg":
                    yield os.path.join(dirpath, name)

def main():
    count = 0
    before = after = 0
    originals = []
    for path in files():
        no_ext = os.path.splitext(path)[0]
        dest = no_ext + ".webp"
        try:
            im = Image.open(path)
            im = ImageOps.exif_transpose(im)
            if im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGB")
            w, h = im.size
            max_side = 1200 if "portfolio-img" in path else 1400
            scale = min(1.0, max_side / max(w, h))
            if scale < 1:
                im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
            im.save(dest, "WEBP", quality=74, method=6)
            before += os.path.getsize(path)
            after += os.path.getsize(dest)
            originals.append(path)
            count += 1
        except Exception as exc:
            print(f"ERR {path}: {exc}")
    for path in originals:
        os.remove(path)
    print(f"converted: {count}")
    print(f"before: {before / 1024 / 1024:.1f} MB")
    print(f"after:  {after / 1024 / 1024:.1f} MB")

if __name__ == "__main__":
    main()
