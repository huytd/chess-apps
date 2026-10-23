// Counts how the Opening Learner's positions score in master games, for the result bars on its pages.
// Source: the Lichess Broadcasts dataset (https://huggingface.co/datasets/Lichess/tournament-chess-games, CC BY-SA 4.0),
// over-the-board tournament games relayed on Lichess since 2020. Only games where both players are rated MIN_ELO or
// more, with a result, are counted.
// Every position of every line in src/openings/*.js is looked up (transpositions count too: a game is replayed for
// as many plies as the longest line), and the counts [White wins, draws, Black wins] per position are written to
// src/opening-stats.json, with how often each move was played from a position to another of them (so the page can say
// how often masters chose a variation's move where it branches, whatever the move order before), which
// scripts/build.js puts into docs/openings.js. Positions no game reached are left out.
// Each month of the dataset (about 17 MB) is downloaded with curl, counted in a worker thread and deleted; the counts
// are cached in node_modules/.cache, so a later run only re-reads months when the lines have new positions.
// Usage: node scripts/opening-stats.js (about 5 minutes on 4 cores the first time)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { Chess } = require('chess.js');

const DATASET = 'Lichess/tournament-chess-games';
const MIN_ELO = 2200;
const VERSION = 2; // of the cached counts: bump when what is counted changes
const root = path.join(__dirname, '..');
const cacheDir = path.join(root, 'node_modules/.cache/chess-vision/stats');
// a position as the page looks it up: placement, side to move, castling, en passant (chess.js FEN, no move counters)
const key = c => c.fen().split(' ').slice(0, 4).join(' ');

if (isMainThread) main().catch(e => { console.error(e); process.exit(1); });
else count(workerData).then(r => parentPort.postMessage(r));

