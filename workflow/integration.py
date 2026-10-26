"""production/2 contracts and scoped runtime helpers. No semantic auto-PASS."""
from contracts import need, result_check
from store import digest
from graphs import normalized

STAGE_FACETS = {
    'S00_RECOVER': set(), 'S01_ROUTE': set(),
    'C01_SOURCE': {'source'}, 'C02_CONCEPT': {'source', 'knowledge'}, 'C03_PATTERN': {'cases', 'model'},
    'C04_SOLUTION': {'source', 'math', 'knowledge'}, 'C05_DESIGN': {'math', 'knowledge', 'design', 'cases'},
    'C06_APPROVAL': {'math', 'design'}, 'C07_BUILD': {'math', 'design', 'render'},
    'C08_VERIFY': {'math', 'design', 'render'}, 'C09_SEMANTIC': {'math', 'design', 'render', 'knowledge'},
    'R01_CAPTURE': {'source'}, 'R02_CAUSE': {'source', 'math', 'design', 'cases'}, 'R03_IMPACT': {'source', 'math', 'design'},
    'R04_PROPOSAL': {'math', 'design', 'cases'}, 'R05_APPROVAL': {'math', 'design'},
    'R06_PATCH': {'math', 'design', 'render'}, 'R07_VERIFY': {'math', 'design', 'render'}, 'R07_SEMANTIC': {'math', 'design', 'render'},
}


def bundle_fingerprint(s, bundle):
    blocks = [b for b in normalized(s['plan'])['blocks'] if b['id'] in bundle['block_ids']]
    content = {'bundle': bundle, 'scope': s['plan']['scope'],
               'patches': {b['id']: b.get('patch_hash', s['plan']['proposal'].get('patch_hash')) for b in blocks},
               'facets': {b: {k: v for k, v in s.get('block_contexts', {}).get(b, {}).items() if k in ('math', 'design', 'knowledge')} for b in bundle['block_ids']}}
    # Unopted historical approvals must retain their exact former fingerprint.
    presentations = {b['id']: b['presentation_design_hash'] for b in blocks if b.get('presentation_design_hash')}
    if presentations:
        content['presentations'] = presentations
    return digest(content)


def approval(rt, s, node=None):
    p = normalized(s['plan']); bundles = p['approval_bundles']
    if node and node.get('approval_scope_ref'): bundles = [a for a in bundles if a['id'] == node['approval_scope_ref']]
    elif node and node.get('release_unit'):
        unit=next(u for u in p['release_units'] if u['id']==node['release_unit'])
        bundles=[a for a in bundles if set(a['block_ids']).intersection(unit['block_ids'])]
    for u in reversed(list(s['users'].values())):
        if u['intent'] != 'approve_proposal' or u['scope'] != p['scope']: continue
        covered = u.get('approved_bundles', {})
        if all(covered.get(b['id']) == bundle_fingerprint(s, b) for b in bundles): return u
    return None


