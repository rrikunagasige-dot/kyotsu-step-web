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


if __name__ == '__main__':
    unittest.main(verbosity=2)
