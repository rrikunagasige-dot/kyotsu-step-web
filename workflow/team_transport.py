"""Register actual harness transcripts in the existing Store; never spawn an LLM."""
from copy import deepcopy
from contracts import need
from store import digest
from team import validate_policy, validate_assignment, validate_packet, project, effective_authors, REVIEW_KINDS, check_hash, validate_target, current_source


def _context(rt, work, actor):
    s = rt.state(work); p = validate_policy(s['plan'].get('agent_team'), allow_empty=bool(s['plan'].get('simulation')))
    need(p and actor == p['store_writer'], 'team transportのwriterはMのみ')
    return s, p, project(rt.store.events(), work)


def capture_harness(rt, work, record, submission_actor='M', event_id=None):
    """Persist a bounded harness transcript, explicitly identifying transcription.

    This is an attestation by the collector, not a callable agent-spawn API or a
    cryptographic assertion about a remote system.
    """
    s, policy, p = _context(rt, work, submission_actor)
    raw = deepcopy(record)
    need(isinstance(raw, dict) and all(raw.get(k) for k in ('agentRef','taskRef','attestationMethod')), 'harness原記録の担当・task・転記方法が必要')
    need(raw.get('rawResult') is not None, 'harness原出力が必要')
    need(raw['attestationMethod'] in ('harness-tool-result','transcribed-tool-result','simulation'), 'harness転記方法が不明')
    need(raw['attestationMethod'] != 'simulation' or s['plan'].get('simulation'), '実Workへの模擬harness captureは禁止')
    if 'observedStatus' in raw:
        need(raw['observedStatus'] in ('COMPLETED','CANCELLED','STALE','INTERRUPTED','UNVERIFIED'), '照合したharness状態が不明')
        need(raw.get('toolName') in ('collaboration.list_agents','collaboration.wait_agent','collaboration.interrupt_agent','collaboration.agent_result'), 'harness状態の出所が不明')
        record_type = 'reconciliation'
    elif 'structuredOutputHash' in raw:
        check_hash(raw['structuredOutputHash'], '構造化報告hash')
        need(raw.get('channel') in ('subagent-message','subagent-final','root-report','simulation'), 'harness報告channelが不明')
        need(raw['channel'] != 'simulation' or s['plan'].get('simulation'), '実Workへの模擬報告は禁止')
        need(raw['channel'] != 'root-report' or raw['agentRef'] == policy['root_agent_ref'], '子agent報告をroot出力へ付替えない')
        record_type = 'output'
    else:
        need(raw.get('toolName') in ('collaboration.spawn_agent','collaboration.followup_task','root-task'), '未対応のharness起動記録')
        if raw['toolName'] == 'root-task':
            need(raw['agentRef'] == policy['root_agent_ref'] and not raw.get('parentRef'), 'root担当参照が違う')
        else:
            need(raw.get('parentRef') == policy['root_agent_ref'], 'root直属の子taskのみ')
        record_type = 'registration'
    ref = rt.store.put(raw)
    payload = dict(artifactRef=ref, recordType=record_type, submissionActor=submission_actor, attestationMethod=raw['attestationMethod'])
    ev = rt.append('team_harness_captured', work, payload, event_id=event_id or 'team-capture-'+ref)
    return dict(artifactRef=ref, recordType=record_type, attestationMethod=raw['attestationMethod'], eventRef=ev['hash'])


def _captured(rt, work, ref, record_type):
    return any(e['work'] == work and e['kind'] == 'team_harness_captured' and e['payload'].get('artifactRef') == ref and e['payload'].get('recordType') == record_type for e in rt.store.events())


