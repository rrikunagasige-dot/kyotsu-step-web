"""Unadopted, read-only QF01 checkpoint proof and suffix-chain prototype.

This is not Store/Runtime bootstrap and cannot write events or accept a Gate.
Complete suffix events, authentic prefix subsets, and payload projections are
different interfaces. No missing historical event envelope is synthesized.
"""
import base64
import copy
import gzip
import hashlib
import io
import json
import math
import re
import stat
from pathlib import Path


FIXED_CONTRACT_SHA256 = 'b5f49f53b3895a8169f817a91efd376b4e73b17526d5b08bcb77e2b7fa4aee30'
FIXED_WORK = 'W-MATH-QF01-FULL-RELEASE-P035-20261115'
FIXED_SOURCE = '325b70035cafa70a8078944ccf903c53ce763545'
FIXED_ANCHOR = {'events': 13742, 'head': '586be1a3dfeb92e9699cc82ef330131d10b22a78353c165d5610f181d6201106'}
SHA256 = re.compile(r'[0-9a-f]{64}\Z')
EVENT_ID = re.compile(r'[A-Za-z0-9_-]+\Z')
MAX_SAFE_INTEGER = 2**53 - 1


class CheckpointRejected(ValueError):
    pass


class UnknownContext(CheckpointRejected):
    pass


def require(condition, message):
    if not condition:
        raise CheckpointRejected(message)


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def canonical(value):
    try:
        return json.dumps(value, ensure_ascii=False, sort_keys=True,
                          separators=(',', ':'), allow_nan=False).encode('utf-8')
    except (TypeError, ValueError, UnicodeError) as error:
        raise CheckpointRejected('NONCANONICAL_VALUE') from error


def digest(value):
    return sha(canonical(value))


def strict_json(raw):
    def pairs(rows):
        result = {}
        for key, value in rows:
            require(key not in result, 'DUPLICATE_JSON_KEY')
            result[key] = value
        return result

    def invalid_constant(value):
        raise CheckpointRejected('NONFINITE_JSON_CONSTANT:' + value)

    try:
        result = json.loads(raw.decode('utf-8', errors='strict'),
                            object_pairs_hook=pairs, parse_constant=invalid_constant)
        canonical(result)  # Reject float overflow such as 1e999 too.
        return result
    except (UnicodeError, json.JSONDecodeError) as error:
        raise CheckpointRejected('INVALID_UTF8_OR_JSON') from error


def read_regular(path, limit):
    path = Path(path)
    require(not path.is_symlink(), 'SYMLINK_INPUT')
    before = path.stat()
    require(stat.S_ISREG(before.st_mode) and 0 < before.st_size <= limit, 'INPUT_SIZE_OR_KIND')
    with path.open('rb') as stream:
        raw = stream.read(limit + 1)
    after = path.stat()
    require(len(raw) <= limit and (before.st_dev, before.st_ino, before.st_size,
            before.st_mtime_ns) == (after.st_dev, after.st_ino, after.st_size,
                                   after.st_mtime_ns), 'INPUT_CHANGED_DURING_READ')
    return raw


def decode_gzip(encoded, limit):
    try:
        compressed = base64.b64decode(encoded, validate=True)
        require(base64.b64encode(compressed).decode('ascii') == encoded, 'NONCANONICAL_BASE64')
        with gzip.GzipFile(fileobj=io.BytesIO(compressed)) as stream:
            raw = stream.read(limit + 1)
        require(len(raw) <= limit, 'EXPANDED_SIZE_LIMIT')
        return raw
    except (ValueError, OSError, EOFError) as error:
        if isinstance(error, CheckpointRejected):
            raise
        raise CheckpointRejected('INVALID_COMPRESSED_PAYLOAD') from error


def event_body(event):
    return {key: value for key, value in event.items() if key != 'hash'}


def decode_reference(metadata, schema):
    require(isinstance(metadata, dict) and set(metadata) == {
        'schemaVersion', 'referenceMetadataEncoding', 'canonicalJSON', 'canonicalSHA256'}, 'REFERENCE_SCHEMA')
    require(metadata['schemaVersion'] == schema and metadata['referenceMetadataEncoding'] == 'canonical-json-text/1', 'REFERENCE_ENCODING')
    require(isinstance(metadata['canonicalJSON'], str), 'REFERENCE_TEXT_TYPE')
    raw = metadata['canonicalJSON'].encode('utf-8')
    require(0 < len(raw) <= 1024 * 1024 and sha(raw) == metadata['canonicalSHA256'], 'REFERENCE_TEXT_HASH')
    value = strict_json(raw)
    require(canonical(value) == raw, 'REFERENCE_CANONICAL_BYTES')
    return value


def validate_event(event):
    require(isinstance(event, dict) and set(event) == {
        'seq', 'previous', 'id', 'time', 'kind', 'work', 'payload', 'hash'}, 'EVENT_SCHEMA')
    require(type(event['seq']) is int and 0 < event['seq'] <= MAX_SAFE_INTEGER, 'EVENT_SEQ_TYPE')
    require(isinstance(event['previous'], str) and SHA256.fullmatch(event['previous'])
            and isinstance(event['hash'], str) and SHA256.fullmatch(event['hash']), 'EVENT_HASH_TYPE')
    require(isinstance(event['id'], str) and EVENT_ID.fullmatch(event['id']), 'EVENT_ID')
    timestamp = event['time']
    require((type(timestamp) is int and 0 <= timestamp <= MAX_SAFE_INTEGER)
            or (type(timestamp) is float and math.isfinite(timestamp)
                and 0 <= timestamp <= MAX_SAFE_INTEGER), 'EVENT_TIME')
    require(isinstance(event['kind'], str) and event['kind'] and isinstance(event['work'], str)
            and event['work'] and isinstance(event['payload'], dict), 'EVENT_PAYLOAD_TYPE')
    require(digest(event_body(event)) == event['hash'], 'EVENT_CONTENT_HASH')


class VerifiedSuffix:
    """Hash-valid suffix only; semantic/approval validity is deliberately unproved."""
    def __init__(self, anchor, events, known_work):
        self._anchor = copy.deepcopy(anchor)
        self._events = copy.deepcopy(events)
        self._known_work = known_work

    @property
    def head(self):
        return self._events[-1]['hash'] if self._events else self._anchor['head']

    @property
    def last_seq(self):
        return self._events[-1]['seq'] if self._events else self._anchor['events']

    def events(self, work=None):
        if work is not None and work != self._known_work and not any(e['work'] == work for e in self._events):
            raise UnknownContext('WORK_NOT_COVERED_BY_CHECKPOINT_OR_SUFFIX')
        return copy.deepcopy([e for e in self._events if work is None or e['work'] == work])

    def summary(self):
        return {'schemaVersion': 'qf01-suffix-chain-diagnostic/1', 'events': len(self._events),
                'head': self.head, 'lastSeq': self.last_seq, 'hashChainVerified': True,
                'semanticValidityVerified': False, 'runtimeAccepted': False,
                'prefixNonceCoverage': 'INCOMPLETE'}


class VerifiedCheckpoint:
    def __init__(self, authority, seed, nodes, team_events, feedback, known_prefix):
        self._authority = copy.deepcopy(authority)
        self._seed = copy.deepcopy(seed)
        self._nodes = copy.deepcopy(nodes)
        self._team = copy.deepcopy(team_events)
        self._feedback = copy.deepcopy(feedback)
        self._known_prefix = copy.deepcopy(known_prefix)

    @property
    def anchor(self):
        return copy.deepcopy(self._authority['anchor'])

    def state_snapshot(self, work):
        if work != FIXED_WORK:
            raise UnknownContext('UNKNOWN_WORK_STATE')
        return copy.deepcopy(self._seed['baseState'])

    def object(self, reference):
        if reference not in self._seed['objects']:
            raise UnknownContext('OBJECT_NOT_IN_VERIFIED_CHECKPOINT:' + reference)
        return copy.deepcopy(self._seed['objects'][reference])

    def nodes(self):
        return copy.deepcopy(self._nodes)

    def team_prefix_subset(self, work):
        if work != FIXED_WORK:
            raise UnknownContext('UNKNOWN_WORK_TEAM_HISTORY')
        return {'kind': 'AUTHENTIC_PREFIX_SUBSET', 'completeLedger': False,
                'events': copy.deepcopy(self._team)}

    def feedback_payload_projection(self, work):
        if work != FIXED_WORK:
            raise UnknownContext('UNKNOWN_WORK_FEEDBACK')
        return {'kind': 'PAYLOAD_PROJECTION', 'eventEnvelopesAvailable': False,
                'rows': copy.deepcopy(self._feedback)}

    def known_prefix_envelope_subset(self):
        return {'kind': 'AUTHENTIC_PREFIX_SUBSET', 'completeLedger': False,
                'events': copy.deepcopy(self._known_prefix)}

    def global_queue(self):
        raise UnknownContext('GLOBAL_QUEUE_COVERAGE_NOT_RECOVERED')

    def verify_suffix(self, rows):
        require(isinstance(rows, list), 'SUFFIX_MUST_BE_LIST')
        result, ids = [], set()
        prefix_ids = {event['id'] for event in self._known_prefix}
        previous = self._authority['anchor']['head']
        seq = self._authority['anchor']['events']
        for row in rows:
            event = strict_json(row) if isinstance(row, bytes) else copy.deepcopy(row)
            if isinstance(row, bytes):
                require(row in (canonical(event), canonical(event) + b'\n'), 'NONCANONICAL_EVENT_BYTES')
            validate_event(event)
            require(event['seq'] == seq + 1, 'SUFFIX_SEQUENCE_GAP_OR_REORDER')
            require(event['previous'] == previous, 'SUFFIX_PREVIOUS_MISMATCH')
            require(event['id'] not in ids and event['id'] not in prefix_ids, 'DUPLICATE_KNOWN_EVENT_ID')
            ids.add(event['id']); result.append(event)
            seq, previous = event['seq'], event['hash']
        return VerifiedSuffix(self.anchor, result, FIXED_WORK)

    def summary(self):
        state = self._seed['baseState']
        return {'schemaVersion': 'qf01-checkpoint-read-diagnostic/1', 'contractSHA256': FIXED_CONTRACT_SHA256,
                'work': FIXED_WORK, 'candidateSHA': state['candidate_sha'], 'anchor': self.anchor,
                'seedObjects': len(self._seed['objects']), 'nodes': len(self._nodes),
                'teamPrefixSubsetEvents': len(self._team), 'feedbackPayloadRows': len(self._feedback),
                'knownPrefixEnvelopeSubsetEvents': len(self._known_prefix),
                'fullHistoricalLedgerRecovered': False, 'globalQueueCoverage': 'UNKNOWN',
                'openedSourceSnapshot': 'NOT_IN_CHECKPOINT',
                'versionTransitionArchiveAvailable': state.get('version_transition', {}).get('archive') in self._seed['objects'],
                'runtimeBootstrapped': False, 'gateAccepted': False, 'readOnlyPrototype': True}


