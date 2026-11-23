"""Opt-in three-agent contracts. Structure/provenance checks, never semantic auto-PASS.

The caller's harness attestation is auditable transcription, not OS isolation or
cryptographic proof that an agent actually reasoned independently.
"""
from copy import deepcopy
from contracts import need, relative
from store import digest
from checkpoint import history_events

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
    need(type(p.get('max_active_subagents')) is int and p['max_active_subagents'] in (2, 3, 4), '子agent上限は2、固定3、承認付き固定4')
    need(p.get('allow_grandchildren') is False and p.get('store_writer') == 'M', '孫agent禁止・M単一writerが必要')
    p.setdefault('root_agent_ref', '/root')
    need(isinstance(p['root_agent_ref'], str) and p['root_agent_ref'], '実root agent参照が必要')
    from agent_guard import validate_fixed_team_policy
    validate_fixed_team_policy(p)
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
        elif e['kind'] == 'team_policy_adopted' and v.get('reviewer_handoff'):
            h = v['reviewer_handoff']
            for ref in h['interruptedRegistrations']:
                p['reconciliations'][ref] = dict(registrationRef=ref, status='INTERRUPTED', evidenceRefs=h['evidenceRefs'], submissionActor='M', handoffApproval=h['approval_ref'])
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


def informed_review_input_binding(s, node):
    """No receipt self-reference: adoption/revocation alone changes stage input."""
    from checkpoint import FIXED_WORK, INFORMED_REVIEW_NODES
    method = s.get('informed_review_method')
    if s.get('plan', {}).get('work_id') != FIXED_WORK or node.get('id') not in INFORMED_REVIEW_NODES or not method:
        return None
    return {'authorityRef': method.get('authorityRef'), 'revoked': method.get('revoked', False),
            'currentSourceSHA':s.get('candidate_sha'),
            'candidateManifestSHA256':digest(s.get('candidate_manifest',{}))}


def informed_review_author_history_binding(rt, work, s, node):
    if not informed_review_input_binding(s, node):
        return None
    # Disclosed contributors already in the authority do not change the input
    # when a reviewer registers that same history. A newly undisclosed author
    # does, without making a receipt depend on its own output registration.
    authors = {}
    for _,claim,facet,refs in informed_author_history(rt,work):
        authors.setdefault((claim,facet),set()).update(refs)
    for row in s['informed_review_method']['authority']['authorMatrix']:
        authors.setdefault((row['claimRef'],row['facet']),set()).update(row['semanticContributorRefs'])
    return digest(sorted((claim,facet,sorted(refs)) for (claim,facet),refs in authors.items()))


def informed_author_history(rt, work):
    p = project(history_events(rt,'team',work),work)
    authors = {key:set(refs) for key,refs in p['authors'].items()}
    for reg in p['registrations'].values():
        for row in reg['packet']['authorHistory']:
            key = (row.get('block',reg['assignment'].get('block')),row['claimRef'],row['facet'])
            authors.setdefault(key,set()).update(row['semanticContributorRefs'])
    return sorted((str(block),claim,facet,sorted(refs)) for (block,claim,facet),refs in authors.items())


