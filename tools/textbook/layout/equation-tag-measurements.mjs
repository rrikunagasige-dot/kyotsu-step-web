/** Independent checks against measured root-row baselines and actual ink boxes. */
export function checkEquationTag(formula, expectedLabel) {
  const tag=formula.equationTag,findings=[],reject=rule=>findings.push({rule});
  if(expectedLabel===undefined){if(tag)reject('UNEXPECTED_EQUATION_TAG');return{status:findings.length?'FAIL':'PASS',findings};}
  const finite=x=>typeof x==='number'&&Number.isFinite(x),box=r=>r&&['x','y','width','height'].every(k=>finite(r[k]))&&r.width>=0&&r.height>=0;
  if(!tag||tag.label!==expectedLabel||tag.font!=='18px'||!box(tag.rect)||!box(tag.ink)||!finite(tag.baseline)||!finite(tag.finalMathBaseline)||!['zero-inline-root-row','zero-inline-root-base'].includes(tag.baselineSource))return{status:'FAIL',findings:[{rule:'EQUATION_TAG_BINDING'}]};
  const available=formula.geometry?.available,frame=formula.geometry?.frame;
  if(!box(available)||!box(frame)||tag.rect.x<available.x-1||tag.rect.x+tag.rect.width>available.x+available.width+1)reject('EQUATION_TAG_FRAME');
  if(tag.placement==='final-math-baseline'){if(Math.abs(tag.baseline-tag.finalMathBaseline)>1)reject('EQUATION_TAG_BASELINE');}
  else if(tag.placement==='below-final-math-row'){if(!box(frame)||tag.rect.y-frame.y-frame.height<7.9)reject('EQUATION_TAG_BELOW_GAP');}
  else reject('EQUATION_TAG_PLACEMENT');
  const lines=formula.geometry?.lines??[],intersects=(a,b)=>Math.min(a.x+a.width,b.x+b.width)>Math.max(a.x,b.x)+.5&&Math.min(a.y+a.height,b.y+b.height)>Math.max(a.y,b.y)+.5;
  if(lines.some(l=>box(l.rect)&&intersects(l.rect,tag.ink)))reject('EQUATION_TAG_INK_OVERLAP');
  const band=lines.filter(l=>box(l.rect)&&l.rect.y+l.rect.height>tag.ink.y+.5&&l.rect.y<tag.ink.y+tag.ink.height-.5);
  if(tag.placement==='final-math-baseline'&&band.length&&tag.ink.x-Math.max(...band.map(l=>l.rect.x+l.rect.width))<7.5)reject('EQUATION_TAG_INK_GAP');
  return{status:findings.length?'FAIL':'PASS',findings};
}
