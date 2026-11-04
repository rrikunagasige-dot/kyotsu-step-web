"""Assemble review-only exact candidate data; production sources stay untouched."""
from pathlib import Path
import copy,json,hashlib,re,subprocess
B=Path(__file__).resolve().parent;R=B.parents[2]
def load(p):return json.loads((B/p).read_text())
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def T(s):return {'type':'text','text':s}
def M(s):return {'type':'math','latex':s}
def paragraph(id,*parts,chain=None):return dict(id=id,type='paragraph',parts=list(parts),**({'derivationId':chain}if chain else{}))
def formula(id,*parts,chain=None):return dict(id=id,type='formula',parts=list(parts),**({'derivationId':chain}if chain else{}))
def C(id):return {'type':'choice','itemId':id}
changes=[];added=[]
units={c:copy.deepcopy(load('evidence/'+c.upper()+'_CURRENT.json')['unit'])for c in ['n13','n14']}
def block(c,id):return next(x for x in units[c]['sections'][0]['readingFlow']if x['id']==id)
def add_before(c,target,q,id,prompt,stem,answer,wrong,hint,after,action='calculation'):
 s=units[c]['sections'][0];chain=c+'-q'+str(q).zfill(2)+'-chain'
 item={'id':id,'label':id.upper(),'prompt':prompt,'answer':answer,'acceptedAnswers':[],'answerType':'formula'if action=='calculation'else'text','choices':[answer,*wrong],'purpose':'causal-reasoning','scaffoldLevel':'light','hints':[hint]}
 assert len(item['choices'])==len(set(item['choices']))==4
 before,tail=stem.split('□')
 parts=([M(before)]if before else[])+[C(id)]+([M(tail)]if tail else[])
 rows=[paragraph(id+'-lead',T(prompt),chain=chain),formula(id+'-formula',*parts,chain=chain),paragraph(id+'-after',T(after),chain=chain)]
 index=next(i for i,x in enumerate(s['readingFlow'])if x['id']==target);s['readingFlow'][index:index]=rows
 # Keep the original grade ID at the integration step, and insert only new IDs.
 anchor={'n13':{4:'n13-04',7:'n13-07',9:'n13-09'},'n14':{5:'n14-05'}}[c][q]
 at=next(i for i,x in enumerate(s['items'])if x['id']==anchor);s['items'].insert(at,item)
 added.append({'unit':c,'q':q,'id':id,'prompt':prompt,'template':stem,'answer':answer,'wrong':wrong,'hint':hint,'after':after,'action':action,'beforeBlock':target})

# N13: retain every previously approved question/choice key and branch decision.
units['n13']['revision']=5
block('n13','n13-lead-02')['parts']=[T('次の例題は、中身が式になっています。'),M('|x-1|=4'),T('中身全体を一つの数として扱うため、'),M('X=x-1'),T('と置きます。いまの距離の条件をXについて書き直しましょう。')]
s=units['n13']['sections'][0];at=next(i for i,x in enumerate(s['readingFlow'])if x['id']=='n13-show-n13-f02')+1
s['readingFlow'].insert(at,paragraph('n13-w048-positive-distance-property',T('今の二つの位置を、正の距離aに広げます。'),M(r'a>0:\quad |x|=a\iff(x=a\;\text{または}\;x=-a)'),T('「または」は、どちらか一方を満たせばよいという条件です。')))
block('n13','n13-lead-04')['parts']=[T('絶対値を外して得た二つの方程式を、それぞれ解きます。両辺に同じ数を加える規則を使い、片方を解いた後も、もう片方の枝を残します。')]
add_before('n13','n13-formula-04',4,'n13-w048-q04-positive','右の位置を求めます。右辺の4+1を計算しましょう。',r'x-1=4\ \Rightarrow\ x=4+1=□','5',['3','-5','4'],'両辺に1を足した結果を計算します。','右の位置が決まりました。次は負の方程式を解きます。')
add_before('n13','n13-formula-04',4,'n13-w048-q04-negative','左の位置を求めます。負号を残し、−4+1を計算しましょう。',r'x-1=-4\ \Rightarrow\ x=-4+1=□','-3',['3','-5','-4'],'負の数に正の1を加える位置を考えます。','二本の方程式の解が揃いました。元の問いへの答えとして一組にします。')
block('n13','n13-lead-07')['parts']=[T('次の確認でも、二つの方程式を別々に解きます。前の例題より説明を減らし、符号を自分で確かめましょう。')]
add_before('n13','n13-formula-07',7,'n13-w048-q07-positive','正の枝をxについて解きましょう。',r'x+2=3\ \Rightarrow\ x=□','1',['5','-1','3'],'xだけを残すため、両辺から同じ数を引きます。','もう一方の枝も同じ操作で解きます。')
add_before('n13','n13-formula-07',7,'n13-w048-q07-negative','負の枝もxについて解きましょう。',r'x+2=-3\ \Rightarrow\ x=□','-5',['-1','5','-3'],'右辺が負でも、左辺の定数を打ち消す操作は同じです。','二つの結果を元の絶対値方程式の解としてまとめます。')
block('n13','n13-lead-09')['parts']=[{'type':'term','text':'性質'},T('を確かめます。ここまでは距離が正の場合でした。距離が0の場合と、負の値を要求された場合を分けて考えます。')]
add_before('n13','n13-formula-09',9,'n13-w048-q09-zero','まず、原点からの距離が0になる位置を求めましょう。',r'|x|=0\ \Rightarrow\ x=□','0',['1','-1','2'],'点と原点が同じ位置にある場合の距離を考えます。','距離が0の場合は一つの位置です。次は負の値を要求した条件を調べます。')
add_before('n13','n13-formula-09',9,'n13-w048-q09-negative','次に、絶対値が負の数に等しくなる実数があるか判断しましょう。',r'|x|=-2\quad □','実数解なし',['x=-2','x=2','すべての実数'],'絶対値が取り得る値と、右辺の符号を照合します。','二つの場合の違いを、元の問いの順にまとめます。',action='meaning')
for item in s['items']:
 if item['id']=='n13-06':item['hints']=['絶対値が付いている範囲を確認し、中身全体を一つの数として、最初の例題で使った分け方を適用します。']
 if item['id']=='n13-09':item['hints']=['直前に別々に求めた二つの結果を、距離が0の場合、負の場合の順に対応させます。']

