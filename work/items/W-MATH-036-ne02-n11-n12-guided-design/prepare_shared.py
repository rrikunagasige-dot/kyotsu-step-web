"""Prepare inactive revision-guarded routes/migrations once; publish only the current leaf."""
import sys,json
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from patch_support import apply
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';files={};p='src/pages/TextbookUnitPage.tsx';page=(R/p).read_text();p2='src/domain/textbook.ts';domain=(R/p2).read_text()
for code,oldrev,newrev in [('n11',10,11),('n12',3,4)]:
 page="import * as "+code+"LessonModule from '../data/textbook/math/numbers/"+code+"Lesson'\n"+page
 # Namespace access permits the old leaf before its approved successor is emitted.
 at=page.index('function ');page=page[:at]+"const "+code+"GuidedPresentation = ("+code+"LessonModule as unknown as { "+code+"Presentation?: unknown })."+code+"Presentation\n\n"+page[at:]
 needle=': <LegacyTextbookReadingFlow {...props} />';page=page.replace(needle,": props.unit.unitId === 'math-numbers-expressions-"+code+"' && props.unit.revision === "+str(newrev)+" && "+code+"GuidedPresentation\n              ? <GuidedMathReadingFlow key={props.unit.unitId} {...props} presentation={"+code+"GuidedPresentation} /> "+needle,1)
 anchors=json.dumps([i['id'] for i in json.loads((B/f'evidence/{code.upper()}_CURRENT.json').read_text())['unit']['sections'][0]['items']])
 migration='''  // W-MATH-036: inactive until the approved new leaf revision is emitted.
  if (unit.unitId === 'UNIT' && unit.revision === NEW
      && progress.unitId === unit.unitId && progress.unitRevision <= OLD) {
    const previous = progress.unitRevision === OLD ? progress : effectiveTextbookProgress({ ...unit, revision: OLD }, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const anchors = new Set(ANCHORS)
    return {
      unitId: unit.unitId, unitRevision: NEW, startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, 'OLD': archive }, migratedFromRevision: OLD,
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }

'''.replace('UNIT','math-numbers-expressions-'+code).replace('NEW',str(newrev)).replace('OLD',str(oldrev)).replace('ANCHORS',anchors)
 marker='  // W-MATH-034: keep all21 original N10 histories;24 new derivations are unanswered.';domain=domain.replace(marker,migration+marker,1)
files[p]=page;files[p2]=domain;apply(r,w,'R06_PATCH@ne02',R,files,'P001 three-unit shared scaffolding once; future revisions stay inactive until their own leaf is emitted, so later leaf work cannot invalidate the first release shared-source proof')
