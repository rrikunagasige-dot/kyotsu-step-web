"""Opt-in three-agent contracts. Structure/provenance checks, never semantic auto-PASS.

The caller's harness attestation is auditable transcription, not OS isolation or
cryptographic proof that an agent actually reasoned independently.
"""
from copy import deepcopy
from contracts import need, relative
from store import digest

REVIEW_KINDS = {'source-review', 'learner-visible-review', 'design-conformance', 'self-check'}
ROLES = {'author', 'reviewer', 'analyst'}


def default_policy():
    rows = []
    for stage in ('C05_DESIGN', 'R04_PROPOSAL'):
        rows.extend([
            dict(stage_kind=stage, claimRef='teaching', facet='design', reviewKind='source-review', independent=True, sourceFirst=True, firstPass=True),
            dict(stage_kind=stage, claimRef='layout', facet='render', reviewKind='learner-visible-review', independent=True, sourceFirst=True, firstPass=True)])
    for stage in ('C09_SEMANTIC', 'R07_SEMANTIC', 'G2_AUDIT'):
        rows.append(dict(stage_kind=stage, claimRef='integrated-release' if stage == 'G2_AUDIT' else 'implemented-visible', facet='render', reviewKind='learner-visible-review', independent=True, sourceFirst=True, firstPass=True))
    return dict(schema_version='team/1', max_active_subagents=2, allow_grandchildren=False,
                store_writer='M', root_agent_ref='/root', required_scopes=rows)


def validate_policy(policy, *, allow_empty=False):
    if policy is None:
        return None
    need(isinstance(policy, dict), 'team policyはobject')
    p = deepcopy(policy)
    need(p.get('schema_version') == 'team/1', '未対応のteam policy')
    need(type(p.get('max_active_subagents')) is int and p['max_active_subagents'] == 2, '子agent上限は2')
    need(p.get('allow_grandchildren') is False and p.get('store_writer') == 'M', '孫agent禁止・M単一writerが必要')
    p.setdefault('root_agent_ref', '/root')
    need(isinstance(p['root_agent_ref'], str) and p['root_agent_ref'], '実root agent参照が必要')
    rows = p.get('required_scopes')
    need(isinstance(rows, list) and (rows or allow_empty), '必要review scopeを明示する')
    keys = set()
    for r in rows:
        need(isinstance(r, dict) and all(r.get(k) for k in ('stage_kind', 'claimRef', 'facet', 'reviewKind')), 'review scopeの属性不足')
        need(r['reviewKind'] in REVIEW_KINDS and r['facet'] in {'source','math','design','render','cases','knowledge','model'}, 'review scopeの型が不明')
        need(all(type(r.get(k)) is bool for k in ('independent', 'sourceFirst', 'firstPass')), 'review条件は明示boolean')
        need(not r['independent'] or r['reviewKind'] != 'self-check', '自己点検を独立監査へ転用しない')
        key = tuple(r.get(k) for k in ('stage_kind','node_id','block','claimRef','facet','reviewKind'))
        need(key not in keys, 'review scopeの重複'); keys.add(key)
    return p


def node_requirements(policy, node):
    if not policy:
        return []
    return [deepcopy(r) for r in policy['required_scopes'] if r['stage_kind'] in ('*', node.get('stage_kind'))
            and (not r.get('node_id') or r['node_id'] == node['id'])
            and (not r.get('block') or r['block'] == node.get('block'))]


