"""Shared capability calls under Runtime claims. Receipts/cache live in the same Store."""
from contracts import need, manifest
from store import digest

# Keys are semantic capabilities, values are the existing P-003 executable services.
REGISTRY = {
    'source.fixed': 'S01', 'source.import': 'S02', 'source.coverage': 'S03', 'case.retrieve': 'S04',
    'knowledge.ledger': 'S05', 'math.solve': 'S06', 'math.verify': 'S07', 'teaching.plan': 'S08',
    'step.plan': 'S09', 'blank.plan': 'S10', 'prose.compose': 'S11', 'text.verify': 'S12',
    'figure.verify': 'S13', 'ir.verify': 'S14', 'source.audit': 'S15', 'novice.audit': 'S16',
    'ir.compile': 'S18', 'browser.verify': 'S19', 'protected.verify': 'S20',
    'release.verify': 'S21', 'case.finalize': 'S23', 'ml.train': 'S24',
    'feedback.capture': None, 'impact.inventory': None,
    'research.extract': 'U00', 'research.ingest':'U01', 'research.analyze':'U02',
    'research.patterns':'U03', 'solution.validate':'U04', 'interaction.plan':'U05', 'render.solution':'U06', 'solution.review':'U07',
}
DESIGN = ['teaching.plan', 'step.plan', 'blank.plan', 'prose.compose', 'text.verify', 'figure.verify', 'ir.verify', 'source.audit', 'novice.audit']
PLACEMENT = {
    'C01_SOURCE': ['source.fixed', 'source.import', 'source.coverage'], 'C02_CONCEPT': ['source.coverage', 'knowledge.ledger'],
    'C03_PATTERN': ['case.retrieve'], 'C04_SOLUTION': ['math.solve', 'math.verify'], 'C05_DESIGN': DESIGN,
    'C07_BUILD': ['ir.compile'], 'C08_VERIFY': ['math.verify', 'ir.verify', 'browser.verify', 'protected.verify'],
    'C09_SEMANTIC': ['source.audit', 'novice.audit'],
    'R01_CAPTURE': ['source.fixed', 'feedback.capture'],
    'R02_CAUSE': ['case.retrieve', 'knowledge.ledger', 'math.verify', 'ir.verify', 'source.audit', 'novice.audit'],
    'R03_IMPACT': ['impact.inventory'], 'R03_IMPACT_SWEEP': ['impact.inventory'],
    'R04_PROPOSAL': ['math.solve', 'math.verify'] + DESIGN, 'R06_PATCH': ['ir.compile'],
    'R07_VERIFY': ['math.verify', 'ir.verify', 'browser.verify', 'protected.verify'],
    'R07_SEMANTIC': ['source.audit', 'novice.audit'], 'R08_CAPTURE_LEARNING': ['case.finalize'],
    'G2_AUDIT': ['protected.verify', 'impact.inventory'], 'G3_HOST': ['release.verify'],
    'L01_LEARNING': ['case.finalize', 'ml.train'],
}


def requests_for(plan, node):
    caps = list(PLACEMENT.get(node['stage_kind'], []))
    if node['block'] and plan['command'] == 'CMD-WORK-001':
        b = next(b for b in plan['blocks'] if b['id'] == node['block']); facets = set(b['change_facets'])
        if node['stage_kind']=='R01_CAPTURE' and 'source' in facets:caps += ['source.import','source.coverage']
        if node['stage_kind']=='R02_CAUSE' and 'math' in facets:caps += ['math.solve']
        if 'math' not in facets: caps = [c for c in caps if c not in ('math.solve', 'math.verify', 'knowledge.ledger')]
        if not facets.intersection({'math', 'design'}): caps = [c for c in caps if c not in ('teaching.plan', 'step.plan', 'blank.plan')]
    if plan.get('solution_pipeline')=='solution/1':
        extra={
            'C01_SOURCE':['research.ingest','research.analyze'],
            'C03_PATTERN':['research.patterns'], 'C04_SOLUTION':['solution.validate'],
            'C05_DESIGN':['interaction.plan','solution.review'], 'C07_BUILD':['render.solution'],
            'C08_VERIFY':['solution.validate'], 'R02_CAUSE':['solution.validate'],
            'R04_PROPOSAL':['solution.validate','interaction.plan','solution.review'], 'R06_PATCH':['render.solution'],
            'R07_VERIFY':['solution.validate'],
            'C09_SEMANTIC':['solution.review'], 'R07_SEMANTIC':['solution.review'],
        }.get(node['stage_kind'],[])
        if plan.get('research_extract') and node['stage_kind']=='C01_SOURCE':extra+=['research.extract']
        if node['stage_kind']=='R01_CAPTURE' and node['block']:
            facets=set(next(b for b in plan['blocks'] if b['id']==node['block'])['change_facets'])
            if 'source' in facets:
                extra+=['research.ingest','research.analyze']
                if plan.get('research_extract'):extra+=['research.extract']
        if plan['command']=='CMD-WORK-001' and node['block']:
            facets=set(next(b for b in plan['blocks'] if b['id']==node['block'])['change_facets'])
            if not facets.intersection({'math','design'}):extra=[c for c in extra if c!='solution.validate' and c!='interaction.plan']
        caps+=extra
    return caps


