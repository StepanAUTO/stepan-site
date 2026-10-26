"""Проставляет width/height/decoding у <img> по реальным размерам файлов.
Запуск после tools/seo-build.mjs: python tools/add-img-dims.py
"""
from PIL import Image
import os
import re
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_RE = re.compile(r"<img\b[^>]*>", re.I)
SRC_RE = re.compile(r'\bsrc="([^"]+)"', re.I)


def main():
    count = 0
    for name in os.listdir(ROOT):
        if not name.lower().endswith(".html"):
            continue
        path = os.path.join(ROOT, name)
        text = open(path, encoding="utf-8").read()

        def repl(match):
            nonlocal count
            tag = match.group(0)
            src = SRC_RE.search(tag)
            if not src:
                return tag
            rel = urllib.parse.unquote(src.group(1))
            if rel.startswith(("http://", "https://", "data:")):
                return tag
            full = os.path.join(ROOT, rel.replace("/", os.sep))
            if not os.path.exists(full):
                return tag
            try:
                with Image.open(full) as im:
                    width, height = im.size
            except Exception:
                return tag
            attrs = []
            if not re.search(r"\bwidth=", tag, re.I):
                attrs.append(f'width="{width}"')
            if not re.search(r"\bheight=", tag, re.I):
                attrs.append(f'height="{height}"')
            if not re.search(r"\bdecoding=", tag, re.I):
                attrs.append('decoding="async"')
            if not attrs:
                return tag
            count += 1
            if tag.endswith("/>"):
                return tag[:-2].rstrip() + " " + " ".join(attrs) + "/>"
            return tag[:-1].rstrip() + " " + " ".join(attrs) + ">"

        updated = IMG_RE.sub(repl, text)
        if updated != text:
            open(path, "w", encoding="utf-8").write(updated)
    print(f"img tags updated: {count}")


if __name__ == "__main__":
    main()
