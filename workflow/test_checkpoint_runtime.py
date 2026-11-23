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
from contextlib import nullcontext

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


def mixed_baseline_root():
    return Path(os.environ.get('QF01_CHECKPOINT_MIXED_BASELINE_ROOT',str(
        WORKSPACE/'qf_audit_download/checkpoint-native-tests/D05_D3_BASELINE_SOURCE_20261123'))).resolve()


def repair_fixture_bytes(relative, expected):
    """Keep historical B fixtures byte-exact when testing a newer renderer."""
    configured = os.environ.get('QF01_CHECKPOINT_BASELINE_REPAIR_ROOT')
    root = Path(configured).resolve() if configured else ENGINE.parent
    raw = (root / relative).read_bytes()
    if hashlib.sha256(raw).hexdigest() != expected:
        raise AssertionError('Fixed baseline-B repair mismatch: '+relative)
    return raw


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


def populate_nearby_fixture(root,*,product_root=None,candidate_sha='c'*40,current_core=None):
    """TEST_FIXTURE B->C transitions; never copy actual private ledger/replies.

    Only the historical executor identity and external Git tree are mocked.
    Native events, file evidence, current preflight, migration and state replay
    are real operations against a temporary TEST_FIXTURE namespace.
    """
    from checkpoint import (CURRENT_REPAIR_AFTER, NEARBY_REPAIR_BASELINE,
        NEARBY_REPAIR_PRODUCT_PATHS, NEARBY_REPAIR_PROPOSAL_PATH,
        NEARBY_REPAIR_PROPOSAL_SHA256, NEARBY_REPAIR_ADOPTION_QUOTE,
        NEARBY_REPAIR_ADOPTION_CALL_ID, INFORMED_REVIEW_PROPOSAL_SHA256,
        INFORMED_PROPOSAL_PATH)
    from definitions import IMPLEMENTATION_FILES
    root = Path(root)
    populate_preflight_fixture(root)
    for relative, expected in CURRENT_REPAIR_AFTER.items():
        (root/relative).write_bytes(repair_fixture_bytes(relative,expected))
    baseline = Path(os.environ['QF01_CHECKPOINT_BASELINE_REPAIR_ROOT']).resolve()
    old_core = {'definitionHash':'0f27a49423f9f5e36f84e0062dcea8a775c33f3df0fb6de3c78352e1e9bd9b27',
        'files':{name:hashlib.sha256((baseline/'workflow'/name).read_bytes()).hexdigest()
                 for name in IMPLEMENTATION_FILES}}
    store=initialize_fixture(root);rt=Runtime(store.root,root)
    with patch('checkpoint.current_core_identity',return_value=old_core), patch('checkpoint.verify_candidate_git',return_value=None):
        prior=rt.checkpoint_preflight(FIXED_WORK,candidate_sha=NEARBY_REPAIR_BASELINE)
        rt.migrate_checkpoint_definition(FIXED_WORK,proof=prior,expected_head=prior['ledgerHead'])
    state_b=rt.state(FIXED_WORK)
    for relative in (INFORMED_PROPOSAL_PATH,NEARBY_REPAIR_PROPOSAL_PATH):
        target=root/relative;target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(ENGINE.parent/relative,target)
    def evidence_file(name,body,eid):
        body={**body,'fixtureKind':'TEST_FIXTURE_NO_ACTUAL_USER_ACTION_OR_UI_MEASUREMENT'}
        target=root/name;target.write_text(json.dumps(body,ensure_ascii=False)+'\n',encoding='utf-8')
        return rt.evidence(FIXED_WORK,'file',{'path':name,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()},
            source_ref='TEST_FIXTURE/protocol-only',verification_level='local_execution',eid=eid)
    d2=evidence_file('TEST_FIXTURE_D02_ADOPTION.json',{
        'schemaVersion':'qf01-informed-review-user-adoption/1','proposalSHA256':INFORMED_REVIEW_PROPOSAL_SHA256,
        'quote':'限定D02案を採用して進める','source_ref':'request_user_input_async/call_27be7afbeef843249d088b530a5701b7',
        'verification_level':'conversation_transcribed','adoptedForImplementation':True},'TEST_FIXTURE_D02_ADOPTION')
    d3=evidence_file('TEST_FIXTURE_D03_ADOPTION.json',{
        'schemaVersion':'qf01-d03-v2-actual-user-adoption/1','proposalSHA256':NEARBY_REPAIR_PROPOSAL_SHA256,
        'quote':NEARBY_REPAIR_ADOPTION_QUOTE,'source_ref':'request_user_input_async/'+NEARBY_REPAIR_ADOPTION_CALL_ID,
        'verification_level':'conversation_transcribed','adopted':True,
        'productPaths':list(NEARBY_REPAIR_PRODUCT_PATHS),'publicCodePathMaximum':20,
        'publicProposalPath':NEARBY_REPAIR_PROPOSAL_PATH,'nativeLedgerOrLearningOrCredentialsIncluded':False},'TEST_FIXTURE_D03_ADOPTION')
    for relative in NEARBY_REPAIR_PRODUCT_PATHS:
        (root/relative).write_bytes(((Path(product_root) if product_root else mixed_baseline_root())/relative).read_bytes())
    with patch('checkpoint.verify_candidate_git',return_value=None), patch('adapters._checkpoint_git_proof',return_value={'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_ONLY'}), (patch('checkpoint.current_core_identity',return_value=current_core) if current_core else nullcontext()):
        proof=rt.checkpoint_preflight(FIXED_WORK,candidate_sha=candidate_sha,
            informed_adoption_ref=d2,repair_adoption_ref=d3)
        rt.migrate_checkpoint_definition(FIXED_WORK,proof=proof,expected_head=proof['ledgerHead'])
    return {'rt':rt,'store':store,'proof':proof,'stateB':state_b,'d2':d2,'d3':d3}


def populate_math_rendering_fixture(root):
    """Synthetic C->D protocol, never actual C suffix or private adoption bytes.

    Fixed public C product/core bytes come from an immutable C checkout. Only
    the authenticated private predecessor event/hash boundary is substituted;
    the actual fixture event chain/state/manifest/preflight are not mocked.
    """
    import checkpoint as cp
    from definitions import IMPLEMENTATION_FILES
    root=Path(root)
    baseline=Path(os.environ.get('QF01_CHECKPOINT_MATH_BASELINE_ROOT',str(WORKSPACE/'qf01-nearby-core'))).resolve()
    for p,h in cp.MATH_RENDERING_REPAIR_BEFORE.items():
        if hashlib.sha256((baseline/p).read_bytes()).hexdigest()!=h:
            raise AssertionError('Fixed baseline-C repair mismatch: '+p)
    old_core={'definitionHash':'459d541af32313c9ece595e1ca410597f4067d657c873da9cd0cffa40648c426',
              'files':{name:hashlib.sha256((baseline/'workflow'/name).read_bytes()).hexdigest()
                       for name in IMPLEMENTATION_FILES}}
    fixture=populate_nearby_fixture(root,product_root=baseline,
        candidate_sha=cp.MATH_RENDERING_REPAIR_BASELINE,current_core=old_core)
    rt=fixture['rt'];store=fixture['store']
    previous=next(e for e in store.suffix_events() if e['kind']=='checkpoint_definition_migrated'
                  and e['payload'].get('repairAdoption'))
    boundary={'MATH_RENDERING_REPAIR_D03_EVENT_HASH':previous['hash'],
              'MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256':digest(previous['payload']['repairAdoption'])}
    proposal=root/cp.MATH_RENDERING_REPAIR_PROPOSAL_PATH;proposal.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ENGINE.parent/cp.MATH_RENDERING_REPAIR_PROPOSAL_PATH,proposal)
    adoption={'schemaVersion':'qf01-d04-actual-user-adoption/1',
        'proposalSHA256':cp.MATH_RENDERING_REPAIR_PROPOSAL_SHA256,'quote':cp.MATH_RENDERING_REPAIR_ADOPTION_QUOTE,
        'source_ref':'request_user_input_async/'+cp.MATH_RENDERING_REPAIR_ADOPTION_CALL_ID,
        'verification_level':'conversation_transcribed','adopted':True,
        'baselineSourceSHA':cp.MATH_RENDERING_REPAIR_BASELINE,
        'productPaths':list(cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS),'publicCodePathMaximum':20,
        'publicProposalPath':cp.MATH_RENDERING_REPAIR_PROPOSAL_PATH,'nativeLedgerOrLearningOrCredentialsIncluded':False,
        'originalD03MigrationEventHash':boundary['MATH_RENDERING_REPAIR_D03_EVENT_HASH'],
        'originalD03SupplementSHA256':boundary['MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256'],
        'fixtureKind':'TEST_FIXTURE_NO_ACTUAL_USER_ACTION_OR_PRIVATE_NATIVE_PREFIX'}
    path=root/'TEST_FIXTURE_D04_ADOPTION.json';path.write_text(json.dumps(adoption,ensure_ascii=False)+'\n',encoding='utf8')
    d4=rt.evidence(FIXED_WORK,'file',{'path':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()},
        source_ref='TEST_FIXTURE/protocol-only',verification_level='local_execution',eid='TEST_FIXTURE_D04_ADOPTION')
    renderer=root/cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS[0]
    renderer.write_bytes(renderer.read_bytes()+b'\n// TEST_FIXTURE_D04_NOT_AN_ACTUAL_PRODUCT_REPAIR\n')
    fixture.update(d4=d4,boundary=boundary,stateC=rt.state(FIXED_WORK),originalD03=previous)
    return fixture


def populate_mixed_inline_fixture(root):
    """TEST_FIXTURE D3->D05. No genuine private native events/replies are copied.

    Fixed public D3 bytes come from the independently pinned baseline. Private
    predecessor event identities are replaced only at the fixture boundary;
    real temp Store chain/preflight/state/manifest checks remain active.
    """
    import checkpoint as cp
    from definitions import IMPLEMENTATION_FILES
    root=Path(root);baseline=mixed_baseline_root()
    for p,h in cp.MIXED_INLINE_REPAIR_BEFORE.items():
        if hashlib.sha256((baseline/p).read_bytes()).hexdigest()!=h:
            raise AssertionError('Fixed baseline-D3 repair mismatch: '+p)
    fixture=populate_math_rendering_fixture(root);rt=fixture['rt'];store=fixture['store']
    for p in cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS:(root/p).write_bytes((baseline/p).read_bytes())
    old_core={'definitionHash':'cfa299292ca0475a7bfb7ff35a801d567722a7da1d200d9af640850c7140ab6c',
        'files':{name:hashlib.sha256((baseline/'workflow'/name).read_bytes()).hexdigest() for name in IMPLEMENTATION_FILES}}
    with patch.multiple('checkpoint',**fixture['boundary']),patch('checkpoint.current_core_identity',return_value=old_core),\
            patch('checkpoint.verify_candidate_git',return_value=None),patch('adapters._checkpoint_git_proof',
                return_value={'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_ONLY'}):
        old=rt.checkpoint_preflight(FIXED_WORK,candidate_sha=cp.MIXED_INLINE_REPAIR_BASELINE,
            informed_adoption_ref=fixture['d2'],repair_adoption_ref=fixture['d3'],math_rendering_adoption_ref=fixture['d4'])
        event=rt.migrate_checkpoint_definition(FIXED_WORK,proof=old,expected_head=old['ledgerHead'])
    boundary={**fixture['boundary'],'MIXED_INLINE_REPAIR_D04_EVENT_HASH':event['hash'],
        'MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256':digest(event['payload']['mathRenderingRepair'])}
    target=root/cp.MIXED_INLINE_REPAIR_PROPOSAL_PATH;target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ENGINE.parent/cp.MIXED_INLINE_REPAIR_PROPOSAL_PATH,target)
    body={'schemaVersion':'qf01-d05-actual-user-adoption/1','proposalSHA256':cp.MIXED_INLINE_REPAIR_PROPOSAL_SHA256,
        'inventorySHA256':cp.MIXED_INLINE_REPAIR_INVENTORY_SHA256,'quote':cp.MIXED_INLINE_REPAIR_ADOPTION_QUOTE,
        'source_ref':'request_user_input_async/'+cp.MIXED_INLINE_REPAIR_ADOPTION_CALL_ID,
        'verification_level':'conversation_transcribed','adopted':True,'baselineSourceSHA':cp.MIXED_INLINE_REPAIR_BASELINE,
        'productPaths':list(cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS),'beforeRepair':copy.deepcopy(cp.MIXED_INLINE_REPAIR_BEFORE),
        'publicCodePathMaximum':20,'publicProposalPath':cp.MIXED_INLINE_REPAIR_PROPOSAL_PATH,
        'nativeLedgerOrLearningOrCredentialsIncluded':False,
        'originalD04MigrationEventHash':event['hash'],'originalD04SupplementSHA256':boundary['MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256'],
        'fixtureKind':'TEST_FIXTURE_NO_ACTUAL_USER_ACTION_OR_MEASUREMENTS'}
    path=root/'TEST_FIXTURE_D05_ADOPTION.json';path.write_text(json.dumps(body,ensure_ascii=False)+'\n',encoding='utf8')
    with patch.multiple('checkpoint',**boundary):
        d5=rt.evidence(FIXED_WORK,'file',{'path':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()},
            source_ref='TEST_FIXTURE/protocol-only',verification_level='local_execution',eid='TEST_FIXTURE_D05_ADOPTION')
    renderer=root/cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS[0]
    renderer.write_bytes(renderer.read_bytes()+b'\n// TEST_FIXTURE_D05_NOT_AN_ACTUAL_PRODUCT_REPAIR\n')
    with patch.multiple('checkpoint',**boundary):state_d3=rt.state(FIXED_WORK)
    fixture.update(d5=d5,boundary=boundary,stateD3=state_d3,originalD04=event)
    return fixture


def populate_inline_layout_fixture(root):
    """Synthetic joint D3->D05+D06, never an invented intermediate D05 event."""
    import checkpoint as cp
    fixture=populate_mixed_inline_fixture(root);root=Path(root);rt=fixture['rt']
    d05_raw=(root/'TEST_FIXTURE_D05_ADOPTION.json').read_bytes()
    boundary={**fixture['boundary'],'INLINE_LAYOUT_ORIGINAL_D05_ADOPTION_SHA256':hashlib.sha256(d05_raw).hexdigest()}
    path=root/cp.INLINE_LAYOUT_REPAIR_PROPOSAL_PATH;path.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ENGINE.parent/cp.INLINE_LAYOUT_REPAIR_PROPOSAL_PATH,path)
    adopted={'schemaVersion':'qf01-d06-actual-user-adoption/1','proposalSHA256':cp.INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,
        'quote':cp.INLINE_LAYOUT_REPAIR_ADOPTION_QUOTE,'source_ref':'request_user_input_async/'+cp.INLINE_LAYOUT_REPAIR_ADOPTION_CALL_ID,
        'verification_level':'conversation_transcribed','adopted':True,'baselineSourceSHA':cp.MIXED_INLINE_REPAIR_BASELINE,
        'productPaths':list(cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS),'workingD05ProductSHA256':copy.deepcopy(cp.INLINE_LAYOUT_WORKING_D05_PRODUCT),
        'originalD05ProposalSHA256':cp.MIXED_INLINE_REPAIR_PROPOSAL_SHA256,
        'originalD05ActualAdoptionSHA256':boundary['INLINE_LAYOUT_ORIGINAL_D05_ADOPTION_SHA256'],
        'publicCodePathMaximum':20,'publicProposalPathMaximum':2,'publicProposalPath':cp.INLINE_LAYOUT_REPAIR_PROPOSAL_PATH,
        'originalD05PublicProposalPath':cp.MIXED_INLINE_REPAIR_PROPOSAL_PATH,'CIExecutionAuthorized':True,
        'nativeLedgerOrLearningOrCredentialsIncluded':False,'jointMigrationRequired':True,'intermediateD05MigrationOrT02Performed':False,
        'fixtureKind':'TEST_FIXTURE_NO_ACTUAL_USER_PAYLOAD_OR_NATIVE_HISTORY'}
    path=root/'TEST_FIXTURE_D06_ADOPTION.json';path.write_text(json.dumps(adopted,ensure_ascii=False)+'\n',encoding='utf8')
    boundary['INLINE_LAYOUT_ACTUAL_ADOPTION_SHA256']=hashlib.sha256(path.read_bytes()).hexdigest()
    with patch.multiple('checkpoint',**boundary):
        d6=rt.evidence(FIXED_WORK,'file',{'path':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()},
            source_ref='TEST_FIXTURE/protocol-only',verification_level='local_execution',eid='TEST_FIXTURE_D06_ADOPTION')
    renderer=root/cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS[0]
    renderer.write_bytes(renderer.read_bytes()+b'\n// TEST_FIXTURE_D06_NOT_ACTUAL_LAYOUT_REPAIR\n')
    fixture.update(boundary=boundary,d6=d6)
    return fixture


class MathRenderingRecordTests(unittest.TestCase):
    """Exact public guard contracts without native or Git writes."""
    def record(self):
        import checkpoint as cp
        return {'schemaVersion':'qf01-math-prose-rendering-supplement/1',
            'proposalSHA256':cp.MATH_RENDERING_REPAIR_PROPOSAL_SHA256,
            'evidenceRef':'TEST_FIXTURE_D04','transcriptionSHA256':'a'*64,
            'quote':cp.MATH_RENDERING_REPAIR_ADOPTION_QUOTE,
            'source_ref':'request_user_input_async/'+cp.MATH_RENDERING_REPAIR_ADOPTION_CALL_ID,
            'verification_level':'conversation_transcribed','baselineSourceSHA':cp.MATH_RENDERING_REPAIR_BASELINE,
            'candidateBeforeSHA':cp.MATH_RENDERING_REPAIR_BASELINE,'candidateBeforeManifestSHA256':'b'*64,
            'candidateAfterSHA':'d'*40,'allowedProductPaths':list(cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS),
            'beforeRepair':copy.deepcopy(cp.MATH_RENDERING_REPAIR_BEFORE),
            'afterRepair':{p:'d'*64 for p in cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS},
            'originalD03MigrationEventHash':cp.MATH_RENDERING_REPAIR_D03_EVENT_HASH,
            'originalD03SupplementSHA256':cp.MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256,
            'definitionHash':'d'*64,'implementationHash':'e'*64,'checkpointEpoch':'f'*64}

    def test_separate_exact_d04_adoption_and_c_preimages(self):
        from checkpoint import validate_math_rendering_repair_record
        record=self.record();self.assertEqual(validate_math_rendering_repair_record(record),record)
        for key,value in [('proposalSHA256','0'*64),('quote','TEST_FIXTURE_CONTINUE_ONLY'),
            ('originalD03MigrationEventHash','0'*64),('originalD03SupplementSHA256','0'*64),
            ('baselineSourceSHA','b'*40),('beforeRepair',record['afterRepair']),('candidateBeforeManifestSHA256',True),
            ('evidenceRef','E'*129)]:
            changed=copy.deepcopy(record);changed[key]=value
            with self.subTest(key=key),self.assertRaises(CheckpointRejected):
                validate_math_rendering_repair_record(changed)
        changed=copy.deepcopy(record);changed['unapprovedExtra']=True
        with self.assertRaisesRegex(CheckpointRejected,'D04_REPAIR_RECORD_FIELDS'):
            validate_math_rendering_repair_record(changed)

    def test_current_cannot_rollback_or_replace_prior_d04_adoption(self):
        from checkpoint import validate_math_rendering_repair_continuation
        first=self.record();second=copy.deepcopy(first)
        second.update(candidateBeforeSHA=first['candidateAfterSHA'],candidateAfterSHA='e'*40)
        self.assertEqual(validate_math_rendering_repair_continuation(first,second,earlier_after=[first['afterRepair']]),second)
        changed=copy.deepcopy(second);changed['afterRepair']={p:'a'*64 for p in first['afterRepair']}
        with self.assertRaisesRegex(CheckpointRejected,'D04_OLD_AFTERIMAGE_ROLLBACK'):
            validate_math_rendering_repair_continuation(first,changed,earlier_after=[changed['afterRepair'],first['afterRepair']])
        changed=copy.deepcopy(second);changed['evidenceRef']='TEST_FIXTURE_REPLACED'
        with self.assertRaisesRegex(CheckpointRejected,'D04_PRESERVED_SUPPLEMENTAL_ADOPTION'):
            validate_math_rendering_repair_continuation(first,changed)

    def test_d04_document_scope_does_not_weaken_d03_or_normal_whole_diff(self):
        from checkpoint import MATH_RENDERING_REPAIR_PROPOSAL_PATH
        from adapters import _checkpoint_scope_diff
        with self.assertRaises(Rejected):_checkpoint_scope_diff({MATH_RENDERING_REPAIR_PROPOSAL_PATH})
        with self.assertRaises(Rejected):_checkpoint_scope_diff({MATH_RENDERING_REPAIR_PROPOSAL_PATH},math_rendering_repair=True)
        self.assertEqual(_checkpoint_scope_diff({MATH_RENDERING_REPAIR_PROPOSAL_PATH},nearby_repair=True,
            math_rendering_repair=True),[MATH_RENDERING_REPAIR_PROPOSAL_PATH])
        with self.assertRaises(Rejected):_checkpoint_scope_diff({'src/UNAPPROVED.ts'},nearby_repair=True,math_rendering_repair=True)


