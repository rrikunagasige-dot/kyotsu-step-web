import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const baseline='22bc43ba53fa87bb85e82e18a25db13a5c8a485c';
const allowed=new Set([
 'src/review/reviewTargets.test.ts',
 'src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/n07-reading.css',
 'src/components/textbook/TextbookFormula.tsx','src/pages/TextbookUnitPage.tsx',
 'src/data/textbook/math/typesetting.ts','src/domain/textbook.ts',
 'src/data/textbook/math/numbers/n07Lesson.ts','src/data/textbook/math/numbers/n07LegacyLesson.ts',
 'src/data/textbook/math/numbers/n07Authored.json','src/data/textbook/math/numbers/n07Integration.test.ts',
 'src/data/textbook/math/numbers/firstSectionTeaching.test.tsx','src/data/textbook/math/numbers/newBatchCoverage.test.ts',
]);
const changed=execFileSync('git',['diff','--name-only',baseline,'HEAD','--','src','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const path of changed)assert(allowed.has(path),'Unapproved source change '+path);
assert.equal(execFileSync('git',['diff','--name-only','--','src','public'],{encoding:'utf8'}).trim(),'','Uncommitted source changes');
const old=execFileSync('git',['show',baseline+':src/data/textbook/math/numbers/n07Lesson.ts']);
assert(old.equals(fs.readFileSync('src/data/textbook/math/numbers/n07LegacyLesson.ts')),'Old N07 source was not preserved exactly');
assert.equal(execFileSync('git',['diff','--name-only',baseline,'HEAD','--','public','src/data/textbook/math/numbers/firstSectionTeaching.json','src/data/textbook/math/typesetting.json','src/data/mathPractice','src/data/textbook/ch01'],{encoding:'utf8'}).trim(),'','Protected accepted lesson/figure/mode changed');
console.log(JSON.stringify({status:'PASS',baseline,changed,protectedFirstTitle:true,protectedOtherData:true}));
