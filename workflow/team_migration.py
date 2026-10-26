"""Explicit production/2 policy adoption; preserves historical evidence as history."""
from copy import deepcopy
from contracts import need
from store import digest
from team import validate_policy, node_requirements, project


def adopt_team_policy(rt, work, policy, approval_ref, expected_head):
    s = rt.state(work)
    need(s['plan'].get('workflow_version') == 'production/2', 'team導入はproduction/2のみ')
    need(rt.store.head == expected_head, 'team導入の期待HEADが違う')
    need(not s['claims'] and not any(not e.get('outcome') for e in s['external'].values()), '実行中claim・未確定外部操作がある')
    tasks = project(rt.store.events(), work)
    need(all(tasks['reconciliations'].get(ref, {}).get('status') in ('COMPLETED','CANCELLED','STALE','INTERRUPTED') for ref in tasks['registrations']), '実行中subtaskのpolicy変更は禁止')
    policy = validate_policy(policy, allow_empty=bool(s['plan'].get('simulation')))
    need(policy and policy != s['plan'].get('agent_team'), '新しいteam policyが必要')
    u = s['users'].get(approval_ref, {})
    need(u.get('intent') == 'approve_proposal' and u.get('quote') and u.get('source_ref') and u.get('scope') == s['plan']['scope'], '範囲付きの実ユーザー承認が必要')
    need(u.get('proposal_hash') == s['plan']['proposal']['hash'] and u.get('reply_to') == s['plan']['proposal']['hash'], '承認が現在の具体案に対応しない')
    need(u.get('verification_level') != 'simulation' or s['plan'].get('simulation'), '実Workへ模擬承認は禁止')
    need(u.get('team_policy_hash') == digest(policy) or s['plan']['proposal'].get('teamPolicyHash') == digest(policy), '承認と導入policy hashを明示的に結ぶ')
    from graphs import normalized, instantiate
    from integration import bundle_fingerprint
    new_plan = deepcopy(s['plan']); new_plan['agent_team'] = policy; new_plan = normalized(new_plan)
    old_fingerprints = {b['id']:bundle_fingerprint(s, b) for b in s['plan']['approval_bundles']}
    new_state = dict(s, plan=new_plan)
    need(old_fingerprints == {b['id']:bundle_fingerprint(new_state,b) for b in new_plan['approval_bundles']}, 'policy導入で内容承認のhashを変えない')
    nodes = instantiate(new_plan)
    invalid = {nid for nid in s['results'] if nid in nodes and node_requirements(policy, nodes[nid])}
    # Downstream PASS depends on newly required reviews; keep artifacts archived,
    # never let a historic acceptance silently close an unreviewed release.
    changed = True
    while changed:
        before = set(invalid)
        invalid.update(nid for nid,n in nodes.items() if set(n['depends_on']).intersection(invalid) and nid in s['results'])
        changed = invalid != before
    archive = rt.store.put(dict(plan=s['plan'], definition_hash=s['definition_hash'], results=s['results'], users=s['users'], team_events=[e for e in rt.store.events() if e['work']==work and e['kind'].startswith('team_')]))
    payload = dict(plan=new_plan, archive=archive, approval_ref=approval_ref, policyHash=digest(policy),
                   invalidated_results=sorted(invalid), retained_results=sorted(set(s['results'])-invalid),
                   preserved_approval_fingerprints=old_fingerprints)
    return rt.append('team_policy_adopted', work, payload)
