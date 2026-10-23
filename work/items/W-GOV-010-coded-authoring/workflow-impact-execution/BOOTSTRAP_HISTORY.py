"""実際のP-002実装Workを既承認と実成果物へ接続する。初回bootstrapを遡及強制とは呼ばない。"""
import sys,json
from pathlib import Path
sys.path.insert(0,str(Path('workflow-realroot/workflow').resolve()))
from runtime import Runtime
from contracts import manifest,sha
from definitions import instantiate
from views import render
ROOT=Path('workflow-realroot');DEST=Path('workflow-impact-actual-record');WORK='W-GOV-010-P002-IMPACT-COVERAGE';SHA='d379a251f5753dccb08b21696027acf33c54e588';rt=Runtime(DEST/'runtime',ROOT)
proposal='work/items/W-GOV-010-coded-authoring/PROPOSAL_P002_WORKFLOW_ENGINE.md'
plan={'work_id':WORK,'profile':'technical','command':'GOVERNANCE','subject':'governance','mode':'workflow-engine','source_sha':SHA,'source_manifest':manifest(ROOT,['workflow/runtime.py']),'rules':manifest(ROOT,['AGENTS.md','governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/INSTRUCTION_DICTIONARY.md','workflow/rules/mapping.json']),'blocks':[{'id':'ENGINE','sources':['workflow/runtime.py']}],'proposal':{'id':'P-002','hash':sha(ROOT/proposal)},'scope':{'paths':['workflow/','AGENTS.md','governance/WORK_SYSTEM.md','governance/INSTRUCTION_DICTIONARY.md','.github/workflows/workflow-engine.yml','work/items/W-GOV-010-coded-authoring/'],'preserve':['src/','public/','package.json','pnpm-lock.yaml','governance/CONSTITUTION.md']},'simulation':False,'bootstrap_note':'実行器が存在する前の初回実装。承認は実装前のユーザー発言へ対応。台帳は実装成果と現時点の分析を取り込み、過去の全操作を遡及的に強制したとは扱わない。'}
rt.open(plan)
refs={}
for path in [proposal,'workflow/runtime.py','workflow/rules/mapping.json']:
 refs[path]=rt.evidence(WORK,'file',{'path':path,'sha256':sha(ROOT/path)},source_ref='https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/'+SHA+'/'+path,verification_level='local_execution')
user=rt.user(WORK,'approve_proposal','これでいいよ。じゃこれに従ってやりなさい。',plan['proposal']['hash'],'conversation:latest-user-message-approval-of-P002',event_id='P002-user-implementation-approval',verification_level='conversation_transcribed')
rt.execute(WORK,'S00_RECOVER');rt.execute(WORK,'S01_ROUTE')
t=rt.claim(WORK,'T01_ANALYSIS','current-chat')
rt.submit(WORK,'T01_ANALYSIS',t['claim_token'],{'rule_mapping':'憲法I〜VIII、Work OS11・12A・12B・12C、CMD-WORK-001/002をmapping.jsonへ対応。機械強制・AI・USER・未自動化を明記。憲法本文は不変。','design':'C/Rの両経路に加え、影響調査で全登録ブロック・資料の対応行と対象版を機械照合する。既知の他ブロックを落とした表、IDの取り違え、古い版の表を拒否する。登録済み生成器の二モード接続を実検証。意味の正しさとユーザー受入は別。','protected_scope':plan['scope']['preserve'],'unknowns':[],'verdict':'PASS','evidence_refs':list(refs.values()),'bootstrap_note':plan['bootstrap_note']})
rt.accept(WORK,'T02_APPROVAL',user)
t=rt.claim(WORK,'T03_BUILD','current-chat/github-connector')
rt.tool_result(WORK,'T03_BUILD',t['claim_token'],[refs['workflow/runtime.py']])
render(rt,WORK,DEST/'generated');(DEST/'plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');print(json.dumps(rt.next(WORK),ensure_ascii=False,indent=2))
