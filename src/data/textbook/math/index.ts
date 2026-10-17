import { mathNumbersN01Unit } from './numbers/n01Lesson'
import { mathSetUnit } from './set/setLesson'
import { mathNumbersN01Unit } from './numbers/numbersN01Lesson'
import { mathPropositionReadingUnit } from './proposition/propositionReadingLesson'
import { mathQuantifierUnit } from './proposition/quantifierLesson'
import { mathFunctionConditionsUnit } from './function/functionConditionsLesson'
import { mathPropositionProofUnit } from './proposition/propositionProofLesson'

export const mathTextbookUnits = [mathNumbersN01Unit, mathSetUnit, mathPropositionReadingUnit, mathPropositionProofUnit, mathQuantifierUnit, mathFunctionConditionsUnit, mathNumbersN01Unit]

export { mathTextbookTopics, mathTextbookTopicForUnit, mathTextbookTopicHasAllUnits, mathTextbookNextUnitId } from './mathCatalog'
