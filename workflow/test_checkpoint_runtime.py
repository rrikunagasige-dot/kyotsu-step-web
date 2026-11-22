"""Native adapter regressions. Every created namespace/event is TEST_FIXTURE.

Original input files, production Store, Git and acceptance receipts are never
written. Fixture adoption is a transcribed TEST_FIXTURE, not a user action.
"""
import base64
import copy
import gzip
import hashlib
import json
import os
from pathlib import Path
import shutil
import tempfile
import time
import unittest
from unittest.mock import patch

from checkpoint import (CheckpointStore, CheckpointRejected, UnknownContext,
                        FIXED_WORK, FIXED_ANCHOR, RECOVERY_PROPOSAL_SHA256,
                        NEW_TECHNICAL_WORKS, history_events, feedback_payloads,
                        queue_coverage, digest)
from runtime import Runtime
from store import Store, open_store, CorruptLedger, Conflict
from contracts import Rejected, manifest

WORKSPACE = Path(__file__).resolve().parents[2]
ENGINE = Path(__file__).resolve().parent
def checkpoint_input(relative, origin_name):
    configured = os.environ.get('QF01_CHECKPOINT_INPUT_ROOT')
    if configured:
        supplied = Path(configured).resolve()
        candidates = [supplied / relative, supplied / origin_name, supplied / 'origin' / origin_name]
        for path in candidates:
            if path.is_file():
                return path
        raise FileNotFoundError('Required checkpoint test input: ' + origin_name)
    native = ENGINE.parent / 'work/recovery-checkpoints/qf01-p046-r3/origin' / origin_name
    if origin_name == 'PROPOSAL.md' and not native.is_file():
        local = ENGINE.parent / 'work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/PROPOSAL.md'
        if local.is_file():
            return local
    return native if native.is_file() else WORKSPACE / relative


CONTRACT = checkpoint_input('qf01-work/tools/release/qf01-publish-contract.json', 'publisher-contract.json')
BLOB = checkpoint_input('qf_audit_download/authority-review/BUILD_AUTHORITY.blob', 'BUILD_AUTHORITY.blob')
PROPOSAL = checkpoint_input('qf01-material/work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/PROPOSAL.md', 'PROPOSAL.md')
SOURCE_PROOF = checkpoint_input('qf_audit_download/recovered-origin-source/RECOVERY_PROOF.json', 'ORIGIN_SOURCE_PROOF.json')
SOURCE_SNAPSHOT = checkpoint_input('qf_audit_download/recovered-origin-source/RECOVERED_SOURCE_SNAPSHOT.json', 'ORIGIN_SOURCE_SNAPSHOT.json')
FIXTURE_SOURCE_ROOT = Path(os.environ.get('QF01_CHECKPOINT_SOURCE_ROOT', str(WORKSPACE / 'qf01-core'))).resolve()
INPUTS = (CONTRACT, BLOB, PROPOSAL, SOURCE_PROOF, SOURCE_SNAPSHOT)


def seed_state():
    return json.loads(gzip.decompress(base64.b64decode(BLOB.read_bytes())))['baseState']


def initialize_fixture(root):
    root = Path(root).resolve()
    return CheckpointStore.initialize(root / 'work/recovery-checkpoints/qf01-p046-r3', root,
        contract_path=CONTRACT, blob_path=BLOB, proposal_path=PROPOSAL,
        adoption={'quote': 'この限定案を採用して進める',
                  'verification_level': 'conversation_transcribed',
                  'proposal_sha256': RECOVERY_PROPOSAL_SHA256,
                  'source_ref': 'TEST_FIXTURE/call_d1c88a5dde794be288a201a5ea8de0cc'},
        source_proof_path=SOURCE_PROOF, source_snapshot_path=SOURCE_SNAPSHOT,
        executor='TEST_FIXTURE/axis_review')


def populate_preflight_fixture(root):
    """Copy hash-fixed seed bytes and required services; never use/copy .git."""
    root = Path(root)
    state = seed_state()
    required = {**state['plan']['rules'], **state['plan']['protected_manifest'],
                **state['candidate_manifest']}
    for relative, expected in required.items():
        source = FIXTURE_SOURCE_ROOT / relative
        raw = source.read_bytes()
        if hashlib.sha256(raw).hexdigest() != expected:
            raise AssertionError('Fixed fixture source mismatch: ' + relative)
        destination = root / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(raw)
    for relative in ['tools/textbook', 'work/items/W-GOV-010-coded-authoring/engine']:
        shutil.copytree(ENGINE.parent / relative,
                        root / relative, dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '.git', 'node_modules'))
    return state


class NativeRuntimeCheckpointTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original_hashes = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in INPUTS}

    @classmethod
    def tearDownClass(cls):
        for path, expected in cls.original_hashes.items():
            if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                raise AssertionError('Original input changed: ' + str(path))

    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_native_')
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.store = initialize_fixture(self.root)

    def test_initialization_records_real_fixture_suffix_not_gate_acceptance(self):
        rows = self.store.suffix_events()
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['seq'], 13743)
        self.assertEqual(rows[0]['previous'], FIXED_ANCHOR['head'])
        self.assertEqual(rows[0]['kind'], 'checkpoint_recovered')
        self.assertFalse(rows[0]['payload']['gateAccepted'])
        self.assertEqual(rows[0]['payload']['executor'], 'TEST_FIXTURE/axis_review')
        self.assertGreater(rows[0]['time'], 0)
        core = rows[0]['payload']['core']
        self.assertEqual(len(core['files']), 24)
        for name, expected in core['files'].items():
            self.assertEqual(hashlib.sha256((ENGINE / name).read_bytes()).hexdigest(), expected)
        self.assertTrue(rows[0]['payload']['adoption']['source_ref'].startswith('TEST_FIXTURE/'))
        self.assertFalse(self.store.summary()['fullHistoricalLedgerRecovered'])
        self.assertEqual(self.store.summary()['globalQueueCoverage'], 'UNKNOWN')
        self.assertIsInstance(open_store(self.store.root), CheckpointStore)

    def test_runtime_state_is_seed_plus_suffix_without_prefix_replay(self):
        rt = Runtime(self.store.root, self.root)
        state = rt.state(FIXED_WORK)
        expected = seed_state()
        for cache in ['_status_cache', '_nodes']:
            expected.pop(cache, None)
        self.assertEqual(state, expected)
        rt.append('paused', FIXED_WORK, {'value': True, 'fixtureKind': 'TEST_FIXTURE'})
        self.assertTrue(rt.state(FIXED_WORK)['paused'])
        self.assertFalse(seed_state()['paused'])
        state['users'].clear()
        self.assertEqual(rt.state(FIXED_WORK)['users'], expected['users'])

    def test_typed_history_feedback_and_unknown_global_queue(self):
        rt = Runtime(self.store.root, self.root)
        self.assertEqual(len(history_events(rt, 'team', FIXED_WORK)), 136)
        self.assertEqual(len(history_events(rt, 'authorization', FIXED_WORK)), 139)
        self.assertEqual(len(feedback_payloads(rt, FIXED_WORK)), 1)
        self.assertEqual(queue_coverage(rt)['status'], 'UNKNOWN')
        for operation in [self.store.events, lambda: history_events(rt, 'complete', FIXED_WORK),
                          lambda: rt.state('TEST_FIXTURE_UNKNOWN'), self.store.recover_lock]:
            with self.assertRaises(UnknownContext):
                operation()
        rows = history_events(rt, 'authorization', FIXED_WORK)
        rows[0]['payload'].clear()
        self.assertTrue(history_events(rt, 'authorization', FIXED_WORK)[0]['payload'])

    def test_original_work_and_unadopted_technical_work_cannot_reopen(self):
        for work in [FIXED_WORK, 'TEST_FIXTURE_UNKNOWN_TECH']:
            with self.subTest(work=work), self.assertRaises(CheckpointRejected):
                self.store.append('opened', work, {'fixtureKind': 'TEST_FIXTURE'},
                                  expected=self.store.head)
        self.assertEqual(len(self.store.suffix_events()), 1)

    def test_only_adopted_new_work_has_complete_suffix_history(self):
        work = sorted(NEW_TECHNICAL_WORKS)[0]
        with self.assertRaises(UnknownContext):
            self.store.history_events('complete', work)
        event = self.store.append('opened', work, {'fixtureKind': 'TEST_FIXTURE'},
                                  expected=self.store.head, event_id='TEST_FIXTURE_open')
        self.assertEqual(self.store.history_events('complete', work), [event])
        self.assertIsNone(self.store.state_base(work))
        with self.assertRaises(CheckpointRejected):
            self.store.append('opened', work, {'fixtureKind': 'TEST_FIXTURE'}, expected=self.store.head)

    def test_runtime_cas_uses_observed_snapshot_head(self):
        rt = Runtime(self.store.root, self.root)
        observed = rt.state(FIXED_WORK)
        old_head = rt._head
        self.store.append('paused', FIXED_WORK, {'value': True, 'fixtureKind': 'TEST_FIXTURE'},
                          expected=old_head, event_id='TEST_FIXTURE_concurrent')
        self.assertFalse(observed['paused'])
        with self.assertRaises(Conflict):
            rt.append('paused', FIXED_WORK, {'value': False, 'fixtureKind': 'TEST_FIXTURE'})
        self.assertEqual(len(self.store.suffix_events()), 2)
        self.assertTrue(rt.state(FIXED_WORK)['paused'])

    def test_normal_store_factory_and_checkpoint_marker_cannot_mix(self):
        normal_path = self.root / 'TEST_FIXTURE_ordinary_store'
        normal = open_store(normal_path)
        self.assertIsInstance(normal, Store)
        self.assertEqual(normal.events(), [])
        self.assertEqual(normal.head, '0' * 64)
        with self.assertRaises(CorruptLedger):
            Store(self.store.root)

    def test_reserved_case_variant_cannot_initialize_normal_store(self):
        for index, parts in enumerate([('WORK', 'RECOVERY-CHECKPOINTS', 'QF01-P046-R3'),
                                        ('Work', 'Recovery-Checkpoints', 'Qf01-P046-R3')]):
            selected = self.root / ('TEST_FIXTURE_case_' + str(index)) / Path(*parts)
            with self.subTest(parts=parts), self.assertRaises(CorruptLedger):
                Store(selected)
            self.assertFalse(selected.exists())

    def test_marker_origin_mutation_is_rejected(self):
        marker = self.store.root / 'CHECKPOINT_ORIGIN.json'
        raw = marker.read_bytes()
        marker.write_bytes(raw.replace(b'"gateAccepted":false', b'"gateAccepted":true') + b' ')
        with self.assertRaises(CheckpointRejected):
            CheckpointStore(self.store.root)

    def test_unknown_artifact_and_source_snapshot_coverage(self):
        with self.assertRaises(UnknownContext):
            self.store.get('0' * 64)
        source = self.store.source_snapshot(FIXED_WORK)
        self.assertEqual(source['sourceKind'], 'GIT_RECOVERED_CHECKPOINT_SOURCE')
        expected = seed_state()['plan']['source_manifest']
        self.assertEqual({n: hashlib.sha256(bytes.fromhex(raw)).hexdigest()
                          for n, raw in source['snapshot']['files_hex'].items()}, expected)


