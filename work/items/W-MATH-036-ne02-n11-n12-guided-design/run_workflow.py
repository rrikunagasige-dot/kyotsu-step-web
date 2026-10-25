"""Real existing production/2 correction R01-R04; never accepts the design."""
import json,sys,hashlib,base64
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from production import ai_request
from contracts import manifest
from store import digest
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';codes=['ne02','n11','n12']
def load(p):return json.loads((B/p).read_text())
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
prior=R/'work/items/W-MATH-035-choice-order-factor-audit';corpus=json.loads((prior/'LEARNING_CORPUS.json').read_text());model=json.loads((prior/'MODEL_RESULT_CORRECTED.json').read_text());assert rt.next('W-MATH-035')['status']=='DONE'
protected=['src/data/textbook/math/numbers/firstSectionTeaching.json','src/data/textbook/math/typesetting.json','src/data/textbook/math/numbers/n07Authored.json','src/data/textbook/math/numbers/n08Authored.json','src/data/textbook/math/numbers/n09Authored.json','src/data/textbook/math/numbers/n10Authored.json','src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/guidedMathDisplayPolicy.ts','src/components/textbook/guided-math-reading.css','src/domain/textbookDisplayLines.ts']+[f['sourcePath'] for f in load('DISPLAY_SPEC.json')['figures']]
rules=['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/REVIEW_POLICY.json','subjects/mathematics/textbook/SPEC.md','memory/LESSONS/MATH_TYPESETTING_GROUPS.md']
scope=[f'src/data/textbook/math/numbers/{c}{tail}' for c in codes for tail in ['Lesson.ts','Authored.json']]+['src/pages/TextbookUnitPage.tsx','src/components/textbook/GuidedMathReadingFlow.tsx','src/domain/textbook.ts','src/data/textbook/math/numbers/newBatchCoverage.test.ts','src/data/textbook/math/numbers/numbersNextBatch.test.ts','src/data/textbook/math/numbers/firstSectionTeaching.test.tsx','src/review/reviewTargets.test.ts',str(B.relative_to(R))+'/']
blocks=[]
for i,c in enumerate(codes):
 sources=[f'src/data/textbook/math/numbers/{c}Lesson.ts','src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx','src/components/textbook/GuidedMathReadingFlow.tsx',str((B/f'evidence/{c.upper()}_SOURCE_INDEX.json').relative_to(R))]
 sources += [f['sourcePath'] for f in load('DISPLAY_SPEC.json')['figures'] if f['id'].startswith(c+'-')]
 blocks.append(dict(id=c,sources=sources,release_unit=c,change_facets=['math','design','render'],node_refs=[n['id'] for n in load(c.upper()+'_IR.json')['nodes']],content_design_hash=load(f'evidence/{c.upper()}_VERIFY-IR.json')['irHash'],depends_on_blocks=[codes[i-1]] if i else [],fact_dependencies=['n11'] if c=='n12' else []))
inputs=['PROPOSAL.md','DISPLAY_SPEC.json']+[c.upper()+tail for c in codes for tail in ['_IR.json','_NODE_DESIGN.md','_NODE_DESIGN.json']];frozen={p:hashlib.sha256((B/p).read_bytes()).hexdigest() for p in inputs};write('DESIGN_INPUTS.json',frozen)
allpaths=list(dict.fromkeys(p for b in blocks for p in b['sources']));proposal_hash=frozen['PROPOSAL.md']
plan=dict(work_id=w,profile='material',command='CMD-WORK-001',workflow_version='production/2',subject='math',mode='textbook',source_sha='fa0eff271a97940fad08d83960ae50faeabc81b9',source_manifest=manifest(R,allpaths),rules=manifest(R,rules),proposal=dict(id=w+'/P-001',hash=proposal_hash,contentDesignHash=digest(frozen)),design_inputs=frozen,scope=dict(paths=scope,preserve=protected),protected_manifest=manifest(R,protected),blocks=blocks,release_units=[dict(id=c,block_ids=[c],review_route='/learning/textbook/math-numbers-expressions-'+c) for c in codes],simulation=False)
write('WORKFLOW_PLAN.json',plan)
if not any(e['work']==w and e['kind']=='opened' for e in rt.store.events()):
 rt.open(plan);rt.production_context(w,dict(corpusHash=corpus['hash'],modelHash=model['modelHash'],rulesHash=digest(plan['rules']),featureSchema='learner-visible-json/2'))
