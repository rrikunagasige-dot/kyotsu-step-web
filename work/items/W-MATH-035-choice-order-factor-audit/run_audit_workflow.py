"""Real correction analysis/proposal stages only. Never accepts R05 or builds learner source."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from production import ai_request
from store import digest
from contracts import manifest
from requests import intake
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-035';parent='W-MATH-034';old=R/'work/items/W-MATH-034-n09-n10-guided-design'
def read(p):return json.loads(p.read_text())
def write(p,d):(B/p).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
sha='cb7d30bfe666b9123ea51e1fad7e36268507b674';feedback=read(B/'evidence/USER_FEEDBACK.json')
for code,quote,event in [('n09','1.この選択肢ちょっと整えていない\n違うだから\n1.41^2 =..\n1.42^2=..\n1.91 ...\nこっちの方がよくないかってことだよ','W034-N09-ORDER-NEGATIVE-20261025'),('n10','2.カッコが忘れている(sqrt 3- sqrt 2)でしょう','W034-N10-FACTOR-NEGATIVE-20261025')]:
 if event not in rt.state(parent)['users']:rt.user(parent,'quality_negative',quote,'public source '+sha,'current-conversation screenshots and user clarification',block=code,release_unit=code,event_id=event)
request_id='W034-N0910-ALL-MISTAKES-AUDIT-20261025'
intake(rt,parent,dict(id=request_id,kind='correction',quote=feedback['quotes'][-1],source_ref='current-conversation latest explicit audit-then-proposal request',version=sha))
corpus=read(R/'work/items/W-MATH-033-n08-absolute-value/LEARNING_CORPUS.json');model=read(R/'work/items/W-MATH-033-n08-absolute-value/MODEL_RESULT.json')
protected=read(old/'APPROVAL.json')['scope']['preserve'];rules=manifest(R,['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/REVIEW_POLICY.json','subjects/mathematics/textbook/SPEC.md','memory/LESSONS/MATH_TYPESETTING_GROUPS.md'])
common=['src/components/textbook/GuidedMathReadingFlow.tsx','src/components/textbook/guided-math-reading.css','src/domain/textbookDisplayLines.ts'];blocks=[];sources=[]
for code in ['n09','n10']:
 paths=[f'src/data/textbook/math/numbers/{code}Authored.json',*common];sources+=paths;check=read(B/f'evidence/{code.upper()}_PROPOSAL_IR_CHECK.json');blocks.append(dict(id=code,sources=paths,release_unit=code,change_facets=['math','design','render'],node_refs=[n['id'] for n in read(B/f'{code.upper()}_PROPOSED_IR.json')['nodes']],content_design_hash=check['irHash'],depends_on_blocks=['n09'] if code=='n10' else [],fact_dependencies=[]))
ph=hashlib.sha256((B/'PROPOSAL.md').read_bytes()).hexdigest();scope=dict(paths=[p for p in dict.fromkeys(sources) if p!='src/domain/textbookDisplayLines.ts']+['src/components/textbook/guidedMathDisplayPolicy.ts',str(B.relative_to(R))+'/'],preserve=protected+['src/domain/textbookDisplayLines.ts'])
plan=dict(work_id=w,parent_work=parent,parent_request=dict(work=parent,id=request_id),profile='material',command='CMD-WORK-001',workflow_version='production/2',subject='math',mode='textbook',source_sha=sha,source_manifest=manifest(R,list(dict.fromkeys(sources))),rules=rules,proposal=dict(id=w+'/P-001',hash=ph,contentDesignHash=digest(dict(ir={b['id']:b['content_design_hash'] for b in blocks},display=read(B/'PROPOSED_DISPLAY_POLICY.json')))),scope=scope,protected_manifest=manifest(R,scope['preserve']),blocks=blocks,release_units=[dict(id=code,block_ids=[code],review_route='/learning/textbook/math-numbers-expressions-'+code) for code in ['n09','n10']],simulation=False)
write('WORKFLOW_PLAN.json',plan)
if not any(e['kind']=='opened' and e['work']==w for e in rt.store.events()):rt.open(plan);rt.production_context(w,dict(corpusHash=corpus['hash'],modelHash=model['modelHash'],rulesHash=digest(rules),featureSchema='learner-visible-json/2'))
else:assert rt.state(w)['plan']['proposal']==plan['proposal']
ev=[]
for p in ['PROPOSAL.md','FINDINGS.json','NODE_AUDIT.json','PROPOSED_DISPLAY_POLICY.json','N09_PROPOSED_IR.json','N10_PROPOSED_IR.json','evidence/AUDIT_CHECKS.json','evidence/EXACT_MATH_CHECKS.json','evidence/SOURCE_MANIFEST.json','evidence/USER_FEEDBACK.json','evidence/CROSS_UNIT_PATTERN_SCAN.json']:
 rel=str((B/p).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=rel,sha256=manifest(R,[rel])[rel]),source_ref='actual source audit and bounded proposal, no implementation',verification_level='local_execution'))
dispositions=[dict(id=c['id'],disposition='APPLY',reason='操作の理由・演算対象全体・等式接続・選択肢と記録の描画を照合する。全体受入を別版へ転用せず、既存肯定を保護。元事例の数値は転記しない。') for c in corpus['cases']];write('CASE_DISPOSITIONS.json',dict(modelStatus='OFFLINE_ONLY',classifierInferenceUsed=False,cases=dispositions))
for nid in ['S00_RECOVER','S01_ROUTE']:
 if nid not in rt.state(w)['results']:rt.execute(w,nid)
def submit(code,kind,inputs,extra):
 nid=kind+'@'+code
 if nid in rt.state(w)['results']:return
 state=rt.state(w)
 if nid in state['claims']:
  c=state['claims'][nid];refs=[e['payload']['receipt'] for e in rt.store.events() if e['work']==w and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==c['input_hash']];job=dict(node=nid,claimToken=c['token'],receipts=refs)
 else:job=run_code(rt,w,inputs)
 assert job['node']==nid,(job['node'],nid);req=ai_request(rt,w,nid);outs={rt.store.get(r)['capability']:rt.store.get(rt.store.get(r)['output']) for r in job['receipts']};assert all(x['status'] in ['PASS','NEEDS_AI_REVIEW'] for x in outs.values()),outs
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=dispositions,proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='same-assistant-complete-source-review',evidence='All86 nodes/282 options reviewed. Seven findings reproduced; four specific display policies and three IR corrections proposed. Original IDs/keys preserved. Same assistant; no independent AI, new learner implementation, UI or publication success claimed.'),**extra)
 rt.submit(w,nid,job['claimToken'],result);write('evidence/'+code.upper()+'_'+kind+'_RESULT.json',dict(status='PASS_ANALYSIS_OR_PROPOSAL_ONLY',node=nid,outputs={k:v['status'] for k,v in outs.items()},receipts=job['receipts']))
for code in ['n09','n10']:
 ir=read(B/f'{code.upper()}_PROPOSED_IR.json');current=read(old/f'{code.upper()}_IR.json');arg=read(old/f'{code.upper()}_COMPLETE_SOLUTION.json');arg['claim']='既存完全解法を保持し、操作順と因子範囲を修正する限定案が成立する。';teaching=dict(solution=[dict(id=n['id'],inputFacts=n['requires'],outputFacts=n['produces'],goal=n['goal'],operation=n['operation'],basisRefs=n['sourceRefs']) for n in ir['nodes']],knowledge=ir['initialFacts'],options=dict(budget=1));impact=[dict(originFinding='F01-F07 source/choice/order/grouping audit',rootCauseSignature='display-operation-order-and-factor-scope',artifact=p,version=sha,approvedCreationWork=parent,block_id=b['id'],evidence_refs=ev,status='NOT-AFFECTED' if p in scope['preserve'] else 'AFFECTED',phase='pre-design',resolution='Bounded proposal changes only; protected shared source stays unchanged') for b in blocks for p in b['sources']]
 submit(code,'R01_CAPTURE',{'source.fixed':{},'feedback.capture':{}},dict(complaint='本人の順序と因子括弧の指摘。①を単なる整列と誤読した説明を訂正。',before_evidence=['evidence/USER_FEEDBACK.json','NODE_AUDIT.json'],reproduction='Current source all choices plus joined before/after equations; actual user screenshots. KaTeX latent-error and exact grouping counterexamples reproduced.',target_versions=dict(learner=sha)))
 submit(code,'R02_CAUSE',{'case.retrieve':{'request':dict(python='/tmp/kyotsu-n07-ml-20261025/bin/python',cache='/tmp/kyotsu-n07-encoder-20261025',encoder=dict(local_only=True),query='計算の順序 比較 選択肢 因子全体 括弧 前結果 描画漏れ',cases=corpus['cases'],scope=dict(subject='math',mode='textbook')),'python':'/tmp/kyotsu-n07-ml-20261025/bin/python'},'knowledge.ledger':dict(symbols=[dict(id='order-and-factor-scope',definitionRef='PROPOSAL sections1,3,7',scope=code)]),'math.solve':arg,'math.verify':arg,'ir.verify':current,'source.audit':dict(coverage=current['coverage'],sourceBlocks=current['sourceBlocks'],candidate=current),'novice.audit':dict(ir=current)},dict(symptoms=['independent calculations interleaved with comparison','composite factor loses parentheses at slot boundary','option derivation stages differ','hidden after equation malformed'],confirmed_causes=['string splitting without teaching-role order','raw concatenation without operand scope','option-specific derivation detail','table replaces malformed IR after'],hypotheses=[],missing_learning_actions=['read left calculation then right calculation then comparison','read sum/difference as one factor'],root_cause_signatures=['display-operation-order','slot-factor-scope','choice-step-mismatch','hidden-source-syntax']))
 submit(code,'R03_IMPACT',{'impact.inventory':{}},dict(impact_rows=impact,source_inventory=blocks[0 if code=='n09' else 1]['sources'],unknowns=[]))
 submit(code,'R04_PROPOSAL',{'math.solve':arg,'math.verify':arg,'teaching.plan':teaching,'step.plan':teaching,'blank.plan':dict(nodes=ir['nodes']),'prose.compose':ir,'text.verify':ir,'figure.verify':dict(figures=[],noFigureReason='既存元図と表示gateは保護。今回の修正は選択肢の式と因子範囲のみで図変更不要。'),'ir.verify':ir,'source.audit':dict(coverage=ir['coverage'],sourceBlocks=ir['sourceBlocks'],candidate=ir),'novice.audit':dict(ir=ir)},dict(before_after=['Four ID-specific display policies in PROPOSED_DISPLAY_POLICY','Two scoped factor templates and one malformed after formula in proposed IR'],protected_scope=scope['preserve'],patch_plan=['Work-local overlay on frozen W034 inputs','new target-only display policy; shared primitives unchanged','no grading key or saved-progress migration'],verification_plan=['full source/option scope and exact values','four widths, options/before/after/prior/history, real DOM order/grouping/number geometry','old saves, protected accepted units, exact hosted source'],proposal_hash=ph))
render(rt,w,B/'generated');render(rt,parent,old/'generated');n=rt.next(w);assert n['task']['node']['id']=='R05_APPROVAL@n09',n;write('evidence/RUNTIME_CHECKPOINT.json',dict(status='AWAITING_THIS_CONCRETE_PROPOSAL_APPROVAL',next=n,simulation=False,implementationChanged=False,publicationChanged=False,modelRefit=False));print(json.dumps(dict(work=w,next=n['task']['node']['id'],status='PROPOSED')))