def load_qf01_checkpoint(contract_path, blob_path):
    contract_raw = read_regular(contract_path, 2 * 1024 * 1024)
    require(sha(contract_raw) == FIXED_CONTRACT_SHA256, 'FIXED_CONTRACT_HASH')
    contract = strict_json(contract_raw)
    authority = contract['currentNativeAuthority']
    require(authority['work'] == FIXED_WORK and authority['sourceSHA'] == FIXED_SOURCE
            and authority['anchor'] == FIXED_ANCHOR, 'FIXED_WORK_SOURCE_ANCHOR')
    ref = authority['buildAuthority']
    require(ref['schemaVersion'] == 'qf01-build-authority-blob-ref/1'
            and ref['repository'] == 'rrikunagasige-dot/kyotsu-step-web'
            and ref['encoding'] == 'gzip-base64', 'BUILD_REFERENCE_IDENTITY')
    blob = read_regular(blob_path, 5 * 1024 * 1024)
    require(len(blob) == ref['blobBytes'] and sha(blob) == ref['blobSHA256'], 'BLOB_BYTES_OR_HASH')
    git_sha = hashlib.sha1(b'blob ' + str(len(blob)).encode('ascii') + b'\0' + blob).hexdigest()
    require(git_sha == ref['blobSHA'], 'GIT_BLOB_IDENTITY')
    expanded = decode_gzip(blob.decode('ascii'), 20 * 1024 * 1024)
    require(len(expanded) == ref['expandedBytes'] and sha(expanded) == ref['expandedSHA256'], 'EXPANDED_BYTES_OR_HASH')
    seed = strict_json(expanded)
    require(seed.get('schemaVersion') == 'qf01-approved-material-seed/1', 'SEED_SCHEMA')
    state, objects = seed['baseState'], seed['objects']
    require(digest(state) == authority['baseStateSHA256'], 'BASE_STATE_HASH')
    require(state['plan']['work_id'] == FIXED_WORK and state['candidate_sha'] == FIXED_SOURCE
            and state['definition_hash'] == authority['definitionHash'], 'STATE_IDENTITY')
    require(isinstance(objects, dict) and len(objects) == 299, 'OBJECT_INVENTORY')
    for reference, value in objects.items():
        require(SHA256.fullmatch(reference) and digest(value) == reference, 'OBJECT_CONTENT_HASH')
    nodes_raw = decode_gzip(authority['nodesGzipBase64'], 1024 * 1024)
    require(sha(nodes_raw) == authority['nodesSHA256'], 'NODES_HASH')
    nodes = strict_json(nodes_raw)
    require(canonical(nodes) == nodes_raw, 'NODES_CANONICAL_BYTES')
    team_raw = decode_gzip(authority['teamHistory']['gzipBase64'], 5 * 1024 * 1024)
    require(sha(team_raw) == authority['teamHistory']['sha256'], 'TEAM_SUBSET_HASH')
    team = strict_json(team_raw)
    require(canonical(team) == team_raw and len(team) == authority['teamHistory']['events'], 'TEAM_SUBSET_CANONICAL_COUNT')
    previous_seq, ids = 0, set()
    for event in team:
        validate_event(event)
        require(event['work'] == FIXED_WORK and previous_seq < event['seq'] <= FIXED_ANCHOR['events'], 'TEAM_SUBSET_SCOPE_ORDER')
        require(event['id'] not in ids, 'TEAM_SUBSET_DUPLICATE_ID')
        previous_seq = event['seq']; ids.add(event['id'])
    feedback_raw = authority['feedbackCapturedCanonicalJSON'].encode('utf-8')
    require(sha(feedback_raw) == authority['feedbackCapturedSHA256'], 'FEEDBACK_PROJECTION_HASH')
    feedback = strict_json(feedback_raw)
    require(canonical(feedback) == feedback_raw and isinstance(feedback, list), 'FEEDBACK_PROJECTION_CANONICAL')
    bridge = decode_reference(authority['approvalCoverageMigration'], 'qf01-r3-approval-coverage-reference/1')
    # The outer reference schema and its decoded value use different schema names.
    require(bridge['schemaVersion'] == 'qf01-r3-existing-approval-coverage/1', 'APPROVAL_BRIDGE_SCHEMA')
    original_user = decode_reference(contract['r3Authorization']['originalR3UserEvent'], 'qf01-r3-original-user-event-reference/1')
    prefix = sorted(team + [bridge['originalUserEvent'], bridge['migrationEvent'], original_user], key=lambda event: event['seq'])
    seen_ids, seen_seq = {}, {}
    for event in prefix:
        validate_event(event)
        require(event['work'] == FIXED_WORK and event['seq'] <= FIXED_ANCHOR['events'], 'KNOWN_PREFIX_SCOPE')
        require(event['id'] not in seen_ids and event['seq'] not in seen_seq, 'KNOWN_PREFIX_DUPLICATE')
        seen_ids[event['id']] = event; seen_seq[event['seq']] = event
    return VerifiedCheckpoint(authority, seed, nodes, team, feedback, prefix)

# Anchored persistence; explicit native integration is provided below.
from store import Conflict as NativeStoreConflict
import copy
import json
import os
import stat
import time
import uuid
from contextlib import contextmanager
from pathlib import Path



class TailConflict(CheckpointRejected, NativeStoreConflict):
    pass


MAX_EVENT_BYTES = 20 * 1024 * 1024
MAX_ARTIFACT_BYTES = 30 * 1024 * 1024


class CheckpointTail:
    def __init__(self, directory, checkpoint, *, context=None):
        self.root = Path(directory).absolute()
        require(self.root == self.root.resolve() and self.root.is_dir()
                and not self.root.is_symlink(), 'TAIL_ROOT_ALIAS_OR_MISSING')
        self._checkpoint = checkpoint
        for child in ['events', 'artifacts']:
            target = self.root / child
            require(target.is_dir() and not target.is_symlink()
                    and target.resolve() == target, 'TAIL_CHILD_KIND')
        state = checkpoint.state_snapshot(FIXED_WORK)
        self._origin = {'schemaVersion': 'qf01-checkpoint-tail-prototype/1',
                        'contractSHA256': FIXED_CONTRACT_SHA256,
                        'work': FIXED_WORK, 'sourceSHA': state['candidate_sha'],
                        'baseStateSHA256': digest(state), 'anchor': checkpoint.anchor,
                        'missingHistoricalPrefix': True, 'semanticAdoption': False}
        if context is not None:
            self._origin['context'] = copy.deepcopy(context)
        self._origin_bytes = canonical(self._origin) + b'\n'
        self._validate_origin()

    @classmethod
    def create(cls, directory, checkpoint, *, context=None):
        root = Path(directory).absolute()
        require(root == root.resolve() and root.parent.is_dir()
                and not root.exists() and not root.is_symlink(), 'TAIL_DESTINATION_MUST_BE_NEW')
        # Never initialize or overwrite an existing native Store.
        root.mkdir()
        (root / 'events').mkdir(); (root / 'artifacts').mkdir()
        state = checkpoint.state_snapshot(FIXED_WORK)
        origin = {'schemaVersion': 'qf01-checkpoint-tail-prototype/1',
                  'contractSHA256': FIXED_CONTRACT_SHA256,
                  'work': FIXED_WORK, 'sourceSHA': state['candidate_sha'],
                  'baseStateSHA256': digest(state), 'anchor': checkpoint.anchor,
                  'missingHistoricalPrefix': True, 'semanticAdoption': False}
        if context is not None:
            origin['context'] = copy.deepcopy(context)
        with (root / 'CHECKPOINT_ORIGIN.json').open('xb') as stream:
            stream.write(canonical(origin) + b'\n'); stream.flush(); os.fsync(stream.fileno())
        return cls(root, checkpoint, context=context)

    def _validate_origin(self):
        require(self.root.is_dir() and not self.root.is_symlink()
                and self.root.resolve() == self.root, 'TAIL_ROOT_CHANGED')
        require(read_regular(self.root / 'CHECKPOINT_ORIGIN.json', 8192) == self._origin_bytes,
                'TAIL_ORIGIN_CHANGED')
        for name in ['events', 'artifacts']:
            child = self.root / name
            require(child.is_dir() and not child.is_symlink()
                    and child.resolve() == child, 'TAIL_CHILD_CHANGED')

    def events(self):
        self._validate_origin()
        files = sorted((self.root / 'events').iterdir())
        raw_rows, names = [], []
        for file in files:
            require(file.suffix == '.json' and file.is_file() and not file.is_symlink(),
                    'TAIL_PARTIAL_OR_UNEXPECTED_FILE')
            raw_rows.append(read_regular(file, MAX_EVENT_BYTES)); names.append(file.name)
        suffix = self._checkpoint.verify_suffix(raw_rows)
        rows = suffix.events()
        require(all(name == f'{row["seq"]:08d}-{row["id"]}.json'
                    for name, row in zip(names, rows)), 'TAIL_EVENT_FILENAME_MISMATCH')
        return rows

    @property
    def head(self):
        rows = self.events()
        return rows[-1]['hash'] if rows else self._checkpoint.anchor['head']

    def summary(self):
        suffix = self._checkpoint.verify_suffix(self.events())
        return {**suffix.summary(), 'persistentTail': True,
                'semanticAdoption': False, 'originalPrefixAvailable': False,
                'globalQueueCoverage': 'UNKNOWN', 'staleLockRecovery': 'UNSUPPORTED'}

    @contextmanager
    def _exclusive(self):
        self._validate_origin()
        lock = self.root / '.writer-lock'
        raw = canonical({'schemaVersion': 'checkpoint-exclusive-owner-token/1',
                         'token': uuid.uuid4().hex, 'originSHA256': sha(self._origin_bytes)})
        try:
            fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        except FileExistsError as error:
            raise TailConflict('TAIL_LOCK_PRESENT_NO_LIVENESS_GUESS') from error
        identity = os.fstat(fd)
        try:
            os.write(fd, raw); os.fsync(fd)
            yield
        finally:
            os.close(fd)
            current = lock.lstat()
            require(stat.S_ISREG(current.st_mode) and not lock.is_symlink()
                    and (current.st_dev, current.st_ino) == (identity.st_dev, identity.st_ino)
                    and lock.read_bytes() == raw, 'TAIL_LOCK_OWNERSHIP_CHANGED')
            lock.unlink()

    def append(self, kind, work, payload, *, expected, event_id=None):
        require(isinstance(expected, str) and SHA256.fullmatch(expected), 'EXPECTED_HEAD_REQUIRED')
        require(isinstance(kind, str) and kind and isinstance(work, str) and work
                and isinstance(payload, dict), 'APPEND_SCHEMA')
        require(not (kind == 'opened' and work == FIXED_WORK), 'CANNOT_REOPEN_CHECKPOINT_WORK')
        eid = str(uuid.uuid4()) if event_id is None else event_id
        require(isinstance(eid, str) and 0 < len(eid) <= 128
                and EVENT_ID.fullmatch(eid), 'APPEND_EVENT_ID')
        # This only bounds serialization; Runtime must validate operation semantics.
        body_payload = strict_json(canonical(payload))
        with self._exclusive():
            rows = self.events()
            head = rows[-1]['hash'] if rows else self._checkpoint.anchor['head']
            if head != expected:
                raise TailConflict('TAIL_EXPECTED_HEAD_CHANGED')
            for row in rows:
                if row['id'] == eid:
                    if (row['kind'], row['work'], row['payload']) == (kind, work, body_payload):
                        return copy.deepcopy(row)
                    raise TailConflict('TAIL_EVENT_ID_REUSED_WITH_DIFFERENT_CONTENT')
            seq = rows[-1]['seq'] + 1 if rows else self._checkpoint.anchor['events'] + 1
            event = {'seq': seq, 'previous': head, 'id': eid, 'time': time.time(),
                     'kind': kind, 'work': work, 'payload': body_payload}
            event['hash'] = digest(event)
            event_bytes = canonical(event) + b'\n'
            require(len(event_bytes) <= MAX_EVENT_BYTES, 'TAIL_EVENT_SIZE_LIMIT')
            self._checkpoint.verify_suffix(rows + [event])
            target = self.root / 'events' / f'{seq:08d}-{eid}.json'
            temporary = self.root / 'events' / ('.' + uuid.uuid4().hex + '.tmp')
            with temporary.open('xb') as stream:
                stream.write(event_bytes); stream.flush(); os.fsync(stream.fileno())
            # Hard-link creation is exclusive on both POSIX and NTFS. Never replace
            # a pre-existing event. A crash leaves a lock/tmp that blocks reuse.
            os.link(temporary, target)
            temporary.unlink()
            return copy.deepcopy(event)

    def get(self, reference):
        require(isinstance(reference, str) and SHA256.fullmatch(reference), 'ARTIFACT_REFERENCE')
        self._validate_origin()
        target = self.root / 'artifacts' / (reference + '.json')
        if not target.exists() and not target.is_symlink():
            return self._checkpoint.object(reference)
        raw = read_regular(target, MAX_ARTIFACT_BYTES)
        value = strict_json(raw)
        require(raw in (canonical(value), canonical(value) + b'\n') and digest(value) == reference,
                'TAIL_ARTIFACT_CONTENT_HASH')
        return value

    def put(self, value):
        raw = canonical(value)
        require(len(raw) + 1 <= MAX_ARTIFACT_BYTES, 'TAIL_ARTIFACT_SIZE_LIMIT')
        reference = digest(value)
        with self._exclusive():
            # A corrupt existing object is never repaired by silent replacement.
            target = self.root / 'artifacts' / (reference + '.json')
            if target.exists() or target.is_symlink():
                require(self.get(reference) == value, 'TAIL_ARTIFACT_CONFLICT')
                return reference
            try:
                original = self._checkpoint.object(reference)
            except UnknownContext:
                checkpoint_has_object = False
            else:
                checkpoint_has_object = True
            if checkpoint_has_object:
                require(original == value, 'CHECKPOINT_ARTIFACT_CONFLICT')
                return reference
            temporary = self.root / 'artifacts' / ('.' + uuid.uuid4().hex + '.tmp')
            with temporary.open('xb') as stream:
                stream.write(raw + b'\n'); stream.flush(); os.fsync(stream.fileno())
            os.link(temporary, target); temporary.unlink()
            return reference