else:
 assert rt.state(w)['plan']['proposal']==plan['proposal'],'design changed; explicit revise needed'
 current=rt.state(w).get('production_context',{})
 if current.get('corpusHash')!=corpus['hash'] or current.get('modelHash')!=model['modelHash']:
  rt.production_context(w,dict(corpusHash=corpus['hash'],modelHash=model['modelHash'],rulesHash=digest(plan['rules']),featureSchema='learner-visible-json/2'))
ev=[]
for p in ['PROPOSAL.md','DISPLAY_SPEC.json','evidence/PROPOSAL_CHECKS.json','evidence/MATH_CHECK.json','evidence/MATH_RENDER_CHECK.json']+[c.upper()+'_NODE_DESIGN.json' for c in codes]+[f'evidence/{c.upper()}_CURRENT.json' for c in codes]:
 rel=str((B/p).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=rel,sha256=manifest(R,[rel])[rel]),source_ref='exact original source and bounded full design',verification_level='local_execution'))
dispositions=[]
for case in corpus['cases']:
 dim=case['dimension'];reason={'operation_order':'NE02-q08-squaresとN12検算は左計算→右計算→比較、別の代入は別行へ。','factor_grouping':'NE02の平方・分子の和・N11の分数の分子/右辺全体・N12の20-xを完全な操作対象として括弧へ。','overall_material_acceptance':'他単元の全体受入をこの3単元や個別観点の合格labelへ流用しない。'}.get(dim,'本文の目的・既習の出所・条件付き前結果・意味付きの式・黒字概念・math/text区分を全nodeへ適用し、元事例の固有数値は転記しない。')
 dispositions.append(dict(id=case['id'],dimension=dim,disposition='APPLY',reason=reason))
write('CASE_DISPOSITIONS.json',dict(corpusHash=corpus['hash'],modelHash=model['modelHash'],modelStatus='OFFLINE_ONLY',classifierInferenceUsed=False,cases=dispositions))
for nid in ['S00_RECOVER','S01_ROUTE']:
 if nid not in rt.state(w)['results']:rt.execute(w,nid)
