"""Proposal-only deterministic validation. No browser or user acceptance claim."""
import json,subprocess,hashlib,copy
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2]
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def op(name,payload):
 p=subprocess.run(['node','tools/textbook/operations.mjs',name],input=json.dumps(payload),text=True,capture_output=True,cwd=R);d=json.loads(p.stdout);assert p.returncode==0,(name,p.stderr,d);return d
summary={}
for u in ['NE02','N11','N12']:
 ir=json.loads((B/(u+'_IR.json')).read_text());ds=json.loads((B/(u+'_NODE_DESIGN.json')).read_text())['nodes'];src=json.loads((B/f'evidence/{u}_SOURCE_INDEX.json').read_text());cur=json.loads((B/f'evidence/{u}_CURRENT.json').read_text())['unit'];old=cur['sections'][0]['items']
 assert src['status']=='PASS' and src['documentHash']=='93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa'
 for name,payload in [('verify-ir',ir),('compile-ir',ir),('coverage',dict(blocks=src['blocks'],coverage=ir['coverage'],nodes=ir['nodes']))]:
  d=op(name,payload);write(f'evidence/{u}_{name.upper()}.json',d);assert d['status']=='PASS',d
 snap=op('visible-snapshots',dict(ir=ir));write(f'evidence/{u}_VISIBLE_STATES.json',dict(status='PASS',count=len(snap['snapshots']),actualBrowser=False,states=[dict(nodeId=x['nodeId'],knownFacts=x['knownFacts']) for x in snap['snapshots']]))
 byid={n['itemId']:n for n in ds if n.get('itemId')};assert all(q['id'] in byid and byid[q['id']]['answer']==q['answer'] and set(q['choices'])=={byid[q['id']]['answer'],*[x[0] for x in byid[q['id']]['wrong']]} for q in old)
 legacy=copy.deepcopy(ir);legacy['nodes']=[]
 for i,q in enumerate(old):
  ref=next((b['id'] for b in src['blocks'] if b['id'] in byid[q['id']]['sourceRefs']),src['blocks'][0]['id']);nid=q['id'];bid=nid+'-old';slot=nid+'-old-slot';req=[old[i-1]['id']+'-legacy-result'] if i else []
  legacy['nodes'].append(dict(id=nid,problemId=u.lower(),sourceRefs=[ref],requires=req,produces=[nid+'-legacy-result'],role='check',goal=q['prompt'],purpose=q.get('purpose',q['prompt']),operation=dict(kind='selection',targets=[ref],nextUseIds=[]),before=[dict(id=bid,kind='paragraph',parts=[dict(id=nid+'-old-text',kind='text',text=q['prompt']),dict(id=slot,kind='answerSlot',interactionId=nid,semanticRef=nid)])],after=[dict(id=nid+'-old-after',kind='paragraph',parts=[dict(id=nid+'-old-hint',kind='text',text=' / '.join(q['hints']))])],contextNeed=[],interaction=dict(id=nid,targetPath='interaction.expected.value',learningAction='selection',whyHere=q['prompt'],prerequisiteIds=req,expected=dict(value=q['answer'],form=q['answerType'],semanticType='legacy-contract'),choices=[dict(id=nid+'-choice-'+str(j),content=c,feedback=' / '.join(q['hints']),**({'misconception':'元の誤答を保存。新設計で表示と判断根拠を個別に確認。'} if c!=q['answer'] else {})) for j,c in enumerate(q['choices'])],hints=q['hints'],answerInsertion=dict(blockId=bid,slotId=slot))))
 legacy['coverage']=[dict(sourceId=b['id'],nodeIds=[n['id'] for n in legacy['nodes'] if b['id'] in n['sourceRefs']],disposition='taught' if any(b['id'] in n['sourceRefs'] for n in legacy['nodes']) else 'excluded',reason='旧prompt/採点キーだけの診断投影。無番号本文の合格を主張しない。') for b in src['blocks']];write(f'evidence/{u}_LEGACY_PROJECTION.json',legacy)
 summary[u]=dict(nodes=len(ds),answers=len(byid),stages=len(set(n['stageId'] for n in ds)),originalItems=len(old),originalChoiceKeys=sum(len(q['choices']) for q in old),originalContractsPreserved=True,sourceBlocks=len(src['blocks']),mathBlocks=sum(len(b['math']) for b in src['blocks']),candidateIR='PASS',compile='PASS',sourceCoverage='PASS',browser='NOT_RUN',approval='PENDING')
# Exact symbolic identities and exact rational conditions. These are checks of the listed math, not formal proofs of all prose.
import sympy as s
x,a,b,c=s.symbols('x a b c',real=True);p,q=s.symbols('p q',positive=True)
pairs=[('sum-square',(s.sqrt(p)+s.sqrt(q))**2,p+q+2*s.sqrt(p*q)),('difference-square',(s.sqrt(p)-s.sqrt(q))**2,p+q-2*s.sqrt(p*q)),('first-candidate',(s.sqrt(2)+s.sqrt(3))**2,5+2*s.sqrt(6)),('coef-four',4*s.sqrt(5),2*s.sqrt(20)),('difference-candidate',(s.sqrt(5)-2)**2,9-4*s.sqrt(5)),('opposite-candidate',(2-s.sqrt(5))**2,9-4*s.sqrt(5)),('whole-fraction',3+s.sqrt(5),(6+2*s.sqrt(5))/2),('numerator-candidate',(s.sqrt(5)+1)**2,6+2*s.sqrt(5)),('rationalization',(s.sqrt(5)+1)/s.sqrt(2),(s.sqrt(10)+s.sqrt(2))/2),('add-difference',(b+c)-(a+c),b-a),('multiply-difference',b*c-a*c,c*(b-a)),('n11-bracket',3*(2*x+3),6*x+9),('n11-fraction',3*((x-2)/3),x-2),('n12-cost',50+180*x+130*(20-x),2650+50*x),('eleven',50+180*11+130*9,3200),('twelve',50+180*12+130*8,3250)]
checks=[]
for name,l,r in pairs:
 assert s.simplify(l-r)==0,(name,l,r);checks.append(dict(id=name,left=str(l),right=str(r),residual='0'))
assert s.sqrt(5)>2 and s.sqrt(5)-2>0 and s.sqrt(2)+s.sqrt(3)>0
ineq=[('n11-positive',3*x-2<5,x<s.Rational(7,3)),('n11-negative',-2*x+3<=5,x>=-1),('n11-expand',3*(2*x+3)>=10*x-17,x<=s.Rational(13,2)),('n11-denominator',(x-2)/3<=2*x+1,x>=-1),('n12-first',x-2<3*x+5,x>-s.Rational(7,2)),('n12-second',x+4<=5-x,x<=s.Rational(1,2))]
for name,l,r in ineq:
 assert s.solve_univariate_inequality(l,x,relational=False)==s.solve_univariate_inequality(r,x,relational=False),(name,l,r);checks.append(dict(id=name,left=str(l),solution=str(r),status='PASS'))
assert s.Rational(5,3)<2;assert [i for i in range(21) if 3200<=2650+50*i<3300]==[11,12]
write('evidence/MATH_CHECK.json',dict(status='PASS',symbolic=checks,integerEnumeration=[11,12],limits='数式の厳密検算と、条件・初学者への説明の同じassistantによる監査。未知の精度や機械証明は主張しない。'))
write('evidence/PROPOSAL_CHECKS.json',dict(status='PASS_BOUNDED',units=summary,strictIdentities=len(pairs),inequalityChecks=len(ineq),learnerImplementation=False,browserVerified=False,publicDeployment=False))
print(json.dumps(summary,ensure_ascii=False))
