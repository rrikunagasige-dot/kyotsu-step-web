// P-W051-002の追加表示面を実DOMから採る。実行と判定は実ブラウザの結果だけに基づく。
import assert from 'node:assert/strict';

const close = (a,b,label,t=.25) => assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=t, label+': '+JSON.stringify({actual:a,expected:b,tolerance:t}));
const canonical = xs => xs.map(x=>x.replace(/^\{\}(?=[+\-=])/,'')).join('').replace(/\s+/g,'').replace(/\\(?:qquad|quad|[,;!:>])/g,'');
function expectedParts(raw,map,normalize) { return (map.partsByRaw[raw]??[{type:'text',text:raw}]).map(p=>p.type==='math'?{type:'math',source:canonical([normalize(p.latex)])}:{type:'text',text:p.text}); }
function mergeText(parts) { const out=[];for(const p of parts){if(p.type==='text'&&out.at(-1)?.type==='text')out.at(-1).text+=p.text;else if(p.type!=='text'||p.text)out.push({...p});}return out; }
function actualParts(parts) { return mergeText(parts.map(p=>p.type==='math'?{type:'math',source:canonical(p.annotations)}:{type:'text',text:p.text})); }

// 元paragraph.partsのindexを、実rendererが各partへ付ける直下spanへ結び付ける。
// textContentはKaTeXのMathML/annotation/HTMLを重複するので比較用には使わない。
export async function collectParagraphTextParts(scope,specs,sample=false) {
 return scope.evaluate((scope,{specs,sample})=>{
  const attribute=sample?'data-n04-sample-block':'data-reading-layout-block';
  const blocks=[...scope.querySelectorAll('['+attribute+']')];
  const parts=e=>{const out=[];function visit(n){if(n.nodeType===Node.TEXT_NODE){out.push({type:'text',text:n.textContent});return;}if(n.nodeType!==Node.ELEMENT_NODE||n.matches('svg,.typeset-probe,.typeset-inline-probe'))return;if(n.matches('.n0106-semantic-math,.katex')){out.push({type:'math',annotations:[...n.querySelectorAll('annotation[encoding="application/x-tex"]')].map(a=>a.textContent)});return;}for(const c of n.childNodes)visit(c);}if(e)visit(e);return out;};
  return specs.map(spec=>{const owners=blocks.filter(e=>e.getAttribute(attribute)===spec.blockId),paras=owners.length===1?[...owners[0].querySelectorAll(':scope > .reading-block-with-choice > .reading-paragraph')]:[],para=paras.length===1?paras[0]:null,child=para?.children[spec.index];return {blockId:spec.blockId,index:spec.index,ownerCount:owners.length,paragraphCount:paras.length,childCount:para?.children.length??null,exists:Boolean(child),tag:child?.tagName??null,parts:parts(child),rawTextForDiagnosis:child?.textContent??null};});
 },{specs,sample});
}

export function verifyParagraphTextParts(rows,specs,map,normalize) {
 assert.deepEqual(rows.map(r=>[r.blockId,r.index]),specs.map(s=>[s.blockId,s.index]),'全paragraph text partのsource順序とindex');
 for(let i=0;i<specs.length;i++){const row=rows[i],spec=specs[i];assert.equal(row.ownerCount,1,'原blockの一意性');assert.equal(row.paragraphCount,1,'原paragraphの一意性');assert.equal(row.childCount,spec.partCount,'paragraphの元parts数');assert.equal(row.exists,true,'元text partのDOM child存在');assert.equal(row.tag,'SPAN','元partの直下span');assert.deepEqual(actualParts(row.parts),mergeText(expectedParts(spec.raw,map,normalize)),'paragraph元text partの日本語/数学/連続順序: '+spec.blockId+'#'+spec.index);}
}

