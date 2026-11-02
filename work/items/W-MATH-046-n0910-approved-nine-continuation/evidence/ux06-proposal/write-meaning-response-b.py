from pathlib import Path
import json,hashlib
B=Path('/tmp/w046-r04');p=json.loads((B/'PROPOSAL.json').read_text());raw=(B/'PROPOSAL.json').read_bytes();ph=hashlib.sha256(raw).hexdigest();wrap=json.loads((B/'MEANING_REQUEST.json').read_text());req=wrap['result']['request'];states=json.loads((B/'PUBLIC_STATES.json').read_text())['states'];assert ph==wrap['proposalSHA256']=='a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840';assert req['requestHash']=='bb9130a79b86275aba189d677b43fd2a085495a01ae2e601077214ca29bc2580'
notes={
'n09-q01-negative::ux06RepeatedBase':'見える(-4)²の基底全体を二因子の一方へ戻す。負号を含めるかを決めるので、同じ4を写すだけではない。',
'n09-q01-negative::value':'直前に組んだ二つの負の因子を掛けて16を計算する。因子構成の前に結果は認定されない。',
'n09-q02-negative-square::ux06RootBase':'括弧内の−√5全体を第二因子として構成する。√5だけ/−5との違いは負号と根号の作用対象。',
'n09-q02-negative-square::ux06SignProduct':'見えている(-1)(-1)を1へまとめ、根号の平方と別の因子にする。和の2との誤解を区別する。',
'n09-q02-negative-square::signedRootSquareUX05':'根号の定義を残った(√5)²へ適用して5を求める。単に旧最終5を選ぶだけでなく、その前の因子・符号構成がある。',
'n09-q04-negative::ux06CandidateSign':'a<0から−aが正であるという関係>を式内へ入れる。候補を示すことを答えの認定と混同しない。',
'n09-q04-negative::ux06CandidateSquare':'(-a)(-a)の平方がa²になることを式内に構成し、候補の第二条件を確かめる。',
'n09-q04-negative::value':'正性と同じ平方という二条件を得た後に−aを非負平方根として同定する。正答後に根拠を一括AUTO供給する旧状態と異なる。',
'n09-decimal-method::ux06BinomialBase':'(A+B)²を同じ二因子へ戻す。平方を各項の平方の和へ取り違える候補と区別。',
'n09-decimal-method::ux06DistributeA':'後ろの和の第一項Aへ前の括弧を掛ける構文位置を作る。単文字でも分配の作用先を決める。',
'n09-decimal-method::ux06DistributeB':'同じ分配の第二項Bへの積を補う。前の回答を鏡写しするのではなく和の二つの項を尽くす。',
'n09-decimal-method::ux06CrossProduct':'(A+B)Aから生じるBAを構成する。回答前にBA=ABという完成説明を出さず、交換は後の主式行で示す。',
'n09-decimal-method::ux06LastSquare':'(A+B)Bの最後のB×BをB²として作る。2Bという倍との誤解を区別。四項全部の一択にしない。',
'n09-decimal-method::ux06LikeTermCount':'交差項を同じABへそろえた後、二項の和を係数2へまとめる。完成公式の初期assumptionは除かれ、ここで初めて本人が係数を確定する。',
'n09-parts-target::ux06IntervalLower':'0≤x−n<1の各辺へnを加え、下端nを元のxの区間に構成する。定義の新語そのものを当てさせていない。',
'n09-parts-target::ux06IntervalUpper':'同じ不等式操作で上端n+1を作る。単純な移項を別々の小問へ増やさず、区間上下端としてまとめる。',
'n10-q01-square::ux06ProductBase':'(t√5)²の基底全体t√5を第二因子へ戻す。文字と根号へ指数が作用する範囲を保つ。',
'n10-q01-square::ux06CoefficientExponent':'積を並べ直したt×tを指数2へまとめる。根号の平方と係数の平方を分ける式構成。',
'n10-q01-square::rootSquare':'(√5)²=5を現在の係数に使い、候補平方5t²を得る。後続÷5の操作を追加の易しい小問にしていない。',
'n10-q11-formula::ux06LastProductSign':'分配した最後の負項同士の積の+を決める。直前の和平方導出を再利用し、全過程を再度すべて穴にしない。',
'n10-q11-formula::ux06DifferenceCount':'−AB−ABの同類項を係数2へまとめ、差平方の中項を作る。完成差平方を初期条件で教える旧先出しはない。',
'n10-q11-formula::signedMiddleTermUX05':'導いた一般式を具体の二根号へ適用し−2√2√3を符号込みで構成する。左右の平方や√6は後続の計算に残す。',
'n10-q13-identity::ux06CrossSign':'Aと−Bから生じる交差項の符号−を作る。分配の因子と符号の対応を具体的に考える。',
'n10-q13-identity::ux06CrossSum':'−AB+BAの和を交換法則と逆符号から0へまとめる。和差積の相殺の根拠を本人が担う。',
'n10-q13-identity::cancellingPairUX05':'一般の相殺構造を具体の二根号へ対応し、逆符号の交差積の組を選ぶ。順序の違う同じ組を偽としない。',
'n10-15::ux06CompensatingFactor':'既に決まった√3を分子にも掛ける等倍率の補償へ使う。因子の数値を再発見する問いでなく、分母だけ変える誤操作との区別。',
'n10-15::ux06DenominatorPower':'二つの√3を平方の指数2へまとめ、分母の根号を消す構造を作る。単独の1倍の計算を追加するものではない。',
'n10-17::ux06NumeratorProduct':'元の分子√3にcを掛ける積√3cを作る。既に決まったcの値をもう一度入力する穴ではない。',
'n10-17::ux06DenominatorScope':'元の分母の和全体√3+√2をcの作用対象にする。見える式の再使用でも、片方の項だけを掛ける誤りとの区別がある。',
'n10-20::ux06NumeratorPower':'分子の同じ二つの差を累乗の指数2へまとめる。分母の変形を同じ回答に束ねない。',
'n10-20::ux06DenominatorSign':'分母の和差積を二平方の差の−へ移す。4/3は先行の認定結果として使い、再計算を要求しない。'}
blocks=[];blanks=[]
for b in p['blocks']:
 ss=[s for s in states if s['nodeId']==b['nodeId'] and '-before-' in s['id']];assert len(ss)==len(b['parts'])
 for part,s in zip(b['parts'],ss):
  assert s['id'].endswith('-before-'+part['key']);ident=part['partId'];assert ident in notes
  blanks.append({'partId':ident,'stateRef':s['id'],'decision':'ADOPT','reason':notes[ident],'visibleMathRefs':[r['display']for r in s['view']['current']['rows']if r['kind']=='math'],'futureEvidencePolicy':'次の認定行を回答前根拠にしない。前段の認定結果の再利用は許す。'})
 blocks.append({'nodeId':b['nodeId'],'judgment':'ADOPT_FOR_R04_PROPOSAL_MEANING','learnerDecision':' / '.join(notes[x['partId']]for x in b['parts']),'beforeStates':[s['id']for s in ss],'proseConnection':b['lead']+' → '+b['afterVisibleText'],'limits':'実DOM画像/移行の実行/形式的数理証明をこの採用に含めない。'})