class CheckpointScopeDiffTests(unittest.TestCase):
    """Pure path guard tests; no Git process, file, Store or receipt is created."""
    def check(self, paths):
        from adapters import _checkpoint_scope_diff
        return _checkpoint_scope_diff(set(paths))

    def test_adopted_core_repairs_and_work_records_are_allowed_and_sorted(self):
        from checkpoint import CURRENT_REPAIR_AFTER
        paths = set(CURRENT_REPAIR_AFTER) | {'workflow/checkpoint.py', 'workflow/test_checkpoint_runtime.py'}
        for work in NEW_TECHNICAL_WORKS:
            paths.update('work/items/' + work + '/' + name + '.md'
                         for name in ['WORK', 'PROPOSAL', 'ACTION_LOG', 'FINDINGS', 'VERIFICATION'])
        continuation = 'work/items/W-MATH-QF01-P046-R3-continuation-20261122/'
        paths.update(continuation + name + '.md' for name in
                     ['WORK', 'ACTION_LOG', 'FINDINGS', 'VERIFICATION', 'RECOVERY_HANDOFF'])
        self.assertEqual(self.check(paths), sorted(paths))
        self.assertEqual(self.check(set()), [])

    def test_native_origin_and_single_level_json_paths_are_allowed(self):
        prefix = 'work/recovery-checkpoints/qf01-p046-r3/'
        names = ['publisher-contract.json', 'BUILD_AUTHORITY.blob', 'APPROVED_MATERIAL_SEED.json',
                 'NODES.json', 'ORIGIN_SOURCE_PROOF.json', 'ORIGIN_SOURCE_SNAPSHOT.json',
                 'TEAM_PREFIX_SUBSET.json', 'KNOWN_PREFIX_ENVELOPES.json', 'FEEDBACK_PROJECTION.json']
        paths = {prefix + 'CHECKPOINT_ORIGIN.json'} | {prefix + 'origin/' + name for name in names}
        paths.update({prefix + 'events/00013743-TEST_FIXTURE_event.json',
                      prefix + 'artifacts/' + 'a' * 64 + '.json',
                      prefix + 'preflight/TEST_FIXTURE_preflight.json',
                      prefix + 'reports/TEST_FIXTURE_report.json'})
        self.assertEqual(self.check(paths), sorted(paths))

    def test_unadopted_code_governance_and_work_cannot_hide_in_full_diff(self):
        for path in ['tools/textbook/operations.mjs', 'governance/CONSTITUTION.md',
                     'work/items/TEST_FIXTURE_UNADOPTED/WORK.md', 'workflow/production.py',
                     'src/main.tsx', 'public/TEST_FIXTURE.svg', 'package.json',
                     'work/items/W-MATH-QF01-P046-R3-continuation-20261122/PROPOSAL.md']:
            with self.subTest(path=path), self.assertRaisesRegex(Rejected, 'CHECKPOINT_FULL_DIFF_OUTSIDE_ADOPTED_SCOPE'):
                self.check({'workflow/checkpoint.py', path})

    def test_native_path_alias_nested_tmp_and_wrong_object_filename_are_rejected(self):
        prefix = 'work/recovery-checkpoints/qf01-p046-r3/'
        names = ['.writer-lock', 'origin/TEST_FIXTURE_EXTRA.json', 'events/.partial.tmp',
                 'events/TEST_FIXTURE.json', 'events/nested/00013743-TEST_FIXTURE.json',
                 'artifacts/TEST_FIXTURE.json', 'artifacts/' + 'A' * 64 + '.json',
                 'preflight/nested/TEST_FIXTURE.json', 'reports/nested/TEST_FIXTURE.json',
                 'reports/../TEST_FIXTURE.json']
        for name in names:
            with self.subTest(name=name), self.assertRaisesRegex(Rejected, 'CHECKPOINT_FULL_DIFF_OUTSIDE_ADOPTED_SCOPE'):
                self.check({prefix + name})


