"""Exact checks over a closed AST; bounded domain, no sympify/eval of user text."""
import json,sys,hashlib
import sympy as sp

class Unsupported(ValueError):pass
def ast(v,depth=0):
    if depth>24:raise ValueError('AST_LIMIT')
    k=v.get('kind')
    if k=='rational':
        if len(v['n'])>31 or len(v['d'])>30:raise ValueError('integer limit')
        if int(v['d'])<=0:raise ValueError('positive denominator required')
        return sp.Rational(int(v['n']),int(v['d']))
    if k=='symbol':
        import re
        if not re.fullmatch(r'[a-zA-Z][a-zA-Z0-9_]{0,15}',v['name']):raise ValueError('symbol')
        return sp.Symbol(v['name'],real=True)
    if k=='constant':
        if v['name']!='pi':raise Unsupported('constant')
        return sp.pi
    if k=='sqrt':
        if v['argument'].get('kind')!='rational':raise Unsupported('only nonnegative rational square roots')
        value=ast(v['argument'],depth+1)
        if value<0:raise ValueError('negative real square root')
        return sp.sqrt(value)
    if k=='absolute':return sp.Abs(ast(v['argument'],depth+1))
    if k in ('add','multiply'):
        if not 2<=len(v['args'])<=12:raise ValueError('arity')
        args=[ast(a,depth+1) for a in v['args']]
        return sp.Add(*args) if k=='add' else sp.Mul(*args)
    if k=='power':
        n=v['exponent']
        if type(n)!=int or not 0<=n<=4:raise ValueError('exponent')
        return ast(v['base'],depth+1)**n
    if k=='divide':
        den=ast(v['denominator'],depth+1)
        if den.is_zero:raise ValueError('zero denominator')
        if den.free_symbols:raise Unsupported('symbolic denominator needs domain exclusion')
        return ast(v['numerator'],depth+1)/den
    raise ValueError('unknown AST kind')

OPS={'=':sp.Eq,'<':sp.Lt,'<=':sp.Le,'>':sp.Gt,'>=':sp.Ge}
FLIP={'<':'>','<=':'>=','>':'<','>=':'<=','=':'='}
def interval(d):
    lo=ast(d['lower']) if d['lower'] is not None else -sp.oo
    hi=ast(d['upper']) if d['upper'] is not None else sp.oo
    if lo.free_symbols or hi.free_symbols:raise Unsupported('parameter interval boundaries')
    if lo>hi:raise ValueError('empty reversed interval')
    return sp.Interval(lo,hi,left_open=d['lowerOpen'],right_open=d['upperOpen'])
def equal(a,b):return sp.simplify(sp.expand(a-b))==0
def polynomial(e):
    if len(e.free_symbols)>3:raise Unsupported('at most three real symbols')
    try:
        if e.free_symbols and sp.Poly(e,*sorted(e.free_symbols,key=str)).total_degree()>4:raise Unsupported('degree exceeds four')
    except sp.PolynomialError:raise Unsupported('nonpolynomial symbolic expressions require the bounded solution bundle')
def required_form(statement,form):
    if statement['kind']!='expression':raise Unsupported('required form applies to expressions')
    e=statement['expression']
    def square(v):
        if v.get('kind')=='power' and v.get('exponent')==2 and v['base'].get('kind')=='add':return True
        return v.get('kind')=='multiply' and any(square(a) for a in v['args']) and sum(bool(ast(a).free_symbols) for a in v['args'])==1
    def expanded(v):
        if v['kind']=='power' and v['base']['kind']=='add':return False
        if v['kind']=='multiply' and any(a['kind']=='add' for a in v['args']):return False
        return all(expanded(a) for a in v.get('args',[])) and (expanded(v['base']) if v['kind']=='power' else True)
    if form=='completed-square':
        terms=e.get('args',[]) if e['kind']=='add' else [e]
        return sum(square(a) for a in terms)==1 and all(square(a) or not ast(a).free_symbols for a in terms)
    if form=='expanded':return expanded(e)
    if form=='collected':
        f=ast(e);variables=list(f.free_symbols)
        if len(variables)!=1:raise Unsupported('collected form needs one variable')
        terms=e['args'] if e['kind']=='add' else [e];degrees=[]
        for t in terms:
            p=sp.Poly(ast(t),variables[0])
            if len(p.terms())!=1:return False
            degrees.append(p.degree())
        return len(set(degrees))==len(degrees)
    raise Unsupported('form')