async function main() {
  const { load } = require('./openings.js');
  // every position of every line, and how deep the lines go
  const targets = new Set();
  let maxPly = 0;
  const walk = (sans, vars) => {
    const c = new Chess();
    targets.add(key(c));
    for (const s of sans) { c.move(s); targets.add(key(c)); }
    maxPly = Math.max(maxPly, sans.length);
    for (const v of vars || []) if (!v.ref) walk(sans.slice(0, v.at).concat(v.moves.map(m => m[0])), v.vars);
  };
  for (const o of load()) walk(o.moves.map(m => m[0]), o.vars);

  const tree = JSON.parse(execFileSync('curl', ['-sfL', `https://huggingface.co/api/datasets/${DATASET}/tree/main/data?recursive=true`]));
  const files = tree.filter(f => f.type === 'file' && f.path.endsWith('.parquet')).map(f => f.path).sort();
  fs.mkdirSync(cacheDir, { recursive: true });
  const want = [...targets];
  const totals = new Map(), moves = {};
  let games = 0, done = 0;
  const add = r => {
    games += r.games;
    for (const [k, v] of Object.entries(r.counts)) {
      const t = totals.get(k) || [0, 0, 0];
      for (let i = 0; i < 3; i++) t[i] += v[i];
      totals.set(k, t);
    }
    for (const [k, m] of Object.entries(r.moves)) for (const [san, n] of Object.entries(m)) (moves[k] = moves[k] || {})[san] = (moves[k][san] || 0) + n;
    done++;
    process.stdout.write(`\r${done}/${files.length} months, ${games.toLocaleString('en-US')} games`);
  };
  const todo = [];
  for (const f of files) {
    const cached = path.join(cacheDir, f.replace(/[^\w.-]+/g, '_') + '.json');
    let c = null;
    try { c = JSON.parse(fs.readFileSync(cached, 'utf8')); } catch (e) {}
    // reusable when it was counted at the same rating floor and depth, for every position wanted now
    if (c && c.version === VERSION && c.minElo === MIN_ELO && c.maxPly >= maxPly && want.every(k => c.targets.includes(k))) add(c);
    else todo.push({ file: f, cached });
  }
  const workers = Math.max(1, Math.min(os.cpus().length, todo.length));
  await Promise.all(Array.from({ length: workers }, async () => {
    for (let job; (job = todo.shift());) {
      const r = await new Promise((resolve, reject) => {
        const w = new Worker(__filename, { workerData: { file: job.file, targets: want, maxPly, minElo: MIN_ELO } });
        w.once('message', resolve); w.once('error', reject);
      });
      fs.writeFileSync(job.cached, JSON.stringify(r));
      add(r);
    }
  }));
  process.stdout.write('\n');
  const positions = {};
  for (const k of want) if (totals.has(k)) positions[k] = totals.get(k);
  const played = {};
  for (const k of want) if (moves[k]) played[k] = Object.fromEntries(Object.entries(moves[k]).sort((a, b) => b[1] - a[1]));
  const out = {
    source: `https://huggingface.co/datasets/${DATASET}`, license: 'CC BY-SA 4.0 (counts derived from the dataset, under the same licence)',
    note: `Over-the-board tournament games relayed on Lichess Broadcasts, both players rated ${MIN_ELO}+. [White wins, draws, Black wins] per position (FEN without move counters).`,
    minElo: MIN_ELO, games, months: files.length, positions, moves: played,
  };
  // one position per line, so changes read well in a diff
  fs.writeFileSync(path.join(root, 'src/opening-stats.json'), JSON.stringify(out).replace(/("[^"]+":(\[\d+,\d+,\d+\]|\{[^{}]*\})),/g, '$1,\n') + '\n');
  console.log(`Wrote src/opening-stats.json: ${games.toLocaleString('en-US')} games, ${Object.keys(positions).length} of ${want.length} positions reached`);
}

// one month of the dataset: download, replay each game's opening, count the results at the wanted positions
async function count({ file, targets, maxPly, minElo }) {
  const { asyncBufferFromFile, parquetReadObjects } = await import('hyparquet');
  const { compressors } = await import('hyparquet-compressors');
  const tmp = path.join(os.tmpdir(), 'opening-stats-' + process.pid + '-' + path.basename(path.dirname(file)) + '.parquet');
  execFileSync('curl', ['-sfL', '--retry', '4', '-o', tmp, `https://huggingface.co/datasets/${DATASET}/resolve/main/${file}`]);
  const want = new Set(targets), counts = {}, moves = {};
  let games = 0;
  try {
    const rows = await parquetReadObjects({ file: await asyncBufferFromFile(tmp), compressors, columns: ['Result', 'WhiteElo', 'BlackElo', 'movetext'] });
    for (const r of rows) {
      const res = { '1-0': 0, '1/2-1/2': 1, '0-1': 2 }[r.Result];
      if (res == null || !(r.WhiteElo >= minElo && r.BlackElo >= minElo)) continue;
      // SAN moves only: no comments, variations, move numbers, NAGs or result
      const sans = String(r.movetext || '').replace(/\{[^}]*\}/g, ' ').replace(/\([^()]*\)/g, ' ').split(/\s+/)
        .filter(t => t && !/^\d+\.+$/.test(t) && !/^\$\d+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
      games++;
      const c = new Chess(), seen = new Set();
      const tally = () => { const k = key(c); if (want.has(k) && !seen.has(k)) { seen.add(k); (counts[k] = counts[k] || [0, 0, 0])[res]++; } };
      tally();
      for (let p = 0; p < maxPly && p < sans.length; p++) {
        const from = key(c);
        let m;
        try { m = c.move(sans[p]); } catch (e) { break; }
        // the move from one wanted position to another, under chess.js's SAN for it
        if (want.has(from) && want.has(key(c))) { const t = (moves[from] = moves[from] || {}); t[m.san] = (t[m.san] || 0) + 1; }
        tally();
      }
    }
  } finally { fs.rmSync(tmp, { force: true }); }
  return { version: VERSION, file, minElo, maxPly, targets, games, counts, moves };
}
