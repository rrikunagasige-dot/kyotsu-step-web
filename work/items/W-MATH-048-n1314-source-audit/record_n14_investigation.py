"""Root records N14 source/cause/impact at the existing native sequence."""
exec((__import__('pathlib').Path(__file__).parent/'record_r04.py').read_text().split("mode=sys.argv[1]")[0])
from runner import run_code
refs=evidence(['SOURCE_PROVENANCE.json','evidence/N14_SOURCE_INDEX.json','evidence/N14_CURRENT.json','evidence/SOURCE_AUDIT_B.json','evidence/SOURCE_WORKFLOW_A.json','PLANNED_IMPACT.json','P001_FINAL.md','evidence/MATH_CHECK.json'])
corpus=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').read_text())['cases']
legacy=load('evidence/N14_LEGACY_PROJECTION.json');source=load('evidence/N14_SOURCE_INDEX.json')
capture=load('evidence/R01_CAPTURE_n13_RESULT.json');cause=load('evidence/R02_CAUSE_n13_RESULT.json')
for nid,inputs,fields in [
 ('R01_CAPTURE@n14',{'source.fixed':{},'feedback.capture':{}},{'complaint':'本人のN13/N14続行依頼を受けた原資料監査。N14の境界後の領域先出しと複合判断をAIが発見。本人の拒否/品質評価とはしない。','before_evidence':['evidence/N14_SOURCE_INDEX.json','evidence/N14_CURRENT.json'],'reproduction':'原Word46block/原問16/現稿38採点/原図1をsource-first静的照合。実ブラウザ再現とはしない。','target_versions':capture['target_versions']}),
 ('R02_CAUSE@n14',{'case.retrieve':{'python':sys.executable,'request':{'cache':'/tmp/n1314-encoder','encoder':{'local_only':True},'query':'絶対値 不等式 境界 領域 端点 内外 ヒント先出し 三辺操作 原典 本文接続','cases':corpus,'scope':{'subject':'math','mode':'textbook'}}},'ir.verify':legacy,'source.audit':{'coverage':legacy['coverage'],'sourceBlocks':source['blocks'],'candidate':legacy},'novice.audit':{'ir':legacy}},{'symptoms':['見出しとQ02後の二点の間が未判断のQ03の答えを先出し','Q03/Q05の内外と端点がまとめられ、Q05の境界判断も学生に独立させる必要','章結びの注目文字と次章への用途が旧現稿で薄い'],'confirmed_causes':['原問単位の一択へ境界・領域・端点をまとめた','解説文/ヒントの可視時点と未解決判断の境界が不十分','原典の無番号本文が採点表に入らず接続が欠落'],'hypotheses':[],'missing_learning_actions':['領域を選び、その後元の不等号から端点を判断する','外側の場合にも境界二点を先に特定する'],'root_cause_signatures':['bundled-independent-decisions','premature-answer-in-prose-title-hint','missing-source-bridge'],'case_dispositions':cause['case_dispositions'],'boundedCodeScope':'Legacy diagnostic IR checks baseline grade contracts only; full IR/row consumer checked separately for R04. No app acceptance/classifier inference/training claimed.'}),
 ('R03_IMPACT@n14',{'impact.inventory':{}},{'impact_rows':load('PLANNED_IMPACT.json')['rows'],'source_inventory':list(r.state(w)['plan']['source_manifest']),'unknowns':[],'scope':'Two lesson leaves affected, revision-scoped Page/domain planned support affected, unchanged helpers/source indexes protected. Original R03@n13 current-source cause scope preserved; planned impact supplement explicitly recorded for both units.'})]:
 if nid in r.state(w)['results']:continue
 assert r.next(w)['task']['node']['id']==nid,r.next(w)
 job=run_code(r,w,inputs);req=job['aiRequest']
 result=dict(verdict='PASS',evidence_refs=refs,capability_receipts=job['receipts'],aiReview={'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'M integrating original source-first A/B observations and R04 full-copy evidence','evidence':refs},**fields)
 for row in result.get('impact_rows',[]):row['evidence_refs']=refs
 write('evidence/'+nid.replace('@','_')+'_RESULT.json',result);r.submit(w,nid,job['claimToken'],result);print('Submitted '+nid,flush=True)
render(r,w,B/'generated');print('NEXT '+r.next(w)['task']['node']['id'],flush=True)
