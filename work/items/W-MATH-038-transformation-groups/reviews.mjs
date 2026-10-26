import fs from 'node:fs';
import {projectTransformationView} from '../../../tools/textbook/transformation/visible.mjs';
import {prepareSolutionReview,importSolutionReview} from '../../../tools/textbook/ai/solution-review.mjs';
const b='work/items/W-MATH-038-transformation-groups/',p=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Transformation.json'));
const catalog=JSON.parse(fs.readFileSync('work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json'));
const caseIds=catalog.cases.map(c=>c.id??c.caseId);
const dimensionEvidence={
 prerequisite_missing:'元の例題を式列の先頭に保ち、係数・定数・操作の前提を補助式で示す。',
 orphan_output:'補助計算の数を不等式全体へ戻す。r-cancel→r-add、r-divisor→r-divideを対応付ける。',
 unmotivated_operation:'定数項をなくす→係数を1にする目的を操作前に置く。',
 broken_derivation:'両辺への加算・整理・両辺への除算・商を別の検算atomとして保つ。',
 math_render_omission:'7行全体をsource stateへ結び、文中数式・分数内slot・比較記号を実描画検査する。',
 layout_discomfort:'式列の比較記号の列を揃え、説明を適切な行間へ置く。',
 layout_style_rejection:'既存の余白・概念の黒字・選択UIは継承し、通常変形の局所だけopt-in。',
 operation_order:'原問→操作→整理→次の操作→解の順を保ち、未来の商を先出ししない。',
 factor_grouping:'分子分母と積の対象をAST構造で保持する。N10の原問は変更しない。',
};
const dispositions=catalog.cases.map(c=>({caseId:c.id,status:dimensionEvidence[c.dimension]?'APPLIED':'NOT_APPLICABLE',evidence:dimensionEvidence[c.dimension]??(c.dimension==='term_semantics_missing'?'この局所例には新しい定義語を導入しない。既存の定義ブロックは改変しない。':'その教材・版全体への受入であり、N11新表示の品質labelや合格根拠へ転用しない。')}));
fs.writeFileSync(b+'CASE_DISPOSITIONS.json',JSON.stringify({cases:dispositions.map(c=>({id:c.caseId,disposition:c.status==='APPLIED'?'APPLY':'OUT_OF_SCOPE',reason:c.evidence}))},null,2)+'\n');
const observations=[
 ['定数部分を打ち消す加数を決める','元の3x-2<5と、-2に加えて0となる数を作る補助式が見える','定数項をなくして文字の項へ戻る','同じ加数を元の不等式の両辺へ使う','定数と同符号を選んで打ち消せない'],
 ['右辺にも同じ数を加える','前の補助式と左辺の加数が既知で、右辺だけ未完成','片側だけの操作にしない','両辺への加算を保った全体の不等式へ戻る','左辺だけを変えて大小関係を変える'],
 ['右辺の和を計算する','両辺への同じ操作が完成し、計算対象が見える','文字の係数を1へ変える準備をする','整理後の3x<7を残す','移項の符号と演算の符号を混ぜる'],
 ['係数を1にする除数を決める','前の全体の3x<7と3÷穴=1の補助式がある。直前の文は除数を言わない','文字だけの左辺を作る','正の除数を両辺へ適用する式へ戻る','係数をそのまま残すか負の1へ変える'],
 ['全体の不等式の商を完成する','両辺へ適用した除算と向きが見え、右辺の商だけが未完成','実数全体の範囲で解を表す','末尾の不等式を解として完成し、別の同じ答えカードを追加しない','分子と分母を逆にする'],
];
for(const phase of ['design','post-implementation']){
 const reviews=p.interactions.map((q,i)=>{
  const visible=projectTransformationView(p,p.interactions.slice(0,i).map(q=>q.id),{choicesOpen:q.id});
  const group=visible.groups[0],current=group.rows.find(r=>r.current?.id===q.id);
  const prepared=prepareSolutionReview({initial:group.rows[0],completed:group.rows.filter(r=>r.done),current},{phase,sourceRefs:['src/data/textbook/math/numbers/n11Authored.json','W-MATH-038/P-001/15'],caseIds,profile:'ordinary-transformation'});
  if(prepared.status!=='NEEDS_AI_REVIEW')throw Error('visible review rejected');
  const o=observations[i];
  const response={requestHash:prepared.request.requestHash,phase,reviewer:'current-assistant-visible-state-pass; not independent AI',learnerDecision:o[0],availableInformation:o[1],reasonToProceed:o[2],nextWholeState:o[3],misconception:o[4],reducedSupportVariant:'別の類題で補助計算を手本へ変更する候補。今回の既存採点IDは統合しない。',patternDecision:'一つの実数一次不等式を同じ条件で変形するT04。',groupBoundaryReview:'stage05-06は同じ原問。stage07の境界代入は意味の判断として分ける。',blankDecisionReview:o[0]+'。新規二枠と既存の別回答を混同しない。',prosePlacementReview:'目的は式の前、操作後の意味はその行の後へ配置。除数を先の穴より前に教えない。',terminalRoleReview:'最後の主行が解。境界検算への接続文は残し、単純な再掲は足さない。',visibleProgressionReview:'可視snapshotのcurrentだけが未完成。後続の行・閉じたhint・author expectedを入力に含めない。',findings:[],caseDispositions:dispositions};
  const result=importSolutionReview(prepared.request,response);if(result.status!=='PASS')throw Error(JSON.stringify(result));return {id:q.id,request:prepared.request,response};
 });fs.writeFileSync(b+(phase==='design'?'SOLUTION_REVIEWS_DESIGN.json':'SOLUTION_REVIEWS_IMPLEMENTATION.json'),JSON.stringify({reviews},null,2)+'\n');
}
console.log('Five isolated visible-state reviews per phase; same assistant; no quality labels.');
