// Loads and validates the Opening Learner's lines (src/openings/*.js) for scripts/build.js.
// Each file exports an array of openings:
//   { id, name, eco, side: 'w'|'b' (who chooses it; the board is shown from that side), group (see GROUPS),
//     summary (one line, for the list), idea (the opening's whole idea: a string, or an array of paragraphs),
//     moves: [[san, note], ...] (from the initial position, a note on every move), vars: [variation, ...] }
// A variation branches off the line it is listed under:
//   { name, start: '3...Nf6' (its first move, as numbered in the game), summary, idea, moves: [[san, note], ...], vars: [...] }
//   or { ref: 'other-opening-id' } (optionally with name / summary) to open another opening, which branches where its
//   moves leave this line.
// Every move is checked with chess.js and rewritten in its SAN. The result keeps variations as
// { name, summary, idea, at, moves, vars } (at = plies of the parent line played first) or { ref, at, name, summary }.
// Usage as a check: node scripts/openings.js [--strict] [file ...] (without --strict, refs to missing openings only warn)
const fs = require('fs');
const path = require('path');
const { Chess } = require('chess.js');

const GROUPS = ['open', 'semi-open', 'closed', 'indian', 'flank'];
// the list's order; within a group the openings come in this order (any not listed come last)
const CATALOG = [
  'italian', 'two-knights', 'evans-gambit', 'ruy-lopez', 'scotch', 'four-knights', 'petrov', 'philidor', 'kings-gambit', 'vienna',
  'sicilian', 'sicilian-najdorf', 'sicilian-dragon', 'sicilian-sveshnikov', 'french', 'caro-kann', 'scandinavian', 'pirc', 'alekhine',
  'queens-gambit-declined', 'queens-gambit-accepted', 'slav', 'semi-slav', 'london',
  'kings-indian', 'nimzo-indian', 'queens-indian', 'grunfeld', 'catalan', 'benoni', 'benko-gambit', 'dutch',
  'english', 'reti', 'kings-indian-attack', 'birds',
];
const dir = path.join(__dirname, '../src/openings');

function plyOf(start, where) {
  const m = /^(\d+)(\.\.\.|\.)\s*(\S*)$/.exec(String(start || '').trim());
  if (!m) throw new Error(`${where}: start "${start}" should look like "3.Bc4" or "3...Nf6"`);
  return { ply: (+m[1] - 1) * 2 + (m[2] === '...' ? 1 : 0), san: m[3] };
}
const paras = (v, where, need) => {
  if (v == null || v === '') { if (need) throw new Error(`${where}: missing idea`); return []; }
  const a = Array.isArray(v) ? v : [v];
  if (a.some(p => typeof p !== 'string' || !p.trim())) throw new Error(`${where}: idea paragraphs must be text`);
  return a.map(p => p.trim().replace(/\s+/g, ' '));
};

// plays `moves` after `prefix` (SANs), returns the normalised [san, note] list
function play(prefix, moves, where) {
  if (!Array.isArray(moves) || !moves.length) throw new Error(`${where}: no moves`);
  const c = new Chess();
  for (const s of prefix) c.move(s);
  return moves.map((m, k) => {
    if (!Array.isArray(m) || typeof m[0] !== 'string') throw new Error(`${where}: move ${k + 1} should be [san, note]`);
    const [san, note] = m;
    const no = Math.floor((prefix.length + k) / 2) + 1, label = no + ((prefix.length + k) % 2 ? '...' : '.') + san;
    let mv;
    try { mv = c.move(san); } catch (e) { mv = null; }
    if (!mv) throw new Error(`${where}: illegal move ${label} (position ${c.fen()})`);
    if (typeof note !== 'string' || !note.trim()) throw new Error(`${where}: no note on ${label}`);
    return [mv.san, note.trim().replace(/\s+/g, ' ')];
  });
}

