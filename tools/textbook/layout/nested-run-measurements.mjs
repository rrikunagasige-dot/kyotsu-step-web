import {checkEquationTag} from './equation-tag-measurements.mjs';
import {buildNestedSnapshots} from '../transformation/nested-snapshots.mjs';
import {compileNestedMathTemplate} from '../interaction/math-template.mjs';
import { hash } from '../util.mjs';
import { checkNestedMeasurements } from './nested-measurements.mjs';

/** Validate complete source-bound browser runs; a partial geometry packet is insufficient. */
export function checkNestedRuns(compiled, runs, context = {}) {
  const findings = [], reject = (ruleId, detail) => findings.push({ ruleId, detail });
  if (!compiled || compiled.nestedPipeline !== 'n0910/1') return { status: 'FAIL', findings: [{ ruleId: 'NESTED_COMPILED_REQUIRED' }] };
  const { compiledHash, ...payload } = compiled;
  if (hash(payload) !== compiledHash || !/^[a-f0-9]{64}$/.test(compiled.planHash ?? '') || compiled.irHash !== compiled.sourceIRHash) reject('NESTED_COMPILED_HASH');
  if (!/^[a-f0-9]{40}$/.test(context.sourceSHA ?? '')) reject('NESTED_SOURCE_SHA_REQUIRED');
  if (!Array.isArray(runs) || runs.length !== 4) return { status: 'FAIL', findings: [...findings, { ruleId: 'NESTED_FOUR_RUNS_REQUIRED' }] };
  if (JSON.stringify(runs.map(r => r.width).sort((a,b) => a-b)) !== JSON.stringify([320,390,430,1440])) reject('NESTED_WIDTH_COVERAGE');
  const snapshots = buildNestedSnapshots(compiled).snapshots;
  const parts = compiled.nodeDesign.flatMap(n => n.parts), code = compiled.unitId.endsWith('n09') ? 'n09' : 'n10';
  let formulaCount = 0;
  const finite = x => typeof x === "number" && Number.isFinite(x);
  for (const run of runs) {
    const at = code + '/' + run.width;
    if (context.sourceManifest && Object.entries(context.sourceManifest).some(([p,h]) => run.sourceManifest?.[p] !== h)) reject('NESTED_SOURCE_MANIFEST_MISMATCH', at);
    if (run.sourceSHA !== context.sourceSHA || run.code !== code || run.compiledHash !== compiledHash) reject('NESTED_RUN_BINDING', at);
    if (!/^[a-f0-9]{64}$/.test(run.scriptHash ?? '') || !/^[a-f0-9]{64}$/.test(run.fontSha256 ?? '') || !run.sourceManifest || !Object.keys(run.sourceManifest).length || hash(run.sourceManifest) !== hash(run.sourceManifestAfter) || runs.some(r => r.scriptHash !== run.scriptHash || hash(r.sourceManifest) !== hash(run.sourceManifest))) reject('NESTED_RUN_PROVENANCE', at);
    if (!Array.isArray(run.errors) || run.errors.length || !Array.isArray(run.failures) || run.failures.length) reject('NESTED_FAILED_RUN', at);
    if (!run.lifecycle || ['completed','reloaded','historyReadonly','resetReloaded'].some(k => run.lifecycle[k] !== true)) reject('NESTED_LIFECYCLE_COVERAGE', at);
    if(!run.keyboardChecks||['slotFocus','Enter','Space','Escape'].some(k=>run.keyboardChecks[k]!==true))reject('NESTED_KEYBOARD_COVERAGE',at);
    const packets = run.packets;
    if (!Array.isArray(packets)) { reject('NESTED_PACKETS_REQUIRED', at); continue; }
    if (packets.some(p => !parts.some(part => part.id === p.part))) reject('NESTED_UNKNOWN_PART', at);
    for (const part of parts) {
      const group = packets.filter(p => p.part === part.id), wrong = group.filter(p => p.state === 'wrong'), expectedWrong = part.choices.filter(c => c.value !== part.expected).map(c => c.value).sort();
      if (group.filter(p => p.state === 'initial').length !== 1 || group.filter(p => p.state === 'filled' && p.selectedValue === part.expected).length !== 1 || JSON.stringify(wrong.map(p => p.selectedValue).sort()) !== JSON.stringify(expectedWrong) || group.length !== expectedWrong.length + 2) reject('NESTED_PART_STATE_COVERAGE', at + ':' + part.id);
    }
    const frames = new Map(), groups = new Map();
    const bindFormulas = (formulas, expected, label) => {
      if (!Array.isArray(formulas) || JSON.stringify(formulas.map(f=>f.id).sort()) !== JSON.stringify(expected.map(f=>f.id).sort())) { reject('NESTED_VISIBLE_FORMULA_COVERAGE', label); return; }
      for (const f of formulas) {
        const e = expected.find(e=>e.id===f.id);
        if (f.template !== e.template || f.mode !== e.mode) { reject('NESTED_VISIBLE_FORMULA_BINDING', label+':'+f.id); continue; }
        const tagCheck=checkEquationTag(f,e.equationTag);if(tagCheck.status!=='PASS')reject('NESTED_EQUATION_TAG',{label,id:f.id,findings:tagCheck.findings});
        const c = compileNestedMathTemplate(e), slots = c.slots.map(s=>({id:s.key,path:s.path,value:s.value}));
        if (hash((f.geometry?.slots??[]).map(s=>({id:s.id,path:s.path,value:s.value}))) !== hash(slots) || hash((f.slots??[]).map(s=>({key:s.key,state:s.state}))) !== hash(c.slots.map(s=>({key:s.key,state:s.certified?'filled':s.value===undefined?'initial':'wrong'})))) reject('NESTED_VISIBLE_SLOT_BINDING',label+':'+f.id);
        if (c.rootRelation && (f.geometry?.rootRelationProof?.semanticPath !== c.rootRelation.path || f.geometry.rootRelationProof.source !== 'shared-compiler-marker-dom-revalidated')) reject('NESTED_VISIBLE_ROOT_BINDING',label+':'+f.id);
      }
    };
    const expectedFor = (node, visible, mode, prefix='') => {
      const result = visible.rows.filter(r=>r.kind==='math').map(row=>{
        const keys=new Set([...row.partKeys,...Array.from(row.template.matchAll(/\{mirror:([^}]+)\}/g),m=>m[1])]), parts=visible.parts.filter(p=>keys.has(p.key));
        return {id:prefix+row.id,template:row.template,mode,parts:parts.map(p=>({key:p.key,kind:p.prompt,role:p.role,choices:p.choices})),values:Object.fromEntries(parts.filter(p=>p.value!==undefined).map(p=>[p.key,p.value])),certifiedKeys:parts.filter(p=>p.correct).map(p=>p.key)};
      });
      if(!prefix&&node.equationNumber!==undefined){const last=result.at(-1);if(last)last.equationTag='('+[node.equationNumber,...(node.numberAliases??[])].join(' / ')+')';}
      if (!prefix && visible.resolved) {
        result.push(...node.terminalRecord.formulas.map((template,i)=>({id:node.nodeId+'-memo-'+i,template,mode:'readonly',parts:[]})));
        result.push(...(node.displayExtras??[]).flatMap((extra,i)=>extra.kind==='math'?[{id:node.nodeId+'-extra-'+i,template:extra.latex,mode:'readonly',parts:[]}]:[]));
      }
      return result;
    };
    for (const packet of packets) {
      if (packet.viewport !== run.width || !Number.isFinite(packet.readerWidth) || packet.readerWidth <= 0 || !finite(packet.pageWidth) || packet.pageWidth > run.width + 1 || !Array.isArray(packet.formulas) || !packet.formulas.length) { reject('NESTED_READER_PACKET', at + ':' + packet.part); continue; }
      const snapshot=snapshots.find(s=>s.partId===packet.part&&s.state===packet.state&&s.selectedValue===packet.selectedValue);
      if (!snapshot) { reject('NESTED_RUNTIME_STATE_BINDING',at+':'+packet.part); continue; }
      const node=compiled.nodeDesign.find(n=>n.parts.some(p=>p.id===packet.part)), visible=snapshot.visible.visible.find(n=>n.node.nodeId===node.nodeId), currentStage=snapshot.visible.visible.at(-1).node.stageId;
      bindFormulas(packet.formulas,expectedFor(node,visible,visible.resolved&&node.stageId!==currentStage?'readonly':'interactive'),at+':'+packet.part+':'+packet.state);
      const expectedText=visible.rows.filter(r=>r.kind==='text').flatMap(row=>Array.from(row.template.matchAll(/\{(mirror:)?([^}]+)\}/g),m=>{const p=visible.parts.find(p=>p.key===m[2]);return {rowId:row.id,id:p.id,key:p.key,...(p.value===undefined?{}:{value:p.value}),state:p.correct?'filled':p.value===undefined?'initial':'wrong',editable:!p.correct&&p.editable,button:!p.correct};}));
      if(hash((packet.textSlots??[]).map(({rowId,id,key,value,state,editable,button})=>({rowId,id,key,value,state,editable,button})))!==hash(expectedText))reject('NESTED_TEXT_SLOT_BINDING',at+':'+packet.part+':'+packet.state);
      for(const text of packet.textSlots??[])if(text.button&&(!finite(text.rect?.width)||!finite(text.rect?.height)||text.rect.width<44||text.rect.height<44))reject('NESTED_TEXT_HIT_SIZE',at+':'+text.id);
      for (const formula of packet.formulas) {
        formulaCount++;
        const key = packet.part + ':' + formula.id + ':' + formula.mode, previous = frames.get(key);
        if (!previous) frames.set(key, formula);
        else if (formula.mode === 'interactive') {
          if (['width','height'].some(k => !finite(formula.formula?.[k]) || Math.abs(formula.formula[k] - previous.formula[k]) > 1)) reject('NESTED_STATE_FRAME_CHANGED', at + ':' + key);
          for (const slot of formula.slots ?? []) {
            const old = previous.slots?.find(s => s.key === slot.key);
            if (!old || ['x','y'].some(k => !finite(slot.rect?.[k]) || Math.abs(slot.rect[k] - formula.formula[k] - old.rect[k] + previous.formula[k]) > 1)) reject('NESTED_STATE_ANCHOR_CHANGED', at + ':' + key);
          }
        }
        if (formula.font !== '18px' || formula.status !== 'MEASURED' || formula.overflow === 'true') reject('NESTED_FORMULA_NOT_MEASURED', at + ':' + formula.id);
        const g = formula.geometry?.groupAlignment;
        if (g) {
          const groupKey = g.groupId + ':' + formula.mode, old = groups.get(groupKey);
          const localColumn = g.relationX - g.bodyLeft;
          if (!old) groups.set(groupKey, { bodyWidth: g.bodyWidth, neutralLayoutKey: g.neutralLayoutKey, column: g.status === 'ALIGNED' ? localColumn : undefined });
          else {
            if (old.neutralLayoutKey !== g.neutralLayoutKey || Math.abs(old.bodyWidth - g.bodyWidth) > 1) reject('NESTED_GROUP_STATE_CHANGED', at + ':' + groupKey);
            if (g.status === 'ALIGNED') {
              if (old.column !== undefined && Math.abs(old.column - localColumn) > 1) reject('NESTED_RELATION_COLUMN_CHANGED', at + ':' + groupKey);
              old.column ??= localColumn;
            }
          }
        }
        const verified = checkNestedMeasurements(formula.geometry);
        if (verified.status !== 'PASS' || formula.geometry.status !== 'PASS') reject('NESTED_GEOMETRY', { at, part: packet.part, id: formula.id, findings: verified.findings });
      }
    }
    const finalView=snapshots.at(-1).visible, currentStage=finalView.visible.at(-1).node.stageId;
    const expectedAuto=compiled.nodeDesign.filter(n=>!n.parts.length).flatMap(node=>expectedFor(node,finalView.visible.find(n=>n.node.nodeId===node.nodeId),node.stageId!==currentStage?'readonly':'interactive'));
    const expectedHistory=compiled.nodeDesign.flatMap(node=>expectedFor(node,finalView.visible.find(n=>n.node.nodeId===node.nodeId),'readonly','history-'));
    for (const [kind,expected] of [['auto',expectedAuto],['history',expectedHistory]]) {
      const aux=run.auxiliaryPackets?.filter(p=>p.kind===kind)??[];
      if(aux.length!==1){reject('NESTED_AUXILIARY_COVERAGE',at+':'+kind);continue;}
      bindFormulas(aux[0].formulas,expected,at+':'+kind);
      if(aux[0].viewport!==run.width||!finite(aux[0].pageWidth)||aux[0].pageWidth>run.width+1)reject('NESTED_AUXILIARY_VIEWPORT',at+':'+kind);
      for(const f of aux[0].formulas??[]){formulaCount++;const verified=checkNestedMeasurements(f.geometry);if(verified.status!=='PASS'||f.geometry.status!=='PASS'||f.font!=='18px'||f.status!=='MEASURED'||f.overflow==='true')reject('NESTED_AUXILIARY_GEOMETRY',{at,kind,id:f.id,findings:verified.findings});}
    }
  }
  return { status: findings.length ? 'FAIL' : 'PASS', schemaVersion: 'nested-run-validation/1', findings, measurementCount: formulaCount, widths: runs.map(r => r.width), partCount: parts.length, layoutHash: compiled.layoutDesignHash, automaticAcceptance: false };
}
