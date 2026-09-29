from docx import Document
from docx.shared import Mm, Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path
import argparse
import os, re

parser = argparse.ArgumentParser(
    description='Build the Chapter 1 physics textbook-mode review DOCX from the canonical 17 figures.'
)
parser.add_argument(
    '--figure-dir',
    type=Path,
    required=True,
    help='Directory containing the extracted canonical Chapter-1 figure files from figure.zip.',
)
parser.add_argument(
    '--output',
    type=Path,
    default=Path('第1章_物体の運動_文章内穴埋め再構成版.docx'),
    help='Output DOCX path.',
)
args = parser.parse_args()
OUT = args.output
FIG = args.figure_dir
OUT.parent.mkdir(parents=True, exist_ok=True)

# Canonical figure names
figs = {
    1: FIG/'1.png', 2: FIG/'2 (2).png', 3: FIG/'3 (2).png', 4: FIG/'4.png',
    5: FIG/'5.png', 6: FIG/'6.png', 7: FIG/'7.png', 8: FIG/'8.png',
    9: FIG/'9.png', 10: FIG/'10.png', 11: FIG/'11.png', 12: FIG/'12.png',
    13: FIG/'13.png', 14: FIG/'14.png', 15: FIG/'15.png', 16: FIG/'16.png', 17: FIG/'17.png'
}

# ---------- utilities ----------
def set_cell_shading(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = tcPr.find(qn('w:shd'))
    if shd is None:
        shd = OxmlElement('w:shd')
        tcPr.append(shd)
    shd.set(qn('w:fill'), fill)


def set_cell_border(cell, **kwargs):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in('w:tcBorders')
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    for edge in ('top','left','bottom','right','insideH','insideV'):
        if edge in kwargs:
            tag = 'w:' + edge
            element = tcBorders.find(qn(tag))
            if element is None:
                element = OxmlElement(tag)
                tcBorders.append(element)
            for key in ['val','sz','space','color']:
                if key in kwargs[edge]:
                    element.set(qn('w:'+key), str(kwargs[edge][key]))


def set_run_font(run, size=None, bold=None, color=None, name='Noto Sans CJK JP'):
    if size: run.font.size = Pt(size)
    if bold is not None: run.bold = bold
    if color: run.font.color.rgb = RGBColor(*color)
    run.font.name = name
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.rFonts
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.insert(0, rFonts)
    for attr in ('ascii','hAnsi','eastAsia'):
        rFonts.set(qn('w:'+attr), name)


def para(doc, text='', style=None, after=4, before=0, keep=False, align=None, size=10.5):
    p = doc.add_paragraph(style=style)
    if text:
        r = p.add_run(text)
        set_run_font(r, size=size)
    pf = p.paragraph_format
    pf.space_after = Pt(after)
    pf.space_before = Pt(before)
    pf.line_spacing = 1.35
    if keep:
        pf.keep_with_next = True
    if align is not None:
        p.alignment = align
    return p


def rich_para(doc, parts, after=4, before=0, keep=False, align=None, size=10.5):
    p = doc.add_paragraph()
    for part in parts:
        if isinstance(part, str):
            txt, kwargs = part, {}
        else:
            txt, kwargs = part
        r = p.add_run(txt)
        set_run_font(r, size=kwargs.get('size', size), bold=kwargs.get('bold'), color=kwargs.get('color'))
        if kwargs.get('italic'): r.italic=True
        if kwargs.get('underline'): r.underline=True
        if kwargs.get('font'):
            set_run_font(r, size=kwargs.get('size', size), bold=kwargs.get('bold'), color=kwargs.get('color'), name=kwargs['font'])
    pf = p.paragraph_format
    pf.space_after = Pt(after)
    pf.space_before = Pt(before)
    pf.line_spacing = 1.35
    pf.keep_with_next = keep
    if align is not None: p.alignment = align
    return p


def equation(doc, text, after=6, before=4):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    r = p.add_run(text)
    set_run_font(r, size=12, name='Cambria Math')
    return p


def add_hole_para(doc, before_text, hole_id, after_text='', size=10.5):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.35
    r = p.add_run(before_text)
    set_run_font(r, size=size)
    h = p.add_run(f'【{hole_id}　　　　　】')
    set_run_font(h, size=size, bold=True, color=(0,86,140))
    h.underline = True
    if after_text:
        r2 = p.add_run(after_text)
        set_run_font(r2, size=size)
    return p


def add_choice_block(doc, items, title='選択肢'):
    # items: list of (hole_id, [options])
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = True
    cell = tbl.cell(0,0)
    set_cell_shading(cell, 'F3F7FA')
    set_cell_border(cell,
                    top={'val':'single','sz':'6','color':'B8C8D4'},
                    bottom={'val':'single','sz':'6','color':'B8C8D4'},
                    left={'val':'single','sz':'6','color':'B8C8D4'},
                    right={'val':'single','sz':'6','color':'B8C8D4'})
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(title)
    set_run_font(r, size=9.5, bold=True, color=(55,75,90))
    letters = ['A','B','C','D','E']
    for hid, opts in items:
        p = cell.add_paragraph()
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run(f'{hid}  ')
        set_run_font(r, size=9.5, bold=True, color=(0,86,140))
        for i,opt in enumerate(opts):
            rr = p.add_run(f'{letters[i]}. {opt}' + ('　　' if i<len(opts)-1 else ''))
            set_run_font(rr, size=9.2)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def add_figure(doc, n, caption, width_mm=145):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run()
    r.add_picture(str(figs[n]), width=Mm(width_mm))
    cp = doc.add_paragraph()
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp.paragraph_format.space_after = Pt(7)
    rr = cp.add_run(f'図{n}　{caption}')
    set_run_font(rr, size=8.5, color=(80,80,80))
    return p


def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f'Heading {level}')
    p.paragraph_format.keep_with_next = True
    p.paragraph_format.space_before = Pt(10 if level==1 else 7)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    set_run_font(r, size=(17 if level==1 else 13 if level==2 else 11), bold=True, color=(32,53,71))
    return p


