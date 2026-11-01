"""Fresh, scope-bound harness inventory checks. Transcription is not OS isolation.

This module validates the actual list_agents result supplied by M. It does not
query or block the platform API and never treats a stopped child as a free slot.
"""
from contracts import need
from store import digest
import math

KNOWN_STATUSES = {'pending_init', 'running', 'waiting', 'idle', 'completed', 'stopped', 'interrupted', 'errored', 'shutdown'}


def validate_fixed_team_policy(policy):
    if policy.get('max_active_subagents') == 2:
        need(not policy.get('monitor_agent_ref'), '旧2子policyへ監視役を黙って追加しない')
        return
    limit = policy.get('max_active_subagents')
    need(limit in (3, 4), '明示対応する上限は2、固定3、承認付き固定4')
    roster = policy.get('fixed_subagents')
    roles = {'A', 'B', 'MONITOR'} | ({'REVIEWER'} if limit == 4 else set())
    need(isinstance(roster, dict) and set(roster) == roles, '固定する全担当の実体を明示する')
    need(len(set(roster.values())) == limit and all(isinstance(x, str) and x.rsplit('/', 1)[0] == policy['root_agent_ref'] for x in roster.values()), '異なるroot直属の固定子が必要')
    need(policy.get('monitor_agent_ref') == roster['MONITOR'], '監視役の対応が違う')
    need(policy.get('max_total_subagents') == limit and policy.get('count_completed_subagents') is True, '停止・完了を含む累計人数の制約が必要')
    need(isinstance(policy.get('authorization_ref'), str) and policy['authorization_ref'], '人数差分のユーザー指示参照が必要')
    need(isinstance(policy.get('guard_session'), str) and policy['guard_session'], '現sessionのguard契約が必要')
    if limit == 4:
        extension = policy.get('review_extension', {})
        need(isinstance(extension, dict) and isinstance(extension.get('work_id'), str) and extension['work_id'], '固定4の例外は単一Workへ束縛する')
        need(extension.get('previous_total') == 3 and extension.get('additional_reviewers') == 1, '追加は固定3から審査員1名のみ')
        need(extension.get('reviewer_ref') == roster['REVIEWER'] and extension.get('fork_turns') == 'none', '追加審査員は履歴共有なしの固定実体')
        need(extension.get('authorization_ref') == policy['authorization_ref'], '固定4例外の承認参照が違う')
        history = policy.get('retained_history')
        if history is not None:
            need(isinstance(history, dict) and history.get('provenance_ref'), '履歴人数の出所が必要')
            previous = history.get('policy', {})
            need(previous.get('max_total_subagents') == 3 and history.get('policy_hash') == digest(previous), '固定3の履歴policyをhashで保持する')
            validate_fixed_team_policy(previous)
            need(previous['root_agent_ref'] == policy['root_agent_ref'] and previous['fixed_subagents'] == {k:roster[k] for k in ('A','B','MONITOR')}, '過去の固定3名を入れ替えない')
            need(set(history.get('agent_refs', [])) == set(previous['fixed_subagents'].values()), '一覧から消えた過去の全3名を累計へ残す')
        handoff = policy.get('reviewer_handoff')
        if handoff is not None:
            need(isinstance(handoff, dict), '交代記録はobject')
            previous = handoff.get('previous_policy', {})
            need(not previous.get('reviewer_handoff'), 'この移行では審査員交代は一回のみ')
            validate_fixed_team_policy(previous)
            need(previous.get('max_active_subagents') == 4 and handoff.get('previous_policy_hash') == digest(previous), '交代前の固定4方針を保持する')
            need(handoff.get('authorization_ref') and handoff.get('work_id') == extension['work_id'], '交代の範囲付き承認が必要')
            need(handoff.get('new_reviewer') == roster['REVIEWER'] and handoff.get('retired_reviewer') == previous['fixed_subagents']['REVIEWER'], '新旧審査員を明示する')
            need(handoff['new_reviewer'] not in previous['fixed_subagents'].values(), '別の新担当が必要')
            need(all(roster[k] == previous['fixed_subagents'][k] for k in ('A','B','MONITOR')), '審査員以外を交代しない')
            need(policy.get('retained_history') == previous.get('retained_history'), '旧3担当の履歴を保持する')
            need(policy['guard_session'] != previous['guard_session'], '交代後は新sessionへ束縛する')


def validate_policy_work(policy, work):
    if policy and policy.get('max_active_subagents') == 4:
        need(policy.get('review_extension', {}).get('work_id') == work, '固定4の例外を別Workへ流用しない')


