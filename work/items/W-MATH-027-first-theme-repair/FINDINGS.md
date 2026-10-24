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

R1: A count of added decisions is not an acceptance criterion. A whole-expression answer picker does not automatically
become an equation-local fill-in blank. Inspect the actual unfinished equation and trace the purpose/use of each result.
Positive layout feedback is bound to layout; content quality must be reviewed separately.

R2: Page-level overflow and successful completion missed clipping inside individual option cards.
Removing quad and splitting one math expression into independent KaTeX chunks also lost semantic separation and operator spacing.
Check option-internal geometry, readable font, semantic group separators, and the actual equation chain in later examples.
A count of new blanks or explanatory paragraphs cannot replace writing the complete mathematical transformation.
