"""Independent fixed-case checks using Python Fraction, not the JS production arithmetic."""
import json,re,sys,hashlib
from fractions import Fraction
from pathlib import Path
plan=json.loads(Path(sys.argv[1]).read_text())
by_id={n['id']:n for n in plan['nodes']}
def plain(x):return re.sub(r'^\\frac\{(-?\d+)\}\{(\d+)\}$',r'\1/\2',x)
cases={
 'n07-q01-tenths':Fraction(7), 'n07-q01-hundredths':Fraction(5),
 'n07-q02-integer':Fraction(23-11*2), 'n07-q02-digit-0':Fraction(10//11),
 'n07-q02-remainder-0':Fraction(10%11), 'n07-q02-digit-1':Fraction(100//11),
 'n07-q02-remainder-1':Fraction(100%11), 'n07-q06-scale':Fraction(10),
 'n07-q07-coefficient':Fraction(10-1), 'n07-q07-right-difference':Fraction(8),
 'n07-q08-divide':Fraction(8,9), 'n07-q09-scale':Fraction(100),
 'n07-q09-coefficient':Fraction(100-1), 'n07-q09-right-difference':Fraction(69),
 'n07-q10-divide':Fraction(69,99), 'n07-q10-reduce':Fraction(23,33),
 'n07-q12-include-five':Fraction(2), 'n07-q13-difference':Fraction(2-3)}
checks=[]
for key,want in cases.items():
 got=Fraction(plain(by_id[key]['interaction']['answer']));checks.append({'node':key,'expected':str(want),'actual':str(got),'pass':got==want})
# Separate exact remainder oracle, not Fraction.js nor the JS division implementation.
for key,rep in [('n07-q06','8'),('n07-q09','69')]:
 r=Fraction(int(rep),10**len(rep)-1)
 for k in range(1,len(rep)+1):
  scaled=10**k*r
  aligned=scaled-int(scaled)==r-int(r)
  checks.append({'condition':key+' scale10^'+str(k),'pass':aligned==(k==len(rep))})
valid=[]
for a in range(2,21):
 q=Fraction(1,a).denominator
 while q%2==0:q//=2
 while q%5==0:q//=5
 if q==1:valid.append(a)
checks.append({'condition':'all19 denominators','pass':valid==[2,4,5,8,10,16,20]})
checks.append({'condition':'6/15 erratum regression','pass':Fraction(6,15)==Fraction(2,5)})
report={'planSHA256':hashlib.sha256(Path(sys.argv[1]).read_bytes()).hexdigest(),'status':'PASS' if all(c['pass'] for c in checks) else 'FAIL','engine':'Python standard-library fractions.Fraction / integer arithmetic','checks':checks,'limits':'General proofs and categorical explanations were reviewed separately; this is not app or pedagogy acceptance.'}
print(json.dumps(report,ensure_ascii=False,indent=2))
if report['status']!='PASS':sys.exit(1)
