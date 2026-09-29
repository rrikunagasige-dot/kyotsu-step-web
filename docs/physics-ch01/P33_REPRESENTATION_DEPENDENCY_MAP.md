# P33 — Chapter 1 Ideal Representation / Dependency Map

Status: **MAP COMPLETE / SOURCE-ALIGNMENT ISSUES OPEN**

Date: 2026-09-29

Authoritative input:
- `prototypes/CH1_LEARNING_TEXT_V2.md`
- `LEARNING_TEXT_WRITING_RULES.md`
- `FORMULA_DERIVATION_RULES.md`
- textbook Chapter 1 pages 12–27 as physics authority
- canonical 17 figures

## 0. P33 scope

P33 extracts the *ideal physics-learning dependency* from the current user-reviewed Chapter-1 prototype. It does not compare to the current application implementation; that is P34.

The map is allowed to require representations or teaching steps that the current app does not yet implement.

### Background-knowledge baseline

P33 does **not** require the learner to derive everything from middle-school knowledge alone.

Assume:
- ordinary middle-school knowledge,
- common mathematical background,
- a phone is available,
- general-purpose mathematics may be recalled through search or AI help when necessary.

Therefore `sin/cos`, a limit symbol, or a standard trigonometric identity is **not** automatically a pedagogy contradiction merely because a learner may not remember it.

The chapter itself must still construct:
- new physics meanings,
- new chapter-specific terminology,
- physical modeling assumptions,
- physical boundary conditions,
- the reason why one physics relation follows from another.

External lookup may support background mathematics. It must not replace the chapter's own physics dependency chain.

## 1. Representation legend

- **P** — Phenomenon / physical situation
- **V** — Visual / figure / arrow geometry
- **Q** — Quantity / meaning of a physical quantity
- **R** — Relation between quantities / causal or geometric relation
- **M** — Mathematical expression
- **G** — Graph
- **T** — Transfer / worked application

## 2. Chapter dependency spine

```text
1A  position → position vector → displacement → time → average velocity
    → instantaneous velocity / tangent → transfer
        ↓
1B  vector addition → component projection → magnitude → vector difference
        ↓
1C  observer/reference → relative velocity → 2D relative velocity → transfer
        ↓
1D  velocity change → acceleration → v-t graph → constant-acceleration equations
    → force/acceleration → transfer
        ↓
1E  split horizontal/vertical motion → horizontal uniform motion + vertical free fall
    → resultant speed → eliminate time → parabolic trajectory → transfer
        ↓
1F  decompose launch velocity → vertical motion → highest-point condition
    → highest height → trajectory → flight time → range
        ↓
1G  gravity-only acceleration → linear drag model → force equation
    → decreasing acceleration → v-t graph → terminal condition → terminal velocity
```

## 3. Concept-level representation / dependency map

