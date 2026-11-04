#!/usr/bin/env python3
"""Root-only W048 team/1 transport for approved exposed R04/R07 re-review. Never invokes agents or CODE.

Run once per ready node: bind -> ACTUAL collaboration.followup_task A/B ->
register (transcribe returned results) -> ACTUAL child finals -> collect.
Do not bind n14 before its graph dependencies and fresh input are ready.

Required config JSON:
 {"root":"/abs/repo", "store":"/abs/runtime", "work":"W-MATH-048",
  "node":"R04_PROPOSAL@n13", "inputHash":"...", "roleEpoch":1,
  "artifactRefs":["current-node CODE receipt or actual M author output"],
  "evidenceRefs":["native evidence IDs"],
  "reviewers":[
   {"logical":"A","agentRef":"/root/w048_review_a","taskRef":"unique-task-A",
    "facet":"design","claim":"teaching","reviewKind":"source-review",
    "artifactHashes":{"teaching":"frozen full target sha256"},
    "packet": {"baseNodeInputHash":"...","sourceRefs":["..."],
     "authorHistory":[{"claimRef":"teaching","facet":"design","block":"n13",
                       "semanticContributorRefs":["/root"]}],
     "contextExposure":{"forkMode":"all","authorRationaleVisibleAtFirstPass":false,
                         "priorExposure":"Actual exposure; not blind/model-independent"}},
    "reportPath":"/tmp/formal-A.json", "launchPath":"/tmp/actual-followup-A.json",
    "finalPath":"/tmp/actual-final-A.json"}, {"logical":"B", "...":"..."}]}
Use B's actual agentRef, facet=render, claim=layout,
reviewKind=learner-visible-review. Packets may include source-first initial-report
refs but initial reports MUST NOT substitute for the new fixed-target first pass.

launchPath JSON: {"toolName":"collaboration.followup_task", "target":"actual agentRef",
 "rawResult":<unaltered actual tool response>, "request":<actual request text/object>}
finalPath JSON: {"channel":"subagent-final", "rawResult":<actual child final>,
 "reportSHA256":"sha256 of exact child report file (root attestation)"}
Formal report JSON (child-owned): targetHash, sourceFirst=false, firstPass=false (approved W048 exposed re-review),
authorSeparation=true, verdict=PASS|FAIL|UNVERIFIED, firstObservations, rationale,
findings=[native schema: findingId/claimRef/facet/reason/evidenceRefs/resolution].
The final transcript must identify this exact report file/hash as the child's output.
Record the true channel; a message requires separate actual COMPLETED reconciliation
and is deliberately not supported by this small final-only driver.

CLI: python /tmp/w048_team_driver.py --config /tmp/cfg.json --state /tmp/state.json bind
Then actual tool calls; register; then actual reviews; collect --result-in pending.json
collect writes a reviewable combined result; it DOES NOT rt.submit or run native CODE.
Use --result-out to persist the result; root submits through existing claim/guard flow.
"""
import argparse
import hashlib
import json
import sys
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text())


