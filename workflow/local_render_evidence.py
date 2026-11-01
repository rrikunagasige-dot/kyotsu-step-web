"""Copy-only recovery bridge for source-bound local rendering evidence.

This is a new bridge implementation, not a reconstruction of the lost source.
A local capture is never represented as CI or as cryptographic proof that a browser
ran. Real script/font/source/measurement/image bytes are rechecked on every use,
and the existing nested geometry validator remains the acceptance authority.
"""
import copy
import json
import re
import struct
import subprocess
from pathlib import Path

from contracts import need, file, sha, manifest
from store import digest

SCHEMA = 'local-render-capture/1'
WIDTHS = [320, 390, 430, 1440]
_HASH = re.compile(r'[0-9a-f]{64}\Z')
_SHA = re.compile(r'[0-9a-f]{40}\Z')
_FIELDS = ('source_sha', 'displayedSourceSHA', 'compiledPath', 'compiledHash',
           'scriptPath', 'scriptHash', 'fontPath', 'fontSha256',
           'implementationHash', 'sourceManifest', 'sourceManifestAfter', 'files', 'runs')


def _hash(value, label):
    need(isinstance(value, str) and _HASH.fullmatch(value), 'local capture hash不足:' + label)


def _checked_file(root, path, expected, label):
    _hash(expected, label)
    target = file(root, path)
    need(target.is_file(), 'local capture原物がない:' + label)
    need(sha(target) == expected, 'local capture原物hash不一致:' + label)
    return target


def _png(root, path, expected):
    target = _checked_file(root, path, expected, path)
    raw = target.read_bytes()
    need(len(raw) >= 45 and raw[:8] == b'\x89PNG\r\n\x1a\n' and raw[12:16] == b'IHDR',
         'local capture画像は実PNG原物が必要:' + path)
    width, height = struct.unpack('>II', raw[16:24])
    need(width > 0 and height > 0 and b'IEND' in raw[-16:], 'local capture PNG構造が不足:' + path)


def _run_nested_validator(root, compiled, runs, context):
    """Invoke the existing checker; no alternate geometry PASS is implemented here."""
    payload = {'layoutPlan': compiled['layoutPlan'], 'nestedCompiled': compiled,
               'measurements': runs, 'measurementContext': context}
    proc = subprocess.run(['node', str(Path(root) / 'tools/textbook/operations.mjs'), 'layout-validate'],
                          input=json.dumps(payload, ensure_ascii=False), cwd=root,
                          text=True, capture_output=True, timeout=120)
    need(proc.returncode == 0, 'local capture nested検査実行FAIL:' + proc.stderr[:300])
    try:
        checked = json.loads(proc.stdout)
    except ValueError:
        need(False, 'local capture nested検査出力がJSONではない')
    return checked


