import numpy as np
from ..corpus.core import digest

def retrieve(query,cases,encoder,scope,limit=5):
    q,receipt=encoder.encode(query);hits=[]
    for c in cases:
        if c.get('subject','math')!=scope.get('subject','math') or c.get('mode','textbook')!=scope.get('mode','textbook'):continue
        if scope.get('dimensions') and c.get('dimension') not in scope['dimensions']:continue
        inp=c.get('inputSnapshot',{}).get('text')
        if not inp:continue
        x,_=encoder.encode(inp,prefix='passage: ');hits.append({'caseId':c['id'],'score':float(np.dot(q,x)),'dimension':c['dimension'],'quality':c['quality'],'evidenceRef':c['evidenceRef'],'artifactVersion':c['artifactVersion'],'scope':c['scope']})
    return {'status':'PASS','hits':sorted(hits,key=lambda h:-h['score'])[:limit],'encoderHash':encoder.manifestHash,'corpusHash':digest(cases),'receipt':receipt,'trainingRun':False}
