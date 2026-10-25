from pathlib import Path
import html
P=Path(__file__).resolve().parent
s=['<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="3030" viewBox="0 0 1280 3030"><style>text{font-family:"Noto Sans JP","Yu Gothic","Hiragino Kaku Gothic ProN",sans-serif}</style><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#77869a"/></marker></defs><rect width="1280" height="3030" fill="#f7f9fc"/>']
def text(x,y,t,size=18,color='#172b3a',bold=False):s.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{700 if bold else 400}">{html.escape(t)}</text>')
def node(x,y,w,h,title,rows):
 s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="17" fill="white" stroke="#cbd5e3" stroke-width="2"/>');text(x+23,y+34,title,21,bold=True)
 colors={'AI':'#6d48ae','CODE':'#175e93','USER':'#9c5c0e'}
 yy=y+66
 for role,body in rows:
  text(x+23,yy,role,16,colors[role],True);text(x+88,yy,body,17);yy+=28

def edge(points,label=None,lx=0,ly=0):
 s.append('<path d="'+' '.join(('M' if i==0 else 'L')+str(x)+' '+str(y) for i,(x,y) in enumerate(points))+'" fill="none" stroke="#77869a" stroke-width="2" marker-end="url(#arrow)"/>')
 if label:text(lx,ly,label,16,'#4c5b71',True)
text(40,48,'教材制作の火柴図｜AI・CODE・USERの担当',29,bold=True)
text(40,84,'AIは意味・教え方・実装を担い、CODEは照合・変換・実検査を担う。USERは具体案と実物を評価する。',17)
node(80,125,1120,175,'共通 S00–S01：現在地・原本・承認・修正依頼を復元', [('USER','作成／修正を依頼する'),('AI','依頼の意図・原資料・既存の教訓を確認する'),('CODE','hash・台帳・残件を照合し、修正を優先して経路を決める')])
edge([(640,300),(640,345),(350,345),(350,405)],'作成・必須修正なし',110,333)
edge([(640,345),(930,345),(930,405)],'修正・修正優先',850,333)
node(80,405,540,210,'C01–C04：原資料・概念・完全解法',[('AI','内容分析・既習整理・省略のない解法'),('CODE','抽出・対応表・登録済みsolverで検算'),('USER','制作範囲・学習対象を指定')])
node(660,405,540,210,'R01–R03：再現・原因・影響調査',[('AI','症状の意味・根本原因・同型を判断'),('CODE','版照合・診断・全ノード／consumer列挙'),('USER','困った点・違和感を伝える')])
edge([(350,615),(350,665)]);edge([(930,615),(930,665)])
node(80,665,540,210,'C05：ブロックごとの具体設計',[('AI','本文・式・穴・誤答・参照・図を設計'),('CODE','IR・依存・coverage・可視状態を検査'),('USER','次に確認する具体案を受け取る')])
node(660,665,540,210,'R04：対象限定の具体修正案',[('AI','各ノードの変更前後と修正理由を示す'),('CODE','IR・保護範囲・検査計画を照合'),('USER','実装前に具体案を見る')])
edge([(350,875),(350,905),(640,905),(640,940)]);edge([(930,875),(930,905),(640,905)])
node(80,940,1120,150,'C06／R05：具体案の承認',[('USER','内容と範囲を承認、または修正を指示する'),('AI','変更点・残る不確実性を説明する'),('CODE','案・添付設計・IR・範囲の対応を固定する')])
edge([(640,1090),(640,1135)])
node(80,1135,1120,150,'C07／R06：承認範囲の実装',[('AI','承認案に従って実装・コード修正を行う'),('CODE','compile・差分適用・意味属性・採点ID・段階・保存進捗を照合する'),('USER','同じ内容・同じ公開許可を再承認しない')])
edge([(640,1285),(640,1330)])
node(80,1330,1120,180,'C08–C09／R07・G2：実検査と意味・横断監査',[('CODE','数理・全回答／誤答・四幅描画・参照・履歴・進捗・保護範囲を検査'),('AI','原資料と実画像で、論理・教え方・文章・穴・回帰を審査する'),('USER','この内部検査の個別承認は不要')])
edge([(640,1510),(640,1555)])
node(80,1555,1120,150,'G3_HOST：完成単位を既存アプリへ反映',[('CODE','検証済みsourceを公開し、manifest・実配信・公開後の操作を照合'),('AI','既存の公開手順を実行し、異常時に原因を調べる'),('USER','既存アプリへの直接URLで、すぐ実物を確認できる')])
edge([(640,1705),(640,1750)])
node(80,1750,1120,170,'G3_FINAL：実物の範囲付き評価',[('USER','アプリを読み、受入または修正点を伝える'),('CODE','評価を対象版・route・範囲へ結び付ける'),('AI','評価の観点を整理する。内部合格をユーザー受入にしない')])
edge([(1200,1835),(1256,1835),(1256,510),(1200,510)])
s.append('<text x="1250" y="1500" transform="rotate(-90 1250 1500)" fill="#9c5c0e" font-size="15">USER：修正が必要 → R01</text>')
edge([(640,1920),(640,1985),(350,1985),(350,2530)],'受入・作成Work',160,1970)
edge([(640,1985),(930,1985),(930,2070)],'受入・修正Work',810,1970)
node(660,2070,540,180,'修正後 R03：同型不具合の事後監査',[('AI','実差分から同型・関連修正の残件を判断'),('CODE','事前表と分け、版・残件の完了を照合'),('USER','新しい内容変更なら具体案を承認')])
edge([(1200,2150),(1230,2150),(1230,545),(1200,545)])
text(1010,2040,'残件あり → 関連修正へ',16,'#4c5b71',True)
edge([(930,2250),(930,2310)],'必須残件なし',950,2286)
node(660,2310,540,150,'R08：修正Episodeを確定',[('AI','原因・修正・原評価・教訓を整理'),('CODE','否定例・修正版・受入・回帰を結ぶ'),('USER','追加の個別承認は不要')])
edge([(930,2460),(930,2495),(640,2495),(640,2530)])
node(80,2530,1120,200,'L01：教訓・事例・機械学習を統合',[('USER','実物への肯定・否定評価が学習の根拠になる'),('AI','何を評価したか・適用範囲・ラベル・次回の教訓を審査'),('CODE','版付きcatalog → 漏洩のない入力 → group分割 → fit・評価・重複統合'),('CODE','正負不足や評価不能は明記。学習実行と本番採用を区別する')])
edge([(640,2730),(640,2775)])
node(80,2775,1120,150,'Z01：終了・保留した作成への復帰',[('CODE','承認・必須残件・証拠・学習記録を照合して閉じる'),('AI','現在地と次の作業を整理する'),('USER','次の依頼へ。修正残件がある間は作成へ勝手に進まない')])
text(40,2978,'※ CODEはプログラムの実行。AIによるコード執筆とは区別する。別AIによる監査は実施根拠がある場合だけ「独立」と記録する。',13)
s.append('</svg>');svg='\n'.join(s);(P/'overview.svg').write_text(svg)
p=P/'workflow_roles.html';page=p.read_text();page=page.replace('<nav>','<nav><button data-panel="overview" class="active">全体の火柴図</button>',1).replace('data-panel="common" class="active"','data-panel="common" class=""').replace('<main>','<main><section id="overview">'+svg+'</section>',1).replace('<section id="common" >','<section id="common" hidden>');p.write_text(page)
print('Five panels generated, including full branching overview')
