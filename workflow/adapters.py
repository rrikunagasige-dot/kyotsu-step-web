"""副作用を限定する接続部。外部送信は呼出側の既存GitHubコネクタで行う。"""
import hashlib,io,json,os,subprocess,sys,uuid,zipfile,time
from pathlib import Path
from contracts import need,file,sha,manifest,relative,Rejected,plan_check
from store import digest,canonical
from checkpoint import history_events


def in_scope(path,scope):
    relative(path)
    return any(path==x or (x.endswith('/') and path.startswith(x)) for x in scope['paths']) and not any(path==x or (x.endswith('/') and path.startswith(x)) for x in scope.get('preserve',[]))

def apply_patch(rt,work,node,token,patch,transition_ref=None):
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
    if s.get('version_transition'):
        return _vt_apply_patch(rt,work,node,token,patch,transition_ref)
    need(transition_ref is None,'通常patchへ版移行proofを混入しない')
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
            if path=='src/data/textbook/math/numbers/n07Authored.json' and s.get('materialization'):
                proof=rt.store.get(s['materialization']['proof'])
                need(new==proof['generated']['artifact'],'N07生成物の差し替え')
                need(before['unit']['sections'][0]['items']==new['unit']['sections'][0]['items'] and before['stages']==new['stages'] and before['nodes']==new['nodes'],'採点・段階・原設計IDの変更')
                need(before['unit']['revision']==new['unit']['revision'],'保存revisionの変更')
            else:
                need(ids(before)==ids(new),'安定ID・順序の変更には移行を含む別の具体案が必要')
            for key in ('progress','history'):
                if isinstance(before,dict) and key in before:need(before[key]==new.get(key),'保存履歴を変更しない')
        staged.append((path,p,after))
    op='patch-'+digest(patch)[:20]+'-'+token[:12]
    history = history_events(rt, 'complete', work if getattr(rt.store, 'checkpoint_epoch', None) else None)
    need(not any(e['id']==op for e in history),'同じ差分を再適用しない。実状態を照合する')
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
    s=rt.state(work);ci=s['evidence'].get(ci_ref,{})
    if ci.get('kind')=='source_ci':
        return source_ci_import_capture(rt,work,zip_path,ci_ref,destination)
    need(ci.get('kind')=='ci','先にCI実行証拠が必要')
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
    if op.get('transition_ref'):return _vt_reconcile_patch(rt,work,s,operation,decision,evidence_refs)
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


# Bounded source-backed CI capture bridge; policy belongs to approved technical Work.
import pathlib,stat,tempfile,shutil
_SOURCE_CI_VALIDATOR_JS = "// DRAFT fixed read-only bridge runner. No build, browser, network or publication.\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport assert from 'node:assert/strict';\nimport {execFileSync} from 'node:child_process';\nimport {pathToFileURL} from 'node:url';\nconst c=JSON.parse(fs.readFileSync(process.argv[2]));\nconst checker=path.join(c.publisherRoot,'tools/release/qf01-publish-check.mjs');\nconst manifestPath=path.join(c.buildRoot,'sealed/DIST_MANIFEST.json');\nconst env={PATH:process.env.PATH,LANG:'C.UTF-8',\n SOURCE_ROOT:c.buildRoot,PUBLISHER_ROOT:c.publisherRoot,BASELINE_ROOT:c.buildRoot,\n QF01_CONTRACT:path.join(c.publisherRoot,'tools/release/qf01-publish-contract.json'),\n QF01_DIST_MANIFEST:manifestPath,DIST_ROOT:path.join(c.buildRoot,'material/dist'),\n PUBLISHER_SHA:c.publisherSHA,RUN_METADATA:c.run,ARTIFACTS_METADATA:c.artifacts,QA_LEDGER:c.ledger,\n VERIFIED_RUN_ID:c.runID,VERIFIED_ATTEMPT:String(c.attempt),BUILD_ARCHIVE:c.buildArchive,QA_ARCHIVE:c.qaArchive};\nfor (const mode of ['verify-dist','producer'])\n execFileSync(process.execPath,[checker,mode],{env,stdio:['ignore','pipe','pipe'],timeout:240000});\nconst {assertContract,validateMatrix,validateQA,sha,relative}=await import(pathToFileURL(checker));\nconst read=p=>JSON.parse(fs.readFileSync(p));\nconst contract=assertContract(read(env.QF01_CONTRACT));\nconst manifestRaw=fs.readFileSync(manifestPath),manifest=JSON.parse(manifestRaw),ledger=read(c.ledger);\nvalidateMatrix({receipts:ledger.receipts,manifest,contract,manifestRaw});\nfor(const width of contract.expectedWidths){\n const prefix=path.join(c.qaRoot,String(width));\n const raw=fs.readFileSync(path.join(prefix,'QA_RECEIPT.json'));\n const receipt=JSON.parse(raw);\n assert.deepEqual(receipt,ledger.receipts.find(x=>x.width===width));\n assert.equal(sha(raw),ledger.receiptFiles[String(width)]);\n const qfRoot=path.join(prefix,'qf01-qa/qf01'),retainedRoot=path.join(prefix,'qf01-qa/w051-width');\n const qfRaw=fs.readFileSync(path.join(qfRoot,'REPORT.json')),retainedRaw=fs.readFileSync(path.join(retainedRoot,'REPORT.json'));\n assert.equal(sha(qfRaw),receipt.reportHashes.qf);assert.equal(sha(retainedRaw),receipt.reportHashes.retained);\n validateQA({qf:JSON.parse(qfRaw),retained:JSON.parse(retainedRaw),width,manifest,contract,qfRoot,retainedRoot,captureRunID:c.runID,captureAttempt:c.attempt});\n for(const [name,h]of Object.entries(receipt.boundedInputHashes))assert.equal(sha(fs.readFileSync(path.join(qfRoot,relative(name)))),h);\n}\nprocess.stdout.write(JSON.stringify({status:'PASS_PRODUCER_AND_RAW_QA',runID:c.runID,attempt:c.attempt,publisherSHA:c.publisherSHA}));\n"

def _sci_sha_bytes(raw): return hashlib.sha256(raw).hexdigest()
def _sci_need(ok, why):
    if not ok: raise ValueError(why)
def _sci_safe(name):
    p=pathlib.PurePosixPath(name)
    _sci_need(name and not p.is_absolute() and '..' not in p.parts and '\\' not in name and str(p)==name and all(x not in ('','.','..','.git') for x in name.split('/')), 'UNSAFE_PATH')
    return name

def _sci_hash_file(path,limit):
    _sci_need(path.stat().st_size<=limit, 'INPUT_COMPRESSED_OR_RAW_LIMIT')
    h=hashlib.sha256();total=0
    with path.open('rb') as source:
        while True:
            chunk=source.read(1024*1024)
            if not chunk:break
            total+=len(chunk);_sci_need(total<=limit, 'INPUT_GREW_BEYOND_LIMIT');h.update(chunk)
    return h.hexdigest()

def _sci_archive(path, digest, max_total):
    _sci_need(_sci_hash_file(path,600_000_000) == digest, 'ARCHIVE_DIGEST')
    result={}
    with zipfile.ZipFile(path) as z:
        _sci_need(sum(x.file_size for x in z.infolist()) <= max_total, 'ARCHIVE_LIMIT')
        _sci_need(max((x.file_size for x in z.infolist()),default=0)<=64_000_000, 'ENTRY_LIMIT')
        names=z.namelist();_sci_need(len(names)==len(set(names)), 'DUPLICATE_ENTRY')
        files={x.filename for x in z.infolist() if not x.is_dir()}
        directories={x.filename[:-1] for x in z.infolist() if x.is_dir()}
        _sci_need(not files.intersection(directories), 'ZIP_FILE_DIRECTORY_COLLISION')
        for name in files|directories:
            _sci_need(not any(str(parent) in files for parent in pathlib.PurePosixPath(name).parents if str(parent)!='.'), 'ZIP_FILE_ANCESTOR_COLLISION')
        for item in z.infolist():
            _sci_safe(item.filename[:-1] if item.is_dir() else item.filename);_sci_need(not stat.S_ISLNK(item.external_attr>>16), 'SYMLINK_ENTRY')
            if not item.is_dir(): result[item.filename]=z.read(item)
    return result

def _sci_verify_bundle(root, policy, request, candidate_source, candidate_manifest):
    root=pathlib.Path(root).resolve()
    _sci_need(policy.get('schema')=='source-ci-policy/1', 'POLICY_SCHEMA')
    _sci_need(policy.get('sourceSHA')==candidate_source, 'CANDIDATE_SOURCE')
    _sci_need(set(request)==set(policy['inputs']), 'EXACT_INPUTS')
    inputs={}
    for key, entry in request.items():
        # Exact paths and raw digests are frozen in the trusted policy, not caller data.
        _sci_need(entry==policy['inputs'][key], 'PINNED_INPUT '+key)
        path=(root/_sci_safe(entry['path'])).resolve();_sci_need(path.is_relative_to(root), 'ROOT_ESCAPE')
        limit={'build':100_000_000,'qa':600_000_000}.get(key,8_000_000)
        _sci_need(_sci_hash_file(path,limit)==entry['sha256'], 'RAW_HASH '+key);inputs[key]=path
    read=lambda key:json.loads(inputs[key].read_bytes())
    run, artifacts, ledger, manifest=map(read, ['run','artifacts','ledger','manifest'])
    repository={'id':1391122224,'full_name':'rrikunagasige-dot/kyotsu-step-web'}
    _sci_need(policy.get('repository')==repository and {k:run.get('repository',{}).get(k) for k in repository}==repository, 'EXACT_REPOSITORY_IDENTITY')
    _sci_need(run['id']==policy['runID'] and run['run_attempt']==policy['attempt'], 'RUN_ATTEMPT')
    _sci_need(run['head_sha']==policy['producerSHA'], 'REAL_PRODUCER_HEAD')
    _sci_need(run['head_branch']==policy['branch'] and run['path']==policy['workflow'] and run['event']=='push', 'RUN_IDENTITY')
    _sci_need(run['status']=='completed' and run['conclusion']=='success', 'RUN_SUCCESS')
    _sci_need(manifest['sourceSHA']==candidate_source and manifest['publisherSHA']==policy['producerSHA'], 'MANIFEST_SOURCE_PRODUCER')
    _sci_need(manifest['buildRunID']==str(run['id']) and manifest['attempt']==run['run_attempt'], 'MANIFEST_RUN')
    _sci_need(manifest['contractSHA256']==policy['contractSHA256'] and manifest['publisherFiles']==policy['publisherFiles'], 'EXACT_PUBLISHER_CONTRACT')
    _sci_need(all(policy['sourceManifest'].get(p)==h for p,h in candidate_manifest.items()), 'CANDIDATE_MANIFEST_COVERAGE')
    for path,h in policy['sourceManifest'].items():
        p=(root/_sci_safe(path)).resolve();_sci_need(p.is_relative_to(root), 'SOURCE_ESCAPE')
        _sci_need(_sci_hash_file(p,64_000_000)==h and policy['sourceManifest'].get(path)==h, 'CURRENT_SOURCE_BYTES')
    _sci_need(ledger['sourceSHA']==candidate_source and ledger['publisherSHA']==policy['producerSHA'], 'LEDGER_SOURCE_PRODUCER')
    _sci_need(ledger['runID']==str(run['id']) and ledger['attempt']==run['run_attempt'], 'LEDGER_RUN')
    _sci_need(ledger['distManifestSHA256']==_sci_sha_bytes(inputs['manifest'].read_bytes()), 'SEALED_MANIFEST')
    def pick(role):
        item=ledger[role+'Artifact'];matches=[a for a in artifacts['artifacts'] if a['id']==item['id']]
        _sci_need(set(item)=={'id','name','digest'} and len(matches)==1, 'EXACT_LEDGER_ARTIFACT_PROJECTION')
        actual=matches[0]
        _sci_need({k:actual[k] for k in ('id','name','digest')}==item, 'EXACT_API_ARTIFACT_IDENTITY')
        ar=actual['workflow_run']
        _sci_need(actual['expired'] is False and ar['id']==run['id'] and ar['head_sha']==run['head_sha'], 'ARTIFACT_RUN')
        _sci_need(ar['repository_id']==1391122224 and ar['head_repository_id']==1391122224 and ar['head_branch']==policy['branch'], 'ARTIFACT_REPOSITORY_BRANCH')
        _sci_need(actual['size_in_bytes']==inputs[role].stat().st_size, 'ARTIFACT_SIZE')
        _sci_need(actual['name']==policy[role+'ArtifactName'], 'ARTIFACT_NAME')
        _sci_need(actual['digest'].startswith('sha256:'), 'EXPLICIT_DIGEST')
        return actual['digest'][7:]
    build=_sci_archive(inputs['build'],pick('build'),policy['maxBuildBytes'])
    expected={'material/dist/'+_sci_safe(p):h for p,h in manifest['files'].items()}
    expected['sealed/DIST_MANIFEST.json']=_sci_sha_bytes(inputs['manifest'].read_bytes())
    _sci_need(set(build)==set(expected) and all(_sci_sha_bytes(build[p])==h for p,h in expected.items()), 'EXACT_BUILD_BYTES')
    qa=_sci_archive(inputs['qa'],pick('qa'),policy['maxQABytes'])
    receipts=ledger['receipts'];_sci_need(sorted(r['width'] for r in receipts)==policy['widths'], 'FOUR_WIDTHS')
    images={};reports=0
    def referenced(value, prefix):
        if isinstance(value,dict):
            if 'file' in value and 'sha256' in value:
                name=prefix+_sci_safe(value['file']);_sci_need(name in qa and _sci_sha_bytes(qa[name])==value['sha256'], 'REFERENCED_BYTES')
                if name.endswith('.png'):
                    _sci_need(qa[name].startswith(b'\x89PNG\r\n\x1a\n'), 'PNG_MAGIC');images[name]=_sci_sha_bytes(qa[name])
            for v in value.values():referenced(v,prefix)
        elif isinstance(value,list):
            for v in value:referenced(v,prefix)
    for receipt in receipts:
        width=receipt['width'];prefix=str(width)+'/'
        _sci_need(receipt['sourceSHA']==candidate_source and receipt['publisherSHA']==policy['producerSHA'], 'RECEIPT_SOURCE_PRODUCER')
        _sci_need(receipt['runID']==str(run['id']) and receipt['attempt']==run['run_attempt'] and receipt['status']=='PASS', 'RECEIPT_RUN')
        raw=qa[prefix+'QA_RECEIPT.json'];_sci_need(_sci_sha_bytes(raw)==ledger['receiptFiles'][str(width)] and json.loads(raw)==receipt, 'RECEIPT_BYTES')
        for kind,folder in [('qf','qf01'),('retained','w051-width')]:
            report_prefix=prefix+'qf01-qa/'+folder+'/'
            raw=qa[report_prefix+'REPORT.json'];_sci_need(_sci_sha_bytes(raw)==receipt['reportHashes'][kind], 'REPORT_HASH')
            report=json.loads(raw);_sci_need(report['sourceSHA']==candidate_source, 'REPORT_SOURCE')
            _sci_need(len(report['states'])==policy['counts'][kind+'States'] and len(report['images'])==policy['counts'][kind+'Images'], 'REPORT_COUNTS')
            referenced(report,report_prefix);reports+=1
        for path,h in (receipt.get('boundedInputHashes',{}) if policy.get('schemaVersion')=='qf01-r3-source-ci/1' else receipt['boundedInputHashes']).items():
            _sci_need(_sci_sha_bytes(qa[prefix+'qf01-qa/qf01/'+_sci_safe(path)])==h, 'BOUNDED_RAW_BYTES')
    _sci_need(images,'REAL_IMAGES_REQUIRED')
    _sci_verify_source_union(root,policy)
    _sci_verify_publisher_closure(root,policy)
    _sci_run_pinned_validator(root,policy,inputs,build,qa)
    # No stale receipt: recheck immutable inputs/current material/import closure after subprocess.
    _sci_verify_source_union(root,policy)
    _sci_verify_publisher_closure(root,policy)
    for key,entry in request.items():_sci_need(_sci_hash_file(inputs[key],{'build':100_000_000,'qa':600_000_000}.get(key,8_000_000))==entry['sha256'], 'INPUT_CHANGED_DURING_VALIDATION')
    for path,h in policy['sourceManifest'].items():_sci_need(_sci_hash_file(root/_sci_safe(path),64_000_000)==h, 'SOURCE_CHANGED_DURING_VALIDATION')
    return {'status':'PASS_SOURCE_BACKED_CI_BUNDLE',
            'canRegisterSourceCI':True, 'source_sha':candidate_source,
            'head_sha':run['head_sha'],'runID':run['id'],'attempt':run['run_attempt'],
            'qaArchiveSHA256':_sci_hash_file(inputs['qa'],600_000_000),'images':images,'reports':reports,
            'policySHA256':policy['_rawSHA256']}

