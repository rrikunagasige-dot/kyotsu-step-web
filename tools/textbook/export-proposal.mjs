import { invariant } from './util.mjs';
import { verifyPlan } from './verify.mjs';
import { compileLesson } from './compile-lesson.mjs';
export function proposalMarkdown(plan){
 invariant(verifyPlan(plan).status==='PASS','design validation failed');
 const compiled=compileLesson(plan);
 let out='# N07 全件具体設計 — コード＋AI制作経路の試作\n\nStatus: PROPOSED\n\n教材本文への実装前の候補。原問14件、無番号説明を含む原資料'+plan.sourceCatalog.length+'段落を追跡し、'+plan.nodes.length+'ノード・'+plan.nodes.filter(n=>n.interaction).length+'回答操作を設計。画面・公開の検証は未実施。\n\n';
 out+='## 基準・既習・進捗\n\n教師Word SHA256: '+plan.sourceHash+'。前提は十進位取り、整数の四則、第一タイトルで説明した指数法則・等式の基本操作。有理数・循環小数・素因数分解等は本文で導入する。\n\nrevision4は候補。既存n07-10（既約分数）とn07-14（定義による分類）は要求・正答・候補を保持して移行候補とする。他の旧複合回答12件は履歴へ退避し、分割した新しい判断は未回答とする。全体resetは行わない。実移行のコードは本文設計承認後。\n\n';
 out+='## 共通表示\n\n問題と条件→今の小目標→必要な前結果→誘導文・式・実回答欄→正答後の説明・結果→次の用途。完了段階の結論を残し、全文を再展開できる。原則は短い等式一行、変形群は等号揃え、番号は論理式IDへ固定、長い候補と分数は独立に幅を検証。下記の表は指定回答後に表示。\n\n';
 for(let q=1;q<=14;q++){
  const problem='N07-Q'+String(q).padStart(2,'0');out+='## '+problem+'\n\n';
  for(const n of plan.nodes.filter(n=>n.problemId===problem)){
   out+='### '+n.id+' — '+n.goal+'\n\n';
   out+='役割：'+n.role+'。段階：'+n.stageId+'。原資料：'+n.sourceRefs.join(', ')+'。\n\n';
   out+='**回答前の本文**\n\n'+n.before+'\n\n';
   if(n.inputLatex)out+='$$'+n.inputLatex+'$$\n\n';
   if(n.knownRefs.length)out+='使える前結果：'+n.knownRefs.join(', ')+'。このIDの確定した式・結論だけを参照欄へ表示。\n\n';
   if(n.interaction){const a=n.interaction;out+='**本人が担う操作**：'+a.classification+'。'+a.reason+'\n\n';out+='問い：'+a.prompt+'\n\n';out+='回答形式：'+a.answerType+'。式内の配置：`'+(a.prefixLatex||'')+'〔実回答欄〕'+(a.suffixLatex||'')+'`。\n\n';
    out+='| 選択肢 | 採点・根拠 |\n|---|---|\n';for(const c of a.choices)out+='| '+c.replaceAll('|','\\|')+' | '+(c===a.answer?'正答':a.distractorReasons[c])+' |\n';
    out+='\nヒント：'+a.hints.join('／')+'\n\n支援：'+a.scaffoldLevel+'。理由：'+a.supportReason+'\n\n';
   }else out+='未知の定義・性質は説明する段階。名称を当てる穴は置かない。\n\n';
   out+='**正答後／説明後**\n\n'+n.after+'\n\n';if(n.outputLatex)out+='$$'+n.outputLatex+'$$\n\n';
   if(n.table){out+='表示時点：この段階の正答後。\n\n';out+='| '+n.table[0].join(' | ')+' |\n|'+n.table[0].map(()=> '---').join('|')+'|\n';for(const row of n.table.slice(1))out+='| '+row.join(' | ')+' |\n';out+='\n';}
   out+='保存する結果：'+n.resultId+'。式番号：'+(compiled.equationNumbers[n.id+'-output']?'（'+compiled.equationNumbers[n.id+'-output']+'）':'出力式なし')+'。anchor：'+n.id+'-output（出力式がある場合）。\n\n';
  }
 }
 out+='## 原資料対応・省略の有無\n\n| source | 教材ノード | 扱い・理由 |\n|---|---|---|\n';for(const c of plan.coverage)out+='| '+c.sourceId+' | '+(c.nodeIds.join(', ')||'—')+' | '+c.disposition+'：'+c.reason+' |\n';
 out+='\n## 検証と未完了\n\n構造・前提・参照・source対応・選択肢の機械検査に加え、原本の条件・一般論証・答えの早期露出・説明の接続を監査する。自然文の完全な自動保証はしない。既存schemaへのcompileはreview artifactで、アプリへの登録・表示・進捗移行・スマホの整列・全実操作・公開は具体設計承認後に行う。\n';return out;
}
