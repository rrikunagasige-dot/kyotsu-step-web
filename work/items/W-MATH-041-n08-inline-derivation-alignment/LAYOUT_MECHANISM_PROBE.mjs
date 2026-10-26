/** Standalone DOM mechanism fixture only. This does not modify or test the app. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const projectRoot=path.resolve(process.argv[2]??process.cwd());
const require=createRequire(path.join(projectRoot,'package.json'));
const katex=require('katex'),{chromium}=require('@playwright/test');
const dist=path.join(projectRoot,'node_modules/katex/dist');
const css=fs.readFileSync(path.join(dist,'katex.min.css'),'utf8').replace(/url\(([^)]+)\)/g,(_all,raw)=>{const name=raw.replace(/[\"']/g,'');const file=path.join(dist,name);if(!fs.existsSync(file))throw Error('Missing bundledfont '+name);const ext=path.extname(file).slice(1);return 'url(data:font/'+ext+';base64,'+fs.readFileSync(file).toString('base64')+')'});
const tex=s=>katex.renderToString(s,{throwOnError:true}),mark='<i class="r7-baseline" aria-hidden="true"></i>';
const style=`.r7-run{display:inline-block;line-height:1.4;white-space:nowrap}.r7-baseline{display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline}.r7-probe{font-size:18px;position:fixed;left:-10000px;top:0;visibility:hidden;white-space:nowrap}.r7-row{font-size:18px;display:grid;grid-template-columns:80px 18px 170px;gap:4px;align-items:baseline;margin:12px}.r7-row .katex,.r7-probe .katex{font-size:1em}.r7-reserve{display:inline-block;width:0;height:44px;vertical-align:calc(var(--axis) - 22px)}.r7-slot{display:inline-block;position:relative;width:44px;text-align:center;vertical-align:baseline}.r7-ink{position:relative;z-index:2;pointer-events:none}.r7-hit{position:absolute;left:0;width:44px;height:44px;top:calc(var(--local-base) - var(--axis) - 22px);border:0;padding:0;background:transparent}.r7-box{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:26px;height:25px;border:1px solid blue;background:white}`;
const slot=v=>`<span class="r7-slot">${mark}<button type="button" class="r7-hit" aria-label="fixture part"><span class="r7-box"></span></button><span class="r7-ink" aria-hidden="true">${tex(v||'\\mathstrut')}</span></span>`;
const cases=[{name:'empty',value:''},{name:'zero',value:'0'},{name:'negative',value:'-3'},{name:'signed-root',value:'-\\sqrt5'},{name:'fraction',value:'\\frac{7}{11}'}];
const html='<!doctype html><style>'+css+style+'</style><span class="r7-probe">'+mark+tex('\\frac{\\mathstrut}{\\mathstrut}')+'</span>'+cases.map(({name,value})=>`<div class="r7-row" data-case="${name}"><span><span class="r7-run">${mark}${tex('|a|')}</span></span><span><span class="r7-run">${mark}${tex('=')}</span></span><span><span class="r7-run"><span class="r7-reserve"></span>${mark}${slot(value)}${tex('-')}${slot('')}</span></span></div>`).join('');
const browser=await chromium.launch({headless:true,executablePath:process.env.KYOTSU_CHROMIUM_PATH??path.join(projectRoot,'../browser/chrome-headless-shell-linux64/chrome-headless-shell'),args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const page=await browser.newPage();await page.setContent(html);
 const measured=await page.evaluate(async()=>{
  await document.fonts.ready;
  const probe=document.querySelector('.r7-probe'),baseline=probe.querySelector('.r7-baseline').getBoundingClientRect().top,line=probe.querySelector('.frac-line');
  if(!line)throw Error('UNVERIFIED: fraction-rule axis unavailable');
  const lineRect=line.getBoundingClientRect(),axis=baseline-(lineRect.bottom-parseFloat(getComputedStyle(line).borderBottomWidth)/2);
  document.documentElement.style.setProperty('--axis',axis+'px');
  for(const s of document.querySelectorAll('.r7-slot'))s.style.setProperty('--local-base',(s.querySelector('.r7-baseline').getBoundingClientRect().top-s.getBoundingClientRect().top)+'px');
  const strutBaseline=s=>{const value=getComputedStyle(s).verticalAlign;const v=value==='baseline'?0:parseFloat(value);if(!Number.isFinite(v))throw Error('UNVERIFIED: strut vertical alignment');return s.getBoundingClientRect().bottom+v;};
  return{probeMathPx:getComputedStyle(probe.querySelector('.katex')).fontSize,axisPx:axis,rows:[...document.querySelectorAll('.r7-row')].map(row=>{
   const bs=[...row.querySelectorAll('.r7-run>.r7-baseline')].map(x=>x.getBoundingClientRect().top),box=row.querySelector('.r7-box').getBoundingClientRect();
   const slots=[...row.querySelectorAll('.r7-slot')],inkBaselines=slots.flatMap(s=>[...s.querySelectorAll('.r7-ink .katex-html > .base > .strut')].map(strutBaseline));
   if(!inkBaselines.length)throw Error('UNVERIFIED: no actual KaTeX strut baseline');
   return{case:row.dataset.case,baselineDeltaPx:Math.max(...bs)-Math.min(...bs),slotBaselineMaxDeltaPx:Math.max(...slots.map(s=>Math.abs(s.querySelector('.r7-baseline').getBoundingClientRect().top-bs[0]))),actualInkStrutMaxDeltaPx:Math.max(...inkBaselines.map(b=>Math.abs(b-bs[0]))),visualBoxAxisDeltaPx:(box.top+box.bottom)/2-(bs[0]-axis),hitRects:[...row.querySelectorAll('.r7-hit')].map(x=>({width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height}))};
  })};
 });
 const report={kind:'READ_ONLY_IN_MEMORY_LAYOUT_MECHANISM_FIXTURE',appQA:false,appSourceChanged:false,storeChanged:false,scope:'Mechanism feasibility only; not production layout, no learner data',browserVersion:browser.version(),...measured};
 report.status=report.probeMathPx==='18px'&&report.rows.every(r=>[r.baselineDeltaPx,r.slotBaselineMaxDeltaPx,r.actualInkStrutMaxDeltaPx,r.visualBoxAxisDeltaPx].every(x=>Math.abs(x)<=1)&&r.hitRects.every(h=>h.width>=44&&h.height>=44))?'MECHANISM_PASS':'MECHANISM_FAIL';
 fs.writeFileSync(process.argv[3]??'/tmp/w041-layout-probe.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report));
}finally{await browser.close();}
