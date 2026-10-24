import numpy as np
from sklearn.linear_model import LogisticRegression

def train_pairs(pairs):
    # Pairs require actual matched preference evidence; reversing pairs is not a new case.
    if not pairs:return {'status':'ABSTAIN','reason':'NO_MATCHED_PAIRS'}
    if any(not p.get('evidenceRef') or not p.get('sameProblem') or not p.get('sameKnownFacts') for p in pairs):raise ValueError('unmatched preference pair')
    X=np.array([p['difference'] for p in pairs]);y=np.array([p['preference'] for p in pairs])
    if len(set(y))<2:return {'status':'ABSTAIN','reason':'SINGLE_CLASS'}
    clf=LogisticRegression(random_state=17).fit(X,y)
    return {'status':'OFFLINE_ONLY','coef':clf.coef_[0].tolist(),'intercept':float(clf.intercept_[0]),'trainingRun':True}

def rank(candidates,scorer):
    valid=[c for c in candidates if c.get('validationStatus')=='PASS']
    return sorted([{'candidateId':c['id'],'prediction':scorer(c)} for c in valid],key=lambda r:-(r['prediction'].get('score') or 0))
