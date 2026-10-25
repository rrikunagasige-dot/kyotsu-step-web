"""Generate explicit proposed display mapping; canonical choices remain untouched."""
import json,re,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2]
mixed={
'含まれない（等号となり<を満たさない）':[{'kind':'text','text':'含まれない（等号となり'},{'kind':'math','latex':'<'},{'kind':'text','text':'を満たさない）'}],
'含む（代入すると5≤5）':[{'kind':'text','text':'含む（代入すると'},{'kind':'math','latex':r'5\le5'},{'kind':'text','text':'）'}],
'含まない（代入すると5<5）':[{'kind':'text','text':'含まない（代入すると'},{'kind':'math','latex':'5<5'},{'kind':'text','text':'）'}],
'含まれる（3は正だから）':[{'kind':'text','text':'含まれる（'},{'kind':'math','latex':'3'},{'kind':'text','text':'は正だから）'}],
'箱と20個の菓子の合計金額':[{'kind':'text','text':'箱と'},{'kind':'math','latex':'20'},{'kind':'text','text':'個の菓子の合計金額'}],
'プリン1個の代金':[{'kind':'text','text':'プリン'},{'kind':'math','latex':'1'},{'kind':'text','text':'個の代金'}],
}
units={};figures=[]
for u in ['NE02','N11','N12']:
 ds=json.loads((B/(u+'_NODE_DESIGN.json')).read_text())['nodes'];entries=[]
 for n in ds:
  if n['answer'] is None:continue
  choices=[]
  for key in [n['answer'],*[x[0] for x in n['wrong']]]:
   if key in mixed:groups=[dict(semantic='mixed-prose',parts=mixed[key])]
   elif re.search('[一-龥ぁ-んァ-ン]',key) and r'\text' not in key:groups=[dict(semantic='prose',parts=[dict(kind='text',text=key)])]
   else:
    # Canonical keys are immutable. Split only top-level authored independent-list delimiters in this design file.
    chunks=re.split(r',\\quad\s*|;\\\s*|;\s*|\\quad(?=\\sqrt|[a-zA-Z(\d])',key)
    groups=[dict(semantic='independent-statement',parts=[dict(kind='math',latex=t.strip())]) for t in chunks if t.strip()]
   choices.append(dict(canonicalKey=key,rows=groups))
  entries.append(dict(itemId=n['itemId'],template=n['formula'],choices=choices,optionLayout='one option per full-width button; independent statements stack within option; no horizontal option packing',completed=n.get('resolvedFormula') or n['answer'],recordResult=n['resultId'],surfaces=['active-before','active-resolved','previous-result','collapsed-history','expanded-history']))
 units[u.lower()]=entries
 cur=json.loads((B/f'evidence/{u}_CURRENT.json').read_text())['unit']
 for f in cur['sections'][0].get('figures',[]):
  p='public'+f['src'];gate={'n11-f01':'before n11-01, for reading positions','n11-f02':'after n11-10 resolved','n12-f01':'after n12-02 resolved','n12-f02':'after n12-06 resolved','n12-f03':'after n12-15 resolved'}[f['id']]
  figures.append(dict(id=f['id'],sourcePath=p,sha256=hashlib.sha256((R/p).read_bytes()).hexdigest(),gate=gate,alt=f.get('alt'),caption=f.get('caption'),allSurfacesShareGate=True))
out=dict(status='PROPOSED',unitChoices=units,figures=figures,formulaLayout=dict(short='one intact equality per row; center whole group',transform='aligned relation columns for an actual equality chain only',independent='separate rows, no equal sign inserted between different substitutions or cases',inequalities='keep each original inequality as a condition; connect transformations by implication/equivalence only',numbering='one number per result group, stable ID; collide -> existing label-only trailing row',slot='compose template and blank as one mathematical subtree; fraction/radical fragments cannot be rendered independently'),pagination=dict(active='one small thought step; not full unit at once',previous='only condition-bearing results in contextNeed',history='collapse established work, expand on demand; never show future answer',resize='measure actual controls/answers after font settle and on resize; no future answer measurements'),migration=dict(ne02='revision1 -> proposed2',n11='revision10 -> proposed11',n12='revision3 -> proposed4',existingKeys='all78 correct answers and300 canonical choice keys unchanged; keep attempts/first-attempt/archives',newItems='new IDs start unanswered; do not infer completion from old final answer',oldRecords='retain versioned old records separately; existing old migration must run first'),protected='accepted first-title, N07,N08,N09,N10, original images, storage namespace, other modes')
(B/'DISPLAY_SPEC.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print('display entries',sum(len(x) for x in units.values()),'figures',len(figures))
