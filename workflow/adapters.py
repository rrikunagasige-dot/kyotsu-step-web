"""副作用を限定する接続部。外部送信は呼出側の既存GitHubコネクタで行う。"""
import hashlib,io,json,os,subprocess,sys,uuid,zipfile,time
from pathlib import Path
from contracts import need,file,sha,manifest,relative
from store import digest,canonical


def in_scope(path,scope):
    relative(path)
    return any(path==x or (x.endswith('/') and path.startswith(x)) for x in scope['paths']) and not any(path==x or (x.endswith('/') and path.startswith(x)) for x in scope.get('preserve',[]))

def apply_patch(rt,work,node,token,patch):
    """承認済みproposalにpatch_hashを含める。全ファイルを事前照合し、その後置換。"""
    s=rt.state(work);c=s['claims'].get(node)
    need(c and c['expires_at']>time.time() and c['token']==token and c['input_hash']==rt.input_hash(s,__import__('definitions').instantiate(s['plan'])[node]),'有効な修正課題ではない')
    need(node.startswith(('R06_PATCH','C07_BUILD','T03_BUILD')),'限定修正の工程ではない')
    need(rt.approval(s,__import__('definitions').instantiate(s['plan'])[node]),'現在のblockの具体案の承認がない')
    need(not rt.integrity(s),'適用前に未記録差分がある')
    patch_hash=s['plan']['proposal'].get('patch_hash')
    if s['plan'].get('workflow_version')=='production/2':
        block=__import__('definitions').instantiate(s['plan'])[node]['block']
        patch_hash=next(b.get('patch_hash',patch_hash) for b in s['plan']['blocks'] if b['id']==block)
    need(digest(patch)==patch_hash,'承認された差分版ではない')
    need(patch.get('files'),'空の差分')
    need(len({x['path'] for x in patch['files']})==len(patch['files']),'同じファイルの重複変更')
    staged=[]
    for change in patch['files']:
        path=change['path'];need(in_scope(path,s['plan']['scope']),'承認範囲外または保護対象:'+path)
        need(path in s['candidate_manifest'],'新規ファイルの収録は提案改訂と新Workで固定する')
        p=file(rt.root,path);need(sha(p)==change['before_sha256'],'修正前の版が違う')
        after=change['after_text'].encode();need(hashlib.sha256(after).hexdigest()==change['after_sha256'],'修正後のハッシュ不一致')
        # 教材JSONは安定IDと保護された学習履歴キーを自動照合する。
        if path.endswith('.json'):
            before=json.loads(p.read_text());new=json.loads(after)
            def ids(value):
                if isinstance(value,dict):return ([value['id']] if 'id' in value else [])+sum((ids(v) for v in value.values()),[])
                if isinstance(value,list):return sum((ids(v) for v in value),[])
                return []
            need(ids(before)==ids(new),'安定ID・順序の変更には移行を含む別の具体案が必要')
            for key in ('progress','history'):
                if isinstance(before,dict) and key in before:need(before[key]==new.get(key),'保存履歴を変更しない')
        staged.append((path,p,after))
    op='patch-'+digest(patch)[:20]+'-'+token[:12]
    need(not any(e['id']==op for e in rt.store.events()),'同じ差分を再適用しない。実状態を照合する')
    backup=rt.store.put({name:p.read_bytes().hex() for name,p,_ in staged})
    patch_ref=rt.store.put(patch)
    rt.append('patch_intent',work,{'node':node,'patch_hash':patch_ref,'backup':backup,'before':{x['path']:x['before_sha256'] for x in patch['files']}},event_id=op)
    for _,p,data in staged:
        tmp=p.with_name('.'+p.name+'.'+uuid.uuid4().hex+'.tmp')
        with tmp.open('xb') as f:f.write(data);f.flush();os.fsync(f.fileno())
        os.replace(tmp,p)
    after_manifest={name:sha(p) for name,p,_ in staged}
    rt.append('patch_applied',work,{'node':node,'operation':op,'after_manifest':after_manifest})
    return [rt.evidence(work,'file',{'path':p,'sha256':h},source_ref=op,verification_level='local_execution') for p,h in after_manifest.items()]

def authoring(engine_dir,input_path,out_dir,plan_path):
    """P-001生成器の固定CLIだけを呼ぶ。未知パターンを勝手に作らない。"""
    engine=Path(engine_dir).resolve();script=engine/'engine.py'
    need(script.is_file(),'承認済みP-001生成器がない')
    proc=subprocess.run([sys.executable,str(script),str(Path(input_path).resolve()),'--out',str(Path(out_dir).resolve()),'--plan',str(Path(plan_path).resolve())],cwd=engine,text=True,capture_output=True,timeout=60)
    report=json.loads((Path(out_dir)/'report.json').read_text())
    return {'adapter':'P001','engine_manifest':{p.name:sha(p) for p in sorted(engine.iterdir()) if p.suffix in ('.py','.json','.html')},'returncode':proc.returncode,'report':report,'semantic_acceptance':False}

