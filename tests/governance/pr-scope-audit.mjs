// Non-destructive independent pilot. GitHub approval cannot be inferred from a status label.
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { auditWork, parseProtectedManifest, compareProtectedTrees, compareApprovalAnchors, EXPECTED_REPO } from './workflow-policy.mjs'

const read = path => readFileSync(path, 'utf8')
const folder = 'work/items/W-GOV-006-workflow-integrity/'
const repo = process.env.GITHUB_REPOSITORY
const base = process.env.PR_BASE_SHA
const head = process.env.PR_HEAD_SHA
const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value)
if (repo !== EXPECTED_REPO || !sha(base) || !sha(head)) {
  console.error('STOP: wrong repository or missing PR base/head SHA; unable to validate')
  process.exit(1)
}
function git(...args) {
  return execFileSync('git', args, {encoding:'utf8', maxBuffer: 8*1024*1024})
}
function treeMap(ref) {
  const raw = execFileSync('git',['ls-tree','-r','-z',ref], {encoding:'utf8', maxBuffer:16*1024*1024})
  const m=new Map()
  for (const entry of raw.split('\0')) {
    if (!entry) continue
    const row = /^(\d+) blob ([a-f0-9]{40})\t(.+)$/.exec(entry)
    if (row) m.set(row[3],row[2])
  }
  return m
}
const paths = git('diff','--name-only','--diff-filter=ACDMR',base,head).split(/\r?\n/).filter(Boolean)
const baseline = parseProtectedManifest(read(folder+'BASELINE_MANIFEST.md'))
const errors = compareProtectedTrees(baseline,treeMap(head))

// For this PR, P-002 must remain the same user-approved version as at approval.
// A reviewer's independent comparison is still required for authenticity.
const approvedProposal = read(folder+'PROPOSAL_P-002.md')
const approvedP001 = read(folder+'PROPOSAL.md')
const approvedWork = read(folder+'WORK.md')
const approval = read(folder+'APPROVAL_P-002.md')
const nav = read('navigation/CURRENT_POSITION.md')
const graph = read('navigation/MASTER_MATCH_GRAPH.md')
const progress = read('memory/PROGRESS.md')

const proposalSha = git('hash-object', folder+'PROPOSAL_P-002.md').trim()
const historicalSha = git('hash-object', folder+'PROPOSAL.md').trim()
const approvalAnchorErrors = compareApprovalAnchors(approval, proposalSha, historicalSha)
errors.push(...approvalAnchorErrors)
const result = auditWork({
 repository:repo,paths,work:approvedWork,proposal:approvedProposal,approval,
 current:nav,graph,progress,
 proposalOnly:false,
 proposalChanged: approvalAnchorErrors.some(x => x.includes('approved proposal blob changed'))
})
errors.push(...result.errors)
console.log('W-GOV-006 independent safety pilot:',paths.length,'changed paths, protected baseline',baseline.size)
console.log('Machine-readable approval evidence:',approval.includes('FOR IMPLEMENTATION ONLY') ? 'present (not externally authenticated)' : 'missing')
console.log('Human review still required:',result.needsHumanReview)
if (/^Status:\s*APPROVED\s*$/m.test(approvedP001)) errors.push('P-001 unexpectedly promoted to approved')
if (errors.length) {for (const e of errors) console.error('ERROR:',e);process.exitCode=1}
else console.log('PASS: scope and protected SHA verified; NOT human merge approval')
