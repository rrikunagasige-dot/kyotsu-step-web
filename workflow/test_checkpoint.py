# Formal adapter candidate regression, ported from the independently reviewed
# read/tail prototypes. All generated tails and events remain TEST_FIXTUREs.
# No original Runtime/Store is written and no acceptance receipt is exported.
"""Regression tests for the formal adapter's read-only checkpoint codec.

Every suffix produced here is a TEST_FIXTURE, never a recovered or accepted
event. Tests do not instantiate Store/Runtime or write to the original inputs.
"""
import os
import base64
import copy
import gzip
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from checkpoint import (
    CheckpointRejected, FIXED_ANCHOR, FIXED_SOURCE, FIXED_WORK,
    UnknownContext, canonical, decode_gzip, digest, event_body,
    load_qf01_checkpoint, strict_json, validate_event,
)


WORKSPACE = Path(__file__).resolve().parents[2]
def checkpoint_input(relative, origin_name):
    configured = os.environ.get('QF01_CHECKPOINT_INPUT_ROOT')
    if configured:
        supplied = Path(configured).resolve()
        for path in [supplied / relative, supplied / origin_name, supplied / 'origin' / origin_name]:
            if path.is_file():
                return path
        raise FileNotFoundError('Required checkpoint test input: ' + origin_name)
    native = Path(__file__).resolve().parents[1] / 'work/recovery-checkpoints/qf01-p046-r3/origin' / origin_name
    return native if native.is_file() else WORKSPACE / relative


CONTRACT = checkpoint_input('qf01-work/tools/release/qf01-publish-contract.json', 'publisher-contract.json')
BLOB = checkpoint_input('qf_audit_download/authority-review/BUILD_AUTHORITY.blob', 'BUILD_AUTHORITY.blob')
BASE_STATE_HASH = '44d23caf8aeab339b43e82edb723630704bdd506ac4a5fa234820c72e569f9db'
FOREIGN_WORK = 'TEST_FIXTURE_FOREIGN_WORK'


def test_fixture_event(seq, previous, *, event_id=None, work=FIXED_WORK,
                       kind='TEST_FIXTURE_NOT_A_RUNTIME_OPERATION', **changes):
    """Synthetic hash-valid data only; never submitted as an actual suffix."""
    event = {
        'seq': seq, 'previous': previous,
        'id': event_id or 'TEST_FIXTURE_' + str(seq),
        'time': 1700000000, 'kind': kind, 'work': work,
        'payload': {'fixtureKind': 'TEST_FIXTURE', 'notActualEvent': True},
    }
    event.update(changes)
    event['hash'] = digest(event_body(event))
    return event


def test_fixture_chain(*works):
    previous = FIXED_ANCHOR['head']
    result = []
    for seq, work in enumerate(works, FIXED_ANCHOR['events'] + 1):
        event = test_fixture_event(seq, previous, work=work)
        result.append(event)
        previous = event['hash']
    return result


class StrictInputTests(unittest.TestCase):
    def test_canonical_integer_like_keys_and_unicode(self):
        value = {'2': '二', '10': {'2': 2, '10': 10}, 'a': [True, None]}
        expected = '{"10":{"10":10,"2":2},"2":"二","a":[true,null]}'.encode('utf-8')
        self.assertEqual(canonical(value), expected)
        self.assertEqual(digest(value), hashlib.sha256(expected).hexdigest())

    def test_strict_json_rejects_duplicate_and_escaped_duplicate_keys(self):
        for raw in [b'{"a":1,"a":2}', b'{"a":1,"\\u0061":2}',
                    b'{"outer":{"10":1,"10":2}}']:
            with self.subTest(raw=raw), self.assertRaises(CheckpointRejected):
                strict_json(raw)

    def test_strict_json_rejects_nonfinite_and_overflow_numbers(self):
        for value in [b'NaN', b'Infinity', b'-Infinity', b'1e999', b'-1e999']:
            with self.subTest(value=value), self.assertRaises(CheckpointRejected):
                strict_json(b'{"x":' + value + b'}')

    def test_strict_json_rejects_bad_utf8_bom_trailing_and_surrogate(self):
        for raw in [b'{"x":"\xff"}', b'\xef\xbb\xbf{}', b'{}{}', b'{} garbage',
                    b'{"x":"\\ud800"}']:
            with self.subTest(raw=raw), self.assertRaises(CheckpointRejected):
                strict_json(raw)

    def test_canonical_rejects_nonfinite_python_values(self):
        for value in [float('nan'), float('inf'), -float('inf')]:
            with self.subTest(value=value), self.assertRaises(CheckpointRejected):
                canonical({'x': value})

    def test_bounded_gzip_and_strict_base64(self):
        encoded = base64.b64encode(gzip.compress(b'TEST_FIXTURE')).decode('ascii')
        self.assertEqual(decode_gzip(encoded, 12), b'TEST_FIXTURE')
        for value, limit in [(encoded, 3), (encoded + '\n', 100), ('!!!!', 100),
                             (base64.b64encode(b'not gzip').decode('ascii'), 100)]:
            with self.subTest(value=value, limit=limit), self.assertRaises(CheckpointRejected):
                decode_gzip(value, limit)


class ActualCheckpointTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original_hashes = {p: hashlib.sha256(p.read_bytes()).hexdigest()
                               for p in (CONTRACT, BLOB)}
        cls.view = load_qf01_checkpoint(CONTRACT, BLOB)
        cls.contract = json.loads(CONTRACT.read_text(encoding='utf-8'))
        cls.seed = json.loads(gzip.decompress(base64.b64decode(BLOB.read_bytes())))

    @classmethod
    def tearDownClass(cls):
        for path, expected in cls.original_hashes.items():
            if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                raise AssertionError('Original input changed: ' + str(path))

    def test_actual_fixed_identity_and_all_objects(self):
        state = self.view.state_snapshot(FIXED_WORK)
        self.assertEqual(digest(state), BASE_STATE_HASH)
        self.assertEqual(state['plan']['work_id'], FIXED_WORK)
        self.assertEqual(state['candidate_sha'], FIXED_SOURCE)
        self.assertEqual(self.view.anchor, FIXED_ANCHOR)
        self.assertEqual(len(self.seed['objects']), 299)
        for reference, expected in self.seed['objects'].items():
            with self.subTest(reference=reference):
                self.assertEqual(digest(expected), reference)
                self.assertEqual(self.view.object(reference), expected)

    def test_actual_summary_does_not_claim_runtime_or_acceptance(self):
        summary = self.view.summary()
        self.assertEqual(summary['seedObjects'], 299)
        self.assertEqual(summary['teamPrefixSubsetEvents'], 135)
        self.assertEqual(summary['knownPrefixEnvelopeSubsetEvents'], 138)
        self.assertEqual(summary['feedbackPayloadRows'], 1)
        self.assertTrue(summary['readOnlyPrototype'])
        for key in ['fullHistoricalLedgerRecovered', 'runtimeBootstrapped', 'gateAccepted']:
            self.assertFalse(summary[key])
        self.assertEqual(summary['globalQueueCoverage'], 'UNKNOWN')
        self.assertEqual(summary['openedSourceSnapshot'], 'NOT_IN_CHECKPOINT')
        self.assertNotEqual(summary['candidateSHA'], '291fc1428b883959b381db72514d55b56a4706ca')

    def test_state_return_value_is_deeply_detached(self):
        state = self.view.state_snapshot(FIXED_WORK)
        state['plan']['work_id'] = 'TEST_FIXTURE_MUTATION'
        state['results'].clear()
        state['candidate_manifest'].clear()
        self.assertEqual(digest(self.view.state_snapshot(FIXED_WORK)), BASE_STATE_HASH)

    def test_all_object_return_values_are_detached(self):
        for reference, expected in self.seed['objects'].items():
            value = self.view.object(reference)
            if isinstance(value, dict):
                value.clear()
                value['TEST_FIXTURE_MUTATION'] = True
            elif isinstance(value, list):
                value.clear()
                value.append('TEST_FIXTURE_MUTATION')
            self.assertEqual(self.view.object(reference), expected, reference)

    def test_nodes_and_anchor_return_values_are_detached(self):
        nodes = self.view.nodes()
        expected = digest(nodes)
        first = next(iter(nodes))
        nodes[first].clear()
        nodes.clear()
        self.assertEqual(digest(self.view.nodes()), expected)
        anchor = self.view.anchor
        anchor['events'] = 0
        self.assertEqual(self.view.anchor, FIXED_ANCHOR)

    def test_authentic_team_subset_has_real_envelopes_and_explicit_limits(self):
        subset = self.view.team_prefix_subset(FIXED_WORK)
        self.assertEqual(subset['kind'], 'AUTHENTIC_PREFIX_SUBSET')
        self.assertFalse(subset['completeLedger'])
        events = subset['events']
        self.assertEqual(len(events), 135)
        self.assertEqual((events[0]['seq'], events[-1]['seq']), (12135, 13727))
        self.assertTrue(any(b['seq'] != a['seq'] + 1 for a, b in zip(events, events[1:])))
        self.assertEqual(len({e['id'] for e in events}), len(events))
        for event in events:
            validate_event(event)
            self.assertEqual(event['work'], FIXED_WORK)
        events[0]['payload'].clear()
        events.clear()
        self.assertEqual(len(self.view.team_prefix_subset(FIXED_WORK)['events']), 135)

    def test_feedback_is_detached_payload_projection_without_fake_envelopes(self):
        projection = self.view.feedback_payload_projection(FIXED_WORK)
        self.assertEqual(projection['kind'], 'PAYLOAD_PROJECTION')
        self.assertFalse(projection['eventEnvelopesAvailable'])
        self.assertEqual(len(projection['rows']), 1)
        expected = digest(projection['rows'])
        self.assertTrue({'seq', 'previous', 'hash'}.isdisjoint(projection['rows'][0]))
        projection['rows'][0]['quote'] = 'TEST_FIXTURE_MUTATION'
        projection['rows'].clear()
        self.assertEqual(digest(self.view.feedback_payload_projection(FIXED_WORK)['rows']), expected)

    def test_known_prefix_subset_is_authentic_detached_and_incomplete(self):
        subset = self.view.known_prefix_envelope_subset()
        self.assertEqual(subset['kind'], 'AUTHENTIC_PREFIX_SUBSET')
        self.assertFalse(subset['completeLedger'])
        self.assertEqual(len(subset['events']), 138)
        self.assertEqual(len({e['id'] for e in subset['events']}), 138)
        original = digest(subset['events'])
        for event in subset['events']:
            validate_event(event)
            self.assertEqual(event['work'], FIXED_WORK)
            self.assertLessEqual(event['seq'], FIXED_ANCHOR['events'])
        subset['events'][0]['payload'].clear()
        subset['events'].clear()
        self.assertEqual(digest(self.view.known_prefix_envelope_subset()['events']), original)

    def test_unknown_context_does_not_become_empty_state(self):
        for method in [self.view.state_snapshot, self.view.team_prefix_subset,
                       self.view.feedback_payload_projection]:
            with self.subTest(method=method.__name__), self.assertRaises(UnknownContext):
                method('TEST_FIXTURE_UNKNOWN_WORK')
        for reference in ['0' * 64, 'not-a-hash']:
            with self.subTest(reference=reference), self.assertRaises(UnknownContext):
                self.view.object(reference)
        with self.assertRaises(UnknownContext):
            self.view.global_queue()

    def test_modified_contract_and_blob_copies_are_rejected(self):
        contract_raw, blob_raw = CONTRACT.read_bytes(), BLOB.read_bytes()
        cases = [
            (contract_raw + b'\n', blob_raw),
            (contract_raw.replace(FIXED_SOURCE.encode(), b'0' * 40), blob_raw),
            (contract_raw, blob_raw[:-1]),
            (contract_raw, bytes([blob_raw[0] ^ 1]) + blob_raw[1:]),
        ]
        with tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_') as directory:
            contract_path = Path(directory) / 'contract.json'
            blob_path = Path(directory) / 'authority.blob'
            for index, (contract_bytes, blob_bytes) in enumerate(cases):
                contract_path.write_bytes(contract_bytes)
                blob_path.write_bytes(blob_bytes)
                with self.subTest(case=index), self.assertRaises(CheckpointRejected):
                    load_qf01_checkpoint(contract_path, blob_path)

    def test_zero_length_and_directory_inputs_are_rejected(self):
        with tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_') as directory:
            empty = Path(directory) / 'empty'
            empty.write_bytes(b'')
            for path in [empty, Path(directory)]:
                with self.subTest(path=path.name), self.assertRaises(CheckpointRejected):
                    load_qf01_checkpoint(path, BLOB)

    def test_empty_suffix_starts_at_original_anchor(self):
        suffix = self.view.verify_suffix([])
        self.assertEqual(suffix.head, FIXED_ANCHOR['head'])
        self.assertEqual(suffix.last_seq, 13742)
        self.assertEqual(suffix.events(FIXED_WORK), [])
        self.assertFalse(suffix.summary()['runtimeAccepted'])
        self.assertFalse(suffix.summary()['semanticValidityVerified'])

    def test_valid_synthetic_all_work_chain_is_verified_before_projection(self):
        rows = test_fixture_chain(FOREIGN_WORK, FIXED_WORK, FOREIGN_WORK)
        suffix = self.view.verify_suffix(rows)
        self.assertEqual([e['seq'] for e in suffix.events()], [13743, 13744, 13745])
        self.assertEqual([e['seq'] for e in suffix.events(FIXED_WORK)], [13744])
        self.assertEqual([e['seq'] for e in suffix.events(FOREIGN_WORK)], [13743, 13745])
        self.assertEqual(suffix.head, rows[-1]['hash'])
        self.assertEqual(suffix.last_seq, 13745)
        self.assertTrue(suffix.summary()['hashChainVerified'])
        self.assertFalse(suffix.summary()['semanticValidityVerified'])
        self.assertFalse(suffix.summary()['runtimeAccepted'])
        self.assertEqual(suffix.summary()['prefixNonceCoverage'], 'INCOMPLETE')
        with self.assertRaises(UnknownContext):
            self.view.state_snapshot(FOREIGN_WORK)
        with self.assertRaises(UnknownContext):
            suffix.events('TEST_FIXTURE_UNOBSERVED_WORK')

    def test_bad_foreign_event_cannot_be_filtered_out(self):
        rows = test_fixture_chain(FOREIGN_WORK, FIXED_WORK)
        rows[0]['payload']['tampered'] = True
        with self.assertRaisesRegex(CheckpointRejected, 'EVENT_CONTENT_HASH'):
            self.view.verify_suffix(rows)

    def test_suffix_inputs_and_return_values_are_deeply_detached(self):
        rows = test_fixture_chain(FIXED_WORK, FOREIGN_WORK)
        expected = copy.deepcopy(rows)
        suffix = self.view.verify_suffix(rows)
        rows[0]['payload'].clear()
        rows.clear()
        returned = suffix.events()
        returned[0]['payload'].clear()
        returned.clear()
        self.assertEqual(suffix.events(), expected)

    def test_rejected_suffix_leaves_checkpoint_and_next_read_unchanged(self):
        rows = test_fixture_chain(FIXED_WORK, FIXED_WORK)
        rows[-1]['payload']['tampered'] = True
        before = copy.deepcopy(rows)
        with self.assertRaises(CheckpointRejected):
            self.view.verify_suffix(rows)
        self.assertEqual(rows, before)
        self.assertEqual(digest(self.view.state_snapshot(FIXED_WORK)), BASE_STATE_HASH)
        self.assertEqual(self.view.verify_suffix([]).head, FIXED_ANCHOR['head'])

    def test_suffix_requires_list(self):
        for value in [None, {}, (), '[]']:
            with self.subTest(value=value), self.assertRaises(CheckpointRejected):
                self.view.verify_suffix(value)

    def test_sequence_gap_reorder_and_old_prefix_are_rejected(self):
        good = test_fixture_chain(FIXED_WORK, FOREIGN_WORK)
        cases = [good[1:], list(reversed(good)), [good[0], good[0]],
                 [test_fixture_event(13742, FIXED_ANCHOR['head'])],
                 [test_fixture_event(13744, FIXED_ANCHOR['head'])]]
        for index, rows in enumerate(cases):
            with self.subTest(case=index), self.assertRaises(CheckpointRejected):
                self.view.verify_suffix(rows)

    def test_wrong_previous_is_rejected_even_with_recomputed_hash(self):
        event = test_fixture_event(13743, '0' * 64)
        with self.assertRaisesRegex(CheckpointRejected, 'SUFFIX_PREVIOUS_MISMATCH'):
            self.view.verify_suffix([event])

    def test_duplicate_suffix_id_is_rejected_even_in_other_work(self):
        rows = test_fixture_chain(FIXED_WORK, FOREIGN_WORK)
        rows[1]['id'] = rows[0]['id']
        rows[1]['hash'] = digest(event_body(rows[1]))
        with self.assertRaisesRegex(CheckpointRejected, 'DUPLICATE_KNOWN_EVENT_ID'):
            self.view.verify_suffix(rows)

    def test_known_team_prefix_id_cannot_be_reused(self):
        old = self.view.team_prefix_subset(FIXED_WORK)['events'][0]
        event = test_fixture_event(13743, FIXED_ANCHOR['head'], event_id=old['id'])
        with self.assertRaisesRegex(CheckpointRejected, 'DUPLICATE_KNOWN_EVENT_ID'):
            self.view.verify_suffix([event])

    def test_known_user_and_migration_prefix_ids_cannot_be_reused(self):
        authority = self.contract['currentNativeAuthority']
        migration = json.loads(authority['approvalCoverageMigration']['canonicalJSON'])
        original = json.loads(self.contract['r3Authorization']['originalR3UserEvent']['canonicalJSON'])
        for old in [migration['migrationEvent'], migration['originalUserEvent'], original]:
            with self.subTest(prefix_event=old['id']):
                event = test_fixture_event(13743, FIXED_ANCHOR['head'], event_id=old['id'], work=FOREIGN_WORK)
                with self.assertRaisesRegex(CheckpointRejected, 'DUPLICATE_KNOWN_EVENT_ID'):
                    self.view.verify_suffix([event])

    def test_bool_float_and_unsafe_sequence_types_are_rejected(self):
        for value in [True, False, 13743.0, '13743', 0, -1, 2**53]:
            event = test_fixture_event(value, FIXED_ANCHOR['head'])
            with self.subTest(value=value), self.assertRaisesRegex(CheckpointRejected, 'EVENT_SEQ_TYPE'):
                self.view.verify_suffix([event])

    def test_invalid_event_envelope_fields_are_rejected(self):
        cases = [dict(payload=[]), dict(work=''), dict(kind=''), dict(id='a/b'),
                 dict(previous='x' * 64), dict(time=True), dict(time=-1)]
        for changes in cases:
            event = test_fixture_event(13743, FIXED_ANCHOR['head'])
            event.update(changes)
            event['hash'] = digest(event_body(event))
            with self.subTest(changes=changes), self.assertRaises(CheckpointRejected):
                self.view.verify_suffix([event])
        for changes in ['extra', 'missing']:
            event = test_fixture_chain(FIXED_WORK)[0]
            if changes == 'extra':
                event['testExtra'] = True
            else:
                del event['time']
            with self.subTest(changes=changes), self.assertRaises(CheckpointRejected):
                self.view.verify_suffix([event])

    def test_extreme_time_is_rejected_as_input_error(self):
        event = test_fixture_event(13743, FIXED_ANCHOR['head'], time=10**1000)
        with self.assertRaisesRegex(CheckpointRejected, 'EVENT_TIME'):
            self.view.verify_suffix([event])

    def test_byte_suffix_requires_native_canonical_bytes(self):
        event = test_fixture_chain(FIXED_WORK)[0]
        for raw in [canonical(event), canonical(event) + b'\n']:
            self.assertEqual(self.view.verify_suffix([raw]).events(), [event])
        bad = [json.dumps(event).encode(), b' ' + canonical(event), canonical(event) + b'\n\n',
               canonical(event).replace(b'"seq":13743', b'"seq":13743,"seq":13743')]
        for raw in bad:
            with self.subTest(raw=raw[:60]), self.assertRaises(CheckpointRejected):
                self.view.verify_suffix([raw])

    def test_hash_valid_user_fixture_does_not_prove_semantic_approval(self):
        event = test_fixture_event(13743, FIXED_ANCHOR['head'], kind='user', payload={
            'fixtureKind': 'TEST_FIXTURE', 'notActualEvent': True,
            'intent': 'approve_proposal', 'quote': 'TEST_FIXTURE_NOT_USER_APPROVAL',
        })
        summary = self.view.verify_suffix([event]).summary()
        self.assertTrue(summary['hashChainVerified'])
        self.assertFalse(summary['semanticValidityVerified'])
        self.assertFalse(summary['runtimeAccepted'])




"""Regression tests of the anchored tail candidate, only in TEST_FIXTURE dirs.

All generated operations/events/artifacts are TEST_FIXTUREs, not recovered
history, user approval, native Runtime submissions, or formal Gate evidence.
"""
import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

from checkpoint import CheckpointTail, TailConflict
from checkpoint import (
    CheckpointRejected, FIXED_ANCHOR, FIXED_SOURCE, FIXED_WORK,
    UnknownContext, canonical, digest, load_qf01_checkpoint,
)


HERE = Path(__file__).resolve().parent
WORKSPACE = HERE.parents[1]
CONTRACT = checkpoint_input('qf01-work/tools/release/qf01-publish-contract.json', 'publisher-contract.json')
BLOB = checkpoint_input('qf_audit_download/authority-review/BUILD_AUTHORITY.blob', 'BUILD_AUTHORITY.blob')
FIXTURE_KIND = 'TEST_FIXTURE_NOT_A_RUNTIME_OPERATION'


def fixture_payload(label='one'):
    return {'fixtureKind': 'TEST_FIXTURE', 'notActualEvent': True,
            'label': label, 'nested': {'values': [1, 2]}}


class ActualCheckpointTailTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original_hashes = {path: hashlib.sha256(path.read_bytes()).hexdigest()
                               for path in (CONTRACT, BLOB)}
        cls.view = load_qf01_checkpoint(CONTRACT, BLOB)

    @classmethod
    def tearDownClass(cls):
        for path, expected in cls.original_hashes.items():
            if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                raise AssertionError('Original input changed: ' + str(path))

    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_tail_')
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name).resolve()
        self.root = self.directory / 'TEST_FIXTURE_tail'
        self.tail = CheckpointTail.create(self.root, self.view)

    def append_fixture(self, *, tail=None, label='one', event_id=None, expected=None,
                       work=FIXED_WORK, kind=FIXTURE_KIND):
        target = tail or self.tail
        return target.append(kind, work, fixture_payload(label),
                             expected=target.head if expected is None else expected,
                             event_id=event_id or 'TEST_FIXTURE_' + label)

    def symlink(self, link, target, *, directory=False):
        try:
            link.symlink_to(target, target_is_directory=directory)
        except (OSError, NotImplementedError) as error:
            self.skipTest('OS cannot create TEST_FIXTURE symlink: ' + str(error))

    def junction(self, link, target):
        if os.name != 'nt':
            self.skipTest('Windows junction boundary')
        import _winapi
        try:
            _winapi.CreateJunction(str(target), str(link))
        except OSError as error:
            self.skipTest('OS cannot create TEST_FIXTURE junction: ' + str(error))
        self.addCleanup(lambda: os.rmdir(link) if link.exists() else None)

    def test_create_binds_actual_checkpoint_without_original_prefix(self):
        self.assertEqual(self.tail.events(), [])
        self.assertEqual(self.tail.head, FIXED_ANCHOR['head'])
        origin = json.loads((self.root / 'CHECKPOINT_ORIGIN.json').read_bytes())
        self.assertEqual(origin['anchor'], FIXED_ANCHOR)
        self.assertEqual(origin['sourceSHA'], FIXED_SOURCE)
        self.assertEqual(origin['work'], FIXED_WORK)
        self.assertTrue(origin['missingHistoricalPrefix'])
        self.assertFalse(origin['semanticAdoption'])
        summary = self.tail.summary()
        self.assertEqual(summary['lastSeq'], 13742)
        self.assertFalse(summary['semanticValidityVerified'])
        self.assertFalse(summary['runtimeAccepted'])
        self.assertFalse(summary['originalPrefixAvailable'])
        self.assertEqual(summary['globalQueueCoverage'], 'UNKNOWN')
        self.assertEqual(summary['staleLockRecovery'], 'UNSUPPORTED')

    def test_append_two_events_and_reopen_existing_tail(self):
        first = self.append_fixture(label='one')
        second = self.append_fixture(label='two')
        self.assertEqual(first['seq'], 13743)
        self.assertEqual(first['previous'], FIXED_ANCHOR['head'])
        self.assertEqual(second['seq'], 13744)
        self.assertEqual(second['previous'], first['hash'])
        reopened = CheckpointTail(self.root, self.view)
        self.assertEqual(reopened.events(), [first, second])
        self.assertEqual(reopened.head, second['hash'])
        self.assertFalse((self.root / '.writer-lock').exists())
        for event in [first, second]:
            self.assertEqual(event['payload']['fixtureKind'], 'TEST_FIXTURE')
            filename = f'{event["seq"]:08d}-{event["id"]}.json'
            self.assertEqual((self.root / 'events' / filename).read_bytes(), canonical(event) + b'\n')

    def test_cas_stale_head_rejects_without_second_append(self):
        first = self.append_fixture()
        with self.assertRaisesRegex(TailConflict, 'TAIL_EXPECTED_HEAD_CHANGED'):
            self.append_fixture(label='two', expected=FIXED_ANCHOR['head'])
        self.assertEqual(self.tail.events(), [first])
        self.assertFalse((self.root / '.writer-lock').exists())

    def test_expected_head_is_required_and_typed(self):
        for expected in [None, True, '', 'not-a-hash', 'g' * 64]:
            with self.subTest(expected=expected), self.assertRaisesRegex(CheckpointRejected, 'EXPECTED_HEAD_REQUIRED'):
                self.tail.append(FIXTURE_KIND, FIXED_WORK, fixture_payload(), expected=expected)
        self.assertEqual(self.tail.events(), [])

    def test_event_id_length_and_invalid_values(self):
        for event_id in ['', False, 0, 'x' * 129, '../escape', 'has space']:
            with self.subTest(event_id=event_id), self.assertRaisesRegex(CheckpointRejected, 'APPEND_EVENT_ID'):
                self.tail.append(FIXTURE_KIND, FIXED_WORK, fixture_payload(),
                                 expected=self.tail.head, event_id=event_id)
        event = self.append_fixture(event_id='x' * 128)
        self.assertEqual(len(event['id']), 128)

    def test_event_byte_limit_includes_newline_at_exact_boundary(self):
        # Freeze only the timestamp for exact serialized size; the OS lock is real.
        with patch('checkpoint.time.time', return_value=1700000000):
            sample = self.append_fixture(label='size_sample')
            sample_path = next((self.root / 'events').iterdir())
            size = len(canonical(sample) + b'\n')
            sample_path.unlink()
            with patch('checkpoint.MAX_EVENT_BYTES', size - 1):
                with self.assertRaisesRegex(CheckpointRejected, 'TAIL_EVENT_SIZE_LIMIT'):
                    self.append_fixture(label='size_sample')
                self.assertEqual(list((self.root / 'events').iterdir()), [])
                self.assertFalse((self.root / '.writer-lock').exists())
            with patch('checkpoint.MAX_EVENT_BYTES', size):
                self.assertEqual(self.append_fixture(label='size_sample'), sample)
                self.assertEqual(len(self.tail.events()), 1)

    def test_artifact_byte_limit_includes_newline_at_exact_boundary(self):
        value = fixture_payload('size')
        size = len(canonical(value) + b'\n')
        with patch('checkpoint.MAX_ARTIFACT_BYTES', size - 1):
            with self.assertRaisesRegex(CheckpointRejected, 'TAIL_ARTIFACT_SIZE_LIMIT'):
                self.tail.put(value)
            self.assertEqual(list((self.root / 'artifacts').iterdir()), [])
            self.assertFalse((self.root / '.writer-lock').exists())
        with patch('checkpoint.MAX_ARTIFACT_BYTES', size):
            reference = self.tail.put(value)
            self.assertEqual(self.tail.get(reference), value)

    def test_same_id_same_content_is_idempotent_at_current_cas(self):
        first = self.append_fixture()
        self.assertEqual(self.append_fixture(expected=first['hash']), first)
        self.assertEqual(len(self.tail.events()), 1)
        with self.assertRaises(TailConflict):
            self.append_fixture(expected=FIXED_ANCHOR['head'])

    def test_same_id_different_content_or_work_is_rejected(self):
        first = self.append_fixture()
        for work, payload in [(FIXED_WORK, fixture_payload('changed')),
                              ('TEST_FIXTURE_OTHER_WORK', fixture_payload())]:
            with self.subTest(work=work), self.assertRaisesRegex(TailConflict, 'TAIL_EVENT_ID_REUSED_WITH_DIFFERENT_CONTENT'):
                self.tail.append(FIXTURE_KIND, work, payload,
                                 expected=first['hash'], event_id=first['id'])
        self.assertEqual(self.tail.events(), [first])

    def test_known_prefix_ids_are_rejected_without_writing(self):
        known = self.view.known_prefix_envelope_subset()['events']
        for event in [known[0], *[e for e in known if e['kind'] in ('user', 'approval_coverage_migrated')]]:
            with self.subTest(prefix_id=event['id']), self.assertRaisesRegex(CheckpointRejected, 'DUPLICATE_KNOWN_EVENT_ID'):
                self.append_fixture(event_id=event['id'])
        self.assertEqual(self.tail.events(), [])
        self.assertEqual(list((self.root / 'events').iterdir()), [])

    def test_original_work_cannot_be_opened_again(self):
        with self.assertRaisesRegex(CheckpointRejected, 'CANNOT_REOPEN_CHECKPOINT_WORK'):
            self.append_fixture(kind='opened')
        self.assertEqual(self.tail.events(), [])

    def test_other_work_fixture_does_not_establish_known_state(self):
        event = self.append_fixture(work='TEST_FIXTURE_OTHER_WORK', kind='opened')
        self.assertEqual(self.tail.events(), [event])
        with self.assertRaises(UnknownContext):
            self.view.state_snapshot('TEST_FIXTURE_OTHER_WORK')
        self.assertFalse(self.tail.summary()['runtimeAccepted'])

    def test_append_payload_and_return_values_are_detached(self):
        payload = fixture_payload()
        expected = copy.deepcopy(payload)
        event = self.tail.append(FIXTURE_KIND, FIXED_WORK, payload,
                                 expected=self.tail.head, event_id='TEST_FIXTURE_detached')
        payload['nested']['values'].clear()
        event['payload']['nested']['values'].append(99)
        returned = self.tail.events()
        returned[0]['payload']['nested'].clear()
        self.assertEqual(self.tail.events()[0]['payload'], expected)

    def test_unknown_artifact_and_invalid_reference_are_rejected(self):
        with self.assertRaises(UnknownContext):
            self.tail.get('0' * 64)
        for reference in ['../escape', 'g' * 64, '', True]:
            with self.subTest(reference=reference), self.assertRaises(CheckpointRejected):
                self.tail.get(reference)

    def test_put_get_content_hash_and_reopen(self):
        value = fixture_payload('artifact')
        expected = copy.deepcopy(value)
        reference = self.tail.put(value)
        self.assertEqual(reference, digest(expected))
        value['nested']['values'].clear()
        self.assertEqual(self.tail.get(reference), expected)
        returned = self.tail.get(reference)
        returned['nested']['values'].clear()
        self.assertEqual(CheckpointTail(self.root, self.view).get(reference), expected)
        self.assertEqual(self.tail.put(expected), reference)
        self.assertEqual(len(list((self.root / 'artifacts').iterdir())), 1)
        self.assertEqual(self.tail.events(), [])

    def test_seed_artifact_fallback_and_no_redundant_copy(self):
        reference = self.view.state_snapshot(FIXED_WORK)['results']['R05_APPROVAL@qf01-full-lesson']['artifact']
        expected = self.view.object(reference)
        self.assertEqual(self.tail.get(reference), expected)
        self.assertEqual(self.tail.put(expected), reference)
        self.assertFalse((self.root / 'artifacts' / (reference + '.json')).exists())

    def test_corrupt_artifact_is_rejected_and_never_overwritten(self):
        expected = fixture_payload('artifact')
        reference = self.tail.put(expected)
        path = self.root / 'artifacts' / (reference + '.json')
        corrupt = canonical(fixture_payload('TAMPERED_TEST_FIXTURE')) + b'\n'
        path.write_bytes(corrupt)
        for operation in [lambda: self.tail.get(reference), lambda: self.tail.put(expected)]:
            with self.assertRaisesRegex(CheckpointRejected, 'TAIL_ARTIFACT_CONTENT_HASH'):
                operation()
        self.assertEqual(path.read_bytes(), corrupt)

    def test_artifact_noncanonical_and_duplicate_json_is_rejected(self):
        value = fixture_payload('artifact')
        reference = self.tail.put(value)
        path = self.root / 'artifacts' / (reference + '.json')
        for raw in [json.dumps(value).encode(), canonical(value) + b'\n\n',
                    canonical(value).replace(b'"notActualEvent":true', b'"notActualEvent":true,"notActualEvent":true')]:
            path.write_bytes(raw)
            with self.subTest(raw=raw[:30]), self.assertRaises(CheckpointRejected):
                self.tail.get(reference)

    def test_existing_namespace_and_native_shaped_directory_are_not_overwritten(self):
        marker = self.root / 'TEST_FIXTURE_KEEP'
        marker.write_bytes(b'TEST_FIXTURE_KEEP')
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_DESTINATION_MUST_BE_NEW'):
            CheckpointTail.create(self.root, self.view)
        self.assertEqual(marker.read_bytes(), b'TEST_FIXTURE_KEEP')
        native_shaped = self.directory / 'TEST_FIXTURE_native_shaped_only'
        native_shaped.mkdir()
        (native_shaped / 'events').mkdir()
        (native_shaped / 'artifacts').mkdir()
        with self.assertRaises(CheckpointRejected):
            CheckpointTail.create(native_shaped, self.view)
        self.assertFalse((native_shaped / 'CHECKPOINT_ORIGIN.json').exists())

    def test_origin_tampering_is_rejected_on_live_instance_and_reopen(self):
        path = self.root / 'CHECKPOINT_ORIGIN.json'
        origin = json.loads(path.read_bytes())
        origin['anchor']['events'] -= 1
        path.write_bytes(canonical(origin) + b'\n')
        for operation in [self.tail.events, lambda: CheckpointTail(self.root, self.view),
                          lambda: self.append_fixture(), lambda: self.tail.put(fixture_payload())]:
            with self.assertRaisesRegex(CheckpointRejected, 'TAIL_ORIGIN_CHANGED'):
                operation()
        self.assertEqual(list((self.root / 'events').iterdir()), [])

    def test_partial_event_tmp_blocks_reads_and_append(self):
        partial = self.root / 'events' / '.TEST_FIXTURE_partial.tmp'
        partial.write_bytes(b'{"fixtureKind":"TEST_FIXTURE"')
        for operation in [self.tail.events, lambda: self.append_fixture()]:
            with self.assertRaisesRegex(CheckpointRejected, 'TAIL_PARTIAL_OR_UNEXPECTED_FILE'):
                operation()
        self.assertTrue(partial.exists())
        self.assertEqual(len(list((self.root / 'events').iterdir())), 1)

    def test_failed_link_leaves_partial_tmp_and_blocks_retry(self):
        with patch('checkpoint.os.link', side_effect=OSError('TEST_FIXTURE simulated link failure')):
            with self.assertRaises(OSError):
                self.append_fixture()
        self.assertFalse((self.root / '.writer-lock').exists())
        self.assertEqual(len(list((self.root / 'events').glob('*.tmp'))), 1)
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_PARTIAL_OR_UNEXPECTED_FILE'):
            self.append_fixture()

    def test_tampered_event_filename_or_content_is_rejected(self):
        event = self.append_fixture()
        original = self.root / 'events' / f'{event["seq"]:08d}-{event["id"]}.json'
        renamed = original.with_name(f'{event["seq"]:08d}-TEST_FIXTURE_WRONG_NAME.json')
        original.rename(renamed)
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_EVENT_FILENAME_MISMATCH'):
            self.tail.events()
        renamed.rename(original)
        event['payload']['label'] = 'TEST_FIXTURE_TAMPER'
        original.write_bytes(canonical(event) + b'\n')
        with self.assertRaisesRegex(CheckpointRejected, 'EVENT_CONTENT_HASH'):
            self.tail.events()

    def test_existing_lock_fails_closed_without_pid_guess_or_removal(self):
        lock = self.root / '.writer-lock'
        fixture = canonical({'fixtureKind': 'TEST_FIXTURE', 'pid': 99999999, 'token': 'keep'})
        lock.write_bytes(fixture)
        for operation in [lambda: self.append_fixture(), lambda: self.tail.put(fixture_payload())]:
            with self.assertRaisesRegex(TailConflict, 'TAIL_LOCK_PRESENT_NO_LIVENESS_GUESS'):
                operation()
        self.assertEqual(lock.read_bytes(), fixture)
        self.assertEqual(self.tail.events(), [])

    def test_changed_lock_owner_is_preserved_and_rejected(self):
        lock = self.root / '.writer-lock'
        replacement = b'TEST_FIXTURE_DIFFERENT_OWNER'
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_LOCK_OWNERSHIP_CHANGED'):
            with self.tail._exclusive():
                lock.write_bytes(replacement)
        self.assertEqual(lock.read_bytes(), replacement)

    def test_symlink_root_is_rejected(self):
        alias = self.directory / 'TEST_FIXTURE_alias'
        self.symlink(alias, self.root, directory=True)
        with self.assertRaises(CheckpointRejected):
            CheckpointTail(alias, self.view)
        with self.assertRaises(CheckpointRejected):
            CheckpointTail.create(alias, self.view)

    def test_symlink_event_is_rejected(self):
        event = self.append_fixture()
        path = next((self.root / 'events').iterdir())
        target = self.directory / 'TEST_FIXTURE_external_event.json'
        target.write_bytes(canonical(event) + b'\n')
        path.unlink()
        self.symlink(path, target)
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_PARTIAL_OR_UNEXPECTED_FILE'):
            self.tail.events()

    def test_symlink_artifact_is_rejected_without_target_modification(self):
        value = fixture_payload('artifact')
        reference = digest(value)
        target = self.directory / 'TEST_FIXTURE_external_artifact.json'
        raw = canonical(value) + b'\n'
        target.write_bytes(raw)
        link = self.root / 'artifacts' / (reference + '.json')
        self.symlink(link, target)
        for operation in [lambda: self.tail.get(reference), lambda: self.tail.put(value)]:
            with self.assertRaisesRegex(CheckpointRejected, 'SYMLINK_INPUT'):
                operation()
        self.assertEqual(target.read_bytes(), raw)

    def test_swapped_child_directory_symlink_is_rejected(self):
        child = self.root / 'events'
        target = self.directory / 'TEST_FIXTURE_other_events'
        target.mkdir()
        child.rmdir()
        self.symlink(child, target, directory=True)
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_CHILD_CHANGED'):
            self.tail.events()
        self.assertEqual(list(target.iterdir()), [])

    def test_child_junction_is_rejected_after_init_and_on_reopen(self):
        child = self.root / 'events'
        target = self.directory / 'TEST_FIXTURE_junction_events'
        target.mkdir()
        child.rmdir()
        self.junction(child, target)
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_CHILD_CHANGED'):
            self.tail.events()
        with self.assertRaisesRegex(CheckpointRejected, 'TAIL_CHILD_KIND'):
            CheckpointTail(self.root, self.view)
        self.assertEqual(list(target.iterdir()), [])

    def test_root_replaced_by_junction_is_rejected_after_init(self):
        moved = self.directory / 'TEST_FIXTURE_original_tail_moved'
        self.root.rename(moved)
        self.junction(self.root, moved)
        for operation in [self.tail.events, lambda: self.tail.put(fixture_payload()),
                          lambda: CheckpointTail(self.root, self.view)]:
            with self.assertRaises(CheckpointRejected):
                operation()
        self.assertEqual(list((moved / 'events').iterdir()), [])
        self.assertEqual(list((moved / 'artifacts').iterdir()), [])

    def test_real_subprocesses_compete_for_one_expected_head(self):
        worker = r'''
import json, sys, time
from pathlib import Path
from checkpoint import load_qf01_checkpoint, FIXED_WORK
from checkpoint import CheckpointTail, TailConflict
root, contract, blob, ready, go, eid, expected = sys.argv[1:]
view = load_qf01_checkpoint(contract, blob)
tail = CheckpointTail(root, view)
Path(ready).write_text('TEST_FIXTURE_READY', encoding='utf-8')
deadline = time.monotonic() + 15
while not Path(go).exists():
    if time.monotonic() > deadline:
        raise RuntimeError('TEST_FIXTURE_BARRIER_TIMEOUT')
    time.sleep(0.01)
try:
    event = tail.append('TEST_FIXTURE_CONCURRENT', FIXED_WORK,
                        {'fixtureKind': 'TEST_FIXTURE', 'notActualEvent': True},
                        expected=expected, event_id=eid)
    print(json.dumps({'outcome': 'appended', 'id': event['id'], 'seq': event['seq']}))
except TailConflict as error:
    print(json.dumps({'outcome': 'conflict', 'reason': str(error)}))
'''
        go = self.directory / 'TEST_FIXTURE_GO'
        workers, ready_paths = [], []
        try:
            for index in range(2):
                ready = self.directory / ('TEST_FIXTURE_READY_' + str(index))
                ready_paths.append(ready)
                command = [sys.executable, '-B', '-c', worker, str(self.root), str(CONTRACT),
                           str(BLOB), str(ready), str(go), 'TEST_FIXTURE_WORKER_' + str(index),
                           FIXED_ANCHOR['head']]
                workers.append(subprocess.Popen(command, cwd=HERE, stdout=subprocess.PIPE,
                                                stderr=subprocess.PIPE, text=True))
            deadline = time.monotonic() + 20
            while not all(path.exists() for path in ready_paths):
                self.assertTrue(all(process.poll() is None for process in workers),
                                'TEST_FIXTURE worker exited before barrier')
                self.assertLess(time.monotonic(), deadline, 'TEST_FIXTURE barrier timeout')
                time.sleep(0.01)
            go.write_text('TEST_FIXTURE_GO', encoding='utf-8')
            outcomes = []
            for process in workers:
                stdout, stderr = process.communicate(timeout=20)
                self.assertEqual(process.returncode, 0, stderr)
                outcomes.append(json.loads(stdout))
            self.assertCountEqual([row['outcome'] for row in outcomes], ['appended', 'conflict'])
            events = CheckpointTail(self.root, self.view).events()
            self.assertEqual(len(events), 1)
            self.assertEqual(events[0]['seq'], 13743)
            self.assertEqual(events[0]['previous'], FIXED_ANCHOR['head'])
            self.assertEqual(events[0]['id'], next(row['id'] for row in outcomes if row['outcome'] == 'appended'))
            self.assertFalse((self.root / '.writer-lock').exists())
        finally:
            for process in workers:
                if process.poll() is None:
                    process.kill()
                process.communicate()




