# Chess Vision Lab

Browser-based chess training drills, and an analysis of your own games. No build step needed to run: serve `docs/` (for example `python3 -m http.server -d docs`) and open it. Line Vision also works straight from the file; Spot the Danger needs http(s) for its engine, and without it the drill still works but shows no evaluations. Mistake Patterns needs http(s) and an internet connection to fetch your games.

## Drills

### Line Vision
Train your ability to visualize a chain of moves.

1. You get a starting position and a line of moves.
2. Memorize the line and play it in your head. The moves disappear once you start moving pieces.
3. Rearrange the pieces into the final position in one go.
4. Press **Check** (or let it check automatically once your move count matches the line).

Lines get one half-move longer per level (level 1 = 2 half-moves, level 15 = 16). Solve 3 lines in a row on the first check to level up. The board is shown from the side to move (Flip turns it for the current line). The move list is hidden as soon as you touch the board; Peek shows it again, but that line no longer counts as a first-check solve. Settings let you auto-check, auto-advance to the next line, and turn auto level-up on or off. Progress is saved in the browser.

To think through a line, right-click a square to highlight it or right-drag to draw an arrow (green by default; hold Shift for red, Alt for blue, Shift+Alt for yellow). Repeat the same mark to remove it; left-click the board or press Esc to clear them all.

### Spot the Danger
Train your thinking process, one position at a time, in three steps: dangers, chances, then your move.

You get a random position from a master game: move 6 onwards, side to move not in check, and not right after a capture (where the answer is usually just to take back). The last move is highlighted. Draw arrows by dragging from a piece to its target, or tap the piece and then the target.