def extrema(s):
    x=sp.Symbol(s['variable'],real=True);f=ast(s['function']);polynomial(f)
    if f.free_symbols-{x}:raise Unsupported('parameter extrema require explicit cases')
    poly=sp.Poly(f,x)
    if poly.degree()!=2:raise Unsupported('only quadratic extrema')
    domain=interval(s['domain']);direction=s['extremum']
    # Exact domain utility distinguishes an infimum from an attained minimum.
    result=sp.minimum(f,x,domain) if direction=='minimum' else sp.maximum(f,x,domain)
    value=ast(s['value']);points=sp.solveset(sp.Eq(f,result),x,domain=domain)
    attained=points is not sp.S.EmptySet and points!=sp.S.EmptySet
    supplied=sp.FiniteSet(*(ast(a) for a in s['at']))
    ok=equal(value,result) and s['attained']==attained and supplied==points
    return {'status':'PASS' if ok else 'FAIL','ruleId':'extrema','computed':{'value':str(result),'at':str(points),'attained':attained}}

def transition(before,after,e):
    rule=e['ruleId']
    if rule=='extrema':
        if before['kind']!='expression' or after['kind']!='extrema':raise ValueError('extrema state kinds')
        if not equal(ast(before['expression']),ast(after['function'])):return {'status':'FAIL','ruleId':rule,'reason':'function changed'}
        return extrema(after)
    if before['kind']!=after['kind']:raise Unsupported('different statement kinds')
    if before['kind']=='expression':
        a=ast(before['expression']);b=ast(after['expression']);polynomial(a);polynomial(b)
        if rule=='substitute':a=a.subs({sp.Symbol(k,real=True):ast(v) for k,v in e.get('substitutions',{}).items()},simultaneous=True)
        elif rule!='rewrite':raise Unsupported('expression operation')
        return {'status':'PASS' if equal(a,b) else 'FAIL','ruleId':rule,'checks':['identity']}
    if before['kind']!='relation':raise Unsupported('statement kind')
    left,right=ast(before['left']),ast(before['right']);op=before['operator']
    outleft,outright=ast(after['left']),ast(after['right']);outop=after['operator']
    for a in [left,right,outleft,outright]:polynomial(a)
    if rule in ('add-both-sides','multiply-both-sides','divide-both-sides'):
        value=ast(e['operand'])
        if value.free_symbols and rule!='add-both-sides':raise Unsupported('operand sign not established')
        # Adding the same polynomial needs no sign assumption; multiplying/dividing does.
        if rule=='add-both-sides':polynomial(value)
        if rule=='add-both-sides':left+=value;right+=value
        else:
            if value==0:return {'status':'FAIL','ruleId':rule,'reason':'zero multiplier or divisor loses equivalence'}
            if value<0:op=FLIP[op]
            if rule=='divide-both-sides':left/=value;right/=value
            else:left*=value;right*=value
        ok=op==outop and equal(left,outleft) and equal(right,outright)
        return {'status':'PASS' if ok else 'FAIL','ruleId':rule,'checks':['same-operation-both-sides','relation-direction','exact-result']}
    if rule=='substitute':
        subs={sp.Symbol(k,real=True):ast(v) for k,v in e.get('substitutions',{}).items()}
        ok=op==outop and equal(left.subs(subs,simultaneous=True),outleft) and equal(right.subs(subs,simultaneous=True),outright)
        return {'status':'PASS' if ok else 'FAIL','ruleId':rule}
    if rule=='rewrite':
        if op==outop and equal(left,outleft) and equal(right,outright):return {'status':'PASS','ruleId':rule}
        # Rewrites changing sides must preserve the solution set for a single real variable.
        variables=(left-right).free_symbols | (outleft-outright).free_symbols
        if len(variables)!=1:raise Unsupported('multivariate relation rewrite')
        x=next(iter(variables))
        def solutions(l,r,o):
            return sp.solveset(sp.Eq(l,r),x,domain=sp.S.Reals) if o=='=' else sp.solve_univariate_inequality(OPS[o](l,r),x,relational=False)
        a,b=solutions(left,right,op),solutions(outleft,outright,outop)
        return {'status':'PASS' if a==b else 'FAIL','ruleId':rule,'computed':{'beforeSet':str(a),'afterSet':str(b)}}
    raise Unsupported('operation')

