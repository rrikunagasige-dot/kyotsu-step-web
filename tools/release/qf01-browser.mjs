// P010 QF01 production-condition browser QA. Does not publish or use a user session.
// The marked original assertion body is preserved byte-for-byte from fixed 46af.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

export const SOURCE_SHA = '46af88381ceba8d5e01ae5e26c64477eab42dbe9';
export const PUBLIC_BASE = 'https://rrikunagasige-dot.github.io/kyotsu-step-web/';
export const BASE_PATH = '/kyotsu-step-web/';
export const STORAGE_KEY = 'kyotsu-step-gate3-math-20261023';
export const WIDTHS = Object.freeze([320, 390, 430, 1440]);
export const ORIGINAL_WORKFLOW_SHA256 = 'ba182636bc2c28f13b45946151195a8c8ebb8fbdce43272c242f6b31df18cf09';
export const ORIGINAL_NODE_SHA256 = 'c51e976935a799e18b01b278cdfdb402728f29ed3e1a63c2198e022b4010cdd8';
export const ORIGINAL_ASSERTION_BODY_SHA256 = '380bb2a28c8111e7ec1679e647cebbc0a900c39b46433889d7c6fbbe6b3d426b';
const THIS_FILE = fileURLToPath(import.meta.url);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const requiredSourceFiles = Object.freeze({
  'src/data/textbook/math/quadratic/qf01Unit.json': '5d0868d5ec2cdd6d1851e2e8b0c83f7c3db51ec703e7db75aa26d77074afea74',
  'src/data/textbook/math/quadratic/qf01Presentation.json': '06e761a97c4c8ecd11816842b4bb392ceff7cc92568ce43056ea4539cc62d0b4',
  'src/pages/TextbookUnitPage.tsx': '81de2df3dfa1047ac1805f2fe43ca3ec67874f59f109fd716ab35a638b29e279',
  'src/data/textbook/math/index.ts': '40de08acf04c5756321545ccc75a85e6579087b5a99994eb5b7b683f6990be73',
});
let chromium;

