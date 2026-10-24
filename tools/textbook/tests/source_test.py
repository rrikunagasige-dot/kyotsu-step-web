import importlib.util, json, tempfile, unittest, zipfile, hashlib
from pathlib import Path
SPEC=importlib.util.spec_from_file_location('import_word',Path(__file__).parents[1]/'source/import-word.py')
module=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(module)
W=module.W;M=module.M

class LocatedSourceTests(unittest.TestCase):
    def source(self,path,body):
        files={'[Content_Types].xml':'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
        '_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
        'word/document.xml':f'<w:document xmlns:w="{W}" xmlns:m="{M}"><w:body>{body}<w:sectPr/></w:body></w:document>'}
        with zipfile.ZipFile(path,'w') as z:
            for k,v in files.items():z.writestr(k,v)
    def test_toc_does_not_replace_unit_body_and_math_stays_located(self):
        p=lambda s:f'<w:p><w:r><w:t>{s}</w:t></w:r></w:p>'
        math='<w:p><w:r><w:t>【1】 分数と根号</w:t></w:r><m:oMath><m:f><m:num><m:r><m:t>1</m:t></m:r></m:num><m:den><m:r><m:t>2</m:t></m:r></m:den></m:f><m:rad><m:deg/><m:e><m:r><m:t>3</m:t></m:r></m:e></m:rad></m:oMath></w:p>'
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'input.docx';self.source(path,p('N07 目次')+p('N08 目次')+p('N07 本文')+p('無番号の説明')+math+p('N08 次'))
            before=hashlib.sha256(path.read_bytes()).hexdigest();r=module.import_word(path,'N07')
            self.assertEqual(r['status'],'PASS');self.assertEqual(len(r['blocks']),3)
            self.assertEqual(r['blocks'][1]['text'],'無番号の説明')
            self.assertIn('\\frac{1}{2}',r['blocks'][2]['math'][0]['latex'])
            self.assertIn('\\sqrt{3}',r['blocks'][2]['math'][0]['latex'])
            self.assertEqual(r['blocks'][2]['mathStructures'][0]['fractions'],1)
            self.assertEqual(r['documentHash'],before);self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(),before)
    def test_unknown_unit_is_an_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'input.docx';self.source(path,'<w:p><w:r><w:t>plain</w:t></w:r></w:p>')
            with self.assertRaisesRegex(ValueError,'not found'):module.import_word(path,'N07')

if __name__=='__main__':unittest.main()
