"""Prepare exact four-file patch for review only. Never writes src/ or applies it."""
from pathlib import Path
import json,hashlib,subprocess,os
B=Path(__file__).resolve().parent;R=B.parents[2];O=B/os.environ.get('W048_PATCH_OUT','r3');O.mkdir(exist_ok=True)
def load(p):return json.loads((B/p).read_text())
def sha(x):return hashlib.sha256(x).hexdigest()
def replace_once(text,old,new):assert text.count(old)==1,(old,text.count(old));return text.replace(old,new,1)
files={}
for code,rev in [('n13',5),('n14',11)]:
 U=code.upper();generated=load(U+'_MATERIALIZED_CANDIDATE.json');ir=load(U+'_FULL_IR.json');projection=load(U+'_ROW_PROJECTION.json')
 candidate=load(U+'_CANDIDATE.json')['unit'];assert generated['unit']==candidate
 before=R/f'src/data/textbook/math/numbers/{code}Lesson.ts';text=before.read_text()
 text=replace_once(text,'export const mathNumbers'+U+'Unit=','export const mathNumbers'+U+'LegacyUnit=')
 display={'unitId':candidate['unitId'],'revision':rev,'irHash':load('evidence/'+U+'_FULL_IR_CHECK.json')['irHash'],'equationNumbers':generated['equationNumbers']}
 text+='\n// W048 proposed exact compiler/physical-row output. Original legacy unit remains available.\n'
 text+='const raw'+U+'W048 = '+json.dumps(candidate,ensure_ascii=False,indent=2)+'\n'
 text+='export const mathNumbers'+U+'Unit=validateTextbookUnits([raw'+U+'W048])[0]\n'
 text+='export const '+code+'W048DisplayContract = '+json.dumps(display,ensure_ascii=False,indent=2)+' as const\n'
 oldMap=load('evidence/'+U+'_CURRENT.json')['sourceToItemIds']
 for q in sorted({a['q']for a in load('ADDED_DECISIONS.json')if a['unit']==code}):
  key=U+'-Q'+str(q).zfill(2);ids=[a['id']for a in load('ADDED_DECISIONS.json')if a['unit']==code and a['q']==q]+oldMap[key]
  text+=code+'SourceToItemIds['+json.dumps(key)+'] = '+json.dumps(ids)+'\n'
 files[str(before.relative_to(R))]=text

p='src/domain/textbook.ts';text=(R/p).read_text();text="import * as w048N13Module from '../data/textbook/math/numbers/n13Lesson'\nimport * as w048N14Module from '../data/textbook/math/numbers/n14Lesson'\n"+text
marker='  if (progress.unitRevision === unit.revision) return progress\n'
algorithm='''  // W048: use the real prior unit and prior migrations before adding new decisions.
  const w048Legacy = unit.unitId === 'math-numbers-expressions-n13' && unit.revision === 5
    ? (w048N13Module as unknown as { mathNumbersN13LegacyUnit?: TextbookUnit }).mathNumbersN13LegacyUnit ?? w048N13Module.mathNumbersN13Unit
    : unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 11
      ? (w048N14Module as unknown as { mathNumbersN14LegacyUnit?: TextbookUnit }).mathNumbersN14LegacyUnit ?? w048N14Module.mathNumbersN14Unit
      : undefined
  if (w048Legacy && progress.unitId === unit.unitId && progress.unitRevision <= w048Legacy.revision) {
    const previous = effectiveTextbookProgress(w048Legacy, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const anchors = new Set(w048Legacy.sections.flatMap(section => section.items.map(item => item.id)))
    return {
      unitId: unit.unitId, unitRevision: unit.revision,
      startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, [String(w048Legacy.revision)]: archive },
      migratedFromRevision: w048Legacy.revision,
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }
'''
text=replace_once(text,marker,marker+algorithm);files[p]=text