# N14: neutralize all confirmed early answers, not only the nearest paragraph.
units['n14']['revision']=11
block('n14','n14-heading-1')['text']='距離から残す範囲を考える'
block('n14','n14-after-02')['parts']=[T('境界の二点が決まりました。次に、その間と外側のどちらを残すか、元の距離の条件から考えます。')]
block('n14','n14-lead-05')['parts']=[T('次の例題は、距離に下限がある条件です。境界の位置、残す領域、等号の扱いを順に判断します。'),M(r'|x|\ge4')]
add_before('n14','n14-formula-05',5,'n14-w048-q05-boundaries','距離がちょうど4になる二つの境界を選びましょう。','□',r'x=-4,\quad x=4',[r'x=0,\quad x=4',r'x=-4,\quad x=0',r'x=4,\quad x=8'],'境界では距離がちょうど4になります。N13で求めた左右の位置を使います。','境界の二点が決まりました。次は残す領域を考えます。')
add_before('n14','n14-formula-05',5,'n14-w048-q05-region','元の距離の下限を満たすのは、二点の間と外側のどちらでしょう。','□','二点の外側',['二点の間','右側だけ','左側だけ'],'原点と、境界より遠い位置をそれぞれ条件に当てはめて比べます。','残す領域が決まりました。最後に、元の不等号が境界を含むかを判断します。',action='meaning')
for item in units['n14']['sections'][0]['items']:
 if item['id']=='n14-03':item['hints']=['x=0と境界の外にある点を、元の距離の条件に当てはめます。等号が許されるかも別に確かめます。']
 if item['id']=='n14-05':item['prompt']='求めた境界と領域に、等号の条件を合わせて結果をまとめよう。';item['hints']=['境界では距離がちょうど4です。その値が元の不等号を満たすか確かめます。']
block('n14','n14-marker-3').update(kind='example',text='例題')
f=units['n14']['sections'][0]['readingFlow'];at=next(i for i,x in enumerate(f)if x['id']=='n14-lead-11');f.insert(at,{'id':'n14-w048-check-marker','type':'marker','kind':'check','text':'確認'})
f.extend([
 paragraph('n14-w048-chapter-summary',T('この章では、同じ値や同じ条件を別の形で表してきました。式を整理するときは注目する文字を決め、展開ではすべての積を拾い、因数分解では展開との一致を確かめました。平方根では平方と符号を、絶対値では距離の意味を、不等式では変形に使う数の符号と境界の扱いを確かめました。')),
 paragraph('n14-w048-next-chapter-bridge',T('次の二次関数では、一つの値を変えたときに、もう一つの値がどう変わるかを調べます。この章で使った展開・因数分解・平方根・不等式を、グラフの形や値の範囲を読む道具として使います。'))])

for c,u in units.items():
 old=load('evidence/'+c.upper()+'_CURRENT.json')['unit']['sections'][0]['items'];now={i['id']:i for i in u['sections'][0]['items']}
 for item in old:
  assert item['answer']==now[item['id']]['answer'] and item['choices']==now[item['id']]['choices'],item['id']
 write(c.upper()+'_CANDIDATE.json',{'status':'PROPOSED_ONLY','sourceSHA':'f129ba78e496f0ccbce917c762357a81b92b0a2c','unit':u})
write('ADDED_DECISIONS.json',added)
write('DESIGN_SUMMARY.json',{'status':'DRAFT_REVIEW_PENDING','units':{c:{'fromRevision':load('evidence/'+c.upper()+'_CURRENT.json')['unit']['revision'],'toRevision':u['revision'],'oldAnswers':len(load('evidence/'+c.upper()+'_CURRENT.json')['unit']['sections'][0]['items']),'proposedAnswers':len(u['sections'][0]['items'])}for c,u in units.items()},'oldAnswerAndChoiceKeysPreserved':True,'learnerImplementation':False,'published':False,'newEngine':False,'originalFiguresPreserved':True,'notes':['Candidate JSON is an exact review-only data contract, not a deployed revision.','Existing accepted case derivations and three-sided operations remain intact.','Math templates, schema, source coverage, wrong-only hints, and nonauthor reviews must be checked before proposal acceptance.']})
print(json.dumps(load('DESIGN_SUMMARY.json'),ensure_ascii=False))
