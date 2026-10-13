import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const root = process.cwd()
const errors = []
const warnings = []

const rel = (p) => p.replaceAll('\\', '/')
const full = (p) => join(root, p)
const fail = (msg) => errors.push(msg)
const warn = (msg) => warnings.push(msg)

function requireFile(path) {
  if (!existsSync(full(path))) fail(`missing required file: ${path}`)
}

function read(path) {
  return existsSync(full(path)) ? readFileSync(full(path), 'utf8') : ''
}

const requiredFiles = [
  'AGENTS.md',
  'governance/CONSTITUTION.md',
  'governance/DOCUMENT_AUTHORITY.md',
  'governance/CHANGE_PROTOCOL.md',
  'governance/INSTRUCTION_DICTIONARY.md',
  'governance/COMMAND_WORDS.md',
  'governance/WORK_SYSTEM.md',
  'navigation/MASTER_MATCH_GRAPH.md',
  'navigation/CURRENT_POSITION.md',
  'memory/PROJECT_BRIEF.md',
  'memory/ACTIVE_CONTEXT.md',
  'memory/PROGRESS.md',
  'work/README.md',
  'work/templates/WORK.md',
  'work/templates/PROPOSAL.md',
  'work/templates/ACTION_LOG.md',
  'work/templates/FINDINGS.md',
  'work/templates/VERIFICATION.md',
  'subjects/mathematics/AGENTS.md',
  'subjects/mathematics/textbook/SPEC.md',
  'subjects/mathematics/practice/SPEC.md',
  'subjects/physics/AGENTS.md',
  'subjects/physics/textbook/SPEC.md',
  'subjects/physics/practice/SPEC.md',
]

for (const path of requiredFiles) requireFile(path)

const instructionDictionary = read('governance/INSTRUCTION_DICTIONARY.md')
if (!instructionDictionary.includes('CMD-ROOT-001')) fail('instruction dictionary missing CMD-ROOT-001')
if (!instructionDictionary.includes('Canonical Phrase: **憲法から**')) fail('CMD-ROOT-001 missing canonical phrase 憲法から')
if (!instructionDictionary.includes('live `main`')) fail('CMD-ROOT-001 missing live main verification')
if (!instructionDictionary.includes('Priority: HIGHEST')) fail('CMD-ROOT-001 is not marked highest priority')
if (!instructionDictionary.includes('## Instruction Matching Rule')) fail('instruction dictionary missing matching rule')
if (!instructionDictionary.includes('## CMD-WORK-001 — 修正')) fail('instruction dictionary missing CMD-WORK-001 修正')
if (!instructionDictionary.includes('### 2. SIMILAR')) fail('instruction dictionary missing SIMILAR confirmation rule')
if (!instructionDictionary.includes('今回この指示として扱いますか？')) fail('SIMILAR rule missing explicit user confirmation prompt')
if (!instructionDictionary.includes('REVIEW-FEEDBACK ≠ APPROVAL')) fail('instruction dictionary missing review-feedback approval separation')
if (!instructionDictionary.includes('修正版Proposalをユーザーへ全文提示する')) fail('CMD-WORK-001 missing revised-proposal presentation gate')
if (!instructionDictionary.includes('### Review-link handoff')) fail('CMD-WORK-001 missing review-link handoff')
if (!instructionDictionary.includes('rendered app / preview / directly reviewable screen')) fail('CMD-WORK-001 missing review-link priority')


const workSystem = read('governance/WORK_SYSTEM.md')
if (!workSystem.includes('REVIEW-FEEDBACK ≠ APPROVAL')) fail('WORK_SYSTEM missing review-feedback approval separation')
if (!workSystem.includes('### Proposal review loop')) fail('WORK_SYSTEM missing proposal review loop')
if (!workSystem.includes('The revised proposal must be shown before implementation.')) fail('WORK_SYSTEM missing revised-proposal-before-implementation rule')
if (!workSystem.includes('## 12A. User review handoff')) fail('WORK_SYSTEM missing user review handoff rule')
if (!workSystem.includes('A correction handoff must not end as prose-only')) fail('WORK_SYSTEM missing correction review-link requirement')


const proposalTemplate = read('work/templates/PROPOSAL.md')
if (!proposalTemplate.includes('### Review History')) fail('PROPOSAL template missing review history')



const graph = read('navigation/MASTER_MATCH_GRAPH.md')
for (let n = 0; n <= 8; n += 1) {
  const id = `R${String(n).padStart(2, '0')}`
  if (!graph.includes(id)) fail(`MASTER_MATCH_GRAPH missing node: ${id}`)
}

