"""Read-only current-N07 audit. No learner or production-tool writes."""
import hashlib,json,re,subprocess,zipfile,xml.etree.ElementTree as E
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
SOURCE='4fb7a98e7f864839ccc1374080473df4ba60ce88'
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write(name,value):
 p=OUT/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def audit():
 authored=ROOT/'src/data/textbook/math/numbers/n07Authored.json';old=subprocess.check_output(['git','show',SOURCE+':'+str(authored.relative_to(ROOT))]);assert old==authored.read_bytes()
 p=json.loads(old);plan=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/n07/N07_DESIGN_PLAN.json').read_text());flow=p['unit']['sections'][0]['readingFlow'];nodes=p['nodes'];rows=[]
 for n in nodes:
  q=n.get('interaction');issues=[]
  if n['outputLatex'].isdigit():issues.append('F02_ORPHAN_SCALAR_OUTPUT')
  if q and q['answer'] in ('引く','足す','掛ける'):
   block=next(b for b in flow if b['id']==n['id']+'-interaction')
   if block['parts']==[{'type':'choice','itemId':q['id']}]:issues.append('F03_OPERATION_WITHOUT_SENTENCE')
  if n['id'].endswith('-coefficient') and n['inputLatex'] and '=' not in n['outputLatex']:issues.append('F04_UNCONNECTED_TRANSFORM')
  if q and q['answerType']=='formula' and not q.get('prefixLatex') and not q.get('suffixLatex'):issues.append('SAME_ROOT_BARE_FORMULA_ANSWER')
  math_fields=[k for k in ('before','after') if re.search(r'[/^=−≤√π]|[a-z][a-z]?\b',n[k])]
  if math_fields:issues.append('F06_MATH_MARKUP_REVIEW')
  if n['id'] in ('n07-q04-definitions','n07-q11-factor-ten','n07-q13-difference','n07-q14-real-definition'):issues.append('F05_DEFINITION_TERM_MARKUP')
  if n['id']=='n07-q03-cycle':issues.append('F01_REFERENCE_TABLE_AND_PROBLEM_MISSING')
  if n['id']=='n07-q06-scale':issues.append('SOURCE_MINIMUM_DOMAIN_OMITTED')
  if n['id']=='n07-q10-reduce':issues.append('SAME_ROOT_REDUCTION_RESULT_WITHOUT_RELATION')
  rows.append({'id':n['id'],'problemId':n['problemId'],'role':n['role'],'goal':n['goal'],'itemId':q.get('id') if q else None,'issues':issues,'mathFieldCandidates':math_fields,'sourceRefs':n['sourceRefs'],'currentInput':n['inputLatex'],'currentOutput':n['outputLatex'],'knownRefs':n['knownRefs']})
 report={'status':'DIAGNOSED_NOT_FIXED','sourceSHA':SOURCE,'authoredSHA256':h(authored),'nodeCount':len(nodes),'itemCount':sum(bool(n.get('interaction')) for n in nodes),'stageCount':len(p['stages']),'equationCount':len(p['equationNumbers']),'compiledTermCount':sum(x.get('type')=='term' for b in flow for x in b.get('parts',[])),'groups':{code:[r['id'] for r in rows if code in r['issues']] for code in sorted({i for r in rows for i in r['issues']})},'nodes':rows,'limits':['This is a source/model audit, not browser observation.','Regex math candidates require the explicit human/AI span decisions in NODE_DESIGN.json.','A standalone expression is not universally wrong; only its declared role determines the needed relation or caption.']}
 write('evidence/SOURCE_AUDIT.json',report)
 source=json.loads((ROOT/'tools/textbook/fixtures/n07-source-index.json').read_text())
 job=subprocess.run(['node','tools/textbook/operations.mjs','coverage'],input=json.dumps({'blocks':source['blocks'],'coverage':plan['coverage'],'nodes':nodes}),cwd=ROOT,text=True,capture_output=True);coverage=json.loads(job.stdout);assert coverage['status']=='PASS';write('evidence/COVERAGE_CHECK.json',coverage)
 word=next(Path('/workspace/scratch/f79c5816761e/n07-word-download').rglob('*.docx'));assert h(word)==source['documentHash']
 tree=E.fromstring(zipfile.ZipFile(word).read('word/document.xml'));w='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}';m='{http://schemas.openxmlformats.org/officeDocument/2006/math}';paras=list(tree.iter(w+'p'))
 original=[]
 for i in range(297,341):
  el=paras[i-1];plain=''.join(t.text or '' for t in el.iter(w+'t'));maths=[E.tostring(x,encoding='unicode') for x in el.iter(m+'oMath')]
  original.append({'id':f'word-p-{i:06}','locator':f'word/document.xml:p[{i}]','ordinaryText':plain,'omml':maths})
 write('evidence/ORIGINAL_N07.json',{'documentHash':h(word),'library_file_id':'libfile_882581c670bc819188b9485a8975c54c','paragraphIndex':'all descendant w:p, identical to import-word.py; not direct body children','paragraphs':original,'mathTextWarning':'Do not flatten OMML fractions/radicals into concatenated digits.'})
 cases=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/n07/feedback/NEGATIVE_CASES.json').read_text())
 verified=[]
 for c in cases['cases']:
  f=Path('/workspace/scratch/f79c5816761e/n07-feedback-images')/c['evidence']['fileName'];assert h(f)==c['evidence']['sha256'];verified.append({'caseId':c['id'],'file':f.name,'sha256':h(f),'visualInspection':'INSPECTED','copiedToRepository':False})
 write('evidence/IMAGE_PROVENANCE.json',verified)
 # Existing bounded verifier: positive and negative identity are distinct outcomes.
 math=[]
 for a in (10,100):
  for right in (a-1,a):
   r=subprocess.run(['python','tools/textbook/solver/legacy-polynomial.py'],input=json.dumps({'left':f'({a}-1)*x','right':f'{right}*x'}),cwd=ROOT,text=True,capture_output=True);o=json.loads(r.stdout);assert o['status']==('PASS' if right==a-1 else 'FAIL');math.append({'left':f'({a}-1)x','right':f'{right}x','result':o})
 write('evidence/MATH_IDENTITIES.json',math)
 # Restore the original minimum domain, not a new question.
 domain=[]
 for digits in ('8','69'):
  modulus=10**len(digits)-1;num=int(digits);tested=[]
  for k in (1,2,3):tested.append({'multiplier':10**k,'fractionalPartAligned':((10**k)*num)%modulus==num%modulus})
  minimum=next(r['multiplier'] for r in tested if r['fractionalPartAligned']);domain.append({'period':digits,'domain':'10^k, k positive integer','tested':tested,'minimum':minimum})
 write('evidence/MINIMUM_DOMAIN_CHECK.json',domain)
 # Current legacy artifact really fails the new IR schema; do not relabel it as healthy.
 r=subprocess.run(['node','tools/textbook/operations.mjs','verify-ir'],input=json.dumps(p),cwd=ROOT,text=True,capture_output=True);ir=json.loads(r.stdout);assert ir['status']=='FAIL';write('evidence/LEGACY_IR_RESULT.json',ir)
 return report
if __name__=='__main__':
 r=audit();print(json.dumps({'nodes':r['nodeCount'],'items':r['itemCount'],'groups':r['groups']},ensure_ascii=False))
