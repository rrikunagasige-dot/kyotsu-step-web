"""Record actual source/cause/impact work; deliberately stop before R04 design."""
from pathlib import Path
import sys,json,hashlib,shutil
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-047-n1112-guided-review')]
from restore_native_snapshots import restore
restore()
from runtime import Runtime
from runner import run_code
from contracts import manifest
from store import digest
from views import render
from production import ai_request
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-048'
def load(p):return json.loads((B/p).read_text())
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
for c in ['N13','N14']:
 for tail in ['LEGACY_PROJECTION','LEGACY_VERIFY_IR','LEGACY_COMPILE_IR','LEGACY_COMPILE_IR_INITIAL','LEGACY_WARNING_RESOLUTIONS']:
  p=Path('/tmp/'+c+'_'+tail+'.json')
  if p.exists():shutil.copyfile(p,B/'evidence'/p.name)
rawDiagnostic=Path('/tmp/n1314-legacy-code-b.json')
if rawDiagnostic.exists():shutil.copyfile(rawDiagnostic,B/'evidence/LEGACY_DIAGNOSTIC_CODE_B.json')
else:assert (B/'evidence/LEGACY_DIAGNOSTIC_CODE_B.json').exists()
rules=['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/TEAM_POLICY.json','governance/REVIEW_POLICY.json','subjects/mathematics/textbook/SPEC.md','workflow/INTEGRATION_RUNBOOK.md']
prefix=str(B.relative_to(R))
sources=['src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx','src/data/textbook/math/numbers/newBatchGuidedSteps.ts','src/data/textbook/math/numbers/reviewLessonHelpers.ts']
blocks=[dict(id=c,sources=[f'src/data/textbook/math/numbers/{c}Lesson.ts',*sources,prefix+'/evidence/'+c.upper()+'_SOURCE_INDEX.json'],release_unit=c,change_facets=['design','render'],depends_on_blocks=['n13']if c=='n14'else[],fact_dependencies=[])for c in ['n13','n14']]
paths=sorted({p for b in blocks for p in b['sources']})
required=json.loads((R/'work/items/W-MATH-047-n1112-guided-review/G3_PUBLISHER_DRAFT/w047-release-contract.json').read_text())['required']
protected={p:h for p,h in required.items()if p not in ['src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx'] and not p.endswith(('n13Lesson.ts','n14Lesson.ts'))}
protected.update(manifest(R,['public/assets/math/textbook/numbers/'+n+'.png'for n in ['n13-f01','n13-f02','n14-f01']]))
proposalHash=hashlib.sha256((B/'PROPOSAL.md').read_bytes()).hexdigest()
plan=dict(work_id=w,profile='material',command='CMD-WORK-001',workflow_version='production/2',subject='math',mode='textbook',simulation=False,source_sha='f129ba78e496f0ccbce917c762357a81b92b0a2c',source_manifest=manifest(R,paths),rules=manifest(R,rules),proposal={'id':'P-W048-DRAFT-01','hash':proposalHash},scope={'paths':[prefix+'/',*['src/data/textbook/math/numbers/'+c+'Lesson.ts'for c in ['n13','n14']],'src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx'],'preserve':list(protected),'prohibit':['G3_HOST']},protected_manifest=protected,blocks=blocks,release_units=[{'id':c,'block_ids':[c],'review_route':'/learning/textbook/math-numbers-expressions-'+c}for c in ['n13','n14']],agent_team=json.loads((R/'governance/TEAM_POLICY.json').read_text())['default_policy'])
write('WORKFLOW_PLAN.json',plan)
corpus=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').read_text())['cases']
if not any(e['work']==w and e['kind']=='opened'for e in r.store.events()):
 assert r.next('W-MATH-047')['status']=='DONE';r.open(plan)
else:assert r.state(w)['plan']['proposal']==plan['proposal']
if not r.state(w).get('production_context'):
 model=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/MODEL_RESULT_CORRECTED.json').read_text())
 r.production_context(w,{'corpusHash':digest(corpus),'modelHash':model['modelHash'],'rulesHash':digest(plan['rules']),'featureSchema':'learner-visible-json/2'})