|Unit|Node|Concept|Prerequisite / background|Representation path|Learning event / knowledge construction|Next dependency|Figure / graph|Formula coverage|
|---|---|---|---|---|---|---|---|---|
|1A|A-POS|位置→位置ベクトル|点・矢印・原点という一般概念|P→V→Q|O→P1 を見て『位置』を読む→名称として位置ベクトル|A-DISP|fig-1|position vector is a representation of position|
|1A|A-DISP|位置の変化→変位|A-POS|V→Q→R→M|P1→P2 を位置の変化として読む→変位Δrと命名→矢印連結を式へ|A-COMP|fig-1|r1+Δr=r2; Δr=r2-r1|
|1A|A-COMP|変位の座標成分|A-DISP、座標差|Q→M→V|『後−前』を各成分に適用|A-AVG|fig-4|Δx=x2-x1; Δr=(x2-x1,y2-y1)|
|1A|A-AVG|経過時間→平均速度|A-DISP、時間差|Q→R→M|同じ変位でも時間が違う→単位時間あたりの位置変化|A-INST|—|Δt=t2-t1; v̄=Δr/Δt|
|1A|A-INST|平均速度→瞬間速度・接線方向|A-AVG、極限記号は一般数学として補助可|V→R→M|P2をP1へ近づける→割線が接線へ→Δt→0|A-SPEED|fig-2, fig-3|v=lim Δr/Δt; direction=tangent|
|1A|A-SPEED|速度と速さ|A-INST、ベクトルの大きさ|Q→R→M|向きを含む速度と大きさだけの速さを区別|A-TR|—|v=\|v⃗\||
|1A|A-TR|位置→変位→平均速度のtransfer|A-POS〜A-AVG|T→M|数値例で『まず何を求めるか』を選ぶ|1B|—|Δr then Δt then v̄|
|1B|B-SUM|速度の合成|1A速度=ベクトル|P→V→R→M|船＋川を同時に見る→2速度のベクトル和|B-PROJ|fig-5|v=v1+v2|
|1B|B-PROJ|速度の分解|ベクトル、直角三角形・三角比は一般数学として利用可|V→Q→M|一つの速度をx/yへ投影|B-MAG|fig-6|vx=v cosθ; vy=v sinθ|
|1B|B-MAG|成分から大きさへ|B-PROJ、三平方|M→Q|直交成分から元の速さを再構成|B-DIFF|fig-6|v=√(vx²+vy²)|
|1B|B-DIFF|ベクトルの差|ベクトル和|R→M|引き算=逆向きベクトルを足す|B-TR|—|a-b=a+(-b)|
|1B|B-TR|合成・分解の数値transfer|B-SUM〜B-MAG|T→M|船の成分から速さを計算|1C|fig-5|speed from components|
|1C|C-OBS|観測者という基準|1Bベクトル差|P→Q→R|道路と車内で見え方が違う|C-REL|fig-7|observer matters|
|1C|C-REL|相対速度|C-OBS、B-DIFF|P→R→M|Aから見たB= Bの速度−Aの速度|C-ZERO|fig-7|v_B/A=v_B-v_A|
|1C|C-ZERO|同速なら相対速度0|C-REL|R→Q|差が0→相手が止まって見える|C-2D|fig-7|relative velocity zero|
|1C|C-2D|平面の相対速度|C-REL、成分|M→Q|x/yごとに差を取る|C-TR|—|componentwise subtraction|
|1C|C-TR|雨と自転車のtransfer|C-2D|T→V→M|観測者の速度を引く→見える雨の向き|1D|fig-8|(-10,-10), reference selection|
|1D|D-DV|速度の変化|1A速度、1Bベクトル差|Q→R→M→V|後の速度−前の速度|D-ACC|fig-9, fig-10|Δv=v2-v1|
|1D|D-ACC|加速度|D-DV、時間差|Q→R→M|速度変化/時間|D-GRAPH|fig-10|ā=Δv/Δt|
|1D|D-GRAPH|v-tグラフ|D-ACC、面積|G→R→Q|傾き=加速度、面積=変位|D-KIN|graph representation required|slope=a; area=displacement|
|1D|D-KIN|等加速度3式|D-GRAPH、一定加速度|G→R→M|速度変化→面積→時間消去を順に導く|D-FORCE|graph representation required|v=v0+at; x=v0t+1/2at²; v²-v0²=2ax|
|1D|D-FORCE|力→加速度|加速度、運動方程式|R→M→Q|F=0ならa=0、力が速度変化を作る|D-TR|—|ma=F|
|1D|D-TR|等加速度数値transfer|D-KIN|T→M|適切な式を選んで数値へ|1E|—|constant-acceleration example|
|1E|E-SPLIT|水平投射をx/yへ分ける|1B分解、1D加速度|P→V→R|ストロボから水平一定・鉛直加速を読む|E-X|fig-11|independent component description|
|1E|E-X|水平方向の等速運動|E-SPLIT、重力は鉛直|R→M|ax=0→vx=v0→x=v0t|E-Y|fig-11|horizontal constant velocity|
|1E|E-Y|鉛直方向の自由落下|E-SPLIT、D-KIN|R→M|v0y=0, ay=g を等加速度式へ|E-SPEED|fig-12|vy=gt; y=1/2gt²; vy²=2gy|
|1E|E-SPEED|合成速度|1B-MAG、E-X/E-Y|M→Q|vx,vyを三平方で戻す|E-TRAJ|fig-12|v=√(v0²+g²t²)|
|1E|E-TRAJ|軌道式|E-X/E-Y、変数消去|M→R→M|x式からtを解きyへ代入|E-TR|—|y=gx²/(2v0²)→parabola|
|1E|E-TR|落下時間→水平距離|E-X/E-Y|T→M|鉛直で時間を決め水平へ戻す|1F|—|horizontal-projectile example|
|1F|F-PROJ|初速度の分解|B-PROJ|V→M|v0をx/yへ投影|F-Y|fig-13|v0x=v0cosθ; v0y=v0sinθ|
|1F|F-Y|鉛直運動|F-PROJ、D-KIN、上向き正|R→M|a=-gを等加速度式へ|F-TOP|—|vy=v0sinθ-gt; y=v0sinθ t-1/2gt²|
|1F|F-TOP|最高点条件|F-Y|P→R→M|上昇→下降の境界でvy=0|F-H|fig-14|vy=0|
|1F|F-H|最高点時刻・高さ|F-TOP/F-Y|M→M|境界条件を速度式へ→位置式へ代入|F-TRAJ|fig-14|tH=v0sinθ/g; H=v0²sin²θ/(2g)|
|1F|F-TRAJ|斜方投射の軌道|F-PROJ/F-Y|M→R→M|xからtを消去しyへ|F-FLIGHT|—|parabolic trajectory|
|1F|F-FLIGHT|飛行時間|F-Y、同じ高さy=0|M→M|T=0を除きもう一つの解を選ぶ|F-RANGE|—|T=2v0sinθ/g|
|1F|F-RANGE|水平到達距離と45°|F-PROJ/F-FLIGHT、一般三角関数|M→T|D=vxT→sin2θ→最大値|1G|—|D=(v0²/g)sin2θ; max at 45°|
|1G|G-GRAV|重力加速度と質量|D-FORCE|R→M→Q|ma=mgでmが消える|G-DRAG|fig-15|a=g|
|1G|G-DRAG|線形空気抵抗モデル|速さ、比例モデル|P→R→M|抵抗は運動と逆向き、低速域でf∝v|G-DYN|fig-15|f=kv; k>0 must be defined|
|1G|G-DYN|抗力下の運動方程式|G-GRAV/G-DRAG、符号|R→M|下向き正→mg-kv|G-GRAPH|fig-16|ma=mg-kv; a=g-(k/m)v|
|1G|G-GRAPH|速度増加→加速度減少|G-DYN、1Dグラフ|M→R→G|v↑→drag↑→net force↓→a↓→slope↓|G-TERM|fig-16, fig-17|v-t slope=a|
|1G|G-TERM|終端速度|G-DYN/G-GRAPH|P/G→R→M|速度一定→a=0→力つり合い|G-TR|fig-17|vt=mg/k|
|1G|G-TR|終端速度数値transfer|G-TERM|T→M|式に値を入れ因果を再確認|END|—|terminal-speed example|