def validate_informed_authority_body(rt, work, s, body):
    """Validate the adopted exception, never manufacture independence or quality."""
    from checkpoint import (FIXED_WORK, FIXED_ANCHOR, FIXED_CONTRACT_SHA256,
        INFORMED_REVIEW_PROPOSAL_SHA256, INFORMED_REVIEWERS, INFORMED_REVIEW_NODES,
        INFORMED_FIRST_PASS_REFS, INFORMED_PROPOSAL_PATH, INFORMED_ADOPTION_CALL_ID,
        current_core_identity)
    from capabilities import implementation_hash
    from contracts import file, sha
    need(getattr(rt.store, 'checkpoint_mode', False) and work == FIXED_WORK, 'DはQF01専用checkpointだけ')
    need(isinstance(body, dict) and body.get('schemaVersion') == 'qf01-informed-rereview-authority/1' and body.get('method') == 'qf01-informed-rereview/1', 'D authority schema/methodが違う')
    need(body.get('proposalSHA256') == INFORMED_REVIEW_PROPOSAL_SHA256 and sha(file(rt.root, INFORMED_PROPOSAL_PATH)) == INFORMED_REVIEW_PROPOSAL_SHA256, 'D02の正確な採用案が必要')
    need(body.get('adoption') == {'quote':'限定D02案を採用して進める',
         'source_ref':'request_user_input_async/'+INFORMED_ADOPTION_CALL_ID,
         'verification_level':'conversation_transcribed'}, 'D実本人採用の原文/出所が違う')
    need(body.get('work') == work and body.get('checkpointEpoch') == rt.store.checkpoint_epoch, 'DのWork/epochが違う')
    check_hash(body.get('expectedHead'), 'D expected HEAD')
    origin = rt.store._view.state_snapshot(work)
    need(s['plan'] == origin['plan'] and body.get('originalPlanSHA256') == digest(origin['plan']), 'Dで原planを変更しない')
    need(all(s['users'].get(k) == v for k,v in origin['users'].items()) and body.get('originalUsersSHA256') == digest(origin['users']), 'Dで原user/承認を変更しない')
    need(body.get('originalContractSHA256') == FIXED_CONTRACT_SHA256 and body.get('originalAnchor') == FIXED_ANCHOR, 'Dの原contract/anchorが違う')
    need(body.get('originalSourceSHA') == origin['plan']['source_sha'] and body.get('currentSourceSHA') == s['candidate_sha'], '原sourceと現在sourceの束縛が違う')
    need(body.get('candidateManifestSHA256') == digest(s['candidate_manifest']), 'D候補manifestが変化')
    identity = current_core_identity()
    need(body.get('core') == identity and body.get('definitionHash') == identity['definitionHash'] == s['definition_hash'], 'D現在core/定義が違う')
    need(body.get('implementationHash') == implementation_hash(rt), 'D現在serviceが違う')
    need(body.get('reviewerRefs') == list(INFORMED_REVIEWERS) and body.get('nodeIDs') == list(INFORMED_REVIEW_NODES), 'Dの固定2名/3工程が違う')
    need(body.get('historicalFirstPassRefs') == list(INFORMED_FIRST_PASS_REFS), '真正な原初回所見を付け替えない')
    for ref in INFORMED_FIRST_PASS_REFS:
        original = rt.store._view.object(ref); first = rt.store.get(ref)
        need(first == original and digest(first) == ref and first.get('authorMetadataReleased') is False, '原初回sealが変化')
        capture = rt.store.get(first['reportCaptureRef'])
        need(first['originalReport'] == capture.get('rawResult'), '原初回所見/capture不一致')
    need(all(body.get(k) is False for k in ('independent','sourceFirst','firstPass')) and body.get('globalQueueCoverage') == 'UNKNOWN', 'Dで独立性/完全履歴を捏造しない')
    matrix = body.get('authorMatrix')
    keys = {('teaching','design'),('layout','render'),('implemented-visible','render'),('integrated-release','render')}
    need(isinstance(matrix, list) and len(matrix) == 4 and {(r.get('claimRef'),r.get('facet')) for r in matrix} == keys, 'D作者行列は固定4範囲')
    history = informed_author_history(rt,work)
    for row in matrix:
        contributors = row.get('semanticContributorRefs')
        need(isinstance(contributors,list) and contributors and len(contributors) == len(set(contributors)) and all(isinstance(v,str) and v for v in contributors) and row.get('basis'), 'D寄与と根拠を明記する')
        known = set()
        for _,claim,facet,refs in history:
            if facet == row['facet'] and (facet == 'render' or claim == row['claimRef']): known.update(refs)
        if row['facet'] == 'render': known.update(('/root', *INFORMED_REVIEWERS))
        need(known <= set(contributors), 'Dで既知作者を消さない')
    _informed_evidence(rt, s, body.get('evidenceRefs'))
    from checkpoint import current_product_repair_context
    repair_context=current_product_repair_context(rt,s)
    nearby=repair_context['nearbyRepair'];math_repair=repair_context['mathRenderingRepair']
    if nearby:
        need(nearby['evidenceRef'] in body['evidenceRefs'],'D03_AUTHORITY_ACTUAL_SUPPLEMENT_REQUIRED')
    if math_repair:
        need(math_repair['evidenceRef'] in body['evidenceRefs'],'D04_AUTHORITY_ACTUAL_SUPPLEMENT_REQUIRED')
    return deepcopy(body)


def _informed_evidence(rt, s, refs):
    need(isinstance(refs,list) and refs and len(refs) == len(set(refs)) and all(r in s['evidence'] for r in refs), 'Dには登録された現在証拠が必要')
    rt.fingerprint_refs(s, refs)


def _informed_current_evidence(s, refs):
    return any(s['evidence'].get(ref,{}).get('data',{}).get('source_sha',
               s['evidence'].get(ref,{}).get('data',{}).get('head_sha')) == s['candidate_sha']
               for ref in refs)


def informed_target_evidence(rt, work, s, refs):
    """A dual-source target must contain current candidate bytes or capture."""
    from contracts import file, sha
    _informed_evidence(rt,s,refs)
    matched = False
    for ref in refs:
        e = s['evidence'][ref]; data = e.get('data',{})
        if e['kind'] in ('check','ci','app','capture','local_capture'):
            need(data.get('source_sha',data.get('head_sha')) == s['candidate_sha'], 'D target証拠sourceは現在候補へ')
            matched = True
        elif e['kind'] == 'file':
            path = data.get('path')
            need(path in s['candidate_manifest'] and data.get('sha256') == s['candidate_manifest'][path] == sha(file(rt.root,path)), 'D target fileは現在候補の実bytesへ')
            matched = True
        elif e['kind'] == 'screenshot':
            capture = s['evidence'].get(data.get('capture_ref'),{})
            need(capture.get('kind') in ('capture','local_capture') and capture.get('data',{}).get('source_sha') == s['candidate_sha'], 'D画像は現在候補captureへ')
            if capture['kind'] == 'local_capture':
                from local_render_evidence import validate_local_capture
                checked = validate_local_capture(rt,work,data['capture_ref'])
                need(checked['source_sha'] == s['candidate_sha'] and checked['files'].get(data['path']) == data.get('sha256'), 'D画像のcapture bytes不一致')
            need(sha(file(rt.root,data['path'])) == data.get('sha256'), 'D target画像が変化')
            matched = True
    need(matched, 'D targetに現在候補の実根拠がない')


def current_informed_authority(rt, work, s=None):
    from checkpoint import FIXED_WORK, INFORMED_REVIEW_NODES
    if not getattr(rt.store, 'checkpoint_mode', False) or work != FIXED_WORK:
        return None
    s = s if s is not None else rt.state(work)
    method = s.get('informed_review_method')
    if not method or method.get('revoked'):
        return None
    need(isinstance(method,dict), 'D authority projectionが不正')
    ref, body = method.get('authorityRef'), method.get('authority')
    need(ref == digest(body) and rt.store.get(ref) == body, 'D authority artifact不一致')
    adopted = [e for e in history_events(rt,'suffix',work) if e['kind'] == 'informed_review_method_adopted' and e['payload'].get('authorityRef') == ref]
    need(len(adopted) == 1 and adopted[0]['previous'] == body.get('expectedHead') and adopted[0]['payload'] == {'authorityRef':ref,'authority':body}, 'D採用event/expected HEAD不一致')
    validate_informed_authority_body(rt,work,s,body)
    return {'authorityRef':ref,'authority':deepcopy(body)}


