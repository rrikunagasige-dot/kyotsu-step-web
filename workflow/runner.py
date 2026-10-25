"""Execute production code under the existing claims; AI/user decisions remain explicit."""
import json,subprocess,sys
from pathlib import Path
from contracts import need,manifest,file,sha
from production import ai_request,implementation_manifest
from store import digest

OPERATIONS={'S03':'coverage','S06':'solve','S08':'teaching-candidates','S09':'teaching-candidates','S10':'blank-candidates','S11':'verify-ir','S12':'verify-ir','S13':'figures','S14':'verify-ir','S16':'visible-snapshots','S18':'compile-ir'}
OPERATIONS.update({'U01':'research-manifest','U02':'research-analysis','U03':'research-patterns','U04':'solution-validate','U05':'interaction-plan','U06':'render-solution','U07':'solution-review'})

def code_operation(rt,work,nid,inputs):
    state=rt.state(work)
    if nid in ('S00','S01'):
        import hashlib
        expected=state['plan']['source_manifest'];current=manifest(rt.root,expected)
        opened=next(e for e in rt.store.events() if e['work']==work and e['kind']=='opened')
        original=rt.store.get(opened['payload']['original_snapshot'])
        frozen={p:hashlib.sha256(bytes.fromhex(v)).hexdigest() for p,v in original['files_hex'].items()}
        good=frozen==expected and current==state['candidate_manifest']
        return {'status':'PASS' if good else 'FAIL','sourceManifest':frozen,'candidateManifest':current,'expectedManifest':expected,'scope':state['plan']['scope'],'sourceKind':'IMMUTABLE_OPEN_SNAPSHOT'}
    if nid=='S02':
        p=file(rt.root,inputs['sourcePath']);out=rt.store.root/'source-import.json'
        proc=subprocess.run([sys.executable,str(rt.root/'tools/textbook/source/import-word.py'),str(p),'--out',str(out),*(['--unit',inputs['unit']] if inputs.get('unit') else [])],cwd=rt.root,capture_output=True,text=True)
        return {'status':'PASS' if proc.returncode==0 else 'FAIL','sourceIndex':json.loads(out.read_text()) if proc.returncode==0 else None,'stderr':proc.stderr}
    if nid=='U00':
        p=file(rt.root,inputs['sourcePath'])
        proc=subprocess.run([sys.executable,str(rt.root/'tools/textbook/research/extract.py')],input=json.dumps({'path':str(p),'sourceId':inputs['sourceId'],'engine':inputs.get('engine','native')}),cwd=rt.root,capture_output=True,text=True,timeout=120)
        try:return json.loads(proc.stdout)
        except ValueError:return {'status':'FAIL','reason':'RESEARCH_EXTRACT_OUTPUT','stderr':proc.stderr}
    if nid in OPERATIONS:
        proc=subprocess.run(['node',str(rt.root/'tools/textbook/operations.mjs'),OPERATIONS[nid]],input=json.dumps(inputs),cwd=rt.root,capture_output=True,text=True)
        try:result=json.loads(proc.stdout)
        except ValueError:result={'status':'FAIL','stderr':proc.stderr}
        return result
    if nid in ('S04','S24'):
        operation='retrieve' if nid=='S04' else 'train'
        args=[inputs.get('python',sys.executable),str(rt.root/'tools/textbook/production_cli.py'),operation]
        if nid=='S24':args+=['--out',str(rt.store.root/'candidate-model.json')]
        proc=subprocess.run(args,input=json.dumps(inputs['request']),cwd=rt.root,capture_output=True,text=True)
        if proc.returncode:return {'status':'FAIL','stderr':proc.stderr}
        result=json.loads(proc.stdout)
        if nid=='S24':result['status']='PASS';result['modelDisposition']='SHADOW' if result.get('advisoryEligible') else 'NOT_TRAINABLE'
        return result
    if nid=='S05':
        symbols=inputs['symbols'];ids=[s['id'] for s in symbols]
        return {'status':'PASS' if len(ids)==len(set(ids)) and all(s.get('definitionRef') and s.get('scope') for s in symbols) else 'FAIL','knowledgeLedger':symbols}
    if nid=='S07':
        if inputs.get('kind')=='solution':
            proc=subprocess.run(['node',str(rt.root/'tools/textbook/operations.mjs'),'solution-validate'],input=json.dumps(inputs),capture_output=True,text=True,cwd=rt.root,timeout=30)
            try:return json.loads(proc.stdout)
            except ValueError:return {'status':'FAIL','reason':'SOLUTION_ADAPTER_OUTPUT','stderr':proc.stderr}
        if inputs.get('kind')=='polynomial':
            proc=subprocess.run([sys.executable,str(rt.root/'tools/textbook/solver/legacy-polynomial.py')],input=json.dumps(inputs),capture_output=True,text=True,cwd=rt.root)
            return json.loads(proc.stdout) if proc.returncode==0 else {'status':'FAIL','stderr':proc.stderr}
        if inputs.get('kind')=='n07':
            proc=subprocess.run(['node',str(rt.root/'tools/textbook/operations.mjs'),'solve'],input=json.dumps(inputs['problem']),capture_output=True,text=True,cwd=rt.root)
            return json.loads(proc.stdout) if proc.returncode==0 else {'status':'FAIL','stderr':proc.stderr}
        if inputs.get('kind')=='argument':
            steps=inputs.get('steps',[])
            complete=inputs.get('claim') and inputs.get('assumptions') is not None and inputs.get('sourceRefs') and steps and all(s.get('statement') and s.get('basisRefs') and 'dependsOn' in s for s in steps)
            return {'status':'NEEDS_AI_REVIEW' if complete else 'FAIL','proofStatus':'UNVERIFIED','argument':inputs,'formalProof':False}
        return {'status':'UNSUPPORTED','reason':'no registered verifier for this domain','proofAuditRequired':True}
    if nid=='S15':
        return {'status':'NEEDS_AI_REVIEW','originalSourceRefs':state['plan']['source_manifest'],'coverage':inputs.get('coverage'),'sourceBlocks':inputs.get('sourceBlocks'),'candidate':inputs.get('candidate')}
    if nid=='S19':
        receipt=inputs.get('browserReceipt',{})
        good=receipt.get('sourceSHA')==state['candidate_sha'] and receipt.get('status')=='PASS' and {320,390,430,1440}<=set(receipt.get('widths',[])) and receipt.get('semanticIdsVerified') and receipt.get('statesVerified')
        return {'status':'PASS' if good else 'FAIL','browserReceipt':receipt}
    if nid=='S20':
        actual=manifest(rt.root,inputs['protectedManifest'])
        return {'status':'PASS' if actual==inputs['protectedManifest'] else 'FAIL','protectedManifest':actual}
    if nid=='S21':return {'status':'NEEDS_EXTERNAL_OPERATION','releaseRequest':{'sourceSHA':state['candidate_sha'],'target':'existing-public-app'},'instruction':'use existing release connector then verified receipt; do not infer source from URL query'}
    if nid=='S23':
        rows=inputs.get('caseUpdates',[])
        return {'status':'PASS' if rows and all(c.get('caseId') and c.get('regressionRef') and c.get('ruleDisposition') and c.get('datasetDisposition') for c in rows) else 'FAIL','caseUpdates':rows}
    raise ValueError('this stage requires a user decision or a registered handler')

def run_code(rt,work,inputs):
    if rt.state(work)['plan'].get('workflow_version') == 'production/2':
        from capabilities import run_stage
        return run_stage(rt,work,inputs)
    nxt=rt.next(work);need(nxt['status']=='READY','現在実行できる工程ではない')
    node=nxt['task']['node'];nid=node['id'];claim=rt.claim(work,nid,'production-runner')
    result=code_operation(rt,work,nid,inputs)
    result['producer']={'kind':'code','stageId':nid,'inputHash':claim['input_hash'],'implementationHash':digest(implementation_manifest(rt.root))}
    ref=rt.store.put(result)
    return {'status':'NEEDS_AI_REVIEW' if node['ai_required'] else 'NEEDS_VERIFIED_SUBMISSION','node':nid,'claimToken':claim['claim_token'],'inputHash':claim['input_hash'],'codeArtifact':ref,'codeResult':result,'aiRequest':ai_request(rt,work,nid),'automaticAcceptance':False}