export function safeRelative(value) {
  assert.equal(typeof value, 'string', 'INVALID_DIST_PATH');
  assert.ok(value && !value.includes('\\') && !value.startsWith('/') && !value.includes('\0'), 'INVALID_DIST_PATH');
  assert.ok(value.split('/').every(part => part && part !== '.' && part !== '..'), 'INVALID_DIST_PATH');
  return value;
}
function plainMap(value, label) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), label);
  for (const [name, digest] of Object.entries(value)) {
    safeRelative(name);
    assert.match(digest, /^[0-9a-f]{64}$/, label + ':' + name);
  }
  assert.ok(Object.keys(value).length, label + '_EMPTY');
  return value;
}
export function validateConfiguration(contract, manifest, contractBytes, env = process.env) {
  assert.equal(contract.schemaVersion, 'qf01-publisher/1', 'CONTRACT_SCHEMA');
  assert.equal(contract.sourceSHA, SOURCE_SHA, 'CONTRACT_SOURCE');
  assert.equal(contract.baselineSHA, '1ac9f31ec205424f393a488f0d17cb3bb8bc75fd', 'CONTRACT_BASELINE');
  assert.equal(contract.publicBase, PUBLIC_BASE, 'CONTRACT_PUBLIC_BASE');
  assert.equal(contract.basePath, BASE_PATH, 'CONTRACT_BASE_PATH');
  assert.equal(contract.storageKey, STORAGE_KEY, 'CONTRACT_STORAGE_KEY');
  assert.deepEqual(contract.expectedWidths, WIDTHS, 'CONTRACT_WIDTHS');
  assert.equal(contract.qf01.unitId, 'math-quadratic-qf01', 'CONTRACT_UNIT');
  assert.equal(contract.qf01.statesPerWidth, 129, 'CONTRACT_STATES');
  assert.equal(contract.qf01.decisions, 25, 'CONTRACT_DECISIONS');
  assert.equal(contract.qf01.stages, 9, 'CONTRACT_STAGES');
  assert.equal(manifest.schemaVersion, 'qf01-dist/1', 'DIST_MANIFEST_SCHEMA');
  assert.equal(manifest.sourceSHA, SOURCE_SHA, 'DIST_MANIFEST_SOURCE');
  assert.match(env.PUBLISHER_SHA ?? '', /^[0-9a-f]{40}$/, 'PUBLISHER_SHA_REQUIRED');
  assert.equal(manifest.publisherSHA, env.PUBLISHER_SHA, 'DIST_MANIFEST_PUBLISHER');
  assert.equal(manifest.contractSHA256, hash(contractBytes), 'DIST_MANIFEST_CONTRACT');
  assert.equal(manifest.storageKey, STORAGE_KEY, 'DIST_MANIFEST_STORAGE_KEY');
  assert.equal(manifest.basePath, BASE_PATH, 'DIST_MANIFEST_BASE_PATH');
  plainMap(manifest.files, 'DIST_MANIFEST_FILES');
  assert.ok(Object.hasOwn(manifest.files, 'index.html') && Object.hasOwn(manifest.files, 'qf01-release.json'), 'REQUIRED_DIST_ENTRIES');
  if (env.SOURCE_SHA !== undefined) assert.equal(env.SOURCE_SHA, SOURCE_SHA, 'ENV_SOURCE');
  if (env.STORAGE_KEY !== undefined) assert.equal(env.STORAGE_KEY, STORAGE_KEY, 'ENV_STORAGE_KEY');
  if (env.VITE_STORAGE_NAMESPACE !== undefined) assert.equal(env.VITE_STORAGE_NAMESPACE, STORAGE_KEY, 'ENV_STORAGE_NAMESPACE');
  const url = new URL(env.APP_URL ?? 'http://127.0.0.1:4173/kyotsu-step-web/');
  assert.equal(url.username, ''); assert.equal(url.password, '');
  assert.equal(url.search, ''); assert.equal(url.hash, '');
  const isPublic = url.href === PUBLIC_BASE;
  const isLocal = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname === BASE_PATH;
  assert.ok(isPublic || isLocal, 'APP_URL_MUST_BE_EXACT_PUBLIC_BASE_OR_LOCAL_PRODUCTION_BASE');
  const widths = env.WIDTH === undefined ? [...WIDTHS] : [Number(env.WIDTH)];
  assert.ok(widths.every(width => WIDTHS.includes(width)), 'INVALID_WIDTH');
  return {appURL: url.href, isPublic, widths};
}
export function distSnapshot(directory) {
  const entries = [];
  function visit(relative = '') {
    for (const entry of fs.readdirSync(path.join(directory, relative), {withFileTypes: true}).sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const name = relative ? relative + '/' + entry.name : entry.name;
      safeRelative(name);
      assert.ok(!entry.isSymbolicLink(), 'DIST_SYMLINK:' + name);
      if (entry.isDirectory()) visit(name);
      else { assert.ok(entry.isFile(), 'DIST_NOT_REGULAR_FILE:' + name); entries.push([name, hash(fs.readFileSync(path.join(directory, name)))]); }
    }
  }
  assert.ok(fs.statSync(directory).isDirectory(), 'DIST_ROOT_NOT_DIRECTORY');
  visit();
  return Object.fromEntries(entries);
}
export function verifyDist(directory, manifest) {
  const actual = distSnapshot(directory);
  assert.deepEqual(actual, manifest.files, 'FULL_DIST_FILE_SET_OR_BYTES_CHANGED');
  return actual;
}
function gitHead(directory) {
  return execFileSync('git', ['-C', directory, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
}
function verifySource(sourceRoot, publisherSHA) {
  assert.equal(gitHead(sourceRoot), SOURCE_SHA, 'SOURCE_CHECKOUT_HEAD');
  assert.equal(gitHead(path.dirname(THIS_FILE)), publisherSHA, 'PUBLISHER_CHECKOUT_HEAD');
  const publisherRoot = execFileSync('git', ['-C', path.dirname(THIS_FILE), 'rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim();
  const scriptRelative = path.relative(publisherRoot, THIS_FILE).split(path.sep).join('/');
  assert.equal(scriptRelative, 'tools/release/qf01-browser.mjs', 'PUBLISHER_SCRIPT_PATH');
  assert.equal(hash(execFileSync('git', ['-C', publisherRoot, 'show', publisherSHA + ':' + scriptRelative])), hash(fs.readFileSync(THIS_FILE)), 'PUBLISHER_SCRIPT_UNCOMMITTED_CHANGE');
  execFileSync('git', ['-C', sourceRoot, 'diff', '--quiet', 'HEAD', '--', 'src', 'public', 'package.json', 'pnpm-lock.yaml'], {stdio: 'pipe'});
  assert.equal(execFileSync('git', ['-C', sourceRoot, 'ls-files', '--others', '--', 'src', 'public'], {encoding: 'utf8'}).trim(), '', 'SOURCE_UNTRACKED_APPLICATION_FILES');
  for (const [name, expected] of Object.entries(requiredSourceFiles)) assert.equal(hash(fs.readFileSync(path.join(sourceRoot, name))), expected, 'SOURCE_BYTES:' + name);
  return {sourceSHA: SOURCE_SHA, publisherSHA, sourceFiles: {...requiredSourceFiles}, publisherScriptSHA256: hash(fs.readFileSync(THIS_FILE)), trackedApplicationSourceClean: true};
}
function ensureOutside(child, directory, label) {
  const rel = path.relative(directory, child);
  assert.ok(rel && (rel.startsWith('..' + path.sep) || rel === '..' || path.isAbsolute(rel)), label);
}
function canonicalOutput(directory) {
  let ancestor = directory;
  const suffix = [];
  while (!fs.existsSync(ancestor)) {
    suffix.unshift(path.basename(ancestor));
    const parent = path.dirname(ancestor);
    assert.notEqual(parent, ancestor, 'OUTPUT_NO_EXISTING_ANCESTOR');
    ancestor = parent;
  }
  return path.join(fs.realpathSync(ancestor), ...suffix);
}
function freshDirectory(directory) {
  if (fs.existsSync(directory)) assert.deepEqual(fs.readdirSync(directory), [], 'OUTPUT_EXISTS_PRESERVE_PRIOR_EVIDENCE:' + directory);
  else fs.mkdirSync(directory, {recursive: true});
}
export function verifyRelease(release, manifest) {
  for (const key of ['sourceSHA', 'publisherSHA', 'contractSHA256', 'storageKey', 'basePath']) assert.equal(release[key], manifest[key], 'RELEASE_BINDING:' + key);
}
export async function httpSourceProof(appURL, manifest) {
  const receipts = [];
  for (const name of Object.keys(manifest.files).sort()) {
    const target = new URL(name.split('/').map(encodeURIComponent).join('/'), appURL);
    const response = await fetch(target, {cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(30000)});
    assert.equal(response.status, 200, 'HTTP_ASSET_STATUS:' + name);
    assert.equal(new URL(response.url).origin, new URL(appURL).origin, 'HTTP_ASSET_ORIGIN:' + name);
    const bytes = Buffer.from(await response.arrayBuffer());
    const actual = hash(bytes);
    assert.equal(actual, manifest.files[name], 'HTTP_ASSET_BYTES:' + name);
    if (name === 'qf01-release.json') verifyRelease(JSON.parse(bytes.toString('utf8')), manifest);
    receipts.push({file: name, url: target.href, resolvedURL: response.url, status: response.status, expectedSHA256: manifest.files[name], actualSHA256: actual, bytes: bytes.length});
  }
  return {sourceSHA: manifest.sourceSHA, publisherSHA: manifest.publisherSHA, appBase: appURL, allManifestFilesMatched: true, files: receipts};
}

async function runOriginalAssertionBody() {
// BEGIN EXACT ORIGINAL ASSERTION BODY
const sourceSHA=process.env.SOURCE_SHA,width=Number(process.env.WIDTH),out=process.env.OUT;
assert.match(sourceSHA??'',/^[0-9a-f]{40}$/);
assert.ok([320,390,430,1440].includes(width));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const unitPath='src/data/textbook/math/quadratic/qf01Unit.json';
const displayPath='src/data/textbook/math/quadratic/qf01Presentation.json';
const unit=read(unitPath),display=read(displayPath),items=unit.sections[0].items;
assert.equal(unit.unitId,'math-quadratic-qf01');
assert.equal(items.length,25);assert.equal(display.nodes.length,25);
assert.equal(display.stages.length,9);assert.equal(unit.requiredInteractionRefs.length,25);
assert.deepEqual(display.nodes.map(n=>n.interaction),items.map(i=>i.id));
assert.deepEqual(unit.requiredInteractionRefs,items.map(i=>i.id));
const files=[unitPath,displayPath,'src/pages/TextbookUnitPage.tsx','src/data/textbook/math/index.ts'];
const sourceFiles=Object.fromEntries(files.map(p=>[p,hash(fs.readFileSync(p))]));
fs.mkdirSync(out+'/png',{recursive:true});fs.mkdirSync(out+'/states',{recursive:true});
const report={sourceSHA,width,route:'/#/learning/textbook/'+unit.unitId,
  scope:'QF01_25_DECISIONS_ALL_50_WRONG_VALUES_AND_RELOAD',status:'RUNNING',
  sourceFiles,unitId:unit.unitId,revision:unit.revision,
  ci:{runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT},
  images:[],states:[],answers:[],errors:[],
  limits:['Not a deployment or user acceptance','Measurements and assertions need nonauthor review; no automatic teaching-quality label','Reload probes at decision13 and decision25, not every historical saved revision','No claim of unrelated-unit regression coverage']};
const persist=()=>fs.writeFileSync(out+'/REPORT.json',JSON.stringify(report,null,2)+'\n');persist();
let ready=false;for(let i=0;i<60;i++){try{if((await fetch(process.env.APP_URL)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,500))}
if(!ready)throw Error('PREVIEW_NOT_READY');
const browser=await chromium.launch({headless:true});
try{
  report.browserVersion=browser.version();
  // One independent context per matrix job; no production/user session.
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();
  page.on('pageerror',e=>{report.errors.push(String(e));persist()});
  page.setDefaultTimeout(20000);
  await page.goto(process.env.APP_URL+'#/learning/textbook/'+unit.unitId);
  await page.getByTestId('textbook-reading-flow').waitFor({state:'visible'});
  await page.evaluate(()=>document.fonts.ready);
  const progress=()=>page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)??'null')?.state?.textbookProgress?.[id]??null,{key:process.env.STORAGE_KEY,id:unit.unitId});
  const record=async id=>(await progress())?.answers?.[id];
  const current=()=>page.locator('.math-textbook-stage--current');
  async function unchangedReferences(node){
    const actual=await current().locator('.math-textbook-stage-references [data-result-source]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-result-source')));
    assert.deepEqual(actual,node.knownRefs,'EXACT_KNOWN_RESULTS:'+node.id);
  }
  async function noFuture(i,allowNextQuestion=false){
    for(const future of display.nodes.slice(i+1)){
      if(!(allowNextQuestion&&future===display.nodes[i+1]))assert.equal(await page.getByTestId('textbook-item-'+future.interaction).count(),0,'FUTURE_ANSWER_CONTROL:'+future.id);
      const s=display.semantic.nodes.find(n=>n.id===future.id);
      for(const b of s.after)assert.equal(await page.locator('[data-block-id="'+b.id+'"]').count(),0,'FUTURE_COMPLETED_TEXT:'+future.id);
    }
  }
  async function capture(label,node,selectedValue=null){
    await page.evaluate(()=>document.fonts.ready);
    // Full-page PNG must be captured from the page top. Preserve the
    // learner viewport separately; never hide sticky/skip-link UI.
    const learnerViewport=await page.evaluate(()=>({scrollX,scrollY,width:innerWidth,height:innerHeight}));
    await page.evaluate(async()=>{
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      window.scrollTo({left:0,top:0,behavior:'instant'});
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    });
    const captureViewport=await page.evaluate(()=>({scrollX,scrollY,width:innerWidth,height:innerHeight}));
    assert.equal(captureViewport.scrollX,0,'CAPTURE_NOT_AT_LEFT:'+label);
    assert.equal(captureViewport.scrollY,0,'CAPTURE_NOT_AT_TOP:'+label);
    const measurements=await page.evaluate(()=>({
      viewport:{width:innerWidth,height:innerHeight},documentWidth:document.documentElement.scrollWidth,
      horizontalOverflow:document.documentElement.scrollWidth>innerWidth,
      katexErrors:document.querySelectorAll('.katex-error').length,
      fontsReady:document.fonts.status,
      currentText:document.querySelector('.math-textbook-stage--current')?.textContent,
      math:Array.from(document.querySelectorAll('.math-textbook-stage--current .katex')).map(e=>({
        text:e.textContent,fontSize:getComputedStyle(e).fontSize,
        rect:(()=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()
      }))
    }));
    assert.equal(measurements.horizontalOverflow,false,'DOCUMENT_OVERFLOW:'+label);
    assert.equal(measurements.katexErrors,0,'INVALID_MATH:'+label);
    const stem=String(report.states.length).padStart(3,'0')+'-'+label;
    const png='png/'+stem+'.png',state='states/'+stem+'.json';
    try{
      await page.screenshot({path:out+'/'+png,fullPage:true});
    } finally {
      await page.evaluate(async previous=>{
        window.scrollTo({left:previous.scrollX,top:previous.scrollY,behavior:'instant'});
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      },learnerViewport);
    }
    const restoredViewport=await page.evaluate(()=>({scrollX,scrollY,width:innerWidth,height:innerHeight}));
    const image={file:png,sha256:hash(fs.readFileSync(out+'/'+png)),width,nodeId:node.id,label,selectedValue,
      fullPage:true,captureOrigin:'top-after-two-animation-frames',captureViewport};
    const data={sourceSHA,nodeId:node.id,interactionId:node.interaction,label,selectedValue,
      measurements,measurementViewport: captureViewport,learnerViewportBeforeCapture:learnerViewport,
      viewportAfterRestore:restoredViewport,progress:await progress(),image};
    fs.writeFileSync(out+'/'+state,JSON.stringify(data,null,2)+'\n');
    report.images.push(image);report.states.push({file:state,sha256:hash(fs.readFileSync(out+'/'+state)),image:png});persist();
  }
  for(let i=0;i<items.length;i++){
    const item=items[i],node=display.nodes[i],compiled=display.semantic.nodes.find(n=>n.id===node.id);
    if(await page.getByTestId('textbook-item-'+item.id).count()===0){
      await page.getByTestId('math-textbook-next-stage').click();
    }
    await page.getByTestId('textbook-item-'+item.id).waitFor({state:'visible'});
    await page.getByTestId('math-textbook-stage-'+node.stageId).waitFor({state:'visible'});
    await unchangedReferences(node);await noFuture(i);
    for(const b of compiled.after)assert.equal(await page.locator('[data-block-id="'+b.id+'"]').count(),0,'CURRENT_ANSWER_EARLY:'+node.id);
    await capture(node.id+'-before',node);
    await page.getByTestId('textbook-item-'+item.id).click();
    const panel=page.getByTestId('inline-choice-panel-'+item.id);
    await panel.waitFor({state:'visible'});
    const shown=await panel.locator('button.reading-choice-option').evaluateAll(ns=>ns.map(n=>n.getAttribute('aria-label')));
    assert.equal(shown.length,item.choices.length);assert.deepEqual([...shown].sort(),[...item.choices].sort());
    await capture(node.id+'-choices',node);
    const wrongs=item.choices.filter(v=>v!==item.answer&&!item.acceptedAnswers.includes(v));
    assert.equal(wrongs.length,2);
    for(let j=0;j<wrongs.length;j++){
      const wrong=wrongs[j];await panel.getByRole('button',{name:wrong,exact:true}).click();
      const saved=await record(item.id);
      assert.equal(saved.value,wrong);assert.equal(saved.resolved,false);
      await page.getByTestId('textbook-hint-'+item.id).waitFor({state:'visible'});
      assert.equal(await page.getByTestId('textbook-item-'+item.id).count(),1,'WRONG_ADVANCED');
      await unchangedReferences(node);await noFuture(i);
      await capture(node.id+'-wrong-'+j,node,wrong);
    }
    if([12,24].includes(i)){
      const before=await progress();await page.reload();await page.getByTestId('textbook-item-'+item.id).waitFor({state:'visible'});
      assert.deepEqual(await progress(),before,'WRONG_RELOAD_CHANGED_PROGRESS');
      await unchangedReferences(node);await noFuture(i);
      await capture(node.id+'-reload-wrong',node,wrongs.at(-1));
      await page.getByTestId('textbook-item-'+item.id).click();
    }
    await page.getByTestId('inline-choice-panel-'+item.id).getByRole('button',{name:item.answer,exact:true}).click();
    const saved=await record(item.id);assert.equal(saved.value,item.answer);assert.equal(saved.resolved,true);assert.equal(saved.attemptCount,3);
    for(const b of compiled.before.filter(b=>b.id.startsWith(node.id+'-interaction'))){
      assert.equal(await page.locator('[data-block-id="'+b.id+'"]').count(),0,'COMPLETED_QUESTION_RETAINED:'+node.id);
    }
    for(const b of compiled.after)await page.locator('[data-block-id="'+b.id+'"]').first().waitFor({state:'visible'});
    await noFuture(i,true);await capture(node.id+'-correct',node,item.answer);
    if([12,24].includes(i)){
      const before=await progress();await page.reload();await page.getByTestId('textbook-reading-flow').waitFor({state:'visible'});
      assert.deepEqual(await progress(),before,'CORRECT_RELOAD_CHANGED_PROGRESS');
      for(const b of compiled.before.filter(b=>b.id.startsWith(node.id+'-interaction')))assert.equal(await page.locator('[data-block-id="'+b.id+'"]').count(),0,'RELOAD_RETAINED_QUESTION');
      await noFuture(i,true);await capture(node.id+'-reload-correct',node,item.answer);
    }
    report.answers.push({nodeId:node.id,itemId:item.id,wrongValues:wrongs,correctValue:item.answer});persist();
  }
  await page.getByTestId('qf01-complete').waitFor({state:'visible'});
  const saved=await progress();assert.equal(Object.keys(saved.answers).length,25);
  assert.ok(Object.values(saved.answers).every(a=>a.resolved&&a.attemptCount===3));
  assert.equal(report.answers.length,25);assert.equal(report.answers.flatMap(a=>a.wrongValues).length,50);
  assert.deepEqual(report.errors,[]);
  for(const [p,h]of Object.entries(sourceFiles))assert.equal(hash(fs.readFileSync(p)),h,'SOURCE_MUTATED:'+p);
  report.coverage={correct:25,wrong:50,reloadWrong:2,reloadCorrect:2,stages:9,states:report.states.length};
  report.status='CAPTURE_AND_ASSERTIONS_PASSED_NOT_USER_ACCEPTANCE';persist();
  await context.close();
} catch(e){report.status='FAIL';report.failure=String(e);persist();throw e}
finally{await browser.close();persist()}
// END EXACT ORIGINAL ASSERTION BODY
}

function addReportBinding(out, binding, failure) {
  const reportPath = path.join(out, 'REPORT.json');
  if (!fs.existsSync(reportPath)) {
    fs.writeFileSync(reportPath, JSON.stringify({status: 'FAIL_BEFORE_BROWSER', sourceSHA: SOURCE_SHA, errors: [], images: [], states: []}, null, 2) + '\n');
  }
  const report = json(reportPath);
  report.originalWorkflowRoute ??= report.route;
  report.route = BASE_PATH + '#/learning/textbook/math-quadratic-qf01';
  report.actualAppURL = binding.appURL + '#/learning/textbook/math-quadratic-qf01';
  report.publisherBinding = binding;
  report.assertionProvenance = {workflowSource: SOURCE_SHA, workflowPath: '.github/workflows/qf01-browser-qa.yml', workflowSHA256: ORIGINAL_WORKFLOW_SHA256, originalNodeSHA256: ORIGINAL_NODE_SHA256, exactAssertionBodySHA256: ORIGINAL_ASSERTION_BODY_SHA256, assertionBodyChanged: false};
  report.userAcceptance = false;
  if (failure) { report.status = 'FAIL'; report.bindingOrBrowserFailure = String(failure); }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  return report;
}
export function checkFullCoverage(report) {
  assert.equal(report.status, 'CAPTURE_AND_ASSERTIONS_PASSED_NOT_USER_ACCEPTANCE');
  assert.deepEqual(report.coverage, {correct:25, wrong:50, reloadWrong:2, reloadCorrect:2, stages:9, states:129}, 'EXACT_ORIGINAL_COVERAGE');
  assert.equal(report.images.length, 129); assert.equal(report.states.length, 129);
  const counts = {before:0, choices:0, wrong:0, correct:0, reloadWrong:0, reloadCorrect:0};
  for (const image of report.images) {
    const label = image.label;
    if (label.endsWith('-reload-wrong')) counts.reloadWrong++;
    else if (label.endsWith('-reload-correct')) counts.reloadCorrect++;
    else if (label.endsWith('-before')) counts.before++;
    else if (label.endsWith('-choices')) counts.choices++;
    else if (/-wrong-[01]$/.test(label)) counts.wrong++;
    else if (label.endsWith('-correct')) counts.correct++;
    else assert.fail('UNEXPECTED_CAPTURE_LABEL:' + label);
  }
  assert.deepEqual(counts, {before:25, choices:25, wrong:50, correct:25, reloadWrong:2, reloadCorrect:2}, 'STATE_CATEGORY_COVERAGE');
}
export async function main(env = process.env) {
  assert.ok(env.QF01_CONTRACT && env.QF01_DIST_MANIFEST, 'CONTRACT_AND_DIST_MANIFEST_REQUIRED');
  const originalCwd = process.cwd();
  const sourceRoot = fs.realpathSync(path.resolve(env.SOURCE_ROOT ?? originalCwd));
  const distRoot = fs.realpathSync(path.resolve(env.DIST_ROOT ?? path.join(sourceRoot, 'dist')));
  const contractPath = fs.realpathSync(path.resolve(env.QF01_CONTRACT));
  const manifestPath = fs.realpathSync(path.resolve(env.QF01_DIST_MANIFEST));
  ensureOutside(manifestPath, distRoot, 'DIST_MANIFEST_MUST_BE_OUTSIDE_DIST');
  const contractBytes = fs.readFileSync(contractPath), manifestBytes = fs.readFileSync(manifestPath);
  const contract = JSON.parse(contractBytes), manifest = JSON.parse(manifestBytes);
  const configuration = validateConfiguration(contract, manifest, contractBytes, env);
  verifyDist(distRoot, manifest);
  verifyRelease(json(path.join(distRoot, 'qf01-release.json')), manifest);
  const sourceProof = verifySource(sourceRoot, manifest.publisherSHA);
  const outputRoot = canonicalOutput(path.resolve(env.OUT ?? '/tmp/qf01-production-browser-' + (env.GITHUB_RUN_ID ?? process.pid)));
  for (const protectedDir of [distRoot, path.join(sourceRoot, 'src'), path.join(sourceRoot, 'public'), path.join(sourceRoot, '.git')]) ensureOutside(outputRoot, protectedDir, 'OUTPUT_OVERLAPS_PROTECTED_DIRECTORY');
  freshDirectory(outputRoot);
  const requireFromSource = createRequire(path.join(sourceRoot, 'package.json'));
  ({chromium} = requireFromSource('@playwright/test'));
  const summary = {sourceSHA: SOURCE_SHA, publisherSHA: manifest.publisherSHA, contractSHA256: hash(contractBytes), distManifestSHA256: hash(manifestBytes), appURL: configuration.appURL, publicHTTPProof: configuration.isPublic, storageKey: STORAGE_KEY, widths: configuration.widths, status: 'RUNNING', results: [], userAcceptance: false};
  const persistSummary = () => fs.writeFileSync(path.join(outputRoot, 'QF01_BROWSER_RESULT.json'), JSON.stringify(summary, null, 2) + '\n');
  persistSummary();
  const oldEnv = Object.fromEntries(['SOURCE_SHA','WIDTH','OUT','APP_URL','STORAGE_KEY'].map(key => [key, process.env[key]]));
  try {
    process.chdir(sourceRoot);
    for (const width of configuration.widths) {
      const widthOut = configuration.widths.length === 1 ? outputRoot : path.join(outputRoot, String(width));
      if (widthOut !== outputRoot) freshDirectory(widthOut);
      const binding = {...sourceProof, appURL: configuration.appURL, publicHTTPProof: configuration.isPublic, width, storageKey: STORAGE_KEY, basePath: BASE_PATH, contractSHA256: hash(contractBytes), distManifestSHA256: hash(manifestBytes), distFiles: manifest.files};
      try {
        const before = await httpSourceProof(configuration.appURL, manifest);
        fs.writeFileSync(path.join(widthOut, 'HTTP_SOURCE_BEFORE.json'), JSON.stringify(before, null, 2) + '\n');
        Object.assign(process.env, {SOURCE_SHA, WIDTH: String(width), OUT: widthOut, APP_URL: configuration.appURL, STORAGE_KEY});
        await runOriginalAssertionBody();
        let report = addReportBinding(widthOut, binding);
        checkFullCoverage(report);
        verifyDist(distRoot, manifest);
        assert.equal(hash(fs.readFileSync(contractPath)), hash(contractBytes), 'CONTRACT_CHANGED_DURING_QA');
        assert.equal(hash(fs.readFileSync(manifestPath)), hash(manifestBytes), 'DIST_MANIFEST_CHANGED_DURING_QA');
        verifySource(sourceRoot, manifest.publisherSHA);
        const after = await httpSourceProof(configuration.appURL, manifest);
        fs.writeFileSync(path.join(widthOut, 'HTTP_SOURCE_AFTER.json'), JSON.stringify(after, null, 2) + '\n');
        report = addReportBinding(widthOut, {...binding, beforeHTTPProofSHA256: hash(fs.readFileSync(path.join(widthOut, 'HTTP_SOURCE_BEFORE.json'))), afterHTTPProofSHA256: hash(fs.readFileSync(path.join(widthOut, 'HTTP_SOURCE_AFTER.json')))});
        summary.results.push({width, states: report.states.length, reportPath: path.join(widthOut, 'REPORT.json'), reportSHA256: hash(fs.readFileSync(path.join(widthOut, 'REPORT.json'))), coverage: report.coverage, status: report.status});
        persistSummary();
      } catch (error) {
        addReportBinding(widthOut, binding, error);
        throw error;
      }
    }
    summary.status = 'QF01_PRODUCTION_CONDITION_QA_PASSED_NOT_USER_ACCEPTANCE';
    persistSummary();
    console.log(JSON.stringify({status: summary.status, sourceSHA: SOURCE_SHA, publisherSHA: manifest.publisherSHA, widths: configuration.widths, states: summary.results.reduce((n,row) => n + row.states, 0), output: outputRoot}));
    return summary;
  } catch (error) {
    summary.status = 'FAIL'; summary.failure = String(error); persistSummary(); throw error;
  } finally {
    process.chdir(originalCwd);
    for (const [key, value] of Object.entries(oldEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === THIS_FILE) main().catch(error => { console.error(error); process.exitCode = 1; });
