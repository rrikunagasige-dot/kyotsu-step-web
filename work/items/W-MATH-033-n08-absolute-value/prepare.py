"""Read-only N08 source projection and bounded proposal checks, not implementation."""
import json,hashlib,subprocess,copy,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2]
sys.path.insert(0,str(R/'workflow'))
from store import digest
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def run(op,data):
 p=subprocess.run(['node','tools/textbook/operations.mjs',op],input=json.dumps(data),text=True,capture_output=True,cwd=R)
 if p.returncode:raise RuntimeError(p.stderr or p.stdout)
 return json.loads(p.stdout)
ir=json.loads((B/'CANDIDATE_IR.json').read_text());ds=json.loads((B/'NODE_DESIGN.json').read_text());source=json.loads((B/'evidence/SOURCE_INDEX.json').read_text());old=json.loads((B/'evidence/ORIGINAL_STEPS.json').read_text())
orig=[s for g in old['groups'] for s in g['steps']]
new={n['itemId']:n for n in ds['nodes'] if n.get('itemId')}
assert len(orig)==12 and len(new)==31
for n in orig:assert new['n08-'+str(n['q']).zfill(2)]['answer']==n['answer']
assert source['status']=='PASS' and [q for b in source['blocks'] for q in b['markers']]==list(range(1,13))
# Source projection contains only literal old lead/expr/after/answer/choices, not the new design.
# Its schema validity is separate from the old lesson's pedagogical quality.
legacy=copy.deepcopy(ir);legacy['nodes']=[]
for g in old['groups']:
 for step in g['steps']:
  q=step['q'];nid='n08-'+str(q).zfill(2);ref=next(b['id'] for b in source['blocks'] if b['markers']==[q]);bid=nid+'-interaction';slot=nid+'-slot'
  bef=[dict(id=nid+'-old-lead',kind='paragraph',parts=[dict(id=nid+'-old-text',kind='text',text=step['lead'])])]
  if step.get('expr'):bef.append(dict(id=nid+'-old-expr',kind='paragraph',parts=[dict(kind='math',id=nid+'-old-math',latex=step['expr'],mathRole='expression',semanticRef=ref)]))
  bef.append(dict(id=bid,kind='paragraph',parts=[dict(kind='answerSlot',id=slot,interactionId=nid,semanticRef=nid)]))
  prev=legacy['nodes'][-1:];req=[n['produces'][0] for n in prev]
  node=dict(id=nid,problemId='absolute-value',sourceRefs=[ref],requires=req,produces=[nid+'-old-result'],role='check',goal=step['prompt'],purpose=step['prompt'],operation=dict(kind='selection',targets=[ref],nextUseIds=[]),before=bef,after=[dict(id=nid+'-old-after',kind='paragraph',parts=[dict(kind='text',id=nid+'-old-after-text',text=step['after'])])],contextNeed=[],interaction=dict(id=nid,targetPath='interaction.expected.value',learningAction='selection',whyHere=step['prompt'],prerequisiteIds=req,expected=dict(value=step['answer'],form='text',semanticType='legacy-full-choice'),choices=[dict(id=nid+'-old-choice-'+str(i),content=c,feedback=step['hint'],**({'misconception':'旧版の選択肢をそのまま保存。原因監査で妥当性を確認する。'} if i else {})) for i,c in enumerate([step['answer'],*step['wrong']])],hints=[step['hint']],answerInsertion=dict(blockId=bid,slotId=slot)))
  legacy['nodes'].append(node)
legacy['coverage']=[dict(sourceId=b['id'],nodeIds=[n['id'] for n in legacy['nodes'] if b['id'] in n['sourceRefs']],disposition='taught' if b['markers'] else 'excluded',reason='旧問の文字列を忠実に投影' if b['markers'] else '旧版の前後本文への統合対応をAIが原資料と照合するための未番号説明。診断投影の対象外であり、原資料から省略してよいという判断ではない。') for b in source['blocks']]
write('evidence/LEGACY_PROJECTION.json',legacy)
checks={}
for name,payload in [('IR_CHECK',ir),('LEGACY_PROJECTION_CHECK',legacy)]:
 r=run('verify-ir',payload);write('evidence/'+name+'.json',r);assert r['status']=='PASS',r;checks[name]={'status':r['status'],'warnings':len(r['findings'])}