class InformedReviewMethodTests(unittest.TestCase):
    """Bounded TEST_FIXTURE reports test protocol, not actual reviewer quality.

    Only the external Git proof is mocked. The authority, native suffix,
    harness captures, targets, CODE bindings and receipt validation are real.
    """
    @classmethod
    def setUpClass(cls):
        from checkpoint import CURRENT_REPAIR_AFTER, INFORMED_PROPOSAL_PATH
        cls.temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_master_')
        cls.master = Path(cls.temporary.name).resolve()
        cls.prepared_temporary = None
        populate_preflight_fixture(cls.master)
        for relative, expected in CURRENT_REPAIR_AFTER.items():
            raw = repair_fixture_bytes(relative, expected)
            (cls.master / relative).write_bytes(raw)
        proposal = cls.master / INFORMED_PROPOSAL_PATH
        proposal.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(ENGINE.parent / INFORMED_PROPOSAL_PATH,proposal)
        store = initialize_fixture(cls.master); rt = Runtime(store.root,cls.master)
        with patch('checkpoint.verify_candidate_git',return_value=None):
            proof = rt.checkpoint_preflight(FIXED_WORK,candidate_sha='d'*40)
            rt.migrate_checkpoint_definition(FIXED_WORK,proof=proof,expected_head=proof['ledgerHead'])
        cls.evidence = rt.evidence(FIXED_WORK,'check',
            {'status':'PASS','source_sha':'d'*40,'checks':['TEST_FIXTURE_PROTOCOL_ONLY']},
            source_ref='TEST_FIXTURE/not-real-QA',eid='TEST_FIXTURE_D02_CHECK')
        cls.file_evidence = rt.evidence(FIXED_WORK,'file',
            {'path':'src/components/textbook/GuidedMathReadingFlow.tsx',
             'sha256':CURRENT_REPAIR_AFTER['src/components/textbook/GuidedMathReadingFlow.tsx']},
            source_ref='TEST_FIXTURE/candidate-bytes',eid='TEST_FIXTURE_D02_FILE')

    @classmethod
    def tearDownClass(cls):
        if cls.prepared_temporary:
            cls.prepared_temporary.cleanup()
        cls.temporary.cleanup()

    def setUp(self):
        self.reset_fixture()

    def reset_fixture(self):
        from definitions import instantiate
        from checkpoint import INFORMED_REVIEWERS
        temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_')
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        shutil.copytree(self.master,self.root,dirs_exist_ok=True)
        self.store = CheckpointStore(self.root/'work/recovery-checkpoints/qf01-p046-r3')
        self.rt = Runtime(self.store.root,self.root)
        self.node = instantiate(self.rt.state(FIXED_WORK)['plan'])['R04_PROPOSAL@qf01-full-lesson']
        self.matrix = [dict(claimRef=claim,facet=facet,
            semanticContributorRefs=['/root',*INFORMED_REVIEWERS],
            basis='TEST_FIXTURE disclosed authors/reason exposure; not quality evidence')
            for claim,facet in [('teaching','design'),('layout','render'),('implemented-visible','render'),('integrated-release','render')]]
        from team import informed_author_history
        history = informed_author_history(self.rt,FIXED_WORK)
        for row in self.matrix:
            known = set(row['semanticContributorRefs'])
            for _,claim,facet,refs in history:
                if facet == row['facet'] and (facet == 'render' or claim == row['claimRef']):
                    known.update(refs)
            row['semanticContributorRefs'] = sorted(known)

    def adopt(self,**overrides):
        from checkpoint import INFORMED_REVIEW_PROPOSAL_SHA256
        args = dict(proposal_sha256=INFORMED_REVIEW_PROPOSAL_SHA256,
            quote='限定D02案を採用して進める',
            source_ref='request_user_input_async/call_27be7afbeef843249d088b530a5701b7',
            author_matrix=self.matrix,evidence_refs=[self.evidence],expected_head=self.store.head)
        args.update(overrides)
        with patch('adapters._checkpoint_git_proof',return_value={'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_BOUNDARY'}):
            return self.rt.adopt_informed_review_method(FIXED_WORK,**args)

    def prepare(self,*,mutate_output=None,code_status='PASS'):
        from checkpoint import INFORMED_REVIEWERS
        from capabilities import implementation_hash
        from team import project,current_source,node_requirements
        from team_transport import capture_harness,bind_target,register_task,record_output,reconcile_task
        cls = type(self)
        if cls.prepared_temporary:
            temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_prepared_')
            self.addCleanup(temporary.cleanup)
            self.root = Path(temporary.name).resolve()
            shutil.copytree(Path(cls.prepared_temporary.name),self.root,dirs_exist_ok=True)
            self.store = CheckpointStore(self.root/'work/recovery-checkpoints/qf01-p046-r3')
            self.rt = Runtime(self.store.root,self.root)
            for key,value in cls.prepared_attributes.items():
                setattr(self,key,copy.deepcopy(value))
            if mutate_output:
                self.replace_report(mutate_output)
            if code_status != 'PASS':
                receipt = self.store.get(self.codes[0]); receipt['status'] = code_status
                receipt['output'] = self.store.put({'status':code_status,'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_CODE_EXECUTION'})
                receipt['cache_key'] = digest(['TEST_FIXTURE_CHANGED_CODE',code_status])
                reference = self.store.put(receipt)
                self.rt.append('capability_result',FIXED_WORK,dict(cache_key=receipt['cache_key'],
                    capability=receipt['capability'],phase=receipt['phase'],output=receipt['output']))
                self.rt.append('capability_bound',FIXED_WORK,dict(node=self.node['id'],input_hash=receipt['input_hash'],receipt=reference))
                self.codes[0] = reference
            return self.collection
        self.authority = self.adopt()
        s = self.rt.state(FIXED_WORK); base = self.rt.input_hash(s,self.node)
        self.rt.append('claimed',FIXED_WORK,dict(node=self.node['id'],actor='TEST_FIXTURE',
            input_hash=base,task_id=digest('TEST_FIXTURE_D02'),token='TEST_FIXTURE_D02_TOKEN',
            expires_at=time.time()+3600))
        self.codes = []
        implementation = implementation_hash(self.rt)
        for capability in self.node['capability_requests']:
            output = self.store.put({'status':code_status,'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_CODE_EXECUTION'})
            receipt = dict(capability=capability,node=self.node['id'],phase=self.node['phase'],
                status=code_status,input_hash=base,implementation_hash=implementation,
                cache_key=digest(['TEST_FIXTURE_D02',capability]),output=output)
            ref = self.store.put(receipt); self.codes.append(ref)
            self.rt.append('capability_result',FIXED_WORK,dict(cache_key=receipt['cache_key'],
                capability=capability,phase=self.node['phase'],output=output))
            self.rt.append('capability_bound',FIXED_WORK,dict(node=self.node['id'],input_hash=base,receipt=ref))
        p = project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
        self.old_open = [f for fs in p['findings'].values() for f in fs if f['resolution'] in ('OPEN','UNRESOLVED')]
        self.collection = dict(submissionActor='M',outputRefs=[],registrationRefs=[],methodAuthorityRef=self.authority['authorityRef'])
        self.reviews = {}
        for req in node_requirements(s['plan']['agent_team'],self.node):
            target = bind_target(self.rt,FIXED_WORK,self.node['id'],req['facet'],self.codes,
                                 [self.evidence,self.file_evidence],artifact_hashes={'code':self.codes[0]})
            for index,who in enumerate(INFORMED_REVIEWERS):
                task = 'TEST_FIXTURE_D02_'+req['claimRef']+'_'+str(index)
                a = dict(assignmentId=task,roleEpoch=1,node=self.node['id'],block=self.node['block'],
                    facet=req['facet'],claimRefs=[req['claimRef']],performerRef=who,role='reviewer',
                    inputHash=base,sourceSHA=current_source(s,self.node),artifactHashes={'code':self.codes[0]},
                    allowedPaths=[],writeMode='READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX',
                    dependsOnTasks=[],budget={'tokenBudget':None},independent=False,targetManifestRef=target['targetManifestRef'])
                packet = dict(baseNodeInputHash=base,sourceRefs=[self.evidence,self.file_evidence],
                    authorHistory=self.matrix,contextExposure={'forkMode':'all','authorRationaleVisibleAtFirstPass':True})
                packet['packetHash'] = digest(packet)
                capture = capture_harness(self.rt,FIXED_WORK,dict(agentRef=who,taskRef=task,
                    parentRef='/root',toolName='collaboration.followup_task',attestationMethod='transcribed-tool-result',
                    rawResult={'fixtureKind':'TEST_FIXTURE_NO_AGENT_WAS_RUN'}))
                harness = dict(agentRef=who,taskRef=task,parentRef='/root',logicalRole='A' if index==0 else 'B',
                    toolResultRef=capture['artifactRef'],attestationMethod='transcribed-tool-result')
                registration = register_task(self.rt,FIXED_WORK,a,packet,harness)
                findings = [dict(findingId=f['findingId'],claimRef=f['claimRef'],facet=f['facet'],
                    reason='TEST_FIXTURE protocol resolution only',evidenceRefs=[self.evidence],
                    resolution='VERIFIED_FIXED',reexaminesOutputRef=f['outputRef'])
                    for f in self.old_open if (f['claimRef'],f['facet'])==(req['claimRef'],req['facet'])]
                out = dict(kind='review',assignmentHash=registration['assignmentHash'],packetHash=packet['packetHash'],
                    performerRef=who,verdict='PASS',findings=findings,claimRef=req['claimRef'],facet=req['facet'],
                    targetHash=self.codes[0],reviewKind=req['reviewKind'],independent=False,authorSeparation=False,
                    sourceFirst=False,firstPass=False,currentSourceSHA=s['candidate_sha'],evidenceRefs=[self.evidence],
                    rationale='TEST_FIXTURE protocol test; not actual semantic review',codeReceiptRefs=self.codes)
                if mutate_output:
                    mutate_output(out)
                output_capture = capture_harness(self.rt,FIXED_WORK,dict(agentRef=who,taskRef=task,
                    attestationMethod='transcribed-tool-result',channel='subagent-final',
                    rawResult={'fixtureKind':'TEST_FIXTURE_NO_AGENT_WAS_RUN','structured':copy.deepcopy(out)},structuredOutputHash=digest(out)))
                out['harnessOutputRef'] = output_capture['artifactRef']
                recorded = record_output(self.rt,FIXED_WORK,registration['registrationRef'],out)
                reconcile_task(self.rt,FIXED_WORK,registration['registrationRef'],'COMPLETED',[output_capture['artifactRef']])
                self.collection['registrationRefs'].append(registration['registrationRef'])
                self.collection['outputRefs'].append(recorded['outputRef'])
                self.reviews.setdefault((req['claimRef'],req['facet']),[]).append(recorded['outputRef'])
        self.dispositions = [dict(findingId=f['findingId'],priorOutputRef=f['outputRef'],claimRef=f['claimRef'],facet=f['facet'],
            resolution='VERIFIED_FIXED',reason='TEST_FIXTURE bounded protocol evidence',evidenceRefs=[self.evidence],
            codeReceiptRefs=self.codes,reviewOutputRefs=self.reviews[(f['claimRef'],f['facet'])]) for f in self.old_open]
        if not mutate_output and code_status == 'PASS':
            cls.prepared_temporary = tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_cache_')
            shutil.copytree(self.root,Path(cls.prepared_temporary.name),dirs_exist_ok=True)
            cls.prepared_attributes = {key:copy.deepcopy(getattr(self,key)) for key in
                ('authority','codes','old_open','collection','reviews','dispositions')}
        return self.collection

    def replace_report(self,mutate,*,assignment_mutate=None,bypass_output_transport=False):
        """A new actual transport task, never alteration of a stored report."""
        from team import project
        from team_transport import capture_harness,register_task,record_output,reconcile_task
        p = project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
        oldref = self.collection['outputRefs'][0]; row = p['outputs'][oldref]
        oldregref = row['registrationRef']; reg = copy.deepcopy(p['registrations'][oldregref])
        a = reg['assignment']; a['roleEpoch'] += 1
        if assignment_mutate:
            assignment_mutate(a)
        who = a['performerRef']; task = reg['harness']['taskRef']+'_REVISION'
        raw = capture_harness(self.rt,FIXED_WORK,dict(agentRef=who,taskRef=task,parentRef='/root',
            toolName='collaboration.followup_task',attestationMethod='transcribed-tool-result',
            rawResult={'fixtureKind':'TEST_FIXTURE_NO_AGENT_WAS_RUN'}))
        h = dict(reg['harness'],agentRef=who,taskRef=task,toolResultRef=raw['artifactRef'])
        registered = register_task(self.rt,FIXED_WORK,a,reg['packet'],h)
        out = copy.deepcopy(row['output']); out.pop('harnessOutputRef')
        out['assignmentHash'] = registered['assignmentHash']; out['performerRef'] = who; mutate(out)
        captured = capture_harness(self.rt,FIXED_WORK,dict(agentRef=who,taskRef=task,
            attestationMethod='transcribed-tool-result',channel='subagent-final',rawResult={'fixtureKind':'TEST_FIXTURE_NO_AGENT_WAS_RUN'},
            structuredOutputHash=digest(out)))
        out['harnessOutputRef'] = captured['artifactRef']
        if bypass_output_transport:
            # TEST_FIXTURE attack: bypass the public transport solely to prove
            # that result/replay validation also rejects a forged reviewer role.
            original = self.store.put(out)
            normalized = copy.deepcopy(out)
            for finding in normalized['findings']:
                finding.update(node=a['node'],block=a.get('block'),inputHash=a['inputHash'])
            body = dict(registrationRef=registered['registrationRef'],output=normalized,
                        originalOutputRef=original,submissionActor='M')
            reference = self.store.put(body)
            self.rt.append('team_output_recorded',FIXED_WORK,dict(body,outputRef=reference))
            recorded = {'outputRef':reference}
        else:
            recorded = record_output(self.rt,FIXED_WORK,registered['registrationRef'],out)
        reconcile_task(self.rt,FIXED_WORK,registered['registrationRef'],'COMPLETED',[captured['artifactRef']])
        self.collection['outputRefs'][0] = recorded['outputRef']
        self.collection['registrationRefs'] = [registered['registrationRef'] if r==oldregref else r for r in self.collection['registrationRefs']]
        for disposition in self.dispositions:
            disposition['reviewOutputRefs'] = [recorded['outputRef'] if r==oldref else r for r in disposition['reviewOutputRefs']]
        return recorded['outputRef']

    def seal(self):
        return self.rt.seal_informed_review(FIXED_WORK,self.node['id'],collection=self.collection,
            capability_receipts=self.codes,evidence_refs=[self.evidence],finding_dispositions=self.dispositions)

    def result(self,sealed):
        return dict(verdict='PASS',capability_receipts=self.codes,
                    teamCollection=dict(self.collection,methodReceiptRef=sealed['methodReceiptRef']))

    def test_exact_adoption_preserves_plan_users_and_historical_first_seals(self):
        from checkpoint import INFORMED_FIRST_PASS_REFS
        from team import current_informed_authority,informed_review_input_binding
        before = self.rt.state(FIXED_WORK); first = {r:self.store.get(r) for r in INFORMED_FIRST_PASS_REFS}
        old = self.rt.input_hash(before,self.node); accepted = self.adopt()
        after = self.rt.state(FIXED_WORK)
        self.assertEqual(after['plan'],before['plan']); self.assertEqual(after['users'],before['users'])
        self.assertEqual(first,{r:self.store.get(r) for r in INFORMED_FIRST_PASS_REFS})
        self.assertNotEqual(old,self.rt.input_hash(after,self.node))
        self.assertFalse(accepted['gateAccepted'])
        self.assertEqual(current_informed_authority(self.rt,FIXED_WORK)['authorityRef'],accepted['authorityRef'])
        self.assertIsNone(informed_review_input_binding(after,{'id':'R06_PATCH@qf01-full-lesson'}))

    def test_wrong_adoption_hash_quote_source_and_old_head_are_rejected(self):
        for changed in [dict(proposal_sha256='0'*64),dict(quote='続けて'),dict(source_ref='TEST_FIXTURE_WRONG'),dict(expected_head='0'*64)]:
            with self.subTest(changed=changed),self.assertRaises(Rejected): self.adopt(**changed)

    def test_authority_mutations_epoch_work_source_original_hashes_and_flags_rejected(self):
        from team import validate_informed_authority_body
        body = self.adopt()['authority']; state = self.rt.state(FIXED_WORK)
        for field,value in [('checkpointEpoch','0'*64),('work','OTHER'),('currentSourceSHA','0'*40),
            ('originalSourceSHA','0'*40),('originalPlanSHA256','0'*64),('originalUsersSHA256','0'*64),
            ('candidateManifestSHA256','0'*64),('definitionHash','0'*64),('independent',True),
            ('historicalFirstPassRefs',[]),('reviewerRefs',['/root'])]:
            mutation = copy.deepcopy(body); mutation[field] = value
            with self.subTest(field=field),self.assertRaises(Rejected):
                validate_informed_authority_body(self.rt,FIXED_WORK,state,mutation)

    def test_two_actual_fixture_reports_per_scope_and_sealed_event_are_required(self):
        from team import check_collection
        self.prepare(); sealed = self.seal(); result = self.result(sealed)
        check_collection(self.rt,FIXED_WORK,self.node,result)
        receipt = sealed['receipt']  # check_collection already validates this body.
        self.assertEqual(len(self.collection['outputRefs']),4)
        self.assertTrue(all(receipt[k] is False for k in ('independent','sourceFirst','firstPass')))
        self.assertFalse(sealed['semanticValidityVerified']); self.assertFalse(sealed['gateAccepted'])

    def test_one_reviewer_missing_refuses_seal(self):
        self.prepare(); self.collection['outputRefs'].pop()
        with self.assertRaises(Rejected): self.seal()

    def test_independence_or_first_pass_forgery_refuses_seal(self):
        self.prepare(mutate_output=lambda out:out.update(independent=True,firstPass=True))
        with self.assertRaises(Rejected): self.seal()

    def test_author_separation_lie_refuses_seal(self):
        self.prepare(mutate_output=lambda out:out.update(authorSeparation=True))
        with self.assertRaises(Rejected): self.seal()

    def test_code_fail_cannot_be_promoted_to_review_pass(self):
        self.prepare(code_status='FAIL')
        with self.assertRaises(Rejected): self.seal()

    def test_unknown_target_source_cannot_become_current_review(self):
        self.prepare(mutate_output=lambda out:out.update(currentSourceSHA='e'*40))
        with self.assertRaises(Rejected): self.seal()

    def test_open_finding_and_single_author_disposition_cannot_be_omitted(self):
        self.prepare(); original = copy.deepcopy(self.dispositions)
        self.dispositions = []
        with self.assertRaises(Rejected): self.seal()
        self.dispositions = original; self.dispositions[0]['reviewOutputRefs'].pop()
        with self.assertRaises(Rejected): self.seal()

    def test_artifact_without_real_seal_event_cannot_be_accepted(self):
        from team import build_informed_review_receipt,check_collection
        self.prepare()
        body = build_informed_review_receipt(self.rt,FIXED_WORK,self.node,self.collection,self.codes,[self.evidence],self.dispositions)
        ref = self.store.put(body)
        with self.assertRaises(Rejected): check_collection(self.rt,FIXED_WORK,self.node,self.result({'methodReceiptRef':ref}))

    def test_revocation_changes_input_and_rejects_old_receipt(self):
        from team import check_collection,current_informed_authority
        self.prepare(); sealed = self.seal(); before = self.rt.input_hash(self.rt.state(FIXED_WORK),self.node)
        # Release only the temporary fixture claim before explicit revocation.
        self.rt.append('claim_reconciled',FIXED_WORK,{'node':self.node['id'],'reason':'TEST_FIXTURE'})
        self.rt.revoke_informed_review_method(FIXED_WORK,authority_ref=self.authority['authorityRef'],
            quote='TEST_FIXTURE revoke',reason='TEST_FIXTURE',source_ref='TEST_FIXTURE/revoke',expected_head=self.store.head)
        self.assertIsNone(current_informed_authority(self.rt,FIXED_WORK))
        self.assertNotEqual(before,self.rt.input_hash(self.rt.state(FIXED_WORK),self.node))
        with self.assertRaises(Rejected): check_collection(self.rt,FIXED_WORK,self.node,self.result(sealed))

    def test_source_change_invalidates_predesign_input_and_old_receipt(self):
        from team import check_collection
        self.prepare(); sealed = self.seal(); state = self.rt.state(FIXED_WORK)
        before = self.rt.input_hash(state,self.node)
        self.rt.append('candidate',FIXED_WORK,{'sha':'e'*40,'manifest':state['candidate_manifest']})
        self.assertNotEqual(before,self.rt.input_hash(self.rt.state(FIXED_WORK),self.node))
        with self.assertRaises(Rejected): check_collection(self.rt,FIXED_WORK,self.node,self.result(sealed))

    def test_new_undisclosed_packet_author_invalidates_input_and_authority(self):
        from team import project,current_informed_authority
        from team_transport import capture_harness,register_task
        self.prepare(); self.seal(); state = self.rt.state(FIXED_WORK)
        before = self.rt.input_hash(state,self.node)
        p = project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
        reg = copy.deepcopy(p['registrations'][self.collection['registrationRefs'][-1]])
        a = reg['assignment']; a['assignmentId'] += '_NEW_HISTORY'
        packet = reg['packet']; packet['authorHistory'][1]['semanticContributorRefs'].append('/root/TEST_FIXTURE_NEW_CONTRIBUTOR')
        packet.pop('packetHash'); packet['packetHash'] = digest(packet)
        who = a['performerRef']; task = a['assignmentId']
        raw = capture_harness(self.rt,FIXED_WORK,dict(agentRef=who,taskRef=task,parentRef='/root',
            toolName='collaboration.followup_task',attestationMethod='transcribed-tool-result',
            rawResult={'fixtureKind':'TEST_FIXTURE_NO_AGENT_WAS_RUN'}))
        harness = dict(reg['harness'],taskRef=task,toolResultRef=raw['artifactRef'])
        register_task(self.rt,FIXED_WORK,a,packet,harness)
        self.assertNotEqual(before,self.rt.input_hash(self.rt.state(FIXED_WORK),self.node))
        with self.assertRaises(Rejected): current_informed_authority(self.rt,FIXED_WORK)

    def test_rehashed_past_receipt_metadata_cannot_carry_finding_resolutions(self):
        from team import project,_accepted_informed_dispositions,check_open_findings,node_requirements
        from definitions import instantiate
        self.prepare(); sealed = self.seal(); result = self.result(sealed)
        state = self.rt.state(FIXED_WORK)
        self.rt.append('result',FIXED_WORK,dict(node=self.node['id'],artifact=self.store.put(result),
            input_hash=self.rt.input_hash(state,self.node),verdict='PASS',actor='TEST_FIXTURE_NOT_ACTUAL_GATE'))
        state = self.rt.state(FIXED_WORK); p = project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
        self.assertEqual(len(_accepted_informed_dispositions(self.rt,FIXED_WORK,state,p)),len(self.dispositions))
        tampered = copy.deepcopy(sealed['receipt']); tampered['currentSourceSHA'] = '0'*40
        badref = self.store.put(tampered)
        self.rt.append('informed_review_receipt_sealed',FIXED_WORK,dict(node=self.node['id'],inputHash=tampered['inputHash'],
            methodAuthorityRef=self.authority['authorityRef'],methodReceiptRef=badref))
        badresult = self.result({'methodReceiptRef':badref})
        self.rt.append('result',FIXED_WORK,dict(node=self.node['id'],artifact=self.store.put(badresult),
            input_hash=self.rt.input_hash(state,self.node),verdict='PASS',actor='TEST_FIXTURE_ATTACK_NOT_ACTUAL_GATE'))
        state = self.rt.state(FIXED_WORK)
        self.assertEqual(_accepted_informed_dispositions(self.rt,FIXED_WORK,state,p),[])
        final = instantiate(state['plan'])['G2_AUDIT@qf01-p035']
        with self.assertRaises(Rejected):
            check_open_findings(self.rt,FIXED_WORK,final,{'verdict':'PASS'},node_requirements(state['plan']['agent_team'],final))

    def test_rehashed_suffix_cannot_seal_before_actual_reports_complete(self):
        from team import check_collection
        self.prepare(); sealed = self.seal(); rows = self.store.suffix_events()
        seal = rows.pop()
        self.assertEqual(seal['kind'],'informed_review_receipt_sealed')
        output_index = max(i for i,e in enumerate(rows) if e['kind']=='team_output_recorded')
        rows.insert(output_index,seal)
        self.rewrite_fixture_suffix(rows)
        self.assertEqual(len(self.rt.store.suffix_events()),len(rows))
        with self.assertRaisesRegex(Rejected,'sealより後'):
            check_collection(self.rt,FIXED_WORK,self.node,self.result(sealed))

    def rewrite_fixture_suffix(self,rows):
        from checkpoint import canonical
        # Attack only this resolved temporary TEST_FIXTURE clone; no original
        # authority, historical prefix envelope, source or production Store.
        self.assertIn('TEST_FIXTURE_D02',self.root.name)
        events = self.store.root/'events'
        self.assertTrue(events.resolve().is_relative_to(self.root.resolve()))
        for path in list(events.iterdir()):
            self.assertEqual(path.resolve().parent,events.resolve()); path.unlink()
        previous = FIXED_ANCHOR['head']
        for seq,row in enumerate(rows,start=FIXED_ANCHOR['events']+1):
            row = dict(row,seq=seq,previous=previous); row.pop('hash')
            row['hash'] = digest(row); previous = row['hash']
            (events/(str(seq).zfill(8)+'-'+row['id']+'.json')).write_bytes(canonical(row)+b'\n')
        self.rt = Runtime(self.store.root,self.root)
        self.store = self.rt.store

    def test_current_code_target_subset_and_author_artifact_boundary(self):
        from team import check_collection
        from team_transport import bind_target
        self.prepare()
        target = bind_target(self.rt,FIXED_WORK,self.node['id'],'design',[self.codes[0]],
            [self.evidence,self.file_evidence],artifact_hashes={'code':self.codes[0]})
        self.replace_report(lambda out:None,assignment_mutate=lambda a:a.update(targetManifestRef=target['targetManifestRef']))
        sealed = self.seal(); check_collection(self.rt,FIXED_WORK,self.node,self.result(sealed))
        author = self.replace_report(lambda out:out.update(kind='author',findings=[]),
            assignment_mutate=lambda a:a.update(role='author'))
        with self.assertRaisesRegex(Rejected,'D targetはcurrent CODE'):
            bind_target(self.rt,FIXED_WORK,self.node['id'],'design',[author],
                [self.evidence,self.file_evidence],artifact_hashes={'author':author})

    def test_capture_writer_and_after_seal_order_rehashed_attacks_rejected(self):
        from team import check_collection,project
        for attack in ('writer','order'):
            with self.subTest(attack=attack):
                self.prepare(); sealed = self.seal()
                p = project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
                reg = p['registrations'][self.collection['registrationRefs'][0]]
                reference = reg['harness']['toolResultRef']; rows = self.store.suffix_events()
                index = next(i for i,e in enumerate(rows) if e['kind']=='team_harness_captured' and e['payload'].get('artifactRef')==reference)
                if attack == 'writer':
                    rows[index]['payload']['submissionActor'] = 'TEST_FIXTURE_NOT_M'
                else:
                    rows.append(rows.pop(index))
                self.rewrite_fixture_suffix(rows)
                with self.assertRaises(Rejected):
                    check_collection(self.rt,FIXED_WORK,self.node,self.result(sealed))

    def test_reviewer_role_is_required_after_forged_output_event(self):
        self.prepare()
        with self.assertRaisesRegex(Rejected,'固定2名'):
            self.replace_report(lambda out:None,assignment_mutate=lambda a:a.update(performerRef='/root/TEST_FIXTURE_THIRD_NO_AGENT_WAS_RUN'))
        self.replace_report(lambda out:None,assignment_mutate=lambda a:a.update(role='author'),bypass_output_transport=True)
        with self.assertRaisesRegex(Rejected,'reviewerの実報告'):
            self.seal()

    def test_informed_runner_scope_lease_and_input_keys_fail_before_claim(self):
        self.adopt(); task = self.rt.task(FIXED_WORK,self.node['id'])
        inputs = {cap:{} for cap in self.node['capability_requests']}
        head = self.store.head
        with patch.object(self.rt,'next',return_value={'status':'READY','task':task}):
            for seconds in [True,899,7201]:
                with self.subTest(seconds=seconds),self.assertRaises(Rejected):
                    self.rt.run_informed_review(FIXED_WORK,inputs,seconds=seconds)
            for invalid in [{},dict(inputs,TEST_FIXTURE_EXTRA={}),dict(inputs,**{next(iter(inputs)):None})]:
                with self.subTest(inputs=invalid),self.assertRaises(Rejected):
                    self.rt.run_informed_review(FIXED_WORK,invalid)
        with self.assertRaises(Rejected): self.rt.run_informed_review('TEST_FIXTURE_OTHER_WORK',inputs)
        wrong_task = copy.deepcopy(task); wrong_task['node']['id'] = 'R06_PATCH@qf01-full-lesson'
        with patch.object(self.rt,'next',return_value={'status':'READY','task':wrong_task}),self.assertRaises(Rejected):
            self.rt.run_informed_review(FIXED_WORK,inputs)
        self.assertEqual(self.store.head,head)
        self.assertFalse(self.rt.state(FIXED_WORK)['claims'])

    def test_informed_runner_claim_precedes_code_and_never_accepts_result(self):
        from capabilities import implementation_hash
        self.adopt(); task = self.rt.task(FIXED_WORK,self.node['id']); implementation = implementation_hash(self.rt)
        inputs = {cap:{'fixtureKind':'TEST_FIXTURE'} for cap in self.node['capability_requests']}
        before = self.store.head; started = time.time()
        def fixture_code(rt,work,node,capability,value):
            claim = rt.state(work)['claims'][node['id']]
            self.assertEqual(claim['input_hash'],task['input_hash'])
            output = self.store.put({'status':'NEEDS_AI_REVIEW','fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_CODE_EXECUTION'})
            receipt = dict(capability=capability,phase=node['phase'],implementation_hash=implementation,
                input_hash=claim['input_hash'],node=node['id'],cache_key=digest(['TEST_FIXTURE_RUNNER',capability]),output=output,status='NEEDS_AI_REVIEW')
            ref = self.store.put(receipt)
            rt.append('capability_result',work,dict(cache_key=receipt['cache_key'],capability=capability,phase=node['phase'],output=output))
            rt.append('capability_bound',work,dict(node=node['id'],input_hash=claim['input_hash'],receipt=ref))
            return ref
        with patch.object(self.rt,'next',return_value={'status':'READY','task':task}),patch('capabilities.run_capability',side_effect=fixture_code) as runner:
            ran = self.rt.run_informed_review(FIXED_WORK,inputs)
        self.assertEqual(runner.call_count,len(inputs)); self.assertFalse(ran['automaticAcceptance'])
        self.assertEqual(ran['claimSeconds'],3600); self.assertEqual(len(ran['receipts']),len(inputs))
        claim = self.rt.state(FIXED_WORK)['claims'][self.node['id']]
        self.assertGreaterEqual(claim['expires_at'],started+3600)
        rows = self.store.suffix_events(); start = next(i for i,e in enumerate(rows) if e['hash']==before)
        new = rows[start+1:]; self.assertEqual(new[0]['kind'],'claimed')
        self.assertFalse(any(e['kind']=='result' for e in new))

    def prepare_technical_owner(self,*,adopt_method=True,approve_d=True):
        """Symbolic original A bytes: actual Git correspondence is mocked.

        This tests original snapshot immutability and current candidate binding,
        never certifies the fixture bytes as public Git A or an actual T result.
        """
        from adapters import _CHECKPOINT_CORE_PATHS,_CHECKPOINT_D02_BASELINE
        from checkpoint import RECOVERY_WORK,INFORMED_REVIEW_PROPOSAL_SHA256
        from definitions import instantiate
        current = {}
        for relative in sorted(_CHECKPOINT_CORE_PATHS):
            raw = (ENGINE.parent/relative).read_bytes(); current[relative] = raw
            path = self.root/relative; path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(raw)
        symbolic_a = self.root/'workflow/runtime.py'
        symbolic_a.write_bytes(symbolic_a.read_bytes()+b'\n# TEST_FIXTURE_SYMBOLIC_ORIGINAL_A_NOT_GIT_PROOF\n')
        primary = self.rt.state(FIXED_WORK)
        plan = dict(work_id=RECOVERY_WORK,profile='technical',command='GOVERNANCE',
            subject='math',mode='textbook',source_sha=_CHECKPOINT_D02_BASELINE,parent_work=FIXED_WORK,
            simulation=False,rules={},proposal={'id':'TEST_FIXTURE_OLD_1D','hash':RECOVERY_PROPOSAL_SHA256},
            source_manifest=manifest(self.root,sorted(_CHECKPOINT_CORE_PATHS)),
            scope={'paths':sorted(_CHECKPOINT_CORE_PATHS),'preserve':[]},
            protected_manifest={**primary['plan']['protected_manifest'],**primary['candidate_manifest']},
            blocks=[{'id':'TEST_FIXTURE_TECHNICAL_CORE','sources':sorted(_CHECKPOINT_CORE_PATHS)}])
        self.rt.open(plan)
        self.rt.user(RECOVERY_WORK,'approve_proposal','この限定案を採用して進める',RECOVERY_PROPOSAL_SHA256,
            'TEST_FIXTURE/request_user_input_async/call_d1c88a5dde794be288a201a5ea8de0cc')
        owner = self.rt.state(RECOVERY_WORK); node = instantiate(owner['plan'])['T01_ANALYSIS']
        old = self.store.put({'verdict':'PASS','fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_T_RESULT'})
        self.rt.append('result',RECOVERY_WORK,dict(node=node['id'],artifact=old,
            input_hash=self.rt.input_hash(owner,node),verdict='PASS',actor='TEST_FIXTURE_ONLY'))
        revised = copy.deepcopy(plan); revised['proposal'] = {'id':'TEST_FIXTURE_D02','hash':INFORMED_REVIEW_PROPOSAL_SHA256}
        self.rt.revise(RECOVERY_WORK,revised)
        if approve_d:
            self.rt.user(RECOVERY_WORK,'approve_proposal','限定D02案を採用して進める',INFORMED_REVIEW_PROPOSAL_SHA256,
                'request_user_input_async/call_27be7afbeef843249d088b530a5701b7')
        for relative,raw in current.items():
            (self.root/relative).write_bytes(raw)
        report = self.root/'TEST_FIXTURE_OWNER_CURRENT_CODE.json'
        report.write_text(json.dumps({'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_VERIFICATION','currentSourceSHA':'d'*40})+'\n',encoding='utf-8')
        self.owner_verification = self.rt.evidence(RECOVERY_WORK,'file',
            {'path':report.name,'sha256':hashlib.sha256(report.read_bytes()).hexdigest()},source_ref='TEST_FIXTURE/local-structure')
        if adopt_method:
            self.authority = self.adopt()
        self.owner_before = self.rt.state(RECOVERY_WORK)
        self.owner_snapshot = self.store.source_snapshot(RECOVERY_WORK)
        self.owner_git = {'schemaVersion':'qf01-informed-technical-git-proof/1',
            'previousCandidateSHA':_CHECKPOINT_D02_BASELINE,
            'retainedManifestSHA256':digest(self.owner_before['plan']['source_manifest']),
            'currentMaterialGitProof':{'fixtureKind':'TEST_FIXTURE_MOCKED_GIT_NOT_PUBLIC_A_OR_B_PROOF','candidateSHA':'d'*40}}

    def reconcile_owner(self,**overrides):
        from checkpoint import RECOVERY_WORK
        args = dict(candidate_sha='d'*40,verification_refs=[self.owner_verification],expected_head=self.store.head)
        args.update(overrides)
        with patch('adapters._checkpoint_informed_technical_git',return_value=self.owner_git):
            return self.rt.reconcile_informed_technical_owner(RECOVERY_WORK,**args)

    def test_technical_owner_current_code_binding_preserves_original_source_users_results(self):
        from checkpoint import RECOVERY_WORK
        from definitions import instantiate
        self.prepare_technical_owner(); before = self.owner_before
        code_paths = before['plan']['source_manifest']
        files = {p:hashlib.sha256((self.root/p).read_bytes()).hexdigest() for p in code_paths}
        result = self.reconcile_owner(); after = self.rt.state(RECOVERY_WORK)
        self.assertEqual(after['candidate_sha'],'d'*40)
        self.assertEqual(after['candidate_manifest'],manifest(self.root,code_paths))
        for key in ('plan','users','results','definition_hash'):
            self.assertEqual(after[key],before[key])
        self.assertEqual(self.store.source_snapshot(RECOVERY_WORK),self.owner_snapshot)
        self.assertEqual(files,{p:hashlib.sha256((self.root/p).read_bytes()).hexdigest() for p in code_paths})
        self.assertFalse(result['codeFilesWritten']); self.assertFalse(result['gateAccepted'])
        proof = result['proof']; self.assertFalse(proof['writesExecuted']); self.assertFalse(proof['oldResultsTransferred'])
        self.assertEqual({r['node'] for r in proof['resultDispositions']},set(before['results']))
        event = self.store.suffix_events()[-1]
        self.assertEqual(event['kind'],'informed_technical_candidate_reconciled')
        self.assertEqual(event['previous'],proof['expectedHead'])
        node = instantiate(after['plan'])['T01_ANALYSIS']
        self.assertNotEqual(before['results'][node['id']]['input_hash'],self.rt.input_hash(after,node))

    def test_technical_owner_requires_adopted_method_exact_new_approval_and_correct_owner(self):
        from checkpoint import RECOVERY_WORK,PUBLISHER_WORK
        for i,case in enumerate(('method','approval','owner')):
            with self.subTest(case=case):
                if i:self.reset_fixture()
                self.prepare_technical_owner(adopt_method=case!='method',approve_d=case!='approval')
                head = self.store.head
                with self.assertRaises(Rejected):
                    if case=='owner':
                        self.rt.reconcile_informed_technical_owner(PUBLISHER_WORK,candidate_sha='d'*40,
                            verification_refs=[self.owner_verification],expected_head=head)
                    else:self.reconcile_owner()
                self.assertEqual(self.store.head,head)
                self.assertEqual(self.store.source_snapshot(RECOVERY_WORK),self.owner_snapshot)

    def test_technical_owner_head_inventory_and_original_scope_fail_without_writes(self):
        from checkpoint import RECOVERY_WORK
        for i,case in enumerate(('head','inventory','scope')):
            with self.subTest(case=case):
                if i:self.reset_fixture()
                self.prepare_technical_owner()
                expected = self.store.head
                if case=='head':
                    self.rt.append('TEST_FIXTURE_CONCURRENT_HEAD',RECOVERY_WORK,{'fixtureKind':'TEST_FIXTURE'})
                elif case=='inventory':
                    state = self.rt.state(RECOVERY_WORK)
                    self.rt.append('candidate',RECOVERY_WORK,dict(sha=state['candidate_sha'],
                        manifest=dict(state['candidate_manifest'],**{'tools/textbook/operations.mjs':digest('TEST_FIXTURE_EXTRA_PATH')})))
                    expected = self.store.head
                else:
                    plan = copy.deepcopy(self.owner_before['plan']); plan['scope']['paths'].append('tools/textbook/operations.mjs')
                    before_head=self.store.head
                    before_rows=self.store._tail.events()
                    before_raw={p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()}
                    opened=next(e for e in before_rows if e['work']==RECOVERY_WORK and e['kind']=='opened')
                    self.rt.append('revised',RECOVERY_WORK,{'plan':plan})
                    corrupted_rows=self.store._tail.events()
                    corrupted_raw={p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()}
                    self.assertEqual(len(corrupted_rows),len(before_rows)+1)
                    self.assertEqual(len(corrupted_raw),len(before_raw)+1)
                    self.assertEqual(corrupted_rows[-1]['previous'],before_head)
                    self.assertEqual(corrupted_rows[-1]['payload']['plan'],plan)
                    self.assertEqual({name:corrupted_raw[name] for name in before_raw},before_raw)
                    # The typed suffix now rejects this raw same-adoption
                    # scope attack before the reconciliation API can inspect it.
                    with self.assertRaisesRegex(CheckpointRejected,'D04_OWNER_REVISION_SAME_ADOPTION_REQUIRED'):
                        _=self.store.head
                    with self.assertRaisesRegex(CheckpointRejected,'D04_OWNER_REVISION_SAME_ADOPTION_REQUIRED'):
                        self.reconcile_owner(expected_head=expected)
                    self.assertEqual({p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()},corrupted_raw)
                    self.assertEqual(self.store._tail.head,corrupted_rows[-1]['hash'])
                    self.assertEqual(self.store.get(opened['payload']['original_snapshot']),self.owner_snapshot['snapshot'])
                    self.assertEqual(corrupted_rows[-1]['payload']['plan']['source_manifest'],self.owner_before['plan']['source_manifest'])
                    continue
                head = self.store.head
                with self.assertRaises(Rejected):self.reconcile_owner(expected_head=expected)
                self.assertEqual(self.store.head,head)
                self.assertEqual(self.store.source_snapshot(RECOVERY_WORK),self.owner_snapshot)
                self.assertEqual(self.rt.state(RECOVERY_WORK)['plan']['source_manifest'],self.owner_before['plan']['source_manifest'])


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
            raw = repair_fixture_bytes(relative, expected)
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


