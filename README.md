# Chess Vision Lab

Browser-based chess training drills. No server, no build step needed to run: open `docs/index.html`.

## Drills

### Line Vision
Train your ability to visualize a chain of moves.

1. You get a starting position and a line of moves.
2. Play the line in your head, then rearrange the pieces into the final position in one go.
3. Press **Check** (or let it check automatically once your move count matches the line).

Lines get one half-move longer per level (level 1 = 2 half-moves, level 15 = 16). Solve 3 lines in a row on the first check to level up. Settings let you hide the move list once you start moving, auto-check, auto-advance to the next line, and turn auto level-up on or off. Progress is saved in the browser.

To think through a line, right-click a square to highlight it or right-drag to draw an arrow (green by default; hold Shift for red, Alt for blue, Shift+Alt for yellow). Repeat the same mark to remove it; left-click the board or press Esc to clear them all.

## Development

```sh
npm install
npm run build   # writes docs/index.html, docs/games.js, docs/chess.js
```

- `src/line-vision.html` — page source (CSS + JS). `/*PIECES*/` and `/*GAME_COUNT*/` are filled in by the build.
- `src/games.txt` — one line per source: `Name|1.e4 e5 2.Nf3 ...` (about 5,000 games). Names containing ` vs ` are shown as games, the rest as opening lines.
- `scripts/build.js` — validates every move with chess.js and packs each game into `docs/games.js` at 2 characters per move; the page replays only the game it shows. Validated lines are cached in `node_modules/.cache`, so the first build takes under a minute and later ones are instant. Also inlines piece images and copies chess.js to `docs/chess.js`.

Lines are picked uniformly over every slice of every game, skipping slices that overlap recently seen ones from the same game.

## Deploy

GitHub Pages serves `docs/` from the `main` branch (Settings → Pages → Deploy from a branch → `main` / `docs`).

## Credits

Piece set: cburnett, via [chessground](https://github.com/lichess-org/chessground) (GPLv2+).

Game scores: [PGN Mentor](https://www.pgnmentor.com/files.html) player collections (Morphy through Carlsen; classical games before 2016, 30–100 half-moves).

Move logic: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2-Clause).