def project(events, work):
    """Projection of the existing Store; no separate ledger or mutable global state."""
    p = dict(registrations={}, assignments={}, outputs={}, reconciliations={}, authors={}, findings={}, resolved_findings={})
    for e in events:
        if e['work'] != work:
            continue
        v = e['payload']
        if e['kind'] == 'team_task_registered':
            p['registrations'][v['registrationRef']] = v
            p['assignments'][v['assignment']['assignmentId']] = v['registrationRef']
            a = v['assignment']
            if a['role'] == 'author':
                for claim in a['claimRefs']:
                    p['authors'].setdefault((a.get('block'), claim, a['facet']), set()).add(a['performerRef'])
        elif e['kind'] == 'team_output_recorded':
            p['outputs'][v['outputRef']] = v
            out = v['output']; reg = p['registrations'][v['registrationRef']]
            who = reg['assignment']['performerRef']
            for a in out.get('authoredClaims', []):
                key = (reg['assignment'].get('block'), a['claimRef'], a['facet'])
                p['authors'].setdefault(key, set()).add(who)
            for f in out.get('findings', []):
                # Review outputs cannot erase previous unresolved reports by voting.
                p['findings'].setdefault(f['findingId'], []).append(dict(f, outputRef=v['outputRef']))
                if f.get('resolvesOutputRef'):
                    p['resolved_findings'].setdefault((f['findingId'], f['resolvesOutputRef']), []).append(dict(f, outputRef=v['outputRef']))
        elif e['kind'] == 'team_task_reconciled':
            p['reconciliations'][v['registrationRef']] = v
    return p


def check_hash(value, label):
    need(isinstance(value, str) and len(value) == 64 and all(c in '0123456789abcdef' for c in value), label+'はSHA256')


def packet_body(packet):
    return {k: v for k, v in packet.items() if k != 'packetHash'}


def validate_packet(packet, assignment):
    need(isinstance(packet, dict) and packet.get('packetHash') == digest(packet_body(packet)), 'packet hash不一致')
    need(packet.get('baseNodeInputHash') == assignment.get('inputHash'), 'packetの基礎入力が違う')
    need(packet.get('sourceRefs') and isinstance(packet.get('authorHistory'), list), 'packetの原資料・作者履歴が不足')
    exposure = packet.get('contextExposure')
    need(isinstance(exposure, dict) and exposure.get('forkMode') in ('all','none','filtered'), '渡したcontextを明示する')
    need(type(exposure.get('authorRationaleVisibleAtFirstPass')) is bool, '作者理由への露出を明示する')
    for h in packet['authorHistory']:
        need(h.get('claimRef') and h.get('facet') and isinstance(h.get('semanticContributorRefs'), list), '作者履歴はclaim/facet単位')


def validate_assignment(a):
    need(isinstance(a, dict) and all(a.get(k) for k in ('assignmentId','node','facet','claimRefs','performerRef','role','sourceSHA')), 'assignment属性不足')
    need(a['role'] in ROLES and isinstance(a['claimRefs'], list) and len(a['claimRefs']) == len(set(a['claimRefs'])), 'assignment role/claimが不正')
    need(type(a.get('roleEpoch')) is int and a['roleEpoch'] > 0, 'roleEpochは正整数')
    check_hash(a.get('inputHash'), '基礎入力hash')
    need(len(a['sourceSHA']) == 40 and all(c in '0123456789abcdef' for c in a['sourceSHA']), 'sourceSHAが不正')
    need(isinstance(a.get('artifactHashes'), dict) and a['artifactHashes'], '固定artifactが必要')
    for v in a['artifactHashes'].values(): check_hash(v, '対象artifact hash')
    need(a.get('writeMode') in ('READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX','PATCH_PROPOSAL','OWN_OUTPUT_ONLY'), '許可されたwriteModeではない')
    need(isinstance(a.get('allowedPaths'), list), 'allowedPathsを明示する')
    for path in a['allowedPaths']: relative(path)
    need(a['writeMode'] != 'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX' or not a['allowedPaths'], 'read-only assignmentに書込先がある')
    need(isinstance(a.get('dependsOnTasks'), list) and a['assignmentId'] not in a['dependsOnTasks'], 'task自己依存は禁止')
    need(isinstance(a.get('budget'), dict), 'task予算を明示する（不明はnull）')


