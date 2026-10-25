import unittest,tempfile,hashlib
from pathlib import Path
from types import SimpleNamespace
from runner import code_operation
class SourceCandidate(unittest.TestCase):
 def test_new_candidate_file_does_not_change_immutable_source_inventory(self):
  with tempfile.TemporaryDirectory()as d:
   root=Path(d);(root/'a').write_bytes(b'new');(root/'b').write_bytes(b'added')
   sha=lambda b:hashlib.sha256(b).hexdigest()
   state={'plan':{'source_manifest':{'a':sha(b'old')},'scope':{}},'candidate_manifest':{'a':sha(b'new'),'b':sha(b'added')}}
   store=SimpleNamespace(events=lambda:[{'work':'w','kind':'opened','payload':{'original_snapshot':'original'}}],get=lambda _: {'files_hex':{'a':b'old'.hex()}})
   rt=SimpleNamespace(root=root,state=lambda _:state,store=store)
   self.assertEqual(code_operation(rt,'w','S01',{})['status'],'PASS')
   (root/'b').write_bytes(b'tampered');self.assertEqual(code_operation(rt,'w','S01',{})['status'],'FAIL')
