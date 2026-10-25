"""First real production/2 trial. Records the blocked diagnostic, never fakes R02/R04 PASS."""
import json,sys,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];BASE=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'workflow'))
from runtime import Runtime
from contracts import manifest
from store import digest
from runner import run_code
from production import ai_request
from views import render

def write(name,obj):(BASE/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def run():
 work='W-MATH-032';store=BASE/'runtime';assert not (store/'events').exists(),'Do not mix repeated runs into a new ledger'
 src=['src/data/textbook/math/numbers/n07Authored.json','src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/n07-reading.css','tools/textbook/fixtures/n07-source-index.json']
 protected=['src/data/textbook/math/numbers/firstSectionTeaching.json']
 rules=['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/REVIEW_POLICY.json','subjects/mathematics/textbook/SPEC.md','memory/LESSONS/MATH_TYPESETTING_GROUPS.md']
 proposal=hashlib.sha256((BASE/'PROPOSAL.md').read_bytes()).hexdigest()
 plan={'work_id':work,'profile':'material','command':'CMD-WORK-001','workflow_version':'production/2','subject':'math','mode':'textbook','source_sha':'4fb7a98e7f864839ccc1374080473df4ba60ce88','source_manifest':manifest(ROOT,src),'rules':manifest(ROOT,rules),'proposal':{'id':'W-MATH-032/P-001','hash':proposal},'scope':{'paths':['src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/SemanticReading.tsx','src/components/textbook/n07-reading.css','src/data/textbook/math/numbers/n07Authored.json','tools/textbook/','workflow/','work/items/W-MATH-032-n07-semantic-repair/'],'preserve':protected},'protected_manifest':manifest(ROOT,protected),'blocks':[{'id':'n07','sources':src,'release_unit':'n07','change_facets':['design','render'],'node_refs':json.loads((ROOT/src[0]).read_text())['unit']['sections'][0]['items'][0:0]}],'release_units':[{'id':'n07','block_ids':['n07'],'review_route':'/learning/textbook/math-numbers-expressions-n07'}],'simulation':False,'correction_queue_refs':['work/items/W-GOV-010-learning-production-workflow/n07/feedback/NEGATIVE_CASES.json']}
 plan['blocks'][0]['node_refs']=[n['id'] for n in json.loads((ROOT/src[0]).read_text())['nodes']]
 write('WORKFLOW_PLAN.json',plan);rt=Runtime(store,ROOT);rt.open(plan)
 corpus=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/redesign/implementation/CURATED_CASES.json').read_text())
 rt.production_context(work,{'corpusHash':corpus['hash'],'modelHash':None,'rulesHash':digest(plan['rules']),'featureSchema':'learner-context-chunk-mean/1'})
 ev=[]
 for name in ('evidence/SOURCE_AUDIT.json','evidence/IMAGE_PROVENANCE.json','evidence/ORIGINAL_N07.json'):
  path=(BASE/name).relative_to(ROOT).as_posix();ev.append(rt.evidence(work,'file',{'path':path,'sha256':manifest(ROOT,[path])[path]},source_ref='source and user-image audit',verification_level='local_execution'))
 rt.execute(work,'S00_RECOVER');rt.execute(work,'S01_ROUTE')
 job=run_code(rt,work,{'source.fixed':{},'feedback.capture':{}})
 req=ai_request(rt,work,job['node'])
 result={'verdict':'PASS','evidence_refs':ev,'capability_receipts':job['receipts'],'complaint':'六つの原指摘と同型をsource/imageで確認。登録は修正完了を意味しない。','before_evidence':['six hash-matched user images','4fb7a98e exact artifact'],'reproduction':'Current compiler and reader produce the six observed renderings; SOURCE_AUDIT details all41 nodes.','target_versions':{'learner':plan['source_sha'],'engine':'190941bc9d65fb3ed2fa6b52ba90196addf19e33'},'aiReview':{'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'current-assistant-source-and-image-audit','evidence':'Six source images visually inspected; original Word and compiled source compared.'}}
 rt.submit(work,job['node'],job['claimToken'],result)
 authored=json.loads((ROOT/src[0]).read_text());source=json.loads((ROOT/src[3]).read_text());legacyplan=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/n07/N07_DESIGN_PLAN.json').read_text())
 inputs={'case.retrieve':{'request':{'cache':'/workspace/scratch/f79c5816761e/n07-local-model-cache','encoder':{'local_only':True},'query':'N07 倍率10 単独 引く 等式 接続 素因数分解 math 表示 前の結果 表','cases':corpus['cases'],'scope':{'subject':'math','mode':'textbook'}}},'ir.verify':authored,'source.audit':{'coverage':legacyplan['coverage'],'sourceBlocks':source['blocks'],'candidate':authored},'novice.audit':{'ir':authored}}
 job=run_code(rt,work,inputs);req=ai_request(rt,work,job['node'])
 details=[]
 for ref in job['receipts']:
  receipt=rt.store.get(ref);output=rt.store.get(receipt['output']);details.append({'capability':receipt['capability'],'status':output.get('status'),'receipt':ref,'output':receipt['output'],'reason':output.get('reason',output.get('error',output.get('stderr','')))[:1300]})
 negative=[d for d in details if d['status'] not in ('PASS','NEEDS_AI_REVIEW')]
 result={'verdict':'UNVERIFIED','evidence_refs':ev,'capability_receipts':job['receipts'],'symptoms':['six user render findings and same-root nodes'],'confirmed_causes':['compiler flattens prose to text','reader result drops tables and source problem','no semantic output role or relation','legacy typed-IR mismatch during diagnostics'],'hypotheses':[],'missing_learning_actions':[],'root_cause_signatures':['context-projection-loss','orphan-output','operation-sentence-loss','equation-relation-loss','semantic-part-loss','legacy-diagnostic-profile-missing'],'unknowns':['R02 legacy diagnostic/case fallback must be supported before the engine can continue.'],'aiReview':{'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'current-assistant-source-and-image-audit','evidence':'Source diagnosis complete; failing code outputs retained, not overridden.'}}
 rt.submit(work,job['node'],job['claimToken'],result)
 write('evidence/RUNTIME_TRIAL.json',{'simulation':False,'sourceSHA':plan['source_sha'],'R01':'PASSED','R02':'UNVERIFIED','next':rt.next(work),'codeResults':details,'MLTrainingRun':False,'lessonFixed':False,'R03_R04_documents':'proposal drafts, not engine PASS receipts'})
 render(rt,work,BASE/'generated');return details
if __name__=='__main__':print(json.dumps(run(),ensure_ascii=False))