_SOURCE_CI_OWNER='W-TECH-QF01-CAPTURE-P044-20261115'
_SOURCE_CI_POLICY_PATH='work/items/'+_SOURCE_CI_OWNER+'/SOURCE_CI_POLICY.json'
# R3 is separately opted in by a fixed publisher Work, never by caller paths.
_SOURCE_CI_R3_OWNER='W-TECH-QF01-PUBLISHER-P046-R3-20261116'
_SOURCE_CI_R3_CORE_PATHS=('workflow/runtime.py','workflow/adapters.py','workflow/contracts.py','workflow/integration.py','workflow/cli.py','workflow/requests.py','workflow/views.py','workflow/test_workflow.py','workflow/test_integration.py','workflow/test_legacy_diagnostics.py','workflow/test_production.py','tools/textbook/transformation/schema.mjs','tools/textbook/transformation/validate.mjs','tools/textbook/transformation/compile.mjs','tools/textbook/transformation/visible.mjs','workflow/INTEGRATION_RUNBOOK.md')
_SOURCE_CI_R3_POLICY_PATH='work/items/'+_SOURCE_CI_R3_OWNER+'/SOURCE_CI_POLICY.json'
_SOURCE_CI_R3_VALIDATOR_JS = r'''// Fixed R3 read-only validator. No browser, build, network or deploy.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const c=JSON.parse(fs.readFileSync(process.argv[2])),read=p=>JSON.parse(fs.readFileSync(p));
const checker=path.join(c.publisherRoot,'tools/release/qf01-publish-check.mjs'),browser=path.join(c.publisherRoot,'tools/release/qf01-browser.mjs');
Object.assign(process.env,{SOURCE_ROOT:c.materialRoot,CORE_ROOT:c.coreRoot,PUBLISHER_ROOT:c.publisherRoot,DIST_ROOT:path.join(c.buildRoot,'material/dist'),BUILD_AUTHORITY_CACHE:c.authorityCache});
const {assertContract,verifyDist,verifyCoreBinding,validateRevision3Producer,validateRevision3Matrix,validateRevision3QA,sha}=await import(pathToFileURL(checker));
const {verifyRevision3AssertionBody}=await import(pathToFileURL(browser));
const contract=assertContract(read(path.join(c.publisherRoot,'tools/release/qf01-publish-contract.json')));assert.equal(contract.qf01.revision,3);verifyRevision3AssertionBody(contract.r3AssertionBodySHA256);
const manifestPath=path.join(c.buildRoot,'sealed/DIST_MANIFEST.json'),manifestRaw=fs.readFileSync(manifestPath),manifest=JSON.parse(manifestRaw),ledger=read(c.ledger);
verifyCoreBinding({coreRoot:c.coreRoot,materialRoot:c.materialRoot,contract});
verifyDist({distRoot:path.join(c.buildRoot,'material/dist'),manifest,contract,contractRaw:fs.readFileSync(path.join(c.publisherRoot,'tools/release/qf01-publish-contract.json')),publisherSHA:c.publisherSHA,publisherRoot:c.publisherRoot});
validateRevision3Producer({run:read(c.run),artifacts:read(c.artifacts).artifacts,ledger,manifest,contract,manifestRaw,publisherSHA:c.publisherSHA,expectedRunID:c.runID,expectedAttempt:c.attempt});
validateRevision3Matrix({receipts:ledger.receipts,manifest,contract,manifestRaw});
for(const width of contract.expectedWidths){const prefix=path.join(c.qaRoot,String(width)),raw=fs.readFileSync(path.join(prefix,'QA_RECEIPT.json')),receipt=JSON.parse(raw);assert.deepEqual(receipt,ledger.receipts.find(r=>r.width===width));assert.equal(sha(raw),ledger.receiptFiles[String(width)]);const qfRoot=path.join(prefix,'qf01-qa/qf01'),retainedRoot=path.join(prefix,'qf01-qa/w051-width'),qfRaw=fs.readFileSync(path.join(qfRoot,'REPORT.json')),retainedRaw=fs.readFileSync(path.join(retainedRoot,'REPORT.json'));assert.equal(sha(qfRaw),receipt.reportHashes.qf);assert.equal(sha(retainedRaw),receipt.reportHashes.retained);validateRevision3QA({qf:JSON.parse(qfRaw),retained:JSON.parse(retainedRaw),width,manifest,contract,qfRoot,retainedRoot,sourceRoot:c.materialRoot,captureRunID:c.runID,captureAttempt:c.attempt});}
process.stdout.write(JSON.stringify({status:'PASS_PRODUCER_AND_RAW_QA',runID:c.runID,attempt:c.attempt,publisherSHA:c.publisherSHA}));
'''

def _sci_policy_path(owner):
    need(owner in (_SOURCE_CI_OWNER,_SOURCE_CI_R3_OWNER),'source_ci unregistered policy owner')
    return _SOURCE_CI_R3_POLICY_PATH if owner==_SOURCE_CI_R3_OWNER else _SOURCE_CI_POLICY_PATH

def _sci_r3_local(root,name):
    path=root/_sci_safe(name)
    need(not any(p.is_symlink() for p in [path,*path.parents] if p.is_relative_to(root)),'source_ci R3 lexical symlink')
    need(path.resolve().is_relative_to(root),'source_ci R3 root escape')
    return path

def _sci_load_r3(rt,work):
    from definitions import DEFINITION_HASH,instantiate
    from capabilities import implementation_hash
    s=rt.state(work);owner=rt.state(_SOURCE_CI_R3_OWNER);op=owner['plan'];policy_path=_SOURCE_CI_R3_POLICY_PATH
    need(work==_VT_WORK and not rt.integrity(s) and not rt.integrity(owner),'source_ci R3 current parent/owner integrity')
    need(op.get('profile')=='technical' and op.get('command')=='GOVERNANCE' and not op.get('workflow_version') and op.get('parent_work')==work,'source_ci R3 publisher parent')
    need(not op.get('simulation') or s['plan'].get('simulation'),'source_ci simulated R3 owner cannot authorize real material')
    need(s['definition_hash']==owner['definition_hash']==DEFINITION_HASH,'source_ci R3 current definitions')
    path=_sci_r3_local(rt.root,policy_path);need(policy_path in op['rules'],'source_ci R3 rules pin missing');raw=path.read_bytes();need(len(raw)<=8_000_000 and _sci_sha_bytes(raw)==op['rules'][policy_path],'source_ci R3 policy changed');policy=json.loads(raw);policy['_rawSHA256']=_sci_sha_bytes(raw)
    need(policy.get('schemaVersion')=='qf01-r3-source-ci/1','source_ci R3 explicit policy schema')
    need(policy.get('work')==work and policy.get('sourceSHA')==s['candidate_sha'],'source_ci R3 material source')
    need(policy.get('definitionHash')==DEFINITION_HASH and policy.get('implementationHash')==implementation_hash(rt),'source_ci R3 current service')
    need(policy.get('releaseUnit') in [u['id'] for u in s['plan']['release_units']] and s['release_versions'].get(policy['releaseUnit'])==s['candidate_sha'],'source_ci R3 release')
    seven={'.github/workflows/qf01-publisher-g3.yml','tools/release/qf01-publish-contract.json','tools/release/qf01-publish-check.mjs','tools/release/qf01-publish-check.test.mjs','tools/release/qf01-retained-adapters.mjs','tools/release/qf01-retained-adapters.test.mjs','tools/release/qf01-browser.mjs'}
    need(set(op['scope']['paths'])==seven and len(op['scope']['paths'])==7 and set(op['source_manifest'])==seven,'source_ci R3 exact seven publisher scope')
    need(op['source_manifest']==policy['ownerBeforeManifest'] and owner['candidate_manifest']==policy['ownerAfterManifest'] and set(policy['ownerAfterManifest'])==seven,'source_ci R3 publisher before/after binding')
    publisher=_sci_r3_local(rt.root,policy['publisherRoot'])
    need(manifest(publisher,seven)==policy['ownerAfterManifest']==policy['publisherFiles'],'source_ci R3 actual publisher after bytes')
    need(policy.get('ownerCandidateSHA')==owner['candidate_sha'] and policy.get('producerSHA')==owner['candidate_sha'] and owner['candidate_sha']!=s['candidate_sha'],'source_ci R3 producer is publisher candidate, distinct material')
    binding={'work':work,'sourceSHA':s['candidate_sha'],'releaseUnit':policy['releaseUnit']}
    need(op['proposal'].get('sourceCIPolicySHA256')==policy['_rawSHA256'] and op['proposal'].get('materialBinding')==binding,'source_ci R3 proposal binding')
    nodes=instantiate(op)
    for nid in ('S00_RECOVER','S01_ROUTE','T01_ANALYSIS','T02_APPROVAL','T03_BUILD'):need(rt.node_status(owner,nodes[nid])=='PASSED','source_ci R3 current publisher '+nid)
    approval=rt.approval(owner);result=rt.store.get(owner['results']['T02_APPROVAL']['artifact']);need(approval and approval.get('intent')=='approve_proposal' and result.get('user_event')==approval['id'],'source_ci R3 current approval')
    need(approval.get('verification_level')!='simulation' or s['plan'].get('simulation') and op.get('simulation'),'source_ci R3 simulation approval')
    patches=[e['payload'] for e in history_events(rt, 'complete', _SOURCE_CI_R3_OWNER) if e['kind']=='patch_applied'];need(len(owner['patches'])==1 and all(p.get('completed') and p.get('node')=='T03_BUILD' for p in owner['patches'].values()) and len(patches)==1 and patches[0]['after_manifest']==policy['ownerAfterManifest'],'source_ci R3 publisher patch once')
    core=rt.state(_VT_OWNER);need(set(core['candidate_manifest'])==set(_SOURCE_CI_R3_CORE_PATHS),'source_ci R3 exact sixteen core scope');_vt_owner(rt,s,_VT_OWNER,policy['coreResultRef']);need(core['candidate_sha']==policy['coreCandidateSHA'] and core['candidate_manifest']==policy['coreAfterManifest'],'source_ci R3 core owner binding')
    need(manifest(rt.root,core['candidate_manifest'])==policy['coreAfterManifest'],'source_ci R3 actual core bytes')
    loaded_root=pathlib.Path(__file__).resolve().parent.parent
    need(manifest(loaded_root,core['candidate_manifest'])==policy['coreAfterManifest'],'source_ci R3 loaded core code bytes')
    need(policy.get('widths')==[320,390,430,1440] and policy.get('counts')=={'qfStates':179,'qfImages':179,'retainedStates':2111,'retainedImages':43},'source_ci R3 coverage counts')
    need(policy.get('validatorSHA256')==_sci_sha_bytes(_SOURCE_CI_R3_VALIDATOR_JS.encode()),'source_ci R3 fixed validator')
    need(0<policy['maxBuildBytes']<=200_000_000 and 0<policy['maxQABytes']<=1_500_000_000,'source_ci R3 bounded archives')
    for name in ('materialRoot','coreRoot'):
        target=_sci_r3_local(rt.root,policy[name]);need(target.is_dir(),'source_ci R3 checkout missing')
    cache=policy['authorityCache'];target=_sci_r3_local(rt.root,cache['path']);need(target.is_file() and target.stat().st_mode&0o222==0 and _sci_hash_file(target,100_000_000)==cache['sha256'],'source_ci R3 read-only authority cache')
    policy['_ownerCandidateSHA']=owner['candidate_sha'];return s,policy


