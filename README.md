# Chess Vision Lab

Browser-based chess training drills. No build step needed to run: serve `docs/` (for example `python3 -m http.server -d docs`) and open it. Line Vision also works straight from the file; Spot the Danger needs http(s) for its engine, and without it the drill still works but shows no evaluations.

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
Train your eye for danger and chances, one position at a time, in two steps.

You get a random position from a master game: move 6 onwards, side to move not in check, and not right after a capture (where the answer is usually just to take back). The last move is highlighted. Draw arrows by dragging from a piece to its target, or tap the piece and then the target.

1. **Dangers.** What could the opponent do to you if it were their move? Draw each capture or check that would really hurt. A **real** threat gains them at least a pawn and a half on Stockfish's current evaluation; the bar allows for the free tempo they'd get. **Minor** ones are optional, and drawing a **harmless** one is wrong.
2. **Chances.** What can you do to them? Any move can be drawn here, quiet ones too, since a combination may start quietly; Stockfish judges drawn moves when you check.
   - **If you have a win** (Stockfish's best move leaves you two pawns up), it's a puzzle and one winning move is enough. A winning move leaves you two pawns up too, and is within a pawn of the best move, or, when the best move wins a lot more than passing would, wins at least half as much. Winning a rook next to a mate counts, but drifting in a won position doesn't.
   - **Otherwise** draw each capture or check that **works**: Stockfish rates it within a pawn of its best move.
   - Either way, **dubious** moves (up to two and a half pawns worse) and moves that still leave you winning are fine to add, and drawing a **trap** is wrong.

Taking a loose piece is usually a real threat or an attack that works. A piece is loose when the exchange on its square wins material: both sides take turns capturing there with their cheapest piece and may stop at any point. The review labels these captures.

Stockfish (running in the page) analyses both steps as soon as the position loads, and **Check** waits for it if needed. After checking, wrong arrows turn red, and you can keep looking or press **Show all**. Found answers are green, missed ones dashed orange, and optional ones blue. The review lists every capture and check with its grade and evaluation, and shows Stockfish's own choice, which may be a quiet move. Tap a row to see its line. Without the engine, material decides: captures that win material must be found, even trades are optional, losing ones are wrong, and quiet moves don't count either way.

Most positions have a loose piece somewhere, so at least one step usually has something to find; about one in five has none, so "nothing here" stays a real answer. A position is perfect when both steps are right on the first check, and perfect positions in a row build a streak. Settings let you leave checks out and show how many there are to find. Progress is saved in the browser.

## Development

```sh
npm install
npm run build   # writes docs/: index.html, spot-the-danger.html, games.js, chess.js, stockfish.js + .wasm
```

- `src/line-vision.html`, `src/spot-the-danger.html` — page sources (CSS + JS), one per drill. The build fills in `/*PIECES*/`, `/*COMMON*/` (`src/common.css`, styles shared by every drill), `<!--NAV-->` (links between drills) and `/*GAME_COUNT*/`. To add a drill, add its page to `APPS` in `scripts/build.js`.
- `src/games.txt` — one line per source: `Name|1.e4 e5 2.Nf3 ...` (about 5,000 games). Names containing ` vs ` are shown as games, the rest as opening lines.
- `scripts/build.js` — validates every move with chess.js and packs each game into `docs/games.js` at 2 characters per move; the page replays only the game it shows. Validated lines are cached in `node_modules/.cache`, so the first build takes under a minute and later ones are instant. Also inlines piece images, copies chess.js to `docs/chess.js`, and copies the Stockfish.js lite single-threaded WASM engine to `docs/stockfish.js` + `docs/stockfish.wasm` (single-threaded, so it needs no cross-origin isolation headers; about 1.8 MB).

Line Vision picks lines uniformly over every slice of every game, skipping slices that overlap recently seen ones from the same game.

## Deploy

GitHub Pages serves `docs/` from the `main` branch (Settings → Pages → Deploy from a branch → `main` / `docs`).

## Credits

Piece set: cburnett, via [chessground](https://github.com/lichess-org/chessground) (GPLv2+).

Game scores: [PGN Mentor](https://www.pgnmentor.com/files.html) player collections (Morphy through Carlsen; classical games before 2016, 30–100 half-moves).

Move logic: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2-Clause).

Engine: [Stockfish.js](https://github.com/nmrugg/stockfish.js) 19 lite (GPLv3, license in `docs/stockfish-COPYING.txt`), based on [Stockfish](https://github.com/official-stockfish/Stockfish).