def input_hash(rt, s, node):
    p = normalized(s['plan']); blocks = [b for b in p['blocks'] if not node['block'] or b['id'] == node['block']]
    if node['release_unit'] and not node['block']: blocks = [b for b in blocks if b['release_unit'] == node['release_unit']]
    facets = STAGE_FACETS.get(node['stage_kind'], {'math', 'design', 'render', 'cases', 'knowledge'})
    deps = {d: s['results'].get(d, {}).get('artifact') for d in node['depends_on']}
    base = {'definition': s['definition_hash'], 'source_sha':p['source_sha'], 'node': node, 'rules': p['rules'], 'sources': {path: p['source_manifest'][path] for b in blocks for path in b['sources']}, 'deps': deps,
            'facets': {b['id']: {k: v for k, v in s.get('block_contexts', {}).get(b['id'], {}).items() if k in facets} for b in blocks}}
    if node['stage_kind'] in ('C05_DESIGN', 'C06_APPROVAL', 'C07_BUILD', 'R04_PROPOSAL', 'R05_APPROVAL', 'R06_PATCH'):
        relevant_bundles=[a for a in p['approval_bundles'] if not node['block'] or node['block'] in a['block_ids']]
        base.update(scope=p['scope'],bundles=relevant_bundles,patches={b['id']:b.get('patch_hash',p['proposal'].get('patch_hash')) for b in blocks})
    if node['phase'] in ('post-implementation', 'pre-release', 'release', 'acceptance', 'post-fix', 'repair-finalization', 'learning', 'closure'):
        paths = {path for b in blocks for path in b['sources']}
        base['candidate'] = {path: s['candidate_manifest'].get(path) for path in paths}
        # A per-unit SHA is frozen by the host result; unrelated subsequent releases do not erase acceptance.
        host = s['results'].get('G3_HOST@' + str(node['release_unit']))
        base['candidate_sha'] = s.get('release_versions', {}).get(node['release_unit'], s['candidate_sha'])
    if facets.intersection({'cases', 'model'}): base['context'] = s.get('production_context', {})
    if node['stage_kind'] in ('R01_CAPTURE','L01_LEARNING', 'R08_CAPTURE_LEARNING', 'Z01_CLOSE'):
        base['feedback'] = [e['payload'] for e in rt.store.events() if e['work'] == p['work_id'] and e['kind'] == 'feedback_captured' and (node['stage_kind']!='R01_CAPTURE' or e['payload'].get('quality')=='NEGATIVE')]
        # Resolution is downstream bookkeeping; do not invalidate its own supporting proof.
        base['issues'] = {k: {a: b for a, b in v.items() if a != 'resolved_by'} for k, v in s['issues'].items()}
    if node['capability_requests']:
        from capabilities import implementation_hash
        base['services']=implementation_hash(rt)
    return digest(base)


def compiled_design_matches(outputs, ir_hash, presentation_hash=None):
    """Bind mathematical content and optional display plan in the same compiler output."""
    for output in outputs:
        compiled = output.get('compiled', output)
        if compiled.get('irHash') == ir_hash and (presentation_hash is None or compiled.get('planHash') == presentation_hash):
            return True
    return False


