"""Transport unit fixtures are simulations, never actual rendering acceptance.

Positive transport tests isolate the existing geometry checker with an explicit
mock; a separate negative test invokes the real Node checker on missing states.
The main verification run must additionally supply actual four-width captures.
"""
import base64
import copy
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from contracts import Rejected, sha, manifest
from store import digest
from capabilities import implementation_hash
from local_render_evidence import verify_local_capture, validate_local_capture, _run_nested_validator

ROOT = Path(__file__).resolve().parents[1]
COMPILED_PATH = 'src/data/textbook/math/numbers/n09ConstructionCompiled.json'
PNG = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a+XcAAAAASUVORK5CYII=')


class LocalCaptureTransportUnitFixture(unittest.TestCase):
    """Explicit synthetic transport fixture, not a captured browser execution."""
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.compiled = json.loads((ROOT / COMPILED_PATH).read_text())
        self.write(COMPILED_PATH, (ROOT / COMPILED_PATH).read_bytes())
        self.write('app.js', b'// UNIT TRANSPORT FIXTURE, NOT A BROWSER RUN\n')
        self.write('evidence/capture.mjs', b'// synthetic transport fixture script\n')
        self.write('evidence/font.bin', b'UNIT-TRANSPORT-FONT-FIXTURE')
        sources = manifest(self.root, [COMPILED_PATH, 'app.js'])
        self.state = {'plan': {'nested_math_pipeline': 'nested-math/1'}, 'candidate_sha': 'a' * 40,
                      'candidate_manifest': sources, 'evidence': {}}
        self.rt = SimpleNamespace(root=self.root, state=lambda _: self.state)
        self.data = {'source_sha': 'a' * 40, 'displayedSourceSHA': 'a' * 40,
                     'compiledPath': COMPILED_PATH, 'compiledHash': self.compiled['compiledHash'],
                     'scriptPath': 'evidence/capture.mjs', 'scriptHash': sha(self.root / 'evidence/capture.mjs'),
                     'fontPath': 'evidence/font.bin', 'fontSha256': sha(self.root / 'evidence/font.bin'),
                     'implementationHash': implementation_hash(self.rt),
                     'sourceManifest': sources, 'sourceManifestAfter': copy.deepcopy(sources),
                     'files': {}, 'runs': []}
        for width in [320, 390, 430, 1440]:
            path = 'evidence/' + str(width) + '/run.json'
            images, state_images, packets = {}, [], []
            # Synthetic transport packets deliberately do not claim geometry validity.
            for index, (state, value) in enumerate([('initial', None), ('wrong', 'wrong'), ('filled', 'right')]):
                image = 'evidence/' + str(width) + '/' + state + '.png'
                self.write(image, PNG)
                images[image] = sha(self.root / image)
                packets.append({'part': 'fixture::part', 'state': state, **({'selectedValue': value} if value is not None else {})})
                state_images.append({'packetIndex': index, 'part': 'fixture::part', 'state': state,
                                     'selectedValue': value, 'path': image, 'sha256': images[image]})
            run = {'sourceSHA': 'a' * 40, 'width': width, 'code': 'n09',
                   'compiledHash': self.data['compiledHash'], 'scriptHash': self.data['scriptHash'],
                   'fontSha256': self.data['fontSha256'], 'sourceManifest': sources,
                   'sourceManifestAfter': sources, 'imageManifest': images,
                   'errors': [], 'failures': [], 'packets': packets, 'images': state_images}
            self.write(path, json.dumps(run).encode())
            self.data['files'].update(images)
            self.data['runs'].append({'path': path, 'sha256': sha(self.root / path),
                                      'width': width, 'images': images})
        self.mock_geometry = {'status': 'PASS', 'schemaVersion': 'nested-run-validation/1',
                              'findings': [], 'layoutHash': self.compiled['layoutDesignHash'],
                              'widths': [320, 390, 430, 1440],
                              'partCount': sum(len(n['parts']) for n in self.compiled['nodeDesign']),
                              'measurementCount': 1}

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, path, value):
        p = self.root / path
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(value)

    def verify_transport_only(self, data=None):
        with patch('local_render_evidence._run_nested_validator', return_value=self.mock_geometry) as checker:
            result = verify_local_capture(self.rt, 'UNIT-TRANSPORT', data or self.data)
        self.assertEqual(checker.call_count, 1)
        return result

    def rewrite_run(self, index, mutate):
        d = self.data['runs'][index]
        run = json.loads((self.root / d['path']).read_text())
        mutate(run)
        self.write(d['path'], json.dumps(run).encode())
        d['sha256'] = sha(self.root / d['path'])

    def test_transport_binding_positive_is_explicitly_not_browser_acceptance(self):
        result = self.verify_transport_only()
        runs = [json.loads((self.root / r['path']).read_text()) for r in self.data['runs']]
        self.assertEqual(result['browserRunsHash'], digest(runs))
        self.assertFalse(result['provenance']['ci'])
        self.assertFalse(result['provenance']['cryptographicBrowserExecutionProof'])
        self.assertFalse(result['provenance']['automaticAcceptance'])
        self.assertNotIn('browserRuns', result)

    def test_valid_registered_capture_is_rechecked_on_reuse(self):
        data = self.verify_transport_only()
        self.state['evidence']['capture'] = {'kind': 'local_capture', 'data': data,
                                             'verification_level': 'local_execution'}
        with patch('local_render_evidence._run_nested_validator', return_value=self.mock_geometry) as checker:
            again = validate_local_capture(self.rt, 'UNIT-TRANSPORT', 'capture')
        self.assertEqual(checker.call_count, 1)
        self.assertEqual(again['captureBinding'], data['captureBinding'])
        self.write('app.js', b'changed after capture')
        with self.assertRaises(Rejected):
            validate_local_capture(self.rt, 'UNIT-TRANSPORT', 'capture')

    def test_different_displayed_candidate_and_implementation_are_rejected(self):
        for key, value in [('source_sha', 'b' * 40), ('displayedSourceSHA', 'b' * 40),
                           ('implementationHash', 'b' * 64), ('compiledHash', 'b' * 64)]:
            d = copy.deepcopy(self.data)
            d[key] = value
            with self.subTest(key=key), self.assertRaises(Rejected):
                verify_local_capture(self.rt, 'UNIT-TRANSPORT', d)
        self.state['candidate_sha'] = 'b' * 40
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_missing_and_duplicate_widths_are_rejected(self):
        d = copy.deepcopy(self.data)
        d['runs'].pop()
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', d)
        d = copy.deepcopy(self.data)
        d['runs'][0]['width'] = 390
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', d)

    def test_run_source_and_image_manifest_mismatch_are_rejected_even_if_resigned(self):
        self.rewrite_run(0, lambda run: run.update(sourceSHA='b' * 40))
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)
        self.rewrite_run(0, lambda run: run.update(sourceSHA='a' * 40, imageManifest={}))
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_width_only_one_png_cannot_replace_all_state_images(self):
        self.rewrite_run(0, lambda run: run.update(images=run['images'][:1]))
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_wrong_or_filled_state_image_omission_is_rejected(self):
        original = (self.root / self.data['runs'][0]['path']).read_bytes()
        for state in ('wrong', 'filled'):
            self.write(self.data['runs'][0]['path'], original)
            self.rewrite_run(0, lambda run: run.update(images=[i for i in run['images'] if i['state'] != state]))
            with self.subTest(state=state), self.assertRaises(Rejected):
                verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_state_image_packet_id_value_or_index_mismatch_is_rejected(self):
        original = (self.root / self.data['runs'][0]['path']).read_bytes()
        for key, value in [('part', 'other::part'), ('state', 'filled'), ('selectedValue', 'other'), ('packetIndex', 1)]:
            self.write(self.data['runs'][0]['path'], original)
            self.rewrite_run(0, lambda run: run['images'][0].update({key: value}))
            with self.subTest(key=key), self.assertRaises(Rejected):
                verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_state_image_wrong_path_hash_or_reused_path_is_rejected(self):
        original = (self.root / self.data['runs'][0]['path']).read_bytes()
        for key, value in [('path', 'evidence/missing.png'), ('sha256', 'f' * 64)]:
            self.write(self.data['runs'][0]['path'], original)
            self.rewrite_run(0, lambda run: run['images'][0].update({key: value}))
            with self.subTest(key=key), self.assertRaises(Rejected):
                verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)
        self.write(self.data['runs'][0]['path'], original)
        self.rewrite_run(0, lambda run: run['images'][1].update(path=run['images'][0]['path'], sha256=run['images'][0]['sha256']))
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_run_failures_are_rejected(self):
        self.rewrite_run(0, lambda run: run.update(failures=[{'rule': 'actual render failed'}]))
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_tampered_raw_image_script_and_font_are_rejected(self):
        for path in ['evidence/320/initial.png', self.data['scriptPath'], self.data['fontPath']]:
            original = (self.root / path).read_bytes()
            self.write(path, original + b'changed')
            with self.subTest(path=path), self.assertRaises(Rejected):
                verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)
            self.write(path, original)

    def test_missing_candidate_file_and_changed_source_manifest_are_rejected(self):
        d = copy.deepcopy(self.data)
        del d['sourceManifest'][COMPILED_PATH]
        d['sourceManifestAfter'] = copy.deepcopy(d['sourceManifest'])
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', d)
        d = copy.deepcopy(self.data)
        d['sourceManifestAfter']['app.js'] = 'b' * 64
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', d)

    def test_path_escape_symlink_and_unknown_capture_are_rejected(self):
        d = copy.deepcopy(self.data)
        d['scriptPath'] = '../outside.mjs'
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', d)
        (self.root / 'evidence/link.mjs').symlink_to(self.root / self.data['scriptPath'])
        d = copy.deepcopy(self.data)
        d['scriptPath'] = 'evidence/link.mjs'
        with self.assertRaises(Rejected):
            verify_local_capture(self.rt, 'UNIT-TRANSPORT', d)
        with self.assertRaises(Rejected):
            validate_local_capture(self.rt, 'UNIT-TRANSPORT', 'not-registered')

    def test_ci_or_simulation_cannot_be_used_as_local_capture(self):
        for kind, level in [('capture', 'local_execution'), ('local_capture', 'simulation')]:
            self.state['evidence']['ref'] = {'kind': kind, 'data': self.data, 'verification_level': level}
            with self.subTest(kind=kind, level=level), self.assertRaises(Rejected):
                validate_local_capture(self.rt, 'UNIT-TRANSPORT', 'ref')

    def test_geometry_fail_and_forged_generic_pass_are_not_accepted(self):
        for checked in [{'status': 'FAIL', 'findings': [{'ruleId': 'MISSING_STATES'}]}, {'status': 'PASS'}]:
            with patch('local_render_evidence._run_nested_validator', return_value=checked):
                with self.subTest(checked=checked), self.assertRaises(Rejected):
                    verify_local_capture(self.rt, 'UNIT-TRANSPORT', self.data)

    def test_recorded_binding_and_current_implementation_are_rechecked(self):
        data = self.verify_transport_only()
        data['captureBinding'] = '0' * 64
        with patch('local_render_evidence._run_nested_validator', return_value=self.mock_geometry):
            with self.assertRaises(Rejected):
                verify_local_capture(self.rt, 'UNIT-TRANSPORT', data)
        self.state['evidence']['ref'] = {'kind': 'local_capture', 'data': self.data,
                                       'verification_level': 'local_execution'}
        with patch('capabilities.implementation_hash', return_value='c' * 64):
            with self.assertRaises(Rejected):
                validate_local_capture(self.rt, 'UNIT-TRANSPORT', 'ref')


class ExistingStrictCheckerConnection(unittest.TestCase):
    def test_real_existing_node_checker_rejects_four_runs_without_required_states(self):
        compiled = json.loads((ROOT / COMPILED_PATH).read_text())
        runs = [{'width': width, 'sourceSHA': 'a' * 40, 'code': 'n09',
                 'compiledHash': compiled['compiledHash'], 'scriptHash': 'b' * 64,
                 'fontSha256': 'c' * 64, 'sourceManifest': {'fixture': 'd' * 64},
                 'sourceManifestAfter': {'fixture': 'd' * 64}, 'errors': [], 'failures': [],
                 'packets': [], 'auxiliaryPackets': []} for width in [320, 390, 430, 1440]]
        checked = _run_nested_validator(ROOT, compiled, runs, {'sourceSHA': 'a' * 40})
        self.assertEqual(checked['status'], 'FAIL')
        rules = {f['ruleId'] for f in checked['findings']}
        self.assertIn('NESTED_PART_STATE_COVERAGE', rules)
        self.assertIn('NESTED_AUXILIARY_COVERAGE', rules)


if __name__ == '__main__':
    unittest.main()