def note_box(doc, title, text):
    tbl=doc.add_table(rows=1, cols=1)
    tbl.alignment=WD_TABLE_ALIGNMENT.CENTER
    c=tbl.cell(0,0)
    set_cell_shading(c,'FFF9E8')
    set_cell_border(c, top={'val':'single','sz':'6','color':'E7C875'}, bottom={'val':'single','sz':'6','color':'E7C875'}, left={'val':'single','sz':'6','color':'E7C875'}, right={'val':'single','sz':'6','color':'E7C875'})
    p=c.paragraphs[0]
    rr=p.add_run(title+'　')
    set_run_font(rr,size=9.5,bold=True,color=(120,90,20))
    rr=p.add_run(text)
    set_run_font(rr,size=9.5)
    doc.add_paragraph().paragraph_format.space_after=Pt(0)

answers = []
def ans(hid, answer): answers.append((hid, answer))

# ---------- document setup ----------
doc=Document()
sec=doc.sections[0]
sec.page_width=Mm(210); sec.page_height=Mm(297)
sec.top_margin=Mm(16); sec.bottom_margin=Mm(16); sec.left_margin=Mm(18); sec.right_margin=Mm(18)
sec.header_distance=Mm(8); sec.footer_distance=Mm(8)

styles=doc.styles
normal=styles['Normal']
normal.font.name='Noto Sans CJK JP'; normal.font.size=Pt(10.5)
normal._element.rPr.rFonts.set(qn('w:eastAsia'),'Noto Sans CJK JP')
for sname, size in [('Heading 1',17),('Heading 2',13),('Heading 3',11)]:
    s=styles[sname]
    s.font.name='Noto Sans CJK JP'; s.font.size=Pt(size); s.font.bold=True
    s._element.rPr.rFonts.set(qn('w:eastAsia'),'Noto Sans CJK JP')

# header/footer
header=sec.header.paragraphs[0]
header.alignment=WD_ALIGN_PARAGRAPH.RIGHT
r=header.add_run('物理・教科書モード　第1章 再構成版（確認用）')
set_run_font(r,size=8,color=(110,110,110))
footer=sec.footer.paragraphs[0]
footer.alignment=WD_ALIGN_PARAGRAPH.CENTER
r=footer.add_run('文章中の穴そのものが問いになる設計／解答は巻末')
set_run_font(r,size=8,color=(120,120,120))

# Cover
t=doc.add_paragraph(); t.alignment=WD_ALIGN_PARAGRAPH.CENTER; t.paragraph_format.space_before=Pt(60)
r=t.add_run('第1章　物体の運動')
set_run_font(r,size=28,bold=True,color=(29,57,84))
st=doc.add_paragraph(); st.alignment=WD_ALIGN_PARAGRAPH.CENTER
r=st.add_run('1A〜1G　文章内穴埋め・図統合 再構成版')
set_run_font(r,size=15,bold=True,color=(63,88,109))
para(doc,'確認用ドラフト',align=WD_ALIGN_PARAGRAPH.CENTER,size=11,after=18)
note_box(doc,'この版の原則', '穴を正答で埋めると、そのまま自然な教材本文として読める。未知語をいきなり当てさせず、現象・図・既知事項から意味を作ったあとで名前を与え、後の文章で再利用する。選択肢は本文の後方に置き、正解は巻末にまとめる。')
para(doc,'図はLibraryに保存された第1章 canonical figure 17枚を使用。図中に答えが直接出る場合は、その図を「問いの後の確認」に回している。',size=9.5,after=6)
doc.add_page_break()

# Intro
heading(doc,'第1章　物体の運動',1)
para(doc,'私たちは、物体が「動いている」とき、その様子を目で見てなんとなく理解できる。しかし物理では、どこにいるのか、どちらへ動いているのか、どれくらい速いのか、さらにその速さや向きがどのように変わっているのかを、誰が見ても同じように表す必要がある。')
para(doc,'一直線上の運動なら位置を一つの数で表せることもあるが、実際の運動は平面の中で起こる。投げたボールは曲線を描き、自転車は向きを変えながら進み、雨は観測者が動くと違う方向から降ってくるように見える。そこでこの章では、まず「位置」をベクトルで表すところから始め、位置の変化、速度、加速度へと考えをつないでいく。')

# ---------- 1A ----------
heading(doc,'1A　変位と速度',1)
heading(doc,'位置を矢印で表す',2)
para(doc,'平面上を運動する物体を考えよう。ある時刻 t₁ に、物体が点 P₁ にいるとする。物体が「どこにいるか」を表すため、基準となる原点 O を決め、O から P₁ へ矢印を引く。')
add_hole_para(doc,'この矢印は、原点から見た物体の ', 'A1', ' を表している。')
add_choice_block(doc,[('A1',['位置','速さ','経過時間','力'])])
ans('A1','位置')
para(doc,'矢印の始点は基準となる原点 O、終点は物体のいる点 P₁ である。この矢印を見ることで、物体が原点からどちらの方向に、どれくらい離れた場所にいるかを一度に表せる。このように、原点から物体の位置へ向かうベクトルを位置ベクトルという。時刻 t₁ における位置ベクトルを r⃗₁ と書く。')
add_figure(doc,1,'位置ベクトル r⃗₁, r⃗₂ と変位 Δr⃗')
para(doc,'しばらくして、時刻 t₂ に物体が点 P₂ へ移動したなら、その位置ベクトルを r⃗₂ と書く。r⃗₁ と r⃗₂ は、それぞれの時刻に物体が「どこにいるか」を表しているのであって、まだ「どれだけ動いたか」を表しているわけではない。')