def check_result(rt, work, node, result):
    from capabilities import implementation_hash
    from production import ai_request
    s = rt.state(work); result_check(node, result)
    refs = result.get('capability_receipts', []); receipts = [rt.store.get(ref) for ref in refs]
    need(len(receipts) == len(node['capability_requests']) and {r.get('capability') for r in receipts} == set(node['capability_requests']), '工程のcode receiptが不足・重複')
    bound = {(e['payload']['receipt'], e['payload']['input_hash']) for e in rt.store.events() if e['work'] == work and e['kind'] == 'capability_bound' and e['payload']['node'] == node['id']}
    for ref, r in zip(refs, receipts):
        need((ref, rt.input_hash(s, node)) in bound, '実行イベントのないcode receipt')
        need(r['node'] == node['id'] and r['input_hash'] == rt.input_hash(s, node) and r['phase'] == node['phase'], '別工程・別phase・古い入力のreceipt')
        need(r['implementation_hash'] == implementation_hash(rt), 'codeの版が違う')
        out = rt.store.get(r['output'])
        need(r['status'] == out.get('status'), 'code結果の改変')
        need(result['verdict'] != 'PASS' or r['status'] in ('PASS', 'NEEDS_AI_REVIEW'), 'codeの失敗・未対応をAIでPASSにしない')
    if node['required_ai_receipts'] or any(r['status']=='NEEDS_AI_REVIEW' for r in receipts):
        review = result.get('aiReview', {}); request = ai_request(rt, work, node['id'])
        need(review.get('requestHash') == request['requestHash'] and review.get('inputHash') == rt.input_hash(s, node) and review.get('reviewer') and review.get('evidence'), '根拠付きの現行AI監査がない')
    if node['stage_kind'] == 'R04_PROPOSAL':
        need(result['proposal_hash'] == next(a['proposal_hash'] for a in normalized(s['plan'])['approval_bundles'] if node['block'] in a['block_ids']), '修正案と承認対象の版が違う')
    if node['stage_kind'] in ('R03_IMPACT', 'R03_IMPACT_SWEEP'):
        from impact import check
        check(rt, work, node, result)
    for r in receipts:
        if r['capability'] in ('math.solve','math.verify') and rt.store.get(r['output']).get('status')=='NEEDS_AI_REVIEW' and result['verdict']=='PASS':
            need(result.get('proofStatus')=='AI_ARGUMENT_REVIEWED' and result.get('formalProof') is False, '意味監査と機械証明を区別する')
    if node['stage_kind'] in ('C07_BUILD', 'R06_PATCH'):
        need(approval(rt, s, node), 'このblockの具体案を覆う承認がない')
        b = next(b for b in normalized(s['plan'])['blocks'] if b['id'] == node['block'])
        expected = b.get('content_design_hash') or next(a['content_hash'] for a in normalized(s['plan'])['approval_bundles'] if node['block'] in a['block_ids'])
        need(any(rt.store.get(r['output']).get('compiled', rt.store.get(r['output'])).get('irHash') == expected for r in receipts), 'compile内容と承認済みIR hashが違う')
        if b.get('presentation_design_hash'):
            need(compiled_design_matches([rt.store.get(r['output']) for r in receipts], expected, b['presentation_design_hash']), 'compile表示計画と承認済みplan hashが違う')
    if node['stage_kind'] == 'G2_AUDIT':
        need(result['release_readiness'] in ('READY', 'BLOCKED') and result['impact_sweep_completion'] in ('COMPLETE', 'QUEUED', 'BLOCKED'), '公開可否と影響完了を別記する')
        need(result['audit_method'].get('method') and result['audit_method'].get('reviewer'), '監査方法・担当がない')
        need(not result['audit_method'].get('independent') or result['audit_method'].get('independence_evidence'), '同じAIを独立監査と呼ばない')
        unit=next(u for u in normalized(s['plan'])['release_units'] if u['id']==node['release_unit'])
        required=s['plan'].get('audit_inventory') or [{'block_id':b['id'],'artifact':path} for b in s['plan']['blocks'] if b['id'] in unit['block_ids'] for path in b['sources']]
        need({(r['block_id'],r['artifact']) for r in required} <= {(r.get('block_id'),r.get('artifact')) for r in result['audit_rows']},'横断監査の必須対象が抜けている')
        for row in result['audit_rows']:
            need(row.get('version')==s['release_versions'].get(node['release_unit'],s['candidate_sha']),'横断監査の版が違う')
            need(row.get('status') in ('PASS', 'FAIL', 'UNVERIFIED', 'OUT_OF_SCOPE') and row.get('surface') and row.get('evidence_refs'), '監査の属性不足')
            rt.fingerprint_refs(s, row['evidence_refs'])
            if result['verdict'] == 'PASS':
                need(not row.get('new_regression') and row['status'] not in ('UNVERIFIED',), '今回の退行・未確認行は公開を止める')
                if row['status'] == 'FAIL':
                    need(result['impact_sweep_completion']=='QUEUED','関連欠陥が残るのに影響調査完了としない')
                    child = row.get('linkedCorrection'); need(child and row.get('pre_existing') is True, '既存欠陥の引継先がない')
                    cs = rt.state(child); need(cs['plan']['command'] == 'CMD-WORK-001' and cs['plan'].get('parent_work') == work, '関連修正Workの対応が違う')
        need(result['verdict'] != 'PASS' or result['release_readiness'] == 'READY' and result['impact_sweep_completion'] != 'BLOCKED', '公開準備が未完了')
    if node['stage_kind'] == 'G3_HOST':
        if not s['plan'].get('simulation'):need(next(u.get('review_route') for u in s['plan']['release_units'] if u['id']==node['release_unit']),'公開unitの実物確認routeを固定する')
        need(not any(not op.get('outcome') for op in s['external'].values()),'公開操作の成否が未記録')
        need(s['release_versions'].get(node['release_unit'])==s['candidate_sha'],'先に対象unitの候補SHAを固定する')
        need(result.get('sourceSHA') == s['candidate_sha'], '配信source SHAが違う')
        apps = [s['evidence'].get(ref, {}) for ref in result['evidence_refs']]
        need(any(e.get('kind') == 'app' and e['data'].get('release_unit') == node['release_unit'] and e['data']['source_sha'] == s['candidate_sha'] for e in apps), '対象unitの実配信証拠がない')
    if node['stage_kind'] in ('L01_LEARNING', 'R08_CAPTURE_LEARNING'):
        need(result['verdict'] != 'PASS' or not result.get('unresolved'), '未解決の事例を完了にしない')
        for case in result['case_updates']:
            if case.get('quality') != 'UNKNOWN':
                u=s['users'].get(case.get('evaluation_event'),{})
                expected='quality_positive' if case['quality']=='POSITIVE' else 'quality_negative'
                need(u.get('intent')==expected and u.get('candidate_sha')==case.get('target_version'),'承認・続行を品質の学習labelへ転用しない')
        captured = {e['payload']['id'] for e in rt.store.events() if e['work'] == work and e['kind'] == 'feedback_captured' and (not node['block'] or e['payload'].get('block') in (None, node['block']))}
        covered = {c['id'] for c in result['case_updates']}
        need(captured <= covered and set(s['issues']) <= covered, '未取込のfeedback・issueがある')
        if node['stage_kind'] == 'L01_LEARNING':
            need(result['modelDisposition'] in ('NOT_TRAINABLE', 'SHADOW', 'ADVISORY', 'REJECTED'), 'modelの採否が未記録')
            models = [rt.store.get(r['output']) for r in receipts if r['capability'] == 'ml.train']
            need(models and result['modelDisposition'] == models[0]['modelDisposition'], '実際の学習記録と報告が違う')
            if 'trainingRun' in result:need(result['trainingRun']==models[0].get('trainingRun'),'実際の学習実行記録と違う')
    # Case retrieval must be consumed, not merely attached to a request.
    retrieved = []
    case_receipts=list(receipts)
    if node['stage_kind'] in ('C05_DESIGN','C09_SEMANTIC','R04_PROPOSAL','R07_SEMANTIC'):
        ancestors=set();todo=list(node['depends_on']);nodes=__import__('definitions').instantiate(s['plan'])
        while todo:
            d=todo.pop()
            if d in ancestors:continue
            ancestors.add(d);todo.extend(nodes[d]['depends_on'])
        for d in ancestors:
            saved=s['results'].get(d)
            if saved:case_receipts += [rt.store.get(ref) for ref in rt.store.get(saved['artifact']).get('capability_receipts',[]) if rt.store.get(ref).get('capability')=='case.retrieve']
    for r in case_receipts:
        if r['capability'] == 'case.retrieve':
            out = rt.store.get(r['output']); retrieved += [c.get('id', c.get('caseId')) for c in out.get('cases', out.get('hits', out.get('retrievedCases', [])))]
    if retrieved:
        decisions = result.get('case_dispositions', [])
        need(set(retrieved) <= {d.get('id') for d in decisions} and all(d.get('reason') and d.get('disposition') in ('APPLY', 'OUT_OF_SCOPE', 'ALREADY_SATISFIED') for d in decisions), '取得した事例の適用判断がない')


def accept(rt, work, node, user_ref, evidence_refs):
    s = rt.state(work); u = s['users'].get(user_ref); need(u, 'ユーザー発言がない')
    if node['stage_kind'] in ('C06_APPROVAL', 'R05_APPROVAL'):
        need(u == approval(rt, s, node), 'blockの案・内容・範囲を覆う承認ではない')
    else:
        need(node['stage_kind'] == 'G3_FINAL' and u['intent'] == 'accept_app', '品質評価と実物の受入を区別する')
        host = s['results']['G3_HOST@' + node['release_unit']]; release = rt.store.get(host['artifact'])
        need(u.get('release_unit') == node['release_unit'] and u['candidate_sha'] == release['sourceSHA'] and u['reply_to'] in release['evidence_refs'], '受入の単元・SHA・実働URL証拠が違う')
    rt.fingerprint_refs(s, list(evidence_refs) + [user_ref])
    return rt._finish(work, node, {'verdict': 'PASS', 'user_event': user_ref, 'evidence_refs': list(evidence_refs)}, rt.input_hash(s, node), 'user-record/' + u['verification_level'])
