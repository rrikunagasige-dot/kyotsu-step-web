"""六工程の試作コンパイラ。本文の意味の判断と公開承認を自動化しない。"""
import copy
import ast
import hashlib
import html
import json
from pathlib import Path
from math_core import Unsupported, polynomial, same, independent_identity, expression, display, tree

VERSION='0.1.0'
REGISTRY=json.loads(Path(__file__).with_name('patterns.json').read_text())
PATTERNS={name:spec['version'] for name,spec in REGISTRY.items()}
STAGES=['structure','solution','blanks','choices','prose_figures','final']

def digest(value): return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def implementation_hash():
    return digest({name:Path(__file__).with_name(name).read_text() for name in ('engine.py','math_core.py','patterns.json','template.html')})

def design_hash(project):
    p=copy.deepcopy(project); p.pop('semantic_review',None)
    return digest({'engine':VERSION,'project':p})

def require(condition,message):
    if not condition: raise ValueError(message)

def structure(project):
    require(project.get('schema_version')==1,'未対応の入力スキーマ')
    require(project.get('mode') in ('textbook','practice'),'モードが未定義')
    policy=project['policy']; themes=project['themes']; lessons=project['lessons']
    require(len(themes)==policy['major_title_count'],'同格の大見出し数が規則に不一致')
    require([t['title'] for t in themes]==policy['major_titles'],'大見出しの名称または順序が不一致')
    require(bool(lessons),'教材が空')
    ids=[l['id'] for l in lessons]
    require(len(ids)==len(set(ids)),'教材ID重複')
    require(ids==project['scope']['expected_units'],'教材の収録漏れ・余分な教材・順序不一致')
    assigned=[u for t in themes for u in t['units']]
    require(len(assigned)==len(set(assigned)) and set(assigned)==set(ids),'所属の重複・欠落・未知の教材')
    require(assigned==ids,'テーマ内の教材順序不一致')
    require(project['scope']['kind']=='prototype_subset','試作範囲の明示が必要')
    for l in lessons:
        require(bool(l.get('source',{}).get('id')) and bool(l['source'].get('kind')),'元資料の参照がない')
        if l.get('pattern') in PATTERNS:
            require(l.get('pattern_version')==PATTERNS[l['pattern']],'パターン版が未登録')
        require(bool(l.get('original_problem')),'元問題がない')
        require(l.get('prose',{}).get('goal') and l['prose'].get('closing'),'導入の目的／結びがない')
        if project['mode']=='textbook':
            require(l['prose'].get('lead') and l['prose'].get('concept'),'教科書の導入／意味の説明がない')
        else: require(l.get('prerequisite_result_ids') is not None,'練習の依存結果リストがない')
    return {'scope':'試作対象の収録・大見出し・所属・順序。章全体の完成を保証しない'}

def integer_params(values,count):
    if not isinstance(values,list) or len(values)!=count or any(type(v) is not int or abs(v)>100 for v in values):
        raise Unsupported('整数パラメータ±100の登録形だけに対応')
    return values

def step(sid,left,right,reason,purpose,deps=()):
    return dict(id=sid,left=left,right=right,reason=reason,purpose=purpose,depends_on=list(deps),operation_count=1)

