// Cross-Work PR scope pilot. Git hashes and approval strings never authenticate a person.
export const STATES = Object.freeze({PROPOSAL:'PROPOSAL_ONLY',READY:'SCOPE_PASS_HUMAN_REVIEW_REQUIRED',REVIEW:'REVIEW_REQUIRED',FAIL:'FAIL'})
export const ROOT='work/items/'
export const field=(content,key)=>content.split(/\r?\n/).find(line=>line.startsWith(key+':'))?.slice(key.length+1).trim()||''
export function validPathPattern(p){
  if(typeof p!=='string'||!p||p.startsWith('/')||p.includes('..')||p.includes('\\'))return false
  if(p.endsWith('/**'))return /^[a-zA-Z0-9_.\/-]+\/\*\*$/.test(p)
  return /^[a-zA-Z0-9_.\/-]+$/.test(p)&&!p.includes('*')
}
export function matches(path,patterns){
  return patterns.some(p=>p.endsWith('/**')?path.startsWith(p.slice(0,-2)):path===p)
}
export function audit({changes=[],workDir='',work='',proposal='',proposalSha='',scope=null,scopeSha='',approval='',proposalOnly=false}){
  const errors=[],notes=[]
  if(!Array.isArray(changes)||!changes.length)return {state:STATES.REVIEW,errors,notes:['no changed paths'],humanApprovalVerified:false}
  for(const c of changes){
    if(!c||typeof c.path!=='string'||c.path.includes('..')||c.path.startsWith('/'))errors.push('invalid changed path')
    if(c?.from&&(c.from.includes('..')||c.from.startsWith('/')))errors.push('invalid rename source')
  }
  if(!/^work\/items\/W-[A-Z]+-\d{3}-[a-z0-9-]+\/$/.test(workDir)){
    return {state:STATES.REVIEW,errors,notes:['cannot unambiguously identify one Work directory'],humanApprovalVerified:false}
  }
  const workId=/\/(W-[A-Z]+-\d{3})-/.exec(workDir)?.[1]
  const status=field(work,'Status'),proposalStatus=field(proposal,'Status')
  if(proposalOnly||status==='PROPOSED'){
    if(status!=='PROPOSED'||proposalStatus!=='PROPOSED')errors.push('proposal-only PR requires PROPOSED Work and proposal')
    for(const c of changes)for(const p of [c.path,c.from].filter(Boolean))
      if(!p.startsWith(workDir))errors.push('proposal-only change outside Work: '+p)
    return {state:errors.length?STATES.FAIL:STATES.PROPOSAL,errors,notes:['proposal-only does not grant implementation rights'],humanApprovalVerified:false}
  }
  if(!['APPROVED','IMPLEMENTING','VERIFYING','DONE'].includes(status))errors.push('implementation requires an approved active Work status')
  if(!scope||typeof scope!=='object'||Array.isArray(scope))errors.push('missing machine-readable Work scope')
  if(scope){
    if(scope.workId!==workId)errors.push('scope Work-ID mismatch')
    const rev=field(work,'Approved Proposal')
    if(!/^P-\d{3}$/.test(rev)||scope.proposalId!==rev)errors.push('Work proposal revision mismatch')
    if(proposalStatus!=='APPROVED')errors.push('approved proposal marker missing')
    const f=scope.allowedPaths,b=scope.forbiddenPaths
    if(!Array.isArray(f)||!f.length||f.some(x=>!validPathPattern(x)))errors.push('invalid or empty allowedPaths')
    if(!Array.isArray(b)||b.some(x=>!validPathPattern(x)))errors.push('invalid forbiddenPaths')
    if(Array.isArray(f)&&Array.isArray(b)){
      for(const c of changes)for(const p of [c.path,c.from].filter(Boolean)){
        if(!matches(p,f))errors.push('out of approved file scope: '+p)
        if(matches(p,b))errors.push('protected path changed: '+p)
      }
    }
    if(field(approval,'Status')!=='APPROVED FOR IMPLEMENTATION ONLY')errors.push('independent implementation approval evidence missing')
    if(field(approval,'Work-ID')!==workId)errors.push('approval Work-ID mismatch')
    if(field(approval,'Proposal-ID')!==scope.proposalId)errors.push('approval proposal revision mismatch')
    if(field(approval,'Proposal-SHA')!==proposalSha||!/^[a-f0-9]{40}$/.test(proposalSha))errors.push('immutable approved proposal blob anchor mismatch')
    if(field(approval,'Scope-SHA')!==scopeSha||!/^[a-f0-9]{40}$/.test(scopeSha))errors.push('immutable scope blob anchor mismatch')
    if(!field(approval,'User-Statement'))errors.push('user approval evidence quote missing (human check still required)')
    if(field(approval,'Main-Merge')!=='NOT AUTHORIZED')errors.push('merge must be independently approved')
    if(field(approval,'GitHub-Settings')!=='NOT AUTHORIZED')errors.push('Settings authorization must be independent')
    notes.push('Static gate cannot authenticate chat consent or grant merge authority')
  }
  return {state:errors.length?STATES.FAIL:STATES.READY,errors,notes,humanApprovalVerified:false}
}
