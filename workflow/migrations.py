"""Explicit historical graph migration. Old generic PASS is evidence, never a C/R PASS."""
from contracts import need, plan_check
from definitions import DEFINITION_HASH
from graphs import normalized


def migrate(rt, work, new_plan, evidence_refs):
    s = rt.state(work)
    need(s['plan'].get('workflow_version') != 'production/2', '既にproduction/2')
    need(not s['claims'] and evidence_refs, '実行中claim又は移行証拠不足')
    rt.fingerprint_refs(s, evidence_refs); plan_check(new_plan); new_plan = normalized(new_plan)
    for k in ('work_id', 'command', 'profile', 'source_manifest', 'source_sha', 'rules', 'proposal', 'scope'):
        need(new_plan[k] == s['plan'][k], '移行で目的・承認範囲を変えない:' + k)
    need([(b['id'], b['sources']) for b in new_plan['blocks']] == [(b['id'], b['sources']) for b in s['plan']['blocks']], '移行でblockを変えない')
    mapping = [{'old_node': k, 'artifact': r['artifact'], 'disposition': 'REVIEW_FOR_REUSE', 'reason': '旧receiptは新しい原因・影響・scope契約の完了を証明しない'} for k, r in s['results'].items()]
    archive = rt.store.put({'plan': s['plan'], 'definition_hash': s['definition_hash'], 'results': s['results'], 'users': s['users'], 'evidence': s['evidence']})
    event=rt.append('migration_verified', work, {'from': s['plan'].get('workflow_version', 'legacy/1'), 'plan': new_plan, 'definition_hash': DEFINITION_HASH,
                     'archive': archive, 'artifact_mapping': mapping, 'evidence_refs': evidence_refs, 'missing_contracts': ['R02_CAUSE', 'R03_IMPACT'] if new_plan['command'] == 'CMD-WORK-001' else ['C01_SOURCE', 'C05_DESIGN']})

    # Carry only an exact, content-hashed approval; never turn old analysis PASS into missing contracts.
    from integration import bundle_fingerprint
    approved=next((u for u in reversed(list(s['users'].values())) if u['intent']=='approve_proposal' and u['proposal_hash']==new_plan['proposal']['hash'] and u['scope']==new_plan['scope']),None)
    if approved and len(new_plan['approval_bundles'])==1 and new_plan['proposal'].get('contentDesignHash')==new_plan['approval_bundles'][0]['content_hash']:
        current=rt.state(work)
        rt.append('approval_coverage_migrated',work,{'user_event':approved['id'],'approved_bundles':{b['id']:bundle_fingerprint(current,b) for b in new_plan['approval_bundles']},'evidence_refs':evidence_refs,'migration':event['hash']})
    return event
