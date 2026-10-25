"""Record actual analysis via the existing correction workflow; stop on unsupported math."""
from pathlib import Path
import json,sys,subprocess
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from contracts import manifest,sha
from store import digest
from runner import run_code
from production import ai_request
from views import render
from requests import intake
base=str(B.relative_to(R))+'/';W='W-MATH-037'
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R)
def load(path):return json.loads((R/path).read_text())
def write(name,value):(B/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
if any(e['work']==W and e['kind']=='opened' for e in rt.store.events()):raise RuntimeError('Work exists. Resume from stored claim/results rather than repeating intake.')
paths=['src/data/textbook/math/numbers/n08Authored.json','src/data/textbook/math/numbers/n08Lesson.ts','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css','src/pages/TextbookUnitPage.tsx','src/domain/textbook.ts','public/assets/math/textbook/numbers/n08-f01.png']
protected=['src/data/textbook/math/numbers/'+n+'Authored.json' for n in ['n07','n09','n10','n11','n12']]
paths+=protected
proposalHash=sha(B/'PROPOSAL.md');designHash=sha(B/'NODE_DESIGN.json')
plan={'work_id':W,'workflow_version':'production/2','solution_pipeline':'solution/1','profile':'material','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip(),'source_manifest':manifest(R,paths),'rules':manifest(R,['AGENTS.md','governance/CONSTITUTION.md','governance/COMMAND_WORDS.md','governance/REVIEW_POLICY.json','tools/textbook/SOLUTION_PIPELINE.md']),'proposal':{'id':'P-001','hash':proposalHash,'contentDesignHash':designHash},'scope':{'paths':['src/data/textbook/math/numbers/n08Authored.json','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css','src/pages/TextbookUnitPage.tsx','src/domain/textbook.ts','src/domain/solutionReading.ts','tools/textbook/',base],'preserve':protected+['public/']},'blocks':[{'id':'n08','sources':paths[:7],'change_facets':['math','design','render'],'release_unit':'n08'}],'release_units':[{'id':'n08','block_ids':['n08'],'review_route':'/learning/textbook/math-numbers-expressions-n08'}],'simulation':False}
write('WORKFLOW_PLAN.json',plan);rt.open(plan)
intake(rt,W,{'id':'n08-workflow-trial-20261026','kind':'correction','quote':'一旦試しに不等式N08の修正をやってみよう','source_ref':'current-conversation:user-trial-request; target clarified N08 absolute value','version':plan['source_sha']})
corpus=load('work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json')
rt.production_context(W,{'corpusHash':corpus['hash'],'modelHash':None,'rulesHash':digest(plan['rules']),'featureSchema':'learner-visible-json/2'})
evidence=[]
for name in ['FINDINGS.md','NODE_INVENTORY.json','ENGINE_SCOPE_CHECK.json','MATH_FEASIBILITY.json','BASELINE_IR_BINDING.json','evidence/BASELINE_UI.json','HTML_MATH_LOSS.json','RESEARCH_CONTRACT_GAP.json','PROPOSAL.md','NODE_DESIGN.json']:
 path=base+name;evidence.append(rt.evidence(W,'file',{'path':path,'sha256':sha(R/path)},source_ref='local-execution:N08 baseline, source and proposal analysis',verification_level='local_execution'))
rt.execute(W,'S00_RECOVER');rt.execute(W,'S01_ROUTE')
def submit(inputs,fields,review):
 job=run_code(rt,W,inputs);request=job['aiRequest']
 result={**fields,'evidence_refs':evidence,'capability_receipts':job['receipts'],'aiReview':{'requestHash':request['requestHash'],'inputHash':request['task']['input_hash'],'reviewer':'current-assistant-source-and-visible-state-review','evidence':review}}
 rt.submit(W,job['node'],job['claimToken'],result)
 write(job['node'].replace('@','-')+'.json',{'node':job['node'],'result':result,'codeOutputs':[rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']]})
submit({'source.fixed':{},'feedback.capture':{}},{'verdict':'PASS','complaint':'本人は新しい制作基盤をN08で試す修正を依頼した。対象確認でN08絶対値を選択。新しい否定品質評価としては扱わない。','before_evidence':['BASELINE_UI:320/390px全12stage・31正答ずつ','NODE_INVENTORY:36nodes/31answers','BASELINE_IR_BINDING:compiled semantic equality true'],'reproduction':'同じ例題Q05〜Q07で途中目標が元問欄へ置換され、definition afterに制作者向けの文が出る。実DOMと画像で照合。','target_versions':{'sourceSHA':plan['source_sha'],'N08Revision':4,'publishedSource':'397788f1715b96459032a6647d6fbe772004a7b3'}},'今回の依頼・対象確認と、既存N08の受入を区別した。正本hashと全正答操作を照合。既存の良い説明・枠・図・履歴を保護する。')
legacy=load('work/items/W-MATH-033-n08-absolute-value/CANDIDATE_IR.json');argument=load('work/items/W-MATH-033-n08-absolute-value/COMPLETE_SOLUTION.json')
inputs={'case.retrieve':{'request':{'cache':'/workspace/scratch/f79c5816761e/n08-trial-model-cache','query':'N08 一問の流れ 絶対値 距離 符号 両辺操作 式生成 同値と目的','cases':corpus['cases'],'scope':{'subject':'math','mode':'textbook'},'encoder':{'local_only':True}}},'knowledge.ledger':{'symbols':[{'id':f,'definitionRef':'W033 COMPLETE_SOLUTION and current NODE_INVENTORY','scope':'N08 real numbers, distance, sign, supplied constants'} for f in legacy['initialFacts']]},'math.verify':argument,'math.solve':argument,'ir.verify':legacy,'source.audit':{'coverage':legacy['coverage'],'sourceBlocks':legacy['sourceBlocks'],'candidate':legacy},'novice.audit':{'ir':legacy},'solution.validate':{'graph':load(base+'UNSUPPORTED_ABS_GRAPH.json')}}
submit(inputs,{'verdict':'UNVERIFIED','symptoms':['元の問題が途中目標へ置換','制作者向け本文が見える','両辺操作を式として組み立てる回答がない','新しい基盤のAbs/条件/場合分けが未対応','研究取込で数式と設計属性が欠落'],'confirmed_causes':['N08 problem context is keyed only by stage','learner after contains authoring-policy prose','operation and simplification are compressed in source template','new closed AST has no Abs/sqrt/pi constructors','research text projection and imported output omit meaningful fields'],'hypotheses':[],'missing_learning_actions':['a−0の距離式の生成','両辺へ同じ操作を作る','同じ例題へ局所結果を戻す'],'root_cause_signatures':['stage-fragmented-whole-problem','authoring-meta-in-learner-prose','missing-operation-generation','unsupported-conditional-math-adapter','reference-semantic-loss'],'unknowns':['Production solution adapter cannot represent absolute-value expressions or condition/case joins. Feasibility probe does not upgrade its receipt.'],'lessonReadiness':'CURRENT_ACCEPTED_VERSION_PRESERVED; PROPOSED_REVISION_NOT_BUILT','proofStatus':'AI_ARGUMENT_REVIEWED','formalProof':False},'旧承認IRの再compileが現行semanticへ一致することを確認。既存argumentと17の別実験を読み直し、現行数学の誤りとはしなかった。新solution.validateのFAILは表現未対応であり、全体PASSへ昇格しない。R02をUNVERIFIEDとして保持し、技術拡張と全node修正の具体案を別途準備した。')
render(rt,W,B/'generated');write('ANALYSIS_CHECKPOINT.json',{'next':rt.next(W),'proposalReady':True,'nativeR04Passed':False,'implementationApproved':False,'learnerModified':False,'learningLabelsAdded':0})
print(json.dumps({'next':rt.next(W),'proposalReady':True,'nativeR04Passed':False,'learnerModified':False},ensure_ascii=False))
