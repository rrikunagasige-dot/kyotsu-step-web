"""Draft CI helper: retrieve original Pages bytes or collect bounded QA outputs.
No build, manifest generation, deployment, source patch, or native Store access.
"""
from pathlib import Path, PurePosixPath
import argparse
import hashlib
import io
import json
import os
import shutil
import subprocess
import sys
import tarfile
import urllib.error
import urllib.parse
import urllib.request
import zipfile

REPO = 'rrikunagasige-dot/kyotsu-step-web'
MATERIAL = 'cb01da34c99005fde4a64fd932b31edeaa3790b3'
PUBLISHER = 'f223395815091ca7766241b152bcba014a8e808f'
RUN = 42150732463
ARTIFACT = 13473642413
ZIP_BYTES = 4317834
ZIP_SHA = '001f2ab37027a53accc5b99fd35076a46fd07d0b406d7b7d3f8c8b70117e6493'
STORAGE = 'kyotsu-step-gate3-math-20261023'
BASE = 'https://rrikunagasige-dot.github.io/kyotsu-step-web/'
ORDER = ['release.json', 'w047-release.json', 'w046-release.json', 'w048-release.json', 'w050-release.json']
MAX_BYTES = 512 * 1024 * 1024
MATERIAL_SCRIPTS = {
    'work/items/W-MATH-048-n1314-source-audit/ci-review/verify_n14_extended.mjs': '3fbe3cdb9c8a058f8f96364b3c0a7237e117f747779f5dfc1be0e19390d1c41c',
    'work/items/W-MATH-048-n1314-source-audit/ci-review/capture_current.mjs': '123bbaf10b1a63330e3fec8383b4d86a0afe6e17c0a46a5c9234f0f913081a7f',
}
PUBLISHER_FILES = {
    'w046-publish-check.mjs': '4ae2269ecf43ad3b9b132073749fb880fb8b304209ec4dc9cff5da143fc80e99',
    'w047-publish-check.mjs': '0255806892007ff2d09d70278a501f54ee5f5a51e9a6dc35f29f86f36b6bf2e5',
    'w047-release-contract.json': '6d71168eb5bc08eb2fa3798ac48c1cd91e18b69549ede08a3b2e69b5e0bc48fc',
    'w048-publish-check.mjs': '24fb88d8d68e0d758ef2984cbeb20de703aeaea67c94c8f41deb7487dd1ae46e',
    'w048-release-contract.json': 'c8082bb53d71ff0faae5a0abadc0ee167c6020963d486fa2e3fb5a9aec9294b6',
    'w050-publish-check.mjs': 'd882a6904d843f306f5a5c76fd9eced1f6ea5602cc7f9290374cf183a664ec7a',
    'w050-release-contract.json': 'cbd9a57670c381c278d9670b9084a19cbe66c293f1829139916bb9882442172b',
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def safe_name(name):
    p = PurePosixPath(name)
    assert not p.is_absolute() and '..' not in p.parts and '\\' not in name, 'UNSAFE_ARCHIVE_OR_MANIFEST_PATH'
    return p


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def github_json(endpoint, token):
    request = urllib.request.Request('https://api.github.com/repos/' + REPO + endpoint,
        headers={'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'W050-read-only-hosted-QA'})
    with urllib.request.build_opener(NoRedirect).open(request, timeout=60) as response:
        return json.load(response)


def download_archive(token):
    # Prevent forwarding the GitHub bearer token to a signed storage URL.
    request = urllib.request.Request(f'https://api.github.com/repos/{REPO}/actions/artifacts/{ARTIFACT}/zip',
        headers={'Authorization': 'Bearer ' + token, 'User-Agent': 'W050-read-only-hosted-QA'})
    try:
        response = urllib.request.build_opener(NoRedirect).open(request, timeout=60)
    except urllib.error.HTTPError as error:
        if error.code not in (301, 302, 303, 307, 308):
            raise RuntimeError('Artifact API HTTP ' + str(error.code)) from None
        location = error.headers.get('Location', '')
        assert urllib.parse.urlsplit(location).scheme == 'https', 'HTTPS_SIGNED_ARCHIVE_REQUIRED'
        try:
            response = urllib.request.urlopen(urllib.request.Request(location,
                headers={'User-Agent': 'W050-read-only-hosted-QA'}), timeout=120)
        except Exception as fetch_error:
            # Do not persist signed query strings or access credentials in logs.
            raise RuntimeError('Signed archive download failed: ' + type(fetch_error).__name__) from None
    with response:
        data = response.read(ZIP_BYTES + 1)
    assert len(data) == ZIP_BYTES, 'ORIGINAL_PAGES_ZIP_SIZE_MISMATCH'
    assert digest(data) == ZIP_SHA, 'ORIGINAL_PAGES_ZIP_SHA256_MISMATCH'
    return data


def unpack_original(data, destination):
    assert not destination.exists(), 'FRESH_DIST_REQUIRED_NO_REPLACEMENT_OR_REBUILD'
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        members = [m for m in archive.infolist() if not m.is_dir()]
        assert len(members) == 1 and members[0].filename == 'artifact.tar', 'ORIGINAL_PAGES_TAR_WRAPPER_REQUIRED'
        assert members[0].file_size <= MAX_BYTES, 'TAR_SIZE_LIMIT'
        tar_bytes = archive.read(members[0])
    destination.mkdir(parents=True)
    total = 0
    seen = set()
    with tarfile.open(fileobj=io.BytesIO(tar_bytes), mode='r:*') as archive:
        for member in archive:
            name = safe_name(member.name)
            if str(name) == '.':
                assert member.isdir(), 'ARCHIVE_ROOT_MUST_BE_DIRECTORY'
                continue
            target = destination.joinpath(*name.parts)
            assert not member.issym() and not member.islnk(), 'ARCHIVE_LINK_REJECTED'
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            assert member.isfile(), 'NONREGULAR_ARCHIVE_MEMBER_REJECTED'
            assert str(name) not in seen, 'DUPLICATE_ARCHIVE_FILE'
            seen.add(str(name))
            total += member.size
            assert total <= MAX_BYTES, 'EXTRACTED_SIZE_LIMIT'
            stream = archive.extractfile(member)
            assert stream is not None
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open('wb') as output:
                shutil.copyfileobj(stream, output)
            assert target.stat().st_size == member.size
    return {'files': len(seen), 'extractedBytes': total}


def ensure_publisher_alias(app, publisher, create):
    # Only a fresh tooling alias may be created; never overwrite source files.
    alias = app / 'publisher'
    if create:
        assert not os.path.lexists(alias), 'FRESH_PUBLISHER_ALIAS_REQUIRED'
        alias.symlink_to(publisher, target_is_directory=True)
    assert alias.is_symlink() and alias.resolve(strict=True) == publisher, 'FIXED_PUBLISHER_ALIAS_REQUIRED'
    for name, expected in PUBLISHER_FILES.items():
        assert digest((alias / 'tools/release' / name).read_bytes()) == expected, 'ALIAS_PUBLISHER_BYTE_MISMATCH'
    return {'path': str(alias), 'target': str(publisher), 'newSymlinkOnly': True,
            'publicPublisherSHA': PUBLISHER, 'originalPublisherBytesVerified': True}


def prepare(args):
    app, publisher, qa = [Path(x).resolve() for x in (args.app, args.publisher, args.qa)]
    out = Path(args.evidence).resolve()
    out.mkdir(parents=True, exist_ok=True)
    context = {'kind': 'READ_ONLY_ACTUAL_HOST_QA', 'job': args.job,
        'qaProducerSHA': os.environ.get('GITHUB_SHA'), 'qaHelperSHA256': digest(Path(__file__).read_bytes()), 'materialSourceSHA': MATERIAL,
        'publicPublisherSHA': PUBLISHER, 'originalMainRunID': RUN, 'originalMainRunOutcome': 'FAIL_STEP31_RETAINED',
        'originalPagesArtifactID': ARTIFACT, 'appURL': BASE, 'rebuilt': False,
        'manifestGenerated': False, 'redeployed': False, 'nativeReceipt': False, 'userAccepted': False}
    write_json(out / 'HOSTED_QA_CONTEXT.json', context)
    try:
        assert os.environ.get('GITHUB_REPOSITORY') == REPO
        assert os.environ.get('APP_URL') == BASE
        producer = os.environ['GITHUB_SHA']
        assert len(producer) == 40 and producer not in (MATERIAL, PUBLISHER), 'DISTINCT_ACTUAL_QA_PRODUCER_REQUIRED'
        for directory, expected in [(app, MATERIAL), (publisher, PUBLISHER), (qa, producer)]:
            actual = subprocess.check_output(['git', '-C', str(directory), 'rev-parse', 'HEAD'], text=True).strip()
            assert actual == expected, 'CHECKOUT_COMMIT_BINDING_MISMATCH'
        context['publisherToolingAlias'] = ensure_publisher_alias(app, publisher, create=True)
        token = os.environ['GITHUB_TOKEN']
        metadata = github_json(f'/actions/artifacts/{ARTIFACT}', token)
        assert metadata['id'] == ARTIFACT and metadata['name'] == 'github-pages'
        assert not metadata['expired'] and metadata['size_in_bytes'] == ZIP_BYTES
        assert metadata['digest'] == 'sha256:' + ZIP_SHA
        assert metadata['workflow_run']['id'] == RUN
        assert metadata['workflow_run']['head_sha'] == PUBLISHER
        archive = download_archive(token)
        (out / 'ORIGINAL_PAGES.zip').write_bytes(archive)
        extracted = unpack_original(archive, app / 'dist')
        all_files = {str(p.relative_to(app / 'dist')): digest(p.read_bytes())
                     for p in (app / 'dist').rglob('*') if p.is_file()}
        manifests = []
        for name in ORDER:
            raw = (app / 'dist' / name).read_bytes()
            manifest = json.loads(raw)
            assert manifest['sourceSHA'] == MATERIAL, 'SERVED_MANIFEST_MATERIAL_MISMATCH'
            assert manifest.get('publisherSHA', manifest.get('workflowSHA')) == PUBLISHER, 'SERVED_MANIFEST_PUBLISHER_MISMATCH'
            assert manifest['storageKey'] == STORAGE
            for relative, expected in manifest.get('files', {}).items():
                safe_name(relative)
                assert all_files[relative] == expected, 'ORIGINAL_DIST_ASSET_SHA_MISMATCH ' + relative
            if name in ('w048-release.json', 'w050-release.json'):
                contract = publisher / 'tools/release' / name.replace('-release.json', '-release-contract.json')
                assert manifest['contractSHA256'] == digest(contract.read_bytes()), 'PUBLISHER_CONTRACT_BINDING'
            manifests.append({'file': name, 'sha256': digest(raw), 'filesCovered': len(manifest.get('files', {}))})
        top = json.loads((app / 'dist/w050-release.json').read_text())
        assert top['files'] == {p: h for p, h in all_files.items() if p != 'w050-release.json'}, 'FINAL_MANIFEST_COMPLETE_DIST'
        context.update({'preparation': 'PASS_ORIGINAL_ARTIFACT_AND_ALL_DIST_SHA', 'zipBytes': len(archive),
            'zipSHA256': digest(archive), 'extraction': extracted, 'manifests': manifests,
            'allDistFileHashes': all_files, 'GITHUB_SHAUnmodified': True,
            'signedURLStored': False, 'tokenStored': False})
        write_json(out / 'HOSTED_QA_CONTEXT.json', context)
    except Exception as error:
        write_json(out / 'PREPARATION_FAILURE.json', {'job': args.job, 'error': str(error),
            'errorType': type(error).__name__, 'qaProducerSHA': os.environ.get('GITHUB_SHA'),
            'materialSourceSHA': MATERIAL, 'publicPublisherSHA': PUBLISHER, 'passed': False})
        raise


FIGURE_OPENING_AFTER = r'''    async function figures(label, solved) {
      const qaFigureGateStarted = Date.now(), qaFigureGateDeadline = qaFigureGateStarted + 30000;
      const qaInventory = () => page.evaluate(base => {
        const visible = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return el.isConnected && r.width > 0 && r.height > 0 && s.display !== 'none' && !['hidden', 'collapse'].includes(s.visibility); };
        const control = id => { const el = document.querySelector('[data-testid="' + id + '"]'); return { exists: Boolean(el), ariaExpanded: el?.getAttribute('aria-expanded') ?? null, visible: el ? visible(el) : false }; };
        return { observedAt: new Date().toISOString(),
          controls: { toggle: control('math-textbook-history-toggle'), all: control('math-textbook-expand-all') },
          renderer: { compactFlowObserved: Boolean(document.querySelector('[data-testid="math-textbook-compact-flow"]')), firstThemeAttribute: document.querySelector('[data-testid="textbook-reading-flow"]')?.getAttribute('data-first-theme') ?? null, compactStageCount: document.querySelectorAll('[data-testid^="math-textbook-stage-"]').length, legacyReadingSubsectionCount: document.querySelectorAll('.reading-subsection').length },
          images: [...document.querySelectorAll('img')].map(img => {
            const rect = img.getBoundingClientRect(), style = getComputedStyle(img), src = img.getAttribute('src');
            return { src, fullURL: new URL(src, base).href, currentSrc: img.currentSrc,
              inReadingFlow: Boolean(img.closest('[data-testid="textbook-reading-flow"]')),
              mounted: img.isConnected, complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight,
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left },
              display: style.display, visibility: style.visibility, visible: visible(img), decoded: 'UNKNOWN_NOT_MEASURED' };
          }) };
      }, process.env.APP_URL);
      const qaInitial = await qaInventory();
      await expandHistory();
      const qaHistory = { status: qaInitial.controls.toggle.exists ? 'HISTORY_TOGGLE_OBSERVED_ORIGINAL_HELPER_UNCHANGED' : 'NO_HISTORY_TOGGLE_OBSERVED', originalHelperUnmodified: true, initialStageInferred: false };
'''
FIGURE_READINESS_INSERT = r'''      // QA-only image readiness reads; original history helper unchanged; no forced state writes.
      const expectedForReadiness = expected.map(src => new URL(src.startsWith('/assets/') ? src.slice(1) : src, process.env.APP_URL).href);
      const readiness = { label, expectedURLs: expectedForReadiness, startedAt: new Date(qaFigureGateStarted).toISOString(),
        oneGateDeadlineMs: 30000, decoded: 'UNKNOWN_NOT_MEASURED', decodeCalled: false,
        initial: qaInitial, history: qaHistory, status: 'OBSERVING' };
      const initialUnexpected = readiness.initial.images.filter(img => img.inReadingFlow && img.visible && !expectedForReadiness.includes(img.fullURL));
      check(initialUnexpected.length === 0, `${width}/${label}/source-figure-initial-extra`, { initialUnexpected, readiness });
      const remaining = Math.max(0, qaFigureGateDeadline - Date.now());
      if (remaining <= 0) {
        readiness.status = 'TIMEOUT'; readiness.error = 'Single figure-gate deadline exhausted before image wait';
        check(false, `${width}/${label}/source-figure-readiness-timeout`, readiness);
      } else if (expectedForReadiness.length) {
        try {
          // Only expected target readiness is polled. Never wait for URL-set equality.
          await page.waitForFunction(({ expected, base }) => {
            const root = document.querySelector('[data-testid="textbook-reading-flow"]');
            if (!root) return false;
            const images = [...root.querySelectorAll('img')];
            return expected.every(url => images.some(img => {
              const rect = img.getBoundingClientRect(), style = getComputedStyle(img);
              return new URL(img.getAttribute('src'), base).href === url && img.isConnected && img.complete && img.naturalWidth > 0
                && rect.width > 0 && rect.height > 0 && style.display !== 'none' && !['hidden', 'collapse'].includes(style.visibility);
            }));
          }, { expected: expectedForReadiness, base: process.env.APP_URL }, { timeout: remaining });
          readiness.status = 'READY_EXPECTED_TARGETS';
        } catch (error) {
          readiness.status = 'TIMEOUT_OR_READINESS_ERROR'; readiness.error = error.message;
          check(false, `${width}/${label}/source-figure-readiness-timeout`, readiness);
        }
      } else readiness.status = 'NO_EXPECTED_TARGETS_NO_WAIT';
      readiness.final = await qaInventory(); readiness.elapsedMs = Date.now() - qaFigureGateStarted;
      (row.figureReadiness ??= []).push(readiness);
'''


def build_adapters(app, publisher, out):
    """External evidence copies only; all original source/checker bytes stay intact."""
    base = out / 'adapters'
    assert not base.exists(), 'FRESH_EXTERNAL_ADAPTER_DIRECTORY_REQUIRED'
    material_copy, publisher_copy = base / 'material', base / 'publisher'
    material_copy.mkdir(parents=True)
    publisher_copy.mkdir()
    sources = []
    for relative, expected in MATERIAL_SCRIPTS.items():
        raw = (app / relative).read_bytes()
        assert digest(raw) == expected, 'EXACT_ORIGINAL_MATERIAL_SCRIPT_REQUIRED ' + relative
        sources.append({'path': relative, 'sha256': expected})
    for name, expected in PUBLISHER_FILES.items():
        raw = (publisher / 'tools/release' / name).read_bytes()
        assert digest(raw) == expected, 'EXACT_F223_PUBLISHER_FILE_REQUIRED ' + name
        (publisher_copy / name).write_bytes(raw)
        sources.append({'path': 'publisher/tools/release/' + name, 'sha256': expected})
    n14_path = next(p for p in MATERIAL_SCRIPTS if p.endswith('verify_n14_extended.mjs'))
    n14 = (app / n14_path).read_text()
    opening = '    async function figures(label, solved) {\n      await expandHistory();\n'
    assert n14.count(opening) == 1
    n14 = n14.replace(opening, FIGURE_OPENING_AFTER, 1)
    actual_line = "      const actual = await page.getByTestId('textbook-reading-flow').locator('img:visible').evaluateAll(ns => ns.map(e => e.getAttribute('src')));"
    assert n14.count(actual_line) == 1
    n14 = n14.replace(actual_line, FIGURE_READINESS_INSERT + actual_line, 1)
    original_set_assert = 'check(JSON.stringify([...new Set(actualURLs)].sort()) === JSON.stringify([...new Set(expectedURLs)].sort()), `${width}/${label}/source-figure-gate`, { expected, actual, expectedURLs, actualURLs });'
    assert n14.count(original_set_assert) == 1, 'ORIGINAL_FULL_URL_SET_ASSERT_MUST_REMAIN'
    n14_copy = material_copy / 'verify_n14_extended.qa.mjs'
    n14_copy.write_text(n14)
    capture_path = next(p for p in MATERIAL_SCRIPTS if p.endswith('capture_current.mjs'))
    capture = (app / capture_path).read_text()
    child = "'ci-review/verify_n14_extended.mjs'"
    assert capture.count(child) == 1
    capture = capture.replace(child, json.dumps(str(n14_copy)), 1)
    capture_copy = material_copy / 'capture_current.qa.mjs'
    capture_copy.write_text(capture)
    # Bare Playwright imports in the unchanged capture code resolve from an
    # evidence-local link; no installed package or original script is changed.
    (material_copy / 'node_modules').symlink_to(app / 'node_modules', target_is_directory=True)
    checker = (publisher_copy / 'w048-publish-check.mjs').read_text()
    call = "work+'/ci-review/capture_current.mjs'"
    assert checker.count(call) == 1
    checker = checker.replace(call, json.dumps(str(capture_copy)), 1)
    checker_copy = publisher_copy / 'w048-hosted-qa-copy.mjs'
    checker_copy.write_text(checker)
    # The original-name W048 checker and all7 publisher files remain byte exact.
    # W050's retainedPublisherHashes guard sees those unchanged siblings, never
    # the additional adapted entry filename.
    for name, expected in PUBLISHER_FILES.items():
        assert digest((publisher_copy / name).read_bytes()) == expected
    write_json(out / 'ADAPTER_PROVENANCE.json', {'originalScripts': sources,
        'qaProducerSHA': os.environ.get('GITHUB_SHA'), 'materialSourceSHA': MATERIAL, 'publicPublisherSHA': PUBLISHER,
        'derived': [{'path': str(p.relative_to(out)), 'sha256': digest(p.read_bytes())}
                    for p in [n14_copy, capture_copy, checker_copy]],
        'edits': ['N14 original expandHistory helper unchanged; figures: expected-image readiness only with one30s gate deadline, all-img/control/renderer initial/final inventories, permanent initial-extra/timeout failures and original URL-set assert retained',
                  'Capture temp copy: only N14 child path redirects to N14 temp copy',
                  'Publisher temp copy: only capture child path redirects to capture temp copy'],
        'originalPublisherHashesRetained': True, 'decoded': 'UNKNOWN_NOT_MEASURED',
        'appDOMStyleSrcAnswersModifiedByAdapter': False, 'GITHUB_SHAUnmodified': True,
        'originalMainRunFailureRetained': True, 'originalFailureCauseStillHypothesis': True})
    return checker_copy


def verify(args):
    app, publisher = Path(args.app).resolve(), Path(args.publisher).resolve()
    out = Path(args.evidence).resolve()
    context = json.loads((out / 'HOSTED_QA_CONTEXT.json').read_text())
    assert context['preparation'] == 'PASS_ORIGINAL_ARTIFACT_AND_ALL_DIST_SHA'
    assert context['qaProducerSHA'] == os.environ['GITHUB_SHA']
    assert ensure_publisher_alias(app, publisher, create=False) == context['publisherToolingAlias']
    if args.job == 'w048':
        checker = build_adapters(app, publisher, out)
    else:
        checker = publisher / 'tools/release/w050-publish-check.mjs'
        assert digest(checker.read_bytes()) == PUBLISHER_FILES['w050-publish-check.mjs']
    env = {**os.environ, 'APP_URL': BASE, 'CANDIDATE_SHA': MATERIAL, 'SOURCE_SHA': MATERIAL,
           'STORAGE_KEY': STORAGE, 'VITE_STORAGE_NAMESPACE': STORAGE, 'VITE_BASE_PATH': '/kyotsu-step-web/',
           'EVIDENCE_DIR': str(out / 'checker')}
    assert env['GITHUB_SHA'] == context['qaProducerSHA']
    with (out / 'CHECKER.log').open('wb') as log:
        child = subprocess.Popen([shutil.which('node'), str(checker), 'verify'], cwd=app,
                                 env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        for chunk in iter(lambda: child.stdout.read1(65536), b''):
            log.write(chunk)
            log.flush()
            sys.stdout.buffer.write(chunk)
            sys.stdout.buffer.flush()
        code = child.wait()
    write_json(out / 'CHECKER_EXIT.json', {'job': args.job, 'exitCode': code,
        'qaProducerSHA': context['qaProducerSHA'], 'materialSourceSHA': MATERIAL, 'publicPublisherSHA': PUBLISHER,
        'originalMainRunFailureRetained': True, 'nativeReceipt': False, 'userAccepted': False})
    return code


def collect(args):
    out = Path(args.evidence).resolve()
    reports, images = out / 'reports', out / 'images'
    reports.mkdir(parents=True, exist_ok=True)
    images.mkdir(parents=True, exist_ok=True)
    index = []
    # Preserve raw checker reports and logs; do not publish source/private receipts,
    # the original ZIP, or a copy of the whole app/dist in the small reports artifact.
    for source in sorted(out.rglob('*')):
        if not source.is_file() or source.is_symlink() or reports in source.parents or images in source.parents:
            continue
        relative = source.relative_to(out)
        if 'adapters' in relative.parts:
            continue
        if source.suffix.lower() in ('.json', '.log', '.txt'):
            target = reports / relative
        elif source.suffix.lower() == '.png' and ('images' in source.parts or args.job == 'n04'):
            target = images / relative
        else:
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        index.append({'originalPath': str(relative), 'collectedPath': str(target.relative_to(out)),
                      'sha256': digest(source.read_bytes()), 'bytes': source.stat().st_size})
    write_json(reports / 'COLLECTION_INDEX.json', {'status': 'COLLECTED_ORIGINAL_OUTPUTS_NOT_A_QA_VERDICT',
        'job': args.job, 'qaProducerSHA': os.environ.get('GITHUB_SHA'), 'materialSourceSHA': MATERIAL,
        'publicPublisherSHA': PUBLISHER, 'originalMainFailureRetained': True, 'files': index,
        'limits': ['Each job has its own raw reports; success of N04 never converts a W048 failure to PASS.',
                   'The existing W048 old-revision fixture remains a local current-Page fixture, not a hosted old route.',
                   'No deployment, new native receipt, all-mode assertion or user acceptance is performed.']})


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['prepare', 'verify', 'collect'])
    parser.add_argument('--job', required=True, choices=['w048', 'n04'])
    parser.add_argument('--app')
    parser.add_argument('--publisher')
    parser.add_argument('--qa')
    parser.add_argument('--evidence', required=True)
    args = parser.parse_args()
    if args.action in ('prepare', 'verify'):
        assert args.app and args.publisher and args.qa
        if args.action == 'prepare':
            prepare(args)
        else:
            sys.exit(verify(args))
    else:
        collect(args)
