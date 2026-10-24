"""P-003: explicit local derivation slots and source-backed presentation records.

Called by W029's canonical author, before serialisation. No runtime inference of
pedagogy; this file is the approved next edition of those seven teaching plans.
"""
import copy
import json
import pathlib


def refine(plans):
    root = pathlib.Path(__file__).parent
    ledger = []

    class Author:
        def __init__(self, key):
            self.key = key
            self.plan = plans[key]
            self.flow = self.plan['readingFlow']
            self.owners = {i: q for q, entry in self.plan['sourceCoverage'].items() for i in entry['activeItemIds']}

        def block(self, id):
            return next(b for b in self.flow if b['id'] == id)

        def index(self, id):
            return self.flow.index(self.block(id))

        def after(self, anchor, block):
            self.flow.insert(self.index(anchor) + 1, block)

        def before(self, anchor, block):
            self.flow.insert(self.index(anchor), block)

        def move_after(self, id, anchor):
            b = self.block(id)
            self.flow.remove(b)
            self.after(anchor, b)

        def formula(self, block, stem, id, tail=''):
            b = self.block(block)
            b.update(type='formula', parts=([{'type': 'math', 'latex': stem}] if stem else []) +
                     [{'type': 'choice', 'itemId': id}] + ([{'type': 'math', 'latex': tail}] if tail else []))

        def hole(self, design, name, block, stem, answer, wrong, tail, hint, owner, before=None, after=None, retire=None, kind='formula'):
            id = self.key + '-s5-' + name
            q = {'id': id, 'label': id.upper(), 'prompt': hint, 'answer': answer,
                 'answerType': kind, 'acceptedAnswers': [], 'choices': [answer] + wrong,
                 'purpose': 'causal-reasoning', 'scaffoldLevel': 'medium', 'hints': [hint]}
            self.plan['newItems'].append(q)
            if before or after:
                b = {'id': block, 'type': 'formula', 'parts': []}
                (self.before if before else self.after)(before or after, b)
            self.formula(block, stem, id, tail)
            if kind == 'text':
                self.block(block)['type'] = 'paragraph'
            self.owners[id] = self.key.upper() + '-' + owner
            if retire:
                self.plan['retiredItems'].append(retire)
                for b in self.flow:
                    for part in b.get('parts', []):
                        if part.get('itemId') == retire:
                            part['itemId'] = id
            ledger.append({'unit': self.key, 'design': design, 'itemId': id, 'blockId': block, 'replaces': retire})
            return id

        def existing(self, design, id, block):
            ledger.append({'unit': self.key, 'design': design, 'itemId': id, 'blockId': block, 'replaces': id})

    # N01: keep x/y coefficient meaning, then construct coefficient operations.
    a = Author('n01')
    a.formula('n01-s4-y-reorder', r'5x^3y=(', 'n01-s4-y-coefficient', r')y^1')
    a.block('n01-s4-y-coefficient-formula')['parts'] = [{'type': 'math', 'latex': r'\text{yの係数}=5x^3'}]
    a.existing('D01', 'n01-s4-y-coefficient', 'n01-s4-y-reorder')
    for design, name, block, stem, ans, wrong, tail, hint, owner in [
        ('D02','square-regroup','n01-s4-square-factor',r'3x^2-5x^2=(', '3-5',['3+5',r'3\times5'],r')x^2','3倍のx²から5倍のx²を引きます。','Q07'),
        ('D03','linear-regroup','n01-s4-linear-factor',r'-5x+2x=(', '-5+2',['-5-2','5+2'],')x','二つの項の係数を、符号ごと括弧へ入れます。','Q07'),
        ('D04','example-linear-regroup','n01-r3-linear-factor',r'1x+3x=(', '1+3',[r'1\times3','1-3'],')x','同じxの個数を合わせます。','Q09'),
        ('D05','example-cubic-regroup','n01-r3-cubic-factor',r'1x^3-1x^3=(', '1-1',['1+1',r'1\times1'],r')x^3','前の項から後ろの項を引くので、係数も同じ引き算にします。','Q09'),
    ]:
        a.hole(design,name,block,stem,ans,wrong,tail,hint,owner)

    # N02: classification, distribution, and using completed polynomial records.
    a = Author('n02')
    a.hole('D01','classify-linear','n02-bridge-worked-n02-04-before-0-equation-0',r'x^2+2xy+y^2-3x-3y+2=x^2+(',r'2xy-3x',[r'2xy-3y',r'2xy+3x'],r')+(y^2-3y+2)','xを一つ含む項だけを選びます。','Q04')
    a.hole('D02','sum-square-regroup','n02-s5-sum-square-regroup-formula',r'-3x^2+2x^2=(', '-3+2',['-3-2','3+2'],r')x^2','Aの−3とBの+2を、そのまま足します。','Q06',before='n02-bridge-audit-sum-square-lead')
    a.move_after('n02-s4-sum-regroup', 'n02-bridge-audit-sum-constant-formula')
    a.move_after('paragraph-sum-coeff', 'n02-s4-sum-regroup')
    a.hole('D03','minus-distribute','n02-s5-minus-distribute-formula',r'-B=(-1)(-x^3+2x^2+2)=',r'(-1)(-x^3)+(-1)(2x^2)+(-1)2',[r'(-1)(-x^3)+2x^2+2',r'(-1)(-x^3)+(-1)(2x^2)+2'],'','三つの項すべてに−1を掛けます。','Q07',before='n02-bridge-audit-minus-cube-sign-lead')
    a.hole('D04','minus-three-square-distribute','n02-s5-minus-three-square-distribute-formula','',r'(-3)(2x^2)',[r'3(2x^2)',r'(-3)(-2x^2)'],'','倍率は−3、Bの二次項は+2x²です。二次項への掛け算を作ります。','Q09',before='n02-bridge-minus-square-lead')
    a.move_after('n02-s4-multiple-align','n02-bridge-constant-sum-formula')
    a.existing('D05','n02-bridge-like-square','n02-bridge-like-square-formula')
    a.hole('D06','group-a-coefficients','n02-s5-group-a-coefficients-formula',r'3A-A=(', '3-1',['3+1',r'3\times1'],')A','Aは1Aと読めます。','Q11',before='n02-bridge-audit-a-coefficient-lead')
    a.move_after('n02-bridge-group-coefficients-formula','n02-bridge-audit-b-coefficient-formula')

    # N03: exponent counts and selecting the actual like terms before arithmetic.
    a = Author('n03')
    a.block('n03-bridge-worked-n03-bridge-x-power-before-0-equation-0')['parts'] = [{'type':'math','latex':r'(x^3)^3=x^3x^3x^3'}]
    a.hole('D01','cube-x-count','n03-s5-cube-x-count-formula',r'\text{xの個数を表す式：}', '3+3+3',['3+3',r'3^3'],'','各組にxが3個ずつあります。','Q06',before='n03-bridge-x-power-formula')
    a.move_after('n03-bridge-worked-n03-12-before-0-equation-0','formula-n03-12')
    a.existing('D02','n03-12','formula-n03-12')
    a.hole('D03','minus-row-distribute','n03-s5-minus-row-distribute-formula',r'-(2x^2-x+5)=(-1)(2x^2)+',r'(-1)(-x)',[r'(-1)x',r'-x^2'],r'+(-1)5','括弧の中央の項は、符号を含めて−xです。','Q13',before='n03-bridge-worked-n03-bridge-second-row-before-0-lead')
    a.hole('D04','collect-square-terms','n03-s5-collect-square-terms-formula',r'\text{二次の項：}',r'-3x^2-2x^2',[r'-3x^2+2x^2',r'-3x^2+x'],'','両方とも文字の部分がx²の項を選びます。','Q13',before='n03-bridge-collect-square-lead')
    a.hole('D05','collect-linear-terms','n03-s5-collect-linear-terms-formula',r'\text{一次の項：}','15x+x',['15x-x','15x-5'],'','文字の部分がxの二項です。','Q13',before='n03-bridge-collect-linear-lead')
    a.move_after('n03-s4-six-products','n03-bridge-collect-linear-formula')

    # N04: formula substitution is an operation before numerical evaluation.
    a = Author('n04')
    a.hole('D01','cross-regroup','n04-bridge-worked-n04-02-before-0-equation-0',r'20xy+20xy=(', '20+20',[r'20\times20','20-20'],')xy','同じxyの係数を足します。','Q02')
    a.hole('D02','product-substitute','n04-s4-product-substitute',r'(3x-2)(3x+2)=',r'(3x)^2-2^2',[r'(3x)^2+2^2',r'3x^2-2^2'],'','共通する3x全体を二乗します。','Q10')
    a.block('n04-s4-three-source')['parts'] = [{'type':'math','latex':'T=a+b'}]
    a.hole('D03','three-substitute','n04-s5-three-substitute-formula',r'(a+b+c)^2=',r'(T+c)^2',[r'T^2+c^2',r'(T+c^2)^2'],'','a+bだけをTと呼び、cと外の二乗は残します。','Q14',after='n04-s4-three-source')
    a.hole('D04','negative-c-substitute','n04-bridge-worked-n04-16-before-0-equation-0',r'(a+b-c)^2=a^2+b^2+(-c)^2+2ab+2a(',r'-c',['c','-2c'],r')+2b(-c)','cを−cへ置き換えます。外の2aは変えません。','Q16')
    a.move_after('n04-bridge-worked-n04-17-after-0-equation-0','n04-s4-opposite-part-formula')
    a.move_after('n04-bridge-worked-n04-17-after-0-equation-1','n04-bridge-worked-n04-17-after-0-equation-0')
    a.existing('D05','n04-s4-shared-part','n04-s4-shared-part-formula')
    # The lead's explicit completed equation is preserved after its new decision.
    a.hole('D06','four-substitute','n04-s5-four-substitute-formula',r'(x^2+5x+4)(x^2+5x+6)=',r'(T+4)(T+6)',[r'(T+4)(T+4)',r'(T+4)(6T)'],'','Tの外に残る定数は、それぞれ4と6です。','Q21',before='n04-lead-21')
    # Put the existing definition first; omit only the appended concrete answer
    # until the following original lead (all original text retained there).
    a.before('n04-s5-four-substitute-formula',{'id':'n04-s5-four-definition','type':'formula','parts':[{'type':'math','latex':r'T=x^2+5x'}]})
    a.hole('D07','four-restore-square','n04-s5-four-restore-square-formula',r'T^2=',r'(x^2+5x)^2',[r'x^4+25x^2',r'x^4+5x^2'],'','Tという一つのまとまりを、括弧ごと戻します。','Q22',before='n04-lead-22')
    # Anchors must still be the start of their existing stages.
    a.plan['stages']=[('n04-s5-four-definition',label) if id=='n04-lead-21' else ('n04-s5-four-restore-square-formula',label) if id=='n04-lead-22' else (id,label) for id,label in a.plan['stages']]

    # N05: replace three answer-reading decisions with coefficient correspondence.
    a=Author('n05')
    a.hole('D01','reverse-difference','n05-formula-04','b-a=',r'-(a-b)',['a-b',r'-(a+b)'],'','候補の括弧へ−1を配り、b−aに戻るか確かめます。','Q04')
    a.move_after('n05-bridge-worked-n05-04-after-0-equation-0','n05-formula-04')
    a.hole('D02','sum-condition-map','n05-s4-factor-sum-formula','', 'r+s',['rs','r-s'],'=-6','展開したaの一次係数に当たる式を入れます。aに掛かる括弧の中を読みます。','Q10',retire='n05-s4-factor-sum')
    a.hole('D03','general-cross-regroup','n05-bridge-worked-n05-12-before-1-equation-1',r'psx+qrx=(', 'ps+qr',['pq+rs','ps-qr'],')x','共通のxを一つ外へ出します。','Q12')
    a.hole('D04','linear-condition-map','n05-s4-linear-condition-formula','', 'ps+qr',['pr+qs','ps-qr'],'=7','xの一次係数を比べます。二次や定数の積と区別します。','Q13',retire='n05-s4-linear-condition')
    a.hole('D05','last-linear-regroup','n05-bridge-worked-n05-16-before-1-equation-0',r'sx+5rx=(', 's+5r',['r+5s','s-5r'],')x','sxと5rxのそれぞれからxを外へ出します。','Q16')
    a.move_after('n05-bridge-worked-n05-16-before-1-lead','n05-bridge-worked-n05-16-before-1-equation-0')
    a.hole('D06','last-condition-map','n05-s4-last-linear-condition-formula','', 's+5r',['r+s','r+5s'],'=-2','直前の展開でxの前にある式を使います。','Q16',retire='n05-s4-last-linear-condition')
    a.hole('D07','square-difference-rewrite','n05-bridge-worked-n05-bridge-audit-square-root-four-after-0-equation-0',r'a^2-4b^2=a^2-',r'(2b)^2',[r'(4b)^2',r'2b^2'],'','二乗すると4b²になるまとまりを使います。','Q20')

    # N06: classify before factoring; compare sum and product at the right time.
    a=Author('n06')
    a.block('n06-formula-01')['parts']=[{'type':'math','latex':r'X=x+2y'}]
    a.hole('D01','substitute-whole','n06-s5-substitute-whole-formula',r'(x+2y+1)(x+2y-2)-4=',r'(X+1)(X-2)-4',[r'(X+1)(X-2)',r'(X+1)(X+2)-4'],'','同じx+2yだけをXへ置き換えます。','Q01',after='n06-formula-01')
    a.hole('D02','classify-y','n06-bridge-worked-n06-09-before-0-equation-0',r'x^3+x^2y+x^2+xy-2x-2y=(',r'x^2y+xy-2y',[r'x^2y+xy-2x',r'x^2y-xy-2y'],r')+(x^3+x^2-2x)','各項にyが含まれるかを一つずつ見ます。','Q09')
    a.move_after('n06-bridge-worked-n06-11-after-0-equation-0','n06-formula-11')
    a.existing('D03','n06-11','n06-formula-11')
    a.hole('D04','classify-x','n06-bridge-worked-n06-13-before-0-equation-0',r'x^2+3xy+2y^2-x-3y-2=x^2+(',r'3xy-x',[r'3xy-3y',r'3xy+x'],r')+(2y^2-3y-2)','xを一つ含む二項を、前の符号と一緒に選びます。','Q13')
    a.hole('D05','constant-linear-condition','n06-bridge-worked-n06-14-before-1-equation-0','',r'2s+r',['2r+s','r+s'],'=-3','2yとs、rとyの交差積を足します。','Q14')
    a.hole('D06','factor-sum-target','n06-s4-sum-match-formula','', 'xの一次係数',['xの定数部分','x²の係数'],'','(x+U)(x+V)の展開でU+Vが掛かる場所を見ます。','Q15',retire='n06-s4-sum-match',kind='text')
    a.hole('D07','restore-coefficient-sum','n06-bridge-worked-n06-16-before-0-equation-0',r'x^2+(3y-1)x+(2y^2-3y-2)=x^2+(',r'(2y+1)+(y-2)',[r'(2y+1)(y-2)',r'(2y+1)-(y-2)'],r')x+(2y+1)(y-2)','xの前は和、最後の部分は積に対応します。','Q16')

    # NE01: local grouping before coefficient arithmetic; split final substitution.
    a=Author('ne01')
    a.hole('D01','cube-as-square','ne01-bridge-worked-ne01-01-before-0-equation-0',r'(x+3)^3=(x+3)',r'(x+3)^2',[r'(x^2+9)',r'(x+3)'],'','残りは同じ因子を二つ掛けたものです。','Q01')
    a.hole('D02','concrete-second-distribute','ne01-before-02-1',r'(x+3)(x^2+6x+9)=x(x^2+6x+9)+',r'3(x^2+6x+9)',[r'3(x^2+6x)','3'],'','xのときと同じ括弧全体を残します。','Q02')
    a.hole('D03','concrete-square-terms','ne01-s5-concrete-square-terms-formula',r'\text{二次の項：}',r'6x^2+3x^2',[r'6x^2+18x',r'6x^2-3x^2'],'','文字の部分がx²の二項です。','Q02',before='ne01-bridge-audit-collect-square-lead')
    a.hole('D04','general-a2b-terms','ne01-s5-general-a2b-terms-formula',r'a^2b\text{の項：}',r'2a^2b+a^2b',[r'2a^2b+ab^2',r'2a^2b-a^2b'],'','aもbも、それぞれの指数まで一致する項を選びます。','Q05',before='ne01-bridge-audit-general-first-middle-lead')
    a.hole('D05','general-ab2-terms','ne01-s5-general-ab2-terms-formula',r'ab^2\text{の項：}',r'ab^2+2ab^2',[r'ab^2+2a^2b',r'ab^2-2ab^2'],'','今度はaが一つ、bが二つの項です。','Q05',before='ne01-bridge-audit-general-second-middle-lead')
    a.move_after('ne01-bridge-explain-ne01-04-after','ne01-bridge-audit-general-second-middle-formula')
    a.hole('D06','factor-common-remainder','ne01-formula-09',r'a^3+b^3=(a+b)(',r'(a+b)^2-3ab',[r'(a+b)^2+3ab',r'(a+b)-3ab'],')','最初の項からは(a+b)²、後ろの項からは−3abが残ります。','Q09',retire='ne01-09')
    a.hole('D07','difference-substitute','ne01-s4-first-factor-insert',r'x^3-1=(x-1)(',r'x^2+x\cdot1+1^2',[r'x^2-x\cdot1+1^2',r'x^2+x\cdot1-1^2'],')','差の因数分解では、二次因子の中央はプラスです。','Q12')
    a.hole('D08a','sum-linear-factor','ne01-s5-sum-linear-factor-formula',r'a+b=',r'2x+3y',[r'2x-3y',r'8x+27y'],'','二つの三乗の底を、そのまま足します。','Q13',before='ne01-bridge-factor-sum-substitute-formula')
    a.hole('D08b','sum-quadratic-substitute','ne01-bridge-factor-sum-substitute-formula',r'8x^3+27y^3=(2x+3y)(',r'(2x)^2-(2x)(3y)+(3y)^2',[r'(2x)^2+(2x)(3y)+(3y)^2',r'2x^2-(2x)(3y)+3y^2'],')','二次因子にも2xと3yを括弧ごと代入します。','Q13',retire='ne01-bridge-factor-sum-substitute')

    # Keep source coverage exhaustive, including replacement of earlier S4 nodes.
    for key, plan in plans.items():
        active=[p['itemId'] for b in plan['readingFlow'] for p in b.get('parts',[]) if p['type']=='choice']
        assert len(active)==len(set(active)), key
        # Each ledger slot declares its mother-question above via Author.owners;
        # retain these declarations independently from author object lifetime.
        for q,c in plan['sourceCoverage'].items():
            c['activeItemIds']=[i for i in c['activeItemIds'] if i in active]
        plan['itemPrompts']={id:text for id,text in plan['itemPrompts'].items() if id in active}
        plan['editionIncrement']=2
        first = next((q for q in plan['newItems'] if q['id'] == active[0]), None)
        if first: first['scaffoldLevel'] = 'strong'
        # Rebuild chain identity after the two new stage anchors and moved blocks.
        anchors={id for id,_ in plan['stages']}
        chain=0
        for b in plan['readingFlow']:
            if b['id'] in anchors:chain+=1
            if b['type'] in ['paragraph','formula','note']:b['derivationId']=key+'-s5-stage-'+str(chain)
        plan['alignedFormulaBlockIds']=[b['id'] for b in plan['readingFlow'] if b['type']=='formula' and not any(p.get('type')=='math' and '\\begin' in p.get('latex','') for p in b.get('parts',[]))]

    # Source ownership for all new/replacement decisions, independently audited by ID.
    owners={
      'n01':['Q04','Q07','Q07','Q09','Q09'],
      'n02':['Q04','Q06','Q07','Q09','Q10','Q11'],
      'n03':['Q06','Q12','Q13','Q13','Q13'],
      'n04':['Q02','Q10','Q14','Q16','Q17','Q21','Q22'],
      'n05':['Q04','Q10','Q12','Q13','Q16','Q16','Q20'],
      'n06':['Q01','Q09','Q11','Q13','Q14','Q15','Q16'],
      'ne01':['Q01','Q02','Q02','Q05','Q05','Q09','Q12','Q13','Q13'],
    }
    for key,questions in owners.items():
        entries=[e for e in ledger if e['unit']==key]
        assert len(entries)==len(questions)
        for entry,q in zip(entries,questions):
            coverage=plans[key]['sourceCoverage'][key.upper()+'-'+q]
            if entry['itemId'] not in coverage['activeItemIds']:coverage['activeItemIds'].append(entry['itemId'])
    for key,p in plans.items():
        active=[part['itemId'] for b in p['readingFlow'] for part in b.get('parts',[]) if part['type']=='choice']
        allids=[i for c in p['sourceCoverage'].values() for i in c['activeItemIds']]
        assert sorted(active)==sorted(allids),(key,set(active)-set(allids))
        assert set(p['retiredItems']).isdisjoint(active)
    assert sum(len(c['activeItemIds']) for p in plans.values() for c in p['sourceCoverage'].values())==291
    (root/'IMPLEMENTATION_LEDGER.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')

    presentation(plans)
    # Explicit narrow-screen break positions, after complete terms/factors.
    compact = {
      'n02': {'n02-bridge-worked-n02-04-before-0-equation-0':3,'formula-n02-04':3},
      'n06': {'n06-bridge-worked-n06-09-before-0-equation-0':3,'n06-formula-09':3,'n06-bridge-worked-n06-13-before-0-equation-0':3,'n06-formula-13':3,'n06-s4-final-source':3},
      'n04': {'n04-formula-20':2,'n04-s4-four-result':2},
    }
    for key,p in plans.items():
        p['formulaLayouts']={id:{'mobileBreaks':[{'row':0,'chunk':chunk}]} for id,chunk in compact.get(key,{}).items()}
    plans['ne01']['formulaLayouts']['ne01-bridge-factor-sum-substitute-formula']={'continueOuterFactor':True}
    # P-004 user addition: unit-local, source-ID-backed equation labels. A
    # multi-line equality receives one label; ordinary tables are not equations.
    for key,p in plans.items():
        formulas=[b for b in p['readingFlow'] if b['type']=='formula'
                  and any(part['type'] in ['math','choice'] for part in b['parts'])
                  and not any('\\begin{array}' in part.get('latex','') for part in b['parts'])]
        p['equationNumbers']={b['id']:i+1 for i,b in enumerate(formulas)}
    for row,source in enumerate(['formula-n03-02','formula-n03-03','formula-n03-04']):
        plans['n03']['equationNumbers']['n03-s4-rules-summary#'+str(row)]=plans['n03']['equationNumbers'][source]


