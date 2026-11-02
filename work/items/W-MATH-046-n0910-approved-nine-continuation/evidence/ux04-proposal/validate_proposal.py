import json,hashlib,re
from pathlib import Path
root=Path('/workspace/scratch/6ff917b2ec4a/w046-ux03')
errors=[];report={}
for u in ['n09','n10']:
 p=Path(f'/tmp/w046-ux04-{u}-design.json'); d=json.loads(p.read_text())
 src=json.loads((root/f'src/data/textbook/math/numbers/{u}ConstructionCompiled.json').read_text())
 if d['sourceCompiledHash']!=src['compiledHash']:errors.append([u,'baseline compiledHash mismatch'])
 old={n['nodeId']:n for n in src['nodeDesign']}; counters={'nodes':len(d['nodes']),'parts':0,'new':0,'keep':0,'retire':0,'rows':0}
 for n in d['nodes']:
  nid=n['nodeId'];parts=n['parts'];keys=[p['key'] for p in parts];order=n['partOrder'];positions={k:i for i,k in enumerate(order)}
  if len(keys)!=len(set(keys)) or set(keys)!=set(order) or len(order)!=len(set(order)):errors.append([nid,'part keys/order'])
  rows={r['id']:r for r in n['rows']};counters['rows']+=len(rows);counters['parts']+=len(parts)
  for p1 in parts:
   k=p1['key'];values=[c['value'] for c in p1['choices']]
   if len(values)!=len(set(values)) or values.count(p1['expected'])!=1:errors.append([nid,k,'choice uniqueness/expected'])
   if any(not c.get('feedback') for c in p1['choices']):errors.append([nid,k,'feedback missing'])
   deps=p1.get('dependsOnKeys',p1.get('requiresCorrectKeys',[]))
   if any(x not in positions or positions[x]>=positions[k] for x in deps):errors.append([nid,k,'part forward/unknown dependency'])
   sites=[r for r in rows.values() if k in r['partKeys']]
   if len(sites)!=1:errors.append([nid,k,'answer site count',len(sites)])
  for r in rows.values():
   pk=r['partKeys']; gates=r.get('requiresCorrectKeys',[])
   if not set(pk+gates)<=set(keys):errors.append([nid,r['id'],'unknown row key'])
   if set(pk)&set(gates):errors.append([nid,r['id'],'own key gated'])
   for k in pk:
    deps=next(p for p in parts if p['key']==k).get('dependsOnKeys',next(p for p in parts if p['key']==k).get('requiresCorrectKeys',[]))
    if not (set(deps)-set(pk))<=set(gates):errors.append([nid,r['id'],'site does not require part prerequisite'])
   hide=r.get('hideAfterCorrectKeys')
   if hide is not None and (not hide or len(hide)!=len(set(hide)) or set(hide)!=set(pk)):errors.append([nid,r['id'],'hide must match entire row parts'])
   mirrors=re.findall(r'\{mirror:([^}]+)\}',r['template'])
   if not set(mirrors)<=set(gates):errors.append([nid,r['id'],'mirror ungated'])
  mappings=n.get('partDecisions',n.get('oldPartDecisions',[]));mapped=set()
  for m in mappings:
   action=m['decision'];oid=m.get('oldPartId',m.get('oldId'));newid=m.get('newPartId',m.get('targetId'))
   if action=='NEW':counters['new']+=1;continue
   if oid:mapped.add(oid)
   if action=='KEEP':
    counters['keep']+=1
    op=next((p for p in old[nid]['parts'] if p['id']==oid),None); np=next((p for p in parts if p['id']==newid),None)
    if not op or not np:errors.append([nid,oid,'KEEP id invalid']);continue
    for field in ['expected','kind','role']:
     if op[field]!=np[field]:errors.append([nid,oid,'KEEP '+field+' differs'])
    if set(c['value'] for c in op['choices'])!=set(c['value'] for c in np['choices']):errors.append([nid,oid,'KEEP choices differ'])
   elif action in ['RETIRE','ARCHIVE_ONLY']:counters['retire']+=1
   else:errors.append([nid,oid,'unknown disposition',action])
  if mapped!=set(p['id'] for p in old[nid]['parts']):errors.append([nid,'old part disposition not total',sorted(set(p['id'] for p in old[nid]['parts'])-mapped)])
 counters['new']=counters['parts']-counters['keep']
 report[u]=dict(counters,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
report['scope']='Proposal structure only; no product QA, render or user acceptance.'
report['checks']=['source compiledHash binding','unique part keys/order/candidate values','expected present exactly once; all feedback present','predecessor-only dependencies and correct answer-site gates','row key references and one answer site per part','hide set equals entire row part set; mirror requires correct prerequisite','old part disposition total; KEEP kind/role/expected/choice values unchanged']
report['errors']=errors;report['status']='PASS_PROPOSAL_STRUCTURE_ONLY' if not errors else 'FAIL_PROPOSAL_STRUCTURE'
Path('/tmp/w046-ux04-stage/STRUCTURE_CHECK.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
