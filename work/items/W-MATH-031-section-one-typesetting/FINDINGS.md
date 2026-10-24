# P-005-R2 implementation findings

N01 is the first enabled unit. The renderer retains existing choice buttons and answer records; no future answer is measured. Source is parsed into mathematical rows before actual-width measurement. Independent equalities, transformation rows, continuation rows and tables are distinct. Authored related blocks share column and body widths within the same visible teaching/reference/history scope.

Math uses the existing KaTeX dependency. Long original inline expressions can become display lines without rewriting prose. A single stage/derivation spacing owner replaces accumulated margins. Logical numbering follows the last mathematical row or independent-group center; actual collisions put the label below.

The initial visual suspicion about N01 equations29–31 was checked with real DOM coordinates: all three relation positions were185px at390px resolved. A cross-block assertion was nevertheless added, and shared body width now includes the widest peer expression. The final104-state N01 audit passes.

No lesson text, math source, answer, distractor, hole, stage, revision, figure or storage key changed. Immutable data and canonical generator checks pass. Protected units stay on the original renderer until individually activated.
