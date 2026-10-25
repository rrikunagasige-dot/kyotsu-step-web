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