p='src/pages/TextbookUnitPage.tsx';text=(R/p).read_text()
text="import * as w048N13Module from '../data/textbook/math/numbers/n13Lesson'\nimport * as w048N14Module from '../data/textbook/math/numbers/n14Lesson'\n"+text
at=text.index('function interactionPrompt(')
helper='''type W048DisplayContract = { unitId: string; revision: number; equationNumbers: Readonly<Record<string, number>> }
function w048DisplayContractFor(unit: TextbookUnit): W048DisplayContract | undefined {
  const value = unit.unitId === 'math-numbers-expressions-n13' && unit.revision === 5
    ? (w048N13Module as unknown as { n13W048DisplayContract?: W048DisplayContract }).n13W048DisplayContract
    : unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 11
      ? (w048N14Module as unknown as { n14W048DisplayContract?: W048DisplayContract }).n14W048DisplayContract
      : undefined
  return value?.unitId === unit.unitId && value.revision === unit.revision ? value : undefined
}
const w048ScopedStyle = `.w048-reading-flow .reading-formula-line{font-size:18px}
.w048-reading-flow .reading-choice-option>strong{font-size:18px}
.w048-reading-flow .reading-choice-option .katex,.w048-reading-flow .reading-formula-line .katex{font-size:1em}
.w048-reading-flow .reading-paragraph .katex{font-size:1em}
.w048-reading-flow .reading-derivation-chain .reading-formula-line{text-align:left}
.w048-reading-flow .reading-derivation-chain[data-derivation-id] [data-testid^=\"textbook-formula-\"] .reading-formula-expression{justify-content:flex-start;justify-items:start}
.w048-reading-flow .reading-choice-option .first-theme-choice-math{max-width:100%}`

'''
text=text[:at]+helper+text[at:]
start=text.index('function LegacyTextbookReadingFlow(');end=text.index('\nfunction ',start+10)
scope=text[start:end]
scope=replace_once(scope,"  const { text, language } = useI18n()","  const { text, language } = useI18n()\n  const w048Contract = w048DisplayContractFor(unit)")
scope=scope.replace('isFirstThemeUnit(unit.unitId) ? activeItem.prompt','(isFirstThemeUnit(unit.unitId) || Boolean(w048Contract)) ? activeItem.prompt')
scope=scope.replace('isFirstThemeUnit(unit.unitId) ? <FirstThemeChoiceFormula','(isFirstThemeUnit(unit.unitId) || Boolean(w048Contract)) ? <FirstThemeChoiceFormula')
scope=replace_once(scope,'onOpen={setActiveItemId} unitId={unit.unitId} />','onOpen={setActiveItemId} unitId={unit.unitId} equationNumber={w048Contract?.equationNumbers[block.id]} />')
scope=replace_once(scope,'<article className="textbook-reading-flow"','<article className={"textbook-reading-flow" + (w048Contract ? " w048-reading-flow" : "")}')
scope=replace_once(scope,'      {compactStages ? (','      {w048Contract && <style>{w048ScopedStyle}</style>}\n      {compactStages ? (')
text=text[:start]+scope+text[end:];files[p]=text

patch={'id':'P-W048-003-proposed-data-and-consumers','applyStatus':'NOT_APPLIED','files':[]}
for p,text in files.items():
 before=(R/p).read_bytes();out=O/'proposed'/p;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(text)
 patch['files'].append({'path':p,'before_sha256':sha(before),'after_sha256':sha(text.encode()),'after_text':text})
for name,paths in [('N13',['src/data/textbook/math/numbers/n13Lesson.ts','src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx']),('N14',['src/data/textbook/math/numbers/n14Lesson.ts'])]:
 selected={**patch,'id':name+'-P-W048-003','files':[row for row in patch['files']if row['path']in paths]};(O/(name+'_PROPOSED_PATCH.json')).write_text(json.dumps(selected,ensure_ascii=False,indent=2)+'\n')
(O/'PROPOSED_PATCH_INDEX.json').write_text(json.dumps({'status':'REVIEW_ONLY_NOT_APPLIED','files':[{k:v for k,v in row.items()if k!='after_text'}for row in patch['files']],'sequence':['N13 leaf + inactive scoped consumers and migrations','N14 leaf only; prior consumer activation is guarded by exact revision'],'sharedGuardsChanged':False},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'PROPOSED_PATCH_ONLY','files':len(files),'sourceFilesWritten':False}))
