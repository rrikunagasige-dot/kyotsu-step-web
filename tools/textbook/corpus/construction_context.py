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