# Explicit, adopted native entry. Diagnostic codecs above grant no permission.
RECOVERY_PROPOSAL_SHA256 = '1d167fe02fa7e6fa8480f45e5c0bb02d5d401f869e82952940311103284ee86b'
RECOVERY_WORK = 'W-TECH-QF01-CHECKPOINT-RECOVERY-20261122'
PUBLISHER_WORK = 'W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
NEW_TECHNICAL_WORKS = frozenset((RECOVERY_WORK, PUBLISHER_WORK))
INFORMED_REVIEW_PROPOSAL_SHA256 = '706ac7b5231831cfee8d67fe2a6080a05e2bb7c9770c3d246ec5a8ca8bcb5c60'
INFORMED_REVIEWERS = ('/root/authority_review', '/root/axis_review')
INFORMED_REVIEW_NODES = ('R04_PROPOSAL@qf01-full-lesson',
    'R07_SEMANTIC@qf01-full-lesson', 'G2_AUDIT@qf01-p035')
INFORMED_FIRST_PASS_REFS = ('47f83f587abc5c97f4bc3b35cd7cc742a1aaf8b1390f5960d04daa32b1d6f660',
    'edf10aa967a23b94e68e96f7975a322e31886f16fc8ebcf3144d32043e72fff3')
INFORMED_PROPOSAL_PATH = 'work/items/'+RECOVERY_WORK+'/REVIEW_METHOD_PROPOSAL_D02.md'
INFORMED_ADOPTION_CALL_ID = 'call_27be7afbeef843249d088b530a5701b7'
INFORMED_AUTHORITY_FIELDS = frozenset(('schemaVersion','method','proposalSHA256','work',
    'checkpointEpoch','expectedHead','originalPlanSHA256','originalUsersSHA256',
    'originalContractSHA256','originalAnchor','originalSourceSHA','currentSourceSHA',
    'candidateManifestSHA256','definitionHash','implementationHash','core','reviewerRefs',
    'nodeIDs','historicalFirstPassRefs','authorMatrix','adoption','evidenceRefs',
    'independent','sourceFirst','firstPass','globalQueueCoverage'))
CURRENT_REPAIR_AFTER = {
    'src/components/textbook/GuidedMathReadingFlow.tsx': '8e07c4fd4d67b43c1de2209296c85f2a8c7852b181d819ee13f579531c34f818',
    'src/components/textbook/guided-math-reading.css': 'ca65220a401bcff9c325fe8e7f25c0be3306511092a5a6f9cb52df3f581383a8',
    'src/components/textbook/QF01ReadingRevision3.test.tsx': 'fae8664194de2344533ead564fe190be46c86b2424d3e0f9bfd4b95a41fa36d0',
    'src/domain/transformationReading.ts': '3f81a3852d477b9da6d34f18f79442dbfcebbe1b4561e6b83af64e4669957774',
    'src/domain/readingSourceViews.test.ts': '7a2916a7afc966e7bf6b2b79769e7f751931c0630140acfe547a9ade539b5b9c'}
NEARBY_REPAIR_PROPOSAL_SHA256 = '6e072c442c602947169f63bc5711e559377e685a5adffa872eccf5b56f3332cf'
NEARBY_REPAIR_PROPOSAL_PATH = 'work/items/'+RECOVERY_WORK+'/NEARBY_VISIBILITY_PROPOSAL_D03.md'
NEARBY_REPAIR_BASELINE = '247cb09b1d852d4e4fa469b3d74fb29bee053c53'
NEARBY_REPAIR_ADOPTION_CALL_ID = 'call_d8bca8dac40a458ca60d5346bbd6e8d5'
NEARBY_REPAIR_ADOPTION_QUOTE = 'D03案V2を採用し、記載範囲の公開反映とCIも許可する'
NEARBY_REPAIR_PRODUCT_PATHS = ('src/components/textbook/GuidedMathReadingFlow.tsx',
    'src/components/textbook/QF01ReadingRevision3.test.tsx')
NEARBY_REPAIR_CORE_PATHS = frozenset('workflow/'+name for name in (
    'checkpoint.py','adapters.py','runtime.py','team.py','cli.py','integration.py','definitions.py',
    'test_checkpoint.py','test_checkpoint_runtime.py','test_checkpoint_definition.py','INTEGRATION_RUNBOOK.md'))
NEARBY_REPAIR_FIELDS = frozenset(('schemaVersion','proposalSHA256','evidenceRef','transcriptionSHA256',
    'quote','source_ref','verification_level','baselineSourceSHA','candidateBeforeSHA','candidateAfterSHA',
    'allowedProductPaths','beforeRepair','afterRepair','definitionHash','implementationHash','checkpointEpoch'))


def validate_nearby_repair_record(record, *, epoch=None, check=require):
    """Validate the adopted two-path supplement without reinterpreting old proofs."""
    check(isinstance(record,dict) and set(record)==NEARBY_REPAIR_FIELDS,'D03_REPAIR_RECORD_FIELDS')
    check(record.get('schemaVersion')=='qf01-nearby-visibility-supplement/1'
        and record.get('proposalSHA256')==NEARBY_REPAIR_PROPOSAL_SHA256
        and record.get('baselineSourceSHA')==NEARBY_REPAIR_BASELINE,'D03_FIXED_PROPOSAL_BASELINE')
    check(record.get('quote')==NEARBY_REPAIR_ADOPTION_QUOTE
        and record.get('source_ref')=='request_user_input_async/'+NEARBY_REPAIR_ADOPTION_CALL_ID
        and record.get('verification_level')=='conversation_transcribed','D03_ACTUAL_ADOPTION_REQUIRED')
    for name in ('transcriptionSHA256','definitionHash','implementationHash','checkpointEpoch'):
        check(isinstance(record.get(name),str) and SHA256.fullmatch(record[name]),'D03_REPAIR_HASH:'+name)
    check(epoch is None or record['checkpointEpoch']==epoch,'D03_REPAIR_EPOCH')
    check(isinstance(record.get('evidenceRef'),str) and EVENT_ID.fullmatch(record['evidenceRef']),
          'D03_REPAIR_EVIDENCE_ID')
    for name in ('candidateBeforeSHA','candidateAfterSHA'):
        check(isinstance(record.get(name),str) and re.fullmatch(r'[0-9a-f]{40}',record[name]),
              'D03_REPAIR_CANDIDATE_SHA:'+name)
    check(record['candidateAfterSHA'] not in (record['candidateBeforeSHA'],NEARBY_REPAIR_BASELINE),
          'D03_REPAIR_NEW_CANDIDATE_REQUIRED')
    before={name:CURRENT_REPAIR_AFTER[name] for name in NEARBY_REPAIR_PRODUCT_PATHS}
    check(record.get('allowedProductPaths')==list(NEARBY_REPAIR_PRODUCT_PATHS)
        and record.get('beforeRepair')==before,'D03_EXACT_TWO_PATH_PREIMAGE')
    after=record.get('afterRepair')
    check(isinstance(after,dict) and set(after)==set(before)
        and all(isinstance(value,str) and SHA256.fullmatch(value) for value in after.values())
        and after!=before,'D03_EXACT_TWO_PATH_AFTERIMAGE')
    return copy.deepcopy(record)