class NearbyReviewMethodTests(unittest.TestCase):
    """Real temporary protocol/harness events, explicitly not actual reviewers/QA."""
    reset_fixture=InformedReviewMethodTests.reset_fixture
    setUp=InformedReviewMethodTests.setUp
    replace_report=InformedReviewMethodTests.replace_report
    seal=InformedReviewMethodTests.seal
    result=InformedReviewMethodTests.result
    tearDownClass=classmethod(InformedReviewMethodTests.tearDownClass.__func__)

    @classmethod
    def setUpClass(cls):
        cls.temporary=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_D03_review_master_')
        cls.addClassCleanup(cls.temporary.cleanup)
        cls.master=Path(cls.temporary.name).resolve();cls.prepared_temporary=None
        fixture=populate_nearby_fixture(cls.master);rt=fixture['rt']
        cls.repair_evidence=fixture['d3']
        from checkpoint import NEARBY_REPAIR_BASELINE
        original={'schemaVersion':'qf01-current-b-confirmed-local-open-finding/1',
            'findingID':'QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123',
            'sourceSHA':NEARBY_REPAIR_BASELINE,'status':'OPEN_CONFIRMED_LOCAL_EVIDENCE',
            'productRepairApplied':False,'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_B_DIAGNOSIS'}
        path=cls.master/'TEST_FIXTURE_ORIGINAL_B_DIAGNOSTIC.json'
        path.write_text(json.dumps(original)+'\n',encoding='utf-8')
        rt.evidence(FIXED_WORK,'file',{'path':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
            'source_sha':NEARBY_REPAIR_BASELINE},source_ref='TEST_FIXTURE/diagnostic-only',
            verification_level='local_execution',eid='E-QF01-B-OPEN-NEARBY-FINDING-20261123')
        cls.evidence=rt.evidence(FIXED_WORK,'check',{'status':'PASS','source_sha':'c'*40,
            'checks':['TEST_FIXTURE_PROTOCOL_ONLY_NOT_ACTUAL_UI_QA'],
            'fixtureKind':'TEST_FIXTURE_NO_ACTUAL_420_SAMPLES',
            'nearby_visibility':{'findingId':original['findingID'],'status':'PASS',
                'widths':[320,390,430,1440],'sampleCount':420,'unverified':0,'unexpectedCopies':0,'missingCopies':0}},
            source_ref='TEST_FIXTURE/not-real-UI-QA',verification_level='local_execution',eid='TEST_FIXTURE_D03_MEASUREMENTS')
        relative='src/components/textbook/GuidedMathReadingFlow.tsx'
        cls.file_evidence=rt.evidence(FIXED_WORK,'file',{'path':relative,'sha256':hashlib.sha256((cls.master/relative).read_bytes()).hexdigest()},
            source_ref='TEST_FIXTURE/current-bytes',eid='TEST_FIXTURE_D03_CURRENT_FILE')

    def adopt(self,**overrides):
        return InformedReviewMethodTests.adopt(self,evidence_refs=[self.evidence,self.repair_evidence],**overrides)

    def prepare(self):
        cls=type(self)
        if cls.prepared_temporary:
            return InformedReviewMethodTests.prepare(self)
        def known(out):
            if out['facet']=='render':
                out['findings'].append({'findingId':'QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123',
                    'claimRef':out['claimRef'],'facet':'render','resolution':'VERIFIED_FIXED',
                    'reexaminesEvidenceRef':'E-QF01-B-OPEN-NEARBY-FINDING-20261123',
                    'reason':'TEST_FIXTURE_PROTOCOL_ONLY_NOT_A_REAL_FIX_REVIEW','evidenceRefs':[self.evidence]})
        collection=InformedReviewMethodTests.prepare(self,mutate_output=known)
        cls.prepared_temporary=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_D03_cache_')
        shutil.copytree(self.root,Path(cls.prepared_temporary.name),dirs_exist_ok=True)
        cls.prepared_attributes={key:copy.deepcopy(getattr(self,key)) for key in
            ('authority','codes','old_open','collection','reviews','dispositions')}
        return collection

    def replace_render(self,mutate,who_index=0):
        from team import project
        p=project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
        choices=[i for i,ref in enumerate(self.collection['outputRefs']) if p['outputs'][ref]['output']['facet']=='render']
        index=choices[who_index]
        self.collection['outputRefs'][0],self.collection['outputRefs'][index]=self.collection['outputRefs'][index],self.collection['outputRefs'][0]
        self.replace_report(mutate)
        self.collection['outputRefs'][0],self.collection['outputRefs'][index]=self.collection['outputRefs'][index],self.collection['outputRefs'][0]

    def test_both_current_reports_and_bound_code_seal_without_relabeling_original_diagnostic(self):
        from team import check_collection
        self.prepare();sealed=self.seal();check_collection(self.rt,FIXED_WORK,self.node,self.result(sealed))
        self.assertFalse(sealed['semanticValidityVerified']);self.assertFalse(sealed['gateAccepted'])
        self.assertEqual(sealed['receipt']['currentSourceSHA'],'c'*40)
        self.assertNotIn('E-QF01-B-OPEN-NEARBY-FINDING-20261123',sealed['receipt']['evidenceRefs'])

    def test_each_render_reviewer_must_reexamine_known_finding(self):
        for index in (0,1):
            self.reset_fixture();self.prepare()
            self.replace_render(lambda out:out.update(findings=[f for f in out['findings'] if f['findingId']!='QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123']),index)
            with self.subTest(reviewer=index),self.assertRaisesRegex(Rejected,'D03_CURRENT_REPORT_KNOWN_FINDING_REQUIRED'):
                self.seal()

    def test_each_report_requires_current_measurement_and_current_code(self):
        for mode in ('current-file-without-measurement','missing-code','foreign-code'):
            self.reset_fixture();self.prepare()
            def mutate(out):
                if mode=='missing-code':out['codeReceiptRefs']=[]
                elif mode=='foreign-code':out['codeReceiptRefs']=['e'*64]
                else:
                    known=next(f for f in out['findings'] if f['findingId']=='QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123')
                    known['evidenceRefs']=[self.file_evidence]
                    out['evidenceRefs']=[self.file_evidence]
            self.replace_render(mutate)
            with self.subTest(mode=mode),self.assertRaisesRegex(Rejected,'D03_BOTH_REPORTS_CURRENT_FIX_EVIDENCE|D03_CURRENT_CODE_RECEIPT_LIST|D03_BOTH_REPORTS_CURRENT_CODE_REQUIRED'):
                self.seal()

    def test_measurement_counts_and_unknowns_cannot_be_coerced_to_success(self):
        from team import _check_nearby_finding_resolution,project,node_requirements
        self.prepare();s=self.rt.state(FIXED_WORK);p=project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
        rows=[]
        for ref in self.collection['outputRefs']:
            row=p['outputs'][ref];reg=p['registrations'][row['registrationRef']]
            rows.append((reg['assignment'],row['output'],reg['packet']))
        for key,value in [('sampleCount',419),('unverified',True),('unexpectedCopies',False),('missingCopies',1),('widths',[320,390,430,430])]:
            changed=copy.deepcopy(s);changed['evidence'][self.evidence]['data']['nearby_visibility'][key]=value
            with self.subTest(key=key),self.assertRaisesRegex(Rejected,'D03_CURRENT_FOUR_WIDTH_MEASUREMENTS'):
                _check_nearby_finding_resolution(self.rt,changed,self.node,p,rows,node_requirements(s['plan']['agent_team'],self.node),self.codes,[self.evidence])
        stale=copy.deepcopy(rows)
        out=next(out for _,out,_ in stale if out['facet']=='render')
        prior='E-QF01-B-OPEN-NEARBY-FINDING-20261123'
        out['evidenceRefs']=[prior]
        next(f for f in out['findings'] if f['findingId']=='QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123')['evidenceRefs']=[prior]
        with self.assertRaisesRegex(Rejected,'D03_BOTH_REPORTS_CURRENT_FIX_EVIDENCE'):
            _check_nearby_finding_resolution(self.rt,s,self.node,p,stale,node_requirements(s['plan']['agent_team'],self.node),self.codes,[self.evidence])

    def prepare_owner(self):
        from adapters import _CHECKPOINT_CORE_PATHS,_CHECKPOINT_D02_BASELINE
        from checkpoint import (RECOVERY_WORK,NEARBY_REPAIR_BASELINE,NEARBY_REPAIR_PRODUCT_PATHS,
            NEARBY_REPAIR_PROPOSAL_SHA256,NEARBY_REPAIR_ADOPTION_QUOTE,NEARBY_REPAIR_ADOPTION_CALL_ID,
            INFORMED_REVIEW_PROPOSAL_SHA256)
        baseline=Path(os.environ['QF01_CHECKPOINT_BASELINE_REPAIR_ROOT'])
        primary=self.rt.state(FIXED_WORK);repair=primary['checkpoint_definition_migration']['repairAdoption']
        protected={**primary['plan']['protected_manifest'],**primary['candidate_manifest'],**repair['beforeRepair']}
        for source in (baseline/'workflow').iterdir():
            relative='workflow/'+source.name
            if source.is_file() and source.suffix in ('.py','.md') and relative not in _CHECKPOINT_CORE_PATHS:
                target=self.root/relative;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(source.read_bytes())
                protected[relative]=hashlib.sha256(source.read_bytes()).hexdigest()
        self.assertEqual(len(protected),418)
        current={}
        for relative in _CHECKPOINT_CORE_PATHS:
            data=(ENGINE.parent/relative).read_bytes();current[relative]=data
            path=self.root/relative;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
        # Symbolic A archive only: actual Git correspondence is the explicit
        # boundary mock below, never asserted by this TEST_FIXTURE snapshot.
        symbolic=self.root/'workflow/runtime.py';symbolic.write_bytes(symbolic.read_bytes()+b'\n# TEST_FIXTURE_SYMBOLIC_A_NOT_ACTUAL_GIT_A\n')
        current_product={relative:(self.root/relative).read_bytes() for relative in NEARBY_REPAIR_PRODUCT_PATHS}
        for relative in NEARBY_REPAIR_PRODUCT_PATHS:(self.root/relative).write_bytes((baseline/relative).read_bytes())
        plan=dict(work_id=RECOVERY_WORK,profile='technical',command='GOVERNANCE',subject='math',mode='textbook',
            source_sha=_CHECKPOINT_D02_BASELINE,parent_work=FIXED_WORK,simulation=False,rules={},
            proposal={'id':'TEST_FIXTURE_ORIGINAL_1D','hash':RECOVERY_PROPOSAL_SHA256},
            source_manifest=manifest(self.root,sorted(_CHECKPOINT_CORE_PATHS)),
            scope={'paths':sorted(_CHECKPOINT_CORE_PATHS),'preserve':[]},protected_manifest=protected,
            blocks=[{'id':'TEST_FIXTURE_TECHNICAL_CORE','sources':sorted(_CHECKPOINT_CORE_PATHS)}])
        self.rt.open(plan)
        self.rt.user(RECOVERY_WORK,'approve_proposal','この限定案を採用して進める',RECOVERY_PROPOSAL_SHA256,
            'TEST_FIXTURE/call_d1c88a5dde794be288a201a5ea8de0cc')
        d2=copy.deepcopy(plan);d2['proposal']={'id':'TEST_FIXTURE_D02','hash':INFORMED_REVIEW_PROPOSAL_SHA256}
        self.rt.revise(RECOVERY_WORK,d2)
        self.rt.user(RECOVERY_WORK,'approve_proposal','限定D02案を採用して進める',INFORMED_REVIEW_PROPOSAL_SHA256,
            'request_user_input_async/call_27be7afbeef843249d088b530a5701b7')
        before_manifest={p:hashlib.sha256((baseline/p).read_bytes()).hexdigest() for p in _CHECKPOINT_CORE_PATHS}
        self.rt.append('candidate',RECOVERY_WORK,{'sha':NEARBY_REPAIR_BASELINE,'manifest':before_manifest,
            'fixtureKind':'TEST_FIXTURE_PREVIOUS_CANDIDATE_NOT_ACTUAL_GIT_OR_PATCH'})
        d3=copy.deepcopy(d2);d3['proposal']={'id':'TEST_FIXTURE_D03','hash':NEARBY_REPAIR_PROPOSAL_SHA256}
        d3['protected_manifest'].update(repair['afterRepair']);self.rt.revise(RECOVERY_WORK,d3)
        self.rt.user(RECOVERY_WORK,'approve_proposal',NEARBY_REPAIR_ADOPTION_QUOTE,NEARBY_REPAIR_PROPOSAL_SHA256,
            'request_user_input_async/'+NEARBY_REPAIR_ADOPTION_CALL_ID)
        for relative,data in current.items():(self.root/relative).write_bytes(data)
        for relative,data in current_product.items():(self.root/relative).write_bytes(data)
        self.authority=self.adopt()
        relative='src/components/textbook/GuidedMathReadingFlow.tsx'
        self.owner_verification=self.rt.evidence(RECOVERY_WORK,'file',
            {'path':relative,'sha256':hashlib.sha256((self.root/relative).read_bytes()).hexdigest()},
            source_ref='TEST_FIXTURE/owner-current-file-not-real-T04',eid='TEST_FIXTURE_D03_OWNER_FILE')
        self.owner_before=self.rt.state(RECOVERY_WORK)
        self.owner_original=plan
        self.owner_original_snapshot=self.store.source_snapshot(RECOVERY_WORK)
        self.owner_git={'schemaVersion':'qf01-informed-technical-git-proof/1','previousCandidateSHA':NEARBY_REPAIR_BASELINE,
            'retainedManifestSHA256':digest(before_manifest),'currentMaterialGitProof':{
                'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_BOUNDARY','nearbyRepair':repair}}

    def reconcile_owner(self):
        from checkpoint import RECOVERY_WORK
        with patch('adapters._checkpoint_informed_technical_git',return_value=self.owner_git):
            return self.rt.reconcile_informed_technical_owner(RECOVERY_WORK,candidate_sha='c'*40,
                verification_refs=[self.owner_verification],expected_head=self.store.head)

    def test_owner_preserves_a22_and_only_two_of_original_418_protected_hashes_change(self):
        from checkpoint import RECOVERY_WORK,NEARBY_REPAIR_PRODUCT_PATHS
        self.prepare_owner();accepted=self.reconcile_owner();after=self.rt.state(RECOVERY_WORK)
        self.assertFalse(accepted['proof']['writesExecuted']);self.assertFalse(accepted['proof']['oldResultsTransferred'])
        self.assertEqual(after['plan']['source_manifest'],self.owner_original['source_manifest'])
        self.assertEqual(after['plan']['rules'],self.owner_original['rules']);self.assertEqual(after['plan']['scope'],self.owner_original['scope'])
        original=self.owner_original['protected_manifest'];current=after['plan']['protected_manifest']
        self.assertEqual(len(current),418);self.assertEqual(set(current),set(original))
        self.assertEqual({p for p in original if original[p]!=current[p]},set(NEARBY_REPAIR_PRODUCT_PATHS))
        self.assertEqual(after['users'],self.owner_before['users'])
        self.assertEqual(self.store.source_snapshot(RECOVERY_WORK),self.owner_original_snapshot)

    def test_third_protected_path_change_refuses_owner_reconciliation(self):
        from checkpoint import RECOVERY_WORK,NEARBY_REPAIR_PRODUCT_PATHS
        self.prepare_owner();state=self.rt.state(RECOVERY_WORK);changed=copy.deepcopy(state['plan'])
        third=next(p for p in changed['protected_manifest'] if p not in NEARBY_REPAIR_PRODUCT_PATHS)
        changed['protected_manifest'][third]='e'*64
        before_head=self.store.head;before_rows=self.store._tail.events()
        before_raw={p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()}
        self.rt.append('revised',RECOVERY_WORK,{'plan':changed,'fixtureKind':'TEST_FIXTURE_ATTACK_NOT_APPROVED_REVISION'})
        corrupted_rows=self.store._tail.events()
        corrupted_raw={p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()}
        self.assertEqual(len(corrupted_rows),len(before_rows)+1)
        self.assertEqual(len(corrupted_raw),len(before_raw)+1)
        self.assertEqual(corrupted_rows[-1]['previous'],before_head)
        self.assertEqual(corrupted_rows[-1]['payload']['plan'],changed)
        self.assertEqual({name:corrupted_raw[name] for name in before_raw},before_raw)
        with self.assertRaisesRegex(CheckpointRejected,'D04_OWNER_REVISION_SAME_ADOPTION_REQUIRED'):
            _=self.store.head
        with self.assertRaisesRegex(CheckpointRejected,'D04_OWNER_REVISION_SAME_ADOPTION_REQUIRED'):
            self.reconcile_owner()
        self.assertEqual({p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()},corrupted_raw)
        self.assertEqual(self.store._tail.head,corrupted_rows[-1]['hash'])


