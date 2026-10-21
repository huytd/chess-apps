/* Mistake Patterns: the analysis behind src/mistake-patterns.html (copied to docs/patterns.js by the build).
   - Imports recent games from Lichess (NDJSON export) or Chess.com (monthly archives) into one shape.
   - Analyses the user's moves the way WhyBlunder does (docs/whyblunder.js): a MultiPV 3 search before the move, a
     refutation search after it when it wasn't the engine's choice, MoveDiagnostics.diagnose() for the classification
     and explanation, and a null-move search on mistakes to see what the opponent was threatening.
   - Sorts every mistake and blunder into patterns with WhyBlunder's SituationRecognizer (hanging pieces, forks, pins,
     discovered attacks, material won along a line, king safety, opening principles), plus context patterns from the
     clock and the evaluation (time trouble, moving too fast, letting a win slip, not punishing a mistake).
   - Adds up the patterns over all games and writes an analysis of each one.
   In the browser it reads the globals Chess (chess.js 1.x) and WhyBlunder; in Node, require() it and call it with
   both: require('./patterns.js')(Chess, WhyBlunder). */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.MistakePatterns = factory(root.Chess, root.WhyBlunder);
}(typeof self !== 'undefined' ? self : this, function(Chess, WB) {
'use strict';
const { ChessEvaluator: EV, OpeningDetector: OD, SituationRecognizer: SR, MoveDiagnostics: MD } = WB;
const OldChess = WB.Chess;  // chess.js 0.10.3, the version WhyBlunder's detectors take boards from
const VERSION = 1;          // bump when the stored analysis changes shape or meaning
const PIECE = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const PHASES = ['opening', 'middlegame', 'endgame'];

/* ---------- import ---------- */
const SPEEDS = ['bullet', 'blitz', 'rapid', 'classical', 'daily'];
const LICHESS_PERF = { bullet: 'bullet', blitz: 'blitz', rapid: 'rapid', classical: 'classical', daily: 'correspondence' };

function lichessUrl(user, max, speeds) {
  const perf = (speeds && speeds.length ? speeds : SPEEDS).map(s => LICHESS_PERF[s]).join(',');
  return 'https://lichess.org/api/games/user/' + encodeURIComponent(user) + '?max=' + max +
    '&moves=true&clocks=true&opening=true&finished=true&perfType=' + perf;
}
/* One NDJSON row of the Lichess export. Null for games that aren't standard chess or that the user isn't in. */
function fromLichess(g, user) {
  if (!g || g.variant !== 'standard' || !g.moves || g.status === 'aborted' || g.status === 'noStart') return null;
  const id = String(user).toLowerCase(), name = p => (p && p.user && p.user.name) || (p && p.aiLevel ? 'Stockfish level ' + p.aiLevel : 'Anonymous');
  const w = g.players.white, b = g.players.black;
  const side = w.user && w.user.id === id ? 'w' : b.user && b.user.id === id ? 'b' : null;
  if (!side) return null;
  const me = side === 'w' ? w : b, opp = side === 'w' ? b : w;
  const sans = g.moves.trim().split(/\s+/);
  return {
    key: 'lichess:' + g.id, site: 'lichess', id: g.id,
    url: 'https://lichess.org/' + g.id + (side === 'b' ? '/black' : ''), plyUrl: '#',  // + plies played: the position before your move
    side, user: name(me), userElo: me.rating || null, opponent: name(opp), opponentElo: opp.rating || null,
    result: g.winner ? (g.winner === (side === 'w' ? 'white' : 'black') ? 'win' : 'loss') : 'draw',
    speed: g.speed === 'correspondence' ? 'daily' : g.speed, date: g.lastMoveAt || g.createdAt || 0,
    opening: (g.opening && g.opening.name) || '',
    sans, clocks: Array.isArray(g.clocks) ? g.clocks.map(c => c / 100) : null,
    initial: g.clock ? g.clock.initial : null, increment: g.clock ? g.clock.increment : 0
  };
}
function parseLichessNdjson(text, user) {
  const out = [];
  for (const line of String(text).split('\n')) {
    if (!line.trim()) continue;
    let g;try { g = JSON.parse(line); } catch (e) { continue; }
    const x = fromLichess(g, user);if (x) out.push(x);
  }
  return out;
}

const CC_DRAWS = ['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'];
/* One game from a Chess.com monthly archive. Null for variants and games the user isn't in. */
function fromChessCom(g, user) {
  if (!g || g.rules !== 'chess' || !g.pgn) return null;
  const id = String(user).toLowerCase();
  const side = g.white.username.toLowerCase() === id ? 'w' : g.black.username.toLowerCase() === id ? 'b' : null;
  if (!side) return null;
  const me = side === 'w' ? g.white : g.black, opp = side === 'w' ? g.black : g.white;
  const pgn = g.pgn, c = new Chess();
  try { c.loadPgn(pgn); } catch (e) { return null; }
  const sans = c.history();
  if (!sans.length) return null;
  const head = k => { const m = pgn.match(new RegExp('\\[' + k + ' "([^"]*)"\\]')); return m ? m[1] : ''; };
  const clocks = [];
  for (const m of pgn.matchAll(/\[%clk\s+(\d+):(\d+):(\d+(?:\.\d+)?)\]/g)) clocks.push(+m[1] * 3600 + +m[2] * 60 + +m[3]);
  const tc = head('TimeControl'), daily = tc.includes('/');
  const [ini, inc] = daily ? [null, 0] : tc.split('+').map(Number);
  // the opening name is in the ECOUrl slug, up to the first move number: .../openings/Sicilian-Defense-Alapin-Variation-2...Nf6
  const slug = (head('ECOUrl').split('/openings/')[1] || '').split('-');
  const k = slug.findIndex(w => /\d/.test(w));
  const opening = (k < 0 ? slug : slug.slice(0, k)).join(' ').trim() || (OD.identifyOpening(sans) || {}).name || '';
  return {
    key: 'chesscom:' + (g.uuid || g.url), site: 'chesscom', id: g.url.split('/').pop(), url: g.url, plyUrl: '',
    side, user: me.username, userElo: me.rating || null, opponent: opp.username, opponentElo: opp.rating || null,
    result: me.result === 'win' ? 'win' : CC_DRAWS.includes(me.result) ? 'draw' : 'loss',
    speed: g.time_class, date: (g.end_time || 0) * 1000, opening,
    sans, clocks: !daily && clocks.length >= sans.length ? clocks.slice(0, sans.length) : null,
    initial: daily || !isFinite(ini) ? null : ini, increment: isFinite(inc) ? inc : 0
  };
}

/* ---------- analysis of one game ---------- */
const uciOf = m => m.from + m.to + (m.promotion || '');
const round = (x, d = 3) => x == null || !isFinite(x) ? null : Math.round(x * 10 ** d) / 10 ** d;
const isError = (q, withInaccuracies) => q === 'blunder' || q === 'mistake' || (withInaccuracies && q === 'inaccuracy');
const moveNo = ply => Math.floor(ply / 2) + 1 + (ply % 2 ? '…' : '.');  // ply is 0-based
function oldBoard(fen, uci) {
  const b = new OldChess(fen);
  if (uci) { const m = b.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); if (!m) return null; }
  return b;
}
function sanLine(fen, pv, n) {
  const c = new Chess(fen), out = [];
  for (const u of (pv || []).slice(0, n)) {
    let m;try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch (e) { break; }
    out.push(m.san);
  }
  return out;
}
/* Time trouble: under a tenth of the base time, at least 10 seconds and at most a minute (bullet 6s → 10s, blitz 3+0
   → 18s, rapid 10+0 → 60s). Moving too fast: in games of 3 minutes or more, a move played within a hundredth of the
   base time (2 to 5 seconds: 3+0 → 2s, 5+0 → 3s, 10+0 → 5s) while more than a quarter of it was left. */
const fastLimit = initial => Math.min(5, Math.max(2, Math.round(initial / 100)));
function clockContext(game, ply) {
  if (!game.clocks || !game.initial || game.speed === 'daily') return null;
  const left = game.clocks[ply], prev = ply >= 2 ? game.clocks[ply - 2] : game.initial;
  if (left == null || prev == null) return null;
  const spent = Math.max(0, prev + (ply >= 2 ? game.increment || 0 : 0) - left);
  const trouble = left < Math.min(60, Math.max(10, game.initial * 0.1));
  return { left: round(left, 1), spent: round(spent, 1), trouble, hasty: !trouble && game.initial >= 180 && spent <= fastLimit(game.initial) && left > game.initial * 0.25 };
}

/* engine.search(fen, depth, multipv) → Promise<{ bestMove, lines: { 1: { cp | mate, pv: [uci…] }, … } }>, scores for
   the side to move (UCI convention; mate is left undefined on centipawn lines, which WhyBlunder relies on). */
async function analyzeGame(game, engine, opts = {}) {
  const depth = opts.depth || 16, post = Math.max(8, depth - 2), withInacc = !!opts.inaccuracies;
  const c = new Chess(), plies = [];
  for (const san of game.sans) {
    const fenBefore = c.fen();let m;
    try { m = c.move(san); } catch (e) { break; }
    plies.push({ san: m.san, uci: uciOf(m), prev: plies.length ? plies[plies.length - 1].uci : null, fenBefore, fenAfter: c.fen(),
      over: c.isGameOver(), mate: c.isCheckmate(), forced: new Chess(fenBefore).moves().length === 1 });
  }
  const mine = [];
  for (let i = game.side === 'w' ? 0 : 1; i < plies.length; i += 2) mine.push(i);
  let done = 0;
  const tick = () => { done++; if (opts.onProgress) opts.onProgress(done, mine.length); };
  const moves = await Promise.all(mine.map(async i => {
    const p = plies[i];
    if (OD.isBookMove(game.sans, i + 1, p.fenAfter)) { tick(); return { ply: i, book: true }; }
    if (p.forced) { tick(); return { ply: i, forced: true }; }
    const pre = await engine.search(p.fenBefore, depth, 3);
    let after = null;
    if (pre.bestMove !== p.uci) {
      after = p.over ? { bestMove: '', lines: { 1: p.mate ? { mate: -1, pv: [] } : { cp: 0, pv: [] } } }
        : await engine.search(p.fenAfter, post, 1);
    }
    const diag = MD.diagnose({
      fenBefore: p.fenBefore, fenAfter: p.fenAfter, playedMove: p.uci,
      engine: { bestUci: pre.bestMove, lines: pre.lines, post: after || undefined, depthPre: depth, depthPost: post },
      context: { ply: i + 1, sanHistory: game.sans, mode: 'analysis', adaptive: true, playerElo: game.userElo || undefined }
    });
    const q = diag.classification.uiQuality;
    const rec = { ply: i, quality: q, wpBefore: round(diag.wpBefore), wpAfter: round(diag.wpAfter), wpLoss: round(diag.wpLoss) };
    if (isError(q, withInacc)) {
      let threat = null;
      const nullFen = MD.nullMoveFen(p.fenBefore);
      if (nullFen) {
        try {
          const pass = await engine.search(nullFen, Math.min(12, depth), 1);
          threat = MD.describeThreat(p.fenBefore, pass, diag.bestScore);
          // your win chance if you had passed instead of moving (the null-move line is scored for the opponent)
          // A real threat wins material or mates. (After the opponent hangs a piece, passing lets them save it, which
          // the null-move search also reports; that is a chance you missed, not a threat.)
          if (threat && pass.lines[1]) {
            threat.passWp = 1 - EV.cpToWinProb(EV.scoreToCp(pass.lines[1]));
            const g = SR.detectMaterialGainInPv(oldBoard(nullFen), pass.lines[1].pv, game.side === 'w' ? 'b' : 'w');
            threat.gain = g ? g.type : null;
          }
        } catch (e) { threat = null; }
      }
      rec.error = describeError(game, p, i, diag, threat, (pre.lines[1] && pre.lines[1].pv) || []);
    }
    tick();
    return rec;
  }));
  // "Not punishing their mistake": the opponent's move just before lost them at least 15% (your win chance went up
  // that much from after your previous move to before this one), and this move gave it back.
  const byPly = {};
  for (const m of moves) byPly[m.ply] = m;
  for (const m of moves) {
    if (!m.error) continue;
    const prev = byPly[m.ply - 2];
    if (prev && prev.wpAfter != null && m.wpBefore - prev.wpAfter >= 0.15) {
      m.error.oppGift = round(m.wpBefore - prev.wpAfter);
      m.error.patterns.push('missed-punish');
    }
  }
  const acc = EV.gameAccuracy(moves.filter(m => m.book || m.wpLoss != null).map(m => ({ is_white: true, win_prob_loss: m.wpLoss || 0, detailed_quality: m.book ? 'book' : '' }))).white;
  const meta = Object.assign({}, game);delete meta.sans;delete meta.clocks;
  return Object.assign(meta, {
    v: VERSION, depth, inaccuracies: withInacc, plies: plies.length, accuracy: acc,
    moves: moves.map(m => [m.ply, m.book ? 'book' : m.forced ? 'forced' : m.quality, m.wpLoss, PHASE_OF(plies[m.ply].fenBefore)]),
    errors: moves.filter(m => m.error).map(m => m.error)
  });
}
const PHASE_OF = fen => EV.gamePhase(fen);

/* ---------- patterns ---------- */
/* Each mistake gets one main pattern, the first that fits in this order (what went wrong on the board), and any number
   of context patterns (the circumstances). */
const PATTERNS = {
  'mate-allowed': { name: 'Walking into mate', kind: 'motif', blurb: 'Your move allowed a forced checkmate.' },
  'missed-mate': { name: 'Missing a forced mate', kind: 'motif', blurb: 'You had a forced checkmate and played something else.' },
  'hanging': { name: 'Leaving pieces hanging', kind: 'motif', blurb: 'Your move left a piece that could be taken for free, or took away the defence of one.' },
  'ignored-threat': { name: 'Ignoring the opponent\'s threat', kind: 'motif', blurb: 'The opponent already had a threat, you didn\'t deal with it, and they carried it out.' },
  'fork': { name: 'Allowing forks', kind: 'motif', blurb: 'Your move let the opponent attack two pieces at once.' },
  'pin': { name: 'Allowing pins and skewers', kind: 'motif', blurb: 'Your move let the opponent pin a piece, or skewer two pieces on a line.' },
  'discovery': { name: 'Overlooking discovered attacks', kind: 'motif', blurb: 'Your move let the opponent move one piece out of the way and attack with the one behind it.' },
  'allowed-combo': { name: 'Missing the opponent\'s combination', kind: 'motif', blurb: 'Your move let the opponent win material by force over a few moves.' },
  'missed-tactic': { name: 'Missing tactics for you', kind: 'motif', blurb: 'You had a way to win material and played something else.' },
  'king-safety': { name: 'Weakening your king', kind: 'motif', blurb: 'Your move weakened the pawns in front of your king or gave up castling.' },
  'opening': { name: 'Opening principles', kind: 'motif', blurb: 'A mistake in the opening that breaks a basic opening principle.' },
  'endgame': { name: 'Endgame technique', kind: 'motif', blurb: 'A mistake in the endgame without a tactic behind it.' },
  'positional': { name: 'Quiet-move slips', kind: 'motif', blurb: 'No single tactic: the move was just clearly worse than the engine\'s choice.' },
  'time-trouble': { name: 'Mistakes in time trouble', kind: 'context', blurb: 'Mistakes made with little time left on your clock.' },
  'hasty': { name: 'Moving too fast', kind: 'context', blurb: 'Mistakes played almost instantly (2 to 5 seconds, depending on the time control) while you still had plenty of time.' },
  'thrown-win': { name: 'Letting a win slip', kind: 'context', blurb: 'You were winning (85% or better) and the move left you at 55% or less.' },
  'missed-punish': { name: 'Not punishing their mistakes', kind: 'context', blurb: 'The opponent had just made a mistake and your move gave the advantage back.' }
};

function describeError(game, p, i, diag, threat, bestPv) {
  const color = game.side, opp = color === 'w' ? 'b' : 'w';
  const best = diag.bestUci || '', ref = diag.refUci || '';
  const before = oldBoard(p.fenBefore), after = oldBoard(p.fenAfter);
  const move = oldBoard(p.fenBefore).move({ from: p.uci.slice(0, 2), to: p.uci.slice(2, 4), promotion: p.uci[4] });
  const refMove = ref.length >= 4 ? { from: ref.slice(0, 2), to: ref.slice(2, 4), promotion: ref[4] } : null;
  const afterRef = refMove ? oldBoard(p.fenAfter, ref) : null;
  const bs = diag.bestScore || {}, ps = diag.playedScore || {};
  const mate = s => s.mate !== undefined && s.mate !== null ? s.mate : null;
  const detail = {};
  let main = null;
  const take = (id, d) => { if (!main) { main = id; Object.assign(detail, d || {}); } };

  if (mate(ps) !== null && mate(ps) < 0 && !(mate(bs) !== null && mate(bs) < 0)) {
    take('mate-allowed', { mateIn: -mate(ps), backRank: backRankMate(p.fenAfter, diag.refPv, color) });
  }
  if (mate(bs) !== null && mate(bs) > 0 && !(mate(ps) !== null && mate(ps) > 0)) take('missed-mate', { mateIn: mate(bs) });
  if (move) {
    const h = SR.detectHangingPieceBlunder(before, after, move, refMove);
    if (h) take('hanging', { piece: h.piece, square: h.square, how: h.type, capture: !!move.captured });
  }
  // The opponent had a threat and your move did nothing about it: they carried it out, or your move left you about where
  // passing would have (much worse than passing means the move did damage of its own, which the later checks name).
  if (threat && threat.gain && ((ref && threat.from + threat.to === ref.slice(0, 4)) || idleMove(threat, diag.wpAfter)))
    take('ignored-threat', { threat: threat.san, carried: !!ref && threat.from + threat.to === ref.slice(0, 4) });
  if (refMove && afterRef) {
    const f = SR.detectFork(oldBoard(p.fenAfter, ref), refMove);
    if (f) take('fork', { attacker: f.attacker, targets: f.targets });
    const pin = SR.detectPin(oldBoard(p.fenAfter, ref), refMove), sk = pin ? null : SR.detectSkewer(oldBoard(p.fenAfter, ref), refMove);
    if (pin || sk) take('pin', { motif: pin ? 'pin' : 'skewer', target: pin ? pin.pinned : sk.front });
    const d = SR.detectDiscoveredAttack(oldBoard(p.fenAfter), oldBoard(p.fenAfter, ref), refMove);
    if (d) take('discovery', { target: d.target || 'king' });
  }
  if (diag.refPv && diag.refPv.length) {
    const g = SR.detectMaterialGainInPv(oldBoard(p.fenAfter), diag.refPv, opp);
    if (g && /^win_(piece|rook|queen)$/.test(g.type)) take('allowed-combo', { gain: g.type.slice(4) });
  }
  if (best && best !== p.uci) {
    const g = bestPv.length ? SR.detectMaterialGainInPv(oldBoard(p.fenBefore), bestPv, color) : null;
    if ((g && /^win_(piece|rook|queen)$/.test(g.type)) || (diag.tags || []).includes('Missed Tactic')) {
      const motif = SR.classifyTacticalMotif(p.fenBefore, best);
      take('missed-tactic', { gain: g ? g.type.slice(4) : null, motif: motif ? motif.motif : 'positional' });
    }
  }
  if (move) {
    const ks = SR.detectKingSafetyFlaw(before, after, move);
    if (ks || (diag.tags || []).includes('King Safety')) take('king-safety', { how: ks && /castling/.test(ks) ? 'castling' : 'shield' });
  }
  if (diag.phase === 'opening' && move) {
    const v = OD.detectOpeningPrincipleViolation(oldBoard(p.fenBefore), move, i + 1, { bestUci: best });
    if (v) take('opening', { rule: v });
  }
  if (diag.phase === 'endgame') take('endgame', { ending: endingType(p.fenBefore) });
  take('positional');

  const patterns = [main];
  const clock = clockContext(game, i);
  if (clock && clock.trouble) patterns.push('time-trouble');
  if (clock && clock.hasty) patterns.push('hasty');
  if (diag.wpBefore >= 0.85 && diag.wpAfter < 0.55) patterns.push('thrown-win');

  return {
    ply: i, move: moveNo(i) + p.san, san: p.san, uci: p.uci, prev: p.prev, fen: p.fenBefore,
    quality: diag.classification.uiQuality, detailed: diag.classification.detailedQuality,
    wpBefore: round(diag.wpBefore), wpAfter: round(diag.wpAfter), wpLoss: round(diag.wpLoss), phase: diag.phase,
    best: best, bestSan: diag.bestSan || '', bestLine: sanLine(p.fenBefore, bestPv, 8),
    ref: ref, refSan: diag.refSan || '', refLine: sanLine(p.fenAfter, diag.refPv, 8),
    evalBefore: EV.formatScore(whitePov(bs, color), 'w'), evalAfter: EV.formatScore(whitePov(ps, color), 'w'),
    explanation: diag.explanation || '', bluf: (diag.why && diag.why.bluf && diag.why.bluf.text) || '',
    tags: diag.tags || [], threat: threat ? { san: threat.san, from: threat.from, to: threat.to, text: threat.text, passWp: round(threat.passWp), gain: threat.gain || null } : null,
    clock, patterns, detail
  };
}
const idleMove = (threat, wpAfter) => threat.passWp != null && Math.abs(wpAfter - threat.passWp) <= 0.07;
const whitePov = (s, color) => color === 'w' ? s : { cp: s.cp != null ? -s.cp : undefined, mate: s.mate != null ? -s.mate : undefined };
function endingType(fen) {
  const s = fen.split(' ')[0].toLowerCase(), has = t => s.includes(t);
  if (has('q')) return 'queen';
  if (has('r')) return has('n') || has('b') ? 'rook and minor piece' : 'rook';
  if (has('n') || has('b')) return 'minor piece';
  return 'king and pawn';
}
/* The mate comes from a rook or queen landing on your back rank, with your king still on it. */
function backRankMate(fenAfter, refPv, color) {
  if (!refPv || !refPv.length) return false;
  const c = new Chess(fenAfter), rank = color === 'w' ? '1' : '8';
  let last = null;
  for (const u of refPv.slice(0, 9)) { try { last = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch (e) { return false; } if (c.isCheckmate()) break; }
  if (!c.isCheckmate() || !last) return false;
  const king = c.findPiece({ type: 'k', color })[0];
  return /[rq]/.test(last.piece) && last.to[1] === rank && king && king[1] === rank;
}

/* ---------- patterns over all games ---------- */
function aggregate(results) {
  const games = results.length;
  let moves = 0, errors = 0, lost = 0;
  const byPhase = { opening: { moves: 0, errors: 0 }, middlegame: { moves: 0, errors: 0 }, endgame: { moves: 0, errors: 0 } };
  const byQuality = { inaccuracy: 0, mistake: 0, blunder: 0 };
  const P = {};
  for (const id of Object.keys(PATTERNS)) P[id] = Object.assign({ id, items: [], games: new Set(), cost: 0 }, PATTERNS[id]);
  for (const g of results) {
    for (const [, q, , ph] of g.moves) {
      if (q === 'book' || q === 'forced') continue;
      moves++;if (byPhase[ph]) byPhase[ph].moves++;
      if (byQuality[q] != null) byQuality[q]++;
    }
    for (const e of g.errors) {
      errors++;lost += e.wpLoss;if (byPhase[e.phase]) byPhase[e.phase].errors++;
      for (const id of e.patterns) { const p = P[id];if (!p) continue;p.items.push({ game: g, e });p.games.add(g.key);p.cost += e.wpLoss; }
    }
  }
  const accs = results.map(g => g.accuracy).filter(a => a != null);
  const patterns = Object.values(P).filter(p => p.items.length).map(p => {
    p.items.sort((a, b) => b.e.wpLoss - a.e.wpLoss);
    p.count = p.items.length;p.gameCount = p.games.size;p.recurring = p.gameCount >= 2;
    // the headline numbers: share of all your mistakes, average win chance lost, blunders among them
    p.share = errors ? p.count / errors : 0;p.avg = p.cost / p.count;p.blunders = p.items.filter(x => x.e.quality === 'blunder').length;
    return p;
  }).sort((a, b) => (b.kind === 'motif') - (a.kind === 'motif') || b.recurring - a.recurring || b.cost - a.cost);
  const summary = { games, moves, errors, lost, byPhase, byQuality, accuracy: accs.length ? accs.reduce((a, b) => a + b, 0) / accs.length : null,
    wins: results.filter(g => g.result === 'win').length, losses: results.filter(g => g.result === 'loss').length };
  // a slip in the write-up must not hide the results, so a pattern whose text fails keeps its numbers and tips
  for (const p of patterns) {
    try { p.analysis = analyse(p); } catch (e) { p.analysis = { text: [], tips: TIPS[p.id] || [] }; }
  }
  summary.insights = insights(summary, patterns, results);
  return { summary, patterns };
}

/* ---------- write-up ---------- */
const pct = x => Math.round(x * 100) + '%';
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));
const cap = t => t && t[0].toUpperCase() + t.slice(1);
/* "It was" / "All were" / "2 of 5 were" */
const some = (k, n) => k === n ? (n === 1 ? 'It was' : 'All were') : `${k} of ${n} ${k === 1 ? 'was' : 'were'}`;
const times = n => n === 1 ? 'once' : n === 2 ? 'twice' : n + ' times';
function tally(list) { const t = {};for (const x of list) if (x != null && x !== '') t[x] = (t[x] || 0) + 1;return Object.entries(t).sort((a, b) => b[1] - a[1]); }
function listText(entries, fmt) {
  const parts = entries.map(([k, n]) => fmt(k, n));
  return parts.length <= 1 ? parts.join('') : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
}