response={'requestHash':req['requestHash'],'phase':req['phase'],'reviewer':'/root/w046_render_review（主担当UX06案の非作者・理念/工程監視。旧N10一部設計/共有renderer作者という履歴を保持。同一モデル/共有履歴でありモデル独立性・盲検は主張しない）','proposalSHA256':ph,
'learnerDecision':blocks,
'availableInformation':'既存projectNestedLesson/answerNestedPartから得た31回答直前＋11block完了の42仮想public状態を全件読取。stage原問題、同stage先行本文/数式、実条件、前stageの認定済み参照aside、現在の穴/問い/全候補を根拠とする。作者のexpectedやprivate rationaleを回答前の学習根拠に使わない。N04教材の存在や目標の√2不等式は個人の習熟/既認定事実とはしない。',
'reasonToProceed':'平方は同じ基底の二因子、分配/交換/同類項、非負性と平方根の定義、同じ数を加える不等式、非零因子c/cによる分数の値保持を、それぞれ現在の式へ適用できる。これは読取による数学的根拠の説明であり、依存不足でUNSUPPORTEDのCODE数学を証明PASSにするものではない。',
'nextWholeState':'意味ある穴が正答されると、その値が現在の通常式の一部として残り、次の理由文/行が解放される。一般式の導出後はQ08の中項・積・和・小数化へ戻り、N10は候補の同定や有理化の分子/分母計算へ戻る。afterVisibleTextは全part認定後の実text rowとし、terminal metadataにだけ置いて説明済みとは呼ばない。',
'misconception':'平方と二倍、負号を基底の外へ残す誤り、B×Bと2B、同類項係数の不足、負項同士の符号、交差項の相殺誤り、整数/小数部分の区間、分母だけを変える操作、分母の一項だけへの乗算を全候補と式の役割で区別した。単文字の正答だから容易/無意味とは判定しない。',
'reducedSupportVariant':'今回の代表は一般の和平方を途中の因子/積/係数で構成する初回支援。次のQ08はその認定公式の具体適用、差平方/和差積は必要な符号・相殺へ絞る。すべての行や既認定4/3、易しい÷5へ同じ支援を再コピーしない。現在の学習上の重要段階を最終式choice一つへ戻すfadingも採用しない。',
'findings':[],
'patternDecision':'first_applicationは導出の意味ある段階を55stepとして作者が先に分解し、その前提順を既存CODEで点検した候補として限定採用する。36knowledgeは宣言数学根拠で個人習熟ではない。SOURCE_ASSET/GOAL_CONTEXTはknowledgeから除外されている。raw93候補の31ADOPT/62REJECTはAI採否であり、rawDecisionCheck NEEDS_AI_REVIEWをCODE eligibility PASSへ置換しない。代表6候補のgraph適合はそのscopeだけ。',
'groupBoundaryReview':'各主導出は同じ意味group内で等号を続ける。decimalの交換は主多項式を並べ替える行で示し、BA=ABの独立補助式から主式へ=だけで戻る偽等式鎖を作らない。q13の交差項の和の補助式後は(A+B)(A−B)という完全左辺へ復帰する。分数の分子/分母の変形は同じ分数の連続導出内に置く。実寸の切れ/括弧/余白はR07未実施。',
'blankDecisionReview':blanks,
'prosePlacementReview':'目的を入口で述べ、次の数学操作の直前に理由を置き、正答後は意味/次の用途へつなぐ。完成公式の初期assumption2件は条件/具体課題へ補修済み。BA→ABの説明は交差項の構成後に移動。intro/afterは自然文、数学表現は既存math row/typed leadPartsを使う。q02/02の同文条件反復はin-contextで抑え必要条件を先行文脈へ保持する。',
 'terminalRoleReview':'終端は解いた結果と条件を次へ使うための認定記録。NEWを旧完了から埋めず、旧正答を保存して新前提の後ろでpendingにする方針を確認した。終端の私的説明を初期可視本文と誤認しない。実移行はNOT_RUNであり方針審査だけ。',
'visibleProgressionReview':'全31回答直前と11block完了状態で、初期prefixとその時点までの正答で解放される行/introを読取した。text enumの表示解決を実readerのchosen.displayへ補修し、認定済み参照asideも含む現requestを採用した。wrong gateは実モデルのfrontier/row-ID比較assertというrootの検査で、誤答原state全件保存や実ブラウザ操作とは呼ばない。11完了状態にはafterVisibleTextの実text rowが含まれ、数学結果から次の用途への接続を確認した。新案の完成式/未来値が現在の穴の答えとして確定供給される未解決所見は、この限定public入力内では残っていない。',
'caseDispositions':[],
'limits':{'reviewScope':'R04案の可視意味/理念/工程限定。実装許可・正式R04 receipt・G1/G2/G3完了ではない。','mathCODE':'UNSUPPORTED / MATH_DEPENDENCY_MISSINGを保持。graphTeaching UNSUPPORTED、proseIR NOT_RUN、rawDecisionCheck NEEDS_AI_REVIEWも保持。','render':'NOT_RUN。既存font欠陥の修正案はnative限定override、実body/math/choice相対サイズと72target対話node/旧版影響はR07で確認。','storage':'移行/旧版/history/resetは設計方針のみ、実結果はNOT_RUN。','approval':'R04→R05新案承認照合→R06代表decimal→R07本人細部という工程のみを確認。本人受入/Gold/fit/公開承認を自動生成しない。','caseRegistry':'request.caseIds=[]のため空dispositions。本人否定やR03根拠を読取したことを架空登録事例消費receiptへ変換しない。'}}
assert len(blanks)==31;assert all(k in response for k in req['required']);(B/'MEANING_RESPONSE_B.json').write_text(json.dumps(response,ensure_ascii=False,indent=2)+'\n');print(hashlib.sha256((B/'MEANING_RESPONSE_B.json').read_bytes()).hexdigest())