def implementation_hash(rt):
    from production import implementation_manifest
    from definitions import DEFINITION_HASH
    return digest({'workflow': DEFINITION_HASH, 'services': implementation_manifest(rt.root)})

def solution_environment():
    """An engine upgrade must invalidate cached solution receipts as well as code changes."""
    import os,subprocess,sys,json
    python=os.environ.get('KYOTSU_MATH_PYTHON',os.environ.get('KYOTSU_ML_PYTHON',sys.executable))
    try:
        p=subprocess.run([python,'-c','import json,sys,importlib.metadata as m;print(json.dumps({"python":sys.version,"sympy":m.version("sympy")}))'],capture_output=True,text=True,timeout=10)
        return {'executable':python,'versions':json.loads(p.stdout)} if p.returncode==0 else {'executable':python,'status':'DEPENDENCY_MISSING'}
    except (OSError,ValueError,subprocess.TimeoutExpired):return {'executable':python,'status':'UNAVAILABLE'}


def run_capability(rt, work, node, capability, inputs):
    from runner import code_operation
    s = rt.state(work); need(capability in node['capability_requests'], '工程に未接続の機能')
    if capability in ('source.import','research.extract') and inputs.get('sourcePath'):
        need(inputs['sourcePath'] in (node['source_refs'] or s['plan']['source_manifest']),'宣言されたblock原資料の外を取り込まない')
    if capability=='case.retrieve' and not s['plan'].get('simulation'):
        request=dict(inputs.get('request',{}))
        expected=s.get('production_context',{}).get('corpusHash')
        need(expected and (not request.get('corpusHash') or request['corpusHash']==expected),'事例catalogの版が制作contextと違う')
        request['corpusHash']=expected
        request['mandatoryInputs']=s['plan'].get('correction_queue_refs',[])
        inputs={**inputs,'request':request}
    impl = implementation_hash(rt)
    context_keys = ('corpusHash', 'modelHash', 'rulesHash', 'featureSchema') if capability in ('case.retrieve', 'ml.train') else ()
    context = {k: s.get('production_context', {}).get(k) for k in context_keys}
    if s['plan'].get('solution_pipeline')=='solution/1':context['solutionEnvironment']=solution_environment()
    # Scoped across nodes/blocks: stage ID is a binding, not the service cache key.
    from integration import STAGE_FACETS
    relevant=STAGE_FACETS.get(node['stage_kind'],set())
    bindings={'sources':{p:s['plan']['source_manifest'][p] for p in (node['source_refs'] or s['plan']['source_manifest'])}, 'facets':{k:v for k,v in s.get('block_contexts',{}).get(node['block'],{}).items() if k in relevant}}
    if capability in ('case.finalize','feedback.capture'):
        bindings['feedback']=[e['payload'] for e in rt.store.events() if e['work']==work and e['kind'] in ('feedback_captured','issue') and (capability!='feedback.capture' or e['kind']=='issue' or e['payload'].get('quality')=='NEGATIVE')]
    if capability in ('release.verify','browser.verify'):bindings['candidate_sha']=s['candidate_sha']
    if capability=='protected.verify':bindings['protected_manifest']=s['plan'].get('protected_manifest',{})
    paths=([inputs['sourcePath']] if inputs.get('sourcePath') else [])+[f['sourcePath'] for f in inputs.get('figures',[]) if f.get('sourcePath')]
    if paths:bindings['files']=manifest(rt.root,paths)
    key = digest({'bindings':bindings,'capability': capability, 'inputs': inputs, 'implementation': impl, 'rules': s['plan']['rules'], 'phase': node['phase'], 'context': context})
    cached = next((e for e in reversed(rt.store.events()) if e['work'] == work and e['kind'] == 'capability_result' and e['payload']['cache_key'] == key), None)
    if cached:
        previous=rt.store.get(cached['payload']['output'])
        if previous.get('status') not in ('PASS','NEEDS_AI_REVIEW') or previous.get('trainingStatus')=='FAIL':cached=None
    output = rt.store.get(cached['payload']['output']) if cached else None
    if output is None:
        if capability == 'source.import' and not inputs.get('sourcePath'):
            # Structured sources already imported: persist their actual frozen bytes, do not call Word importer on JSON.
            import json
            from contracts import file
            paths = node['source_refs'] or list(s['plan']['source_manifest'])
            output = {'status': 'PASS', 'sourceIndex': {p: json.loads(file(rt.root, p).read_text()) for p in paths}, 'sourceManifest': manifest(rt.root, paths)}
        elif capability == 'feedback.capture':
            from requests import pending
            output = {'status': 'PASS', 'events': [e['payload'] for e in rt.store.events() if e['work'] == work and e['kind'] == 'feedback_captured' and e['payload'].get('quality')=='NEGATIVE'], 'issues': s['issues'], 'correction_queue':pending(rt,s)}
        elif capability == 'impact.inventory':
            from impact import inventory
            output = {'status': 'NEEDS_AI_REVIEW', 'inventory': inventory(s, node), 'phase': node['phase'], 'sourceSHA': s['candidate_sha']}
        elif capability=='math.solve' and inputs.get('kind')=='argument':
            output=code_operation(rt,work,'S07',inputs)
            output.update(solutionOrigin='AI_ARGUMENT',formalProof=False)
        elif capability in ('ir.verify','novice.audit') and node['stage_kind']=='R02_CAUSE':
            from legacy_diagnostics import inspect
            candidate=inputs.get('ir',inputs) if capability=='novice.audit' else inputs
            output=inspect(rt,work,candidate,visible=capability=='novice.audit')
            if output is None:output=code_operation(rt,work,REGISTRY[capability],inputs)
        elif capability == 'source.audit':
            complete = all(inputs.get(k) is not None for k in ('coverage', 'sourceBlocks', 'candidate'))
            output = code_operation(rt, work, 'S15', inputs) if complete else {'status': 'FAIL', 'reason': 'source audit requires coverage, sourceBlocks and candidate'}
        elif capability == 'case.finalize':
            from learning import finalize
            output=finalize(rt,work,inputs)
        elif capability == 'ml.train' and not inputs.get('request'):
            output = {'status': 'PASS', 'trainingRun': False, 'modelDisposition': 'NOT_TRAINABLE', 'reason': 'No versioned training dataset supplied; model stays OFFLINE_ONLY', 'advisoryEligible': False}
        elif capability == 'ml.train':
            from learning import training_inputs
            output=code_operation(rt,work,'S24',training_inputs(rt,inputs))
            if output.get('status')!='PASS':
                output={'status':'PASS','trainingStatus':'FAIL','trainingAttempted':True,'trainingRun':None,'modelDisposition':'REJECTED','advisoryEligible':False,'trainingFailure':output}
        elif capability == 'protected.verify':
            expected=s['plan'].get('protected_manifest',{})
            output=code_operation(rt,work,'S20',{'protectedManifest':expected})
        elif capability == 'release.verify':
            ref = inputs.get('appEvidence'); e = s['evidence'].get(ref, {})
            output = {'status': 'PASS' if e.get('kind') == 'app' and e['data'].get('release_unit') == node['release_unit'] and e['data']['source_sha'] == s['candidate_sha'] else 'FAIL', 'appEvidence': ref}
        else:
            output = code_operation(rt, work, REGISTRY[capability], inputs)
        outref = rt.store.put(output)
        rt.append('capability_result', work, {'cache_key': key, 'capability': capability, 'phase': node['phase'], 'output': outref})
    else: outref = cached['payload']['output']
    receipt = {'capability': capability, 'phase': node['phase'], 'implementation_hash': impl, 'input_hash': rt.input_hash(s, node),
               'node': node['id'], 'cache_key': key, 'output': outref, 'status': output.get('status', 'FAIL'), 'reused': bool(cached),
               'consumed_artifacts': inputs.get('consumed_artifacts', []), 'consumed_case_ids': inputs.get('consumed_case_ids', []), 'model_ref': context.get('modelHash')}
    ref = rt.store.put(receipt)
    rt.append('capability_bound', work, {'node': node['id'], 'input_hash': receipt['input_hash'], 'receipt': ref})
    return ref


def run_stage(rt, work, inputs):
    nxt = rt.next(work); need(nxt['status'] == 'READY', '実行可能な工程がない')
    node = nxt['task']['node']; need(node['actor'] in ('AI', 'TOOL'), '判断／CODE工程はこのrunnerで実行しない')
    need(set(inputs) == set(node['capability_requests']), '必要な機能すべてに入力を渡す')
    claim = rt.claim(work, node['id'], 'capability-runner')
    refs=[];catalog=None
    for capability in node['capability_requests']:
        value=dict(inputs[capability])
        if capability=='ml.train' and value.get('request') and not value.get('corpus_artifact') and catalog:value['corpus_artifact']=catalog
        ref=run_capability(rt,work,node,capability,value);refs.append(ref)
        if capability=='case.finalize':catalog=rt.store.get(rt.store.get(ref)['output']).get('catalogArtifact')
    from production import ai_request
    return {'status': 'NEEDS_REVIEW', 'node': node['id'], 'claimToken': claim['claim_token'], 'receipts': refs, 'aiRequest': ai_request(rt, work, node['id']), 'automaticAcceptance': False}