def bind_target(rt, work, node_id, facet, artifact_refs, evidence_refs, artifact_hashes=None, submission_actor='M', event_id=None):
    """Collector freeze backed by bound CODE/author artifacts and native evidence.

    Arbitrary Store JSON does not establish current UI provenance. Transcription
    is still an attestation, not a cryptographic or pedagogical proof.
    """
    s, policy, p = _context(rt, work, submission_actor)
    from definitions import instantiate
    nodes = instantiate(s['plan']); need(node_id in nodes, 'target nodeが不明'); node = nodes[node_id]
    need(artifact_refs and evidence_refs, 'targetに成果物とnative証拠が必要')
    need(all(ref in s['evidence'] for ref in evidence_refs), 'target証拠にはnative登録IDが必要（子報告hashは別参照）')
    rt.fingerprint_refs(s, evidence_refs)
    allowed = set(); events = rt.store.events(); base = rt.input_hash(s, node)
    hash_fields = {'irHash','planHash','layoutHash','layoutDesignHash','constructionDesignHash','learnerCopyHash','visibleStateHash','compiledPresentationHash'}
    def collect(value):
        if isinstance(value, dict):
            for key,v in value.items():
                if key in hash_fields and isinstance(v,str) and len(v)==64: allowed.add(v)
                if isinstance(v, (dict,list)): collect(v)
        elif isinstance(value, list):
            for v in value: collect(v)
    for ref in artifact_refs:
        value = rt.store.get(ref)
        is_code = any(e['work']==work and e['kind']=='capability_bound' and e['payload'].get('receipt')==ref and e['payload'].get('node')==node_id and e['payload'].get('input_hash')==base for e in events)
        is_author = ref in p['outputs'] and p['outputs'][ref]['output'].get('kind') in ('author','analysis')
        if is_author:
            reg = p['registrations'][p['outputs'][ref]['registrationRef']]
            is_author = reg['assignment']['node']==node_id and reg['assignment']['inputHash']==base and p['assignments'].get(reg['assignment']['assignmentId'])==p['outputs'][ref]['registrationRef']
        need(is_code or is_author or s['plan'].get('simulation'), 'target成果物は現nodeのCODE receipt又は実作者出力へ束縛する')
        allowed.add(ref); collect(value)
        if is_code:
            need(value.get('node')==node_id and value.get('input_hash')==base, 'CODE target receiptが古い')
            output = rt.store.get(value['output']); allowed.add(value['output']); collect(output)
    visual = False
    for ref in evidence_refs:
        e = s['evidence'][ref]; data=e.get('data', {})
        if e['kind'] in ('check','ci','app'):
            source = data.get('source_sha',data.get('head_sha')); need(source==current_source(s,node), 'target証拠のsourceが違う')
        if e['kind']=='screenshot':
            capture=s['evidence'].get(data.get('capture_ref'),{})
            need(capture.get('kind')=='capture' and capture.get('data',{}).get('source_sha')==current_source(s,node), 'target画像は現在sourceのcaptureへ束縛する')
            visual=True
        if e['kind']=='file' and node.get('phase') in ('analysis','pre-design'): visual=True
        if data.get('sha256'): allowed.add(data['sha256'])
    if facet=='render': need(visual, '表示targetにはphaseに合う画像/静的配置証拠が必要')
    hashes = dict(artifact_hashes or {'artifact'+str(i):ref for i,ref in enumerate(artifact_refs)})
    need(hashes and all(value in allowed for value in hashes.values()), 'targetへ無根拠なhashを追加しない')
    blocks = [b for b in s['plan']['blocks'] if b['id']==node.get('block') or node.get('block') is None and b.get('release_unit')==node.get('release_unit')]
    contexts = {b['id']:s.get('block_contexts',{}).get(b['id'],{}) for b in blocks}
    for c in contexts.values():
        if c.get(facet): need(c[facet] in allowed and c[facet] in hashes.values(), '現在block contextの対象をtargetへ含める')
    target=dict(schemaVersion='team-target/1',work=work,node=node_id,block=node.get('block'),facet=facet,inputHash=base,sourceSHA=current_source(s,node),policyHash=digest(policy),artifactHashes=hashes,artifactRefs=list(artifact_refs),evidenceRefs=list(evidence_refs),blockContext=contexts)
    ref=rt.store.put(target)
    ev=rt.append('team_target_bound',work,dict(targetManifestRef=ref,submissionActor=submission_actor),event_id=event_id or 'team-target-'+ref)
    return dict(targetManifestRef=ref,eventRef=ev['hash'])


