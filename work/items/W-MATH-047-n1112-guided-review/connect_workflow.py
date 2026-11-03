"""Bind this real review to the existing shared Runtime; never invent user approval."""
import json,sys,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from contracts import manifest
from store import digest
from runner import run_code
from production import ai_request
from views import render
def read(p):return json.loads((R/p).read_text())
def write(p,v):(B/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
prefix=str(B.relative_to(R))+'/'
rules=['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/TEAM_POLICY.json','docs/MASTER_APP_LESSONS.md','subjects/mathematics/textbook/SPEC.md']
protected=['src/data/textbook/math/numbers/'+c+'ConstructionCompiled.json' for c in ['n09','n10']]+['src/domain/textbook.ts','src/components/textbook/GuidedMathReadingFlow.tsx','src/components/textbook/ConstructionLessonReadingFlow.tsx','src/components/textbook/construction-lesson-reading.css']
blocks=[]
for c in ['n11','n12']:
    paths=['src/data/textbook/math/numbers/'+c+'Authored.json','src/data/textbook/math/numbers/'+c+'Lesson.ts','work/items/W-MATH-036-ne02-n11-n12-guided-design/evidence/'+c.upper()+'_SOURCE_INDEX.json']
    if c=='n11':paths+=['src/data/textbook/math/numbers/n11Transformation.json']
    blocks.append(dict(id=c,sources=paths,release_unit=c,change_facets=['math','design','render'],node_refs=[n['id'] for n in read('src/data/textbook/math/numbers/'+c+'Authored.json')['nodes']]))
sources=list(dict.fromkeys(p for b in blocks for p in b['sources']))
frozen=manifest(R,[prefix+p for p in ['PROPOSAL.md','N11_CANDIDATE_IR.json','N12_CANDIDATE_IR.json','N11_AUDIT_A.json','N12_AUDIT_B.json']])
plan=dict(work_id='W-MATH-047',profile='material',command='CMD-WORK-001',workflow_version='production/2',subject='math',mode='textbook',source_sha='6b439d0d31fcd46708c256ed23a391009ab73164',source_manifest=manifest(R,sources),rules=manifest(R,rules),proposal={'id':'P-W047-01','hash':frozen[prefix+'PROPOSAL.md'],'contentDesignHash':digest(frozen)},design_inputs=frozen,scope={'paths':['src/data/textbook/math/numbers/n11Authored.json','src/data/textbook/math/numbers/n12Authored.json','src/data/textbook/math/numbers/n11Transformation.json',prefix],'preserve':protected},protected_manifest=manifest(R,protected),blocks=blocks,release_units=[{'id':c,'block_ids':[c],'review_route':'/learning/textbook/math-numbers-expressions-'+c}for c in ['n11','n12']],agent_team=read('governance/TEAM_POLICY.json')['default_policy'],simulation=False)
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w=plan['work_id']
if not any(e['work']==w and e['kind']=='opened' for e in rt.store.events()):rt.open(plan)
else:
    oldplan=rt.state(w)['plan']
    # Preserve canonical source/rules and use the existing revision operation, never overwrite events.
    plan['source_manifest']=oldplan['source_manifest'];plan['rules']=oldplan['rules']
    for block,prior in zip(plan['blocks'],oldplan['blocks']):block['sources']=prior['sources']
    protected=list(dict.fromkeys(oldplan['scope']['preserve']+protected))
    if 'src/data/textbook/math/numbers/n11Transformation.json' in protected:protected.remove('src/data/textbook/math/numbers/n11Transformation.json')
    plan['scope']['preserve']=protected;plan['protected_manifest']=manifest(R,protected)
    plan['proposal']['id']='W-MATH-047/P-006'
    if oldplan['proposal']['hash']!=plan['proposal']['hash']:
        assert not rt.state(w)['claims'] and not rt.state(w)['users'],'Unreconciled claim or approval must not be bypassed'
        reconciliation=json.loads((B/'evidence/PLAN_RECONCILIATION.json').read_text())
        reconciliation.update(newProposal=plan['proposal'],preservedSourceManifest=True,preservedRules=True)
        write('evidence/PLAN_REVISION.json',reconciliation)
        rt.revise(w,plan)
    else:
        from graphs import normalized
        assert rt.state(w)['plan']==normalized(plan),'Do not silently change a frozen plan'
write('WORKFLOW_PLAN.json',rt.state(w)['plan'])
corpus=read('work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json');model=read('work/items/W-MATH-035-choice-order-factor-audit/MODEL_RESULT_CORRECTED.json')
if not rt.state(w).get('production_context'):rt.production_context(w,{'corpusHash':corpus['hash'],'modelHash':model['modelHash'],'rulesHash':digest(plan['rules']),'featureSchema':'learner-visible-json/2'})
evidence=[]
for p in ['PROPOSAL.md','N11_AUDIT_A.json','N12_AUDIT_B.json','evidence/CODE_CHECKS.json']:
    rel=prefix+p;evidence.append(rt.evidence(w,'file',{'path':rel,'sha256':manifest(R,[rel])[rel]},source_ref='Current source-bound proposal investigation; not user acceptance',verification_level='local_execution'))
while rt.next(w).get('task',{}).get('node',{}).get('id') in ['S00_RECOVER','S01_ROUTE']:
    rt.execute(w,rt.next(w)['task']['node']['id'])
for c in ['n11','n12']:
    node='R01_CAPTURE@'+c
    state=rt.state(w)
    if node in state['results'] and rt.node_status(state,rt.task(w,node)['node'])=='PASSED':continue
    if rt.next(w).get('task',{}).get('node',{}).get('id')!=node:break
    job=run_code(rt,w,{'source.fixed':{},'feedback.capture':{}});assert job['node']==node,(job['node'],node)
    req=ai_request(rt,w,node)
    rt.submit(w,node,job['claimToken'],{'verdict':'PASS','evidence_refs':evidence,'capability_receipts':job['receipts'],'complaint':'本人のN11/N12着手指示。N09/N10で承認された理念を基準に現行全96nodeを診断する。AI所見を本人の否定評価にしない。','before_evidence':['N11_AUDIT_A.json','N12_AUDIT_B.json'],'reproduction':'現authored semanticの全before/afterと位置付き原文を照合。N11はW038の5/6段階overlayを優先。未回答と回答済みを分ける。','target_versions':{'publishedSource':plan['source_sha'],'n11Revision':11,'n12Revision':4},'aiReview':{'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'M with real A/B source surveys','evidence':'A examined47 N11 nodes; B49 N12 nodes and cross-reviewed. Existing normalized IR compiler binding, coverage and all candidate interaction contracts checked. Actual browser baseline is a separate limited check.'}})
    # The scheduler may require R02 before beginning the other unit. Do not skip it.
    if rt.next(w).get('task',{}).get('node',{}).get('stage_kind')!='R01_CAPTURE':break
render(rt,w,B/'generated');write('evidence/RUNTIME_CHECKPOINT.json',{'simulation':False,'next':rt.next(w),'sourceSHA':plan['source_sha'],'scope':'R01 is bound; R02/R04 results and formal team imports are still required. No approval or product change.'})
print(json.dumps({'work':w,'next':rt.next(w)},ensure_ascii=False))
