import {test} from 'node:test';import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {fixture} from './production.test.mjs';
import {compileIR,validateIR} from '../ir/index.mjs';
const entry=fileURLToPath(new URL('../operations.mjs',import.meta.url));
const cli=input=>{const p=spawnSync(process.execPath,[entry,'compile-ir'],{input:JSON.stringify(input),encoding:'utf8'});assert.ok(p.stdout.trim(),p.stderr||'CLI produced no JSON');return {exit:p.status,output:JSON.parse(p.stdout)};};
function warningFixture(){const ir=fixture();ir.nodes[0].before[0].parts[0].text='p/(2^u5^v)';const warning=validateIR(ir).findings.find(x=>x.ruleId==='TEXT_MAY_CONTAIN_MATH');assert.ok(warning);return {ir,warning};}
const reviewed=warning=>[{findingId:warning.id,evidence:'TEST-ONLY reviewed prose exception fixture; not actual learner/native approval'}];
test('bare warning-free IR retains exact existing compiler output',()=>{const ir=fixture(),r=cli(ir);assert.equal(r.exit,0);assert.deepEqual(r.output,{status:'PASS',compiled:compileIR(ir)});});
test('warning-free envelope gives the same compiled output',()=>{const ir=fixture(),r=cli({ir,warningResolutions:[]});assert.equal(r.exit,0);assert.deepEqual(r.output.compiled,compileIR(ir));});
test('bare unresolved warnings remain rejected by unchanged compiler guard',()=>{const {ir}=warningFixture(),r=cli(ir);assert.equal(r.exit,1);assert.match(r.output.error,/unresolved semantic warning/);});
test('envelope without review still rejects unresolved warning',()=>{const {ir}=warningFixture();assert.equal(cli({ir}).exit,1);assert.equal(cli({ir,warningResolutions:[]}).exit,1);});
test('reviewed exact warning with evidence reaches original compiler without altering irHash',()=>{const {ir,warning}=warningFixture(),resolutions=reviewed(warning),r=cli({ir,warningResolutions:resolutions});assert.equal(r.exit,0);assert.equal(r.output.compiled.irHash,validateIR(ir).irHash);assert.deepEqual(r.output.compiled,compileIR(ir,{warningResolutions:resolutions}));});
test('wrong warning ID and extraneous ID do not silently pass',()=>{const {ir,warning}=warningFixture();assert.equal(cli({ir,warningResolutions:[{findingId:'not-a-real-warning',evidence:'test-only'}]}).exit,1);assert.equal(cli({ir,warningResolutions:[...reviewed(warning),{findingId:'extra',evidence:'test-only'}]}).exit,1);});
test('empty/string whitespace/object/array/null evidence rejects',()=>{const {ir,warning}=warningFixture();for(const evidence of ['', '  ',{},[],null,undefined])assert.equal(cli({ir,warningResolutions:[{findingId:warning.id,evidence}]}).exit,1,JSON.stringify(evidence));});
test('duplicate or nonarray resolution list rejects',()=>{const {ir,warning}=warningFixture();assert.equal(cli({ir,warningResolutions:{}}).exit,1);assert.equal(cli({ir,warningResolutions:[...reviewed(warning),...reviewed(warning)]}).exit,1);});
