"""Сжимает фотографии сайта: убирает лишний размер, EXIF и вес.
Запуск: python tools/optimize-images.py
"""
from PIL import Image, ImageOps
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTFOLIO = os.path.join(ROOT, "portfolio-img")
IMG = os.path.join(ROOT, "img")

def files(root):
    for dirpath, _, names in os.walk(root):
        for name in names:
            if name.lower().endswith((".jpg", ".jpeg")):
                yield os.path.join(dirpath, name)

def optimize(path, max_side, quality):
    before = os.path.getsize(path)
    try:
        im = Image.open(path)
        im = ImageOps.exif_transpose(im)
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        w, h = im.size
        scale = min(1.0, max_side / max(w, h))
        if scale < 1:
            im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
        im.save(path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=2)
    except Exception as exc:
        print(f"ERR {path}: {exc}")
        return before, before
    return before, os.path.getsize(path)

def main():
    total_before = total_after = 0
    count = 0
    for path in files(PORTFOLIO):
        b, a = optimize(path, 1200, 74)
        total_before += b
        total_after += a
        count += 1
    for path in files(IMG):
        if os.path.basename(path).lower() == "og-cover.jpg":
            b, a = optimize(path, 1200, 82)
        else:
            b, a = optimize(path, 1400, 78)
        total_before += b
        total_after += a
        count += 1
    print(f"images: {count}")
    print(f"before: {total_before / 1024 / 1024:.1f} MB")
    print(f"after:  {total_after / 1024 / 1024:.1f} MB")

if __name__ == "__main__":
    main()