def verify_agent_inventory(policy, record, *, session, operation, nonce, now_ms, used_nonces=()):
    validate_fixed_team_policy(policy)
    need(policy.get('max_active_subagents') in (3, 4), 'fresh guardは固定子policy専用')
    need(isinstance(record, dict) and record.get('toolName') == 'collaboration.list_agents', '実一覧の出所が必要')
    need(all(isinstance(v, str) and v for v in (session, operation, nonce)), 'session/operation/nonceが必要')
    need(record.get('session') == session and record.get('operation') == operation and record.get('nonce') == nonce, '別session/operation/nonceの一覧')
    need(nonce not in used_nonces, 'nonceの再利用は禁止')
    observed = record.get('observed_at_ms')
    need(type(observed) in (int, float) and type(now_ms) in (int, float), '観測時刻を数値で固定する')
    need(math.isfinite(observed) and math.isfinite(now_ms), '非有限の時刻を拒否する')
    need(0 <= now_ms - observed <= 120_000, '実一覧は120秒以内・未来時刻不可')
    raw = record.get('rawResult')
    agents = raw.get('agents') if isinstance(raw, dict) else None
    need(isinstance(agents, list) and agents, '全statusを含む実agents配列が必要')
    root = policy['root_agent_ref']; roster = set(policy['fixed_subagents'].values())
    names = set(); observed_rows = []
    for row in agents:
        need(isinstance(row, dict) and isinstance(row.get('agent_name'), str), 'agent行の形式が不明')
        name, status = row['agent_name'], row.get('agent_status')
        need(name not in names, '実一覧のagent重複'); names.add(name)
        known = isinstance(status, str) and status in KNOWN_STATUSES
        if isinstance(status, dict):
            known = len(status) == 1 and next(iter(status)) in KNOWN_STATUSES and bool(next(iter(status.values())))
        need(known, '未知のstatus又は形式は停止し、人数から除外しない')
        if name != root:
            need(name in roster and name.rsplit('/', 1)[0] == root, '未登録子・孫・入替agentを拒否')
        observed_rows.append({'agentRef': name, 'status': status})
    retained = set(policy.get('retained_history', {}).get('agent_refs', []))
    need(root in names and roster <= names | retained, 'rootと固定担当の全実体又は出所付き過去人数を確認する')
    cumulative = (names - {root}) | retained
    need(len(cumulative) <= policy['max_total_subagents'], '完了・停止・過去の子を含む累計子上限を超える')
    retired = {policy['reviewer_handoff']['retired_reviewer']} if policy.get('reviewer_handoff') else set()
    return {'schemaVersion': 'fixed-agent-guard/1', 'session': session, 'operation': operation, 'nonce': nonce,
            'observedAtMs': observed, 'checkedAtMs': now_ms, 'inventoryHash': digest(raw),
            'recordHash': digest(record), 'agents': observed_rows, 'childCount': len(cumulative),
            'observedChildCount': len(names - {root}), 'retainedHistoricalChildRefs': sorted(retained),
            'authorizedRetiredReviewerRefs': sorted(retired), 'historicalUniqueChildCount': len(cumulative | retired),
            'attestationMethod': 'transcribed-tool-result', 'platformApiInterception': False}


def enforce_registered_pool(policy, registrations, harness):
    """For opt-in fixed teams, completed registrations remain in the pool."""
    if policy.get('max_active_subagents') not in (3, 4):
        return
    roster = policy['fixed_subagents']; logical = harness['logicalRole']
    if logical != 'M':
        need(logical in roster and roster[logical] == harness['agentRef'], '固定担当の実agent対応が違う')
    children = {r['harness']['agentRef'] for r in registrations.values() if r['harness']['logicalRole'] != 'M'}
    if logical != 'M': children.add(harness['agentRef'])
    retired = {policy['reviewer_handoff']['retired_reviewer']} if policy.get('reviewer_handoff') else set()
    need(children <= set(roster.values()) | retired and len(children - retired) <= policy['max_total_subagents'], '完了・停止を含む固定子poolを超える')


def consume_inventory(rt, work, operation, record_ref=None):
    """Bind a captured real-tool transcription to one Store mutation boundary.

    Nonce consumption is an append-only Store event, not process-local memory.
    Legacy two-child Works are intentionally unaffected.
    """
    import time
    state = rt.state(work); policy = state['plan'].get('agent_team') or {}
    if policy.get('max_active_subagents') not in (3, 4): return None
    validate_fixed_team_policy(policy)
    validate_policy_work(policy, work)
    need(record_ref, '固定子の操作には120秒以内の実一覧captureが必要')
    events = rt.store.events()
    need(any(e['work'] == work and e['kind'] == 'team_harness_captured' and e['payload'].get('artifactRef') == record_ref and e['payload'].get('recordType') == 'agent-inventory' for e in events), 'このWorkでcaptureした実一覧ではない')
    record = rt.store.get(record_ref)
    used = [e['payload']['nonce'] for e in events if e['kind'] == 'agent_guard_consumed' and e['payload'].get('session') == policy['guard_session']]
    receipt = verify_agent_inventory(policy, record, session=policy['guard_session'], operation=operation, nonce=record.get('nonce'), now_ms=time.time() * 1000, used_nonces=used)
    # Keep the head observed before the nonce check. Refreshing here could hide
    # a concurrent writer; Store must reject that race instead of consuming twice.
    rt.append('agent_guard_consumed', work, {**receipt, 'inventoryRef': record_ref}, event_id='agent-guard-' + digest([receipt['session'], receipt['nonce']]))
    return receipt