def verify_local_capture(rt, work, data):
    """Validate actual local capture files and return compact, serializable evidence.

    Required schema: source_sha/displayedSourceSHA, compiledPath/compiledHash,
    scriptPath/scriptHash, fontPath/fontSha256, implementationHash,
    sourceManifest/sourceManifestAfter, files {relative PNG path: raw SHA256},
    runs [{path, sha256, width, images:{relative PNG path: raw SHA256}}].
    Each raw run JSON must include an identical imageManifest and an images list
    linking every packetIndex/part/state/selectedValue to its unique raw image path
    and SHA256. It also includes four-width source,
    compiled, script, font and before/after manifest bindings. A capture's complete
    source manifest may include more files than the declared candidate manifest;
    it must cover every candidate file, and all reported files are checked.
    """
    need(isinstance(data, dict), 'local captureはobject')
    need(all(k in data for k in _FIELDS), 'local capture必須項目不足')
    state = rt.state(work)
    need(state['plan'].get('nested_math_pipeline') == 'nested-math/1',
         'local capture bridgeは宣言済N0910 nested工程専用')
    current_sha = state.get('candidate_sha')
    need(isinstance(current_sha, str) and _SHA.fullmatch(current_sha), 'local capture対象のcandidate SHA未固定')
    need(data['source_sha'] == data['displayedSourceSHA'] == current_sha,
         'local capture表示版/candidate版不一致')
    from capabilities import implementation_hash
    current_implementation = implementation_hash(rt)
    need(data['implementationHash'] == current_implementation, 'local capture後に実装版が変更された')
    source = data['sourceManifest']
    need(isinstance(source, dict) and source and source == data['sourceManifestAfter'],
         'local capture実行前後のsource manifest不一致')
    candidate = state['candidate_manifest']
    need(candidate and all(source.get(p) == h for p, h in candidate.items()),
         'local capture対象candidateの全path/版が不足')
    for p, h in source.items():
        _checked_file(rt.root, p, h, p)
    need(manifest(rt.root, source) == source, 'local capture source原物が変化した')
    need(data['compiledPath'] in candidate, 'local capture compiledは候補版の登録済pathが必要')
    compiled_file = _checked_file(rt.root, data['compiledPath'], candidate[data['compiledPath']], 'compiledPath')
    try:
        compiled = json.loads(compiled_file.read_text())
    except (ValueError, UnicodeError):
        need(False, 'local capture compiled JSON不正')
    _hash(data['compiledHash'], 'compiledHash')
    need(compiled.get('nestedPipeline') == 'n0910/1' and compiled.get('compiledHash') == data['compiledHash'],
         'local capture compiled版不一致')
    need(compiled.get('unitId') in ('math-numbers-expressions-n09', 'math-numbers-expressions-n10'),
         'local capture登録外教材')
    _checked_file(rt.root, data['scriptPath'], data['scriptHash'], 'script')
    _checked_file(rt.root, data['fontPath'], data['fontSha256'], 'font')
    images = data['files']
    need(isinstance(images, dict) and images, 'local capture PNG一覧がない')
    for path, expected in images.items():
        _png(rt.root, path, expected)
    descriptors = data['runs']
    need(isinstance(descriptors, list) and len(descriptors) == 4, 'local capture実測は4run必要')
    need(all(isinstance(d, dict) and set(('path', 'sha256', 'width', 'images')) <= set(d) for d in descriptors),
         'local capture実測artifactの対応不足')
    need(sorted(d['width'] for d in descriptors) == WIDTHS, 'local capture画面幅不足/重複')
    need(len({d['path'] for d in descriptors}) == 4, 'local capture実測artifact重複')
    consumed_images = {}
    runs = []
    code = 'n09' if compiled['unitId'].endswith('n09') else 'n10'
    for descriptor in descriptors:
        run_file = _checked_file(rt.root, descriptor['path'], descriptor['sha256'], 'run')
        try:
            run = json.loads(run_file.read_text())
        except (ValueError, UnicodeError):
            need(False, 'local capture実測JSON不正')
        need(isinstance(run, dict), 'local capture実測はobject')
        run_images = descriptor['images']
        need(isinstance(run_images, dict) and run_images and run.get('imageManifest') == run_images,
             'local capture画像と実測runの対応がない')
        need(all(images.get(p) == h for p, h in run_images.items()), 'local capture未登録画像/版不一致')
        need(not set(consumed_images).intersection(run_images), 'local capture同じ画像を別runへ流用')
        consumed_images.update(run_images)
        need(run.get('sourceSHA') == current_sha and run.get('width') == descriptor['width'] and
             run.get('code') == code and run.get('compiledHash') == data['compiledHash'],
             'local capture実測のsource/width/unit/compiled版不一致')
        need(run.get('scriptHash') == data['scriptHash'] and run.get('fontSha256') == data['fontSha256'],
             'local capture実測のscript/font版不一致')
        need(run.get('sourceManifest') == source and run.get('sourceManifestAfter') == source,
             'local capture実測のsource manifest不一致')
        packets, state_images = run.get('packets'), run.get('images')
        need(isinstance(packets, list) and packets and isinstance(state_images, list)
             and len(state_images) == len(packets), 'local capture全packetの状態画像が必要')
        seen_indices, seen_paths = set(), set()
        for image in state_images:
            need(isinstance(image, dict) and
                 {'part', 'state', 'selectedValue', 'packetIndex', 'path', 'sha256'} <= set(image),
                 'local capture状態画像の対応項目不足')
            index, path = image['packetIndex'], image['path']
            need(type(index) is int and 0 <= index < len(packets) and index not in seen_indices,
                 'local capture状態画像のpacketIndex重複/範囲外')
            packet = packets[index]
            need(isinstance(packet, dict) and packet.get('part') and
                 image['part'] == packet['part'] and image['state'] == packet.get('state') and
                 image['selectedValue'] == packet.get('selectedValue'),
                 'local capture状態画像とpart/state/selectedValueが違う')
            need(image['state'] in ('initial', 'wrong', 'filled'), 'local capture状態画像の状態が不明')
            need(isinstance(path, str) and path not in seen_paths and
                 run_images.get(path) == image['sha256'], 'local capture状態画像path/hash不一致又は流用')
            # Identical pixels in distinct, actually captured files are legitimate.
            # One path cannot stand in for several states; hashes need not be distinct.
            seen_indices.add(index); seen_paths.add(path)
        need(seen_indices == set(range(len(packets))), 'local capture状態画像のpacketcoverage不足')
        need(isinstance(run.get('errors'), list) and not run['errors'] and
             isinstance(run.get('failures'), list) and not run['failures'], 'local capture実測FAIL/未確認')
        runs.append(run)
    need(consumed_images == images, 'local capture run未対応の画像がある')
    checked = _run_nested_validator(rt.root, compiled, runs, {'sourceSHA': current_sha, 'sourceManifest': source})
    need(checked.get('status') == 'PASS' and checked.get('schemaVersion') == 'nested-run-validation/1',
         'local capture入れ子数式検査FAIL:' + json.dumps(checked.get('findings', checked.get('reason', [])), ensure_ascii=False)[:400])
    need(checked.get('layoutHash') == compiled.get('layoutDesignHash') and sorted(checked.get('widths', [])) == WIDTHS,
         'local capture検査結果の版/幅が違う')
    parts = sum(len(n['parts']) for n in compiled['nodeDesign'])
    need(checked.get('partCount') == parts and isinstance(checked.get('measurementCount'), int)
         and checked['measurementCount'] > 0, 'local capture部品/測定coverage不足')
    # Re-read raw files after the external checker to reject a concurrently changed capture.
    need(manifest(rt.root, source) == source, 'local capture検査中にsourceが変更された')
    _checked_file(rt.root, data['scriptPath'], data['scriptHash'], 'script')
    _checked_file(rt.root, data['fontPath'], data['fontSha256'], 'font')
    for descriptor in descriptors:
        _checked_file(rt.root, descriptor['path'], descriptor['sha256'], 'run')
    for path, expected in images.items():
        _png(rt.root, path, expected)
    need(implementation_hash(rt) == current_implementation and rt.state(work).get('candidate_sha') == current_sha,
         'local capture検査中に候補/実装が変更された')
    normalized = {key: copy.deepcopy(data[key]) for key in _FIELDS}
    binding = digest(normalized)
    if 'captureBinding' in data:
        need(data['captureBinding'] == binding, 'local capture登録時の対応が変更された')
    normalized.update(schemaVersion=SCHEMA, status='PASS', captureBinding=binding,
                      browserRunsHash=digest(runs), validation=checked,
                      provenance={'method': 'local_execution_artifact_binding', 'ci': False,
                                  'cryptographicBrowserExecutionProof': False,
                                  'automaticAcceptance': False})
    return normalized


def validate_local_capture(rt, work, capture_ref):
    """Resolve a registered local capture and revalidate every binding on reuse."""
    need(isinstance(capture_ref, str), 'local capture参照が必要')
    evidence = rt.state(work).get('evidence', {}).get(capture_ref, {})
    need(evidence.get('kind') == 'local_capture', '登録済local_capture証拠が必要')
    need(evidence.get('verification_level') == 'local_execution', 'local captureは実ローカル実行の証拠として登録する')
    return verify_local_capture(rt, work, evidence.get('data'))
