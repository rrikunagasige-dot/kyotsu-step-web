"""Execute production code under the existing claims; AI/user decisions remain explicit."""
import json,subprocess,sys
from pathlib import Path
from contracts import need,manifest,file,sha
from production import ai_request

OPERATIONS={'S03':'coverage','S06':'solve','S08':'teaching-candidates','S09':'teaching-candidates','S10':'blank-candidates','S11':'verify-ir','S12':'verify-ir','S13':'figures','S14':'verify-ir','S16':'visible-snapshots','S18':'compile-ir'}

def code_operation(rt,work,nid,inputs):
    state=rt.state(work)
    if nid in ('S00','S01'):
        expected=state['plan']['source_manifest'];current=manifest(rt.root,expected)
        return {'status':'PASS' if current==expected else 'FAIL','sourceManifest':current,'expectedManifest':expected,'scope':state['plan']['scope']}
    if nid=='S02':
        p=file(rt.root,inputs['sourcePath']);out=rt.store.root/'source-import.json'
        proc=subprocess.run([sys.executable,str(rt.root/'tools/textbook/source/import-word.py'),str(p),'--out',str(out),*(['--unit',inputs['unit']] if inputs.get('unit') else [])],cwd=rt.root,capture_output=True,text=True)
        return {'status':'PASS' if proc.returncode==0 else 'FAIL','sourceIndex':json.loads(out.read_text()) if proc.returncode==0 else None,'stderr':proc.stderr}
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
        if inputs.get('kind')=='polynomial':
            proc=subprocess.run([sys.executable,str(rt.root/'tools/textbook/solver/legacy-polynomial.py')],input=json.dumps(inputs),capture_output=True,text=True,cwd=rt.root)
            return json.loads(proc.stdout) if proc.returncode==0 else {'status':'FAIL','stderr':proc.stderr}
        receipts=inputs.get('receipts',[])
        return {'status':'PASS' if receipts and all(r.get('status')=='PASS' and r.get('domain') and r.get('method') for r in receipts) else 'UNSUPPORTED','receipts':receipts,'proofAuditRequired':True}
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
    nxt=rt.next(work);need(nxt['status']=='READY','現在実行できる工程ではない')
    node=nxt['task']['node'];nid=node['id'];claim=rt.claim(work,nid,'production-runner')
    result=code_operation(rt,work,nid,inputs)
    ref=rt.store.put(result)
    return {'status':'NEEDS_AI_REVIEW' if node['ai_required'] else 'NEEDS_VERIFIED_SUBMISSION','node':nid,'claimToken':claim['claim_token'],'inputHash':claim['input_hash'],'codeArtifact':ref,'codeResult':result,'aiRequest':ai_request(rt,work,nid),'automaticAcceptance':False}
