#!/usr/bin/env python3
"""現在のチャット用CLI。JSONを入出力し、AIの自動呼出・課金は行わない。"""
import argparse,json,sys
import importlib.abc,importlib.util,importlib.machinery
from pathlib import Path

# Execute this file directly in a fresh process for formal checkpoint operations.
# -B alone still reads timestamp/size-valid pyc files. Install the source-only
# loader before importing any workflow module, including Runtime and definitions.
_WORKFLOW_SOURCE_ROOT=Path(__file__).resolve().parent
class _WorkflowSourceOnly(importlib.machinery.SourceFileLoader):
    def get_code(self,fullname):
        return compile(Path(self.path).read_bytes(),self.path,'exec',dont_inherit=True)
class _WorkflowSourceFinder(importlib.abc.MetaPathFinder):
    def find_spec(self,fullname,path=None,target=None):
        source=_WORKFLOW_SOURCE_ROOT/(fullname+'.py')
        if '.' not in fullname and source.is_file():
            return importlib.util.spec_from_loader(fullname,_WorkflowSourceOnly(fullname,str(source)))
sys.meta_path.insert(0,_WorkflowSourceFinder())

from runtime import Runtime
from definitions import instantiate
from views import snapshot,render
from adapters import apply_patch,git_export,authoring,import_capture,probe_app,reconcile_patch,prepare_version_transition,reconcile_version_transition

