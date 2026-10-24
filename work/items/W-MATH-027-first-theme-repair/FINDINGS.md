# Findings

- Main and actual hosted lesson source differed. Start from hosted171c; change the hosting pointer explicitly.
- First-theme content contained full-expression jumps despite earlier local-token improvements.
- A three-heading catalog existed only outside the public source. Place NE01/NE02 inside their proper themes.
- Restart reset answers but only N12 remounted and scrolled. Clear current stage cursor and remount all units.
- Historical tests describe specific earlier editions. They now explicitly project the immutable171c contract;
  new current-edition tests check every protected original item hash, all new decisions, migration and stage dependencies.
- Independent math checking found a mathematically equivalent distractor containing an unrestored T. Replaced it
  with a numerically incorrect substitution, so rejection has a clear mathematical basis as well as the task instruction.
- Local default browser download failed; an older headless Chromium downloaded successfully. Browser checks use the
  explicit executable path locally. CI uses its installed Chromium and exercises the compiled artifact and live site.
