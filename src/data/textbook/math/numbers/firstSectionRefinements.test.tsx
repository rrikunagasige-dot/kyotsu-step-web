import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextbookFormula } from '../../../../components/textbook/TextbookFormula'
import { mathTextbookUnits } from '../index'
import { firstSectionTeachingPlans, type SectionTeachingPlan } from './firstSectionTeaching'
import { firstThemeSourceView, firstThemeRecordedResults, partitionFirstThemeReadingFlow, requiredFirstThemeContext, firstThemeEquationNumber } from '../presentation'
import { answerTextbookItem, effectiveTextbookProgress, isTextbookItemResolved, type TextbookUnitProgress } from '../../../../domain/textbook'
import type { TextbookReadingBlock, TextbookUnit } from '../../../../domain/textbookSchema'
import { firstThemeFormulaRows } from '../../../../components/textbook/formulaWrap'

const previousPlans = JSON.parse(readFileSync('work/items/W-MATH-030-section-one-results-and-blanks/BASELINE_PLANS.json', 'utf8')) as Record<string, SectionTeachingPlan>
const original = JSON.parse(readFileSync('work/items/W-MATH-029-section-one-teaching/BASELINE.json', 'utf8')) as Record<string, TextbookUnit>
const ledger = JSON.parse(readFileSync('work/items/W-MATH-030-section-one-results-and-blanks/IMPLEMENTATION_LEDGER.json', 'utf8')) as { unit: string; design: string; itemId: string; blockId: string; replaces: string | null }[]
const choices = (blocks: readonly TextbookReadingBlock[]) => blocks.flatMap(b => b.type === 'formula' || b.type === 'paragraph' ? b.parts.flatMap(p => p.type === 'choice' ? [p.itemId] : []) : [])

