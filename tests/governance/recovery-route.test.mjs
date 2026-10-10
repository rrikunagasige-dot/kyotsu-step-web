import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const read=p=>readFileSync(p,'utf8')
test('read-first chain exists for a memoryless new agent',()=>{
 const x=read('README.md')
 for(const file of ['AGENTS.md','governance/INSTRUCTION_DICTIONARY.md','governance/CONSTITUTION.md','governance/COMMAND_WORDS.md','governance/WORK_SYSTEM.md','navigation/CURRENT_POSITION.md','navigation/MASTER_MATCH_GRAPH.md','memory/ACTIVE_CONTEXT.md','memory/PROGRESS.md'])
  assert.ok(x.includes(file)&&existsSync(file),'broken read-first link: '+file)
})
test('dictionary exact/similar/unknown and root survive unchanged',()=>{
 const x=read('governance/INSTRUCTION_DICTIONARY.md')
 for(const s of ['CMD-ROOT-001','### 1. EXACT','### 2. SIMILAR','### 3. UNKNOWN','今回この指示として扱いますか？'])
 assert.ok(x.includes(s),'missing semantic gate: '+s)
})
test('Work always preserves revised-proposal separate approval route',()=>{
 const x=read('governance/WORK_SYSTEM.md')
 assert.match(x,/REVIEW-FEEDBACK ≠ APPROVAL/)
 assert.match(x,/The revised proposal must be shown before implementation/)
 assert.match(x,/A correction handoff must not end as prose-only/)
})
test('target mode canonical state stays independent from archived Paul',()=>{
 const x=read('navigation/MODE_STATE_2026-10-10.md'),y=read('AGENTS.md')
 assert.match(x,/math-sets/)
 assert.match(y,/CANONICAL-CANDIDATE|candidate integration summaries/)
 assert.match(y,/paulfields83/)
 assert.ok(existsSync('history/imports/paulfields83-20261010/README.md'))
})
test('new Work approval evidence never silently grants main merge',()=>{
 const x=read('work/items/W-GOV-007-repository-os-parity/APPROVAL_P-001.md')
 assert.match(x,/Main-Merge: NOT AUTHORIZED/)
 assert.match(x,/GitHub-Settings: NOT AUTHORIZED/)
})
