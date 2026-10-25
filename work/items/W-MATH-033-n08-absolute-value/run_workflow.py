"""Run existing production/2 through concrete proposal; stop at real R05 approval."""
import json,sys,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from contracts import manifest
from store import digest
from runner import run_code
from production import ai_request
from views import render
W='W-MATH-033';shared=R/'work/items/W-MATH-032-n07-semantic-repair/runtime'
rt=Runtime(shared,R)
def load(p):return json.loads((B/p).read_text())
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
existing=any(e['work']==W and e['kind']=='opened' for e in rt.store.events())
paths=['src/data/textbook/math/numbers/n08Lesson.ts','src/data/textbook/math/numbers/newBatchGuidedSteps.ts','src/pages/TextbookUnitPage.tsx','src/domain/textbook.ts','public/assets/math/textbook/numbers/n08-f01.png',str((B/'evidence/SOURCE_INDEX.json').relative_to(R))]
protected=['src/data/textbook/math/numbers/firstSectionTeaching.json','src/data/textbook/math/numbers/n07Authored.json','src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/n07-reading.css']
scope=['src/data/textbook/math/numbers/n08Lesson.ts','src/data/textbook/math/numbers/n08Authored.json','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css','src/pages/TextbookUnitPage.tsx','src/domain/textbook.ts',str(B.relative_to(R))+'/']
rules=['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/REVIEW_POLICY.json','subjects/mathematics/textbook/SPEC.md','memory/LESSONS/MATH_TYPESETTING_GROUPS.md']
ir=load('CANDIDATE_IR.json');legacy=load('evidence/LEGACY_PROJECTION.json');source=load('evidence/SOURCE_INDEX.json');argument=load('COMPLETE_SOLUTION.json')
ph=hashlib.sha256((B/'PROPOSAL.md').read_bytes()).hexdigest()
plan=dict(work_id=W,profile='material',command='CMD-WORK-001',workflow_version='production/2',subject='math',mode='textbook',source_sha='46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6',source_manifest=manifest(R,paths),rules=manifest(R,rules),proposal=dict(id=W+'/P-001',hash=ph,contentDesignHash=load('evidence/IR_CHECK.json')['irHash']),scope=dict(paths=scope,preserve=protected),protected_manifest=manifest(R,protected),blocks=[dict(id='n08',sources=paths,release_unit='n08',change_facets=['math','design','render'],node_refs=[n['id'] for n in ir['nodes']])],release_units=[dict(id='n08',block_ids=['n08'],review_route='/learning/textbook/math-numbers-expressions-n08')],simulation=False,correction_queue_refs=['work/items/W-GOV-010-learning-production-workflow/n07/feedback/NEGATIVE_CASES.json'])
write('WORKFLOW_PLAN.json',plan)
if not existing:rt.open(plan)
elif rt.state(W)['plan']['proposal']!=plan['proposal']:rt.revise(W,plan)
corpus=json.loads((R/'work/items/W-MATH-032-n07-semantic-repair/LEARNING_CORPUS.json').read_text())
if not existing:rt.production_context(W,dict(corpusHash=corpus['hash'],modelHash=None,rulesHash=digest(plan['rules']),featureSchema='learner-visible-json/2'))
ev=[]
for path in ['PROPOSAL.md','NODE_DESIGN.json','evidence/SOURCE_INDEX.json','evidence/PROPOSAL_CHECKS.json','evidence/FIGURE_PROVENANCE.json','evidence/LEGACY_PROJECTION.json','IMPACT_LEDGER.json']:
 rel=str((B/path).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=rel,sha256=manifest(R,[rel])[rel]),source_ref='N08 source and proposal audit',verification_level='local_execution'))
for stage in ['S00_RECOVER','S01_ROUTE']:
 if stage not in rt.state(W)['results']:rt.execute(W,stage)
dispositions=[]
for c in corpus['cases']:
 reason={'overall_material_acceptance':'N07の全体受入をN08の品質ラベルへ流用しない。受入済みN07自体を保護する。','layout_discomfort':'受入済みの中央配置・group幅・番号・選択肢配置をN08でも回帰検査する。'}.get(c['dimension'],'元の評価観点をN08の本文・文中数式・等式接続・前結果・穴・用語に照合する。N07の固有の数値や商表はコピーしない。')
 dispositions.append(dict(id=c['id'],dimension=c['dimension'],disposition='APPLY',reason=reason))