def presentation(plans):
    """Explicit stage records (71) and per-question prerequisite recipes."""
    records={
      'n01':[
        ['n01-r3-negative-coefficient-formula','n01-r3-negative-degree-formula','n01-r3-square-coefficient-formula','n01-r3-square-degree-formula','n01-r3-product-coefficient-formula','n01-r3-product-degree-formula'],
        ['formula-n01-03','n01-s4-y-result'],['n01-s4-axy-x-formula','n01-s4-axy-y-formula'],['formula-like-original'],
        ['n01-s4-square-result'],['n01-s4-linear-result'],['n01-s4-constant-result'],['formula-n01-07'],['formula-cancellation-original'],
        ['n01-r3-linear-result'],['n01-r3-quadratic-result'],['n01-r3-cubic-result'],['n01-r3-constant-result'],['n01-r3-final-equation'],['paragraph-n01-10a','paragraph-n01-10b']],
      'n02':[['formula-n02-02'],['formula-n02-03','formula-n02-04'],['formula-n02-06'],['formula-n02-07'],['formula-n02-08'],['n02-s4-twice-result'],['formula-n02-09'],['formula-n02-10'],['formula-n02-11','formula-n02-12']],
      'n03':[['n03-s4-rules-summary'],['formula-n03-06'],['formula-n03-08'],['formula-n03-11'],['formula-n03-12'],['n03-bridge-first-row-formula'],['n03-bridge-second-row-formula','formula-n03-13']],
      'n04':[['formula-n04-q01-complete'],['n04-formula-03','n04-formula-05'],['n04-formula-07'],['n04-formula-08'],['n04-s4-square-result'],['n04-s4-product-result'],['n04-formula-12','n04-formula-13'],['n04-formula-15','n04-formula-16'],['n04-formula-19'],['n04-bridge-pair-first-formula','n04-bridge-pair-second-formula'],['n04-s5-four-definition','n04-formula-21'],['n04-s4-four-result']],
      'n05':[['n05-formula-02','n05-formula-03'],['n05-formula-04','n05-formula-05'],['n05-formula-08'],['n05-formula-10','n05-formula-11'],['n05-formula-12','n05-formula-13'],['n05-formula-14','n05-formula-15'],['n05-formula-16','n05-formula-17'],['n05-formula-18'],['n05-s4-final-source']],
      'n06':[['n06-formula-01','n06-formula-02'],['n06-formula-03','n06-formula-04'],['n06-formula-05','n06-formula-06'],['n06-formula-07'],['n06-formula-08'],['n06-formula-09','n06-formula-10'],['n06-formula-11','n06-formula-12'],['n06-formula-13'],['n06-formula-14'],['n06-formula-15','n06-s4-final-source']],
      'ne01':[['ne01-bridge-worked-ne01-01-before-1-equation-0','ne01-formula-01'],['ne01-bridge-concrete-first-formula','ne01-bridge-concrete-second-formula','ne01-formula-02'],['ne01-formula-05'],['ne01-formula-06'],['ne01-formula-07'],['ne01-formula-10'],['ne01-formula-11'],['ne01-bridge-factor-difference-formula'],['ne01-s4-second-factor-result']],
    }
    stage_contexts={
      'n01':[[],[],[],[],['formula-like-original'],['formula-like-original'],['formula-like-original'],['n01-s4-square-result','n01-s4-linear-result','n01-s4-constant-result'],[],['formula-cancellation-original'],['formula-cancellation-original'],['formula-cancellation-original'],['formula-cancellation-original'],['n01-r3-cubic-result','n01-r3-quadratic-result','n01-r3-linear-result','n01-r3-constant-result'],['n01-r3-final-equation']],
      'n02':[[],[],['formula-ab-definition'],['formula-ab-definition#1'],['formula-ab-definition#0','formula-n02-07'],['formula-ab-definition#0'],['formula-ab-definition#1'],['n02-s4-twice-result','formula-n02-09'],[]],
      'n03':[[],[],[],[],[],['formula-n03-12'],['formula-n03-12']],
      'n04':[[],['formula-n04-q01-complete'],['n04-formula-05'],['n04-formula-05'],['n04-formula-07'],['n04-formula-08'],[],['n04-formula-05'],[],[],['n04-formula-20'],['n04-s5-four-definition','n04-formula-21']],
      'n05':[[],[],[],[],[],['n05-formula-13'],[],['n05-formula-16'],[]],
      'n06':[[],['n06-formula-02'],[],['n06-formula-06'],[],['n06-lead-08'],['n06-formula-09','n06-formula-10'],[],['n06-formula-13'],['n06-formula-14']],
      'ne01':[[],['ne01-formula-01'],[],['ne01-formula-05'],['ne01-formula-06'],['ne01-formula-05'],['ne01-formula-10'],['ne01-formula-11'],[]],
    }
    for key,plan in plans.items():
        flow=plan['readingFlow']; index={b['id']:i for i,b in enumerate(flow)}
        starts=[index[a] for a,_ in plan['stages']]+[len(flow)]
        assert len(records[key])==len(plan['stages'])==len(stage_contexts[key])
        plan['resultBlockIdsByStage']={a:records[key][i] for i,(a,_) in enumerate(plan['stages'])}
        plan['contextBlockIdsByItem']={}
        for i,(a,_) in enumerate(plan['stages']):
            for b in flow[starts[i]:starts[i+1]]:
                for part in b.get('parts',[]):
                    if part['type']=='choice':plan['contextBlockIdsByItem'][part['itemId']]=stage_contexts[key][i][:]
        def context(ids,refs):
            for id in ids:
                assert id in plan['contextBlockIdsByItem'],(key,id)
                plan['contextBlockIdsByItem'][id]=refs
        if key=='n02':
            context(['n02-s4-reuse-linear'],['formula-n02-03'])
            context(['n02-12'],['formula-n02-10','formula-n02-11'])
        if key=='n03':
            context(['n03-05'],['n03-s4-rules-summary#2'])
            context(['n03-s5-cube-x-count','n03-bridge-x-power','n03-bridge-detail-y-power'],['n03-s4-rules-summary#1'])
            context(['n03-bridge-audit-product-fourth','n03-s4-product-exponent','n03-bridge-audit-product-negative'],['n03-s4-rules-summary#0'])
            context(['n03-s5-collect-square-terms','n03-bridge-collect-square','n03-s5-collect-linear-terms','n03-bridge-collect-linear','n03-13'],['n03-bridge-first-row-formula','n03-bridge-second-row-formula'])
        if key=='n04':
            context(['n04-bridge-restore-t'],['n04-s4-three-source','n04-formula-14'])
            context(['n04-bridge-expand-restored','n04-15'],['n04-s4-three-source','n04-formula-05'])
            context(['n04-s5-negative-c-substitute','n04-bridge-audit-minus-ac','n04-bridge-audit-minus-bc','n04-16'],['n04-formula-15'])
            context(['n04-18'],['n04-formula-17','n04-formula-08'])
            context(['n04-19','n04-bridge-audit-remaining-square'],['n04-formula-18'])
        if key=='n05':
            context(['n05-05'],['n05-formula-04'])
            context(['n05-bridge-factor-candidates-1','n05-bridge-factor-candidates-2','n05-bridge-factor-candidates-3','n05-bridge-audit-factor-pair-select','n05-11'],['n05-formula-10'])
            context(['n05-s5-sum-condition-map','n05-s4-factor-product'],['n05-formula-09'])
            context(['n05-s4-quadratic-condition','n05-s4-constant-condition','n05-s5-linear-condition-map'],['n05-formula-12'])
            context(['n05-s5-last-condition-map','n05-s4-last-constant-condition'],['n05-bridge-worked-n05-16-before-2-equation-0'])
        if key=='n06':
            context(['n06-bridge-audit-restore-x-first','n06-bridge-audit-restore-x-second','n06-04'],['n06-formula-01','n06-formula-03'])
            context(['n06-bridge-detail-restore-first','n06-bridge-detail-restore-second','n06-06'],['n06-formula-05','n06-bridge-t-factor-formula'])
            context(['n06-bridge-audit-constant-pair'],['n06-bridge-worked-n06-14-before-1-equation-0','n06-bridge-worked-n06-14-before-1-equation-1'])
            context(['n06-s5-factor-sum-target'],['n06-s4-factor-sum','n06-formula-13','n06-s4-factor-rule'])
            context(['n06-s5-restore-coefficient-sum','n06-16'],['n06-formula-14','n06-formula-15','n06-s4-factor-rule'])
        if key=='ne01':
            context(['ne01-s5-concrete-square-terms','ne01-bridge-audit-collect-square','ne01-bridge-audit-collect-linear','ne01-02'],['ne01-bridge-concrete-first-formula','ne01-bridge-concrete-second-formula'])
            context(['ne01-s5-general-a2b-terms','ne01-bridge-audit-general-first-middle','ne01-s5-general-ab2-terms','ne01-bridge-audit-general-second-middle','ne01-05'],['ne01-formula-04'])
            context(['ne01-s5-factor-common-remainder'],['ne01-bridge-worked-ne01-09-before-1-equation-0'])
            context(['ne01-bridge-audit-cube-factor-middle','ne01-10'],['ne01-formula-09'])
            context(['ne01-s4-sum-rule','ne01-s5-sum-linear-factor','ne01-s5-sum-quadratic-substitute','ne01-bridge-audit-cube-factor-square-a','ne01-bridge-audit-cube-factor-product','ne01-bridge-audit-cube-factor-square-b'],['ne01-formula-10','ne01-s4-second-factor-rewrite'])
        positions={part['itemId']:index[b['id']] for b in flow for part in b.get('parts',[]) if part['type']=='choice'}
        for id,refs in plan['contextBlockIdsByItem'].items():
            for ref in refs:assert index[ref.split('#')[0]]<positions[id],(key,id,ref)
        for i,(a,_) in enumerate(plan['stages']):
            for ref in plan['resultBlockIdsByStage'][a]:assert starts[i]<=index[ref]<starts[i+1],(key,a,ref)
