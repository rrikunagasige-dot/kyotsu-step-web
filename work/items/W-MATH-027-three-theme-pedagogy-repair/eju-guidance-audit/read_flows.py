import json
from pathlib import Path
d=json.loads(Path('chapter3055-native/extracted/chapter-runtime/runtime-units.json').read_text())
out=Path('eju-audit-public/flows');out.mkdir(exist_ok=True)
for entry in d['units']:
 u=entry['unit'];rows=[u['unitId']+' '+u['title']];seen=set()
 for section in u['sections']:
  items={x['id']:x for x in section['items']}
  for b in section.get('readingFlow',[]):
   typ=b['type'];content=b.get('text','')
   if 'parts' in b:
    parts=[]
    for part in b['parts']:
     if part['type']=='choice':
      i=items[part['itemId']];seen.add(i['id']);parts.append('【'+i['id']+'→'+i['answer']+'】')
     else:parts.append(part.get('text',part.get('latex','')))
    content=''.join(parts)
   if typ=='figure':
    fig=next(f for f in section['figures'] if f['id']==b['figureId']);content=json.dumps(fig,ensure_ascii=False)
   if typ=='dialogue':content=b['speaker']+':'+content
   rows.append(b['id']+' '+content)
  for i in section['items']:
   if i['id'] not in seen: rows.append('UNLOCATED '+i['id']+' '+i['prompt']+'→'+i['answer'])
 body='\n'.join(rows)+'\n';(out/(entry['code']+'.txt')).write_text(body)
print([(p.name,len(p.read_text())) for p in out.glob('*.txt')])
