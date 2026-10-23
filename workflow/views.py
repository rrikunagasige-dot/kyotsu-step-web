"""イベントだけから再生成するWork内の表示。全体の現在地は上書きしない。"""
import json,re
from pathlib import Path
from definitions import instantiate,VERSION
from store import canonical,digest

def snapshot(rt,work):
    s=rt.state(work);nxt=rt.next(work);nodes=instantiate(s['plan'])
    status='DONE' if nxt['status']=='DONE' else 'VERIFYING' if any('VERIFY' in x for x in s['results']) else 'IMPLEMENTING' if s['results'] else 'APPROVED' if rt.approval(s) else 'PROPOSED'
    return {'work':work,'engine_version':VERSION,'ledger_head':rt.store.head,'work_status':status,'profile':s['plan']['profile'],'simulation':s['plan'].get('simulation',False),'candidate_sha':s['candidate_sha'],'next':nxt,'nodes':[{**n,'status':rt.node_status(s,n)} for n in nodes.values()],'pending_issues':[i for i in s['issues'].values() if not i.get('resolved_by')],'application_accepted':s['plan']['profile']=='material' and rt.node_status(s,nodes['G3_FINAL'])=='PASSED'}

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
    out={'snapshot.json':json.dumps(snap,ensure_ascii=False,indent=2)+'\n','CURRENT_POSITION.md':text,'FIRE_DIAGRAM.md':diagram}
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
