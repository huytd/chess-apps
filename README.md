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
Train your eye for forcing moves.

1. You get a random position from a master game (move 6 onwards, side to move not in check, 2–12 attacks to find). The last move is highlighted.
2. Draw an arrow for every legal capture and check the side to move can play: drag from the piece to its target, or tap the piece and then the target. Draw the same arrow again to remove it.
3. Press **Check**. Arrows that are not attacks turn red, and you can keep looking or press **Show all**.
4. Found attacks are green, missed ones dashed amber. Stockfish (running in the page) rates each attack against its own best move (Best, Good, Dubious, Bad) and shows its line when you tap one.

**Their threats** asks the same question for the opponent, as if it were their move: what is hanging and what checks are coming. Settings let you count captures only and show how many there are to find. Perfect answers on the first check build a streak. Progress is saved in the browser.

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
