import {checkEquationTag} from './equation-tag-measurements.mjs';
import {buildNestedSnapshots} from '../transformation/nested-snapshots.mjs';
import {compileNestedMathTemplate} from '../interaction/math-template.mjs';
import { hash } from '../util.mjs';
import { checkNestedMeasurements } from './nested-measurements.mjs';

/** Public layout phase excludes wrong/initial candidate values, which must keep
 * the same reservation. A newly certified value or visible row permits replanning. */
export function nestedPublicLayoutState(visible) {
  return hash(visible.visible.map(item => ({ nodeId: item.node.nodeId, rows: item.rows.map(row => row.id), certified: item.parts.filter(p => p.correct).map(p => ({ key: p.key, value: p.value })) })));
}

/** Exact learner DOM contract: there are no terminal memo rows in this reader.
 * Extras always use their source ID and readonly mode, including in history. */
export function expectedNestedReaderFormulas(node, visible, mode, prefix = '') {
  const result = visible.rows.filter(row => row.kind === 'math').map(row => {
    const keys = new Set([...row.partKeys, ...Array.from(row.template.matchAll(/\{mirror:([^}]+)\}/g), match => match[1])]);
    const parts = visible.parts.filter(part => keys.has(part.key));
    return { id: prefix + row.id, template: row.template, mode,
      parts: parts.map(part => ({ key: part.key, kind: part.prompt, role: part.role, choices: part.choices })),
      values: Object.fromEntries(parts.filter(part => part.value !== undefined).map(part => [part.key, part.value])),
      certifiedKeys: parts.filter(part => part.correct).map(part => part.key) };
  });
  if (node.equationNumber !== undefined && result.length) result.at(-1).equationTag = '(' + [node.equationNumber, ...(node.numberAliases ?? [])].join(' / ') + ')';
  return [...result, ...expectedNestedReaderExtras(node, visible)];
}
function expectedNestedReaderExtras(node, visible) {
  return visible.resolved ? (node.displayExtras ?? []).flatMap((extra, index) => extra.kind === 'math' ? [{ id: node.nodeId + '-extra-' + index, template: extra.latex, mode: 'readonly', parts: [] }] : []) : [];
}
export function expectedNestedReaderAuxiliary(compiled, finalView) {
  const currentStageId = finalView.visible.at(-1).node.stageId;
  const stageIndex = compiled.stages.findIndex(stage => stage.id === currentStageId);
  const previousStages = new Set(compiled.stages.slice(0, stageIndex).map(stage => stage.id));
  const item = node => finalView.visible.find(entry => entry.node.nodeId === node.nodeId);
  const auto = compiled.stages.map(stage => ({ stageId: stage.id,
    formulas: compiled.nodeDesign.filter(node => node.stageId === stage.id).flatMap(node => !node.parts.length
      ? expectedNestedReaderFormulas(node, item(node), 'interactive') : expectedNestedReaderExtras(node, item(node))) }));
  const history = compiled.nodeDesign.filter(node => previousStages.has(node.stageId)).flatMap(node => expectedNestedReaderFormulas(node, item(node), 'readonly', 'history-'));
  return { auto, history, currentStageId };
}

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
    if (!Array.isArray(run.httpErrors) || run.httpErrors.length || !Array.isArray(run.networkFailures) || run.networkFailures.length) reject('NESTED_HTTP_NETWORK_FAILURE', at);
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
        if (!Array.isArray(f.geometry?.resolvedParts) || hash(f.geometry.resolvedParts) !== hash(c.resolvedParts)) reject('NESTED_RESOLVED_AST_BINDING',label+':'+f.id);
        if (c.resolvedParts.some(p => c.slots.some(slot => slot.path === p.path))) reject('NESTED_RESOLVED_RESERVATION',label+':'+f.id);
        if (c.rootRelation && (f.geometry?.rootRelationProof?.semanticPath !== c.rootRelation.path || f.geometry.rootRelationProof.source !== 'shared-compiler-marker-dom-revalidated')) reject('NESTED_VISIBLE_ROOT_BINDING',label+':'+f.id);
      }
    };
    for (const packet of packets) {
      if (packet.viewport !== run.width || !Number.isFinite(packet.readerWidth) || packet.readerWidth <= 0 || !finite(packet.pageWidth) || packet.pageWidth > run.width + 1 || !Array.isArray(packet.formulas)) { reject('NESTED_READER_PACKET', at + ':' + packet.part); continue; }
      const snapshot=snapshots.find(s=>s.partId===packet.part&&s.state===packet.state&&s.selectedValue===packet.selectedValue);
      if (!snapshot) { reject('NESTED_RUNTIME_STATE_BINDING',at+':'+packet.part); continue; }
      const layoutState=nestedPublicLayoutState(snapshot.visible);
      const node=compiled.nodeDesign.find(n=>n.parts.some(p=>p.id===packet.part)), visible=snapshot.visible.visible.find(n=>n.node.nodeId===node.nodeId);
      if (packet.stageId !== node.stageId) reject('NESTED_PACKET_STAGE_BINDING', at+':'+packet.part);
      // The answer callback keeps the owner's stage active, including its filled packet.
      bindFormulas(packet.formulas,expectedNestedReaderFormulas(node,visible,'interactive'),at+':'+packet.part+':'+packet.state);
      const expectedText=visible.rows.filter(r=>r.kind==='text').flatMap(row=>Array.from(row.template.matchAll(/\{(mirror:)?([^}]+)\}/g),m=>{const p=visible.parts.find(p=>p.key===m[2]);return {rowId:row.id,id:p.id,key:p.key,...(p.value===undefined?{}:{value:p.value}),state:p.correct?'filled':p.value===undefined?'initial':'wrong',editable:!p.correct&&p.editable,button:!p.correct};}));
      if(hash((packet.textSlots??[]).map(({rowId,id,key,value,state,editable,button})=>({rowId,id,key,value,state,editable,button})))!==hash(expectedText))reject('NESTED_TEXT_SLOT_BINDING',at+':'+packet.part+':'+packet.state);
      for(const text of packet.textSlots??[])if(text.button&&(!finite(text.rect?.width)||!finite(text.rect?.height)||text.rect.width<44||text.rect.height<44))reject('NESTED_TEXT_HIT_SIZE',at+':'+text.id);
      for (const formula of packet.formulas) {
        formulaCount++;
        const key = packet.part + ':' + formula.id + ':' + formula.mode + ':' + layoutState, previous = frames.get(key);
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
          const groupKey = g.groupId + ':' + formula.mode + ':' + layoutState, old = groups.get(groupKey);
          const localColumn = g.relationX - g.bodyLeft;
          if (!old) groups.set(groupKey, { bodyWidth: g.bodyWidth, neutralLayoutKey: g.neutralLayoutKey, column: g.status === 'ALIGNED' ? localColumn : undefined, absoluteColumn: g.status === 'ALIGNED' ? g.relationX : undefined });
          else {
            if (old.neutralLayoutKey !== g.neutralLayoutKey || Math.abs(old.bodyWidth - g.bodyWidth) > 1) reject('NESTED_GROUP_STATE_CHANGED', at + ':' + groupKey);
            if (g.status === 'ALIGNED') {
              if (old.column !== undefined && Math.abs(old.column - localColumn) > 1) reject('NESTED_RELATION_COLUMN_CHANGED', at + ':' + groupKey);
              if (!finite(g.relationX) || old.absoluteColumn !== undefined && Math.abs(old.absoluteColumn - g.relationX) > 1) reject('NESTED_ABSOLUTE_RELATION_COLUMN_CHANGED', at + ':' + groupKey);
              old.column ??= localColumn;
              old.absoluteColumn ??= g.relationX;
            }
          }
        }
        const verified = checkNestedMeasurements(formula.geometry);
        if (verified.status !== 'PASS' || formula.geometry.status !== 'PASS') reject('NESTED_GEOMETRY', { at, part: packet.part, id: formula.id, findings: verified.findings });
      }
    }
    const auxiliary = expectedNestedReaderAuxiliary(compiled, snapshots.at(-1).visible);
    if (run.auxiliaryPackets?.some(packet => !['auto','history'].includes(packet.kind))) reject('NESTED_UNKNOWN_AUXILIARY_PACKET', at);
    const autoPackets = run.auxiliaryPackets?.filter(packet => packet.kind === 'auto') ?? [];
    if (autoPackets.length !== auxiliary.auto.length || new Set(autoPackets.map(packet => packet.stageId)).size !== auxiliary.auto.length || autoPackets.some(packet => !auxiliary.auto.some(stage => stage.stageId === packet.stageId))) reject('NESTED_AUTO_STAGE_COVERAGE', at);
    const checkAuxiliary = (packet, expected, kind) => {
      bindFormulas(packet.formulas, expected, at+':'+kind);
      if (packet.viewport !== run.width || !finite(packet.pageWidth) || packet.pageWidth > run.width + 1) reject('NESTED_AUXILIARY_VIEWPORT', at+':'+kind);
      for (const formula of packet.formulas ?? []) {
        formulaCount++;
        const verified = checkNestedMeasurements(formula.geometry);
        if (verified.status !== 'PASS' || formula.geometry.status !== 'PASS' || formula.font !== '18px' || formula.status !== 'MEASURED' || formula.overflow === 'true') reject('NESTED_AUXILIARY_GEOMETRY', { at, kind, id: formula.id, findings: verified.findings });
      }
    };
    for (const stage of auxiliary.auto) {
      const packets = autoPackets.filter(packet => packet.stageId === stage.stageId);
      if (packets.length === 1) checkAuxiliary(packets[0], stage.formulas, 'auto:'+stage.stageId);
    }
    const historyPackets = run.auxiliaryPackets?.filter(packet => packet.kind === 'history') ?? [];
    if (historyPackets.length !== 1) reject('NESTED_AUXILIARY_COVERAGE', at+':history');
    else {
      if (historyPackets[0].stageId !== auxiliary.currentStageId) reject('NESTED_HISTORY_STAGE_BINDING', at);
      checkAuxiliary(historyPackets[0], auxiliary.history, 'history');
    }
  }
  return { status: findings.length ? 'FAIL' : 'PASS', schemaVersion: 'nested-run-validation/1', findings, measurementCount: formulaCount, widths: runs.map(r => r.width), partCount: parts.length, layoutHash: compiled.layoutDesignHash, automaticAcceptance: false };
}
