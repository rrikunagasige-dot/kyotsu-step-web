"""Unranked fallback for an unavailable encoder. No quality inference or training."""
from .core import digest

def scoped_catalog(data, reason):
    cases=data['cases'];scope=data['scope'];expected=data.get('corpusHash')
    if not expected or expected!=digest(cases):raise ValueError('versioned corpus hash mismatch')
    if not scope.get('subject') or not scope.get('mode'):raise ValueError('explicit subject and mode required')
    hits=[]
    for c in cases:
        if not all(c.get(k) for k in ('id','artifactVersion','scope','dimension','evidenceRef','inputSnapshot')):raise ValueError('incomplete versioned case')
        if c.get('subject','math')!=scope['subject'] or c.get('mode','textbook')!=scope['mode']:continue
        if scope.get('dimensions') and c['dimension'] not in scope['dimensions']:continue
        if scope.get('caseScopes') and c['scope'] not in scope['caseScopes']:continue
        hits.append(c)
    return {'status':'PASS','retrievalMode':'SCOPED_CATALOG','ranked':False,'modelRan':False,'trainingRun':False,'unavailableReason':reason,'corpusHash':expected,'hits':hits,'mandatoryInputs':data.get('mandatoryInputs',[])}
