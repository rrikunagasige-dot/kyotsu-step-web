import { mathNumbersN01Unit } from './numbers/n01Lesson'
import { mathSetUnit } from './set/setLesson'
import { mathPropositionReadingUnit } from './proposition/propositionReadingLesson'
import { mathQuantifierUnit } from './proposition/quantifierLesson'
import { mathFunctionConditionsUnit } from './function/functionConditionsLesson'
import { mathPropositionProofUnit } from './proposition/propositionProofLesson'

export const mathTextbookUnits = [mathNumbersN01Unit, mathSetUnit, mathPropositionReadingUnit, mathPropositionProofUnit, mathQuantifierUnit, mathFunctionConditionsUnit]

export { mathTextbookTopics, mathTextbookTopicForUnit, mathTextbookTopicHasAllUnits, mathTextbookNextUnitId } from './mathCatalog'