def _informed_code(rt, work, s, node, refs):
    from capabilities import implementation_hash
    need(isinstance(refs,list) and len(refs) == len(set(refs)) and len(refs) == len(node['capability_requests']), 'D CODE receipt不足/重複')
    rows = history_events(rt,'capability-bindings',work)
    base = rt.input_hash(s,node); implementation = implementation_hash(rt)
    capabilities = []
    for ref in refs:
        r = rt.store.get(ref); output = rt.store.get(r.get('output'))
        need(r.get('node') == node['id'] and r.get('input_hash') == base and r.get('phase') == node['phase'], 'D CODE工程/入力が古い')
        need(r.get('implementation_hash') == implementation and r.get('status') == output.get('status') and r.get('status') in ('PASS','NEEDS_AI_REVIEW'), 'D CODE FAIL/未確認/旧serviceは禁止')
        bound = [e for e in rows if e['kind'] == 'capability_bound' and e['payload'] == {'node':node['id'],'input_hash':r['input_hash'],'receipt':ref}]
        actual = [e for e in rows if e['kind'] == 'capability_result' and e['payload'].get('cache_key') == r.get('cache_key') and e['payload'].get('capability') == r.get('capability') and e['payload'].get('output') == r.get('output') and e['payload'].get('phase') == node['phase']]
        need(bound and actual and any(a['seq'] < b['seq'] for a in actual for b in bound), 'D CODE実行/binding因果がない')
        capabilities.append(r.get('capability'))
    need(set(capabilities) == set(node['capability_requests']), 'D工程CODEの取り違え')


def build_informed_review_receipt(rt, work, node, collection, capability_receipts, evidence_refs, finding_dispositions):
    s = rt.state(work); method = current_informed_authority(rt,work,s)
    need(method and node['id'] in method['authority']['nodeIDs'], 'D採用なし/別工程')
    need(isinstance(collection,dict) and collection.get('methodAuthorityRef') == method['authorityRef'] and not collection.get('methodReceiptRef'), 'D authority参照が違う/自己receipt循環')
    p, reviews, required = _check_collection(rt,work,node,{'verdict':'PASS','teamCollection':collection,'capability_receipts':capability_receipts},method,check_findings=False)
    _informed_code(rt,work,s,node,capability_receipts)
    _informed_evidence(rt,s,evidence_refs)
    _check_nearby_finding_resolution(rt,s,node,p,reviews,required,capability_receipts,evidence_refs)
    _check_math_prose_finding_resolution(rt,s,node,p,reviews,required,capability_receipts,evidence_refs)
    need(isinstance(finding_dispositions,list), 'D finding解消記録は一覧')
    _validate_informed_dispositions(rt,work,s,node,p,collection,capability_receipts,evidence_refs,finding_dispositions)
    check_open_findings(rt,work,node,{'verdict':'PASS'},required,p,informed_dispositions=finding_dispositions)
    return _informed_receipt_body(rt,work,s,node,method,collection,capability_receipts,evidence_refs,finding_dispositions)


