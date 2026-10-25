"""Shareable role diagrams generated from the actual workflow stage/capability registry."""
from pathlib import Path
import sys,json,html,unicodedata,zipfile
ROOT=Path(__file__).resolve().parents[4];OUT=Path(__file__).resolve().parent;sys.path.insert(0,str(ROOT/'workflow'))
from definitions import CREATE,CORRECT
from capabilities import PLACEMENT
# Each row describes responsibilities within an existing stage, not new gates.
C=[
('C01_SOURCE','原資料の分析','問題・条件・無番号説明・図の意味を読み取る。','原本hash、段落・数式・図の抽出、対応漏れを検査する。','原資料と制作範囲を指定する。','原資料と教材内容の対応表'),
('C02_CONCEPT','概念・既習の整理','学習目標、概念の依存、説明する順序を設計する。','未導入の記号、参照先、依存関係の構造を検査する。','対象学年・学習目的など必要な条件を伝える。','学習目標・既習台帳'),
('C03_PATTERN','規則・事例の参照','過去の成功・失敗例が今回に当てはまるか判断する。','版・科目・modeで検索。モデル不在なら順位なしcatalogへ切り替える。','この工程の個別承認は不要。','適用／適用外の理由付き事例一覧'),
('C04_SOLUTION','省略のない完全解法','条件から結論までの数学操作と根拠を書く。','登録済みsolverで検算。未対応の証明を機械証明済みとしない。','この工程の個別承認は不要。','完全解法・操作の根拠・未解決点'),
('C05_DESIGN','ブロックごとの具体設計','小目標、誘導文、導出、穴、誤答、図表と本文を設計する。','既習・依存・穴の位置・等式group・原資料coverage・可視状態を検査する。','次の承認で確認できる具体案を受け取る。','全ノードの本文・式・穴・参照を含む提案書'),
('C06_APPROVAL','具体案の承認','変更点・範囲・残る不確実性を説明する。','承認する案・添付設計・対象範囲のhashを固定する。','具体案を承認、または修正を指示する。','版と範囲が明確な承認記録'),
('C07_BUILD','承認範囲の実装','承認案に沿って実装・コード修正を行う。','IRをcompileし、意味属性・安定ID・採点・進捗を照合する。','承認済みの同じ内容を再承認しない。','動く教材と生成・差分の記録'),
('C08_VERIFY','コードによる実検査','失敗の原因を調べ、承認範囲内で修正する。','数理・IR・全回答・誤答・四幅の描画・参照・履歴・保存を検査する。','この工程の個別承認は不要。','対象commitに結び付いた検査結果・実画像'),
('C09_SEMANTIC','意味・教え方の監査','原資料と実画面を照合し、飛躍・不自然な文章・穴の弱さを審査する。','監査に使う版、前提、可視状態、検査結果を渡す。','この工程の個別承認は不要。','根拠付きの意味監査。未確認は未確認のまま')]
R=[
('R01_CAPTURE','症状の再現・登録','ユーザーが困った箇所と、画面上の症状を整理する。','原版・画像・対象IDを照合。否定的な指摘を修正入力へ渡す。','困った点や違和感を伝える。','症状・対象版・再現手順'),
('R02_CAUSE','根本原因の分析','意味・文章・数学・教える順のどこが原因か判断する。','旧形式を識別して診断。属性・接続・描画・参照・過去事例を照合する。','必要な場合だけ、指摘の意味を補足する。','根本原因と、根拠・未解決点'),
('R03_IMPACT','同型不具合の事前監査','同じ原因か、別原因か、保護すべき箇所かを判断する。','全ノードと共有関数のconsumerを列挙。影響表の欠落を検査する。','この工程の個別承認は不要。','影響あり／なし／未確認の対象一覧'),
('R04_PROPOSAL','対象限定の具体修正案','各ノードの本文・式・穴・参照を具体化し、修正理由を書く。','原資料coverage、IR、既習、穴、等式、可視状態と保護範囲を検査する。','実装前に具体案を見る。','変更前後・保護対象・実装方法・検査方法'),
('R05_APPROVAL','具体修正案の承認','承認する内容を説明し、追加変更を混ぜない。','案・範囲・添付設計と、実装用IRの対応を固定する。','具体案を承認、または修正を指示する。','修正対象の版・範囲付き承認'),
('R06_PATCH','限定実装','承認された範囲の実装・コード修正を行う。','承認hash、差分、生成IR、採点ID・段階・保存進捗を照合する。','同じ公開許可・画像票承認を繰り返さない。','限定された差分と候補commit'),
('R07_VERIFY','コードによる修正検査','失敗原因を調べ、修正内容を確認する。','元の症状、同型箇所、全正誤答、四幅描画、履歴・再開を実検査する。','この工程の個別承認は不要。','修正・回帰の証拠と実画像'),
('R07_SEMANTIC','意味・説明の再監査','本当に教える形になったか、元の指摘が解消したかを実物で審査する。','原資料・対象版・可視状態・回帰結果を対応付ける。','この後、公開された実物を評価する。','症状の解消と、説明・保護範囲の監査')]
S=[
('S00_RECOVER','現在地・正本の復元','今回必要な資料・Work・既存の教訓を確認する。','台帳、原資料snapshot、規則、候補、承認のhashを照合する。','作成／修正の依頼をする。','現在地と、次に進める工程'),
('S01_ROUTE','二つの入口と修正優先','依頼の意図を確認する。','未完の修正を優先し、作成／修正の既存工程へ振り分ける。','範囲の変更が必要な場合に判断する。','作成C01へ／修正R01へ'),
('G2_AUDIT','公開前の横断監査','対象と関連範囲の意味・回帰・未解決を審査する。','対象版・保護範囲・影響表・検査証拠の不足を検出する。','この工程の個別承認は不要。','公開可否と、残件の引継先'),
('G3_HOST','既存アプリへ反映','既存の公開手順を実行し、異常時に原因を調べる。','検証済みsourceをcompile・公開。manifestと実配信・実操作を照合する。','承認範囲内の同じ公開許可を再要求しない。','実配信の版を確認した直接アプリURL'),
('G3_FINAL','実物の範囲付き評価','どの箇所・観点への評価かを確認し、原文を記録する。','評価を実物の版・route・範囲へ結び付ける。','アプリを読み、受入または修正点を伝える。','受入→後処理／修正必要→R01へ'),
('R03_IMPACT_SWEEP','修正後の同型監査','実際の差分から同型不具合と関連修正の残件を調べる。','事前表の流用を防ぎ、対象・版・関連修正の完了を照合する。','新しい教材変更が必要なら、その具体案を承認する。','残件あり→関連修正／なし→R08'),
('R08_CAPTURE_LEARNING','修正Episodeの確定','原因・修正・評価・再発防止を整理する。','元の否定例と修正版・受入・回帰テストを結ぶ。重複・未収録を検出する。','追加の個別承認は不要。','修正Episodeと、元評価を保持した事例'),
('L01_LEARNING','教訓・事例・学習の統合','評価観点と適用範囲を審査。次回に残す規則を整理する。','版付きcatalog→漏洩のない例→group分割→fit・評価。少数例では採用を控える。','実物の肯定・否定評価が学習の根拠になる。','次回の規則・事例・学習結果。モデルは助言用'),
('Z01_CLOSE','終了・作成への復帰','現在地・次の作業・必要な教訓を簡潔にまとめる。','必須残件・承認・証拠・重複を照合して閉じる。修正残件なしで作成へ戻る。','次の依頼を行う。','完了記録と再開可能な現在地')]
M=[
('M1','原評価の固定','何を評価した発言かを読み取る。','原文・対象版・範囲・出所を保存する。','実物へ肯定／否定の評価を伝える。','今回：公開版N07全体の肯定。個別六観点へ水増ししない'),
('M2','ラベル・観点の確認','品質ラベルと、評価対象の観点・範囲を審査する。','不明をUNKNOWNにし、同じ発言の複製・矛盾を検出する。','新しい発言がある場合だけ根拠が増える。','設計承認・AIの自己評価は、人間の品質肯定にしない'),
('M3','学習入力の生成','学生に見える実物が入力になっているか確認する。','実物から本文・式・穴を抽出。評価文・ラベル・版IDを入力へ混ぜない。','この工程の個別承認は不要。','実物snapshotと、別管理の正解ラベル'),
('M4','事前学習モデルで特徴化','モデルの利用目的と不足を確認する。','固定版の多言語encoderで全tokenを処理。切り捨てを記録なく行わない。','この工程の個別承認は不要。','特徴vectorとモデル版・入力範囲の記録'),
('M5','分割・学習・評価','評価結果の適用限界を説明する。','同じ教材・修正前後を同じgroupにする。観点別にfitし、正負不足は除外する。','この工程の個別承認は不要。','学習したhead／不足したhead／評価不能を区別'),
('M6','次回の制作への利用','候補や事例を採るかを、原資料と数学・教育の根拠で判断する。','類似事例や候補順位の助言。承認・数学検査・公開条件の代行はしない。','教材の具体案と公開実物を評価する。','少数例のモデルはOFFLINE_ONLY。本番採用と学習実行は別')]
prim={x[0]:x[1] for x in CREATE+CORRECT};prim.update({'S00_RECOVER':'CODE','S01_ROUTE':'CODE','G2_AUDIT':'AI','G3_HOST':'TOOL','G3_FINAL':'USER','R03_IMPACT_SWEEP':'AI','L01_LEARNING':'AI','Z01_CLOSE':'CODE'})
prim.update({'M1':'CODE','M2':'AI','M3':'CODE','M4':'CODE','M5':'CODE','M6':'AI'})
role_name=lambda actor:'CODE' if actor in ('CODE','TOOL') else actor
panels=[('common','全体の接続と、公開・評価・学習','作成／修正の入口を保持。受入後の分岐までを示す。',S),('creation','作成：原資料から教材へ','各工程のAI・CODE・USERの仕事を分けて示す。',C),('correction','修正：指摘から原因・限定修正へ','修正指摘と肯定評価を同じ分岐へ流さない。',R),('learning','学習：何を、どの根拠で学ぶか','人間の評価と、学習処理・モデル採用を分ける。',M)]
colors={'AI':('#6d48ae','#f5f0ff'),'CODE':('#175e93','#edf6ff'),'USER':('#9c5c0e','#fff4e7')}
def lines(s,width=34):
 out=[];line='';n=0
 for c in s:
  size=2 if unicodedata.east_asian_width(c) in 'WF' else 1
  if n+size>width and line:out.append(line);line='';n=0
  line+=c;n+=size
 if line:out.append(line)
 return out