def save(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def require(test, message):
    if not test:
        raise ValueError(message)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=('bind', 'register', 'collect'))
    parser.add_argument('--config', required=True)
    parser.add_argument('--state', required=True)
    parser.add_argument('--result-in', help='Native result object, not enclosing pending job')
    parser.add_argument('--result-out', help='Combined reviewable result; no submit')
    args = parser.parse_args()
    config = load(args.config)
    root = Path(config['root']).resolve()
    sys.path.insert(0, str(root / 'workflow'))
    from restore_w048_snapshots import restore_w048
    restore_w048()
    from runtime import Runtime
    from definitions import instantiate
    from store import digest
    from team import current_source, validate_packet, validate_assignment, check_collection
    from team_transport import bind_target, capture_harness, register_task, record_output, reconcile_task

    rt = Runtime(config['store'], root)
    work, nid = config['work'], config['node']
    require(work == 'W-MATH-048' and nid in ('R04_PROPOSAL@n13', 'R04_PROPOSAL@n14', 'R07_SEMANTIC@n13', 'R07_SEMANTIC@n14'), 'Wrong work/node')
    state = rt.state(work)
    node = instantiate(state['plan'])[nid]
    require(rt.integrity(state) is None, 'Runtime/source integrity drift')
    require(rt.task(work, nid)['input_hash'] == config['inputHash'], 'Stale native input')
    nodes = instantiate(state['plan'])
    require(all(rt.node_status(state, nodes[d]) == 'PASSED' for d in node['depends_on']), 'Node dependencies not passed')
    require(set(r['logical'] for r in config['reviewers']) == {'A', 'B'} and len(config['reviewers']) == 2, 'Exactly A/B')
    require(len({r['agentRef'] for r in config['reviewers']}) == 2, 'Distinct actual child agents')
    require(state['plan']['agent_team']['root_agent_ref'] == '/root', 'Root identity differs')
    config_hash = digest(config)
    if args.mode == 'bind':
        require(not Path(args.state).exists(), 'Do not overwrite bound state; use a new review epoch')
        rows = []
        for r in config['reviewers']:
            require((r['logical'], r['facet'], r['claim'], r['reviewKind']) in
                    {('A', 'design', 'teaching', 'source-review'), ('B', 'render', 'layout', 'learner-visible-review'), ('B', 'render', 'implemented-visible', 'learner-visible-review')}, 'Wrong review scope')
            packet = dict(r['packet'])
            packet['packetHash'] = digest({k: v for k, v in packet.items() if k != 'packetHash'})
            assignment = dict(assignmentId=f"w048-{nid}-{r['logical']}-{config['inputHash'][:10]}-e{config['roleEpoch']}",
                roleEpoch=config['roleEpoch'], node=nid, block=node['block'], facet=r['facet'],
                claimRefs=[r['claim']], performerRef=r['agentRef'], role='reviewer', inputHash=config['inputHash'],
                sourceSHA=current_source(state, node), artifactHashes=r['artifactHashes'], allowedPaths=[],
                writeMode='READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX', dependsOnTasks=[],
                budget={'tokenBudget': None}, independent=True)
            validate_assignment(assignment)
            validate_packet(packet, assignment)
            rows.append(dict(reviewer=r, assignment=assignment, packet=packet, evidenceRefs=config['evidenceRefs']))
        # Target hashing must be supported by native evidence / current node receipt.
        for row in rows:
            target = bind_target(rt, work, nid, row['assignment']['facet'], config['artifactRefs'],
                                 config['evidenceRefs'], row['assignment']['artifactHashes'])
            row['assignment']['targetManifestRef'] = target['targetManifestRef']
        save(args.state, dict(configHash=config_hash, rows=rows))
        print('Targets bound. Root must now call actual followup_task for both children, with these packets.')
        return

    bundle = load(args.state)
    require(bundle['configHash'] == config_hash, 'Config changed since target bind')
    rows = bundle['rows']
    if args.mode == 'register':
        launches = []
        for row in rows:
            r = row['reviewer']; launch = load(r['launchPath'])
            require(launch.get('toolName') == 'collaboration.followup_task' and launch.get('target') == r['agentRef'], 'Not actual matching followup')
            require(launch.get('rawResult') is not None and launch.get('request'), 'Actual request/tool response required')
            launches.append(launch)
        for row, launch in zip(rows, launches):
            r = row['reviewer']
            cap = capture_harness(rt, work, dict(agentRef=r['agentRef'], taskRef=r['taskRef'], parentRef='/root',
                toolName=launch['toolName'], rawResult=launch['rawResult'], request=launch['request'],
                attestationMethod='transcribed-tool-result'))
            harness = dict(agentRef=r['agentRef'], taskRef=r['taskRef'], parentRef='/root', logicalRole=r['logical'],
                toolResultRef=cap['artifactRef'], attestationMethod='transcribed-tool-result')
            row['harness'] = harness
            row['registration'] = register_task(rt, work, row['assignment'], row['packet'], harness)
            save(args.state, bundle)
        print('Actual followups registered. Await both exact-target child finals.')
        return

    require(args.result_in and args.result_out, 'collect requires --result-in and --result-out')
    prepared = []
    for row in rows:
        require('registration' in row, 'Not registered')
        r = row['reviewer']; raw = load(r['reportPath']); final = load(r['finalPath'])
        require(raw.get('targetHash') in row['assignment']['artifactHashes'].values(), 'Wrong report target')
        require(raw.get('authorSeparation') is True, 'Author separation not confirmed')
        reqs = [q for q in state['plan']['agent_team']['required_scopes'] if q['stage_kind'] == node['stage_kind'] and q['claimRef'] == r['claim'] and q['facet'] == r['facet']]
        require(len(reqs) <= 1, 'Ambiguous review policy')
        require(all(not q[k] or raw.get(k) is True for q in reqs for k in ('sourceFirst', 'firstPass')), 'Required review condition missing')
        require(raw.get('sourceFirst') is False and raw.get('firstPass') is False and row['packet']['contextExposure']['authorRationaleVisibleAtFirstPass'] is True, 'W048 exposed re-review must be recorded honestly')
        require(raw.get('verdict') in ('PASS', 'FAIL', 'UNVERIFIED'), 'No verdict conversion')
        require(raw.get('firstObservations') and raw.get('rationale') and isinstance(raw.get('findings'), list), 'Incomplete actual report')
        require(final.get('channel') == 'subagent-final' and final.get('rawResult') is not None, 'Actual final transcript required')
        report_sha = hashlib.sha256(Path(r['reportPath']).read_bytes()).hexdigest()
        require(final.get('reportSHA256') == report_sha, 'Root attestation must identify exact child report bytes')
        prepared.append((row, raw, final))
    outputs, registrations = [], []
    for row, raw, final in prepared:
        r, reg, a = row['reviewer'], row['registration'], row['assignment']
        first = rt.store.put(dict(assignmentHash=reg['assignmentHash'], packetHash=row['packet']['packetHash'],
            rawFirstObservations=raw['firstObservations'], rawReport=raw,
            reportFileSHA256=hashlib.sha256(Path(r['reportPath']).read_bytes()).hexdigest()))
        out = dict(kind='review', assignmentHash=reg['assignmentHash'], packetHash=row['packet']['packetHash'],
            performerRef=r['agentRef'], verdict=raw['verdict'], findings=raw['findings'], claimRef=r['claim'],
            facet=r['facet'], targetHash=raw['targetHash'], reviewKind=r['reviewKind'], authorSeparation=True,
            sourceFirst=raw['sourceFirst'], firstPass=raw['firstPass'], currentObservationsArtifactRef=first, evidenceRefs=row['evidenceRefs'], rationale=raw['rationale'])
        cap = capture_harness(rt, work, dict(agentRef=r['agentRef'], taskRef=r['taskRef'],
            attestationMethod='transcribed-tool-result', channel='subagent-final', rawResult=final['rawResult'],
            report=raw, structuredOutputHash=digest(out)))
        out['harnessOutputRef'] = cap['artifactRef']
        recorded = record_output(rt, work, reg['registrationRef'], out)
        reconcile_task(rt, work, reg['registrationRef'], 'COMPLETED', [cap['artifactRef']])
        outputs.append(recorded['outputRef']); registrations.append(reg['registrationRef'])
    result = load(args.result_in)
    result['teamCollection'] = dict(submissionActor='M', registrationRefs=registrations, outputRefs=outputs)
    # Preserve original result verdict, and reject PASS with failed/unverified child reports.
    check_collection(rt, work, node, result)
    save(args.result_out, result)
    print('Team collection checked and saved. No native submit/CODE invocation performed.')


if __name__ == '__main__':
    main()
