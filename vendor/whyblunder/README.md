# WhyBlunder analysis modules (vendored)

Unmodified copies of the move-analysis modules from [huytd/whyblunder](https://github.com/huytd/whyblunder) (`js/`), at commit `369ccc49b3bfdd0a517e4173b93ba2d4833ce413`. Mistake Patterns uses them to judge each move the way WhyBlunder does:

- `chess-evaluator.js`: centipawns to win probability, adaptive inaccuracy/mistake/blunder bands, game phase, accuracy.
- `opening-detector.js`: book moves and opening-principle checks.
- `situation-recognizer.js`: tactical recognition (SEE, hanging pieces, forks, pins, skewers, discovered attacks, king safety, material won along a line).
- `move-diagnostics.js`: `MoveDiagnostics.diagnose()`, which turns the engine's MultiPV and refutation searches into a classification, tags and an explanation; also the null-move threat check.
- `chess.min.js`: chess.js 0.10.3 (BSD-2-Clause), the version these modules are written against.

`scripts/build.js` wraps them into `docs/whyblunder.js` with their own private copy of chess.js 0.10.3, so they don't clash with the chess.js 1.x the pages use. The bundle exposes a single global, `WhyBlunder` (`{ Chess, ChessEvaluator, OpeningDetector, SituationRecognizer, MoveDiagnostics }`).

To update, copy the same five files from a newer WhyBlunder checkout and change the commit above.
