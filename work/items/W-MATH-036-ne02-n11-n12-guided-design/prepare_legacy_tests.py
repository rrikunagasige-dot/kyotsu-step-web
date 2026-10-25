"""Keep historical regression statements on exact old lessons; add current tests separately."""
import sys
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
   line=line.replace('mathNumbers'+U+'Unit', 'mathNumbers'+U+'LegacyUnit as mathNumbers'+U+'Unit').replace(code+'SourceToItemIds',code+'LegacySourceToItemIds as '+code+'SourceToItemIds')
  new.append(line)
 t=''.join(new)
 if t!=s:files[str(p.relative_to(R))]=t
p='src/data/textbook/math/numbers/firstSectionTeaching.test.tsx';s=(R/p).read_text();needle="'math-numbers-expressions-ne02'";assert needle in s;files[p]=s.replace(needle,needle+",'math-numbers-expressions-"+code+"'",1)
apply(r,'W-MATH-036','R06_PATCH@'+code,R,files,'P001 corresponding historical regression projections: exact old contracts remain tested against named legacy exports; new current source is checked by W036 suite and whole learner plays')
print('Historical tests retained for '+code, list(files))