def text(svg,x,y,value,size=17,color='#172b3a',weight=400,width=34):
 for i,line in enumerate(lines(value,width)):svg.append(f'<text x="{x}" y="{y+i*25}" fill="{color}" font-size="{size}" font-weight="{weight}">{html.escape(line)}</text>')
def draw(key,title,sub,rows):
 rowheights=[]
 for row in rows:rowheights.append(max(172,max(len(lines(t)) for t in row[2:5])*25+74))
 height=200+sum(rowheights)+len(rows)*24+80;svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="{height}" viewBox="0 0 1280 {height}" role="img" aria-label="{title}"><style>text{{font-family:"Noto Sans JP","Yu Gothic","Hiragino Kaku Gothic ProN",sans-serif}}</style><rect width="1280" height="{height}" fill="#f7f9fc"/>']
 text(svg,40,48,title,27,weight=700,width=90);text(svg,40,82,sub,17,width=125)
 text(svg,40,129,'工程 / 主担当',16,weight=700,width=22)
 for x,role in zip([270,600,930],['AI','CODE','USER']):
  color,bg=colors[role];svg.append(f'<rect x="{x}" y="105" width="310" height="42" rx="10" fill="{color}"/>');text(svg,x+18,133,role,19,'white',700)
 y=168
 for index,(stage,name,ai,code,user,output) in enumerate(rows):
  h=rowheights[index];svg.append(f'<rect x="40" y="{y}" width="210" height="{h}" rx="12" fill="white" stroke="#d5dce6"/>')
  text(svg,54,y+29,stage,15,weight=700,width=25);text(svg,54,y+62,name,19,weight=700,width=20)
  main=role_name(prim.get(stage,'CODE' if stage.startswith('M') else 'AI'));col,bg=colors.get(main,colors['CODE']);text(svg,54,y+h-19,'主担当 '+main,14,col,700,width=25)
  for x,role,value in zip([270,600,930],['AI','CODE','USER'],[ai,code,user]):
   color,bg=colors[role];svg.append(f'<rect x="{x}" y="{y}" width="310" height="{h}" rx="12" fill="{bg}" stroke="#e0e5ee"/>');text(svg,x+16,y+30,value,17,width=34)
  text(svg,286,y+h-15,'成果物：'+output,14,'#46556b',400,width=116)
  y+=h+24
  if index<len(rows)-1:svg.append(f'<path d="M145 {y-23}v17m-5-6 5 6 5-6" fill="none" stroke="#8794a6" stroke-width="2"/>')
 text(svg,40,height-29,'CODE＝既存プログラムの実行。AIがコードを書く仕事とは区別する。紹介用説明図であり、実行台帳の完了状態を表す図ではない。',14,width=162)
 svg.append('</svg>');(OUT/(key+'.svg')).write_text('\n'.join(svg));return '\n'.join(svg)
