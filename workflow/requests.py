"""Versioned intake and correction queue; registry status alone never proves a repair."""
import json
from contracts import file, need, sha
from store import digest

DEFAULT_REGISTRY = 'work/items/W-GOV-010-learning-production-workflow/n07/feedback/NEGATIVE_CASES.json'


def pending(rt, state):
    rows = [r for r in rt.pending_issues() if state['plan'].get('simulation') or not rt.state(r['work'])['plan'].get('simulation')]
    for work in {e['work'] for e in rt.store.events() if e['kind']=='opened'}:
        child=rt.state(work)
        if child['plan']['command']!='CMD-WORK-001' or child['plan']['profile']!='material' or child['plan'].get('simulation') and not state['plan'].get('simulation'):continue
        complete=historically_closed(rt,work,child)
        if not complete:rows.append({'id':work,'work':work,'version':child['candidate_sha'],'origin':'unfinished-correction','description':'未完了の修正Work'})
    paths = set(state['plan'].get('correction_queue_refs', []))
    if (rt.root / DEFAULT_REGISTRY).is_file(): paths.add(DEFAULT_REGISTRY)
    for path in sorted(paths):
        data = json.loads(file(rt.root, path).read_text()); version = data.get('sourceSHA')
        need(version, 'feedback registryに対象版がない')
        for case in data.get('cases', []):
            need(case.get('id') and case.get('status'), 'feedbackの識別子・状態がない')
            resolution = case.get('resolution', {})
            closed = False
            child = resolution.get('work')
            if child and any(e['work'] == child and e['kind'] == 'opened' for e in rt.store.events()):
                cs = rt.state(child)
                # Recursion-free: a valid closure result and ledger proof, never a registry flag.
                closed = bool(historically_closed(rt,child,cs) and case_linked_to_closure(rt,cs,case['id'],version) and cs['plan']['source_sha']==version and (state['plan'].get('simulation') or not cs['plan'].get('simulation')))
            if not closed:
                rows.append({'id': case['id'], 'version': version, 'origin': 'feedback-registry', 'registry': path,
                             'registry_hash': sha(file(rt.root, path)), 'description': case.get('rejected', ''), 'evidence': case.get('evidence'), 'work': child})
    for e in rt.store.events():
        if e['kind'] == 'request_received':
            p = e['payload']
            if p['kind'] == 'correction' and not any(x['kind'] == 'request_resolved' and x['payload']['request_id'] == p['id'] for x in rt.store.events()):
                rows.append(dict(p, work=e['work'], origin='request-intake'))
    unique = {}
    for row in rows: unique[(row.get('origin', 'store'), row.get('work'), row['id'], row.get('version'))] = row
    return list(unique.values())


def intake(rt, work, request):
    need(request.get('id') and request.get('quote') and request.get('source_ref') and request.get('version'), '依頼の原文・出所・版が必要')
    need(request.get('kind') in ('correction', 'creation'), '依頼の入口は作成／修正')
    rt.state(work)
    old = [e for e in rt.store.events() if e['kind'] == 'request_received' and e['payload']['id'] == request['id']]
    if old:
        need(old[0]['payload'] == request and old[0]['work'] == work, '同じ依頼IDの内容が違う'); return old[0]
    return rt.append('request_received', work, request)


def capture_feedback(rt, work, user):
    if user['intent'] not in ('quality_positive', 'quality_negative', 'reject_block', 'reject_app'): return
    case = {'id': 'feedback-' + digest({'work': work, 'event': user['id']})[:20], 'evaluation_event': user['id'],
            'target_version': user['candidate_sha'], 'quote': user['quote'], 'quality': 'POSITIVE' if user['intent'] == 'quality_positive' else 'NEGATIVE',
            'block': user['block'], 'release_unit': user.get('release_unit'), 'source_ref': user['source_ref'], 'status': 'RECORDED'}
    rt.append('feedback_captured', work, case)