## 4. Hole-by-hole pedagogical audit

Rule: every hole must be H1–H6 and must have visible or previously established evidence. General mathematics may be looked up; chapter-internal physics meaning may not be guessed from vocabulary.

|Hole|Type|Rep.|Evidence / prerequisite|Knowledge gained|Concept node|Audit|
|---|---|---|---|---|---|---|
|A1|H1|V→Q|O→P1の状況説明|位置|A-POS|PASS|
|A2|H1|V→Q|P1→P2|位置の変化|A-DISP|PASS|
|A3|H3/H2|V→R→M|3本の矢印関係|r1+Δr=r2|A-DISP|PASS; figure staging must not leak|
|A4|H3/H6|R→M|Δr=r2-r1|Δx=x2-x1|A-COMP|PASS|
|A5|H2|Q→M|前後の時刻|Δt=t2-t1|A-AVG|PASS|
|A6|H2|Q/R→M|変位と時間|v̄=Δr/Δt|A-AVG|PASS|
|A7|H1/H3|V→R|P2→P1の極限図|接線方向|A-INST|PASS|
|A8|H2|Q→R|速度=vector, 速さ=magnitude|速度が向きを含む|A-SPEED|PASS|
|A9|H4|T→strategy|平均速度の数値例|まず変位|A-TR|PASS|
|A10|H6/T|M→T|ΔrとΔt|平均速度数値|A-TR|PASS|
|B1|H1/H2|P/V→R|船+川|速度の和|B-SUM|PASS|
|B2|H3/H6|V→M|x方向への投影|v cosθ|B-PROJ|PATCH DERIVATION: show cosθ=vx/v before hole|
|B3|H3/H6|V→M|y方向への投影|v sinθ|B-PROJ|PATCH DERIVATION: show sinθ=vy/v before hole|
|B4|H3/H6|M→Q|直交成分|√(vx²+vy²)|B-MAG|PASS|
|B5|H2/H6|R→M|逆向きvector|a+(-b)|B-DIFF|PASS|
|B6|H6/T|M→T|(2.0,1.5)|2.5|B-TR|PASS|
|C1|NONE|P→term|意味は作れているが名称未提示|相対速度という名称|C-REL|REMOVE/CONVERT TO READ: first-exposure terminology lottery|
|C2|H2/H3|R→M|観測者Aを差し引く|vB/A=vB-vA|C-REL|PASS|
|C3|H1/H2|R→Q|同速度→差0|止まって見える|C-ZERO|PASS|
|C4|H6/T|M→T|雨と自転車の成分|(-10,-10)|C-TR|PASS|
|C5|H4|Q→strategy|相対速度の意味|基準を決める|C-TR|PASS|
|D1|H2|Q→M|後-前|Δv=v2-v1|D-DV|PASS|
|D2|H2|Q/R→M|ΔvとΔt|ā=Δv/Δt|D-ACC|PASS|
|D3|H3|G→Q|graph slope|加速度|D-GRAPH|PASS|
|D4|H3|G→Q|graph area|変位|D-GRAPH|PASS|
|D5|H2/H6|R→M|一定加速度|at|D-KIN|PASS|
|D6|H6|G/R→M|面積式+v-v0=at|at|D-KIN|PASS|
|D7|H6|M→M|v-v0=atをtについて解く|(v-v0)/a|D-KIN|PASS|
|D8|H2|R→Q|ma=F, F=0|0|D-FORCE|PASS|
|D9|H6/T|M→T|等加速度式|9.0|D-TR|PASS|
|E1|H2/H3|P/V/R→Q|重力は鉛直|0|E-X|PASS|
|E2|H2/H6|Q/R→M|vx=v0|v0t|E-X|PASS|
|E3|H2/H6|D→M|v0y=0, ay=g|1/2gt²|E-Y|PASS|
|E4|H3/H6|M→M|Pythagoras|√(v0²+g²t²)|E-SPEED|PASS|
|E5a|H6|M→M|x=v0t|x/v0|E-TRAJ|PASS|
|E5|H3|M→shape|y∝x²|放物線|E-TRAJ|PASS|
|E6|H6/T|M→T|y=1/2gt²|2.0|E-TR|PASS|
|F1|H3/H6|V→M|B-PROJ再利用|v0cosθ|F-PROJ|PASS after B-PROJ derivation patch|
|F2|H3/H6|V→M|B-PROJ再利用|v0sinθ|F-PROJ|PASS after B-PROJ derivation patch|
|F3|H2/H6|D→M|a=-g|v0sinθ-gt|F-Y|PASS|
|F4|H5|P/R→M|上昇→下降境界|0|F-TOP|PASS|
|F5|H6|M→M|vy=0を代入|v0sinθ/g|F-H|PASS|
|F6a|H6|M→M|x=v0cosθ t|x/(v0cosθ)|F-TRAJ|PASS|
|F6|H3|M→shape|xの2次式|放物線|F-TRAJ|PASS|
|F7|H5/H6|M→M|y=0,T≠0|2v0sinθ/g|F-FLIGHT|PASS|
|F8|H6|M→M|D=vxT; trig identity|(v0²/g)sin2θ|F-RANGE|PASS; ordinary trig support may be looked up|
|F9|H6/T|M→T|sin2θ max=1|45°|F-RANGE|PASS; ordinary trig support may be looked up|
|G1|H2/H6|R→M|ma=mg|g|G-GRAV|PASS|
|G2|H3/model|P/R→M|f∝v model|kv|G-DRAG|PATCH: define k>0 and model/regime adjacent|
|G3|H2/H6|R→M|down positive, drag opposite|mg-kv|G-DYN|PASS|
|G4|H1/H2|M→R|a=g-(k/m)v|小さくなる|G-DYN|PASS|
|G5|H3|G→Q|v-t slope|加速度|G-GRAPH|PASS|
|G6|H5|P/G→M|terminal speed=constant|0|G-TERM|PASS|
|G7|H6|M→M|a=0 in equation|mg/k|G-TERM|PASS|
|G8|H6/T|M→T|vt formula|49|G-TR|PASS|

