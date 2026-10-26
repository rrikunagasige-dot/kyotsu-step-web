/** r7 opt-in measurement contract. Inputs must come from actual DOM markers;
 * this checker deliberately refuses the old glyph-box-centre surrogate. */
export function checkAxisMeasurements(packet) {
  const failures = []
  const reject = (code, detail) => failures.push({ code, detail })
  if (packet?.schemaVersion !== 'axis-measurement/1') return { status: 'UNVERIFIED', failures: [{ code: 'AXIS_SCHEMA', detail: 'axis-measurement/1 required' }] }
  const finite = value => typeof value === 'number' && Number.isFinite(value)
  if (packet.baselineSource !== 'zero-inline-dom-marker' || packet.axisSource !== 'same-font-fraction-rule') reject('AXIS_PROVENANCE', 'real inline markers and same-font fraction rule required')
  if (packet.axisStatus !== 'VERIFIED' || !finite(packet.axisPx) || packet.axisPx <= 0) reject('AXIS_UNVERIFIED', 'missing actual same-font probe measurement')
  if (packet.mathFontPx !== 18 || packet.katexScale !== 1) reject('AXIS_FONT', '18px / 1em required')
  if (!Array.isArray(packet.rows) || !packet.rows.length) reject('AXIS_ROWS_MISSING', 'no measured mathematical rows')
  for (const row of packet.rows ?? []) {
    if (!Array.isArray(row.inkRects) || !row.inkRects.length) reject('INK_RECT_UNVERIFIED', row.id)
    if (!Array.isArray(row.baselines) || row.baselines.length < 2 || !row.baselines.every(finite)) { reject('BASELINE_UNVERIFIED', row.id); continue }
    if (!Array.isArray(row.katexStrutBaselines) || !row.katexStrutBaselines.length || !row.katexStrutBaselines.every(finite)) reject('INK_BASELINE_UNVERIFIED', row.id)
    let lines = [{ cellRefs:['left','relation','right'], baselines:row.baselines, katexStrutBaselines:row.katexStrutBaselines }]
    if (row.layout === 'wrapped' || row.physicalLines) {
      const expected = row.layout === 'wrapped' ? [['left'],['relation','right']] : [['left','relation','right']]
      const supplied = row.physicalLines
      if (!Array.isArray(supplied) || JSON.stringify(supplied.map(line=>line.cellRefs)) !== JSON.stringify(expected) || supplied.some(line=>!Array.isArray(line.baselines)||line.baselines.length!==line.cellRefs.length||!line.baselines.every(finite)||!Array.isArray(line.katexStrutBaselines)||!line.katexStrutBaselines.every(finite))) {
        reject('PHYSICAL_LINE_PARTITION',row.id)
        continue
      }
      const equalMultiset = (a,b) => {const sortedA=[...a].sort((x,y)=>x-y),sortedB=[...b].sort((x,y)=>x-y);return sortedA.length===sortedB.length&&sortedA.every((v,i)=>Math.abs(v-sortedB[i])<.001)}
      if(!equalMultiset(supplied.flatMap(line=>line.baselines),row.baselines)||!equalMultiset(supplied.flatMap(line=>line.katexStrutBaselines),row.katexStrutBaselines??[]))reject('PHYSICAL_LINE_COVERAGE',row.id)
      if(row.layout==='wrapped' && Math.max(...supplied[0].baselines)+1>=Math.min(...supplied[1].baselines))reject('PHYSICAL_LINE_ORDER',row.id)
      lines = supplied
    }
    for(const line of lines){
      if (Math.max(...line.baselines) - Math.min(...line.baselines) > 1) reject('BASELINE_MISMATCH', {rowId:row.id,cellRefs:line.cellRefs})
      if (!Array.isArray(line.katexStrutBaselines) || !line.katexStrutBaselines.length) reject('INK_BASELINE_UNVERIFIED',{rowId:row.id,cellRefs:line.cellRefs})
      else if (line.katexStrutBaselines.some(y => Math.abs(y - line.baselines[0]) > 1)) reject('INK_BASELINE_MISMATCH',{rowId:row.id,cellRefs:line.cellRefs})
    }
    for (const slot of row.slots ?? []) {
      if (![slot.axisDeltaPx, slot.width, slot.height, slot.x, slot.y].every(finite)) reject('SLOT_UNVERIFIED', slot.partId)
      else { if (Math.abs(slot.axisDeltaPx) > 1) reject('SLOT_AXIS_MISMATCH', slot.partId); if (slot.width < 44 || slot.height < 44) reject('HIT_TOO_SMALL', slot.partId) }
      if (!finite(slot.focusRingCount)) reject('FOCUS_UNVERIFIED', slot.partId)
      else if (slot.focusRingCount > 1) reject('DUPLICATE_FOCUS', slot.partId)
    }
    const slots = row.slots ?? []
    for (const slot of slots) for (const ink of row.inkRects ?? []) {
      if (ink.ownerPartId === slot.partId) continue
      if (![ink.x,ink.y,ink.width,ink.height].every(finite)) { reject('INK_RECT_UNVERIFIED', row.id); continue }
      if (Math.min(slot.x + slot.width, ink.x + ink.width) - Math.max(slot.x, ink.x) > .5 && Math.min(slot.y + slot.height, ink.y + ink.height) - Math.max(slot.y, ink.y) > .5) reject('HIT_INK_OVERLAP', { partId:slot.partId, rowId:row.id, ink })
    }
    for (let i = 0; i < slots.length; i++) for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i], b = slots[j]
      if (Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > .5 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > .5) reject('HIT_OVERLAP', [a.partId, b.partId])
    }
  }
  if (!packet.frame || packet.frame.source !== 'measured-mathematical-envelope' || ![packet.frame.centerX, packet.frame.bodyCenterX].every(finite)) reject('FRAME_UNVERIFIED', '100%-width outer wrapper is not a mathematical frame')
  else if (Math.abs(packet.frame.centerX - packet.frame.bodyCenterX) > 2) reject('FRAME_OFF_CENTER', packet.frame)
  if (!packet.visibleGlyphUnion || !['left','right','top','bottom'].every(key=>finite(packet.visibleGlyphUnion[key])) || packet.visibleGlyphUnion.right <= packet.visibleGlyphUnion.left) reject('GLYPH_UNION_UNVERIFIED', 'record the visible ink union separately')
  for (const delta of packet.anchorDeltas ?? []) if (!finite(delta.deltaPx) || Math.abs(delta.deltaPx) > 1) reject('ANCHOR_MOVED', delta)
  if (packet.number && (!finite(packet.number.baselineDeltaPx) || !finite(packet.number.clearancePx) || (packet.number.placement !== 'below' && Math.abs(packet.number.baselineDeltaPx) > 1) || packet.number.clearancePx < 8 || packet.number.rowRef !== packet.rows?.at(-1)?.id)) reject('NUMBER_ANCHOR', packet.number)
  return { status: failures.length ? 'FAIL' : 'PASS', failures }
}
