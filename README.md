# Chess Vision Lab

Browser-based chess training drills, and an analysis of your own games. No build step needed to run: serve `docs/` (for example `python3 -m http.server -d docs`) and open it. Line Vision also works straight from the file; Spot the Danger needs http(s) for its engine, and without it the drill still works but shows no evaluations. Mistake Patterns needs http(s) and an internet connection to fetch your games. Book Reader needs http(s) for its reader and engine (web workers), and an internet connection only to open PDFs.

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
3. Once a run starts, the form folds into a summary of whose games these are, with the progress and the list of games (**Change** opens the form again). The mistakes you repeat (seen in two games or more) come first, costliest first by the win chance they cost you, then the circumstances they happen in; once anything recurs, the patterns seen in a single game are folded away under one link. Pick a pattern to step through its examples on the board.

Moves are judged the way [WhyBlunder](https://github.com/huytd/whyblunder) does it, using its own modules: a MultiPV 3 search before your move, a search for the opponent's best reply when your move wasn't the engine's choice, and `MoveDiagnostics.diagnose()` for the verdict (win-probability loss with WhyBlunder's adaptive inaccuracy, mistake and blunder bands, book moves skipped) and its explanation. On every mistake and blunder, a null-move search shows what the opponent was threatening.

Each mistake and blunder (inaccuracies too, if you turn them on in Settings) gets one **main pattern**, the first of these that fits, found with WhyBlunder's SituationRecognizer:

- **Walking into mate**: your move allows a forced mate (back-rank mates are counted).
- **Missing a forced mate**: you had one.
- **Leaving pieces hanging**: the moved piece can be won (static exchange), or it was the defender of one.
- **Ignoring the opponent's threat**: they had a threat that wins material or mates, and your move left you about where passing would have, or they carried it out.
- **Allowing forks**, **Allowing pins and skewers**, **Overlooking discovered attacks**: the opponent's best reply is one.
- **Missing the opponent's combination**: their best line wins a piece or more by force.
- **Missing tactics for you**: your best line won a piece or more (the review names the motif: fork, pin, loose piece…).
- **Weakening your king**, **Opening principles**, **Endgame technique**, and **Quiet-move slips** for the rest.

On top of that, **context patterns** describe the circumstances: **mistakes in time trouble** (under a tenth of the base time, 10 to 60 seconds), **moving too fast** (played in 2 to 5 seconds, depending on the time control, with more than a quarter of your time left), **letting a win slip** (from 85% win chance or better to 55% or less) and **not punishing their mistakes** (the opponent's move just before had handed you 15% or more).

Each example plays out in three steps on the board: **Your move** (with, dashed, what the opponent was threatening, and faintly the better move to compare it with), **Their reply** (their best answer) and **Better move** (the engine's choice), each with a line saying what it shows and what it did to your win chance. ←/→ step through the examples and ↑/↓ through the three steps. Below come WhyBlunder's explanation, a link to the game, and under **Engine details** the evaluations and both lines. Then the pattern itself: how often and in how many games it happened, its share of your mistakes, what it cost and how many were blunders, short notes on when it happens (phase, colour, clock), the details that recur (which pieces you leave loose, which piece forks you, which motif you miss, which endings) and how many lost games it decided, and what to work on.

Settings choose the engine depth: Quick (12), Normal (16, the default, about 20 seconds a game on four workers) or Deep (18, WhyBlunder's own depth). The reply search runs 2 plies shallower, the threat search at depth 12, and every search stops after 45 seconds at most. Analysed games are saved in the browser (up to 200), so running again only analyses new games; a link like `mistake-patterns.html?site=lichess&user=NAME` starts straight away. Stockfish runs in up to four worker threads, each searching from a fresh hash so results are repeatable.

## Books

### Book Reader
Set up the chess diagrams in a book on a board.

1. **Open a page**: a photo of a book page (**Take a photo** opens the camera on a phone), a screenshot of an ebook, a scan, or a PDF (‹ › turn its pages; the page you were on is remembered). On a computer you can also drop a file on the page or paste a screenshot.
2. Every diagram on the page is found, outlined and numbered; tap one to set it up on the board. Several diagrams on a page, of any size, are found, and photos that aren't quite square-on are straightened.
3. Squares the reader wasn't sure of are outlined in orange. Compare with the diagram as printed (shown beside the board) and fix any square with **Fix a square**: pick a piece (or **Empty**), then tap squares.
4. Choose who is to move (the side in check is picked for you, White otherwise), and **Flip** if the diagram shows Black at the bottom (that is guessed from the pawns and kings, as books nearly always print White at the bottom).
5. Stockfish analyses the position: its evaluation, its line, and its move as an arrow. Tap or drag pieces to play through a line from the diagram; **‹ Back** (or ←) and **Diagram** go back. **Copy** the FEN, or open the position on Lichess to analyse it or play it out against the computer.

If a diagram is missed, or its outline is off, **Add a board** (or **Corners** for the diagram on show) lets you drag its four corners onto the corners of the squares yourself.

The reading uses [Watch Chess in 3D](https://github.com/huytd/watchchess3d)'s square classifier, a small CNN that reads each square as empty or one of the 12 pieces, and its way of finding a board (the strongest 8x8 light/dark checkerboard pattern, then the edges nudged until every cell's rim sits inside one square), ported to plain JavaScript and run in a Web Worker, so nothing is uploaded. For book pages it searches a small image pyramid and keeps every strong board, not just one; fits each corner on its own (perspective), on a blurred copy so hatched squares read as the grey they stand for; flattens hatched dark squares to flat grey before the squares are read (the CNN was trained on screen boards, and reads pieces on flat grey squares as well as anywhere); and decodes the readings with one king of each colour and no pawns on the first or last rank. Measured on 160 generated book pages with 271 diagrams (merida, alpha, leipzig and other sets): 249 were found, and 238 of those read without a mistake (0.15% of squares wrong, more than half of them outlined as unsure); every mistake was on hatched dark squares. The 22 missed (mostly faint hatching, or a board found as two half boards) need **Add a board**. Old, blurry scans are harder: on the 1921 diagrams of Capablanca's *Chess Fundamentals* a black piece on a hatched square is sometimes read as White's. Reading a diagram takes about a second on a laptop, a few on a phone.

## Development

```sh
npm install
npm run build   # writes docs/: index.html, img/, spot-the-danger.html, mistake-patterns.html, book-reader.html, games.js, chess.js, whyblunder.js, patterns.js, diagrams.js, diagram-model.json, stockfish.js + .wasm
```

- `src/line-vision.html`, `src/spot-the-danger.html`, `src/mistake-patterns.html`, `src/book-reader.html` — page sources (CSS + JS), one per app. The build fills in `/*PIECES*/`, `/*COMMON*/` (`src/common.css`, styles shared by every drill), `<!--NAV-->` (links between drills) and `/*GAME_COUNT*/`. To add a drill, add its page to `APPS` in `scripts/build.js`.
- `src/games.txt` — one line per source: `Name|1.e4 e5 2.Nf3 ...` (about 5,000 games). Names containing ` vs ` are shown as games, the rest as opening lines.
- `scripts/build.js` — validates every move with chess.js and packs each game into `docs/games.js` at 2 characters per move; the page replays only the game it shows. Validated lines are cached in `node_modules/.cache`, so the first build takes under a minute and later ones are instant. Also copies the piece and board images (`assets/`) to `docs/img/`, chess.js to `docs/chess.js`, and copies the Stockfish.js lite single-threaded WASM engine to `docs/stockfish.js` + `docs/stockfish.wasm` (single-threaded, so it needs no cross-origin isolation headers; about 1.8 MB).

- `src/patterns.js` — Mistake Patterns' analysis: game import, per-game analysis, pattern detection and the write-up. Copied to `docs/patterns.js`. It also runs in Node: `require('./src/patterns.js')(Chess, require('./docs/whyblunder.js'))`, with any engine that has `search(fen, depth, multipv)`.
- `src/diagrams.js` — Book Reader's diagram finder and reader (Watch Chess in 3D's board search and CNN, ported). Copied to `docs/diagrams.js`; the page also runs it as its Web Worker. It runs in Node too: `const D = require('./src/diagrams.js'); D.readPage(img, D.makeClassifier(model))`.
- `vendor/watchchess3d/` — Watch Chess in 3D's square classifier weights, unmodified (see its README for the commit), copied to `docs/diagram-model.json`.
- `vendor/whyblunder/` — WhyBlunder's analysis modules, unmodified (see its README for the commit). The build bundles them with their own chess.js 0.10.3 into `docs/whyblunder.js`, which exposes one global, `WhyBlunder`.

Line Vision picks lines uniformly over every slice of every game, skipping slices that overlap recently seen ones from the same game.

## Deploy

GitHub Pages serves `docs/` from the `main` branch (Settings → Pages → Deploy from a branch → `main` / `docs`).

## Credits

Pieces and board: the clay set and walnut board in `assets/` (the build copies them to `docs/img/`).

Game scores: [PGN Mentor](https://www.pgnmentor.com/files.html) player collections (Morphy through Carlsen; classical games before 2016, 30–100 half-moves).

Move logic: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2-Clause).

Move analysis: [WhyBlunder](https://github.com/huytd/whyblunder) (move diagnostics, tactical recognition, opening book), with chess.js 0.10.3.

Games: the [Lichess API](https://lichess.org/api) and the [Chess.com Published-Data API](https://www.chess.com/news/view/published-data-api).

Diagram reading: the square classifier and board search of [Watch Chess in 3D](https://github.com/huytd/watchchess3d) (BSD 3-Clause). PDFs: [PDF.js](https://mozilla.github.io/pdf.js/) (Apache-2.0), loaded from cdnjs when a PDF is opened.

Engine: [Stockfish.js](https://github.com/nmrugg/stockfish.js) 19 lite (GPLv3, license in `docs/stockfish-COPYING.txt`), based on [Stockfish](https://github.com/official-stockfish/Stockfish).
