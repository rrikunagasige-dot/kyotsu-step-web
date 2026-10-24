import fs from 'node:fs'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
const baseline='53216a828116dcf8126e4f36fb3b4fdfc1340fe1'
const changed=execFileSync('git',['diff','--name-only',baseline,'--','src/data','src/domain','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean)
assert.deepEqual(changed.filter(path=>!['src/data/textbook/math/typesetting.json','src/data/textbook/math/typesetting.ts'].includes(path)),[],'Lesson/domain/figures changed')
const path='src/data/textbook/math/numbers/firstSectionTeaching.json'
const lesson=fs.readFileSync(path)
assert(lesson.equals(execFileSync('git',['show',baseline+':'+path],{maxBuffer:10_000_000})),'Canonical lesson bytes changed')
const plans=JSON.parse(lesson), typesetting=JSON.parse(fs.readFileSync('src/data/textbook/math/typesetting.json','utf8'))
for(const [unit,groups] of Object.entries(typesetting.groups))for(const group of groups)for(const id of group)assert(plans[unit].equationNumbers[id],unit+'/'+id+' has no original equation identity')
assert(typesetting.enabledUnits.every(unit=>Object.hasOwn(plans,unit)))
console.log(JSON.stringify({baseline,lessonSHA256:createHash('sha256').update(lesson).digest('hex'),enabledUnits:typesetting.enabledUnits,unchangedLessonDomainAndFigures:true,passed:true}))