heading(doc,'位置の変化を表す',2)
para(doc,'では、物体が P₁ から P₂ へ移動したことで「位置がどのように変わったか」を表したい場合はどうすればよいだろう。今度は原点からではなく、最初の位置 P₁ から後の位置 P₂ へ矢印を引けばよい。')
add_hole_para(doc,'P₁ から P₂ へ向かうこの矢印は、物体の ', 'A2', ' を表している。')
add_choice_block(doc,[('A2',['位置そのもの','位置の変化','経過時間','速度の大きさ'])])
ans('A2','位置の変化')
para(doc,'この「位置の変化」を物理では変位といい、Δr⃗ と表す。したがって P₁→P₂ が Δr⃗ である。ここで、O→P₁ が r⃗₁、P₁→P₂ が Δr⃗、O→P₂ が r⃗₂ という3本の矢印を同じ図で見る。')
para(doc,'原点 O からまず P₁ まで進み、そこからさらに P₂ まで進めば、結果として O から P₂ まで進んだことになる。したがって、図の矢印のつながりを式にすると、')
add_hole_para(doc,'r⃗₁ + ', 'A3', ' = r⃗₂')
add_choice_block(doc,[('A3',['Δr⃗','r⃗₁','r⃗₂','−r⃗₂'])])
ans('A3','Δr⃗')
equation(doc,'r⃗₁ + Δr⃗ = r⃗₂')
para(doc,'となる。これは「最初の位置 + 位置の変化 = 後の位置」という意味である。変位だけを左辺に残せば、')
equation(doc,'Δr⃗ = r⃗₂ − r⃗₁')
para(doc,'となる。つまり変位は「後の位置から最初の位置を引いたもの」であり、公式を先に覚えるより、この意味を理解しておく方が大切である。')

heading(doc,'座標で変位を見る',2)
para(doc,'位置ベクトルを r⃗₁=(x₁,y₁)、r⃗₂=(x₂,y₂) とする。変位 Δr⃗=r⃗₂−r⃗₁ なので、x方向とy方向もそれぞれ「後−前」で求められる。')
add_hole_para(doc,'したがって、Δx = ', 'A4', ' である。')
add_choice_block(doc,[('A4',['x₂−x₁','x₁−x₂','x₁+x₂','x₂/x₁'])])
ans('A4','x₂−x₁')
equation(doc,'Δr⃗ = (x₂−x₁,  y₂−y₁)')
add_figure(doc,4,'座標成分で見た変位')
para(doc,'変位は途中の経路には依存しない。大きく回り道をして P₁ から P₂ へ移動しても、変位は最初の位置から最後の位置へ向かうベクトルで決まる。したがって、実際に進んだ道のりと変位の大きさは、一般には同じではない。')

heading(doc,'位置の変化を時間と結びつける',2)
para(doc,'同じ変位でも、1秒で移動した場合と10秒かけた場合では運動の様子が違う。そこで位置の変化だけでなく、それにかかった時間も考える。時刻 t₁ から t₂ までの経過時間を Δt と書けば、')
add_hole_para(doc,'Δt = ', 'A5', ' である。')
add_choice_block(doc,[('A5',['t₂−t₁','t₁−t₂','t₁+t₂','t₂/t₁'])])
ans('A5','t₂−t₁')
para(doc,'この間の変位が Δr⃗ なら、単位時間あたりにどれだけ位置が変化したかを考えればよい。この量を平均の速度という。')
add_hole_para(doc,'v̄⃗ = ', 'A6', '')
add_choice_block(doc,[('A6',['Δr⃗/Δt','Δt/Δr⃗','r⃗₁+r⃗₂','|Δr⃗|'])])
ans('A6','Δr⃗/Δt')
equation(doc,'v̄⃗ = Δr⃗/Δt = (r⃗₂−r⃗₁)/(t₂−t₁)')
para(doc,'Δt>0 なので、平均の速度の向きは変位 Δr⃗ の向きと一致する。')

heading(doc,'瞬間の速度',2)
para(doc,'平均の速度は、ある時間区間全体についての運動を表す。しかし曲線上を動く物体について「ちょうど今この瞬間にどちらへ動いているか」を知りたい場合もある。P₁ と、その少し先の P₂ を考え、P₂ を少しずつ P₁ に近づけていく。')
add_figure(doc,2,'平均速度の向きから瞬間速度の向きへ')
add_hole_para(doc,'P₂ を P₁ に近づけるほど、P₁ と P₂ を結ぶ方向は、P₁ における軌跡の ', 'A7', ' へ近づく。')
add_choice_block(doc,[('A7',['接線方向','法線方向','鉛直方向','原点方向'])])
ans('A7','接線方向')
para(doc,'同時に時間間隔 Δt も小さくなる。Δt→0 とした極限で得られる速度を瞬間の速度という。')
equation(doc,'v⃗ = lim(Δt→0)  Δr⃗/Δt')
para(doc,'したがって、曲線運動をしている物体でも、その瞬間の速度の方向は軌跡の接線方向になる。')
add_figure(doc,3,'曲線上の各点における瞬間速度')

heading(doc,'速度と速さ',2)
para(doc,'速度 v⃗ は大きさと向きの両方をもつベクトル量である。一方、速度ベクトルの大きさだけを取り出した v=|v⃗| を速さという。')
add_hole_para(doc,'向きまで含んでいる量は ', 'A8', ' である。')
add_choice_block(doc,[('A8',['速度','速さ','時間','道のり'])])
ans('A8','速度')