def _check_nearby_finding_resolution(rt,s,node,p,reviews,required,code_refs,evidence_refs):
    """D03's diagnostic needs both current render reports and actual UI measurements."""
    from checkpoint import current_product_repair_context,NEARBY_REPAIR_BASELINE,INFORMED_REVIEWERS,strict_json
    from contracts import file,sha
    nearby=current_product_repair_context(rt,s)['nearbyRepair']
    if nearby is None:return
    finding_id='QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123'
    prior_id='E-QF01-B-OPEN-NEARBY-FINDING-20261123'
    prior=s['evidence'].get(prior_id,{})
    data=prior.get('data',{})
    need(prior.get('kind')=='file' and prior.get('verification_level')!='simulation'
        and data.get('source_sha')==NEARBY_REPAIR_BASELINE,'D03_ORIGINAL_DIAGNOSTIC_REQUIRED')
    path=file(rt.root,data['path']);need(path.stat().st_size<=1_048_576,'D03_DIAGNOSTIC_SIZE')
    need(sha(path)==data.get('sha256'),'D03_ORIGINAL_DIAGNOSTIC_CHANGED')
    original=strict_json(path.read_bytes())
    need(original.get('schemaVersion')=='qf01-current-b-confirmed-local-open-finding/1'
        and original.get('findingID')==finding_id and original.get('sourceSHA')==NEARBY_REPAIR_BASELINE
        and original.get('status')=='OPEN_CONFIRMED_LOCAL_EVIDENCE'
        and original.get('productRepairApplied') is False,'D03_ORIGINAL_DIAGNOSTIC_CONTENT')
    measured=set()
    for ref in evidence_refs:
        evidence=s['evidence'].get(ref,{});d=evidence.get('data',{});measurement=d.get('nearby_visibility')
        if not (evidence.get('kind')=='check' and evidence.get('verification_level')=='local_execution'
            and d.get('status')=='PASS' and d.get('source_sha')==s['candidate_sha'] and isinstance(measurement,dict)):
            continue
        widths=measurement.get('widths')
        need(measurement.get('findingId')==finding_id and measurement.get('status')=='PASS'
            and isinstance(widths,list) and len(widths)==4 and all(type(width) is int for width in widths)
            and set(widths)=={320,390,430,1440}
            and type(measurement.get('sampleCount')) is int and measurement['sampleCount']==420
            and all(type(measurement.get(key)) is int and measurement[key]==0 for key in
                ('unverified','unexpectedCopies','missingCopies')),'D03_CURRENT_FOUR_WIDTH_MEASUREMENTS')
        measured.add(ref)
    need(measured,'D03_ACTUAL_UI_MEASUREMENTS_REQUIRED')
    for req in required:
        if req['facet']!='render':continue
        rows=[(a,out) for a,out,_ in reviews if out.get('claimRef')==req['claimRef']
            and out.get('facet')==req['facet'] and out.get('reviewKind')==req['reviewKind']]
        need(len(rows)==2 and {a['performerRef'] for a,_ in rows}==set(INFORMED_REVIEWERS),
             'D03_BOTH_CURRENT_RENDER_REPORTS_REQUIRED')
        for assignment,out in rows:
            findings=[f for f in out.get('findings',[]) if f.get('findingId')==finding_id]
            need(len(findings)==1,'D03_CURRENT_REPORT_KNOWN_FINDING_REQUIRED')
            f=findings[0]
            refs=f.get('evidenceRefs')
            need(f.get('resolution')=='VERIFIED_FIXED' and f.get('reexaminesEvidenceRef')==prior_id
                and f.get('claimRef')==req['claimRef'] and f.get('facet')==req['facet']
                and isinstance(f.get('reason'),str) and f['reason'].strip()
                and isinstance(refs,list) and refs and all(isinstance(ref,str) for ref in refs)
                and set(refs)<=set(out.get('evidenceRefs',[]))
                and set(refs)&measured,'D03_BOTH_REPORTS_CURRENT_FIX_EVIDENCE')
            target=rt.store.get(assignment['targetManifestRef'])
            supplied=out.get('codeReceiptRefs')
            need(isinstance(supplied,list) and supplied and all(isinstance(ref,str) for ref in supplied),
                 'D03_CURRENT_CODE_RECEIPT_LIST')
            supported=set(supplied)
            need(supported and supported<=set(code_refs) and set(target['artifactRefs'])<=supported,
                 'D03_BOTH_REPORTS_CURRENT_CODE_REQUIRED')


MATH_PROSE_ORIGINAL_C_DIAGNOSTIC_SHA256 = '8208aca84410fa62975a3b129f30d4b16d92c909780002af59316f41fedc8037'


def _check_math_prose_finding_resolution(rt,s,node,p,reviews,required,code_refs,evidence_refs):
    """Original C F06 stays OPEN until both current D reports and real checks agree."""
    from checkpoint import current_product_repair_context,MATH_RENDERING_REPAIR_BASELINE,INFORMED_REVIEWERS,strict_json
    from contracts import file,sha
    if current_product_repair_context(rt,s)['mathRenderingRepair'] is None:return
    finding_id='QF01-C-PROSE-MATH-SPAN-20261123'
    prior_id='E-QF01-C-OPEN-PROSE-MATH-FINDING-20261123'
    prior=s['evidence'].get(prior_id,{});data=prior.get('data',{})
    need(prior.get('kind')=='file' and prior.get('verification_level')!='simulation'
        and data.get('source_sha')==MATH_RENDERING_REPAIR_BASELINE,'D04_ORIGINAL_C_DIAGNOSTIC_REQUIRED')
    path=file(rt.root,data['path']);need(path.stat().st_size<=1_048_576,'D04_DIAGNOSTIC_SIZE')
    need(sha(path)==data.get('sha256')==MATH_PROSE_ORIGINAL_C_DIAGNOSTIC_SHA256,
         'D04_ORIGINAL_C_DIAGNOSTIC_CHANGED')
    original=strict_json(path.read_bytes())
    need(original.get('schemaVersion')=='qf01-current-c-open-prose-math-finding/1'
        and original.get('findingId')==finding_id and original.get('sourceSHA')==MATH_RENDERING_REPAIR_BASELINE
        and original.get('status')=='OPEN_CONFIRMED_CURRENT_C'
        and original.get('newProductRepairApplied') is False and original.get('blocksMaterialR04PASS') is True,
        'D04_ORIGINAL_C_DIAGNOSTIC_CONTENT')
    measured=set()
    for ref in evidence_refs:
        evidence=s['evidence'].get(ref,{});d=evidence.get('data',{});m=d.get('math_prose_rendering')
        if not (evidence.get('kind')=='check' and evidence.get('verification_level')=='local_execution'
            and d.get('status')=='PASS' and d.get('source_sha')==s['candidate_sha'] and isinstance(m,dict)):
            continue
        widths=m.get('widths')
        need(m.get('findingId')==finding_id and m.get('status')=='PASS'
            and isinstance(widths,list) and len(widths)==4 and all(type(w) is int for w in widths)
            and set(widths)=={320,390,430,1440}
            and type(m.get('sampleCount')) is int and m['sampleCount']==420
            and all(type(m.get(k)) is int and m[k]==0 for k in
                ('unverified','missingMathUnits','unexpectedMathUnits','splitMathUnits','unitErrors','sourceMismatch')),
            'D04_CURRENT_FOUR_WIDTH_MATH_MEASUREMENTS')
        # One KaTeX tree does not prove one visible mathematical line. The
        # collector must include visual line splits in splitMathUnits and
        # count every inspected operation sample; missing geometry is unknown.
        need(type(m.get('visualLineSampleCount')) is int and m['visualLineSampleCount']==420
            and type(m.get('visualLineUnverified')) is int and m['visualLineUnverified']==0,
            'D04_CURRENT_VISUAL_LINE_COVERAGE')
        measured.add(ref)
    need(measured,'D04_ACTUAL_MATH_UI_MEASUREMENTS_REQUIRED')
    for req in required:
        if req['facet']!='render':continue
        rows=[(a,out) for a,out,_ in reviews if out.get('claimRef')==req['claimRef']
            and out.get('facet')==req['facet'] and out.get('reviewKind')==req['reviewKind']]
        need(len(rows)==2 and {a['performerRef'] for a,_ in rows}==set(INFORMED_REVIEWERS),
             'D04_BOTH_CURRENT_RENDER_REPORTS_REQUIRED')
        for assignment,out in rows:
            findings=[f for f in out.get('findings',[]) if f.get('findingId')==finding_id]
            need(len(findings)==1,'D04_CURRENT_REPORT_KNOWN_FINDING_REQUIRED')
            f=findings[0];refs=f.get('evidenceRefs')
            need(f.get('resolution')=='VERIFIED_FIXED' and f.get('reexaminesEvidenceRef')==prior_id
                and f.get('claimRef')==req['claimRef'] and f.get('facet')==req['facet']
                and isinstance(f.get('reason'),str) and f['reason'].strip()
                and isinstance(refs,list) and refs and all(isinstance(r,str) for r in refs)
                and set(refs)<=set(out.get('evidenceRefs',[])) and set(refs)&measured,
                'D04_BOTH_REPORTS_CURRENT_FIX_EVIDENCE')
            target=rt.store.get(assignment['targetManifestRef']);supplied=out.get('codeReceiptRefs')
            need(isinstance(supplied,list) and supplied and all(isinstance(r,str) for r in supplied),
                 'D04_CURRENT_CODE_RECEIPT_LIST')
            need(set(supplied)<=set(code_refs) and set(target['artifactRefs'])<=set(supplied),
                 'D04_BOTH_REPORTS_CURRENT_CODE_REQUIRED')