class MathRenderingReviewMethodTests(unittest.TestCase):
    """Synthetic transport/measurement protocol, never actual image approval."""
    reset_fixture=InformedReviewMethodTests.reset_fixture
    setUp=InformedReviewMethodTests.setUp
    replace_report=InformedReviewMethodTests.replace_report
    replace_render=NearbyReviewMethodTests.replace_render
    seal=InformedReviewMethodTests.seal
    result=InformedReviewMethodTests.result
    tearDownClass=classmethod(InformedReviewMethodTests.tearDownClass.__func__)

    @classmethod
    def setUpClass(cls):
        import checkpoint as cp
        cls.temporary=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_D04_review_master_')
        cls.master=Path(cls.temporary.name).resolve();cls.prepared_temporary=None
        fixture=populate_math_rendering_fixture(cls.master);rt=fixture['rt'];cls.fixture=fixture
        boundary=patch.multiple('checkpoint',**fixture['boundary']);boundary.start();cls.addClassCleanup(boundary.stop)
        with patch('checkpoint.verify_candidate_git',return_value=None),patch('adapters._checkpoint_git_proof',
                return_value={'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_ONLY'}):
            proof=rt.checkpoint_preflight(FIXED_WORK,candidate_sha='d'*40,
                informed_adoption_ref=fixture['d2'],repair_adoption_ref=fixture['d3'],math_rendering_adoption_ref=fixture['d4'])
            rt.migrate_checkpoint_definition(FIXED_WORK,proof=proof,expected_head=proof['ledgerHead'])
        cls.repair_evidence=fixture['d3'];cls.math_evidence=fixture['d4']
        originals=[('TEST_FIXTURE_B_DIAGNOSTIC.json','E-QF01-B-OPEN-NEARBY-FINDING-20261123',{
            'schemaVersion':'qf01-current-b-confirmed-local-open-finding/1','findingID':'QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123',
            'sourceSHA':cp.NEARBY_REPAIR_BASELINE,'status':'OPEN_CONFIRMED_LOCAL_EVIDENCE','productRepairApplied':False}),
            ('TEST_FIXTURE_C_DIAGNOSTIC.json','E-QF01-C-OPEN-PROSE-MATH-FINDING-20261123',{
            'schemaVersion':'qf01-current-c-open-prose-math-finding/1','findingId':'QF01-C-PROSE-MATH-SPAN-20261123',
            'sourceSHA':cp.MATH_RENDERING_REPAIR_BASELINE,'status':'OPEN_CONFIRMED_CURRENT_C',
            'newProductRepairApplied':False,'blocksMaterialR04PASS':True})]
        for name,eid,value in originals:
            value['fixtureKind']='TEST_FIXTURE_DIAGNOSTIC_NOT_ACTUAL_PRIVATE_REPORT'
            path=cls.master/name;path.write_text(json.dumps(value)+'\n',encoding='utf8');h=hashlib.sha256(path.read_bytes()).hexdigest()
            rt.evidence(FIXED_WORK,'file',{'path':name,'sha256':h,'source_sha':value['sourceSHA']},
                source_ref='TEST_FIXTURE/original-diagnostic-boundary',verification_level='local_execution',eid=eid)
            if 'C_DIAGNOSTIC' in name:
                diagnostic=patch('team.MATH_PROSE_ORIGINAL_C_DIAGNOSTIC_SHA256',h);diagnostic.start();cls.addClassCleanup(diagnostic.stop)
        cls.evidence=rt.evidence(FIXED_WORK,'check',{'status':'PASS','source_sha':'d'*40,
            'checks':['TEST_FIXTURE_PROTOCOL_ONLY_NOT_ACTUAL_420_MEASUREMENTS'],
            'nearby_visibility':{'findingId':'QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123','status':'PASS',
                'widths':[320,390,430,1440],'sampleCount':420,'unverified':0,'unexpectedCopies':0,'missingCopies':0},
            'math_prose_rendering':{'findingId':'QF01-C-PROSE-MATH-SPAN-20261123','status':'PASS',
                'widths':[320,390,430,1440],'sampleCount':420,'unverified':0,'missingMathUnits':0,
                'unexpectedMathUnits':0,'splitMathUnits':0,'unitErrors':0,'sourceMismatch':0,
                'visualLineSampleCount':420,'visualLineUnverified':0}},
            source_ref='TEST_FIXTURE/not-actual-D-UI-QA',verification_level='local_execution',eid='TEST_FIXTURE_D04_MEASUREMENTS')
        relative='src/components/textbook/GuidedMathReadingFlow.tsx'
        cls.file_evidence=rt.evidence(FIXED_WORK,'file',{'path':relative,'sha256':hashlib.sha256((cls.master/relative).read_bytes()).hexdigest()},
            source_ref='TEST_FIXTURE/current-file',eid='TEST_FIXTURE_D04_CURRENT_FILE')

    def adopt(self,**overrides):
        return InformedReviewMethodTests.adopt(self,evidence_refs=[self.evidence,self.repair_evidence,self.math_evidence],**overrides)

    def prepare(self):
        cls=type(self)
        if cls.prepared_temporary:return InformedReviewMethodTests.prepare(self)
        def known(out):
            if out['facet']=='render':
                for finding,evidence in [('QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123','E-QF01-B-OPEN-NEARBY-FINDING-20261123'),
                    ('QF01-C-PROSE-MATH-SPAN-20261123','E-QF01-C-OPEN-PROSE-MATH-FINDING-20261123')]:
                    out['findings'].append({'findingId':finding,'claimRef':out['claimRef'],'facet':'render',
                        'resolution':'VERIFIED_FIXED','reexaminesEvidenceRef':evidence,
                        'reason':'TEST_FIXTURE_PROTOCOL_ONLY_NOT_A_REAL_FIX_REVIEW','evidenceRefs':[self.evidence]})
        collection=InformedReviewMethodTests.prepare(self,mutate_output=known)
        cls.prepared_temporary=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_D04_cache_')
        shutil.copytree(self.root,Path(cls.prepared_temporary.name),dirs_exist_ok=True)
        cls.prepared_attributes={key:copy.deepcopy(getattr(self,key)) for key in
            ('authority','codes','old_open','collection','reviews','dispositions')}
        return collection

    def guard_args(self):
        from team import project,node_requirements
        self.prepare();s=self.rt.state(FIXED_WORK);p=project(history_events(self.rt,'team',FIXED_WORK),FIXED_WORK)
        rows=[]
        for ref in self.collection['outputRefs']:
            row=p['outputs'][ref];reg=p['registrations'][row['registrationRef']]
            rows.append((reg['assignment'],row['output'],reg['packet']))
        return s,p,rows,node_requirements(s['plan']['agent_team'],self.node)

    def test_both_current_reports_current_code_and_both_measurements_seal(self):
        from team import check_collection
        self.prepare();sealed=self.seal();check_collection(self.rt,FIXED_WORK,self.node,self.result(sealed))
        self.assertFalse(sealed['semanticValidityVerified']);self.assertFalse(sealed['gateAccepted'])
        self.assertEqual(sealed['receipt']['currentSourceSHA'],'d'*40)

    def test_each_render_report_must_reexamine_original_c_f06(self):
        for index in (0,1):
            self.reset_fixture();self.prepare()
            self.replace_render(lambda out:out.update(findings=[f for f in out['findings'] if f['findingId']!='QF01-C-PROSE-MATH-SPAN-20261123']),index)
            with self.subTest(reviewer=index),self.assertRaisesRegex(Rejected,'D04_CURRENT_REPORT_KNOWN_FINDING_REQUIRED'):self.seal()

    def test_d04_keeps_original_b_nearby_report_requirement(self):
        self.prepare()
        self.replace_render(lambda out:out.update(findings=[f for f in out['findings'] if f['findingId']!='QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123']))
        with self.assertRaisesRegex(Rejected,'D03_CURRENT_REPORT_KNOWN_FINDING_REQUIRED'):self.seal()

    def test_math_measurement_bool_negative_missing_split_and_widths_are_rejected(self):
        from team import _check_math_prose_finding_resolution
        s,p,rows,required=self.guard_args()
        for key,value in [('unverified',True),('missingMathUnits',False),('unexpectedMathUnits',0.0),
            ('unitErrors',-1),('splitMathUnits',1),('sourceMismatch',1),('sampleCount',419),('widths',[320,390,430,430])]:
            changed=copy.deepcopy(s);changed['evidence'][self.evidence]['data']['math_prose_rendering'][key]=value
            with self.subTest(key=key),self.assertRaisesRegex(Rejected,'D04_CURRENT_FOUR_WIDTH_MATH_MEASUREMENTS'):
                _check_math_prose_finding_resolution(self.rt,changed,self.node,p,rows,required,self.codes,[self.evidence])

    def test_missing_math_measurement_cannot_borrow_nearby_pass(self):
        from team import _check_math_prose_finding_resolution
        s,p,rows,required=self.guard_args();s['evidence'][self.evidence]['data'].pop('math_prose_rendering')
        with self.assertRaisesRegex(Rejected,'D04_ACTUAL_MATH_UI_MEASUREMENTS_REQUIRED'):
            _check_math_prose_finding_resolution(self.rt,s,self.node,p,rows,required,self.codes,[self.evidence])

    def test_dom_only_math_measurement_cannot_replace_complete_visual_line_coverage(self):
        from team import _check_math_prose_finding_resolution
        s,p,rows,required=self.guard_args()
        cases=[{}, {'visualLineSampleCount':420}, {'visualLineUnverified':0},
            {'visualLineSampleCount':419,'visualLineUnverified':0},
            {'visualLineSampleCount':421,'visualLineUnverified':0},
            {'visualLineSampleCount':True,'visualLineUnverified':0},
            {'visualLineSampleCount':420.0,'visualLineUnverified':0},
            {'visualLineSampleCount':420,'visualLineUnverified':True},
            {'visualLineSampleCount':420,'visualLineUnverified':False},
            {'visualLineSampleCount':420,'visualLineUnverified':0.0},
            {'visualLineSampleCount':420,'visualLineUnverified':1},
            {'visualLineSampleCount':420,'visualLineUnverified':-1}]
        for values in cases:
            changed=copy.deepcopy(s);measurement=changed['evidence'][self.evidence]['data']['math_prose_rendering']
            measurement.pop('visualLineSampleCount');measurement.pop('visualLineUnverified');measurement.update(values)
            with self.subTest(values=values),self.assertRaisesRegex(Rejected,'D04_CURRENT_VISUAL_LINE_COVERAGE'):
                _check_math_prose_finding_resolution(self.rt,changed,self.node,p,rows,required,self.codes,[self.evidence])

    def test_f06_current_file_without_actual_measurement_is_rejected(self):
        self.prepare()
        def mutate(out):
            f=next(f for f in out['findings'] if f['findingId']=='QF01-C-PROSE-MATH-SPAN-20261123')
            f['evidenceRefs']=[self.file_evidence];out['evidenceRefs'].append(self.file_evidence)
        self.replace_render(mutate)
        with self.assertRaisesRegex(Rejected,'D04_BOTH_REPORTS_CURRENT_FIX_EVIDENCE'):self.seal()

    def test_rehashed_old_c_diagnostic_cannot_be_replaced_with_current_d(self):
        from team import _check_math_prose_finding_resolution
        s,p,rows,required=self.guard_args();prior='E-QF01-C-OPEN-PROSE-MATH-FINDING-20261123'
        path=self.root/s['evidence'][prior]['data']['path'];value=json.loads(path.read_bytes());value['sourceSHA']='d'*40
        path.write_text(json.dumps(value)+'\n',encoding='utf8');s['evidence'][prior]['data']['sha256']=hashlib.sha256(path.read_bytes()).hexdigest()
        with self.assertRaisesRegex(Rejected,'D04_ORIGINAL_C_DIAGNOSTIC_CHANGED'):
            _check_math_prose_finding_resolution(self.rt,s,self.node,p,rows,required,self.codes,[self.evidence])


