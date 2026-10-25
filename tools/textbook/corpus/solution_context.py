"""Quality cases retain visible problem context; approvals and future answers are excluded."""
from .core import digest,learner_text

DIMENSIONS={
 'solution_flow_broken','local_calculation_not_rejoined','prerequisite_gap',
 'answer_decision_leaked','variable_role_confusion','choice_sequence_discomfort',
}
FORBIDDEN={'correctValue','expected','isCorrect','feedback','quality','label','evaluation','mathReceipts'}
def snapshot(visible):
    if not all(k in visible for k in ('problemId','prompt','conditions','initial','completed','current')):raise ValueError('whole visible problem context required')
    def inspect(v):
        if isinstance(v,dict):
            if FORBIDDEN.intersection(v):raise ValueError('future answer or evaluation in visible context')
            for value in v.values():inspect(value)
        elif isinstance(v,list):
            for value in v:inspect(value)
    inspect(visible)
    clean=learner_text(visible,solution=True)
    if clean in ('{}','[]'):raise ValueError('empty visible artifact')
    return {'kind':'learner_artifact','text':clean,'contextSchema':'solution-visible/1','contextHash':digest(visible)}

def observation(quote,source_ref,artifact_version,scope=None):
    if not quote or not source_ref or not artifact_version:raise ValueError('original statement and version required')
    return {'id':digest({'quote':quote,'source_ref':source_ref,'version':artifact_version,'scope':scope}),
        'quote':quote,'sourceType':'conversation_transcribed','sourceRef':source_ref,'artifactVersion':artifact_version,
        'scope':scope,'label':'UNKNOWN','eligibility':'SCOPED_EVALUATION_AND_VISIBLE_INPUT_REQUIRED'}

def evaluability(corpus):
    rows=[]
    for dim in sorted(DIMENSIONS|{c['dimension'] for c in corpus['cases']}):
        selected=[c for c in corpus['cases'] if c['dimension']==dim and c.get('label') in (0,1)]
        counts={str(v):sum(c['label']==v for c in selected) for v in (0,1)}
        rows.append({'dimension':dim,'counts':counts,'trainingDisposition':'CANDIDATE' if all(counts.values()) else 'NOT_TRAINABLE_SINGLE_CLASS','promotion':'OFFLINE_ONLY','advisoryEligible':False})
    return {'status':'PASS','dimensions':rows,'automaticLabeling':False}
