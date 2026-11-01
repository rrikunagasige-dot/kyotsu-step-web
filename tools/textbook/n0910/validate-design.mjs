import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const sha256 = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
const placeholder = /\{(?:(mirror):)?([A-Za-z][\w-]*)\}/g;
export function validateDesign(design, sourceByUnit) {
  const findings = [], inventory = [];
  const fail = (rule, node, detail) => findings.push({ rule, node, detail });
  if (design?.schemaVersion !== 'n0910-node-design/1' || !Array.isArray(design.units)) return { status: 'FAIL', findings: [{ rule: 'DESIGN_NOT_MATERIALIZED' }], inventory };
  for (const unit of design.units) {
    const source = sourceByUnit[unit.unitId];
    if (!source || !Array.isArray(unit.nodes)) { fail('SOURCE_REQUIRED', unit.unitId); continue; }
    const original = source.data ?? source;
    if (source.bytes && unit.sourceSha256 !== sha256(source.bytes)) fail('SOURCE_HASH', unit.unitId);
    const sourceIds = original.nodes.map(n => n.id), ids = unit.nodes.map(n => n.nodeId);
    if (JSON.stringify(sourceIds) !== JSON.stringify(ids)) fail('NODE_COVERAGE_ORDER', unit.unitId);
    const idSet = new Set(ids), seenNodes = new Set();
    for (const node of unit.nodes) {
      const id = node.nodeId, parts = node.parts ?? [], partKeys = parts.map(p => p.key);
      if (!['KEEP_EXPOSITION', 'NEW_CONSTRUCTION', 'AUTO_RECORDED_CONCLUSION'].includes(node.classification)) fail('CLASSIFICATION', id);
      if (!Array.isArray(node.leadParts) || !node.leadParts.length || node.leadParts.some(p => !['text', 'math'].includes(p.type) || !(p.text ?? p.latex))) fail('LEAD_REQUIRED', id);
      if (!Array.isArray(node.assumptions) || !node.assumptions.length || node.assumptions.some(x => /この例題の与条件を維持|元条件を保持/.test(x))) fail('CONCRETE_CONDITIONS', id);
      if (!Array.isArray(node.rows) || !node.rows.length) fail('ROWS_REQUIRED', id);
      if (new Set(partKeys).size !== parts.length || JSON.stringify(node.partOrder) !== JSON.stringify(partKeys)) fail('PART_ORDER', id);
      for (const ref of node.prerequisiteNodeIds ?? []) if (!idSet.has(ref) || !seenNodes.has(ref)) fail('PARENT_UNKNOWN_OR_FUTURE', id, ref);
      const resultSet = new Set(original.nodes.filter(n => seenNodes.has(n.id)).map(n => n.resultId));
      for (const ref of node.requiredResultRefs ?? []) if (!resultSet.has(ref)) fail('RESULT_UNKNOWN_OR_FUTURE', id, ref);
      const knownParts = new Set(), boundParts = new Set(), rows = new Set();
      for (const row of node.rows ?? []) {
        if (!row.id || rows.has(row.id) || typeof row.template !== 'string') { fail('ROW_SHAPE', id); continue; }
        rows.add(row.id);
        if (!Array.isArray(row.requiresCorrectKeys) || !Array.isArray(row.partKeys)) { fail('ROW_GATE_REQUIRED', id, row.id); continue; }
        for (const key of row.requiresCorrectKeys) if (!knownParts.has(key)) fail('ROW_FUTURE_DEPENDENCY', id, key);
        // Braced TeX arguments such as \\mathrm{or} and \\begin{cases} are
        // not anonymous slots. Missing/misspelt real keys remain UNBOUND_PART.
        // The closed math compiler separately validates all TeX grammar.
        const tokens = [...row.template.matchAll(placeholder)].filter(([, mirror, key]) => mirror || partKeys.includes(key));
        for (const [, mirror, key] of tokens) {
          if (!partKeys.includes(key)) fail('UNKNOWN_SLOT', id, key);
          if (mirror && !row.requiresCorrectKeys.includes(key)) fail('UNCERTIFIED_MIRROR', id, key);
          if (!mirror) {
            boundParts.add(key);
            if (!row.partKeys.includes(key)) fail('UNDECLARED_ROW_SLOT', id, key);
          }
        }
        for (const key of row.partKeys) {
          if (!partKeys.includes(key)) fail('UNKNOWN_ROW_PART', id, key);
          knownParts.add(key);
        }
      }
      for (const p of parts) {
        if (!boundParts.has(p.key)) fail('UNBOUND_PART', id, p.key);
        if (p.id !== id + '::' + p.key || !p.prompt || !p.role || !Array.isArray(p.choices) || p.choices.length < 2) fail('PART_SHAPE', id, p.key);
        const values = p.choices?.map(c => c.value) ?? [];
        if (new Set(values).size !== values.length || !values.includes(p.expected)) fail('CHOICE_VALUES', id, p.key);
        for (const c of p.choices ?? []) if (!c.feedback || !c.misconception || !['math', 'text'].includes(c.kind ?? p.kind)) fail('CHOICE_TEACHING_REQUIRED', id, p.key);
        if (!p.mathAssertion) fail('ASSERTION_OR_UNSUPPORTED_DISPOSITION_REQUIRED', id, p.key);
      }
      const terminal = node.terminalRecord;
      if (!terminal || !Array.isArray(terminal.formulas) || !terminal.formulas.length || !Array.isArray(terminal.conditions) || !terminal.conditions.length || !terminal.prose?.length) fail('TERMINAL_REQUIRED', id);
      const semantic = original.semantic.nodes.find(n => n.id === id);
      const blocks = [...(semantic?.before ?? []), ...(semantic?.after ?? [])].map(b => b.id);
      const coverage = node.sourceCoverage ?? [];
      if (new Set(coverage.map(c => c.sourceBlockId)).size !== blocks.length || blocks.some(id => !coverage.some(c => c.sourceBlockId === id))) fail('SOURCE_BLOCK_COVERAGE', id);
      const targetRefs = new Set([
        ...(node.leadParts?.length ? [node.leadId ?? id + '::lead'] : []),
        ...rows,
        ...(terminal ? [id + '::terminal'] : []),
        ...parts.map(p => p.id),
      ]);
      for (const c of coverage) {
        if (!['KEEP', 'REPLACE'].includes(c.disposition) || !c.reason || !c.targetRefs?.length) fail('SOURCE_BLOCK_DISPOSITION', id, c.sourceBlockId);
        for (const ref of c.targetRefs ?? []) if (!targetRefs.has(ref)) fail('SOURCE_TARGET_NOT_FOUND', id, { sourceBlockId: c.sourceBlockId, ref });
      }
      inventory.push({ nodeId: id, classification: node.classification, partCount: parts.length, sourceBlocks: blocks.length, reviewRequired: true });
      seenNodes.add(id);
    }
  }
  return { status: findings.length ? 'FAIL' : 'PASS', findings, inventory, nodeCount: inventory.length, partCount: inventory.reduce((n, r) => n + r.partCount, 0), semanticReviewStatus: 'NOT_AUTOMATICALLY_PROVEN', appVerificationStatus: 'NOT_RUN' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const design = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const base = path.resolve(process.argv[3] ?? '.');
  const sources = Object.fromEntries((design.units ?? []).map(u => {
    const bytes = fs.readFileSync(path.join(base, u.sourcePath));
    return [u.unitId, { bytes, data: JSON.parse(bytes.toString()) }];
  }));
  const result = validateDesign(design, sources);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exitCode = result.status === 'PASS' ? 0 : 1;
}