heading(doc,'例題：変位から平均速度へ',2)
para(doc,'時刻 t₁=2.0 s に P₁=(1.0,2.0) m にあり、時刻 t₂=5.0 s に P₂=(7.0,6.0) m へ移動した物体を考える。平均速度を求めるには、いきなり時間で割るのではなく、まず位置がどれだけ変化したかを求める。')
add_hole_para(doc,'最初に求めるべき量は ', 'A9', ' である。')
add_choice_block(doc,[('A9',['変位','速さ','加速度','力'])])
ans('A9','変位')
equation(doc,'Δr⃗ = (7.0,6.0) − (1.0,2.0) = (6.0,4.0) m')
equation(doc,'Δt = 5.0 − 2.0 = 3.0 s')
add_hole_para(doc,'したがって、平均速度は v̄⃗ = ', 'A10', ' m/s となる。')
add_choice_block(doc,[('A10',['(2.0, 4/3)','(6.0,4.0)','(3.0,2.0)','(2.0,1.0)'])])
ans('A10','(2.0, 4/3)')
para(doc,'ここでも、位置 → 変位 → 速度という順序で量がつながっている。次は、速度が複数あるときにどう組み合わせるかを考える。')

# section flows continuously; no forced page break

# ---------- 1B ----------
heading(doc,'1B　速度の合成と分解',1)
para(doc,'1Aでは、速度が大きさと向きをもつベクトルであることを学んだ。速度がベクトルなら、複数の運動が同時に起こる場合には、それぞれの速度を矢印として組み合わせて考えられる。')
heading(doc,'2つの運動を一つの速度として見る',2)
para(doc,'川を横切る船を考えよう。船は水に対して北向きに進んでいるが、川の水そのものは東向きに流れている。岸から見ると、船は北へ進みながら同時に東へ流される。')
add_figure(doc,5,'川を横切る船：水に対する速度・川の流れ・地面に対する速度')
add_hole_para(doc,'地面に対する船の速度は、2つの速度ベクトルの ', 'B1', ' で表される。')
add_choice_block(doc,[('B1',['和','積','商','大きい方だけ'])])
ans('B1','和')
equation(doc,'v⃗ = v⃗₁ + v⃗₂')
para(doc,'このように複数の速度をベクトルとして足し合わせ、一つの速度を求めることを速度の合成という。ベクトルの和は、一つ目の矢印の終点に二つ目の矢印の始点を置き、最初の始点から最後の終点までを結べばよい。')

heading(doc,'一つの速度を二方向に分ける',2)
para(doc,'反対に、一つの速度ベクトルを水平方向と鉛直方向に分けることもできる。速度の大きさを v、x軸となす角を θ とすると、直角三角形の関係から成分を求められる。')
add_hole_para(doc,'水平方向の成分は vₓ = ', 'B2', ' である。')
add_hole_para(doc,'鉛直方向の成分は vᵧ = ', 'B3', ' である。')
add_choice_block(doc,[('B2',['v cosθ','v sinθ','v tanθ','v/ cosθ']),('B3',['v sinθ','v cosθ','v tanθ','v/ sinθ'])])
ans('B2','v cosθ'); ans('B3','v sinθ')
add_figure(doc,6,'速度ベクトルの x・y 成分')
para(doc,'逆に、成分 vₓ と vᵧ がわかっていれば、元の速度の大きさは三平方の関係から求められる。')
add_hole_para(doc,'v = ', 'B4', '')
add_choice_block(doc,[('B4',['√(vₓ²+vᵧ²)','vₓ+vᵧ','vₓ−vᵧ','vₓvᵧ'])])
ans('B4','√(vₓ²+vᵧ²)')
para(doc,'ここで vₓ、vᵧ は単なる大きさではない。右向きを正、左向きを負、上向きを正、下向きを負というように、向きも符号に含めて考える。')

heading(doc,'ベクトルの差',2)
para(doc,'次の相対速度を考えるためには、ベクトルの引き算も必要になる。a⃗−b⃗ は、b⃗ と逆向きのベクトル −b⃗ を足すことで作れる。')
add_hole_para(doc,'したがって、a⃗ − b⃗ = a⃗ + ', 'B5', ' と考えられる。')
add_choice_block(doc,[('B5',['(−b⃗)','b⃗','(−a⃗)','0'])])
ans('B5','(−b⃗)')

heading(doc,'例題：川を横切る船',2)
para(doc,'川の流れが東向き 2.0 m/s、船が水に対して北向き 1.5 m/s で進むとする。東を x 正、北を y 正とすれば、地面に対する船の速度成分は (2.0,1.5) m/s である。')
add_hole_para(doc,'したがって速さは ', 'B6', ' m/s となる。')
add_choice_block(doc,[('B6',['2.5','3.5','1.0','4.0'])])
ans('B6','2.5')
para(doc,'速度を合成する場合も分解する場合も、重要なのは「どの方向の運動を一緒に見ているのか」を図で確認することである。')

# section flows continuously; no forced page break

# ---------- 1C ----------
heading(doc,'1C　相対速度',1)
para(doc,'同じ物体の速度でも、誰が観測するかによって見え方が変わる。道路の脇に立っている人と、走っている自動車の中の人では、同じ自動車を見ても感じる速度が違う。')
heading(doc,'「誰から見るか」を式に入れる',2)
para(doc,'同じ向きに走る自動車AとBを考えよう。Aが10 m/s、Bが15 m/sで走っている。道路から見ればBは15 m/sだが、A自身も10 m/sで同じ方向へ進んでいるため、Aから見たBは5 m/sで遠ざかって見える。')
add_hole_para(doc,'このように、ある観測者から見た別の物体の速度を ', 'C1', ' という。')
add_choice_block(doc,[('C1',['相対速度','平均速度','終端速度','瞬間速度'])])
ans('C1','相対速度')
para(doc,'地面に対するAの速度を v⃗_A、Bの速度を v⃗_B とし、Aから見たBの速度を v⃗_{B/A} と書く。観測者A自身の速度を差し引けばよいので、')
add_hole_para(doc,'v⃗_{B/A} = ', 'C2', '')
add_choice_block(doc,[('C2',['v⃗_B − v⃗_A','v⃗_A − v⃗_B','v⃗_A + v⃗_B','|v⃗_A|+|v⃗_B|'])])
ans('C2','v⃗_B − v⃗_A')
add_figure(doc,7,'同方向・逆方向に動く物体の相対速度')
para(doc,'AとBが同じ向きにまったく同じ速度で走っていれば、差は0になる。')
add_hole_para(doc,'したがってAから見るとBは ', 'C3', ' ように見える。')
add_choice_block(doc,[('C3',['止まっている','2倍速い','逆向きに動く','鉛直に動く'])])
ans('C3','止まっている')