for nid in ['S00_RECOVER','S01_ROUTE']:
 if nid not in r.state(w)['results']:r.execute(w,nid)
refs=[]
for p in ['SOURCE_PROVENANCE.json','FINDINGS.md','PROPOSAL.md','evidence/SOURCE_WORKFLOW_A.json','evidence/SOURCE_AUDIT_B.json','evidence/CANDIDATE_CHECK.json','evidence/MATH_CHECK.json','evidence/LEGACY_DIAGNOSTIC_CODE_B.json']:
 f=B/p;refs.append(r.evidence(w,'file',{'path':str(f.relative_to(R)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()},source_ref='Actual source-first investigation and bounded candidate/diagnostic checks; not implementation approval',verification_level='local_execution'))
def submit(nid,inputs,fields):
 if nid in r.state(w)['results']:return
 if nid not in r.state(w)['claims']:assert r.next(w)['task']['node']['id']==nid
 pending=B/'evidence'/(nid.replace('@','_')+'_RESULT.json')
 if nid in r.state(w)['claims']:
  saved=json.loads(pending.read_text());claim=r.state(w)['claims'][nid]
  job={'node':nid,'claimToken':claim['token'],'receipts':saved['capability_receipts'],'aiRequest':ai_request(r,w,nid)}
 else:job=run_code(r,w,inputs)
 outputs={r.store.get(x)['capability']:r.store.get(r.store.get(x)['output'])for x in job['receipts']}
 assert all(v['status']in ['PASS','NEEDS_AI_REVIEW']for v in outputs.values()),outputs
 req=job['aiRequest'];result=dict(verdict='PASS',evidence_refs=refs,capability_receipts=job['receipts'],aiReview={'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'M integrating actual A/B source-first observations','evidence':refs},**fields)
 if nid.startswith('R02'):
  reasons={'prerequisite_missing':'N08の距離と絶対値の場合分け、N11の同じ加減を必要時に明示する。','orphan_output':'追加の数値はxの位置・分岐方程式・元問の全解に結ぶ。','unmotivated_operation':'Q04の+1、Q07の−2は左辺の定数を打ち消す目的と両辺への同じ操作として扱う。','broken_derivation':'Q04/Q07の正負二枝、Q09の0/負を別判断へ分け、元問へ戻る。','term_semantics_missing':'Xはx−1全体の置換。距離の意味とORの意味を一般形の前後で明示する。','math_render_omission':'追加式・全選択肢を結合KaTeXで検査し、283件の現候補結果へ結ぶ。','layout_discomfort':'等号の変形と独立した正負枝を混同せず、R04で行・番号・軸を別に設計する。','operation_order':'Q04/Q07は正の枝→負の枝→全解、Q09は0→負の順。独立計算を一択の結論で代行しない。','factor_grouping':'絶対値は中身全体へ掛かる。x−1・x+2と三辺全体への操作を保持する。'}
  result['case_dispositions']=[{'id':c['id'],'disposition':'OUT_OF_SCOPE'if c['dimension']in ['overall_material_acceptance','layout_style_rejection']or c['id']in ['n07-layout-positive','first-title-layout-positive']else'APPLY','reason':'他単元・旧版の受入や見た目の肯定は今回のN13/N14の受入・品質labelへ移さない。'if c['dimension']in ['overall_material_acceptance','layout_style_rejection']or c['id']in ['n07-layout-positive','first-title-layout-positive']else reasons[c['dimension']]}for c in corpus]
 write('evidence/'+nid.replace('@','_')+'_RESULT.json',result);r.submit(w,nid,job['claimToken'],result);print('Recorded '+nid,flush=True)
submit('R01_CAPTURE@n13',{'source.fixed':{},'feedback.capture':{}},{'complaint':'本人のN13/N14継続依頼に従い現稿を原典・既承認理念と照合。AI発見を本人の否定評価へ変換しない。','before_evidence':['evidence/N13_SOURCE_INDEX.json','evidence/N13_CURRENT.json','evidence/SOURCE_AUDIT_B.json'],'reproduction':'母Word全79block・現稿全129block・旧50採点をM/A/Bが静的照合。新ブラウザ操作の再現ではない。','target_versions':{'appSource':plan['source_sha'],'mainPublisher':'6cd11dc1e65810281ed897f865eed3e52b974992','word':load('SOURCE_PROVENANCE.json')['sha256']}})
legacy=load('evidence/N13_LEGACY_PROJECTION.json');source=load('evidence/N13_SOURCE_INDEX.json')
submit('R02_CAUSE@n13',{'case.retrieve':{'python':sys.executable,'request':{'cache':'/tmp/n1314-encoder','encoder':{'local_only':True},'query':'絶対値 二枝 独立計算 距離ゼロ 負の場合 前結果 ヒント先出し 本文接続','cases':corpus,'scope':{'subject':'math','mode':'textbook'}}},'ir.verify':legacy,'source.audit':{'coverage':legacy['coverage'],'sourceBlocks':source['blocks'],'candidate':legacy},'novice.audit':{'ir':legacy}},{'symptoms':['Q04/Q07の独立した二枝の計算が最終pairへ束ねられる','Q09の0/負の二判断が一つへ束ねられ、Q06/Q09ヒントにも具体結論がある','直前の距離5から新しい距離4への接続誤記と一般形の位置が不十分'],'confirmed_causes':['原問単位一択の旧helper構造が複数操作をまとめる','ヒントが対象/既習の支援より具体値の完成を優先する','例題切替・性質正式化・無番号本文の対応が不十分'],'hypotheses':[],'missing_learning_actions':['二本を別に解き、元問の全解へ戻る','距離0と負の要求を別に判定し対応させる'],'root_cause_signatures':['bundled-independent-decisions','premature-answer-in-prose-title-hint','missing-source-bridge'],'boundedCodeScope':'Legacy IR checks old grading contracts only; full source/prose meaning reviewed in actual A/B reports. No finished R04 IR, new UI, classifier inference, training or student quality labels asserted.'})
impact=[]
for b in blocks:
 for path in b['sources']:
  impact.append(dict(originFinding='W048 source-first investigation',rootCauseSignature='bundled-independent-decisions / premature-answer-in-prose-title-hint / missing-source-bridge',artifact=path,version=plan['source_sha'],approvedCreationWork='W-MATH-003 and W-MATH-014..023 scoped fixes retained',block_id=b['id'],evidence_refs=refs,status='AFFECTED'if path.endswith(('n13Lesson.ts','n14Lesson.ts'))else'NOT-AFFECTED',phase='pre-design',reason='Source indexes are evidence; shared helpers and consumers remain unchanged. Both N13 and N14 findings retained in the same scoped repair proposal. Full-reader migration is a later explicit R04 decision, not an implemented change.'))
write('IMPACT_LEDGER.json',{'phase':'pre-design','rows':impact,'limits':'Current scoped source/cause sweep. N01–N12/NE extras protected by fixed hashes; not an assertion that every prior lesson has no independent teaching improvement.'})
submit('R03_IMPACT@n13',{'impact.inventory':{}},{'impact_rows':impact,'source_inventory':paths,'unknowns':[],'scope':'Two affected existing lesson leaves and their unchanged source/consumer paths. Candidate display design remains R04 work; no related child defect or source change is declared fixed by this pre-design sweep.'})
nxt=r.next(w);assert nxt['task']['node']['id']=='R04_PROPOSAL@n13',nxt
write('evidence/NATIVE_CHECKPOINT.json',{'work':w,'next':nxt,'status':'R04_FULL_DESIGN_PENDING','nativeCompleted':['S00_RECOVER','S01_ROUTE','R01_CAPTURE@n13','R02_CAUSE@n13','R03_IMPACT@n13'],'N14':'Original/source/candidate investigation complete, formal nodes follow existing graph after N13 R04; not marked passed early.','implemented':False,'proposalApprovalRequested':False})
render(r,w,B/'generated');print('Next R04_PROPOSAL@n13: full IR/display map and native team review pending',flush=True)
