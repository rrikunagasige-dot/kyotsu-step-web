"""Static selector/cascade check. Not browser geometry or computed-style proof."""
from pathlib import Path
import json,re,hashlib,xml.etree.ElementTree as ET
import cssselect2,tinycss2
B=Path(__file__).resolve().parent;R=B.parents[2]
page=(B/'r3/proposed/src/pages/TextbookUnitPage.tsx').read_text();css=page.split('const w048ScopedStyle = `')[1].split('`')[0]
base=(R/'src/styles/global.css').read_text();rules=[]
def gather(tokens,width,origin):
 for rule in tokens:
  if rule.type=='at-rule'and rule.content is not None:
   cond=tinycss2.serialize(rule.prelude);maxes=re.findall(r'max-width\s*:\s*(\d+)px',cond);mins=re.findall(r'min-width\s*:\s*(\d+)px',cond)
   if all(width<=int(n)for n in maxes)and all(width>=int(n)for n in mins):gather(tinycss2.parse_rule_list(rule.content,skip_whitespace=True,skip_comments=True),width,origin)
  if rule.type!='qualified-rule':continue
  selector=tinycss2.serialize(rule.prelude).strip()
  if 'reading-formula-expression'not in selector:continue
  decls=[d for d in tinycss2.parse_declaration_list(rule.content,skip_whitespace=True,skip_comments=True)if d.type=='declaration'and d.name in ['display','justify-content','justify-items']]
  if not decls:continue
  for sel in cssselect2.compile_selector_list(selector):
   if sel.test(element):
    for d in decls:rules.append({'selector':selector,'specificity':sel.specificity,'name':d.name,'value':tinycss2.serialize(d.value).strip(),'important':d.important,'origin':origin,'order':len(rules)})
rows=[]
for width in [320,390,430,1440]:
 for chain,formula in [('n13-q04-chain','n13-w048-q04-positive'),('n13-q05-chain','n13-wm023-q05-right'),('n13-q05-chain','n13-formula-05'),('n14-q10-chain','n14-formula-10'),('n14-q14-chain','n14-formula-14'),('n14-q15-chain','n14-formula-15'),('n14-q16-chain','n14-formula-16'),('n14-q16-chain','n14-wm022-q16-right')]:
  root=ET.fromstring(f'<article class="w048-reading-flow"><div class="reading-derivation-chain" data-derivation-id="{chain}"><div data-testid="textbook-formula-{formula}"><span class="reading-formula-expression"/></div></div></article>');element=list(cssselect2.ElementWrapper.from_html_root(root).iter_subtree())[-1];rules=[]
  gather(tinycss2.parse_stylesheet(base,skip_whitespace=True,skip_comments=True),width,'existing-global');gather(tinycss2.parse_stylesheet(css,skip_whitespace=True,skip_comments=True),width,'proposed-scoped')
  winners={name:max([r for r in rules if r['name']==name],key=lambda r:(r['important'],r['specificity'],r['order']))for name in ['justify-content','justify-items']}
  assert winners['justify-content']['value']=='flex-start'and winners['justify-items']['value']=='start',winners
  rows.append({'width':width,'chain':chain,'formula':formula,'winners':winners})
result={'status':'PASS_STATIC_SELECTOR_CASCADE','engine':'cssselect2 0.8.0 + tinycss2 1.5.1','scenarios':rows,'pageSHA256':hashlib.sha256(page.encode()).hexdigest(),'actualDOM':False,'limits':['Selector matching and cascade priority on modeled consumer ancestry; actual geometry, layout, wrapping and browser computed style remain R07.']}
(B/'r3/CSS_CASCADE_CHECK.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':result['status'],'scenarios':len(rows)}))