const TIPS = {
  'mate-allowed': ['Before every move, look at every check your opponent would have after it. Mates nearly always start with a check.',
    'Give your king an escape square (luft) once the position calms down, so a rook or queen on your back rank isn\'t mate.',
    'When your king is under attack, count attackers and defenders around it before you go after material elsewhere.'],
  'missed-mate': ['When the opponent\'s king is exposed, look at checks first, every one of them, before anything else.',
    'Solve short mate puzzles (mate in 2 and 3) to learn the common mating patterns by sight.',
    'In a winning attack, ask "is there a forced finish?" before going for material.'],
  'hanging': ['Blunder check before you let go of a piece: after this move, what can the opponent take, and is it defended enough?',
    'When a piece moves away, check what it was defending. That piece may now be loose.',
    'Count attackers and defenders on the square you move to, cheapest attacker first.'],
  'ignored-threat': ['After every opponent move, ask "what does this move want to do next?" before thinking about your own plans.',
    'Look at the squares and pieces the opponent\'s last move attacks, including through other pieces.',
    'If you can\'t find their idea, imagine it is their move again: what would they play?'],
  'fork': ['Watch for squares where an opponent knight or pawn would attack two of your pieces, and don\'t leave your king, queen and rooks on them.',
    'Unprotected pieces are the usual fork targets. Keep pieces defended, or keep them off the same knight\'s distance.',
    'Before moving, list the opponent\'s checks: many forks start with a check.'],
  'pin': ['Avoid lining up your king, queen or rooks on one file, rank or diagonal with an opponent bishop, rook or queen able to reach it.',
    'Break pins early (move the king or queen off the line, or put a defended piece in between) before they cost material.',
    'When a piece is pinned, don\'t count it as a defender.'],
  'discovery': ['When an opponent piece stands in front of their rook, bishop or queen, ask what happens if it moves away with tempo.',
    'Pieces in line with your king or queen behind an opponent piece are the usual targets.',
    'Check the long lines (files and diagonals) through your king and queen after every opponent move.'],
  'allowed-combo': ['Before playing a move, look one step further: after their best reply (checks, captures, threats), are you still fine?',
    'Loose pieces and an exposed king are what combinations need. Fix them first.',
    'Practise calculation: work out short forcing lines to the end without moving the pieces.'],
  'missed-tactic': ['Every move, look at all of your checks, captures and threats first, even the ones that look silly.',
    'Loose (undefended) opponent pieces and an exposed king are the usual signs a tactic is there.',
    'Do a few tactics puzzles a day; pattern recognition comes from volume.'],
  'king-safety': ['Castle early, and think twice before pushing the pawns in front of your castled king.',
    'Don\'t move your king in the opening unless you have to; keep the right to castle.',
    'Pawn moves can\'t be taken back. Before pushing one near your king, ask which squares it stops covering.'],
  'opening': ['Develop knights and bishops before moving the same piece twice or bringing the queen out.',
    'Fight for the centre with pawns and pieces, and castle within the first ten moves or so.',
    'Learn the ideas behind your openings, not just the moves, so you know what to do when the opponent deviates.'],
  'endgame': ['Activate your king in the endgame: it is a strong piece once the queens are off.',
    'Learn the basic positions: king and pawn opposition, the Lucena and Philidor rook endings.',
    'In the endgame, slow down and calculate; small slips decide the game.'],
  'positional': ['Compare your move with the engine\'s choice and ask what plan it follows. Often it improves the worst-placed piece.',
    'Before a quiet move, check what the opponent\'s most active plan is and whether your move helps against it.',
    'Avoid moves that give up a square or a pawn structure for nothing in return.'],
  'time-trouble': ['Spend less time on the opening and on obvious moves, so you have time left for the critical moments.',
    'Use the increment: in time trouble, play simple, safe moves and keep pieces defended.',
    'If this keeps happening, try a longer time control for a while.'],
  'hasty': ['Before you move, sit on your hands for a moment and do a blunder check, even when the move looks obvious.',
    'A fast move is fine when nothing has changed, but after captures, checks and new threats, take a few seconds.',
    'You had time left on the clock. Use it in sharp positions.'],
  'thrown-win': ['When you are winning, look for the opponent\'s counterplay first: checks, captures and threats against you.',
    'Simplify: trade pieces, not pawns, and choose the safe win over the fancy one.',
    'Don\'t relax once you are winning. Most points are lost right after the position is won.'],
  'missed-punish': ['When the opponent makes an unexpected move, stop and ask why: it may be a mistake you can punish.',
    'Look for captures and checks after every opponent move, especially surprising ones.',
    'If their last move left a piece loose or the king open, look for the tactic before your plan.']
};

