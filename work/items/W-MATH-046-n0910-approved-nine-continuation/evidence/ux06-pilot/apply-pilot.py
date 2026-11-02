from pathlib import Path
import json,hashlib,copy
r=Path('/workspace/scratch/6ff917b2ec4a/w046-ux06-pilot');s=Path('/workspace/scratch/6ff917b2ec4a/w046-ux05-release-frozen');out=Path('/tmp/w046-ux06')
p=json.loads(Path('/tmp/w046-r04/PROPOSAL.json').read_text());assert hashlib.sha256(Path('/tmp/w046-r04/PROPOSAL.json').read_bytes()).hexdigest()=='a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840'
path='work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json';oldraw=(s/path).read_text();d=json.loads(oldraw);full=json.loads(Path('/tmp/w046-r04/CANDIDATE_NODE_DESIGN.json').read_text());target=next(n for u in full['units']for n in u['nodes']if n['nodeId']=='n09-decimal-method')
d.update({'proposalId':'P-W046-UX-06','status':'APPROVED_REPRESENTATIVE_IMPLEMENTATION','approvalStatus':'APPROVED_LIMITED_IMPLEMENTATION','ux06Pilot':True,'priorUx05DesignRaw':oldraw,'ux06Approval':{'proposalSHA256':'a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840','page':'818ccd59-f1f5-4505-8e5d-55826804a47a','quote':'可以来吧','scope':'decimal-method representative and native choice font; remaining approved content after representative user detail check','revisionDecision':'pilot N09r9 frozen; subsequent full N09r10, N10r6; no same revision artifact replacement'}})
for u in d['units']:
 if u['code']=='N09':u['fromRevision']=8;u['toRevision']=9;u['nodes']=[copy.deepcopy(target)if n['nodeId']==target['nodeId']else n for n in u['nodes']]
(r/path).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');newhash=hashlib.sha256((r/path).read_bytes()).hexdigest();oldhash=hashlib.sha256(oldraw.encode()).hexdigest()
mod=r/'tools/textbook/transformation/nested-lesson.mjs';t=(s/'tools/textbook/transformation/nested-lesson.mjs').read_text();t=t.replace("export const REVIEWED_NESTED_DESIGN = '"+oldhash+"';","export const REVIEWED_NESTED_DESIGN = '"+newhash+"';\nconst UX05_FULL_REVIEWED_NESTED_DESIGN = '"+oldhash+"';")
t=t.replace('[REVIEWED_NESTED_DESIGN, UX05_PILOT','[REVIEWED_NESTED_DESIGN, UX05_FULL_REVIEWED_NESTED_DESIGN, UX05_PILOT')
t=t.replace('  // UX04\'s N09 pilot', "  // UX06's representative preserves N10's exact previously reviewed source binding.\n  if (unitId === 'math-numbers-expressions-n10' && design.ux06Pilot) return buildNestedTransformationPlan(sourceRaw, design.priorUx05DesignRaw, unitId, assets);\n  // UX04's N09 pilot")
mod.write_text(t)
for code,rev in [('n09',8)]: (r/f'src/data/textbook/math/numbers/{code}ConstructionCompiledR{rev}.json').write_bytes((s/f'src/data/textbook/math/numbers/{code}ConstructionCompiled.json').read_bytes())
css=r/'src/components/textbook/construction-lesson-reading.css';css.write_text(css.read_text()+'\n/* UX06: match native answer text/math to the reader, including archived native views. */\n.construction-lesson-reading .reading-choice-option > strong { font-size: 1em; }\n')
(out/'PILOT_BINDING.json').write_text(json.dumps({'sourceSHA':'691d3d160493bf684ca8a31a22476d31d98caeec','approvedProposalSHA256':d['ux06Approval']['proposalSHA256'],'designSHA256':newhash,'previousDesignSHA256':oldhash,'onlyRedesignedNode':'n09-decimal-method','revisionDecision':d['ux06Approval']['revisionDecision'],'formalStoreReceipt':False},indent=2)+'\n')
print('pilot design',newhash)