class CheckpointCandidateProofTests(unittest.TestCase):
    """Bounded R06 guard tests: real temp suffix/state; external Git/compile mocked.

    No claim is made about Git trees, executing Node, team review quality or real
    user approval. All new owner/claim/result/evidence events are TEST_FIXTUREs.
    """
    node_id = 'R06_PATCH@qf01-full-lesson'
    token = 'TEST_FIXTURE_R06_TOKEN'

    @classmethod
    def setUpClass(cls):
        from checkpoint import CURRENT_REPAIR_AFTER, RECOVERY_WORK
        from definitions import instantiate
        from capabilities import implementation_hash
        cls.original_hashes = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in INPUTS}
        cls.master_temp = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_r06_master_')
        cls.addClassCleanup(cls.master_temp.cleanup)
        cls.master = Path(cls.master_temp.name).resolve()
        origin = populate_preflight_fixture(cls.master)
        for relative, expected in CURRENT_REPAIR_AFTER.items():
            raw = (ENGINE.parent / relative).read_bytes()
            if hashlib.sha256(raw).hexdigest() != expected:
                raise AssertionError('Current fixed repair fixture mismatch: ' + relative)
            (cls.master / relative).write_bytes(raw)
        owner_source = cls.master / 'workflow/adapters.py'
        owner_source.parent.mkdir(exist_ok=True)
        shutil.copyfile(ENGINE / 'adapters.py', owner_source)
        store = initialize_fixture(cls.master)
        rt = Runtime(store.root, cls.master)
        # This fixture has no .git. External tree validation is explicitly out of scope.
        with patch('checkpoint.verify_candidate_git', return_value=None):
            proof = rt.checkpoint_preflight(FIXED_WORK, candidate_sha='c' * 40)
            rt.migrate_checkpoint_definition(FIXED_WORK, proof=proof, expected_head=proof['ledgerHead'])
        cls.candidate = 'c' * 40
        primary = rt.state(FIXED_WORK)
        owner_plan = {'work_id': RECOVERY_WORK, 'profile': 'technical', 'command': 'GOVERNANCE',
            'subject': 'math', 'mode': 'textbook', 'source_sha': cls.candidate,
            'parent_work': FIXED_WORK, 'simulation': False, 'rules': {},
            'proposal': {'id': 'TEST_FIXTURE_RECOVERY_PROPOSAL', 'hash': RECOVERY_PROPOSAL_SHA256},
            'source_manifest': manifest(cls.master, ['workflow/adapters.py']),
            'scope': {'paths': ['workflow/adapters.py'], 'preserve': []},
            'protected_manifest': {**primary['plan']['protected_manifest'], **primary['candidate_manifest']},
            'blocks': [{'id': 'TEST_FIXTURE_CORE', 'sources': ['workflow/adapters.py']}]}
        rt.open(owner_plan)
        owner_approval = rt.user(RECOVERY_WORK, 'approve_proposal', 'TEST_FIXTURE_NOT_ACTUAL_APPROVAL',
                                  RECOVERY_PROPOSAL_SHA256, 'TEST_FIXTURE/owner-approval')

        def current_result(work, node_id, done):
            if node_id in done:
                return
            state = rt.state(work)
            nodes = instantiate(state['plan'])
            for dependency in nodes[node_id]['depends_on']:
                current_result(work, dependency, done)
            state = rt.state(work)
            artifact = {'fixtureKind': 'TEST_FIXTURE', 'notActualGateReceipt': True,
                        'node': node_id, 'verdict': 'PASS'}
            if work == RECOVERY_WORK and node_id == 'T02_APPROVAL':
                artifact['user_event'] = owner_approval
            reference = store.put(artifact)
            rt.append('result', work, {'node': node_id, 'artifact': reference,
                'input_hash': rt.input_hash(state, nodes[node_id]), 'verdict': 'PASS',
                'actor': 'TEST_FIXTURE_ONLY', 'fixtureKind': 'TEST_FIXTURE'})
            done.add(node_id)

        done = set()
        for stage in ['S00_RECOVER', 'S01_ROUTE', 'T01_ANALYSIS', 'T02_APPROVAL', 'T03_BUILD', 'T04_VERIFY']:
            current_result(RECOVERY_WORK, stage, done)
        owner = rt.state(RECOVERY_WORK)
        cls.owner_refs = {stage: owner['results'][stage]['artifact'] for stage in
                          ('T01_ANALYSIS', 'T02_APPROVAL', 'T03_BUILD', 'T04_VERIFY')}
        state = rt.state(FIXED_WORK)
        node = instantiate(state['plan'])[cls.node_id]
        done = set()
        for dependency in node['depends_on']:
            current_result(FIXED_WORK, dependency, done)
        state = rt.state(FIXED_WORK)
        input_hash = rt.input_hash(state, node)
        rt.append('claimed', FIXED_WORK, {'node': cls.node_id, 'actor': 'TEST_FIXTURE_ONLY',
            'input_hash': input_hash, 'task_id': digest('TEST_FIXTURE_TASK'), 'token': cls.token,
            'expires_at': time.time() + 3600, 'fixtureKind': 'TEST_FIXTURE'},
            event_id='TEST_FIXTURE_R06_CLAIM')
        cls.compiled = store.get(origin['version_transition']['derivation']['compiledResultRef'])
        impl = implementation_hash(rt)
        cls.receipts = []
        for capability in node['capability_requests']:
            receipt = {'fixtureKind': 'TEST_FIXTURE', 'notActualExecutionReceipt': True,
                'capability': capability, 'node': cls.node_id, 'phase': node['phase'],
                'status': 'PASS', 'input_hash': input_hash, 'implementation_hash': impl,
                'cache_key': digest(['TEST_FIXTURE', capability]), 'output': digest(cls.compiled)}
            reference = store.put(receipt)
            cls.receipts.append(reference)
            rt.append('capability_result', FIXED_WORK, {'capability': capability,
                'cache_key': receipt['cache_key'], 'output': receipt['output'], 'fixtureKind': 'TEST_FIXTURE'})
            rt.append('capability_bound', FIXED_WORK, {'node': cls.node_id, 'receipt': reference,
                'input_hash': input_hash, 'fixtureKind': 'TEST_FIXTURE'})
            if capability == 'construction.compile':
                cls.compile_ref = reference
        cls.verification = rt.evidence(FIXED_WORK, 'check',
            {'status': 'PASS', 'source_sha': cls.candidate, 'checks': ['TEST_FIXTURE_NOT_REAL_QA']},
            source_ref='TEST_FIXTURE/bounded-proof', eid='TEST_FIXTURE_verification')
        cls.git_proof = {'fixtureKind': 'TEST_FIXTURE', 'notActualGitProof': True,
                         'candidateSHA': cls.candidate}

    @classmethod
    def tearDownClass(cls):
        try:
            for path, expected in cls.original_hashes.items():
                if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                    raise AssertionError('Original input changed: ' + str(path))
        finally:
            cls.master_temp.cleanup()

    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_r06_case_')
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve() / 'fixture'
        shutil.copytree(self.master, self.root)
        self.store = CheckpointStore(self.root / 'work/recovery-checkpoints/qf01-p046-r3')
        self.rt = Runtime(self.store.root, self.root)
        self.git_mock = patch('adapters._checkpoint_git_proof', return_value=copy.deepcopy(self.git_proof))
        self.compile_mock = patch('adapters._checkpoint_current_compile', return_value=copy.deepcopy(self.compiled))
        self.git_mock.start(); self.compile_mock.start()
        self.addCleanup(self.git_mock.stop); self.addCleanup(self.compile_mock.stop)

    def reconcile(self, **changes):
        from adapters import reconcile_checkpoint_candidate
        arguments = {'owner_result_refs': copy.deepcopy(self.owner_refs),
                     'compile_receipt_ref': self.compile_ref,
                     'verification_refs': [self.verification], 'expected_head': self.store.head}
        arguments.update(changes)
        return reconcile_checkpoint_candidate(self.rt, FIXED_WORK, self.node_id, self.token, **arguments)

    def validate(self, reference, receipts=None):
        from adapters import validate_checkpoint_candidate_proof
        return validate_checkpoint_candidate_proof(self.rt, FIXED_WORK, self.node_id, reference,
            compile_receipt_refs=[self.compile_ref] if receipts is None else receipts)

    def test_success_retry_and_real_suffix_order_without_repatch(self):
        before = self.store.suffix_events()
        result = self.reconcile()
        proof = result['proof']
        self.assertFalse(proof['patchExecutedAgain'])
        self.assertFalse(proof['originalPatchEventRecovered'])
        self.assertFalse(proof['semanticAcceptance'])
        self.assertFalse(proof['gateAccepted'])
        self.assertEqual(proof['gitProof']['fixtureKind'], 'TEST_FIXTURE')
        self.assertEqual(self.validate(result['proofRef']), proof)
        self.assertEqual(self.reconcile(), result)
        after = self.store.suffix_events()
        self.assertEqual(after[:-1], before)
        self.assertEqual(after[-1]['kind'], 'checkpoint_candidate_reconciled')
        self.assertEqual(after[-1]['previous'], proof['ledgerHead'])
        self.assertEqual(len([e for e in after if e['kind'].startswith('patch_')]), 0)

    def test_tampered_registered_proof_cannot_claim_acceptance(self):
        result = self.reconcile()
        changed = copy.deepcopy(result['proof'])
        changed['semanticAcceptance'] = True
        changed['ledgerHead'] = self.store.head
        reference = self.store.put(changed)
        self.rt.state(FIXED_WORK)
        self.rt.append('checkpoint_candidate_reconciled', FIXED_WORK,
            {'schemaVersion': changed['schemaVersion'], 'proofRef': reference, 'node': self.node_id,
             'inputHash': changed['inputHash'], 'claimTokenSHA256': changed['claimTokenSHA256']})
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_CANDIDATE_PROOF_NOT_CURRENT'):
            self.validate(reference)

    def test_old_t04_reference_and_wrong_owner_proposal_are_rejected(self):
        from checkpoint import RECOVERY_WORK
        refs = copy.deepcopy(self.owner_refs)
        refs['T04_VERIFY'] = seed_state()['results'][self.node_id]['artifact']
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_OWNER_WRONG_RESULT_REF:T04_VERIFY'):
            self.reconcile(owner_result_refs=refs)
        owner = self.rt.state(RECOVERY_WORK)
        plan = copy.deepcopy(owner['plan'])
        plan['proposal']['hash'] = seed_state()['plan']['proposal']['hash']
        self.rt.append('revised', RECOVERY_WORK, {'plan': plan, 'fixtureKind': 'TEST_FIXTURE'})
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_NEW_RECOVERY_OWNER_REQUIRED'):
            self.reconcile()

    def test_expired_claim_is_rejected(self):
        claim = self.rt.state(FIXED_WORK)['claims'][self.node_id]
        claim['expires_at'] = 0
        self.rt.append('claimed', FIXED_WORK, claim)
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_CURRENT_R06_CLAIM_REQUIRED'):
            self.reconcile()

    def test_stale_expected_head_is_rejected(self):
        old = self.store.head
        self.rt.state(FIXED_WORK)
        self.rt.append('TEST_FIXTURE_CHANGED_HEAD', FIXED_WORK, {'fixtureKind': 'TEST_FIXTURE'})
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_RECONCILIATION_EXPECTED_HEAD'):
            self.reconcile(expected_head=old)

    def test_wrong_compile_receipt_input_and_output_are_rejected(self):
        receipt = self.store.get(self.compile_ref)
        receipt['input_hash'] = '0' * 64
        bad_ref = self.store.put(receipt)
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_CURRENT_COMPILE_RECEIPT'):
            self.reconcile(compile_receipt_ref=bad_ref)
        changed = copy.deepcopy(self.compiled)
        changed['TEST_FIXTURE_WRONG_OUTPUT'] = True
        with patch('adapters._checkpoint_current_compile', return_value=changed):
            with self.assertRaisesRegex(Rejected, 'CHECKPOINT_COMPILE_OUTPUT_NOT_REPRODUCED'):
                self.reconcile()

    def test_other_compile_on_retry_and_result_is_rejected(self):
        result = self.reconcile()
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_RESULT_COMPILE_RECEIPT_MISMATCH'):
            self.validate(result['proofRef'], receipts=['0' * 64])
        with self.assertRaises(Rejected):
            self.reconcile(compile_receipt_ref='0' * 64)
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_RECONCILIATION_CHANGED_RETRY'):
            self.reconcile(verification_refs=[self.verification, 'TEST_FIXTURE_OTHER'])

    def test_bound_event_before_actual_claim_is_rejected_with_hash_valid_chain(self):
        rows = self.store.suffix_events()
        claim_index = next(i for i,e in enumerate(rows) if e['id'] == 'TEST_FIXTURE_R06_CLAIM')
        bound_index = next(i for i,e in enumerate(rows) if e['kind'] == 'capability_bound'
                           and e['payload']['receipt'] == self.compile_ref)
        rows.insert(claim_index, rows.pop(bound_index))
        directory = self.store.root / 'events'
        for path in directory.iterdir():
            self.assertTrue(path.resolve().is_relative_to(self.root))
            path.unlink()
        previous = FIXED_ANCHOR['head']
        for seq, event in enumerate(rows, 13743):
            event['seq'], event['previous'] = seq, previous
            event.pop('hash')
            event['hash'] = digest(event)
            previous = event['hash']
            from checkpoint import canonical
            (directory / f'{seq:08d}-{event["id"]}.json').write_bytes(canonical(event) + b'\n')
        self.assertEqual(len(self.store.suffix_events()), len(rows))
        with self.assertRaisesRegex(Rejected, 'CHECKPOINT_CURRENT_COMPILE_BINDING'):
            self.reconcile()

    def test_result_guard_requires_proof_and_rejects_old_transition_proof(self):
        from definitions import instantiate
        from integration import check_result
        node = instantiate(self.rt.state(FIXED_WORK)['plan'])[self.node_id]
        result = {'verdict': 'PASS', 'evidence_refs': [self.verification],
                  'capability_receipts': self.receipts}
        # Only unrelated team collection is stubbed for this focused result guard.
        # Team independence/semantic review is not certified by this unit test.
        with patch('team.check_collection', return_value=None):
            with self.assertRaisesRegex(Rejected, 'checkpoint R06'):
                check_result(self.rt, FIXED_WORK, node, result)
            proof = self.reconcile()
            result['checkpoint_candidate_proof_ref'] = proof['proofRef']
            check_result(self.rt, FIXED_WORK, node, result)
            result['version_transition_proof'] = {'fixtureKind': 'TEST_FIXTURE_OLD_PROOF'}
            with self.assertRaisesRegex(Rejected, '旧owner/patch'):
                check_result(self.rt, FIXED_WORK, node, result)


if __name__ == '__main__':
    unittest.main(verbosity=2)
