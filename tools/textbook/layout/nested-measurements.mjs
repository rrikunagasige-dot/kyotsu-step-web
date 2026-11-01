/** Nested contracts do not reinterpret the legacy flat left/relation/right axis. */
export function checkNestedMeasurements(packet) {
  const findings = [], reject = (rule, detail) => findings.push({ rule, detail });
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const box = r => r && ['x','y','width','height'].every(k => finite(r[k])) && r.width >= 0 && r.height >= 0;
  if (packet?.schemaVersion !== 'nested-geometry/1' || packet.source !== 'shared-compiler-dom-revalidated') return { status:'UNVERIFIED', findings:[{rule:'NESTED_MEASUREMENT_PROVENANCE'}] };
  if (packet.axisSource !== 'same-font-fraction-rule' || packet.baselineSource !== 'zero-inline-dom-marker' || !finite(packet.axisPx) || packet.axisPx <= 0) reject('NESTED_AXIS_UNVERIFIED');
  const group = packet.groupAlignment;
  if (!box(packet.frame) || !box(packet.available) || packet.frame.width > packet.available.width + 1) reject('NESTED_FRAME');
  else if (group) {
    if (!group.groupId || !group.neutralLayoutKey || !['ALIGNED','NO_ROOT_RELATION'].includes(group.status) || !['bodyLeft','bodyWidth','availableWidth','relationX','rowRelationOffset','rowLeftExtent','rowRightExtent'].every(k => finite(group[k])) || group.bodyWidth <= 0 || group.bodyWidth > packet.available.width + 1 || Math.abs(group.availableWidth - packet.available.width) > .25 || Math.abs(group.bodyLeft + group.bodyWidth/2 - packet.available.x - packet.available.width/2) > 1 || packet.frame.x < group.bodyLeft - 1 || packet.frame.x + packet.frame.width > group.bodyLeft + group.bodyWidth + 1) reject('NESTED_GROUP_FRAME');
    if (Math.abs(group.rowRelationOffset - group.relationX + packet.frame.x) > .25 || Math.abs(group.rowLeftExtent - group.rowRelationOffset) > .25 || Math.abs(group.rowRightExtent - packet.frame.width + group.rowRelationOffset) > .25) reject('NESTED_GROUP_EXTENTS');
    const proof = packet.rootRelationProof;
    if (group.status === 'ALIGNED') {
      if (proof?.source !== 'shared-compiler-marker-dom-revalidated' || !/^root\/\d+$/.test(proof.semanticPath ?? '') || !proof.marker || !box(proof.rect) || Math.abs(proof.rect.x + proof.rect.width/2 - group.relationX) > .25) reject('NESTED_ROOT_RELATION_PROOF');
    } else if (proof?.source !== 'shared-compiler-ast' || proof.status !== 'NO_ROOT_RELATION' || Math.abs(packet.frame.x + packet.frame.width/2 - group.bodyLeft - group.bodyWidth/2) > 1) reject('NESTED_NO_RELATION_CENTER');
  } else if (Math.abs(packet.frame.x + packet.frame.width/2 - packet.available.x - packet.available.width/2) > 2) reject('NESTED_FRAME');
  const slots = new Map();
  if (!Array.isArray(packet.slots) || !Array.isArray(packet.lines)) return {status:'FAIL',findings:[...findings,{rule:'NESTED_MEASUREMENT_SHAPE'}]};
  for (const slot of packet.slots) {
    if (!slot.id || !slot.path || slots.has(slot.id) || !box(slot.rect) || !box(slot.rule) || slot.rect.width < 44 || slot.rect.height < 44 || !finite(slot.axisDeltaPx) || Math.abs(slot.axisDeltaPx)>1 || !finite(slot.baseline) || !finite(slot.localFontPx) || slot.localFontPx <= 0 || Math.abs(slot.rect.y + slot.rect.height/2 - slot.baseline + packet.axisPx * slot.localFontPx/18 - slot.axisDeltaPx) > .25) reject('NESTED_SLOT',slot.id);
    slots.set(slot.id,slot);
  }
  for (let i=0;i<packet.slots.length;i++) for(let j=i+1;j<packet.slots.length;j++) {
    const a=packet.slots[i].rect,b=packet.slots[j].rect;
    if(box(a)&&box(b)&&Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>.5&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>.5)reject('NESTED_HIT_OVERLAP',[packet.slots[i].id,packet.slots[j].id]);
  }
  for (const line of packet.lines) {
    if(!box(line.rect)||!Array.isArray(line.inkOverlaps)) {reject('NESTED_INK_UNVERIFIED');continue;}
    const owner=slots.get(line.ownerPartId);
    if(line.ownerPartId!==null&&(!owner||owner.value===undefined||line.ownerSemanticPath!==owner.path||line.ownerProof!=='compiler-candidate-marker'))reject('NESTED_OWNER_UNVERIFIED',line.ownerPartId);
    if(line.ownerPartId===null&&line.ownerProof!=='template-structure')reject('NESTED_TEMPLATE_OWNER');
    if(line.kind==='structural-svg'&&line.rasterized!==true)reject('NESTED_SVG_INK_NOT_RASTERIZED');
    for(const id of line.inkOverlaps)if(!slots.has(id)||id!==line.ownerPartId)reject('NESTED_HIT_FOREIGN_INK',{id,kind:line.kind});
  }
  return {status:findings.length?'FAIL':'PASS',findings};
}
