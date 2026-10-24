"""イベントだけから再生成するWork内の表示。全体の現在地は上書きしない。"""
import json,re
from pathlib import Path
from definitions import instantiate,VERSION
from store import canonical,digest

def production_accepted(rt,s):
    if s['plan'].get('workflow_version') == 'production/2':
        units=s['plan']['release_units'];nodes=instantiate(s['plan'])
        return all(rt.node_status(s,nodes['G3_FINAL@'+u['id']])=='PASSED' for u in units)
    result=s['results'].get('S22')
    if not result or result['verdict']!='PASS':return False
    event=rt.store.get(result['artifact']).get('user_event')
    return s['users'].get(event,{}).get('intent')=='accept_app'

def snapshot(rt,work):
    s=rt.state(work);nxt=rt.next(work);nodes=instantiate(s['plan'])
    status='DONE' if nxt['status']=='DONE' else 'VERIFYING' if any('VERIFY' in x for x in s['results']) else 'IMPLEMENTING' if s['results'] else 'APPROVED' if rt.approval(s) else 'PROPOSED'
    result = {'work':work,'engine_version':VERSION,'ledger_head':rt.store.head,'work_status':status,'profile':s['plan']['profile'],'simulation':s['plan'].get('simulation',False),'candidate_sha':s['candidate_sha'],'next':nxt,'nodes':[{**n,'status':rt.node_status(s,n)} for n in nodes.values()],'pending_issues':[i for i in s['issues'].values() if not i.get('resolved_by')],'application_accepted':production_accepted(rt,s) if s['plan'].get('workflow_version') else s['plan']['profile']=='material' and rt.node_status(s,nodes['G3_FINAL'])=='PASSED'}

    if s['plan'].get('workflow_version') == 'production/2':
        from requests import pending
        result['correction_queue']=pending(rt,s)
        result['child_works']=sorted({e['work'] for e in rt.store.events() if e['kind']=='opened' and (e['payload']['plan'].get('parent_work')==work or e['payload']['plan'].get('parent_impact',{}).get('work')==work or e['payload']['plan'].get('parent_issue',{}).get('work')==work)})
        result['capability_receipts']=[e['payload'] for e in rt.store.events() if e['work']==work and e['kind']=='capability_bound']
        result['release_acceptance']={u['id']:rt.node_status(s,nodes['G3_FINAL@'+u['id']])=='PASSED' for u in s['plan']['release_units']}
    return result

def rendered(rt,work):
    snap=snapshot(rt,work);rows=['| Node | 担当 | 状態 | 依存 |','|---|---|---|---|']
    rows += ['| '+n['id']+' | '+n['actor']+' | '+n['status']+' | '+', '.join(n['depends_on'])+' |' for n in snap['nodes']]
    nxt=snap['next'];nextnode=nxt.get('task',{}).get('node',{}).get('id',nxt.get('node','—'))
    text=f"# {work} — 現在地（GENERATED）\n\n状態: {snap['work_status']} / 内部: {nxt['status']} / 次: {nextnode}\n\n台帳HEAD: `{snap['ledger_head']}`\n候補SHA: `{snap['candidate_sha']}`\n\n模擬実行: {snap['simulation']}。アプリ受入: {snap['application_accepted']}。技術試験合格だけで教材の品質は確定しない。\n\n"+'\n'.join(rows)+'\n\n待機理由: '+str(nxt.get('reason','—'))+'\n'
    # 一画面の分岐図。詳細ノード・依存は上表とsnapshotに保持する。
    counts={a:sum(n['status']=='PASSED' for n in snap['nodes'] if n['actor']==a) for a in ('AI','TOOL','USER','AUDITOR')}
    def group(n):
        if n['block']:return 'BLOCK_'+n['block']
        if n['id'].startswith('S0'):return 'RESTORE'
        return n['id']
    groups={};lookup={n['id']:group(n) for n in snap['nodes']};edges=set()
    for n in snap['nodes']:
        g=group(n);groups.setdefault(g,[]).append(n)
        for d in n['depends_on']:
            if lookup[d]!=g:edges.add((lookup[d],g))
    safe={g:'N'+str(i) for i,g in enumerate(groups)}
    lines=['# 火柴図（GENERATED）','','```mermaid','flowchart TD']
    for g,ns in groups.items():
        label=(g+' '+str(sum(n['status']=='PASSED' for n in ns))+'/'+str(len(ns))).replace('"','').replace('\n',' ')
        lines.append('  '+safe[g]+'["'+label+'"]')
    for a,b in sorted(edges):lines.append('  '+safe[a]+' --> '+safe[b])
    lines+=['```','',f"現在の経路: {snap['profile']} / 次ノード: {nextnode} / {nxt['status']}",'',"各ブロック内のノード・担当・失効・依存は CURRENT_POSITION.md と snapshot.json を参照。"]
    diagram='\n'.join(lines)+'\n'
    if rt.state(work)['plan'].get('workflow_version'):
        from production import diagram as production_diagram
        diagram=production_diagram(rt,work)
    out={'snapshot.json':json.dumps(snap,ensure_ascii=False,indent=2)+'\n','CURRENT_POSITION.md':text,'FIRE_DIAGRAM.md':diagram}
    if rt.state(work)['plan'].get('workflow_version') == 'production/2':out.update(integration_diagrams(snap))
    if nxt.get('task'):out['NEXT_TASK.json']=json.dumps(nxt['task'],ensure_ascii=False,indent=2)+'\n'
    return out