def nearby_repair_adoption_file(rt, state, reference):
    """Read the actual supplemental adoption; do not mint a material approval."""
    from contracts import need, file
    need(getattr(rt.store,'checkpoint_mode',False) and state['plan']['work_id']==FIXED_WORK,
         'D03_CHECKPOINT_WORK_REQUIRED')
    evidence=state['evidence'].get(reference,{})
    need(evidence.get('kind')=='file' and evidence.get('verification_level')!='simulation',
         'D03_ACTUAL_ADOPTION_FILE_REQUIRED')
    data=evidence.get('data',{});path=file(rt.root,data['path'])
    need(path.stat().st_size<=1_048_576,'D03_ADOPTION_FILE_LIMIT')
    raw=path.read_bytes();need(sha(raw)==data.get('sha256'),'D03_ADOPTION_FILE_CHANGED')
    adopted=strict_json(raw)
    need(adopted.get('schemaVersion')=='qf01-d03-v2-actual-user-adoption/1'
        and adopted.get('proposalSHA256')==NEARBY_REPAIR_PROPOSAL_SHA256
        and adopted.get('quote')==NEARBY_REPAIR_ADOPTION_QUOTE
        and adopted.get('source_ref')=='request_user_input_async/'+NEARBY_REPAIR_ADOPTION_CALL_ID
        and adopted.get('verification_level')=='conversation_transcribed' and adopted.get('adopted') is True,
        'D03_EXACT_ACTUAL_USER_ADOPTION')
    need(adopted.get('productPaths')==list(NEARBY_REPAIR_PRODUCT_PATHS)
        and adopted.get('publicCodePathMaximum')==20
        and adopted.get('publicProposalPath')==NEARBY_REPAIR_PROPOSAL_PATH
        and adopted.get('nativeLedgerOrLearningOrCredentialsIncluded') is False,
        'D03_ACTUAL_ADOPTION_SCOPE')
    need(sha(file(rt.root,NEARBY_REPAIR_PROPOSAL_PATH).read_bytes())==NEARBY_REPAIR_PROPOSAL_SHA256,
         'D03_FIXED_PROPOSAL_BYTES')
    return {'evidenceRef':reference,'transcriptionSHA256':sha(raw),'quote':adopted['quote'],
            'source_ref':adopted['source_ref'],'verification_level':adopted['verification_level']}


def current_nearby_repair(rt, state):
    """A supplement is current only for its actual migrated source/code/input."""
    from contracts import need, file
    from capabilities import implementation_hash
    migration=state.get('checkpoint_definition_migration',{})
    record=migration.get('repairAdoption')
    if record is None:return None
    need(getattr(rt.store,'checkpoint_mode',False) and state['plan']['work_id']==FIXED_WORK,
         'D03_CHECKPOINT_WORK_REQUIRED')
    record=validate_nearby_repair_record(record,epoch=rt.store.checkpoint_epoch,check=need)
    need(state['plan']['work_id']==FIXED_WORK
        and record['candidateAfterSHA']==state['candidate_sha']==migration.get('candidateSHA')
        and record['definitionHash']==state['definition_hash']==migration.get('to')
        and record['implementationHash']==implementation_hash(rt),'D03_CURRENT_SOURCE_DEFINITION_SERVICE')
    adopted=nearby_repair_adoption_file(rt,state,record['evidenceRef'])
    need(all(record.get(key)==value for key,value in adopted.items()),'D03_REPAIR_ADOPTION_CHANGED')
    effective={**CURRENT_REPAIR_AFTER,**record['afterRepair']}
    need(all(sha(file(rt.root,name).read_bytes())==value for name,value in effective.items()),
         'D03_CURRENT_PRODUCT_BYTES')
    return record


MATH_RENDERING_REPAIR_PROPOSAL_SHA256 = '09a4c45c229d1b18190541a1441ee18d2b9d5d07dc62020b684b64b033d6fd85'
MATH_RENDERING_REPAIR_PROPOSAL_PATH = 'work/items/'+RECOVERY_WORK+'/MATH_PROSE_RENDERING_PROPOSAL_D04.md'
MATH_RENDERING_REPAIR_BASELINE = '900642faf76267546c5c7420b7d50a010516ca6e'
MATH_RENDERING_REPAIR_ADOPTION_CALL_ID = 'call_93a584b6ba4842a3badb87262bb07b2b'
MATH_RENDERING_REPAIR_ADOPTION_QUOTE = 'D04案を採用し、記載範囲の公開反映とCIも許可する'
MATH_RENDERING_REPAIR_PRODUCT_PATHS = NEARBY_REPAIR_PRODUCT_PATHS
MATH_RENDERING_REPAIR_CORE_PATHS = NEARBY_REPAIR_CORE_PATHS
MATH_RENDERING_REPAIR_BEFORE = {
    'src/components/textbook/GuidedMathReadingFlow.tsx':'4fb2042b5647620d504a30d334a9d36688b28f7d80fee380c0efbdd5c09ad964',
    'src/components/textbook/QF01ReadingRevision3.test.tsx':'41cdfc2a6a75e29bb68ccb959e88cbec9c6a9c96235cade13ca363fca78fc320'}
MATH_RENDERING_REPAIR_D03_EVENT_HASH = 'bad3d783c3d3c9ac40b566bf5a6d4a3eec45b0d5e8ab8f82c1a90b48a7b2f108'
MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256 = 'f8ebbd59f53e025d59ff1f888b5d3cb7e4f76cba6b2108087081db16ddc8e00b'
MATH_RENDERING_REPAIR_FIELDS = NEARBY_REPAIR_FIELDS | frozenset((
    'candidateBeforeManifestSHA256','originalD03MigrationEventHash','originalD03SupplementSHA256'))
MATH_RENDERING_REPAIR_IMMUTABLE_FIELDS = frozenset((
    'proposalSHA256','evidenceRef','transcriptionSHA256','quote','source_ref','verification_level',
    'baselineSourceSHA','allowedProductPaths','beforeRepair','originalD03MigrationEventHash',
    'originalD03SupplementSHA256','checkpointEpoch'))


def validate_math_rendering_repair_record(record, *, epoch=None, check=require):
    """D04 is a separate permission; the actual D03 C record is never retagged."""
    check(isinstance(record,dict) and set(record)==MATH_RENDERING_REPAIR_FIELDS,'D04_REPAIR_RECORD_FIELDS')
    check(record.get('schemaVersion')=='qf01-math-prose-rendering-supplement/1'
        and record.get('proposalSHA256')==MATH_RENDERING_REPAIR_PROPOSAL_SHA256
        and record.get('baselineSourceSHA')==MATH_RENDERING_REPAIR_BASELINE,'D04_FIXED_PROPOSAL_BASELINE')
    check(record.get('quote')==MATH_RENDERING_REPAIR_ADOPTION_QUOTE
        and record.get('source_ref')=='request_user_input_async/'+MATH_RENDERING_REPAIR_ADOPTION_CALL_ID
        and record.get('verification_level')=='conversation_transcribed','D04_ACTUAL_ADOPTION_REQUIRED')
    for key in ('transcriptionSHA256','candidateBeforeManifestSHA256','definitionHash','implementationHash','checkpointEpoch'):
        check(isinstance(record.get(key),str) and SHA256.fullmatch(record[key]),'D04_REPAIR_HASH:'+key)
    check(epoch is None or record['checkpointEpoch']==epoch,'D04_REPAIR_EPOCH')
    check(isinstance(record.get('evidenceRef'),str) and len(record['evidenceRef'])<=128
        and EVENT_ID.fullmatch(record['evidenceRef']),'D04_REPAIR_EVIDENCE_ID')
    check(record.get('originalD03MigrationEventHash')==MATH_RENDERING_REPAIR_D03_EVENT_HASH
        and record.get('originalD03SupplementSHA256')==MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256,
        'D04_FIXED_D03_PREDECESSOR')
    for key in ('candidateBeforeSHA','candidateAfterSHA'):
        check(isinstance(record.get(key),str) and re.fullmatch(r'[0-9a-f]{40}',record[key]),'D04_REPAIR_CANDIDATE_SHA:'+key)
    check(record['candidateAfterSHA'] not in (record['candidateBeforeSHA'],MATH_RENDERING_REPAIR_BASELINE),
          'D04_NEW_CANDIDATE_REQUIRED')
    check(record.get('allowedProductPaths')==list(MATH_RENDERING_REPAIR_PRODUCT_PATHS)
        and record.get('beforeRepair')==MATH_RENDERING_REPAIR_BEFORE,'D04_EXACT_C_TWO_PATH_PREIMAGE')
    after=record.get('afterRepair')
    check(isinstance(after,dict) and set(after)==set(MATH_RENDERING_REPAIR_BEFORE)
        and all(isinstance(v,str) and SHA256.fullmatch(v) for v in after.values())
        and after!=MATH_RENDERING_REPAIR_BEFORE,'D04_EXACT_TWO_PATH_AFTERIMAGE')
    return copy.deepcopy(record)


def validate_math_rendering_repair_continuation(previous, current, *, earlier_after=(), check=require):
    validate_math_rendering_repair_record(current,check=check)
    if previous is None:
        check(current['candidateBeforeSHA']==MATH_RENDERING_REPAIR_BASELINE,'D04_FIRST_MIGRATION_REQUIRES_C')
    else:
        validate_math_rendering_repair_record(previous,check=check)
        check(all(current[k]==previous[k] for k in MATH_RENDERING_REPAIR_IMMUTABLE_FIELDS),
              'D04_PRESERVED_SUPPLEMENTAL_ADOPTION')
        check(current['candidateBeforeSHA']==previous['candidateAfterSHA'],'D04_ACTUAL_PREVIOUS_CANDIDATE')
        check(current['afterRepair']==previous['afterRepair']
            or current['afterRepair'] not in earlier_after,'D04_OLD_AFTERIMAGE_ROLLBACK')
    return copy.deepcopy(current)


def math_rendering_repair_adoption_file(rt, state, reference):
    from contracts import need, file
    need(getattr(rt.store,'checkpoint_mode',False) and state['plan']['work_id']==FIXED_WORK,
         'D04_CHECKPOINT_WORK_REQUIRED')
    evidence=state['evidence'].get(reference,{})
    need(evidence.get('kind')=='file' and evidence.get('verification_level')!='simulation',
         'D04_ACTUAL_ADOPTION_FILE_REQUIRED')
    data=evidence.get('data',{});path=file(rt.root,data['path'])
    need(path.stat().st_size<=1_048_576,'D04_ADOPTION_FILE_LIMIT')
    raw=path.read_bytes();need(sha(raw)==data.get('sha256'),'D04_ADOPTION_FILE_CHANGED')
    adopted=strict_json(raw)
    need(adopted.get('schemaVersion')=='qf01-d04-actual-user-adoption/1'
        and adopted.get('proposalSHA256')==MATH_RENDERING_REPAIR_PROPOSAL_SHA256
        and adopted.get('quote')==MATH_RENDERING_REPAIR_ADOPTION_QUOTE
        and adopted.get('source_ref')=='request_user_input_async/'+MATH_RENDERING_REPAIR_ADOPTION_CALL_ID
        and adopted.get('verification_level')=='conversation_transcribed' and adopted.get('adopted') is True,
        'D04_EXACT_ACTUAL_USER_ADOPTION')
    need(adopted.get('baselineSourceSHA')==MATH_RENDERING_REPAIR_BASELINE
        and adopted.get('productPaths')==list(MATH_RENDERING_REPAIR_PRODUCT_PATHS)
        and adopted.get('publicCodePathMaximum')==20
        and adopted.get('publicProposalPath')==MATH_RENDERING_REPAIR_PROPOSAL_PATH
        and adopted.get('nativeLedgerOrLearningOrCredentialsIncluded') is False
        and adopted.get('originalD03MigrationEventHash')==MATH_RENDERING_REPAIR_D03_EVENT_HASH
        and adopted.get('originalD03SupplementSHA256')==MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256,
        'D04_ACTUAL_ADOPTION_SCOPE')
    need(sha(file(rt.root,MATH_RENDERING_REPAIR_PROPOSAL_PATH).read_bytes())==MATH_RENDERING_REPAIR_PROPOSAL_SHA256,
         'D04_FIXED_PROPOSAL_BYTES')
    return {'evidenceRef':reference,'transcriptionSHA256':sha(raw),'quote':adopted['quote'],
            'source_ref':adopted['source_ref'],'verification_level':adopted['verification_level']}


