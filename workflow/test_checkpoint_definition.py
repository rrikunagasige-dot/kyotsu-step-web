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
                                     populate_nearby_fixture, INPUTS)
import test_checkpoint_runtime as checkpoint_runtime_tests
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


class NearbyMigrationTests(unittest.TestCase):
    """Rehash attacks only mutate isolated temporary TEST_FIXTURE suffixes."""
    rewrite_fixture_suffix = checkpoint_runtime_tests.InformedReviewMethodTests.rewrite_fixture_suffix

    @classmethod
    def setUpClass(cls):
        cls.temporary=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_D03_master_')
        cls.addClassCleanup(cls.temporary.cleanup)
        cls.master=Path(cls.temporary.name).resolve()
        cls.fixture=populate_nearby_fixture(cls.master)

    def setUp(self):
        temporary=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_D03_migration_')
        self.addCleanup(temporary.cleanup);self.root=Path(temporary.name).resolve()
        shutil.copytree(self.master,self.root,dirs_exist_ok=True)
        from checkpoint import CheckpointStore
        self.store=CheckpointStore(self.root/'work/recovery-checkpoints/qf01-p046-r3')
        self.rt=Runtime(self.store.root,self.root)

    def test_two_migrations_preserve_original_plan_users_results_and_unknown(self):
        before=self.fixture['stateB'];after=self.rt.state(FIXED_WORK)
        self.assertEqual(after['plan'],before['plan']);self.assertEqual(after['users'],before['users'])
        self.assertEqual(after['results'],before['results']);self.assertEqual(after['candidate_sha'],'c'*40)
        rows=self.store.suffix_events();migrations=[e for e in rows if e['kind']=='checkpoint_definition_migrated']
        self.assertEqual(len(migrations),2)
        self.assertNotIn('repairAdoption',migrations[0]['payload'])
        self.assertEqual(migrations[1]['payload']['repairAdoption'],self.fixture['proof']['repairAdoption'])
        self.assertFalse(migrations[1]['payload']['gateAccepted'])
        self.assertEqual(self.fixture['proof']['globalQueueCoverage'],'UNKNOWN')

    def test_rehashed_candidate_before_in_payload_and_preflight_is_rejected(self):
        from checkpoint import canonical,digest
        rows=self.store.suffix_events();row=next(e for e in rows if e['payload'].get('repairAdoption'))
        proof=self.store.get(row['payload']['preflightRef'])
        proof['candidateBeforeSHA']='e'*40;proof['repairAdoption']['candidateBeforeSHA']='e'*40
        row['payload']['repairAdoption']['candidateBeforeSHA']='e'*40
        reference=digest(proof)
        (self.store.root/'artifacts'/(reference+'.json')).write_bytes(canonical(proof)+b'\n')
        row['payload']['preflightRef']=reference
        with self.assertRaisesRegex(CheckpointRejected,'D03_MIGRATION_CURRENT_PREVIOUS_BINDING'):
            self.rewrite_fixture_suffix(rows)

    def test_later_migration_cannot_strip_supplement_even_with_rehashed_envelope(self):
        from checkpoint import canonical,digest
        rows=self.store.suffix_events();old=copy.deepcopy(next(e for e in rows if e['payload'].get('repairAdoption')))
        proof=self.store.get(old['payload']['preflightRef'])
        proof.pop('repairAdoption');proof['ledgerHead']=rows[-1]['hash']
        proof['candidateBeforeSHA']='c'*40;proof['candidateAfterSHA']='e'*40
        proof['fromDefinition']=old['payload']['to'];proof['toDefinition']='e'*64
        proof['core']['definitionHash']='e'*64
        reference=digest(proof);(self.store.root/'artifacts'/(reference+'.json')).write_bytes(canonical(proof)+b'\n')
        old['id']='TEST_FIXTURE_D03_STRIPPED';old['payload'].pop('repairAdoption')
        old['payload'].update(preflightRef=reference,candidateSHA='e'*40,**{'from':proof['fromDefinition'],'to':'e'*64})
        rows.append(old)
        with self.assertRaisesRegex(CheckpointRejected,'D03_SUPPLEMENT_CANNOT_BE_STRIPPED'):
            self.rewrite_fixture_suffix(rows)

    def test_current_supplement_file_or_other_product_change_is_rejected(self):
        from checkpoint import current_nearby_repair,CURRENT_REPAIR_AFTER,NEARBY_REPAIR_PRODUCT_PATHS
        state=self.rt.state(FIXED_WORK)
        self.assertIsNotNone(current_nearby_repair(self.rt,state))
        relative=next(p for p in CURRENT_REPAIR_AFTER if p not in NEARBY_REPAIR_PRODUCT_PATHS)
        path=self.root/relative;path.write_bytes(path.read_bytes()+b'\n/* TEST_FIXTURE */\n')
        with self.assertRaisesRegex(Rejected,'D03_CURRENT_PRODUCT_BYTES|D03_CURRENT_SOURCE_DEFINITION_SERVICE'):
            current_nearby_repair(self.rt,state)