class NearbyRepairRecordTests(unittest.TestCase):
    """Pure schema boundaries; hashes are TEST_FIXTURE values, not Git pins."""
    def record(self):
        from checkpoint import (CURRENT_REPAIR_AFTER,NEARBY_REPAIR_BASELINE,
            NEARBY_REPAIR_PRODUCT_PATHS,NEARBY_REPAIR_PROPOSAL_SHA256,
            NEARBY_REPAIR_ADOPTION_QUOTE,NEARBY_REPAIR_ADOPTION_CALL_ID)
        return {'schemaVersion':'qf01-nearby-visibility-supplement/1',
            'proposalSHA256':NEARBY_REPAIR_PROPOSAL_SHA256,'evidenceRef':'TEST_FIXTURE_D03',
            'transcriptionSHA256':digest('TEST_FIXTURE_NOT_ACTUAL_ADOPTION'),
            'quote':NEARBY_REPAIR_ADOPTION_QUOTE,'source_ref':'request_user_input_async/'+NEARBY_REPAIR_ADOPTION_CALL_ID,
            'verification_level':'conversation_transcribed','baselineSourceSHA':NEARBY_REPAIR_BASELINE,
            'candidateBeforeSHA':NEARBY_REPAIR_BASELINE,'candidateAfterSHA':'c'*40,
            'allowedProductPaths':list(NEARBY_REPAIR_PRODUCT_PATHS),
            'beforeRepair':{p:CURRENT_REPAIR_AFTER[p] for p in NEARBY_REPAIR_PRODUCT_PATHS},
            'afterRepair':{p:digest(['TEST_FIXTURE_AFTER',p]) for p in NEARBY_REPAIR_PRODUCT_PATHS},
            'definitionHash':digest('TEST_FIXTURE_DEFINITION'),'implementationHash':digest('TEST_FIXTURE_IMPLEMENTATION'),
            'checkpointEpoch':digest('TEST_FIXTURE_EPOCH')}

    def test_exact_record_is_detached_and_original_five_map_does_not_change(self):
        from checkpoint import CURRENT_REPAIR_AFTER,validate_nearby_repair_record
        before=copy.deepcopy(CURRENT_REPAIR_AFTER);record=self.record()
        accepted=validate_nearby_repair_record(record,epoch=record['checkpointEpoch'])
        self.assertEqual(accepted,record);accepted['afterRepair'].clear()
        self.assertTrue(record['afterRepair']);self.assertEqual(CURRENT_REPAIR_AFTER,before)

    def test_wrong_adoption_epoch_baseline_unknown_fields_and_third_path_are_rejected(self):
        from checkpoint import validate_nearby_repair_record
        for key,value in [('proposalSHA256','0'*64),('source_ref','TEST_FIXTURE_OTHER_CALL'),
            ('quote','続けて'),('verification_level','simulation'),('baselineSourceSHA','e'*40),
            ('allowedProductPaths',[]),('afterRepair',{}),('unexpectedPermission',True)]:
            changed=self.record();changed[key]=value
            with self.subTest(key=key),self.assertRaises(CheckpointRejected):
                validate_nearby_repair_record(changed,epoch=changed['checkpointEpoch'])
        changed=self.record();changed['afterRepair']['src/UNADOPTED.ts']='e'*64
        with self.assertRaises(CheckpointRejected):validate_nearby_repair_record(changed)
        with self.assertRaises(CheckpointRejected):validate_nearby_repair_record(self.record(),epoch='e'*64)

    def test_noop_afterimage_cannot_claim_new_repair(self):
        from checkpoint import validate_nearby_repair_record
        record=self.record();record['afterRepair']=copy.deepcopy(record['beforeRepair'])
        with self.assertRaisesRegex(CheckpointRejected,'D03_EXACT_TWO_PATH_AFTERIMAGE'):
            validate_nearby_repair_record(record)




def _publisher_test_api():
    """同moduleの純関数だけを使う。Store/Runtimeを起動しない。"""
    import checkpoint
    return vars(checkpoint)


