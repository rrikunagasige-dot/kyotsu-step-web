"""W047/G2-R1 only. An explicit, exact migration; never a generic-guard fallback.

The shared adapter and all its default ID/order rejections remain unchanged.
This route requires the separately approved one-slot move and frozen full bytes.
"""
import hashlib,json,os,time,subprocess
from collections import Counter
from pathlib import Path
from contracts import need,file,sha
from adapters import in_scope
from definitions import instantiate
from store import digest

B=Path(__file__).resolve().parent
PATH='src/data/textbook/math/numbers/n11Transformation.json'
SLOT='n11-tg-final-quotient'
PLAN='a3f9b71b1c7776f4d86dcebd970d7874b095218bc92cb7b40fee97b7f6231282'
def ids(v):
 if isinstance(v,dict):return ([v['id']]if 'id'in v else[])+sum((ids(x)for x in v.values()),[])
 if isinstance(v,list):return sum((ids(x)for x in v),[])
 return[]
def validate(before,after,expected):
 need(after==expected,'R1_GENERATED_BYTES_MISMATCH')
 bi,ai=ids(before),ids(after)
 need(Counter(bi)==Counter(ai)and bi.count(SLOT)==2,'R1_ID_MULTISET_CHANGED')
 need([i for i in bi if i!=SLOT]==[i for i in ai if i!=SLOT],'R1_UNAPPROVED_ID_ORDER')
 bg,ag=before['groups'],after['groups'];need(len(bg)==len(ag)==1,'R1_GROUP_COUNT')
 br,ar=bg[0]['rows'],ag[0]['rows'];need([r['id']for r in br]==[r['id']for r in ar],'R1_ROW_IDS')
 need(br[:5]==ar[:5],'R1_OTHER_ROWS_CHANGED')
 need(br[-2]['id']==ar[-2]['id']=='n11-tg-divide'and br[-1]['id']==ar[-1]['id']=='n11-tg-final','R1_EXACT_TWO_ROWS')
 need(br[-2]['interactionRef']is None and br[-1]['interactionRef']=='n11-06','R1_WRONG_ORIGIN')
 need(ar[-2]['interactionRef']=='n11-06'and ar[-1]['interactionRef']is None,'R1_WRONG_DESTINATION')
 need(ar[-2]['slots']==[{'id':SLOT,'interactionRef':'n11-06','path':'right'}]and ar[-1]['slots']==[],'R1_SLOT_CONTRACT')
 need(ar[-1]['visibleAfter']==br[-1]['visibleAfter']+['n11-06']and ar[-2]['visibleAfter']==br[-2]['visibleAfter'],'R1_GATE_CONTRACT')
 need(ar[-2]['masked']['right']==[{'type':'slot','id':SLOT,'interactionRef':'n11-06'}],'R1_UNMASKED_QUOTIENT')
 for k in ['unitId','baseIRHash','irHash','gradingHash','scope','numberAliases']:
  need(before[k]==after[k],'R1_PROTECTED_'+k)
 for b,a in zip(before['interactions'],after['interactions']):
  need({k:v for k,v in b.items()if k!='learnerDecision'}=={k:v for k,v in a.items()if k!='learnerDecision'},'R1_GRADING_CHANGED')
 return {'slot':SLOT,'fromRow':br[-1]['id'],'toRow':ar[-2]['id'],'occurrences':2,'allOtherIdOrderUnchanged':True}
