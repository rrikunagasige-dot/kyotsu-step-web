"""Work-local serial dispatch for dependency-ready nodes in one approved bundle.
The stock next() picks N09 by priority. This adapter uses the same native DAG,
approval, capabilities and result validators; it never accepts a quality gate.
"""
import time,uuid
from definitions import instantiate
from capabilities import run_capability
from integration import accept as native_accept
from contracts import need

def ready(rt,work,nid):
 s=rt.state(work);nodes=instantiate(s['plan']);n=nodes[nid]
 need(not rt.integrity(s) and not s['paused'] and not s['claims'],'serial dispatch requires a clean, idle Work')
 need(not any(not p.get('completed') for p in s['patches'].values()),'unfinished patch')
 need(all(rt.node_status(s,nodes[d])=='PASSED' for d in n['depends_on']),'native DAG prerequisites not met')
 need(rt.node_status(s,n) not in ('PASSED','RUNNING'),'node already completed/running')
 return s,n

def accept_design(rt,work,nid,event):
 s,n=ready(rt,work,nid);need(n['stage_kind']=='R05_APPROVAL','cannot dispatch user quality/acceptance gates')
 need(rt.approval(s,n) and rt.approval(s,n)['id']==event,'exact bundle approval missing')
 rt.append('work_ready_dispatch',work,dict(node=nid,kind='existing-bundle-design-approval',prerequisites=n['depends_on'],scheduler='explicit native-DAG ready node; default priority unchanged'))
 return native_accept(rt,work,n,event,[])

def run(rt,work,nid,inputs):
 s,n=ready(rt,work,nid);need(n['actor'] in ('AI','TOOL'),'no synthetic user gate')
 need(set(inputs)==set(n['capability_requests']),'all native capabilities required')
 if n['stage_kind']=='R06_PATCH':need(rt.approval(s,n),'exact content/scope approval missing')
 task=rt.task(work,nid);claim=dict(node=nid,actor='W034-serial-ready-dispatch',input_hash=task['input_hash'],task_id=task['task_id'],token=uuid.uuid4().hex,expires_at=time.time()+900)
 rt.append('work_ready_dispatch',work,dict(node=nid,kind='dependency-ready-code',prerequisites=n['depends_on']))
 rt.append('claimed',work,claim)
 refs=[run_capability(rt,work,n,cap,inputs[cap]) for cap in n['capability_requests']]
 return dict(node=nid,claimToken=claim['token'],receipts=refs)