def _publisher_test_plan():
    """plan検証単独の正例。history resolver済みを装う正式eventではない。"""
    api = _publisher_test_api()
    digest, sha = (api['digest'], api['sha'])
    objects = {}

    def put(value):
        ref = digest(value)
        objects[ref] = copy.deepcopy(value)
        return ref

    def raw(value):
        text = json.dumps(value, ensure_ascii=False, indent=2) + '\n'
        return {'rawUTF8': text, 'sha256': sha(text.encode())}
    seven = sorted(api['PUBLISHER_REVISION_PATHS'])
    source = {'workflow/runtime.py': '5' * 64}
    source.update({f'src/TEST_FIXTURE_{i:04d}.txt': '6' * 64 for i in range(609)})
    rules = {f'work/TEST_FIXTURE_RULE_{i}.md': '7' * 64 for i in range(6)}
    initial = {name: sha(('TEST_FIXTURE_INITIAL:' + name).encode()) for name in seven}
    before = dict(initial)
    for name in ('tools/release/qf01-publish-check.mjs', 'tools/release/qf01-publish-contract.json'):
        before[name] = sha(('TEST_FIXTURE_OLD_AFTER:' + name).encode())
    core = {'definitionHash': '4' * 64, 'files': {'runtime.py': source['workflow/runtime.py']}}
    r06 = {'node': 'R06_PATCH@TEST_FIXTURE', 'resultRef': '8' * 64, 'proofRef': '9' * 64, 'compileInputRef': 'a' * 64, 'compileOutputRef': 'b' * 64}
    material = {'work': api['FIXED_WORK'], 'sourceSHA': '3' * 40, 'releaseUnit': 'qf01-p035'}
    material_authority = {'work': api['FIXED_WORK'], 'sourceSHA': '3' * 40, 'implementationHash': 'c' * 64, 'baseStateSHA256': 'd' * 64, 'planSHA256': 'e' * 64, 'proposalSHA256': 'f' * 64}
    policy = {'schemaVersion': 'qf01-checkpoint-source-ci-policy/1', 'work': api['FIXED_WORK'], 'sourceSHA': '3' * 40, 'releaseUnit': 'qf01-p035', 'definitionHash': core['definitionHash'], 'implementationHash': 'c' * 64, 'checkpointEpoch': '1' * 64, 'core': core, 'methodAuthorityRef': '2' * 64, 'r06': r06, 'bundleEvidenceID': 'TEST_FIXTURE_BUNDLE', 'publisherBeforeSHA': '1' * 40, 'ownerBeforeManifest': initial, 'ownerAfterManifest': before, 'publisherFiles': before, 'contractSHA256': before['tools/release/qf01-publish-contract.json'], 'publisherRoot': 'work/TEST_FIXTURE_PUBLISHER', 'technicalExecutionRoot': 'work/TEST_FIXTURE_EXECUTION', 'materialRoot': '.', 'coreRoot': '.', 'sourcePrefix': '', 'sourceManifest': source, 'authorityCache': {'path': 'work/TEST_FIXTURE.blob'}, 'branch': api['PUBLISHER_PRODUCER_BRANCH'], 'workflow': api['PUBLISHER_PRODUCER_WORKFLOW'], 'widths': [320, 390, 430, 1440], 'counts': {'TEST_FIXTURE': 1}, 'maxBuildBytes': 200000000, 'maxQABytes': 1500000000, 'buildArtifactName': 'TEST_FIXTURE_BUILD', 'qaArtifactName': 'TEST_FIXTURE_QA', 'validatorSHA256': '3' * 64}
    adoption = {'schemaVersion': 'qf01-checkpoint-publisher-technical-adoption/1', 'proposalSHA256': api['INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256'], 'evidenceRef': 'TEST_FIXTURE_D06', 'transcriptionSHA256': api['INLINE_LAYOUT_ACTUAL_ADOPTION_SHA256'], 'materialAuthoritySHA256': '4' * 64, 'publisherBeforeFilesSHA256': digest(initial)}
    original = {'work_id': api['PUBLISHER_WORK'], 'parent_work': api['FIXED_WORK'], 'profile': 'technical', 'command': 'GOVERNANCE', 'subject': 'math', 'mode': 'textbook', 'source_sha': '1' * 40, 'source_manifest': initial, 'rules': rules, 'blocks': [{'id': 'TEST_FIXTURE', 'sources': seven}], 'scope': {'paths': seven, 'preserve': sorted(set(source) | set(rules) | {name for name in seven if initial[name] == before[name]})}, 'protected_manifest': dict(source, **rules, **{name: initial[name] for name in seven if initial[name] == before[name]}), 'proposal': {'id': 'TEST_FIXTURE_D06', 'hash': api['INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256'], 'patch_hash': '5' * 64, 'materialBinding': material, 'materialAuthorityBinding': material_authority, 'sourceCIPolicy': policy, 'sourceCIPolicySHA256': digest(policy), 'publisherAdoptionBinding': adoption}}
    state = {'plan': copy.deepcopy(original), 'definition_hash': core['definitionHash'], 'candidate_sha': '2' * 40, 'candidate_manifest': copy.deepcopy(before), 'claims': {}, 'paused': False, 'external': {}, 'results': {}, 'users': {}, 'issues': {}, 'evidence': {}, 'patches': {}}
    boundary = {'hash': '6' * 64, 'seq': 1}
    bind = {'hash': '7' * 64, 'seq': 90}
    t03 = {'payload': {'artifact': '8' * 64}, 'seq': 89}
    run = raw({'id': 100, 'run_attempt': 1, 'head_sha': '2' * 40, 'head_branch': policy['branch'], 'path': policy['workflow'], 'event': 'push', 'status': 'completed', 'conclusion': 'failure', 'repository': {'id': 1391122224, 'full_name': 'rrikunagasige-dot/kyotsu-step-web'}, 'html_url': 'https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/100'})
    jobs = raw({'total_count': 1, 'jobs': [{'id': 200, 'run_id': 100, 'run_attempt': 1, 'head_sha': '2' * 40, 'status': 'completed', 'conclusion': 'failure'}]})
    failure = {'id': 'TEST_FIXTURE_FAILURE', 'kind': 'check', 'verification_level': 'local_execution', 'source_ref': 'https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/100', 'data': {'status': 'PASS', 'source_sha': '2' * 40, 'checks': {'purpose': api['PUBLISHER_REVISION_FAILURE_PURPOSE'], 'runRawRef': put(run), 'jobsRawRef': put(jobs), 'runRawSHA256': run['sha256'], 'jobsRawSHA256': jobs['sha256'], 'failedJobIDs': [200], 'producerQAPassed': False, 'formalT04Accepted': False}}}
    evidence = {'payload': failure, 'seq': 95, 'hash': '9' * 64}
    cut = {'hash': 'a' * 64, 'seq': 100}
    predecessor = {'state': state, 'ordinal': 0, 'boundary': boundary, 'bindEvent': bind, 't03ResultEvent': t03, 'patchIntent': {'seq': 87}, 'patchApplied': {'seq': 88}, 'evidenceEvents': {failure['id']: evidence}}
    after, files = (dict(before), [])
    for name in ('.github/workflows/qf01-publisher-g3.yml', 'tools/release/qf01-publish-check.test.mjs'):
        text = 'TEST_FIXTURE_NEW_AFTER:' + name
        after[name] = sha(text.encode())
        files.append({'path': name, 'before_sha256': before[name], 'after_sha256': after[name], 'after_text': text})
    new_plan = copy.deepcopy(original)
    proposal = new_plan['proposal']
    proposal['patch_hash'] = put({'files': files})
    policy = proposal['sourceCIPolicy']
    policy.update(publisherBeforeSHA='2' * 40, ownerBeforeManifest=copy.deepcopy(before), ownerAfterManifest=after, publisherFiles=after)
    proposal['sourceCIPolicySHA256'] = digest(policy)
    proposal['publisherRevision'] = {'ordinal': 1, 'predecessorRevisionEventHash': boundary['hash'], 'predecessorPlanSHA256': digest(original), 'predecessorCandidateSHA': state['candidate_sha'], 'predecessorManifestSHA256': digest(before), 'predecessorT03ResultRef': t03['payload']['artifact'], 'predecessorBindEventHash': bind['hash'], 'buildCutHead': cut['hash'], 'reasonEvidenceRefs': [failure['id']]}
    proposal['publisherAdoptionBinding']['publisherBeforeFilesSHA256'] = digest(before)
    changed = {row['path'] for row in files}
    new_plan['scope']['preserve'] = sorted(set(original['scope']['preserve']) - set(seven) | set(seven) - changed)
    new_plan['protected_manifest'] = dict(source, **rules, **{name: before[name] for name in seven if name not in changed})
    primary = {'sourceSHA': '3' * 40, 'epoch': '1' * 64, 'core': core, 'implementationHash': 'c' * 64, 'methodAuthorityRef': '2' * 64, 'r06': r06, 'rules': rules, 'sourceManifest': copy.deepcopy(source), 'materialBinding': material, 'materialAuthorityBinding': material_authority, 'adoptionEvidenceRef': adoption['evidenceRef'], 'materialAuthoritySHA256': adoption['materialAuthoritySHA256']}
    return {'original': original, 'predecessor': predecessor, 'newPlan': new_plan, 'primary': primary, 'cut': cut, 'objects': objects}

def _publisher_test_nodes():
    definitions = [('S00_RECOVER', 'CODE', [], 'source'), ('S01_ROUTE', 'CODE', ['S00_RECOVER'], 'source'), ('T01_ANALYSIS', 'AI', ['S01_ROUTE'], 'source'), ('T02_APPROVAL', 'USER', ['T01_ANALYSIS'], 'source'), ('T03_BUILD', 'TOOL', ['T02_APPROVAL'], 'source'), ('T04_VERIFY', 'TOOL', ['T03_BUILD'], 'candidate'), ('L01_LEARNING', 'AI', ['T04_VERIFY'], 'learning'), ('Z01_CLOSE', 'CODE', ['L01_LEARNING'], 'all')]
    return {name: {'id': name, 'actor': actor, 'depends_on': deps, 'watch': watch} for name, actor, deps, watch in definitions}

def _publisher_test_reseal(rows):
    """envelope連鎖だけ再封印する。意味上の参照を勝手に修復しない。"""
    api = _publisher_test_api()
    result, previous = ([], api['FIXED_ANCHOR']['head'])
    seq = api['FIXED_ANCHOR']['events']
    for original in rows:
        event = copy.deepcopy(original)
        seq += 1
        event.update(seq=seq, previous=previous)
        event.pop('hash', None)
        event['hash'] = api['digest'](event)
        result.append(event)
        previous = event['hash']
    return result

def _publisher_test_add_event(value, kind, payload, work=None):
    """候補のcanonical/digestだけで合成eventを追加する。"""
    api = _publisher_test_api()
    rows = value['rows']
    event = {'seq': rows[-1]['seq'] + 1, 'previous': rows[-1]['hash'], 'id': f'TEST_FIXTURE_EXTENSION_{len(rows):04d}', 'time': rows[-1]['time'] + 1, 'kind': kind, 'work': work or api['PUBLISHER_WORK'], 'payload': copy.deepcopy(payload)}
    event['hash'] = api['digest'](event)
    rows.append(event)
    return event

def _publisher_test_add_result(value, name, extra=None):
    api = _publisher_test_api()
    frame = api['publisher_revision_frames'](value['rows'], value['objects'].__getitem__, value['origin'], value['epoch'], value['nodes'])['current']
    out = {'verdict': 'PASS', **(extra or {})}
    reference = api['digest'](out)
    value['objects'][reference] = copy.deepcopy(out)
    return _publisher_test_add_event(value, 'result', {'node': name, 'verdict': 'PASS', 'artifact': reference, 'input_hash': api['publisher_revision_input'](frame['state'], value['nodes'][name]), 'actor': frame['state']['claims'].get(name, {}).get('actor', 'TEST_FIXTURE_DETERMINISTIC')})