def submit(c,kind,inputs,fields,review):
 nid=kind+'@'+c;s=rt.state(w)
 if nid in s['results'] and rt.node_status(s,__import__('definitions').instantiate(s['plan'])[nid])=='PASSED':return
 if nid in s['claims']:
  from capabilities import run_capability
  claim=s['claims'][nid];node=rt.task(w,nid)['node'];bound=[e['payload']['receipt'] for e in rt.store.events() if e['work']==w and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']];refs=[]
  for cap in node['capability_requests']:
   good=[r for r in bound if rt.store.get(r)['capability']==cap and rt.store.get(rt.store.get(r)['output']).get('status') in ('PASS','NEEDS_AI_REVIEW')];refs.append(good[-1] if good else run_capability(rt,w,node,cap,inputs[cap]))
  job=dict(node=nid,claimToken=claim['token'],receipts=refs)
 else:job=run_code(rt,w,inputs)
 assert job['node']==nid,(job['node'],nid)
 req=ai_request(rt,w,nid)
 if kind=='R03_IMPACT':
  for row in fields['impact_rows']:row['phase']=req['task']['node']['phase']
 outputs={rt.store.get(r)['capability']:rt.store.get(rt.store.get(r)['output']) for r in job['receipts']};assert all(v['status'] in ('PASS','NEEDS_AI_REVIEW') for v in outputs.values()),outputs
 if 'math.solve' in inputs:fields.update(proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False)
 rt.submit(w,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=dispositions,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-source-and-novice-review',evidence=review+' Same-assistant review, not independent second AI. No learner implementation, public deployment, browser geometry or human acceptance asserted.'),**fields))
 write(f'evidence/{c.upper()}_{kind}_RESULT.json',dict(node=nid,status='PASS_BOUNDED',outputs={k:v['status'] for k,v in outputs.items()},review=review,receiptArtifacts=job['receipts']))
impact=[dict(originFinding='three legacy lessons lack current semantic flow or contain bundled reasoning',rootCauseSignature='guided-conditions-equivalence-choice-display',artifact=p,version=plan['source_sha'],approvedCreationWork='W-MATH-003 and prior approved local corrections retained',block_id=b['id'],evidence_refs=ev,status='AFFECTED' if p.endswith('Lesson.ts') or p in ['src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx','src/components/textbook/GuidedMathReadingFlow.tsx'] else 'NOT-AFFECTED',phase='pre-design',resolution='bounded3-unit proposal; optional reader branch for new units only; existing authored lessons and engine protected') for b in blocks for p in b['sources']]
write('IMPACT_LEDGER.json',dict(phase='pre-design',rows=impact,unknowns=[]))
for c in codes:
 U=c.upper();ir=load(U+'_IR.json');legacy=load(f'evidence/{U}_LEGACY_PROJECTION.json');source=load(f'evidence/{U}_SOURCE_INDEX.json');argument=load(U+'_COMPLETE_SOLUTION.json')
 submit(c,'R01_CAPTURE',{'source.fixed':{},'feedback.capture':{}},dict(complaint='本人のNE02/N11/N12着手依頼を受け、N09/N10で確定した基準と現教材の差を全件診断。AI発見を本人の否定へ変換しない。',before_evidence=[f'evidence/{U}_CURRENT.json',f'evidence/{U}_SOURCE_INDEX.json'],reproduction='原Wordの全108blockと現readingFlow全件を照合。数式/文章/元図/既存の小操作を保存して不足を分解。DOMの検証とは区別する。',target_versions=dict(learner=plan['source_sha'],tools='058c4ea32474b563487292b583f7a01df4f9c4f1')),'Original source and all current teaching blocks inspected; no user-negative label fabricated.')
 submit(c,'R02_CAUSE',{'case.retrieve':{'python':'/tmp/kyotsu-n07-ml-20261025/bin/python','request':dict(cache='/tmp/kyotsu-n07-encoder-20261025',encoder=dict(local_only=True),query=U+' 操作の理由 等式と条件の区別 全体の括弧 前結果 独立した計算 比較 数式描画',cases=corpus['cases'],scope=dict(subject='math',mode='textbook'))},'knowledge.ledger':{'symbols':[dict(id=f,definitionRef='原Wordまたは既承認N08/N09/N10・N11で導入済みの条件を本文で明示',scope=c) for f in ir['initialFacts']]},'math.solve':argument,'math.verify':argument,'ir.verify':legacy,'source.audit':dict(coverage=legacy['coverage'],sourceBlocks=source['blocks'],candidate=legacy),'novice.audit':dict(ir=legacy)},dict(symptoms=['旧readerでは現在の段階/前結果/履歴の意味属性が不足','平方・符号・候補条件や端点検算を一つの解答へ束ねる箇所がある','数式を含む旧plain textと長い選択肢の複数行化が未対応'],confirmed_causes=['旧flowに条件付きresult参照がない','元問の複数操作を最終キーへまとめた箇所が残る','現readerのformula型選択肢は一部でsemanticDisplayを迂回する','新規途中回答を旧完了へ足す移行は未実装'],hypotheses=[],missing_learning_actions=['候補を作るための条件を対応させる','元の式で符号や端点を検算する','同時条件・整数条件へ戻る','計算と比較を別の段階で行う'],root_cause_signatures=['bundled-reasoning','missing-conditional-results','canonical-key-render-bypass','revision-preservation']),'Legacy projection is prompt/grading only; full original prose reviewed directly. Matching sum/product is a sufficient construction, not uniqueness of all real candidate pairs. Inequality transformations never use false equality.')
 submit(c,'R03_IMPACT',{'impact.inventory':{}},dict(impact_rows=impact,source_inventory=allpaths,unknowns=[]),'All3 units and shared consumer/migration included; accepted first-title/N07/N08/N09/N10 and original5 image hashes protected.')
 ds=load(U+'_NODE_DESIGN.json')['nodes'];solution=[dict(id=n['id'],inputFacts=n['requires'],outputFacts=[n['resultId']],goal=n['goal'],operation=dict(kind=n['action'],targets=n['sourceRefs'],nextUseIds=[]),basisRefs=n['sourceRefs']) for n in ds];teaching=dict(solution=solution,knowledge=ir['initialFacts'],options=dict(budget=1))
 figs=[]
 for f in load('DISPLAY_SPEC.json')['figures']:
  if not f['id'].startswith(c+'-'):continue
  image=R/f['sourcePath'];figs.append(dict(id=f['id'],purpose='原数直線で確定した範囲または位置を読み、条件へ戻る',howToRead='端点の白丸/黒丸と共通縮尺、回答後の対象範囲を照合',sourceRef={'n11-f01':'word-p-000477','n11-f02':'word-p-000503','n12-f01':'word-p-000522','n12-f02':'word-p-000535','n12-f03':'word-p-000553'}[f['id']],visibleWhen=f['gate'],sourcePath=f['sourcePath'],contentHash=hashlib.sha256(base64.b64encode(image.read_bytes())).hexdigest()))
 figureInput=dict(figures=figs) if figs else dict(figures=[],noFigureReason='NE02は平方の展開との式対応が中心。原図0枚で追加図を必要としない。')
 submit(c,'R04_PROPOSAL',{'math.solve':argument,'math.verify':argument,'teaching.plan':teaching,'step.plan':teaching,'blank.plan':dict(nodes=ir['nodes']),'prose.compose':ir,'text.verify':ir,'figure.verify':figureInput,'ir.verify':ir,'source.audit':dict(coverage=ir['coverage'],sourceBlocks=source['blocks'],candidate=ir),'novice.audit':dict(ir=ir)},dict(before_after=['NE02:12→30回答/33node','N11:31→39回答/47node','N12:35→46回答/49node','原108block/78採点ID/300choiceキー保持、全115回答の各候補の具体表示'],protected_scope=protected,patch_plan=['exact frozen11 inputs validate before limited materialization','existing shared reader optional semantic choice branch for new3 units only','three authored JSON/adapters and old-first revision migrations','per-unit internal QA then existing public app directly'],verification_plan=['16 exact identities,6 inequality sets, source coverage, composed KaTeX templates','all115 answers/everywrong choice,4 widths, numbering, context/history/reload','actual old NE02v1,N11v1-v10,N12v1-v3 saves; original 5 figures gated','protected accepted unit regression and exact-source real hosted review'],proposal_hash=proposal_hash,proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False),'All129 node copies,115 cognitive blanks and option mappings reviewed. Code found literal answer exposure and unbalanced template fragment checks during proposal preparation; corrected copy and composed-template verification without weakening central validators. Every independent calculation stays separate; every operation has a purpose and object; prior conditions are explicit.')
render(rt,w,B/'generated');nxt=rt.next(w);assert nxt['task']['node']['stage_kind']=='R05_APPROVAL',nxt
write('evidence/RUNTIME_CHECKPOINT.json',dict(status='AWAITING_CONCRETE_DESIGN_APPROVAL',next=nxt,work=w,simulation=False,sourceSHA=plan['source_sha'],sharedStore='W-MATH-032/runtime',corpusCases=len(corpus['cases']),learnerImplementation=False,publicDeployment=False))
print(json.dumps(dict(work=w,next=nxt['task']['node']['id'],corpusCases=len(corpus['cases']),status='AWAITING_CONCRETE_DESIGN_APPROVAL')))
