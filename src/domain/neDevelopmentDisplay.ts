// W-MATH-003/P-005: exact-value display rows; never used for answer comparison.
const rows: Readonly<Record<string, readonly string[]>> = {
  "ne01-01|(x+3)(x^2+6x+9)": [
    "(x+3)(x^2+6x+9)"
  ],
  "ne01-01|(x+3)(x^2+9)": [
    "(x+3)(x^2+9)"
  ],
  "ne01-01|(x+3)(x^2+3x+9)": [
    "(x+3)(x^2+3x+9)"
  ],
  "ne01-02|x^3+9x^2+27x+27": [
    "x^3+9x^2+27x+27"
  ],
  "ne01-02|x^3+27": [
    "x^3+27"
  ],
  "ne01-02|x^3+6x^2+9x+27": [
    "x^3+6x^2+9x+27"
  ],
  "ne01-03|(a+b)(a^2+2ab+b^2)": [
    "(a+b)(a^2+2ab+b^2)"
  ],
  "ne01-03|(a+b)(a^2+b^2)": [
    "(a+b)(a^2+b^2)"
  ],
  "ne01-03|(a+b)(a^2+ab+b^2)": [
    "(a+b)(a^2+ab+b^2)"
  ],
  "ne01-04|a^3+2a^2b+ab^2+a^2b+2ab^2+b^3": [
    "a^3+2a^2b+ab^2",
    "+a^2b+2ab^2+b^3"
  ],
  "ne01-04|a^3+2a^2b+ab^2+b^3": [
    "a^3+2a^2b+ab^2",
    "+b^3"
  ],
  "ne01-04|a^3+2a^2b+ab^2+a^2b+ab^2+b^3": [
    "a^3+2a^2b+ab^2",
    "+a^2b+ab^2+b^3"
  ],
  "ne01-05|a^3+3a^2b+3ab^2+b^3": [
    "a^3+3a^2b+3ab^2+b^3"
  ],
  "ne01-05|a^3+2a^2b+2ab^2+b^3": [
    "a^3+2a^2b+2ab^2+b^3"
  ],
  "ne01-05|a^3+3a^2b+3ab^2-b^3": [
    "a^3+3a^2b+3ab^2-b^3"
  ],
  "ne01-06|a^3-3a^2b+3ab^2-b^3": [
    "a^3-3a^2b+3ab^2-b^3"
  ],
  "ne01-06|a^3-3a^2b-3ab^2-b^3": [
    "a^3-3a^2b-3ab^2-b^3"
  ],
  "ne01-06|a^3+3a^2b+3ab^2-b^3": [
    "a^3+3a^2b+3ab^2-b^3"
  ],
  "ne01-07|x^3-6x^2+12x-8": [
    "x^3-6x^2+12x-8"
  ],
  "ne01-07|x^3-6x^2-12x-8": [
    "x^3-6x^2-12x-8"
  ],
  "ne01-07|x^3-8": [
    "x^3-8"
  ],
  "ne01-08|3ab(a+b)": [
    "3ab(a+b)"
  ],
  "ne01-08|3ab(a-b)": [
    "3ab(a-b)"
  ],
  "ne01-08|ab(a+b)": [
    "ab(a+b)"
  ],
  "ne01-09|(a+b)((a+b)^2-3ab)": [
    "(a+b)((a+b)^2-3ab)"
  ],
  "ne01-09|(a+b)((a+b)^2+3ab)": [
    "(a+b)((a+b)^2+3ab)"
  ],
  "ne01-09|(a+b)((a+b)-3ab)": [
    "(a+b)((a+b)-3ab)"
  ],
  "ne01-10|(a+b)(a^2-ab+b^2)": [
    "(a+b)(a^2-ab+b^2)"
  ],
  "ne01-10|(a+b)(a^2+ab+b^2)": [
    "(a+b)(a^2+ab+b^2)"
  ],
  "ne01-10|(a+b)(a^2-3ab+b^2)": [
    "(a+b)(a^2-3ab+b^2)"
  ],
  "ne01-11|(a-b)(a^2+ab+b^2)": [
    "(a-b)(a^2+ab+b^2)"
  ],
  "ne01-11|(a-b)(a^2-ab+b^2)": [
    "(a-b)(a^2-ab+b^2)"
  ],
  "ne01-11|(a-b)(a^2+ab-b^2)": [
    "(a-b)(a^2+ab-b^2)"
  ],
  "ne01-12|x^3-1^3\\quad;\\quad(2x)^3+(3y)^3": [
    "x^3-1^3",
    "(2x)^3+(3y)^3"
  ],
  "ne01-12|x^3-1^3\\quad;\\quad(8x)^3+(27y)^3": [
    "x^3-1^3",
    "(8x)^3+(27y)^3"
  ],
  "ne01-12|x^3-1^3\\quad;\\quad(2x)^3-(3y)^3": [
    "x^3-1^3",
    "(2x)^3-(3y)^3"
  ],
  "ne01-13|(x-1)(x^2+x+1)\\quad;\\quad(2x+3y)(4x^2-6xy+9y^2)": [
    "(x-1)(x^2+x+1)",
    "(2x+3y)",
    "\\cdot(4x^2-6xy+9y^2)"
  ],
  "ne01-13|(x-1)(x^2-x+1)\\quad;\\quad(2x+3y)(4x^2-6xy+9y^2)": [
    "(x-1)(x^2-x+1)",
    "(2x+3y)",
    "\\cdot(4x^2-6xy+9y^2)"
  ],
  "ne01-13|(x-1)(x^2+x+1)\\quad;\\quad(2x+3y)(4x^2+6xy+9y^2)": [
    "(x-1)(x^2+x+1)",
    "(2x+3y)",
    "\\cdot(4x^2+6xy+9y^2)"
  ],
  "ne02-01|a+b+2\\sqrt{ab}": [
    "a+b+2\\sqrt{ab}"
  ],
  "ne02-01|a+b+\\sqrt{ab}": [
    "a+b+\\sqrt{ab}"
  ],
  "ne02-01|a+b+2ab": [
    "a+b+2ab"
  ],
  "ne02-02|a+b=5,\\quad ab=6": [
    "a+b=5,",
    "ab=6"
  ],
  "ne02-02|a+b=5,\\quad ab=3": [
    "a+b=5,",
    "ab=3"
  ],
  "ne02-02|a+b=5,\\quad ab=12": [
    "a+b=5,",
    "ab=12"
  ],
  "ne02-03|a=2,\\quad b=3\\quad(\\text{順不同})": [
    "a=2,",
    "b=3",
    "(\\text{順不同})"
  ],
  "ne02-03|a=1,\\quad b=4": [
    "a=1,",
    "b=4"
  ],
  "ne02-03|a=1,\\quad b=6": [
    "a=1,",
    "b=6"
  ],
  "ne02-04|\\sqrt2+\\sqrt3>0,\\quad\\sqrt{5+2\\sqrt6}=\\sqrt2+\\sqrt3": [
    "\\sqrt2+\\sqrt3>0,",
    "\\sqrt{5+2\\sqrt6}=\\sqrt2+\\sqrt3"
  ],
  "ne02-04|\\sqrt{5+2\\sqrt6}=-\\sqrt2-\\sqrt3": [
    "\\sqrt{5+2\\sqrt6}=-\\sqrt2-\\sqrt3"
  ],
  "ne02-04|\\sqrt{5+2\\sqrt6}=\\sqrt5+\\sqrt{2\\sqrt6}": [
    "\\sqrt{5+2\\sqrt6}=\\sqrt5+\\sqrt{2\\sqrt6}"
  ],
  "ne02-05|a+b-2\\sqrt{ab}": [
    "a+b-2\\sqrt{ab}"
  ],
  "ne02-05|a+b+2\\sqrt{ab}": [
    "a+b+2\\sqrt{ab}"
  ],
  "ne02-05|a-b-2\\sqrt{ab}": [
    "a-b-2\\sqrt{ab}"
  ],
  "ne02-06|a+b=9,\\quad ab=20": [
    "a+b=9,",
    "ab=20"
  ],
  "ne02-06|a+b=9,\\quad ab=5": [
    "a+b=9,",
    "ab=5"
  ],
  "ne02-06|a+b=9,\\quad ab=10": [
    "a+b=9,",
    "ab=10"
  ],
  "ne02-07|a=5,\\ b=4:\\ \\sqrt5-2\\quad\\text{または}\\quad a=4,\\ b=5:\\ 2-\\sqrt5": [
    "a=5,\\ b=4:\\ \\sqrt5-2",
    "\\text{または}",
    "a=4,\\ b=5:\\ 2-\\sqrt5"
  ],
  "ne02-07|a=8,\\ b=1:\\ \\sqrt8-1": [
    "a=8,\\ b=1:\\ \\sqrt8-1"
  ],
  "ne02-07|a=5,\\ b=4:\\ \\sqrt{5-4}": [
    "a=5,\\ b=4:\\ \\sqrt{5-4}"
  ],
  "ne02-08|\\sqrt5>2,\\quad\\sqrt{9-4\\sqrt5}=\\sqrt5-2": [
    "\\sqrt5>2,",
    "\\sqrt{9-4\\sqrt5}=\\sqrt5-2"
  ],
  "ne02-08|\\sqrt{9-4\\sqrt5}=2-\\sqrt5": [
    "\\sqrt{9-4\\sqrt5}=2-\\sqrt5"
  ],
  "ne02-08|\\sqrt{9-4\\sqrt5}=\\pm(\\sqrt5-2)": [
    "\\sqrt{9-4\\sqrt5}=\\pm(\\sqrt5-2)"
  ],
  "ne02-09|\\frac{6+2\\sqrt5}{2}": [
    "\\frac{6+2\\sqrt5}{2}"
  ],
  "ne02-09|\\frac{3+2\\sqrt5}{2}": [
    "\\frac{3+2\\sqrt5}{2}"
  ],
  "ne02-09|\\frac{6+\\sqrt5}{2}": [
    "\\frac{6+\\sqrt5}{2}"
  ],
  "ne02-10|\\frac{\\sqrt{6+2\\sqrt5}}{\\sqrt2}": [
    "\\frac{\\sqrt{6+2\\sqrt5}}{\\sqrt2}"
  ],
  "ne02-10|\\frac{\\sqrt{6+2\\sqrt5}}{2}": [
    "\\frac{\\sqrt{6+2\\sqrt5}}{2}"
  ],
  "ne02-10|\\frac{\\sqrt6+\\sqrt{2\\sqrt5}}{\\sqrt2}": [
    "\\frac{\\sqrt6+\\sqrt{2\\sqrt5}}{\\sqrt2}"
  ],
  "ne02-11|a+b=6,\\ ab=5;\\ \\{a,b\\}=\\{5,1\\};\\ \\sqrt{6+2\\sqrt5}=\\sqrt5+1": [
    "a+b=6,\\ ab=5",
    "\\ \\{a,b\\}=\\{5,1\\}",
    "\\ \\sqrt{6+2\\sqrt5}=\\sqrt5+1"
  ],
  "ne02-11|a+b=6,\\ ab=5;\\ \\{a,b\\}=\\{3,3\\};\\ \\sqrt{6+2\\sqrt5}=2\\sqrt3": [
    "a+b=6,\\ ab=5",
    "\\ \\{a,b\\}=\\{3,3\\}",
    "\\ \\sqrt{6+2\\sqrt5}=2\\sqrt3"
  ],
  "ne02-11|a+b=6,\\ ab=5;\\ \\{a,b\\}=\\{5,1\\};\\ \\sqrt{6+2\\sqrt5}=\\sqrt5-1": [
    "a+b=6,\\ ab=5",
    "\\ \\{a,b\\}=\\{5,1\\}",
    "\\ \\sqrt{6+2\\sqrt5}=\\sqrt5-1"
  ],
  "ne02-12|\\frac{\\sqrt{10}+\\sqrt2}{2}": [
    "\\frac{\\sqrt{10}+\\sqrt2}{2}"
  ],
  "ne02-12|\\frac{\\sqrt{10}+1}{2}": [
    "\\frac{\\sqrt{10}+1}{2}"
  ],
  "ne02-12|\\sqrt{10}+\\sqrt2": [
    "\\sqrt{10}+\\sqrt2"
  ]
}

export function neDevelopmentDisplayLines(itemId: string, value: string): string[] | undefined {
  const lines = rows[itemId + '|' + value]
  return lines ? [...lines] : undefined
}
