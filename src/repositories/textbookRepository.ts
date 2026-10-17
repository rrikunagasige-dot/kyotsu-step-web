import { builtInTextbookUnits } from '../data/textbookUnits'
import { mathNumbersReviewUnitIds } from '../data/textbook/math/mathCatalog'
import type { TextbookUnit } from '../domain/textbookSchema'

export interface TextbookRepository {
  listPublished(): Promise<TextbookUnit[]>
  listLearningSetup(): Promise<TextbookUnit[]>
  getById(unitId: string): Promise<TextbookUnit | undefined>
}

class StaticTextbookRepository implements TextbookRepository {
  async listPublished() {
    return builtInTextbookUnits.filter((unit) => unit.status === 'published')
  }

  async listLearningSetup() {
    const reviewVisible = new Set(mathNumbersReviewUnitIds)
    return builtInTextbookUnits.filter((unit) =>
      unit.status === 'published' ||
      (unit.status === 'review' && reviewVisible.has(unit.unitId)),
    )
  }

  async getById(unitId: string) {
    return builtInTextbookUnits.find((unit) => unit.unitId === unitId)
  }
}

// UI depends on this repository contract rather than importing the static data directly.
// A future database implementation can replace this object without changing page components.
export const textbookRepository: TextbookRepository = new StaticTextbookRepository()