def _publisher_test_history(include_revision=True, fresh_nodes=0, finish_current=False):
    api = _publisher_test_api()
    digest, sha = (api['digest'], api['sha'])
    objects, rows, nodes = ({}, [], _publisher_test_nodes())
    epoch = 'f' * 64

    def put(value):
        reference = digest(value)
        objects[reference] = copy.deepcopy(value)
        return reference

    def add(kind, payload, work=None):
        event = {'seq': api['FIXED_ANCHOR']['events'] + len(rows) + 1, 'previous': rows[-1]['hash'] if rows else api['FIXED_ANCHOR']['head'], 'id': f'TEST_FIXTURE_EVENT_{len(rows):04d}', 'time': 100.0 + len(rows), 'kind': kind, 'work': work or api['PUBLISHER_WORK'], 'payload': copy.deepcopy(payload)}
        event['hash'] = digest(event)
        rows.append(event)
        return event
    seven = sorted(api['PUBLISHER_REVISION_PATHS'])
    rules = {f'work/TEST_FIXTURE_RULE_{i}.md': '7' * 64 for i in range(6)}
    workflow = {f'workflow/TEST_FIXTURE_{i:02d}.py': sha(str(i).encode()) for i in range(47)}
    app = {f'src/TEST_FIXTURE_APP_{i:03d}.txt': sha(('app' + str(i)).encode()) for i in range(401)}
    services = dict(workflow, **dict(list(app.items())[:187]))
    services.update({f'tools/textbook/TEST_FIXTURE_{i:03d}.py': sha(('service' + str(i)).encode()) for i in range(162)})
    source = {**workflow, **services, **app}
    assert len(source) == 610 and len(services) == 396
    core = {'definitionHash': '4' * 64, 'files': {name.removeprefix('workflow/'): value for name, value in list(workflow.items())[:24]}}
    origin = {'candidate_sha': '1' * 40, 'candidate_manifest': copy.deepcopy(app), 'definition_hash': '2' * 64, 'plan': {'rules': rules}, 'results': {}}
    add('checkpoint_recovered', {'originSHA256': epoch, 'core': copy.deepcopy(core)}, api['FIXED_WORK'])

    def primary_records(source_sha, active_core, implementation, wf, svc):
        preflight = put({'core': active_core, 'implementationHash': implementation})
        add('checkpoint_definition_migrated', {'preflightRef': preflight, 'candidateSHA': source_sha, 'candidateManifest': app, 'inlineLayoutRepair': {'evidenceRef': 'TEST_FIXTURE_D06'}}, api['FIXED_WORK'])
        method = put({'core': active_core, 'TEST_FIXTURE_METHOD': source_sha})
        add('informed_review_method_adopted', {'authorityRef': method}, api['FIXED_WORK'])
        compile_input = put({'TEST_FIXTURE_COMPILE_INPUT': source_sha})
        compile_output = put({'TEST_FIXTURE_COMPILE_OUTPUT': source_sha})
        proof = put({'candidateSHA': source_sha, 'core': active_core, 'implementationHash': implementation, 'reviewMethodAuthorityRef': method, 'checkpointEpoch': epoch, 'compileInputRef': compile_input, 'compileOutputRef': compile_output})
        result = put({'verdict': 'PASS', 'checkpoint_candidate_proof_ref': proof})
        r06 = {'node': 'R06_PATCH@TEST_FIXTURE', 'resultRef': result, 'proofRef': proof, 'compileInputRef': compile_input, 'compileOutputRef': compile_output}
        add('result', {'node': r06['node'], 'artifact': result, 'verdict': 'PASS'}, api['FIXED_WORK'])
        return (method, r06)
    method, r06 = primary_records('3' * 40, core, '5' * 64, workflow, services)
    initial_raw = {name: 'TEST_FIXTURE_INITIAL:' + name for name in seven}
    initial_raw['tools/release/qf01-publish-contract.json'] = '{"TEST_FIXTURE_INITIAL":true}'
    initial = {name: sha(raw.encode()) for name, raw in initial_raw.items()}
    after_raw = dict(initial_raw)
    after_raw['tools/release/qf01-publish-check.mjs'] = 'TEST_FIXTURE_OLD_CHECKER_AFTER'
    after_raw['tools/release/qf01-publish-contract.json'] = '{"TEST_FIXTURE_OLD_AFTER":true}'
    before = {name: sha(raw.encode()) for name, raw in after_raw.items()}
    old_changed = [name for name in seven if before[name] != initial[name]]
    old_patch = put({'files': [{'path': name, 'before_sha256': initial[name], 'after_sha256': before[name], 'after_text': after_raw[name]} for name in old_changed]})
    material = {'work': api['FIXED_WORK'], 'sourceSHA': '3' * 40, 'releaseUnit': 'qf01-p035'}
    material_authority = {'work': api['FIXED_WORK'], 'sourceSHA': '3' * 40, 'implementationHash': '5' * 64, 'baseStateSHA256': '8' * 64, 'planSHA256': '9' * 64, 'proposalSHA256': 'a' * 64}
    policy = {'schemaVersion': 'qf01-checkpoint-source-ci-policy/1', 'work': api['FIXED_WORK'], 'sourceSHA': '3' * 40, 'releaseUnit': 'qf01-p035', 'definitionHash': core['definitionHash'], 'implementationHash': '5' * 64, 'checkpointEpoch': epoch, 'core': core, 'methodAuthorityRef': method, 'r06': r06, 'bundleEvidenceID': 'TEST_FIXTURE_BUNDLE', 'publisherBeforeSHA': 'b' * 40, 'ownerBeforeManifest': initial, 'ownerAfterManifest': before, 'publisherFiles': before, 'contractSHA256': before['tools/release/qf01-publish-contract.json'], 'publisherRoot': 'work/TEST_FIXTURE_PUBLISHER', 'technicalExecutionRoot': 'work/TEST_FIXTURE_EXECUTION', 'materialRoot': '.', 'coreRoot': '.', 'sourcePrefix': '', 'sourceManifest': source, 'authorityCache': {'path': 'work/TEST_FIXTURE.blob'}, 'branch': api['PUBLISHER_PRODUCER_BRANCH'], 'workflow': api['PUBLISHER_PRODUCER_WORKFLOW'], 'widths': [320, 390, 430, 1440], 'counts': {'TEST_FIXTURE': 1}, 'maxBuildBytes': 200000000, 'maxQABytes': 1500000000, 'buildArtifactName': 'qf01-build-' + 'c' * 40 + '-1', 'qaArtifactName': 'qf01-reports-' + 'c' * 40 + '-1', 'validatorSHA256': '6' * 64}
    original = {'work_id': api['PUBLISHER_WORK'], 'parent_work': api['FIXED_WORK'], 'profile': 'technical', 'command': 'GOVERNANCE', 'subject': 'math', 'mode': 'textbook', 'source_sha': 'b' * 40, 'source_manifest': initial, 'rules': rules, 'blocks': [{'id': 'TEST_FIXTURE', 'sources': seven}], 'scope': {'paths': seven, 'preserve': sorted(set(source) | set(rules) | set(seven) - set(old_changed))}, 'protected_manifest': dict(source, **rules, **{name: initial[name] for name in seven if name not in old_changed}), 'proposal': {'id': 'TEST_FIXTURE_D06', 'hash': api['INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256'], 'patch_hash': old_patch, 'materialBinding': material, 'materialAuthorityBinding': material_authority, 'sourceCIPolicy': policy, 'sourceCIPolicySHA256': digest(policy), 'publisherAdoptionBinding': {'schemaVersion': 'qf01-checkpoint-publisher-technical-adoption/1', 'proposalSHA256': api['INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256'], 'evidenceRef': 'TEST_FIXTURE_D06', 'transcriptionSHA256': api['INLINE_LAYOUT_ACTUAL_ADOPTION_SHA256'], 'materialAuthoritySHA256': '7' * 64, 'publisherBeforeFilesSHA256': digest(initial)}}}
    snapshot = put({'source_sha': original['source_sha'], 'files_hex': {name: raw.encode().hex() for name, raw in initial_raw.items()}})
    add('opened', {'plan': original, 'definition_hash': core['definitionHash'], 'original_snapshot': snapshot})

    def observed():
        return api['publisher_revision_frames'](rows, objects.__getitem__, origin, epoch, nodes)

    def result(name, extra=None):
        state = observed()['current']['state']
        out = {'verdict': 'PASS', **(extra or {})}
        artifact = put(out)
        return add('result', {'node': name, 'verdict': 'PASS', 'artifact': artifact, 'input_hash': api['publisher_revision_input'](state, nodes[name]), 'actor': state['claims'].get(name, {}).get('actor', 'TEST_FIXTURE_DETERMINISTIC')})

    def claim(name):
        state = observed()['current']['state']
        return add('claimed', {'node': name, 'input_hash': api['publisher_revision_input'](state, nodes[name]), 'actor': nodes[name]['actor'], 'token': f'{len(rows):032x}', 'task_id': digest({'work': api['PUBLISHER_WORK'], 'node': name, 'input_hash': api['publisher_revision_input'](state, nodes[name])}), 'expires_at': 10000})
    result('S00_RECOVER')
    result('S01_ROUTE')
    claim('T01_ANALYSIS')
    result('T01_ANALYSIS')
    user = {'id': 'TEST_FIXTURE_OLD_USER', 'intent': 'approve_proposal', 'proposal_hash': original['proposal']['hash'], 'reply_to': original['proposal']['hash'], 'scope': original['scope'], 'candidate_sha': original['source_sha'], 'quote': api['INLINE_LAYOUT_REPAIR_ADOPTION_QUOTE'], 'source_ref': 'request_user_input_async/' + api['INLINE_LAYOUT_REPAIR_ADOPTION_CALL_ID'], 'verification_level': 'conversation_transcribed'}
    add('user', user)
    result('T02_APPROVAL', {'user_event': user['id']})
    claim('T03_BUILD')
    intent = add('patch_intent', {'node': 'T03_BUILD', 'patch_hash': old_patch, 'backup': put({name: initial_raw[name].encode().hex() for name in old_changed}), 'before': {name: initial[name] for name in old_changed}})
    add('patch_applied', {'node': 'T03_BUILD', 'operation': intent['id'], 'after_manifest': {name: before[name] for name in old_changed}})
    old_file_refs = []
    for index, name in enumerate(old_changed):
        eid = f'TEST_FIXTURE_OLD_FILE_{index}'
        old_file_refs.append(eid)
        add('evidence', {'id': eid, 'kind': 'file', 'verification_level': 'local_execution', 'source_ref': intent['id'], 'data': {'path': name, 'sha256': before[name]}})
    result('T03_BUILD', {'evidence_refs': old_file_refs})
    add('candidate', {'sha': 'c' * 40, 'manifest': before})
    run = {'id': 100, 'run_attempt': 1, 'repository': {'id': 1391122224, 'full_name': 'rrikunagasige-dot/kyotsu-step-web'}, 'head_sha': 'c' * 40, 'head_branch': policy['branch'], 'path': policy['workflow'], 'event': 'push', 'status': 'completed', 'conclusion': 'failure', 'html_url': 'https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/100'}
    jobs = {'total_count': 1, 'jobs': [{'id': 200, 'run_id': 100, 'run_attempt': 1, 'head_sha': 'c' * 40, 'status': 'completed', 'conclusion': 'failure'}]}
    carriers = []
    for value in (run, jobs):
        raw = json.dumps(value, ensure_ascii=False, indent=2) + '\n'
        carriers.append({'rawUTF8': raw, 'sha256': sha(raw.encode())})
    run_raw, jobs_raw = carriers
    failure_payload = {'id': 'TEST_FIXTURE_FAILURE', 'kind': 'check', 'verification_level': 'local_execution', 'source_ref': run['html_url'], 'data': {'status': 'PASS', 'source_sha': 'c' * 40, 'checks': {'purpose': api['PUBLISHER_REVISION_FAILURE_PURPOSE'], 'runRawRef': put(run_raw), 'jobsRawRef': put(jobs_raw), 'runRawSHA256': run_raw['sha256'], 'jobsRawSHA256': jobs_raw['sha256'], 'failedJobIDs': [200], 'producerQAPassed': False, 'formalT04Accepted': False}}}
    if not include_revision:
        add('evidence', failure_payload)
    if include_revision:
        workflow_new = copy.deepcopy(workflow)
        changed_core = next(iter(workflow_new))
        workflow_new[changed_core] = 'e' * 64
        services_new = copy.deepcopy(services)
        services_new[changed_core] = 'e' * 64
        core_new = copy.deepcopy(core)
        core_new['definitionHash'] = 'd' * 64
        core_new['files'][changed_core.removeprefix('workflow/')] = 'e' * 64
        source_new = {**workflow_new, **services_new, **app}
        method_new, r06_new = primary_records('d' * 40, core_new, 'e' * 64, workflow_new, services_new)
        add('evidence', failure_payload)
        cut = copy.deepcopy(rows[-1])
        predecessor = observed()['current']
        authority = {'work': api['FIXED_WORK'], 'sourceSHA': 'd' * 40, 'definitionHash': core_new['definitionHash'], 'implementationHash': 'e' * 64, 'anchor': {'events': cut['seq'], 'head': cut['hash']}, 'candidateManifest': app, 'serviceManifestSHA256': digest({name.replace('/', '\\'): value for name, value in services_new.items()}), 'releaseUnit': 'qf01-p035', 'baseStateSHA256': material_authority['baseStateSHA256'], 'unchangedMaterialPlan': {'planSHA256': material_authority['planSHA256']}, 'proposalSHA256': material_authority['proposalSHA256']}
        contract = {'authorityVariant': 'qf01-checkpoint-recovery/1', 'sourceSHA': 'd' * 40, 'publisherBaseSHA': 'c' * 40, 'producerBaseSHA': 'c' * 40, 'technicalBeforeFiles': before, 'publisherBeforeFiles': before, 'currentNativeAuthority': authority, 'checkpointAuthority': {'core': {'sourceSHA': 'd' * 40, 'definitionHash': core_new['definitionHash'], 'implementationHash': 'e' * 64, 'workflowFiles': workflow_new, 'serviceFiles': services_new, 'nativeServiceFiles': {name.replace('/', '\\'): value for name, value in services_new.items()}, 'appFiles': app}, 'currentExport': {'anchor': authority['anchor']}}}
        new_raw = dict(after_raw)
        for name in ('.github/workflows/qf01-publisher-g3.yml', 'tools/release/qf01-publish-check.test.mjs'):
            new_raw[name] = 'TEST_FIXTURE_NEW_AFTER:' + name
        new_raw['tools/release/qf01-publish-contract.json'] = api['canonical'](contract).decode()
        after = {name: sha(raw.encode()) for name, raw in new_raw.items()}
        changed = [name for name in seven if after[name] != before[name]]
        patch = put({'files': [{'path': name, 'before_sha256': before[name], 'after_sha256': after[name], 'after_text': new_raw[name]} for name in changed]})
        plan = copy.deepcopy(original)
        proposal = plan['proposal']
        proposal['patch_hash'] = patch
        policy_new = proposal['sourceCIPolicy']
        policy_new.update(sourceSHA='d' * 40, definitionHash=core_new['definitionHash'], implementationHash='e' * 64, core=core_new, methodAuthorityRef=method_new, r06=r06_new, sourceManifest=source_new, publisherBeforeSHA='c' * 40, ownerBeforeManifest=before, ownerAfterManifest=after, publisherFiles=after, contractSHA256=after['tools/release/qf01-publish-contract.json'], buildArtifactName='qf01-build-' + 'e' * 40 + '-1', qaArtifactName='qf01-reports-' + 'e' * 40 + '-1')
        proposal['sourceCIPolicySHA256'] = digest(policy_new)
        proposal['publisherRevision'] = {'ordinal': 1, 'predecessorRevisionEventHash': predecessor['boundary']['hash'], 'predecessorPlanSHA256': digest(original), 'predecessorCandidateSHA': 'c' * 40, 'predecessorManifestSHA256': digest(before), 'predecessorT03ResultRef': predecessor['t03ResultEvent']['payload']['artifact'], 'predecessorBindEventHash': predecessor['bindEvent']['hash'], 'buildCutHead': cut['hash'], 'reasonEvidenceRefs': ['TEST_FIXTURE_FAILURE']}
        proposal['materialBinding'].update(sourceSHA='d' * 40)
        proposal['materialAuthorityBinding'].update(sourceSHA='d' * 40, implementationHash='e' * 64)
        proposal['publisherAdoptionBinding'].update(materialAuthoritySHA256=digest(authority), publisherBeforeFilesSHA256=digest(before))
        plan['scope']['preserve'] = sorted(set(original['scope']['preserve']) - set(seven) | set(seven) - set(changed))
        plan['protected_manifest'] = dict(source_new, **rules, **{name: before[name] for name in seven if name not in changed})
        add('revised', {'plan': plan})
        add('definition_migrated', {'from': core['definitionHash'], 'to': core_new['definitionHash'], 'evidence_refs': ['TEST_FIXTURE_FAILURE']})
        for name in ['S00_RECOVER', 'S01_ROUTE', 'T01_ANALYSIS'][:fresh_nodes]:
            if nodes[name]['actor'] != 'CODE':
                claim(name)
            result(name)
        if finish_current:
            assert fresh_nodes == 3
            current_user = copy.deepcopy(user)
            current_user.update(id='TEST_FIXTURE_CURRENT_USER', scope=plan['scope'], candidate_sha='c' * 40)
            add('user', current_user)
            result('T02_APPROVAL', {'user_event': current_user['id']})
            claim('T03_BUILD')
            current_intent = add('patch_intent', {'node': 'T03_BUILD', 'patch_hash': patch, 'backup': put({name: after_raw[name].encode().hex() for name in changed}), 'before': {name: before[name] for name in changed}})
            add('patch_applied', {'node': 'T03_BUILD', 'operation': current_intent['id'], 'after_manifest': {name: after[name] for name in changed}})
            evidence_refs = []
            for index, name in enumerate(changed):
                eid = f'TEST_FIXTURE_CURRENT_FILE_{index}'
                evidence_refs.append(eid)
                add('evidence', {'id': eid, 'kind': 'file', 'verification_level': 'local_execution', 'source_ref': current_intent['id'], 'data': {'path': name, 'sha256': after[name]}})
            result('T03_BUILD', {'evidence_refs': evidence_refs})
            add('candidate', {'sha': 'e' * 40, 'manifest': after})
            ci_id = 'TEST_FIXTURE_CURRENT_SUCCESS_CI'
            add('evidence', {'id': ci_id, 'kind': 'ci', 'verification_level': 'local_execution', 'source_ref': 'https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/300', 'data': {'id': 300, 'run_attempt': 1, 'head_sha': 'e' * 40, 'status': 'completed', 'conclusion': 'success', 'event': 'push', 'path': policy_new['workflow'], 'head_branch': policy_new['branch'], 'html_url': 'https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/300'}})
            claim('T04_VERIFY')
            result('T04_VERIFY', {'evidence_refs': [ci_id]})
            claim('L01_LEARNING')
            result('L01_LEARNING', {'case_updates': [], 'rule_links': [], 'regression_links': [], 'unresolved': [], 'deduplication': 'TEST_FIXTURE限定'})
            result('Z01_CLOSE')
    return {'rows': rows, 'objects': objects, 'origin': origin, 'epoch': epoch, 'nodes': nodes, 'qualification': '全値合成TEST_FIXTURE。正式Core/Native/Runtime/採用/CI未実行。'}


