import json,sys,hashlib,re
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from ready_dispatch import run
from store import digest
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';code=sys.argv[1];assert code in ['ne02','n11','n12'];s=r.state(w);assert r.approval(s) and not r.integrity(s)
job=run(r,w,'R06_PATCH@'+code,{'ir.compile':json.loads((B/(code.upper()+'_IR.json')).read_text())});files={}
p='src/data/textbook/math/numbers/'+code+'Authored.json';files[p]=(B/('MATERIALIZED_'+code.upper()+'.json')).read_text();p='src/data/textbook/math/numbers/'+code+'Lesson.ts';leaf=(R/p).read_text();U=code.upper();name='mathNumbers'+U+'Unit';legacy='mathNumbers'+U+'LegacyUnit';assert name in leaf
leaf=leaf.replace('export const '+name, 'export const '+legacy)
mapname=code+'SourceToItemIds';leaf=leaf.replace('export const '+mapname,'export const '+code+'LegacySourceToItemIds')
leaf="import authored from './"+code+"Authored.json'\n"+leaf+'\nexport const '+name+' = validateTextbookUnits([authored.unit])[0]\nexport const '+code+'Presentation = authored\nexport const '+mapname+": Record<string, string[]> = Object.fromEntries(Array.from({length:"+str({'ne02':12,'n11':14,'n12':15}[code])+"},(_,i)=>['"+U+"-Q'+String(i+1).padStart(2,'0'), authored.nodes.filter(n=>n.q===i+1).flatMap(n=>n.interaction?[n.interaction]:[])]))\n";files[p]=leaf
p='src/pages/TextbookUnitPage.tsx';page=(R/p).read_text();page="import { "+code+"Presentation } from '../data/textbook/math/numbers/"+code+"Lesson'\n"+page;needle=': <LegacyTextbookReadingFlow {...props} />';replacement=": props.unit.unitId === 'math-numbers-expressions-"+code+"' && props.unit.revision === "+str({'ne02':2,'n11':11,'n12':4}[code])+"\n            ? <GuidedMathReadingFlow key={props.unit.unitId} {...props} presentation={"+code+"Presentation} /> "+needle;assert needle in page;page=page.replace(needle,replacement,1);
if code=='ne02' or code+'GuidedPresentation' not in (R/p).read_text():files[p]=page
if code=='ne02':
 p='src/components/textbook/GuidedMathReadingFlow.tsx';reader=(R/p).read_text();reader=reader.replace('type Presentation = { code: string;',"type Presentation = { choiceDisplay?: 'semantic'; code: string;")
 reader=reader.replace("{item.answerType === 'formula' && !choice.includes('\\\\text{')", "{data.choiceDisplay === 'semantic' ? semantic(displays[node.id].choices[choice]) : item.answerType === 'formula' && !choice.includes('\\\\text{')")
 assert "data.choiceDisplay === 'semantic'" in reader
 reader=reader.replace('n.extra.figure && originalFigure()', 'n.extra.figure && originalFigure(n)')
 old="  const figure = section.figures[0]\n  function originalFigure() {\n    if (!figure || !resolved(data.nodes.find(n => n.extra.figure)!) ) return null"
 new="  function originalFigure(node: Node) {\n    const figure = section.figures.find(f => f.id === node.extra.figure?.id)\n    if (!figure || !resolved(node)) return null";assert old in reader;reader=reader.replace(old,new).replace('data-testid="guided-original-figure"><img', 'data-testid="guided-original-figure" data-figure-id={figure.id}><img');files[p]=reader
p='src/domain/textbook.ts';domain=(R/p).read_text();oldrev={'ne02':1,'n11':10,'n12':3}[code];newrev=oldrev+1;olditems=json.loads((B/f'evidence/{U}_CURRENT.json').read_text())['unit']['sections'][0]['items'];anchors=json.dumps([i['id'] for i in olditems]);marker='  // W-MATH-034: keep all21 original N10 histories;24 new derivations are unanswered.'
migration='''  // W-MATH-036: apply all prior migrations first, retain current keys, reopen only added nodes.
  if (unit.unitId === 'UNIT' && unit.revision === NEW
      && progress.unitId === unit.unitId && progress.unitRevision <= OLD) {
    const previous = progress.unitRevision === OLD ? progress : effectiveTextbookProgress({ ...unit, revision: OLD }, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const anchors = new Set(ANCHORS)
    return {
      unitId: unit.unitId, unitRevision: NEW, startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, 'OLD': archive }, migratedFromRevision: OLD,
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }

'''.replace('UNIT','math-numbers-expressions-'+code).replace('NEW',str(newrev)).replace('OLD',str(oldrev)).replace('ANCHORS',anchors)
assert marker in domain
if "unit.unitId === 'math-numbers-expressions-"+code+"' && unit.revision === "+str(newrev) not in domain:files[p]=domain.replace(marker,migration+marker,1)
# One explicit approved leaf patch; backup includes old bytes and new content hashes.
h=lambda b:hashlib.sha256(b).hexdigest();raw={p:v.encode() for p,v in files.items()};backup=r.store.put(dict(files_hex={p:(R/p).read_bytes().hex() if (R/p).exists() else None for p in raw},new_hashes={p:h(v) for p,v in raw.items()}));op='W036-'+code+'-'+backup[:20]
r.append('patch_intent',w,dict(node=job['node'],patch_hash=digest({p:h(v) for p,v in raw.items()}),backup=backup,before={p:h((R/p).read_bytes()) if (R/p).exists() else None for p in raw}),event_id=op)
for p,v in raw.items():(R/p).write_bytes(v)
r.append('patch_applied',w,dict(node=job['node'],operation=op,after_manifest={p:h(v) for p,v in raw.items()}));(B/('PATCH_JOB_'+U+'.json')).write_text(json.dumps(dict(job=job,proof=backup),indent=2)+'\n');print('Applied approved '+code+'; R06 receipt awaits commit and verification')
