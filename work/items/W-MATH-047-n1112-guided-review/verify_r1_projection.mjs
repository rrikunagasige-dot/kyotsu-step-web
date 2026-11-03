import fs from 'node:fs';import assert from 'node:assert/strict';
import {projectTransformationView} from '../../../src/domain/transformationReading.ts';
const p=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Transformation.json','utf8'));
const prefix=p.interactions.slice(0,-1).map(c=>c.id),end='n11-06';
for(let i=0;i<=prefix.length;i++){
 const view=projectTransformationView(p,prefix.slice(0,i)),rows=view.groups.flatMap(g=>g.rows);
 assert.ok(!rows.some(r=>r.id==='n11-tg-final'));
 if(i===prefix.length){const divide=rows.find(r=>r.id==='n11-tg-divide');assert.equal(divide.current.id,end);assert.equal(divide.done,false);assert.deepEqual(divide.formula.right,[{type:'slot',id:'n11-tg-final-quotient',interactionRef:end}]);}
}
const completed=projectTransformationView(p,[...prefix,end]).groups[0].rows;
assert.ok(completed.find(r=>r.id==='n11-tg-final').done);assert.equal(completed.filter(r=>r.current?.id===end).length,0);
const stale=projectTransformationView(p,[end]).groups[0].rows;assert.ok(!stale.some(r=>r.id==='n11-tg-final'));
console.log(JSON.stringify({status:'PASS',actualProjector:true,checks:['all predecessor prefixes hide final result','one quotient slot until n11-06 correct','final completed range only after correct','stale later answer does not unlock prerequisites']}));