def preserved_nearby_repair(rt, state):
    """For D04, authenticate historical C without pretending its core is D."""
    from contracts import need
    migration=state.get('checkpoint_definition_migration',{})
    math_repair=migration.get('mathRenderingRepair')
    if math_repair is None:return current_nearby_repair(rt,state)
    validate_math_rendering_repair_record(math_repair,epoch=rt.store.checkpoint_epoch,check=need)
    original=[e for e in rt.store.suffix_events() if e['hash']==MATH_RENDERING_REPAIR_D03_EVENT_HASH]
    need(len(original)==1 and original[0]['work']==FIXED_WORK
        and original[0]['kind']=='checkpoint_definition_migrated','D04_AUTHENTIC_D03_EVENT_REQUIRED')
    payload=original[0]['payload'];nearby=payload.get('repairAdoption')
    validate_nearby_repair_record(nearby,epoch=rt.store.checkpoint_epoch,check=need)
    need(digest(nearby)==MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256
        and payload.get('candidateSHA')==nearby['candidateAfterSHA']==MATH_RENDERING_REPAIR_BASELINE
        and nearby['afterRepair']==MATH_RENDERING_REPAIR_BEFORE
        and migration.get('repairAdoption')==nearby,'D04_PRESERVED_D03_C_RECORD')
    adopted=nearby_repair_adoption_file(rt,state,nearby['evidenceRef'])
    need(all(nearby.get(k)==v for k,v in adopted.items()),'D04_ORIGINAL_D03_ADOPTION_CHANGED')
    return copy.deepcopy(nearby)


def current_math_rendering_repair(rt, state):
    from contracts import need, file
    from capabilities import implementation_hash
    migration=state.get('checkpoint_definition_migration',{})
    record=migration.get('mathRenderingRepair')
    if record is None:return None
    need(getattr(rt.store,'checkpoint_mode',False) and state['plan']['work_id']==FIXED_WORK,'D04_CHECKPOINT_WORK_REQUIRED')
    record=validate_math_rendering_repair_record(record,epoch=rt.store.checkpoint_epoch,check=need)
    need(record['candidateAfterSHA']==state['candidate_sha']==migration.get('candidateSHA')
        and record['definitionHash']==state['definition_hash']==migration.get('to')
        and record['implementationHash']==implementation_hash(rt),'D04_CURRENT_SOURCE_DEFINITION_SERVICE')
    adopted=math_rendering_repair_adoption_file(rt,state,record['evidenceRef'])
    need(all(record.get(k)==v for k,v in adopted.items()),'D04_REPAIR_ADOPTION_CHANGED')
    preserved_nearby_repair(rt,state)
    effective={**CURRENT_REPAIR_AFTER,**record['afterRepair']}
    need(all(sha(file(rt.root,p).read_bytes())==v for p,v in effective.items()),'D04_CURRENT_PRODUCT_BYTES')
    return record


def current_product_repair_context(rt, state):
    math_repair=current_math_rendering_repair(rt,state)
    nearby=preserved_nearby_repair(rt,state) if math_repair else current_nearby_repair(rt,state)
    return {'nearbyRepair':nearby,'mathRenderingRepair':math_repair,
            'effectiveAfter':{**CURRENT_REPAIR_AFTER,**((math_repair or nearby or {}).get('afterRepair',{}))},
            'ownerProposalSHA256':MATH_RENDERING_REPAIR_PROPOSAL_SHA256 if math_repair else
                NEARBY_REPAIR_PROPOSAL_SHA256 if nearby else INFORMED_REVIEW_PROPOSAL_SHA256}


ADOPTION_CALL_ID = 'call_d1c88a5dde794be288a201a5ea8de0cc'
ORIGIN_NAMES = frozenset(('publisher-contract.json', 'BUILD_AUTHORITY.blob',
    'APPROVED_MATERIAL_SEED.json', 'NODES.json', 'ORIGIN_SOURCE_PROOF.json',
    'ORIGIN_SOURCE_SNAPSHOT.json', 'TEAM_PREFIX_SUBSET.json',
    'KNOWN_PREFIX_ENVELOPES.json', 'FEEDBACK_PROJECTION.json'))


def _source_recovery(view, proof_raw, snapshot_raw):
    proof, snapshot = strict_json(proof_raw), strict_json(snapshot_raw)
    state = view.state_snapshot(FIXED_WORK)
    require(proof.get('schemaVersion') == 'qf01-git-origin-source-recovery/1'
            and proof.get('repository') == 'rrikunagasige-dot/kyotsu-step-web'
            and proof.get('repositoryId') == 1391122224
            and proof.get('work') == FIXED_WORK, 'SOURCE_RECOVERY_IDENTITY')
    require(snapshot.get('source_sha') == state['plan']['source_sha']
            and set(snapshot.get('files_hex', {})) == set(state['plan']['source_manifest']),
            'SOURCE_RECOVERY_MANIFEST')
    require(digest(snapshot) == proof.get('snapshotSHA256')
            == '08d0e50a4a8bf7c7f823f016a7389b02815285334902da09d037e7ad98e88b2a',
            'SOURCE_RECOVERY_SNAPSHOT_HASH')
    require(proof.get('sourceManifest') == state['plan']['source_manifest']
            and proof.get('sourceSHA') == state['plan']['source_sha']
            and proof.get('checkpointAnchor') == view.anchor
            and proof.get('snapshotBytes') == len(canonical(snapshot))
            and proof.get('originalOpenedEventRecovered') is False
            and proof.get('nativeStoreWritten') is False, 'SOURCE_RECOVERY_PROVENANCE')
    expected_blobs = {'src/components/textbook/GuidedMathReadingFlow.tsx': '472d5306b607ce89977e99283a598ef44133002a',
        'src/data/textbook/math/quadratic/qf01Lesson.test.tsx': 'e668d363e64d35ae5b18406d6942857b454afb56'}
    rows = proof.get('files')
    require(isinstance(rows, list) and len(rows) == 2 and all(isinstance(row, dict) for row in rows)
            and {row.get('path') for row in rows} == set(expected_blobs), 'SOURCE_RECOVERY_ROWS')
    for name, encoded in snapshot['files_hex'].items():
        try:
            raw = bytes.fromhex(encoded)
        except (TypeError, ValueError) as error:
            raise CheckpointRejected('SOURCE_RECOVERY_HEX') from error
        require(sha(raw) == state['plan']['source_manifest'][name], 'SOURCE_RECOVERY_FILE_HASH')
        require(hashlib.sha1(b'blob ' + str(len(raw)).encode('ascii') + b'\0' + raw).hexdigest()
                == expected_blobs[name], 'SOURCE_RECOVERY_GIT_BLOB')
        row = next(row for row in rows if row['path'] == name)
        require(row.get('bytes') == len(raw) and row.get('sha256') == sha(raw)
                and row.get('gitBlobSHA') == expected_blobs[name], 'SOURCE_RECOVERY_ROW_HASH')
    return proof, snapshot