def effective_authors(proj, packet, claim, facet, block=None, *, node=None, plan=None):
    authors = set(proj['authors'].get((block, claim, facet), set()))
    inherit = node and node.get('stage_kind') in ('C09_SEMANTIC','R07_SEMANTIC','G2_AUDIT')
    blocks = {block}
    if inherit and block is None and plan:
        blocks.update(b['id'] for b in plan['blocks'] if b.get('release_unit') == node.get('release_unit'))
    if inherit:
        for (author_block, author_claim, author_facet), refs in proj['authors'].items():
            if author_block in blocks and author_facet == facet:
                authors.update(refs)
    for h in packet['authorHistory']:
        if h['facet'] == facet and h.get('block', block) in blocks and (inherit or h['claimRef'] == claim):
            authors.update(h['semanticContributorRefs'])
    return authors


def check_collection(rt, work, node, result):
    s = rt.state(work); policy = s['plan'].get('agent_team')
    if not policy:
        return
    policy = validate_policy(policy, allow_empty=bool(s['plan'].get('simulation')))
    required = node_requirements(policy, node)
    collection = result.get('teamCollection')
    if not required and collection is None:
        check_open_findings(rt, work, node, result, required)
        return
    need(isinstance(collection, dict) and collection.get('submissionActor') == policy['store_writer'], 'team受理はMのみ')
    refs = collection.get('outputRefs', []); registrations = collection.get('registrationRefs', [])
    need(isinstance(refs, list) and len(refs) == len(set(refs)) and isinstance(registrations, list), 'team出力参照が不正・重複')
    p = project(rt.store.events(), work); covered = set(); reviews = []
    for ref in refs:
        need(ref in p['outputs'], '実行eventのないteam出力')
        row = p['outputs'][ref]; regref = row['registrationRef']
        need(rt.store.get(ref) == {k:v for k,v in row.items() if k != 'outputRef'}, 'team出力artifactがeventと違う')
        original = rt.store.get(row['originalOutputRef'])
        transcript = rt.store.get(original['harnessOutputRef'])
        need(transcript.get('structuredOutputHash') == digest({k:v for k,v in original.items() if k != 'harnessOutputRef'}), '原子報告と正規化前の入力hashが違う')
        need(regref in registrations and regref in p['registrations'], 'task登録との対応がない')
        reg = p['registrations'][regref]; a = reg['assignment']; out = row['output']
        need(rt.store.get(regref) == {k:v for k,v in reg.items() if k != 'registrationRef'}, 'team登録artifactがeventと違う')
        need(reg.get('policyHash') == digest(policy), '古いteam policyのtaskを受理しない')
        need(p['assignments'].get(a['assignmentId']) == regref, '交代前のteam出力はSTALE')
        need(a['node'] == node['id'] and a['inputHash'] == rt.input_hash(s, node), '別node・古い入力のteam出力')
        need(a['sourceSHA'] == current_source(s, node), 'team対象sourceSHAが違う')
        validate_target(rt, work, s, node, a, reg['packet'])
        need(reg['harness']['attestationMethod'] != 'simulation' or s['plan'].get('simulation'), '実Workへ模擬taskは禁止')
        need(p['reconciliations'].get(regref, {}).get('status') == 'COMPLETED', 'task完了が未確認')
        need(result.get('verdict') != 'PASS' or out.get('verdict') == 'PASS', '失敗・未確認の子出力をPASSへ転用しない')
        for f in out.get('findings', []):
            need(result.get('verdict') != 'PASS' or f.get('resolution') not in ('UNRESOLVED','OPEN'), '未解決findingを合意で閉じない')
        if out.get('kind') == 'review':
            need(out.get('claimRef') in a['claimRefs'] and out.get('facet') == a['facet'], '監査対象claimがassignment外')
            reviews.append((a, out, reg['packet']))
    for i, req in enumerate(required):
        for a, out, packet in reviews:
            if req['claimRef'] != out.get('claimRef') or req['facet'] != out.get('facet') or req['reviewKind'] != out.get('reviewKind'):
                continue
            need(out['targetHash'] in a['artifactHashes'].values(), '監査したartifact hashが違う')
            if req['independent']:
                need(a['performerRef'] not in effective_authors(p, packet, req['claimRef'], req['facet'], a.get('block'), node=node, plan=s['plan']), '同じclaim又は元表示の作者を独立監査者にしない')
                need(out.get('authorSeparation') is True, '非作者審査の宣言が不足')
            if req['sourceFirst']:
                need(out.get('sourceFirst') is True and packet['contextExposure']['authorRationaleVisibleAtFirstPass'] is False, 'source-first審査の証拠不足')
            if req['firstPass']:
                need(out.get('firstPass') is True and out.get('firstPassArtifactRef'), '初回所見を固定していない')
                first = rt.store.get(out['firstPassArtifactRef'])
                need(first.get('assignmentHash') == reg_hash_for(p, a) and first.get('packetHash') == packet['packetHash'], '初回所見の対象が違う')
            need(out.get('evidenceRefs') and out.get('rationale'), '監査の具体的根拠がない')
            covered.add(i)
    need(result.get('verdict') != 'PASS' or len(covered) == len(required), '必要なclaim/facetのteam reviewが不足')
    check_open_findings(rt, work, node, result, required, p)