1. **Dangers.** What could the opponent do to you if it were their move? Draw each capture or check that would really hurt. A **real** threat gains them at least a pawn and a half on Stockfish's current evaluation; the bar allows for the free tempo they'd get. **Minor** ones are optional, and drawing a **harmless** one is wrong.
2. **Chances.** What can you do to them? Any move can be drawn here, quiet ones too, since a combination may start quietly; Stockfish judges drawn moves when you check.
   - **If you have a win** (Stockfish's best move leaves you two pawns up), it's a puzzle and one winning move is enough. A winning move leaves you two pawns up too, and is within a pawn of the best move, or, when the best move wins a lot more than passing would, wins at least half as much. Winning a rook next to a mate counts, but drifting in a won position doesn't.
   - **Otherwise** draw each capture or check that **works**: Stockfish rates it within a pawn of its best move.
   - Either way, **dubious** moves (up to two and a half pawns worse) and moves that still leave you winning are fine to add, and drawing a **trap** is wrong.
3. **What to do.** Now decide: draw the moves you'd play, whether a defence, an attack or a quiet move. Stockfish grades each against its best move: within half a pawn is good (**Best** / **Good**), and so is any move that keeps a win; **Inaccurate** moves (up to a pawn and a half worse) are allowed; anything worse is a **Mistake** or **Blunder**. You need at least one good move and no mistakes, so listing candidates is fine but drawing everything isn't. If you miss, try again or ask for Stockfish's move and its line. The result shows your moves (green, orange or red) and Stockfish's choice (dashed).

Taking a loose piece is usually a real threat or an attack that works. A piece is loose when the exchange on its square wins material: both sides take turns capturing there with their cheapest piece and may stop at any point. The review labels these captures.

If you think a step has nothing to find, press **No danger** or **No chances** (next to **Check**). Stockfish (in its own worker thread, depth 18) analyses both steps as soon as the position loads, and **Check** waits for it if needed. While you play, it also prepares the next three positions, so the next one is usually judged by the time you get there; the position on screen always comes first. After checking, wrong arrows turn red, and you can keep looking or press **Show all**. Found answers are green, missed ones dashed orange, and optional ones blue. The review lists every capture and check with its grade and evaluation, and shows Stockfish's own choice, which may be a quiet move. Tap a row to see its line. Without the engine, material decides: captures that win material must be found, even trades are optional, losing ones are wrong, and quiet moves don't count either way.

Positions come right after the opponent's move, which more often leaves your pieces loose than theirs, so the picker asks for a loose piece of theirs as often as one of yours; about one in five has none at all, so "nothing here" stays a real answer. A position is perfect when all three steps are right on the first check, and perfect positions in a row build a streak. After a correct answer it goes on to the next step by itself after a short pause (the last step waits for you), with a countdown on the button; **Stay**, or tapping a move in the review, cancels it. Settings let you turn that off, leave checks out and show how many there are to find. Progress is saved in the browser.

## Analysis

### Mistake Patterns
Find the mistakes you keep making across your recent games.

1. Pick **Lichess** or **Chess.com**, enter your username, choose how many recent games (5 to 50) and which time controls.
2. **Analyse games** fetches them from the site's public API and checks every one of your moves with Stockfish, in your browser. Results fill in game by game; **Stop** keeps what is done so far.
3. The patterns are listed by the win chance they cost you, recurring ones (seen in two games or more) first. Pick one to read its analysis and step through its examples on the board.

Moves are judged the way [WhyBlunder](https://github.com/huytd/whyblunder) does it, using its own modules: a MultiPV 3 search before your move, a search for the opponent's best reply when your move wasn't the engine's choice, and `MoveDiagnostics.diagnose()` for the verdict (win-probability loss with WhyBlunder's adaptive inaccuracy, mistake and blunder bands, book moves skipped) and its explanation. On every mistake and blunder, a null-move search shows what the opponent was threatening.

Each mistake and blunder (inaccuracies too, if you turn them on in Settings) gets one **main pattern**, the first of these that fits, found with WhyBlunder's SituationRecognizer:

- **Walking into mate**: your move allows a forced mate (back-rank mates are counted).
- **Missing a forced mate**: you had one.
- **Leaving pieces en prise**: the moved piece can be won (static exchange), or it was the defender of one.
- **Ignoring the opponent's threat**: they had a threat that wins material or mates, and your move left you about where passing would have, or they carried it out.
- **Allowing forks**, **Allowing pins and skewers**, **Overlooking discovered attacks**: the opponent's best reply is one.
- **Missing the opponent's combination**: their best line wins a piece or more by force.
- **Missing tactics for you**: your best line won a piece or more (the review names the motif: fork, pin, loose piece…).
- **Weakening your king**, **Opening principles**, **Endgame technique**, and **Quiet-move slips** for the rest.

On top of that, **context patterns** describe the circumstances: **mistakes in time trouble** (under a tenth of the base time, 10 to 60 seconds), **moving too fast** (played in 2 to 5 seconds, depending on the time control, with more than a quarter of your time left), **letting a win slip** (from 85% win chance or better to 55% or less) and **not punishing their mistakes** (the opponent's move just before had handed you 15% or more).

For each pattern the analysis says how often and in how many games it happened, its share of your mistakes, what it cost, when it happens (phase, colour, clock), the details that recur (which pieces you leave loose, which piece forks you, which motif you miss, which endings), how many lost games it decided, and what to work on. Each example shows the position with your move, the better move and the threat (or, under **Their reply**, the position after your move and their best answer), WhyBlunder's explanation, both lines, and a link to the game.

Settings choose the engine depth (Quick 10, Normal 12, Deep 16). Analysed games are saved in the browser (up to 200), so running again only analyses new games; a link like `mistake-patterns.html?site=lichess&user=NAME` starts straight away. Stockfish runs in up to four worker threads, each searching from a fresh hash so results are repeatable.

## Development

```sh
npm install
npm run build   # writes docs/: index.html, spot-the-danger.html, mistake-patterns.html, games.js, chess.js, whyblunder.js, patterns.js, stockfish.js + .wasm
```

- `src/line-vision.html`, `src/spot-the-danger.html`, `src/mistake-patterns.html` — page sources (CSS + JS), one per app. The build fills in `/*PIECES*/`, `/*COMMON*/` (`src/common.css`, styles shared by every drill), `<!--NAV-->` (links between drills) and `/*GAME_COUNT*/`. To add a drill, add its page to `APPS` in `scripts/build.js`.
- `src/games.txt` — one line per source: `Name|1.e4 e5 2.Nf3 ...` (about 5,000 games). Names containing ` vs ` are shown as games, the rest as opening lines.
- `scripts/build.js` — validates every move with chess.js and packs each game into `docs/games.js` at 2 characters per move; the page replays only the game it shows. Validated lines are cached in `node_modules/.cache`, so the first build takes under a minute and later ones are instant. Also inlines piece images, copies chess.js to `docs/chess.js`, and copies the Stockfish.js lite single-threaded WASM engine to `docs/stockfish.js` + `docs/stockfish.wasm` (single-threaded, so it needs no cross-origin isolation headers; about 1.8 MB).

- `src/patterns.js` — Mistake Patterns' analysis: game import, per-game analysis, pattern detection and the write-up. Copied to `docs/patterns.js`. It also runs in Node: `require('./src/patterns.js')(Chess, require('./docs/whyblunder.js'))`, with any engine that has `search(fen, depth, multipv)`.
- `vendor/whyblunder/` — WhyBlunder's analysis modules, unmodified (see its README for the commit). The build bundles them with their own chess.js 0.10.3 into `docs/whyblunder.js`, which exposes one global, `WhyBlunder`.

Line Vision picks lines uniformly over every slice of every game, skipping slices that overlap recently seen ones from the same game.

## Deploy

GitHub Pages serves `docs/` from the `main` branch (Settings → Pages → Deploy from a branch → `main` / `docs`).

## Credits

Piece set: cburnett, via [chessground](https://github.com/lichess-org/chessground) (GPLv2+).

Game scores: [PGN Mentor](https://www.pgnmentor.com/files.html) player collections (Morphy through Carlsen; classical games before 2016, 30–100 half-moves).

Move logic: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2-Clause).

Move analysis: [WhyBlunder](https://github.com/huytd/whyblunder) (move diagnostics, tactical recognition, opening book), with chess.js 0.10.3.

Games: the [Lichess API](https://lichess.org/api) and the [Chess.com Published-Data API](https://www.chess.com/news/view/published-data-api).

Engine: [Stockfish.js](https://github.com/nmrugg/stockfish.js) 19 lite (GPLv3, license in `docs/stockfish-COPYING.txt`), based on [Stockfish](https://github.com/official-stockfish/Stockfish).