heading(doc,'平面内でも同じ',2)
para(doc,'相対速度は一直線上だけでなく平面内でも同じである。v⃗_A=(v_Ax,v_Ay)、v⃗_B=(v_Bx,v_By) なら、x成分どうし、y成分どうしをそれぞれ引けばよい。')
equation(doc,'v⃗_{B/A} = (v_Bx−v_Ax,  v_By−v_Ay)')

heading(doc,'雨が斜めに見える理由',2)
para(doc,'雨が地面に対して鉛直下向き10 m/sで降り、自転車が右向き10 m/sで走っているとする。右向きをx正、上向きをy正にすると、雨は (0,−10)、自転車は (10,0) と表せる。')
add_hole_para(doc,'自転車から見た雨の速度は ', 'C4', ' m/s である。')
add_choice_block(doc,[('C4',['(−10,−10)','(10,−10)','(−10,10)','(0,−20)'])])
ans('C4','(−10,−10)')
add_figure(doc,8,'自転車から見た雨の相対速度')
para(doc,'このベクトルの大きさは 10√2 m/s で、方向は鉛直から後方へ45°傾く。雨そのものの運動が変化したのではなく、観測する側が動いたことで見える速度が変化したのである。')
add_hole_para(doc,'相対速度を考えるとき、最初に明確にすべきなのは「誰を ', 'C5', ' にして見るか」である。')
add_choice_block(doc,[('C5',['基準','加速度','原点の座標だけ','力'])])
ans('C5','基準')

# section flows continuously; no forced page break

# ---------- 1D ----------
heading(doc,'1D　加速度',1)
para(doc,'ここまでは物体の位置が変化することから速度を考えてきた。しかし実際の運動では、速度そのものも変化する。自動車が発進すれば速さが増え、ブレーキをかければ減る。また、一定の速さでもカーブを曲がれば向きが変わる。速度はベクトルなので、向きが変わるだけでも「速度が変化した」ことになる。')
heading(doc,'速度の変化を表す',2)
para(doc,'ある時刻の速度が v⃗₁、その後の速度が v⃗₂ なら、速度の変化は「後の速度−前の速度」で表される。')
add_hole_para(doc,'Δv⃗ = ', 'D1', '')
add_choice_block(doc,[('D1',['v⃗₂−v⃗₁','v⃗₁−v⃗₂','v⃗₁+v⃗₂','|v⃗₂|−|v⃗₁|だけ'])])
ans('D1','v⃗₂−v⃗₁')
add_figure(doc,9,'曲線運動での速度の変化')
para(doc,'速度が同じだけ変化しても、その変化が1秒で起こる場合と10秒かかる場合では変化の激しさが違う。そこで速度の変化を時間で割る。')
add_hole_para(doc,'平均加速度 ā⃗ = ', 'D2', ' である。')
add_choice_block(doc,[('D2',['Δv⃗/Δt','Δt/Δv⃗','v⃗₁+v⃗₂','Δr⃗/Δt'])])
ans('D2','Δv⃗/Δt')
para(doc,'加速度の向きは現在の速度の向きではなく、速度が変化した向き、すなわち Δv⃗ の向きである。時間間隔を限りなく小さくすれば、瞬間の加速度 a⃗ を考えられる。')
add_figure(doc,10,'速度変化 Δv⃗ と平均加速度の向き')

heading(doc,'v-tグラフで加速度と変位を見る',2)
para(doc,'速度 v を縦軸、時刻 t を横軸に取る。ある時間 Δt の間に速度が Δv だけ変化したなら、グラフの傾きは Δv/Δt である。')
add_hole_para(doc,'したがって、v-tグラフの傾きは ', 'D3', ' を表す。')
add_choice_block(doc,[('D3',['加速度','変位','位置','力そのもの'])])
ans('D3','加速度')
para(doc,'また、速度が一定なら時間 Δt の間の変位は vΔt であり、これはv-tグラフでは長方形の面積に対応する。速度が変化する場合も同じ考え方が使える。')
add_hole_para(doc,'したがって、v-tグラフと時間軸で囲まれた面積は ', 'D4', ' を表す。')
add_choice_block(doc,[('D4',['変位','加速度','力','質量'])])
ans('D4','変位')

heading(doc,'加速度が一定の運動',2)
para(doc,'加速度 a が一定で、初速度を v₀ とする。時間 t の間に速度は at だけ変化するので、')
add_hole_para(doc,'v = v₀ + ', 'D5', '')
add_choice_block(doc,[('D5',['at','a/t','t/a','a²t'])])
ans('D5','at')
para(doc,'となる。このときv-tグラフは直線である。変位はグラフの面積から求められ、初速度による長方形 v₀t と、速度増加による三角形 (1/2)at² の和になる。')
add_hole_para(doc,'したがって、x = v₀t + ', 'D6', ' である。')
add_choice_block(doc,[('D6',['(1/2)at²','at','(1/2)vt','a²t'])])
ans('D6','(1/2)at²')
para(doc,'さらに時間 t を消去すると、')
add_hole_para(doc,'v² − v₀² = ', 'D7', '')
add_choice_block(doc,[('D7',['2ax','ax','2at','a²x'])])
ans('D7','2ax')
para(doc,'となる。これらは別々の公式ではなく、一定加速度で運動する同じ物体を、知りたい量に応じて違う形で表している。')

