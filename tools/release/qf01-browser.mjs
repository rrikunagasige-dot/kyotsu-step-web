// P019 full QF01 revision2 production-condition QA. No publication or user session.
// P012/P016 hashes below are immutable historical lineage, not current assertion evidence.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

export const SOURCE_SHA = 'ccd434a38faa1826caa9f671df4551dc8adc33df';
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
  "src/domain/textbookSchema.test.ts": "c5f3feaefb76ddb02e2296b55c12ad8c4cc6267fede6ddf2020dcc6086ba67c6",
  "src/domain/textbookMath.test.ts": "034b79dc81b4d7fec62ae4b7a6ef2d87234cd211e03a951ebc5f3a90062c8ce0",
  "src/domain/textbook.ts": "e3682ee50cf10d377416676872f9d491e2ad4fcd6816d7159d1ca162d911444c",
  "src/domain/textbookSchema.ts": "a97764f177a1d5e5f2bcf643e56abff8d2ec399f593de30033f8493ac6dd3af3",
  "src/domain/textbook.test.ts": "03ead4595a1b8c47a4e0471dcf3effc3b8c845265b6a0051e8a4dbe6cf8bc572",
  "src/pages/LearningSetupPage.tsx": "e6d9b80ed1c5c6fa4b11c8d2ab584796e3e6aa2e5e7c92b1e2b7f3f59e98d892",
  "src/pages/TextbookUnitPage.tsx": "e862027297c25bccfd6caa4632153927a96096310d735823086266665c887e32",
  "src/data/textbook/math/mathCatalog.ts": "3e89a3851bc8bfdf27d981307750f646f91724802e25af1a46d35beba46c48c6",
  "src/data/textbook/math/mathCatalog.test.ts": "01a08515b52d2ce49aaff0d7d115ed26df7e30efa77cf1fdb0f614405c116252",
  "src/data/textbook/math/index.ts": "40de08acf04c5756321545ccc75a85e6579087b5a99994eb5b7b683f6990be73",
  "src/data/textbook/math/quadratic/qf01Lesson.ts": "769975c725cc3f43155a589c7b852f6aaf084429617a7ee100253741cf246cd0",
  "src/data/textbook/math/quadratic/qf01Presentation.json": "32bce9d3cb89809ee1024f986d52020cd56e4f825908d633768b1f26ef4bea6f",
  "src/data/textbook/math/quadratic/qf01Lesson.test.tsx": "a1a6cc5b42d9e1364b5cccdfd45f74b13f54e1bf2f771b54c9d6d41b90f5b743",
  "src/data/textbook/math/quadratic/qf01Unit.json": "de8e6f70e33d26a7e92503401e435edcfc0639d2a4580af58080083f1fb93928",
  "src/components/textbook/GuidedMathReadingFlow.tsx": "afa170098dd26e7703102cb79b710d6928fb40d3166a42be813d00dc16aa874c",
  "src/components/textbook/guided-math-reading.css": "e27892613c059a7774f542f2b53e108e2333fa1dc6165bf57f41bc0da187da84"
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
  assert.equal(contract.qf01.statesPerWidth, 124, 'CONTRACT_STATES');
  assert.equal(contract.qf01.decisions, 24, 'CONTRACT_DECISIONS');
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

