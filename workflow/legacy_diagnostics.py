"""Read-only legacy N07 diagnosis. Never certifies a lesson or replaces IR validation."""
import json
from contracts import manifest, file
from store import digest

PATH='src/data/textbook/math/numbers/n07Authored.json'
UNIT='math-numbers-expressions-n07'
SOURCE='4fb7a98e7f864839ccc1374080473df4ba60ce88'

def inspect(rt, work, candidate, *, visible=False):
    s=rt.state(work); plan=s['plan']
    # A caller cannot opt out of strict candidate validation by supplying a flag.
    if plan['command']!='CMD-WORK-001' or plan['source_sha']!=SOURCE or PATH not in plan['source_manifest']:
        return None
    if not isinstance(candidate,dict) or candidate.get('schemaVersion')!=1 or candidate.get('unit',{}).get('unitId')!=UNIT:
        return None
    if manifest(rt.root,[PATH])[PATH]!=plan['source_manifest'][PATH]:
        return {'status':'FAIL','reason':'legacy source manifest mismatch'}
    if digest(json.loads(file(rt.root,PATH).read_text()))!=digest(candidate):
        return {'status':'FAIL','reason':'diagnostic candidate differs from frozen legacy artifact'}
    nodes=candidate.get('nodes',[])
    if not nodes or any(not all(k in n for k in ('id','before','after','knownRefs','resultId','stageId','inputLatex','outputLatex')) for n in nodes):
        return {'status':'FAIL','reason':'unsupported legacy structure'}
    ids=[n['id'] for n in nodes]; results={n['resultId']:i for i,n in enumerate(nodes)}
    if len(set(ids))!=len(ids):return {'status':'FAIL','reason':'duplicate legacy nodes'}
    findings=[];snapshots=[]
    for i,n in enumerate(nodes):
        for ref in n['knownRefs']:
            if ref not in results or results[ref]>=i:findings.append({'node':n['id'],'rule':'UNKNOWN_OR_FUTURE_REFERENCE','ref':ref})
        if str(n['outputLatex']).isdigit():findings.append({'node':n['id'],'rule':'SCALAR_ROLE_REVIEW'})
        q=n.get('interaction')
        if q and q['answer'] in ('引く','足す','掛ける'):findings.append({'node':n['id'],'rule':'OPERATION_SENTENCE_REVIEW'})
        if n['id'].endswith('-coefficient'):findings.append({'node':n['id'],'rule':'RELATION_CONNECTION_REVIEW'})
        snapshots.append({'nodeId':n['id'],'before':n['before'],'inputLatex':n['inputLatex'],'knownResults':[r for r in n['knownRefs'] if r in results and results[r]<i], 'afterVisible':False})
    return {'status':'NEEDS_AI_REVIEW','diagnosticProfile':'legacy-n07/1','diagnosisExecuted':True,'lessonReadiness':'NOT_READY','productionIRValidated':False,'sourceSHA':plan['source_sha'],'findings':findings,**({'visibleStates':snapshots,'limits':'legacy source projection; actual reader DOM still requires browser QA'} if visible else {'nodeCount':len(nodes)})}
