"""Bind deterministic N07 IR to an already approved, immutable attached design.
No new content approval is created; only the compiler's derived hash is recorded.
"""
import copy,hashlib,json,re,subprocess
from contracts import need,file
from integration import bundle_fingerprint

def bind_n07(rt,work,approved_commit,evidence_refs):
    s=rt.state(work);approval=rt.approval(s)
    need(approval and not s['claims'],'承認前・実行claim中には内容hashを結ばない')
    need(work=='W-MATH-032' and re.fullmatch('[0-9a-f]{40}',approved_commit),'登録外の設計materializer')
    base='work/items/W-MATH-032-n07-semantic-repair/'
    def historical(path,commit=approved_commit):
        return subprocess.check_output(['git','show',commit+':'+path],cwd=rt.root)
    proposal=historical(base+'PROPOSAL.md')
    need(hashlib.sha256(proposal).hexdigest()==s['plan']['proposal']['hash'],'承認された具体案の版が違う')
    design=historical(base+'NODE_DESIGN.json')
    need(file(rt.root,base+'NODE_DESIGN.json').read_bytes()==design,'承認後の設計差分がある')
    rt.fingerprint_refs(s,evidence_refs);need(evidence_refs,'生成物の照合証拠がない')
    legacy=historical('src/data/textbook/math/numbers/n07Authored.json',s['plan']['source_sha'])
    plan_path='work/items/W-GOV-010-learning-production-workflow/n07/N07_DESIGN_PLAN.json'
    source_path='tools/textbook/fixtures/n07-source-index.json'
    payload={'legacy':json.loads(legacy),'design':json.loads(design),'plan':json.loads(historical(plan_path)),'source':json.loads(historical(source_path))}
    script="import fs from 'node:fs';import{repairN07}from'./tools/textbook/repair-n07.mjs';const p=JSON.parse(fs.readFileSync(0));console.log(JSON.stringify(repairN07(p.legacy,p.design,p.plan,p.source)));"
    proc=subprocess.run(['node','--input-type=module','-e',script],input=json.dumps(payload),cwd=rt.root,capture_output=True,text=True)
    need(proc.returncode==0,'承認された設計の正式IR生成に失敗:'+proc.stderr[:200])
    generated=json.loads(proc.stdout);ir_hash=generated['compiled']['irHash']
    p=copy.deepcopy(s['plan']);p['proposal']['contentDesignHash']=ir_hash
    for bundle in p['approval_bundles']:bundle['content_hash']=ir_hash
    proof=rt.store.put({'approvedCommit':approved_commit,'approvalEvent':approval['id'],'proposalSHA256':hashlib.sha256(proposal).hexdigest(),'designSHA256':hashlib.sha256(design).hexdigest(),'irHash':ir_hash,'generated':generated,'evidence_refs':evidence_refs})
    rt.append('materialization_bound',work,{'plan':p,'proof':proof})
    current=rt.state(work)
    rt.append('approval_coverage_migrated',work,{'user_event':approval['id'],'approved_bundles':{b['id']:bundle_fingerprint(current,b) for b in p['approval_bundles']},'evidence_refs':evidence_refs,'materialization_proof':proof})
    return generated

def bind_patch(rt,work,patch,evidence_refs):
    """Record implementation bytes after matching the exact approved design/compiler.
    Display IDs are compiler output; grading and stage IDs remain protected.
    """
    from store import digest
    from adapters import in_scope
    s=rt.state(work);approval=rt.approval(s)
    need(approval and s.get('materialization') and not s['claims'],'設計生成物・承認が不足又は実行中')
    proof=rt.store.get(s['materialization']['proof']);generated=proof['generated']['artifact']
    expected={'src/data/textbook/math/numbers/n07Authored.json','src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/n07-reading.css'}
    need({f['path'] for f in patch['files']}==expected and len(patch['files'])==3,'N07の登録された表示実装だけを結ぶ')
    rt.fingerprint_refs(s,evidence_refs);need(evidence_refs,'実装と設計の照合根拠がない')
    for change in patch['files']:
        path=change['path'];need(in_scope(path,s['plan']['scope']) and path in s['candidate_manifest'],'承認範囲外')
        need(hashlib.sha256(file(rt.root,path).read_bytes()).hexdigest()==change['before_sha256']==s['candidate_manifest'][path],'修正前の版が違う')
        need(hashlib.sha256(change['after_text'].encode()).hexdigest()==change['after_sha256'],'修正後の版が違う')
        if path.endswith('.json'):need(json.loads(change['after_text'])==generated,'生成IRの表示artifactと違う')
    p=copy.deepcopy(s['plan']);p['proposal']['patch_hash']=digest(patch)
    for b in p['blocks']:b['patch_hash']=digest(patch)
    ref=rt.store.put({'patch':patch,'materializationProof':s['materialization']['proof'],'approvalEvent':approval['id'],'evidence_refs':evidence_refs})
    rt.append('materialization_bound',work,{'plan':p,'proof':s['materialization']['proof'],'patchProof':ref})
    current=rt.state(work)
    rt.append('approval_coverage_migrated',work,{'user_event':approval['id'],'approved_bundles':{b['id']:bundle_fingerprint(current,b) for b in p['approval_bundles']},'evidence_refs':evidence_refs,'materialization_patch_proof':ref})
    return ref