def _informed_receipt_body(rt, work, s, node, method, collection, capability_receipts, evidence_refs, finding_dispositions):
    """Canonical metadata shared by fresh seals and historical resolution checks."""
    need(isinstance(collection,dict) and all(isinstance(v,list) for v in (capability_receipts,evidence_refs,finding_dispositions)), 'D receipt collection/参照一覧が不正')
    authority = method['authority']
    return {'schemaVersion':'qf01-informed-rereview-receipt/1','method':authority['method'],
        'authorityRef':method['authorityRef'],'work':work,'node':node['id'],
        'checkpointEpoch':authority['checkpointEpoch'],'inputHash':rt.input_hash(s,node),
        'sourceSHA':current_source(s,node),'currentSourceSHA':authority['currentSourceSHA'],
        'definitionHash':authority['definitionHash'],'implementationHash':authority['implementationHash'],
        'authorMatrixSHA256':digest(authority['authorMatrix']),
        'authorHistorySHA256':informed_review_author_history_binding(rt,work,s,node),
        'collection':deepcopy(collection),'capabilityReceipts':list(capability_receipts),
        'evidenceRefs':list(evidence_refs),'findingDispositions':deepcopy(finding_dispositions),
        'independent':False,'sourceFirst':False,'firstPass':False}


def validate_informed_review_receipt(rt, work, node, result):
    collection = result.get('teamCollection')
    need(isinstance(collection,dict) and collection.get('methodReceiptRef'), 'D sealed receiptが必要')
    ref = collection['methodReceiptRef']; body = rt.store.get(ref)
    bare = {k:v for k,v in collection.items() if k != 'methodReceiptRef'}
    expected = build_informed_review_receipt(rt,work,node,bare,result.get('capability_receipts',[]),body.get('evidenceRefs'),body.get('findingDispositions'))
    need(body == expected and digest(body) == ref, 'D receiptが現在入力/報告/証拠と違う')
    _informed_seal_event(rt,work,node,ref,body)
    check_open_findings(rt,work,node,result,node_requirements(rt.state(work)['plan']['agent_team'],node),informed_dispositions=body['findingDispositions'])
    return body


