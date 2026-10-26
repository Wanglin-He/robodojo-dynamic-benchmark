import { readFileSync, writeFileSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('./src/explorer.html');
const css = read('./src/explorer.css') + '\n' + read('./src/fastwam-theme.css');
const js = read('./src/explorer.js');
writeFileSync(new URL('./index.html', import.meta.url), html.replace('/* INLINE_STYLE */', () => css).replace('/* INLINE_SCRIPT */', () => js));
console.log('Built index.html; media/ is served unchanged.');
