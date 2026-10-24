#!/usr/bin/env python3
"""Pandoc adapter preserving source paragraph identities. Original files are never edited."""
import argparse, hashlib, json, re, subprocess, tempfile, zipfile
from pathlib import Path
from lxml import etree as ET

W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
M='http://schemas.openxmlformats.org/officeDocument/2006/math'
NS={'w':W,'m':M}
MARKER=re.compile(r'KS_SRC_(\d{6})')

def sha(data): return hashlib.sha256(data).hexdigest()

def import_word(path, unit=None):
    original=Path(path).read_bytes()
    with zipfile.ZipFile(path) as z:
        tree=ET.fromstring(z.read('word/document.xml'))
        records=[]
        for i,p in enumerate(tree.findall('.//w:p',NS),1):
            text=''.join(p.xpath('.//w:t/text()',namespaces=NS))
            maths=p.findall('.//m:oMath',NS)
            # Structural evidence is kept independent from converted LaTeX.
            structures=[]
            for m in maths:
                structures.append({'sha256':sha(ET.tostring(m)),
                    'fractions':len(m.findall('.//m:f',NS)),
                    'radicals':len(m.findall('.//m:rad',NS)),
                    'superscripts':len(m.findall('.//m:sSup',NS))})
            records.append({'id':f'word-p-{i:06}', 'locator':f'word/document.xml:p[{i}]',
                'text':text,'markers':[int(q) for q in re.findall(r'【(\d+)】',text)],
                'mathStructures':structures,'math':[],'images':[]})
            marker=ET.Element('{'+W+'}r');t=ET.SubElement(marker,'{'+W+'}t')
            t.text=f'KS_SRC_{i:06} '
            # Paragraph properties must remain the first child.
            p.insert(1 if len(p) and p[0].tag=='{'+W+'}pPr' else 0,marker)
        with tempfile.TemporaryDirectory(prefix='ks-word-') as temp:
            marked=Path(temp)/'located.docx'
            with zipfile.ZipFile(marked,'w') as out:
                for entry in z.infolist():
                    out.writestr(entry,ET.tostring(tree,xml_declaration=True,encoding='UTF-8')
                        if entry.filename=='word/document.xml' else z.read(entry.filename))
            run=subprocess.run(['pandoc',str(marked),'-f','docx','-t','json'],capture_output=True,text=True)
            if run.returncode: raise RuntimeError(run.stderr)
            ast=json.loads(run.stdout)
    current=None;seen=set();unassigned=[]
    def walk(x):
        nonlocal current
        if isinstance(x,list):
            for y in x: walk(y)
        elif isinstance(x,dict):
            typ=x.get('t');c=x.get('c')
            if typ=='Str':
                for match in MARKER.finditer(c):
                    current=int(match.group(1))-1;seen.add(current)
            elif typ=='Math':
                if current is None: unassigned.append(c)
                else: records[current]['math'].append({'display':c[0]['t'],'latex':c[1]})
                return
            elif typ=='Image':
                if current is not None: records[current]['images'].append(c[-1][0])
                return
            else:
                for y in x.values(): walk(y)
    walk(ast['blocks'])
    for i,r in enumerate(records):
        r['extractionStatus']='PASS' if i in seen and len(r['math'])==len(r['mathStructures']) else 'UNVERIFIED'
        r['kind']='question' if r['markers'] else ('heading' if re.match(r'N(?:\d{2}|E\d{2})[\s　]',r['text']) else 'explanation')
    if unit:
        candidates=[]
        for start,r in enumerate(records):
            if not re.match(re.escape(unit)+r'[\s　]',r['text']): continue
            end=next((i for i in range(start+1,len(records)) if re.match(r'N(?:\d{2}|E\d{2})[\s　]',records[i]['text'])),len(records))
            candidates.append((sum(len(x['markers']) for x in records[start:end]),start,end))
        if not candidates: raise ValueError('unit not found: '+unit)
        candidates.sort(reverse=True)
        if len(candidates)>1 and candidates[0][0]==candidates[1][0]: raise ValueError('ambiguous unit span: '+unit)
        count,start,end=candidates[0]
        if count==0: raise ValueError('unit span has no questions: '+unit)
        records=records[start:end]
    result={'schemaVersion':1,'documentHash':sha(original),'unit':unit,
        'pandocVersion':subprocess.check_output(['pandoc','--version'],text=True).splitlines()[0],
        'warnings':run.stderr,'unassignedMath':unassigned,'blocks':records,
        'status':'PASS' if not unassigned and not run.stderr and all(r['extractionStatus']=='PASS' for r in records) else 'UNVERIFIED',
        'semanticFidelity':'REQUIRES_SOURCE_REVIEW'}
    if Path(path).read_bytes()!=original: raise RuntimeError('source changed')
    return result

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('source');ap.add_argument('--unit');ap.add_argument('--out',required=True)
    args=ap.parse_args();result=import_word(args.source,args.unit)
    Path(args.out).parent.mkdir(parents=True,exist_ok=True)
    Path(args.out).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'status':result['status'],'blocks':len(result['blocks']),'math':sum(len(r['math']) for r in result['blocks']),'out':args.out}))