svgs={key:draw(key,title,sub,rows) for key,title,sub,rows in panels}
records=[{'stage':r[0],'title':r[1],'primaryActor':prim.get(r[0]),'ai':r[2],'code':r[3],'user':r[4],'output':r[5],'capabilities':PLACEMENT.get(r[0],[])} for _,_,_,rows in panels for r in rows]
# All actual C/R stages, including R08 in common, must be documented exactly once.
actual={s[0] for s in CREATE+CORRECT};seen=[r['stage'] for r in records if r['stage'] in actual]
assert len(seen)==len(set(seen)) and actual==set(seen),(actual-set(seen))
(OUT/'ROLE_MAP.json').write_text(json.dumps({'purpose':'presentation, not simulation or proof of work completion','source':'workflow/definitions.py + capabilities.py + graphs.py','stages':records},ensure_ascii=False,indent=2)+'\n')
md=['# AI・CODE・USERの担当一覧','','CODEはプログラムの実行であり、AIによるコード執筆とは区別する。内部監査は別AIが実施した根拠がある場合だけ「独立AI監査」と呼ぶ。','']
for key,title,sub,rows in panels:
 md+=['## '+title,'','| 工程 | AI | CODE | USER | 成果物 |','|---|---|---|---|---|']
 md+=['| '+' | '.join([r[0]+' '+r[1],*r[2:]])+' |' for r in rows];md+=['']