def _sci_load(rt,work,policy_work=None):
    if policy_work==_SOURCE_CI_R3_OWNER:return _sci_load_r3(rt,work)
    need(policy_work in (None,_SOURCE_CI_OWNER),'source_ci unregistered policy owner')
    from definitions import DEFINITION_HASH, instantiate
    from capabilities import implementation_hash
    s=rt.state(work);owner=rt.state(_SOURCE_CI_OWNER)
    _sci_hash_file(rt.root/_SOURCE_CI_POLICY_PATH,8_000_000)
    need(not rt.integrity(s) and not rt.integrity(owner), 'source_ci current material/owner integrity required')
    op=owner['plan'];need(not op.get('simulation') or s['plan'].get('simulation'), 'source_ci simulated owner cannot authorize real material')
    need(op.get('profile')=='technical' and op.get('command')=='GOVERNANCE' and not op.get('workflow_version') and op.get('parent_work')==work, 'source_ci exact technical parent required')
    need(owner['definition_hash']==s['definition_hash']==DEFINITION_HASH, 'source_ci current definitions required')
    need(_SOURCE_CI_POLICY_PATH in op['rules'], 'source_ci owner rules policy required')
    raw=(rt.root/_SOURCE_CI_POLICY_PATH).read_bytes()
    need(_sci_sha_bytes(raw)==op['rules'][_SOURCE_CI_POLICY_PATH], 'source_ci policy raw hash changed')
    policy=json.loads(raw);policy['_rawSHA256']=_sci_sha_bytes(raw)
    need(policy.get('work')==work and policy.get('sourceSHA')==s['candidate_sha'], 'source_ci Work/source mismatch')
    units=[u['id'] for u in s['plan']['release_units']]
    need(policy.get('releaseUnit') in units and s['release_versions'].get(policy['releaseUnit'])==s['candidate_sha'], 'source_ci release unit mismatch')
    need(policy.get('implementationHash')==implementation_hash(rt) and policy.get('definitionHash')==DEFINITION_HASH, 'source_ci exact current service required')
    need(op['scope']['paths']==['workflow/runtime.py','workflow/adapters.py'] and set(op['source_manifest'])==set(op['scope']['paths']), 'source_ci exact two-file API scope required')
    need(op['source_manifest']==policy['ownerBeforeManifest'] and owner['candidate_manifest']==policy['ownerAfterManifest'], 'source_ci exact before/after scope binding required')
    import runtime as loaded_runtime
    loaded={'workflow/runtime.py':_sci_sha_bytes(pathlib.Path(loaded_runtime.__file__).read_bytes()),'workflow/adapters.py':_sci_sha_bytes(pathlib.Path(__file__).read_bytes())}
    need(policy['ownerAfterManifest']==loaded, 'source_ci policy must pin actually loaded API code')
    need(isinstance(owner['candidate_sha'],str) and len(owner['candidate_sha'])==40 and all(c in '0123456789abcdef' for c in owner['candidate_sha']) and owner['candidate_sha']!=op['source_sha'], 'source_ci owner actual candidate required')
    need(policy.get('ownerCandidateSHA')==owner['candidate_sha'] and owner['candidate_sha']!=policy.get('producerSHA'), 'source_ci owner core candidate and image producer are distinct pinned identities')
    binding={'work':work,'sourceSHA':s['candidate_sha'],'releaseUnit':policy['releaseUnit']}
    need(op['proposal'].get('sourceCIPolicySHA256')==_sci_sha_bytes(raw) and op['proposal'].get('materialBinding')==binding, 'source_ci owner exact proposal/policy binding required')
    nodes=instantiate(op)
    for node in ('S00_RECOVER','S01_ROUTE','T01_ANALYSIS','T02_APPROVAL','T03_BUILD'):
        need(rt.node_status(owner,nodes[node])=='PASSED', 'source_ci current owner '+node+' required')
    approval=rt.approval(owner);result=rt.store.get(owner['results']['T02_APPROVAL']['artifact'])
    need(approval and result.get('user_event')==approval['id'] and approval.get('intent')=='approve_proposal', 'source_ci current real approval required')
    need(approval.get('verification_level')!='simulation' or s['plan'].get('simulation') and op.get('simulation'), 'source_ci simulated owner cannot authorize real material')
    patches=[p for p in owner['patches'].values() if p.get('completed') and p.get('node')=='T03_BUILD']
    need(len(patches)==1 and len(owner['patches'])==1, 'source_ci owner patch exactly once required')
    actual=[e['payload'] for e in history_events(rt, 'complete', _SOURCE_CI_OWNER) if e['kind']=='patch_applied']
    need(len(actual)==1 and actual[0]['after_manifest']==policy['ownerAfterManifest'], 'source_ci actual patch after manifest required')
    need(policy.get('widths')==[320,390,430,1440], 'source_ci fixed four widths required')
    need(policy.get('counts')=={'qfStates':124,'qfImages':124,'retainedStates':2111,'retainedImages':43}, 'source_ci frozen QF/retained counts required')
    need(0<policy['maxBuildBytes']<=200_000_000 and 0<policy['maxQABytes']<=1_500_000_000, 'source_ci bounded archive limits')
    policy['_ownerCandidateSHA']=owner['candidate_sha']
    return s,policy

def _sci_verify_source_union(root,policy):
    publisher=(root/_sci_safe(policy['publisherRoot'])).resolve()
    _sci_need(publisher.is_relative_to(root), 'SOURCE_CONTRACT_ROOT_ESCAPE')
    contract_path=publisher/'tools/release/qf01-publish-contract.json'
    _sci_need(_sci_hash_file(contract_path,8_000_000)==policy['contractSHA256'], 'SOURCE_CONTRACT_PIN')
    contract=json.loads(contract_path.read_bytes());declared={}
    for name in ('currentSourceFiles','currentPublicFiles','buildConfigFiles'):
        values=contract[name];_sci_need(isinstance(values,dict), 'SOURCE_CONTRACT_MAP')
        for path,h in values.items():
            _sci_safe(path);_sci_need(path not in declared or declared[path]==h, 'SOURCE_CONTRACT_CONFLICT');declared[path]=h
    prefix=policy.get('sourcePrefix','')
    if prefix:_sci_safe(prefix)
    full={(prefix+'/' if prefix else '')+path:h for path,h in declared.items()}
    _sci_need(policy['sourceManifest']==full, 'EXACT_CONTRACT_SOURCE_PUBLIC_CONFIG_UNION')
    base=root/prefix
    actual=set()
    for directory in ('src','public'):
        folder=base/directory
        if folder.exists():
            _sci_need(not folder.is_symlink(), 'SOURCE_TREE_SYMLINK')
            for path in folder.rglob('*'):
                _sci_need(not path.is_symlink(), 'SOURCE_TREE_SYMLINK')
                if path.is_file():actual.add(path.relative_to(base).as_posix())
    expected={p for p in declared if p.startswith(('src/','public/'))}
    _sci_need(actual==expected, 'EXACT_CURRENT_SRC_PUBLIC_INVENTORY')

def _sci_verify_publisher_closure(root,policy):
    publisher=(root/_sci_safe(policy['publisherRoot'])).resolve()
    _sci_need(publisher.is_relative_to(root), 'PUBLISHER_ROOT_ESCAPE')
    contract_path=publisher/'tools/release/qf01-publish-contract.json'
    _sci_need(_sci_hash_file(contract_path,8_000_000)==policy['contractSHA256'], 'EXACT_CONTRACT_CLOSURE_PIN')
    contract=json.loads(contract_path.read_bytes())
    names={'.github/workflows/qf01-publisher-g3.yml','tools/release/qf01-publish-contract.json','tools/release/qf01-publish-check.mjs','tools/release/qf01-retained-adapters.mjs','tools/release/qf01-browser.mjs','tools/release/qf01-publish-check.test.mjs','tools/release/qf01-retained-adapters.test.mjs'}
    _sci_need(set(policy['publisherFiles'])==names and set(contract['technicalPaths'])==names and len(contract['technicalPaths'])==7, 'EXACT_PUBLISHER_IMPORT_CLOSURE_KEYS')
    for name,h in policy['publisherFiles'].items():
        path=(publisher/_sci_safe(name)).resolve();_sci_need(path.is_relative_to(publisher), 'PUBLISHER_CLOSURE_ESCAPE')
        _sci_need(_sci_hash_file(path,8_000_000)==h, 'PUBLISHER_CLOSURE_BYTES_CHANGED')

def _sci_run_pinned_validator(root,policy,inputs,build,qa):
    validator=_SOURCE_CI_R3_VALIDATOR_JS if policy.get('schemaVersion')=='qf01-r3-source-ci/1' else _SOURCE_CI_VALIDATOR_JS
    _sci_need(_sci_sha_bytes(validator.encode())==policy['validatorSHA256'], 'PINNED_VALIDATOR')
    publisher=(root/_sci_safe(policy['publisherRoot'])).resolve();_sci_need(publisher.is_relative_to(root), 'PUBLISHER_ROOT_ESCAPE')
    # Entire seven-file publisher closure is fixed; imported browser/adapter cannot drift.
    for path,h in policy['publisherFiles'].items():
        target=(publisher/_sci_safe(path)).resolve();_sci_need(target.is_relative_to(publisher), 'PUBLISHER_FILE_ESCAPE')
        _sci_need(_sci_hash_file(target,8_000_000)==h, 'PUBLISHER_IMPORT_CLOSURE')
    _sci_need(policy['publisherFiles'].get('tools/release/qf01-publish-contract.json')==policy['contractSHA256'], 'CONTRACT_PIN')
    node=shutil.which('node');_sci_need(node is not None, 'NODE_REQUIRED')
    # Only temporary extraction and fixed verification subprocesses; no build/browser/deploy.
    with tempfile.TemporaryDirectory(prefix='source-ci-verify-') as temp:
        base=pathlib.Path(temp)
        runner=base/'source_ci_validate.mjs';runner.write_text(validator)
        for folder,entries in [('build',build),('qa',qa)]:
            for name,blob in entries.items():
                target=base/folder/_sci_safe(name);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(blob)
        config={'publisherRoot':str(publisher),'buildRoot':str(base/'build'),'qaRoot':str(base/'qa'),
                'run':str(inputs['run']),'artifacts':str(inputs['artifacts']),'ledger':str(inputs['ledger']),
                'buildArchive':str(inputs['build']),'qaArchive':str(inputs['qa']),
                'publisherSHA':policy['producerSHA'],'runID':str(policy['runID']),'attempt':policy['attempt']}
        if policy.get('schemaVersion')=='qf01-r3-source-ci/1':
            config.update(materialRoot=str(_sci_r3_local(root,policy['materialRoot'])),coreRoot=str(_sci_r3_local(root,policy['coreRoot'])),authorityCache=str(_sci_r3_local(root,policy['authorityCache']['path'])))
        config_path=base/'config.json';config_path.write_text(json.dumps(config))
        proc=subprocess.run([node,str(runner),str(config_path)],cwd=base,
                            env={'PATH':os.environ.get('PATH',''),'LANG':'C.UTF-8'},capture_output=True,text=True,timeout=300)
        _sci_need(proc.returncode==0, 'PINNED_FULL_QA_FAILED '+proc.stderr[-600:])
        result=json.loads(proc.stdout)
        _sci_need(result=={'status':'PASS_PRODUCER_AND_RAW_QA','runID':str(policy['runID']),'attempt':policy['attempt'],'publisherSHA':policy['producerSHA']}, 'VALIDATOR_RESULT_BINDING')

def source_ci_verify(rt,work,data):
    need(isinstance(data,dict) and set(data)=={'policy_work'} and data['policy_work'] in (_SOURCE_CI_OWNER,_SOURCE_CI_R3_OWNER), 'source_ci caller cannot supply source/policy/receipt')
    owner_work=data['policy_work']
    try:
        s,policy=_sci_load(rt,work,owner_work)
        result=_sci_verify_bundle(rt.root,policy,policy['inputs'],s['candidate_sha'],s['candidate_manifest'])
        latest,again=_sci_load(rt,work,owner_work)
        need(again==policy and latest['candidate_manifest']==s['candidate_manifest'], 'source_ci input changed during validation')
        result.update(policy_path=_sci_policy_path(owner_work),policy_work=owner_work,ownerCandidateSHA=policy['_ownerCandidateSHA'],work=work,releaseUnit=policy['releaseUnit'])
        return result
    except (ValueError,KeyError,OSError,subprocess.SubprocessError,zipfile.BadZipFile) as e:
        raise Rejected('source_ci verification failed: '+str(e)) from e

def _sci_registered(rt,work,ref):
    s=rt.state(work);e=s['evidence'].get(ref,{})
    need(e.get('kind')=='source_ci', 'same Work registered source_ci required')
    fresh=source_ci_verify(rt,work,{'policy_work':e.get('data',{}).get('policy_work')})
    need(fresh==e['data'], 'source_ci proof changed after registration')
    return fresh

def source_ci_verify_capture(rt,work,data):
    proof=_sci_registered(rt,work,data.get('source_ci_ref'))
    need(data.get('ci_ref')==data['source_ci_ref'] and data.get('source_sha')==proof['source_sha'] and data.get('producer_head_sha')==proof['head_sha'], 'source-backed capture version mismatch')
    need(data.get('artifact_sha256')==proof['qaArchiveSHA256'], 'source-backed capture _sci_archive mismatch')
    entries=data.get('image_entries',{});files=data.get('files',{})
    need(entries and set(entries)==set(files), 'source-backed capture exact image mapping required')
    for path,entry in entries.items():
        _sci_safe(path);_sci_safe(entry)
        need(proof['images'].get(entry)==files[path], 'capture entry is not original verified PNG')
        p=(rt.root/path).resolve();need(p.is_relative_to(rt.root), 'capture path escapes root')
        need(p.is_file() and _sci_sha_bytes(p.read_bytes())==files[path], 'capture PNG original bytes changed')
    return proof

def source_ci_verify_evidence_chain(rt,work,ref):
    s=rt.state(work);e=s['evidence'].get(ref,{})
    if e.get('kind')=='source_ci':_sci_registered(rt,work,ref)
    elif e.get('kind')=='capture' and e['data'].get('source_ci_ref'):source_ci_verify_capture(rt,work,e['data'])
    elif e.get('kind')=='screenshot':
        capture=s['evidence'].get(e['data'].get('capture_ref'),{})
        if capture.get('kind')=='capture' and capture['data'].get('source_ci_ref'):
            source_ci_verify_capture(rt,work,capture['data'])
            need(capture['data']['files'].get(e['data']['path'])==e['data']['sha256'] and e['data'].get('source_sha')==capture['data']['source_sha'], 'screenshot not original source-backed capture')