heading(doc,'力と加速度',2)
para(doc,'速度がなぜ変化するのかを考えると、力とのつながりが見えてくる。物体にはたらく合力を F⃗、質量を m とすると、運動方程式は m a⃗ = F⃗ である。')
add_hole_para(doc,'したがって、合力が0なら加速度は ', 'D8', ' となり、速度は変化しない。')
add_choice_block(doc,[('D8',['0','g','v','無限大'])])
ans('D8','0')

heading(doc,'例題：等加速度運動',2)
para(doc,'静止していた物体が 2.0 m/s² の一定加速度で3.0 s運動する。初速度 v₀=0 なので、v=v₀+at より速度は6.0 m/sとなる。変位は x=v₀t+(1/2)at² を使う。')
add_hole_para(doc,'このとき変位 x は ', 'D9', ' m である。')
add_choice_block(doc,[('D9',['9.0','6.0','18','3.0'])])
ans('D9','9.0')

# section flows continuously; no forced page break

# ---------- 1E ----------
heading(doc,'1E　水平投射',1)
para(doc,'平面内の速度を水平方向と鉛直方向に分けて考える方法は、空中へ投げた物体の運動で特に役立つ。まず、物体を水平方向へ投げる水平投射を考えよう。')
heading(doc,'ストロボ写真から2つの運動を見つける',2)
para(doc,'同じ高さから、一方の物体を静かに落とし、もう一方を水平方向へ投げる。一定時間ごとの位置を記録すると、水平方向の点の間隔はほぼ一定で、鉛直方向の点の間隔は時間とともに広がる。')
add_figure(doc,11,'水平投射のストロボ図：水平方向と鉛直方向の変化')
para(doc,'この観察から、水平投射は「水平方向の運動」と「鉛直方向の運動」を分けて考えられることがわかる。空気抵抗を無視すれば、物体には重力だけが働き、その向きは鉛直方向である。')
add_hole_para(doc,'したがって、水平方向の加速度 aₓ は ', 'E1', ' である。')
add_choice_block(doc,[('E1',['0','g','−g','v₀'])])
ans('E1','0')
para(doc,'水平方向の速度は一定で、水平初速度を v₀ とすれば vₓ=v₀ である。')
add_hole_para(doc,'したがって水平方向の位置は x = ', 'E2', ' となる。')
add_choice_block(doc,[('E2',['v₀t','(1/2)gt²','gt','v₀/t'])])
ans('E2','v₀t')

heading(doc,'鉛直方向は自由落下',2)
para(doc,'物体は水平方向へ投げたので、投げた瞬間の鉛直速度は0である。下向きを正に取れば、鉛直方向の加速度は g である。')
add_hole_para(doc,'したがって鉛直方向の位置は y = ', 'E3', ' となる。')
add_choice_block(doc,[('E3',['(1/2)gt²','v₀t','gt','g/t'])])
ans('E3','(1/2)gt²')
para(doc,'同じく鉛直速度は vᵧ=gt であり、時間を使わない式 vᵧ²=2gy も成り立つ。つまり鉛直方向だけを見れば、静かに落とした物体と同じ自由落下である。')
add_figure(doc,12,'水平投射中の速度成分 vₓ, vᵧ と合成速度 v')

heading(doc,'一つの速度に戻す',2)
para(doc,'実際の物体は水平方向と鉛直方向を別々に動いているわけではない。速度ベクトルは (vₓ,vᵧ) なので、その大きさは三平方の関係で求められる。')
add_hole_para(doc,'水平投射の速さは v = ', 'E4', ' である。')
add_choice_block(doc,[('E4',['√(v₀²+g²t²)','v₀+gt','v₀gt','√(v₀²−g²t²)'])])
ans('E4','√(v₀²+g²t²)')

heading(doc,'なぜ軌跡は放物線になるのか',2)
para(doc,'水平方向では x=v₀t なので t=x/v₀ である。これを y=(1/2)gt² に代入すると、')
equation(doc,'y = (g/(2v₀²)) x²')
add_hole_para(doc,'y が x² に比例するので、水平投射の軌跡は ', 'E5', ' になる。')
add_choice_block(doc,[('E5',['放物線','円','直線','双曲線'])])
ans('E5','放物線')
para(doc,'「水平投射だから放物線」と覚えるのではない。水平方向の等速運動と鉛直方向の等加速度運動が同時に進む結果として、放物線が現れる。')

heading(doc,'例題：高さ19.6 mから水平投射',2)
para(doc,'高さ19.6 mから水平初速度14.7 m/sで物体を投げる。落下時間は鉛直方向だけを考え、19.6=(1/2)×9.8×t² から求める。')
add_hole_para(doc,'落下時間は t = ', 'E6', ' s である。')
add_choice_block(doc,[('E6',['2.0','1.0','4.0','9.8'])])
ans('E6','2.0')
para(doc,'この時間だけ水平方向へ一定速度14.7 m/sで進むので、水平到達距離は14.7×2.0=29.4 mとなる。複雑な曲線運動も、方向ごとに分ければ既知の運動へ戻せる。')

# section flows continuously; no forced page break

# ---------- 1F ----------
heading(doc,'1F　斜方投射',1)
para(doc,'水平投射では初速度が水平方向だけを向いていた。今度は物体を斜め上向きに投げる。見た目は複雑になるが、考え方は同じで、初速度を水平方向と鉛直方向へ分ければよい。')
add_figure(doc,13,'斜方投射の軌跡と最高点')
heading(doc,'初速度を分解する',2)
para(doc,'初速度の大きさを v₀、水平方向となす角を θ とする。')
add_hole_para(doc,'水平方向の初速度は v₀ₓ = ', 'F1', ' である。')
add_hole_para(doc,'鉛直方向の初速度は v₀ᵧ = ', 'F2', ' である。')
add_choice_block(doc,[('F1',['v₀ cosθ','v₀ sinθ','v₀ tanθ','v₀/ cosθ']),('F2',['v₀ sinθ','v₀ cosθ','v₀ tanθ','v₀/ sinθ'])])
ans('F1','v₀ cosθ'); ans('F2','v₀ sinθ')
para(doc,'水平方向には力が働かないので aₓ=0、したがって vₓ=v₀cosθ は一定で、x=v₀cosθ·t となる。')