// Frozen accepted W050/W051 deltas only. All other old paragraph parts remain exact.
// W050 raw artifact93f98dba... after SHA292599f9...; W051 current source is bound in the proposal ledger.
const acceptedInlineMath: Record<string, string[]> = {
  "n01-bridge-explain-n01-01-before": ["−x²y²", "x", "y"],
  "n01-r3-negative-lead": ["−2x", "−2×x"],
  "n01-r3-negative-degree-lead": ["x"],
  "n01-r3-square-lead": ["x²", "x"],
  "n01-r3-product-lead": ["−x²y²"],
  "n01-r3-product-degree-lead": ["x", "y", "x", "y", "2+2"],
  "n01-bridge-explain-n01-03-before": ["x", "y", "x³"],
  "n01-bridge-explain-n01-03-after": ["y", "y"],
  "n01-s4-y-goal": ["5x³y", "y", "y"],
  "n01-s4-y-result": ["y", "5x³", "x"],
  "n01-s4-axy-goal": ["axy", "x", "x"],
  "n01-s4-axy-switch": ["x", "ay", "y"],
  "n01-s4-like-goal": [],
  "n01-s4-like-square-target": ["x²"],
  "n01-s4-like-square-reason": ["x²", "x²"],
  "n01-s4-like-linear-target": ["x", "−5x", "+2x", "x", "−5", "+2"],
  "n01-s4-like-assembly-text": ["−2x²", "−3x"],
  "n01-r3-linear-target": ["x"],
  "n01-r3-linear-reason": ["x", "3x", "x", "x=1x"],
  "n01-r3-linear-operation": ["x", "x"],
  "n01-r3-linear-result-text": ["4x"],
  "n01-r3-quadratic-text": ["x²", "−2x²"],
  "n01-r3-cubic-target": ["x³", "x³", "−x³"],
  "n02-bridge-audit-like-b-lead": ["bx"],
  "n02-s4-order-map": ["3bx", "x³", "−ax²", "5c", "x"],
  "n02-bridge-explain-n02-03-before": ["x", "y", "x"],
  "n02-bridge-worked-n02-04-before-0-lead": ["x"],
  "n02-bridge-detail-linear-coefficient-lead": ["x", "x"],
  "n02-bridge-detail-linear-coefficient-after": ["x", "x"],
  "n02-bridge-audit-constant-part-lead": ["x"],
  "n02-bridge-explain-n02-03-after": ["x"],
  "n02-s4-reuse-goal": ["x²", "x", "x"],
  "paragraph-b-missing": ["A", "x", "B", "B"],
  "n02-bridge-explain-n02-06-before": ["B"],
  "n02-bridge-audit-sum-constant-lead": [],
  "n02-s4-sum-close": ["A+B"],
  "n02-bridge-explain-n02-07-before": ["A−B", "B", "−1", "B"],
  "n02-bridge-audit-minus-cube-sign-lead": ["−1", "B"],
  "n02-bridge-explain-n02-07-after": ["−B", "A"],
  "n02-bridge-audit-diff-constant-lead": ["A", "B"],
  "n02-bridge-explain-n02-09-before": ["2A−3B", "2A", "−3B"],
  "n02-bridge-distribute-lead": ["2A"],
  "n02-bridge-detail-cube-coefficient-lead": ["x³"],
  "n02-bridge-twice-square-lead": ["x²"],
  "n02-bridge-detail-signed-coefficient-lead": ["x²"],
  "n02-bridge-detail-signed-coefficient-after": ["x²"],
  "n02-bridge-audit-twice-linear-lead": ["2A", "1x"],
  "n02-bridge-audit-twice-constant-lead": ["2A", "−1"],
  "n02-s4-minus-three-text": ["2A", "B", "−3", "A", "B"],
  "n02-bridge-minus-multiplier-lead": ["2A−3B", "2A", "B"],
  "n02-bridge-minus-multiplier-after": ["B", "2A+(-3)B"],
  "n02-bridge-minus-cube-lead": ["B"],
  "n02-bridge-minus-square-lead": ["B"],
  "n02-bridge-explain-n02-09-after": ["−3B", "2A", "−3B"],
  "n02-bridge-like-square-lead": ["x²"],
  "n02-bridge-square-sum-lead": ["x²"],
  "n02-bridge-worked-n02-10-assemble-0-lead": ["B"],
  "n02-bridge-constant-sum-lead": ["2A", "−3B"],
  "n02-bridge-explain-n02-10-after": ["2A−3B", "2A−3B"],
  "n02-bridge-explain-n02-11-before": ["A", "B", "x", "A", "B"],
  "n02-bridge-outer-minus-lead": ["A−B"],
  "n02-bridge-group-coefficients-lead": ["3A−4B−A+B", "A", "B"],
  "n02-bridge-worked-n02-bridge-group-coefficients-after-0-lead": ["A", "B"],
  "n02-bridge-audit-a-coefficient-lead": ["A"],
  "n02-bridge-audit-b-coefficient-lead": ["B", "−4", "+1"],
  "n02-bridge-explain-n02-11-after": ["A", "B", "−3"],
  "n02-bridge-reuse-lead": ["2A−3B", "A", "B"],
  "n02-bridge-reuse-formula": ["2A−3B"],
  "n03-bridge-audit-count-a-lead": ["a"],
  "n03-bridge-worked-n03-03-before-0-lead": ["a", "m", "n"],
  "n03-bridge-worked-n03-04-before-0-lead": ["a", "b"],
  "n03-bridge-worked-n03-05-before-0-lead": ["x", "y"],
  "n03-bridge-explain-n03-06-before": ["x", "y"],
  "n03-bridge-detail-y-power-lead": ["y²"],
  "n03-bridge-detail-y-power-after": ["x", "y"],
  "n03-s4-parts-return": ["−8", "x", "x^{9}", "y", "y^{6}"],
  "n03-bridge-audit-product-fourth-lead": ["x²", "x²", "x"],
  "n03-bridge-audit-product-negative-lead": ["x²", "−3x", "−3", "x"],
  "n03-bridge-audit-product-last-lead": ["x²", "x²"],
  "n03-bridge-grid-reading": ["3x", "2x"],
  "n03-bridge-worked-n03-12-before-0-lead": ["3x", "−1"],
  "n03-bridge-explain-n03-13-before": [],
  "n03-bridge-first-row-lead": ["3x"],
  "n03-bridge-detail-first-product-lead": ["3x", "x", "x²"],
  "n03-bridge-detail-second-product-lead": ["−x", "3x"],
  "n03-bridge-detail-third-product-lead": ["x"],
  "n03-bridge-detail-third-product-after": ["3x"],
  "n03-bridge-worked-n03-bridge-second-row-before-0-lead": ["−1", "−1", "2x²"],
  "n03-bridge-audit-minus-minus-lead": ["−x", "−1"],
  "n03-s4-minus-last": ["+x", "−1"],
  "paragraph-n04-intro": ["(5x+4y)^2", "(5x+4y)^2=(5x+4y)(5x+4y)"],
  "n04-s4-square-plan": [],
  "paragraph-n04-four-products": ["5x", "5x", "4y", "4y"],
  "n04-bridge-worked-n04-q01-p1-before-0-lead": ["x"],
  "n04-bridge-worked-n04-q01-p2-before-0-lead": ["5x", "4y"],
  "paragraph-n04-bridge": [],
  "n04-group-1": ["a", "b"],
  "n04-lead-02": ["5x", "4y", "20xy+20xy"],
  "n04-bridge-worked-n04-02-before-0-lead": ["xy"],
  "n04-s4-general-map": ["5x", "4y", "a", "b"],
  "n04-lead-04": ["5x", "4y", "a", "b", "(a+b)(a+b)"],
  "n04-bridge-worked-n04-04-before-0-lead": ["a", "b"],
  "n04-after-04": ["ab", "ba"],
  "n04-lead-05": ["ba=ab", "a^2+ab+ba+b^2"],
  "n04-bridge-audit-square-cross-count-lead": ["ba", "ab"],
  "n04-lead-06": ["(a−b)²"],
  "n04-bridge-audit-negative-cross-sign-lead": ["−b"],
  "n04-bridge-worked-n04-06-assemble-0-lead": ["−ab"],
  "n04-bridge-audit-negative-square-sign-lead": ["−b", "−b"],
  "n04-s4-square-problem": ["(2a−5)²"],
  "n04-s4-square-map": ["2a"],
  "n04-s4-square-order": ["2a"],
  "n04-bridge-audit-square-2a-lead": ["2a"],
  "n04-s4-square-return": ["4a²", "−20a"],
  "n04-s4-product-problem": ["(3x−2)(3x+2)", "3x"],
  "n04-s4-product-map": ["3x"],
  "n04-bridge-audit-square-3x-lead": ["3x"],
  "n04-lead-11": ["a,b,c,d", "(ax+b)(cx+d)"],
  "n04-bridge-worked-n04-11-before-1-lead": ["b"],
  "n04-lead-12": ["x", "acx^2+adx+bcx+bd"],
  "n04-bridge-audit-general-linear-lead": ["x"],
  "n04-lead-13": ["a,b,c,d", "(3x+1)(x+2)"],
  "n04-s4-coefficient-map": ["a=3", "b=1", "c=1", "d=2"],
  "n04-bridge-audit-concrete-linear-lead": ["1x"],
  "n04-after-13": ["6x", "x", "7x", "3x²+7x+2"],
  "n04-s4-three-goal": ["(a+b+c)²", "a+b", "T"],
  "n04-lead-14": ["T=a+b", "(T+c)^2"],
  "n04-bridge-worked-n04-14-before-1-lead": ["Tc"],
  "n04-after-14": ["T", "a+b"],
  "n04-lead-15": ["T", "a+b", "T²", "2Tc", "(a+b+c)^2"],
  "n04-bridge-explain-n04-15-before": ["T=a+b", "(T+c)²"],
  "n04-bridge-restore-t-lead": ["T=a+b", "T²", "2Tc"],
  "n04-bridge-worked-n04-bridge-expand-restored-before-1-lead": ["2c"],
  "n04-bridge-explain-n04-15-after": ["T", "a", "b", "a", "c", "b", "c"],
  "n04-lead-16": ["c", "c→−c", "(a+b-c)^2"],
  "n04-bridge-worked-n04-16-before-0-lead": ["c", "−c"],
  "n04-bridge-audit-minus-ac-lead": ["a", "−c"],
  "n04-bridge-audit-minus-bc-lead": ["b", "−c"],
  "n04-bridge-worked-n04-16-assemble-0-lead": ["c"],
  "n04-after-16": ["c", "c²"],
  "n04-after-17": ["A", "B", "(A+B)(A−B)"],
  "n04-bridge-worked-n04-18-before-0-lead": ["A=x²+1", "B=x"],
  "n04-lead-19": ["−x²", "(x^2+1)^2-x^2"],
  "n04-bridge-worked-n04-19-before-0-lead": ["−x²"],
  "n04-bridge-audit-remaining-square-lead": ["x²"],
  "n04-after-19": ["2x²−x²", "x²"],
  "n04-lead-20": ["x", "(x+1)(x+2)(x+3)(x+4)"],
  "n04-bridge-explain-n04-20-before": ["(x+p)(x+q)", "p+q"],
  "n04-s4-four-plan": ["T", "x"],
  "n04-bridge-pairing-lead": ["x"],
  "n04-bridge-worked-n04-bridge-pairing-before-2-lead": [],
  "n04-bridge-explain-n04-20-after": ["1+4", "2+3", "x²+5x", "T"],
  "n04-after-20": ["(x+1)(x+4)", "(x+2)(x+3)", "5x"],
  "n04-lead-21": ["T=x²+5x", "T", "(T+4)(T+6)"],
  "n04-bridge-explain-n04-21-before": ["x²+5x", "T", "T+4", "T+6"],
  "n04-bridge-worked-n04-21-before-0-lead": ["T"],
  "n04-bridge-audit-t-linear-lead": ["T"],
  "n04-bridge-explain-n04-21-after": ["T", "T=x²+5x", "T²", "10T", "T²", "(x²+5x)²"],
  "n04-lead-22": ["T", "T²", "(x^2+5x)^2+10(x^2+5x)+24"],
  "n04-bridge-restore-square-lead": ["T"],
  "n04-bridge-detail-square-cross-lead": ["(x²+5x)²"],
  "n04-bridge-detail-square-last-lead": ["5x"],
  "n04-bridge-restore-ten-lead": ["10T"],
  "n04-s4-four-close": ["T"],
  "n04-bridge-explain-n04-22-after": ["10T", "T"],
  "n05-lead-01": ["x(y+5)", "−3(y+5)", "x(y+5)-3(y+5)"],
  "n05-after-01": ["T", "xT−3T"],
  "n05-lead-02": ["T", "x", "−3", "T", "xT-3T,\\quad T=y+5"],
  "n05-bridge-explain-n05-02-before": ["T"],
  "n05-bridge-factor-t-lead": ["T"],
  "n05-bridge-detail-coefficient-factor-lead": ["T"],
  "n05-bridge-detail-coefficient-factor-after": ["T", "T"],
  "n05-bridge-explain-n05-02-after": ["T", "T=y+5"],
  "n05-s4-check-conclusion": ["xy+5x−3y−15", "(x−3)(y+5)"],
  "n05-bridge-worked-n05-05-before-0-lead": ["b−a=−(a−b)"],
  "n05-lead-06": ["16x^2+24xy+9y^2"],
  "n05-bridge-audit-positive-root-16-lead": ["16x²"],
  "n05-bridge-audit-positive-root-9-lead": ["9y²"],
  "n05-lead-07": ["(4x+3y)²", "(4x+3y)^2"],
  "n05-after-07": ["24xy"],
  "n05-lead-09": ["r", "s", "(a+r)(a+s)"],
  "n05-bridge-worked-n05-09-before-1-lead": ["a"],
  "n05-lead-10": ["a²−6a−16", "a^2-6a-16"],
  "n05-s4-candidate-purpose": ["−6"],
  "n05-bridge-explain-n05-11-after": ["−6", "−8", "−16", "(a+r)(a+s)", "r", "s"],
  "n05-after-11": ["(a−8)(a+2)", "a²−6a−16"],
  "n05-s4-general-definition": ["x²", "(px+q)(rx+s)", "p", "r", "x", "q", "s"],
  "n05-lead-12": ["(px+q)(rx+s)", "(px+q)(rx+s)"],
  "n05-bridge-worked-n05-12-before-0-lead": ["px", "q"],
  "n05-bridge-worked-n05-12-before-1-lead": ["x"],
  "n05-lead-13": ["4x²+7x+3", "4x^2+7x+3"],
  "n05-s4-candidate-generation": ["pr=4", "qs=3"],
  "n05-lead-14": ["A", "(2x+1)(2x+3)", "B", "(x+1)(4x+3)", "C", "(x+3)(4x+1)"],
  "n05-bridge-cross-a-lead": ["A", "(2x+1)(2x+3)"],
  "n05-bridge-cross-b-lead": ["B", "(x+1)(4x+3)"],
  "n05-bridge-cross-c-lead": ["C", "(x+3)(4x+1)"],
  "n05-group-4": ["5x²−2x−3"],
  "n05-lead-16": ["5x²−2x−3", "(x+r)(5x+s)", "r,s", "(x+r)(5x+s)"],
  "n05-bridge-worked-n05-16-before-1-lead": ["s+5r"],
  "n05-lead-17": ["rs=−3", "rs=-3"],
  "n05-after-17": ["rs=−3<0", "r", "s"],
  "n05-lead-18": ["s+5r=−2", "5x^2-2x-3"],
  "n05-bridge-explain-n05-18-before": ["rs=−3", "s+5r=−2"],
  "n05-s4-last-candidates": ["rs=−3", "(1,−3)", "(−1,3)", "(3,−1)", "(−3,1)"],
  "n05-bridge-search-rs-1-lead": ["rs=−3", "(r,s)=(1,−3)", "s+5r"],
  "n05-bridge-search-rs-2-lead": ["rs=−3", "(r,s)=(−1,3)", "s+5r"],
  "n05-bridge-search-rs-3-lead": ["rs=−3", "(r,s)=(3,−1)", "s+5r"],
  "n05-bridge-search-rs-4-lead": ["rs=−3", "(r,s)=(−3,1)", "s+5r"],
  "n05-bridge-select-rs-lead": ["s+5r=−2"],
  "n05-bridge-detail-substitute-r-lead": ["r=−1", "s=3", "(x+r)(5x+s)"],
  "n05-bridge-detail-substitute-r-after": ["r=−1", "x−1", "s"],
  "n05-bridge-worked-n05-bridge-detail-substitute-r-after-0-lead": ["s=3"],
  "n05-bridge-explain-n05-18-after": ["r", "s", "(x+r)(5x+s)"],
  "n05-lead-19": ["3a²b−12b³", "3a^2b-12b^3"],
  "n05-s4-common-search": ["−12", "b"],
  "n05-bridge-worked-n05-19-before-0-lead": ["3b", "3b"],
  "n05-bridge-audit-common-negative-four-lead": ["−12b³", "3b"],
  "n05-lead-20": ["a²−(2b)²", "3b(a^2-4b^2)"],
  "n05-bridge-audit-square-root-four-lead": ["4b²"],
  "n05-bridge-worked-n05-bridge-audit-square-root-four-after-0-lead": ["3b"],
  "n05-bridge-worked-n05-bridge-audit-square-root-four-after-1-lead": ["3b"],
  "n06-s4-first-goal": ["(x+2y+1)(x+2y−2)−4", "X", "X", "x", "y"],
  "n06-lead-01": ["X", "(x+2y+1)(x+2y-2)-4"],
  "n06-bridge-worked-n06-01-after-0-lead": ["X"],
  "n06-after-01": ["X"],
  "n06-bridge-explain-n06-02-before": ["X"],
  "n06-bridge-worked-n06-bridge-x-expand-before-0-lead": ["X", "−4"],
  "n06-bridge-audit-x-linear-sum-lead": ["−2X", "X"],
  "n06-s4-pair-method": ["(X+r)(X+s)=X²+(r+s)X+rs", "X", "−1", "−6", "−6", "−1"],
  "n06-bridge-x-pair-lead": ["X", "−1", "−6", "−6", "−1"],
  "n06-after-03": ["X", "x,y"],
  "n06-lead-04": ["X=x+2y", "(X-3)(X+2)"],
  "n06-bridge-audit-restore-x-first-lead": ["X", "x+2y"],
  "n06-bridge-worked-n06-05-after-0-lead": ["x^{4}"],
  "n06-lead-06": ["T²−5T+4", "x²", "T^2-5T+4"],
  "n06-bridge-explain-n06-06-before": ["T", "T=x²", "T"],
  "n06-bridge-t-pair-lead": ["T²−5T+4", "−5"],
  "n06-bridge-t-factor-lead": ["T"],
  "n06-bridge-detail-restore-first-lead": ["T", "T=x²"],
  "n06-bridge-detail-restore-second-lead": ["T=x²", "T"],
  "n06-bridge-detail-restore-second-after": ["x"],
  "n06-bridge-explain-n06-06-after": ["x²"],
  "n06-lead-07": ["x²−1", "x²−4", "(x^2-1)(x^2-4)"],
  "n06-bridge-detail-difference-first-lead": ["x²−1", "x"],
  "n06-bridge-detail-difference-second-lead": ["2²"],
  "n06-group-3": ["x", "y"],
  "n06-lead-08": ["x", "y", "x^3+x^2y+x^2+xy-2x-2y"],
  "n06-s4-variable-reason": ["y", "y"],
  "n06-formula-08": ["x", "y", "y"],
  "n06-after-08": ["x", "y", "y"],
  "n06-lead-09": ["y", "x^3+x^2y+x^2+xy-2x-2y"],
  "n06-bridge-worked-n06-09-before-0-lead": ["y", "y"],
  "n06-bridge-audit-y-coefficient-lead": ["y"],
  "n06-after-09": ["x"],
  "n06-lead-10": ["y", "x", "x^3+x^2-2x"],
  "n06-bridge-worked-n06-10-before-0-lead": ["x"],
  "n06-after-10": ["(x²+x−2)"],
  "n06-lead-12": ["x²+x−2", "−2", "(x+y)(x^2+x-2)"],
  "n06-bridge-last-pair-lead": ["x²+x−2", "−2"],
  "n06-bridge-worked-n06-bridge-last-pair-after-1-lead": ["x+y"],
  "n06-after-12": ["x³", "−2y"],
  "n06-s4-previous-close": ["(x+y)(x+2)(x−1)", "x+y"],
  "n06-group-4": ["x", "y"],
  "n06-s4-last-goal": ["x²+3xy+2y²−x−3y−2", "x"],
  "n06-s4-rule-definition": ["U,V", "x", "y", "x"],
  "n06-lead-13": ["x²+3xy+2y²−x−3y−2", "x", "x^2+3xy+2y^2-x-3y-2"],
  "n06-bridge-worked-n06-13-before-0-lead": ["x"],
  "n06-bridge-audit-x-coefficient-lead": ["3xy−x", "x"],
  "n06-after-13": ["x", "3y−1", "2y²−3y−2"],
  "n06-lead-14": ["x", "2y²−3y−2", "2y^2-3y-2"],
  "n06-bridge-explain-n06-14-before": ["2y²−3y−2", "(2y+r)(y+s)", "r,s"],
  "n06-bridge-worked-n06-14-before-1-lead": ["2y²−3y−2"],
  "n06-bridge-audit-constant-pair-lead": ["−2", "2s+r=−3"],
  "n06-bridge-worked-n06-bridge-audit-constant-pair-before-0-lead": ["−2", "2s+r", "r=1", "s=−2"],
  "n06-bridge-worked-n06-bridge-audit-constant-pair-before-1-lead": ["r=−1", "s=2"],
  "n06-bridge-worked-n06-bridge-audit-constant-pair-before-2-lead": ["r=2", "s=−1"],
  "n06-bridge-worked-n06-bridge-audit-constant-pair-before-3-lead": ["r=−2", "s=1"],
  "n06-bridge-constant-cross-lead": ["r=1", "s=−2", "(2y+r)(y+s)", "(2y+1)(y−2)", "−3y"],
  "n06-bridge-explain-n06-14-after": ["x", "x"],
  "n06-after-14": ["x"],
  "n06-lead-15": ["(2y+1)", "(y−2)", "x", "(2y+1)+(y-2)"],
  "n06-bridge-worked-n06-15-before-0-lead": ["y"],
  "n06-bridge-audit-sum-y-coefficient-lead": ["y"],
  "n06-s4-sum-compare": ["2y²−3y−2", "3y−1", "x", "3y−1"],
  "n06-after-15": ["x"],
  "n06-lead-16": ["x²+(3y−1)x+(2y+1)(y−2)", "x", "x^2+(3y-1)x+(2y^2-3y-2)"],
  "n06-bridge-worked-n06-16-before-0-lead": ["x"],
  "n06-s4-last-return": ["U=2y+1", "V=y−2", "U+V", "UV", "(x+U)(x+V)", "U,V"],
}
const acceptedProseChanges: Record<string, { previous: string; current: string }> = {
  "n01-s4-like-goal": {
    "previous": "3x²−5x+6−5x²+2x−3を簡単にします。二次の項、一次の項、定数項の順に、一組ずつ計算してから全体を組み立てます。",
    "current": "次の式を簡単にします。二次の項、一次の項、定数項の順に、一組ずつ計算してから全体を組み立てます。"
  },
  "n02-bridge-audit-sum-constant-lead": {
    "previous": "定数項の係数だけを計算し、その文字の部分は残す。",
    "current": "最後に、文字を含まない定数項どうしを足します。"
  },
  "n02-bridge-audit-diff-constant-lead": {
    "previous": "定数項の係数だけを計算し、その文字の部分は残す。",
    "current": "最後に、Aの定数項と、符号を変えたBの定数項を足します。"
  },
  "n02-bridge-constant-sum-lead": {
    "previous": "Bには一次項がないので一次係数は2+0。最後に定数だけを足そう。",
    "current": "最後に、2Aと−3Bの定数項を足します。"
  },
  "n03-s4-parts-return": {
    "previous": "係数−8、xの部分x⁹、yの部分y⁶がそろいました。三つを掛けた形へ戻します。",
    "current": "係数−8、xの部分x^{9}、yの部分y^{6}がそろいました。三つを掛けた形へ戻します。"
  },
  "n03-bridge-explain-n03-13-before": {
    "previous": "前の括弧の二項をそれぞれ後ろの三項へ掛けるため、合計六つの積が必要になる。先に二行の積を作り、同類項を集めるのはその後にする。",
    "current": "まず六つの積を二行に分けて求めます。同類項は、二行がそろってからまとめます。"
  },
  "paragraph-n04-intro": {
    "previous": "(5x+4y)^2 を展開しよう。二乗とは、同じ括弧を二つ掛けること。(5x+4y)^2=(5x+4y)(5x+4y)。二つの括弧のどちらにも二つの項がある。",
    "current": "(5x+4y)^2 を展開します。二乗は、同じ括弧を二つ掛けることです。(5x+4y)^2=(5x+4y)(5x+4y)。"
  },
  "n04-s4-square-plan": {
    "previous": "目標は、括弧をなくして同類項をまとめた式です。まず四つの積を一つずつ求め、次に同じ文字の項だけを足し、最後に元の平方の答えへ戻します。",
    "current": "四つの積を順に求めます。ここでは同類項をまとめず、得られた四項を並べます。"
  },
  "paragraph-n04-four-products": {
    "previous": "一つ目の括弧の各項に、二つ目の括弧の各項を順に掛けよう。まず四組の積を計算する。同じ文字の項をまとめるのは、まだ先だ。",
    "current": "まず、一つ目の括弧の 5x を、二つ目の括弧の 5x と 4y に掛けます。次に、一つ目の括弧の 4y も、二つ目の各項に掛けます。"
  },
  "paragraph-n04-bridge": {
    "previous": "二項の平方では、両端の積だけでなく、異なる項どうしの掛け算も現れる。次は、その二つを一つにまとめる理由を考える。",
    "current": "四つの積を並べた式ができました。次は、中央の二項をまとめる理由を考えます。"
  },
  "n04-bridge-audit-square-cross-count-lead": {
    "previous": "ba=abなので、中央に同じabが二つある。",
    "current": "baをabと同じ形で読み直し、係数を足します。"
  },
  "n04-bridge-worked-n04-bridge-pairing-before-2-lead": {
    "previous": "最後の組み方では、二つの和が一致する。次はそれを実際の因数の組として選ぶ。",
    "current": "残る組み方でも二つの和を計算し、三つの組み方を比べます。"
  },
  "n05-lead-06": {
    "previous": "16x²+24xy+9y²の両端は、何を二乗したものだろう。16x^2+24xy+9y^2",
    "current": "次の式の両端の項は、それぞれ何の平方でしょうか。16x^2+24xy+9y^2"
  },
  "n05-bridge-audit-positive-root-16-lead": {
    "previous": "16x²を平方として読むため、まず正の数で16になる平方の底を選ぶ。",
    "current": "16x²を平方の形で読むため、まず二乗すると16になる正の数を選びます。"
  },
  "n05-s4-candidate-purpose": {
    "previous": "ここでは三候補の比較表を作り、和が目標の−6になる組を選びます。一つずつ計算するのは、積の条件だけでは候補を決められないことを比べるためです。",
    "current": "三つの候補を一つずつ確かめます。積が合うだけで決めず、和が−6になるかを比べます。"
  },
  "n06-bridge-explain-n06-02-before": {
    "previous": "置換は新しい式へ変える操作ではなく、繰り返す部分に仮の名前を付ける操作である。Xの式になった後は、既に学んだ分配法則で各項を開ける。",
    "current": "置き換えても式の値は変わりません。Xの式を、既習の分配法則で展開します。"
  },
  "n06-bridge-worked-n06-05-after-0-lead": {
    "previous": "まずx⁴を、ある式を二乗した形に戻します。次に元の三項を、その同じ式で読み直します。",
    "current": "まずx^{4}を、ある式を二乗した形に戻します。次に元の三項を、その同じ式で読み直します。"
  },
  "n06-lead-08": {
    "previous": "x³+x²y+x²+xy−2x−2yを、一つの文字について整理したい。xとyそれぞれを変数と見たときの最高次数を調べよう。x^3+x^2y+x^2+xy-2x-2y",
    "current": "次の式を因数分解します。まず、xとyそれぞれについての次数を比べます。x^3+x^2y+x^2+xy-2x-2y"
  },
  "n06-formula-08": {
    "previous": "考えて選ぶ：xについて3次、yについて1次。yで整理",
    "current": "次数を比べた結果：xについて3次、yについて1次。yで整理"
  }
}
const proseText = (parts: Extract<TextbookReadingBlock, { type: 'paragraph' }>['parts']) => parts.filter(p => p.type !== 'choice').map(p => p.type === 'math' ? p.latex : p.text).join('')