def solve(lesson):
    pattern=lesson['pattern']
    if pattern=='distribute_binomials':
        a,b,c,d=integer_params(lesson['params'],4)
        if any(v==0 for v in (a,b,c,d)): raise Unsupported('この初回パターンは非零の四係数を前提とする。退化形は別の型が必要')
        left=f'({a})*x+({b})'; right=f'({c})*x+({d})'
        source=f'({left})*({right})'
        factors=[(f'({a})*x',f'({c})*x'),(f'({a})*x',str(d)),(str(b),f'({c})*x'),(str(b),str(d))]
        products=[f'({u})*({v})' for u,v in factors]
        results=[f'({a*c})*x**2',f'({a*d})*x',f'({b*c})*x',str(b*d)]
        labels=['左のxの項と右のxの項','左のxの項と右の定数項','左の定数項と右のxの項','左右の定数項']
        steps=[step(f'product{i}',products[i],results[i],labels[i]+'を掛ける。','積の計算') for i in range(4)]
        for s,(u,v) in zip(steps,factors):s['left_display']=f'({display(u)}) × ({display(v)})'
        steps.append(step('collect',f'({results[1]})+({results[2]})',f'({a*d+b*c})*x','xの項は、係数を足して一つにまとめる。','同類項の整理',['product1','product2']))
        steps[-1]['left_display']=f'{display(results[1])} + ({display(results[2])})'
        final=expression([b*d,a*d+b*c,a*c])
        visual={'rows':[display(f'({a})*x'),str(b)],'columns':[display(f'({c})*x'),str(d)],
                'cells':[[display(factors[i][0])+' × '+display(factors[i][1]) for i in (0,1)], [display(factors[i][0])+' × '+display(factors[i][1]) for i in (2,3)]]}
        expanded=' + '.join('('+display(u)+' × '+display(v)+')' for u,v in factors)
        return dict(source=source,source_display=f'({display(left)})({display(right)})',steps=steps,final=final,
                    distribution=expanded,figure_data=visual,final_dependencies=[s['id'] for s in steps])
    if pattern=='linear_combination':
        m,n,a,b,c,d=integer_params(lesson['params'],6)
        if any(v==0 for v in (m,n,a,b,c,d)): raise Unsupported('この初回パターンは非零係数を前提とする。退化形は別の型が必要')
        A=f'({a})*x+({b})'; B=f'({c})*x+({d})'; source=f'({m})*({A})+({n})*({B})'
        terms=[f'({m})*(({a})*x)',f'({m})*({b})',f'({n})*(({c})*x)',f'({n})*({d})']
        results=[f'({m*a})*x',str(m*b),f'({n*c})*x',str(n*d)]
        steps=[step(f'product{i}',terms[i],results[i],'括弧の外の数を、この項へ掛ける。','分配後の計算') for i in range(4)]
        multipliers=[m,m,n,n]; items=[f'({a})*x',str(b),f'({c})*x',str(d)]
        for s,k,item in zip(steps,multipliers,items):s['left_display']=f'({k}) × ({display(item)})'
        steps += [step('collect_x',f'({results[0]})+({results[2]})',f'({m*a+n*c})*x','xの項どうしの係数をまとめる。','同類項の整理',['product0','product2']),
                  step('collect_const',f'({results[1]})+({results[3]})',str(m*b+n*d),'定数項どうしをまとめる。','定数項の整理',['product1','product3'])]
        steps[-2]['left_display']=f'{display(results[0])} + ({display(results[2])})'
        steps[-1]['left_display']=f'{display(results[1])} + ({display(results[3])})'
        return dict(source=source,source_display=f'({m})({display(A)}) + ({n})({display(B)})',steps=steps,
                    final=expression([m*b+n*d,m*a+n*c]),distribution=' + '.join(s['left_display'] for s in steps[:4]),figure_data=None,
                    final_dependencies=[s['id'] for s in steps])
    raise Unsupported('解法パターン未登録')

def verify_solution(solution,pattern=None):
    if pattern:
        require([s['id'] for s in solution['steps']]==REGISTRY[pattern]['required_steps'],'登録パターンの必須途中段階が欠落・並べ替えされている')
    require(independent_identity(solution['source'],solution['final']),'原式と結論が一致しない')
    seen=set()
    for s in solution['steps']:
        require(s['depends_on']==list(dict.fromkeys(s['depends_on'])),'依存重複')
        require(set(s['depends_on'])<=seen,'前提の途中結果が後出し')
        require(s['id'] not in seen,'途中式ID重複')
        require(same(s['left'],s['right']) and independent_identity(s['left'],s['right']),'途中計算が成立しない')
        require(bool(s['reason']) and bool(s['purpose']),'変形の理由・学習行為がない')
        seen.add(s['id'])
    require(set(solution['final_dependencies'])==seen,'結論への依存が欠ける')
    return {'proof_domain':'有理係数一変数多項式、次数8以下、定数除算のみ','oracle':'係数演算と、原式へのd+1個の有理数点の直接代入'}

def bind_blanks(lesson,solution):
    targets=lesson.get('blank_targets',[]); steps={s['id']:s for s in solution['steps']}
    require(targets and len(targets)==len(set(targets)),'穴がない／指定が重複')
    bound=[]
    for target in targets:
        require(type(target) is str and target.endswith('.result'),'穴は一つの式の結果へ結ぶ')
        sid=target.removesuffix('.result'); require(sid in steps,'穴の対象が不明')
        s=steps[sid]
        require(s['operation_count']==1,'独立した操作を一つの穴へ束ねている')
        require(s['purpose'] in lesson['allowed_learning_actions'],'穴の学習目的が設計にない')
        bound.append(dict(id=target,step_id=sid,answer=s['right'],purpose=s['purpose'],operation=s['left']))
    return bound

