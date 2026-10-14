import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/** Static intake gate for NEW Work records added in this PR, not proof of a URL, human approval or actual AI compliance. */
export function validateNewWorkContract(workText, proposalText) {
  const issues = []
  if (!/^Status:\s+(?:PROPOSED|APPROVED|IMPLEMENTING|VERIFYING|DONE|BLOCKED|REVISE-PROPOSAL|FAILED-VERIFICATION)$/m.test(workText))
    issues.push('canonical Work Status missing')
  if (!workText.includes('## Review Delivery')) issues.push('Work missing Review Delivery section')
  if (!proposalText.includes('## Review Delivery Contract')) issues.push('Proposal missing Review Delivery Contract')
  if (!/Review Type:\s*(APP_UI|CODE|DOCUMENT|OTHER)/.test(proposalText)) issues.push('review type missing')
  for (const marker of ['Required Review Artifact:', 'Delivery Route:', 'Additional Permission:', 'Acceptance:']) {
    if (!proposalText.includes(marker)) issues.push('proposal missing ' + marker)
  }
  if (/Review Type:\s*APP_UI/.test(proposalText) && !/app URL|application URL|アプリURL|running app|アプリのURL/i.test(proposalText))
    issues.push('APP_UI missing explicit direct app URL acceptance')
  return issues
}
export function auditNewWorkFiles(changes, getText) {
  const findings=[]
  for (const [status,path] of changes) {
    if (status!=='A' || !/^work\/items\/[^/]+\/WORK\.md$/.test(path)) continue
    const base=path.slice(0,-'WORK.md'.length)
    for(const message of validateNewWorkContract(getText(path),getText(base+'PROPOSAL.md'))) {
      findings.push(base+message)
    }
  }
  return findings
}

if(process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if(process.env.GITHUB_EVENT_NAME !== 'pull_request') {
    console.log('Review Work intake: not a PR, skipping new-Work diff audit')
  } else {
    try {
      const diff=execFileSync('git',['diff','--name-status','HEAD^1','HEAD'],{encoding:'utf8'}).trim()
      const changes=diff.split('\n').filter(Boolean).map(line=>line.split('\t').slice(0,2))
      const legacy=new Set([
        'W-GOV-006-workflow-integrity',
        'W-GOV-007-repository-os-parity',
        'W-MATH-002-textbook-ui-compression'
      ])
      const candidates=changes.filter(([status,path])=>!legacy.has(path.split('/')[2]))
      const findings=auditNewWorkFiles(candidates,path=>readFileSync(path,'utf8'))
      if(findings.length) {
        findings.forEach(x=>console.error('ERROR: '+x))
        process.exitCode=1
      } else {
        console.log('Review Work intake: PASS, '+candidates.filter(([s,p])=>s==='A'&&p.endsWith('/WORK.md')).length+' new Work(s) checked')
      }
    } catch (e) {
      console.error('ERROR: unable to audit new Work intake '+String(e))
      process.exitCode=1
    }
  }
}
