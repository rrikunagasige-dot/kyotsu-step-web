"""Check this proposal's exact coverage and immutability, without changing the app."""
from pathlib import Path
import hashlib,json,subprocess,base64,gzip,tarfile,io
B=Path(__file__).resolve().parent;R=B.parents[2]
def read(name):return json.loads((B/name).read_text())
d=read('NODE_DESIGN.json');inventory=read('NODE_INVENTORY.json')
assert hashlib.sha256((R/inventory['source']).read_bytes()).hexdigest()==d['sourceHash']==inventory['sourceSHA256']
assert len(d['nodeDecisions'])==36 and len({n['id'] for n in d['nodeDecisions']})==36
original={n['id']:n for n in inventory['nodes']}
assert {n['id'] for n in d['nodeDecisions']}==set(original)
for n in d['nodeDecisions']:
 assert n['existingInteractionId']==original[n['id']]['interaction']
 assert n['answer']==original[n['id']].get('answer')
assert len([n for n in d['nodeDecisions'] if n['existingInteractionId']])==31
assert len(d['newNodes'])==3 and sum(len(n['bindings']) for n in d['newNodes'])==5
assert len({n['interactionId'] for n in d['newNodes']})==3
assert set(n['interactionId'] for n in d['newNodes']).isdisjoint(n['interaction'] for n in inventory['nodes'])
assert sorted(s for g in d['problemGroups'] for s in g['stages'])==sorted(s['id'] for s in inventory['stages'])
assert read('MATH_FEASIBILITY.json')['status']=='PASS' and read('MATH_FEASIBILITY.json')['productionAdapterUpgraded'] is False
assert read('PROPOSAL_MATH_RENDER.json')['status']=='PASS'
assert read('BASELINE_IR_BINDING.json')['semanticEqual'] is True
ui=read('evidence/BASELINE_UI.json');assert ui['status']=='PASS'
assert [r['answered'] for r in ui['rows'] if r.get('completed')]==[31,31]
assert not subprocess.check_output(['git','diff','--name-only','--','src','tools','workflow','public'],cwd=R).strip()
# Store all authored baseline captures reversibly; don't duplicate third-party source HTML.
evidence=B/'evidence';images=sorted(evidence.glob('*.png'));buffer=io.BytesIO()
with tarfile.open(fileobj=buffer,mode='w') as tar:
 for p in images:
  info=tarfile.TarInfo(p.name);info.size=p.stat().st_size;info.mtime=0;tar.addfile(info,io.BytesIO(p.read_bytes()))
packed=gzip.compress(buffer.getvalue(),mtime=0)
(evidence/'screenshots.tar.gz.base64').write_text(base64.b64encode(packed).decode()+'\n')
(evidence/'screenshots.json').write_text(json.dumps({'archive':'screenshots.tar.gz.base64','format':'base64(gzip(tar(PNG)))','archiveSHA256':hashlib.sha256(packed).hexdigest(),'files':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in images},'purpose':'current lesson baseline only, not revised content'},ensure_ascii=False,indent=2)+'\n')
(evidence/'.gitignore').write_text('*.png\n')
result={'status':'PASS','oldNodesCovered':36,'oldInteractionsPreserved':31,'plannedNodes':39,'plannedInteractions':34,'newSlots':5,'baselineWidths':[320,390],'baselineCorrectOperations':62,'images':len(images),'productionChanged':False,'sourceHash':d['sourceHash'],'proposalHash':hashlib.sha256((B/'PROPOSAL.md').read_bytes()).hexdigest()}
(B/'PROPOSAL_CHECKS.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result))
