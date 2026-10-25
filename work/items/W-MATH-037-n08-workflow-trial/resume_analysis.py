"""Finish the genuine R02 claim after adding the required per-case dispositions."""
from pathlib import Path
import sys,json
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from production import ai_request
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-037';nid='R02_CAUSE@n08';s=rt.state(W);claim=s['claims'][nid]
refs=[e['payload']['receipt'] for e in rt.store.events() if e['work']==W and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']]
outputs=[rt.store.get(rt.store.get(ref)['output']) for ref in refs]
corpus=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').read_text())
reasons={
'N07-USER-F01':('APPLY','N08で必要な距離・実数の順序・正の平方根・与条件を明示する。N07の循環小数の内容はコピーしない。'),
'N07-USER-F02':('APPLY','局所の差の符号を元の絶対値の問題へ戻す。F01/F02とproblemGroupsで対応する。'),
'N07-USER-F03':('APPLY','中身の符号を調べる必要性を先に置き、両辺操作の選択を追加する。'),
'N07-USER-F04':('APPLY','等号でつながる計算と、大小比較・場合別の論証を別の型へ分ける。'),
'N07-USER-F05':('ALREADY_SATISFIED','現行N08の絶対値の定義は黒字太字・math分割で実描画されている。制作メタ文だけ別途改善する。'),
'N07-USER-F06':('APPLY','現行N08のmath描画を保持し、今回見つかった参照HTMLの縦線欠落も別の抽出試験へ加える。'),
'n07-layout-relation':('APPLY','中央配置・番号・全候補の組版を新しい途中式でも確認する。元のN07の数値は使わない。'),
'n07-layout-positive':('ALREADY_SATISFIED','肯定された全体レイアウトを保ち、この評価を新しい穴の品質肯定へ変換しない。'),
'first-title-layout-positive':('APPLY','受入済みの式group・番号・枠をN08でも再利用する。'),
'N07-ACCEPTED-20261025':('OUT_OF_SCOPE','N07の全体受入は保護対象。N08修正版の個別観点や品質ラベルに使わない。'),
'N08-ACCEPTED-20261025':('ALREADY_SATISFIED','現行N08の受入を維持して既存の説明・31回答を保護する。新revisionの受入へ広げない。'),
'N09-REJECTED-20261025':('APPLY','Q05の二乗の比較と元の比較、Q01の原問順を全選択肢でそろえる。'),
'N10-REJECTED-20261025':('APPLY','Q07/Q09で中身全体の括弧と二項への負号、Q12で括弧ごとの冪を保つ。'),
'N09-ACCEPTED-20261025':('OUT_OF_SCOPE','N09全体の受入をN08修正版の品質ラベルへ流用しない。N09本文は保護する。'),
'N10-ACCEPTED-20261025':('OUT_OF_SCOPE','N10全体の受入をN08修正版へ流用しない。N10本文は保護する。'),
}
assert set(reasons)=={c['id'] for c in corpus['cases']}
decisions=[{'id':c['id'],'dimension':c['dimension'],'disposition':reasons[c['id']][0],'reason':reasons[c['id']][1],'evidenceRef':c['evidenceRef'],'targetEvidence':'FINDINGS.md; NODE_DESIGN.json; baseline DOM'} for c in corpus['cases']]
(B/'CASE_DISPOSITIONS.json').write_text(json.dumps({'corpusHash':corpus['hash'],'modelInferenceUsed':False,'cases':decisions},ensure_ascii=False,indent=2)+'\n')
rt.append('analysis_contract_rejection_recorded',W,{'node':nid,'reason':'Initial R02 submission omitted dispositions for retrieved cases and was rejected by integration.check_result. Actual claim/receipts retained.','remedy':'All 15 cases individually assessed in CASE_DISPOSITIONS.json; no extra quality labels.'})
request=ai_request(rt,W,nid);evidence=list(s['evidence'])
result={'verdict':'UNVERIFIED','evidence_refs':evidence,'capability_receipts':refs,'case_dispositions':decisions,'symptoms':['元問欄が途中目標に置き換わる','制作メタ文が学習本文に出る','両辺操作の式生成がない','Abs等の新adapter未対応','参考資料取込の数式・役割の欠落'],'confirmed_causes':['stage単位だけのproblem context','definition.afterの制作方針文','両辺操作と整理の圧縮','閉じたASTにAbs/sqrt/piとcaseJoinがない','HTML text投影とresearch import返却の属性欠落'],'hypotheses':[],'missing_learning_actions':['a−0の距離式生成','両辺に同じ操作を組み立てる','同じ原問への復帰'],'root_cause_signatures':['stage-fragmented-whole-problem','authoring-meta-in-learner-prose','missing-operation-generation','unsupported-conditional-math-adapter','reference-semantic-loss'],'unknowns':['新solution adapterではN08全体の厳密検算を実行できない。17の別実験を本番接続済みと呼ばない。'],'proofStatus':'AI_ARGUMENT_REVIEWED','formalProof':False,'lessonReadiness':'ACCEPTED_R4_PRESERVED; PROPOSED_R5_NOT_BUILT','aiReview':{'requestHash':request['requestHash'],'inputHash':request['task']['input_hash'],'reviewer':'current-assistant-source-visible-and-case-audit','evidence':'現行IRの再compileがsemanticと一致。現行の数学は既存argumentと別の17実験で照合した。新ASTの表現未対応を全体PASSへ昇格せず、R02をUNVERIFIEDとして保持。取得15事例は個別に目的と適用範囲を判断した。'}}
rt.submit(W,nid,claim['token'],result)
(B/'R02_CAUSE-n08.json').write_text(json.dumps({'node':nid,'result':result,'codeOutputs':outputs},ensure_ascii=False,indent=2)+'\n')
render(rt,W,B/'generated')
checkpoint={'next':rt.next(W),'proposalReady':True,'nativeR04Passed':False,'implementationApproved':False,'learnerModified':False,'learningLabelsAdded':0}
(B/'ANALYSIS_CHECKPOINT.json').write_text(json.dumps(checkpoint,ensure_ascii=False,indent=2)+'\n');print(json.dumps(checkpoint,ensure_ascii=False))