def register_task(rt, work, assignment, packet, harness, submission_actor='M', event_id=None):
    s, policy, p = _context(rt, work, submission_actor)
    a = deepcopy(assignment); h = deepcopy(harness); packet = deepcopy(packet)
    validate_assignment(a); validate_packet(packet, a)
    need(not a.get('work') or a['work'] == work, '別Workのassignment')
    from definitions import instantiate
    nodes = instantiate(s['plan'])
    need(a['node'] in nodes and a.get('block') == nodes[a['node']].get('block'), '不明なnode/blockのassignment')
    need(a['inputHash'] == rt.input_hash(s, nodes[a['node']]), '登録時の基礎入力が古い')
    validate_target(rt, work, s, nodes[a['node']], a, packet)
    need(all(h.get(k) for k in ('agentRef','taskRef','toolResultRef','attestationMethod','logicalRole')), '実harness登録情報が不足')
    need(h['agentRef'] == a['performerRef'] and h['logicalRole'] in ('M','A','B'), '実担当とassignmentが違う')
    need(h['attestationMethod'] in ('harness-tool-result','transcribed-tool-result','simulation'), '未確認のharness記録')
    need(h['attestationMethod'] != 'simulation' or s['plan'].get('simulation'), '実Workへ模擬登録は禁止')
    raw = rt.store.get(h['toolResultRef'])
    need(s['plan'].get('simulation') or _captured(rt, work, h['toolResultRef'], 'registration'), '実harness capture eventがない')
    need(not raw.get('attestationMethod') or raw['attestationMethod'] == h['attestationMethod'], 'harness転記方法を変更しない')
    need(raw.get('agentRef') == h['agentRef'] and raw.get('taskRef') == h['taskRef'] and raw.get('toolName') in ('collaboration.spawn_agent','collaboration.followup_task','root-task'), 'tool結果と担当taskの対応がない')
    need(raw.get('rawResult') is not None, '原tool出力がない')
    if h['logicalRole'] != 'M':
        need(h['agentRef'] != policy['root_agent_ref'], 'rootを子agentへ改名しない')
        need(h.get('parentRef') == policy['root_agent_ref'] and h['parentRef'] == raw.get('parentRef'), '孫agent又は親が未確認')
        roots = {r['harness']['parentRef'] for r in p['registrations'].values() if r['harness']['logicalRole'] != 'M'}
        need(not roots or h['parentRef'] in roots, '異なる親・孫agentは禁止')
    else:
        need(not h.get('parentRef') and raw['toolName'] == 'root-task' and h['agentRef'] == policy['root_agent_ref'], 'Mはroot taskのみ')
    oldref = p['assignments'].get(a['assignmentId'])
    if oldref:
        old = p['registrations'][oldref]
        if old['assignment'] == a and old['packet'] == packet and old['harness'] == h and old.get('policyHash') == digest(policy):
            return dict(registrationRef=oldref, assignmentHash=old['assignmentHash'], duplicate=True)
        need(p['reconciliations'].get(oldref, {}).get('status') in ('COMPLETED','CANCELLED','STALE','INTERRUPTED'), '実行中taskの担当変更は禁止')
        need(a['roleEpoch'] > old['assignment']['roleEpoch'], '交代後は新roleEpochが必要')
    active = [r for ref,r in p['registrations'].items() if p['reconciliations'].get(ref, {}).get('status') not in ('COMPLETED','CANCELLED','STALE','INTERRUPTED')]
    children = {r['harness']['agentRef'] for r in active if r['harness']['logicalRole'] != 'M'}
    if h['logicalRole'] != 'M':
        children.add(h['agentRef']); need(len(children) <= policy['max_active_subagents'], '同時子agentは2体まで')
    need(not any(r['harness']['taskRef'] == h['taskRef'] for r in active), '同じ実taskの二重assignment')
    for dep in a['dependsOnTasks']:
        ref = p['assignments'].get(dep)
        need(ref and p['reconciliations'].get(ref, {}).get('status') == 'COMPLETED', '依存taskが未完了・不明')
    for r in active:
        need(not any(x == y or x.startswith(y+'/') or y.startswith(x+'/') for x in a['allowedPaths'] for y in r['assignment']['allowedPaths']), 'agent間の書込path予約が競合')
    if a['role'] == 'reviewer':
        for claim in a['claimRefs']:
            if a.get('independent'):
                need(a['performerRef'] not in effective_authors(p, packet, claim, a['facet'], a.get('block'), node=nodes[a['node']], plan=s['plan']), '作者を独立審査へ予約しない')
    body = dict(assignment=a, packet=packet, harness=h, submissionActor=submission_actor, policyHash=digest(policy),
                assignmentHash=digest(dict(assignment=a, packetHash=packet['packetHash'], harness=h, policyHash=digest(policy))))
    ref = rt.store.put(body); payload = dict(body, registrationRef=ref)
    ev = rt.append('team_task_registered', work, payload, event_id=event_id or 'team-register-'+ref)
    return dict(registrationRef=ref, assignmentHash=body['assignmentHash'], eventRef=ev['hash'])


