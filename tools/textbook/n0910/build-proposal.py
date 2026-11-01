"""Rebuild the existing review document from exact current evidence; no app publication."""
import hashlib, html, json, sys
from pathlib import Path
REPO = Path(__file__).resolve().parents[3]
WORK = REPO/'work/items/W-MATH-043-n0910-restart'
def load(n): return json.loads((WORK/'NODE_DESIGN.json' if n == 'n0910-node-design.json' else WORK/'evidence'/n).read_text())
def esc(x): return html.escape(str(x))
def dump(x): return '<pre>'+esc(json.dumps(x,ensure_ascii=False,indent=2))+'</pre>'
def table(headers, rows): return '<div class="scroll"><table><thead><tr>'+''.join('<th>'+esc(h)+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+esc(c).replace('\n','<br>')+'</td>' for c in r)+'</tr>' for r in rows)+'</tbody></table></div>'
def details(title, content): return '<details><summary>'+esc(title)+'</summary>'+content+'</details>'
def sec(title, body): return '<section><h2>'+esc(title)+'</h2>'+body+'</section>'
d=load('n0910-node-design.json'); m=load('migration-analysis.json'); p=load('process-requirements.json'); t=load('technical-requirements.json')
hashd=hashlib.sha256((WORK/'NODE_DESIGN.json').read_bytes()).hexdigest()
body='<header><p class="status">改訂具体案＋実装・検査記録／正式工程の残件あり</p><h1>N09・N10 再開提案書</h1><p>2026年10月30日（日本時間）｜P-RESTART-01 統合改訂5｜詳細設計r5</p><p>依頼：提案書の不足を補い、A・B・監視役を実際に機能させ、工程1〜4（実装・検査）まで進める。公開は今回の範囲に含めない。</p></header>'
body+=sec('現在の到達点', '<p>全35問・86ノードの詳細設計を96部品として具体化した。原資料334ブロックの対応先は実在を検査済み。これは元79部品の原本回収ではなく、今回の再設計である。通常routeの実reader、source-bound compiler、保存移行、旧版archive、home進捗・reset、共通body・関係記号列まで実装した。現行候補の四幅全回答と反例検査を別表に記録する。正式工程では初回審査の非露出条件を充足しておらず、第4全体を正式合格とはしない。</p>'+table(['範囲','現在の状態','残る判定'],[
('1 現在位置','main cce7ba7d28812dede85e2d61c082873fc1b9b864／app基点18839ba97ec73c99f41c8715c3a888524b743358を区別。再開時に接続rrikunagasige-dot、repo ID1391122224を確認。','新しい公開は実施していない。'),
('2 原本','元提案b6418b8c…・NODE_DESIGN 8e8267e7…はhashのみ。新版未公開実装原本は未回収。','過去の探索範囲を全履歴不存在へ拡張しない。'),
('3 具体設計','41+45ノード、42+54部品。本文・条件・行gate・候補・誤答・結論・次用途を全ノード収録。','正式R04/native receiptは未取得。今回の範囲指示と本人品質受入を分ける。'),
('4 実装・検査','通常route、実reader、96部品の状態処理、7同義記録の移行、環境別保存、旧版比較、実測group配置、4hash照合。','本書の最新検査表を参照。正式nativeの初回非露出審査条件は未充足。'),
('5 公開／6終了','未着手。','今回範囲外。本人受入・Gold・新学習は付与しない。')]))
body+=sec('前稿から補ったものと、今回検出した抜け',table(['発見','是正','証拠範囲'],[
('旧仕様の省略・追跡不足','工程61要求と技術47要求を個別収録。継承・変更・記載先・審査・残件を示す。','要求を記載したことと実装合格を分離。'),
('原資料の対応先IDを非空だけで合格にしていた','実在するlead／row／part／terminalへ解決。存在しないIDの反例を追加。','9構造試験、全334対応先。意味継承の証明ではない。'),
('固定後の設計変更へ旧審査を流用する危険','r2/r3記録は履歴として保持し、r5と移行r4へのB再審査を保存。','下記の対象hash単位。'),
('生徒条件に制作指示・誤答説明に直接解答','4ノードの条件と作者注記を分離、8部品の誤答誘導、22ノードの結論の次用途を修正。','29ノード34箇所。ID／正答／選択値は不変。'),
('旧HTMLに未確定の説明が残存','本書を現設計・現記録から全面再生成。旧現存版台帳を新版の確定設計と混同しない。','本書の生徒用文はアプリ画面の検査済みを意味しない。')]))
body+=sec('今回の設計と元計画の差分',table(['対象','旧ZIPの計画','今回の再設計'],[
('N09','31構成親39part＋auto5、local0','30回答親42part、11非回答ノード（説明と自動結論を含む）'),
('N10','29構成親40part＋local7＋auto9','39回答親54part、6非回答ノード。同義保存候補7は39回答親の内数。'),
('合計','60構成親79part＋local7、auto14','69回答親96part、17非回答ノード。親／部品／元nodeを別集計する。'),
('Q08','平方2・比較2の結果判断','左右それぞれ中項・平方和・小数化＋比較2の計8部品'),
('Q21','元部品配分は未回収','分母1＋展開4＋定数和1の計6部品。元の4→6という主張はしない。')])+ '<p>元承認のhashを今回の再設計へ付け替えない。今回の「4まで」指示はこの範囲の作業継続根拠であり、本人の教材品質受入ではない。</p>')
body+=sec('担当・非作者審査・監視',table(['担当','今回実行したこと','限界'],[
('主担当','来歴・統合、実compiler/store/route接続、全幅harness、native adapter・独立反例検査、Work記録。','主担当の統合も監視・非作者確認の対象。'),
('A teaching','現r5を作成。数学・誘導・条件・誤答・結論を点検・修正。','A作者部分の自己審査を非作者合格としない。'),
('B layout','r4数学審査＋r5コピー差分追審、全45件の移行比較、reader/archive・共通bodyとrelation列を実装。A/M差分の非作者検査。','B作者の実装自己点検を非作者審査と呼ばない。最終画像・保存試験の範囲を別記。'),
('監視 process_monitor','61行の106参照先を照合。対象版不一致・HTML未統合・対応先検査の穴を指摘。','監視は数学・配置の専門審査を代替しない。')])+ '<p>現在のセッションは固定A・B・監視の子3名。孫・入替を増員の手段にしない。過去セッションの監視が常時動いていたという証拠にはしない。プラットフォーム自体をガードが遮断するとは言わない。</p>')
for u in d['units']:
 content=table(['問','段階・原問題'],[(str(s['q']),s['title']+'\n'+json.dumps(s.get('sourceQuestionParts',[]),ensure_ascii=False)) for s in u['stages']])
 for n in u['nodes']:
  content+=details(n['nodeId']+'｜Q'+str(n['q'])+'｜'+n['goal'],table(['項目','確定した案'],[
   ('分類／部品順',n['classification']+' / '+', '.join(n['partOrder'])),
   ('生徒の導入本文',n.get('leadPlainText','')+'\n'+json.dumps(n['leadParts'],ensure_ascii=False)),
   ('数学条件', '\n'.join(n['assumptions'])),
   ('前提node／認定結果',json.dumps({'nodes':n['prerequisiteNodeIds'],'results':n['requiredResultRefs']},ensure_ascii=False)),
   ('次の用途',json.dumps(n.get('nextUseRefs',[]),ensure_ascii=False))])+ '<h3>式・文の表示順とgate</h3>'+dump(n['rows'])+'<h3>各穴：候補・正答・誤答後の誘導</h3>'+dump(n['parts'])+'<h3>確定後だけ記録する結論</h3>'+dump(n['terminalRecord'])+details('原資料ブロックごとの継承・変更・記載先',dump(n['sourceCoverage']))+details('作者注記／保存判断／検算主張',dump({k:n.get(k) for k in ['authorNotes','migration','assertions']})))
 body+=sec(u['code']+' 全ノード詳細（設計者用・正答を含む）',content)