def choices_for(blank):
    answer=blank['answer']; p=polynomial(answer)
    # 誤答候補の出所を保持。正答と一致・他候補と一致する場合は採用しない。
    op=tree(blank['operation']); candidates=[]
    if isinstance(op,ast.BinOp):
        a,b=ast.unparse(op.left),ast.unparse(op.right)
        if isinstance(op.op,ast.Mult):
            candidates=[('multiply_as_addition',f'({a})+({b})'),('multiply_as_subtraction',f'({a})-({b})'),
                        ('omit_right_factor',a),('omit_left_factor',b)]
        elif isinstance(op.op,ast.Add):
            candidates=[('omit_right_term',a),('omit_left_term',b),('reverse_left_sign',f'-({a})+({b})'),('reverse_right_sign',f'({a})-({b})')]
    candidates += [('reverse_result_sign',expression([-c for c in p]))]
    if len(p)>2:candidates.append(('forget_degree',expression([0,p[-1]])))
    selected=[dict(value=answer,misconception=None)]
    for tag,value in candidates:
        if not any(same(value,x['value']) for x in selected): selected.append(dict(value=value,misconception=tag))
        if len(selected)==4: break
    require(len(selected)==4,'異なる誤答候補が不足')
    shift=int(digest(blank['id'])[:2],16)%4
    selected=selected[shift:]+selected[:shift]
    return [dict(id=f'c{i}',text=display(c['value']),value=c['value'],correct=c['misconception'] is None,misconception=c['misconception']) for i,c in enumerate(selected)]

def verify_choices(blank,options):
    require(len(options)==4 and len({o['id'] for o in options})==4,'選択肢の数・IDが不正')
    matches=[same(o['value'],blank['answer']) for o in options]
    require(sum(matches)==1,'正答が複数／存在しない')
    require(all(o['correct']==match for o,match in zip(options,matches)),'正答フラグが数学と不一致')
    for i,o in enumerate(options):
        require(o['text']==display(o['value']),'選択肢の表示と数式が不一致')
        for other in options[i+1:]: require(not same(o['value'],other['value']),'等価な選択肢の重複')
    return {'semantic_review_required':'誤答が学習上意味を持つかは別途審査'}

def verify_prose_figures(lesson,solution):
    figure=lesson.get('figure')
    if figure:
        require(solution['figure_data'] is not None,'このパターンには対応する図がない')
        require(figure.get('kind')=='multiplication_grid','図の種類が未対応')
        for field in ('id','purpose','how_to_read','connects_to','provenance'):
            require(bool(figure.get(field)),'図の役割・読み方・式への接続・由来が不足:'+field)
        require(figure['connects_to']=='distribution','図から式への接続先が未定義')
        require(figure.get('position')=='before_distribution','参照する前に図を置く必要がある')
    return {'structure':'目的・読み方・接続先・表示位置を検査','meaning':'文章と図の理解しやすさは意味の審査が必要'}

