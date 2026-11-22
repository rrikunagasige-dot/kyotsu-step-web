"""Definition migration regression: temp TEST_FIXTURE copies only, no Git writes."""
import copy
import importlib.util
import importlib._bootstrap_external as bytecode
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

from checkpoint import FIXED_WORK, CheckpointRejected
from contracts import Rejected
from definitions import IMPLEMENTATION_FILES, instantiate
from runtime import Runtime
from test_checkpoint_runtime import (ENGINE, initialize_fixture, populate_preflight_fixture,
                                     INPUTS)
import hashlib


def copy_engine(destination):
    destination.mkdir()
    for source in ENGINE.glob('*.py'):
        if not source.name.startswith('test_'):
            shutil.copyfile(source, destination / source.name)
    return destination


class CheckpointDefinitionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original_hashes = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in INPUTS}

    @classmethod
    def tearDownClass(cls):
        for path, expected in cls.original_hashes.items():
            if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                raise AssertionError('Original input changed: ' + str(path))

    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_definition_')
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.seed = populate_preflight_fixture(self.root)
        self.store = initialize_fixture(self.root)
        self.rt = Runtime(self.store.root, self.root)
        no_git = patch('checkpoint.verify_candidate_git',
                       side_effect=AssertionError('TEST_FIXTURE must not invoke Git'))
        no_git.start()
        self.addCleanup(no_git.stop)

    def test_preflight_reads_real_fixed_manifests_without_events_or_git(self):
        head = self.store.head
        before = self.store.suffix_events()
        proof = self.rt.checkpoint_preflight(FIXED_WORK)
        self.assertEqual(proof['schemaVersion'], 'qf01-checkpoint-definition-preflight/1')
        self.assertEqual(proof['ledgerHead'], head)
        self.assertEqual(proof['candidateManifest'], self.seed['candidate_manifest'])
        self.assertEqual(proof['changedCandidatePaths'], {})
        self.assertNotEqual(proof['fromDefinition'], proof['toDefinition'])
        self.assertEqual(len(proof['resultDispositions']), len(self.seed['results']))
        self.assertTrue(all(r['disposition'] == 'INVALIDATED_BY_DEFINITION'
                            for r in proof['resultDispositions']))
        self.assertFalse(proof['oldPassTransferred'])
        self.assertFalse(proof['gateAccepted'])
        self.assertEqual(proof['globalQueueCoverage'], 'UNKNOWN')
        self.assertEqual(self.store.suffix_events(), before)
        self.assertEqual(self.store.head, head)
        self.assertFalse((self.root / '.git').exists())

    def test_migration_preserves_original_users_results_and_invalidates_old_inputs(self):
        before = self.rt.state(FIXED_WORK)
        self.assertEqual(self.rt.next(FIXED_WORK)['status'], 'BLOCKED')
        proof = self.rt.checkpoint_preflight(FIXED_WORK)
        event = self.rt.migrate_checkpoint_definition(FIXED_WORK, proof=proof,
                                                      expected_head=proof['ledgerHead'])
        self.assertEqual(event['kind'], 'checkpoint_definition_migrated')
        self.assertEqual(event['seq'], 13744)
        self.assertFalse(event['payload']['gateAccepted'])
        self.assertFalse(event['payload']['oldPassTransferred'])
        after = self.rt.state(FIXED_WORK)
        self.assertEqual(after['users'], before['users'])
        self.assertEqual(after['results'], before['results'])
        self.assertEqual(after['definition_hash'], proof['toDefinition'])
        self.assertEqual(after['candidate_manifest'], proof['candidateManifest'])
        self.assertEqual(self.store.get(event['payload']['preflightRef']), proof)
        nodes = instantiate(after['plan'])
        for name, result in before['results'].items():
            if name in nodes:
                with self.subTest(node=name):
                    self.assertNotEqual(self.rt.input_hash(after, nodes[name]), result['input_hash'])
        self.assertEqual(len(self.store.suffix_events()), 2)
        restored = Runtime(self.store.root, self.root)
        self.assertEqual(restored.state(FIXED_WORK)['users'], before['users'])
        with self.assertRaises(Rejected):
            restored.checkpoint_preflight(FIXED_WORK)

    def test_mutated_preflight_fields_cannot_migrate(self):
        proof = self.rt.checkpoint_preflight(FIXED_WORK)
        for key, value in [('toDefinition', '0' * 64), ('preservedUserRecordsHash', '0' * 64),
                           ('candidateManifest', {}), ('resultDispositions', []),
                           ('globalQueueCoverage', 'COMPLETE'), ('gateAccepted', True)]:
            changed = copy.deepcopy(proof)
            changed[key] = value
            with self.subTest(key=key), self.assertRaises(Rejected):
                self.rt.migrate_checkpoint_definition(FIXED_WORK, proof=changed,
                                                       expected_head=proof['ledgerHead'])
            self.assertEqual(self.store.head, proof['ledgerHead'])

    def test_stale_preflight_head_cannot_migrate(self):
        proof = self.rt.checkpoint_preflight(FIXED_WORK)
        self.rt.append('TEST_FIXTURE_CHANGED_HEAD', FIXED_WORK,
                       {'fixtureKind': 'TEST_FIXTURE', 'notActualEvent': True})
        head = self.store.head
        with self.assertRaises(Rejected):
            self.rt.migrate_checkpoint_definition(FIXED_WORK, proof=proof,
                                                   expected_head=proof['ledgerHead'])
        self.assertEqual(self.store.head, head)

    def test_changed_rule_bytes_cannot_preflight(self):
        relative = next(iter(self.seed['plan']['rules']))
        source = self.root / relative
        source.write_bytes(source.read_bytes() + b'\nTEST_FIXTURE_CHANGED_RULE\n')
        head = self.store.head
        with self.assertRaises(Rejected):
            self.rt.checkpoint_preflight(FIXED_WORK)
        self.assertEqual(self.store.head, head)

    def test_pause_and_active_claim_block_migration(self):
        self.rt.append('paused', FIXED_WORK, {'value': True, 'fixtureKind': 'TEST_FIXTURE'})
        with self.assertRaises(Rejected):
            self.rt.checkpoint_preflight(FIXED_WORK)
        self.rt.append('paused', FIXED_WORK, {'value': False, 'fixtureKind': 'TEST_FIXTURE'})
        self.rt.append('claimed', FIXED_WORK,
                       {'node': 'TEST_FIXTURE_NODE', 'fixtureKind': 'TEST_FIXTURE'})
        with self.assertRaises(Rejected):
            self.rt.checkpoint_preflight(FIXED_WORK)

    def test_changed_runtime_copy_after_start_blocks_integrity(self):
        engine = copy_engine(self.root / 'TEST_FIXTURE_engine')
        program = r'''
import sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
from runtime import Runtime
from checkpoint import FIXED_WORK
rt=Runtime(sys.argv[2], sys.argv[3])
p=Path(sys.argv[1])/'runtime.py'
p.write_bytes(p.read_bytes()+b'\n# TEST_FIXTURE_SOURCE_CHANGED_AFTER_START\n')
drift=rt.integrity(rt.state(FIXED_WORK))
assert drift and 'fresh process' in drift, repr(drift)
print('TEST_FIXTURE_SOURCE_DRIFT_REJECTED')
'''
        result = subprocess.run([sys.executable, '-I', '-B', '-c', program,
                                 str(engine), str(self.store.root), str(self.root)],
                                capture_output=True, text=True, timeout=40)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('TEST_FIXTURE_SOURCE_DRIFT_REJECTED', result.stdout)

    def second_definition_fixture(self,*,quote='限定D02案を採用して進める'):
        from checkpoint import INFORMED_REVIEW_PROPOSAL_SHA256
        proof = self.rt.checkpoint_preflight(FIXED_WORK)
        self.rt.migrate_checkpoint_definition(FIXED_WORK,proof=proof,expected_head=proof['ledgerHead'])
        transcription = {'schemaVersion':'qf01-informed-review-user-adoption/1',
            'proposalSHA256':INFORMED_REVIEW_PROPOSAL_SHA256,'quote':quote,
            'source_ref':'request_user_input_async/call_27be7afbeef843249d088b530a5701b7',
            'verification_level':'conversation_transcribed','adoptedForImplementation':True,
            'fixtureKind':'TEST_FIXTURE_NOT_AN_ACTUAL_ADOPTION_RECEIPT'}
        path = self.root/'TEST_FIXTURE_D02_ADOPTION.json'
        path.write_text(json.dumps(transcription,ensure_ascii=False)+'\n',encoding='utf-8')
        evidence = self.rt.evidence(FIXED_WORK,'file',{'path':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()},
                                   source_ref='TEST_FIXTURE/adoption-copy')
        engine = copy_engine(self.root/'TEST_FIXTURE_future_engine')
        source = engine/'team.py'
        source.write_bytes(source.read_bytes()+b'\n# TEST_FIXTURE_NEXT_DEFINITION_ONLY\n')
        return engine,evidence

    def test_subsequent_real_definition_migration_requires_new_exact_adoption(self):
        engine,evidence = self.second_definition_fixture()
        program = r'''
import sys,json
sys.path.insert(0,sys.argv[1])
from runtime import Runtime
from checkpoint import FIXED_WORK
from contracts import Rejected
rt=Runtime(sys.argv[2],sys.argv[3]); before=rt.state(FIXED_WORK); head=rt.store.head
try:rt.checkpoint_preflight(FIXED_WORK)
except Rejected as error:assert 'D02_SUBSEQUENT_MIGRATION_ADOPTION_REQUIRED' in str(error),str(error)
else:raise AssertionError('TEST_FIXTURE missing D adoption accepted')
assert rt.store.head==head
proof=rt.checkpoint_preflight(FIXED_WORK,informed_adoption_ref=sys.argv[4])
assert proof['reviewMethodAdoption']['evidenceRef']==sys.argv[4]
assert proof['fromDefinition']==before['definition_hash'] and proof['fromDefinition']!=proof['toDefinition']
assert not proof['gateAccepted'] and not proof['oldPassTransferred']
event=rt.migrate_checkpoint_definition(FIXED_WORK,proof=proof,expected_head=proof['ledgerHead'])
after=rt.state(FIXED_WORK)
assert after['users']==before['users'] and after['results']==before['results'] and after['plan']==before['plan']
assert event['payload']['reviewMethodAdoption']==proof['reviewMethodAdoption']
assert len([e for e in rt.store.suffix_events() if e['kind']=='checkpoint_definition_migrated'])==2
print('TEST_FIXTURE_TWO_REAL_MIGRATIONS_ORIGINAL_USERS_RESULTS_PRESERVED')
'''
        result = subprocess.run([sys.executable,'-I','-S','-B','-c',program,str(engine),str(self.store.root),str(self.root),evidence],
                                capture_output=True,text=True,encoding='utf-8',timeout=90)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertIn('TEST_FIXTURE_TWO_REAL_MIGRATIONS',result.stdout)

    def test_subsequent_migration_rejects_other_adoption_quote_without_writes(self):
        engine,evidence = self.second_definition_fixture(quote='TEST_FIXTURE_CONTINUE_ONLY')
        program = r'''
import sys
sys.path.insert(0,sys.argv[1])
from runtime import Runtime
from checkpoint import FIXED_WORK
from contracts import Rejected
rt=Runtime(sys.argv[2],sys.argv[3]);head=rt.store.head
try:rt.checkpoint_preflight(FIXED_WORK,informed_adoption_ref=sys.argv[4])
except Rejected as error:assert 'D02_ACTUAL_SUBSEQUENT_MIGRATION_ADOPTION' in str(error),str(error)
else:raise AssertionError('TEST_FIXTURE wrong quote accepted')
assert rt.store.head==head
print('TEST_FIXTURE_WRONG_D_ADOPTION_REJECTED_NO_WRITE')
'''
        result = subprocess.run([sys.executable,'-I','-S','-B','-c',program,str(engine),str(self.store.root),str(self.root),evidence],
                                capture_output=True,text=True,encoding='utf-8',timeout=90)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertIn('TEST_FIXTURE_WRONG_D_ADOPTION_REJECTED_NO_WRITE',result.stdout)