def check_open_findings(rt, work, node, result, required, p=None):
    # Open findings survive changed inputs and node transitions. New hashes alone
    # are never evidence of resolution. Final reviews cover the whole unit/block.
    if result.get('verdict') == 'PASS':
        s = rt.state(work)
        p = p if p is not None else project(rt.store.events(), work)
        final = node.get('stage_kind') in ('C09_SEMANTIC','R07_SEMANTIC','G2_AUDIT')
        unit_blocks = {b['id'] for b in s['plan']['blocks'] if b.get('release_unit') == node.get('release_unit')}
        required_keys = {(r['claimRef'],r['facet']) for r in required}
        for findings in p['findings'].values():
            for f in findings:
                same_block = f.get('block') == node.get('block') if node.get('block') else f.get('block') in unit_blocks or f.get('block') is None
                relevant = f.get('node') == node['id'] or same_block and (final or (f.get('claimRef'), f.get('facet')) in required_keys)
                if relevant:
                    need(f.get('resolution') not in ('OPEN','UNRESOLVED') or valid_resolution(rt, work, s, p, f), '未解決findingの省略は禁止')


def valid_resolution(rt, work, s, p, finding):
    from definitions import instantiate
    from contracts import Rejected
    nodes = instantiate(s['plan'])
    for resolution in p['resolved_findings'].get((finding['findingId'], finding['outputRef']), []):
        row = p['outputs'][resolution['outputRef']]; regref = row['registrationRef']; reg = p['registrations'][regref]; a = reg['assignment']
        if p['reconciliations'].get(regref, {}).get('status') != 'COMPLETED' or p['assignments'].get(a['assignmentId']) != regref:
            continue
        n = nodes.get(a['node'])
        if not n or a['inputHash'] != rt.input_hash(s,n) or a['sourceSHA'] != current_source(s,n):
            continue
        if reg.get('policyHash') != digest(validate_policy(s['plan']['agent_team'], allow_empty=bool(s['plan'].get('simulation')))):
            continue
        try: validate_target(rt,work,s,n,a,reg['packet'])
        except Rejected: continue
        return True
    return False


def reg_hash_for(proj, assignment):
    return proj['registrations'][proj['assignments'][assignment['assignmentId']]]['assignmentHash']


def current_source(s, node):
    return s.get('release_versions', {}).get(node.get('release_unit'), s.get('candidate_sha')) if node.get('phase') in ('post-implementation','pre-release','release','acceptance','post-fix') else s['plan']['source_sha']