function load(files, loose) {
  files = files || fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().map(f => path.join(dir, f));
  const all = [];
  for (const f of files) {
    delete require.cache[require.resolve(f)];
    const list = require(f);
    if (!Array.isArray(list)) throw new Error(`${f}: should export an array of openings`);
    all.push(...list.map(o => Object.assign({ file: path.basename(f) }, o)));
  }
  const byId = new Map();
  for (const o of all) {
    const where = `${o.file}: ${o.id || o.name}`;
    if (!/^[a-z0-9-]+$/.test(o.id || '')) throw new Error(`${where}: id should be lowercase-with-dashes`);
    if (byId.has(o.id)) throw new Error(`${where}: duplicate id`);
    if (!o.name || !o.eco || !o.summary) throw new Error(`${where}: needs name, eco and summary`);
    if (!'wb'.includes(o.side) || o.side.length !== 1) throw new Error(`${where}: side should be 'w' or 'b'`);
    if (!GROUPS.includes(o.group)) throw new Error(`${where}: group should be one of ${GROUPS.join(', ')}`);
    byId.set(o.id, o);
  }
  // main lines first, so refs can compare against them
  for (const o of all) o.line = play([], o.moves, `${o.file}: ${o.id}`);
  const sans = o => o.line.map(m => m[0]);
  function vars(list, parent, where, depth) {
    if (list == null) return [];
    if (!Array.isArray(list)) throw new Error(`${where}: vars should be an array`);
    if (depth > 8) throw new Error(`${where}: variations nested too deep`);
    return list.map((v, k) => {
      const w = `${where} > ${v.name || v.ref || 'variation ' + (k + 1)}`;
      if (v.ref) {
        const t = byId.get(v.ref);
        if (!t) {
          if (!loose) throw new Error(`${w}: no opening with id "${v.ref}"`);
          console.warn(`warning: ${w}: no opening with id "${v.ref}" yet`);
          return { ref: v.ref, at: 0, name: v.name || v.ref, summary: v.summary || '' };
        }
        const ts = sans(t);
        let at = 0;
        while (at < parent.length && at < ts.length && parent[at] === ts[at]) at++;
        if (at >= ts.length) throw new Error(`${w}: "${v.ref}" does not leave this line (it is all inside it)`);
        return { ref: v.ref, at, name: v.name || t.name, summary: v.summary || t.summary };
      }
      if (!v.name) throw new Error(`${w}: needs a name`);
      const { ply: at, san: first } = plyOf(v.start, w);
      if (at > parent.length) throw new Error(`${w}: starts at ${v.start}, after the end of the line it branches from`);
      const moves = play(parent.slice(0, at), v.moves, w);
      const bare = s => s.replace(/[+#!?]/g, '');
      if (first && bare(first) !== bare(moves[0][0])) throw new Error(`${w}: start says ${v.start} but its first move is ${moves[0][0]}`);
      if (at < parent.length && moves[0][0] === parent[at]) throw new Error(`${w}: its first move ${v.start} is the same as the line it branches from`);
      const full = parent.slice(0, at).concat(moves.map(m => m[0]));
      return { name: v.name, summary: v.summary || '', idea: paras(v.idea, w, true), at, moves, vars: vars(v.vars, full, w, depth + 1) };
    });
  }
  const rank = o => GROUPS.indexOf(o.group) * 1000 + (CATALOG.includes(o.id) ? CATALOG.indexOf(o.id) : 999);
  return all.slice().sort((a, b) => rank(a) - rank(b)).map(o => ({
    id: o.id, name: o.name, eco: o.eco, side: o.side, group: o.group, summary: o.summary.trim(),
    idea: paras(o.idea, `${o.file}: ${o.id}`, true), moves: o.line, vars: vars(o.vars, sans(o), `${o.file}: ${o.id}`, 0),
  }));
}

module.exports = { load, GROUPS, CATALOG };

if (require.main === module) {
  const files = process.argv.slice(2).filter(a => !a.startsWith('--')).map(f => path.resolve(f));
  // refs may point into other files, so the check always loads every file, plus any named outside src/openings
  const every = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => path.join(dir, f));
  // while writing, refs to openings that are not written yet are only warnings
  const list = load([...new Set([...every, ...files])].sort(), !process.argv.includes('--strict'));
  let lines = 0, notes = 0;
  const count = v => { lines++; notes += (v.moves || []).length; (v.vars || []).forEach(x => x.ref ? lines++ : count(x)); };
  list.forEach(count);
  console.log(`OK: ${list.length} openings, ${lines} lines, ${notes} annotated moves`);
}