write('CASE_DISPOSITIONS.json',dict(corpusHash=corpus['hash'],modelStatus='OFFLINE_ONLY',modelInferenceUsed=False,cases=dispositions))
def submit(inputs,fields,review):
 # Resume a genuine claim, retaining failed receipts in history and rerunning only failures.
 expected={'complaint':'R01_CAPTURE','symptoms':'R02_CAUSE','impact_rows':'R03_IMPACT','before_after':'R04_PROPOSAL'}
 kind=next(v for k,v in expected.items() if k in fields);nid=kind+'@n08'
 if nid in rt.state(W)['results'] and rt.node_status(rt.state(W),__import__('definitions').instantiate(rt.state(W)['plan'])[nid])=='PASSED':return
 s=rt.state(W)
 if s['claims']:
  from capabilities import run_capability
  claim=s['claims'][nid];node=rt.task(W,nid)['node'];refs=[]
  for cap in node['capability_requests']:
   bound=[e['payload']['receipt'] for e in rt.store.events() if e['work']==W and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']]
   good=[ref for ref in bound if rt.store.get(ref)['capability']==cap and rt.store.get(rt.store.get(ref)['output']).get('status') in ('PASS','NEEDS_AI_REVIEW')]
   refs.append(good[-1] if good else run_capability(rt,W,node,cap,inputs[cap]))
  job=dict(node=nid,claimToken=claim['token'],receipts=refs)
 else:job=run_code(rt,W,inputs)
 request=ai_request(rt,W,job['node'])
 if kind=='R03_IMPACT':
  for row in fields['impact_rows']:row['phase']=request['task']['node']['phase']
 outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']}
 bad={k:v for k,v in outputs.items() if v.get('status') not in ('PASS','NEEDS_AI_REVIEW')}
 if bad:raise RuntimeError(json.dumps(bad,ensure_ascii=False)[:5000])
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=dispositions,aiReview=dict(requestHash=request['requestHash'],inputHash=request['task']['input_hash'],reviewer='current-assistant-source-and-proposal-audit',evidence=review),**fields)
 rt.submit(W,job['node'],job['claimToken'],result)
 write('evidence/'+request['task']['node']['stage_kind']+'_RESULT.json',dict(node=job['node'],outputs={cap:dict(status=out['status'],outputArtifact=next(rt.store.get(ref)['output'] for ref in job['receipts'] if rt.store.get(ref)['capability']==cap)) for cap,out in outputs.items()},review=review,fullOutputs='Content-addressed artifacts remain in the shared Runtime Store.'))
