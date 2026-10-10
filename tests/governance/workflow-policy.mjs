// Scope/checkpoint checks for W-GOV-006. This is a pilot; it does not certify human approval.
export const EXPECTED_REPO = 'rrikunagasige-dot/kyotsu-step-web'
export const WORK_DIR = 'work/items/W-GOV-006-workflow-integrity/'
export const PROTECTED_PATH = /^(src\/|public\/|e2e\/|docs\/|history\/|CHATGPT_README_FIRST\.md$|WORKFLOW\.md$|package\.json$|pnpm-lock\.yaml$|\.github\/workflows\/deploy-pages\.yml$|governance\/(CONSTITUTION|WORK_SYSTEM|COMMAND_WORDS)\.md$)/

const EXPLICIT = new Set([
  'tools/repo-governance-check.mjs',
  '.github/workflows/repository-governance.yml',
  'navigation/CURRENT_POSITION.md',
  'navigation/MASTER_MATCH_GRAPH.md',
  'memory/ACTIVE_CONTEXT.md',
  'memory/PROGRESS.md'
])
const PREFIXES = [WORK_DIR, 'tests/governance/', 'memory/LESSONS/']

export const statusOf = text => (text.match(/^Status:\s*([A-Z-]+)\s*$/m) || [])[1] || ''
export const approvedProposalOf = text => (text.match(/^Approved Proposal:\s*(P-\d+)\s*$/m) || [])[1] || ''
export const isAllowed = path => EXPLICIT.has(path) || PREFIXES.some(p => path.startsWith(p))
export const isProtected = path => PROTECTED_PATH.test(path)

export function checkNavigation({ current = '', graph = '', progress = '' }) {
  const errors = []
  if (!/W-GOV-005[\s\S]{0,400}DONE/.test(current)) errors.push('W-GOV-005 completion missing from CURRENT_POSITION')
  const issues = current.split(/^## Open issues\s*$/m)[1]?.split(/^## /m)[0] || ''
  if (/PR #49/.test(issues) && /(?:merge|統合|adopt|未統合)/i.test(issues)) errors.push('CURRENT_POSITION has stale PR #49 integration task in Open issues')
  if (!/W-GOV-005 DONE/.test(graph)) errors.push('MASTER_MATCH_GRAPH misses W-GOV-005 DONE')
  if (!/W-GOV-005 DONE/.test(progress)) errors.push('PROGRESS misses W-GOV-005 DONE')
  return errors
}

export function auditWork({ repository, paths = [], work = '', proposal = '', approval = '', current = '', graph = '', progress = '', proposalOnly = false, proposalChanged = false }) {
  const errors = []
  if (repository !== EXPECTED_REPO) errors.push('ERROR-PROVENANCE: incorrect target repository')
  if (!Array.isArray(paths) || paths.some(p => typeof p !== 'string' || p.includes('..'))) errors.push('invalid changed path list')
  else {
    for (const path of paths) {
      if (isProtected(path)) errors.push('protected existing result changed: ' + path)
      if (!isAllowed(path)) errors.push('outside approved file scope: ' + path)
    }
  }

  const workStatus = statusOf(work)
  const proposalStatus = statusOf(proposal)
  if (proposalOnly) {
    if (paths.some(p => !p.startsWith(WORK_DIR))) errors.push('proposal-only branch contains implementation changes')
    if (workStatus === 'IMPLEMENTING' || workStatus === 'VERIFYING' || workStatus === 'DONE') errors.push('proposal-only Work already claims execution')
    return { errors, humanApprovalVerified: false, needsHumanReview: true }
  }

  if (!['APPROVED', 'IMPLEMENTING', 'VERIFYING'].includes(workStatus)) errors.push('execution branch requires approved active Work')
  if (approvedProposalOf(work) !== 'P-002') errors.push('current Work must explicitly point at approved P-002')
  if (proposalStatus !== 'APPROVED') errors.push('current P-002 not marked approved')
  if (!/^Status:\s*APPROVED FOR IMPLEMENTATION ONLY\s*$/m.test(approval)) errors.push('specific implementation approval record missing')
  if (!/「よし今は大丈夫じゃ修正よろしく。」/.test(approval)) errors.push('user instruction evidence not recorded')
  if (!/NOT AUTHORIZED:[^\n]*main merge/.test(approval)) errors.push('separate merge approval not documented')
  if (proposalChanged) errors.push('approved proposal changed: needs P-003 and renewed approval')
  errors.push(...checkNavigation({ current, graph, progress }))

  return { errors, humanApprovalVerified: false, needsHumanReview: true }
}

export function parseProtectedManifest(content) {
  const map = new Map()
  for (const line of content.split(/\r?\n/)) {
    const m = /^([a-f0-9]{40})  (.+)$/.exec(line)
    if (!m) continue
    if (!isProtected(m[2])) throw Error('manifest contains unprotected path: ' + m[2])
    if (map.has(m[2])) throw Error('duplicate manifest path: ' + m[2])
    map.set(m[2], m[1])
  }
  if (map.size < 300) throw Error('incomplete protected baseline manifest: ' + map.size)
  return map
}

export function compareProtectedTrees(baseline, current) {
  const errors = []
  for (const [p, sha] of baseline) if (current.get(p) !== sha) errors.push('baseline Git SHA mismatch: ' + p)
  for (const [p] of current) if (isProtected(p) && !baseline.has(p)) errors.push('new protected file: ' + p)
  return errors
}


// Git blob hashes establish file identity, NOT authenticated human consent.
export function compareApprovalAnchors(approval, proposalSha, historicalSha) {
  const issues = []
  const p = approval.match(/^Approval anchor \(Git blob SHA of approved P-002\): `([a-f0-9]{40})`\.$/m)?.[1]
  const old = approval.match(/^Original unapproved P-001 anchor \(Git blob SHA\): `([a-f0-9]{40})`\.$/m)?.[1]
  if (!p || !old) issues.push('approval anchors missing; cannot verify immutable proposal revision')
  if (p && proposalSha !== p) issues.push('approved proposal blob changed: needs P-003 and new approval')
  if (old && historicalSha !== old) issues.push('historical unapproved P-001 was rewritten')
  return issues
}