## 5. Formula Coverage

Formula Coverage is defined independently of current UI. “SOURCE PATCH” means the ideal chain requires one more visible parent/condition/definition in the text source before P33 source-alignment can pass.

|Unit|Formula / relation|Role|Parent / reason|Timing|Current source audit|
|---|---|---|---|---|---|
|1A|r1+Δr=r2 → Δr=r2-r1|concept-forming / representation|3-arrow visual relation|after displacement meaning|VISIBLE / PASS|
|1A|Δr=(x2-x1,y2-y1)|representation|Δr=r2-r1|after coordinates|VISIBLE / PASS|
|1A|v̄=Δr/Δt|concept-forming|displacement + elapsed time|after need for rate|VISIBLE / PASS|
|1A|v=lim(Δt→0)Δr/Δt|concept-forming|average velocity with shrinking interval|after tangent visual|VISIBLE / PASS; limit math may be looked up|
|1A|v=\|v⃗\||representation|vector magnitude|after velocity|VISIBLE / PASS|
|1B|v=v1+v2|concept-forming|boat + current vector addition|after phenomenon/fig-5|VISIBLE / PASS|
|1B|vx=v cosθ; vy=v sinθ|representation|cosθ=vx/v; sinθ=vy/v|after decomposition visual|SOURCE PATCH: definitions/one-line rearrangement should be explicit|
|1B|v=√(vx²+vy²)|calculation / representation|Pythagoras|after components|VISIBLE / PASS|
|1B|a-b=a+(-b)|representation|inverse vector|before relative velocity|VISIBLE / PASS|
|1C|vB/A=vB-vA|concept-forming|observer subtraction, 15-10 example|after observer phenomenon|VISIBLE / PASS|
|1D|Δv=v2-v1|concept-forming|velocity change|before acceleration|VISIBLE / PASS|
|1D|ā=Δv/Δt|concept-forming|velocity change/time|after Δv|VISIBLE / PASS|
|1D|slope(v-t)=a; area(v-t)=displacement|representation|definition of slope + vΔt area|before constant acceleration derivation|VISIBLE / PASS|
|1D|v=v0+at|calculation / representation|v-v0=at|constant acceleration|VISIBLE / PASS|
|1D|x=v0t+1/2at²|calculation|v-t rectangle+triangle + v-v0=at|after graph area|VISIBLE / PASS|
|1D|v²-v0²=2ax|calculation|x=(v0+v)t/2; t=(v-v0)/a|after time elimination|VISIBLE / PASS|
|1D|ma=F|concept-forming|Newton second law|after acceleration|VISIBLE / PASS|
|1E|ax=0; vx=v0; x=v0t|representation / calculation|gravity vertical only|after strobe split|VISIBLE / PASS|
|1E|vy=gt; y=1/2gt²|calculation|D-KIN with v0y=0, ay=g|vertical free fall|VISIBLE / PASS|
|1E|vy²=2gy|calculation|D-KIN v²-v0²=2ax with v0y=0, a=g|after vertical equations|SOURCE PATCH: parent substitution is currently asserted, not shown|
|1E|v=√(v0²+g²t²)|calculation / representation|Pythagoras on components|after vx,vy|VISIBLE / PASS|
|1E|y=gx²/(2v0²)|representation / verification|x=v0t→t=x/v0 substituted into y|trajectory|VISIBLE / PASS|
|1F|v0x=v0cosθ; v0y=v0sinθ|representation|reuse 1B projection definitions|at launch|PASS once 1B projection derivation is explicit|
|1F|vy=v0sinθ-gt; y=v0sinθ t-1/2gt²|calculation|D-KIN with a=-g|vertical motion|VISIBLE / PASS|
|1F|vy²-(v0sinθ)²=-2gy|calculation|D-KIN time-free equation with a=-g|after vertical equations|SOURCE PATCH or REMOVE: currently asserted and unused|
|1F|tH=v0sinθ/g; H=v0²sin²θ/(2g)|calculation|vy=0 then substitute tH into y|highest point|VISIBLE / PASS|
|1F|trajectory y=x tanθ-gx²/(2v0²cos²θ)|representation / verification|eliminate t|trajectory|VISIBLE / PASS|
|1F|T=2v0sinθ/g|calculation|y=0, discard T=0|flight time|VISIBLE / PASS|
|1F|D=(v0²/g)sin2θ|calculation / representation|D=vxT; trig identity|range|VISIBLE / PASS; trig may be looked up|
|1G|a=g from ma=mg|concept-forming|mass cancellation|gravity-only fall|VISIBLE / PASS|
|1G|f=kv|model|empirical linear-drag approximation|before drag dynamics|SOURCE PATCH: define k>0 and approximation regime|
|1G|ma=mg-kv → a=g-(k/m)v|concept-forming / calculation|force signs|drag dynamics|VISIBLE / PASS|
|1G|vt=mg/k|calculation / concept-forming|terminal speed means a=0|terminal state|VISIBLE / PASS|