/* What recurs about a pattern, one short sentence each: phase, colour, the details that repeat, the clock, lost games.
   (How often, how costly and how many blunders are numbers on the pattern: count, gameCount, share, avg, blunders.) */
function analyse(p) {
  const items = p.items.map(x => x.e), n = items.length, out = [];
  const phases = tally(items.map(e => e.phase));
  if (phases.length) out.push(phases.length > 1 ? `By phase: ${listText(phases, (k, c) => `${c} in the ${k}`)}.` : `${n === 1 ? 'In' : 'All in'} the ${phases[0][0]}.`);
  const colors = tally(p.items.map(x => x.game.side === 'w' ? 'White' : 'Black'));
  if (n >= 3 && colors.length && colors[0][1] >= n * 0.8) out.push(`${colors[0][1] === n ? 'All' : colors[0][1] + ' of ' + n} with the ${colors[0][0].toLowerCase()} pieces.`);
  const specific = specifics(p, items);
  if (specific) out.push(specific);
  if (p.kind === 'motif') {
    const pressed = items.filter(e => e.clock && e.clock.trouble).length, fast = items.filter(e => e.clock && e.clock.hasty).length;
    if (pressed) out.push(`${some(pressed, n)} in time trouble.`);
    if (fast && fast >= n / 3) out.push(`${some(fast, n)} played almost instantly with time on the clock: slowing down would catch ${n === 1 ? 'a move like this' : 'some of these'}.`);
  }
  const lostGames = new Set(p.items.filter(x => x.game.result === 'loss' && x.e.wpAfter < 0.3 && x.e.wpBefore >= 0.4).map(x => x.game.key)).size;
  if (lostGames) out.push(`It turned ${plural(lostGames, 'game')} you went on to lose from playable to lost.`);
  return { text: out, tips: TIPS[p.id] || [] };
}
function specifics(p, items) {
  const d = items.map(e => e.detail || {});
  switch (p.id) {
    case 'hanging': {
      const pcs = tally(d.map(x => x.piece));
      const n = items.length, def = d.filter(x => x.how === 'removed_defender').length, caps = d.filter(x => x.capture && x.how !== 'removed_defender').length;
      let s = `Pieces left loose: ${listText(pcs, (k, c) => `${k} ${times(c)}`)}.`;
      if (def) s += ` ${def === n ? (n === 1 ? 'The' : 'Every time, the') : cap(times(def)) + ', the'} piece you moved had been defending it.`;
      if (caps) s += ` ${some(caps, n)} ${caps === 1 ? 'a capture' : 'captures'} on a square the opponent could win back with interest.`;
      return s;
    }
    case 'fork': return `Forking piece: ${listText(tally(d.map(x => x.attacker)), (k, c) => `${k} ${times(c)}`)}.`;
    case 'pin': return cap(listText(tally(d.map(x => x.motif)), (k, c) => c === 1 ? 'a ' + k : plural(c, k))) + `, hitting your ${listText(tally(d.map(x => x.target)), (k, c) => c > 1 ? `${k} (${c})` : k)}.`;
    case 'discovery': return `Target: ${listText(tally(d.map(x => x.target)), (k, c) => c > 1 ? `${k} (${c})` : k)}.`;
    case 'allowed-combo': case 'missed-tactic': {
      const gain = tally(d.map(x => x.gain));
      let s = gain.length ? `Material at stake: ${listText(gain, (k, c) => `${k === 'piece' ? 'a minor piece' : 'a ' + k} ${times(c)}`)}.` : '';
      if (p.id === 'missed-tactic') {
        const m = tally(d.map(x => x.motif).filter(x => x && x !== 'positional'));
        const name = { fork: 'a fork', pin: 'a pin', skewer: 'a skewer', discovered: 'a discovered attack', hanging: 'taking a loose piece', mateThreat: 'a mate threat', check: 'a check', trapped: 'trapping a piece', capture: 'a capture' };
        if (m.length) s += ` The winning move was ${listText(m, (k, c) => `${name[k] || k}${c > 1 ? ` (${c})` : ''}`)}.`;
        const gift = items.filter(e => e.patterns.includes('missed-punish')).length;
        if (gift) s += ` ${gift === items.length ? 'Each time' : cap(times(gift))}, it was there because the opponent had just made a mistake.`;
      }
      return s.trim();
    }
    case 'mate-allowed': {
      const br = d.filter(x => x.backRank).length, quick = d.filter(x => x.mateIn <= 2).length;
      const n = items.length;
      return [br ? `${some(br, n)} ${br === 1 ? 'a back-rank mate' : 'back-rank mates'}.` : '', quick ? `${some(quick, n)} mate in one or two, so looking at every check would have caught ${quick === 1 ? 'it' : 'them'}.` : ''].join(' ').trim();
    }
    case 'missed-mate': return `Missed: ${listText(tally(d.map(x => x.mateIn)), (k, c) => `mate in ${k} ${times(c)}`)}.`;
    case 'ignored-threat': {
      const carried = d.filter(x => x.carried).length, t = items.filter(e => e.threat).map(e => e.threat.text.split('. ')[0]);
      const idle = items.filter(e => e.threat && idleMove(e.threat, e.wpAfter)).length;
      const n = items.length, each = k => k === n ? (n === 1 ? '' : 'Every time, ') : k + ' of ' + n + ' times, ';
      return ((carried ? cap(`${each(carried)}the opponent went on to play the threat. `) : '') +
        (idle ? cap(`${each(idle)}your move left you about where passing would have. `) : '') +
        (t.length ? `For example: ${t[0]}.` : '')).trim();
    }
    case 'king-safety': {
      const c = d.filter(x => x.how === 'castling').length;
      return c ? `${c === items.length ? 'All' : c + ' of ' + items.length} gave up castling by moving the king.` : 'Mostly pawn moves in front of your castled king.';
    }
    case 'opening': return `Principles broken: ${listText(tally(d.map(x => x.rule)), (k, c) => `${k}${c > 1 ? ` (${c})` : ''}`)}.`;
    case 'endgame': return `Endings: ${listText(tally(d.map(x => x.ending)), (k, c) => `${k} ${c > 1 ? `(${c})` : ''}`.trim())}.`;
    case 'time-trouble': {
      const left = items.filter(e => e.clock).map(e => e.clock.left);
      return left.length ? `On average you had ${Math.round(left.reduce((a, b) => a + b, 0) / left.length)} seconds left.` : '';
    }
    case 'hasty': {
      const spent = items.filter(e => e.clock).map(e => e.clock.spent);
      return spent.length ? `You spent ${(spent.reduce((a, b) => a + b, 0) / spent.length).toFixed(1)} seconds on these moves on average.` : '';
    }
    case 'thrown-win': {
      const res = tally(p.items.filter((x, k, a) => a.findIndex(y => y.game.key === x.game.key) === k).map(x => x.game.result));
      return `Those games ended in ${listText(res, (k, c) => `${plural(c, k === 'win' ? 'win' : k === 'loss' ? 'loss' : 'draw', k === 'loss' ? 'losses' : null)}`)}.`;
    }
    case 'missed-punish': {
      const g = items.map(e => e.oppGift || 0);
      return `Their mistake had given you about ${pct(g.reduce((a, b) => a + b, 0) / g.length)} win chance on average, and you gave it back.`;
    }
  }
  return '';
}
/* A few lines about the whole set that the list of patterns doesn't already say: where the mistakes happen, the
   circumstance behind many of them, and the losses a single move decided. */
