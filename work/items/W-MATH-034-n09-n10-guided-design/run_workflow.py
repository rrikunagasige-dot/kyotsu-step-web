"""Execute real correction R01-R04 for two blocks; never manufacture R05 approval."""
import json,sys,hashlib,base64
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from production import ai_request
from contracts import manifest
from store import digest
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-034'
def load(p):return json.loads((B/p).read_text())
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
corpus=json.loads((R/'work/items/W-MATH-033-n08-absolute-value/LEARNING_CORPUS.json').read_text());model=json.loads((R/'work/items/W-MATH-033-n08-absolute-value/MODEL_RESULT.json').read_text())
protected=['src/data/textbook/math/numbers/firstSectionTeaching.json','src/data/textbook/math/typesetting.json','src/data/textbook/math/numbers/n07Authored.json','src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/n07-reading.css','src/data/textbook/math/numbers/n08Authored.json','src/data/textbook/math/numbers/n08Lesson.ts','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css','public/assets/math/textbook/numbers/n09-f01.png']
scope=['src/data/textbook/math/numbers/n09Lesson.ts','src/data/textbook/math/numbers/n10Lesson.ts','src/data/textbook/math/numbers/n09Authored.json','src/data/textbook/math/numbers/n10Authored.json','src/components/textbook/GuidedMathReadingFlow.tsx','src/components/textbook/guided-math-reading.css','src/pages/TextbookUnitPage.tsx','src/domain/textbook.ts','src/test/n09Legacy.ts','src/test/n10Legacy.ts','src/data/textbook/math/numbers/newBatchCoverage.test.ts','src/data/textbook/math/numbers/firstSectionTeaching.test.tsx','src/review/reviewTargets.test.ts','src/data/textbook/math/numbers/n09Atomicity.test.ts',str(B.relative_to(R))+'/']
rules=['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/REVIEW_POLICY.json','subjects/mathematics/textbook/SPEC.md','memory/LESSONS/MATH_TYPESETTING_GROUPS.md']
blocks=[]
for u in ['n09','n10']:
 sources=['src/data/textbook/math/numbers/'+u+'Lesson.ts','src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx',str((B/f'evidence/{u.upper()}_SOURCE_INDEX.json').relative_to(R))]
 if u=='n09':sources+=['public/assets/math/textbook/numbers/n09-f01.png']
 blocks.append(dict(id=u,sources=sources,release_unit=u,change_facets=['math','design','render'],node_refs=[n['id'] for n in load(u.upper()+'_IR.json')['nodes']],content_design_hash=load(f'evidence/{u.upper()}_VERIFY-IR.json')['irHash'],depends_on_blocks=['n09'] if u=='n10' else [],fact_dependencies=['n09'] if u=='n10' else []))
proposal_hash=hashlib.sha256((B/'PROPOSAL.md').read_bytes()).hexdigest();allpaths=list(dict.fromkeys(p for b in blocks for p in b['sources']))
plan=dict(work_id=w,profile='material',command='CMD-WORK-001',workflow_version='production/2',subject='math',mode='textbook',source_sha='ea47dd97f7d323267281915e8d9a7bb92a8e7c03',source_manifest=manifest(R,allpaths),rules=manifest(R,rules),proposal=dict(id=w+'/P-001',hash=proposal_hash,contentDesignHash=digest({b['id']:b['content_design_hash'] for b in blocks})),scope=dict(paths=scope,preserve=protected),protected_manifest=manifest(R,protected),blocks=blocks,release_units=[dict(id=u,block_ids=[u],review_route='/learning/textbook/math-numbers-expressions-'+u) for u in ['n09','n10']],simulation=False,correction_queue_refs=['work/items/W-GOV-010-learning-production-workflow/n07/feedback/NEGATIVE_CASES.json'])
write('WORKFLOW_PLAN.json',plan)
if not any(e['work']==w and e['kind']=='opened' for e in rt.store.events()):
 rt.open(plan);rt.production_context(w,dict(corpusHash=corpus['hash'],modelHash=model['modelHash'],rulesHash=digest(plan['rules']),featureSchema='learner-visible-json/2'))
else:assert rt.state(w)['plan']['proposal']==plan['proposal'],'proposal changed: explicit revise required'
ev=[]
for p in ['PROPOSAL.md','N09_NODE_DESIGN.json','N10_NODE_DESIGN.json','evidence/PROPOSAL_CHECKS.json','evidence/MATH_CHECK.json','evidence/FIGURE_PROVENANCE.json','evidence/N09_CURRENT.json','evidence/N10_CURRENT.json']:
 rel=str((B/p).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=rel,sha256=manifest(R,[rel])[rel]),source_ref='actual source and complete bounded design',verification_level='local_execution'))