def historically_closed(rt,work,s):
    """Completion proves the recorded version; unrelated future tool changes do not reopen old repairs."""
    proof=s.get('closed')
    if proof:return s['results'].get('Z01_CLOSE',{}).get('artifact')==proof['result']
    if s['plan'].get('workflow_version')=='production/2':return False
    nodes=__import__('definitions').instantiate(s['plan']);tail='S24' if s['plan'].get('workflow_version')=='production/1' else 'Z01_CLOSE'
    if not all(s['results'].get(n,{}).get('verdict')=='PASS' for n in nodes):return False
    gate='S22' if tail=='S24' else 'G3_FINAL'
    result=s['results'].get(gate)
    if not result or s['users'].get(rt.store.get(result['artifact']).get('user_event'),{}).get('intent')!='accept_app':return False
    ending=max((e['seq'] for e in rt.store.events() if e['work']==work and e['kind']=='result' and e['payload']['node']==tail),default=0)
    mutations={'result_reopened','revised','candidate','patch_applied','production_context','definition_migrated','issue'}
    return bool(ending and not any(e['work']==work and e['seq']>ending and e['kind'] in mutations for e in rt.store.events()) and not any(not i.get('resolved_by') for i in s['issues'].values()))


def case_linked_to_closure(rt,state,case_id,origin_version):
    """A verified multi-case repair can close registry cases without inventing child Works."""
    if state['plan'].get('parent_case')==case_id:return True
    for node,result in state['results'].items():
        if not node.startswith('R08_CAPTURE_LEARNING@'):continue
        for row in rt.store.get(result['artifact']).get('case_updates',[]):
            if row.get('id')!=case_id or row.get('origin_version')!=origin_version or row.get('resolution')!='VERIFIED_FIXED':continue
            refs=row.get('repair_evidence_refs',[])
            if any(state['evidence'].get(ref,{}).get('kind')=='app' and state['evidence'][ref]['data'].get('source_sha')==state['candidate_sha'] for ref in refs):return True
    return False


_RECEIPT_ORIGIN='W-MATH-QF01-QUALITY-FOLLOWUP-20261115'
_RECEIPT_REPAIR='W-MATH-QF01-FULL-RELEASE-P035-20261115'
_RECEIPT_ISSUES={'SC-02','LAYOUT-SOURCE-04','P044-LAYOUT-TOUCH-48-01'}
_RECEIPT_SOURCE='9e6d6798ac40624373db0a87e53e7d8938fb317a'


def _receipt_origin_snapshot(rt):
    state=rt.state(_RECEIPT_ORIGIN)
    need(set(state['issues'])==_RECEIPT_ISSUES,'元三件以外の受付にはこのpolicyを使わない')
    return digest({'plan':state['plan'],'issues':state['issues'],'users':state['users'],
                   'feedback':[e['payload'] for e in rt.store.events() if e['work']==_RECEIPT_ORIGIN and e['kind']=='feedback_captured']})


