import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {operate} from '../operations.mjs';
const layoutPlan=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08LayoutR7.json'));
for(const measurements of [[],[{packets:[]}]])test('empty supplied actual geometry cannot pass '+JSON.stringify(measurements),()=>{const r=operate('layout-validate',{layoutPlan,measurements});assert.equal(r.status,'FAIL');assert.equal(r.reason,'ACTUAL_AXIS_MEASUREMENTS_REQUIRED')});