class MathRenderingOwnerTests(unittest.TestCase):
    """Actual fixture owner lineage, symbolic historical Git identity only."""
    setUp=InformedReviewMethodTests.setUp
    reset_fixture=InformedReviewMethodTests.reset_fixture
    tearDownClass=classmethod(InformedReviewMethodTests.tearDownClass.__func__)

    @classmethod
    def setUpClass(cls):
        import checkpoint as cp
        cls.temporary=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_D04_owner_master_')
        cls.master=Path(cls.temporary.name).resolve();cls.prepared_temporary=None
        cls.fixture=populate_math_rendering_fixture(cls.master);rt=cls.fixture['rt']
        boundary=patch.multiple('checkpoint',**cls.fixture['boundary']);boundary.start();cls.addClassCleanup(boundary.stop)
        baseline=Path(os.environ.get('QF01_CHECKPOINT_MATH_BASELINE_ROOT',str(WORKSPACE/'qf01-nearby-core')))
        for p in cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS:(cls.master/p).write_bytes((baseline/p).read_bytes())
        cls.evidence=rt.evidence(FIXED_WORK,'check',{'status':'PASS','source_sha':cp.MATH_RENDERING_REPAIR_BASELINE,
            'checks':['TEST_FIXTURE_OWNER_PROTOCOL_NOT_QA']},source_ref='TEST_FIXTURE/C-only-not-QA',eid='TEST_FIXTURE_D04_OWNER_C_CHECK')
        cls.repair_evidence=cls.fixture['d3'];cls.math_evidence=cls.fixture['d4']
        cls.core_c=cls.fixture['proof']['core']

    def adopt(self,**overrides):
        return InformedReviewMethodTests.adopt(self,evidence_refs=[self.evidence,self.repair_evidence,self.math_evidence],**overrides)

    def prepare_owner(self):
        import checkpoint as cp
        from definitions import DEFINITION_HASH,instantiate
        # The previous C executor is an explicit historical boundary. The
        # temporary ledger and its candidate/protected hashes remain real.
        with patch('checkpoint.current_core_identity',return_value=self.core_c), \
                patch('runtime.DEFINITION_HASH',self.core_c['definitionHash']):
            NearbyReviewMethodTests.prepare_owner(self)
            owner=self.rt.state(cp.RECOVERY_WORK)
            self.rt.append('definition_migrated',cp.RECOVERY_WORK,{'from':owner['definition_hash'],
                'to':self.core_c['definitionHash'],'fixtureKind':'TEST_FIXTURE_HISTORICAL_EXECUTOR_BOUNDARY'})
            with patch('adapters._checkpoint_informed_technical_git',return_value=self.owner_git):
                self.rt.reconcile_informed_technical_owner(cp.RECOVERY_WORK,candidate_sha=cp.MATH_RENDERING_REPAIR_BASELINE,
                    verification_refs=[self.owner_verification],expected_head=self.store.head)
        self.owner_c=self.rt.state(cp.RECOVERY_WORK)
        renderer=self.root/cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS[0]
        renderer.write_bytes(renderer.read_bytes()+b'\n// TEST_FIXTURE_D04_OWNER_NOT_ACTUAL_PRODUCT_FIX\n')
        with patch('checkpoint.verify_candidate_git',return_value=None),patch('adapters._checkpoint_git_proof',
                return_value={'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_NOT_ACTUAL_D'}):
            proof=self.rt.checkpoint_preflight(FIXED_WORK,candidate_sha='d'*40,
                informed_adoption_ref=self.fixture['d2'],repair_adoption_ref=self.fixture['d3'],math_rendering_adoption_ref=self.fixture['d4'])
            self.rt.migrate_checkpoint_definition(FIXED_WORK,proof=proof,expected_head=proof['ledgerHead'])
        self.math_repair=proof['mathRenderingRepair']
        state=self.rt.state(cp.RECOVERY_WORK)
        self.rt.append('definition_migrated',cp.RECOVERY_WORK,{'from':state['definition_hash'],'to':DEFINITION_HASH,
            'fixtureKind':'TEST_FIXTURE_CURRENT_DEFINITION_PROTOCOL'})
        plan=copy.deepcopy(self.rt.state(cp.RECOVERY_WORK)['plan'])
        plan['proposal']={'id':'TEST_FIXTURE_D04','hash':cp.MATH_RENDERING_REPAIR_PROPOSAL_SHA256,
            'currentMaterialSourceSHA':'d'*40}
        plan['protected_manifest'].update(self.math_repair['afterRepair']);self.rt.revise(cp.RECOVERY_WORK,plan)
        self.rt.user(cp.RECOVERY_WORK,'approve_proposal',cp.MATH_RENDERING_REPAIR_ADOPTION_QUOTE,
            cp.MATH_RENDERING_REPAIR_PROPOSAL_SHA256,'request_user_input_async/'+cp.MATH_RENDERING_REPAIR_ADOPTION_CALL_ID)
        self.authority=self.adopt()
        self.owner_verification=self.rt.evidence(cp.RECOVERY_WORK,'file',{'path':cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS[0],
            'sha256':hashlib.sha256(renderer.read_bytes()).hexdigest()},source_ref='TEST_FIXTURE/current-D-file-not-T04',eid='TEST_FIXTURE_D04_OWNER_FILE')
        self.owner_before=self.rt.state(cp.RECOVERY_WORK);self.t01=instantiate(self.owner_before['plan'])['T01_ANALYSIS']
        self.before_input=self.rt.input_hash(self.owner_before,self.t01)
        artifact=self.store.put({'verdict':'PASS','fixtureKind':'TEST_FIXTURE_RESULT_NOT_ACTUAL_ANALYSIS'})
        self.rt.append('result',cp.RECOVERY_WORK,{'node':'T01_ANALYSIS','input_hash':self.before_input,'artifact':artifact,'verdict':'PASS'})
        self.owner_git={'schemaVersion':'qf01-informed-technical-git-proof/1',
            'previousCandidateSHA':cp.MATH_RENDERING_REPAIR_BASELINE,
            'retainedManifestSHA256':digest(self.owner_c['candidate_manifest']),
            'currentMaterialGitProof':{'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_ONLY',
                'nearbyRepair':proof['repairAdoption'],'mathRenderingRepair':self.math_repair}}

    def reconcile(self):
        from checkpoint import RECOVERY_WORK
        with patch('adapters._checkpoint_informed_technical_git',return_value=self.owner_git):
            return self.rt.reconcile_informed_technical_owner(RECOVERY_WORK,candidate_sha='d'*40,
                verification_refs=[self.owner_verification],expected_head=self.store.head)

    def test_actual_previous_c_owner_preserves_a22_users_418_and_invalidates_t01(self):
        from checkpoint import RECOVERY_WORK,MATH_RENDERING_REPAIR_PRODUCT_PATHS
        self.prepare_owner();before=self.rt.state(RECOVERY_WORK);result=self.reconcile();after=self.rt.state(RECOVERY_WORK)
        self.assertFalse(result['proof']['writesExecuted']);self.assertFalse(result['proof']['oldResultsTransferred'])
        self.assertEqual(result['proof']['previousCandidateSHA'],self.owner_c['candidate_sha'])
        self.assertEqual(result['proof']['previousCandidateManifestSHA256'],digest(self.owner_c['candidate_manifest']))
        self.assertEqual(after['plan']['source_manifest'],self.owner_original['source_manifest'])
        self.assertEqual(after['plan']['rules'],self.owner_original['rules']);self.assertEqual(after['plan']['scope'],self.owner_original['scope'])
        original=self.owner_original['protected_manifest'];current=after['plan']['protected_manifest']
        self.assertEqual(len(current),418);self.assertEqual(set(current),set(original))
        self.assertEqual({p for p in original if original[p]!=current[p]},set(MATH_RENDERING_REPAIR_PRODUCT_PATHS))
        self.assertEqual(after['users'],before['users']);self.assertEqual(after['results'],before['results'])
        self.assertEqual(self.store.source_snapshot(RECOVERY_WORK),self.owner_original_snapshot)
        self.assertNotEqual(self.rt.input_hash(after,self.t01),self.before_input)
        self.assertNotEqual(self.rt.node_status(after,self.t01),'PASSED')

    def test_r06_current_proof_binds_d04_owner_authority_and_compile_without_repatch(self):
        from checkpoint import RECOVERY_WORK,MATH_RENDERING_REPAIR_PROPOSAL_SHA256
        from definitions import instantiate
        from capabilities import implementation_hash
        from adapters import reconcile_checkpoint_candidate,validate_checkpoint_candidate_proof
        self.prepare_owner();self.reconcile()
        # Results below only exercise the current-input causal protocol. They
        # are TEST_FIXTURE data, never actual AI decisions or CODE execution.
        def current_result(work,node_id,done):
            if node_id in done:return
            state=self.rt.state(work);nodes=instantiate(state['plan'])
            for dependency in nodes[node_id]['depends_on']:current_result(work,dependency,done)
            state=self.rt.state(work)
            body={'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_GATE_RESULT','node':node_id,'verdict':'PASS'}
            if work==RECOVERY_WORK and node_id=='T02_APPROVAL':body['user_event']=self.rt.approval(state)['id']
            reference=self.store.put(body)
            self.rt.append('result',work,{'node':node_id,'artifact':reference,'verdict':'PASS',
                'input_hash':self.rt.input_hash(state,nodes[node_id]),'actor':'TEST_FIXTURE_ONLY'})
            done.add(node_id)
        done=set()
        for stage in ('S00_RECOVER','S01_ROUTE','T01_ANALYSIS','T02_APPROVAL','T03_BUILD','T04_VERIFY'):
            current_result(RECOVERY_WORK,stage,done)
        owner=self.rt.state(RECOVERY_WORK)
        owner_refs={stage:owner['results'][stage]['artifact'] for stage in ('T01_ANALYSIS','T02_APPROVAL','T03_BUILD','T04_VERIFY')}
        node_id='R06_PATCH@qf01-full-lesson';nodes=instantiate(self.rt.state(FIXED_WORK)['plan']);done=set()
        for dependency in nodes[node_id]['depends_on']:current_result(FIXED_WORK,dependency,done)
        state=self.rt.state(FIXED_WORK);node=nodes[node_id];input_hash=self.rt.input_hash(state,node)
        token='TEST_FIXTURE_D04_R06_TOKEN'
        self.rt.append('claimed',FIXED_WORK,{'node':node_id,'actor':'TEST_FIXTURE_ONLY',
            'input_hash':input_hash,'task_id':digest('TEST_FIXTURE_D04_R06_TASK'),'token':token,
            'expires_at':time.time()+3600},event_id='TEST_FIXTURE_D04_R06_CLAIM')
        origin=self.store.state_base(FIXED_WORK)
        compiled=self.store.get(origin['version_transition']['derivation']['compiledResultRef'])
        receipt={'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_COMPILE','capability':'construction.compile',
            'node':node_id,'phase':node['phase'],'status':'PASS','input_hash':input_hash,
            'implementation_hash':implementation_hash(self.rt),'cache_key':digest(['TEST_FIXTURE_D04_R06',input_hash]),
            'output':digest(compiled)}
        reference=self.store.put(receipt)
        self.rt.append('capability_result',FIXED_WORK,{'capability':'construction.compile',
            'cache_key':receipt['cache_key'],'output':receipt['output']})
        self.rt.append('capability_bound',FIXED_WORK,{'node':node_id,'receipt':reference,'input_hash':input_hash})
        verification=self.rt.evidence(FIXED_WORK,'check',{'status':'PASS','source_sha':'d'*40,
            'checks':['TEST_FIXTURE_PROTOCOL_NOT_ACTUAL_COMPILE_OR_QA']},source_ref='TEST_FIXTURE/R06-only',eid='TEST_FIXTURE_D04_R06_CHECK')
        args={'owner_result_refs':owner_refs,'compile_receipt_ref':reference,'verification_refs':[verification],
            'expected_head':self.store.head}
        git={'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_ONLY','nearbyRepair':self.fixture['proof']['repairAdoption'],
            'mathRenderingRepair':self.math_repair}
        before=[e for e in self.store.suffix_events() if e['kind'].startswith('patch_')]
        with patch('adapters._checkpoint_git_proof',return_value=git),patch('adapters._checkpoint_current_compile',return_value=compiled):
            accepted=reconcile_checkpoint_candidate(self.rt,FIXED_WORK,node_id,token,**args)
            proof=validate_checkpoint_candidate_proof(self.rt,FIXED_WORK,node_id,accepted['proofRef'],compile_receipt_refs=[reference])
            self.assertEqual(proof['ownerProposalSHA256'],MATH_RENDERING_REPAIR_PROPOSAL_SHA256)
            self.assertEqual(proof['reviewMethodAuthorityRef'],self.authority['authorityRef'])
            self.assertEqual(proof['gitProof']['mathRenderingRepair'],self.math_repair)
            self.assertEqual(proof['gitProof']['nearbyRepair'],self.fixture['proof']['repairAdoption'])
            self.assertFalse(proof['semanticAcceptance']);self.assertFalse(proof['patchExecutedAgain'])
            with self.assertRaisesRegex(Rejected,'CHECKPOINT_RESULT_COMPILE_RECEIPT_MISMATCH'):
                validate_checkpoint_candidate_proof(self.rt,FIXED_WORK,node_id,accepted['proofRef'],compile_receipt_refs=['0'*64])
        self.assertEqual([e for e in self.store.suffix_events() if e['kind'].startswith('patch_')],before)

    def test_third_protected_hash_cannot_enter_current_d04_owner(self):
        from checkpoint import RECOVERY_WORK,MATH_RENDERING_REPAIR_PRODUCT_PATHS
        self.prepare_owner();plan=copy.deepcopy(self.rt.state(RECOVERY_WORK)['plan'])
        third=next(p for p in plan['protected_manifest'] if p not in MATH_RENDERING_REPAIR_PRODUCT_PATHS)
        plan['protected_manifest'][third]='0'*64
        before_head=self.store.head;before_rows=self.store._tail.events()
        before_raw={p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()}
        self.rt.append('revised',RECOVERY_WORK,{'plan':plan,'fixtureKind':'TEST_FIXTURE_UNAPPROVED_PROTECTION_ATTACK'})
        corrupted_rows=self.store._tail.events()
        corrupted_raw={p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()}
        self.assertEqual(len(corrupted_rows),len(before_rows)+1)
        self.assertEqual(len(corrupted_raw),len(before_raw)+1)
        self.assertEqual(corrupted_rows[-1]['previous'],before_head)
        self.assertEqual(corrupted_rows[-1]['payload']['plan'],plan)
        self.assertEqual({name:corrupted_raw[name] for name in before_raw},before_raw)
        with self.assertRaisesRegex(CheckpointRejected,'D04_OWNER_REVISION_LAST_ACTUAL_OWNER_PROOF'):
            _=self.store.head
        with self.assertRaisesRegex(CheckpointRejected,'D04_OWNER_REVISION_LAST_ACTUAL_OWNER_PROOF'):self.reconcile()
        self.assertEqual({p.name:p.read_bytes() for p in (self.store.root/'events').iterdir()},corrupted_raw)
        self.assertEqual(self.store._tail.head,corrupted_rows[-1]['hash'])