def record_output(rt, work, registration_ref, output, submission_actor='M', event_id=None):
    s, policy, p = _context(rt, work, submission_actor)
    need(registration_ref in p['registrations'], '未登録taskの出力')
    reg = p['registrations'][registration_ref]; a = reg['assignment']; out = deepcopy(output)
    need(p['assignments'].get(a['assignmentId']) == registration_ref, '交代前taskの遅延出力はSTALE')
    need(p['reconciliations'].get(registration_ref, {}).get('status') not in ('CANCELLED','STALE','INTERRUPTED'), '終了済taskへ出力追加しない')
    need(out.get('assignmentHash') == reg['assignmentHash'] and out.get('packetHash') == reg['packet']['packetHash'] and out.get('performerRef') == a['performerRef'], '出力の実担当・assignment・packetが違う')
    need(out.get('harnessOutputRef'), '実子task報告の原出力参照が必要')
    transcript = rt.store.get(out['harnessOutputRef'])
    need(s['plan'].get('simulation') or _captured(rt, work, out['harnessOutputRef'], 'output'), '実子報告のcapture eventがない')
    need(transcript.get('agentRef') == a['performerRef'] and transcript.get('taskRef') == reg['harness']['taskRef'] and transcript.get('rawResult') is not None, '報告の実agent/taskとの対応がない')
    need(transcript.get('channel') in ('subagent-message','subagent-final','root-report','simulation'), '報告の出所channelが不明')
    need(transcript['channel'] != 'simulation' or s['plan'].get('simulation'), '実Workへ模擬報告は禁止')
    need(transcript['channel'] != 'root-report' or reg['harness']['logicalRole'] == 'M', '子agentの結果をroot報告で代筆しない')
    need(transcript.get('structuredOutputHash') == digest({k:v for k,v in out.items() if k != 'harnessOutputRef'}), '原出力の転記と構造化報告が対応しない')
    original_ref = rt.store.put(out)
    need(out.get('kind') in ('author','review','analysis') and out.get('verdict') in ('PASS','FAIL','UNVERIFIED'), '出力種別・判定が不正')
    need(isinstance(out.get('findings'), list), 'finding一覧が必要')
    need(out.get('kind') != 'review' or a['role'] == 'reviewer', 'レビュー担当でないtaskの監査')
    if out['kind'] == 'review':
        need(out.get('claimRef') in a['claimRefs'] and out.get('facet') == a['facet'] and out.get('targetHash') in a['artifactHashes'].values() and out.get('reviewKind') in REVIEW_KINDS, '監査対象がassignment外')
    need(not out.get('authoredClaims') or a['role'] != 'reviewer', '共同編集後は作者taskへ役割変更する')
    for claim in out.get('authoredClaims', []):
        need(claim.get('claimRef') in a['claimRefs'] and claim.get('facet') == a['facet'] and claim.get('artifactHash') in a['artifactHashes'].values(), '作者記録がassignment範囲外')
    for finding in out['findings']:
        need(all(finding.get(k) for k in ('findingId','claimRef','facet','reason','evidenceRefs','resolution')), 'findingの根拠不足')
        need(finding['resolution'] in ('OPEN','UNRESOLVED','VERIFIED_FIXED','DISPROVEN','OUT_OF_SCOPE'), 'finding dispositionが不明')
        need(finding['claimRef'] in a['claimRefs'] and finding['facet'] == a['facet'], 'finding対象がassignment外')
        finding.update(node=a['node'], block=a.get('block'), inputHash=a['inputHash'])
        if finding.get('resolvesOutputRef'):
            old_output = p['outputs'].get(finding['resolvesOutputRef'], {})
            old_findings = old_output.get('output', {}).get('findings', [])
            need(any(f['findingId'] == finding['findingId'] and f['claimRef'] == finding['claimRef'] and f['facet'] == finding['facet'] and f.get('block') == a.get('block') for f in old_findings), '解決対象findingのblock/claim/facetとの対応がない')
            need(a['role'] == 'reviewer' and finding['resolution'] in ('VERIFIED_FIXED','DISPROVEN','OUT_OF_SCOPE'), 'finding解決は根拠付きreview taskへ')
            need(a['performerRef'] not in effective_authors(p, reg['packet'], finding['claimRef'], finding['facet'], a.get('block')), '作者の自己宣言だけでfindingを閉じない')
            need(finding.get('resolutionEvidenceRef'), 'finding解決の検証artifactが必要')
            proof = rt.store.get(finding['resolutionEvidenceRef'])
            need(proof.get('targetHash') in a['artifactHashes'].values() and proof.get('reason') and proof.get('evidenceRefs'), '解決証拠の版・具体的根拠がない')
        need(out['verdict'] != 'PASS' or finding['resolution'] not in ('OPEN','UNRESOLVED'), '未解決を子task PASSにしない')
    previous = [v for v in p['outputs'].values() if v['registrationRef'] == registration_ref]
    if previous:
        need(previous[0]['output'] == out, '同じtaskへ異なる結果。改訂assignmentが必要')
        return dict(outputRef=previous[0]['outputRef'], duplicate=True)
    body = dict(registrationRef=registration_ref, output=out, originalOutputRef=original_ref, submissionActor=submission_actor)
    ref = rt.store.put(body); ev = rt.append('team_output_recorded', work, dict(body, outputRef=ref), event_id=event_id or 'team-output-'+ref)
    if any(f['resolution'] in ('OPEN','UNRESOLVED') for f in out['findings']) and a['node'] in s['results']:
        # Dedicated validated late-finding path. Do not relax Runtime.reopen for
        # arbitrary callers or leave an already cached PASS hiding new evidence.
        rt.append('result_reopened', work, dict(node=a['node'], previous_result=s['results'][a['node']]['artifact'],
                  reason='新しい実task出力に未解決findingがある', evidence_refs=[ref]), event_id='team-reopen-'+ref)
    return dict(outputRef=ref, eventRef=ev['hash'])


