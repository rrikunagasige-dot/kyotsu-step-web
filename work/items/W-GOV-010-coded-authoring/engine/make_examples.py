"""試作入力。既存の公開教材や確認待ちの正例を置き換えない。"""
import json
from pathlib import Path
from engine import design_hash,solve
from math_core import display

ROOT=Path(__file__).resolve().parent

def lesson(lid,pattern,params,title,figure=False):
    item=dict(id=lid,title=title,pattern=pattern,pattern_version=1,params=params,
              source={'kind':'prototype_authored','id':'W-GOV-010/'+lid},original_problem='次の式を展開し、同類項をまとめよう。',
              allowed_learning_actions=['積の計算','同類項の整理','分配後の計算','定数項の整理'],prerequisite_result_ids=[],
              prose={'lead':'括弧どうしの積では、一方の各項を、もう一方の各項へ掛ける。まず、どの項どうしを掛けるかを並べてみよう。',
                     'concept':'分配法則を使うと、項を掛ける段階と、同じ種類の項をまとめる段階を分けて考えられる。',
                     'goal':'各項の積を計算してから、同じxの項をまとめる。途中の結果を使い、最後に元の式全体を整えよう。',
                     'closing':'展開では各項を漏れなく掛け、その後で同類項をまとめる。この二つを分けると、符号や項の見落としを確かめやすい。'})
    if pattern=='linear_combination':
        item['original_problem']='括弧を外し、xの項と定数項をそれぞれまとめよう。'
        item['prose']['lead']='括弧の前にある数は、括弧の中の両方の項に掛かる。負の数を掛ける項も、一つずつ符号を追ってみよう。'
        item['prose']['goal']='先に四つの掛算を行い、その結果をxの項と定数項に分けてまとめる。'
    if figure:
        item['figure']={'id':lid+'-grid','kind':'multiplication_grid','position':'before_distribution','purpose':'四つの積の対応を表す。',
                        'how_to_read':'左側の行の項と、上側の列の項を掛ける。左上の欄から右へ進み、次に下の行へ進むと、四つの積を漏れなく作れる。',
                        'connects_to':'distribution','provenance':'この試作用の数式データから生成する正確な表。既存の元図を置換しない。'}
    sol=solve(item);item['original_expression']=sol['source'];item['blank_targets']=[s['id']+'.result' for s in sol['steps']]
    return item

def project(lessons,mode='textbook'):
    return dict(schema_version=1,mode=mode,
                policy={'major_title_count':3,'major_titles':['式を整える','実数を扱う','不等式を使う']},
                scope={'kind':'prototype_subset','expected_units':[l['id'] for l in lessons],'excluded_topics':['実数を扱う','不等式を使う']},
                themes=[{'title':'式を整える','units':[l['id'] for l in lessons]}, {'title':'実数を扱う','units':[]},{'title':'不等式を使う','units':[]}],lessons=lessons)

def review(p):
    p['semantic_review']={k:'REVIEWED' for k in ['organization','applicability','learning_actions','distractors','prose_figures','reasoning']}
    p['semantic_review'].update(design_hash=design_hash(p),reviewer='AIによる試作設計審査（ユーザー受入・独立審査ではない）',
       notes=['大見出しは既存の三つを表示し、今回対象外の二テーマはその旨を明示する。',
              '四つの積は各項の対応と符号を一つずつ追い、最後に同類項をまとめる。完成式を先に選ばせない。',
              '図は四つの積を作るための表として先に置く。欄は未計算の積を示し、結果の先出しを避ける。',
              '符号・次数・係数の誤り候補は機械検算済み。適切な支援量と文章の読みやすさは実際のレビューで確かめる。'])
    return p

def main():
    lessons=[lesson('product-basic','distribute_binomials',[3,1,1,2],'四つの積を作ってまとめる',True),
             lesson('product-signed','distribute_binomials',[2,-3,3,4],'負の項を含む積を計算する',True),
             lesson('linear','linear_combination',[2,-3,3,1,2,-4],'括弧の前の数を各項に掛ける')]
    p=review(project(lessons)); (ROOT/'example_textbook.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
    p=review(project([lesson('practice-product','distribute_binomials',[2,3,1,-4],'展開を自分で進める')],'practice'))
    (ROOT/'example_practice.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':main()