def render(rt,work,destination,check=False):
    out=Path(destination);files=rendered(rt,work)
    if check:
        return all((out/name).is_file() and (out/name).read_text()==body for name,body in files.items()) and ((out/'NEXT_TASK.json').exists()==('NEXT_TASK.json' in files))
    out.mkdir(parents=True,exist_ok=True)
    for name,body in files.items():(out/name).write_text(body)
    if 'NEXT_TASK.json' not in files:(out/'NEXT_TASK.json').unlink(missing_ok=True)
    return {'files':sorted(files),'snapshot_hash':digest(snapshot(rt,work))}


def integration_diagrams(snap):
    """All three projections consume exactly one ledger snapshot."""
    def draw(title, groups, edges, notes=()):
        safe={k:'N'+str(i) for i,k in enumerate(groups)}
        def label(text):return re.sub(r'["\n\r<>`]', ' ', str(text))
        lines=['# '+title+'（GENERATED）','','台帳HEAD: `'+snap['ledger_head']+'`','','```mermaid','flowchart TD']
        for key,value in groups.items():lines.append('  '+safe[key]+'["'+label(value)+'"]')
        for a,b in sorted(edges):
            if a!=b:lines.append('  '+safe[a]+' --> '+safe[b])
        lines+=['```','', '現在: '+str(snap['next'].get('node',snap['next'].get('task',{}).get('node',{}).get('id','—')))+' / '+snap['next']['status']]
        lines+=list(notes)
        return '\n'.join(lines)+'\n'
    nodes=snap['nodes'];overview={};mapping={}
    for n in nodes:
        key=('APPROVAL:'+n['approval_scope_ref']) if n['stage_kind'] in ('C06_APPROVAL','R05_APPROVAL') else (n['release_unit']+':'+('design' if n['phase'] in ('analysis','pre-design') else 'release' if n['phase'] in ('post-implementation','pre-release','release','acceptance') else 'learning')) if n['release_unit'] else n['stage_kind'];mapping[n['id']]=key;overview.setdefault(key,[]).append(n)
    groups={k:k+' '+str(sum(n['status']=='PASSED' for n in ns))+'/'+str(len(ns)) for k,ns in overview.items()}
    edges={(mapping[d],mapping[n['id']]) for n in nodes for d in n['depends_on'] if mapping[d]!=mapping[n['id']]}
    notes=['保留・修正queue: '+str(len(snap.get('correction_queue',[]))), '関連修正Work: '+(', '.join(snap.get('child_works',[])) or '—'), '差戻しは再分析・失効・子Workの台帳イベントで記録し、実行依存へ循環を入れない。']
    overall=draw('全体火柴図',groups,edges,notes)
    groups={n['id']:n['id']+' / '+n['actor']+' / '+n['status'] for n in nodes}
    edges={(d,n['id']) for n in nodes for d in n['depends_on']}
    block=draw('ブロック火柴図',groups,edges)
    chunks=['# 機能火柴図（GENERATED）','','台帳HEAD: `'+snap['ledger_head']+'`','']
    for n in nodes:
        caps=n.get('capability_requests',[])
        for offset in range(0,len(caps),4):
            groups={n['id']:n['id']+' / '+n['phase']+' / '+n['status']};edges=set()
            for capability in caps[offset:offset+4]:
                key=n['id']+':'+capability;groups[key]=capability;edges.add((n['id'],key))
            chunks.append(draw(n['id'],groups,edges))
    chunks.append('code実行receiptはsnapshot.jsonのcapability_receiptsを参照。AIの意味審査は別記録。')
    cap='\n'.join(chunks)+'\n'
    return {'FIRE_DIAGRAM.md':overall,'BLOCK_FIRE_DIAGRAM.md':block,'CAPABILITY_FIRE_DIAGRAM.md':cap}
