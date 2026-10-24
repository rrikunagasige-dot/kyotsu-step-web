import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'
const scope=JSON.parse(fs.readFileSync('work/items/W-MATH-027-first-theme-repair/scope.json','utf8'))
const paths=execFileSync('git',['diff','--name-only',scope.baseline,'HEAD','--','src','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean)
for(const path of paths)assert(scope.allowedSourcePaths.includes(path),'Out-of-scope change '+path)
assert.equal(execFileSync('git',['diff','--name-only','--','src','public'],{encoding:'utf8'}).trim(),'','Working tree must be clean')
console.log(JSON.stringify({baseline:scope.baseline,sourcePaths:paths.length,scopeValid:true}))