def _informed_seal_event(rt, work, node, ref, body):
    rows = history_events(rt,'suffix',work)
    expected = {'node':node['id'],'inputHash':body['inputHash'],
                'methodAuthorityRef':body['authorityRef'],'methodReceiptRef':ref}
    seals = [e for e in rows if e['kind'] == 'informed_review_receipt_sealed' and e['payload'].get('methodReceiptRef') == ref]
    need(seals and all(e['payload'] == expected for e in seals), 'D receipt実seal eventがない/不一致')
    first_seq = min(e['seq'] for e in seals)
    collection = body['collection']
    for kind,field,refs in [('team_output_recorded','outputRef',collection['outputRefs']),
                            ('team_task_reconciled','registrationRef',collection['registrationRefs']),
                            ('capability_bound','receipt',body['capabilityReceipts'])]:
        for reference in refs:
            need(any(e['seq'] < first_seq and e['kind'] == kind and e['payload'].get(field) == reference
                     and (kind != 'team_task_reconciled' or e['payload'].get('status') == 'COMPLETED')
                     for e in rows), 'D sealより後の報告/完了/CODEを取り込まない')
    def captured(reference,kind):
        return any(e['seq'] < first_seq and e['kind'] == 'team_harness_captured'
                   and e['payload'].get('artifactRef') == reference and e['payload'].get('recordType') == kind
                   and e['payload'].get('submissionActor') == 'M' for e in rows)
    for output_ref in collection['outputRefs']:
        output = rt.store.get(output_ref); reg = rt.store.get(output['registrationRef']); h = reg['harness']
        original = rt.store.get(output['originalOutputRef'])
        need(captured(h['toolResultRef'],'registration') and captured(original['harnessOutputRef'],'output'), 'D原captureは実sealより前へ')
        completed = False
        for e in rows:
            if e['seq'] >= first_seq or e['kind'] != 'team_task_reconciled' or e['payload'].get('registrationRef') != output['registrationRef'] or e['payload'].get('status') != 'COMPLETED':
                continue
            for evidence in e['payload'].get('evidenceRefs',[]):
                proof = rt.store.get(evidence)
                completed |= bool(proof.get('agentRef') == reg['assignment']['performerRef'] and proof.get('taskRef') == h['taskRef']
                    and ((captured(evidence,'reconciliation') and proof.get('observedStatus') == 'COMPLETED')
                         or (captured(evidence,'output') and proof.get('channel') == 'subagent-final')))
        need(completed, 'D完了captureは実sealより前へ')
    for code_ref in body['capabilityReceipts']:
        code = rt.store.get(code_ref)
        bounds = [e for e in rows if e['seq'] < first_seq and e['kind'] == 'capability_bound'
                  and e['payload'] == {'node':node['id'],'input_hash':body['inputHash'],'receipt':code_ref}]
        need(any(e['kind'] == 'capability_result' and e['payload'].get('cache_key') == code.get('cache_key')
                 and e['payload'].get('capability') == code.get('capability') and e['payload'].get('output') == code.get('output')
                 and e['payload'].get('phase') == node['phase'] and any(e['seq'] < b['seq'] for b in bounds)
                 for e in rows), 'D CODE result/boundは同じ実sealより前へ')


def _informed_harness(rt, work, p, row, reg, original, transcript):
    from checkpoint import INFORMED_REVIEWERS
    a = reg['assignment']; packet = reg['packet']; h = reg['harness']
    validate_assignment(a); validate_packet(packet,a)
    need(a['performerRef'] in INFORMED_REVIEWERS, 'D再検査の実担当は固定2名だけ')
    need(a['role'] == 'reviewer' and original.get('kind') == 'review' and not original.get('authoredClaims'), 'D再検査はreviewerの実報告へ')
    need(reg['assignmentHash'] == digest(dict(assignment=a,packetHash=packet['packetHash'],harness=h,policyHash=reg['policyHash'])), 'D assignment seal不一致')
    raw = rt.store.get(h['toolResultRef'])
    need(h.get('agentRef') == a['performerRef'] == raw.get('agentRef') and h.get('taskRef') == raw.get('taskRef')
         and h.get('parentRef') == raw.get('parentRef') == '/root'
         and raw.get('toolName') in ('collaboration.spawn_agent','collaboration.followup_task')
         and raw.get('rawResult') is not None and raw.get('attestationMethod') == h.get('attestationMethod')
         and h.get('attestationMethod') in ('harness-tool-result','transcribed-tool-result'), 'D実担当登録の原captureが違う')
    need(transcript.get('agentRef') == a['performerRef'] and transcript.get('taskRef') == h['taskRef']
         and transcript.get('channel') in ('subagent-message','subagent-final') and transcript.get('rawResult') is not None, 'D子の実報告をroot代筆へ付替えない')
    normalized = deepcopy(original)
    for finding in normalized.get('findings',[]):
        finding.update(node=a['node'],block=a.get('block'),inputHash=a['inputHash'])
    need(normalized == row['output'] and original.get('assignmentHash') == reg['assignmentHash']
         and original.get('packetHash') == packet['packetHash'] and original.get('performerRef') == a['performerRef'], 'D原報告を正規化で別所見へ変えない')
    rows = history_events(rt,'suffix',work)
    def captured(reference,kind):
        return any(e['kind'] == 'team_harness_captured' and e['payload'].get('artifactRef') == reference
                   and e['payload'].get('recordType') == kind and e['payload'].get('submissionActor') == 'M' for e in rows)
    need(captured(h['toolResultRef'],'registration') and captured(original['harnessOutputRef'],'output'), 'D原harness capture eventがない')
    reconciliation = p['reconciliations'][row['registrationRef']]
    matched = False
    for reference in reconciliation.get('evidenceRefs',[]):
        proof = rt.store.get(reference)
        matched |= bool(proof.get('agentRef') == a['performerRef'] and proof.get('taskRef') == h['taskRef']
            and ((captured(reference,'reconciliation') and proof.get('observedStatus') == 'COMPLETED')
                 or (captured(reference,'output') and proof.get('channel') == 'subagent-final')))
    need(matched, 'D完了を実harnessと照合できない')