def validate_target(rt, work, s, node, assignment, packet=None):
    """A collector freeze backed by bound artifacts, not arbitrary hex."""
    ref = assignment.get('targetManifestRef')
    if not ref and s['plan'].get('simulation'):
        return  # explicitly synthetic fixture only
    if not ref and assignment['role'] in ('author','analyst'):
        need(packet, '作者にも固定されたincoming packetが必要')
        source = s.get('candidate_manifest',s['plan']['source_manifest']) if node.get('phase') in ('post-implementation','pre-release','release') else s['plan']['source_manifest']
        need(packet.get('sourceManifest') == source and packet.get('sourceSHA') == current_source(s,node), 'incoming source manifestが古い')
        blocks = [b for b in s['plan']['blocks'] if b['id']==node.get('block') or node.get('block') is None and b.get('release_unit')==node.get('release_unit')]
        contexts = {b['id']:s.get('block_contexts',{}).get(b['id'],{}) for b in blocks}
        need(packet.get('blockContext') == contexts, 'incoming block contextが違う')
        refs = packet.get('nativeEvidenceRefs', [])
        need(refs and all(r in s['evidence'] for r in refs), 'incoming native原資料証拠が必要')
        rt.fingerprint_refs(s,refs)
        allowed = set(source.values()) | {digest(source)}
        for c in contexts.values(): allowed.update(c.values())
        for dep in node.get('depends_on', []):
            if dep in s['results']: allowed.add(s['results'][dep]['artifact'])
        need(all(v in allowed for v in assignment['artifactHashes'].values()), '作者のincoming対象が固定原資料/既存成果物ではない')
        from contracts import file, sha
        matched = False
        for r in refs:
            e = s['evidence'][r]; data=e.get('data', {})
            if e.get('kind') == 'file' and data.get('path') in source:
                need(data['sha256'] == source[data['path']] == sha(file(rt.root,data['path'])), 'incoming原資料ファイルが変化')
                matched = True
            elif e.get('kind') == 'check' and data.get('source_sha') == current_source(s,node): matched = True
        need(matched, 'incoming原資料とnative証拠の対応がない')
        return
    need(ref, 'current target manifestが必要')
    m = rt.store.get(ref)
    events = [e for e in rt.store.events() if e['work'] == work and e['kind'] == 'team_target_bound' and e['payload'].get('targetManifestRef') == ref]
    need(events and events[-1]['payload'].get('submissionActor') == 'M', 'Mによるtarget固定eventがない')
    need(m.get('schemaVersion') == 'team-target/1' and m.get('work') == work and m.get('node') == node['id'] and m.get('block') == node.get('block') and m.get('facet') == assignment['facet'], 'targetのnode/block/facetが違う')
    need(m.get('inputHash') == rt.input_hash(s, node) and m.get('sourceSHA') == current_source(s, node), 'target manifestが古い')
    need(m.get('policyHash') == digest(validate_policy(s['plan'].get('agent_team'), allow_empty=bool(s['plan'].get('simulation')))), 'target policyが違う')
    need(all(m.get('artifactHashes', {}).get(k) == v for k,v in assignment['artifactHashes'].items()), 'assignment対象は固定target外')
    blocks = [b for b in s['plan']['blocks'] if b['id'] == node.get('block') or node.get('block') is None and b.get('release_unit') == node.get('release_unit')]
    current = {b['id']:s.get('block_contexts', {}).get(b['id'], {}) for b in blocks}
    need(m.get('blockContext') == current, 'target固定後にblock contextが変わった')
    from contracts import file, sha
    for evidence_ref in m.get('evidenceRefs', []):
        e = s.get('evidence', {}).get(evidence_ref, {})
        if e.get('kind') in ('file','screenshot'):
            need(sha(file(rt.root,e['data']['path'])) == e['data']['sha256'], 'target画像/資料が固定後に変化')
