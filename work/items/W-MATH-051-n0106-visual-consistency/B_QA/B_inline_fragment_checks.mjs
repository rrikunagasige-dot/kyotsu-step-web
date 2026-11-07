// 未適用の追加検査案。wrapperと最上位KaTeX根の行boxを採り、分数内部の上下配置を行分断と数えない。
import assert from 'node:assert/strict';
export async function collectInlineFragments(scope){return scope.evaluate(root=>{
 const rect=r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height});
 const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&!e.closest('details:not([open]),.typeset-probe,.typeset-inline-probe');};
 return [...root.querySelectorAll('.typeset-inline-math')].filter(visible).map(e=>{
  const para=e.closest('.reading-paragraph'),part=[...(para?.children??[])].findIndex(c=>c===e||c.contains(e)),owner=e.closest('[data-reading-layout-block],[data-n04-sample-block]');
  const roots=[...e.querySelectorAll('.katex')].filter(k=>k.closest('.typeset-inline-math')===e&&!k.closest('.typeset-probe,.typeset-inline-probe'));
  return {blockId:owner?.getAttribute('data-reading-layout-block')??owner?.getAttribute('data-n04-sample-block')??null,partIndex:part,display:e.classList.contains('typeset-inline-math--display'),wrapperRect:rect(e.getBoundingClientRect()),wrapperClientRects:[...e.getClientRects()].map(rect),paragraphRect:para?rect(para.getBoundingClientRect()):null,roots:roots.map(k=>({source:k.querySelector('annotation')?.textContent??null,font:parseFloat(getComputedStyle(k).fontSize),rect:rect(k.getBoundingClientRect()),clientRects:[...k.getClientRects()].map(rect),sizing:[...k.querySelectorAll('.sizing')].map(s=>({classes:s.className,font:parseFloat(getComputedStyle(s).fontSize)}))}))};
 });
});}
export function verifyInlineFragments(rows){for(const row of rows){if(row.display)continue;assert.equal(row.wrapperClientRects.length,1,'別行化していない数学wrapperを2行へ分断しない: '+JSON.stringify(row));assert.equal(row.roots.length,1,'inlineの最上位KaTeX根は一つ');assert.equal(row.roots[0].clientRects.length,1,'括弧/分数内部の配置ではなく根自体の2行分断を拒否: '+JSON.stringify(row));}}

// N01導入の数学part1に直結する原句点だけを測る。全体のtextContentはKaTeXで重複するため使わない。
// scopeは現unitのarticle。source/parts同値検査は呼出元の既存検査を継続し、この測定で代替しない。
export async function collectIntroPunctuation(scope){return scope.evaluate(root=>{
 const rect=r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height});
 const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&!e.closest('details:not([open]),.typeset-probe,.typeset-inline-probe');};
 const rows=[];
 for(const math of root.querySelectorAll('.typeset-inline-math--display')){
  if(!visible(math))continue;
  const formula=math.querySelector('[data-typeset-source="inline-paragraph-intro-1"]');if(!formula)continue;
  const para=math.closest('.reading-paragraph'),children=[...(para?.children??[])],part=children.findIndex(e=>e===math||e.contains(math));
  const next=children[part+1],walker=next?document.createTreeWalker(next,NodeFilter.SHOW_TEXT):null;let first=null,node;
  while(walker&&(node=walker.nextNode())){if(node.textContent.length){first=node;break;}}
  let punctuation=null;if(first){const range=document.createRange();range.setStart(first,0);range.setEnd(first,1);punctuation={text:first.textContent.slice(0,1),rects:[...range.getClientRects()].map(rect)};}
  const roots=[...formula.querySelectorAll('.katex')].filter(e=>!e.closest('.typeset-probe,.typeset-inline-probe'));
  const rootClientRects=roots.map(e=>[...e.getClientRects()].map(rect));
  const lines=[];for(const line of [...formula.querySelectorAll('.typeset-line')].filter(visible)){
   const glyphRects=[];let baseCount=0;
   for(const html of line.querySelectorAll('.katex-html')){if(html.closest('.typeset-probe,.typeset-inline-probe'))continue;
    for(const base of [...html.children].filter(e=>e.classList.contains('base'))){baseCount++;const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);let n;while((n=walker.nextNode())){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects())if(r.width>0&&r.height>0)glyphRects.push(rect(r));}}
   }
   if(glyphRects.length)lines.push({baseCount,glyphRects,inkBox:{left:Math.min(...glyphRects.map(r=>r.left)),right:Math.max(...glyphRects.map(r=>r.right)),top:Math.min(...glyphRects.map(r=>r.top)),bottom:Math.max(...glyphRects.map(r=>r.bottom))}});
  }
  const last=lines.at(-1)?.inkBox,p=punctuation?.rects[0];
  rows.push({sourceId:'inline-paragraph-intro-1',partIndex:part,context:math.closest('.math-textbook-stage-reference-content')?'前段参照':math.closest('.first-theme-recorded-results')?'確定結果':math.closest('.math-textbook-stage--history')?'展開履歴':'本文（現段階または履歴）',stage:math.closest('[data-testid^="math-textbook-stage-"]')?.getAttribute('data-testid')??null,annotation:[...formula.querySelectorAll('annotation')].map(e=>e.textContent),paragraphRect:para?rect(para.getBoundingClientRect()):null,wrapperRect:rect(math.getBoundingClientRect()),punctuation,rootClientRects,lines,gap:p&&last?p.left-last.right:null,verticalOverlap:p&&last?Math.min(p.bottom,last.bottom)-Math.max(p.top,last.top):null,viewport:{width:innerWidth,height:innerHeight}});
 }
 return {対象:'N01 paragraph-introのpart1が別行化した実表示',未到達:rows.length===0,rows,限界:'glyphRectsは実文字Rangeのboxであり、pixel inkの画像解析ではない。別行化していない状態はこの句点検査の非対象。'};
});}
export function verifyIntroPunctuation(measurement){for(const row of measurement.rows){const why=JSON.stringify(row);assert.equal(row.partIndex,1,'N01導入の元数学part1: '+why);assert.equal(row.punctuation?.text,'。','元数学直後の原text先頭句点: '+why);assert.equal(row.punctuation.rects.length,1,'句点は一つの実行box: '+why);assert.equal(row.lines.length,1,'N01導入の三式は別行化時に実typeset-line一行: '+why);assert.equal(row.rootClientRects.length,1,'最上位KaTeX根は一つ: '+why);assert.equal(row.rootClientRects[0].length,1,'KaTeX根の物理行boxは一つ（指数やbase数を行数としない）: '+why);assert.ok(row.gap>=-0.5&&row.gap<=4,'句点を式の直後0〜4px（丸め0.5px）へ: '+why);assert.ok(row.verticalOverlap>0,'句点と数式の実文字boxに縦重なり: '+why);const p=row.punctuation.rects[0];assert.ok(p.left>=-0.5&&p.right<=row.viewport.width+0.5,'句点は横viewport内: '+why);}}
