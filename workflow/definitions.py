"""承認された作成・修正の工程。Work状態やユーザーGateを増やさない。"""
from store import digest
from pathlib import Path
import hashlib

VERSION='1.0.0'
CREATE=[
 ('C01_SOURCE','AI',['source_inventory','source_versions','unknowns']),
 ('C02_CONCEPT','AI',['learning_goal','concept_dependencies','organization_reason']),
 ('C03_PATTERN','AI',['pattern_id','applicability','non_applicability','unknowns']),
 ('C04_SOLUTION','AI',['complete_steps','reasons','prerequisites','conclusion','math_evidence']),
 ('C05_DESIGN','AI',['blank_targets','learning_actions','distractors','prose','figures','protected_scope']),
 ('C06_APPROVAL','USER',[]),('C07_BUILD','TOOL',[]),('C08_VERIFY','TOOL',[]),
 ('C09_SEMANTIC','AI',['reasoning_review','prose_figure_review','choice_review','unknowns'])]
CORRECT=[
 ('R01_CAPTURE','AI',['complaint','before_evidence','reproduction','target_versions']),
 ('R02_CAUSE','AI',['symptoms','confirmed_causes','hypotheses','missing_learning_actions','root_cause_signatures']),
 ('R03_IMPACT','AI',['impact_rows','source_inventory','unknowns']),
 ('R04_PROPOSAL','AI',['before_after','protected_scope','patch_plan','verification_plan','proposal_hash']),
 ('R05_APPROVAL','USER',[]),('R06_PATCH','TOOL',[]),('R07_VERIFY','TOOL',[]),
 ('R07_SEMANTIC','AI',['symptom_resolution','regression_review','protected_scope_review','unknowns']),
 ('R08_CAPTURE_LEARNING','AI',['case_updates','rule_links','regression_links','unresolved'])]
TECHNICAL=[('T01_ANALYSIS','AI',['rule_mapping','design','protected_scope','unknowns']),
           ('T02_APPROVAL','USER',[]),('T03_BUILD','TOOL',[]),('T04_VERIFY','TOOL',[])]

def instantiate(plan):
    if plan.get("workflow_version") == "production/2":
        from graphs import instantiate as integration_nodes
        return integration_nodes(plan)
    if plan.get("workflow_version"):
        from production import instantiate as production_nodes
        return production_nodes(plan)
    nodes={}
    def add(nid,actor,deps=(),required=(),block=None,watch='source'):
        nodes[nid]={'id':nid,'actor':actor,'depends_on':list(deps),'required':list(required),'block':block,'watch':watch}
    add('S00_RECOVER','CODE');add('S01_ROUTE','CODE',['S00_RECOVER'])
    if plan['profile']=='technical':
        prev='S01_ROUTE'
        for nid,actor,required in TECHNICAL:
            add(nid,actor,[prev],required,watch='candidate' if nid=='T04_VERIFY' else 'source');prev=nid
        ends=[prev]
    else:
        seq=CREATE if plan['command']=='CMD-WORK-002' else CORRECT
        ends=[];verifiers=[]
        for block in plan['blocks']:
            bid=block['id'];prev='S01_ROUTE'
            for base,actor,required in seq:
                nid=base+'@'+bid
                watch='candidate_block' if base in ('C08_VERIFY','C09_SEMANTIC','R07_VERIFY','R07_SEMANTIC','R08_CAPTURE_LEARNING') else 'source'
                add(nid,actor,[prev],required,bid,watch);prev=nid
            gate='G1_VISUAL@'+bid;add(gate,'USER',[prev],block=bid,watch='visual');ends.append(gate)
            verifiers.append(('C08_VERIFY@' if plan['command']=='CMD-WORK-002' else 'R07_VERIFY@')+bid)
        add('G2_AUDIT','AUDITOR',ends+verifiers,['audit_rows','independence','original_source_refs','unknowns'],watch='candidate');
        add('G3_HOST','TOOL',['G2_AUDIT'],watch='candidate')
        add('G3_FINAL','USER',['G3_HOST'],watch='candidate');ends=['G3_FINAL']
    add('L01_LEARNING','AI',ends,['case_updates','rule_links','regression_links','unresolved','deduplication'],watch='learning')
    add('Z01_CLOSE','CODE',['L01_LEARNING'],watch='all')
    return nodes

DEFINITION_HASH=digest({'version':VERSION,'creation':CREATE,'correction':CORRECT,'technical':TECHNICAL,
                        'gates':['G1_VISUAL','G2_AUDIT','G3_HOST','G3_FINAL'],'learning':'L01_LEARNING','implementation':{name:hashlib.sha256(Path(__file__).with_name(name).read_bytes()).hexdigest() for name in ('definitions.py','runtime.py','store.py','contracts.py','adapters.py','views.py','cli.py','production.py','runner.py','graphs.py','capabilities.py','integration.py','requests.py','impact.py','migrations.py','learning.py')}})