def _validate_informed_dispositions(rt, work, s, node, p, collection, code_refs, evidence_refs, dispositions):
    from checkpoint import INFORMED_REVIEWERS
    keys = set()
    for d in dispositions:
        key = (d.get('findingId'),d.get('priorOutputRef'))
        need(key not in keys, 'D解消記録の重複'); keys.add(key)
        prior = p['outputs'].get(d.get('priorOutputRef'),{}).get('output',{})
        matching = [f for f in prior.get('findings',[]) if (f['findingId'],f['claimRef'],f['facet']) == (d.get('findingId'),d.get('claimRef'),d.get('facet'))]
        need(matching and d.get('resolution') in ('VERIFIED_FIXED','DISPROVEN','OUT_OF_SCOPE') and d.get('reason'), 'D原finding/具体的解消根拠がない')
        need(d.get('evidenceRefs') and set(d['evidenceRefs']) <= set(evidence_refs) and d.get('codeReceiptRefs') and set(d['codeReceiptRefs']) <= set(code_refs), 'D解消の現在実測/CODEが不足')
        refs = d.get('reviewOutputRefs')
        need(isinstance(refs,list) and len(refs) == 2 and len(set(refs)) == 2 and set(refs) <= set(collection['outputRefs']), 'D解消には両現在報告が必要')
        reviewers = set()
        for ref in refs:
            row = p['outputs'][ref]; reg = p['registrations'][row['registrationRef']]; out = row['output']
            reviewers.add(reg['assignment']['performerRef'])
            need(out.get('claimRef') == d['claimRef'] and out.get('facet') == d['facet'], 'D解消報告のclaim/facetが違う')
            findings = [f for f in out['findings'] if f.get('findingId') == d['findingId'] and f.get('reexaminesOutputRef') == d['priorOutputRef']]
            need(len(findings) == 1, 'D両報告に同じ原findingの再検査が必要')
            f = findings[0]
            need(f.get('resolution') == d['resolution'] and f.get('claimRef') == d['claimRef'] and f.get('facet') == d['facet'] and f.get('reason') and f.get('evidenceRefs') and set(f['evidenceRefs']) <= set(d['evidenceRefs']), 'D解消と両報告の根拠が違う')
            need(set(d['codeReceiptRefs']) <= set(out.get('codeReceiptRefs',[])), 'D両報告が現在CODEを確認していない')
        need(reviewers == set(INFORMED_REVIEWERS), '作者単独宣言でD findingを閉じない')


def check_collection(rt, work, node, result):
    authority = current_informed_authority(rt, work) if informed_review_input_binding(rt.state(work), node) else None
    if authority and node['id'] in authority['authority']['nodeIDs']:
        validate_informed_review_receipt(rt, work, node, result)
        return
    _check_collection(rt, work, node, result)


def _check_collection(rt, work, node, result, informed=None, *, check_findings=True):
    s = rt.state(work); policy = s['plan'].get('agent_team')
    if not policy:
        return
    policy = validate_policy(policy, allow_empty=bool(s['plan'].get('simulation')))
    required = node_requirements(policy, node)
    collection = result.get('teamCollection')
    if not required and collection is None:
        if check_findings:
            check_open_findings(rt, work, node, result, required)
        return
    need(isinstance(collection, dict) and collection.get('submissionActor') == policy['store_writer'], 'team受理はMのみ')
    refs = collection.get('outputRefs', []); registrations = collection.get('registrationRefs', [])
    need(isinstance(refs, list) and len(refs) == len(set(refs)) and isinstance(registrations, list), 'team出力参照が不正・重複')
    p = project(history_events(rt, 'team', work), work); covered = set(); reviews = []
    base = rt.input_hash(s,node) if informed else None
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
        need(a['node'] == node['id'] and a['inputHash'] == (base if informed else rt.input_hash(s,node)), '別node・古い入力のteam出力')
        need(a['sourceSHA'] == current_source(s, node), 'team対象sourceSHAが違う')
        validate_target(rt, work, s, node, a, reg['packet'])
        need(reg['harness']['attestationMethod'] != 'simulation' or s['plan'].get('simulation'), '実Workへ模擬taskは禁止')
        need(p['reconciliations'].get(regref, {}).get('status') == 'COMPLETED', 'task完了が未確認')
        if informed:
            _informed_harness(rt,work,p,row,reg,original,transcript)
            target_refs = rt.store.get(a['targetManifestRef']).get('artifactRefs')
            need(isinstance(target_refs,list) and target_refs and len(target_refs) == len(set(target_refs))
                 and set(target_refs) <= set(result.get('capability_receipts',[])), 'D targetは今回のcurrent CODE receipt subsetへ')
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
            if informed:
                body = informed['authority']
                need(a['performerRef'] in body['reviewerRefs'], 'Dは固定2名の実報告だけ')
                need(a.get('independent') is False and all(out.get(k) is False for k in ('independent','sourceFirst','firstPass')), 'Dを独立・初回審査と表示しない')
                need(not out.get('firstPassArtifactRef') and packet['contextExposure']['authorRationaleVisibleAtFirstPass'] is True, '原初回所見の付替え又は理由露出の隠蔽は禁止')
                row = next(r for r in body['authorMatrix'] if (r['claimRef'],r['facet']) == (req['claimRef'],req['facet']))
                authors = effective_authors(p, packet, req['claimRef'], req['facet'], a.get('block'), node=node, plan=s['plan']) | set(row['semanticContributorRefs'])
                need(out.get('authorSeparation') is (a['performerRef'] not in authors), 'Dの作者分離宣言が実作者履歴と違う')
                need(out.get('currentSourceSHA') == body['currentSourceSHA'], 'D再検査の現在renderer sourceが違う')
                need(set(out.get('evidenceRefs', [])) <= set(s['evidence']), 'D報告根拠は登録された実証拠へ')
                informed_target_evidence(rt,work,s,out.get('evidenceRefs',[]))
            elif req['independent']:
                need(a['performerRef'] not in effective_authors(p, packet, req['claimRef'], req['facet'], a.get('block'), node=node, plan=s['plan']), '同じclaim又は元表示の作者を独立監査者にしない')
                need(out.get('authorSeparation') is True, '非作者審査の宣言が不足')
            if not informed and req['sourceFirst']:
                need(out.get('sourceFirst') is True and packet['contextExposure']['authorRationaleVisibleAtFirstPass'] is False, 'source-first審査の証拠不足')
            if not informed and req['firstPass']:
                need(out.get('firstPass') is True and out.get('firstPassArtifactRef'), '初回所見を固定していない')
                first = rt.store.get(out['firstPassArtifactRef'])
                need(first.get('assignmentHash') == reg_hash_for(p, a) and first.get('packetHash') == packet['packetHash'], '初回所見の対象が違う')
            need(out.get('evidenceRefs') and out.get('rationale'), '監査の具体的根拠がない')
            covered.add((i,a['performerRef']) if informed else i)
    expected = {(i,who) for i in range(len(required)) for who in informed['authority']['reviewerRefs']} if informed else set(range(len(required)))
    need(result.get('verdict') != 'PASS' or covered == expected, '必要なclaim/facetのteam reviewが不足')
    if check_findings:
        check_open_findings(rt, work, node, result, required, p)
    return p, reviews, required


