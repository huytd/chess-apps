// Builds the self-contained index.html from src/.
// - Validates every game line in src/games.txt with chess.js and precomputes positions per ply.
// - Inlines the cburnett piece SVGs from chessground.
// Usage: npm install && npm run build
const fs = require('fs');
const path = require('path');
const { Chess } = require('chess.js');

const root = path.join(__dirname, '..');
const rd = p => fs.readFileSync(path.join(root, p), 'utf8');

// 1. Game data
const games = rd('src/games.txt').trim().split('\n').filter(l => l.trim() && !l.startsWith('#')).map(line => {
  const [name, pgn] = line.split('|');
  const sans = pgn.replace(/\d+\.(\.\.)?/g, ' ').trim().split(/\s+/);
  const c = new Chess();
  const P = [c.fen().split(' ')[0]], S = [], F = [];
  for (const s of sans) {
    const m = c.move(s);
    if (!m) throw new Error(`Illegal move "${s}" in "${name}" at ply ${S.length + 1}`);
    S.push(m.san); F.push(m.from + m.to); P.push(c.fen().split(' ')[0]);
  }
  return { n: name, k: / vs /.test(name) || /Légal/.test(name) ? 'game' : 'opening', s: S, f: F, p: P };
});
const data = 'const GAMES=' + JSON.stringify(games) + ';';

// 2. Piece images
const css = fs.readFileSync(path.join(root, 'node_modules/chessground/assets/chessground.cburnett.css'), 'utf8');
const kind = { pawn: 'p', knight: 'n', bishop: 'b', rook: 'r', queen: 'q', king: 'k' };
const vars = [];
for (const m of css.matchAll(/piece\.(\w+)\.(\w+)\s*\{\s*background-image:\s*url\('([^']+)'\)/g))
  vars.push(`--pc-${m[2] === 'white' ? 'w' : 'b'}${kind[m[1]]}:url("${m[3]}")`);
if (vars.length !== 12) throw new Error('Expected 12 piece images, got ' + vars.length);
const pieces = ':root{' + vars.join(';') + '}';

// 3. Page
const page = rd('src/line-vision.html').replace('/*PIECES*/', () => pieces).replace('/*DATA*/', () => data);
const split = page.indexOf('</style>') + '</style>'.length;
const head = page.slice(0, split).replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, '');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Chess visualization training: read a line of moves, picture it, then set up the final position.">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${page.slice(split)}
</body>
</html>
`;
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/index.html'), html);
console.log(`Built docs/index.html (${games.length} lines, ${(html.length / 1024).toFixed(0)} KB)`);
