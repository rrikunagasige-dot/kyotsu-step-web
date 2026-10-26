"""Versioned, answer-key-free construction/layout inputs. Never scrape KaTeX innerText."""
import json, math
from .core import digest

SCHEMA = 'construction-visible/1'
FEATURE_SCHEMA = 'learner-visible-json/3'
FORBIDDEN = {'expected','correctValue','isCorrect','feedback','quality','label','evaluation','mathReceipts','gradingHash','targetLatex','authorRationale','futureAnswer'}
FIELDS = {'problemId','prompt','conditions','initial','completed','current','type','text','latex','term','value','parts','rows','formula','left','right','relation','tokens','role','placement','state','choices','visible','masked','selected','groupLead','essentialNote','activePrompt','detail','interpretation','renderRef','math','prose','viewport','width','height','fontPx','bodyFontPx','katexScale','relationX','centerX','gapPx','numberPosition','clipped','hitOverlap','renderFacts','display','renderedMath'}
NUMERIC = {'width','height','fontPx','bodyFontPx','katexScale','relationX','centerX','gapPx'}

def visible_payload(value):
    def clean(v, key=None):
        if isinstance(v,dict):
            if FORBIDDEN.intersection(v): raise ValueError('answer key or evaluation leaked into construction context')
            unknown=set(v)-FIELDS
            if unknown: raise ValueError('unregistered visible fields: '+','.join(sorted(unknown)))
            return {k:clean(item,k) for k,item in v.items()}
        if isinstance(v,list): return [clean(item,key) for item in v]
        if key in {'hitOverlap', 'clipped'} and v is not None and type(v) is not bool:
            raise ValueError('layout collision flags must be boolean')
        if key in NUMERIC and v is not None:
            if isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v): raise ValueError('invalid geometry')
            if key in {'width','height','fontPx','bodyFontPx','katexScale'} and v<=0: raise ValueError('invalid visible measurement')
        if v is not None and not isinstance(v,(str,int,float,bool)): raise ValueError('invalid visible scalar')
        return v
    result=clean(value)
    if not isinstance(result,dict) or not all(k in result for k in ('problemId','prompt','conditions','initial','completed','current','renderFacts')):
        raise ValueError('whole visible construction state and measured facts required')
    # A unique canonical rendering entry avoids the duplicated HTML + MathML output.
    seen={};maths=[]
    for item in result.get('renderedMath',[]):
        if not isinstance(item,dict) or not item.get('renderRef') or not item.get('latex'): raise ValueError('typed rendered math reference required')
        ref=item['renderRef']
        if ref in seen and seen[ref]!=item: raise ValueError('conflicting rendered math reference')
        if ref not in seen: maths.append(item);seen[ref]=item
    if 'renderedMath' in result: result['renderedMath']=maths
    return result

def snapshot(visible):
    clean=visible_payload(visible)
    return {'kind':'learner_artifact','text':json.dumps(clean,ensure_ascii=False,separators=(',',':')),'contextSchema':SCHEMA,'contextHash':digest(clean)}

def text_from_snapshot(text):
    return json.dumps(visible_payload(json.loads(text)),ensure_ascii=False,separators=(',',':'))

# An explicit schema boundary prevents the old text model from silently treating
# missing axis/part-sequence measurements as zero-valued good examples.
AXIS_CONTEXT_SCHEMA = 'construction-visible/2'
AXIS_FEATURE_SCHEMA = 'construction-axis-features/1'

def axis_features(packet):
    """Extract observable structural facts; these are never user quality labels."""
    if not isinstance(packet, dict) or packet.get('schemaVersion') != AXIS_CONTEXT_SCHEMA:
        raise ValueError('construction-visible/2 is required')
    allowed = {'schemaVersion','sourceSHA','sourceHash','measurements','visibilityFacts','interactionFacts'}
    if set(packet) - allowed or not packet.get('sourceSHA'):
        raise ValueError('source-bound registered construction context is required')
    def inspect(v):
        if isinstance(v, dict):
            if FORBIDDEN.intersection(v): raise ValueError('evaluation or answer key in axis features')
            for item in v.values(): inspect(item)
        elif isinstance(v, list):
            for item in v: inspect(item)
    inspect(packet)
    measurements = packet.get('measurements')
    if not isinstance(measurements, list) or not measurements:
        raise ValueError('actual axis measurements required; missing is not zero')
    unknown = 0; baseline_deltas = []; anchor_moves = []; overlaps = 0
    for m in measurements:
        if m.get('schemaVersion') != 'axis-measurement/1' or m.get('baselineSource') != 'zero-inline-dom-marker':
            raise ValueError('actual baseline provenance required')
        rows = m.get('rows')
        if not isinstance(rows, list) or not rows:
            raise ValueError('actual measured rows required; empty is not zero')
        for row in rows:
            lines = row.get('physicalLines')
            if row.get('layout') == 'wrapped':
                if not isinstance(lines, list) or [line.get('cellRefs') for line in lines] != [['left'],['relation','right']]:
                    raise ValueError('wrapped measured physical line partition required')
            elif lines is not None and (len(lines) != 1 or lines[0].get('cellRefs') != ['left','relation','right']):
                raise ValueError('single measured physical line partition required')
            for line in lines or [row]:
                values = line.get('baselines', [])
                minimum = 1 if line.get('cellRefs') == ['left'] else 2
                if len(values) < minimum or any(isinstance(v, bool) or not isinstance(v, (int,float)) or not math.isfinite(v) for v in values):
                    unknown += 1
                else: baseline_deltas.append(max(values) - min(values))
            slots = row.get('slots', [])
            for i, a in enumerate(slots):
                for b in slots[i+1:]:
                    if all(isinstance(s.get(k),(int,float)) and math.isfinite(s[k]) for s in (a,b) for k in ('x','y','width','height')):
                        overlaps += int(min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']) > .5 and min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']) > .5)
                    else: unknown += 1
        for delta in m.get('anchorDeltas', []):
            value = delta.get('deltaPx')
            if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value): unknown += 1
            else: anchor_moves.append(abs(value))
    facts = packet.get('visibilityFacts', [])
    for fact in facts:
        if set(fact) != {'rendered','prerequisitesAvailable'} or any(type(v) is not bool for v in fact.values()): raise ValueError('typed dependency visibility fact required')
    interactions = packet.get('interactionFacts', [])
    for fact in interactions:
        if set(fact) != {'selectionShape','operationProvenanceRequired','operationProvenanceChecked'} or fact['selectionShape'] not in ('whole-expression','part','meaning') or any(type(fact[k]) is not bool for k in ('operationProvenanceRequired','operationProvenanceChecked')): raise ValueError('typed selection/provenance facts required')
    return {'contextSchema':AXIS_CONTEXT_SCHEMA,'featureSchema':AXIS_FEATURE_SCHEMA,'sourceSHA':packet['sourceSHA'],'contextHash':digest(packet),'features':{
        'wholeExpressionFraction':sum(f['selectionShape']=='whole-expression' for f in interactions)/len(interactions) if interactions else None,
        'renderedWithoutPrerequisite':sum(f['rendered'] and not f['prerequisitesAvailable'] for f in facts),
        'baselineUnverifiedRows':unknown,'maxBaselineDeltaPx':max(baseline_deltas) if baseline_deltas else None,
        'maxAnchorMovePx':max(anchor_moves) if anchor_moves else None,'hitOverlapCount':overlaps,
        'missingOperationProvenance':sum(f['operationProvenanceRequired'] and not f['operationProvenanceChecked'] for f in interactions)},
        'advisoryEligible':False,'modelDisposition':'OFFLINE_ONLY','qualityLabel':None}