function insights(S, patterns, results) {
  const out = [];
  if (!S.moves) return out;
  const rates = PHASES.filter(ph => S.byPhase[ph].moves >= 10).map(ph => [ph, S.byPhase[ph].errors / S.byPhase[ph].moves]).sort((a, b) => b[1] - a[1]);
  if (rates.length >= 2 && rates[0][1] > 0 && rates[0][1] >= rates[rates.length - 1][1] * 1.5)
    out.push(`You make the most mistakes per move in the ${rates[0][0]} (one every ${Math.round(1 / rates[0][1])} moves) and the fewest in the ${rates[rates.length - 1][0]}${rates[rates.length - 1][1] ? ` (one every ${Math.round(1 / rates[rates.length - 1][1])})` : ''}.`);
  const ctx = patterns.filter(p => p.kind === 'context' && p.recurring).sort((a, b) => b.count - a.count)[0];
  if (ctx && ctx.count >= S.errors * 0.25) out.push(`${pct(ctx.count / S.errors)} of your mistakes fall under "${ctx.name.toLowerCase()}".`);
  const decided = results.filter(g => g.result === 'loss' && g.errors.some(e => e.wpBefore >= 0.4 && e.wpAfter < 0.3)).length;
  if (decided) out.push(S.losses === 1 ? 'Your one loss turned on a single move that took you from a playable position to a lost one.'
    : `In ${decided} of your ${S.losses} losses, a single move took you from a playable position to a lost one.`);
  return out;
}

return { VERSION, PATTERNS, SPEEDS, lichessUrl, fromLichess, parseLichessNdjson, fromChessCom, analyzeGame, aggregate, isError };
}));
