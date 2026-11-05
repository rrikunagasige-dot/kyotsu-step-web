"""Verify the approved prose delta and untouched grading/source contracts."""
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
WORK = Path(__file__).resolve().parent


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify():
    evidence = WORK / 'evidence'
    packet = read(evidence / 'PROPOSED_TEXT.json')
    patch = read(evidence / 'APPROVED_PATCH.json')
    refinement = read(evidence / 'LAYOUT_REFINEMENT.json') if (evidence / 'LAYOUT_REFINEMENT.json').exists() else None
    for change in patch['files']:
        expected = change['after_sha256']
        if refinement and change['path'] == refinement['path']:
            assert expected == refinement['base_after_sha256']
            assert refinement['after_text'].startswith(change['after_text'])
            assert hashlib.sha256(refinement['after_text'].encode()).hexdigest() == refinement['after_sha256']
            expected = refinement['after_sha256']
        assert sha(ROOT / change['path']) == expected, change['path']
    for path, expected in read(evidence / 'PROTECTED_BASELINE.json').items():
        assert sha(ROOT / path) == expected, path
    current = read(ROOT / packet['sourceFile'])
    restored = copy.deepcopy(current)
    changed = set()
    for change in packet['changes']:
        node = next(b for b in restored['n04']['readingFlow'] if b['id'] == change['id'])
        assert node['parts'] == change['afterParts'], change['id']
        node['parts'] = change['beforeParts']
        changed.add(change['id'])
    # Reconstruct the original object through the exact original before hash.
    # The approved patch preserves JSON formatting, so these four replacements
    # can reconstruct its original raw bytes as well as semantic structure.
    raw = (ROOT / packet['sourceFile']).read_text()
    for change in packet['changes']:
        after = next(b for b in current['n04']['readingFlow'] if b['id'] == change['id'])
        before = next(b for b in restored['n04']['readingFlow'] if b['id'] == change['id'])
        old = '\n'.join('      ' + line for line in json.dumps(after, ensure_ascii=False, indent=2).splitlines())
        new = '\n'.join('      ' + line for line in json.dumps(before, ensure_ascii=False, indent=2).splitlines())
        assert raw.count(old) == 1
        raw = raw.replace(old, new, 1)
    assert hashlib.sha256(raw.encode()).hexdigest() == packet['sourceFileSHA256']
    assert json.loads(raw) == restored
    assert len(changed) == 4
    unit = current['n04']
    assert unit['baselineRevision'] + unit['editionIncrement'] == 7
    formula_count = sum(b['type'] == 'formula' for b in unit['readingFlow'])
    assert formula_count == 105
    choices = [part['itemId'] for block in unit['readingFlow'] for part in block.get('parts', []) if part['type'] == 'choice']
    assert len(choices) == len(set(choices)) == 59
    assert choices[:5] == ['n04-q01-p1', 'n04-q01-p2', 'n04-q01-p3', 'n04-q01-p4', 'n04-01']
    result = {'status': 'PASS_EXACT_APPROVED_DELTA_AND_PROTECTED_BYTES',
              'changedProseBlocks': sorted(changed), 'formulaCount': formula_count,
              'judgments': len(choices), 'pilotJudgments': 5, 'followingJudgments': 54,
              'protectedFiles': len(read(evidence / 'PROTECTED_BASELINE.json')),
              'originalRawBytesReconstructed': True, 'revision': 7}
    print(json.dumps(result, ensure_ascii=False))
    return result


if __name__ == '__main__':
    verify()