class NearbyGitProofTests(unittest.TestCase):
    """Actual verifier/file hashes with an explicitly synthetic Git transport.

    This never executes Git or claims a fixture tree is a real public commit.
    """
    setUpClass=classmethod(NearbyMigrationTests.setUpClass.__func__)
    setUp=NearbyMigrationTests.setUp

    def git_proof(self,*,wrong_baseline_blob=False,extra_delta=False,
                  wrong_proposal_blob=False,missing_proposal=False,proposal_mode='100644',omit_proposal_delta=False):
        from types import SimpleNamespace
        from adapters import _checkpoint_git_proof,_CHECKPOINT_PRODUCT_ROOTS
        from checkpoint import (CURRENT_REPAIR_AFTER,NEARBY_REPAIR_BASELINE,
            NEARBY_REPAIR_PROPOSAL_PATH,FIXED_SOURCE,current_core_identity)
        from test_checkpoint_runtime import repair_fixture_bytes,FIXTURE_SOURCE_ROOT
        for source in ENGINE.iterdir():
            if source.is_file() and source.suffix in ('.py','.md'):
                target=self.root/'workflow'/source.name;target.parent.mkdir(parents=True,exist_ok=True)
                shutil.copyfile(source,target)
        products={p.relative_to(self.root).as_posix():p.read_bytes() for name in ('src','public')
                  for p in (self.root/name).rglob('*') if p.is_file()}
        products.update({name:(self.root/name).read_bytes() for name in _CHECKPOINT_PRODUCT_ROOTS[2:] if (self.root/name).exists()})
        before=dict(products);baseline=dict(products)
        for name,expected in CURRENT_REPAIR_AFTER.items():
            before[name]=(FIXTURE_SOURCE_ROOT/name).read_bytes()
            baseline[name]=repair_fixture_bytes(name,expected)
        workflow={'workflow/'+p.name:p.read_bytes() for p in (self.root/'workflow').iterdir() if p.is_file()}
        proposal={} if missing_proposal else {NEARBY_REPAIR_PROPOSAL_PATH:
            b'TEST_FIXTURE_UNADOPTED_GIT_PROPOSAL\n' if wrong_proposal_blob
            else (self.root/NEARBY_REPAIR_PROPOSAL_PATH).read_bytes()}
        def blob(raw):return hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
        def rows(values,mode='100644'):return b''.join(mode.encode()+b' blob '+blob(raw).encode()+b'\t'+name.encode()+b'\0' for name,raw in sorted(values.items()))
        renderer='src/components/textbook/GuidedMathReadingFlow.tsx'
        def external(cmd,**kwargs):
            self.assertEqual(cmd[:3],['git','-C',str(self.root)])
            args=cmd[3:];out=b''
            if args[:2]==['rev-parse','HEAD']:out=b'c'*40+b'\n'
            elif args[0]=='rev-parse':out=b'e'*40+b'\n'
            elif args[:2]==['remote','get-url']:out=b'https://github.com/rrikunagasige-dot/kyotsu-step-web.git\n'
            elif args[0]=='merge-base' or args[:2]==['cat-file','-e']:pass
            elif args[:2]==['cat-file','blob']:
                commit,name=args[2].split(':',1)
                out=proposal[name] if name==NEARBY_REPAIR_PROPOSAL_PATH else (before if commit==FIXED_SOURCE else baseline)[name]
                if wrong_baseline_blob and commit==NEARBY_REPAIR_BASELINE and name==renderer:out=products[name]
            elif args[0]=='ls-tree':
                commit=args[3];paths=args[5:]
                if paths==[NEARBY_REPAIR_PROPOSAL_PATH]:out=rows(proposal,proposal_mode)
                else:out=rows(workflow if paths==['workflow'] else before if commit==FIXED_SOURCE else baseline if commit==NEARBY_REPAIR_BASELINE else products)
            elif args[0]=='diff':
                if '--' in args:names={'workflow/checkpoint.py'}
                elif args[3]==NEARBY_REPAIR_BASELINE:
                    names={'workflow/checkpoint.py',NEARBY_REPAIR_PROPOSAL_PATH,*self.fixture['proof']['repairAdoption']['allowedProductPaths']}
                    if omit_proposal_delta:names.remove(NEARBY_REPAIR_PROPOSAL_PATH)
                    if extra_delta:names.add('tools/UNADOPTED.py')
                else:names={*CURRENT_REPAIR_AFTER,'workflow/checkpoint.py',NEARBY_REPAIR_PROPOSAL_PATH}
                out=b''.join(name.encode()+b'\0' for name in sorted(names))
            else:raise AssertionError('Unexpected TEST_FIXTURE Git boundary command: '+repr(args))
            return SimpleNamespace(returncode=0,stdout=out,stderr=b'')
        state=self.rt.state(FIXED_WORK);origin=self.store._view.state_snapshot(FIXED_WORK);core=current_core_identity()
        with patch('adapters.subprocess.run',side_effect=external):
            proof=_checkpoint_git_proof(self.rt,state,origin,core,review_method=True)
        return proof,baseline,products,blob

    def test_original_five_after_blobs_remain_b_while_product_tree_is_current(self):
        from checkpoint import CURRENT_REPAIR_AFTER,NEARBY_REPAIR_PRODUCT_PATHS
        proof,baseline,current,blob=self.git_proof()
        for name,row in proof['repairs'].items():
            self.assertEqual(row['afterSHA256'],CURRENT_REPAIR_AFTER[name])
            self.assertEqual(row['afterGitBlobSHA'],blob(baseline[name]))
        for name in NEARBY_REPAIR_PRODUCT_PATHS:
            self.assertNotEqual(proof['repairs'][name]['afterGitBlobSHA'],blob(current[name]))
        self.assertEqual(proof['nearbyRepair'],self.fixture['proof']['repairAdoption'])

    def test_replacing_old_b_baseline_blob_with_current_c_is_rejected(self):
        with self.assertRaisesRegex(Rejected,'D03_ORIGINAL_FIVE_REPAIR_BYTES'):
            self.git_proof(wrong_baseline_blob=True)

    def test_b_to_current_delta_cannot_hide_unadopted_tools_code(self):
        with self.assertRaisesRegex(Rejected,'D03_DIFF_OUTSIDE_EXACT_PROPOSAL'):
            self.git_proof(extra_delta=True)

    def test_wrong_git_proposal_bytes_cannot_hide_behind_correct_working_original(self):
        from checkpoint import NEARBY_REPAIR_PROPOSAL_PATH,NEARBY_REPAIR_PROPOSAL_SHA256
        working=self.root/NEARBY_REPAIR_PROPOSAL_PATH
        self.assertEqual(hashlib.sha256(working.read_bytes()).hexdigest(),NEARBY_REPAIR_PROPOSAL_SHA256)
        # Candidate entry SHA1 and blob bytes agree with each other, but are
        # not the adopted text. The working copy remains the genuine original.
        with self.assertRaisesRegex(Rejected,'D03_FIXED_PROPOSAL_GIT_BYTES'):
            self.git_proof(wrong_proposal_blob=True)
        self.assertEqual(hashlib.sha256(working.read_bytes()).hexdigest(),NEARBY_REPAIR_PROPOSAL_SHA256)

    def test_proposal_git_entry_mode_and_baseline_delta_are_required(self):
        for mutation,error in [(dict(missing_proposal=True),'D03_FIXED_PROPOSAL_GIT_ENTRY'),
            (dict(proposal_mode='100755'),'D03_FIXED_PROPOSAL_GIT_ENTRY'),
            (dict(omit_proposal_delta=True),'D03_FIXED_PROPOSAL_NOT_IN_DIFF')]:
            with self.subTest(mutation=mutation),self.assertRaisesRegex(Rejected,error):
                self.git_proof(**mutation)


if __name__ == '__main__':
    unittest.main(verbosity=2)