def main():
    p=argparse.ArgumentParser();p.add_argument('--root',default='.');p.add_argument('--store',required=True)
    p.add_argument('operation',choices=['open','next','status','claim','submit','user','evidence','accept','auto','tool-result','bind','revise','reconcile','issue','resolve','patch','render','export','external-intent','external-outcome','author','capture','recover-lock','probe-app','reconcile-patch','reopen','production-result','production-context','production-ai','production-diagram','migrate-definition','production-run','block-context','request','resolve-request','migrate-workflow','adopt-correction','team-register','team-record-output','team-reconcile','adopt-team-policy','team-policy','team-capture','team-bind-target','prepare-version-transition','reconcile-version-transition','link-correction-receipt','checkpoint-init','checkpoint-preflight','checkpoint-migrate','reconcile-checkpoint-candidate','adopt-informed-review-method','revoke-informed-review-method','seal-informed-review','informed-review-run','reconcile-informed-technical-owner'])
    p.add_argument('--work');p.add_argument('--json',help='JSONファイル。省略時は標準入力（next/status/autoには不要）');p.add_argument('--out');p.add_argument('--check',action='store_true')
    a=p.parse_args()
    noinput=a.operation in ('next','status','auto','render','recover-lock','production-ai','production-diagram','team-policy')
    noinput=noinput or a.operation=='checkpoint-preflight' and not a.json
    data={} if noinput else json.loads(open(a.json).read() if a.json else sys.stdin.read());op=a.operation;w=a.work
    if op=='checkpoint-init':
        from checkpoint import CheckpointStore
        store=CheckpointStore.initialize(a.store,a.root,**data)
        print(json.dumps(store.summary(),ensure_ascii=False,indent=2));return
    rt=Runtime(a.store,a.root)
    if op=='reconcile-informed-technical-owner':r=rt.reconcile_informed_technical_owner(w,**data)
    elif op=='informed-review-run':r=rt.run_informed_review(w,**data)
    elif op=='adopt-informed-review-method':r=rt.adopt_informed_review_method(w,**data)
    elif op=='revoke-informed-review-method':r=rt.revoke_informed_review_method(w,**data)
    elif op=='seal-informed-review':r=rt.seal_informed_review(w,**data)
    elif op=='reconcile-checkpoint-candidate':r=rt.reconcile_checkpoint_candidate(w,**data)
    elif op=='checkpoint-preflight':r=rt.checkpoint_preflight(w,**data)
    elif op=='checkpoint-migrate':r=rt.migrate_checkpoint_definition(w,**data)
    elif op=='team-policy':
        from team import default_policy
        r=default_policy()
    elif op=='team-bind-target':
        from team_transport import bind_target
        r=bind_target(rt,w,**data)
    elif op=='team-capture':
        from team_transport import capture_harness
        r=capture_harness(rt,w,**data)
    elif op=='team-register':
        from team_transport import register_task
        r=register_task(rt,w,**data)
    elif op=='team-record-output':
        from team_transport import record_output
        r=record_output(rt,w,**data)
    elif op=='team-reconcile':
        from team_transport import reconcile_task
        r=reconcile_task(rt,w,**data)
    elif op=='adopt-team-policy':
        from team_migration import adopt_team_policy
        r=adopt_team_policy(rt,w,**data)
    elif op=='adopt-correction':r=rt.adopt_correction(w,**data)
    elif op=='block-context':r=rt.block_context(w,**data)
    elif op=='request':
        from requests import intake
        r=intake(rt,w,data)
    elif op=='resolve-request':r=rt.resolve_request(w,**data)
    elif op=='migrate-workflow':
        from migrations import migrate
        r=migrate(rt,w,**data)
    elif op=='production-run':
        from runner import run_code
        r=run_code(rt,w,data)
    elif op=='production-result':r=rt.production_result(w,**data)
    elif op=='production-context':r=rt.production_context(w,data)
    elif op=='migrate-definition':r=rt.migrate_definition(w,**data)
    elif op=='production-ai':
        from production import ai_request
        r=ai_request(rt,w,rt.next(w)['task']['node']['id'])
    elif op=='production-diagram':
        from production import diagram
        r={'diagram':diagram(rt,w)}
    elif op=='open':r=rt.open(data)
    elif op=='next':r=rt.next(w)
    elif op=='status':r=snapshot(rt,w)
    elif op=='claim':r=rt.claim(w,**data)
    elif op=='submit':r=rt.submit(w,**data)
    elif op=='user':r=rt.user(w,**data)
    elif op=='evidence':r=rt.evidence(w,**data)
    elif op=='accept':r=rt.accept(w,**data)
    elif op=='tool-result':r=rt.tool_result(w,**data)
    elif op=='bind':r=rt.bind_candidate(w,**data)
    elif op=='revise':r=rt.revise(w,data)
    elif op=='reconcile':r=rt.reconcile_claim(w,**data)
    elif op=='issue':r=rt.issue(w,data)
    elif op=='resolve':r=rt.resolve_issue(w,**data)
    elif op=='prepare-version-transition':r=prepare_version_transition(rt,w,**data)
    elif op=='reconcile-version-transition':r=reconcile_version_transition(rt,w,**data)
    elif op=='link-correction-receipt':
        from requests import link_correction_receipt
        r=link_correction_receipt(rt,w,**data)
    elif op=='patch':r=apply_patch(rt,w,**data)
    elif op=='render':r=render(rt,w,a.out,check=a.check)
    elif op=='export':r=git_export(rt,w,**data)
    elif op=='external-intent':r=rt.external_intent(w,**data)
    elif op=='external-outcome':r=rt.external_outcome(w,**data)
    elif op=='author':r=authoring(**data)
    elif op=='capture':r=import_capture(rt,w,**data)
    elif op=='probe-app':r=probe_app(rt,w,**data)
    elif op=='reconcile-patch':r=reconcile_patch(rt,w,**data)
    elif op=='reopen':r=rt.reopen(w,**data)
    elif op=='recover-lock':r=rt.store.recover_lock()
    elif op=='auto':
        while True:
            r=rt.next(w)
            node=r.get('task',{}).get('node',{})
            if node.get('actor')=='USER' and 'APPROVAL' in node.get('id','') and rt.approval(rt.state(w),node):
                rt.accept(w,node['id'],rt.approval(rt.state(w),node)['id']);continue
            if r.get('status')!='READY' or node.get('actor')!='CODE':break
            rt.execute(w,node['id'])
    print(json.dumps(r,ensure_ascii=False,indent=2))

if __name__=='__main__':
    try:main()
    except (ValueError,RuntimeError,KeyError,OSError) as e:
        print(json.dumps({'status':'REJECTED','reason':str(e)},ensure_ascii=False));sys.exit(2)
