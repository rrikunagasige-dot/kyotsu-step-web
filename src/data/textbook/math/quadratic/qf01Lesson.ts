import raw from './qf01Unit.json'
import presentation from './qf01Presentation.json'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'

export const mathQuadraticQF01Unit = validateTextbookUnits([raw])[0]
export const qf01GuidedPresentation = presentation