const current = read('navigation/CURRENT_POSITION.md')
for (const heading of ['## Current Node', '## Current Rule', '## Next Executable Work']) {
  if (!current.includes(heading)) fail(`CURRENT_POSITION missing heading: ${heading}`)
}

const specs = [
  'subjects/mathematics/textbook/SPEC.md',
  'subjects/mathematics/practice/SPEC.md',
  'subjects/physics/textbook/SPEC.md',
  'subjects/physics/practice/SPEC.md',
]

for (const path of specs) {
  const text = read(path)
  if (!/^Status:\s+(CANONICAL|CANONICAL-CANDIDATE)\s*$/m.test(text)) {
    fail(`${path}: invalid or missing Status`)
  }
  for (const marker of ['Purpose', 'Verification gate', 'Out of scope']) {
    if (!text.toLowerCase().includes(marker.toLowerCase())) {
      fail(`${path}: missing required section "${marker}"`)
    }
  }
}

const constitution = read('governance/CONSTITUTION.md')
if (!constitution.includes('Amendment')) warn('Constitution does not mention amendment governance')
if (!constitution.includes('Canonical Truth')) fail('Constitution missing Canonical Truth principle')

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

for (const p of walk(root)) {
  const rp = rel(relative(root, p))
  if (!rp.includes('/') && rp.toLowerCase().endsWith('.zip')) {
    warn(`root binary archive needs provenance classification: ${rp}`)
  }
}


const commandWords = read('governance/COMMAND_WORDS.md')
if (!commandWords.includes('Approval Check')) fail('COMMAND_WORDS missing approval-state gate')
if (!commandWords.includes('governance/WORK_SYSTEM.md')) fail('COMMAND_WORDS does not route to WORK_SYSTEM')

const agents = read('AGENTS.md')
if (!agents.includes('governance/WORK_SYSTEM.md')) fail('AGENTS does not route concrete work to WORK_SYSTEM')

const allowedWorkStatuses = new Set([
  'UNDEFINED',
  'PROPOSED',
  'APPROVED',
  'IMPLEMENTING',
  'VERIFYING',
  'DONE',
  'BLOCKED',
  'REVISE-PROPOSAL',
  'FAILED-VERIFICATION',
])

const requiredWorkRecords = [
  'WORK.md',
  'PROPOSAL.md',
  'ACTION_LOG.md',
  'FINDINGS.md',
  'VERIFICATION.md',
]

const workItemsRoot = full('work/items')
if (existsSync(workItemsRoot)) {
  for (const name of readdirSync(workItemsRoot)) {
    const itemDir = join(workItemsRoot, name)
    if (!statSync(itemDir).isDirectory()) continue

    for (const record of requiredWorkRecords) {
      const path = rel(relative(root, join(itemDir, record)))
      if (!existsSync(join(itemDir, record))) fail(`${name}: missing Work record ${record}`)
    }

    const workPath = rel(relative(root, join(itemDir, 'WORK.md')))
    const workText = read(workPath)
    const statusMatch = workText.match(/^Status:\s+([A-Z-]+)\s*$/m)
    if (!statusMatch) {
      fail(`${name}: WORK.md missing Status`)
      continue
    }

    const status = statusMatch[1]
    if (!allowedWorkStatuses.has(status)) fail(`${name}: invalid Work status ${status}`)

    // Current approved revision may be P-002 etc; never rewrite historical P-001.
    const approvedId = workText.match(/^Approved Proposal:\s*(P-\d+)\s*$/m)?.[1]
    const revisionName = approvedId && approvedId !== 'P-001' ? `PROPOSAL_${approvedId}.md` : 'PROPOSAL.md'
    const proposalPath = rel(relative(root, join(itemDir, revisionName)))
    const proposalText = read(proposalPath)
    if (['APPROVED', 'IMPLEMENTING', 'VERIFYING', 'DONE'].includes(status) && !/^Status:\s+APPROVED\s*$/m.test(proposalText)) {
      fail(`${name}: executable Work status requires an APPROVED proposal`)
    }

    const verificationPath = rel(relative(root, join(itemDir, 'VERIFICATION.md')))
    const verificationText = read(verificationPath)
    if (status === 'DONE' && !/^Status:\s+PASS\s*$/m.test(verificationText)) {
      fail(`${name}: DONE requires VERIFICATION Status: PASS`)
    }
  }
}

const physicsChapterArchitecture = 'src/data/textbook/ch01/chapter1Architecture.ts'
if (!existsSync(full(physicsChapterArchitecture))) {
  warn('Physics Chapter 1 three-chunk learner architecture is not yet implemented on this tree')
}

const textbookCatalog = read('src/domain/textbookCatalog.ts')
if (
  textbookCatalog.includes('function physicsUnitLabel')
  && textbookCatalog.includes('${code} ')
) {
  warn('Physics learner lesson labels still expose internal 1A-1G codes; internal IDs may remain, learner-facing major labels should not')
}

