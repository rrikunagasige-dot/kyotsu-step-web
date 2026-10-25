"""Exact approved N08 materialization, including the explicitly approved new files.
The generic adapter accepts replacements only. This Work adapter records absence,
backs up existing bytes, validates the frozen approval, then journals additions
and replacements in the same Runtime. It never broadens the proposal or approval.
"""
import json,hashlib,sys,subprocess,os
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from adapters import in_scope
from contracts import manifest
from store import digest
W='W-MATH-033';rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R)
def h(b):return hashlib.sha256(b).hexdigest()
approved=json.loads((B/'APPROVAL.json').read_text());s=rt.state(W)
assert rt.approval(s)['id']==approved['event'] and not rt.integrity(s)
for p in ['PROPOSAL.md','NODE_DESIGN.json','CANDIDATE_IR.json']:
 assert (B/p).read_bytes()==subprocess.check_output(['git','show',approved['approvedCommit']+':'+str((B/p).relative_to(R))],cwd=R)
subprocess.run(['node',str(B/'materialize.mjs')],cwd=R,check=True)
files={
 'src/data/textbook/math/numbers/n08Authored.json':(B/'MATERIALIZED_APP.json').read_bytes(),
 'src/data/textbook/math/numbers/n08Lesson.ts':(B/'candidate/n08Lesson.ts').read_bytes(),
 'src/components/textbook/N08ReadingFlow.tsx':(B/'candidate/N08ReadingFlow.tsx').read_bytes(),
 'src/components/textbook/n08-reading.css':(B/'candidate/n08-reading.css').read_bytes(),
}
page=R/'src/pages/TextbookUnitPage.tsx';text=page.read_text();text="import { N08ReadingFlow } from '../components/textbook/N08ReadingFlow'\n"+text
old="? <N07ReadingFlow {...props} /> : <LegacyTextbookReadingFlow {...props} />"
assert text.count(old)==1
text=text.replace(old,"? <N07ReadingFlow {...props} />\n    : props.unit.unitId === 'math-numbers-expressions-n08' && props.unit.revision === 4\n      ? <N08ReadingFlow {...props} /> : <LegacyTextbookReadingFlow {...props} />")
files[str(page.relative_to(R))]=text.encode()
path=R/'src/domain/textbook.ts';text=path.read_text();needle='  // N07 approved v4:';at=text.index(needle)
migration='''  // W-MATH-033: keep original N08 answer records; new intermediate IDs remain unanswered.
  if (unit.unitId === 'math-numbers-expressions-n08' && unit.revision === 4
      && progress.unitId === unit.unitId && [1, 2, 3].includes(progress.unitRevision)) {
    const fromV3 = progress.unitRevision === 3 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 3 }, progress)
    if (!fromV3 || fromV3.unitRevision !== 3) return undefined
    const { archivedRevisions, ...archive } = fromV3
    const anchors = new Set(Array.from({ length: 12 }, (_, i) => 'n08-' + String(i + 1).padStart(2, '0')))
    return {
      unitId: unit.unitId, unitRevision: 4,
      startedAt: fromV3.startedAt, updatedAt: fromV3.updatedAt,
      answers: Object.fromEntries(Object.entries(fromV3.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '3': archive },
      migratedFromRevision: 3,
      ...(fromV3.completedAt !== undefined ? { previousRevisionCompletedAt: fromV3.completedAt }
        : fromV3.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
    }
  }

'''
text=text[:at]+migration+text[at:];files[str(path.relative_to(R))]=text.encode()
assert set(files)=={'src/data/textbook/math/numbers/n08Authored.json','src/data/textbook/math/numbers/n08Lesson.ts','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css','src/pages/TextbookUnitPage.tsx','src/domain/textbook.ts'}
proposal=(B/'PROPOSAL.md').read_text()
for path in files:
 assert in_scope(path,s['plan']['scope']) and Path(path).name in proposal
original={p:(R/p).read_bytes().hex() if (R/p).exists() else None for p in files}
assert {p for p,v in original.items() if v is None}=={'src/data/textbook/math/numbers/n08Authored.json','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css'}
ir=json.loads((B/'CANDIDATE_IR.json').read_text());job=run_code(rt,W,{'ir.compile':ir})
assert job['node']=='R06_PATCH@n08'
patch={'approvedProposalHash':approved['proposalHash'],'approvedIRHash':approved['contentDesignHash'],'files':[dict(path=p,before_sha256=h(bytes.fromhex(original[p])) if original[p] is not None else None,after_sha256=h(v),operation='replace' if original[p] is not None else 'create') for p,v in files.items()]}
proof=rt.store.put({'patch':patch,'original_files_hex':original,'approvedCommit':approved['approvedCommit'],'approvalEvent':approved['event'],'generator':'W033/materialize.mjs frozen-IR compiler','candidate_byte_hashes':{p:h(v) for p,v in files.items()}})
op='W033-approved-materialization-'+proof[:20]
rt.append('patch_intent',W,dict(node=job['node'],patch_hash=digest(patch),backup=proof,before={r['path']:r['before_sha256'] for r in patch['files']}),event_id=op)
for path,blob in files.items():
 dest=R/path;dest.parent.mkdir(parents=True,exist_ok=True)
 tmp=dest.with_suffix(dest.suffix+'.w033.tmp');tmp.write_bytes(blob);os.replace(tmp,dest)
rt.append('patch_applied',W,dict(node=job['node'],operation=op,after_manifest={p:h(v) for p,v in files.items()}))
ev=[rt.evidence(W,'file',dict(path=p,sha256=h(v)),source_ref=op,verification_level='local_execution') for p,v in files.items()]
(B/'PATCH_JOB.json').write_text(json.dumps(dict(job=job,proof=proof,evidence_refs=ev,files=patch['files'],adapter='N08 exact approved file creation/replacement; shared Runtime journal'),ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'R06':'APPLIED_NOT_FINISHED','files':len(files),'proof':proof},ensure_ascii=False))