class CheckpointStore:
    """Scoped recovered state plus a new complete suffix; never a full old ledger."""
    checkpoint_mode = True

    def __init__(self, directory, *, _initializing=False):
        self._initializing = _initializing
        self.root = Path(directory).absolute()
        origin_raw = read_regular(self.root / 'CHECKPOINT_ORIGIN.json', 1024 * 1024)
        origin = strict_json(origin_raw)
        require(origin_raw == canonical(origin) + b'\n', 'NATIVE_ORIGIN_CANONICAL')
        context = origin.get('context', {})
        require(context.get('schemaVersion') == 'qf01-native-checkpoint-origin/1'
                and context.get('proposalSHA256') == RECOVERY_PROPOSAL_SHA256
                and set(context.get('newTechnicalWorks', [])) == NEW_TECHNICAL_WORKS,
                'NATIVE_ORIGIN_SCOPE')
        core = context.get('bootstrapCore')
        require(isinstance(core, dict) and set(core) == {'definitionHash', 'files'}
                and isinstance(core['definitionHash'], str) and re.fullmatch(r'[0-9a-f]{64}', core['definitionHash'])
                and isinstance(core['files'], dict) and core['files']
                and all(isinstance(name, str) and '/' not in name and '\\' not in name
                        and isinstance(value, str) and re.fullmatch(r'[0-9a-f]{64}', value)
                        for name, value in core['files'].items())
                and isinstance(context.get('executor'), str) and context['executor'].strip(),
                'NATIVE_BOOTSTRAP_CODE_EXECUTOR_REQUIRED')
        adoption = context.get('adoption', {})
        require(adoption.get('quote') == 'この限定案を採用して進める'
                and adoption.get('verification_level') == 'conversation_transcribed'
                and ADOPTION_CALL_ID in adoption.get('source_ref', '')
                and adoption.get('proposal_sha256') == RECOVERY_PROPOSAL_SHA256,
                'NATIVE_ADOPTION_REQUIRED')
        hashes = context.get('originFilesSHA256', {})
        require(set(hashes) == ORIGIN_NAMES, 'NATIVE_ORIGIN_FILE_INVENTORY')
        self._origin_signatures = {}
        for name, expected in hashes.items():
            source = self.root / 'origin' / name
            raw = read_regular(source, 30 * 1024 * 1024)
            require(sha(raw) == expected, 'NATIVE_ORIGIN_FILE_HASH:' + name)
            self._origin_signatures[name] = self._signature(source)
        self._view = load_qf01_checkpoint(self.root / 'origin/publisher-contract.json',
                                          self.root / 'origin/BUILD_AUTHORITY.blob')
        self._tail = CheckpointTail(self.root, self._view, context=context)
        self._context = copy.deepcopy(context)
        self.checkpoint_epoch = sha(origin_raw)
        self._source_proof, self._source_snapshot = _source_recovery(self._view,
            read_regular(self.root / 'origin/ORIGIN_SOURCE_PROOF.json', 1024 * 1024),
            read_regular(self.root / 'origin/ORIGIN_SOURCE_SNAPSHOT.json', 1024 * 1024))
        self._validate_projection_files()
        self.suffix_events()

    @staticmethod
    def _signature(path):
        value = path.lstat()
        require(stat.S_ISREG(value.st_mode) and not path.is_symlink(), 'ORIGIN_NOT_REGULAR')
        return value.st_dev, value.st_ino, value.st_size, value.st_mtime_ns

    def _validate_origin(self):
        self._tail._validate_origin()
        require((self.root / 'origin').resolve() == self.root / 'origin', 'ORIGIN_DIRECTORY_ALIAS')
        for name, expected in self._origin_signatures.items():
            require(self._signature(self.root / 'origin' / name) == expected,
                    'ORIGIN_CHANGED_AFTER_OPEN:' + name)

    def _validate_projection_files(self):
        source = self.root / 'origin'
        require(digest(strict_json(read_regular(source / 'APPROVED_MATERIAL_SEED.json', 20 * 1024 * 1024)))
                == digest(self._view._seed), 'ORIGIN_SEED_PROJECTION')
        require(strict_json(read_regular(source / 'NODES.json', 1024 * 1024)) == self._view.nodes(), 'ORIGIN_NODES_PROJECTION')
        require(strict_json(read_regular(source / 'TEAM_PREFIX_SUBSET.json', 5 * 1024 * 1024))
                == self._view.team_prefix_subset(FIXED_WORK)['events'], 'ORIGIN_TEAM_PROJECTION')
        require(strict_json(read_regular(source / 'KNOWN_PREFIX_ENVELOPES.json', 6 * 1024 * 1024))
                == self._view.known_prefix_envelope_subset()['events'], 'ORIGIN_KNOWN_PROJECTION')
        require(strict_json(read_regular(source / 'FEEDBACK_PROJECTION.json', 1024 * 1024))
                == self._view.feedback_payload_projection(FIXED_WORK)['rows'], 'ORIGIN_FEEDBACK_PROJECTION')

    @classmethod
    def initialize(cls, directory, root, *, contract_path, blob_path, proposal_path,
                   adoption, source_proof_path, source_snapshot_path, executor='M/root'):
        root = Path(root).resolve()
        destination = Path(directory).absolute()
        require(destination == root / 'work/recovery-checkpoints/qf01-p046-r3'
                and destination == destination.resolve() and not destination.exists(),
                'NATIVE_CHECKPOINT_DEDICATED_NEW_PATH')
        proposal = read_regular(proposal_path, 1024 * 1024)
        require(sha(proposal) == RECOVERY_PROPOSAL_SHA256, 'ADOPTED_PROPOSAL_BYTES')
        require(isinstance(adoption, dict) and adoption.get('quote') == 'この限定案を採用して進める'
                and adoption.get('verification_level') == 'conversation_transcribed'
                and adoption.get('proposal_sha256') == RECOVERY_PROPOSAL_SHA256
                and ADOPTION_CALL_ID in adoption.get('source_ref', ''), 'NATIVE_ADOPTION_REQUIRED')
        require(isinstance(executor, str) and executor.strip() == executor and executor,
                'NATIVE_EXECUTOR_REQUIRED')
        bootstrap_core = current_core_identity()
        view = load_qf01_checkpoint(contract_path, blob_path)
        proof_raw = read_regular(source_proof_path, 1024 * 1024)
        snapshot_raw = read_regular(source_snapshot_path, 1024 * 1024)
        _source_recovery(view, proof_raw, snapshot_raw)
        contract_raw, blob_raw = read_regular(contract_path, 2 * 1024 * 1024), read_regular(blob_path, 5 * 1024 * 1024)
        seed_raw = decode_gzip(blob_raw.decode('ascii'), 20 * 1024 * 1024)
        files = {'publisher-contract.json': contract_raw, 'BUILD_AUTHORITY.blob': blob_raw,
                 'APPROVED_MATERIAL_SEED.json': seed_raw, 'NODES.json': canonical(view.nodes()),
                 'ORIGIN_SOURCE_PROOF.json': proof_raw, 'ORIGIN_SOURCE_SNAPSHOT.json': snapshot_raw,
                 'TEAM_PREFIX_SUBSET.json': canonical(view.team_prefix_subset(FIXED_WORK)['events']),
                 'KNOWN_PREFIX_ENVELOPES.json': canonical(view.known_prefix_envelope_subset()['events']),
                 'FEEDBACK_PROJECTION.json': canonical(view.feedback_payload_projection(FIXED_WORK)['rows'])}
        context = {'schemaVersion': 'qf01-native-checkpoint-origin/1',
                   'proposalSHA256': RECOVERY_PROPOSAL_SHA256, 'adoption': copy.deepcopy(adoption),
                   'bootstrapCore': bootstrap_core, 'executor': executor,
                   'newTechnicalWorks': sorted(NEW_TECHNICAL_WORKS),
                   'originFilesSHA256': {name: sha(raw) for name, raw in files.items()},
                   'historicalPrefixCoverage': 'MISSING', 'globalQueueCoverage': 'UNKNOWN'}
        destination.parent.mkdir(parents=True, exist_ok=True)
        CheckpointTail.create(destination, view, context=context)
        (destination / 'origin').mkdir()
        for name, raw in files.items():
            with (destination / 'origin' / name).open('xb') as stream:
                stream.write(raw); stream.flush(); os.fsync(stream.fileno())
        store = cls(destination, _initializing=True)
        store.append('checkpoint_recovered', FIXED_WORK,
                     {'schemaVersion': 'qf01-checkpoint-recovered/1',
                      'originSHA256': store.checkpoint_epoch, 'adoption': copy.deepcopy(adoption),
                      'core': bootstrap_core, 'executor': executor,
                      'missingHistoricalPrefix': True, 'gateAccepted': False},
                     expected=view.anchor['head'])
        store._initializing = False
        store.suffix_events()
        return store

    @property
    def checkpoint_anchor(self):
        return self._view.anchor

    @property
    def head(self):
        rows = self.suffix_events()
        return rows[-1]['hash'] if rows else self._view.anchor['head']

    def events(self):
        raise UnknownContext('CHECKPOINT_LEGACY_FULL_EVENTS_UNAVAILABLE_USE_TYPED_API')

    def suffix_events(self):
        self._validate_origin()
        rows = self._tail.events()
        require(rows or self._initializing, 'NATIVE_BOOTSTRAP_RECORD_MISSING')
        if rows:
            bootstrap = rows[0]
            require(bootstrap['kind'] == 'checkpoint_recovered' and bootstrap['work'] == FIXED_WORK
                    and bootstrap['payload'].get('schemaVersion') == 'qf01-checkpoint-recovered/1'
                    and bootstrap['payload'].get('originSHA256') == self.checkpoint_epoch
                    and bootstrap['payload'].get('adoption') == self._context['adoption']
                    and bootstrap['payload'].get('core') == self._context['bootstrapCore']
                    and bootstrap['payload'].get('executor') == self._context['executor']
                    and bootstrap['payload'].get('gateAccepted') is False,
                    'NATIVE_BOOTSTRAP_RECORD_MISMATCH')
            require(not any(row['kind'] == 'checkpoint_recovered' for row in rows[1:]),
                    'NATIVE_BOOTSTRAP_DUPLICATED')
        allowed = {FIXED_WORK} | NEW_TECHNICAL_WORKS
        require(all(row['work'] in allowed for row in rows), 'SUFFIX_WORK_OUTSIDE_ADOPTED_SCOPE')
        require(not any(row['kind'] == 'opened' and row['work'] == FIXED_WORK for row in rows), 'CHECKPOINT_WORK_REOPENED')
        for work in NEW_TECHNICAL_WORKS:
            selected = [row for row in rows if row['work'] == work]
            opened = [row for row in selected if row['kind'] == 'opened']
            require(not selected or len(opened) == 1 and selected[0] == opened[0], 'TECHNICAL_WORK_GENESIS_REQUIRED')
        # These are new actual criterion records, never reconstructed prefix events.
        # Historical method identities remain readable after later source changes;
        # current-code/target validity is rechecked by Runtime/team at use time.
        active_method = None
        origin = self._view.state_snapshot(FIXED_WORK)
        primary_candidate=origin['candidate_sha']
        primary_manifest=copy.deepcopy(origin['candidate_manifest'])
        primary_definition=origin['definition_hash']
        active_repair=None
        active_math_repair=None;math_after_history=[]
        owner_candidate=None;owner_manifest=None;owner_plan=None
        for row in rows:
            payload = row['payload']; kind = row['kind']
            require(not isinstance(payload,dict) or payload.get('mathRenderingRepair') is None
                or kind=='checkpoint_definition_migrated' and row['work']==FIXED_WORK,
                'D04_MIGRATION_EVENT_SCOPE')
            if row['work']==RECOVERY_WORK:
                if kind=='opened':
                    owner_plan=payload['plan'];owner_candidate=owner_plan['source_sha']
                    owner_manifest=copy.deepcopy(owner_plan['source_manifest'])
                elif kind=='revised':owner_plan=payload['plan']
                elif kind=='candidate':
                    owner_candidate=payload['sha'];owner_manifest=copy.deepcopy(payload['manifest'])
                elif kind=='patch_applied':
                    owner_candidate=None;owner_manifest.update(payload['after_manifest'])
            if kind=='checkpoint_definition_migrated' and row['work']==FIXED_WORK:
                repair=payload.get('repairAdoption')
                require(active_repair is None or repair is not None,'D03_SUPPLEMENT_CANNOT_BE_STRIPPED')
                math_repair=payload.get('mathRenderingRepair')
                require(active_math_repair is None or math_repair is not None,'D04_SUPPLEMENT_CANNOT_BE_STRIPPED')
                if math_repair is not None:
                    math_repair=validate_math_rendering_repair_record(math_repair,epoch=self.checkpoint_epoch)
                    validate_math_rendering_repair_continuation(active_math_repair,math_repair,
                        earlier_after=math_after_history)
                    original=[e for e in rows if e['seq']<row['seq']
                        and e['hash']==MATH_RENDERING_REPAIR_D03_EVENT_HASH]
                    require(len(original)==1 and original[0]['work']==FIXED_WORK
                        and original[0]['kind']=='checkpoint_definition_migrated','D04_AUTHENTIC_D03_EVENT_REQUIRED')
                    original_payload=original[0]['payload'];original_repair=original_payload.get('repairAdoption')
                    validate_nearby_repair_record(original_repair,epoch=self.checkpoint_epoch)
                    require(digest(original_repair)==MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256
                        and original_payload.get('candidateSHA')==original_repair['candidateAfterSHA']==MATH_RENDERING_REPAIR_BASELINE
                        and original_repair['afterRepair']==MATH_RENDERING_REPAIR_BEFORE
                        and repair==active_repair==original_repair,'D04_PRESERVED_D03_C_RECORD')
                    preflight=self.get(payload['preflightRef'])
                    expected=dict(origin['candidate_manifest']);expected.update(CURRENT_REPAIR_AFTER)
                    expected.update(math_repair['afterRepair'])
                    require(preflight.get('mathRenderingRepair')==math_repair
                        and preflight.get('repairAdoption')==repair
                        and preflight.get('ledgerHead')==row['previous']
                        and preflight.get('checkpointEpoch')==payload.get('checkpointEpoch')==self.checkpoint_epoch
                        and preflight.get('fromDefinition')==payload.get('from')==primary_definition
                        and math_repair['candidateBeforeSHA']==preflight.get('candidateBeforeSHA')==primary_candidate
                        and math_repair['candidateBeforeManifestSHA256']==digest(primary_manifest)
                        and math_repair['candidateAfterSHA']==preflight.get('candidateAfterSHA')==payload.get('candidateSHA')
                        and math_repair['definitionHash']==preflight.get('toDefinition')==preflight.get('core',{}).get('definitionHash')==payload.get('to')
                        and math_repair['implementationHash']==preflight.get('implementationHash')
                        and preflight.get('candidateManifest')==payload.get('candidateManifest')==expected
                        and preflight.get('changedCandidatePaths')=={p:v for p,v in expected.items() if primary_manifest.get(p)!=v}
                        and preflight.get('reviewMethodAdoption') is not None,'D04_MIGRATION_CURRENT_PREVIOUS_BINDING')
                    if active_math_repair is None:
                        require(primary_candidate==MATH_RENDERING_REPAIR_BASELINE
                            and all(primary_manifest.get(p)==v for p,v in MATH_RENDERING_REPAIR_BEFORE.items()),
                            'D04_FIRST_MIGRATION_C_PREIMAGE')
                    evidence=[e for e in rows if e['seq']<row['seq'] and e['work']==FIXED_WORK
                        and e['kind']=='evidence' and e['payload'].get('id')==math_repair['evidenceRef']]
                    require(len(evidence)==1 and evidence[0]['payload'].get('kind')=='file'
                        and evidence[0]['payload'].get('verification_level')!='simulation'
                        and evidence[0]['payload'].get('data',{}).get('sha256')==math_repair['transcriptionSHA256'],
                        'D04_PRIOR_ACTUAL_ADOPTION_FILE_EVENT')
                    active_math_repair=math_repair;math_after_history.append(copy.deepcopy(math_repair['afterRepair']))
                elif repair is not None:
                    repair=validate_nearby_repair_record(repair,epoch=self.checkpoint_epoch)
                    preflight=self.get(payload['preflightRef'])
                    require(preflight.get('repairAdoption')==repair
                        and preflight.get('ledgerHead')==row['previous']
                        and repair['candidateBeforeSHA']==preflight.get('candidateBeforeSHA')==primary_candidate
                        and repair['candidateAfterSHA']==preflight.get('candidateAfterSHA')==payload.get('candidateSHA')
                        and repair['definitionHash']==preflight.get('toDefinition')==payload.get('to')
                        and repair['implementationHash']==preflight.get('implementationHash')
                        and preflight.get('reviewMethodAdoption') is not None,'D03_MIGRATION_CURRENT_PREVIOUS_BINDING')
                    if active_repair is None:
                        require(primary_candidate==NEARBY_REPAIR_BASELINE,'D03_FIRST_MIGRATION_REQUIRES_B')
                    else:
                        require(all(repair[key]==active_repair[key] for key in
                            ('proposalSHA256','baselineSourceSHA','evidenceRef','transcriptionSHA256','quote','source_ref','verification_level','beforeRepair','allowedProductPaths')),
                            'D03_PRESERVED_SUPPLEMENTAL_ADOPTION')
                    evidence=[e for e in rows if e['seq']<row['seq'] and e['work']==FIXED_WORK
                        and e['kind']=='evidence' and e['payload'].get('id')==repair['evidenceRef']]
                    require(len(evidence)==1 and evidence[0]['payload'].get('kind')=='file'
                        and evidence[0]['payload'].get('verification_level')!='simulation'
                        and evidence[0]['payload'].get('data',{}).get('sha256')==repair['transcriptionSHA256'],
                        'D03_PRIOR_ACTUAL_ADOPTION_FILE_EVENT')
                    active_repair=repair
                primary_candidate=payload['candidateSHA']
                primary_manifest=copy.deepcopy(payload['candidateManifest']);primary_definition=payload['to']
            elif kind=='candidate' and row['work']==FIXED_WORK:
                primary_candidate=payload['sha']
                primary_manifest=copy.deepcopy(payload['manifest'])
            if kind == 'checkpoint_definition_migrated' and payload.get('reviewMethodAdoption') is not None:
                added=payload['reviewMethodAdoption'];preflight=self.get(payload['preflightRef'])
                require(row['work']==FIXED_WORK and isinstance(added,dict)
                        and set(added)=={'proposalSHA256','evidenceRef','transcriptionSHA256',
                                        'quote','source_ref','verification_level'}
                        and added.get('proposalSHA256')==INFORMED_REVIEW_PROPOSAL_SHA256
                        and added.get('quote')=='限定D02案を採用して進める'
                        and added.get('source_ref')=='request_user_input_async/'+INFORMED_ADOPTION_CALL_ID
                        and added.get('verification_level')=='conversation_transcribed'
                        and preflight.get('reviewMethodAdoption')==added,
                        'D02_SUBSEQUENT_MIGRATION_ADOPTION_EVENT')
                require(preflight.get('ledgerHead')==row['previous']
                        and preflight.get('checkpointEpoch')==payload.get('checkpointEpoch')==self.checkpoint_epoch
                        and preflight.get('fromDefinition')==payload.get('from')
                        and preflight.get('toDefinition')==preflight.get('core',{}).get('definitionHash')==payload.get('to')
                        and preflight.get('candidateAfterSHA')==payload.get('candidateSHA')
                        and preflight.get('candidateManifest')==payload.get('candidateManifest')
                        and preflight.get('resultDispositions')==payload.get('resultDispositions')
                        and preflight.get('proposalSHA256')==payload.get('adoptionProposalSHA256')==RECOVERY_PROPOSAL_SHA256,
                        'D02_SUBSEQUENT_MIGRATION_LINKS')
                prior_evidence=[e for e in rows if e['seq']<row['seq'] and e['work']==FIXED_WORK
                                and e['kind']=='evidence' and e['payload'].get('id')==added['evidenceRef']]
                require(len(prior_evidence)==1 and prior_evidence[0]['payload'].get('kind')=='file'
                        and prior_evidence[0]['payload'].get('data',{}).get('sha256')==added['transcriptionSHA256'],
                        'D02_SUBSEQUENT_MIGRATION_ADOPTION_EVIDENCE')
            elif kind == 'informed_review_method_adopted':
                require(row['work']==FIXED_WORK and set(payload)=={'authorityRef','authority'},
                        'D02_AUTHORITY_EVENT_SCOPE')
                body=payload['authority'];ref=payload['authorityRef']
                require(isinstance(body,dict) and set(body)==INFORMED_AUTHORITY_FIELDS
                        and digest(body)==ref and self.get(ref)==body,'D02_AUTHORITY_EVENT_ARTIFACT')
                adoption=body.get('adoption',{})
                require(body.get('schemaVersion')=='qf01-informed-rereview-authority/1'
                        and body.get('method')=='qf01-informed-rereview/1'
                        and body.get('proposalSHA256')==INFORMED_REVIEW_PROPOSAL_SHA256
                        and adoption.get('quote')=='限定D02案を採用して進める'
                        and adoption.get('verification_level')=='conversation_transcribed'
                        and INFORMED_ADOPTION_CALL_ID in adoption.get('source_ref',''),
                        'D02_EXACT_ADOPTION_EVENT_REQUIRED')
                require(body.get('work')==FIXED_WORK and body.get('checkpointEpoch')==self.checkpoint_epoch
                        and body.get('expectedHead')==row['previous']
                        and body.get('originalContractSHA256')==FIXED_CONTRACT_SHA256
                        and body.get('originalAnchor')==self.checkpoint_anchor
                        and body.get('originalPlanSHA256')==digest(origin['plan'])
                        and body.get('originalUsersSHA256')==digest(origin['users'])
                        and body.get('originalSourceSHA')==origin['plan']['source_sha'],
                        'D02_AUTHORITY_EVENT_ORIGIN_HEAD')
                require(body.get('reviewerRefs')==list(INFORMED_REVIEWERS)
                        and body.get('nodeIDs')==list(INFORMED_REVIEW_NODES)
                        and body.get('historicalFirstPassRefs')==list(INFORMED_FIRST_PASS_REFS)
                        and all(body.get(k) is False for k in ('independent','sourceFirst','firstPass'))
                        and body.get('globalQueueCoverage')=='UNKNOWN','D02_AUTHORITY_EVENT_CRITERION')
                current_repair=active_math_repair or active_repair
                if current_repair is not None:
                    require(body.get('currentSourceSHA')==current_repair['candidateAfterSHA']
                        and body.get('definitionHash')==current_repair['definitionHash']
                        and body.get('implementationHash')==current_repair['implementationHash']
                        and current_repair['evidenceRef'] in body.get('evidenceRefs',[])
                        and active_repair['evidenceRef'] in body.get('evidenceRefs',[]),
                        'D03_AUTHORITY_SUPPLEMENT_BINDING')
                active_method=ref
            elif kind == 'informed_review_method_revoked':
                require(row['work']==FIXED_WORK and payload.get('authorityRef')==active_method
                        and active_method is not None and payload.get('expectedHead')==row['previous']
                        and payload.get('verification_level')=='conversation_transcribed'
                        and all(isinstance(payload.get(k),str) and payload[k].strip()
                                for k in ('quote','reason','source_ref')),'D02_REVOCATION_EVENT_SCOPE')
                active_method=None
            elif kind == 'informed_technical_candidate_reconciled':
                require(row['work']==RECOVERY_WORK and set(payload)=={'proofRef','proof'}
                        and active_method is not None,'D02_TECHNICAL_EVENT_SCOPE')
                proof=payload['proof'];authority=self.get(active_method)
                require(isinstance(proof,dict) and digest(proof)==payload['proofRef']
                        and self.get(payload['proofRef'])==proof,'D02_TECHNICAL_EVENT_ARTIFACT')
                if active_math_repair:
                    require(proof.get('candidateSHA')==active_math_repair['candidateAfterSHA']
                        and proof.get('core',{}).get('definitionHash')==active_math_repair['definitionHash']
                        and proof.get('implementationHash')==active_math_repair['implementationHash'],
                        'D04_TECHNICAL_CURRENT_SUPPLEMENT_BINDING')
                require(proof.get('schemaVersion')=='qf01-informed-technical-candidate-proof/1'
                        and proof.get('work')==RECOVERY_WORK and proof.get('parentWork')==FIXED_WORK
                        and proof.get('methodAuthorityRef')==active_method
                        and proof.get('proposalSHA256')==(MATH_RENDERING_REPAIR_PROPOSAL_SHA256 if active_math_repair else NEARBY_REPAIR_PROPOSAL_SHA256 if active_repair else INFORMED_REVIEW_PROPOSAL_SHA256)
                        and proof.get('checkpointEpoch')==self.checkpoint_epoch
                        and proof.get('expectedHead')==row['previous']
                        and proof.get('candidateSHA')==authority.get('currentSourceSHA')
                        and proof.get('core')==authority.get('core')
                        and proof.get('implementationHash')==authority.get('implementationHash')
                        and proof.get('writesExecuted') is False
                        and proof.get('oldResultsTransferred') is False,'D02_TECHNICAL_EVENT_BINDING')
                genesis=next(e for e in rows if e['work']==RECOVERY_WORK and e['kind']=='opened')
                original=genesis['payload']['plan'];snapshot=genesis['payload']['original_snapshot']
                require(genesis['seq']<row['seq']
                        and proof.get('originalSourceSHA')==original['source_sha']
                        and proof.get('sourceManifestSHA256')==digest(original['source_manifest'])
                        and proof.get('originalSnapshotRef')==snapshot
                        and set(proof.get('candidateManifest',{}))==set(original['source_manifest'])
                        and bool(proof.get('verificationRefs'))
                        and isinstance(proof.get('resultDispositions'),list),
                        'D02_TECHNICAL_EVENT_ORIGIN')
                if active_repair is not None:
                    protected=copy.deepcopy(original.get('protected_manifest',{}))
                    require(all(protected.get(name)==value for name,value in active_repair['beforeRepair'].items()),
                            'D03_OWNER_ORIGINAL_PROTECTION')
                    protected.update(active_repair['afterRepair'])
                    if active_math_repair:protected.update(active_math_repair['afterRepair'])
                    require(owner_plan is not None and owner_plan['source_sha']==original['source_sha']
                        and all(owner_plan.get(key)==original.get(key) for key in ('source_manifest','rules','scope'))
                        and owner_plan.get('protected_manifest',{})==protected
                        and owner_plan['proposal']['hash']==(MATH_RENDERING_REPAIR_PROPOSAL_SHA256 if active_math_repair else NEARBY_REPAIR_PROPOSAL_SHA256)
                        and proof.get('planSHA256')==digest(owner_plan)
                        and proof.get('previousCandidateSHA')==owner_candidate
                        and proof.get('previousCandidateManifestSHA256')==digest(owner_manifest),
                        'D03_OWNER_PLAN_AND_ACTUAL_PREVIOUS_BINDING')
                    gitproof=proof.get('gitProof',{})
                    require(gitproof.get('previousCandidateSHA')==owner_candidate
                        and gitproof.get('retainedManifestSHA256')==digest(owner_manifest)
                        and gitproof.get('currentMaterialGitProof',{}).get('nearbyRepair')==active_repair,
                        'D03_OWNER_GIT_SUPPLEMENT_BINDING')
                    if active_math_repair:
                        require(gitproof.get('currentMaterialGitProof',{}).get('mathRenderingRepair')==active_math_repair,
                                'D04_OWNER_GIT_SUPPLEMENT_BINDING')
                owner_candidate=proof['candidateSHA'];owner_manifest=copy.deepcopy(proof['candidateManifest'])
            elif kind == 'informed_review_receipt_sealed':
                require(row['work']==FIXED_WORK
                        and set(payload)=={'node','inputHash','methodAuthorityRef','methodReceiptRef'}
                        and payload.get('node') in INFORMED_REVIEW_NODES
                        and payload.get('methodAuthorityRef')==active_method and active_method is not None,
                        'D02_REVIEW_SEAL_EVENT_SCOPE')
                receipt=self.get(payload['methodReceiptRef'])
                require(receipt.get('schemaVersion')=='qf01-informed-rereview-receipt/1'
                        and receipt.get('authorityRef')==active_method
                        and receipt.get('node')==payload['node']
                        and receipt.get('inputHash')==payload['inputHash']
                        and all(receipt.get(k) is False for k in ('independent','sourceFirst','firstPass')),
                        'D02_REVIEW_SEAL_EVENT_ARTIFACT')
        return rows

    def state_base(self, work):
        self._validate_origin()
        if work == FIXED_WORK:
            return self._view.state_snapshot(work)
        if work in NEW_TECHNICAL_WORKS and work in self.work_ids():
            return None
        raise UnknownContext('WORK_STATE_NOT_IN_ADOPTED_CHECKPOINT_OR_NEW_SUFFIX')

    def can_open(self, work):
        require(work in NEW_TECHNICAL_WORKS, 'ONLY_ADOPTED_NEW_TECHNICAL_WORKS_CAN_OPEN')
        return work not in self.work_ids()

    def work_ids(self):
        return {FIXED_WORK} | {row['work'] for row in self.suffix_events() if row['kind'] == 'opened'}

    def history_events(self, purpose, work=None):
        suffix = self.suffix_events()
        if purpose in ('suffix', 'capability-bindings'):
            rows = suffix
        elif purpose == 'team':
            rows = self._view.team_prefix_subset(FIXED_WORK)['events'] + suffix
        elif purpose == 'authorization':
            rows = self._view.known_prefix_envelope_subset()['events'] + suffix
        elif purpose == 'complete' and work in NEW_TECHNICAL_WORKS and work in self.work_ids():
            rows = suffix
        else:
            raise UnknownContext('HISTORICAL_COVERAGE_NOT_RECOVERED:' + purpose)
        return copy.deepcopy([row for row in rows if work is None or row['work'] == work])

    def feedback_payloads(self, work):
        if work not in self.work_ids():
            raise UnknownContext('FEEDBACK_WORK_UNKNOWN')
        rows = self._view.feedback_payload_projection(work)['rows'] if work == FIXED_WORK else []
        return rows + [copy.deepcopy(row['payload']) for row in self.suffix_events()
                       if row['work'] == work and row['kind'] == 'feedback_captured']

    def source_snapshot(self, work):
        if work == FIXED_WORK:
            self._validate_origin()
            return {'snapshot': copy.deepcopy(self._source_snapshot),
                    'sourceKind': 'GIT_RECOVERED_CHECKPOINT_SOURCE', 'proof': copy.deepcopy(self._source_proof)}
        events = self.history_events('complete', work)
        opened = next(row for row in events if row['kind'] == 'opened')
        return {'snapshot': self.get(opened['payload']['original_snapshot']), 'sourceKind': 'IMMUTABLE_OPEN_SNAPSHOT'}

    def append(self, kind, work, payload, *, expected=None, event_id=None):
        self._validate_origin()
        require(kind != 'checkpoint_recovered' or self._initializing and not self._tail.events(),
                'BOOTSTRAP_ONLY_AT_EXPLICIT_INITIALIZATION')
        require(work == FIXED_WORK or work in NEW_TECHNICAL_WORKS, 'APPEND_OUTSIDE_ADOPTED_WORKS')
        if work in NEW_TECHNICAL_WORKS and work not in self.work_ids():
            require(kind == 'opened', 'NEW_TECHNICAL_WORK_MUST_OPEN_FIRST')
        if kind == 'opened':
            require(self.can_open(work), 'WORK_ALREADY_EXISTS')
        require(expected is not None, 'NATIVE_EXPECTED_HEAD_REQUIRED')
        return self._tail.append(kind, work, payload, expected=expected, event_id=event_id)

    def get(self, reference):
        self._validate_origin(); return self._tail.get(reference)

    def put(self, value):
        self._validate_origin(); return self._tail.put(value)

    def recover_lock(self):
        raise UnknownContext('CHECKPOINT_LOCK_REQUIRES_EXPLICIT_RECONCILIATION_NO_PID_GUESS')

    def summary(self):
        return {'schemaVersion':'qf01-native-checkpoint-store/1','work':FIXED_WORK,
                'checkpointEpoch':self.checkpoint_epoch,'anchor':self.checkpoint_anchor,
                'head':self.head,'suffixEvents':len(self.suffix_events()),
                'proposalSHA256':RECOVERY_PROPOSAL_SHA256,'fullHistoricalLedgerRecovered':False,
                'globalQueueCoverage':'UNKNOWN','gateAccepted':False}