dispositions=[dict(id=c['id'],dimension=c['dimension'],disposition='APPLY',reason=('範囲付き全体受入を他単元や個別観点の品質ラベルへ流用せず、前結果・誘導・公開を保護する。' if c['dimension']=='overall_material_acceptance' else 'この評価観点を、根号の意味、公式の根拠、因子の判断、等式接続、黒字用語、文中数式、前結果/履歴の各surfaceに照合する。N07の固有数値は転記しない。')) for c in corpus['cases']]
write('CASE_DISPOSITIONS.json',dict(corpusHash=corpus['hash'],modelHash=model['modelHash'],modelStatus='OFFLINE_ONLY',classifierInferenceUsed=False,cases=dispositions))
for nid in ['S00_RECOVER','S01_ROUTE']:
 if nid not in rt.state(w)['results']:rt.execute(w,nid)
def submit(u,kind,inputs,fields,review):
 nid=kind+'@'+u;s=rt.state(w)
 if nid in s['results']:return
 if s['claims']:
  from capabilities import run_capability
  claim=s['claims'][nid];node=rt.task(w,nid)['node'];refs=[]
  for cap in node['capability_requests']:
   bound=[e['payload']['receipt'] for e in rt.store.events() if e['work']==w and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']]
   good=[ref for ref in bound if rt.store.get(ref)['capability']==cap and rt.store.get(rt.store.get(ref)['output']).get('status') in ('PASS','NEEDS_AI_REVIEW')]
   refs.append(good[-1] if good else run_capability(rt,w,node,cap,inputs[cap]))
  job=dict(node=nid,claimToken=claim['token'],receipts=refs)
 else:job=run_code(rt,w,inputs)
 assert job['node']==nid,(job['node'],nid)
 req=ai_request(rt,w,nid)
 if kind=='R03_IMPACT':
  for row in fields['impact_rows']:row['phase']=req['task']['node']['phase']
 outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']}
 assert all(o['status'] in ('PASS','NEEDS_AI_REVIEW') for o in outputs.values()),outputs
 if 'math.solve' in inputs or 'math.verify' in inputs:fields.update(proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False)
 rt.submit(w,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=dispositions,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-source-and-novice-review',evidence=review+' Same-assistant review, not an independent second AI. No implementation/browser/publication or user quality label is claimed.'),**fields))
 write('evidence/'+u.upper()+'_'+kind+'_RESULT.json',dict(node=nid,status='PASS_BOUNDED',outputs={k:v['status'] for k,v in outputs.items()},review=review,receiptArtifacts=job['receipts']))
impact=[dict(originFinding='N09/N10 compressed source operations and persistent state',rootCauseSignature='guided-root-equivalence-and-conditions',artifact=p,version=plan['source_sha'],approvedCreationWork='W-MATH-003 and W-MATH-009 original scope retained',block_id=b['id'],evidence_refs=ev,status='AFFECTED' if p.endswith('Lesson.ts') else 'NOT-AFFECTED',phase='pre-design',resolution='Own two lesson repairs are in this proposal; shared adapters need bounded integration, source image retained') for b in blocks for p in b['sources']]
write('IMPACT_LEDGER.json',dict(phase='pre-design',rows=impact,unresolved=[]))
for u in ['n09','n10']:
 U=u.upper();ir=load(U+'_IR.json');legacy=load(f'evidence/{U}_LEGACY_PROJECTION.json');source=load(f'evidence/{U}_SOURCE_INDEX.json');argument=load(U+'_COMPLETE_SOLUTION.json')
 submit(u,'R01_CAPTURE',{'source.fixed':{},'feedback.capture':{}},dict(complaint='本人のN09/N10着手依頼を受け、N08受入済み基準との差をAIがsourceから診断。否定Goldを捏造しない。',before_evidence=[f'evidence/{U}_CURRENT.json',f'evidence/{U}_SOURCE_INDEX.json'],reproduction='CURRENTの全readingFlowと採点契約、原Wordの無番号説明を照合。複数操作と条件判断を追加のnodeへ分ける。DOM診断とは区別する。',target_versions=dict(learner=plan['source_sha'],tools='058c4ea32474b563487292b583f7a01df4f9c4f1')),'Original source and current complete lesson inspected. N09 existing four Q08 prerequisites and original image reveal timing preserved; N10 proof assumptions and earlier repaired hints retained.')
 submit(u,'R02_CAUSE',{'case.retrieve':{'request':dict(cache='/workspace/scratch/f79c5816761e/n07-local-model-cache',encoder=dict(local_only=True),query=U+' 根号の非負性 条件 公式の選択 等価な変形 前結果 数式の表示',cases=corpus['cases'],scope=dict(subject='math',mode='textbook'))},'knowledge.ledger':{'symbols':[dict(id=f,definitionRef='原Wordと具体nodeで定義・既習の出所を明記',scope=u) for f in ir['initialFacts']]},'math.solve':argument,'math.verify':argument,'ir.verify':legacy,'source.audit':dict(coverage=legacy['coverage'],sourceBlocks=source['blocks'],candidate=legacy),'novice.audit':dict(ir=legacy)},dict(symptoms=['符号/非負性/大小と最終式が一択へ圧縮','式を作る判断と計算対象の分割不足','必要な条件付き前結果が不足','旧版と追加途中回答の移行が未設計'],confirmed_causes=['旧readingFlowは今回の条件付きrecord/意味属性を指定していない','原問の複数の操作を一つの答えにまとめる箇所がある','新しい能動回答を旧完了へ足す移行は未実装'],hypotheses=[],missing_learning_actions=['条件から分岐を選ぶ','公式と対象を対応させる','元の式全体へ戻す','非零と等価性を確認する'],root_cause_signatures=['compressed-multiple-operations','missing-conditional-context','unmotivated-formula-selection','revision-contract-order']), 'Legacy prompt/grading projection is deliberately partial and does not certify legacy prose. Full CURRENT/source files reviewed directly; new complete solution uses elementary arithmetic before radical product proof and preserves all conditions.')
 submit(u,'R03_IMPACT',{'impact.inventory':{}},dict(impact_rows=impact,source_inventory=allpaths,unknowns=[]),'Both lesson sources, two shared consumers, source indices and unchanged original image inventoried with source hashes. Repairs remain within the two proposal blocks; accepted N08/N07/first-title hashes protected.')
 solution=[dict(id=n['id'],inputFacts=n['requires'],outputFacts=n['produces'],goal=n['goal'],operation=n['operation'],basisRefs=n['sourceRefs']) for n in ir['nodes']];teaching=dict(solution=solution,knowledge=ir['initialFacts'],options=dict(budget=1))
 figures={'figures':[],'noFigureReason':'N10は条件と等式の対応で教える。元図0枚で追加図は不要。'}
 if u=='n09':
  image=R/'public/assets/math/textbook/numbers/n09-f01.png';figures={'figures':[dict(id='n09-f01',purpose='整数部分を決めた後に元の数直線で負数の区間を照合する',howToRead='-2.1の点と左右の隣接整数を見る',sourceRef='word-p-000404',visibleWhen='after n09-10 resolved only; alt/caption share gate',sourcePath='public/assets/math/textbook/numbers/n09-f01.png',contentHash=hashlib.sha256(base64.b64encode(image.read_bytes())).hexdigest())]}
 submit(u,'R04_PROPOSAL',{'math.solve':argument,'math.verify':argument,'teaching.plan':teaching,'step.plan':teaching,'blank.plan':dict(nodes=ir['nodes']),'prose.compose':ir,'text.verify':ir,'figure.verify':figures,'ir.verify':ir,'source.audit':dict(coverage=ir['coverage'],sourceBlocks=source['blocks'],candidate=ir),'novice.audit':dict(ir=ir)},dict(before_after=[U+': all original grading contracts retained; complete node-by-node copy and conditional result references in attached design','N09 41nodes/36answers/11stages; N10 45nodes/45answers/12stages'],protected_scope=protected,patch_plan=['one N09/N10 common reader composed from accepted primitives; protected readers unchanged','separate authored JSON and N09 v3/N10 v2 migrations; N09 original v1→v2 contract first','exact proposal and IR hashes checked before materialization; separate release units'],verification_plan=['all96 source blocks,39 old contracts,19 symbolic identities','four widths, all correct and wrong choices, conditions/history, no future image/answer','real v1/v2 histories, partial retired wrong choices, first/attempt/archive preservation','protected first-title/N07/N08 and other mode regressions; exact published source and hosted play'],proposal_hash=proposal_hash,proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False),'All86 node texts, holes, distractor explanations, hints and downstream uses reviewed. Real validator found answer leakage and a local relation-tokenizer boundary error; corrected before proposal approval. Mixed comparison chains use inequality; equivalent steps use equality. N09 cases and positive/negative parts get explicit tables. Compile is design verification only.')
render(rt,w,B/'generated');nxt=rt.next(w);assert nxt['task']['node']['stage_kind']=='R05_APPROVAL',nxt
write('evidence/RUNTIME_CHECKPOINT.json',dict(status='AWAITING_CONCRETE_DESIGN_APPROVAL',work=w,next=nxt,simulation=False,sourceSHA=plan['source_sha'],sharedStore='work/items/W-MATH-032-n07-semantic-repair/runtime',corpusCases=len(corpus['cases']),learnerImplementation=False,publicDeployment=False))
print(json.dumps(dict(next=nxt['task']['node']['id'],work=w,status='AWAITING_CONCRETE_DESIGN_APPROVAL')))
