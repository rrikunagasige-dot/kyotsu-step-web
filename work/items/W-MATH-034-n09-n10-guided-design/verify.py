"""Proposal checks, actual source coverage and symbolic identities; no learner edits."""
import json,subprocess,hashlib,zipfile,copy,sys
from pathlib import Path
import sympy as s
B=Path(__file__).resolve().parent;R=B.parents[2]
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def operation(op,payload):
 p=subprocess.run(['node','tools/textbook/operations.mjs',op],input=json.dumps(payload),text=True,capture_output=True,cwd=R);v=json.loads(p.stdout);assert p.returncode==0 and v['status']=='PASS',(op,v);return v
summary={}
for u in ['N09','N10']:
 ir=json.loads((B/(u+'_IR.json')).read_text());ds=json.loads((B/(u+'_NODE_DESIGN.json')).read_text())['nodes'];src=json.loads((B/f'evidence/{u}_SOURCE_INDEX.json').read_text());current=json.loads((B/f'evidence/{u}_CURRENT.json').read_text())['unit'];old=current['sections'][0]['items']
 assert src['status']=='PASS' and src['documentHash']=='93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa'
 for op in ['verify-ir','compile-ir']:
  result=operation(op,ir);write(f'evidence/{u}_{op.upper()}.json',result)
 coverage=operation('coverage',dict(blocks=src['blocks'],coverage=ir['coverage'],nodes=ir['nodes']));write(f'evidence/{u}_COVERAGE_CHECK.json',coverage)
 snapshots=operation('visible-snapshots',dict(ir=ir));write(f'evidence/{u}_VISIBLE_STATES.json',dict(status='PASS',states=[dict(nodeId=x['nodeId'],visibleNodeIds=[n['id'] for n in x['nodes']],knownFacts=x['knownFacts']) for x in snapshots['snapshots']],actualBrowser=False))
 byid={n['itemId']:n for n in ds if n.get('itemId')};assert all(q['id'] in byid and byid[q['id']]['answer']==q['answer'] for q in old)
 # A literal grading/prompt projection, not a claim to represent all legacy prose.
 legacy=copy.deepcopy(ir);legacy['nodes']=[]
 for i,q in enumerate(old):
  nid=q['id'];qnum=int(nid.split('-')[-1]) if 'p001' not in nid else 8;ref=next(b['id'] for b in src['blocks'] if qnum in b['markers']);slot=nid+'-old-slot';bid=nid+'-old-prompt'
  legacy['nodes'].append(dict(id=nid,problemId=u.lower(),sourceRefs=[ref],requires=[old[i-1]['id']+'-old-result'] if i else [],produces=[nid+'-old-result'],role='check',goal=q['prompt'],purpose=q['purpose'],operation=dict(kind='selection',targets=[ref],nextUseIds=[]),before=[dict(id=bid,kind='paragraph',parts=[dict(id=nid+'-old-text',kind='text',text=q['prompt']),dict(id=slot,kind='answerSlot',interactionId=nid,semanticRef=nid)])],after=[dict(id=nid+'-old-after',kind='paragraph',parts=[dict(id=nid+'-old-hint',kind='text',text=' / '.join(q['hints']))])],contextNeed=[],interaction=dict(id=nid,targetPath='interaction.expected.value',learningAction='selection',whyHere=q['prompt'],prerequisiteIds=[old[i-1]['id']+'-old-result'] if i else [],expected=dict(value=q['answer'],form=q['answerType'],semanticType='legacy-contract'),choices=[dict(id=nid+'-choice-'+str(j),content=c,feedback=' / '.join(q['hints']),**({'misconception':'旧版の誤答を忠実に投影。個別の原因は現行sourceとAIで監査する。'} if c!=q['answer'] else {})) for j,c in enumerate(q['choices'])],hints=q['hints'],answerInsertion=dict(blockId=bid,slotId=slot))))
 legacy['coverage']=[dict(sourceId=b['id'],nodeIds=[n['id'] for n in legacy['nodes'] if b['id'] in n['sourceRefs']],disposition='taught' if b['markers'] else 'excluded',reason='旧採点prompt/choicesの診断投影のみ。無番号説明の本文監査はCURRENT.jsonと原Wordで別に行う。') for b in src['blocks']]
 write(f'evidence/{u}_LEGACY_PROJECTION.json',legacy);write(f'evidence/{u}_LEGACY_CHECK.json',operation('verify-ir',legacy))
 argument=dict(kind='argument',claim=u+'の原問と追加導出が定義・条件から成立する。',assumptions=['実数の四則と平方公式','非負の数の平方は大小を保つ','N08の条件付き絶対値規則'],sourceRefs=[b['id'] for b in src['blocks']],steps=[dict(statement=n['before']+' '+n.get('resolvedFormula','')+' '+n['after'],basisRefs=n['sourceRefs'],dependsOn=n['requires']) for n in ds])
 write(u+'_COMPLETE_SOLUTION.json',argument)
 summary[u]=dict(nodes=len(ds),answers=len(byid),stages=len(set(n['stageId'] for n in ds)),originalItems=len(old),originalContractsPreserved=True,sourceBlocks=len(src['blocks']),mathBlocks=sum(len(b['math']) for b in src['blocks']),candidateIR='PASS',compile='PASS',sourceCoverage='PASS',browser='NOT_RUN',approval='NOT_REQUESTED_YET')