def check_open_findings(rt, work, node, result, required, p=None, informed_dispositions=None):
    # Open findings survive changed inputs and node transitions. New hashes alone
    # are never evidence of resolution. Final reviews cover the whole unit/block.
    if result.get('verdict') == 'PASS':
        s = rt.state(work)
        p = p if p is not None else project(history_events(rt, 'team', work), work)
        final = node.get('stage_kind') in ('C09_SEMANTIC','R07_SEMANTIC','G2_AUDIT')
        unit_blocks = {b['id'] for b in s['plan']['blocks'] if b.get('release_unit') == node.get('release_unit')}
        required_keys = {(r['claimRef'],r['facet']) for r in required}
        dispositions = list(informed_dispositions or [])
        if informed_review_input_binding(s,node):
            dispositions.extend(_accepted_informed_dispositions(rt,work,s,p))
        for findings in p['findings'].values():
            for f in findings:
                same_block = f.get('block') == node.get('block') if node.get('block') else f.get('block') in unit_blocks or f.get('block') is None
                relevant = f.get('node') == node['id'] or same_block and (final or (f.get('claimRef'), f.get('facet')) in required_keys)
                if relevant:
                    informed_fixed = any(d['findingId'] == f['findingId'] and d['priorOutputRef'] == f['outputRef'] and d['claimRef'] == f['claimRef'] and d['facet'] == f['facet'] for d in dispositions)
                    need(f.get('resolution') not in ('OPEN','UNRESOLVED') or informed_fixed or valid_resolution(rt, work, s, p, f), '未解決findingの省略は禁止')


def _accepted_informed_dispositions(rt, work, s, p):
    """Only current, accepted receipts can carry a limited resolution forward."""
    from definitions import instantiate
    from contracts import Rejected
    from checkpoint import INFORMED_REVIEW_NODES, CheckpointRejected
    method = current_informed_authority(rt,work,s)
    if not method:
        return []
    nodes = instantiate(s['plan']); found = []
    for name in INFORMED_REVIEW_NODES:
        row = s['results'].get(name)
        if not row or name not in nodes or row.get('input_hash') != rt.input_hash(s,nodes[name]):
            continue
        result = rt.store.get(row['artifact']); collection = result.get('teamCollection',{})
        ref = collection.get('methodReceiptRef')
        if result.get('verdict') != 'PASS' or not ref:
            continue
        try:
            body = rt.store.get(ref); node = nodes[name]
            expected_body = _informed_receipt_body(rt,work,s,node,method,
                {k:v for k,v in collection.items() if k != 'methodReceiptRef'},
                result.get('capability_receipts',[]),body.get('evidenceRefs'),body.get('findingDispositions'))
            need(body == expected_body and digest(body) == ref, '過去D解消receiptの全metadataが現在版と違う')
            need(body.get('authorityRef') == method['authorityRef'] and body.get('inputHash') == rt.input_hash(s,node) and body.get('authorHistorySHA256') == informed_review_author_history_binding(rt,work,s,node), '旧D解消receiptは失効')
            need(body.get('collection') == {k:v for k,v in collection.items() if k != 'methodReceiptRef'} and body.get('capabilityReceipts') == result.get('capability_receipts'), 'D解消receiptの報告/CODEが違う')
            _informed_seal_event(rt,work,node,ref,body)
            _check_collection(rt,work,node,result,method,check_findings=False)
            _informed_code(rt,work,s,node,body['capabilityReceipts'])
            _informed_evidence(rt,s,body['evidenceRefs'])
            _validate_informed_dispositions(rt,work,s,node,p,body['collection'],body['capabilityReceipts'],body['evidenceRefs'],body['findingDispositions'])
            found.extend(body['findingDispositions'])
        except (Rejected, CheckpointRejected):
            continue
    return found


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
    events = [e for e in history_events(rt, 'team', work) if e['kind'] == 'team_target_bound' and e['payload'].get('targetManifestRef') == ref]
    need(events and events[-1]['payload'].get('submissionActor') == 'M', 'Mによるtarget固定eventがない')
    need(m.get('schemaVersion') == 'team-target/1' and m.get('work') == work and m.get('node') == node['id'] and m.get('block') == node.get('block') and m.get('facet') == assignment['facet'], 'targetのnode/block/facetが違う')
    need(m.get('inputHash') == rt.input_hash(s, node) and m.get('sourceSHA') == current_source(s, node), 'target manifestが古い')
    if informed_review_input_binding(s,node):
        method = current_informed_authority(rt,work,s)
        need(method and m.get('methodAuthorityRef') == method['authorityRef'] and m.get('currentSourceSHA') == s['candidate_sha'] and m.get('candidateManifestSHA256') == digest(s['candidate_manifest']), 'D targetの現在source/authority/manifestが違う')
        informed_target_evidence(rt,work,s,m.get('evidenceRefs',[]))
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
