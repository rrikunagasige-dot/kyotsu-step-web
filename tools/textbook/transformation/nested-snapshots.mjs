import { nestedLessonFromCompiled } from '../../../src/domain/compiledNestedLesson.ts';
import { emptyNestedLedger, answerNestedPart, projectNestedLesson } from '../../../src/domain/nestedLesson.ts';

/** The native audit projects the same state machine used by the real reader. */
export function buildNestedSnapshots(compiled, viewContext = {}) {
  const lesson = nestedLessonFromCompiled(compiled), snapshots = [];
  let ledger = emptyNestedLedger(lesson, 0), clock = 0;
  const capture = (part, state, selectedValue) => snapshots.push({
    id: part.id + ':' + state + ':' + snapshots.length, interactionId: part.nodeId,
    partId: part.id, state, ...(selectedValue !== undefined ? { selectedValue } : {}),
    visible: projectNestedLesson(lesson, ledger),
  });
  for (const node of lesson.nodes) for (const part of node.parts) {
    if (projectNestedLesson(lesson, ledger).editable?.partId !== part.id) throw Error('NESTED_SNAPSHOT_FRONTIER');
    const bound = { ...part, nodeId: node.nodeId };
    capture(bound, 'initial');
    for (const choice of part.choices.filter(c => c.value !== part.expected)) {
      ledger = answerNestedPart(lesson, ledger, part.id, choice.value, 'snapshot-' + (++clock), clock);
      if (projectNestedLesson(lesson, ledger).editable?.partId !== part.id) throw Error('NESTED_SNAPSHOT_WRONG_ADVANCED');
      capture(bound, 'wrong', choice.value);
    }
    ledger = answerNestedPart(lesson, ledger, part.id, part.expected, 'snapshot-' + (++clock), clock);
    capture(bound, 'filled', part.expected);
  }
  const completed = projectNestedLesson(lesson, ledger);
  if (!completed.completed) throw Error('NESTED_SNAPSHOT_INCOMPLETE');
  return { status: 'NEEDS_AI_REVIEW', schemaVersion: 'visible-snapshots/3', nestedPipeline: 'n0910/1',
    sourceSHA: viewContext.sourceSHA ?? null, planHash: compiled.planHash, compiledPresentationHash: compiled.compiledHash,
    snapshots, coverage: { nodes: completed.visible.length, requiredParents: lesson.nodes.filter(n => n.parts.length).length,
      parts: lesson.nodes.reduce((n, node) => n + node.parts.length, 0) },
    meaningAuditRequired: true, actualDOMMeasurements: false, automaticAcceptance: false };
}