def _receipt_validate(rt, payload):
    """原OPEN/DONEは変更せず、現在proofだけを毎回検証する。Z01は依存に含めない。"""
    from definitions import instantiate,DEFINITION_HASH
    from adapters import _vt_current_transition,_vt_fresh_implementation
    need(payload['origin_intake_work']==_RECEIPT_ORIGIN and payload['repair_work']==_RECEIPT_REPAIR and set(payload['issue_ids'])==_RECEIPT_ISSUES and len(payload['issue_ids'])==3,'receipt対象が登録外')
    origin=rt.state(_RECEIPT_ORIGIN);repair=rt.state(_RECEIPT_REPAIR)
    need(origin['plan']['profile']=='material' and origin['plan']['command']=='CMD-WORK-001' and origin['plan']['source_sha']==_RECEIPT_SOURCE and origin['plan'].get('parent_work')==_RECEIPT_REPAIR and not origin['plan']['scope']['paths'],'元調査受付のidentityが違う')
    need(not origin['plan'].get('simulation') or repair['plan'].get('simulation'),'模擬受付を実修復へ連結しない')
    need(_RECEIPT_ISSUES<=set(origin['issues']) and digest(origin['issues'])==payload['origin_issues_hash'],'元issueが変化した')
    need(repair['candidate_sha']==payload['repair_candidate_sha'] and repair['definition_hash']==DEFINITION_HASH and not rt.integrity(repair),'修復の現candidate/実装/bytesが違う')
    transition=repair.get('version_transition');need(transition,'正規版移行がない')
    _vt_current_transition(rt,_RECEIPT_REPAIR,repair,digest(transition))
    need(payload['receipt_policy_ref']==transition['policy_ref'],'共同承認以外のreceipt policy')
    need(_receipt_origin_snapshot(rt)==transition['origin_intake_snapshot'],'原受付の承認済み三件以外が変化した')
    current=_vt_fresh_implementation(rt)
    need(current==payload['implementation'],'receiptから実装が変化した')
    nodes=instantiate(repair['plan'])
    kinds={'R07_VERIFY','R07_SEMANTIC','G2_AUDIT','G3_HOST','G3_FINAL','R03_IMPACT_SWEEP','R08_CAPTURE_LEARNING','L01_LEARNING'}
    required={name for name,node in nodes.items() if node.get('stage_kind') in kinds}
    need(set(payload['repair_prefix_refs'])==required and required,'現prefixの過不足')
    for name in required:
        result=repair['results'].get(name)
        need(result and result['artifact']==payload['repair_prefix_refs'][name] and rt.node_status(repair,nodes[name])=='PASSED','修復の現工程が未完了:'+name)
    accepts=[]
    for name in required:
        if name.startswith('G3_FINAL@'):
            body=rt.store.get(payload['repair_prefix_refs'][name]);user=repair['users'].get(body.get('user_event'))
            need(user and user['intent']=='accept_app' and user['candidate_sha']==repair['candidate_sha'] and (repair['plan'].get('simulation') or user['verification_level']!='simulation'),'本人の現在受入がない')
            accepts.append(user['id'])
    approval=rt.approval(repair);need(approval and approval['id'] in payload['approval_event_refs'] and set(accepts)<=set(payload['approval_event_refs']),'共同承認/本人受入の原eventが不足')
    proof=rt.store.get(payload['issue_proof_map_ref'])
    need(proof.get('schemaVersion')=='correction-receipt-proof/1' and len(proof.get('issues',[]))==3 and {r['issue_id'] for r in proof['issues']}==_RECEIPT_ISSUES,'issue proof mapの過不足')
    learning=[rt.store.get(payload['repair_prefix_refs'][name]) for name in required if name.startswith('R08_CAPTURE_LEARNING@')]
    for row in proof['issues']:
        need(row['origin_issue_hash']==digest(origin['issues'][row['issue_id']]) and row['origin_source_sha']==_RECEIPT_SOURCE and row['repair_candidate_sha']==repair['candidate_sha'],'issueの元版/currentが違う')
        need(row.get('original_failure_refs') and row.get('current_reproduction_refs') and row.get('repair_refs') and row.get('regression_refs') and row.get('app_refs'),'原FAIL/再現/修復/回帰/実appの欠落')
        rt.fingerprint_refs(origin,row['original_failure_refs'])
        for key in ('current_reproduction_refs','repair_refs','regression_refs','app_refs'):rt.fingerprint_refs(repair,row[key])
        for ref in row['app_refs']:
            evidence=repair['evidence'].get(ref,{})
            need(evidence.get('kind')=='app' and evidence['data']['source_sha']==repair['candidate_sha'],'現在の実app証拠でない')
        case=next((case for report in learning for case in report.get('case_updates',[]) if case.get('id')==row['issue_id']),None)
        need(case and case.get('origin_version')==_RECEIPT_SOURCE and case.get('resolution')=='VERIFIED_FIXED' and set(row['repair_refs'])<=set(case.get('repair_evidence_refs',[])),'正式修復事例との結合がない')
    return {'origin':origin,'repair':repair,'proof':proof}


