import math
import numpy as np
from ..corpus.core import digest

def predict(model,text,encoder,dimension,allow_offline=False,input_schema=None):
    if not model:return {'status':'ABSTAIN','reason':'NOT_TRAINED'}
    h=model.get('modelHash');body={k:v for k,v in model.items() if k!='modelHash'}
    if digest(body)!=h:return {'status':'ABSTAIN','reason':'MODEL_HASH_MISMATCH'}
    if model['encoderHash']!=encoder.manifestHash:return {'status':'ABSTAIN','reason':'ENCODER_MISMATCH'}
    declared=model.get('inputFeatureSchemas')
    if (declared and input_schema not in declared) or (input_schema=='learner-visible-json/3' and not declared):
        return {'status':'ABSTAIN','reason':'FEATURE_SCHEMA_MISMATCH','modelHash':h}
    if not allow_offline and not model.get('advisoryEligible'):return {'status':'ABSTAIN','reason':'MODEL_NOT_PROMOTED','modelHash':h}
    head=model.get('heads',{}).get(dimension)
    if head is None:return {'status':'ABSTAIN','reason':'NOT_TRAINED_DIMENSION'}
    x,receipt=encoder.encode(text);score=float(np.dot(x,head['coef'])+head['intercept']);p=1/(1+math.exp(-max(-700,min(700,score))))
    return {'status':'OFFLINE_PREDICTION' if allow_offline else 'ADVISORY','score':p,'calibrated':False,'modelHash':h,'featureReceipt':receipt}
