import raw from './qf01Unit.json'
import presentation from './qf01Presentation.json'
import readingPresentation from './qf01ReadingPresentation.json'
import revision2Archive from './qf01Revision2Archive.json'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import type { TransformationReading } from '../../../../domain/transformationReading'

export const mathQuadraticQF01Unit = validateTextbookUnits([raw])[0]
export const qf01GuidedPresentation = presentation
export const qf01ReadingPresentation = readingPresentation
export const qf01Revision2Archive = revision2Archive
// 旧版はarchiveの原bytesから復元。r3の保存回答・完了判定には用いない。
export const qf01Revision2Unit = validateTextbookUnits([revision2Archive.unit])[0]
export const qf01Revision2GuidedPresentation = revision2Archive.presentation
function historicalTransformation(which: keyof typeof revision2Archive.transformationExports): TransformationReading {
  const ref = revision2Archive.transformationExports[which]
  const original = revision2Archive.sources['qf01Lesson.ts'].utf8
  return JSON.parse(original.slice(ref.startUTF16, ref.endUTF16)) as TransformationReading
}
export const qf01Revision2TransformationPresentation = historicalTransformation('qf01TransformationPresentation')
export const qf01Revision2PilotTransformationPresentation = historicalTransformation('qf01PilotTransformationPresentation')
// 既存exportは旧r2の歴史alias。新r3 rendererはqf01ReadingPresentationを使う。
export const qf01TransformationPresentation = qf01Revision2TransformationPresentation
export const qf01PilotTransformationPresentation = qf01Revision2PilotTransformationPresentation