def math_owner_revision_fixture():
    """Pure TEST_FIXTURE states, not actual native history or user records."""
    import checkpoint as cp
    original={'work_id':cp.RECOVERY_WORK,'profile':'technical','command':'GOVERNANCE',
        'subject':'math','mode':'textbook','source_sha':'abe5ff1385cb141bb2d01e34f6512eb50e9ca9da',
        'parent_work':FIXED_WORK,'rules':{},'proposal':{'id':'TEST_FIXTURE_1D','hash':RECOVERY_PROPOSAL_SHA256},
        'source_manifest':{'workflow/TEST_FIXTURE_CORE_'+str(i)+'.py':'1'*64 for i in range(22)},
        'scope':{'paths':['workflow/TEST_FIXTURE_CORE_'+str(i)+'.py' for i in range(22)],'preserve':[]},
        'blocks':[{'id':'TEST_FIXTURE_CORE','sources':['workflow/TEST_FIXTURE_CORE_0.py']}],
        'protected_manifest':{**{p:cp.CURRENT_REPAIR_AFTER[p] for p in cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS},
            **{'TEST_FIXTURE/protected/'+str(i):'b'*64 for i in range(416)}}}
    first=MathRenderingRecordTests().record();first['definitionHash']='1'*64;first['implementationHash']='2'*64
    second=copy.deepcopy(first);second.update(candidateBeforeSHA=first['candidateAfterSHA'],candidateAfterSHA='e'*40,
        definitionHash='3'*64,implementationHash='4'*64,afterRepair={p:'e'*64 for p in first['afterRepair']})
    third=copy.deepcopy(second);third.update(candidateBeforeSHA=second['candidateAfterSHA'],candidateAfterSHA='a'*40,
        definitionHash='5'*64,implementationHash='6'*64)
    before=copy.deepcopy(original);before['proposal']={'id':'TEST_FIXTURE_D04','hash':cp.MATH_RENDERING_REPAIR_PROPOSAL_SHA256,
        'currentMaterialSourceSHA':first['candidateAfterSHA'],'materialBinding':{'originSourceSHA':'1f10ecbcd088ca8636932c8df4c7b85293777efc'}}
    before['protected_manifest'].update(first['afterRepair'])
    candidate={p:'d'*64 for p in original['source_manifest']}
    proof={'schemaVersion':'qf01-informed-technical-candidate-proof/1','work':cp.RECOVERY_WORK,'parentWork':FIXED_WORK,
        'proposalSHA256':cp.MATH_RENDERING_REPAIR_PROPOSAL_SHA256,'checkpointEpoch':first['checkpointEpoch'],
        'planSHA256':digest(before),'originalSourceSHA':original['source_sha'],
        'sourceManifestSHA256':digest(original['source_manifest']),'candidateSHA':first['candidateAfterSHA'],
        'candidateManifest':candidate,'core':{'definitionHash':first['definitionHash']},
        'implementationHash':first['implementationHash'],'gitProof':{'currentMaterialGitProof':{'mathRenderingRepair':first}},
        'writesExecuted':False,'oldResultsTransferred':False,'fixtureKind':'TEST_FIXTURE_PURE_NOT_REAL_OWNER_PROOF'}
    owner={'plan':before,'candidate_sha':first['candidateAfterSHA'],'candidate_manifest':candidate,
        'definition_hash':first['definitionHash'],'claims':{},'paused':False,'patches':{},'external':{},
        'informed_technical_candidate_reconciliation':{'proofRef':digest(proof),'proof':proof}}
    primary={'plan':{'work_id':FIXED_WORK},'candidate_sha':third['candidateAfterSHA'],
        'candidate_manifest':{**cp.CURRENT_REPAIR_AFTER,**third['afterRepair']},'definition_hash':third['definitionHash'],
        'checkpoint_definition_migration':{'mathRenderingRepair':third},'claims':{},'paused':False,'patches':{},'external':{}}
    body={'schemaVersion':'qf01-informed-rereview-authority/1','proposalSHA256':cp.INFORMED_REVIEW_PROPOSAL_SHA256,
        'work':FIXED_WORK,'checkpointEpoch':third['checkpointEpoch'],'currentSourceSHA':primary['candidate_sha'],
        'candidateManifestSHA256':digest(primary['candidate_manifest']),'definitionHash':third['definitionHash'],
        'core':{'definitionHash':third['definitionHash']},'implementationHash':third['implementationHash'],
        'evidenceRefs':[third['evidenceRef']],'independent':False,'sourceFirst':False,'firstPass':False,
        'fixtureKind':'TEST_FIXTURE_PURE_NOT_REAL_AUTHORITY'}
    primary['informed_review_method']={'authorityRef':digest(body),'authority':body}
    after=copy.deepcopy(before);after['proposal']['currentMaterialSourceSHA']=primary['candidate_sha']
    after['protected_manifest'].update(third['afterRepair'])
    return {'owner':owner,'primary':primary,'new_plan':after,'original_plan':original,
        'math_records':[first,second,third],'epoch':third['checkpointEpoch']}


class MathRenderingOwnerRevisionRecordTests(unittest.TestCase):
    def validate(self,f):
        from checkpoint import validate_math_rendering_owner_revision
        return validate_math_rendering_owner_revision(f['owner'],f['primary'],f['new_plan'],
            original_plan=f['original_plan'],math_records=f['math_records'],epoch=f['epoch'])

    def test_lagging_d1_owner_rebinds_to_d3_without_requiring_d2_or_current_owner_definition(self):
        f=math_owner_revision_fixture();before=copy.deepcopy(f)
        self.assertNotEqual(f['owner']['candidate_sha'],f['math_records'][-1]['candidateBeforeSHA'])
        self.assertNotEqual(f['owner']['definition_hash'],f['primary']['definition_hash'])
        self.assertEqual(self.validate(f),f['new_plan']);self.assertEqual(f,before)

    def test_core_only_source_followup_keeps_the_same_two_product_hashes(self):
        f=math_owner_revision_fixture();previous=f['math_records'][1];owner=f['owner'];before=owner['plan']
        before['proposal']['currentMaterialSourceSHA']=owner['candidate_sha']=previous['candidateAfterSHA']
        before['protected_manifest'].update(previous['afterRepair']);proof=owner['informed_technical_candidate_reconciliation']['proof']
        proof.update(candidateSHA=owner['candidate_sha'],planSHA256=digest(before),core={'definitionHash':previous['definitionHash']},
            implementationHash=previous['implementationHash'])
        proof['gitProof']['currentMaterialGitProof']['mathRenderingRepair']=previous
        owner['informed_technical_candidate_reconciliation']['proofRef']=digest(proof)
        self.assertEqual(before['protected_manifest'],f['new_plan']['protected_manifest'])
        self.assertEqual(self.validate(f),f['new_plan'])

    def test_same_adoption_cannot_change_any_other_plan_or_proposal_metadata(self):
        mutations=[lambda p:p['blocks'].append({'id':'TEST_FIXTURE_UNADOPTED','sources':[]}),
            lambda p:p.update(parent_work='TEST_FIXTURE_OTHER_PARENT'),lambda p:p.update(agent_team={}),
            lambda p:p.update(source_extension={}),lambda p:p['scope']['paths'].append('workflow/EXTRA.py'),
            lambda p:p['rules'].update({'TEST_FIXTURE/new-rule':'0'*64}),
            lambda p:p['source_manifest'].update({'workflow/EXTRA.py':'0'*64}),
            lambda p:p['proposal'].update(id='TEST_FIXTURE_NEW_MEANING'),
            lambda p:p['proposal']['materialBinding'].update(originSourceSHA='0'*40)]
        for mutate in mutations:
            f=math_owner_revision_fixture();mutate(f['new_plan'])
            with self.subTest(mutation=mutations.index(mutate)),self.assertRaises(CheckpointRejected):self.validate(f)

    def test_418_keys_and_other416_hashes_cannot_change_or_be_dropped(self):
        for mode in ('third','extra','missing','old-product','wrong-current-product'):
            f=math_owner_revision_fixture();p=f['new_plan']['protected_manifest'];product=next(iter(f['math_records'][0]['afterRepair']))
            if mode=='third':p['TEST_FIXTURE/protected/0']='0'*64
            elif mode=='extra':p['TEST_FIXTURE/extra']='0'*64
            elif mode=='missing':p.pop('TEST_FIXTURE/protected/0')
            elif mode=='old-product':p[product]=f['math_records'][0]['afterRepair'][product]
            else:p[product]='0'*64
            with self.subTest(mode=mode),self.assertRaises(CheckpointRejected):self.validate(f)

    def test_rehashed_last_proof_cannot_substitute_plan_manifest_source_or_old_math(self):
        for field in ('planSHA256','candidateManifest','candidateSHA','core','implementationHash','math'):
            f=math_owner_revision_fixture();wrapper=f['owner']['informed_technical_candidate_reconciliation'];proof=wrapper['proof']
            if field=='math':proof['gitProof']['currentMaterialGitProof']['mathRenderingRepair']=f['math_records'][1]
            elif field=='candidateManifest':proof[field]={'workflow/TEST_FIXTURE_CHANGED.py':'0'*64}
            elif field=='core':proof[field]={'definitionHash':'0'*64}
            else:proof[field]='0'*(40 if field=='candidateSHA' else 64)
            wrapper['proofRef']=digest(proof)
            with self.subTest(field=field),self.assertRaises(CheckpointRejected):self.validate(f)

    def test_missing_reordered_or_changed_adoption_history_and_stale_authority_are_rejected(self):
        for mode in ('missing-old','missing-middle','reordered','adoption','source','revoked','no-method','same-source'):
            f=math_owner_revision_fixture()
            if mode=='missing-old':f['math_records'].pop(0)
            elif mode=='missing-middle':f['math_records'].pop(1)
            elif mode=='reordered':f['math_records'][0],f['math_records'][1]=f['math_records'][1],f['math_records'][0]
            elif mode=='adoption':f['math_records'][-1]['transcriptionSHA256']='0'*64
            elif mode=='source':f['new_plan']['proposal']['currentMaterialSourceSHA']=f['math_records'][1]['candidateAfterSHA']
            elif mode=='revoked':f['primary']['informed_review_method']['revoked']=True
            elif mode=='no-method':f['primary']['informed_review_method']=None
            else:f['new_plan']['proposal']['currentMaterialSourceSHA']=f['owner']['candidate_sha']
            with self.subTest(mode=mode),self.assertRaises(CheckpointRejected):self.validate(f)

    def test_both_work_states_require_no_claim_pause_unfinished_patch_or_external(self):
        for state in ('owner','primary'):
            for key,value in [('claims',{'TEST_FIXTURE_CLAIM':{}}),('paused',True),
                ('patches',{'TEST_FIXTURE_PATCH':{'completed':False}}),('external',{'TEST_FIXTURE_OP':{'outcome':None}})]:
                f=math_owner_revision_fixture();f[state][key]=value
                with self.subTest(state=state,key=key),self.assertRaisesRegex(CheckpointRejected,'OPERATION_UNCERTAIN'):self.validate(f)

    def test_general_d02_d03_and_other_work_same_hash_rule_stays_closed(self):
        from types import SimpleNamespace
        from checkpoint import INFORMED_REVIEW_PROPOSAL_SHA256,NEARBY_REPAIR_PROPOSAL_SHA256,PUBLISHER_WORK
        for checkpoint,work,proposal in [(False,'TEST_FIXTURE_NORMAL', '0'*64),
            (True,'W-TECH-QF01-CHECKPOINT-RECOVERY-20261122',INFORMED_REVIEW_PROPOSAL_SHA256),
            (True,'W-TECH-QF01-CHECKPOINT-RECOVERY-20261122',NEARBY_REPAIR_PROPOSAL_SHA256),
            (True,PUBLISHER_WORK,'09a4c45c229d1b18190541a1441ee18d2b9d5d07dc62020b684b64b033d6fd85')]:
            f=math_owner_revision_fixture();p=f['owner']['plan'];p['work_id']=work;p['proposal']['hash']=proposal
            rt=Runtime.__new__(Runtime);rt.store=SimpleNamespace(checkpoint_mode=checkpoint)
            rt.state=lambda _: {'plan':p}
            rt.append=lambda *a,**k:self.fail('Forbidden same-hash revision appended')
            with self.subTest(checkpoint=checkpoint,work=work,proposal=proposal),self.assertRaisesRegex(Rejected,'意味の変更には新しい提案版が必要'):
                rt.revise(work,copy.deepcopy(p))


class MathRenderingOwnerRevisionRuntimeTests(unittest.TestCase):
    """Real temp suffix/CAS; historical executor identities and Git are boundaries."""
    setUp=InformedReviewMethodTests.setUp
    reset_fixture=InformedReviewMethodTests.reset_fixture
    adopt=MathRenderingOwnerTests.adopt
    prepare_owner=MathRenderingOwnerTests.prepare_owner
    tearDownClass=classmethod(InformedReviewMethodTests.tearDownClass.__func__)

    @classmethod
    def setUpClass(cls):
        import checkpoint as cp
        from definitions import IMPLEMENTATION_FILES
        baseline=Path(os.environ['QF01_CHECKPOINT_MATH_BASELINE_ROOT'])
        files={n:hashlib.sha256((baseline/'workflow'/n).read_bytes()).hexdigest() for n in IMPLEMENTATION_FILES}
        # Public D1 source hashes only, not its native ledger/adoption payload.
        files.update({'checkpoint.py':'d8e29756fbfe647f68f29f7c4b5511930a78cbd060300768ef3c6dfe10a070c1',
            'runtime.py':'7e0aedf9a145833cffec551595eb5f1733cbe9753be15e6bcb126b5a34d94bc2',
            'adapters.py':'080b81bc2c00fd4fde864263a47311e225464622bd57cef38f64afb9633744bc',
            'team.py':'b04d2c0ca618675342664e8ed722e126743820806b90352d391a02e8858d0f62'})
        cls.d1_core={'definitionHash':'ed94ec9e79ccd0c6e13f3d878fb1458d4dfe88402b5dcfae31fcf9e30d45b9de','files':files}
        with patch('definitions.DEFINITION_HASH',cls.d1_core['definitionHash']), \
                patch('checkpoint.current_core_identity',return_value=cls.d1_core):
            MathRenderingOwnerTests.setUpClass.__func__(cls)
        cls.continuation_cache=None

    def prepare_continuation(self):
        import checkpoint as cp
        cls=type(self)
        if cls.continuation_cache is not None:
            temp=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_owner_revision_case_');self.addCleanup(temp.cleanup)
            self.root=Path(temp.name).resolve();shutil.copytree(Path(cls.continuation_cache.name),self.root,dirs_exist_ok=True)
            self.store=CheckpointStore(self.root/'work/recovery-checkpoints/qf01-p046-r3');self.rt=Runtime(self.store.root,self.root)
            for key,value in cls.continuation_attributes.items():setattr(self,key,copy.deepcopy(value))
            return
        with patch('checkpoint.current_core_identity',return_value=self.d1_core), \
                patch('runtime.DEFINITION_HASH',self.d1_core['definitionHash']), \
                patch('definitions.DEFINITION_HASH',self.d1_core['definitionHash']):
            self.prepare_owner();self.last_d1_proof=self.reconcile()
        self.old_owner=self.rt.state(cp.RECOVERY_WORK)
        renderer=self.root/cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS[0]
        renderer.write_bytes(renderer.read_bytes()+b'\n// TEST_FIXTURE_D2_DISPLAY_REPAIR_NOT_ACTUAL_CODE\n')
        future=cp.current_core_identity();intermediate={**future,'definitionHash':'e'*64}
        def migrate(candidate):
            with patch('checkpoint.verify_candidate_git',return_value=None),patch('adapters._checkpoint_git_proof',
                    return_value={'fixtureKind':'TEST_FIXTURE_HISTORICAL_EXECUTOR_AND_EXTERNAL_GIT_ONLY'}):
                proof=self.rt.checkpoint_preflight(FIXED_WORK,candidate_sha=candidate,
                    informed_adoption_ref=self.fixture['d2'],repair_adoption_ref=self.fixture['d3'],math_rendering_adoption_ref=self.fixture['d4'])
                self.rt.migrate_checkpoint_definition(FIXED_WORK,proof=proof,expected_head=proof['ledgerHead'])
            return proof
        # D2 is an explicit historical executor boundary. D3 is the real
        # current test executor; the owner remains at the earlier D1 definition.
        with patch('checkpoint.current_core_identity',return_value=intermediate):migrate('e'*40)
        proof=migrate('f'*40);self.current_math=proof['mathRenderingRepair'];self.authority=self.adopt()
        self.new_plan=copy.deepcopy(self.old_owner['plan'])
        self.new_plan['proposal']['currentMaterialSourceSHA']='f'*40
        self.new_plan['protected_manifest'].update(self.current_math['afterRepair'])
        self.owner_verification=self.rt.evidence(cp.RECOVERY_WORK,'file',{'path':cp.MATH_RENDERING_REPAIR_PRODUCT_PATHS[0],
            'sha256':hashlib.sha256(renderer.read_bytes()).hexdigest()},source_ref='TEST_FIXTURE_D3/current-file-not-QA',eid='TEST_FIXTURE_D3_OWNER_FILE')
        self.owner_git={'schemaVersion':'qf01-informed-technical-git-proof/1','previousCandidateSHA':'d'*40,
            'retainedManifestSHA256':digest(self.old_owner['candidate_manifest']),
            'currentMaterialGitProof':{'fixtureKind':'TEST_FIXTURE_EXTERNAL_GIT_NOT_ACTUAL_D3',
                'nearbyRepair':proof['repairAdoption'],'mathRenderingRepair':self.current_math}}
        cls.continuation_cache=tempfile.TemporaryDirectory(prefix='qf01_TEST_FIXTURE_D02_owner_revision_cache_')
        cls.addClassCleanup(cls.continuation_cache.cleanup)
        shutil.copytree(self.root,Path(cls.continuation_cache.name),dirs_exist_ok=True)
        cls.continuation_attributes={key:copy.deepcopy(getattr(self,key)) for key in
            ('old_owner','new_plan','current_math','authority','owner_verification','owner_git','last_d1_proof',
             'owner_original','owner_original_snapshot')}

    def revise_current(self):
        from checkpoint import RECOVERY_WORK
        with patch('adapters._checkpoint_git_proof',return_value={'fixtureKind':'TEST_FIXTURE_CURRENT_GIT_ONLY'}):
            return self.rt.revise(RECOVERY_WORK,self.new_plan)

    def reconcile(self):
        from checkpoint import RECOVERY_WORK
        candidate=self.rt.state(FIXED_WORK)['candidate_sha']
        with patch('adapters._checkpoint_informed_technical_git',return_value=self.owner_git):
            return self.rt.reconcile_informed_technical_owner(RECOVERY_WORK,candidate_sha=candidate,
                verification_refs=[self.owner_verification],expected_head=self.store.head)

    def test_actual_d1_owner_catches_d3_without_new_user_then_definition_migration_and_reconciliation(self):
        import checkpoint as cp
        from definitions import DEFINITION_HASH
        self.prepare_continuation();owner=self.rt.state(cp.RECOVERY_WORK);users=copy.deepcopy(owner['users'])
        self.assertEqual(owner['candidate_sha'],'d'*40);self.assertEqual(self.current_math['candidateBeforeSHA'],'e'*40)
        self.assertNotEqual(owner['definition_hash'],self.rt.state(FIXED_WORK)['definition_hash'])
        self.revise_current();revised=self.rt.state(cp.RECOVERY_WORK)
        self.assertEqual(revised['plan'],self.new_plan);self.assertEqual(revised['candidate_sha'],'d'*40)
        self.assertEqual(revised['users'],users);self.assertEqual(revised['results'],owner['results'])
        self.assertEqual(self.store.source_snapshot(cp.RECOVERY_WORK),self.owner_original_snapshot)
        self.rt.migrate_definition(cp.RECOVERY_WORK,from_hash=revised['definition_hash'],evidence_refs=[self.owner_verification])
        accepted=self.reconcile();final=self.rt.state(cp.RECOVERY_WORK)
        self.assertEqual(final['candidate_sha'],'f'*40);self.assertEqual(final['definition_hash'],DEFINITION_HASH)
        self.assertEqual(final['users'],users);self.assertEqual(final['plan']['source_manifest'],owner['plan']['source_manifest'])
        self.assertEqual(accepted['proof']['previousCandidateSHA'],'d'*40)
        self.assertEqual(accepted['proof']['planSHA256'],digest(self.new_plan))
        self.assertFalse(accepted['proof']['writesExecuted']);self.assertFalse(accepted['proof']['oldResultsTransferred'])

    def test_current_git_failure_or_concurrent_head_cannot_append_the_revision(self):
        from checkpoint import RECOVERY_WORK
        self.prepare_continuation();before=self.store.head;plan=copy.deepcopy(self.rt.state(RECOVERY_WORK)['plan'])
        with patch('adapters._checkpoint_git_proof',side_effect=Rejected('TEST_FIXTURE_GIT_REJECTED')):
            with self.assertRaisesRegex(Rejected,'TEST_FIXTURE_GIT_REJECTED'):self.rt.revise(RECOVERY_WORK,self.new_plan)
        self.assertEqual(self.store.head,before);self.assertEqual(self.rt.state(RECOVERY_WORK)['plan'],plan)
        def concurrent(*args,**kwargs):
            self.rt.append('TEST_FIXTURE_CONCURRENT_EVENT',FIXED_WORK,{'fixtureKind':'TEST_FIXTURE_CAS_RACE_ONLY'})
            return {'fixtureKind':'TEST_FIXTURE_CURRENT_GIT_ONLY'}
        with patch('adapters._checkpoint_git_proof',side_effect=concurrent):
            with self.assertRaisesRegex(Rejected,'D04_OWNER_REVISION_HEAD_CHANGED'):self.rt.revise(RECOVERY_WORK,self.new_plan)
        self.assertEqual(self.rt.state(RECOVERY_WORK)['plan'],plan)
        self.assertEqual(self.store.suffix_events()[-1]['kind'],'TEST_FIXTURE_CONCURRENT_EVENT')

    def test_typed_suffix_rejects_same_hash_semantic_change_and_self_completed_intents(self):
        from checkpoint import RECOVERY_WORK
        for mode in ('meaning','patch-true','patch-false','external-success','external-null'):
            self.prepare_continuation()
            if mode=='meaning':
                plan=copy.deepcopy(self.new_plan);plan['proposal']['id']='TEST_FIXTURE_UNADOPTED_NEW_MEANING'
                self.rt.append('revised',RECOVERY_WORK,{'plan':plan})
                expected='D04_OWNER_REVISION_ONLY_SOURCE_AND_TWO_PROTECTIONS'
            elif mode.startswith('patch'):
                self.rt.append('patch_intent',RECOVERY_WORK,{'node':'T03_BUILD','patch_hash':'0'*64,
                    'backup':'0'*64,'before':{},'completed':mode=='patch-true'})
                expected='CHECKPOINT_PATCH_INTENT_SELF_COMPLETION'
            else:
                self.rt.append('external_intent',FIXED_WORK,{'id':'TEST_FIXTURE_EXTERNAL','operation':'MERGE',
                    'request_hash':'0'*64,'release_unit':None,'outcome':'SUCCESS' if mode.endswith('success') else None})
                expected='CHECKPOINT_EXTERNAL_INTENT_SELF_OUTCOME'
            raw_count=len(self.store._tail.events())
            with self.subTest(mode=mode),self.assertRaisesRegex(CheckpointRejected,expected):
                self.rt.revise(RECOVERY_WORK,self.new_plan)
            # Read only the raw synthetic suffix to confirm the guarded API did
            # not add a subsequent revision after the explicit corruption.
            self.assertEqual(len(self.store._tail.events()),raw_count)


