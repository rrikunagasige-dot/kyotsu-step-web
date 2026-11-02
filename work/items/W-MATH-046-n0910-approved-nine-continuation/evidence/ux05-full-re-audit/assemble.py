from pathlib import Path
import json,hashlib,gzip,sys
from collections import Counter
root=Path('/workspace/scratch/6ff917b2ec4a/w046-ux05-release-frozen');out=Path('/tmp/w046-re-audit');SOURCE='691d3d160493bf684ca8a31a22476d31d98caeec'
allrows=[];checks=[]
required=['nodeId','verdict','principleRefs','availableGrounds','derivationChain','currentLearnerActions','missingLearnerActions','proseAssessment','evidenceRefs','correctionDirection']
for code,who,total in [('n09','b',41),('n10','a',45)]:
 c=json.loads((root/f'src/data/textbook/math/numbers/{code}ConstructionCompiled.json').read_text());r=json.loads((out/f'{code}-audit-{who}.json').read_text());rows=r['rows'];assert r['sourceSHA']==SOURCE
 assert len(rows)==total and [x['nodeId']for x in rows]==[x['nodeId']for x in c['nodeDesign']]
 assert len({x['nodeId']for x in rows})==total
 for n,row in zip(c['nodeDesign'],rows):
  assert all(k in row and row[k] not in [None,'',[],{}]for k in required),row['nodeId']
  assert row['verdict']in ['PASS','FAIL','UNVERIFIED']
  local=row['userGoalCompliance']['verdict']if code=='n09'else row['verdict']
  prose=row['dimensions']['causalProse']['verdict']if code=='n09'else row['proseAssessment'].get('verdict','SEE_DETAIL')
  allrows.append({'unit':code,'nodeId':n['nodeId'],'stageId':n['stageId'],'automatic':not n['parts'],'partIds':[p['id']for p in n['parts']],'requiredResultRefs':n['requiredResultRefs'],'localLearningAssessment':local,'proseAssessmentStatus':prose,'choiceTypography':'FAIL_SHARED_COMPONENT'if n['parts']else'NO_OWN_CHOICES_NOT_NEWLY_VISUALLY_ACCEPTED','reviewer':who,'detailFile':code+'-audit-'+who+'.json','detailOrdinal':row['ordinal'],'correctionDirection':row['correctionDirection']})
 checks.append({'unit':code,'expected':total,'observed':len(rows),'exactNodeOrderAndIds':True,'allRequiredFieldsPresent':True,'compiledHash':c['compiledHash']})
assert len(allrows)==86;assert sum(r['automatic']for r in allrows)==17
# Existing inventory function is a read-only operation; no Runtime/Store is created.
sys.path.insert(0,str(root/'workflow'));from impact import inventory
inputs=[{'block_id':r['nodeId'],'artifact':f'src/data/textbook/math/numbers/{r["unit"]}ConstructionCompiled.json#{r["nodeId"]}','version':SOURCE,'phase':'post-fix','originFinding':'USER-QA thinking-node / coherent-prose / role-font mismatch','requiresSemanticReview':True}for r in allrows]
raw=inventory({'plan':{'impact_inventory':inputs}},{});assert len(raw)==86
(out/'CODE_INVENTORY.json').write_text(json.dumps({'operation':'workflow.impact.inventory','status':'NEEDS_AI_REVIEW','sourceSHA':SOURCE,'rows':raw,'formalStoreReceipt':False,'coverageIsNotCompliance':True},ensure_ascii=False,indent=2)+'\n')
(out/'COVERAGE_CHECK.json').write_text(json.dumps({'status':'COMPLETE_INPUT_COVERAGE_ONLY','sourceSHA':SOURCE,'checks':checks,'nodes':86,'auto':17,'interactiveNodes':69,'parts':103,'semanticPassInferred':False,'productChanged':False,'formalStoreReceipt':False},ensure_ascii=False,indent=2)+'\n')
(out/'ALL_86.json').write_text(json.dumps({'sourceSHA':SOURCE,'scope':'All 86 frozen N09/N10 node designs, including previous KEEP/AUTO. Node-local learning utility is not whole-lesson/visual acceptance.','overall':'NEEDS-FIX','rows':allrows},ensure_ascii=False,indent=2)+'\n')
for code in ['n09','n10']:
 p=out/(code+'-input.json');(out/(code+'-input.json.gz')).write_bytes(gzip.compress(p.read_bytes(),mtime=0))
# The table directs readers to authored per-node evidence rather than pretending a count is a semantic check.
md=['# 全86設計箇所の原則照合一覧','',f'固定製品source `{SOURCE}`。N09:41 / N10:45、AUTO17/interactive69も全件対象。公開内容は未変更。','', '**現在もNEEDS-FIX。** 学習行為の局所判定と、本文・共通フォント・上流依存の適合は別。PASSの行があっても単元全体が合格したとは扱わない。未確認は未確認として残す。','', '[N09全41詳細](n09-audit-b.json) / [N10全45詳細](n10-audit-a.json) / [N10読取表](n10-audit-a.md) / [工程・理念監視](workflow-monitor-b.md) / [主担当の反証・統合](ROOT_REVIEW.md)','', '|対象|局所学習要求|本文|式内の本人操作と改善方向|','|---|---|---|---|']
for row in allrows:
 direction=str(row['correctionDirection']).replace('|','／').replace('\n',' ')
 md.append('|'+row['nodeId']+'|'+row['localLearningAssessment']+'|'+row['proseAssessmentStatus']+'|'+direction+'|')
(out/'AUDIT_86.md').write_text('\n'.join(md)+'\n')
print('coverage',len(allrows),'AUTO',sum(r['automatic']for r in allrows),'interactive',sum(not r['automatic']for r in allrows))
print('local-learning',dict(Counter(r['localLearningAssessment']for r in allrows)))