def import_capture(rt,work,zip_path,ci_ref,destination):
    s=rt.state(work);ci=s['evidence'].get(ci_ref,{});need(ci.get('kind')=='ci','先にCI実行証拠が必要')
    data=Path(zip_path).read_bytes();need(len(data)<=30_000_000,'画像成果物が大きすぎる')
    paths={};items=[]
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        need(sum(i.file_size for i in z.infolist())<=60_000_000,'展開上限超過')
        for info in z.infolist():
            if info.is_dir():continue
            relative(info.filename);need(not ((info.external_attr>>16)&0o170000)==0o120000,'リンクの画像成果物は禁止')
            need(info.filename.endswith('.png'),'PNG以外の混在は別の取込へ')
            path=destination.rstrip('/')+'/'+info.filename;p=file(rt.root,path)
            need(path not in paths,'ZIP内の重複パス');blob=z.read(info);need(blob.startswith(b'\x89PNG\r\n\x1a\n'),'PNG形式ではない')
            paths[path]=hashlib.sha256(blob).hexdigest();items.append((p,blob))
    for p,blob in items:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(blob)
    return rt.evidence(work,'capture',{'ci_ref':ci_ref,'source_sha':ci['data']['head_sha'],'artifact_sha256':hashlib.sha256(data).hexdigest(),'files':paths},source_ref='artifact:'+sha(zip_path),verification_level='local_execution')

def git_export(rt,work,expected_head,prefix):
    """コネクタへ渡すCAS要求を作る。更新・merge・deployはこの関数ではしない。"""
    need(len(expected_head)==40,'期待HEADが必要');relative(prefix)
    files=[]
    for p in sorted(rt.store.root.rglob('*.json')):
        rel=p.relative_to(rt.store.root).as_posix();files.append({'path':prefix.rstrip('/')+'/'+rel,'mode':'100644','type':'blob','content':p.read_text()})
    return {'repository':'rrikunagasige-dot/kyotsu-step-web','repository_id':1391122224,'work':work,'expected_head':expected_head,'ledger_head':rt.store.head,'tree_elements':files,'update_requires_expected_sha':True}

def probe_app(rt,work,url,manifest_url,check_refs):
    """実際にHTTPSへ到達し版を読む。端末操作・履歴分離は別の実行証拠を必須とする。"""
    from urllib.request import urlopen,Request
    from urllib.parse import urlparse
    s=rt.state(work);need(not s['plan'].get('simulation'),'模擬経路ではネット接続しない')
    need(url.startswith('https://') and manifest_url.startswith('https://'),'実働検証はHTTPS')
    need(urlparse(url).netloc==urlparse(manifest_url).netloc,'アプリと版表示は同じ配信先')
    rt.fingerprint_refs(s,check_refs);checks=set()
    for ref in check_refs:
        e=s['evidence'].get(ref,{})
        need(e.get('kind')=='check' and e['data']['source_sha']==s['candidate_sha'],'現在SHAの操作検証が必要')
        checks.update(e['data']['checks'])
    need({'mobile_play','desktop_play','progress_isolation','no_auth_wall'}<=checks,'実操作・認証壁確認の検証が不足')
    receipts=[];payloads=[]
    for target in (url,manifest_url):
        with urlopen(Request(target,headers={'User-Agent':'Kyotsu-Workflow-Verification/1'}),timeout=15) as response:
            need(response.status==200 and urlparse(response.url).netloc==urlparse(url).netloc,'到達先・応答が不正')
            body=response.read(2_000_001);need(len(body)<=2_000_000,'応答が上限超過');payloads.append(body)
            receipts.append({'url':target,'resolved_url':response.url,'status':response.status,'sha256':hashlib.sha256(body).hexdigest()})
    version=json.loads(payloads[1]);need(version.get('source_sha')==s['candidate_sha'],'公開マニフェストが対象SHAではない')
    return rt.evidence(work,'app',{'url':url,'source_sha':s['candidate_sha'],'manifest_sha':version['source_sha'],'reachable':True,'auth_wall':False,'mobile':True,'desktop':True,'progress_isolated':True,'http_receipts':receipts,'operation_check_refs':check_refs},source_ref='http-probe:'+digest(receipts),verification_level='local_execution')


def reconcile_patch(rt,work,operation,decision,evidence_refs):
    """中断差分を実ファイルと照合。完了記録の復元か、既知の修正前への復帰だけ。"""
    s=rt.state(work);op=s['patches'].get(operation);need(op and not op.get('completed'),'未確定の差分ではない')
    rt.fingerprint_refs(s,evidence_refs);need(evidence_refs,'照合の根拠がない')
    patch=rt.store.get(op['patch_hash']);backup=rt.store.get(op['backup']);actual={x['path']:sha(file(rt.root,x['path'])) for x in patch['files']}
    for x in patch['files']:need(actual[x['path']] in (x['before_sha256'],x['after_sha256']),'未知の差分があるため自動復旧しない')
    if decision=='RECORD_COMPLETED':
        need(all(actual[x['path']]==x['after_sha256'] for x in patch['files']),'一部未適用の差分を成功扱いしない')
        rt.append('patch_applied',work,{'node':op['node'],'operation':operation,'after_manifest':actual,'recovery_evidence':evidence_refs})
    elif decision=='RESTORE_BEFORE':
        for name,content in backup.items():
            p=file(rt.root,name);tmp=p.with_name('.'+p.name+'.restore.tmp');tmp.write_bytes(bytes.fromhex(content));os.replace(tmp,p)
        need(manifest(rt.root,op['before'])==op['before'],'修正前への復帰に失敗')
        rt.append('patch_aborted',work,{'operation':operation,'evidence_refs':evidence_refs})
        rt.reconcile_claim(work,op['node'],'FAILED',evidence_refs)
    else:raise ValueError('復旧の判断はRECORD_COMPLETEDまたはRESTORE_BEFORE')
    return {'operation':operation,'decision':decision}
