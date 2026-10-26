"""production/2: C/R stages own block jobs; approval and release are different scopes."""
import re
from contracts import need

VERSION = 'production/2'
FACETS = {'source', 'math', 'design', 'render', 'cases', 'knowledge', 'model'}


def normalized(plan):
    from copy import deepcopy
    p = deepcopy(plan)
    need(p.get('workflow_version') == VERSION and p['profile'] == 'material', 'production/2は教材の作成・修正用')
    need(p['command'] in ('CMD-WORK-001', 'CMD-WORK-002'), 'C/R以外の入口')
    need(p.get('solution_pipeline') in (None,'solution/1'), '未対応のsolution pipeline')
    need(p.get('construction_pipeline') in (None, 'construction-layout/1'), '未対応の組立・配置pipeline')
    need(not p.get('construction_pipeline') or p.get('solution_pipeline') == 'solution/1', '組立pipelineは既存solution/1へ接続する')
    need(not p.get('research_extract') or p.get('solution_pipeline')=='solution/1', '資料抽出はsolution/1を明示する')
    if 'agent_team' in p:
        from team import validate_policy
        p['agent_team'] = validate_policy(p['agent_team'])
    blocks = {b['id']: b for b in p['blocks']}
    p.setdefault('protected_manifest',{path:h for path,h in p['source_manifest'].items() if any(path==x or x.endswith('/') and path.startswith(x) for x in p['scope'].get('preserve',[]))})
    for path in p['scope'].get('preserve',[]):
        if not path.endswith('/'):need(path in p['protected_manifest'],'保護ファイルの固定hashが必要')
    for bid, b in blocks.items():
        if p.get('construction_pipeline'):
            for key in ('construction_design_hash', 'layout_design_hash', 'learner_copy_hash'):
                need(isinstance(b.get(key), str) and re.fullmatch('[0-9a-f]{64}', b[key]), '組立pipelineの具体契約hashが不足:'+key)
        need(re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*', bid), '安全なblock IDが必要')
        b.setdefault('depends_on_blocks', [])
        b.setdefault('fact_dependencies', [])
        need(set(b['depends_on_blocks']) <= blocks.keys() and bid not in b['depends_on_blocks'], 'blockの前提が不明')
        need(all(x in blocks and x != bid for x in b['fact_dependencies']), 'fact依存が不明')
        b.setdefault('release_unit', 'unit')
        b.setdefault('change_facets', ['math', 'design', 'render'])
        need(set(b['change_facets']) <= FACETS and b['change_facets'], '修正の属性が不明')
    p.setdefault('release_units', [{'id': u, 'block_ids': [bid for bid, b in blocks.items() if b['release_unit'] == u]} for u in dict.fromkeys(b['release_unit'] for b in blocks.values())])
    p.setdefault('approval_bundles', [{'id': 'proposal', 'block_ids': list(blocks), 'proposal_hash': p['proposal']['hash'], 'content_hash': p['proposal'].get('contentDesignHash', p['proposal']['hash'])}])
    for name in ('release_units', 'approval_bundles'):
        groups = p[name]
        need(groups and len({g['id'] for g in groups}) == len(groups), name + 'が空または重複')
        flat = []
        for g in groups:
            need(re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*', g['id']), '安全なscope IDが必要')
            need(g['block_ids'] and set(g['block_ids']) <= blocks.keys(), 'scope内blockが不明')
            flat.extend(g['block_ids'])
        need(len(flat) == len(set(flat)) and set(flat) == blocks.keys(), name + 'はblockを重複なく覆う')
    for u in p['release_units']:
        need(all(blocks[b]['release_unit'] == u['id'] for b in u['block_ids']), 'release unitの対応が違う')
    for bundle in p['approval_bundles']:
        need(bundle.get('proposal_hash') and bundle.get('content_hash'), 'bundleの案・内容hashが必要')
    # Validate both pedagogic and fact dependency DAGs, never infer known facts from ordering.
    for key in ('depends_on_blocks', 'fact_dependencies'):
        done = set()
        while len(done) < len(blocks):
            ready = {bid for bid, b in blocks.items() if set(b[key]) <= done} - done
            need(ready, key + 'が循環'); done.update(ready)
    return p


def instantiate(plan):
    from definitions import CREATE, CORRECT
    from capabilities import requests_for
    p = normalized(plan); correction = p['command'] == 'CMD-WORK-001'; nodes = {}
    bundle_for = {b: a for a in p['approval_bundles'] for b in a['block_ids']}
    unit_order = {u['id']: i for i, u in enumerate(p['release_units'])}

    def add(stage, actor, deps=(), required=(), block=None, unit=None, phase='analysis'):
        nid = stage + ('@' + (block or unit) if block or unit else '')
        n = {'id': nid, 'stage_kind': stage, 'contract_kind': stage, 'actor': actor, 'depends_on': list(dict.fromkeys(deps)),
             'required': list(required), 'block': block, 'release_unit': unit, 'watch': 'integration', 'phase': phase,
             'priority': unit_order.get(unit, -1), 'source_refs': [], 'protected_refs': p['scope'].get('preserve', [])}
        if block:
            b = next(x for x in p['blocks'] if x['id'] == block)
            n.update(source_refs=b['sources'], approval_scope_ref=bundle_for[block]['id'])
        n['capability_requests'] = requests_for(p, n)
        n['required_code_receipts'] = n['capability_requests']
        n['required_ai_receipts'] = ['meaning-review'] if actor == 'AI' else []
        if p.get('agent_team'):
            from team import node_requirements
            requirements = node_requirements(p['agent_team'], n)
            if requirements: n['team_requirements'] = requirements
        nodes[nid] = n
        return nid

    add('S00_RECOVER', 'CODE'); add('S01_ROUTE', 'CODE', ['S00_RECOVER'])
    seq = CORRECT if correction else CREATE
    for b in p['blocks']:
        bid = b['id']; unit = b['release_unit']; prev = 'S01_ROUTE'
        for stage, actor, required in seq:
            if stage == 'R08_CAPTURE_LEARNING': continue
            deps = [prev]
            if stage in ('C02_CONCEPT', 'R02_CAUSE'):
                deps += [('R02_CAUSE' if correction else 'C04_SOLUTION') + '@' + d for d in b['fact_dependencies']]
            if stage == 'C05_DESIGN':deps += ['C03_PATTERN@'+bid, 'C01_SOURCE@'+bid]
            if stage in ('C05_DESIGN', 'R04_PROPOSAL'):
                deps += [stage + '@' + d for d in b['depends_on_blocks']]
            if actor == 'USER':
                design = 'R04_PROPOSAL' if correction else 'C05_DESIGN'
                deps = [design + '@' + d for d in bundle_for[bid]['block_ids']]
            phase = 'post-implementation' if stage in ('C08_VERIFY', 'C09_SEMANTIC', 'R07_VERIFY', 'R07_SEMANTIC') else 'pre-design'
            prev = add(stage, actor, deps, required, bid, unit, phase)
    for unit in p['release_units']:
        uid = unit['id']; bs = unit['block_ids']; end = 'R07_SEMANTIC' if correction else 'C09_SEMANTIC'
        g2 = add('G2_AUDIT', 'AI', [end + '@' + b for b in bs], ['audit_rows', 'release_readiness', 'impact_sweep_completion', 'audit_method', 'unknowns'], unit=uid, phase='pre-release')
        host = add('G3_HOST', 'TOOL', [g2], unit=uid, phase='release')
        final = add('G3_FINAL', 'USER', [host], unit=uid, phase='acceptance')
        deps = [final]
        if correction:
            sweep = add('R03_IMPACT_SWEEP', 'AI', [final] + ['R03_IMPACT@' + b for b in bs], ['impact_rows', 'source_inventory', 'unknowns'], unit=uid, phase='post-fix')
            deps = [add('R08_CAPTURE_LEARNING', 'AI', [sweep, 'R07_SEMANTIC@' + b], dict(CORRECT_REQUIRED())['R08_CAPTURE_LEARNING'], b, uid, 'repair-finalization') for b in bs]
        add('L01_LEARNING', 'AI', deps, ['case_updates', 'rule_links', 'regression_links', 'unresolved', 'deduplication', 'modelDisposition'], unit=uid, phase='learning')
    add('Z01_CLOSE', 'CODE', ['L01_LEARNING@' + u['id'] for u in p['release_units']], phase='closure')
    pending = set(nodes); done = set()
    while pending:
        ready = {k for k in pending if set(nodes[k]['depends_on']) <= done}
        need(ready, '工程依存が循環'); pending -= ready; done |= ready
    return nodes


def CORRECT_REQUIRED():
    from definitions import CORRECT
    return [(stage, required) for stage, _, required in CORRECT]