class MixedInlineRecordTests(unittest.TestCase):
    """TEST_FIXTURE-only D05 protocol; no actual new source/approval/measurements."""
    def record(self):
        import checkpoint as cp
        return {'schemaVersion':'qf01-mixed-inline-surfaces-supplement/1',
            'proposalSHA256':cp.MIXED_INLINE_REPAIR_PROPOSAL_SHA256,'inventorySHA256':cp.MIXED_INLINE_REPAIR_INVENTORY_SHA256,
            'evidenceRef':'TEST_FIXTURE_D05','transcriptionSHA256':'a'*64,'quote':cp.MIXED_INLINE_REPAIR_ADOPTION_QUOTE,
            'source_ref':'request_user_input_async/'+cp.MIXED_INLINE_REPAIR_ADOPTION_CALL_ID,
            'verification_level':'conversation_transcribed','baselineSourceSHA':cp.MIXED_INLINE_REPAIR_BASELINE,
            'candidateBeforeSHA':cp.MIXED_INLINE_REPAIR_BASELINE,'candidateBeforeManifestSHA256':'b'*64,
            'candidateAfterSHA':'e'*40,'allowedProductPaths':list(cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS),
            'beforeRepair':copy.deepcopy(cp.MIXED_INLINE_REPAIR_BEFORE),
            'afterRepair':{p:'e'*64 for p in cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS},
            'originalD04MigrationEventHash':cp.MIXED_INLINE_REPAIR_D04_EVENT_HASH,
            'originalD04SupplementSHA256':cp.MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256,
            'definitionHash':'d'*64,'implementationHash':'e'*64,'checkpointEpoch':'f'*64}

    def test_exact_20_fields_preserve_d04_and_are_detached(self):
        import checkpoint as cp
        record=self.record();before=copy.deepcopy(record);out=cp.validate_mixed_inline_repair_record(record)
        self.assertEqual(len(record),20);self.assertEqual(out,record)
        out['afterRepair'].clear();self.assertEqual(record,before)
        self.assertEqual(cp.MIXED_INLINE_REPAIR_BEFORE,before['beforeRepair'])
        self.assertEqual(cp.MATH_RENDERING_REPAIR_BASELINE,'900642faf76267546c5c7420b7d50a010516ca6e')

    def test_unknown_fields_wrong_adoption_inventory_epoch_and_retaged_history_are_rejected(self):
        from checkpoint import validate_mixed_inline_repair_record
        for key,value in [('schemaVersion','qf01-math-prose-rendering-supplement/1'),('proposalSHA256','0'*64),
            ('inventorySHA256','0'*64),('quote','TEST_FIXTURE_CONTINUE_ONLY'),('source_ref','TEST_FIXTURE/other'),
            ('verification_level','local_execution'),('baselineSourceSHA','c'*40),('originalD04MigrationEventHash','0'*64),
            ('originalD04SupplementSHA256','0'*64),('beforeRepair',{}),('candidateBeforeManifestSHA256',True),
            ('candidateAfterSHA',True),('evidenceRef','x'*129),('afterRepair',{}),('unadopted',True)]:
            record=self.record();record[key]=value
            with self.subTest(key=key),self.assertRaises(CheckpointRejected):validate_mixed_inline_repair_record(record)
        with self.assertRaisesRegex(CheckpointRejected,'D05_REPAIR_EPOCH'):
            validate_mixed_inline_repair_record(self.record(),epoch='0'*64)

    def test_continuation_requires_actual_previous_and_immutable_adoption_and_no_rollback(self):
        from checkpoint import validate_mixed_inline_repair_continuation
        first=self.record();second=copy.deepcopy(first)
        second.update(candidateBeforeSHA=first['candidateAfterSHA'],candidateAfterSHA='f'*40)
        self.assertEqual(validate_mixed_inline_repair_continuation(first,second),second)
        for key,value in [('candidateBeforeSHA','a'*40),('evidenceRef','TEST_FIXTURE_OTHER'),('checkpointEpoch','a'*64),
            ('transcriptionSHA256','b'*64)]:
            changed=copy.deepcopy(second);changed[key]=value
            with self.subTest(key=key),self.assertRaises(CheckpointRejected):validate_mixed_inline_repair_continuation(first,changed)
        changed=copy.deepcopy(second);changed['afterRepair']={p:'a'*64 for p in first['afterRepair']}
        with self.assertRaisesRegex(CheckpointRejected,'D05_OLD_AFTERIMAGE_ROLLBACK'):
            validate_mixed_inline_repair_continuation(first,changed,earlier_after=[changed['afterRepair']])

    def test_d05_document_cannot_enter_normal_or_prior_scope(self):
        from checkpoint import MIXED_INLINE_REPAIR_PROPOSAL_PATH
        from adapters import _checkpoint_scope_diff
        for kwargs in ({},{'nearby_repair':True},{'nearby_repair':True,'math_rendering_repair':True},
            {'mixed_inline_repair':True}):
            with self.subTest(kwargs=kwargs),self.assertRaises(Rejected):_checkpoint_scope_diff({MIXED_INLINE_REPAIR_PROPOSAL_PATH},**kwargs)
        self.assertEqual(_checkpoint_scope_diff({MIXED_INLINE_REPAIR_PROPOSAL_PATH},nearby_repair=True,
            math_rendering_repair=True,mixed_inline_repair=True),[MIXED_INLINE_REPAIR_PROPOSAL_PATH])

    def test_first_or_later_d05_cannot_restore_known_b_c_or_d04_afterimage(self):
        from checkpoint import mixed_inline_earlier_after,validate_mixed_inline_repair_continuation
        seed=mixed_inline_earlier_after([MathRenderingRecordTests().record()])
        for previous in (None,self.record()):
            for image in seed:
                current=self.record();current['afterRepair']=copy.deepcopy(image)
                if previous is not None:current.update(candidateBeforeSHA=previous['candidateAfterSHA'],candidateAfterSHA='f'*40)
                with self.subTest(previous=previous is not None,image=image),self.assertRaisesRegex(CheckpointRejected,'D05_OLD_AFTERIMAGE_ROLLBACK'):
                    validate_mixed_inline_repair_continuation(previous,current,earlier_after=seed)


def mixed_owner_revision_fixture():
    """Pure TEST_FIXTURE; only private predecessor digest is a mocked boundary."""
    import checkpoint as cp
    f=math_owner_revision_fixture();historical=copy.deepcopy(f['math_records'][-1])
    historical.update(candidateAfterSHA=cp.MIXED_INLINE_REPAIR_BASELINE,afterRepair=copy.deepcopy(cp.MIXED_INLINE_REPAIR_BEFORE))
    records=[]
    for i,source in enumerate(f['math_records']):
        row=MixedInlineRecordTests().record()
        row.update(originalD04SupplementSHA256=digest(historical),candidateBeforeSHA=cp.MIXED_INLINE_REPAIR_BASELINE if i==0 else records[-1]['candidateAfterSHA'],
            candidateAfterSHA=source['candidateAfterSHA'],definitionHash=source['definitionHash'],implementationHash=source['implementationHash'],
            afterRepair={p:('7' if i==0 else '8')*64 for p in source['afterRepair']})
        records.append(row)
    before=f['owner']['plan'];before['proposal']['hash']=cp.MIXED_INLINE_REPAIR_PROPOSAL_SHA256
    before['proposal']['currentMaterialSourceSHA']=records[0]['candidateAfterSHA'];before['protected_manifest'].update(records[0]['afterRepair'])
    proof=f['owner']['informed_technical_candidate_reconciliation']['proof']
    proof.update(proposalSHA256=cp.MIXED_INLINE_REPAIR_PROPOSAL_SHA256,planSHA256=digest(before),
        candidateSHA=records[0]['candidateAfterSHA'],core={'definitionHash':records[0]['definitionHash']},
        implementationHash=records[0]['implementationHash'],gitProof={'currentMaterialGitProof':{
            'mathRenderingRepair':historical,'mixedInlineRepair':records[0]}})
    f['owner'].update(candidate_sha=records[0]['candidateAfterSHA'],definition_hash=records[0]['definitionHash'],
        informed_technical_candidate_reconciliation={'proofRef':digest(proof),'proof':proof})
    current=records[-1];primary=f['primary']
    primary.update(candidate_sha=current['candidateAfterSHA'],definition_hash=current['definitionHash'],
        candidate_manifest={**cp.CURRENT_REPAIR_AFTER,**current['afterRepair']},
        checkpoint_definition_migration={'mathRenderingRepair':historical,'mixedInlineRepair':current})
    body=primary['informed_review_method']['authority']
    body.update(currentSourceSHA=primary['candidate_sha'],candidateManifestSHA256=digest(primary['candidate_manifest']),
        definitionHash=current['definitionHash'],core={'definitionHash':current['definitionHash']},
        implementationHash=current['implementationHash'],evidenceRefs=[current['evidenceRef']])
    primary['informed_review_method']={'authorityRef':digest(body),'authority':body}
    after=copy.deepcopy(before);after['proposal']['currentMaterialSourceSHA']=current['candidateAfterSHA'];after['protected_manifest'].update(current['afterRepair'])
    f.update(new_plan=after,math_records=[historical],mixed_records=records,historicalDigest=digest(historical))
    return f


class MixedInlineOwnerRevisionTests(unittest.TestCase):
    def validate(self,f):
        from checkpoint import validate_math_rendering_owner_revision
        with patch('checkpoint.MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256',f['historicalDigest']):
            return validate_math_rendering_owner_revision(f['owner'],f['primary'],f['new_plan'],
                original_plan=f['original_plan'],math_records=f['math_records'],mixed_records=f['mixed_records'],epoch=f['epoch'])

    def test_lagging_d05_owner_catches_core_only_followup_without_new_adoption_or_source_rewrite(self):
        f=mixed_owner_revision_fixture();before=copy.deepcopy(f)
        self.assertEqual(self.validate(f),f['new_plan']);self.assertEqual(f,before)
        self.assertNotEqual(f['owner']['definition_hash'],f['primary']['definition_hash'])
        self.assertEqual(f['mixed_records'][1]['afterRepair'],f['mixed_records'][2]['afterRepair'])

    def test_same_adoption_cannot_change_meaning_or_other_proposal_metadata(self):
        for field in ('rules','scope','source_sha','agent_team','source_extension','parent_work'):
            f=mixed_owner_revision_fixture();f['new_plan'][field]={'TEST_FIXTURE_UNADOPTED':True}
            with self.subTest(field=field),self.assertRaises(CheckpointRejected):self.validate(f)
        f=mixed_owner_revision_fixture();f['new_plan']['proposal']['unadopted']=True
        with self.assertRaises(CheckpointRejected):self.validate(f)

    def test_only_two_of_418_protected_hashes_may_change(self):
        for mode in ('third','drop','add','wrong-two'):
            f=mixed_owner_revision_fixture();p=f['new_plan']['protected_manifest']
            if mode=='third':p['TEST_FIXTURE/protected/0']='0'*64
            elif mode=='drop':p.pop('TEST_FIXTURE/protected/0')
            elif mode=='add':p['TEST_FIXTURE/extra']='0'*64
            else:p[next(iter(f['mixed_records'][0]['afterRepair']))]='0'*64
            with self.subTest(mode=mode),self.assertRaises(CheckpointRejected):self.validate(f)

    def test_rehashed_old_owner_proof_cannot_substitute_current_or_historical_source(self):
        for mode in ('plan','source','manifest','mixed','math'):
            f=mixed_owner_revision_fixture();w=f['owner']['informed_technical_candidate_reconciliation'];p=w['proof']
            if mode=='plan':p['planSHA256']='0'*64
            elif mode=='source':p['candidateSHA']='0'*40
            elif mode=='manifest':p['candidateManifest']={}
            elif mode=='mixed':p['gitProof']['currentMaterialGitProof']['mixedInlineRepair']=f['mixed_records'][1]
            else:p['gitProof']['currentMaterialGitProof']['mathRenderingRepair']={}
            w['proofRef']=digest(p)
            with self.subTest(mode=mode),self.assertRaises(CheckpointRejected):self.validate(f)

    def test_actual_history_current_authority_and_both_operation_states_are_required(self):
        for mode in ('missing-math','duplicate-math','missing-mixed','revoked','claims','patch','external'):
            f=mixed_owner_revision_fixture()
            if mode=='missing-math':f['math_records']=[]
            elif mode=='duplicate-math':f['math_records']*=2
            elif mode=='missing-mixed':f['mixed_records']=f['mixed_records'][1:]
            elif mode=='revoked':f['primary']['informed_review_method']['revoked']=True
            elif mode=='claims':f['primary']['claims']={'TEST_FIXTURE':{}}
            elif mode=='patch':f['owner']['patches']={'TEST_FIXTURE':{'completed':False}}
            else:f['owner']['external']={'TEST_FIXTURE':{'outcome':None}}
            with self.subTest(mode=mode),self.assertRaises(CheckpointRejected):self.validate(f)


class MixedInlineMeasurementTests(unittest.TestCase):
    def measurements(self):
        from team import MIXED_INLINE_FINDING_IDS,MIXED_INLINE_ZERO_COUNTERS
        from checkpoint import MIXED_INLINE_REPAIR_INVENTORY_SHA256
        return {'schemaVersion':'qf01-mixed-inline-surfaces-measurements/1','status':'PASS',
            'inventorySHA256':MIXED_INLINE_REPAIR_INVENTORY_SHA256,'findingIds':list(MIXED_INLINE_FINDING_IDS),
            'widths':[320,390,430,1440],'groups':{key:{'sampleCount':count,'visualLineSampleCount':count,
                'measurementCount':1,**{k:0 for k in MIXED_INLINE_ZERO_COUNTERS}} for key,count in
                (('main',420),('help',280),('secondHint',140))},
            'sourceCoverage':{key:{'expected':count,'observed':count,'unverified':0} for key,count in (('marker',23),('choice',24))}}

    def test_three_operation_groups_and_47_source_coverage_are_separate(self):
        from team import validate_mixed_inline_measurements
        m=self.measurements();self.assertEqual(validate_mixed_inline_measurements(m),m)
        m['widths'].reverse();self.assertEqual(validate_mixed_inline_measurements(m),m)

    def test_each_group_missing_bool_negative_or_partial_measurement_is_rejected(self):
        from team import validate_mixed_inline_measurements,MIXED_INLINE_ZERO_COUNTERS
        for group in ('main','help','secondHint'):
            for key in (*MIXED_INLINE_ZERO_COUNTERS,'sampleCount','visualLineSampleCount','measurementCount'):
                for invalid in (None,False,-1):
                    m=self.measurements();m['groups'][group][key]=invalid
                    with self.subTest(group=group,key=key,invalid=invalid),self.assertRaises(Rejected):validate_mixed_inline_measurements(m)
            m=self.measurements();m['groups'].pop(group)
            with self.assertRaises(Rejected):validate_mixed_inline_measurements(m)
        m=self.measurements();m['groups']['main']['measurementCount']=2**53
        with self.assertRaises(Rejected):validate_mixed_inline_measurements(m)

    def test_extra_or_missing_visible_sources_and_finding_identity_are_not_coerced_to_zero(self):
        from team import validate_mixed_inline_measurements
        for key in ('marker','choice'):
            for value in (0,True,999):
                m=self.measurements();m['sourceCoverage'][key]['observed']=value
                with self.subTest(key=key,value=value),self.assertRaises(Rejected):validate_mixed_inline_measurements(m)
        for key,value in [('findingIds',[]),('inventorySHA256','0'*64),('widths',[320,390,430,True])]:
            m=self.measurements();m[key]=value
            with self.assertRaises(Rejected):validate_mixed_inline_measurements(m)


