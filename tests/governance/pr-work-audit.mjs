// PR integrity diagnostic (universal advisory, NOT a human-approval oracle).
import {execFileSync} from 'node:child_process'
import {existsSync,readFileSync,appendFileSync} from 'node:fs'
import {audit,STATES,field} from './pr-work-policy.mjs'
const git=(args,encoding='utf8')=>execFileSync('git',args,{encoding,maxBuffer:20*1024*1024})
const base=process.env.PR_BASE_SHA,head=process.env.PR_HEAD_SHA
const fail=(message,code=1)=>{
  console.error('PR WORK AUDIT:',message)
  if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## Work integrity advisory\n\n**'+message+'**\n')
  process.exit(code)
}
if(!/^[0-9a-f]{40}$/.test(base||'')||!/^[0-9a-f]{40}$/.test(head||''))fail('missing exact base/head commit SHA')
const diff=git(['diff','--name-status','--find-renames','-z',base,head],null).toString('utf8').split('\0').filter(Boolean)
const changes=[]
for(let i=0;i<diff.length;){
 const status=diff[i++]
 if(!/^(?:[AMDTU]|[RC]\d{1,3})$/.test(status))fail('unexpected git diff status '+status)
 if(status.startsWith('R')||status.startsWith('C')){
  if(i+1>=diff.length)fail('truncated git rename/copy record')
  changes.push({status,from:diff[i++],path:diff[i++]})
 }else{if(i>=diff.length)fail('truncated git diff record');changes.push({status,path:diff[i++]})}
}
const dirs=[...new Set(changes.flatMap(c=>[c.path,c.from].filter(Boolean))
   .map(p=>/^work\/items\/(W-[A-Z]+-\d{3}-[a-z0-9-]+)\//.exec(p)?.[1]).filter(Boolean))]
let workDir=dirs.length===1?'work/items/'+dirs[0]+'/':''
const event=process.env.GITHUB_EVENT_PATH&&existsSync(process.env.GITHUB_EVENT_PATH)
 ?JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')):{}
const prBody=event.pull_request?.body||''
if(!workDir&&/^Work-Directory:\s*(work\/items\/W-[A-Z]+-\d{3}-[a-z0-9-]+\/)\s*$/m.test(prBody)){
 workDir=prBody.match(/^Work-Directory:\s*(work\/items\/W-[A-Z]+-\d{3}-[a-z0-9-]+\/)\s*$/m)[1]
}
const show=path=>{try{return git(['show',head+':'+path])}catch{return ''}}
const sha=path=>{try{return git(['rev-parse',head+':'+path]).trim()}catch{return ''}}
const work=workDir?show(workDir+'WORK.md'):''
const status=field(work,'Status'),revision=field(work,'Approved Proposal')
const proposed=revision==='P-001'?'PROPOSAL.md':revision?'PROPOSAL_'+revision+'.md':'PROPOSAL.md'
const proposal=workDir?show(workDir+proposed):''
let scope=null
try{scope=JSON.parse(workDir?show(workDir+'SCOPE.json'):'null')}catch{scope=null}
const approval=workDir&&revision?show(workDir+'APPROVAL_'+revision+'.md'):''
const result=audit({
 changes,workDir,work,proposal,proposalSha:workDir?sha(workDir+proposed):'',
 scope,scopeSha:workDir?sha(workDir+'SCOPE.json'):'',approval,proposalOnly:status==='PROPOSED'
})
const report={
 repository:process.env.GITHUB_REPOSITORY||'unknown',
 base,head,changedPaths:changes.map(x=>x.from?x.from+' -> '+x.path:x.path),
 workDirectory:workDir||null,decision:result.state,
 humanApprovalVerified:false,
 warning:'Static Git evidence cannot prove actual user authorization. No main merge or Settings permission is granted.',
 errors:result.errors,notes:result.notes
}
console.log(JSON.stringify(report,null,2))
if(process.env.GITHUB_STEP_SUMMARY){
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## Cross-Work PR integrity advisory\n\n')
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,'**Decision:** '+result.state+'\n\n')
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,'Work: '+(workDir||'(not identified)')+'\n\n')
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,'Changed paths: '+changes.length+'\n\n')
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,'**Human approval is NOT authenticated by CI. Main merge remains a distinct owner decision.**\n\n')
 for(const e of result.errors)appendFileSync(process.env.GITHUB_STEP_SUMMARY,'- FAIL: '+e+'\n')
 for(const n of result.notes)appendFileSync(process.env.GITHUB_STEP_SUMMARY,'- NOTE: '+n+'\n')
}
if(result.state===STATES.FAIL)process.exitCode=1
if(result.state===STATES.REVIEW)process.exitCode=2