const textExtensions = new Set(['.md', '.ts', '.tsx', '.js', '.mjs', '.json', '.yml', '.yaml', '.css'])
for (const base of ['subjects', 'governance', 'navigation']) {
  for (const p of walk(full(base))) {
    if (!textExtensions.has(extname(p).toLowerCase())) continue
    const rp = rel(relative(root, p))
    const text = readFileSync(p, 'utf8')
    if (/\]\((?:\.\.\/|\.\/)[^)]+\)/.test(text)) {
      warn(`relative markdown link requires migration-era review: ${rp}`)
    }
  }
}

console.log('Juku repository governance check')
console.log(`errors: ${errors.length}`)
for (const message of errors) console.error(`ERROR: ${message}`)
console.log(`warnings: ${warnings.length}`)
for (const message of warnings) console.warn(`WARN: ${message}`)

if (errors.length) process.exit(1)

// Target-specific provenance and authority checks (2026-10-10)
for (const path of ['CHATGPT_README_FIRST.md', 'docs/MASTER_APP_LESSONS.md', 'docs/MATH_PRACTICE_MASTER_LESSONS.md', 'docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md', 'docs/MATH_PRACTICE_87_120_FINAL_QA_FINDINGS.md', 'history/imports/paulfields83-20261010/README.md']) {
  if (!existsSync(full(path))) { console.error('ERROR: missing target authority '+path); process.exitCode=1 }
}
if (!read('AGENTS.md').includes('rrikunagasige-dot/kyotsu-step-web')) { console.error('ERROR: incorrect target repo identity'); process.exitCode=1 }
if (!read('governance/INSTRUCTION_DICTIONARY.md').includes('rrikunagasige-dot/kyotsu-step-web')) { console.error('ERROR: incorrect root command repo identity'); process.exitCode=1 }


// 2026-10-10 target release-state assertions. This file runs only on the target app.
const expectedRepo = 'rrikunagasige-dot/kyotsu-step-web'
if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY !== expectedRepo) { console.error('ERROR-PROVENANCE: unexpected workflow repo '+process.env.GITHUB_REPOSITORY); process.exitCode=1 }
for (const path of ['navigation/MODE_STATE_2026-10-10.md','src/data/mathPractice/presentation.ts','src/data/textbook/math/set/setLesson.ts','src/data/textbook/ch01/chapter1Continuous.ts','src/data/textbookPracticeQuestions.ts']) {
  if (!existsSync(full(path))) { console.error('ERROR: missing correct target mode source: '+path); process.exitCode=1 }
}
if (!read('src/data/textbook/index.ts').includes('mathTextbookUnits')) { console.error('ERROR: published math textbook not registered'); process.exitCode=1 }
if (!/status:\s*'published'/.test(read('src/data/textbook/math/set/setLesson.ts'))) { console.error('ERROR: math-sets not published'); process.exitCode=1 }
for (const path of ['src/data/textbook/math/proposition/propositionReadingLesson.ts','src/data/textbook/math/proposition/quantifierLesson.ts','src/data/textbook/math/proposition/propositionProofLesson.ts','src/data/textbook/math/function/functionConditionsLesson.ts']) {
  if (!/status:\s*'review'/.test(read(path))) { console.error('ERROR: review-only math unit changed status: '+path); process.exitCode=1 }
}
if (read('.github/workflows/deploy-pages.yml').includes('ref: 2127c3d4d35793546228ac2fe2a9d38e8a9f97be')) { console.error('ERROR: Pages still pinned to obsolete lesson version'); process.exitCode=1 }


// Semantic safety check for W-GOV-006: do not confuse old accepted provenance with unfinished actions.
const activeCurrent = read('navigation/CURRENT_POSITION.md')
const openCurrent = activeCurrent.split(/^## Open issues\s*$/m)[1]?.split(/^## /m)[0] || ''
if (/PR #49/.test(openCurrent) && /merge|adopt|統合|未統合/i.test(openCurrent)) {
  console.error('ERROR: already-merged PR #49 is still listed as a pending merger in CURRENT_POSITION'); process.exitCode=1
}
const currentWgov = read('work/items/W-GOV-006-workflow-integrity/WORK.md')
if (!/^Approved Proposal: P-002$/m.test(currentWgov)) {
  console.error('ERROR: W-GOV-006 needs an exact approved proposal reference'); process.exitCode=1
}
if (!/^Status: APPROVED$/m.test(read('work/items/W-GOV-006-workflow-integrity/PROPOSAL_P-002.md'))) {
  console.error('ERROR: P-002 approval stage missing'); process.exitCode=1
}
