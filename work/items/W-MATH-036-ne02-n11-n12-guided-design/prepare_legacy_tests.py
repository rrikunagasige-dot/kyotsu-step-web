"""Keep historical regression statements on exact old lessons; add current tests separately."""
import sys,re
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from patch_support import apply
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);code=sys.argv[1];U=code.upper();files={}
# Only historical tests which import the changed leaf are projected to its unchanged legacy export.
for p in (R/'src').rglob('*.test.*'):
 s=p.read_text()
 if f"/{code}Lesson'" not in s:continue
 lines=s.splitlines(keepends=True);new=[]
 for line in lines:
  if line.startswith('import ') and f"/{code}Lesson'" in line:
   
   for original,legacy in [('mathNumbers'+U+'Unit','mathNumbers'+U+'LegacyUnit'),(code+'SourceToItemIds',code+'LegacySourceToItemIds')]:
    if legacy not in line:line=re.sub(r'\b'+original+r'\b(?:\s+as\s+(\w+))?',lambda m:legacy+' as '+(m.group(1) or original),line)
  new.append(line)
 t=''.join(new)
 if t!=s:files[str(p.relative_to(R))]=t
p='src/data/textbook/math/numbers/firstSectionTeaching.test.tsx';s=(R/p).read_text();needle="'math-numbers-expressions-ne02'";assert needle in s;
if "'math-numbers-expressions-"+code+"'" not in s:files[p]=s.replace(needle,needle+",'math-numbers-expressions-"+code+"'",1)
apply(r,'W-MATH-036','R06_PATCH@'+code,R,files,'P001 corresponding historical regression projections: exact old contracts remain tested against named legacy exports; new current source is checked by W036 suite and whole learner plays')
print('Historical tests retained for '+code, list(files))