def verify(payload):
    if payload.get('schemaVersion')=='solution-bundle/1':
        from bundle import verify_bundle
        return verify_bundle(payload)
    if payload.get('kind')=='quadratic-plot':
        x=sp.Symbol(payload['variable'],real=True);f=ast(payload['function']);p=sp.Poly(f,x)
        if f.free_symbols-{x} or p.degree()!=2:raise Unsupported('numeric quadratic plot only')
        domain=interval(payload['domain'])
        if domain.start in (-sp.oo,sp.oo) or domain.end in (-sp.oo,sp.oo):raise Unsupported('finite plot interval required')
        h=-p.nth(1)/(2*p.nth(2));lo=min(domain.start,h)-1;hi=max(domain.end,h)+1
        points=[[float(lo+(hi-lo)*i/80),float(f.subs(x,lo+(hi-lo)*i/80))] for i in range(81)]
        inside=[[float(domain.start+(domain.end-domain.start)*i/40),float(f.subs(x,domain.start+(domain.end-domain.start)*i/40))] for i in range(41)]
        return {'status':'PASS','plot':{'points':points,'domainPoints':inside,'vertex':[float(h),float(f.subs(x,h))],'lowerOpen':bool(domain.left_open),'upperOpen':bool(domain.right_open),'sourceFunctionHash':hashlib.sha256(json.dumps(payload['function'],sort_keys=True).encode()).hexdigest()},'notAProof':True}
    if payload.get('kind')=='batch':
        if len(payload['items'])>150:raise ValueError('BATCH_LIMIT')
        rows=[{'id':item['id'],**verify(item['payload'])} for item in payload['items']]
        return {'status':'PASS' if all(r['status']=='PASS' for r in rows) else 'FAIL','results':rows,'engineVersion':sp.__version__}
    if payload.get('kind')=='choices':
        expected=ast(payload['expected']);values=[ast(c['value']) for c in payload['choices']]
        matches=[i for i,v in enumerate(values) if equal(v,expected)]
        duplicates=[(i,j) for i,v in enumerate(values) for j,w in enumerate(values[:i]) if equal(v,w)]
        return {'status':'PASS' if len(matches)==1 and not duplicates else 'FAIL','matches':matches,'duplicates':duplicates}
    if payload.get('kind')=='partition':
        domain=interval(payload['domain']);cases=[interval(c) for c in payload['cases']]
        union=sp.Union(*cases);overlap=any(a.intersect(b)!=sp.S.EmptySet for i,a in enumerate(cases) for b in cases[:i])
        return {'status':'PASS' if union==domain and not overlap else 'FAIL','checks':['coverage','disjoint-cases'],'computed':str(union)}
    graph=payload.get('graph',payload);states={s['id']:s for s in graph['states']};rows=[]
    bases={g['id']:g['statement'] for g in graph.get('givens',[])}
    for e in graph['transitions']:
        for fact in e.get('produces',[]):bases[fact]=states[e['to']]['statement']
    for edge in graph['transitions']:
        try:
            if edge['ruleId']=='substitute':
                for name,value in edge.get('substitutions',{}).items():
                    symbol=sp.Symbol(name,real=True);target=ast(value)
                    valid=False
                    for ref in edge.get('basisRefs',[]):
                        s=bases.get(ref,{})
                        if s.get('kind')=='relation' and s.get('operator')=='=':
                            a,b=ast(s['left']),ast(s['right'])
                            valid=valid or (a==symbol and equal(b,target)) or (b==symbol and equal(a,target))
                    if not valid:raise ValueError('SUBSTITUTION_NOT_GIVEN_OR_PRODUCED: '+name)
            row=transition(states[edge['from']]['statement'],states[edge['to']]['statement'],edge)
            row['mathStatus']=row['status']
            if edge.get('requiredForm') and row['status']=='PASS':
                row['formStatus']='PASS' if required_form(states[edge['to']]['statement'],edge['requiredForm']) else 'FAIL'
                if row['formStatus']=='FAIL':row.update(status='FAIL',reason='MATHEMATICALLY_EQUIVALENT_BUT_REQUIRED_FORM_NOT_MET')
        except (Unsupported,NotImplementedError) as ex:row={'status':'UNSUPPORTED','reason':str(ex)}
        except (ValueError,KeyError,TypeError) as ex:row={'status':'FAIL','reason':str(ex)}
        rows.append({'transitionId':edge['id'],**row})
    status='FAIL' if any(r['status']=='FAIL' for r in rows) else 'UNSUPPORTED' if any(r['status']=='UNSUPPORTED' for r in rows) else 'PASS'
    return {'status':status,'checks':rows,'engineVersion':sp.__version__,'formalProof':False,'proofStatus':'EXACT_SYMBOLIC_CHECKS','domain':'closed AST polynomial identities / constant linear operations / one-variable relation solution sets / numeric quadratic extrema'}

if __name__=='__main__':
    try:print(json.dumps(verify(json.load(sys.stdin)),ensure_ascii=False))
    except Exception as ex:print(json.dumps({'status':'FAIL','error':type(ex).__name__+': '+str(ex)}));sys.exit(1)