heading(doc,'鉛直方向では重力が速度を変える',2)
para(doc,'上向きを正に取ると重力加速度は −g である。初めの鉛直速度は v₀sinθ なので、')
add_hole_para(doc,'vᵧ = ', 'F3', '')
add_choice_block(doc,[('F3',['v₀sinθ−gt','v₀sinθ+gt','v₀cosθ−gt','gt'])])
ans('F3','v₀sinθ−gt')
equation(doc,'y = v₀sinθ·t − (1/2)gt²')
para(doc,'また、時間を使わない形では vᵧ²−(v₀sinθ)²=−2gy が成り立つ。')

heading(doc,'最高点では何が起こるか',2)
para(doc,'投げた直後は上向きの速度成分をもつが、重力は常に下向きなので、上向きの速度成分は時間とともに小さくなる。上昇から下降へ切り替わる境目では、鉛直方向の速度は一瞬だけ0になる。')
add_hole_para(doc,'したがって最高点では vᵧ = ', 'F4', ' である。')
add_choice_block(doc,[('F4',['0','g','v₀','v₀cosθ'])])
ans('F4','0')
add_figure(doc,14,'斜方投射の速度成分：最高点では鉛直成分が0')
para(doc,'vᵧ=v₀sinθ−gt に vᵧ=0 を入れれば、最高点に達する時刻 t_H を求められる。')
add_hole_para(doc,'t_H = ', 'F5', '')
add_choice_block(doc,[('F5',['v₀sinθ/g','v₀cosθ/g','g/(v₀sinθ)','2v₀sinθ/g'])])
ans('F5','v₀sinθ/g')
para(doc,'これを鉛直位置の式へ代入すると、最高点の高さは H=v₀²sin²θ/(2g) となる。最高点で0になるのは鉛直成分だけで、水平方向の速度 v₀cosθ は残っているため、物体そのものが止まるわけではない。')

heading(doc,'軌跡と飛行時間',2)
para(doc,'x=v₀cosθ·t から t=x/(v₀cosθ) とし、これを y の式へ代入すると、')
equation(doc,'y = x tanθ − [g/(2v₀²cos²θ)] x²')
add_hole_para(doc,'この式は x の2次式なので、斜方投射の軌跡も ', 'F6', ' である。')
add_choice_block(doc,[('F6',['放物線','直線','円','楕円'])])
ans('F6','放物線')
para(doc,'投げ出した位置と同じ高さへ戻るとき y=0 である。投げた瞬間 t=0 以外の解を取れば、')
add_hole_para(doc,'飛行時間 T = ', 'F7', '')
add_choice_block(doc,[('F7',['2v₀sinθ/g','v₀sinθ/g','2v₀cosθ/g','g/(2v₀sinθ)'])])
ans('F7','2v₀sinθ/g')

heading(doc,'水平到達距離',2)
para(doc,'水平速度は一定なので、水平到達距離 D は v₀cosθ に飛行時間 T を掛ければよい。整理すると、')
add_hole_para(doc,'D = ', 'F8', '')
add_choice_block(doc,[('F8',['(v₀²/g)sin2θ','(v₀²/g)cos2θ','v₀g sinθ','2v₀/g'])])
ans('F8','(v₀²/g)sin2θ')
para(doc,'同じ初速度 v₀ なら、D は sin2θ が最大のとき最大になる。sin2θ の最大値は1なので、2θ=90°、したがって、')
add_hole_para(doc,'最大飛距離を与える角度は θ = ', 'F9', ' である。')
add_choice_block(doc,[('F9',['45°','30°','60°','90°'])])
ans('F9','45°')
para(doc,'45°を単独で暗記するのではなく、水平成分と鉛直成分の両方が飛距離に関わり、その結果として sin2θ が現れることを理解する。')

# section flows continuously; no forced page break

# ---------- 1G ----------
heading(doc,'1G　重力加速度・空気抵抗・終端速度',1)
para(doc,'水平投射や斜方投射では、空気抵抗を無視して重力だけが働くものとして考えてきた。ここでは、その仮定を一度外し、空気抵抗があると落下運動がどう変わるのかを見る。')
heading(doc,'重力だけなら質量によらず同じ加速度',2)
para(doc,'質量 m の物体にはたらく重力は m g⃗ である。運動方程式 m a⃗ = m g⃗ の両辺を m で割ると、質量が消える。')
add_hole_para(doc,'したがって、重力だけが働くとき a⃗ = ', 'G1', ' である。')
add_choice_block(doc,[('G1',['g⃗','m g⃗','0','v⃗'])])
ans('G1','g⃗')
para(doc,'つまり空気抵抗を無視できるなら、物体の質量に関係なく同じ重力加速度で落下する。')
add_figure(doc,15,'重力だけの場合と、空気抵抗を受ける場合の力')

heading(doc,'なぜ羽毛と鉄球は空気中で違って落ちるのか',2)
para(doc,'真空中では羽毛も鉄球も同じように落下する。しかし空気中では違う。違いを生み出しているのは重力加速度ではなく空気抵抗である。空気抵抗は、空気に対する物体の運動と反対向きにはたらく。比較的速さが小さい範囲では、抵抗力の大きさを速さに比例すると近似できる。')
add_hole_para(doc,'このとき抵抗力の大きさは f = ', 'G2', ' と書ける。')
add_choice_block(doc,[('G2',['kv','k/v','mv','mg'])])
ans('G2','kv')