body+=sec('保存移行：原local7の復元と区別する', '<p>旧N10全45項目と新45ノードを、原問題・条件・学習操作・候補・正誤・保存尺度で比較し、同義候補7／変更32／履歴のみ6へ分類した。Bが全45件の現物snapshotを照合して意味対応の採用を支持した。件数に合わせた任意選択ではない。</p>'+table(['旧ID','分類','新しい対象'],[(e['oldId'],e['classification'],str(e.get('newPartIds',e.get('newPartId',e.get('sourceNodeId',''))))) for e in m['entries']])+ '<p>実readerは実装済みのmigrateReviewedNestedProgressを使用する。旧source・新設計・比較台帳の三つの固定bytesと現compiledを照合し、未到達はpending、新しいnative回答とresetを優先する。初答・選択回数・時刻・元archiveを保持する。旧prototypeのmigrateNestedRecordsは意図的に常時BLOCKEDのままで、任意の同義hashだけでは移行しない。</p>'+details('全45件の根拠・候補対応・旧snapshot・現snapshot',dump(m))+details('保存ポリシー：初答不明・未到達回答・reset優先・archive',dump(m['recordPolicy'])))
for title,data,field in [('工程要求61件',p,'original_requirement'),('技術要求47件',t,'requirement')]:
 content=''
 for r in data['requirements']:
  content+=details(r['id']+'｜'+r[field],'<h3>最新checkpoint</h3>'+dump(r.get('final_browser_checkpoint',r.get('latest_checkpoint',r.get('current_implementation_review',{}))))+details('原要求・過去状態・審査履歴',dump(r)))
 body+=sec(title+'：旧要求→継承・差分→記載先→審査→残件',content)
