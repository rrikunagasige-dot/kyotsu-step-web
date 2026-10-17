import { mathNumbersN01Unit } from './numbers/n01Lesson'
import { mathNumbersN02Unit } from './numbers/n02Lesson'
import { mathNumbersN03Unit } from './numbers/n03Lesson'
import { mathNumbersN09Unit } from './numbers/n09Lesson'
import { mathNumbersN10Unit } from './numbers/n10Lesson'
import { mathNumbersN12Unit } from './numbers/n12Lesson'
import { mathSetUnit } from './set/setLesson'
import { mathPropositionReadingUnit } from './proposition/propositionReadingLesson'
import { mathQuantifierUnit } from './proposition/quantifierLesson'
import { mathFunctionConditionsUnit } from './function/functionConditionsLesson'
import { mathPropositionProofUnit } from './proposition/propositionProofLesson'

export const mathTextbookUnits = [mathNumbersN01Unit, mathNumbersN02Unit, mathNumbersN03Unit, mathNumbersN09Unit, mathNumbersN10Unit, mathNumbersN12Unit, mathSetUnit, mathPropositionReadingUnit, mathPropositionProofUnit, mathQuantifierUnit, mathFunctionConditionsUnit]

export { mathTextbookTopics, mathTextbookTopicForUnit, mathTextbookTopicHasAllUnits, mathTextbookNextUnitId } from './mathCatalog'