r=run('coverage',dict(blocks=source['blocks'],coverage=ir['coverage'],nodes=ir['nodes']));write('evidence/COVERAGE_CHECK.json',r);assert r['status']=='PASS';checks['coverage']=r
compiled=run('compile-ir',ir);write('CANDIDATE_COMPILED.json',compiled);assert compiled['status']=='PASS'
snapshots=run('visible-snapshots',dict(ir=ir))
write('evidence/VISIBLE_SNAPSHOTS.json',dict(status=snapshots['status'],snapshotCount=len(snapshots['snapshots']),payloadDigest=digest(snapshots),states=[dict(nodeId=x['nodeId'],visibleNodeIds=[n['id'] for n in x['nodes']],knownFacts=x['knownFacts']) for x in snapshots['snapshots']],reproduce='node tools/textbook/operations.mjs visible-snapshots with {ir:CANDIDATE_IR.json}'))
checks['grading']={'originalAnchors':12,'unchangedAnswers':12,'newIntermediateItems':19,'distinctItemIds':31,'status':'PASS'}
# A complete solution is an explicit dependency argument, not a claimed machine proof.
argument=dict(kind='argument',claim='原N08の12問の解答と一般的性質が、絶対値の距離定義から成立する。',assumptions=['実数の四則・順序','右側座標−左側座標が二点間の距離','非負の二数で二乗の大小関係は保存される','sqrt(5)>0 and sqrt(5)^2=5 を局所に教える','pi=3.14159... は原問で与えられる'],sourceRefs=[b['id'] for b in source['blocks']],steps=[])
for n in ds['nodes']:
 argument['steps'].append(dict(statement=n['before']+' '+(n.get('formula') or '')+' → '+(n['answer'] or '')+' '+n['after'],basisRefs=n['sourceRefs'],dependsOn=n['requires']))
write('COMPLETE_SOLUTION.json',argument)
# SymPy checks the supported algebra under explicit assumptions. Decimal bounds use the given statement, not a floating-point proof.
import sympy as s
a=s.symbols('a',real=True);u=s.symbols('u',nonnegative=True);v=s.symbols('v',negative=True)
pairs=[('left-distance',0-(-5),s.Integer(5)),('double-negative',-(-a),a),('root-negation',-(s.sqrt(5)-3),3-s.sqrt(5)),('pi-negation',-(3-s.pi),s.pi-3),('abs-square',s.Abs(a)**2,a**2),('opposite-distance',s.Abs(-a),s.Abs(a)),('nonnegative-case',s.Abs(u),u),('negative-case',s.Abs(v),-v),('zero-case',s.Abs(0),s.Integer(0))]
mathrows=[]
for label,left,right in pairs:
 residual=s.simplify(left-right);assert residual==0,(label,residual)
 mathrows.append(dict(id=label,left=str(left),right=str(right),residual=str(residual),status='PASS'))
assert s.sqrt(5)<3 and s.pi>3
mathrows.extend([dict(id='root-sign',statement='sqrt(5)>0, 3>0; 5<9 implies sqrt(5)<3; subtract3 -> difference<0',status='PASS'),dict(id='zero-iff',statement='distance=0 -> same point -> a=0; a=0 -> distance0',status='AI_ARGUMENT_REVIEWED',formalProof=False)])
write('evidence/MATH_CHECK.json',dict(status='PASS',symbolic=mathrows,limits='登録外solverへN08を渡さない。恒等式のSymPy検算と、距離・大小の根拠のAI監査を分ける。数値近似だけで証明しない。'))
write('evidence/PROPOSAL_CHECKS.json',dict(status='PASS_BOUNDED',checks=checks,mathIdentities=len(pairs),compileOnly=True,learnerImplementation=False,browserVerified=False,publicDeployment=False))
print(json.dumps({'status':'PASS_BOUNDED','nodes':len(ir['nodes']),'items':31,'originalAnswersPreserved':12,'sourceBlocks':len(source['blocks']),'symbolicIdentities':len(pairs),'irHash':compiled['compiled']['irHash']},ensure_ascii=False))
