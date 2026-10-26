/* Скачивает Inter и Playfair Display (кириллица + латиница) и собирает css/fonts.css.
   Запуск: node tools/fetch-fonts.mjs */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FONT_DIR = path.join(ROOT, 'fonts');
const CSS_FILE = path.join(ROOT, 'css', 'fonts.css');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap';
const KEEP_SUBSETS = new Set(['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext']);

fs.mkdirSync(FONT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(CSS_FILE), { recursive: true });

const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
if (!res.ok) throw new Error(`Google Fonts CSS: ${res.status}`);
const css = await res.text();

const blocks = [...css.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([\s\S]*?)\}/g)];
const parsed = [];

for (const [, subset, body] of blocks) {
  if (!KEEP_SUBSETS.has(subset)) continue;
  const family = (body.match(/font-family:\s*'([^']+)'/) || [])[1];
  const style = (body.match(/font-style:\s*([a-z]+)/) || [])[1] || 'normal';
  const weight = (body.match(/font-weight:\s*(\d+)/) || [])[1];
  const url = (body.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/) || [])[1];
  const range = (body.match(/unicode-range:\s*([^;]+);/) || [])[1];
  if (!family || !weight || !url || !range) continue;
  parsed.push({ family, style, weight: Number(weight), subset, url, range: range.replace(/\s+/g, ' ').trim() });
}

if (!parsed.length) throw new Error('No font faces found in CSS');

// Google отдаёт один variable-файл на несколько весов. Склеиваем такие записи.
const unique = new Map();
for (const f of parsed) {
  const key = `${f.family}|${f.style}|${f.subset}|${f.url}`;
  const item = unique.get(key) || { ...f, weights: [] };
  item.weights.push(f.weight);
  unique.set(key, item);
}

const fonts = [...unique.values()].map((f) => {
  const min = Math.min(...f.weights);
  const max = Math.max(...f.weights);
  const slug = f.family.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    family: f.family,
    style: f.style,
    weight: min,
    weightRange: min === max ? String(min) : `${min} ${max}`,
    subset: f.subset,
    url: f.url,
    range: f.range,
    file: `${slug}-${min}-${f.style}-${f.subset}.woff2`,
  };
});

let total = 0;
for (const f of fonts) {
  const dest = path.join(FONT_DIR, f.file);
  if (!fs.existsSync(dest)) {
    const r = await fetch(f.url);
    if (!r.ok) throw new Error(`Font ${f.file}: ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(dest, buf);
  }
  total += fs.statSync(dest).size;
  process.stdout.write(`.`);
}
process.stdout.write('\n');

const keep = new Set(fonts.map((f) => f.file));
for (const name of fs.readdirSync(FONT_DIR)) {
  if (name.endsWith('.woff2') && !keep.has(name)) {
    fs.unlinkSync(path.join(FONT_DIR, name));
  }
}

const order = { normal: 0, italic: 1 };
fonts.sort((a, b) =>
  a.family.localeCompare(b.family) ||
  a.weight - b.weight ||
  (order[a.style] ?? 9) - (order[b.style] ?? 9) ||
  a.subset.localeCompare(b.subset)
);

const out = fonts.map((f) => `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.weightRange};
  font-display: swap;
  src: url('../fonts/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`).join('\n\n');

fs.writeFileSync(CSS_FILE, `/* Локальные шрифты: Inter + Playfair Display (кириллица/латиница). */\n\n${out}\n`, 'utf8');

console.log(`fonts: ${fonts.length}; total: ${(total / 1024 / 1024).toFixed(2)} MB; css: ${CSS_FILE}`);