body+=sec('検査結果と適用範囲',table(['検査','結果','対象と限界'],[
('構造validator＋反例','9件PASS','現r5 86node／96part／334ブロック、対応先実在。意味・画面は別。'),
('runtime／compiler／component','最新検査表参照','実reader・catalog・store・migration・archiveと、native snapshotsを同じ状態処理へ接続。実幾何は実browserで別検査。'),
('数学検算','PARTIAL','61部品の全183候補をPASS。累計評価185は後に未対応となる2候補も含む。35部品の記号・操作意図等は機械未対応。未対応35部品・97候補は現r5をBが別途argumentとして再審査。AI_ARGUMENT_REVIEWEDであり機械証明ではない。'),
('renderer','最新固定SHAの全幅表参照','実reader全96部品のinitial・全wrong候補・filled、17非回答ノード、純数学履歴。旧64fixtureは歴史資料として保持。'),
('3名guard','9件PASS','session・operation・nonce・120秒・停止完了含む人数。実Work全境界での運用完了ではない。'),
('型検査／対象lint','PASS','現追加TS／TSX対象。全repositoryの全検査PASSを主張しない。')])+details('現行構造検査',dump(load('node-design-check.json')))+details('現行有限数学検査（未対応を含む）',dump(load('finite-math-check.json')))+'<p>レビュー記録内の旧版hashに対する再検査指摘は当時の履歴である。現r5の再検査・差分審査は上記の現行検査結果とBの追審対象hashを参照する。</p>'+details('Aの記録',dump(load('teaching-review-current.json')))+details('Bの対象hash付き記録',dump(load('layout-review-current.json'))))
body+=sec('第4を終えるまでの実作業',table(['順','残件','完了条件'],[
('1','現Workを既存Runtimeの現在の再照合としてR01から登録。過去実装を遡及PASSにしない。','初回source-first／作者理由非露出の条件は現3名の履歴では立証できない。通常の非作者審査と分ける。'),
('2','実装済み：source-bound compiler・限定nestedContract・compiled reader・起動/Store/画像までの実装manifest。','sidecarだけの表示を検証済みcompileと呼ばない。本文・条件・番号・図まで同artifactへ結ぶ。'),
('3','実装済み：審査済み7候補の保存adapter、旧raw archive、pending、reset、namespace隔離。','不正record・意味違いを拒否。reload／版往復で誤復活せず、新版完了を捏造しない。'),
('4','実施済み：最新固定候補で実reader全96partの未回答・全誤答・途中・完成を4幅で検査。','実font／18px／44px／実内幅／式番号／根本・局所軸／線ownerを検査。49件は元ログ未回収のため解決扱いにしない。'),
('5','N08r7・N11・旧版・既存保存への回帰と非作者画面審査。','固定候補で必要な検査を完了し、重大未解決を残さない。')])+ '<p>この残件を本人の作業として返さず、実装担当が続行する。今回は公開・本人受入・学習・終了の完了を先取りしない。</p>')
body+=sec('正式工程を進めるための具体的な追加案', '<p>現固定3名は全履歴を共有したため、作者の説明に触れる前の初回審査という条件を後から満たせない。この共有方法は実施側の誤りであり、通常の非作者追審を初回審査へ読み替えない。</p><p>提案：固定3名の例外として、履歴を共有しない審査員を1名だけ追加する（累計4名、孫agentなし）。原資料と生徒に見える表示だけから最初の所見を固定し、その後に設計理由と照合する。既存の初回非露出条件は維持する。必要なWork専用人数policyとguardを明示的に更新・検査してから、現在の提案と版に対応する正式登録を進める。</p><p>追加審査員はまだ作成していない。過去の「工程4まで続けて」という指示は作業範囲の根拠として保持し、今回生成した提案hashを当時閲覧・承認した証拠にはしない。現版の承認event、正式R01以後のreceipt、R02以後の必須入力・審査は未完了である。</p>')
body+=sec('現在の候補・実検査と残件',dump(load('final-verification-current.json')))
body+=sec('版と根拠の固定',dump({'designRevision':d['revision'],'designSha256':hashd,'sourceBase':'18839ba97ec73c99f41c8715c3a888524b743358','branch':'work/n0910-restart-20261030','scope':'LOCAL_CANDIDATE_NOT_PUBLISHED','formalR04':'NOT_COMPLETED','step4':'IN_PROGRESS','originalUnrecoveredProposalSha256':'b6418b8c3ecfaeb727b2db374d1586937b1be1f051edea12753a6e43f292a0ef','originalUnrecoveredNodeDesignSha256':'8e8267e7b16c130941ec8ee7e264baad89e93282d47750a83630c79ed37c8b89'}))
css='body{margin:0;background:#f3f5f8;color:#172231;font:16px/1.8 system-ui,sans-serif}main{max-width:1120px;margin:auto;padding:28px 20px 70px}header,section{background:white;border:1px solid #d7dfe9;border-radius:8px;padding:24px;margin:0 0 20px}h1{font-size:29px}h2{font-size:22px;border-bottom:2px solid #344e74;padding-bottom:8px}h3{font-size:17px}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid #d1dbe6;padding:10px;vertical-align:top;text-align:left;overflow-wrap:anywhere}th{background:#edf1f7}.scroll{overflow:auto}details{border:1px solid #d7dfe9;padding:12px;margin:12px 0}summary{font-weight:600;cursor:pointer}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f6f8fa;padding:14px;font:13px/1.7 ui-monospace,monospace}.status{background:#fff0d5;padding:8px;font-weight:700}@media(max-width:600px){section,header{padding:16px}main{padding:12px}}'
out='<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>N09・N10 再開提案書・統合改訂</title><style>'+css+'</style><main>'+body+'</main></html>'
if len(sys.argv) > 1: Path(sys.argv[1]).write_text(out)
(WORK/'PROPOSAL.html').write_text(out)
print(json.dumps({'file':'N0910_Restart_Proposal_20261030.html','bytes':len(out.encode()),'sha256':hashlib.sha256(out.encode()).hexdigest(),'designSha256':hashd}))