def source_ci_import_capture(rt,work,zip_path,ci_ref,destination):
    proof=_sci_registered(rt,work,ci_ref);s,policy=_sci_load(rt,work,proof['policy_work'])
    archive_path=rt.root/policy['inputs']['qa']['path']
    need(pathlib.Path(zip_path).resolve()==archive_path.resolve(), 'only original QA _sci_archive may be imported')
    _sci_safe(destination);lexical=rt.root/destination
    need(not any(p.is_symlink() for p in [lexical,*lexical.parents] if p.is_relative_to(rt.root)), 'capture destination lexical symlink forbidden')
    dest=lexical.resolve()
    need(dest.is_relative_to(rt.root) and not dest.exists(), 'capture requires fresh bounded destination')
    need(not any(p.is_symlink() for p in [dest.parent,*dest.parents]), 'capture destination symlink forbidden')
    # Validate all proof before writing, stage full PNG set then atomic rename.
    paths={destination+'/'+entry:h for entry,h in proof['images'].items()}
    entries={destination+'/'+entry:entry for entry in proof['images']}
    with zipfile.ZipFile(archive_path) as z:
        blobs={entry:z.read(entry) for entry in proof['images']}
    need(all(_sci_sha_bytes(blob)==proof['images'][entry] and blob.startswith(b'\x89PNG\r\n\x1a\n') for entry,blob in blobs.items()), 'capture bytes changed before import')
    dest.parent.mkdir(parents=True,exist_ok=True)
    stage=pathlib.Path(tempfile.mkdtemp(prefix='.source-ci-stage-',dir=dest.parent))
    renamed=False;append_head=None
    try:
        for entry,blob in blobs.items():
            p=stage/entry;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(blob)
        need(not dest.exists(), 'capture destination appeared')
        os.rename(stage,dest);renamed=True
        data={'ci_ref':ci_ref,'source_ci_ref':ci_ref,'source_sha':proof['source_sha'],'producer_head_sha':proof['head_sha'],
              'artifact_sha256':proof['qaArchiveSHA256'],'files':paths,'image_entries':entries}
        append_head=rt.store.head
        return rt.evidence(work,'capture',data,source_ref='source-ci-artifact:'+proof['qaArchiveSHA256'],verification_level='local_execution')
    except BaseException:
        if stage.exists():shutil.rmtree(stage)
        # This importer created the previously nonexistent destination; remove only its own files on failure.
        if renamed and dest.exists() and (append_head is None or rt.store.head==append_head):shutil.rmtree(dest)
        raise

# P046-R3だけの明示opt-in。通常patch/resolve/adoptの契約は変更しない。
_VT_WORK = 'W-MATH-QF01-FULL-RELEASE-P035-20261115'
_VT_OWNER = 'W-TECH-QF01-VERSION-TRANSITION-P046-R3-20261116'
_VT_SOURCE = '1f10ecbcd088ca8636932c8df4c7b85293777efc'
_VT_BASE = '9e6d6798ac40624373db0a87e53e7d8938fb317a'


def _vt_json_evidence(rt, state, ref, limit=1_048_576):
    """正規file証拠の現bytesを読み、重複key/非有限値/サイズ超過を拒否。"""
    evidence = state['evidence'].get(ref, {})
    need(evidence.get('kind') == 'file', '版移行のfile証拠がない')
    path = file(rt.root, evidence['data']['path'])
    need(path.stat().st_size <= limit, '版移行JSONの上限超過')
    raw = path.read_bytes()
    need(hashlib.sha256(raw).hexdigest() == evidence['data']['sha256'], '版移行証拠が変化した')
    def pairs(items):
        result = {}
        for key, value in items:
            need(key not in result, '版移行JSONの重複key')
            result[key] = value
        return result
    def invalid(value):
        raise ValueError('版移行JSONの非有限値:' + value)
    return json.loads(raw, object_pairs_hook=pairs, parse_constant=invalid), evidence['data']['sha256']


def _vt_owner(rt, state, owner_work, owner_result_ref):
    from definitions import instantiate, DEFINITION_HASH
    need(owner_work == _VT_OWNER, '登録外の技術owner')
    owner = rt.state(owner_work)
    need(owner['plan']['profile'] == 'technical', '版移行ownerが技術Workでない')
    need(not owner['plan'].get('simulation') or state['plan'].get('simulation'), '模擬ownerを実教材へ接続しない')
    need(owner['definition_hash'] == DEFINITION_HASH, 'ownerの定義が現在と違う')
    nodes = instantiate(owner['plan'])
    for nid in ('S00_RECOVER','S01_ROUTE','T01_ANALYSIS','T02_APPROVAL','T03_BUILD','T04_VERIFY'):
        need(nid in nodes and rt.node_status(owner, nodes[nid]) == 'PASSED', 'ownerの現工程が未完了:' + nid)
    need(owner['results']['T04_VERIFY']['artifact'] == owner_result_ref, '別のowner検証結果')
    need(rt.approval(owner), 'ownerの現在の承認がない')
    need(not rt.integrity(owner),'ownerの実current bytesが違う')
    protected=owner['plan'].get('protected_manifest',{})
    need(isinstance(protected,dict) and protected and manifest(rt.root,protected)==protected,'技術ownerの共同protected bytesが違う')
    parent_scope=set(state['plan']['scope']['paths']);owner_scope=set(owner['plan']['scope']['paths'])
    need(not (parent_scope|owner_scope)&set(protected),'親の正規変更範囲をT継続protectedへ混在させない')
    need(all(protected.get(path)==value for path,value in state['plan'].get('protected_manifest',{}).items()),'親scope外appの共同保護が不足')
    other_workflow={path.relative_to(rt.root).as_posix() for path in (rt.root/'workflow').rglob('*') if path.is_file() and path.suffix in ('.py','.md') and path.relative_to(rt.root).as_posix() not in owner_scope}
    need(other_workflow<=set(protected),'scope外workflowの保護が不足')
    binding=owner['plan']['proposal'].get('materialBinding',{})
    need(binding=={'work':_VT_WORK,'originPlanSourceSHA':_VT_SOURCE,'materialBaseSHA':_VT_BASE,'scopeHash':state['plan']['proposal']['scopeBindingHash']},'Tのmaterial共同保護bindingが違う')

    return owner


def _vt_source_git(rt, proof, expected):
    need(proof.get('sourceSHA') == _VT_BASE and proof.get('repositoryId') == 1391122224 and proof.get('owner') == 'rrikunagasige-dot' and proof.get('repository') == 'kyotsu-step-web', '元Gitのidentityが違う')
    repo = Path(proof.get('gitRoot', ''))
    need(repo.is_absolute() and repo.resolve() == repo and repo.is_dir(), '元Gitルートが不正')
    env = dict(os.environ, GIT_NO_LAZY_FETCH='1', GIT_OPTIONAL_LOCKS='0')
    def git(*args):
        return subprocess.check_output(['git','-C',str(repo),*args], env=env, timeout=15)
    need(git('cat-file','-t',_VT_BASE).strip() == b'commit', '元Git commitがない')
    rows = git('ls-tree','-r','-z',_VT_BASE,'--',*sorted(expected)).split(b'\0')
    entries = {}
    for row in rows:
        if not row: continue
        metadata, name = row.split(b'\t', 1); mode, kind, blob = metadata.decode().split()
        path = name.decode(); relative(path)
        need(mode in ('100644','100755') and kind == 'blob' and path not in entries, '元Gitの型/重複が不正')
        entries[path] = blob
    need(set(entries) == set(expected), '元Git pathの欠落/余剰')
    for path, value in expected.items():
        raw = file(rt.root, path).read_bytes()
        need(hashlib.sha256(raw).hexdigest() == value, 'current preimageが違う:' + path)
        need(hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest() == entries[path], 'current bytesがsource9eのGit blobでない:' + path)


def prepare_version_transition(rt, work, policy_ref, design_ref, approval_event_ref, owner_work,
                               owner_result_ref, base_candidate_sha, base_manifest_hash,
                               source_git_proof_ref, evidence_refs, expected_store_head):
    """旧原物を保持し、承認正本とT04の実導出だけで拡張を準備する。"""
    import copy
    from definitions import DEFINITION_HASH
    from capabilities import implementation_hash
    from integration import bundle_fingerprint
    from contracts import transition_sources
    s = rt.state(work); p = s['plan']
    need(work == _VT_WORK and p['proposal']['id'] == 'P046-R3-20261116', '登録外の版移行')
    need(rt.store.head == expected_store_head and not s['claims'] and (not s.get('version_transition') or s['version_transition'].get('status') in ('NOT_EXECUTED','RESTORED')), '版移行のHEAD/実行中/二重準備')
    need(not rt.integrity(s) and not any(not v.get('completed') for v in s['patches'].values()) and not any(not v.get('outcome') for v in s['external'].values()), '版移行前の未確定状態')
    fresh_implementation=_vt_fresh_implementation(rt)
    need(p['source_sha'] == _VT_SOURCE and s['candidate_sha'] == base_candidate_sha == _VT_BASE, '原sourceとcurrent候補を混同しない')
    need(digest(s['candidate_manifest']) == base_manifest_hash, 'current manifestが違う')
    approval = rt.approval(s)
    need(approval and approval['id'] == approval_event_ref, '現在の具体案の承認がない')
    spec, spec_hash = _vt_json_evidence(rt,s,policy_ref)
    need(spec_hash == p['proposal']['transitionPolicySpecificationHash'] and spec.get('proposalId') == p['proposal']['id'], '承認された技術仕様でない')
    need(len(p['blocks'])==1 and p['blocks'][0]['id']=='qf01-full-lesson','登録外のblock分割')
    owner = _vt_owner(rt,s,owner_work,owner_result_ref)
    result = rt.store.get(owner_result_ref)
    need(design_ref in result.get('evidence_refs', []), 'T04に結合していない導出結果')
    derivation, _ = _vt_json_evidence(rt,owner,design_ref)
    need(derivation.get('schemaVersion') == 'p046-r3-derived-transition/1', '導出結果の型が違う')
    expected = {'proposalHash':p['proposal']['hash'],'scopeHash':p['proposal']['scopeBindingHash'],
                'specificationHash':spec_hash,'originPlanSourceSHA':_VT_SOURCE,'baselineCandidateSHA':_VT_BASE,
                'ownerCandidateSHA':owner['candidate_sha'],'definitionHash':DEFINITION_HASH,'beforeService':implementation_hash(rt)}
    need(all(derivation.get(k) == v for k,v in expected.items()), 'T04実導出と現在版が違う')
    scope, scope_hash = _vt_json_evidence(rt,s,derivation['scopeEvidenceRef'])
    need(scope_hash == expected['scopeHash'] and scope.get('sourceSHA') == _VT_BASE, '承認scope原物が違う')
    allowed = {path for values in scope['groups'].values() for path in values}
    owner_paths=set(scope['groups']['技術T既存Python']+scope['groups']['技術T既存試験']+scope['groups']['既存生成ツール']+scope['groups']['技術T既存runbook'])
    need(len(owner_paths)==16 and set(owner['plan']['scope']['paths'])==set(owner['plan']['source_manifest'])==set(owner['candidate_manifest'])==owner_paths,'技術ownerの承認16pathと収録が違う')
    need(set(p['scope']['paths']) <= allowed, '現在scopeが承認原物を超える')
    existing = derivation['existingBefore']; outputs = derivation['newOutputs']
    need(isinstance(existing,dict) and existing and isinstance(outputs,dict) and set(existing).isdisjoint(outputs), '導出pathの重複/型が不正')
    need(set(existing) | set(outputs) == set(p['scope']['paths']), '教材scopeの導出coverage不足/余剰')
    absent = set(scope['expectedAbsent'])
    need(set(outputs) == absent.intersection(p['scope']['paths']), '新規pathの登録が違う')
    for path, row in outputs.items():
        target = file(rt.root,path)
        need(not target.exists() and not target.is_symlink(), 'expectedAbsentの衝突:' + path)
        need(row['block'] in {b['id'] for b in p['blocks']} and isinstance(row['afterSHA256'],str) and len(row['afterSHA256']) == 64, '新規出力の結合が不正')
    git_proof, _ = _vt_json_evidence(rt,s,source_git_proof_ref)
    _vt_source_git(rt,git_proof,existing)
    need(owner['plan']['proposal'].get('materialPreimages')==existing and set(owner['plan']['proposal'].get('materialExpectedAbsent',[]))==set(outputs),'T04の親before/不存在履歴が違う')
    # 実行instanceは正規compilerで再生成。callerのcompiled自己申告を使わない。
    compile_input,compile_raw = _vt_compile_input(rt,derivation['compileInputRef'])
    need(len(canonical(compile_input)) <= 20_000_000, 'compile入力の上限超過')
    proc = subprocess.run(['node',str(rt.root/'tools/textbook/operations.mjs'),'construction-compile'], input=compile_raw, capture_output=True, cwd=rt.root, timeout=60)
    need(proc.returncode == 0 and len(proc.stdout) <= 20_000_000, '正規compilerの実行失敗/上限超過')
    compiled_result = json.loads(proc.stdout)
    need(compiled_result.get('status') == 'PASS', '正規compilerが未対応/不合格')
    compiled = compiled_result['compiled']
    need(digest(compiled_result) == derivation['compiledResultRef'], 'T04と新しいcompile結果が違う')
    patch = rt.store.get(derivation['materialPatchRef'])
    expected_after = {x['path']:x['after_sha256'] for x in patch.get('files',[])}
    need(len(expected_after) == len(patch.get('files',[])) and set(expected_after) <= set(existing) | set(outputs) and set(outputs) <= set(expected_after), '導出patchのpathが違う')
    need(all(expected_after[path] == row['afterSHA256'] for path,row in outputs.items()), '新outputのafter hashが違う')
    total_after=0
    for change in patch['files']:
        raw=change['after_text'].encode();total_after+=len(raw)
        need(total_after<=20_000_000 and hashlib.sha256(raw).hexdigest()==change['after_sha256'],'実patch bytes/上限が違う')
        need(change.get('before_sha256')==(existing.get(change['path'])),'実beforeまたはexpectedAbsentが違う')
    materialization=_vt_validate_qf_materialization(rt,patch,compile_input['transformationPlan'],compiled)

    new = copy.deepcopy(p)
    extension = {'schemaVersion':'version-transition-source/1','preparedProof':digest(derivation),'originSourceSHA':_VT_SOURCE,
                 'baselineCandidateSHA':_VT_BASE,'existing':existing,'outputs':outputs,
                 'existingOutputBindings':{path:{'block':p['blocks'][0]['id'],'beforeSHA256':value} for path,value in existing.items() if path not in p['source_manifest']}}
    new['source_extension'] = extension
    for block in new['blocks']:
        block['output_paths'] = sorted([path for path,row in outputs.items() if row['block'] == block['id']]+[path for path,row in extension['existingOutputBindings'].items() if row['block']==block['id']])
        block['patch_hash'] = derivation['materialPatchRef']
        for key, field in (('content_design_hash','irHash'),('construction_design_hash','constructionDesignHash'),('layout_design_hash','layoutDesignHash'),('learner_copy_hash','learnerCopyHash')):
            value = compiled.get(field)
            need(isinstance(value,str) and len(value)==64, '実生成契約hashが不足:' + field)
            block[key] = value
    inventory=copy.deepcopy(p.get('impact_inventory',[{'block_id':b['id'],'artifact':path,'version':p['source_sha']} for b in p['blocks'] for path in b['sources']]))
    registered={row['artifact'] for row in inventory}
    for row in inventory:
        if row['artifact'] in existing:row.update(currentBaselineSHA=_VT_BASE,currentPreimageSHA256=existing[row['artifact']])
    for path in sorted((set(existing)|set(outputs))-registered):
        inventory.append({'block_id':'qf01-full-lesson','artifact':path,'version':_VT_BASE,'currentBaselineSHA':_VT_BASE,'preimageAbsent':path in outputs,**({'currentPreimageSHA256':existing[path]} if path in existing else {})})
    new['impact_inventory']=inventory
    new['audit_inventory']=copy.deepcopy(inventory)
    new['proposal']['patch_hash'] = derivation['materialPatchRef']
    plan_check(new); transition_sources(new)
    rt.fingerprint_refs(s,evidence_refs); need(evidence_refs,'版移行準備の根拠がない')
    need(rt.store.head == expected_store_head, '検査中に台帳が進んだ')
    from requests import _receipt_origin_snapshot
    origin_intake_snapshot=_receipt_origin_snapshot(rt)
    archive = rt.store.put({'plan':p,'candidate_manifest':s['candidate_manifest'],'results':s['results'],'users':s['users'],'block_contexts':s.get('block_contexts',{}),'originSourceSHA':_VT_SOURCE})
    transition = {'schemaVersion':'version-transition/1','policy_ref':policy_ref,'derivation':derivation,'derivationDigest':digest(derivation),
                  'owner_work':owner_work,'owner_result_ref':owner_result_ref,'owner_manifest_hash':digest(owner['candidate_manifest']),'owner_scope_hash':digest(owner['plan']['scope']),'origin_intake_snapshot':origin_intake_snapshot,'sourceGitProof':git_proof,'archive':archive,'existing':existing,'outputs':outputs,
                  'materialization':materialization,'patchHash':derivation['materialPatchRef'],'afterManifest':expected_after,'beforeManifest':s['candidate_manifest'],
                  'approval_event_ref':approval_event_ref,'base_candidate_sha':_VT_BASE,'status':'PREPARED'}
    source_context=rt.store.put({'schemaVersion':'version-transition-source-context/1','originalSourceSHA':_VT_SOURCE,'originalManifest':p['source_manifest'],'currentBaselineSHA':_VT_BASE,'currentPreimages':existing,'preparedProof':digest(transition)})
    prepared_event=rt.append('version_transition_prepared',work,{'plan':new,'transition':transition,'source_context':source_context})
    current = rt.state(work)
    rt.append('approval_coverage_migrated',work,{'user_event':approval_event_ref,'approved_bundles':{b['id']:bundle_fingerprint(current,b) for b in new['approval_bundles']},'evidence_refs':evidence_refs,'version_transition_proof':digest(transition)})
    proof_evidence=rt.evidence(work,'check',{'status':'PASS','source_sha':_VT_BASE,'checks':['SOURCE9E_GIT_PREIMAGES','EXPECTED_ABSENT_OUTPUTS','CANONICAL_COMPILE_BINDING','LEGACY_R2_BYTE_ARCHIVE']},source_ref=prepared_event['hash'],verification_level='local_execution')
    return {'transition_ref':digest(transition),'archive':archive,'proof_evidence':proof_evidence,'requiredRechecks':rt.next(work)}


