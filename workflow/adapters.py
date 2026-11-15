"""副作用を限定する接続部。外部送信は呼出側の既存GitHubコネクタで行う。"""
import hashlib,io,json,os,subprocess,sys,uuid,zipfile,time
from pathlib import Path
from contracts import need,file,sha,manifest,relative,Rejected
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
        for path,h in receipt['boundedInputHashes'].items():
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
def _sci_load(rt,work):
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
    actual=[e['payload'] for e in rt.store.events() if e['work']==_SOURCE_CI_OWNER and e['kind']=='patch_applied']
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
    _sci_need(_sci_sha_bytes(_SOURCE_CI_VALIDATOR_JS.encode())==policy['validatorSHA256'], 'PINNED_VALIDATOR')
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
        runner=base/'source_ci_validate.mjs';runner.write_text(_SOURCE_CI_VALIDATOR_JS)
        for folder,entries in [('build',build),('qa',qa)]:
            for name,blob in entries.items():
                target=base/folder/_sci_safe(name);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(blob)
        config={'publisherRoot':str(publisher),'buildRoot':str(base/'build'),'qaRoot':str(base/'qa'),
                'run':str(inputs['run']),'artifacts':str(inputs['artifacts']),'ledger':str(inputs['ledger']),
                'buildArchive':str(inputs['build']),'qaArchive':str(inputs['qa']),
                'publisherSHA':policy['producerSHA'],'runID':str(policy['runID']),'attempt':policy['attempt']}
        config_path=base/'config.json';config_path.write_text(json.dumps(config))
        proc=subprocess.run([node,str(runner),str(config_path)],cwd=base,
                            env={'PATH':os.environ.get('PATH',''),'LANG':'C.UTF-8'},capture_output=True,text=True,timeout=300)
        _sci_need(proc.returncode==0, 'PINNED_FULL_QA_FAILED '+proc.stderr[-600:])
        result=json.loads(proc.stdout)
        _sci_need(result=={'status':'PASS_PRODUCER_AND_RAW_QA','runID':str(policy['runID']),'attempt':policy['attempt'],'publisherSHA':policy['producerSHA']}, 'VALIDATOR_RESULT_BINDING')

def source_ci_verify(rt,work,data):
    need(data=={'policy_work':_SOURCE_CI_OWNER}, 'source_ci caller cannot supply source/policy/receipt')
    try:
        s,policy=_sci_load(rt,work)
        result=_sci_verify_bundle(rt.root,policy,policy['inputs'],s['candidate_sha'],s['candidate_manifest'])
        latest,again=_sci_load(rt,work)
        need(again==policy and latest['candidate_manifest']==s['candidate_manifest'], 'source_ci input changed during validation')
        result.update(policy_path=_SOURCE_CI_POLICY_PATH,policy_work=_SOURCE_CI_OWNER,ownerCandidateSHA=policy['_ownerCandidateSHA'],work=work,releaseUnit=policy['releaseUnit'])
        return result
    except (ValueError,KeyError,OSError,subprocess.SubprocessError,zipfile.BadZipFile) as e:
        raise Rejected('source_ci verification failed: '+str(e)) from e

def _sci_registered(rt,work,ref):
    s=rt.state(work);e=s['evidence'].get(ref,{})
    need(e.get('kind')=='source_ci', 'same Work registered source_ci required')
    fresh=source_ci_verify(rt,work,{'policy_work':_SOURCE_CI_OWNER})
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
    proof=_sci_registered(rt,work,ci_ref);s,policy=_sci_load(rt,work)
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