export const ACTIVE_IDS = Object.freeze(['n01','n02','n03','n04','n05','n06','n07','n08','n09','n10','n11','n12a','n12b','n12c','n12','n13','n14','n15','n16','n17','n18','n19','n21','n22'].map(n=>'qf01-'+n+'-answer'));
export const RELOAD_IDS = Object.freeze(['qf01-n13-answer','qf01-n22-answer']);
export const SUPPLEMENT_KINDS = Object.freeze(['menu-0','compact-history','full-history','menu-24',...Array.from({length:26},(_,i)=>'revision1-prefix-'+i),'reset-preserves-history']);
export function expectedCaptureLabels(){return ACTIVE_IDS.flatMap(id=>{const n=id.slice(0,-7);return [n+'-before',n+'-choices',n+'-wrong-0',n+'-wrong-1',...(RELOAD_IDS.includes(id)?[n+'-reload-wrong']:[]),n+'-correct',...(RELOAD_IDS.includes(id)?[n+'-reload-correct']:[])];});}
export function parsePresentationLiteral(source){
 const marker='export const qf01TransformationPresentation = ',start=source.indexOf(marker);assert.ok(start>=0,'EXACT_PRESENTATION_EXPORT');const begin=source.indexOf('{',start+marker.length);let depth=0,quoted=false,escape=false;
 for(let i=begin;i<source.length;i++){const c=source[i];if(quoted){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')quoted=false;}else if(c==='"')quoted=true;else if(c==='{')depth++;else if(c==='}'&&--depth===0)return JSON.parse(source.slice(begin,i+1));}
 assert.fail('BALANCED_LITERAL_JSON');
}
export function validateViewportEvidence(v,{requireTarget=false,expectedSourceNode=null,requireLesson=false,requireHint=false}={}){
 assert.ok(v.viewport.width>0&&v.viewport.height>0);assert.ok(v.documentWidth<=v.viewport.width,'VIEWPORT_HORIZONTAL_OVERFLOW');assert.equal(v.katexErrors,0);assert.equal(v.fontsReady,'loaded');
 assert.ok(['lesson','menu'].includes(v.surface),'EXPLICIT_MEASURED_SURFACE');assert.ok(Array.isArray(v.copyFonts),'REQUIRED_COPY_FONT_SAMPLES');for(const field of ['math','relationColumns','numberLabels','visibleButtons'])assert.ok(Array.isArray(v[field]),'REQUIRED_GEOMETRY_ARRAY '+field);
 if(requireLesson||requireTarget||v.surface==='lesson'){assert.equal(v.surface,'lesson','LESSON_SURFACE_REQUIRED');assert.ok(Number.isFinite(v.flowFontSize)&&v.flowFontSize>=18,'CURRENT_BODY_FONT_18');assert.ok(v.copyFonts.length>0,'NONEMPTY_REQUIRED_COPY_FONT_SAMPLES');if(requireTarget){assert.ok(v.math.length>0,'CURRENT_MATH_MEASUREMENTS_REQUIRED');assert.ok(v.relationColumns.length>0,'CURRENT_RELATION_GROUP_MEASUREMENTS_REQUIRED');}}
 for(const copy of v.copyFonts){assert.ok(typeof copy.kind==='string'&&copy.kind&&typeof copy.text==='string'&&copy.text.trim(),'REQUIRED_COPY_FONT_IDENTITY');assert.ok(Number.isFinite(copy.fontSize)&&copy.fontSize>=18,'CURRENT_REQUIRED_COPY_FONT_18');}
 if(requireHint)assert.ok(v.copyFonts.some(copy=>copy.kind==='hint'),'CURRENT_WRONG_HINT_FONT_REQUIRED');for(const m of v.math){assert.ok(m.fontSize>=18,'CURRENT_MATH_FONT_18');assert.ok(m.rect.left>=-1&&m.rect.right<=v.viewport.width+1,'FORMULA_HORIZONTAL_CLIP');assert.deepEqual(m.clippedBy,[],'FORMULA_ANCESTOR_CLIP');}
 for(const g of v.relationColumns)if(g.positions.length>1)assert.ok(Math.max(...g.positions)-Math.min(...g.positions)<2,'RELATION_COLUMN_ALIGNMENT:'+g.id);
 for(const n of v.numberLabels){assert.ok(n.rect.left>=-1&&n.rect.right<=v.viewport.width+1,'NUMBER_LABEL_CLIP');assert.deepEqual(n.collisions,[],'NUMBER_FORMULA_COLLISION');}
 for(const button of v.visibleButtons){assert.ok(button.rect.width>=44&&button.rect.height>=44,'VISIBLE_CONTROL_HIT_SIZE');assert.equal(button.centerHit,true,'VISIBLE_CONTROL_OCCLUDED');}
 if(requireTarget){assert.ok(v.target,'CURRENT_STATE_TARGET_MISSING');if(expectedSourceNode)assert.equal(v.target.sourceNodeId,expectedSourceNode,'CURRENT_TARGET_SOURCE_NODE');assert.ok(v.target.rect.top>=v.headerBottom-1&&v.target.rect.bottom<=v.footerTop+1,'CURRENT_TARGET_HEADER_FOOTER_OCCLUSION');assert.ok(v.target.rect.left>=-1&&v.target.rect.right<=v.viewport.width+1);if(v.target.button)assert.equal(v.target.centerHit,true,'CURRENT_TARGET_NOT_HITTABLE');}
 return true;
}
async function runCurrentAssertionBody(){
 const sourceSHA=process.env.SOURCE_SHA,width=Number(process.env.WIDTH),out=process.env.OUT;
 assert.equal(sourceSHA,SOURCE_SHA);assert.ok(WIDTHS.includes(width));
 const unit=json('src/data/textbook/math/quadratic/qf01Unit.json'),display=json('src/data/textbook/math/quadratic/qf01Presentation.json'),plan=parsePresentationLiteral(fs.readFileSync('src/data/textbook/math/quadratic/qf01Lesson.ts','utf8'));
 const physical=unit.sections[0].items,items=ACTIVE_IDS.map(id=>physical.find(i=>i.id===id)),nodes=items.map(i=>display.nodes.find(n=>n.interaction===i.id));
 assert.equal(unit.revision,2);assert.equal(physical.length,25);assert.equal(display.nodes.length,25);assert.equal(display.stages.length,9);assert.deepEqual(unit.requiredInteractionRefs,ACTIVE_IDS);assert.deepEqual(unit.workedReuseRefs,['qf01-n20-answer']);assert.equal(display.nodes.find(n=>n.id==='qf01-n20').interaction,null);assert.deepEqual(plan.interactions.map(q=>q.id),ACTIVE_IDS);
 const report={sourceSHA,width,route:BASE_PATH+'#/learning/textbook/'+unit.unitId,scope:'QF01_REVISION2_ALL9_STAGES_25_PHYSICAL_24_ACTIVE_48_WRONG',status:'RUNNING',sourceFiles:requiredSourceFiles,unitId:unit.unitId,revision:2,ci:{runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT},images:[],states:[],answers:[],errors:[],supplemental:[],limits:['Current asserted states and finite nonauthor review, not user acceptance or new gold quality','No claim of all three themes or unrelated intake closure']};
 fs.mkdirSync(out+'/png',{recursive:true});fs.mkdirSync(out+'/states',{recursive:true});fs.mkdirSync(out+'/supplemental-png',{recursive:true});fs.mkdirSync(out+'/fullpage',{recursive:true});const persist=()=>fs.writeFileSync(out+'/REPORT.json',JSON.stringify(report,null,2)+'\n');persist();
 const browser=await chromium.launch({headless:true});let page;
 try{
  report.browserVersion=browser.version();const context=await browser.newContext({viewport:{width,height:1000}});page=await context.newPage();page.setDefaultTimeout(20000);const track=p=>p.on('pageerror',e=>{report.errors.push(String(e));persist();});track(page);
  const lessonURL=process.env.APP_URL+'#/learning/textbook/'+unit.unitId,menuURL=process.env.APP_URL+'#/learning/setup?mode=textbook&subject=math-1a';
  const readProgress=(p=page)=>p.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)??'null')?.state?.textbookProgress?.[id]??null,{key:STORAGE_KEY,id:unit.unitId});
  const math=locator=>locator.locator('annotation[encoding="application/x-tex"]').allTextContents();
  const current=(p=page)=>p.locator('.math-textbook-stage--current');
  async function settle(p=page){await p.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});}
  async function viewport(p,targetId=null,nodeId=null,{requireHint=false}={}){
   const evidence=await p.evaluate(({targetId,nodeId})=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};},hit=e=>{const r=e.getBoundingClientRect(),top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !!top&&(top===e||e.contains(top));};
    const current=document.querySelector('.math-textbook-stage--current'),flow=document.querySelector('.qf01-full-reading'),root=current??document.body;
    const headers=[...document.querySelectorAll('header,nav,[data-fixed-header]')].map(e=>({s:getComputedStyle(e),r:rect(e)}));
    const headerBottom=Math.max(0,...headers.filter(h=>['fixed','sticky'].includes(h.s.position)&&Number.isFinite(parseFloat(h.s.top))&&h.r.top<innerHeight/2).map(h=>h.r.bottom)),footerTop=Math.min(innerHeight,...headers.filter(h=>h.s.position==='fixed'&&Number.isFinite(parseFloat(h.s.bottom))&&h.r.bottom>innerHeight/2).map(h=>h.r.top));
    const math=[...root.querySelectorAll('.katex')].map(e=>{const r=rect(e),clippedBy=[];for(let parent=e.parentElement;parent&&parent!==document.body;parent=parent.parentElement){const style=getComputedStyle(parent),pr=rect(parent);if(['hidden','clip'].includes(style.overflowX)&&(r.left<pr.left-1||r.right>pr.right+1))clippedBy.push({tag:parent.tagName,className:parent.className,rect:pr});}return{latex:e.querySelector('annotation')?.textContent,fontSize:parseFloat(getComputedStyle(e).fontSize),rect:r,clippedBy};});
    const relationColumns=[...root.querySelectorAll('[data-transformation-group]')].map(g=>({id:g.getAttribute('data-transformation-group'),positions:[...g.querySelectorAll('.transformation-equation')].filter(r=>r.getAttribute('data-relation')).map(r=>rect(r.querySelector('.transformation-relation')).left)}));
    const intersects=(a,b)=>a.left<b.right-.5&&a.right>b.left+.5&&a.top<b.bottom-.5&&a.bottom>b.top+.5;
    const numberLabels=[...root.querySelectorAll('.numbered-equation-label')].map(e=>{const r=rect(e);return {text:e.textContent,rect:r,collisions:[...e.parentElement.querySelectorAll('.katex')].map(m=>rect(m)).filter(m=>intersects(r,m))};});
    const panel=targetId?document.querySelector('[data-testid="inline-choice-panel-'+targetId+'"]'):null,slot=targetId?document.querySelector('[data-testid="textbook-item-'+targetId+'"]'):null,resolved=targetId?document.querySelector('[data-testid="resolved-'+targetId+'"]'):null;
    const completedRow=nodeId?[...current?.querySelectorAll('[data-transformation-row][data-source-node="'+nodeId+'"] .transformation-equation')??[]].at(-1):null;
    const focused=panel?.contains(document.activeElement)&&document.activeElement.tagName==='BUTTON'?document.activeElement:null,target=focused??slot??resolved??completedRow;
    const buttons=[...root.querySelectorAll('button')].filter(e=>{const r=rect(e);return r.width>0&&r.height>0&&r.top>=headerBottom&&r.bottom<=footerTop&&r.left>=0&&r.right<=innerWidth;});
    const copySelectors=[['prose','.qf01-full-reading .transformation-prose'],['hint','.qf01-full-reading .reading-choice-hint'],['hint-label','.qf01-full-reading .reading-choice-hint strong'],['context','.qf01-local-context'],['source','[data-testid="guided-source-question"] p'],['imported-history','[data-testid="qf01-imported-answer-history"]']];
    const copyFonts=copySelectors.flatMap(([kind,selector])=>[...document.querySelectorAll(selector)].filter(e=>{const r=rect(e),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&e.textContent.trim();}).map((e,index)=>({kind,index,text:e.textContent.trim(),fontSize:parseFloat(getComputedStyle(e).fontSize)})));
    return{surface:flow?'lesson':'menu',viewport:{width:innerWidth,height:innerHeight,scrollX,scrollY},documentWidth:document.documentElement.scrollWidth,fontsReady:document.fonts.status,katexErrors:document.querySelectorAll('.katex-error').length,flowFontSize:flow?parseFloat(getComputedStyle(flow).fontSize):null,copyFonts,headerBottom,footerTop,math,relationColumns,numberLabels,holeRect:slot?rect(slot):null,panelRect:panel?rect(panel):null,target:target?{sourceNodeId:target.closest('[data-source-node]')?.getAttribute('data-source-node'),testId:target.getAttribute('data-testid'),button:target.tagName==='BUTTON',rect:rect(target),centerHit:target.tagName==='BUTTON'?hit(target):null}:null,visibleButtons:buttons.map(e=>({testId:e.getAttribute('data-testid'),rect:rect(e),centerHit:hit(e)}))};
   },{targetId,nodeId});try{validateViewportEvidence(evidence,{requireTarget:targetId!==null,expectedSourceNode:nodeId,requireHint});}catch(error){const file='FAILED_VIEWPORT_MEASUREMENT-'+String(report.failedViewportMeasurements?.length??0)+'.json';fs.writeFileSync(out+'/'+file,JSON.stringify({sourceSHA,width,nodeId,targetId,evidence,error:String(error)},null,2)+'\n');(report.failedViewportMeasurements??=[]).push({file,sha256:hash(fs.readFileSync(out+'/'+file))});persist();throw error;}return evidence;
  }
  async function capturePair(stem,p=page,directory='png'){
   await settle(p);const captureViewport=await p.evaluate(()=>({scrollX,scrollY,width:innerWidth,height:innerHeight})),file=directory+'/'+stem+'.png';
   await p.screenshot({path:out+'/'+file,fullPage:false});
   await p.evaluate(()=>scrollTo(0,0));await settle(p);const fullFile='fullpage/'+stem+'.png';await p.screenshot({path:out+'/'+fullFile,fullPage:true});await p.evaluate(v=>scrollTo(v.scrollX,v.scrollY),captureViewport);await settle(p);
   return {file,sha256:hash(fs.readFileSync(out+'/'+file)),sourceSHA,width,fullPage:false,captureOrigin:'learner-viewport-after-two-animation-frames',captureViewport,fullPageImage:{file:fullFile,sha256:hash(fs.readFileSync(out+'/'+fullFile)),fullPage:true,captureOrigin:'top-after-two-animation-frames'}};
  }
  async function snapshot(kind,data,p=page){await settle(p);const measurements=await viewport(p),image=await capturePair('supp-'+String(report.supplemental.length).padStart(2,'0')+'-'+kind,p,'supplemental-png');report.supplemental.push({kind,...data,measurements,image});persist();}

  async function menu(count){await page.goto(menuURL);const chapter=page.getByTestId('math-textbook-chapter-2'),card=page.getByTestId('math-textbook-topic-quadratic-functions-foundation');await card.waitFor();await page.waitForFunction(()=>document.querySelector('[data-testid="math-textbook-topic-quadratic-functions-foundation"]')?.tagName==='A');assert.equal(await card.getAttribute('href'),'#/learning/textbook/'+unit.unitId);const text=await chapter.innerText();for(const title of ['関数とグラフ','2次関数の最大・最小','2次関数と方程式・不等式'])assert.ok(text.includes(title));assert.ok((await card.innerText()).includes('公開中の内容：'+count+'/24 完了'));assert.ok(!(await card.innerText()).includes('100%'));for(const id of ['quadratic-functions-extrema','quadratic-functions-equations-inequalities']){const pending=page.getByTestId('math-textbook-topic-'+id);assert.equal(await pending.evaluate(e=>e.tagName),'DIV');assert.equal(await pending.getAttribute('aria-disabled'),'true');assert.equal(await pending.locator('a').count(),0);}await snapshot('menu-'+count,{count,text});}
  await menu(0);await page.getByTestId('math-textbook-topic-quadratic-functions-foundation').click();await page.getByTestId('textbook-reading-flow').waitFor();
  async function contextProof(node,p=page){await settle(p);const source=p.getByTestId('guided-source-question');assert.ok((await source.innerText()).includes('元の条件・求めるもの'));const actual=await math(source);for(const part of display.stages.find(s=>s.id===node.stageId).sourceQuestionParts)if(part.type==='math')assert.ok(actual.includes(part.latex),'ORIGINAL_CONDITION_OR_TARGET:'+node.id+':'+part.latex);assert.equal(await p.locator('.guided-thinking-step').count(),0,'NO_LEGACY_QUESTION');assert.equal(await p.getByTestId('textbook-item-qf01-n20-answer').count(),0,'PASSIVE_NOT_GRADED');return {sourceText:await source.innerText(),sourceMath:actual};}
  async function noFuture(i){for(const item of items.slice(i+1))assert.equal(await page.getByTestId('textbook-item-'+item.id).count(),0,'FUTURE_SLOT:'+item.id);}
  async function capture(label,node,selectedValue=null){await settle();const contextEvidence=await contextProof(node),measurements=await viewport(page,node.interaction,node.id,{requireHint:label.includes('-wrong-')||label.endsWith('-reload-wrong')}),stem=String(report.images.length).padStart(3,'0')+'-'+label,image={...await capturePair(stem),nodeId:node.id,label,selectedValue},file='states/'+stem+'.json';const state={sourceSHA,nodeId:node.id,interactionId:node.interaction,label,selectedValue,contextEvidence,measurements,progress:await readProgress(),image};fs.writeFileSync(out+'/'+file,JSON.stringify(state,null,2)+'\n');report.images.push(image);report.states.push({file,sha256:hash(fs.readFileSync(out+'/'+file)),image:image.file});persist();}

  async function safeNames(item,node){const slot=page.getByTestId('textbook-item-'+item.id);assert.equal(await slot.getAttribute('aria-label'),'式中の空欄');const ctx=await page.getByTestId('guided-source-question').getAttribute('id');assert.ok(ctx);assert.equal(await slot.getAttribute('aria-describedby'),ctx);await slot.click();const panel=page.getByTestId('inline-choice-panel-'+item.id),group=panel.getByRole('group',{name:'この空欄の候補',exact:true});assert.equal(await group.getAttribute('aria-describedby'),ctx);assert.equal(await group.getAttribute('aria-label'),'この空欄の候補');assert.deepEqual((await panel.locator('button.reading-choice-option').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')))).sort(),[...item.choices].sort());const geometry=[];for(const choice of await panel.locator('button.reading-choice-option').all()){await choice.focus();await settle();const v=await choice.evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e),content=e.querySelector(':scope>.qf01-option-content'),c=getComputedStyle(content),b=content.getBoundingClientRect();const headers=[...document.querySelectorAll('header,nav,[data-fixed-header]')].map(h=>({s:getComputedStyle(h),r:h.getBoundingClientRect()}));const top=Math.max(0,...headers.filter(h=>['fixed','sticky'].includes(h.s.position)&&Number.isFinite(parseFloat(h.s.top))&&h.r.top<innerHeight/2).map(h=>h.r.bottom));const bottom=Math.min(innerHeight,...headers.filter(h=>h.s.position==='fixed'&&Number.isFinite(parseFloat(h.s.bottom))&&h.r.bottom>innerHeight/2).map(h=>h.r.top));return{width:r.width,height:r.height,top:r.top,bottom:r.bottom,clearTop:top,clearBottom:bottom,display:s.display,grid:s.gridTemplateColumns,font:parseFloat(s.fontSize),contentWidth:b.width,border:parseFloat(c.borderTopWidth),contentDisplay:c.display,overflow:content.scrollWidth>content.clientWidth+1};});assert.ok(v.width>=44&&v.height>=44);assert.ok(v.top>=v.clearTop-1&&v.bottom<=v.clearBottom+1,'FOCUSED_CHOICE_CLEAR_HEADERS:'+node.id);assert.equal(v.display,'block');assert.equal(v.grid,'none');assert.ok(v.font>=18);assert.ok(v.contentWidth>27);assert.equal(v.border,0);assert.equal(v.contentDisplay,'block');assert.equal(v.overflow,false);geometry.push(v);}return{contextId:ctx,slotName:'式中の空欄',groupName:'この空欄の候補',geometry};}
  for(let i=0;i<items.length;i++){
   const item=items[i],node=nodes[i];while(await page.getByTestId('textbook-item-'+item.id).count()===0)await page.getByTestId('math-textbook-next-stage').click();await noFuture(i);await capture(node.id+'-before',node);const accessible=await safeNames(item,node);await capture(node.id+'-choices',node);const panel=page.getByTestId('inline-choice-panel-'+item.id),wrongs=item.choices.filter(c=>c!==item.answer&&!item.acceptedAnswers.includes(c));assert.equal(wrongs.length,2);for(let j=0;j<2;j++){await panel.getByRole('button',{name:wrongs[j],exact:true}).click();const saved=(await readProgress()).answers[item.id];assert.equal(saved.resolved,false);assert.equal(saved.value,wrongs[j]);assert.ok((await page.getByTestId('textbook-hint-'+item.id).innerText()).includes('採用しません'));await noFuture(i);await capture(node.id+'-wrong-'+j,node,wrongs[j]);}
   if(RELOAD_IDS.includes(item.id)){const before=await readProgress();await page.reload();await page.getByTestId('textbook-item-'+item.id).waitFor();assert.deepEqual(await readProgress(),before);await capture(node.id+'-reload-wrong',node,wrongs[1]);await page.getByTestId('textbook-item-'+item.id).click();}
   await page.getByTestId('inline-choice-panel-'+item.id).getByRole('button',{name:item.answer,exact:true}).click();const saved=(await readProgress()).answers[item.id];assert.equal(saved.resolved,true);assert.equal(saved.value,item.answer);assert.equal(saved.attemptCount,3);assert.equal(await page.getByTestId('textbook-item-'+item.id).count(),0);await capture(node.id+'-correct',node,item.answer);report.answers.push({id:item.id,correctValue:item.answer,wrongValues:wrongs,accessible});if(RELOAD_IDS.includes(item.id)){const before=await readProgress();await page.reload();await page.getByTestId('textbook-reading-flow').waitFor();assert.deepEqual(await readProgress(),before);await capture(node.id+'-reload-correct',node,item.answer);}
  }
  const saved=await readProgress();assert.equal(saved.unitRevision,2);assert.equal(Object.keys(saved.answers).length,24);assert.ok(!saved.answers['qf01-n20-answer']);await page.getByTestId('qf01-complete').waitFor();
  await page.getByTestId('qf01-history-toggle').click();const compact=[];for(const g of plan.groups.filter(g=>!g.stageIds.includes('qf01-stage-9'))){const loc=page.locator('.guided-history [data-transformation-group="'+g.id+'"]');assert.equal(await loc.count(),1);assert.equal(await loc.locator('.transformation-equation').count(),1);const expected=g.rows.at(-1).completed;let left=expected.left;if(!left.length&&(expected.relation||expected.relationSlot))left=[...g.rows].reverse().find(r=>r.completed.left.length)?.completed.left??[...g.rows.slice(0,-1)].reverse().find(r=>!r.completed.relation&&r.completed.right.length)?.completed.right??[];const parts=x=>x.map(p=>{assert.equal(p.type,'math');return p.latex;});assert.deepEqual(await math(loc.locator('.transformation-left')),parts(left));assert.deepEqual(await math(loc.locator('.transformation-right')),parts(expected.right));compact.push({id:g.id,left:parts(left),relation:expected.relation,right:parts(expected.right)});}await snapshot('compact-history',{compact,progressUnchanged:true});await page.getByRole('button',{name:'全文を開く',exact:true}).click();for(const stage of display.stages.slice(0,-1))await page.getByTestId('qf01-chain-'+stage.id).waitFor();assert.deepEqual(await readProgress(),saved);await snapshot('full-history',{compact,progressUnchanged:true});await menu(24);assert.deepEqual(await readProgress(),saved);
  for(let count=0;count<=25;count++){
   const old={unitId:unit.unitId,unitRevision:1,startedAt:1,updatedAt:25,answers:Object.fromEntries(physical.slice(0,count).map((item,i)=>[item.id,{itemId:item.id,value:item.answer,firstValue:item.answer,isFirstCorrect:true,resolved:true,attemptCount:1,firstAnsweredAt:i+1,lastAnsweredAt:i+1}])),unknownMarker:{retain:['full',count]},archivedRevisions:{older:{opaque:'preserve'}},...(count===25?{completedAt:25}:{})};
   const ctx=await browser.newContext({viewport:{width,height:1000}}),p=await ctx.newPage();track(p);const other={unitId:'protected-other-unit',answers:{opaque:{retain:true}}};await p.addInitScript(({key,id,old,other})=>{if(sessionStorage.getItem('qf01-seeded'))return;sessionStorage.setItem('qf01-seeded','1');localStorage.setItem(key,JSON.stringify({state:{textbookProgress:{[id]:old,'protected-other-unit':other}},version:1}));localStorage.setItem('kyotsu-step-store',JSON.stringify({notThisNamespace:true}));localStorage.setItem('math-textbook-compact-v1:'+id+':r1:scope:qf01-v1','8');},{key:STORAGE_KEY,id:unit.unitId,old,other});await p.goto(lessonURL);await p.getByTestId('textbook-reading-flow').waitFor();assert.deepEqual(await readProgress(p),old,'READ_MUST_NOT_OVERWRITE_R1');const next=items.find(i=>!old.answers[i.id]);const expectedStage=next?nodes[items.indexOf(next)].stageId:'qf01-stage-1';await p.getByTestId('math-textbook-stage-'+expectedStage).waitFor();assert.deepEqual(await current(p).locator('[data-testid^="textbook-item-"]').evaluateAll(es=>es.map(e=>e.getAttribute('data-testid'))),next?['textbook-item-'+next.id]:[]);assert.equal(await p.getByTestId('qf01-complete').count(),0);if(next){await contextProof(nodes[items.indexOf(next)],p);await p.getByTestId('textbook-item-'+next.id).click();const wrong=next.choices.find(v=>v!==next.answer);await p.getByTestId('inline-choice-panel-'+next.id).getByRole('button',{name:wrong,exact:true}).click();const migrated=await readProgress(p);assert.equal(migrated.unitRevision,2);assert.deepEqual(JSON.parse(migrated.qf01Revision1Snapshot.serializedProgress),old);assert.equal(migrated.answers[next.id].resolved,false);assert.equal(migrated.completedAt,undefined);const expectedCredit=items.filter(i=>old.answers[i.id]).length;assert.equal(Object.values(migrated.answers).filter(a=>a.resolved).length,expectedCredit);await p.reload();await p.getByTestId('textbook-reading-flow').waitFor();assert.deepEqual(await readProgress(p),migrated);}else{assert.equal(await p.getByTestId('qf01-imported-answer-history').count(),1);}const isolation=await p.evaluate(({key})=>({other:JSON.parse(localStorage.getItem(key)).state.textbookProgress['protected-other-unit'],outside:JSON.parse(localStorage.getItem('kyotsu-step-store'))}),{key:STORAGE_KEY});assert.deepEqual(isolation,{other,outside:{notThisNamespace:true}});await snapshot('revision1-prefix-'+count,{count,expectedStage,expectedActiveCredits:items.filter(i=>old.answers[i.id]).length,firstMissing:next?.id??null,originalSerialized:JSON.stringify(old),actualProgress:await readProgress(p),isolation},p);await ctx.close();
  }
  // Page reset is intentionally exercised through its real existing action, never a forged synthetic attempt.
  await page.goto(lessonURL);await page.getByTestId('textbook-reading-flow').waitFor();const reset=page.getByRole('button',{name:'この単元を最初から',exact:true});assert.equal(await reset.count(),1,'EXPLICIT_QF_RESET_CONTROL');page.once('dialog',d=>d.accept());await reset.click();await page.getByTestId('textbook-item-'+items[0].id).waitFor();const resetProgress=await readProgress();assert.equal(resetProgress.unitRevision,2);assert.equal(Object.keys(resetProgress.answers).length,0);assert.ok(resetProgress.qf01ResetSnapshots?.length,'RESET_ARCHIVE');await snapshot('reset-preserves-history',{before:saved,after:resetProgress});
  assert.deepEqual(report.errors,[]);report.coverage={correct:24,wrong:48,reloadWrong:2,reloadCorrect:2,stages:9,physicalNodes:25,activeJudgments:24,states:report.states.length};report.status='CAPTURE_AND_ASSERTIONS_PASSED_NOT_USER_ACCEPTANCE';persist();checkFullCoverage(report);await context.close();
 }catch(e){report.status='FAIL';report.failure=String(e);persist();throw e;}finally{await browser.close();}
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
  report.assertionProvenance = {materialSourceSHA: SOURCE_SHA, modulePublisherSHA:binding.publisherSHA, modulePath:'tools/release/qf01-browser.mjs', moduleSHA256:hash(fs.readFileSync(THIS_FILE)), historicalP016Only:{workflowSHA256:'3321e684f159a9b9dcc5333948524d94b51967c993fd158380756853827e742d'}, assertionBodyChanged:true};
  for (const proof of report.supplemental ?? []) { proof.publisherBinding = binding; proof.sourceSHA = SOURCE_SHA; proof.width = report.width; }
  report.userAcceptance = false;
  if (failure) { report.status = 'FAIL'; report.bindingOrBrowserFailure = String(failure); }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  return report;
}
export function checkFullCoverage(report){
 assert.equal(report.status,'CAPTURE_AND_ASSERTIONS_PASSED_NOT_USER_ACCEPTANCE');assert.equal(report.sourceSHA,SOURCE_SHA);assert.equal(report.revision,2);
 assert.deepEqual(report.coverage,{correct:24,wrong:48,reloadWrong:2,reloadCorrect:2,stages:9,physicalNodes:25,activeJudgments:24,states:124});
 assert.deepEqual(report.images.map(i=>i.label),expectedCaptureLabels(),'EXACT_NODE_STATE_COVERAGE');assert.equal(report.states.length,124);assert.equal(new Set(report.images.map(i=>i.file)).size,124);assert.equal(new Set(report.states.map(i=>i.file)).size,124);
 for(const image of report.images){assert.equal(image.fullPage,false);assert.equal(image.captureOrigin,'learner-viewport-after-two-animation-frames');assert.equal(image.sourceSHA,SOURCE_SHA);assert.equal(image.width,report.width);assert.equal(image.captureViewport.width,report.width);assert.equal(image.fullPageImage?.fullPage,true);assert.equal(image.fullPageImage.captureOrigin,'top-after-two-animation-frames');assert.match(image.fullPageImage.sha256,/^[0-9a-f]{64}$/);}
 assert.deepEqual(report.answers.map(a=>a.id),ACTIVE_IDS);assert.deepEqual(report.supplemental.map(p=>p.kind),SUPPLEMENT_KINDS,'EXACT_CURRENT_SUPPLEMENT_KINDS');assert.deepEqual(report.errors,[]);
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
