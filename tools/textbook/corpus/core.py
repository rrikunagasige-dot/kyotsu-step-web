"""Versioned observations -> scoped cases -> masked examples. No keyword quality labels."""
import hashlib,json,re,subprocess
from pathlib import Path

def digest(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def collect(root,index):
    root=Path(root).resolve();records=[dict(x) for x in index['records']];seen={x['id'] for x in records}
    inventory=[]
    for p in sorted((root/'work/items').rglob('*.md')):
        if 'redesign' in p.parts or not re.search(r'ACCEPTANCE|FINDINGS|REVIEW_SHEET',p.name):continue
        text=p.read_text();rel=str(p.relative_to(root));sha=hashlib.sha256(text.encode()).hexdigest()
        inventory.append({'path':rel,'sha256':sha,'characters':len(text)})
        oid='repo:'+digest({'path':rel,'sha':sha})[:20]
        if oid not in seen:records.append({'id':oid,'sourceType':'repository_candidate','sourcePath':rel,'sourceFileSHA256':sha,'label':'UNKNOWN','eligibility':'ORIGINAL_MESSAGE_AND_TARGET_REQUIRED'});seen.add(oid)
    return {'schemaVersion':1,'observations':records,'inventory':inventory,'trainingRun':False,'hash':digest(records)}

def curate(observations,decisions):
    byid={x['id']:x for x in observations};cases=[]
    for d in decisions:
        if d['observationId'] not in byid:raise ValueError('unknown observation')
        if d.get('quality') not in ('POSITIVE','NEGATIVE','UNKNOWN'):raise ValueError('quality')
        if d.get('evidenceTier') not in ('USER_GOLD','REPO_ATTESTED','AI_SILVER','RULE_CERTIFIED','UNKNOWN'):raise ValueError('tier')
        if d['quality']!='UNKNOWN' and not all(d.get(k) for k in ('artifactVersion','scope','dimension','evidenceRef','inputSnapshot','familyId','episodeId')):raise ValueError('label requires version, scope, input and evidence')
        if d.get('sourceType')=='personal_context_summary' and d['quality']!='UNKNOWN':raise ValueError('summary cannot be gold')
        if byid[d['observationId']].get('sourceType')=='personal_context_summary' and d['evidenceTier']=='USER_GOLD':raise ValueError('retrieve original before gold')
        cases.append({**d,'id':d.get('id',digest(d)),'label':None if d['quality']=='UNKNOWN' else int(d['quality']=='NEGATIVE')})
    # Multiple observations may point to one version/scope/dimension: conflicting labels stay unknown.
    groups={}
    for c in cases:groups.setdefault((c.get('artifactVersion'),c.get('scope'),c.get('dimension')),[]).append(c)
    merged=[]
    for key,rows in groups.items():
        labels={r['label'] for r in rows if r['label'] is not None};v=dict(rows[0]);v['observationIds']=[r['observationId'] for r in rows]
        if len(labels)>1:v.update(label=None,quality='UNKNOWN',conflict=True)
        merged.append(v)
    return {'schemaVersion':1,'cases':merged,'hash':digest(merged),'trainingRun':False}

def examples(corpus):
    out=[]
    for c in corpus['cases']:
        if c.get('label') is None:continue
        inp=c['inputSnapshot']
        if not isinstance(inp,dict) or not inp.get('text') or inp.get('kind')!='learner_artifact':raise ValueError('actual learner input required')
        if any(k in inp for k in ('feedback','quality','label','evaluation')):raise ValueError('label leakage in input')
        out.append({'id':c['id'],'text':inp['text'],'inputHash':digest(inp),'dimension':c['dimension'],'label':c['label'],'familyId':c['familyId'],'episodeId':c['episodeId'],'artifactVersion':c['artifactVersion'],'evidenceTier':c['evidenceTier'],'caseId':c['id'],'seen':c.get('seen',True),'scope':c['scope']})
    return out

def split_groups(rows):
    parent=list(range(len(rows)))
    def find(i):
        while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
        return i
    seen={}
    for i,r in enumerate(rows):
        for k in ('familyId','episodeId','inputHash'):
            key=(k,r[k])
            if key in seen:parent[find(i)]=find(seen[key])
            seen[key]=i
    groups=[str(find(i)) for i in range(len(rows))]
    return {'groups':groups,'groupCount':len(set(groups)),'rowIds':[r['id'] for r in rows],'status':'READY' if len(set(groups))>=3 else 'INSUFFICIENT_GROUPS','hash':digest({'groups':groups,'rows':[r['id'] for r in rows]})}

def git_snapshot(root,sha,path):
    if not re.fullmatch(r'[a-f0-9]{40}',sha):raise ValueError('SHA')
    p=Path(path)
    if p.is_absolute() or '..' in p.parts:raise ValueError('path')
    return subprocess.check_output(['git','show',sha+':'+path],cwd=root,text=True)

def learner_text(value):
    """Keep learner-visible structure; exclude approval, provenance, version and IDs."""
    visible={'text','latex','prompt','choices','hints','before','after','inputLatex','outputLatex','table','title','readingFlow','items','parts','type'}
    def walk(v):
        if isinstance(v,list):return [x for item in v if (x:=walk(item)) not in ({},[],None)]
        if isinstance(v,dict):
            out={}
            for k,item in v.items():
                if k in visible:
                    out[k]=walk(item) if isinstance(item,(dict,list)) else item
                elif isinstance(item,(dict,list)):
                    cleaned=walk(item)
                    if cleaned not in ({},[],None):out.setdefault('content',[]).append(cleaned)
            return out
        return v
    return json.dumps(walk(value),ensure_ascii=False,separators=(',',':'))

def user_seed(root):
    """Explicitly scoped real feedback; no synthetic positive counterparts."""
    root=Path(root);base=root/'work/items/W-GOV-010-learning-production-workflow'
    index=json.loads((base/'redesign/RECOVERED_CASE_INDEX.json').read_text());obs={x['id']:x for x in index['records']}
    sha='4fb7a98e7f864839ccc1374080473df4ba60ce88';n07=json.loads(git_snapshot(root,sha,'src/data/textbook/math/numbers/n07Authored.json'))
    decisions=[]
    dimensions={'N07-USER-F01':'prerequisite_missing','N07-USER-F02':'orphan_output','N07-USER-F03':'unmotivated_operation','N07-USER-F04':'broken_derivation','N07-USER-F05':'term_semantics_missing','N07-USER-F06':'math_render_omission'}
    for c in json.loads((base/'n07/feedback/NEGATIVE_CASES.json').read_text())['cases']:
        nodes=[n for n in n07['nodes'] if n['id'] in c['nodeIds']]
        if not nodes:raise ValueError('missing source node')
        if c['state']=='before-answer':nodes=[{k:v for k,v in n.items() if k not in ('after','outputLatex','interaction')} for n in nodes]
        text=learner_text(nodes)
        decisions.append({'id':c['id'],'observationId':c['id'],'quality':'NEGATIVE','dimension':dimensions[c['id']],'artifactVersion':sha,'scope':','.join(c['nodeIds']),
            'evidenceTier':'USER_GOLD','evidenceRef':c['evidence']['sha256'],'inputSnapshot':{'kind':'learner_artifact','text':text},'familyId':'n07-decimals','episodeId':'n07-review-20261024','seen':True})
    # A typography criticism of the two separate equations; label does not extend to other nodes.
    f4=next(c for c in decisions if c['id']=='N07-USER-F04')
    decisions.append({**f4,'id':'n07-layout-relation','dimension':'layout_discomfort'})
    decisions.append({'id':'n07-layout-positive','observationId':'chat-visible:08','quality':'POSITIVE','dimension':'layout_discomfort','artifactVersion':sha,'scope':'N07 overall layout only','evidenceTier':'USER_GOLD','evidenceRef':'current-conversation:layout-praise',
        'inputSnapshot':{'kind':'learner_artifact','text':learner_text(n07['unit'])},'familyId':'n07-decimals','episodeId':'n07-review-20261024','seen':True})
    first='22bc43ba53fa87bb85e82e18a25db13a5c8a485c'
    raw=git_snapshot(root,first,'src/data/textbook/math/numbers/firstSectionTeaching.json')
    decisions.append({'id':'first-title-layout-positive','observationId':'chat-visible:07','quality':'POSITIVE','dimension':'layout_discomfort','artifactVersion':first,'scope':'first title overall accepted layout','evidenceTier':'REPO_ATTESTED','evidenceRef':'work/items/W-MATH-031-section-one-typesetting/USER_ACCEPTANCE_20261024.md',
        'inputSnapshot':{'kind':'learner_artifact','text':learner_text(json.loads(raw))},'familyId':'first-title','episodeId':'first-title-acceptance-20261024','seen':True})
    return index['records'],decisions