describe('P-003 first section: active derivation and retained results', () => {
  it('implements every approved decision once, preserving original prose or its exact accepted W050/W051 replacement', () => {
    expect(ledger).toHaveLength(46)
    expect(Object.keys(acceptedInlineMath)).toHaveLength(288)
    expect(Object.keys(acceptedProseChanges)).toHaveLength(19)
    for (const [key, plan] of Object.entries(firstSectionTeachingPlans)) {
      const old = previousPlans[key]
      expect(plan.stages).toHaveLength(old.stages.length)
      for (const entry of ledger.filter(e => e.unit === key)) {
        expect(choices(plan.readingFlow).filter(id => id === entry.itemId), entry.design).toHaveLength(1)
        expect(plan.readingFlow.find(b => b.id === entry.blockId)).toBeDefined()
      }
      for (const block of old.readingFlow.filter(b => b.type === 'paragraph')) {
        const current = plan.readingFlow.find(b => b.id === block.id)
        expect(current?.type, block.id).toBe('paragraph')
        if (Object.hasOwn(acceptedInlineMath, block.id)) {
          expect(current?.type).toBe('paragraph')
          if (current?.type !== 'paragraph') throw new Error('Missing accepted paragraph: ' + block.id)
          const wording = acceptedProseChanges[block.id]
          if (wording) expect(proseText(block.parts), block.id + ' historical wording').toBe(wording.previous)
          expect(proseText(current.parts), block.id + ' accepted wording').toBe(wording?.current ?? proseText(block.parts))
          expect(current.parts.filter(p => p.type === 'math').map(p => p.latex), block.id + ' typed math').toEqual(acceptedInlineMath[block.id])
          for (const part of block.parts.filter(p => p.type === 'math')) expect(current.parts, block.id + ' original math').toContainEqual(part)
        } else {
          expect(current && 'parts' in current ? current.parts.filter(p => p.type !== 'choice') : [], block.id).toEqual('parts' in block ? block.parts.filter(p => p.type !== 'choice') : [])
        }
      }
      expect(Object.keys(plan.resultBlockIdsByStage!)).toHaveLength(plan.stages.length)
    }
    expect(Object.values(firstSectionTeachingPlans).reduce((n, p) => n + choices(p.readingFlow).length, 0)).toBe(291)
  })

  it.each(Object.keys(previousPlans))('%s references only earlier source steps, and records only its own stage', key => {
    const plan = firstSectionTeachingPlans[key]
    const stages = partitionFirstThemeReadingFlow('math-numbers-expressions-' + key, plan.readingFlow)!
    const positions = new Map(plan.readingFlow.map((b, i) => [b.id, i]))
    for (const stage of stages) {
      for (const ref of firstThemeRecordedResults(stage, plan.readingFlow)) expect(stage.blocks.some(b => b.id === ref)).toBe(true)
      for (const block of stage.blocks) for (const id of choices([block])) {
        for (const ref of requiredFirstThemeContext(stage, plan.readingFlow, id)) {
          expect(positions.get(ref.split('#')[0])!, id + ' / ' + ref).toBeLessThan(positions.get(block.id)!)
          const source = firstThemeSourceView(ref, plan.readingFlow)!
          expect(source).toBeDefined()
          if (source.type === 'formula') for (const p of source.parts) if (p.type === 'math') expect(() => katex.renderToString(p.latex, { throwOnError: true })).not.toThrow()
          expect(choices([source])).not.toContain(id)
        }
      }
      expect(requiredFirstThemeContext(stage, plan.readingFlow, null)).toEqual([])
    }
  })

  it.each(Object.keys(previousPlans))('%s preserves completed S4 attempts and reopens new/replaced decisions', key => {
    const unit = mathTextbookUnits.find(u => u.unitId === 'math-numbers-expressions-' + key)!
    const old = previousPlans[key]
    const all = [...original[unit.unitId].sections[0].items, ...old.newItems]
    const before: TextbookUnit = { ...unit, revision: unit.revision - 1, sections: [{ ...unit.sections[0], readingFlow: old.readingFlow, items: choices(old.readingFlow).map(id => all.find(q => q.id === id)!) }] }
    const progress: TextbookUnitProgress = { unitId: unit.unitId, unitRevision: before.revision, startedAt: 1, updatedAt: 2, completedAt: 3, answers: Object.fromEntries(before.sections[0].items.map(q => [q.id, { itemId: q.id, value: q.answer, resolved: true, attemptCount: 1, isFirstCorrect: true, firstAnsweredAt: 1, lastAnsweredAt: 2 }])) }
    let current = effectiveTextbookProgress(unit, progress)!
    expect(current.archivedRevisions![String(before.revision)].answers).toEqual(progress.answers)
    expect(current.completedAt).toBeUndefined()
    for (const q of unit.sections[0].items) {
      if (progress.answers[q.id]) expect(current.answers[q.id]).toEqual(progress.answers[q.id])
      else {
        expect(current.answers[q.id]).toBeUndefined()
        current = answerTextbookItem(current, unit, q, q.choices!.find(c => c !== q.answer)!, 4)
        expect(isTextbookItemResolved(q, current.answers[q.id])).toBe(false)
        current = answerTextbookItem(current, unit, q, q.answer, 5)
        expect(isTextbookItemResolved(q, current.answers[q.id])).toBe(true)
      }
    }
  })

  it('selects B and the applicable index law from their actual canonical rows', () => {
    const b = firstThemeSourceView('formula-ab-definition#1', firstSectionTeachingPlans.n02.readingFlow)!
    expect(JSON.stringify(b)).toContain('B=-x^3+2x^2+2')
    expect(JSON.stringify(b)).not.toContain('A=')
    const law = firstThemeSourceView('n03-s4-rules-summary#1', firstSectionTeachingPlans.n03.readingFlow)!
    expect(JSON.stringify(law)).toContain('(a^m)^n=a^{mn}')
    expect(JSON.stringify(law)).not.toContain('a^{m+n}')
  })

  it('keeps a parenthesized constant together and separates relations into aligned rows', () => {
    const block: Extract<TextbookReadingBlock, { type: 'formula' }> = { id: 'sample', type: 'formula', parts: [{ type: 'math', latex: 'x^2+2xy+y^2-3x-3y+2=x^2+(2y-3)x+(y^2-3y+2)' }] }
    const rows = firstThemeFormulaRows(block)
    expect(rows.map(r => r.relation)).toEqual(['', '='])
    expect(rows[1].chunks).toContain('+(y^2-3y+2)')
    expect(rows.flatMap(r => r.chunks)).not.toContain('+2)')
    expect(firstThemeFormulaRows({ ...block, parts: [{ type: 'math', latex: 'T=a+b\\qquad X=x+2y' }] }).map(r => r.relation)).toEqual(['', '=', '', '='])
  })

  it('keeps source equation numbers in histories and prerequisite row views', () => {
    for (const [key, plan] of Object.entries(firstSectionTeachingPlans)) {
      const ids = Object.keys(plan.equationNumbers!).filter(id => !id.includes('#'))
      expect(ids.map(id => plan.equationNumbers![id])).toEqual(ids.map((_, i) => i + 1))
      for (const id of ids) expect(firstThemeEquationNumber('math-numbers-expressions-' + key, 's5-record-' + id)).toBe(plan.equationNumbers![id])
    }
    expect(firstThemeEquationNumber('math-numbers-expressions-n03', 's5-record-n03-s4-rules-summary#1')).toBe(firstThemeEquationNumber('math-numbers-expressions-n03', 'formula-n03-03'))
    expect(firstThemeEquationNumber('math-sets', 'formula-set-a')).toBeUndefined()
  })

  it('renders every current formula before and after answers without breaking mathematical tokens', () => {
    for (const unit of mathTextbookUnits.filter(u => Object.hasOwn(firstSectionTeachingPlans, u.unitId.split('-').at(-1)!))) {
      const section = unit.sections[0]
      const progress: TextbookUnitProgress = { unitId: unit.unitId, unitRevision: unit.revision, startedAt: 1, updatedAt: 2, answers: Object.fromEntries(section.items.map(q => [q.id, { itemId: q.id, value: q.answer, resolved: true, attemptCount: 1, isFirstCorrect: true, firstAnsweredAt: 1, lastAnsweredAt: 2 }])) }
      for (const block of section.readingFlow) if (block.type === 'formula') {
        for (const attempt of [undefined, progress]) {
          const html = renderToStaticMarkup(<TextbookFormula block={block} section={section} progress={attempt} unitId={unit.unitId} onOpen={() => {}} />)
          expect(html, block.id).not.toContain('katex-error')
          expect(html, block.id).not.toContain('§')
          for (const id of choices([block])) expect(html.match(new RegExp('data-testid="' + (attempt ? 'resolved-' : 'textbook-item-') + id + '"', 'g')), id).toHaveLength(1)
        }
      }
    }
  })
})