submit({'source.fixed':{},'feedback.capture':{}},dict(complaint='ユーザーはN08の続行を依頼。現行12問構成に、受入済み教え方との不整合をAIが診断した。',before_evidence=['ORIGINAL_STEPS.json immutable source hash','SOURCE_INDEX Word35blocks/12markers','FIGURE_PROVENANCE original bytes'],reproduction='旧helperは1問1選択の固定構造。Q07/Q09の複数操作が最終解答へまとまり、数式を含むlead/after/hintがtextとして出力される。実DOM検査とは区別する。',target_versions={'learner':'46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6','tools':'058c4ea32474b563487292b583f7a01df4f9c4f1'}),'原問12、元図、現行source/helper、既存Q05ヒント修正の承認を確認。続行依頼を否定のGold評価には変換しない。')
symbols=[dict(id=f,definitionRef='原資料とCOMPLETE_SOLUTION.jsonの明示した前提',scope='absolute-value') for f in ir['initialFacts']]
submit({'case.retrieve':{'request':{'cache':'/workspace/scratch/f79c5816761e/n07-local-model-cache','query':'N08 絶対値 規則選択 全体に負号 等式 前結果 用語 math 表示','cases':corpus['cases'],'scope':{'subject':'math','mode':'textbook'},'encoder':{'local_only':True}}},'knowledge.ledger':{'symbols':symbols},'math.verify':argument,'math.solve':argument,'ir.verify':legacy,'source.audit':{'coverage':legacy['coverage'],'sourceBlocks':source['blocks'],'candidate':legacy},'novice.audit':{'ir':legacy}},dict(symptoms=['一問一択への圧縮','式中の判断欠落','用語・文中数式のtext化','条件付き前結果不足','独立の場合の証明が省略','同値の誤答選択肢'],confirmed_causes=['newBatchGuidedSteps固定projection','n08全段階に意味依存・term spanが未指定','一般的性質の条件確認が最終択に圧縮'],hypotheses=[],missing_learning_actions=['場合の選択','中身全体を括弧にする','両項の負号処理','0の境界','逆向きの確認'],root_cause_signatures=['compressed-multiple-operations','prose-math-role-loss','missing-conditional-context','equivalent-distractors'],unknowns=[],lessonReadiness='NOT_READY',diagnosticProjection='Faithful old strings, not production candidate or actual DOM proof',proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False),'旧N08文字列の忠実投影をstrictIRで検査し、元35blockとの対応を照合。schema PASSを教材合格としない。距離の定義・非負の場合・負の場合・0と、9恒等式検算を監査。OFFLINE_ONLYモデルを本番判断に使わず版付きcatalog10件を観点別に消費した。')
impact=load('IMPACT_LEDGER.json')['rows']
for row in impact:row['evidence_refs']=ev;row['phase']='pre-fix'
submit({'impact.inventory':{}},dict(impact_rows=impact,source_inventory=paths,unknowns=[]),'N08全36設計node/原12問、共有helper・router・進捗・元図を調査。helperを変更せずN08専用分岐へ接続するため、他のconsumerを今回書き換えない。保護対象のbyteは不変。NOT-AFFECTEDは今回差分の影響判定であり、他教材の教育的品質の保証ではない。')
solution=[dict(id=n['id'],inputFacts=n['requires'],outputFacts=n['produces'],goal=n['goal'],operation=n['operation'],basisRefs=n['sourceRefs']) for n in ir['nodes']]
teaching=dict(solution=solution,knowledge=ir['initialFacts'],options={'budget':1})
image=str(R/'public/assets/math/textbook/numbers/n08-f01.png')
submit({'math.solve':argument,'math.verify':argument,'teaching.plan':teaching,'step.plan':teaching,'blank.plan':{'nodes':ir['nodes']},'prose.compose':ir,'text.verify':ir,'figure.verify':{'figures':[dict(id='n08-f01',purpose='座標の向きと原点からの距離を区別する',howToRead='原点と左右の二点を読み、右側座標から左側座標を引く',sourceRef='word-p-000344',visibleWhen='S01 before distance answers; later recall only',sourcePath='public/assets/math/textbook/numbers/n08-f01.png',contentHash=hashlib.sha256(__import__('base64').b64encode(Path(image).read_bytes())).hexdigest())]},'ir.verify':ir,'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}},dict(before_after=['原12問→36思考node/31回答/12段階','全文・穴・誤答・ヒント・前結果はNODE_DESIGNに固定'],protected_scope=protected,patch_plan=['N08限定data/reader/CSS/route','旧12回答履歴と19新中間操作を区別するrevision4移行','承認hashとIRhashの照合後に限定patch'],verification_plan=['PROPOSAL検証1–6','全原資料coverage','数学・全場合・対偶ではなく逆向き','四幅・全操作・履歴・進捗・既存受入単元・配信照合'],proposal_hash=ph,proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False),'36nodeの本文・数式・穴・誤答理由・ヒントと依存を確認。原12正答契約、未番号説明、元図byteを保持。Q07/Q09はrelationChain、Q10は両方向、Q11は正負0、Q12は二場合。候補IRのcompileは設計検査であり、learner実装・実画面・ユーザー受入ではない。')
render(rt,W,B/'generated');nxt=rt.next(W);assert nxt['task']['node']['stage_kind']=='R05_APPROVAL',nxt
write('evidence/RUNTIME_CHECKPOINT.json',dict(status='AWAITING_CONCRETE_DESIGN_APPROVAL',simulation=False,sharedStore=str(shared.relative_to(R)),work=W,next=nxt,sourceSHA=plan['source_sha'],toolSHA='058c4ea32474b563487292b583f7a01df4f9c4f1',lessonImplementation=False,publication=False,userQualityLabelCreated=False))
print(json.dumps(dict(work=W,next=nxt['task']['node']['id'],status='AWAITING_CONCRETE_DESIGN_APPROVAL'),ensure_ascii=False))