def _vt_strict_json(raw):
    def pairs(items):
        out={}
        for key,value in items:
            need(key not in out,'版移行JSONの重複key')
            out[key]=value
        return out
    def invalid(value):raise ValueError('版移行JSONの非有限値:'+value)
    return json.loads(raw,object_pairs_hook=pairs,parse_constant=invalid)


def _vt_validate_qf_materialization(rt, patch, transform, compiled=None):
    """実afterを承認正本へ逆照合。任意の新ID許可表やafterhashを意味照合の代りにしない。"""
    prefix='src/data/textbook/math/quadratic/'
    after={x['path']:x['after_text'] for x in patch['files']}
    names=('qf01Unit.json','qf01Presentation.json','qf01ReadingPresentation.json','qf01Revision2Archive.json')
    need(all(prefix+n in after for n in names),'版移行の四JSONが不足')
    unit,presentation,meta,archive=[_vt_strict_json(after[prefix+n]) for n in names]
    full=transform['canonical']['fullLesson'];interactions=transform['canonical']['interactions']['interactions']
    old=json.loads(file(rt.root,prefix+'qf01Unit.json').read_text())
    need(old['unitId']==unit['unitId']=='math-quadratic-qf01' and old['revision']==2 and unit['revision']==3,'QF以外または改訂の混同')
    flatten=lambda u:[x for section in u['sections'] for x in section['items']]
    old_items={x['id']:x for x in flatten(old)};items=flatten(unit);item_map={x['id']:x for x in items}
    expected_ids=[i['id'] for i in interactions]
    need(len(items)==len(item_map)==35 and set(item_map)==set(expected_ids) and unit['requiredInteractionRefs']==expected_ids,'必須35の欠落・重複・余剰')
    keys=('id','answer','answerType','acceptedAnswers','choices')
    need(len(old['requiredInteractionRefs'])==24 and set(old['requiredInteractionRefs'])<=set(item_map),'旧24が欠落')
    for name in old['requiredInteractionRefs']:
        need({k:old_items[name].get(k) for k in keys}=={k:item_map[name].get(k) for k in keys},'旧24の採点変更:'+name)
    for interaction in interactions:
        item=item_map[interaction['id']]
        need(item['answer']==interaction['correct'] and item['choices']==interaction['choices'],'著者判断と実採点が違う:'+item['id'])
    blocks=[b for section in unit['sections'] for b in section.get('readingFlow',[])]
    need(len(blocks)==169 and len({b['id'] for b in blocks})==169,'保存blockの欠落・重複')
    need([b['id'] for b in blocks[:134]]==[b['id'] for b in full['blocks']]==meta['canonicalBlockIds'],'正本134の順序・範囲')
    for authored,actual in zip(full['blocks'],blocks[:134]):
        need(actual['type']==authored['type'],'正本block種別')
        if authored['type'] in ('paragraph','formula'):
            expected=[dict(part,semanticId=authored['id']+'-part-'+str(j)) for j,part in enumerate(authored['parts'])]
            need(actual.get('parts')==expected,'本文・数式の正本不一致:'+authored['id'])
        elif authored['type']=='marker':need(actual.get('text')==authored['text'],'見出し本文の正本不一致')
        elif authored['type']=='figure':need(actual.get('figureId')==authored['figureId'],'図の参照が違う')
        else:need(False,'未知の正本block')
    figure_policy=transform['presentation']['FIGURE_POLICY.json']['value']
    origin=figure_policy['originRef'];render=figure_policy['renderAsset']
    need(sha(file(rt.root,origin['asset']))==origin['sha256'],'元SVGの不変保護がない')
    need(render in after and hashlib.sha256(after[render].encode()).hexdigest()==figure_policy['provenance']['設計見本SHA256'],'承認variant実bytesが違う')
    authored_figures=[b for b in full['blocks'] if b['type']=='figure'];figures=[f for section in unit['sections'] for f in section.get('figures',[])]
    need(len(authored_figures)==len(figures)==1,'図の欠落/余剰')
    given=authored_figures[0]
    need(figures[0]=={'id':given['figureId'],'src':render.removeprefix('public/'),'alt':given['alt'],'caption':given['caption'],'overlays':[]},'表示variant/alt/captionの正本不一致')
    need([b['id'] for b in blocks[134:]]==[i+'-registry' for i in expected_ids],'登録専用IDの混同')
    registry=meta['interactionRegistryBlocks']
    need(len(registry)==35 and {r['blockId'] for r in registry}=={i+'-registry' for i in expected_ids} and all(r['channel']=='interaction-registry-only' and r['render'] is False for r in registry),'登録専用blockを本文へ流さない')
    need(meta['schemaVersion']=='qf01-reading-presentation/3' and meta['revision']==3 and meta['mixedCanonical']=='qf01-r3/1','実表示metadataの型')
    compact_hash=lambda value:hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    need(meta['blockVisibility']==transform['canonical']['interactions']['blockVisibility'] and meta['noninteractiveReuse']==transform['canonical']['interactions']['noninteractiveReuse'],'解禁・旧n20再利用の正本不一致')
    need(set(meta['viewContracts'])=={name.removesuffix('.json') for name in transform['presentation']},'view契約の過不足')
    need(meta['authorSource']['fullLessonRawSHA256']==transform['canonical']['fullLessonRawSHA256'] and meta['authorSource']['interactionsRawSHA256']==transform['canonical']['interactionsRawSHA256'] and meta['authorSource']['originSHA']==_VT_BASE and meta['authorSource']['fullLessonHeader']=={k:v for k,v in full.items() if k!='blocks'},'著者正本の出所結合が違う')
    for name,binding in transform['presentation'].items():
        expected_view=dict(binding['value'])
        if name in ('RESULT_REGISTRY.json','INTERACTION_REFERENCES.json','STAGE_HISTORY_CONTRACT.json','STATIC_PREVIEW_STATES.json'):
            for key in ('fullLessonPath','fullLessonSHA256','interactionsPath','interactionsSHA256'):expected_view.pop(key)
        need(meta['viewContracts'][name.removesuffix('.json')]==expected_view,'frame/参照/履歴契約の改変:'+name)

    need(len(meta['sourceMap'])==134 and len(meta['interactions'])==35,'metadata結合の過不足')
    for index,(authored,actual,mapping,source_binding) in enumerate(zip(full['blocks'],blocks[:134],meta['sourceMap'],transform['sourceBindings'])):
        need(mapping['canonicalOrder']==index and mapping['authorBlockId']==mapping['unitBlockId']==authored['id'] and mapping['authorBlockSHA256']==compact_hash(authored) and mapping['unitBlockSHA256']==compact_hash(actual) and mapping['unitBlockIndex']==index,'正本→Unit map不一致')
        need(mapping['irNodeId']==source_binding['irNodeId'] and mapping['irTokenBindings']==source_binding['tokenBindings'],'Unit→IR token map不一致')
        need(mapping['authorAttributes']=={k:v for k,v in authored.items() if k not in ('id','type','parts','text','figureId','alt','caption')},'正本context/roleの不一致')
    for authored,rendered in zip(interactions,meta['interactions']):
        need(rendered['id']==authored['id'] and rendered['registryBlockId']==authored['id']+'-registry' and rendered['itemRef']=={'sectionId':'lesson','itemId':authored['id']},'interaction itemの誤結合')
        for key in ('nodeId','contextId','stageId','source','layoutKind','answerDomain','completionGate','progressionRequires','learningRequires','actualUses','scaffold','projection','afterRefs','completionResultUnit'):
            need(rendered[key]==authored[key],'typed binding/投影の改変:'+key)
        need(rendered['wrongReasonByChoiceIndex']==[authored['wrongReasons'].get(choice) for choice in authored['choices']] and item_map[authored['id']]['hints']==list(authored['hint'].values()),'誤答理由/hintの改変')
    owner_keys=('interactionId','ownerAST','ownerASTHash','targetPath','targetAST','targetASTHash','targetStatement','targetNotation','notation','sourceOwnerRef')
    expected_owners=[{key:binding[key] for key in owner_keys} for binding in transform['astBindings']]
    need(meta['ownerASTBindings']==expected_owners and meta['functionDefinitions']==transform['functionDefinitions'],'実表示owner AST/定義の改変')
    for item,block,descriptor in zip(interactions,blocks[134:],registry):
        need(block=={'id':item['id']+'-registry','type':'paragraph','parts':[{'type':'choice','itemId':item['id'],'semanticId':item['id']+'-slot'}]} and descriptor['itemId']==item['id'] and descriptor['blockSHA256']==compact_hash(block),'登録専用choiceへの別本文混入')
    if compiled is not None:
        for key in ('irHash','baseIRHash','planHash','constructionDesignHash','layoutDesignHash','learnerCopyHash','compiledPresentationHash'):
            need(meta['generatedPlanBinding'][key]==compiled[key],'metadataが実compile出力に結合しない:'+key)
        need(meta['generatedPlanBinding']['sourceIRHash']==compiled['irHash'],'実IRの誤結合')

    need(meta['unitFileRawSHA256']==hashlib.sha256(after[prefix+'qf01Unit.json'].encode()).hexdigest(),'Unit実bytesとmetadataが違う')
    need(archive['schemaVersion']=='qf01-revision2-archive/1' and archive['sourceSHA']==archive['originSourceSHA']==_VT_BASE and archive['revision']==2 and archive['immutableHistorical'] is True and archive['newRevisionCompletionInherited'] is False,'旧版archive契約')
    need(set(archive['sources'])=={'qf01Unit.json','qf01Presentation.json','qf01Lesson.ts'},'旧三原本の欠落・余剰')
    for name,source in archive['sources'].items():
        raw=file(rt.root,prefix+name).read_bytes()
        need(source['path']==prefix+name and source['utf8'].encode()==raw and source['bytes']==len(raw) and source['rawSHA256']==hashlib.sha256(raw).hexdigest(),'旧原bytesの改変:'+name)
    need(archive['unit']==old and archive['presentation']==json.loads(archive['sources']['qf01Presentation.json']['utf8']),'旧版parsed本文の改変')
    lesson_bytes=archive['sources']['qf01Lesson.ts']['utf8'].encode('utf-16-le')
    exports=archive['transformationExports']
    need(set(exports)=={'qf01TransformationPresentation','qf01PilotTransformationPresentation'},'旧transform exportの欠落・余剰')
    for name,descriptor in exports.items():
        start,end=descriptor['startUTF16'],descriptor['endUTF16']
        need(descriptor['source']=='qf01Lesson.ts' and type(start) is int and type(end) is int and 0<=start<end<=len(lesson_bytes)//2,'旧export境界')
        raw=lesson_bytes[start*2:end*2].decode('utf-16-le');parsed=json.loads(raw)
        need(hashlib.sha256(raw.encode()).hexdigest()==descriptor['rawJSONSHA256'],'旧export原bytes hash')
        compact=json.dumps(parsed,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
        need(hashlib.sha256(compact).hexdigest()==descriptor['parsedCanonicalSHA256'],'旧export parsed hash')
        if name=='qf01TransformationPresentation':need(parsed==archive['transformationPresentation'],'旧transform本文の改変')
    need(presentation['revision']==3 and presentation['requiredInteractionRefs']==expected_ids,'presentation必須判断の混同')
    return {'schemaVersion':'qf01-materialization-proof/1','legacyRequiredIds':old['requiredInteractionRefs'],'requiredIds':expected_ids,'canonicalBlockIds':meta['canonicalBlockIds'],'oldSourceBytes':{n:v['rawSHA256'] for n,v in archive['sources'].items()},'afterJSONHashes':{n:hashlib.sha256(after[prefix+n].encode()).hexdigest() for n in names}}


def _vt_current_transition(rt, work, state, transition_ref):
    t=state.get('version_transition')
    need(t and t.get('status')=='PREPARED' and transition_ref==digest(t),'現在の版移行proofがない')
    need(work==_VT_WORK and state['plan']['source_sha']==_VT_SOURCE and state['plan']['proposal']['id']=='P046-R3-20261116','別の提案・Workへ移行proofを流用しない')
    owner=_vt_owner(rt,state,t['owner_work'],t['owner_result_ref'])
    need(owner['candidate_sha']==t['derivation']['ownerCandidateSHA'] and digest(owner['candidate_manifest'])==t['owner_manifest_hash'] and digest(owner['plan']['scope'])==t['owner_scope_hash'],'prepared後にownerの候補/収録/範囲が変化した')
    _,raw_hash=_vt_json_evidence(rt,state,t['policy_ref'])
    need(raw_hash==state['plan']['proposal']['transitionPolicySpecificationHash'],'版移行policyが変わった')
    need(state['plan']['source_extension']['preparedProof']==t['derivationDigest'],'prepared planが変わった')
    return t


def _vt_apply_patch(rt,work,node,token,patch,transition_ref):
    """通常apply_patchのclaim/承認/整合性検査を通過した限定分岐。"""
    s=rt.state(work);t=_vt_current_transition(rt,work,s,transition_ref)
    need(node.startswith('R06_PATCH@'),'版移行は親のR06のみ')
    need(digest(patch)==t['patchHash'],'版移行patchが違う')
    expected=t['afterManifest'];need({x['path']:x['after_sha256'] for x in patch['files']}==expected,'移行patchの出力が違う')
    completed=[(op,row) for op,row in s['patches'].items() if row.get('completed') and row.get('transition_ref')==transition_ref and row.get('patch_hash')==t['patchHash']]
    if completed:return _vt_completed_patch_proof(rt,work,s,t,patch,completed)
    staged=[];created=[];total=0
    for x in patch['files']:
        name=x['path'];relative(name);need(in_scope(name,s['plan']['scope']),'版移行の範囲外')
        target=file(rt.root,name);raw=x['after_text'].encode();total+=len(raw)
        need(total<=20_000_000 and hashlib.sha256(raw).hexdigest()==x['after_sha256'],'版移行実bytes/上限')
        if name in t['outputs']:
            need(x.get('before_sha256') is None and not target.exists() and not target.is_symlink(),'新outputの衝突・偽before')
            need(t['outputs'][name]['afterSHA256']==x['after_sha256'],'新outputの実hash')
            created.append(name)
        else:
            need(name in t['existing'] and name in s['candidate_manifest'] and x['before_sha256']==t['existing'][name]==sha(target),'既存preimageが違う')
        staged.append((name,target,raw))
    compile_input,_=_vt_compile_input(rt,t['derivation']['compileInputRef'])
    proof=_vt_validate_qf_materialization(rt,patch,compile_input['transformationPlan'],rt.store.get(t['derivation']['compiledResultRef'])['compiled'])
    need(proof==t['materialization'],'準備後の教材実生成物が違う')
    # QFの承認された四JSON以外は、従来の安定IDガードをそのまま適用。
    qf='src/data/textbook/math/quadratic/'
    allowed_json={qf+n for n in ('qf01Unit.json','qf01Presentation.json','qf01ReadingPresentation.json','qf01Revision2Archive.json')}
    def ids(value):
        if isinstance(value,dict):return ([value['id']] if 'id' in value else [])+sum((ids(v) for v in value.values()),[])
        if isinstance(value,list):return sum((ids(v) for v in value),[])
        return []
    for name,target,raw in staged:
        if name.endswith('.json') and name not in allowed_json:
            need(name not in created and ids(json.loads(target.read_text()))==ids(json.loads(raw)),'QF以外のJSON安定IDを変更しない')
    op='patch-'+digest(patch)[:20]+'-'+token[:12]
    history = history_events(rt, 'complete', work if getattr(rt.store, 'checkpoint_epoch', None) else None)
    need(not any(e['id']==op for e in history),'同じ移行patchの再実行')
    backup=rt.store.put({name:target.read_bytes().hex() for name,target,_ in staged if name not in created})
    patch_ref=rt.store.put(patch);before={name:sha(target) for name,target,_ in staged if name not in created}
    rt.append('patch_intent',work,{'node':node,'patch_hash':patch_ref,'backup':backup,'before':before,'created_paths':created,'transition_ref':transition_ref},event_id=op)
    for name,target,raw in staged:
        target.parent.mkdir(parents=True,exist_ok=True)
        if name in created:
            with target.open('xb') as out:out.write(raw);out.flush();os.fsync(out.fileno())
        else:
            temp=target.with_name('.'+target.name+'.'+uuid.uuid4().hex+'.tmp')
            with temp.open('xb') as out:out.write(raw);out.flush();os.fsync(out.fileno())
            os.replace(temp,target)
    after={name:sha(target) for name,target,_ in staged}
    need(after==expected,'実移行後のhashが違う')
    untouched={name:value for name,value in s['candidate_manifest'].items() if name not in expected}
    need(manifest(rt.root,untouched)==untouched and manifest(rt.root,s['plan']['rules'])==s['plan']['rules'] and manifest(rt.root,s['plan'].get('protected_manifest',{}))==s['plan'].get('protected_manifest',{}),'移行中に対象外bytesが変わった')
    _vt_current_transition(rt,work,rt.state(work),transition_ref)
    from definitions import DEFINITION_HASH
    from capabilities import implementation_hash
    fresh=_vt_fresh_implementation(rt)
    rt.append('patch_applied',work,{'node':node,'operation':op,'after_manifest':after,'transition_ref':transition_ref,'after_definition':fresh['definition'],'after_service':fresh['service'],'after_service_manifest_hash':fresh['serviceManifestHash']})
    return [rt.evidence(work,'file',{'path':name,'sha256':value},source_ref=op,verification_level='local_execution') for name,value in after.items()]


def _vt_verify_candidate_git(rt,state,commit_sha):
    """実Git object/全候補・保護bytesを照合し、SHA文字列だけのbindを拒否。"""
    t=state['version_transition'];proof=t['sourceGitProof'];repo=Path(proof['gitRoot'])
    need(repo.is_absolute() and repo.resolve()==repo and repo.is_dir(),'候補Git rootが変わった')
    env=dict(os.environ,GIT_NO_LAZY_FETCH='1',GIT_OPTIONAL_LOCKS='0')
    def git(*args):return subprocess.check_output(['git','-C',str(repo),*args],env=env,timeout=15)
    need(git('cat-file','-t',commit_sha).strip()==b'commit','実在Git commitでない')
    ancestry=subprocess.run(['git','-C',str(repo),'merge-base','--is-ancestor',_VT_BASE,commit_sha],env=env,timeout=15,capture_output=True)
    need(ancestry.returncode==0,'material9eからの候補でない')
    expected={**state['plan'].get('protected_manifest',{}),**state['candidate_manifest']}
    entries={}
    for row in git('ls-tree','-r','-z',commit_sha,'--',*sorted(expected)).split(b'\0'):
        if not row:continue
        metadata,path=row.split(b'\t',1);mode,kind,blob=metadata.decode().split();name=path.decode();relative(name)
        need(mode in ('100644','100755') and kind=='blob' and name not in entries,'候補Gitの型/重複が違う')
        entries[name]=blob
    need(set(entries)==set(expected),'候補Gitの収録不足')
    for name,value in expected.items():
        raw=file(rt.root,name).read_bytes()
        need(hashlib.sha256(raw).hexdigest()==value and hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==entries[name],'候補Gitと実bytesが違う:'+name)
    expected_changed={name for name,value in state['candidate_manifest'].items() if t['existing'].get(name,t['beforeManifest'].get(name))!=value}
    changed=set(x.decode() for x in git('diff','--name-only','-z',_VT_BASE,commit_sha).split(b'\0') if x)
    need(changed==expected_changed,'候補Gitの差分が限定appと違う')
    return {'commit':commit_sha,'baseline':_VT_BASE,'tree':git('rev-parse',commit_sha+'^{tree}').decode().strip(),'manifestHash':digest(expected)}


def _vt_completed_patch_proof(rt,work,state,t,patch,completed):
    """二度目は実fileを変更せず、新claimに現在compile/afterproofだけを返す。"""
    from capabilities import implementation_hash
    from definitions import DEFINITION_HASH
    need(len(completed)==1 and state['candidate_sha'] and state['candidate_sha']!=_VT_BASE,'実after候補固定・一回patchが未確認')
    operation,record=completed[0]
    events=[e for e in history_events(rt, 'complete', work) if e['kind']=='patch_applied' and e['payload']['operation']==operation]
    need(len(events)==1,'完了patchの一意性がない')
    applied=events[0]['payload']
    fresh=_vt_fresh_implementation(rt)
    need(applied.get('after_definition')==fresh['definition'] and applied.get('after_service')==fresh['service'],'完了時から実装が変化した')
    need(manifest(rt.root,t['afterManifest'])==t['afterManifest'] and not rt.integrity(state),'完了after bytesが違う')
    gitproof=_vt_verify_candidate_git(rt,state,state['candidate_sha'])
    inputs,compile_raw=_vt_compile_input(rt,t['derivation']['compileInputRef'])
    proc=subprocess.run(['node',str(rt.root/'tools/textbook/operations.mjs'),'construction-compile'],input=compile_raw,cwd=rt.root,capture_output=True,timeout=60)
    need(proc.returncode==0 and len(proc.stdout)<=20_000_000,'afterの現在compileが失敗')
    output=json.loads(proc.stdout)
    need(output.get('status')=='PASS' and digest(output)==t['derivation']['compiledResultRef'],'現在compileとT04の原生成が違う')
    # 全検査後のread-only proof。patch_intent/patch_appliedやfile置換を再実行しない。
    return {'status':'ALREADY_APPLIED_CURRENT_PROOF','operation':operation,'transition_ref':digest(t),'patch_ref':digest(patch),
            'candidate_sha':state['candidate_sha'],'git_proof':gitproof,'after_manifest':t['afterManifest'],
            'definition':DEFINITION_HASH,'service':implementation_hash(rt),'compile_ref':rt.store.put(output),
            'semantic_acceptance':False,'patchExecutedAgain':False}


def _vt_compile_input(rt,reference):
    envelope=rt.store.get(reference)
    need(isinstance(envelope,dict) and set(envelope)=={'schemaVersion','rawUTF8','rawSHA256','logicalHash'} and envelope['schemaVersion']=='qf01-canonical-compile-input/1','正規compile raw transportが必要')
    raw=envelope['rawUTF8'].encode()
    need(len(raw)<=20_000_000 and hashlib.sha256(raw).hexdigest()==envelope['rawSHA256'],'compile raw bytes/hash/上限が違う')
    parsed=_vt_strict_json(raw)
    need(digest(parsed)==envelope['logicalHash'],'compile logical hashが違う')
    return parsed,raw


def _vt_fresh_implementation(rt):
    """既存pyc/親processのimport cacheを使わず実sourceからdefinition/serviceを導出。"""
    from definitions import DEFINITION_HASH
    program=r'''
import sys,json,importlib.abc,importlib.util,importlib.machinery
from pathlib import Path
root=Path(sys.argv[1]).resolve();core=root/'workflow'
class SourceOnly(importlib.machinery.SourceFileLoader):
 def get_code(self,fullname):return compile(Path(self.path).read_bytes(),self.path,'exec',dont_inherit=True)
class Finder(importlib.abc.MetaPathFinder):
 def find_spec(self,fullname,path=None,target=None):
  if '.' not in fullname and (core/(fullname+'.py')).is_file():
   p=core/(fullname+'.py');return importlib.util.spec_from_loader(fullname,SourceOnly(fullname,str(p)))
sys.meta_path.insert(0,Finder())
import definitions,production
from store import digest
files=production.implementation_manifest(root)
print(json.dumps({'definition':definitions.DEFINITION_HASH,'service':digest({'workflow':definitions.DEFINITION_HASH,'services':files}),'serviceManifestHash':digest(files),'serviceManifestCount':len(files)}))
'''
    need((rt.root/'workflow/definitions.py').is_file(),'実workflow sourceがない')
    proc=subprocess.run([sys.executable,'-I','-S','-B','-c',program,str(rt.root)],capture_output=True,text=True,timeout=30)
    need(proc.returncode==0 and len(proc.stdout)<=100_000,'fresh source-only definition導出失敗')
    result=json.loads(proc.stdout)
    need(result['definition']==DEFINITION_HASH,'旧processのimport済み定義。fresh processで再開する')
    return result


def _vt_reconcile_patch(rt,work,s,operation,decision,evidence_refs):
    record=s['patches'][operation];t=_vt_current_transition(rt,work,s,record['transition_ref'])
    patch=rt.store.get(record['patch_hash']);created=set(record['created_paths']);backup=rt.store.get(record['backup'])
    need(created==set(t['outputs']) and set(backup)==set(record['before']),'中断backup/新outputの範囲が違う')
    actual={}
    for x in patch['files']:
        target=file(rt.root,x['path']);need(not target.exists() or target.is_file(),'新output/既存pathの未知file種別')
        value=sha(target) if target.is_file() else None
        need(value in ({None,x['after_sha256']} if x['path'] in created else {x['before_sha256'],x['after_sha256']}),'中断後の未知bytesは自動復旧しない')
        actual[x['path']]=value
    untouched={name:value for name,value in s['candidate_manifest'].items() if name not in t['afterManifest']}
    need(manifest(rt.root,untouched)==untouched and manifest(rt.root,s['plan']['rules'])==s['plan']['rules'] and manifest(rt.root,s['plan'].get('protected_manifest',{}))==s['plan'].get('protected_manifest',{}),'復旧前に対象外/rules/protectedが変化した')
    if decision=='RECORD_COMPLETED':
        need(actual==t['afterManifest'],'部分適用を完了にしない')
        fresh=_vt_fresh_implementation(rt)
        rt.append('patch_applied',work,{'node':record['node'],'operation':operation,'after_manifest':actual,'transition_ref':record['transition_ref'],'after_definition':fresh['definition'],'after_service':fresh['service'],'after_service_manifest_hash':fresh['serviceManifestHash'],'recovery_evidence':evidence_refs})
    elif decision=='RESTORE_BEFORE':
        for name,raw in backup.items():
            need(hashlib.sha256(bytes.fromhex(raw)).hexdigest()==record['before'][name],'backup原物のhashが違う')
        for name,raw in backup.items():
            target=file(rt.root,name);temp=target.with_name('.'+target.name+'.restore.'+uuid.uuid4().hex+'.tmp')
            with temp.open('xb') as out:out.write(bytes.fromhex(raw));out.flush();os.fsync(out.fileno())
            os.replace(temp,target)
        for name in created:
            target=file(rt.root,name)
            if target.exists():target.unlink()
        need(manifest(rt.root,record['before'])==record['before'] and all(not file(rt.root,name).exists() for name in created),'原before/不存在へ復帰しなかった')
        rt.append('patch_aborted',work,{'operation':operation,'evidence_refs':evidence_refs,'transition_ref':record['transition_ref']})
        rt.reconcile_claim(work,record['node'],'FAILED',evidence_refs)
    else:need(False,'中断の判断は既存RECORD_COMPLETED/RESTORE_BEFOREのみ')
    return {'operation':operation,'decision':decision,'version_transition':True}


def reconcile_version_transition(rt,work,transition_ref,outcome,evidence_refs,expected_store_head):
    need(rt.store.head==expected_store_head,'版移行照合中のHEADが違う')
    s=rt.state(work);t=_vt_current_transition(rt,work,s,transition_ref)
    need(outcome in ('NOT_EXECUTED','RESTORED') and not s['claims'],'未確定claimまたは原復帰以外の判定')
    operations=[(key,row) for key,row in s['patches'].items() if row.get('transition_ref')==transition_ref]
    applied={e['payload']['operation'] for e in history_events(rt, 'complete', work) if e['kind']=='patch_applied'}
    need(not any(key in applied for key,row in operations),'完了済みr3を無承認rollbackしない')
    need(not operations if outcome=='NOT_EXECUTED' else operations and all(row.get('completed') for key,row in operations),'原beforeへの復旧が未照合')
    expected={**t['beforeManifest'],**t['existing']}
    need(manifest(rt.root,expected)==expected and all(not file(rt.root,path).exists() for path in t['outputs']),'実after/未知変更があるため移行planを戻せない')
    rt.fingerprint_refs(s,evidence_refs);need(evidence_refs,'版移行復帰の証拠がない')
    archive=rt.store.get(t['archive']);need(archive['plan']['source_sha']==_VT_SOURCE and archive['originSourceSHA']==_VT_SOURCE,'原source archiveが違う')
    need(rt.store.head==expected_store_head,'照合中に台帳が進んだ')
    old=archive['users'].get(t['approval_event_ref'])
    need(old is not None and old['id'] in s['users'],'原承認のarchiveがない')
    event=rt.append('version_transition_reconciled',work,{'transition_ref':transition_ref,'outcome':outcome,'plan':archive['plan'],'candidate_manifest':archive['candidate_manifest'],'block_contexts':archive.get('block_contexts',{}),'evidence_refs':evidence_refs})
    rt.append('approval_coverage_migrated',work,{'user_event':old['id'],'approved_bundles':old.get('approved_bundles',{}),'evidence_refs':evidence_refs,'version_transition_reconciliation':event['hash']})
    return event


# Adopted checkpoint reconciliation is a new current proof, never an old patch.
_CHECKPOINT_CANDIDATE_SCHEMA = 'qf01-checkpoint-current-candidate-proof/1'
_CHECKPOINT_OWNER_STAGES = ('T01_ANALYSIS', 'T02_APPROVAL', 'T03_BUILD', 'T04_VERIFY')
_CHECKPOINT_CORE_PATHS = frozenset('workflow/'+name for name in (
    'checkpoint.py','store.py','runtime.py','integration.py','team.py','team_transport.py',
    'requests.py','impact.py','views.py','capabilities.py','learning.py','runner.py',
    'agent_guard.py','adapters.py','legacy_diagnostics.py','team_migration.py',
    'definitions.py','cli.py','test_checkpoint.py','test_checkpoint_runtime.py',
    'test_checkpoint_definition.py','INTEGRATION_RUNBOOK.md'))
_CHECKPOINT_PRODUCT_ROOTS = ('src','public','package.json','pnpm-lock.yaml',
    'pnpm-workspace.yaml','package-lock.json','npm-shrinkwrap.json','yarn.lock','bun.lock','bun.lockb')
_CHECKPOINT_CANDIDATE_FIELDS = frozenset((
    'schemaVersion','work','node','inputHash','claimTokenSHA256','checkpointEpoch',
    'checkpointAnchor','checkpointBaseStateSHA256','adoptionProposalSHA256',
    'originSourceSHA','baselineCandidateSHA','candidateSHA','candidateManifestSHA256',
    'protectedManifestSHA256','originalUsersSHA256','core','implementationHash',
    'ownerWork','ownerResultRefs','ownerApprovalRef','gitProof','compileReceiptRef',
    'compileOutputRef','compileInputRef','verificationRefs','ledgerHead',
    'patchExecutedAgain','originalPatchEventRecovered','semanticAcceptance','gateAccepted'))


def _checkpoint_scope_diff(changed):
    """Bound the entire candidate delta, including files outside product/core."""
    import re
    from contracts import Rejected
    from checkpoint import CURRENT_REPAIR_AFTER, NEW_TECHNICAL_WORKS, ORIGIN_NAMES
    need(isinstance(changed,(set,frozenset)) and all(isinstance(p,str) for p in changed),
         'CHECKPOINT_FULL_DIFF_OUTSIDE_ADOPTED_SCOPE')
    for name in changed:
        try:relative(name)
        except Rejected as error:
            raise Rejected('CHECKPOINT_FULL_DIFF_OUTSIDE_ADOPTED_SCOPE:'+name) from error
    records={'work/items/'+work+'/'+name+'.md' for work in NEW_TECHNICAL_WORKS
             for name in ('WORK','PROPOSAL','ACTION_LOG','FINDINGS','VERIFICATION')}
    records.update('work/items/W-MATH-QF01-P046-R3-continuation-20261122/'+name+'.md'
                   for name in ('WORK','ACTION_LOG','FINDINGS','VERIFICATION','RECOVERY_HANDOFF'))
    native='work/recovery-checkpoints/qf01-p046-r3/'
    fixed_native={native+'CHECKPOINT_ORIGIN.json'}|{native+'origin/'+name for name in ORIGIN_NAMES}
    allowed=set(CURRENT_REPAIR_AFTER)|_CHECKPOINT_CORE_PATHS|records|fixed_native
    for name in changed-allowed:
        tail=name.removeprefix(native)
        need(name.startswith(native) and (
            re.fullmatch(r'artifacts/[0-9a-f]{64}\.json',tail)
            or re.fullmatch(r'events/[0-9]{8,}-[A-Za-z0-9_-]+\.json',tail)
            or re.fullmatch(r'(?:preflight|reports)/[A-Za-z0-9][A-Za-z0-9_.-]*\.json',tail)),
            'CHECKPOINT_FULL_DIFF_OUTSIDE_ADOPTED_SCOPE:'+name)
    return sorted(changed)


def _checkpoint_git_proof(rt, state, origin, core):
    """Read Git trees and current bytes; do not fetch, change refs, or refresh index."""
    from checkpoint import FIXED_SOURCE, CURRENT_REPAIR_AFTER
    root=Path(rt.root)
    need(root.is_absolute() and root.resolve()==root,'CHECKPOINT_CANDIDATE_ROOT_ALIAS')
    env=dict(os.environ,GIT_NO_LAZY_FETCH='1',GIT_OPTIONAL_LOCKS='0')
    def git(*args):
        result=subprocess.run(['git','-C',str(root),*args],capture_output=True,env=env,timeout=30)
        need(result.returncode==0,'CHECKPOINT_GIT_READ_FAILED:'+str(args[0]))
        return result.stdout
    def tree(commit, paths):
        rows={}
        for raw in git('ls-tree','-r','-z',commit,'--',*paths).split(b'\0'):
            if not raw:continue
            metadata,encoded=raw.split(b'\t',1);mode,kind,blob=metadata.decode('ascii').split()
            name=encoded.decode('utf-8');relative(name)
            need(mode in ('100644','100755') and kind=='blob' and name not in rows,'CHECKPOINT_GIT_ENTRY_KIND')
            rows[name]={'mode':mode,'blobSHA':blob}
        return rows
    candidate=state['candidate_sha']
    need(isinstance(candidate,str) and len(candidate)==40 and all(c in '0123456789abcdef' for c in candidate),'CHECKPOINT_CANDIDATE_SHA')
    need(git('rev-parse','HEAD').decode().strip()==candidate,'CHECKPOINT_CANDIDATE_NOT_HEAD')
    need(git('remote','get-url','origin').decode().strip().removesuffix('.git')
         =='https://github.com/rrikunagasige-dot/kyotsu-step-web','CHECKPOINT_GIT_REPOSITORY')
    git('cat-file','-e',FIXED_SOURCE+'^{commit}')
    baseline='9ee19f65d39b3e639857c809ada50a01c8a7c322'
    need(subprocess.run(['git','-C',str(root),'merge-base','--is-ancestor',baseline,candidate],
         capture_output=True,env=env,timeout=30).returncode==0,'CHECKPOINT_CANDIDATE_ANCESTRY')
    all_changed={raw.decode('utf-8') for raw in git('diff','--name-only','-z',baseline,candidate).split(b'\0') if raw}
    adopted_changed=_checkpoint_scope_diff(all_changed)
    before=tree(FIXED_SOURCE,_CHECKPOINT_PRODUCT_ROOTS);after=tree(candidate,_CHECKPOINT_PRODUCT_ROOTS)
    need(before and set(before)==set(after),'CHECKPOINT_PRODUCT_INVENTORY_CHANGED')
    changed={name for name in before if before[name]!=after[name]}
    need(changed==set(CURRENT_REPAIR_AFTER),'CHECKPOINT_PRODUCT_DIFF_NOT_EXACT_FIVE')
    actual=set()
    for prefix in ('src','public'):
        for path in (root/prefix).rglob('*'):
            if path.is_file() or path.is_symlink():actual.add(path.relative_to(root).as_posix())
    actual.update(name for name in _CHECKPOINT_PRODUCT_ROOTS[2:] if (root/name).exists())
    need(actual==set(after),'CHECKPOINT_UNTRACKED_OR_MISSING_PRODUCT')
    for name,row in after.items():
        raw=file(root,name).read_bytes()
        need(hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==row['blobSHA'],
             'CHECKPOINT_CURRENT_GIT_BYTES:'+name)
    repairs={}
    for name in sorted(changed):
        raw=git('cat-file','blob',FIXED_SOURCE+':'+name)
        need(before[name]['mode']==after[name]['mode'] and hashlib.sha256(raw).hexdigest()==origin['candidate_manifest'][name],
             'CHECKPOINT_REPAIR_PREIMAGE:'+name)
        need(sha(file(root,name))==CURRENT_REPAIR_AFTER[name],'CHECKPOINT_REPAIR_AFTER:'+name)
        repairs[name]={'beforeSHA256':origin['candidate_manifest'][name],'afterSHA256':CURRENT_REPAIR_AFTER[name],
                       'beforeGitBlobSHA':before[name]['blobSHA'],'afterGitBlobSHA':after[name]['blobSHA']}
    workflow_changed={raw.decode('utf-8') for raw in git('diff','--name-only','-z',baseline,candidate,'--','workflow').split(b'\0') if raw}
    need(workflow_changed<=_CHECKPOINT_CORE_PATHS,'CHECKPOINT_CORE_DIFF_OUTSIDE_ADOPTED_SCOPE')
    workflow=tree(candidate,('workflow',))
    current_workflow={p.relative_to(root).as_posix() for p in (root/'workflow').rglob('*')
                      if p.is_file() and p.suffix in ('.py','.md') and '__pycache__' not in p.parts}
    need(current_workflow=={name for name in workflow if Path(name).suffix in ('.py','.md')},
         'CHECKPOINT_UNTRACKED_OR_MISSING_CORE_SOURCE')
    for name,wanted in core['files'].items():
        key='workflow/'+name
        need(key in workflow and sha(file(root,key))==wanted,'CHECKPOINT_ENGINE_SOURCE_NOT_IN_CANDIDATE:'+key)
        raw=file(root,key).read_bytes()
        need(hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==workflow[key]['blobSHA'],
             'CHECKPOINT_ENGINE_GIT_BYTES:'+key)
    need(workflow_changed<=set(workflow),'CHECKPOINT_CORE_DELETION_NOT_ADOPTED')
    for name in current_workflow:
        raw=file(root,name).read_bytes()
        need(hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==workflow[name]['blobSHA'],
             'CHECKPOINT_CHANGED_CORE_GIT_BYTES:'+name)
    return {'repository':'rrikunagasige-dot/kyotsu-step-web','repositoryId':1391122224,
            'candidateSHA':candidate,'treeSHA':git('rev-parse',candidate+'^{tree}').decode().strip(),
            'baselineCandidateSHA':FIXED_SOURCE,'coreBaselineSHA':baseline,
            'repairs':repairs,'productTreeSHA256':digest(after),'coreChangedPaths':sorted(workflow_changed),
            'allChangedPaths':adopted_changed}


def _checkpoint_current_compile(rt, reference):
    """Execute the preserved canonical input with the actual current compiler."""
    from checkpoint import strict_json
    _,raw=_vt_compile_input(rt,reference)
    result=subprocess.run(['node',str(file(rt.root,'tools/textbook/operations.mjs')),'construction-compile'],
                          input=raw,capture_output=True,cwd=rt.root,timeout=60)
    need(result.returncode==0 and len(result.stdout)<=20_000_000,'CHECKPOINT_CURRENT_COMPILE_FAILED')
    output=strict_json(result.stdout)
    need(isinstance(output,dict) and output.get('status')=='PASS','CHECKPOINT_CURRENT_COMPILE_NOT_PASS')
    return output


def _checkpoint_candidate_context(rt,work,node_id,token,*,owner_result_refs,compile_receipt_ref,
                                  verification_refs,ledger_head):
    from checkpoint import (FIXED_WORK,FIXED_SOURCE,RECOVERY_WORK,RECOVERY_PROPOSAL_SHA256,
                            CURRENT_REPAIR_AFTER,current_core_identity)
    from definitions import instantiate,DEFINITION_HASH
    from capabilities import implementation_hash
    need(getattr(rt.store,'checkpoint_mode',False) and work==FIXED_WORK,'CHECKPOINT_CANDIDATE_SCOPE')
    observed_head=rt.store.head;s=rt.state(work);origin=rt.store.state_base(work)
    need(digest(origin)=='44d23caf8aeab339b43e82edb723630704bdd506ac4a5fa234820c72e569f9db','CHECKPOINT_ORIGINAL_BASE_STATE')
    need(digest(s['plan'])==digest(origin['plan']) and s['plan']['source_sha']==_VT_SOURCE,'CHECKPOINT_ORIGINAL_PLAN_CHANGED')
    need(all(s['users'].get(key)==value for key,value in origin['users'].items()),'CHECKPOINT_ORIGINAL_USERS_CHANGED')
    need(not s['paused'] and not any(not p.get('completed') for p in s['patches'].values())
         and not any(not p.get('outcome') for p in s['external'].values()),'CHECKPOINT_UNRESOLVED_OPERATION')
    nodes=instantiate(s['plan']);node=nodes.get(node_id)
    need(node and node.get('stage_kind')=='R06_PATCH' and node.get('actor')=='TOOL','CHECKPOINT_R06_NODE_REQUIRED')
    claim=s['claims'].get(node_id)
    need(claim and claim.get('token')==token and claim.get('expires_at',0)>time.time()
         and claim.get('input_hash')==rt.input_hash(s,node),'CHECKPOINT_CURRENT_R06_CLAIM_REQUIRED')
    need(all(rt.node_status(s,nodes[dep])=='PASSED' for dep in node['depends_on']) and rt.approval(s,node),
         'CHECKPOINT_R06_DEPENDENCIES_OR_APPROVAL')
    need(not rt.integrity(s),'CHECKPOINT_CURRENT_CANDIDATE_INTEGRITY')
    expected=dict(origin['candidate_manifest']);expected.update(CURRENT_REPAIR_AFTER)
    need(s['candidate_manifest']==expected,'CHECKPOINT_CURRENT_CANDIDATE_MANIFEST')
    need(manifest(rt.root,expected)==expected,'CHECKPOINT_CURRENT_CANDIDATE_BYTES')
    protected=s['plan']['protected_manifest']
    need(manifest(rt.root,protected)==protected,'CHECKPOINT_PROTECTED_BYTES')
    migration=s.get('checkpoint_definition_migration',{})
    need(migration.get('to')==DEFINITION_HASH and migration.get('candidateSHA')==s['candidate_sha']
         and migration.get('checkpointEpoch')==rt.store.checkpoint_epoch,'CHECKPOINT_CURRENT_MIGRATION_REQUIRED')
    core=current_core_identity();impl=implementation_hash(rt)
    need(core['definitionHash']==s['definition_hash']==DEFINITION_HASH,'CHECKPOINT_CURRENT_CORE_DEFINITION')
    suffix=history_events(rt,'suffix')
    cut=next((e['seq'] for e in suffix if e['hash']==ledger_head),None)
    need(cut is not None,'CHECKPOINT_RECONCILIATION_HEAD_NOT_IN_SUFFIX')
    claims=[e for e in suffix if e['seq']<=cut and e['work']==work and e['kind']=='claimed'
            and e['payload'].get('node')==node_id and e['payload'].get('token')==token
            and e['payload'].get('input_hash')==claim['input_hash']]
    need(len(claims)==1,'CHECKPOINT_R06_CLAIM_EVENT_REQUIRED')
    need(isinstance(owner_result_refs,dict) and set(owner_result_refs)==set(_CHECKPOINT_OWNER_STAGES),
         'CHECKPOINT_OWNER_RESULT_INVENTORY')
    owner=rt.state(RECOVERY_WORK);plan=owner['plan']
    need(plan['profile']=='technical' and plan.get('parent_work')==work and not plan.get('workflow_version')
         and not plan.get('simulation') and plan['proposal']['hash']==RECOVERY_PROPOSAL_SHA256,
         'CHECKPOINT_NEW_RECOVERY_OWNER_REQUIRED')
    owner_record_paths={'work/items/'+RECOVERY_WORK+'/'+name+'.md' for name in ('WORK','PROPOSAL','ACTION_LOG','FINDINGS','VERIFICATION')}
    need(plan['scope']['paths'] and set(plan['scope']['paths'])<=_CHECKPOINT_CORE_PATHS|owner_record_paths,
         'CHECKPOINT_OWNER_SCOPE_OUTSIDE_ADOPTED_CORE')
    need(owner['definition_hash']==core['definitionHash'] and owner['candidate_sha']==s['candidate_sha']
         and not owner['claims'] and not rt.integrity(owner),'CHECKPOINT_OWNER_CURRENT_IDENTITY')
    need(not any(not p.get('completed') for p in owner['patches'].values())
         and not any(not p.get('outcome') for p in owner['external'].values()),'CHECKPOINT_OWNER_OPERATION_UNCERTAIN')
    owner_protected=plan.get('protected_manifest',{})
    need(all(owner_protected.get(name)==value for name,value in {**protected,**expected}.items())
         and manifest(rt.root,owner_protected)==owner_protected,'CHECKPOINT_OWNER_SHARED_PROTECTION')
    owner_nodes=instantiate(plan)
    for stage in ('S00_RECOVER','S01_ROUTE',*_CHECKPOINT_OWNER_STAGES):
        need(stage in owner_nodes and rt.node_status(owner,owner_nodes[stage])=='PASSED','CHECKPOINT_OWNER_NODE_NOT_CURRENT:'+stage)
        row=owner['results'][stage]
        if stage in owner_result_refs:need(row['artifact']==owner_result_refs[stage],'CHECKPOINT_OWNER_WRONG_RESULT_REF:'+stage)
        need(any(e['seq']<=cut and e['work']==RECOVERY_WORK and e['kind']=='result'
             and e['payload'].get('node')==stage and e['payload'].get('artifact')==row['artifact']
             and e['payload'].get('input_hash')==row['input_hash'] and e['payload'].get('verdict')=='PASS'
             for e in suffix),'CHECKPOINT_OWNER_RESULT_EVENT_REQUIRED:'+stage)
    approval=rt.approval(owner)
    need(approval and approval.get('verification_level')!='simulation'
         and approval.get('reply_to')==RECOVERY_PROPOSAL_SHA256
         and rt.store.get(owner_result_refs['T02_APPROVAL']).get('user_event')==approval['id'],
         'CHECKPOINT_OWNER_ACTUAL_APPROVAL')
    need(any(e['seq']<=cut and e['work']==RECOVERY_WORK and e['kind']=='user'
         and e['payload']==approval for e in suffix),'CHECKPOINT_OWNER_APPROVAL_EVENT_REQUIRED')
    receipt=rt.store.get(compile_receipt_ref)
    need(receipt.get('capability')=='construction.compile' and receipt.get('node')==node_id
         and receipt.get('phase')==node['phase'] and receipt.get('status')=='PASS'
         and receipt.get('input_hash')==claim['input_hash'] and receipt.get('implementation_hash')==impl,
         'CHECKPOINT_CURRENT_COMPILE_RECEIPT')
    bound=[e for e in suffix if claims[0]['seq']<e['seq']<=cut and e['work']==work and e['kind']=='capability_bound'
           and e['payload'].get('node')==node_id and e['payload'].get('receipt')==compile_receipt_ref
           and e['payload'].get('input_hash')==claim['input_hash']]
    need(bound,'CHECKPOINT_CURRENT_COMPILE_BINDING')
    need(any(e['seq']<=cut and e['work']==work and e['kind']=='capability_result'
         and e['payload'].get('cache_key')==receipt.get('cache_key')
         and e['payload'].get('capability')=='construction.compile'
         and e['payload'].get('output')==receipt.get('output') for e in suffix),
         'CHECKPOINT_CURRENT_COMPILE_RESULT_EVENT')
    compile_input=origin['version_transition']['derivation']['compileInputRef']
    compiled=_checkpoint_current_compile(rt,compile_input)
    need(digest(compiled)==receipt['output'] and rt.store.get(receipt['output'])==compiled,
         'CHECKPOINT_COMPILE_OUTPUT_NOT_REPRODUCED')
    need(digest(compiled)==origin['version_transition']['derivation']['compiledResultRef'],
         'CHECKPOINT_APPROVED_CANONICAL_COMPILE_CHANGED')
    need(isinstance(verification_refs,list) and verification_refs
         and all(isinstance(ref,str) for ref in verification_refs) and len(set(verification_refs))==len(verification_refs),
         'CHECKPOINT_CURRENT_VERIFICATION_REFS')
    rt.fingerprint_refs(s,verification_refs)
    for reference in verification_refs:
        evidence=s['evidence'].get(reference,{});data=evidence.get('data',{})
        need(evidence.get('verification_level')!='simulation' and evidence.get('kind') in ('check','ci')
             and data.get('source_sha',data.get('head_sha'))==s['candidate_sha']
             and (data.get('status')=='PASS' and data.get('checks') if evidence.get('kind')=='check'
                  else data.get('conclusion')=='success'),'CHECKPOINT_CURRENT_VERIFICATION_EVIDENCE')
        need(any(e['seq']<=cut and e['work']==work and e['kind']=='evidence'
             and e['payload'].get('id')==reference and e['payload']==evidence for e in suffix),
             'CHECKPOINT_CURRENT_VERIFICATION_EVENT')
    gitproof=_checkpoint_git_proof(rt,s,origin,core)
    need(current_core_identity()==core and implementation_hash(rt)==impl
         and rt.store.head==observed_head,'CHECKPOINT_CHANGED_DURING_RECONCILIATION')
    return {'schemaVersion':_CHECKPOINT_CANDIDATE_SCHEMA,'work':work,'node':node_id,
            'inputHash':claim['input_hash'],'claimTokenSHA256':hashlib.sha256(token.encode()).hexdigest(),
            'checkpointEpoch':rt.store.checkpoint_epoch,'checkpointAnchor':rt.store.checkpoint_anchor,
            'checkpointBaseStateSHA256':digest(origin),'adoptionProposalSHA256':RECOVERY_PROPOSAL_SHA256,
            'originSourceSHA':_VT_SOURCE,'baselineCandidateSHA':FIXED_SOURCE,'candidateSHA':s['candidate_sha'],
            'candidateManifestSHA256':digest(expected),'protectedManifestSHA256':digest(protected),
            'originalUsersSHA256':digest(origin['users']),'core':core,'implementationHash':impl,
            'ownerWork':RECOVERY_WORK,'ownerResultRefs':dict(owner_result_refs),'ownerApprovalRef':approval['id'],
            'gitProof':gitproof,'compileReceiptRef':compile_receipt_ref,'compileOutputRef':receipt['output'],
            'compileInputRef':compile_input,'verificationRefs':list(verification_refs),'ledgerHead':ledger_head,
            'patchExecutedAgain':False,'originalPatchEventRecovered':False,'semanticAcceptance':False,'gateAccepted':False}


def validate_checkpoint_candidate_proof(rt,work,node_id,proof_ref,*,compile_receipt_refs):
    """Revalidate a registered current proof; no event, artifact, or file is written."""
    proof=rt.store.get(proof_ref)
    need(isinstance(proof,dict) and set(proof)==_CHECKPOINT_CANDIDATE_FIELDS
         and proof['schemaVersion']==_CHECKPOINT_CANDIDATE_SCHEMA,'CHECKPOINT_CANDIDATE_PROOF_SCHEMA')
    need(proof['compileReceiptRef'] in compile_receipt_refs,'CHECKPOINT_RESULT_COMPILE_RECEIPT_MISMATCH')
    state=rt.state(work);claim=state['claims'].get(node_id)
    need(claim,'CHECKPOINT_CURRENT_R06_CLAIM_REQUIRED')
    events=[e for e in history_events(rt,'suffix',work) if e['kind']=='checkpoint_candidate_reconciled'
            and e['payload'].get('proofRef')==proof_ref]
    expected_payload={'schemaVersion':_CHECKPOINT_CANDIDATE_SCHEMA,'proofRef':proof_ref,'node':node_id,
                      'inputHash':proof['inputHash'],'claimTokenSHA256':proof['claimTokenSHA256']}
    need(len(events)==1 and events[0]['payload']==expected_payload and events[0]['previous']==proof['ledgerHead'],
         'CHECKPOINT_RECONCILIATION_EVENT_REQUIRED')
    expected=_checkpoint_candidate_context(rt,work,node_id,claim['token'],
                owner_result_refs=proof['ownerResultRefs'],compile_receipt_ref=proof['compileReceiptRef'],
                verification_refs=proof['verificationRefs'],ledger_head=proof['ledgerHead'])
    need(digest(proof)==digest(expected),'CHECKPOINT_CANDIDATE_PROOF_NOT_CURRENT')
    return proof


def reconcile_checkpoint_candidate(rt,work,node_id,token,*,owner_result_refs,compile_receipt_ref,
                                   verification_refs,expected_head):
    """Register an already-applied candidate proof, never patch files or finish R06."""
    from checkpoint import SHA256
    need(isinstance(token,str) and token,'CHECKPOINT_R06_TOKEN_REQUIRED')
    need(isinstance(expected_head,str) and SHA256.fullmatch(expected_head) and rt.store.head==expected_head,
         'CHECKPOINT_RECONCILIATION_EXPECTED_HEAD')
    prior=[e for e in history_events(rt,'suffix',work) if e['kind']=='checkpoint_candidate_reconciled'
           and e['payload'].get('node')==node_id
           and e['payload'].get('claimTokenSHA256')==hashlib.sha256(token.encode()).hexdigest()]
    if prior:
        need(len(prior)==1,'CHECKPOINT_RECONCILIATION_DUPLICATE_CLAIM')
        ref=prior[0]['payload']['proofRef']
        proof=validate_checkpoint_candidate_proof(rt,work,node_id,ref,compile_receipt_refs=[compile_receipt_ref])
        need(proof['ownerResultRefs']==owner_result_refs and proof['verificationRefs']==verification_refs,
             'CHECKPOINT_RECONCILIATION_CHANGED_RETRY')
        return {'proofRef':ref,'eventHash':prior[0]['hash'],'proof':proof}
    proof=_checkpoint_candidate_context(rt,work,node_id,token,owner_result_refs=owner_result_refs,
               compile_receipt_ref=compile_receipt_ref,verification_refs=verification_refs,ledger_head=expected_head)
    need(rt.store.head==expected_head,'CHECKPOINT_RECONCILIATION_HEAD_CHANGED')
    reference=rt.store.put(proof)
    need(rt.store.head==expected_head,'CHECKPOINT_RECONCILIATION_HEAD_CHANGED')
    event=rt.append('checkpoint_candidate_reconciled',work,{
        'schemaVersion':_CHECKPOINT_CANDIDATE_SCHEMA,'proofRef':reference,'node':node_id,
        'inputHash':proof['inputHash'],'claimTokenSHA256':proof['claimTokenSHA256']})
    return {'proofRef':reference,'eventHash':event['hash'],'proof':proof}