export async function collectDisplay(page) {
 return page.getByTestId('textbook-reading-flow').evaluate(flow=>{
  const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return e.isConnected&&r.width>0&&r.height>0&&s.display!=='none'&&!['hidden','collapse'].includes(s.visibility)&&!e.closest('details:not([open]),.typeset-probe,.typeset-inline-probe');};
  const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  const style=e=>{const s=getComputedStyle(e);return {font:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight),padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft].map(parseFloat),border:[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth].map(parseFloat),borderColor:s.borderTopColor,background:s.backgroundColor};};
  const ann=e=>[...e.querySelectorAll('annotation[encoding="application/x-tex"]')].filter(x=>!x.closest('.typeset-probe,.typeset-inline-probe')).map(x=>x.textContent);
  // KaTeXのMathML/HTML二重表現を本文の二重文字として扱わない。
  const parts=e=>{const out=[];function visit(n){if(n.nodeType===Node.TEXT_NODE){out.push({type:'text',text:n.textContent});return;}if(n.nodeType!==Node.ELEMENT_NODE||n.matches('svg,.typeset-probe,.typeset-inline-probe'))return;if(n.matches('.n0106-semantic-math,.katex')){out.push({type:'math',annotations:ann(n)});return;}for(const c of n.childNodes)visit(c);}visit(e);return out;};
  const area=e=>e.closest('.math-textbook-stage-reference-content')?'前段参照':e.closest('.math-textbook-stage-detail')?'展開履歴':e.closest('.first-theme-recorded-results')?'確定結果':'現在本文';
  const textLeaves=e=>{const out=[];const walk=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=walk.nextNode();n;n=walk.nextNode()){const p=n.parentElement;if(n.textContent.trim()&&p&&!p.closest('.katex,svg')&&visible(p))out.push({text:n.textContent,...style(p)});}return out;};
  const semantic=[...flow.querySelectorAll('.n0106-semantic-text')].filter(visible).map(e=>({area:area(e),parts:parts(e),textLeaves:textLeaves(e)}));
  const paragraphs=[...flow.querySelectorAll('.math-textbook-stage .reading-paragraph')].filter(visible).map(e=>({area:area(e),source:e.closest('[data-result-source]')?.dataset.resultSource??e.closest('[data-reading-layout-block],[data-n04-sample-block]')?.getAttribute('data-reading-layout-block')??e.closest('[data-n04-sample-block]')?.getAttribute('data-n04-sample-block')??null,...style(e),rect:rect(e)}));
  const panels=[...flow.querySelectorAll('.reading-inline-choice-panel[data-testid]')].filter(visible).map(e=>{const q=e.querySelector('.reading-inline-choice-panel__head > span'),hint=e.querySelector('.reading-choice-hint > span');return {id:e.dataset.testid.replace('inline-choice-panel-',''),question:q?{parts:parts(q),textLeaves:textLeaves(q),...style(q)}:null,hint:hint?{parts:parts(hint),textLeaves:textLeaves(hint),...style(hint)}:null};});
  const semanticMath=[...flow.querySelectorAll('.n0106-semantic-math')].filter(visible).map(e=>({area:area(e),font:style(e).font,rootFonts:[...e.querySelectorAll('.katex')].filter(k=>k.closest('.n0106-semantic-math')===e).map(k=>style(k).font),annotations:ann(e),rect:rect(e),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,overflowX:getComputedStyle(e).overflowX}));
  const sizing=[...flow.querySelectorAll('.katex .sizing')].filter(visible).map(e=>{const classes=e.className,reset=/\breset-size(\d+)\b/.exec(classes),size=/(?:^|\s)size(\d+)(?:\s|$)/.exec(classes);return {classes,reset:reset?Number(reset[1]):null,size:size?Number(size[1]):null,font:style(e).font,parentFont:style(e.parentElement).font,area:area(e)};});
  const titles=[...flow.querySelectorAll('.math-textbook-stage--current > .math-textbook-stage-active-title')].filter(visible).map(e=>({stageId:e.parentElement.dataset.testid.replace('math-textbook-stage-',''),parts:parts(e.querySelector('strong')),strongFont:style(e.querySelector('strong')).font,...style(e)}));
  const roles=[...flow.querySelectorAll('.reading-role-marker[data-testid]')].filter(visible).map(e=>({testId:e.dataset.testid,kind:[...e.classList].find(c=>c.startsWith('reading-role-marker--'))?.replace('reading-role-marker--',''),...style(e)}));
  const numberIssues=[];const numbers=[...flow.querySelectorAll('.numbered-equation')].filter(visible).map(e=>{const tag=e.querySelector('.numbered-equation-label'),body=e.querySelector('.numbered-equation-body'),t=tag?rect(tag):null;if(t&&(t.left< -1||t.right>innerWidth+1))numberIssues.push({kind:'式番号が画面外',number:e.dataset.equationNumber,rect:t});if(tag&&body&&visible(tag))for(const ink of body.querySelectorAll('.katex-html,button.reading-formula-choice')){if(!visible(ink))continue;const q=rect(ink);if(q.left<t.right-1&&q.right>t.left+1&&q.top<t.bottom-1&&q.bottom>t.top+1)numberIssues.push({kind:'式番号と字面の重なり',number:e.dataset.equationNumber,tag:t,ink:q});}return {number:e.dataset.equationNumber,area:area(e),rect:t};});
  const controls=[...flow.querySelectorAll('button[data-testid^="textbook-item-"],button.reading-choice-option')].filter(visible).map(e=>({id:e.dataset.testid,...rect(e)}));
  const sourceEvidence=e=>({paragraphCount:[...e.querySelectorAll('.reading-paragraph')].filter(visible).length,formulaIDs:[...e.querySelectorAll('[data-testid^="textbook-formula-"]')].filter(visible).map(x=>x.dataset.testid.replace('textbook-formula-',''))});
  const stageElements=[...flow.querySelectorAll('.math-textbook-compact-flow > section.math-textbook-stage')].filter(visible).map(e=>({id:e.dataset.testid.replace('math-textbook-stage-',''),current:e.classList.contains('math-textbook-stage--current')}));
  const references=[...flow.querySelectorAll('.math-textbook-stage--current [data-testid^="math-textbook-context-"]')].filter(visible).map(e=>({id:e.dataset.testid.replace('math-textbook-context-',''),...sourceEvidence(e)}));
  const results=[...flow.querySelectorAll('[data-result-source]')].filter(visible).map(e=>({source:e.dataset.resultSource,stageId:e.closest('section.math-textbook-stage').dataset.testid.replace('math-textbook-stage-',''),area:area(e),...sourceEvidence(e)}));
  return {articleEnabled:flow.hasAttribute('data-n0106-display'),rootRem:parseFloat(getComputedStyle(document.documentElement).fontSize),pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,paragraphs,panels,semantic,semanticMath,sizing,titles,roles,numbers,numberIssues,controls,stageElements,references,results};
 });
}

