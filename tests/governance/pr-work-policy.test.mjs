import test from 'node:test'
import assert from 'node:assert/strict'
import {audit,STATES,field,validPathPattern,matches} from './pr-work-policy.mjs'
const psha='a'.repeat(40),ssha='b'.repeat(40)
const dir='work/items/W-GOV-007-repository-os-parity/'
const scope={workId:'W-GOV-007',proposalId:'P-001',allowedPaths:[dir+'**','README.md','tests/governance/**'],forbiddenPaths:['src/**','docs/**','history/**']}
const work='Status: VERIFYING\nApproved Proposal: P-001\n'
const proposal='Status: APPROVED\n'
const approval=['Status: APPROVED FOR IMPLEMENTATION ONLY','Work-ID: W-GOV-007','Proposal-ID: P-001','Proposal-SHA: '+psha,'Scope-SHA: '+ssha,'User-Statement: 我觉得可以继续','Main-Merge: NOT AUTHORIZED','GitHub-Settings: NOT AUTHORIZED'].join('\n')
const changed=[{status:'M',path:'README.md'},{status:'A',path:dir+'APPROVAL_P-001.md'}]
const go=o=>audit({changes:changed,workDir:dir,work,proposal,proposalSha:psha,scope,scopeSha:ssha,approval,...o})
test('implementation changes with exact declared scope can pass STATIC gate; never human consent',()=>{
 const x=go({});assert.equal(x.state,STATES.READY);assert.equal(x.humanApprovalVerified,false)
})
test('proposal-only remains unapproved and may contain Work records only',()=>{
 const x=go({work:'Status: PROPOSED\n',proposal:'Status: PROPOSED\n',proposalOnly:true,changes:[{status:'A',path:dir+'PROPOSAL.md'}]})
 assert.equal(x.state,STATES.PROPOSAL);assert.equal(x.humanApprovalVerified,false)
})
test('proposal-only cannot modify README',()=>assert.equal(go({work:'Status: PROPOSED',proposal:'Status: PROPOSED',proposalOnly:true}).state,STATES.FAIL))
test('unapproved Work cannot implement',()=>assert.equal(go({work:'Status: BLOCKED\n'}).state,STATES.FAIL))
test('other discipline files blocked outside approved scope',()=>assert.match(go({changes:[{status:'M',path:'src/data/physics.ts'}]}).errors.join(' '),/scope|protected/))
test('deleting archived records is detected',()=>assert.match(go({changes:[{status:'D',path:'history/imports/old.md'}]}).errors.join(' '),/protected/))
test('rename from protected path is detected',()=>assert.match(go({changes:[{status:'R100',from:'docs/old.md',path:dir+'new.md'}]}).errors.join(' '),/protected/))
test('tampered approved P-001 SHA must fail',()=>assert.match(go({proposalSha:'c'.repeat(40)}).errors.join(' '),/proposal blob anchor/))
test('tampered SCOPE SHA must fail',()=>assert.match(go({scopeSha:'c'.repeat(40)}).errors.join(' '),/scope blob anchor/))
test('forged APPROVED status alone lacks independently recorded authorization',()=>assert.match(go({approval:'Status: APPROVED FOR IMPLEMENTATION ONLY'}).errors.join(' '),/approval Work-ID|approval proposal/))
test('old approval revision does not cover newly revised proposal',()=>assert.match(go({scope:{...scope,proposalId:'P-002'}}).errors.join(' '),/revision|proposal/))
test('scope widening to repository ** is refused',()=>assert.match(go({scope:{...scope,allowedPaths:['**']}}).errors.join(' '),/invalid or empty allowedPaths/))
test('missing Work directory is honest REVIEW_REQUIRED',()=>assert.equal(go({workDir:''}).state,STATES.REVIEW))
test('no changed paths is review rather than false PASS',()=>assert.equal(go({changes:[]}).state,STATES.REVIEW))
test('approval must explicitly prohibit main merge and Settings',()=>assert.match(go({approval:approval.replace('Main-Merge: NOT AUTHORIZED','Main-Merge: OK')}).errors.join(' '),/merge/))
test('exact and narrow prefix patterns accepted; relative traversal rejected',()=>{
 assert.equal(validPathPattern('tests/governance/**'),true)
 assert.equal(validPathPattern('src/**/all'),false)
 assert.equal(validPathPattern('../src/file'),false)
 assert.equal(matches('tests/governance/a.mjs',['tests/governance/**']),true)
 assert.equal(matches('tests/governances/a.mjs',['tests/governance/**']),false)
 assert.equal(field('Status: PROPOSED\n','Status'),'PROPOSED')
})
