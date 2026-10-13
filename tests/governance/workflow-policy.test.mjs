import test from 'node:test'
import assert from 'node:assert/strict'
import { auditWork, checkNavigation, compareProtectedTrees, parseProtectedManifest, isProtected, compareApprovalAnchors } from './workflow-policy.mjs'

const repo = 'rrikunagasige-dot/kyotsu-step-web'
const base = {
  repository: repo,
  paths: ['tests/governance/workflow-policy.test.mjs', 'navigation/CURRENT_POSITION.md'],
  work: 'Status: VERIFYING\nApproved Proposal: P-002\n',
  proposal: 'Status: APPROVED\n',
  approval: 'Status: APPROVED FOR IMPLEMENTATION ONLY\nUser: 「よし今は大丈夫じゃ修正よろしく。」\nNOT AUTHORIZED: main merge, GitHub settings\n',
  current: '## Current Node\nW-GOV-005 DONE\n## Open issues\n- future subject reviews\n## Next Executable Work\n- approval gate\n',
  graph: '[T06 W-GOV-005 DONE]',
  progress: 'W-GOV-005 DONE'
}
const audit = overrides => auditWork({ ...base, ...overrides })
test('positive: work stays review-gated with no protected change', () => {
  assert.deepEqual(audit().errors, [])
  assert.equal(audit().humanApprovalVerified, false)
  assert.equal(audit().needsHumanReview, true)
})
test('negative: an unapproved Work may not produce implementation changes', () => {
  assert.match(audit({work: 'Status: PROPOSED\n'}).errors.join('\n'), /approved active Work/)
})
test('negative: an APPROVED marker alone cannot impersonate approval', () => {
  const a = audit({approval: ''})
  assert.match(a.errors.join('\n'), /approval record missing/)
  assert.equal(a.humanApprovalVerified, false)
})
test('negative: wrong repository triggers provenance gate', () => {
  assert.match(audit({repository: 'paulfields83/kyotsu-step-web'}).errors.join('\n'), /ERROR-PROVENANCE/)
})
test('negative: app/material changes are protected', () => {
  assert.match(audit({paths:['src/data/textbook/math/set/setLesson.ts']}).errors.join('\n'), /protected existing result changed/)
})
test('negative: unauthorized path rejected even if not protected', () => {
  assert.match(audit({paths:['governance/CONTRACT_REPLACEMENT.md']}).errors.join('\n'), /outside approved/)
})
test('negative: a P-001 approval cannot flow into revised P-002', () => {
  assert.match(audit({work:'Status: VERIFYING\nApproved Proposal: P-001\n'}).errors.join('\n'), /P-002/)
})
test('negative: after approval changing the proposal requires a new revision', () => {
  assert.match(audit({proposalChanged:true}).errors.join('\n'), /P-003/)
})
test('negative: stale merged-PR task in CURRENT_POSITION is detected', () => {
  assert.match(audit({current:'W-GOV-005 DONE\n## Open issues\n- Merge PR #49\n'}).errors.join('\n'), /stale PR #49/)
})
test('proposal-only: a pending proposal has no implementation rights', () => {
  const v = audit({proposalOnly:true,work:'Status: REVISE-PROPOSAL',paths:['work/items/W-GOV-006-workflow-integrity/PROPOSAL_P-002.md']})
  assert.deepEqual(v.errors, [])
  assert.equal(v.humanApprovalVerified,false)
})
test('negative: a proposal-only branch that changes CI is invalid', () => {
  assert.match(audit({proposalOnly:true,work:'Status: PROPOSED',paths:['.github/workflows/repository-governance.yml']}).errors.join('\n'),/proposal-only/)
})
test('manifest: modification, deletion, and new protected paths all fail', () => {
  const sha='a'.repeat(40), sha2='b'.repeat(40)
  const baseline=new Map([['src/a.ts',sha],['docs/a.md',sha]])
  const changed=new Map([['src/a.ts',sha2],['public/new.png',sha]])
  const errors=compareProtectedTrees(baseline,changed).join('\n')
  assert.match(errors,/src\/a.ts/)
  assert.match(errors,/docs\/a.md/)
  assert.match(errors,/public\/new.png/)
})
test('manifest: refuses artificially small or duplicate baseline', () => {
  assert.throws(()=>parseProtectedManifest('a'.repeat(40)+'  src/a.ts'),/incomplete/)
  const text=Array.from({length:300},(_,i)=>'a'.repeat(40)+'  src/'+i+'.ts').join('\n')+'\n'+'a'.repeat(40)+'  src/0.ts'
  assert.throws(()=>parseProtectedManifest(text),/duplicate/)
})
test('original protected and authorized paths remain disjoint', () => {
  assert.ok(isProtected('governance/WORK_SYSTEM.md'))
  assert.ok(!isProtected('tools/repo-governance-check.mjs'))
})
test('negative: historical completion is not the same as missing progress', () => {
  assert.match(checkNavigation({current:base.current,graph:base.graph,progress:'not updated'}).join('\n'),/PROGRESS/)
})

test('approved P-002 blob SHA anchoring detects an altered proposal', () => {
  const x = 'a'.repeat(40), y = 'b'.repeat(40)
  const approval = 'Approval anchor (Git blob SHA of approved P-002): `' + x + '`.\nOriginal unapproved P-001 anchor (Git blob SHA): `' + y + '`.\n'
  assert.deepEqual(compareApprovalAnchors(approval, x, y), [])
  assert.match(compareApprovalAnchors(approval, y, y).join('\n'), /needs P-003/)
  assert.match(compareApprovalAnchors(approval, x, x).join('\n'), /P-001 was rewritten/)
  assert.match(compareApprovalAnchors('Status: APPROVED', x, y).join('\n'), /anchors missing/)
})
