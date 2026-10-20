// Builds the site in docs/ from src/.
// - Validates every game line in src/games.txt with chess.js and packs each move into 2 characters
//   (from/to square, plus a marker for promotions). The page replays a game with chess.js when it needs it.
//   Validated lines are cached in node_modules/.cache, so only new or changed lines are re-checked.
// - Builds one page per drill (APPS below): inlines src/common.css, the cburnett piece SVGs from chessground,
//   and the nav linking the drills.
// - Copies chess.js (with its license) to docs/chess.js, and the Stockfish lite single-threaded WASM engine
//   (with its GPLv3 license) to docs/stockfish.js + docs/stockfish.wasm.
// - Bundles WhyBlunder's analysis modules (vendor/whyblunder) into docs/whyblunder.js, and copies src/patterns.js
//   (Mistake Patterns' analysis) to docs/patterns.js.
// Usage: npm install && npm run build
const fs = require('fs');
const path = require('path');
const { Chess } = require('chess.js');

const root = path.join(__dirname, '..');
const rd = p => fs.readFileSync(path.join(root, p), 'utf8');
const SQ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'; // index 0 = a8, 63 = h1
const PROMO = { q: '!', r: '$', b: '%', n: '*' };
const sq = s => SQ[(8 - +s[1]) * 8 + 'abcdefgh'.indexOf(s[0])];

