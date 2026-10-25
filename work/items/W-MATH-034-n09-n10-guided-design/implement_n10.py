import json,sys,hashlib,subprocess
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from store import digest
from ready_dispatch import accept_design,run
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-034';s=rt.state(w)
accept_design(rt,w,'R05_APPROVAL@n10','W034-N09-N10-P001-APPROVED-20261025')
job=run(rt,w,'R06_PATCH@n10',{'ir.compile':json.loads((B/'N10_IR.json').read_text())})
page=(R/'src/pages/TextbookUnitPage.tsx').read_text();page="import { n10Presentation } from '../data/textbook/math/numbers/n10Lesson'\n"+page
old='? <GuidedMathReadingFlow {...props} presentation={n09Presentation} /> : <LegacyTextbookReadingFlow {...props} />'
assert old in page;page=page.replace(old,"? <GuidedMathReadingFlow key={props.unit.unitId} {...props} presentation={n09Presentation} />\n        : props.unit.unitId === 'math-numbers-expressions-n10' && props.unit.revision === 2\n          ? <GuidedMathReadingFlow key={props.unit.unitId} {...props} presentation={n10Presentation} /> : <LegacyTextbookReadingFlow {...props} />")
domain=(R/'src/domain/textbook.ts').read_text();at=domain.index('  // W-MATH-034:');anchors=[i['id'] for i in json.loads((B/'evidence/N10_CURRENT.json').read_text())['unit']['sections'][0]['items']]
migration='''  // W-MATH-034: keep all21 original N10 histories;24 new derivations are unanswered.
  if (unit.unitId === 'math-numbers-expressions-n10' && unit.revision === 2
      && progress.unitId === unit.unitId && progress.unitRevision === 1) {
    const { archivedRevisions, ...archive } = progress
    const anchors = new Set(ANCHORS)
    return {
      unitId: unit.unitId, unitRevision: 2, startedAt: progress.startedAt, updatedAt: progress.updatedAt,
      answers: Object.fromEntries(Object.entries(progress.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '1': archive }, migratedFromRevision: 1,
      ...(progress.completedAt !== undefined ? { previousRevisionCompletedAt: progress.completedAt }
        : progress.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
    }
  }

'''.replace('ANCHORS',json.dumps(anchors));domain=domain[:at]+migration+domain[at:]
files={'src/data/textbook/math/numbers/n10Authored.json':(B/'MATERIALIZED_N10.json').read_bytes(),'src/data/textbook/math/numbers/n10Lesson.ts':(B/'candidate/n10Lesson.ts').read_bytes(),'src/pages/TextbookUnitPage.tsx':page.encode(),'src/domain/textbook.ts':domain.encode()}
h=lambda v:hashlib.sha256(v).hexdigest();backup=rt.store.put(dict(files_hex={p:(R/p).read_bytes().hex() if (R/p).exists() else None for p in files},new_hashes={p:h(v) for p,v in files.items()}));op='W034-n10-patch-'+backup[:20]
rt.append('patch_intent',w,dict(node=job['node'],patch_hash=digest({p:h(v) for p,v in files.items()}),backup=backup,before={p:h((R/p).read_bytes()) if (R/p).exists() else None for p in files}),event_id=op)
for p,v in files.items():(R/p).write_bytes(v)
rt.append('patch_applied',w,dict(node=job['node'],operation=op,after_manifest={p:h(v) for p,v in files.items()}));(B/'PATCH_JOB_N10.json').write_text(json.dumps(dict(job=job,proof=backup),indent=2)+'\n')
legacy=subprocess.check_output(['git','show','a442cbe966c074f122907bb7366b1ceb6634ca95:src/data/textbook/math/numbers/n10Lesson.ts'],text=True).replace("'../../../../domain/textbookSchema'","'../domain/textbookSchema'").replace("'./reviewLessonHelpers'","'../data/textbook/math/numbers/reviewLessonHelpers'")
(R/'src/test/n10Legacy.ts').write_text(legacy)
for rel,old,new in [('src/data/textbook/math/numbers/numbersNextBatch.test.ts',"from './n10Lesson'","from '../../../../test/n10Legacy'"),('src/review/reviewTargets.test.ts',"from '../data/textbook/math/numbers/n10Lesson'","from '../test/n10Legacy'")]:
 p=R/rel;p.write_text(p.read_text().replace(old,new))
p=R/'src/data/textbook/math/numbers/newBatchCoverage.test.ts';t=p.read_text();t="import { mathNumbersN10Unit as n10LegacyUnit } from '../../../../test/n10Legacy'\n"+t;t=t.replace('mathTextbookUnits = current_mathTextbookUnits.map(unit => firstThemeBaseline(', 'mathTextbookUnits = current_mathTextbookUnits.map(unit => firstThemeBaseline(unit.unitId === n10LegacyUnit.unitId ? n10LegacyUnit : ');p.write_text(t)
p=R/'src/data/textbook/math/numbers/firstSectionTeaching.test.tsx';p.write_text(p.read_text().replace("'math-numbers-expressions-n09']","'math-numbers-expressions-n09','math-numbers-expressions-n10']"))
print('N10 approved dependency-ready patch applied; no synthetic user acceptance')