## 6. Required source-alignment fixes found by P33

|ID|Issue|Why it matters|Required change|Status|
|---|---|---|---|---|
|P33-I1|C1 new-term hole|相対速度の意味は状況から作れているが、名称『相対速度』は初出であり選択肢から当てさせている。|C1をREADに変え『このような速度を相対速度という』と教える。必要なら後でretrieval holeを置く。|OPEN|
|P33-I2|1B projection derivation|vx=v cosθ, vy=v sinθ が『直角三角形の関係から』で止まり、式の親関係が画面内にない。|cosθ=vx/v, sinθ=vy/v → rearrange を1段表示する。一般三角比そのものは外部参照可。|OPEN|
|P33-I3|1E time-free vertical formula|vy²=2gy が『も成り立つ』だけで、Dの v²-v0²=2ax からの代入が見えない。|v0y=0, a=g, x→y を1行で代入して示す。|OPEN|
|P33-I4|1F time-free vertical formula|vy²-(v0sinθ)²=-2gy が未導出かつ後続で使われていない。|Dの式から1行導出するか、学習上使わないなら削る。|OPEN|
|P33-I5|linear-drag constant k|f=kv の比例定数 k の意味・k>0・線形近似の範囲がその場で定義されていない。|『k>0 は物体形状・媒質等で決まる比例定数。ここでは比較的低速での線形抵抗モデル』を隣接表示。|OPEN|