def link_correction_receipt(rt,work,receipt_policy_ref,origin_intake_work,issue_ids,repair_work,
                            repair_candidate_sha,repair_prefix_refs,issue_proof_map_ref,
                            approval_event_refs,evidence_refs,expected_store_head):
    """共同案限定の派生proof。result/issue_resolved/work_closedは作らない。"""
    from adapters import _vt_fresh_implementation
    need(work==origin_intake_work==_RECEIPT_ORIGIN and rt.store.head==expected_store_head,'receipt Work/HEADが違う')
    need(isinstance(issue_proof_map_ref,str) and len(issue_proof_map_ref)==64,'proof ref不正')
    proof=rt.store.get(issue_proof_map_ref);need(len(json.dumps(proof,ensure_ascii=False).encode())<=5_000_000,'receipt proof上限')
    origin=rt.state(work);need(not origin['claims'] and not any(not p.get('completed') for p in origin['patches'].values()),'元受付の実行中')
    rt.fingerprint_refs(origin,evidence_refs);need(evidence_refs,'receipt根拠がない')
    payload={'schemaVersion':'correction-receipt/1','receipt_policy_ref':receipt_policy_ref,'origin_intake_work':origin_intake_work,
             'issue_ids':sorted(issue_ids),'repair_work':repair_work,'repair_candidate_sha':repair_candidate_sha,
             'repair_prefix_refs':repair_prefix_refs,'issue_proof_map_ref':issue_proof_map_ref,'approval_event_refs':approval_event_refs,
             'origin_issues_hash':digest(origin['issues']),'implementation':_vt_fresh_implementation(rt),'evidence_refs':evidence_refs}
    _receipt_validate(rt,payload)
    need(rt.store.head==expected_store_head,'receipt検査中に台帳が進んだ')
    previous=[e for e in rt.store.events() if e['work']==work and e['kind']=='correction_receipt_linked']
    if previous and previous[-1]['payload']==payload:return previous[-1]
    return rt.append('correction_receipt_linked',work,payload)


def receipt_dispositions(rt,state):
    rows=[]
    for event in rt.store.events():
        if event['kind']!='correction_receipt_linked' or event['work']!=_RECEIPT_ORIGIN:continue
        try:
            _receipt_validate(rt,event['payload']);valid=True;reason=None
        except (ValueError,KeyError,FileNotFoundError) as error:valid=False;reason=str(error)
        rows.append({'event':event['id'],'receipt_hash':event['hash'],'origin_work':_RECEIPT_ORIGIN,'repair_work':_RECEIPT_REPAIR,'issue_ids':event['payload']['issue_ids'],'valid':valid,'disposition':'原状態OPEN・現修復proofによる引継済み' if valid else '現在未充足','reason':reason})
    # 過去epochは表示のため保持し、充足判定には最新だけを使う。
    for row in rows[:-1]:row['valid']=False;row['disposition']='過去epoch（原proof保持）'
    return rows


def has_current_correction_receipt(rt,origin_work,repair_work):
    if origin_work!=_RECEIPT_ORIGIN or repair_work!=_RECEIPT_REPAIR:return False
    return any(row['valid'] for row in receipt_dispositions(rt,rt.state(repair_work)))


_original_pending=pending

def pending(rt,state):
    raw=_original_pending(rt,state)
    receipts=receipt_dispositions(rt,state)
    if not any(row['valid'] for row in receipts):return raw
    origin=rt.state(_RECEIPT_ORIGIN)
    only_registered_open=set(k for k,v in origin['issues'].items() if not v.get('resolved_by'))<=_RECEIPT_ISSUES
    return [row for row in raw if not (row.get('work')==_RECEIPT_ORIGIN and (row['id'] in _RECEIPT_ISSUES and row.get('version') in (None,_RECEIPT_SOURCE) or row['id']==_RECEIPT_ORIGIN and row.get('origin')=='unfinished-correction' and only_registered_open))]
