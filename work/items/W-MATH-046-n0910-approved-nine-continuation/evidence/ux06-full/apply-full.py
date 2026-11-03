from pathlib import Path
import json,gzip,hashlib,copy
r=Path(__file__).resolve().parents[5];assert json.loads((r/'src/data/textbook/math/numbers/n10ConstructionCompiled.json').read_text())['toRevision']==5, 'One-time full candidate preparation: current source must still be N10r5';w=r/'work/items/W-MATH-046-n0910-approved-nine-continuation';path=r/'work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json';current=json.loads(path.read_text());oldhash=hashlib.sha256(path.read_bytes()).hexdigest();proposal=json.loads((w/'evidence/ux06-proposal/PROPOSAL.json').read_text());assert hashlib.sha256((w/'evidence/ux06-proposal/PROPOSAL.json').read_bytes()).hexdigest()=='a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840'
candidate=json.loads(gzip.decompress((w/'evidence/ux06-proposal/CANDIDATE_NODE_DESIGN.json.gz').read_bytes()));changed={b['nodeId']for b in proposal['blocks']}|{x['nodeId']for x in proposal['proseOnly']};changed.remove('n09-decimal-method');nodes={n['nodeId']:n for u in candidate['units']for n in u['nodes']}
for u in current['units']:
 u['fromRevision'],u['toRevision']=(9,10)if u['code']=='N09'else(5,6)
 u['nodes']=[copy.deepcopy(nodes[n['nodeId']])if n['nodeId']in changed else n for n in u['nodes']]
current['status']='APPROVED_FULL_IMPLEMENTATION_PENDING_VERIFICATION';current['ux06Pilot']=False
current['ux06DetailFeedback']['status']='DETAIL_FIX_CHECKED_FULL_APPLICATION_PENDING_AUDIT'
path.write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n');newhash=hashlib.sha256(path.read_bytes()).hexdigest()
p=r/'tools/textbook/transformation/nested-lesson.mjs';s=p.read_text();s=s.replace("export const REVIEWED_NESTED_DESIGN = '"+oldhash+"';","export const REVIEWED_NESTED_DESIGN = '"+newhash+"';\nconst UX06_DETAIL_CANDIDATE_NESTED_DESIGN = '"+oldhash+"';").replace('[REVIEWED_NESTED_DESIGN, UX06_PILOT','[REVIEWED_NESTED_DESIGN, UX06_DETAIL_CANDIDATE_NESTED_DESIGN, UX06_PILOT');p.write_text(s)
p=r/'src/data/textbook/math/numbers/n10ConstructionCompiledR5.json';p.write_bytes((r/'src/data/textbook/math/numbers/n10ConstructionCompiled.json').read_bytes())
p=r/'src/data/textbook/math/numbers/n10Lesson.ts';p.write_text(p.read_text().replace('revision5','revision6').replace('n10Revision5','n10Revision6'))
p=r/'src/domain/textbookSchema.ts';p.write_text(p.read_text().replace("unit.revision === 4 || unit.revision === 5))","unit.revision === 4 || unit.revision === 5 || unit.revision === 6))"))
print('Full candidate design',newhash,'changed nodes',len(changed)+1)