heading(doc,'落下中に加速度が変わる',2)
para(doc,'下向きを正に取る。落下を始めた直後は v=0 なので空気抵抗も0であり、重力だけが働く。しかし速さが増えると空気抵抗 kv も大きくなる。')
add_hole_para(doc,'したがって運動方程式は ma = ', 'G3', ' となる。')
add_choice_block(doc,[('G3',['mg−kv','mg+kv','kv−mg','mg'])])
ans('G3','mg−kv')
equation(doc,'a = g − (k/m)v')
para(doc,'この式を見ると、速さ v が増えるほど空気抵抗が大きくなり、下向きの合力は小さくなることがわかる。物体はまだ速くなっているが、その「速くなり方」はだんだん弱くなる。')
add_hole_para(doc,'つまり落下中、速さが増えるにつれて加速度は ', 'G4', '。')
add_choice_block(doc,[('G4',['小さくなる','大きくなる','必ず0のまま','向きだけ反転し続ける'])])
ans('G4','小さくなる')
add_figure(doc,16,'速度増加に伴う空気抵抗と合力の変化')

heading(doc,'v-tグラフと終端速度',2)
para(doc,'この運動をv-tグラフで見ると、落下直後は加速度がgに近いため傾きが大きい。しかし速度が増えるにつれて加速度が小さくなり、グラフの傾きも小さくなる。')
add_hole_para(doc,'v-tグラフの傾きは ', 'G5', ' を表しているからである。')
add_choice_block(doc,[('G5',['加速度','変位','位置','質量'])])
ans('G5','加速度')
add_figure(doc,17,'終端速度へ近づく v-t グラフ')
para(doc,'さらに落下を続けると、上向きの空気抵抗が下向きの重力と同じ大きさになる。このとき合力は0である。')
add_hole_para(doc,'したがって終端速度に達したとき、加速度 a は ', 'G6', ' となる。')
add_choice_block(doc,[('G6',['0','g','−g','v_t'])])
ans('G6','0')
para(doc,'加速度が0なら速度はそれ以上変化しない。この一定の速度を終端速度 v_t という。mg=kv_t より、')
add_hole_para(doc,'v_t = ', 'G7', '')
add_choice_block(doc,[('G7',['mg/k','k/(mg)','m/(kg)','g/(mk)'])])
ans('G7','mg/k')

heading(doc,'例題：終端速度',2)
para(doc,'m=0.50 kg、k=0.10 kg/s、g=9.8 m/s² とする。終端速度では mg=kv_t なので、v_t=mg/k を使う。')
add_hole_para(doc,'v_t = 0.50×9.8/0.10 = ', 'G8', ' m/s')
add_choice_block(doc,[('G8',['49','4.9','9.8','0.49'])])
ans('G8','49')
para(doc,'重要なのは49という数値より、速さが増える → 抵抗が増える → 合力が減る → 加速度が減る → 重力と抵抗がつり合う → 終端速度になる、という因果関係である。')

# Chapter connection
heading(doc,'第1章全体を一つの流れとして見る',1)
para(doc,'第1章で学んだ内容は別々の公式の集まりではない。まず、物体がどこにいるかを位置ベクトル r⃗ で表す。2つの位置を比べると位置の変化 Δr⃗ が生まれ、その変位を時間で割ると速度 v⃗ が生まれる。さらに速度の変化を時間で割ると加速度 a⃗ が生まれる。')
equation(doc,'位置  →  変位  →  速度  →  加速度')
para(doc,'速度がベクトルであることを使えば、速度を合成・分解できる。観測者の速度を差し引けば相対速度になる。水平投射や斜方投射は、水平方向と鉛直方向へ運動を分けることで、すでに学んだ等速運動と等加速度運動の組み合わせとして理解できる。最後に空気抵抗を考えると、力 → 加速度 → 速度という因果関係も見える。')
note_box(doc,'この章で身につけたいこと', '公式を個別に暗記することではなく、「今どの量を見ているか」「その量は何の変化から生まれたか」「図やグラフのどこにその意味が表れているか」「なぜその式が使えるか」をつなげて考えられるようになること。')

# Answers
doc.add_page_break()
heading(doc,'解答',1)
para(doc,'本文中の穴の正答。学習時には本文から分離して最後に確認する。',size=9.5)
current_prefix=None
for hid, answer in answers:
    prefix=hid[0]
    if prefix!=current_prefix:
        names={'A':'1A 変位と速度','B':'1B 速度の合成と分解','C':'1C 相対速度','D':'1D 加速度','E':'1E 水平投射','F':'1F 斜方投射','G':'1G 重力加速度・空気抵抗・終端速度'}
        heading(doc,names[prefix],2)
        current_prefix=prefix
    p=doc.add_paragraph()
    p.paragraph_format.space_after=Pt(2)
    r=p.add_run(hid+'　')
    set_run_font(r,size=10,bold=True,color=(0,86,140))
    r=p.add_run(answer)
    set_run_font(r,size=10)

# Source note
para(doc,'',after=0)
note_box(doc,'作成メモ', '第1章の既存母版1A〜1Gの内容を残しながら、「文章→図→文章内の穴→正答で文章完成」という学習構造へ再構成した確認用ドラフト。図は保存済みのcanonical figure 17枚を使用。')

# prevent orphan headings more broadly
for p in doc.paragraphs:
    if p.style and p.style.name.startswith('Heading'):
        p.paragraph_format.keep_with_next=True

# Validate canonical figures before saving.
missing = [str(path) for path in figs.values() if not path.exists()]
if missing:
    raise FileNotFoundError('Missing canonical figure files: ' + ', '.join(missing))

# Save
doc.save(OUT)
print(OUT)
print('answers', len(answers))
print('figures', len(figs))