// 1. Game data
const cacheFile = path.join(root, 'node_modules/.cache/chess-vision/games.json');
let cache = {};
try { cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8')); } catch (e) {}
const nextCache = {};
let checked = 0;
const games = rd('src/games.txt').trim().split('\n').filter(l => l.trim() && !l.startsWith('#')).map((line, n) => {
  const [name, pgn] = line.split('|');
  if (!pgn) throw new Error(`Line ${n + 1}: expected "Name|1.e4 e5 ..."`);
  let packed = cache[line];
  if (packed == null) {
    const c = new Chess();
    packed = '';
    for (const s of pgn.replace(/\d+\.(\.\.)?/g, ' ').trim().split(/\s+/)) {
      let m;
      try { m = c.move(s); } catch (e) { throw new Error(`Illegal move "${s}" in "${name}" (line ${n + 1})`); }
      packed += sq(m.from) + sq(m.to) + (m.promotion ? PROMO[m.promotion] : '');
    }
    checked++;
  }
  nextCache[line] = packed;
  return [name.trim(), packed];
});
fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
fs.writeFileSync(cacheFile, JSON.stringify(nextCache));

// 2. Piece images
const css = fs.readFileSync(path.join(root, 'node_modules/chessground/assets/chessground.cburnett.css'), 'utf8');
const kind = { pawn: 'p', knight: 'n', bishop: 'b', rook: 'r', queen: 'q', king: 'k' };
const vars = [];
for (const m of css.matchAll(/piece\.(\w+)\.(\w+)\s*\{\s*background-image:\s*url\('([^']+)'\)/g))
  vars.push(`--pc-${m[2] === 'white' ? 'w' : 'b'}${kind[m[1]]}:url("${m[3]}")`);
if (vars.length !== 12) throw new Error('Expected 12 piece images, got ' + vars.length);
const pieces = ':root{' + vars.join(';') + '}';

// 3. chess.js for the browser: the CommonJS build wrapped to expose a global Chess
const chessDir = path.join(root, 'node_modules/chess.js');
const chessLib = `/*!\n${fs.readFileSync(path.join(chessDir, 'LICENSE'), 'utf8').trim()}\n*/\nvar Chess=(function(){var exports={};\n${fs.readFileSync(path.join(chessDir, 'dist/cjs/chess.js'), 'utf8')}\nreturn exports.Chess;})();\n`;

// 4. Pages
const APPS = [
  { src: 'src/line-vision.html', out: 'index.html', name: 'Line Vision',
    description: 'Chess visualization training: read a line of moves, picture it, then set up the final position.' },
  { src: 'src/spot-the-danger.html', out: 'spot-the-danger.html', name: 'Spot the Danger',
    description: 'Chess tactics training on master-game positions: spot the opponent\'s real threats, then the captures and checks that work for you, judged by Stockfish.' },
  { src: 'src/mistake-patterns.html', out: 'mistake-patterns.html', name: 'Mistake Patterns',
    description: 'Fetch your recent Lichess or Chess.com games, analyse them with Stockfish in your browser, and find the mistakes you keep making.' },
];
const common = rd('src/common.css').trim();
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
const sizes = [];
for (const app of APPS) {
  const nav = '<nav class="tools" aria-label="Drills">' + APPS.map(a =>
    `<a class="tool-tab" href="${a.out}"${a === app ? ' aria-current="page"' : ''}>${a.name}</a>`).join('') + '</nav>' +
    // on phones the tabs scroll sideways; start with the current one in view
    '<script>(function(n){function f(){var a=n.querySelector("[aria-current]"),d=a.getBoundingClientRect().right-n.getBoundingClientRect().right;if(d>0)n.scrollLeft+=d+24;}' +
    'f();if(document.fonts)document.fonts.ready.then(f);})(document.currentScript.previousElementSibling)</script>';
  const page = rd(app.src).replace('/*PIECES*/', () => pieces).replace('/*COMMON*/', () => common).replace('<!--NAV-->', () => nav)
    .replace('/*GAME_COUNT*/', () => games.length.toLocaleString('en-US'));
  const split = page.indexOf('</style>') + '</style>'.length;
  const head = page.slice(0, split).replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, '');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${app.description}">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${page.slice(split)}
</body>
</html>
`;
  fs.writeFileSync(path.join(root, 'docs', app.out), html);
  sizes.push(`${app.out} ${(html.length / 1024).toFixed(0)} KB`);
}
fs.writeFileSync(path.join(root, 'docs/chess.js'), chessLib);

// 4b. WhyBlunder's analysis modules, unmodified, in one scope with their own chess.js 0.10.3 (they use its API).
//     CommonJS/AMD names are hidden so each UMD wrapper attaches to the local root, and the module names are local
//     variables so the modules' typeof lookups find each other.
const WB = ['chess-evaluator.js', 'opening-detector.js', 'situation-recognizer.js', 'move-diagnostics.js'];
const WB_NAMES = ['ChessEvaluator', 'OpeningDetector', 'SituationRecognizer', 'MoveDiagnostics'];
const wb = n => rd('vendor/whyblunder/' + n).trim();
const wbLib = `/*! WhyBlunder analysis modules (https://github.com/huytd/whyblunder), bundled by scripts/build.js from vendor/whyblunder.
 *  Includes chess.js 0.10.3 (BSD-2-Clause, https://github.com/jhlywa/chess.js). */
var WhyBlunder=(function(){var module,exports,define,require,global,window;var self={};var ${WB_NAMES.join(',')};
${wb('chess.min.js')}
${WB.map((n, i) => `${wb(n)}\n${WB_NAMES[i]}=self.${WB_NAMES[i]};`).join('\n')}
return {Chess:Chess,${WB_NAMES.map(n => n + ':' + n).join(',')}};})();
if(typeof module==='object'&&module.exports)module.exports=WhyBlunder;
`;
fs.writeFileSync(path.join(root, 'docs/whyblunder.js'), wbLib);
fs.copyFileSync(path.join(root, 'src/patterns.js'), path.join(root, 'docs/patterns.js'));

// 5. Stockfish (single-threaded, so it runs without cross-origin isolation headers on GitHub Pages).
//    The worker script finds its .wasm by swapping its own .js extension for .wasm.
const sfDir = path.join(root, 'node_modules/stockfish');
const sfName = 'stockfish-' + require(path.join(sfDir, 'package.json')).buildVersion + '-lite-single';
fs.copyFileSync(path.join(sfDir, 'bin', sfName + '.js'), path.join(root, 'docs/stockfish.js'));
fs.copyFileSync(path.join(sfDir, 'bin', sfName + '.wasm'), path.join(root, 'docs/stockfish.wasm'));
fs.chmodSync(path.join(root, 'docs/stockfish.wasm'), 0o644);
fs.copyFileSync(path.join(sfDir, 'Copying.txt'), path.join(root, 'docs/stockfish-COPYING.txt'));
const data = '// Generated by scripts/build.js from src/games.txt. [name, moves]: 2 chars per move (from, to; a8=A … h1=_), promotions add one of !$%* for q r b n.\nconst GAMES=[\n' + games.map(g => JSON.stringify(g)).join(',\n') + '\n];\n';
fs.writeFileSync(path.join(root, 'docs/games.js'), data);
console.log(`Built docs/ (${games.length} lines, ${checked} newly validated; ${sizes.join(', ')}, games.js ${(data.length / 1024).toFixed(0)} KB)`);