class MixedInlineFindingTests(unittest.TestCase):
    """Isolated finding guard, not real reports, CODE execution or acceptance.

    Real temp file hashes and current measurement/finding fields are checked.
    Existing native D02/D04 suites separately exercise the transport/seal.
    """
    def setUp(self):
        from types import SimpleNamespace
        import checkpoint as cp
        from team import MIXED_INLINE_FINDING_IDS
        temporary=tempfile.TemporaryDirectory(prefix='TEST_FIXTURE_D05_finding_');self.addCleanup(temporary.cleanup)
        root=Path(temporary.name).resolve();self.findings=list(MIXED_INLINE_FINDING_IDS)
        original={'schemaVersion':'qf01-d3-open-other-inline-surfaces/1','status':'OPEN_CONFIRMED_CURRENT_D3',
            'sourceSHA':cp.MIXED_INLINE_REPAIR_BASELINE,'findingIds':self.findings,'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_PRIVATE_DIAGNOSTIC'}
        path=root/'TEST_FIXTURE_D3_DIAGNOSTIC.json';path.write_text(json.dumps(original)+'\n',encoding='utf8')
        original_sha=hashlib.sha256(path.read_bytes()).hexdigest()
        self.prior='E-QF01-D3-OPEN-OTHER-INLINE-SURFACES-20261123';self.measured='TEST_FIXTURE_CURRENT_MEASURED'
        self.state={'candidate_sha':'e'*40,'evidence':{
            self.prior:{'kind':'file','verification_level':'local_execution','data':{
                'path':path.name,'sha256':original_sha,'source_sha':cp.MIXED_INLINE_REPAIR_BASELINE}},
            self.measured:{'kind':'check','verification_level':'local_execution','data':{
                'status':'PASS','source_sha':'e'*40,'mixed_inline_rendering':MixedInlineMeasurementTests().measurements()}}}}
        self.rt=SimpleNamespace(root=root,store=SimpleNamespace(get=lambda ref:{'artifactRefs':['TEST_FIXTURE_CODE']}))
        self.required=[{'claimRef':'TEST_FIXTURE_RENDER','facet':'render','reviewKind':'layout'}]
        self.reviews=[]
        for ref in cp.INFORMED_REVIEWERS:
            assignment={'performerRef':ref,'targetManifestRef':'TEST_FIXTURE_CURRENT_TARGET'}
            out={**self.required[0],'evidenceRefs':[self.measured],'codeReceiptRefs':['TEST_FIXTURE_CODE'],
                'findings':[{'findingId':finding,**self.required[0],'resolution':'VERIFIED_FIXED',
                    'reexaminesEvidenceRef':self.prior,'reason':'TEST_FIXTURE_PROTOCOL_ONLY_NOT_ACTUAL_REVIEW',
                    'evidenceRefs':[self.measured]} for finding in self.findings]}
            self.reviews.append((assignment,out,{}))
        boundary=patch('team.MIXED_INLINE_ORIGINAL_D3_DIAGNOSTIC_SHA256',original_sha);boundary.start();self.addCleanup(boundary.stop)
        context=patch('checkpoint.current_product_repair_context',return_value={'mixedInlineRepair':{'fixtureKind':'TEST_FIXTURE'}})
        context.start();self.addCleanup(context.stop)

    def check(self):
        from team import _check_mixed_inline_finding_resolution
        return _check_mixed_inline_finding_resolution(self.rt,self.state,{},None,self.reviews,self.required,
            ['TEST_FIXTURE_CODE'],[self.measured])

    def test_all_three_findings_require_both_current_reports_real_file_and_distinct_measurements(self):
        self.assertIsNone(self.check())

    def test_each_reviewer_cannot_omit_or_misattribute_any_prior_finding(self):
        original=copy.deepcopy(self.reviews)
        for reviewer in range(2):
            for i in range(3):
                for mode in ('omit','old-ref','open','no-current-evidence'):
                    self.reviews=copy.deepcopy(original);findings=self.reviews[reviewer][1]['findings']
                    if mode=='omit':findings.pop(i)
                    elif mode=='old-ref':findings[i]['reexaminesEvidenceRef']='TEST_FIXTURE_OTHER'
                    elif mode=='open':findings[i]['resolution']='OPEN'
                    else:findings[i]['evidenceRefs']=[]
                    with self.subTest(reviewer=reviewer,finding=i,mode=mode),self.assertRaises(Rejected):self.check()

    def test_each_report_needs_current_code_and_420_280_140_groups_cannot_borrow_old_d04_counts(self):
        original=copy.deepcopy(self.reviews)
        for reviewer in range(2):
            self.reviews=copy.deepcopy(original);self.reviews[reviewer][1]['codeReceiptRefs']=[]
            with self.subTest(reviewer=reviewer),self.assertRaises(Rejected):self.check()
        self.reviews=original
        measurement=self.state['evidence'][self.measured]['data']['mixed_inline_rendering']
        measurement['groups']['secondHint']['sampleCount']=0
        with self.assertRaisesRegex(Rejected,'D05_CURRENT_VISIBLE_MIXED_MEASUREMENTS:secondHint'):self.check()

    def test_old_source_measurement_or_changed_original_file_is_not_current_fix_evidence(self):
        self.state['evidence'][self.measured]['data']['source_sha']='d'*40
        with self.assertRaisesRegex(Rejected,'D05_ACTUAL_MIXED_UI_MEASUREMENTS_REQUIRED'):self.check()
        self.state['evidence'][self.measured]['data']['source_sha']='e'*40
        path=self.rt.root/self.state['evidence'][self.prior]['data']['path'];path.write_bytes(path.read_bytes()+b' ')
        with self.assertRaisesRegex(Rejected,'D05_ORIGINAL_D3_DIAGNOSTIC_CHANGED'):self.check()


class InlineLayoutRecordTests(unittest.TestCase):
    """D06 TEST_FIXTURE records do not establish a real adoption or source."""
    def mixed(self):
        import checkpoint as cp
        mixed=MixedInlineRecordTests().record();mixed['transcriptionSHA256']=cp.INLINE_LAYOUT_ORIGINAL_D05_ADOPTION_SHA256
        return mixed

    def record(self,mixed=None):
        import checkpoint as cp
        mixed=self.mixed() if mixed is None else mixed
        return {'schemaVersion':'qf01-mixed-inline-layout-supplement/1','proposalSHA256':cp.INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,
            'evidenceRef':'TEST_FIXTURE_D06','transcriptionSHA256':'6'*64,'quote':cp.INLINE_LAYOUT_REPAIR_ADOPTION_QUOTE,
            'source_ref':'request_user_input_async/'+cp.INLINE_LAYOUT_REPAIR_ADOPTION_CALL_ID,'verification_level':'conversation_transcribed',
            'mixedInlineRepairSHA256':digest(mixed),'checkpointEpoch':mixed['checkpointEpoch'],
            'allowedProductPaths':list(cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS)}

    def test_exact10_alias_preserves_d05_exact20_and_same_current(self):
        import checkpoint as cp
        mixed=self.mixed();record=self.record(mixed);before=copy.deepcopy((record,mixed))
        self.assertEqual(len(record),10);self.assertEqual(len(mixed),20)
        self.assertEqual(cp.validate_inline_layout_repair_record(record,mixed=mixed),record)
        self.assertEqual((record,mixed),before)

    def test_unknown_fields_wrong_adoption_epoch_alias_and_unapproved_d05_raw_are_rejected(self):
        import checkpoint as cp
        for key,value in [('proposalSHA256','0'*64),('quote','TEST_FIXTURE_OTHER'),('source_ref','TEST_FIXTURE/other'),
            ('verification_level','local_execution'),('mixedInlineRepairSHA256','0'*64),('checkpointEpoch','0'*64),
            ('allowedProductPaths',[]),('evidenceRef','x'*129),('unadopted',True)]:
            mixed=self.mixed();record=self.record(mixed);record[key]=value
            with self.subTest(key=key),self.assertRaises(CheckpointRejected):cp.validate_inline_layout_repair_record(record,mixed=mixed)
        mixed=self.mixed();mixed['transcriptionSHA256']='0'*64;record=self.record(mixed)
        with self.assertRaisesRegex(CheckpointRejected,'D06_ORIGINAL_ACTUAL_D05_ADOPTION_REQUIRED'):
            cp.validate_inline_layout_repair_record(record,mixed=mixed)

    def test_continuation_updates_only_current_mixed_digest_and_requires_both_aliases(self):
        import checkpoint as cp
        old=self.mixed();first=self.record(old);new=copy.deepcopy(old)
        new.update(candidateBeforeSHA=old['candidateAfterSHA'],candidateAfterSHA='f'*40)
        second=self.record(new)
        self.assertEqual(cp.validate_inline_layout_repair_continuation(first,second,mixed=new,previous_mixed=old),second)
        for kwargs in ({'mixed':None},{'mixed':new},{'mixed':new,'previous_mixed':new}):
            with self.subTest(kwargs=kwargs),self.assertRaises(CheckpointRejected):
                cp.validate_inline_layout_repair_continuation(first,second,**kwargs)
        changed=copy.deepcopy(second);changed['evidenceRef']='TEST_FIXTURE_REPLACED'
        with self.assertRaisesRegex(CheckpointRejected,'D06_PRESERVED_SUPPLEMENTAL_ADOPTION'):
            cp.validate_inline_layout_repair_continuation(first,changed,mixed=new,previous_mixed=old)

    def test_d06_document_requires_both_adopted_scopes(self):
        from checkpoint import INLINE_LAYOUT_REPAIR_PROPOSAL_PATH
        from adapters import _checkpoint_scope_diff
        flags={'nearby_repair':True,'math_rendering_repair':True,'mixed_inline_repair':True}
        with self.assertRaises(Rejected):_checkpoint_scope_diff({INLINE_LAYOUT_REPAIR_PROPOSAL_PATH},**flags)
        self.assertEqual(_checkpoint_scope_diff({INLINE_LAYOUT_REPAIR_PROPOSAL_PATH},**flags,inline_layout_repair=True),[INLINE_LAYOUT_REPAIR_PROPOSAL_PATH])
        with self.assertRaises(Rejected):_checkpoint_scope_diff({INLINE_LAYOUT_REPAIR_PROPOSAL_PATH},inline_layout_repair=True)


class InlineLayoutMeasurementTests(unittest.TestCase):
    def measurements(self):
        from team import INLINE_LAYOUT_FINDING_ID,INLINE_LAYOUT_ZERO_COUNTERS,INLINE_LAYOUT_BOUNDARY_SOURCES
        def group(count):return {'sampleCount':count,'parentContainmentSampleCount':count,'measuredAncestorCount':count,
            'notApplicableAncestorCount':count,**{key:0 for key in INLINE_LAYOUT_ZERO_COUNTERS}}
        return {'schemaVersion':'qf01-mixed-inline-layout-measurements/1','status':'PASS','findingId':INLINE_LAYOUT_FINDING_ID,
            'imageGeometryStable':True,'widths':[320,390,430,1440],
            'groups':{k:group(v) for k,v in (('main',420),('help',280),('secondHint',140))},
            'boundarySamples':[{'width':width,'case':case,'source':copy.deepcopy(source),**group(1),
                'fontPx':21.78,'naturalWidthPx':211.5 if case=='secondHint' else 218.515625,'availableWidthPx':220.625}
                for width in (360,361) for case,source in INLINE_LAYOUT_BOUNDARY_SOURCES.items()]}

    def test_all840_samples_distinguish_real_ancestors_and_not_applicable_with_four_visible_boundaries(self):
        from team import validate_inline_layout_measurements
        m=self.measurements();self.assertEqual(validate_inline_layout_measurements(m),m)
        m['groups']['main']['notApplicableAncestorCount']=0
        self.assertEqual(validate_inline_layout_measurements(m),m)

    def test_each_group_bool_missing_unknown_overflow_and_zero_real_measurement_are_rejected(self):
        from team import validate_inline_layout_measurements,INLINE_LAYOUT_ZERO_COUNTERS
        for group in ('main','help','secondHint'):
            for key in ('sampleCount','parentContainmentSampleCount','measuredAncestorCount','notApplicableAncestorCount',*INLINE_LAYOUT_ZERO_COUNTERS):
                for invalid in (None,False,-1):
                    m=self.measurements();m['groups'][group][key]=invalid
                    with self.subTest(group=group,key=key,invalid=invalid),self.assertRaises(Rejected):validate_inline_layout_measurements(m)
            m=self.measurements();m['groups'][group]['measuredAncestorCount']=0
            with self.assertRaises(Rejected):validate_inline_layout_measurements(m)
        m=self.measurements();m['groups']['main']['overflowingFlowCount']=1
        with self.assertRaises(Rejected):validate_inline_layout_measurements(m)

    def test_boundary_missing_duplicated_wrong_source_font_shrink_and_parent_overflow_are_rejected(self):
        from team import validate_inline_layout_measurements
        for mode in ('missing','duplicate','source','font','overflow','unverified','image'):
            m=self.measurements();row=m['boundarySamples'][0]
            if mode=='missing':m['boundarySamples'].pop()
            elif mode=='duplicate':m['boundarySamples'][1]=copy.deepcopy(row)
            elif mode=='source':row['source']['interactionId']='TEST_FIXTURE_OTHER'
            elif mode=='font':row['fontPx']=18
            elif mode=='overflow':row['availableWidthPx']=184.65625
            elif mode=='unverified':row['unverified']=1
            else:m['imageGeometryStable']=False
            with self.subTest(mode=mode),self.assertRaises(Rejected):validate_inline_layout_measurements(m)


def inline_layout_owner_revision_fixture():
    """Pure TEST_FIXTURE history and owner proof; no real native data is used."""
    import checkpoint as cp
    f=mixed_owner_revision_fixture()
    for record in f['mixed_records']:record['transcriptionSHA256']=cp.INLINE_LAYOUT_ORIGINAL_D05_ADOPTION_SHA256
    layouts=[InlineLayoutRecordTests().record(mixed) for mixed in f['mixed_records']]
    before=f['owner']['plan'];after=f['new_plan']
    for plan in (before,after):plan['proposal'].update(hash=cp.INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,id='TEST_FIXTURE_D06')
    wrapper=f['owner']['informed_technical_candidate_reconciliation'];proof=wrapper['proof']
    proof.update(proposalSHA256=cp.INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,planSHA256=digest(before))
    proof['gitProof']['currentMaterialGitProof']['mixedInlineRepair']=f['mixed_records'][0]
    proof['gitProof']['currentMaterialGitProof']['inlineLayoutRepair']=layouts[0];wrapper['proofRef']=digest(proof)
    f['primary']['checkpoint_definition_migration']['inlineLayoutRepair']=layouts[-1]
    body=f['primary']['informed_review_method']['authority'];body['evidenceRefs'].append(layouts[-1]['evidenceRef'])
    f['primary']['informed_review_method']['authorityRef']=digest(body)
    f['layout_records']=layouts
    return f


class InlineLayoutOwnerRevisionTests(unittest.TestCase):
    def validate(self,f):
        from checkpoint import validate_math_rendering_owner_revision
        with patch('checkpoint.MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256',f['historicalDigest']):
            return validate_math_rendering_owner_revision(f['owner'],f['primary'],f['new_plan'],original_plan=f['original_plan'],
                math_records=f['math_records'],mixed_records=f['mixed_records'],layout_records=f['layout_records'],epoch=f['epoch'])

    def test_joint_d06_owner_uses_real_paired_records_and_last_proof_with_only_two_protections(self):
        f=inline_layout_owner_revision_fixture();before=copy.deepcopy(f)
        self.assertEqual(self.validate(f),f['new_plan']);self.assertEqual(f,before)
        self.assertNotEqual(f['owner']['definition_hash'],f['primary']['definition_hash'])

    def test_missing_reordered_or_foreign_layout_history_and_last_proof_are_rejected(self):
        for mode in ('missing','reordered','alias','proof','authority'):
            f=inline_layout_owner_revision_fixture()
            if mode=='missing':f['layout_records']=f['layout_records'][1:]
            elif mode=='reordered':f['layout_records'].reverse()
            elif mode=='alias':f['layout_records'][0]['mixedInlineRepairSHA256']=digest(f['mixed_records'][1])
            elif mode=='proof':
                w=f['owner']['informed_technical_candidate_reconciliation']
                w['proof']['gitProof']['currentMaterialGitProof']['inlineLayoutRepair']=f['layout_records'][1];w['proofRef']=digest(w['proof'])
            else:
                method=f['primary']['informed_review_method'];method['authority']['evidenceRefs'].remove('TEST_FIXTURE_D06')
                method['authorityRef']=digest(method['authority'])
            with self.subTest(mode=mode),self.assertRaises(CheckpointRejected):self.validate(f)

    def test_d05_same_adoption_cannot_reuse_the_joint_current_d06(self):
        import checkpoint as cp
        f=inline_layout_owner_revision_fixture()
        for plan in (f['owner']['plan'],f['new_plan']):plan['proposal']['hash']=cp.MIXED_INLINE_REPAIR_PROPOSAL_SHA256
        with self.assertRaisesRegex(CheckpointRejected,'D06_OWNER_CANNOT_REUSE_EARLIER_ADOPTION'):self.validate(f)

    def test_same_d06_cannot_change_plan_meaning_or_other416_or_claim_current_record_without_current_code(self):
        for mode in ('scope','third','source','claims','revoked'):
            f=inline_layout_owner_revision_fixture()
            if mode=='scope':f['new_plan']['scope']['paths'].append('TEST_FIXTURE_UNADOPTED.py')
            elif mode=='third':f['new_plan']['protected_manifest']['TEST_FIXTURE/protected/0']='0'*64
            elif mode=='source':f['new_plan']['source_sha']='0'*40
            elif mode=='claims':f['primary']['claims']={'TEST_FIXTURE':{}}
            else:f['primary']['informed_review_method']['revoked']=True
            with self.subTest(mode=mode),self.assertRaises(CheckpointRejected):self.validate(f)


class InlineLayoutFindingTests(unittest.TestCase):
    """Direct working-finding guard only, never a genuine report or receipt."""
    def setUp(self):
        MixedInlineFindingTests.setUp(self)
        import checkpoint as cp
        from team import INLINE_LAYOUT_FINDING_ID,INLINE_LAYOUT_ORIGINAL_EVIDENCE_ID
        original={'schemaVersion':'qf01-d05-working-second-hint-overflow-finding/1','findingId':INLINE_LAYOUT_FINDING_ID,
            'status':'OPEN_CONFIRMED_WORKING_IMPLEMENTATION','actualNativeCandidateSHA':cp.MIXED_INLINE_REPAIR_BASELINE,
            'newActualGitSHA':None,'workingRendererSHA256':cp.INLINE_LAYOUT_WORKING_D05_PRODUCT[cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS[0]],
            'workingTestSHA256':cp.INLINE_LAYOUT_WORKING_D05_PRODUCT[cp.MIXED_INLINE_REPAIR_PRODUCT_PATHS[1]],
            'productChangedAfterFinding':False,'newLayoutDesignAdopted':False,'blocksMaterialPASS':True,
            'fixtureKind':'TEST_FIXTURE_NOT_ACTUAL_WORKING_DIAGNOSTIC'}
        path=self.rt.root/'TEST_FIXTURE_D05_WORKING_OVERFLOW.json';path.write_text(json.dumps(original)+'\n',encoding='utf8')
        h=hashlib.sha256(path.read_bytes()).hexdigest();self.prior=INLINE_LAYOUT_ORIGINAL_EVIDENCE_ID
        self.state['evidence'][self.prior]={'kind':'file','verification_level':'local_execution','data':{'path':path.name,'sha256':h}}
        self.state['evidence'][self.measured]['data']['inline_layout_rendering']=InlineLayoutMeasurementTests().measurements()
        for _,out,_ in self.reviews:
            out['findings']=[{'findingId':INLINE_LAYOUT_FINDING_ID,**self.required[0],'resolution':'VERIFIED_FIXED',
                'reexaminesEvidenceRef':self.prior,'reason':'TEST_FIXTURE_PROTOCOL_ONLY','evidenceRefs':[self.measured]}]
        boundary=patch('team.INLINE_LAYOUT_ORIGINAL_DIAGNOSTIC_SHA256',h);boundary.start();self.addCleanup(boundary.stop)
        context=patch('checkpoint.current_product_repair_context',return_value={'inlineLayoutRepair':{'fixtureKind':'TEST_FIXTURE'}})
        context.start();self.addCleanup(context.stop)

    def check(self):
        from team import _check_inline_layout_finding_resolution
        return _check_inline_layout_finding_resolution(self.rt,self.state,{},None,self.reviews,self.required,
            ['TEST_FIXTURE_CODE'],[self.measured])

    def test_both_current_reports_reexamine_working_source_without_creating_formal_d05_history(self):
        self.assertIsNone(self.check())

    def test_each_report_requires_width_finding_current_code_and_new_parent_measurements(self):
        original=copy.deepcopy(self.reviews)
        for reviewer in range(2):
            for mode in ('omit','open','wrong-history','code'):
                self.reviews=copy.deepcopy(original);out=self.reviews[reviewer][1]
                if mode=='omit':out['findings']=[]
                elif mode=='open':out['findings'][0]['resolution']='OPEN'
                elif mode=='wrong-history':out['findings'][0]['reexaminesEvidenceRef']='TEST_FIXTURE_FORMAL_D05'
                else:out['codeReceiptRefs']=[]
                with self.subTest(reviewer=reviewer,mode=mode),self.assertRaises(Rejected):self.check()
        self.reviews=original;self.state['evidence'][self.measured]['data']['inline_layout_rendering']['groups']['secondHint']['overflowingMathBaseCount']=1
        with self.assertRaises(Rejected):self.check()

    def test_rehashed_working_diagnostic_cannot_be_retagged_as_actual_new_git_source(self):
        import team
        data=self.state['evidence'][self.prior]['data'];path=self.rt.root/data['path'];value=json.loads(path.read_bytes())
        value['newActualGitSHA']='e'*40;value['status']='OPEN_CONFIRMED_CURRENT_D05'
        path.write_text(json.dumps(value)+'\n',encoding='utf8');h=hashlib.sha256(path.read_bytes()).hexdigest();data['sha256']=h
        with patch('team.INLINE_LAYOUT_ORIGINAL_DIAGNOSTIC_SHA256',h),self.assertRaisesRegex(Rejected,'D06_ORIGINAL_WORKING_QUALIFICATION_NOT_FORMAL_D05'):
            self.check()


if __name__ == '__main__':
    unittest.main(verbosity=2)
