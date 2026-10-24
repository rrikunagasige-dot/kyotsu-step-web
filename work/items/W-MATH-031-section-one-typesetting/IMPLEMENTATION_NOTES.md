# Reusable typesetting constraints

These are implementation facts under P-005-R2, not new pedagogical rules.

1. Treat a mathematical row separately from a visual line. First A=B can share a row; later =C is a transformation; two independent equations require two rows. Keep signs with terms, braces/annotations with their expressions and parentheses with factors.
2. Center the whole authored group, then share its left/relation/right columns and body width. Equal column widths alone are insufficient when one peer has a wider non-equation row.
3. Measure real current buttons and already revealed answers, using identical fonts/gaps. Never measure future answer keys to pre-plan unresolved rows. Keep the original controls, item identities and gating.
4. Probe only transient hidden DOM and remove it in the same operation; strip interactive identity, mark aria-hidden and prevent focus. Font/resize effects must clean up and ignore work after unmount.
5. An equation label must not reserve body width. Find the last mathematical baseline or independent-group center; only the label moves to a trailing right row if actual visible content collides.
6. One parent owns each vertical spacing interval. Repeated paragraph, formula and chain margins can multiply into large blank regions even when individual CSS values seem modest.
7. Audit actual glyph/button bounds as well as scrollWidth. Audit cross-block alignment in the same visible scope, answered/unanswered variants, references/history and real wrong-hint-correct/reset/reload. A seeded layout audit is distinct from learner playthrough and user acceptance.

Local runner note: each command runs in an isolated network namespace. A local server and its browser verification must run in the same command invocation. Starting them in separate sessions causes connection refusal unrelated to the app.
