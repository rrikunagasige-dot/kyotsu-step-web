"""Positioned import. Extracted math is never certified from OCR confidence alone."""
import json,sys,hashlib,zipfile
from pathlib import Path
from html.parser import HTMLParser
from xml.etree import ElementTree as ET

class HTMLBlocks(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.blocks=[];self.buffer=[];self.skip=0;self.pos=None
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style'):self.skip+=1
        if tag in ('p','h1','h2','h3','li','math','figure','table'):
            self.flush();self.pos={'line':self.getpos()[0],'column':self.getpos()[1],'tag':tag}
        if tag=='img':
            self.flush();a=dict(attrs)
            self.blocks.append({'kind':'figure','text':a.get('alt',''),'imageRef':a.get('src',''),'location':{'line':self.getpos()[0],'column':self.getpos()[1],'tag':tag},'review':'NEEDS_SOURCE_REVIEW'})
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.skip=max(0,self.skip-1)
        if tag in ('p','h1','h2','h3','li','math','figure','table'):self.flush()
    def handle_data(self,data):
        if not self.skip:self.buffer.append(data)
    def flush(self):
        text=' '.join(''.join(self.buffer).split());self.buffer=[]
        if text:self.blocks.append({'kind':'text','text':text,'location':self.pos or {'line':1,'column':0,'tag':'body'},'review':'NEEDS_SOURCE_REVIEW'})

def extract(path,source_id,engine='native'):
    p=Path(path);data=p.read_bytes();blocks=[]
    if len(data)>50*1024*1024:raise ValueError('SOURCE_SIZE_LIMIT')
    if engine=='docling':
        try:
            from docling.document_converter import DocumentConverter
            import importlib.metadata
        except ImportError:return {'status':'UNSUPPORTED','reason':'Optional Docling is not installed; no silent engine fallback'}
        document=DocumentConverter().convert(p).document
        for item,_ in document.iterate_items():
            text=getattr(item,'text','')
            if text:
                provenance=[{'page':a.page_no,'bbox':a.bbox.model_dump()} for a in getattr(item,'prov',[])]
                blocks.append({'kind':'text','text':text,'location':{'provenance':provenance},'review':'NEEDS_SOURCE_REVIEW'})
        version=importlib.metadata.version('docling')
    elif p.suffix.lower() in ('.html','.htm'):
        parser=HTMLBlocks();parser.feed(data.decode('utf8'));parser.flush();blocks=parser.blocks;version='stdlib-html/1'
    elif p.suffix.lower()=='.docx':
        ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','m':'http://schemas.openxmlformats.org/officeDocument/2006/math'}
        with zipfile.ZipFile(p) as z:
            info=z.getinfo('word/document.xml')
            if info.file_size>20*1024*1024:raise ValueError('WORD_XML_SIZE_LIMIT')
            root=ET.fromstring(z.read(info))
        for i,item in enumerate(root.findall('.//w:body/*',ns)):
            text=''.join(item.itertext()).strip()
            drawings=item.findall('.//w:drawing',ns)+item.findall('.//w:pict',ns)
            if text or drawings:blocks.append({'kind':'figure-and-text' if drawings else 'math-and-text' if item.findall('.//m:oMath',ns) else 'text','text':text,'location':{'bodyIndex':i},'drawingCount':len(drawings),'originalXml':ET.tostring(item,encoding='unicode'),'review':'NEEDS_SOURCE_REVIEW'})
        version='stdlib-ooxml/1'
    elif p.suffix.lower()=='.pdf':
        try:import fitz
        except ImportError:return {'status':'UNSUPPORTED','reason':'Native PDF adapter needs PyMuPDF, or explicitly select Docling'}
        with fitz.open(p) as pdf:
            for pi,page in enumerate(pdf):
                for bi,b in enumerate(page.get_text('blocks')):
                    if len(b)>4 and str(b[4]).strip():blocks.append({'kind':'figure' if len(b)>6 and b[6]==1 else 'text','text':str(b[4]),'location':{'page':pi+1,'block':bi,'bbox':list(b[:4])},'review':'NEEDS_SOURCE_REVIEW'})
                images=page.get_image_info()
                for ii,img in enumerate(images):blocks.append({'kind':'figure','text':'','location':{'page':pi+1,'image':ii,'bbox':list(img['bbox'])},'review':'NEEDS_SOURCE_REVIEW'})
                paths=page.get_drawings()
                if paths:
                    box=paths[0]['rect']
                    for drawing in paths[1:]:box=box|drawing['rect']
                    blocks.append({'kind':'vector-region','text':'','pathCount':len(paths),'location':{'page':pi+1,'bbox':list(box)},'review':'NEEDS_SOURCE_REVIEW'})
        version='pymupdf/'+fitz.VersionBind
    else:return {'status':'UNSUPPORTED','reason':'Supported: HTML, DOCX, positioned PDF; no invented extraction'}
    for i,b in enumerate(blocks):b['id']=source_id+'-b'+str(i+1)
    return {'status':'NEEDS_AI_REVIEW','reviewStatus':'NEEDS_SOURCE_REVIEW','schemaVersion':'research-extraction/1','sourceId':source_id,'contentHash':hashlib.sha256(data).hexdigest(),'engine':engine,'engineVersion':version,'blocks':blocks,'mathCertified':False}

if __name__=='__main__':
    try:
        inp=json.load(sys.stdin);print(json.dumps(extract(inp['path'],inp['sourceId'],inp.get('engine','native')),ensure_ascii=False))
    except Exception as e:print(json.dumps({'status':'FAIL','error':str(e)}));sys.exit(1)