def compile_project(project):
    report={'engine_version':VERSION,'implementation_hash':implementation_hash(),'design_hash':design_hash(project),'stages':{},'lessons':[],'release_accepted':False}
    try:
        report['stages']['structure']={'status':'PASS',**structure(project)}
    except (KeyError,ValueError,TypeError) as e:
        report['stages']['structure']={'status':'FAIL','reason':str(e)}; report['status']='FAIL'; return None,report
    output=[]
    for lesson in project['lessons']:
        lr={'id':lesson['id'],'stages':{}}; report['lessons'].append(lr)
        try:
            sol=solve(lesson)
            require(independent_identity(lesson['original_expression'],sol['source']),'原問題とパターンの式が一致しない')
            lr['stages']['solution']={'status':'PASS',**verify_solution(sol,lesson['pattern'])}
            bound=bind_blanks(lesson,sol); lr['stages']['blanks']={'status':'PASS','count':len(bound)}
            options={b['step_id']:choices_for(b) for b in bound}
            for b in bound: verify_choices(b,options[b['step_id']])
            lr['stages']['choices']={'status':'PASS','count':sum(map(len,options.values()))}
            lr['stages']['prose_figures']={'status':'PASS',**verify_prose_figures(lesson,sol)}
            # 完全解法から式を消すのでなく、指定した結果だけを操作へ変換。
            compiled=copy.deepcopy(lesson); compiled['solution']=sol; compiled['choices']=options; compiled['blanks']=bound; compiled['final_display']=display(sol['final'])
            output.append(compiled)
        except Unsupported as e: lr['stages']['current']={'status':'UNVERIFIED','reason':str(e)}
        except (KeyError,ValueError,TypeError) as e: lr['stages']['current']={'status':'FAIL','reason':str(e)}
    statuses=[s['status'] for l in report['lessons'] for s in l['stages'].values()]
    for name in STAGES[1:-1]:
        values=[l['stages'].get(name,{}).get('status','UNVERIFIED') for l in report['lessons']]
        report['stages'][name]={'status':'FAIL' if 'FAIL' in values else 'PASS' if all(v=='PASS' for v in values) else 'UNVERIFIED'}
    review=project.get('semantic_review',{})
    semantic_ok=review.get('design_hash')==report['design_hash'] and all(review.get(k)== 'REVIEWED' for k in ('organization','applicability','learning_actions','distractors','prose_figures','reasoning')) and bool(review.get('notes'))
    report['semantic_review']={'status':'RECORDED_AI_REVIEW' if semantic_ok else 'PENDING','independent_review':False,'user_acceptance':False}
    report['status']='FAIL' if 'FAIL' in statuses else 'UNVERIFIED' if 'UNVERIFIED' in statuses else 'TECHNICAL_PASS' if semantic_ok else 'SEMANTIC_REVIEW_REQUIRED'
    report['stages']['final']={'status':'REVIEW_PENDING','technical':'PASS' if len(output)==len(project['lessons']) else 'INCOMPLETE',
                               'browser':'NOT_RUN','user_gates':'PENDING'}
    result=dict(schema_version=1,mode=project['mode'],themes=project['themes'],scope=project['scope'],lessons=output,design_hash=report['design_hash'],implementation_hash=report['implementation_hash'])
    return result,report

def grid_svg(data):
    esc=html.escape
    labels=[(165,28,data['columns'][0]),(275,28,data['columns'][1]),(42,82,data['rows'][0]),(42,144,data['rows'][1])]
    for r in range(2):
        for c in range(2): labels.append((165+c*110,82+r*62,data['cells'][r][c]))
    text=''.join(f'<text x="{x}" y="{y}" text-anchor="middle" dominant-baseline="middle">{esc(t)}</text>' for x,y,t in labels)
    return '<svg viewBox="0 0 340 185" role="img" aria-label="行の項と列の項を掛ける表"><path d="M95 42H332M95 104H332M95 166H332M95 42V166M220 42V166M332 42V166" fill="none" stroke="#667085"/>'+text+'</svg>'

def render(compiled,template):
    payload=json.dumps(compiled,ensure_ascii=False).replace('<','\\u003c').replace('\u2028','\\u2028').replace('\u2029','\\u2029')
    figures={l['id']:grid_svg(l['solution']['figure_data']) for l in compiled['lessons'] if l.get('figure')}
    return template.replace('__PAYLOAD__',payload).replace('__FIGURES__',json.dumps(figures,ensure_ascii=False).replace('<','\\u003c'))

def run(input_file,output_dir):
    project=json.loads(Path(input_file).read_text()); out=Path(output_dir); out.mkdir(parents=True,exist_ok=True)
    compiled,report=compile_project(project)
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    if compiled and report['status'] in ('TECHNICAL_PASS','SEMANTIC_REVIEW_REQUIRED'):
        (out/'compiled.json').write_text(json.dumps(compiled,ensure_ascii=False,indent=2)+'\n')
        template=Path(__file__).with_name('template.html').read_text()
        (out/'preview.html').write_text(render(compiled,template))
    else:
        for name in ('preview.html','compiled.json'):
            file=out/name
            if file.exists():file.replace(out/(name+'.stale'))
    return report

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser(); parser.add_argument('input'); parser.add_argument('--out',required=True)
    args=parser.parse_args(); print(json.dumps(run(args.input,args.out),ensure_ascii=False,indent=2))