(OUT/'RESPONSIBILITIES.md').write_text('\n'.join(md).rstrip()+'\n')
m=['flowchart TD','  START["USER：作成／修正を依頼"]','  RESTORE["CODE：正本・台帳・修正優先を照合"]','  ROUTE{"作成か修正か"}','  C1["C01–C04｜AI：原資料・概念・完全解法／CODE：抽出・検算"]','  C5["C05｜AI：本文・式・穴・図を具体設計／CODE：IR・依存・可視状態検査"]','  R1["R01–R03｜AI：症状・原因・同型判定／CODE：再現・版照合・全対象列挙"]','  R4["R04｜AI：対象限定の修正案／CODE：IR・保護範囲検査"]','  APPROVE["C06／R05｜USER：具体案の承認／CODE：版と範囲を固定"]','  BUILD["C07／R06｜AI：承認範囲を実装／CODE：compile・採点・進捗保護"]','  CHECK["C08–C09／R07・G2｜CODE：実検査／AI：原資料・実画像・教え方の監査"]','  HOST["G3_HOST｜CODE：既存アプリへ反映・実配信照合／AI：公開手順の実行"]','  EVAL{"G3_FINAL｜USER：実物を評価"}','  TYPE{"修正Workか"}','  SWEEP{"R03事後｜AI：同型・関連修正の判断／CODE：残件照合"}','  R8["R08｜AI：修正Episode整理／CODE：元評価・修正・回帰を結ぶ"]','  LEARN["L01｜AI：ラベル観点・教訓審査／CODE：catalog・分割・fit・評価"]','  CLOSE["Z01｜CODE：必須残件と記録を照合／AI：再開位置を整理"]','  START --> RESTORE --> ROUTE','  ROUTE -->|作成| C1 --> C5 --> APPROVE','  ROUTE -->|修正優先| R1 --> R4 --> APPROVE','  APPROVE --> BUILD --> CHECK --> HOST --> EVAL','  EVAL -->|修正が必要| R1','  EVAL -->|受入| TYPE','  TYPE -->|作成| LEARN','  TYPE -->|修正| SWEEP','  SWEEP -->|残件あり| R1','  SWEEP -->|必須残件なし| R8 --> LEARN --> CLOSE']
(OUT/'overview.mmd').write_text('\n'.join(m)+'\n')
nav=''.join(f'<button data-panel="{k}" class="{"active" if i==0 else ""}">{label}</button>' for i,(k,label) in enumerate([('common','全体・公開・評価'),('creation','作成 C01–C09'),('correction','修正 R01–R07'),('learning','機械学習')]))
sections=''.join(f'<section id="{key}" {"" if i==0 else "hidden"}>{svgs[key]}</section>' for i,(key,_,_,_) in enumerate(panels))
page='''<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>教材制作ワークフロー｜AI・CODE・USER</title><style>*{box-sizing:border-box}body{margin:0;background:#f7f9fc;color:#172b3a;font-family:system-ui,sans-serif}header{padding:22px 28px;background:white;border-bottom:1px solid #dbe2ed}h1{font-size:24px;margin:0 0 10px}p{margin:8px 0;line-height:1.65}.legend{display:flex;gap:20px;flex-wrap:wrap;font-size:14px}nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}button{border:1px solid #cad3e2;background:#fff;border-radius:8px;padding:10px 14px;color:inherit;cursor:pointer}button.active{background:#172b3a;color:white}main{padding:18px;overflow:auto}section{min-width:740px;max-width:1280px;margin:auto}svg{width:100%;height:auto}aside{padding:20px 28px;background:#edf2f8;line-height:1.7}.ai{color:#6d48ae}.code{color:#175e93}.user{color:#9c5c0e}@media print{nav,.screen{display:none}main{padding:0;overflow:visible}section{min-width:0;max-width:none}header{padding:10px}aside{font-size:10px}}</style><header><h1>教材制作ワークフロー：誰が何をするか</h1><p>入口は「作成」「修正」。全工程で、AIの意味判断・コードの検査・ユーザーの承認を区別します。</p><div class="legend"><b class="ai">AI：意味・数学・教え方・文章・実装</b><b class="code">CODE：照合・変換・検算・描画／回帰検査</b><b class="user">USER：依頼・具体案の承認・実物の評価</b></div>NAV<p class="screen">タブで詳細を切り替えます。画面の拡大やブラウザの印刷から、その図を共有できます。外部通信は不要です。</p></header><main>SECTIONS</main><aside><b>説明するときの要点</b><br>① AIが提案・実装し、コードが機械的に検査する。主担当がAIでもコード検査を省略しない。<br>② ユーザーは具体案と公開された実物を確認する。同じ公開許可や画像票の再承認は要求しない。<br>③ 肯定評価は学習へ、否定的な修正指摘は修正へ。評価の対象版と観点を残す。<br>④ 学習を実行したことと、モデルを本番採用できることは別。モデルは数学・承認・公開可否の最終判断をしない。<br>⑤ この資料は既存工程の責任分担を説明するもので、工程の追加や完了状態の証明ではない。</aside><script>document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('main section').forEach(s=>s.hidden=s.id!==b.dataset.panel);document.querySelectorAll('nav button').forEach(n=>n.classList.toggle('active',n===b))})</script></html>'''.replace('NAV','<nav>'+nav+'</nav>').replace('SECTIONS',sections)
(OUT/'workflow_roles.html').write_text(page)
print(json.dumps({'actualStages':len(actual),'documentedStages':len(seen),'panels':len(panels),'offlineHTML':True,'externalDependencies':0}))