export function verifyDisplay(m,{f,stage,saved,map,normalize,feedback,coverage,isResolved,contextRefs,sourceView,width,label}) {
 assert.equal(m.articleEnabled,true,'対象6単元/版のarticle属性');assert.ok(m.pageWidth<=m.viewport+1,'表示面全体の横はみ出し');
 const known=new Set(Object.keys(map.partsByRaw).map(raw=>JSON.stringify(mergeText(expectedParts(raw,map,normalize)))));
 for(const s of m.semantic)assert.ok(known.has(JSON.stringify(actualParts(s.parts))),'未知の表示変換または数学片の不一致: '+JSON.stringify(s));
 for(const p of m.paragraphs){close(p.font,18,p.area+'の主本文18px');close(p.lineHeight,32.4,p.area+'の主本文行高');coverage.areas.add(p.area);}
 for(const p of m.panels){const item=f.items[p.id];assert.ok(item,'問いの元項目');assert.ok(p.question,'問いが存在');assert.deepEqual(actualParts(p.question.parts),mergeText(expectedParts(item.prompt,map,normalize)),'問いの原文/数式対応');close(p.question.font,18,'問い18px');close(p.question.lineHeight,32.4,'問い行高');for(const t of p.question.textLeaves){close(t.font,18,'問い子孫の日本語18px');close(t.lineHeight,32.4,'問い子孫の行高');}coverage.prompts.add(width+':'+p.id);
  const rec=saved?.answers?.[p.id],expectedHint=rec&&!isResolved(item,rec)&&rec.attemptCount>0&&item.hints.length?[feedback(p.id,rec.value),item.hints[Math.min(rec.attemptCount-1,item.hints.length-1)]].filter(Boolean):[];
  assert.equal(Boolean(p.hint),expectedHint.length>0,'元の誤答ヒントgate');if(p.hint){const expected=expectedHint.flatMap((raw,i)=>[...(i?[{type:'text',text:' '}]:[]),...expectedParts(raw,map,normalize)]);assert.deepEqual(actualParts(p.hint.parts),mergeText(expected),'回答別説明と元ヒントを原文どおり個別表示');close(p.hint.font,18,'ヒント本文18px');close(p.hint.lineHeight,32.4,'ヒント本文行高');for(const t of p.hint.textLeaves){close(t.font,18,'ヒント本文子孫18px');close(t.lineHeight,32.4,'ヒント本文子孫行高');}coverage.hints.add(width+':'+p.id+':'+Math.min(rec.attemptCount-1,item.hints.length-1));}
 }
 for(const t of m.titles){close(t.padding[1],12,'見出し右余白12px');close(t.padding[3],12,'見出し左余白12px');const source=f.stages.find(s=>s.id===t.stageId);assert.ok(source,'段階見出しID');assert.deepEqual(actualParts(t.parts),mergeText(expectedParts(source.label.ja,map,normalize)),'段階名の数学表示');}
 const choiceIDs=b=>(b.parts??[]).filter(p=>p.type==='choice').map(p=>p.itemId);
 const current=f.stages.find(s=>s.id===m.titles[0]?.stageId);assert.ok(current,'現在段階の実DOM');const question=current.blocks.flatMap(choiceIDs).find(id=>!isResolved(f.items[id],saved?.answers?.[id]))??null;
 const refs=contextRefs(current,f.unit.sections[0].readingFlow,question);assert.deepEqual(m.references.map(r=>r.id),refs,'可視の前段参照が元contextと完全一致');
 const verifySource=(entry,ref)=>{const source=sourceView(ref,f.unit.sections[0].readingFlow);assert.ok(source,'参照/結果の実source');if(source.type==='paragraph')assert.equal(entry.paragraphCount,1,'前段/結果の主本文を隠さない');if(source.type==='formula')assert.deepEqual(entry.formulaIDs,['s5-record-'+ref],'前段/結果の元式IDを隠さない/重複しない');};for(const r of m.references)verifySource(r,r.id);
 const expectedResults=[];for(const observed of m.stageElements){const st=f.stages.find(s=>s.id===observed.id);assert.ok(st);const complete=st.blocks.flatMap(choiceIDs).every(id=>isResolved(f.items[id],saved?.answers?.[id]));if(!observed.current||complete)for(const ref of f.plan.resultBlockIdsByStage[st.id]??[]){const source=sourceView(ref,f.unit.sections[0].readingFlow);assert.ok(source);if(choiceIDs(source).every(id=>isResolved(f.items[id],saved?.answers?.[id])))expectedResults.push({stageId:st.id,source:ref});}}
 assert.deepEqual(m.results.map(r=>({stageId:r.stageId,source:r.source})),expectedResults,'可視の確定結果を元stage/sourceへ厳密対応');for(const r of m.results)verifySource(r,r.source);
 const markers=f.plan.readingFlow.filter(b=>b.type==='marker');for(const r of m.roles){const id=r.testId.replace('reading-role-'+r.kind+'-',''),src=markers.find(b=>b.id===id);assert.ok(src&&src.kind===r.kind,'役割マーカーの原ID/種類');if(r.kind==='summary'){close(r.font,m.rootRem*1.22,'まとめの上位見出し寸法');assert.deepEqual(r.border,[0,0,0,0],'まとめへ小枠を追加しない');}else{assert.ok(['example','proof','check'].includes(r.kind));close(r.font,m.rootRem*.8,'役割小ラベル寸法');assert.deepEqual(r.border,[1,1,1,1]);for(let i=0;i<4;i++)close(r.padding[i],m.rootRem*(i%2?.45:.15),'役割小ラベル内余白');}coverage.roles.add(width+':'+f.code+':'+id);}
 for(const math of m.semanticMath){assert.equal(math.annotations.length,1,'数学片一つのannotation');assert.equal(math.rootFonts.length,1,'数学片一つのKaTeX根');close(math.rootFonts[0],math.font,'意味表示KaTeXの親役割寸法');assert.ok(math.rect.left>=-1&&math.rect.right<=m.viewport+1,'数学片の局所boxが画面内');if(math.scrollWidth>math.clientWidth+1)assert.ok(['auto','scroll'].includes(math.overflowX),'長い数学片に局所スクロール');}
 // KaTeX 0.16.47のsize1..11。親からの比率を検査し、指数を18pxへ潰さない。
 const sizes=[null,.5,.6,.7,.8,.9,1,1.2,1.44,1.728,2.074,2.488];for(const s of m.sizing){assert.ok(s.reset>=1&&s.reset<=11&&s.size>=1&&s.size<=11,'未知のKaTeX sizing class');close(s.font,s.parentFont*sizes[s.size]/sizes[s.reset],'KaTeX指数/添字の縮尺',.35);coverage.sizing.add(width+':'+f.code);}
 for(const c of m.controls)assert.ok(c.width>=43.5&&c.height>=43.5,'未回答箇所/回答選択肢の44px: '+JSON.stringify(c));
 assert.deepEqual(m.numberIssues,[],'参照/結果/履歴を含む式番号の衝突/画面外');
 coverage.labels.add(label);
}

export async function observeLater(page,code) {
 return page.getByTestId('textbook-reading-flow').evaluate((flow,code)=>{
  const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&!e.closest('details:not([open])');};
  const style=e=>{const s=getComputedStyle(e);return {font:s.fontSize,lineHeight:s.lineHeight,padding:s.padding,border:s.borderWidth};};
  return {code,revision:document.querySelector('[data-testid="n0910-revision-page"]')?.getAttribute('data-revision')??null,articleEnabled:flow.hasAttribute('data-n0106-display'),semanticNodes:flow.querySelectorAll('.n0106-semantic-text,.n0106-semantic-math').length,titles:[...flow.querySelectorAll('.math-textbook-stage-active-title')].filter(vis).map(style),paragraphs:[...flow.querySelectorAll('.reading-paragraph,.construction-lesson-original-question')].filter(vis).slice(0,8).map(style),labels:[...flow.querySelectorAll('.construction-lesson-kind,.n07-step-caption > span,.reading-role-marker')].filter(vis).map(style),chains:[...flow.querySelectorAll('.reading-derivation-chain')].filter(vis).map(style)};
 },code);
}
