// P013 QF01 production-condition browser QA. Does not publish or use a user session.
// Active assertions are exact P012 R2 at source384; old46af digests below are historical lineage only.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

export const SOURCE_SHA = '384021f539967038a20fd98bd146e0e499f0df65';
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
  'src/pages/TextbookUnitPage.tsx': '4d707eba705517612df88f04c1864bca2b6aab2d05aeda8596f4e406bfcec117',
  'src/data/textbook/math/mathCatalog.ts': '3e89a3851bc8bfdf27d981307750f646f91724802e25af1a46d35beba46c48c6',
  'src/pages/LearningSetupPage.tsx': 'e6d9b80ed1c5c6fa4b11c8d2ab584796e3e6aa2e5e7c92b1e2b7f3f59e98d892',
  'src/data/textbook/math/quadratic/qf01Lesson.ts': 'f9e1d2957dbc2160eafb6274ace8dd83449f99f9c956ae46e94c7b04228fa43a',
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

async function runCurrentAssertionBody() {
// BEGIN EXACT P012 R2 ASSERTION BODY
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
const files=[unitPath,displayPath,'src/pages/TextbookUnitPage.tsx','src/data/textbook/math/index.ts','src/data/textbook/math/quadratic/qf01Lesson.ts','src/data/textbook/math/mathCatalog.ts','src/pages/LearningSetupPage.tsx'];
assert.equal(hash(fs.readFileSync(unitPath)),'5d0868d5ec2cdd6d1851e2e8b0c83f7c3db51ec703e7db75aa26d77074afea74');
assert.equal(hash(fs.readFileSync(displayPath)),'06e761a97c4c8ecd11816842b4bb392ceff7cc92568ce43056ea4539cc62d0b4');
const sourceFiles=Object.fromEntries(files.map(p=>[p,hash(fs.readFileSync(p))]));
fs.mkdirSync(out+'/png',{recursive:true});fs.mkdirSync(out+'/states',{recursive:true});
const report={sourceSHA,width,route:'/#/learning/textbook/'+unit.unitId,
  scope:'QF01_25_DECISIONS_ALL_50_WRONG_VALUES_AND_RELOAD',status:'RUNNING',
  sourceFiles,unitId:unit.unitId,revision:unit.revision,
  ci:{runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT},
  images:[],states:[],answers:[],errors:[],supplemental:[],
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
  const menuURL=process.env.APP_URL+'#/learning/setup?mode=textbook&subject=math-1a';
  const foundation='math-textbook-topic-quadratic-functions-foundation';
  async function supplement(kind,data,targetPage=page){
    await targetPage.evaluate(()=>document.fonts.ready);
    const previous=await targetPage.evaluate(()=>({x:scrollX,y:scrollY}));
    await targetPage.evaluate(async()=>{scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
    assert.equal(await targetPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'SUPPLEMENT_OVERFLOW:'+kind);
    assert.equal(await targetPage.locator('.katex-error').count(),0);
    const dir=out+'/supplemental-png';fs.mkdirSync(dir,{recursive:true});
    const file='supplemental-png/'+String(report.supplemental.length).padStart(2,'0')+'-'+kind+'.png';
    await targetPage.screenshot({path:out+'/'+file,fullPage:true});
    await targetPage.evaluate(p=>scrollTo(p.x,p.y),previous);
    report.supplemental.push({kind,...data,image:{file,sha256:hash(fs.readFileSync(out+'/'+file)),sourceSHA,width,fullPage:true,captureOrigin:'top-after-two-animation-frames'}});persist();
  }
  async function menu(expectedCount){
    await page.goto(menuURL);
    const chapter=page.getByTestId('math-textbook-chapter-2');await chapter.waitFor({state:'visible'});
    const card=page.getByTestId(foundation);await card.waitFor({state:'visible'});
    await page.waitForFunction(id=>document.querySelector('[data-testid="'+id+'"]')?.tagName==='A',foundation);
    assert.equal(await card.evaluate(n=>n.tagName),'A');
    assert.equal(await card.getAttribute('href'),'#/learning/textbook/'+unit.unitId);
    const text=await chapter.innerText();
    for(const title of ['関数とグラフ','2次関数の最大・最小','2次関数と方程式・不等式'])assert.ok(text.includes(title),'MENU_TITLE:'+title);
    assert.ok((await card.innerText()).includes('公開中：関数の見方'));
    assert.ok((await card.innerText()).includes('公開中の内容：'+expectedCount+'/25 完了'));
    assert.ok(!(await card.innerText()).includes('100%'));
    for(const id of ['quadratic-functions-extrema','quadratic-functions-equations-inequalities']){
      const planned=page.getByTestId('math-textbook-topic-'+id);
      assert.equal(await planned.getAttribute('aria-disabled'),'true');assert.equal(await planned.evaluate(n=>n.tagName),'DIV');
      assert.equal(await planned.locator('a').count(),0);assert.ok(!(await planned.innerText()).includes('0/0'));
    }
    assert.deepEqual(await page.locator('[data-testid^="math-textbook-chapter-"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-testid'))),['math-textbook-chapter-1','math-textbook-chapter-2','math-textbook-chapter-3']);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'MENU_OVERFLOW');
    await supplement('menu-'+expectedCount,{expectedCount,text});
  }
  await menu(0);await page.getByTestId(foundation).click();
  await page.getByTestId('textbook-reading-flow').waitFor({state:'visible'});
  await page.evaluate(()=>document.fonts.ready);
  const progress=()=>page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)??'null')?.state?.textbookProgress?.[id]??null,{key:process.env.STORAGE_KEY,id:unit.unitId});
  const record=async id=>(await progress())?.answers?.[id];
  const current=()=>page.locator('.math-textbook-stage--current');
  const substitutionTex='4'+String.fromCharCode(92)+'times(-1)-6';
  const pilot=n=>['qf01-n03','qf01-n04'].includes(n.id);
  const group=()=>current().locator('[data-transformation-group="qf01-substitution-chain"]');
  const math=async locator=>locator.locator('annotation[encoding="application/x-tex"]').allTextContents();
  async function chain(substitutionDone,valueDone){
    assert.equal(await group().count(),1,'ONE_EXPRESSION_CHAIN');
    assert.equal(await group().getAttribute('data-transformation-kind'),'expression-chain');
    assert.deepEqual(await group().locator('[data-transformation-row]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-transformation-row'))),substitutionDone?['qf01-substitution','qf01-arithmetic','qf01-value']:['qf01-substitution']);
    assert.equal(await group().locator('.guided-step-caption,.reading-paragraph,.guided-thinking-step').count(),0,'NO_SEPARATE_QUESTIONS');
    assert.ok(!(await group().innerText()).includes('？'),'NO_INTERVENING_QUESTION');
    const row=id=>group().locator('[data-transformation-row="'+id+'"]');
    assert.deepEqual(await math(row('qf01-substitution').locator('.transformation-left')),['f(-1)']);
    const expected=substitutionDone?substitutionTex:null;
    assert.deepEqual(await math(row('qf01-substitution').locator('.transformation-right')),expected?[expected]:[]);
    if(substitutionDone){
      assert.deepEqual(await math(row('qf01-arithmetic').locator('.transformation-right')),['-4-6']);
      assert.deepEqual(await math(row('qf01-value').locator('.transformation-right')),valueDone?['-10']:[]);
      assert.equal(await row('qf01-substitution').locator('math mo').filter({hasText:'×'}).count(),1,'ONE_MULTIPLICATION');
    }else assert.ok(!(await group().innerText()).includes('−10'),'NO_RESULT_LEAK');
    assert.equal(await group().locator('.reading-inline-blank').count(),valueDone?0:1);
    const geometry=await group().locator('.transformation-relation').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return{x:r.x,right:r.right}}));
    if(geometry.length>1)assert.ok(Math.max(...geometry.map(r=>r.x))-Math.min(...geometry.map(r=>r.x))<2,'RELATIONS_ALIGNED');
    return {substitutionDone,valueDone,geometry,math:await math(group())};
  }
  const legacy=[];
  async function remember(label){legacy.push({label,progress:await progress()})}
  await remember('unstarted');

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
    if(pilot(node))await chain(i===3,false);
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
      if(pilot(node)){await chain(i===3,false);if(j===1)await remember(node.id+'-wrong');}
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
    if(pilot(node))await chain(true,i===3);
    else for(const b of compiled.after)await page.locator('[data-block-id="'+b.id+'"]').first().waitFor({state:'visible'});
    if([1,2,3,7,24].includes(i))await remember('completed-'+(i+1));
    if(i===4){
      const before=await progress();await page.getByTestId('qf01-history-toggle').click();
      const history=page.getByTestId('recorded-results-qf01-stage-2');
      const summary=history.locator('.guided-result').first();
      assert.equal(await summary.locator('[data-transformation-row]').count(),2,'COMPACT_HISTORY_TWO_ROWS');
      assert.deepEqual(await math(summary),['f(-1)','=','-4-6','=','-10']);
      const details=history.locator('details');await details.locator('summary').click();
      const full=details.locator('[data-transformation-group="qf01-substitution-chain"]');
      assert.equal(await full.count(),1);assert.equal(await full.locator('[data-transformation-row]').count(),3);
      assert.deepEqual(await math(full),['f(-1)','=',substitutionTex,'=','-4-6','=','-10']);
      assert.deepEqual(await progress(),before,'HISTORY_MUTATED_PROGRESS');
      await supplement('compact-and-full-history',{progress:before,compact:await math(summary),full:await math(full)});
      await page.getByTestId('qf01-history-toggle').click();
    }
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
  assert.equal(report.states.length,129,'ORIGINAL_STATE_COUNT_UNCHANGED');
  await menu(25);assert.deepEqual(await progress(),saved,'MENU_MUTATED_PROGRESS');
  assert.equal(legacy.length,8);
  for(const fixture of legacy){
    const frontier=items.findIndex(item=>!fixture.progress?.answers?.[item.id]?.resolved);
    const expectedStage=frontier<0?display.stages.at(-1).id:display.nodes[frontier].stageId;
    const cursor=display.stages.findIndex(stage=>stage.id===expectedStage);
    const oldContext=await browser.newContext({viewport:{width,height:1000}});const oldPage=await oldContext.newPage();
    oldPage.on('pageerror',e=>{report.errors.push(String(e));persist()});
    await oldPage.addInitScript(({key,id,progress,cursor})=>{
      const marker='p012-fixture-seeded';if(sessionStorage.getItem(marker))return;
      sessionStorage.setItem(marker,'1');
      if(progress)localStorage.setItem(key,JSON.stringify({state:{textbookProgress:{[id]:progress}},version:1}));
      localStorage.setItem('math-textbook-compact-v1:'+id+':r1:scope:qf01-v1',String(cursor));
    },{key:process.env.STORAGE_KEY,id:unit.unitId,progress:fixture.progress,cursor});
    const readOld=()=>oldPage.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)??'null')?.state?.textbookProgress?.[id]??null,{key:process.env.STORAGE_KEY,id:unit.unitId});
    await oldPage.goto(process.env.APP_URL+'#/learning/textbook/'+unit.unitId);await oldPage.getByTestId('textbook-reading-flow').waitFor();
    assert.deepEqual(await readOld(),fixture.progress,'OLD_REVISION1_LEDGER_CHANGED:'+fixture.label);
    const controls=await oldPage.locator('.math-textbook-stage--current [data-testid^="textbook-item-"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-testid')));
    const expectedControls=frontier<0?[]:['textbook-item-'+items[frontier].id];
    assert.deepEqual(controls,expectedControls,'OLD_REVISION1_EXPECTED_FRONTIER:'+fixture.label);
    await oldPage.getByTestId('math-textbook-stage-'+expectedStage).waitFor({state:'visible'});
    await oldPage.reload();await oldPage.getByTestId('textbook-reading-flow').waitFor();
    assert.deepEqual(await readOld(),fixture.progress,'OLD_REVISION1_RELOAD_CHANGED:'+fixture.label);
    assert.deepEqual(await oldPage.locator('.math-textbook-stage--current [data-testid^="textbook-item-"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-testid'))),controls,'OLD_REVISION1_RELOAD_CONTROLS:'+fixture.label);
    assert.equal(await oldPage.locator('.katex-error').count(),0);
    assert.equal(await oldPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'OLD_SAVE_OVERFLOW:'+fixture.label);
    await supplement('revision1-'+fixture.label,{label:fixture.label,progress:fixture.progress,controls,expectedStage},oldPage);await oldContext.close();
  }
  assert.equal(report.supplemental.length,11);assert.deepEqual(report.errors,[]);
  report.coverage={correct:25,wrong:50,reloadWrong:2,reloadCorrect:2,stages:9,states:report.states.length};
  report.status='CAPTURE_AND_ASSERTIONS_PASSED_NOT_USER_ACCEPTANCE';persist();
  await context.close();
} catch(e){report.status='FAIL';report.failure=String(e);persist();throw e}
finally{await browser.close();persist()}
// END EXACT P012 R2 ASSERTION BODY
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
  report.assertionProvenance = {workflowSource: SOURCE_SHA, workflowPath: '.github/workflows/qf01-browser-qa.yml', workflowSHA256: '3321e684f159a9b9dcc5333948524d94b51967c993fd158380756853827e742d', activeAssertionBodySHA256: 'dab59561befc12aa38adf970743bab0eaa55d325833295a760efcaaef1cd2750', historical46af: {workflowSHA256: ORIGINAL_WORKFLOW_SHA256, nodeSHA256: ORIGINAL_NODE_SHA256, assertionBodySHA256: ORIGINAL_ASSERTION_BODY_SHA256}, assertionBodyChanged: true};
  for (const proof of report.supplemental ?? []) { proof.publisherBinding = binding; proof.sourceSHA = SOURCE_SHA; proof.width = report.width; }
  report.userAcceptance = false;
  if (failure) { report.status = 'FAIL'; report.bindingOrBrowserFailure = String(failure); }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  return report;
}
export function checkFullCoverage(report) {
  assert.equal(report.status, 'CAPTURE_AND_ASSERTIONS_PASSED_NOT_USER_ACCEPTANCE');
  assert.deepEqual(report.coverage, {correct:25, wrong:50, reloadWrong:2, reloadCorrect:2, stages:9, states:129}, 'EXACT_ORIGINAL_COVERAGE');
  assert.equal(report.images.length, 129); assert.equal(report.states.length, 129);
  assert.equal(report.supplemental.length, 11, 'EXACT_SUPPLEMENTAL_COUNT');
  assert.deepEqual(report.supplemental.map(p=>p.kind), ['menu-0','compact-and-full-history','menu-25','revision1-unstarted','revision1-completed-2','revision1-qf01-n03-wrong','revision1-completed-3','revision1-qf01-n04-wrong','revision1-completed-4','revision1-completed-8','revision1-completed-25'], 'EXACT_SUPPLEMENTAL_KINDS');
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
        await runCurrentAssertionBody();
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