def apply(rt,work,node,token,patch):
 # Pin this migration to the unchanged common guard. Future guard changes need review.
 approved=json.loads((B/'evidence/R1_APPROVAL.json').read_text());generated=json.loads((B/'evidence/R1_GENERATED.json').read_text());guard=json.loads((B/'evidence/R1_RELOCATION_CONTRACT.json').read_text())
 need(sha(rt.root/'workflow/adapters.py')==guard['genericAdapterHash'],'R1_COMMON_GUARD_DRIFT')
 need(approved['sourceRef']=='conversation:8faa9b19-dca3-4a04-930b-14666afe5f57'and approved['approvedPlanHash']==PLAN and generated['planHash']==PLAN,'R1_APPROVED_PLAN_REQUIRED')
 s=rt.state(work);c=s['claims'].get(node);n=instantiate(s['plan'])[node]
 need(c and c['expires_at']>time.time()and c['token']==token and c['input_hash']==rt.input_hash(s,n),'R1_VALID_CLAIM_REQUIRED')
 need(work=='W-MATH-047'and node=='R06_PATCH@n11','R1_WRONG_WORK_NODE')
 u=rt.approval(s,n);need(u and u['source_ref']==approved['sourceRef']and u['quote']==approved['quote'],'R1_EXACT_APPROVAL_REQUIRED')
 need(not rt.integrity(s),'R1_UNRECORDED_DIFFERENCE')
 need(patch==json.loads((B/'evidence/R1_DATA_PATCH.json').read_text()),'R1_FIXED_PATCH_REQUIRED')
 need(digest(patch)==next(b['patch_hash']for b in s['plan']['blocks']if b['id']=='n11'),'R1_PATCH_HASH')
 need(len(patch['files'])==1 and patch['files'][0]['path']==PATH and in_scope(PATH,s['plan']['scope'])and PATH in s['candidate_manifest'],'R1_SCOPE')
 f=patch['files'][0];p=file(rt.root,PATH);before=p.read_bytes();after=f['after_text'].encode()
 need(hashlib.sha256(before).hexdigest()==f['before_sha256']==generated['beforeHash'],'R1_BEFORE_HASH')
 need(hashlib.sha256(after).hexdigest()==f['after_sha256']==generated['compiledHash'],'R1_AFTER_HASH')
 need(sha(rt.root/'tools/textbook/transformation/n11.mjs')==generated['adapterHash']and sha(rt.root/'src/data/textbook/math/numbers/n11Authored.json')==generated['authoredHash'],'R1_GENERATOR_SOURCE_DRIFT')
 code="""import fs from 'node:fs';import assert from 'node:assert/strict';import {n11TransformationPlan} from './tools/textbook/transformation/n11.mjs';import {compileTransformationPresentation} from './tools/textbook/transformation/compile.mjs';import {hash} from './tools/textbook/util.mjs';const ir=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Authored.json'));const p=n11TransformationPlan(ir);assert.equal(hash(p),'a3f9b71b1c7776f4d86dcebd970d7874b095218bc92cb7b40fee97b7f6231282');const c=compileTransformationPresentation(ir,p);assert.equal(c.status,'PASS');process.stdout.write(JSON.stringify(c.compiled));"""
 expected=json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=rt.root,text=True))
 proof=validate(json.loads(before),json.loads(after),expected)
 need(guard['genericRejection']=='安定ID・順序の変更には移行を含む別の具体案が必要'and guard['negativeTests']=='PASS','R1_RELOCATION_REVIEW_REQUIRED')
 op='r1-relocation-'+digest(patch)[:20]+'-'+token[:12];need(not any(e['id']==op for e in rt.store.events()),'R1_ALREADY_EXECUTED')
 backup=rt.store.put({PATH:before.hex()});patchref=rt.store.put(patch);proofref=rt.store.put({'approvedPlanHash':PLAN,'migration':proof,'beforeHash':f['before_sha256'],'afterHash':f['after_sha256'],'approvalEvent':u['id'],'guardContract':guard})
 rt.append('patch_intent',work,{'node':node,'patch_hash':patchref,'backup':backup,'before':{PATH:f['before_sha256']},'relocationProof':proofref},event_id=op)
 tmp=p.with_name('.'+p.name+'.'+token[:12]+'.r1.tmp')
 with tmp.open('xb')as out:out.write(after);out.flush();os.fsync(out.fileno())
 os.replace(tmp,p)
 need(sha(p)==f['after_sha256'],'R1_POSTWRITE_HASH')
 rt.append('patch_applied',work,{'node':node,'operation':op,'after_manifest':{PATH:sha(p)},'relocationProof':proofref})
 return [rt.evidence(work,'file',{'path':PATH,'sha256':sha(p)},source_ref=op,verification_level='local_execution')]
