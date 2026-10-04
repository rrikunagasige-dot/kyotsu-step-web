export type MathPracticeFigureId =
  | 'F98-2A'
  | 'F98-2B'
  | 'F99-1'
  | 'F99-2'
  | 'F99-3'
  | 'F99-4'
  | 'F101-1A'
  | 'F102-1A'
  | 'F102-2A'
  | 'F102-3A'
  | 'F102-4A'
  | 'F103-3A'
  | 'F104-6A'
  | 'F104-6B'
  | 'F106-A'
  | 'F107-2A'
  | 'F107-4A'
  | 'F107-4B'
  | 'F107-5A'
  | 'F107-5B'
  | 'F107-5C'
  | 'F107-5D'
  | 'F107-5E'
  | 'F108-A'
  | 'F108-B'
  | 'F110-A'
  | 'F110-B'
  | 'F114-1A'
  | 'F114-2A'
  | 'F118-1'
  | 'F118-2A'
  | 'F118-2B'
  | 'F118-3'
  | 'F120-1A'
  | 'F120-2A'
  | 'F120-2B'
  | 'F120-2C'
  | 'F120-2D'

function has(resolved: ReadonlySet<string>, blankId: string) {
  return resolved.has(blankId)
}

/**
 * Returns only the figure state that is safe to show for the current practice target.
 *
 * Contract:
 * - figures never reveal a result before the learner-owned thinking node resolves;
 * - final-answer-only resolved diagrams are intentionally omitted when current-stage
 *   compression would immediately advance to the next target;
 * - IDs refer to the audited F-node plan for problems 98–120.
 */
export function mathPracticeFigureState(
  questionId: string,
  targetId: string | null | undefined,
  resolved: ReadonlySet<string>,
): MathPracticeFigureId | null {
  if (!targetId) return null

  switch (questionId) {
    case 'math-practice-098':
      if (targetId !== 's2') return null
      if (has(resolved, 'p2-example')) return 'F98-2B'
      if (has(resolved, 'p2-property')) return 'F98-2A'
      return null

    case 'math-practice-099':
      if (targetId === 's1' && has(resolved, 'p1-sets')) return 'F99-1'
      if (targetId === 's2' && has(resolved, 'p2-sets')) return 'F99-2'
      if (targetId === 's3' && has(resolved, 'p3-q-set')) return 'F99-3'
      if (targetId === 's4' && has(resolved, 'p4-left-endpoint')) return 'F99-4'
      return null

    case 'math-practice-101':
      return targetId === 's1' ? 'F101-1A' : null

    case 'math-practice-102':
      if (targetId === 's1') return 'F102-1A'
      if (targetId === 's2') return 'F102-2A'
      if (targetId === 's3') return 'F102-3A'
      if (targetId === 's4') return 'F102-4A'
      return null

    case 'math-practice-103':
      return targetId === 's3' && has(resolved, 'p3-split') ? 'F103-3A' : null

    case 'math-practice-104':
      if (targetId !== 's6') return null
      if (has(resolved, 'p6-reverse-property')) return 'F104-6B'
      if (has(resolved, 'p6-forward-property')) return 'F104-6A'
      return null

    case 'math-practice-106':
      return ['s1', 's2', 's3', 's4'].includes(targetId) ? 'F106-A' : null

    case 'math-practice-107':
      if (targetId === 's2') {
        return has(resolved, 'p2-reverse-signs') ? 'F107-2A' : null
      }
      if (targetId === 's4') {
        return has(resolved, 'p4-counterexample-angles') ? 'F107-4B' : 'F107-4A'
      }
      if (targetId === 's5') {
        if (has(resolved, 'p5-reverse-lengths')) return 'F107-5E'
        if (has(resolved, 'p5-forward-example')) return 'F107-5D'
        if (has(resolved, 'p5-branch-right')) return 'F107-5C'
        if (has(resolved, 'p5-branch-isosceles')) return 'F107-5B'
        return 'F107-5A'
      }
      return null

    case 'math-practice-108':
      if (targetId !== 'reverse') return null
      if (has(resolved, 'reverse-eliminate')) return 'F108-B'
      if (has(resolved, 'reverse-sign')) return 'F108-A'
      return null

    case 'math-practice-110':
      if (targetId === 'basis') return null
      if (targetId.endsWith('-summary')) return 'F110-B'
      return 'F110-A'

    case 'math-practice-114':
      if (targetId === 'p1-squares') return 'F114-1A'
      if (targetId === 'p2-products') return 'F114-2A'
      return null

    case 'math-practice-118':
      if (targetId === 's1') return 'F118-1'
      if (targetId === 's2') {
        if (has(resolved, 'p2-count')) return 'F118-2B'
        if (has(resolved, 'p2-sample')) return 'F118-2A'
        return null
      }
      if (targetId === 's3') return 'F118-3'
      return null

    case 'math-practice-120':
      if (targetId.startsWith('p1-')) return 'F120-1A'
      if (targetId === 'p2-distance-rule' || targetId === 'p2-traveled') return 'F120-2A'
      if (targetId === 'p2-model') return 'F120-2B'
      if (targetId === 'p2-start' || targetId === 'p2-end') return 'F120-2C'
      if (targetId === 'p2-domain') return 'F120-2D'
      return null

    default:
      return null
  }
}
