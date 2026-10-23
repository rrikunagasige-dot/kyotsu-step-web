# N02 R1 — routine compilation QA repair

The approved learner design and its nine-file execution scope are unchanged. Original user approval explicitly covers implementation, immediate compilation and current-app verification. This is a code-level repair of the test harness inside that same scope, not a revised learner proposal or a new user reply.

At source62baeec9819b7f719452b8147c4c2933498543b4, typecheck reports TS2488 because DOM.Iterable is not enabled. Replace only the NodeList spread in the screenshot occlusion check with Array.from. Do not change tsconfig, weaken the test, alter learner code or expand the scope.

Approved design hash:882c5cc47760bc951ea9fe4a624c037f7b57dfd771fea271c0346527b14123ff