def history_events(rt, purpose, work=None):
    if getattr(rt.store, 'checkpoint_mode', False):
        return rt.store.history_events(purpose, work)
    return [row for row in rt.store.events() if work is None or row['work'] == work]


def feedback_payloads(rt, work):
    if getattr(rt.store, 'checkpoint_mode', False):
        return rt.store.feedback_payloads(work)
    return [row['payload'] for row in rt.store.events() if row['work'] == work and row['kind'] == 'feedback_captured']


def known_work_ids(rt):
    if getattr(rt.store, 'checkpoint_mode', False):
        return rt.store.work_ids()
    return {row['work'] for row in rt.store.events() if row['kind'] == 'opened'}


def queue_coverage(rt):
    if getattr(rt.store, 'checkpoint_mode', False):
        return {'status': 'UNKNOWN', 'reason': 'GLOBAL_PREFIX_AND_INTAKE_NOT_RECOVERED',
                'knownWorks': sorted(rt.store.work_ids())}
    return {'status': 'COMPLETE'}


def source_snapshot(rt, work):
    if getattr(rt.store, 'checkpoint_mode', False):
        return rt.store.source_snapshot(work)
    opened = next(row for row in rt.store.events() if row['work'] == work and row['kind'] == 'opened')
    return {'snapshot': rt.store.get(opened['payload']['original_snapshot']), 'sourceKind': 'IMMUTABLE_OPEN_SNAPSHOT'}