a=s.symbols('a',real=True);p,q=s.symbols('p q',positive=True)
pairs=[('square-negative',s.Integer(-4)**2,16),('root-square',s.sqrt(a*a),s.Abs(a)),('negative-root-square',(-s.sqrt(5))**2,5),('n09-sign-root',s.sqrt((2-s.sqrt(5))**2),s.sqrt(5)-2),('n09-left-decimal',s.Rational(141,100)**2,s.Rational(19881,10000)),('n09-right-decimal',s.Rational(142,100)**2,s.Rational(20164,10000)),('negative-decomposition',-s.Rational(21,10),-3+s.Rational(9,10)),('positive-part',3+(s.sqrt(10)-3),s.sqrt(10)),('negative-part',-4+(4-s.sqrt(10)),-s.sqrt(10)),('candidate125',(5*s.sqrt(5))**2,125),('product-proof',(s.sqrt(p)*s.sqrt(q))**2,p*q),('quotient-proof',(s.sqrt(p)/s.sqrt(q))**2,p/q),('root-product',s.sqrt(6)*s.sqrt(8),4*s.sqrt(3)),('root-sum',s.sqrt(8)+s.sqrt(50),7*s.sqrt(2)),('square-formula',(s.sqrt(2)-s.sqrt(3))**2,5-2*s.sqrt(6)),('difference-product',(s.sqrt(7)+s.sqrt(2))*(s.sqrt(7)-s.sqrt(2)),5),('simple-rationalize',1/(2*s.sqrt(3)),s.sqrt(3)/6),('conjugate-rationalize',s.sqrt(3)/(s.sqrt(3)+s.sqrt(2)),3-s.sqrt(6)),('transfer-rationalize',(2-s.sqrt(3))/(2+s.sqrt(3)),7-4*s.sqrt(3))]
checked=[]
for name,l,r in pairs:
 residual=s.simplify(l-r);assert residual==0,(name,residual);checked.append(dict(id=name,left=str(l),right=str(r),residual='0'))
assert s.Rational(19881,10000)<2<s.Rational(20164,10000)
assert s.floor(-s.Rational(21,10))==-3 and s.floor(s.sqrt(10))==3 and s.floor(-s.sqrt(10))==-4
assert 0<s.sqrt(10)-3<1 and 0<4-s.sqrt(10)<1
write('evidence/MATH_CHECK.json',dict(status='PASS',identities=checked,exactDecimalAndFloorChecks=True,conditionAudit='a>0,b>0 kept for N10; sqrt(a²)=|a| for all real a; c!=0 required before multiplying c/c; inequalities never joined by equality.',formalProof=False))
doc=Path('/workspace/scratch/f79c5816761e/n07-word-download/塾/01_数と式_教科書モード_対話段階導入版_v2(3).docx')
image=R/'public/assets/math/textbook/numbers/n09-f01.png'
with zipfile.ZipFile(doc) as z:
 matches=[n for n in z.namelist() if n.startswith('word/media/') and z.read(n)==image.read_bytes()];assert matches
write('evidence/FIGURE_PROVENANCE.json',dict(status='PASS',sourceDocumentHash=hashlib.sha256(doc.read_bytes()).hexdigest(),imageHash=hashlib.sha256(image.read_bytes()).hexdigest(),originalMediaMatches=matches,visualInspection='actual image opened: -4,-3,-2,-1; point -2.1; labels reveal -3 before Q10',visibility='only after n09-10 resolved; alt/caption same gate',n10NoFigureReason='平方・符号・等価な分数操作は対応する式列と条件表で教える。追加図は不要。'))
write('evidence/PROPOSAL_CHECKS.json',dict(status='PASS_BOUNDED',units=summary,symbolicIdentities=len(checked),learnerImplementation=False,publicDeployment=False,userQualityLabelCreated=False))
print(json.dumps(summary,ensure_ascii=False))