class CheckpointPublisherRevisionTests(unittest.TestCase):
    """全値合成TEST_FIXTURE。Store/Runtime/原資料を起動・書込しない。"""

    def validate_plan(self, value):
        api = _publisher_test_api()
        return api['validate_publisher_revision_plan'](value['original'], value['predecessor'],
            value['newPlan'], value['primary'], value['objects'].__getitem__, value['cut'])

    def replay(self, value):
        return _publisher_test_api()['publisher_revision_frames'](value['rows'],
            value['objects'].__getitem__, value['origin'], value['epoch'], value['nodes'])

    def test_publisher_revision_plan_preserves_opened_source_and_current_610(self):
        value = _publisher_test_plan()
        original = copy.deepcopy(value['original'])
        self.assertEqual(self.validate_plan(value), value['newPlan'])
        self.assertEqual(value['original'], original)
        self.assertEqual(len(value['newPlan']['protected_manifest']), 621)

    def test_publisher_revision_ordinal_is_exact_next_integer(self):
        for ordinal in (0, 2, True, 1.0):
            with self.subTest(ordinal=ordinal):
                value = _publisher_test_plan()
                value['newPlan']['proposal']['publisherRevision']['ordinal'] = ordinal
                with self.assertRaisesRegex(CheckpointRejected, 'EXACT_NEXT_ORDINAL'):
                    self.validate_plan(value)

    def test_publisher_revision_predecessor_refs_are_actual(self):
        for key in ('predecessorRevisionEventHash', 'predecessorPlanSHA256',
                    'predecessorCandidateSHA', 'predecessorManifestSHA256',
                    'predecessorT03ResultRef', 'predecessorBindEventHash'):
            with self.subTest(key=key):
                value = _publisher_test_plan()
                value['newPlan']['proposal']['publisherRevision'][key] = '0' * 64
                with self.assertRaisesRegex(CheckpointRejected, 'ACTUAL_PREDECESSOR_CHAIN'):
                    self.validate_plan(value)

    def test_publisher_revision_original_source_and_rules_cannot_move(self):
        for key in ('source_sha', 'source_manifest', 'rules'):
            with self.subTest(key=key):
                value = _publisher_test_plan()
                value['newPlan'][key] = '0' * 40 if key == 'source_sha' else {}
                with self.assertRaises(CheckpointRejected):
                    self.validate_plan(value)

    def test_publisher_revision_scope_outside_preserve_cannot_drop(self):
        value = _publisher_test_plan()
        path = next(name for name in value['newPlan']['scope']['preserve']
                    if name.startswith('src/'))
        value['newPlan']['scope']['preserve'].remove(path)
        with self.assertRaisesRegex(CheckpointRejected, 'EXACT_CURRENT_PRESERVE_SET'):
            self.validate_plan(value)

    def test_publisher_revision_unchanged_seven_cannot_be_unprotected(self):
        value = _publisher_test_plan()
        value['newPlan']['scope']['preserve'].remove('tools/release/qf01-browser.mjs')
        with self.assertRaisesRegex(CheckpointRejected, 'EXACT_CURRENT_PRESERVE_SET'):
            self.validate_plan(value)

    def test_publisher_revision_rebalanced_fake_current_610_is_rejected(self):
        value = _publisher_test_plan()
        proposal = value['newPlan']['proposal']
        name = next(name for name in proposal['sourceCIPolicy']['sourceManifest'] if name.startswith('src/'))
        proposal['sourceCIPolicy']['sourceManifest'][name] = '0' * 64
        value['newPlan']['protected_manifest'][name] = '0' * 64
        proposal['sourceCIPolicySHA256'] = digest(proposal['sourceCIPolicy'])
        with self.assertRaisesRegex(CheckpointRejected, 'CURRENT_FULL_SOURCE_MANIFEST'):
            self.validate_plan(value)

    def test_publisher_revision_raw_patch_is_rehashed_but_not_relabelled(self):
        value = _publisher_test_plan()
        proposal = value['newPlan']['proposal']
        patch = copy.deepcopy(value['objects'][proposal['patch_hash']])
        patch['files'][0]['after_text'] += '\n改変'
        reference = digest(patch)
        value['objects'][reference] = patch
        proposal['patch_hash'] = reference
        with self.assertRaisesRegex(CheckpointRejected, 'ACTUAL_PATCH_UTF8'):
            self.validate_plan(value)

    def test_publisher_revision_reason_requires_after_bind_actual_failure(self):
        value = _publisher_test_plan()
        event = value['predecessor']['evidenceEvents']['TEST_FIXTURE_FAILURE']
        event['seq'] = value['predecessor']['bindEvent']['seq'] - 1
        with self.assertRaisesRegex(CheckpointRejected, 'AFTER_BOUND_BEFORE_CUT'):
            self.validate_plan(value)

    def test_publisher_revision_failure_raw_cannot_be_success_or_diagnostic_branch(self):
        for field, replacement in (('conclusion', 'success'), ('head_branch', 'TEST_FIXTURE_CODE_BRANCH')):
            with self.subTest(field=field):
                value = _publisher_test_plan()
                checks = value['predecessor']['evidenceEvents']['TEST_FIXTURE_FAILURE']['payload']['data']['checks']
                carrier = copy.deepcopy(value['objects'][checks['runRawRef']])
                run = json.loads(carrier['rawUTF8'])
                run[field] = replacement
                carrier['rawUTF8'] = json.dumps(run, ensure_ascii=False, indent=2) + '\n'
                carrier['sha256'] = hashlib.sha256(carrier['rawUTF8'].encode()).hexdigest()
                checks['runRawRef'] = digest(carrier)
                checks['runRawSHA256'] = carrier['sha256']
                value['objects'][checks['runRawRef']] = carrier
                with self.assertRaisesRegex(CheckpointRejected, 'COMPLETED_PRODUCER_FAILURE_REQUIRED'):
                    self.validate_plan(value)

    def test_publisher_revision_legacy0_keeps_missing_t04(self):
        value = _publisher_test_history(include_revision=False)
        result = self.replay(value)
        self.assertEqual(len(result['frames']), 1)
        self.assertEqual(result['current']['ordinal'], 0)
        self.assertNotIn('T04_VERIFY', result['current']['state']['results'])

    def test_publisher_revision_full_history_has_one_current_frame(self):
        value = _publisher_test_history(fresh_nodes=3)
        result = self.replay(value)
        self.assertEqual([frame['ordinal'] for frame in result['frames']], [0, 1])
        self.assertEqual(result['current'], result['frames'][-1])
        self.assertEqual(result['frames'][0]['state']['plan']['source_sha'],
                         result['current']['state']['plan']['source_sha'])
        self.assertNotIn('T04_VERIFY', result['current']['state']['results'])

    def test_publisher_revision_old_ai_result_requires_its_claim(self):
        value = _publisher_test_history(include_revision=False)
        value['rows'] = _publisher_test_reseal([event for event in value['rows']
            if not (event['kind'] == 'claimed' and event['payload']['node'] == 'T01_ANALYSIS')])
        with self.assertRaisesRegex(CheckpointRejected, 'RESULT_REQUIRES_CURRENT_CLAIM'):
            self.replay(value)

    def test_publisher_revision_current_ai_result_requires_its_claim(self):
        value = _publisher_test_history(fresh_nodes=3)
        index = max(i for i, event in enumerate(value['rows'])
                    if event['kind'] == 'claimed' and event['payload']['node'] == 'T01_ANALYSIS')
        del value['rows'][index]
        value['rows'] = _publisher_test_reseal(value['rows'])
        with self.assertRaisesRegex(CheckpointRejected, 'RESULT_REQUIRES_CURRENT_CLAIM'):
            self.replay(value)

    def test_publisher_revision_actor_id_is_not_actor_kind(self):
        value = _publisher_test_history(fresh_nodes=3)
        for event in value['rows'][-2:]:
            event['payload']['actor'] = 'TEST_FIXTURE_EXECUTOR_DIFFERENT_FROM_AI'
        value['rows'] = _publisher_test_reseal(value['rows'])
        self.assertEqual(self.replay(value)['current']['state']['results']['T01_ANALYSIS']['actor'],
                         'TEST_FIXTURE_EXECUTOR_DIFFERENT_FROM_AI')

    def test_publisher_revision_claim_task_id_is_current_input(self):
        value = _publisher_test_history(fresh_nodes=3)
        value['rows'][-2]['payload']['task_id'] = '0' * 64
        value['rows'] = _publisher_test_reseal(value['rows'])
        with self.assertRaisesRegex(CheckpointRejected, 'CURRENT_NORMAL_CLAIM_INPUT'):
            self.replay(value)

    def test_publisher_revision_does_not_invent_pub_finish_deadline(self):
        value = _publisher_test_history(fresh_nodes=3)
        claim = value['rows'][-2]
        claim['payload']['expires_at'] = claim['time'] + 0.5
        value['rows'] = _publisher_test_reseal(value['rows'])
        self.assertGreater(value['rows'][-1]['time'], claim['payload']['expires_at'])
        self.assertEqual(self.replay(value)['current']['ordinal'], 1)

    def test_publisher_revision_full_suffix_cannot_be_a_subset(self):
        value = _publisher_test_history(fresh_nodes=3)
        value['rows'] = _publisher_test_reseal(value['rows'][1:])
        with self.assertRaisesRegex(CheckpointRejected, 'AUTHENTIC_BOOTSTRAP'):
            self.replay(value)

    def test_publisher_revision_second_patch_intent_is_rejected(self):
        value = _publisher_test_history(include_revision=False)
        index = next(i for i, event in enumerate(value['rows']) if event['kind'] == 'patch_intent')
        extra = copy.deepcopy(value['rows'][index])
        extra['id'] += '_SECOND'
        value['rows'].insert(index + 1, extra)
        value['rows'] = _publisher_test_reseal(value['rows'])
        with self.assertRaisesRegex(CheckpointRejected, 'ONE_CURRENT_APPROVED_PATCH_INTENT'):
            self.replay(value)

    def test_publisher_revision_foreign_patch_operation_is_rejected(self):
        value = _publisher_test_history(include_revision=False)
        event = next(event for event in value['rows'] if event['kind'] == 'patch_applied')
        event['payload']['operation'] = 'TEST_FIXTURE_FOREIGN_PATCH'
        value['rows'] = _publisher_test_reseal(value['rows'])
        with self.assertRaisesRegex(CheckpointRejected, 'EXACT_ONE_PATCH_APPLIED'):
            self.replay(value)

    def test_publisher_revision_cut_cannot_include_itself(self):
        value = _publisher_test_history(fresh_nodes=3)
        event = next(event for event in value['rows'] if event['kind'] == 'revised')
        event['payload']['plan']['proposal']['publisherRevision']['buildCutHead'] = event['hash']
        value['rows'] = _publisher_test_reseal(value['rows'])
        with self.assertRaisesRegex(CheckpointRejected, 'EXACT_CUT_AFTER_ACTUAL_BOUND'):
            self.replay(value)

    def test_publisher_revision_fresh_t02_cannot_use_legacy_user(self):
        value = _publisher_test_history(fresh_nodes=3)
        _publisher_test_add_result(value, 'T02_APPROVAL', {'user_event': 'TEST_FIXTURE_OLD_USER'})
        with self.assertRaisesRegex(CheckpointRejected, 'CURRENT_FRESH_T02_USER'):
            self.replay(value)

    def test_publisher_revision_fresh_t02_accepts_current_retranscription(self):
        value = _publisher_test_history(fresh_nodes=3)
        frame = self.replay(value)['current']
        plan = frame['state']['plan']
        api = _publisher_test_api()
        user = {'id': 'TEST_FIXTURE_CURRENT_USER', 'intent': 'approve_proposal',
            'proposal_hash': plan['proposal']['hash'], 'reply_to': plan['proposal']['hash'],
            'scope': plan['scope'], 'candidate_sha': plan['proposal']['sourceCIPolicy']['publisherBeforeSHA'],
            'quote': api['INLINE_LAYOUT_REPAIR_ADOPTION_QUOTE'],
            'source_ref': 'request_user_input_async/' + api['INLINE_LAYOUT_REPAIR_ADOPTION_CALL_ID'],
            'verification_level': 'conversation_transcribed'}
        _publisher_test_add_event(value, 'user', user)
        _publisher_test_add_result(value, 'T02_APPROVAL', {'user_event': user['id']})
        self.assertEqual(api['publisher_revision_approval'](self.replay(value)['current']), user)

    def test_publisher_revision_failure_check_never_counts_as_t04_quality(self):
        value = _publisher_test_history(include_revision=False)
        api = _publisher_test_api()
        frame = self.replay(value)['current']
        input_hash = api['publisher_revision_input'](frame['state'], value['nodes']['T04_VERIFY'])
        actor = 'TEST_FIXTURE_T04_EXECUTOR_DIFFERENT_FROM_TOOL'
        _publisher_test_add_event(value, 'claimed', {'node': 'T04_VERIFY', 'input_hash': input_hash,
            'actor': actor, 'task_id': digest({'work': api['PUBLISHER_WORK'],
                'node': 'T04_VERIFY', 'input_hash': input_hash}), 'token': 'a' * 32, 'expires_at': 10000})
        _publisher_test_add_result(value, 'T04_VERIFY', {'evidence_refs': ['TEST_FIXTURE_FAILURE']})
        with self.assertRaisesRegex(CheckpointRejected, 'T04_ACTUAL_SUCCESS_CI_ONLY'):
            self.replay(value)

    def test_publisher_revision_unknown_pub_event_is_rejected(self):
        value = _publisher_test_history(fresh_nodes=3)
        _publisher_test_add_event(value, 'TEST_FIXTURE_UNKNOWN_PUB_OPERATION', {})
        with self.assertRaisesRegex(CheckpointRejected, 'UNKNOWN_OR_FORBIDDEN_EVENT'):
            self.replay(value)

    def test_publisher_revision_changes_definition_before_fresh_normal_stages(self):
        value = _publisher_test_history(fresh_nodes=3, finish_current=True)
        result = self.replay(value)
        old, current = result['frames']
        self.assertNotEqual(old['state']['definition_hash'], current['state']['definition_hash'])
        self.assertEqual(current['migrationEvent']['payload']['from'], old['state']['definition_hash'])
        self.assertEqual(current['migrationEvent']['payload']['to'], current['state']['definition_hash'])
        self.assertEqual(current['state']['candidate_sha'], 'e' * 40)
        self.assertEqual(len([event for event in current['events'] if event['kind'] == 'patch_intent']), 1)
        self.assertEqual(len([event for event in current['events'] if event['kind'] == 'patch_applied']), 1)
        self.assertEqual(current['state']['results']['Z01_CLOSE']['verdict'], 'PASS')
        self.assertNotIn('T04_VERIFY', old['state']['results'])

    def test_publisher_revision_old_definition_failure_check_is_not_claim_exemption(self):
        value = _publisher_test_history()
        boundary = next(i for i, event in enumerate(value['rows']) if event['kind'] == 'revised')
        value['rows'] = value['rows'][:boundary]
        result = self.replay(value)
        frame = result['current']
        self.assertNotEqual(frame['state']['definition_hash'], result['primary']['core']['definitionHash'])
        self.assertIn('TEST_FIXTURE_FAILURE', frame['evidenceEvents'])
        input_hash = _publisher_test_api()['publisher_revision_input'](frame['state'], value['nodes']['T01_ANALYSIS'])
        _publisher_test_add_event(value, 'claimed', {'node': 'T01_ANALYSIS', 'actor': 'TEST_FIXTURE_STALE_EXECUTOR',
            'input_hash': input_hash, 'task_id': digest({'work': frame['state']['plan']['work_id'],
                'node': 'T01_ANALYSIS', 'input_hash': input_hash}), 'token': 'a' * 32, 'expires_at': 10000})
        with self.assertRaisesRegex(CheckpointRejected, 'CURRENT_NORMAL_CLAIM_INPUT'):
            self.replay(value)

    def test_publisher_revision_duplicate_current_code_result_is_extra_history(self):
        value = _publisher_test_history(fresh_nodes=3)
        current = self.replay(value)['current']
        payload = copy.deepcopy(current['resultEvents']['S00_RECOVER']['payload'])
        _publisher_test_add_event(value, 'result', payload)
        with self.assertRaisesRegex(CheckpointRejected, 'DUPLICATE_CURRENT_RESULT'):
            self.replay(value)

    def test_publisher_revision_current_z01_done_cannot_start_recovery(self):
        value = _publisher_test_plan()
        api = _publisher_test_api()
        state = value['predecessor']['state']
        node = {'id': 'Z01_CLOSE', 'watch': 'all', 'depends_on': ['L01_LEARNING']}
        state['results']['Z01_CLOSE'] = {'verdict': 'PASS', 'artifact': '0' * 64,
                                       'input_hash': api['publisher_revision_input'](state, node)}
        with self.assertRaisesRegex(CheckpointRejected, 'ALREADY_CURRENT_DONE_NOT_RECOVERABLE'):
            self.validate_plan(value)

    def test_publisher_revision_historical_stale_z01_is_not_current_done(self):
        value = _publisher_test_plan()
        value['predecessor']['state']['results']['Z01_CLOSE'] = {
            'verdict': 'PASS', 'artifact': '0' * 64, 'input_hash': '1' * 64}
        self.assertEqual(self.validate_plan(value), value['newPlan'])

    def _reopen_fixture_z01(self, verdict):
        value = _publisher_test_history(fresh_nodes=3, finish_current=True)
        event = value['rows'][-1]
        self.assertEqual(event['payload']['node'], 'Z01_CLOSE')
        body = copy.deepcopy(value['objects'][event['payload']['artifact']])
        body['verdict'] = verdict
        reference = digest(body)
        value['objects'][reference] = body
        event['payload'].update(artifact=reference, verdict=verdict)
        value['rows'] = _publisher_test_reseal(value['rows'])
        payload = {'node': 'Z01_CLOSE', 'previous_result': reference,
                   'reason': 'TEST_FIXTURE 実未解決結果の再分析',
                   'evidence_refs': ['TEST_FIXTURE_FAILURE']}
        return value, payload

    def test_publisher_revision_passed_z01_cannot_be_reopened(self):
        value, payload = self._reopen_fixture_z01('PASS')
        _publisher_test_add_event(value, 'result_reopened', payload)
        with self.assertRaisesRegex(CheckpointRejected, 'REOPEN_ONLY_ACTUAL_CURRENT_FAILED_OR_BLOCKED_RESULT'):
            self.replay(value)

    def test_publisher_revision_failed_and_blocked_result_can_be_reopened(self):
        for verdict in ('FAIL', 'NEEDS_REVIEW'):
            with self.subTest(verdict=verdict):
                value, payload = self._reopen_fixture_z01(verdict)
                _publisher_test_add_event(value, 'result_reopened', payload)
                current = self.replay(value)['current']
                self.assertNotIn('Z01_CLOSE', current['state']['results'])
                self.assertNotIn('Z01_CLOSE', current['resultEvents'])

    def test_publisher_revision_reopen_requires_actual_result_evidence_and_current_input(self):
        for variant in ('previous', 'unregistered', 'unknown-node', 'stale-input'):
            with self.subTest(variant=variant):
                value, payload = self._reopen_fixture_z01('FAIL')
                if variant == 'previous':
                    payload['previous_result'] = '0' * 64
                elif variant == 'unregistered':
                    payload['evidence_refs'] = ['TEST_FIXTURE_UNREGISTERED']
                elif variant == 'unknown-node':
                    payload['node'] = 'TEST_FIXTURE_UNKNOWN_NODE'
                else:
                    _publisher_test_add_event(value, 'issue', {'id': 'TEST_FIXTURE_NEW_ISSUE'})
                _publisher_test_add_event(value, 'result_reopened', payload)
                with self.assertRaisesRegex(CheckpointRejected, 'REOPEN_ONLY_ACTUAL_CURRENT_FAILED_OR_BLOCKED_RESULT'):
                    self.replay(value)

    def test_publisher_revision_reopen_preserves_expired_claim_priority_over_old_result(self):
        value = _publisher_test_history(fresh_nodes=3, finish_current=True)
        _publisher_test_add_event(value, 'issue', {'id': 'TEST_FIXTURE_REOPEN_INPUT_CHANGE'})
        frame = self.replay(value)['current']
        old_result = frame['state']['results']['L01_LEARNING']
        input_hash = _publisher_test_api()['publisher_revision_input'](frame['state'], value['nodes']['L01_LEARNING'])
        self.assertNotEqual(old_result['input_hash'], input_hash)
        _publisher_test_add_event(value, 'claimed', {'node': 'L01_LEARNING', 'actor': 'TEST_FIXTURE_REOPEN_EXECUTOR',
            'input_hash': input_hash, 'task_id': digest({'work': frame['state']['plan']['work_id'],
                'node': 'L01_LEARNING', 'input_hash': input_hash}), 'token': 'a' * 32,
            'expires_at': value['rows'][-1]['time'] + 1})
        _publisher_test_add_event(value, 'result_reopened', {'node': 'L01_LEARNING',
            'previous_result': old_result['artifact'], 'reason': 'TEST_FIXTURE 期限切れclaimの通常BLOCKED境界',
            'evidence_refs': ['TEST_FIXTURE_FAILURE']})
        current = self.replay(value)['current']
        self.assertNotIn('L01_LEARNING', current['state']['results'])
        self.assertIn('L01_LEARNING', current['state']['claims'])

    def test_publisher_revision_reopen_may_target_result_carried_from_previous_interval(self):
        value = _publisher_test_history(fresh_nodes=3)
        result_index = max(i for i, event in enumerate(value['rows'])
                           if event['kind'] == 'result' and event['payload'].get('node') == 'T01_ANALYSIS')
        value['rows'] = value['rows'][:result_index]
        frame = self.replay(value)['current']
        self.assertNotIn('T01_ANALYSIS', frame['resultEvents'])
        self.assertIn('T01_ANALYSIS', frame['state']['results'])
        claim = frame['state']['claims']['T01_ANALYSIS']
        event = _publisher_test_add_event(value, 'result_reopened', {'node': 'T01_ANALYSIS',
            'previous_result': frame['state']['results']['T01_ANALYSIS']['artifact'],
            'reason': 'TEST_FIXTURE 前revision結果と現claimの通常BLOCKED境界',
            'evidence_refs': ['TEST_FIXTURE_FAILURE']})
        event['time'] = claim['expires_at'] + 1
        value['rows'] = _publisher_test_reseal(value['rows'])
        current = self.replay(value)['current']
        self.assertNotIn('T01_ANALYSIS', current['state']['results'])
        self.assertNotIn('T01_ANALYSIS', current['resultEvents'])
        self.assertIn('T01_ANALYSIS', current['state']['claims'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