## 7. Gate judgment

### G52 — P33-A1 position → position vector → displacement map
**PASS.**

A-POS → A-DISP is explicitly mapped with prerequisite, representation path, figure, knowledge gained, formula role, and next dependency.

### G52a — mobile derivation completeness
**OPEN.**

The majority of nontrivial formula chains are now visible, but P33-I2/I3/I4/I5 remain:
- component projection parent relation,
- horizontal-projectile time-free vertical equation,
- oblique-projectile time-free vertical equation,
- linear-drag constant/model definition.

This is a source-text issue, not an app-implementation issue.

### G52b — every hole justified by H1–H6
**OPEN.**

54 of 55 holes have a defensible H1–H6 purpose under the current audit.
C1 violates the “meaning → name → later retrieval” rule because the new term “relative velocity” is first encountered as a choice. It should become normal teaching prose or be moved to a later retrieval point.

### G53 — concept prerequisite + P/V/Q/R/M/G/T path defined for 1A–1G
**PASS.**

All Chapter-1 concept nodes are mapped. Ordinary searchable mathematics is treated as background support rather than a hard contradiction.

### G54 — Formula Coverage defined
**PASS.**

Every major Chapter-1 relation now has:
- role,
- parent/reason,
- introduction timing,
- dependency,
- source-audit state.

Open source patches are explicitly recorded rather than hidden.

### G55 — ideal map not weakened by current app/schema
**PASS.**

This document did not use current UI/schema limitations to remove required learning relationships.

## 8. Next edge

Do **not** start P34 yet.

First repair the five source-alignment items P33-I1…I5 in `CH1_LEARNING_TEXT_V2.md`, regenerate the review Word, and re-run G52a/G52b.

Only after G52a and G52b pass:

```text
P33 source-aligned ideal Chapter 1
        ↓
P34 CURRENT APP vs IDEAL
        ↓
missing / wrong / wrong timing / split-attention / leakage
```
