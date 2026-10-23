"""既知の指摘の構造化再現と追加合成試験。独立した教育効果の測定ではない。"""
import copy,json,random,time
from pathlib import Path
from engine import compile_project,solve,verify_solution,bind_blanks,verify_choices,choices_for
from make_examples import lesson,project,review

ROOT=Path(__file__).resolve().parent

def base():return review(project([lesson('case','distribute_binomials',[3,1,1,2],'展開',True)]))

def checked(fn):
    try:fn();return 'PASS'
    except (ValueError,TypeError,KeyError):return 'FAIL'

def main():
    start=time.perf_counter(); known=[]
    p=base();p['themes'].append({'title':'参考・発展','units':[]})
    known.append(dict(id='N01',status=compile_project(p)[1]['status'],method='大見出し4つの入力を再現'))
    p=base();s=solve(p['lessons'][0]);s['steps'].pop(1)
    known.append(dict(id='N02',status=checked(lambda:verify_solution(s,'distribute_binomials')),method='計算段階の欠落を登録パターンで再現。元のA/B式全体の移植ではない'))
    p=base();p['lessons'][0]['pattern']='binomial_times_trinomial'
    known.append(dict(id='N03',status=compile_project(p)[1]['status'],method='三項式を含む積は未登録'))
    p=base();p['lessons'][0]['figure']['how_to_read']=''
    known.append(dict(id='N04',status=compile_project(p)[1]['status'],method='図の読み方メタデータ欠落。説明の意味の良否は別'))
    p=base();s=solve(p['lessons'][0]);s['steps']=s['steps'][-1:]
    known.append(dict(id='N05',status=checked(lambda:verify_solution(s,'distribute_binomials')),method='積と整理の一括提示に相当する段階欠落の再現'))
    p=base();p.pop('semantic_review')
    known.append(dict(id='N06',status=compile_project(p)[1]['status'],method='目的が分からない操作は意味の審査へ。自動判定していない'))
    p=base();p['lessons'][0]['blank_targets']=[['product1.result','product2.result','collect.result']]
    known.append(dict(id='N07',status=compile_project(p)[1]['status'],method='三操作を一つの穴へ束ねる入力を拒否'))
    p=base();p['lessons'][0]['pattern']='substitution_and_expand'
    known.append(dict(id='N08',status=compile_project(p)[1]['status'],method='置換を含む導出は未登録'))
    p=base();p['lessons'][0]['prose']['lead']='次。次。次。'
    known.append(dict(id='N09',status=compile_project(p)[1]['status'],method='本文変更で意味の審査を無効化。断片的文章の意味は自動検出していない'))
    p=base();p['lessons'][0]['pattern']='four_factors'
    known.append(dict(id='N10',status=compile_project(p)[1]['status'],method='四因子の組合せは未登録'))
    expected=['FAIL','FAIL','UNVERIFIED','FAIL','FAIL','SEMANTIC_REVIEW_REQUIRED','FAIL','UNVERIFIED','SEMANTIC_REVIEW_REQUIRED','UNVERIFIED']
    assert [x['status'] for x in known]==expected

    rng=random.Random(20261023); additional=[]
    for i in range(120):
        if i%2==0:
            pms=[rng.choice([-5,-3,-2,-1,1,2,3,5]),rng.choice([-5,-3,-1,1,3,5]),rng.choice([-4,-2,-1,1,2,4]),rng.choice([-5,-3,-1,1,3,5])]
            pat='distribute_binomials'
        else:pms=[rng.choice([-5,-3,-2,-1,1,2,3,5]) for _ in range(6)];pat='linear_combination'
        l=lesson('extra'+str(i),pat,pms,'追加合成試験');p=project([l]);_,r=compile_project(p)
        additional.append(dict(id=l['id'],pattern=pat,params=pms,technical=r['stages']['final']['technical'],semantic=r['semantic_review']['status']))
        assert r['stages']['final']['technical']=='PASS',(i,pms,r)
        assert r['status']=='SEMANTIC_REVIEW_REQUIRED'

    # 追加の不具合は生成器から独立に注入し、数学・依存・解答表示を壊す。
    corruptions=[]
    for i in range(20):
        l=lesson('broken'+str(i),'distribute_binomials',[i+1,-2,2,3],'改変試験')
        s=solve(l);s['steps'][0]['right']=f'({s["steps"][0]["right"]})+1'
        status=checked(lambda:verify_solution(s,'distribute_binomials'))
        corruptions.append(dict(id=i,defect='途中式に+1',status=status));assert status=='FAIL'
    results=dict(known_issue_representations=known,additional_synthetic_cases=additional,corruptions=corruptions,
                 summary={'known_structural_rejections':5,'known_unsupported':3,'known_semantic_review_required':2,
                          'additional_math_cases':120,'additional_technical_pass':120,'injected_math_defects_rejected':20,
                          'positive_training_cases_used':0,'training_run':False,'heldout':False,
                          'education_effect_measured':False,'elapsed_seconds':round(time.perf_counter()-start,3)},
                 limitations=['画像や旧アプリを自動解析した結果ではなく、指摘内容を構造化した再現試験。',
                              '追加問題は合成した技術試験であり、独立した未使用教材の品質評価ではない。',
                              '単一AIによる設計と意味の審査。独立横断監査・ユーザー受入は未完。'])
    (ROOT/'evaluation.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(results['summary'],ensure_ascii=False,indent=2))

if __name__=='__main__':main()