def current_core_identity():
    """Fresh source-only process; no Runtime/Store constructor is called."""
    import subprocess
    import sys
    engine = Path(__file__).resolve().parent
    # -B prevents pyc writes, but still permits reads. Use source-only loaders
    # for every local module, including definitions/store, to reject a stale
    # timestamp-and-size-valid cache instead of deriving a false current hash.
    program = r'''
import sys,json,hashlib,importlib.abc,importlib.util,importlib.machinery
from pathlib import Path
root=Path(sys.argv[1]).resolve()
class SourceOnly(importlib.machinery.SourceFileLoader):
 def get_code(self,fullname):return compile(Path(self.path).read_bytes(),self.path,'exec',dont_inherit=True)
class Finder(importlib.abc.MetaPathFinder):
 def find_spec(self,fullname,path=None,target=None):
  if '.' not in fullname and (root/(fullname+'.py')).is_file():
   p=root/(fullname+'.py');return importlib.util.spec_from_loader(fullname,SourceOnly(fullname,str(p)))
sys.meta_path.insert(0,Finder())
import definitions
print(json.dumps({'definitionHash':definitions.DEFINITION_HASH,
 'files':{n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in definitions.IMPLEMENTATION_FILES}},sort_keys=True))
'''
    result = subprocess.run([sys.executable, '-I', '-S', '-B', '-c', program, str(engine)],
                            capture_output=True, text=True, encoding='utf-8', timeout=30)
    require(result.returncode == 0, 'FRESH_CORE_IDENTITY_FAILED:' + result.stderr[-1000:])
    value = strict_json(result.stdout.encode('utf-8'))
    from definitions import DEFINITION_HASH
    require(value.get('definitionHash') == DEFINITION_HASH, 'RUNNING_CORE_IMPORT_IS_STALE')
    require(all(sha((engine / name).read_bytes()) == wanted for name, wanted in value['files'].items()),
            'CORE_CHANGED_DURING_FRESH_IDENTITY')
    return value


def verify_candidate_git(root, candidate_sha, candidate_manifest):
    import subprocess
    require(isinstance(candidate_sha, str) and re.fullmatch(r'[0-9a-f]{40}', candidate_sha), 'CANDIDATE_GIT_SHA')
    environment = dict(os.environ, GIT_NO_LAZY_FETCH='1')
    result = subprocess.run(['git', '-C', str(root), 'rev-parse', 'HEAD'], capture_output=True,
                            text=True, encoding='utf-8', env=environment, timeout=30)
    require(result.returncode == 0 and result.stdout.strip() == candidate_sha, 'CANDIDATE_NOT_CURRENT_GIT_HEAD')
    remote = subprocess.run(['git', '-C', str(root), 'remote', 'get-url', 'origin'],
                            capture_output=True, text=True, env=environment, timeout=30)
    require(remote.returncode == 0 and remote.stdout.strip().removesuffix('.git')
            == 'https://github.com/rrikunagasige-dot/kyotsu-step-web', 'CANDIDATE_REPOSITORY_IDENTITY')
    for name, wanted in candidate_manifest.items():
        result = subprocess.run(['git', '-C', str(root), 'show', candidate_sha + ':' + name],
                                capture_output=True, env=environment, timeout=30)
        require(result.returncode == 0 and sha(result.stdout) == wanted, 'CANDIDATE_GIT_FILE_HASH:' + name)