class SourceOnlyIdentityTests(unittest.TestCase):
    def test_direct_cli_uses_source_when_normal_import_loads_stale_runtime_pyc(self):
        with tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_cli_pyc_') as temporary:
            engine = copy_engine(Path(temporary).resolve() / 'engine')
            source = engine / 'runtime.py'
            before = source.stat()
            marker = 'TEST_FIXTURE_STALE_RUNTIME_PYC_WAS_EXECUTED'
            code = compile('raise RuntimeError(' + repr(marker) + ')\n', str(source), 'exec')
            cache = Path(importlib.util.cache_from_source(str(source)))
            cache.parent.mkdir()
            cache.write_bytes(bytecode._code_to_timestamp_pyc(code, int(before.st_mtime), before.st_size))
            ordinary = subprocess.run([sys.executable, '-I', '-B', '-c',
                'import sys;sys.path.insert(0,sys.argv[1]);import runtime', str(engine)],
                capture_output=True, text=True, timeout=30)
            self.assertNotEqual(ordinary.returncode, 0)
            self.assertIn(marker, ordinary.stderr)
            # Execute cli.py as a script, so cli's own pyc is not an entrypoint.
            direct = subprocess.run([sys.executable, '-I', '-S', '-B', str(engine / 'cli.py'), '--help'],
                                    capture_output=True, text=True, timeout=30)
            self.assertEqual(direct.returncode, 0, direct.stderr)
            self.assertIn('usage:', direct.stdout.lower())
            self.assertNotIn(marker, direct.stderr)
            self.assertEqual(source.stat().st_size, before.st_size)
            self.assertEqual(source.stat().st_mtime_ns, before.st_mtime_ns)

    def test_timestamp_and_size_valid_stale_pyc_is_not_trusted(self):
        with tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_pyc_') as temporary:
            engine = copy_engine(Path(temporary).resolve() / 'engine')
            source = engine / 'definitions.py'
            before = source.stat()
            forged_hash = '0' * 64
            code = compile('DEFINITION_HASH=' + repr(forged_hash) + '\nIMPLEMENTATION_FILES='
                           + repr(IMPLEMENTATION_FILES) + '\n', str(source), 'exec')
            cache = Path(importlib.util.cache_from_source(str(source)))
            cache.parent.mkdir()
            cache.write_bytes(bytecode._code_to_timestamp_pyc(code, int(before.st_mtime), before.st_size))
            program = r'''
import sys
sys.path.insert(0,sys.argv[1])
from checkpoint import current_core_identity,CheckpointRejected
import definitions
assert definitions.DEFINITION_HASH=='0'*64, 'TEST_FIXTURE stale pyc was not loaded by normal import'
try:
 current_core_identity()
except CheckpointRejected as error:
 assert 'RUNNING_CORE_IMPORT_IS_STALE' in str(error), str(error)
 print('TEST_FIXTURE_STALE_PYC_REJECTED')
else:
 raise AssertionError('Fresh identity trusted timestamp/size-valid TEST_FIXTURE pyc')
'''
            result = subprocess.run([sys.executable, '-I', '-B', '-c', program, str(engine)],
                                    capture_output=True, text=True, timeout=40)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn('TEST_FIXTURE_STALE_PYC_REJECTED', result.stdout)
            self.assertEqual(source.stat().st_size, before.st_size)
            self.assertEqual(source.stat().st_mtime_ns, before.st_mtime_ns)


if __name__ == '__main__':
    unittest.main(verbosity=2)
