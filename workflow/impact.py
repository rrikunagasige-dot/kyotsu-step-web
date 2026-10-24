"""Pre/post impact inventories and evidence-backed sibling closure."""
from contracts import need
from store import digest


def inventory(state, node):
    rows = state['plan'].get('impact_inventory')
    if rows is None:
        rows = [{'block_id': b['id'], 'artifact': path} for b in state['plan']['blocks'] for path in b['sources']]
    return rows


def check(rt, work, node, result):
    s = rt.state(work); rows = result['impact_rows']; required = {(r['block_id'], r['artifact']) for r in inventory(s, node)}
    supplied = {(r.get('block_id'), r.get('artifact')) for r in rows}
    need(required <= supplied and len(supplied) == len(rows), '必要な影響inventoryの欠落・重複')
    for row in rows:
        for key in ('originFinding', 'rootCauseSignature', 'artifact', 'version', 'approvedCreationWork', 'block_id', 'evidence_refs', 'status', 'phase'):
            need(row.get(key), '影響行の属性不足:' + key)
        need(row['phase'] == node['phase'], '事前調査を事後検証へ流用しない')
        expected = s['candidate_sha'] if node['phase'] == 'post-fix' else s['plan']['source_sha']
        inv = next((r for r in inventory(s, node) if (r['block_id'], r['artifact']) == (row['block_id'], row['artifact'])), {})
        if node['phase']=='post-fix' and row.get('linkedCorrection'):expected=rt.state(row['linkedCorrection'])['candidate_sha']
        elif row['artifact'] not in s['plan']['source_manifest']:expected=inv.get('version',expected)
        need(row['version'] == expected, '影響行の対象版が違う')
        need(row['status'] in ('AFFECTED', 'NOT-AFFECTED', 'UNVERIFIED'), '影響判定が不正')
        rt.fingerprint_refs(s, row['evidence_refs'])
        need(result['verdict'] != 'PASS' or row['status'] != 'UNVERIFIED', '未確認の必須影響行が残る')
        if row['status'] == 'AFFECTED' and row.get('sibling'):
            child = row.get('linkedCorrection'); need(child and child != work, '関連欠陥には別修正Workが必要')
            cs = rt.state(child)
            need(cs['plan']['command'] == 'CMD-WORK-001' and cs['plan'].get('parent_impact') == {'work': work, 'signature': row['rootCauseSignature'], 'artifact': row['artifact'], 'version': row.get('origin_version',row['version'])}, '子修正の原因・対象版が違う')
            if node['phase'] == 'post-fix' and result['verdict'] == 'PASS': need(rt.next(child)['status'] == 'DONE', '関連する必須修正が未完了')
    return rows


def record_visits(rt, work, rows):
    for row in rows:
        key = digest([row['rootCauseSignature'], row['artifact'], row['version'], row['phase']])
        if any(e['kind'] == 'impact_visited' and e['work'] == work and e['payload']['key'] == key for e in rt.store.events()): continue
        rt.append('impact_visited', work, {'key': key, 'signature': row['rootCauseSignature'], 'artifact': row['artifact'], 'version': row['version'], 'phase': row['phase']})