def reconcile_task(rt, work, registration_ref, status, evidence_refs, submission_actor='M', event_id=None):
    s, policy, p = _context(rt, work, submission_actor)
    need(registration_ref in p['registrations'], '未登録taskの照合')
    need(status in ('COMPLETED','CANCELLED','STALE','INTERRUPTED','UNVERIFIED'), 'task状態が不明')
    need(evidence_refs, 'task照合の証拠が必要')
    evidences = [rt.store.get(ref) for ref in evidence_refs]
    if not s['plan'].get('simulation'):
        reg = p['registrations'][registration_ref]
        matched = False
        for ref, proof in zip(evidence_refs, evidences):
            if proof.get('agentRef') != reg['assignment']['performerRef'] or proof.get('taskRef') != reg['harness']['taskRef']:
                continue
            captured = _captured(rt, work, ref, 'reconciliation') or _captured(rt, work, ref, 'output')
            matched |= bool(captured and (proof.get('observedStatus') == status or status == 'COMPLETED' and proof.get('channel') == 'subagent-final'))
        need(matched, '実task状態と照合できるharness証拠がない')
    if status == 'COMPLETED':
        need(any(v['registrationRef'] == registration_ref for v in p['outputs'].values()), '出力なしで完了にしない')
    payload = dict(registrationRef=registration_ref, status=status, evidenceRefs=list(evidence_refs), submissionActor=submission_actor)
    old = p['reconciliations'].get(registration_ref)
    if old:
        if old == payload:
            return dict(status=status, duplicate=True)
        need(old['status'] == 'UNVERIFIED', '照合済task状態の書換えは禁止')
    ev = rt.append('team_task_reconciled', work, payload, event_id=event_id or 'team-reconcile-'+digest(payload))
    return dict(status=status, eventRef=ev['hash'])
