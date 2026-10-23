#!/usr/bin/env python3
"""現在のチャット用CLI。JSONを入出力し、AIの自動呼出・課金は行わない。"""
import argparse,json,sys
from runtime import Runtime
from definitions import instantiate
from views import snapshot,render
from adapters import apply_patch,git_export,authoring,import_capture,probe_app,reconcile_patch

def main():
    p=argparse.ArgumentParser();p.add_argument('--root',default='.');p.add_argument('--store',required=True)
    p.add_argument('operation',choices=['open','next','status','claim','submit','user','evidence','accept','auto','tool-result','bind','revise','reconcile','issue','resolve','patch','render','export','external-intent','external-outcome','author','capture','recover-lock','probe-app','reconcile-patch','reopen'])
    p.add_argument('--work');p.add_argument('--json',help='JSONファイル。省略時は標準入力（next/status/autoには不要）');p.add_argument('--out');p.add_argument('--check',action='store_true')
    a=p.parse_args();rt=Runtime(a.store,a.root)
    noinput=a.operation in ('next','status','auto','render','recover-lock')
    data={} if noinput else json.loads(open(a.json).read() if a.json else sys.stdin.read());op=a.operation;w=a.work
    if op=='open':r=rt.open(data)
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
            if node.get('actor')=='USER' and 'APPROVAL' in node.get('id','') and rt.approval(rt.state(w)):
                rt.accept(w,node['id'],rt.approval(rt.state(w))['id']);continue
            if r.get('status')!='READY' or node.get('actor')!='CODE':break
            rt.execute(w,node['id'])
    print(json.dumps(r,ensure_ascii=False,indent=2))

if __name__=='__main__':
    try:main()
    except (ValueError,RuntimeError,KeyError,OSError) as e:
        print(json.dumps({'status':'REJECTED','reason':str(e)},ensure_ascii=False));sys.exit(2)
