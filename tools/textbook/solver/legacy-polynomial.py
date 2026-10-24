"""Bounded legacy solver, adapted without changing its math or expanding its domain."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'work/items/W-GOV-010-coded-authoring/engine'))
from math_core import polynomial, independent_identity, same, Unsupported

def verify(left,right):
    try:
        a,b=polynomial(left),polynomial(right)
        equivalent=a==b
        return {'status':'PASS' if equivalent else 'FAIL','equivalent':equivalent,'independent':independent_identity(left,right),
                'domain':'rational univariate polynomial, legacy degree bounds','proofStatus':'SYMBOLIC_VERIFIED'}
    except (Unsupported,ValueError,TypeError,SyntaxError,ZeroDivisionError) as e:
        return {'status':'UNSUPPORTED','reason':str(e),'proofStatus':'UNVERIFIED'}
if __name__=='__main__':
    p=json.load(sys.stdin);print(json.dumps(verify(p['left'],p['right'])))
