import sys,json,shutil
from pathlib import Path
sys.path.insert(0,'workflow-realroot/workflow')
from runtime import Runtime
from views import render,snapshot
from contracts import sha,verify_git_export
root=Path('workflow-realroot');work='W-GOV-010-P002-IMPLEMENTATION';rt=Runtime('workflow-actual-record/runtime',root);ci=json.loads(Path('workflow-actual-ci.json').read_text())
ref=rt.evidence(work,'ci',ci,source_ref=ci['source_ref'],verification_level='tool_result_transcribed',eid='CI-39979184049')
t=rt.claim(work,'T04_VERIFY','current-chat/github-connector');rt.tool_result(work,'T04_VERIFY',t['claim_token'],[ref])
t=rt.claim(work,'L01_LEARNING','current-chat')
rt.submit(work,'L01_LEARNING',t['claim_token'],{'case_updates':[{'id':'WF-EXPORT-NEWLINE','quality':'UNKNOWN','disposition':'TEST','links':['workflow/contracts.py:verify_git_export','workflow/test_workflow.py:ExportProvenance','workflow/rules/mapping.json'],'finding':'ローカル書出しの余分な改行による正本hashの誤記。実Git blobへ一致させ、改行差分拒否試験を追加。ユーザーの品質評価ではない。'},{'id':'WF-SIMULATION-REPLAY','quality':'UNKNOWN','disposition':'TEST','links':['workflow/scenarios.py','workflow/test_workflow.py:ScenarioReplay'],'finding':'模擬出力先を再使用すると旧イベントが混在し得た。空の出力先を要求し、出力後に別StoreからDONEを再生して検証。'},{'id':'CORPUS-UNKNOWN-PRESERVATION','quality':'UNKNOWN','disposition':'EXISTING_RULE','links':['work/items/W-GOV-010-coded-authoring/corpus/LABEL_POLICY.md'],'finding':'続行・実装承認は品質肯定ではない。既存の不明26件は不明のまま維持。'}],'rule_links':['CONST-I','CONST-VII','WORK-12B'],'regression_links':['ExportProvenance','ScenarioReplay','Routes.test_continue_is_not_quality_positive','Routes.test_visual_acceptance_preserves_unchanged_block'],'unresolved':[],'deduplication':'既存の正本・検証・修正優先・品質ラベル規則へ結ぶ。新しい上位規則や第四Gateは追加しない。意味審査と教材修正は別Workへ残す。','verdict':'PASS','evidence_refs':[ref]})
rt.execute(work,'Z01_CLOSE');render(rt,work,'workflow-actual-record/generated');print(json.dumps({'technical_work':rt.next(work),'application_accepted':snapshot(rt,work)['application_accepted'],'ledger_head':rt.store.head},ensure_ascii=False))
