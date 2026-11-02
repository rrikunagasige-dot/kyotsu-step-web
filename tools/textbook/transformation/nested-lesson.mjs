import { createHash } from 'node:crypto';
import { hash } from '../util.mjs';
import { compileNestedMathTemplate, renderClosedMath } from '../interaction/math-template.mjs';
import { validateDesign } from '../n0910/validate-design.mjs';
import { AXIS_CONTRACT, validateLayoutPlanV2 } from '../layout/plan-v2.mjs';

export const REVIEWED_NESTED_DESIGN = '31efdd9d3dac6e0a23d178096ffa852f1e8a342824e56cd53902c07c1a4a8452';
const PRIOR_REVIEWED_NESTED_DESIGN = 'd144b8821a19718b569b808fdcb575b688be431dae79609423645d54da7b6edd';
export const NESTED_SOURCE_PINS = {
  'math-numbers-expressions-n09': '86733957a6b748b9e2d2609a0b95e1a3c765a8d82397dfbf27837d834539ad95',
  'math-numbers-expressions-n10': '819cc0b981419e19381f7c8ab14b1501760a830be0d433ce8f1fe6cb3c619e62',
};
const sha = text => createHash('sha256').update(text).digest('hex');
const fields = ['nodeId', 'resultId', 'stageId', 'q', 'classification', 'leadParts', 'assumptions', 'assumptionParts', 'assumptionsDisplay', 'prerequisiteNodeIds', 'requiredResultRefs', 'rows', 'parts', 'partOrder', 'terminalRecord'];
function nestedLayout(unitId, nodes) {
  const groups = nodes.map(n => {
    const rows = n.rows.map(r => ({ id: r.id, nodeId: n.nodeId, kind: r.kind === 'math' ? 'math' : 'prose', interactionRef: n.parts.length ? n.nodeId : null, requiresCorrectParts: r.requiresCorrectKeys.map(k => n.parts.find(p => p.key === k).id), partIds: r.partKeys.map(k => n.parts.find(p => p.key === k).id), visibleAfter: n.prerequisiteNodeIds }));
    return { id: n.nodeId + '-layout', sourceNodeIds: [n.nodeId], rows, rowIds: rows.map(r => r.id), mathRowIds: rows.filter(r => r.kind === 'math').map(r => r.id), partIds: n.parts.map(p => p.id), number: n.equationNumber ?? null, numberRowRef: rows.filter(r => r.kind === 'math').at(-1)?.id ?? null, numberBaselineRef: 'current-visible-last-math-row', axisContract: 'axis-contract/1', framePolicy: 'fixed-group-envelope', envelopeSource: 'all-candidates-neutral-syntax', responsiveBreak: 'fixed-envelope-only', prose: [{ id: n.nodeId + '-lead', nodeId: n.nodeId, content: n.leadParts, requiresCorrectParts: [], visibleAfter: n.prerequisiteNodeIds }] };
  });
  return { schemaVersion: 'layout-plan/2', unitId, nestedGeometryContract: 'nested-geometry/1', axisContract: structuredClone(AXIS_CONTRACT), tokens: { mathFontPx: 18, katexScale: 1, minHitPx: 44, rowGapPx: 4, noteGapPx: 6, paragraphGapPx: 8 }, nodeCoverage: groups.map(g => ({ nodeId: g.sourceNodeIds[0], groupId: g.id })), groups, partIds: nodes.flatMap(n => n.parts.map(p => p.id)), legacyInteractionIds: [], sourceNodeCount: nodes.length };
}
export function materializedNestedNodes(unit, source, assets = {}) {
  const nodes = unit.nodes.map(node => {
    const original = source.nodes.find(n => n.id === node.nodeId), item = source.unit.sections.flatMap(s => s.items).find(i => i.id === original?.interaction);
    const numbers = [...new Set(node.sourceCoverage.flatMap(c => source.equationNumbers[c.sourceBlockId] === undefined ? [] : [String(source.equationNumbers[c.sourceBlockId])]))];
    return { ...Object.fromEntries(fields.filter(k => node[k] !== undefined).map(k => [k, node[k]])), ...(item?.scaffoldLevel ? { scaffoldLevel: item.scaffoldLevel } : {}), ...(numbers.length ? { equationNumber: numbers.at(-1), numberAliases: numbers.slice(0, -1) } : {}) };
  });
  for (const node of unit.nodes.filter(n => n.sourceExtra && Object.keys(n.sourceExtra).length)) {
    const target = nodes.find(n => n.nodeId === node.sourceExtraDisposition?.targetNodeId);
    if (!target || !node.sourceExtraDisposition.visibleAfterResultRefs.includes(target.resultId)) throw Error('NESTED_EXTRA_GATE');
    const extra = node.sourceExtra, display = [];
    if (extra.calculationSupport) display.push(...extra.calculationSupport.split(';\\quad').map(latex => ({ kind: 'math', latex })));
    if (extra.table) display.push({ kind: 'table', caption: extra.table.caption, headers: extra.table.headers, rows: extra.table.rows });
    if (extra.figure) {
      const figure = source.unit.sections.flatMap(s => s.figures).find(f => f.id === extra.figure.id);
      if (!figure || !assets[figure.src] || !/^[a-f0-9]{64}$/.test(assets[figure.src])) throw Error('NESTED_FIGURE_ASSET_BINDING');
      display.push({ kind: 'figure', id: figure.id, src: figure.src, alt: figure.alt, caption: figure.caption, sha256: assets[figure.src] });
    }
    target.displayExtras = [...target.displayExtras ?? [], ...display];
    for (const item of display) {
      if (item.kind === 'math') renderClosedMath(item.latex);
      if (item.kind === 'table') for (const row of item.rows) for (const cell of row) renderClosedMath(cell);
    }
  }
  return nodes;
}
export function buildNestedTransformationPlan(sourceRaw, designRaw, unitId, assets = {}) {
  if (![REVIEWED_NESTED_DESIGN, PRIOR_REVIEWED_NESTED_DESIGN].includes(sha(designRaw)) || sha(sourceRaw) !== NESTED_SOURCE_PINS[unitId]) throw Error('NESTED_REVIEWED_INPUT_CHANGED');
  const design = JSON.parse(designRaw);
  // A pilot in N10 must not change N09's compiled bytes or its progress key.
  if (unitId === 'math-numbers-expressions-n09' && design.ux03Pilot) return buildNestedTransformationPlan(sourceRaw, design.priorReviewedDesignRaw, unitId, assets);
  const source = JSON.parse(sourceRaw), unit = design.units.find(u => u.unitId === unitId);
  if (!unit || source.unit.unitId !== unitId) throw Error('NESTED_UNIT');
  const nodes = materializedNestedNodes(unit, source, assets);
  return { schemaVersion: 'transformation-plan/3', nestedPipeline: 'n0910/1', unitId, sourceIRHash: hash(source), sourceRaw, designRaw, assets,
    nodeDesign: nodes, stages: unit.stages, fromRevision: unit.fromRevision, toRevision: unit.toRevision,
    layoutPlan: nestedLayout(unitId, nodes),
    nestedDisplay: { schemaVersion: 'nested-display/1', breakPolicy: 'root-relation-or-operation', unitId, rowTemplates: nodes.map(n => ({ nodeId: n.nodeId, rows: n.rows.map(({ id, template, kind }) => ({ id, template, kind })) })) },
    constructionPlan: { schemaVersion: 'nested-construction-plan/1', nodes: nodes.map(({ nodeId, rows, parts, partOrder }) => ({ nodeId, rows, parts, partOrder })) } };
}
export function validateNestedTransformationPlan(ir, plan) {
  const findings = [];
  try {
    const expected = buildNestedTransformationPlan(plan.sourceRaw, plan.designRaw, plan.unitId, plan.assets);
    if (plan.sourceIRHash !== hash(ir) || hash(ir) !== hash(JSON.parse(plan.sourceRaw))) throw Error('NESTED_SOURCE_IR');
    for (const field of ['schemaVersion', 'nestedPipeline', 'unitId', 'sourceIRHash', 'nodeDesign', 'stages', 'fromRevision', 'toRevision', 'constructionPlan', 'layoutPlan', 'nestedDisplay']) if (hash(expected[field]) !== hash(plan[field])) throw Error('NESTED_PLAN_FIELD_CHANGED:' + field);
    const design = JSON.parse(plan.designRaw), unit = design.units.find(u => u.unitId === plan.unitId);
    const check = validateDesign({ ...design, units: [unit] }, { [unit.unitId]: { bytes: Buffer.from(plan.sourceRaw), data: ir } });
    if (check.status !== 'PASS') return check;
    const layout = validateLayoutPlanV2(plan.layoutPlan, { nodeIds: plan.nodeDesign.map(n => n.nodeId), interactionIds: plan.nodeDesign.filter(n => n.parts.length).map(n => n.nodeId), partIds: plan.nodeDesign.flatMap(n => n.parts.map(p => p.id)), rowIds: plan.nodeDesign.flatMap(n => n.rows.map(r => r.id)) });
    if (layout.status !== 'PASS') return layout;
    for (const node of plan.nodeDesign) for (const row of node.rows.filter(r => r.kind === 'math')) {
      const parts = node.parts.filter(p => row.partKeys.includes(p.key) || row.template.includes('{mirror:' + p.key + '}'));
      compileNestedMathTemplate({ template: row.template, parts, values: Object.fromEntries(node.parts.map(p => [p.key, p.expected])), certifiedKeys: node.partOrder });
    }
  } catch (error) { findings.push({ ruleId: 'NESTED_SOURCE_BOUND_COMPILE', detail: error.message }); }
  return { status: findings.length ? 'FAIL' : 'PASS', findings, meaningAuditRequired: true, mathProofStatus: 'SEPARATE_SOURCE_BOUND_REVIEW_REQUIRED', automaticAcceptance: false };
}
export function compileNestedTransformationV3(ir, plan) {
  const check = validateNestedTransformationPlan(ir, plan);
  if (check.status !== 'PASS') return check;
  const compiled = { schemaVersion: 'transformation-reading/3', nestedPipeline: 'n0910/1', unitId: plan.unitId,
    fromRevision: plan.fromRevision, toRevision: plan.toRevision, title: ir.unit.title,
    irHash: plan.sourceIRHash, sourceIRHash: plan.sourceIRHash, planHash: hash(plan),
    stages: plan.stages, nodeDesign: plan.nodeDesign, constructionPlan: plan.constructionPlan,
    layoutPlan: plan.layoutPlan, nestedDisplay: plan.nestedDisplay,
    sourceBinding: { repository: 'rrikunagasige-dot/kyotsu-step-web', sourceBase: '18839ba97ec73c99f41c8715c3a888524b743358', sourceSha256: sha(plan.sourceRaw), designSha256: sha(plan.designRaw) },
    learnerCopyHash: hash({ stages: plan.stages, nodes: plan.nodeDesign }), constructionDesignHash: hash(plan.constructionPlan), layoutDesignHash: hash(plan.layoutPlan), automaticAcceptance: false };
  return { ...check, compiled: { ...compiled, compiledHash: hash(compiled) } };
}
