import fs from 'node:fs';
import path from 'node:path';

const files = fs.readdirSync('.').filter((f) => f.endsWith('.html'));
const missing = new Map();
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
    u = u.split('#')[0];
    if (!u) continue;
    const p = decodeURIComponent(u);
    if (!fs.existsSync(p)) {
      if (!missing.has(f)) missing.set(f, []);
      missing.get(f).push(p);
    }
  }
}
if (!missing.size) console.log('no broken local links');
else for (const [f, arr] of missing) console.log(f, [...new Set(arr)]);

// titles / descriptions / h1
const titles = new Map();
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const title = (t.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
  const desc = (t.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];
  const h1 = [...t.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  const alts = [...t.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\balt="[^"]+"/.test(m[0]));
  console.log(`${f}: h1=${h1.length}${h1.length !== 1 ? ' [' + h1.join(' | ') + ']' : ''} imgsWithoutAlt=${alts.length} title=${title.length} desc=${desc.length}`);
  if (titles.has(title)) console.log(`  DUPLICATE TITLE with ${titles.get(title)}`);
  else titles.set(title, f);
}
