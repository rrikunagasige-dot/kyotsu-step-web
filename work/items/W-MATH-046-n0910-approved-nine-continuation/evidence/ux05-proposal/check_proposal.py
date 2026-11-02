import json, hashlib, pathlib, collections
root=pathlib.Path('/workspace/scratch/6ff917b2ec4a/w046-ux04-pilot')
out={'kind':'PROPOSAL_STRUCTURE_ONLY','productTestPerformed':False,'units':[],'errors':[]}
for u in ['n09','n10']:
 design_path=pathlib.Path('/tmp/w046-ux05-'+u+'-design.json');d=json.loads(design_path.read_text());b=json.loads((root/('src/data/textbook/math/numbers/'+u+'ConstructionCompiled.json')).read_text())
 nodes=d['nodes'];base={n['nodeId']:n for n in b['nodeDesign']};ids=[n['nodeId'] for n in nodes];errs=[];maps=[];new=[];kept=[];retired=[]
 def require(ok,msg):
  if not ok:errs.append(msg)
 require(len(ids)==len(set(ids)),'duplicate node IDs');require(set(ids)==set(base),'node coverage mismatch');require(d['baselineCompiledHash']==b['compiledHash'],'baseline hash mismatch')
 for n in nodes:
  nid=n['nodeId'];bn=base[nid];m=n.get('oldPartMapping',n.get('oldPartDecisions',[]));old={p['id']:p for p in bn['parts']};seen=[]
  for x in m:
   oid=x.get('oldPartId',x.get('oldId'));act=x.get('decision',x.get('action'));act='RETIRE' if act=='RETIRE_ARCHIVE_ONLY' else act;target=x.get('newPartId',x.get('newId'));seen.append(oid);maps.append(oid)
   require(oid in old,nid+': unknown oldpart '+str(oid));require(act in ['KEEP','RETIRE'],nid+': bad map action')
   if act=='KEEP':require(target==oid,nid+': KEEP aliases another ID');kept.append(oid)
   else:require(target is None,nid+': RETIRE aliases target');retired.append(oid)
  require(len(seen)==len(set(seen)) and set(seen)==set(old),nid+': incomplete old mapping')
  if n['decision']=='KEEP':continue
  require(bool(n.get('completeSolution',n.get('completeHoleFreeSolution'))),nid+': no complete solution')
  parts=n['parts'];keys=[p['key'] for p in parts];require(len(keys)==len(set(keys)),nid+': duplicate keys')
  rowids=[r['id'] for r in n['rows']];require(len(rowids)==len(set(rowids)),nid+': duplicate row IDs')
  for p in parts:
   pid=nid+'::'+p['key'];require(p.get('id',pid)==pid,nid+': part ID mismatch')
   if p['decision']=='NEW':
    new.append(pid);require(pid not in old,nid+': NEW reuses old ID');cs=p.get('choices',[]);vs=[c['value'] for c in cs];require(len(vs)==len(set(vs)),pid+': duplicate choices');require(p['expected'] in vs,pid+': expected absent');require(len(cs)>=2,pid+': missing choices');require(all(c.get('feedback') for c in cs),pid+': missing feedback')
   else:
    require(pid in old and pid in kept,pid+': KEEP contract absent')
    if 'expected' in p:require(p['expected']==old[pid]['expected'],pid+': changed KEEP expected')
    if 'choices' in p:require(p['choices']==old[pid]['choices'],pid+': changed KEEP choices')
   for k in p.get('dependsOnKeys',p.get('requiresCorrectKeys',[])):require(k in keys and keys.index(k)<keys.index(p['key']),pid+': nonprior dependency')
  for r in n['rows']:
   for k in r.get('partKeys',[])+r.get('requiresCorrectKeys',[])+r.get('hideAfterCorrectKeys',[]):require(k in keys,nid+': unknown row key '+k)
  for pre in n.get('proposedPrerequisiteNodeIds',n.get('prerequisiteNodeIds',[])):require(pre in ids and ids.index(pre)<ids.index(nid),nid+': nonprior node')
 require(len(maps)==len(set(maps)),'duplicate old mapping across nodes')
 out['units'].append({'unit':u,'nodeCount':len(nodes),'changeNodes':[n['nodeId'] for n in nodes if n['decision']=='CHANGE'],'keepNodeCount':sum(n['decision']=='KEEP' for n in nodes),'oldPartCount':len(maps),'keptPartCount':len(kept),'retiredPartCount':len(retired),'newPartCount':len(new),'targetPartCount':len(kept)+len(new),'designSha256':hashlib.sha256(design_path.read_bytes()).hexdigest(),'baselineCompiledHash':b['compiledHash'],'errors':errs})
 out['errors']+=errs
out['status']='PASS' if not out['errors'] else 'FAIL'
pathlib.Path('/tmp/w046-ux05-proposal/STRUCTURE_CHECK.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False,indent=2))
