"""M-only revalidation through the next R04 preparation; no product patch/agent calls.

Existing immutable source/IR and historical diagnoses are retained. Native service
cache reuse is allowed by the unmodified runtime, with fresh node-bound receipts.
R04 is NEVER submitted here: bind/register actual new A/B tasks and collect their
reports before M decides its final verdict. Re-run only after inspecting current
claims; an interrupted invocation must be reconciled, never blindly repeated.
"""
from __future__ import annotations

import argparse
import base64
import copy
import hashlib
import gzip
import json
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
B = HERE.parent
ROOT = B.parents[2]
sys.path.insert(0, str(ROOT / "workflow"))
from definitions import instantiate
from capabilities import implementation_hash
from runner import run_code
from runtime import Runtime
from store import canonical, digest
from views import render

WORK = "W-MATH-048"
SCROLL_CAUSE = "answer-focus-horizontal-scroll-retained"


def load(path):
    return json.loads(Path(path).read_text())


def save(path, value):
    text = json.dumps(value, ensure_ascii=False, indent=2) + "\n"
    if Path(path).name.endswith("_CODE.json") and len(text.encode()) > 500000:
        raw = text.encode(); target = Path(path).with_suffix(".json.gz")
        target.write_bytes(gzip.compress(raw, mtime=0))
        assert gzip.decompress(target.read_bytes()) == raw
        Path(str(target) + ".sha256").write_text(hashlib.sha256(raw).hexdigest() + "  " + Path(path).name + "\n")
    else:
        Path(path).write_text(text)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def evidence(rt, paths):
    return [rt.evidence(WORK, "file", {"path": str(p.relative_to(ROOT)), "sha256": sha(p)},
                        source_ref="P003 retained content plus approved scroll supplement; prototype evidence is not current R07",
                        verification_level="local_execution") for p in dict.fromkeys(paths)]


def fresh_result(job, refs, fields):
    req = job["aiRequest"]
    return dict(verdict="PASS", evidence_refs=refs, capability_receipts=job["receipts"],
                aiReview={"requestHash": req["requestHash"], "inputHash": req["task"]["input_hash"],
                          "reviewer": "M executing reviewed current-source investigation; R04 A/B review remains separate",
                          "evidence": refs}, **fields)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent-a", default="/root/review_a")
    parser.add_argument("--agent-b", default="/root/review_b")
    parser.add_argument("--store", help="Exact hash-verified local execution replica; M syncs append-only events back after completion")
    parser.add_argument("--defer-intermediate-views", action="store_true", help="Read exact native next each step; render all views once at the final checkpoint")
    args = parser.parse_args()
    assert args.agent_a != args.agent_b
    rt = Runtime(Path(args.store) if args.store else ROOT / "work/items/W-MATH-032-n07-semantic-repair/runtime", ROOT)
    initial = rt.state(WORK)
    assert not initial["claims"], "Inspect/reconcile an existing claim before rerunning"
    assert rt.integrity(initial) is None, rt.integrity(initial)
    assert initial["plan"]["proposal"]["id"] == "P-W048-003-SCROLL-001"
    assert rt.approval(initial), "Register actual approved supplement first"
    composition = initial["plan"]["approved_supplement_composition"]
    assert composition["retainedProposal"]["id"] == "P-W048-003"
    assert any(x["id"] == "W048-N13-ANSWER-SCROLL-001" for x in initial["issues"].values())
    patch = load(HERE / "PROPOSED_PATCH.json")
    assert digest(patch) == composition["supplementPatchHash"]
    page_row = patch["files"][0]
    assert sha(ROOT / page_row["path"]) == initial["candidate_manifest"][page_row["path"]]
    assert sha(ROOT / page_row["path"]) in (page_row["before_sha256"], page_row["after_sha256"])
    actual = {p: sha(ROOT / p) for p in initial["candidate_manifest"]}
    assert actual == initial["candidate_manifest"]
    protected = {p: sha(ROOT / p) for p in initial["plan"]["protected_manifest"]}
    rules = {p: sha(ROOT / p) for p in initial["plan"]["rules"]}
    assert protected == initial["plan"]["protected_manifest"] and rules == initial["plan"]["rules"]
    for block in initial["plan"]["blocks"]:
        assert block["content_design_hash"] == composition["retainedContentDesignHashes"][block["id"]]
    out = HERE / "evidence" / ("registered-" + initial["plan"]["proposal"]["hash"][:12] + "-svc-" + implementation_hash(rt)[:12])
    out.mkdir(exist_ok=True)
    check = out / "CURRENT_MANIFEST_CHECK.json"
    save(check, {"status": "PASS_HASH_BOUNDARY_ONLY", "candidate": actual, "protected": protected,
                 "rules": rules, "pageScrollApplied": actual[page_row["path"]] == page_row["after_sha256"],
                 "limits": "Not browser/semantic acceptance. Old source remains immutable. N14 leaf status measured separately."})
    basepaths = [B / "P003_FINAL.md", B / "P-W048-SCROLL-001.md", HERE / "APPROVAL.json",
                 HERE / "PROPOSED_PATCH.json", HERE / "SCROLL_FIX.diff", HERE / "REVIEW_A.md", HERE / "REVIEW_B.md",
                 HERE / "evidence/SUMMARY.json", HERE / "evidence/MANIFEST.json", check]
    basepaths += sorted((HERE / "evidence").glob("FONT_DIAGNOSIS_*.json.gz"))
    basepaths += [HERE / "evidence/FONT_EXTENDED_REPORT.json.gz"]
    refs = evidence(rt, basepaths)
    supplement = {"issue": "W048-N13-ANSWER-SCROLL-001", "cause": SCROLL_CAUSE,
                  "reproduction": "320px normal wrong/correct Q04 interaction retains scrollLeft32 on negative branch; reload or zeroing restores48.375px equation starts.",
                  "prototype": "Isolated exact after patch: four widths aligned; 320px unrelated manual20 retained. Prototype checks are not current product R07 or N14 dynamic validation.",
                  "remainingChecks": ["wrong-only immediate scroll", "legacy revisions no-op", "new product CI", "N14r11 after leaf application"],
                  "separation": "Historical P003 pedagogy/data causes remain separate from this browser focus/scroll cause."}
    prepared = []
    while True:
        nxt = rt.next(WORK)
        node = nxt.get("task", {}).get("node", {})
        stage, bid = node.get("stage_kind"), node.get("block")
        if nxt.get("status") != "READY" or stage not in {"R01_CAPTURE", "R02_CAUSE", "R03_IMPACT", "R04_PROPOSAL"}:
            break
        assert bid in ("n13", "n14")
        c = bid.upper()
        ir = load(B / (c + "_FULL_IR.json"))
        source = load(B / ("evidence/" + c + "_SOURCE_INDEX.json"))
        unit = load(B / (c + "_CANDIDATE.json"))["unit"]
        localrefs = refs + evidence(rt, [B / (c + "_FULL_IR.json"), B / (c + "_ROW_PROJECTION.json"),
                                        B / (c + "_LEARNER_REVIEW.json"), B / ("evidence/" + c + "_SOURCE_INDEX.json")])
        oldcausepath = B / ("evidence/R02_CAUSE_" + bid + "_RESULT.json")
        oldcause = load(oldcausepath)
        localrefs += evidence(rt, [oldcausepath])
        inputs, fields = {}, {}
        state = rt.state(WORK)
        leaf = "src/data/textbook/math/numbers/" + bid + "Lesson.ts"
        baseline = next(x for x in load(B / "r3/PROPOSED_PATCH_INDEX.json")["files"] if x["path"] == leaf)
        leaf_applied = actual[leaf] == baseline["after_sha256"]
        assert actual[leaf] in (baseline["before_sha256"], baseline["after_sha256"])
        disposition = {"leafApplied": leaf_applied, "leafSHA256": actual[leaf], "pageSHA256": actual[page_row["path"]],
                       "scrollApplied": actual[page_row["path"]] == page_row["after_sha256"], "R07": "UNVERIFIED"}
        if stage == "R01_CAPTURE":
            inputs = {"source.fixed": {}, "feedback.capture": {}}
            fields = {"complaint": "Resume approved P003 and SCROLL-001. Issue registration invalidated prior R01; capture both historical教材 defects and new scroll observation without conflation.",
                      "before_evidence": [str(x.relative_to(ROOT)) for x in basepaths],
                      "reproduction": {"historical": oldcause["symptoms"], "current": disposition, "newScroll": supplement},
                      "target_versions": {"original": state["plan"]["source_sha"], "candidate": state["candidate_sha"], "actualManifest": actual}}
        elif stage == "R02_CAUSE":
            corpus = load(ROOT / "work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json")["cases"]
            inputs = {"case.retrieve": {"python": sys.executable, "request": {"cache": "/tmp/w048-revalidation-encoder", "encoder": {"local_only": True},
                        "query": "絶対値 二枝 境界 端点 独立判断 ヒント 原典 数式 回答 focus 横スクロール",
                        "cases": corpus, "scope": {"subject": "math", "mode": "textbook"}}},
                      "ir.verify": ir, "source.audit": {"coverage": ir["coverage"], "sourceBlocks": source["blocks"], "candidate": ir}, "novice.audit": {"ir": ir}}
            fields = {k: copy.deepcopy(oldcause[k]) for k in ("symptoms", "confirmed_causes", "hypotheses", "missing_learning_actions", "root_cause_signatures", "case_dispositions")}
            fields["historicalP003Diagnosis"] = {k: copy.deepcopy(oldcause[k]) for k in ("symptoms", "confirmed_causes", "root_cause_signatures")}
            fields["symptoms"] = ["P003 baseline symptoms below are historical where leafApplied=true; no claim of recurrence.", *fields["symptoms"], "New separate scroll cause is measured on N13r5 only; N14r11 is a shared-code risk, not a reproduced N14 defect."]
            fields["confirmed_causes"].append("N13r5 Q04: answering/focus movement leaves formula container horizontally scrolled; normalization removes offset without changing equation data.")
            fields["root_cause_signatures"] = list(dict.fromkeys([*fields["root_cause_signatures"], SCROLL_CAUSE]))
            fields.update(currentDisposition=disposition, scrollCause=supplement)
        elif stage == "R03_IMPACT":
            inputs = {"impact.inventory": {}}
            fields = {"source_inventory": list(state["plan"]["source_manifest"]), "unknowns": [],
                      "scope": "Pre-design inventory: unchanged P003 content plus shared revision-scoped scroll supplement. Not post-fix sweep or browser PASS."}
        else:
            teaching = {"solution": [{"id": n["id"], "inputFacts": n.get("requires", []), "outputFacts": n.get("produces", []),
                                      "goal": n.get("goal", ""), "operation": n.get("operation", ""), "basisRefs": n.get("sourceRefs", [])} for n in ir["nodes"]],
                        "knowledge": ir["initialFacts"], "options": {"budget": 1}}
            figures = [{"id": f["id"], "sourcePath": "public" + f["src"], "sourceRef": source["blocks"][0]["id"],
                        "purpose": f["caption"], "howToRead": f["alt"], "visibleWhen": "Unchanged original figure anchor and preceding interaction gates",
                        "contentHash": hashlib.sha256(base64.b64encode((ROOT / ("public" + f["src"])).read_bytes())).hexdigest()}
                       for f in unit["sections"][0].get("figures", [])]
            inputs = {"teaching.plan": teaching, "step.plan": teaching, "blank.plan": {"nodes": ir["nodes"]}, "prose.compose": ir,
                      "text.verify": ir, "figure.verify": {"figures": figures}, "ir.verify": ir,
                      "source.audit": {"coverage": ir["coverage"], "sourceBlocks": source["blocks"], "candidate": ir}, "novice.audit": {"ir": ir}}
        assert set(inputs) == set(node["capability_requests"]), (node["id"], node["capability_requests"])
        job = run_code(rt, WORK, inputs)
        outputs = {rt.store.get(ref)["capability"]: rt.store.get(rt.store.get(ref)["output"]) for ref in job["receipts"]}
        save(out / (c + "_" + stage + "_CODE.json"), {"job": job, "outputs": outputs})
        assert all(x["status"] in ("PASS", "NEEDS_AI_REVIEW") for x in outputs.values()), outputs
        if stage == "R02_CAUSE":
            retrieval = outputs["case.retrieve"]
            fields["retrievalDisposition"] = {k: retrieval.get(k) for k in ("retrievalMode", "ranked", "modelRan", "trainingRun", "unavailableReason", "corpusHash")}
            fields["retrievalDisposition"]["limits"] = "SCOPED_CATALOG is unranked explicit local-only fallback; no model inference/training or quality acceptance claimed. Preserve fresh actual service output."
        if stage == "R03_IMPACT":
            rows = []
            for entry in outputs["impact.inventory"]["inventory"]:
                p = entry["artifact"]
                actual_hash = sha(ROOT / p)
                assert actual_hash == state["candidate_manifest"][p]
                affected = p.endswith(("n13Lesson.ts", "n14Lesson.ts", "src/domain/textbook.ts", "src/pages/TextbookUnitPage.tsx"))
                rows.append({**entry, "originFinding": "Retained P003 source-first diagnosis; separate SCROLL-001 observation", "rootCauseSignature": SCROLL_CAUSE if p == page_row["path"] else "retained-P003-content-and-revision-scoped-support",
                             "causeScopes": ["P003 original pedagogy"] + (["SCROLL-001 shared Page rendering"] if p == page_row["path"] else []),
                             "version": state["plan"]["source_sha"], "actualSHA256": actual_hash, "approvedCreationWork": "W-MATH-003 / W-MATH-048 P003 and approved SCROLL-001 supplement",
                             "evidence_refs": localrefs, "status": "AFFECTED" if affected else "NOT-AFFECTED", "phase": node["phase"],
                             "disposition": "Both blocks share Page. Scroll branch only N13r5/N14r11; other revisions planned no-op, dynamic regression pending." if p == page_row["path"] else "P003 existing applied/pending leaf or support retained; actual hash recorded." if affected else "Unchanged bytes; no new scroll call path or content change identified."})
            fields["impact_rows"] = rows
        if stage != "R04_PROPOSAL":
            result = fresh_result(job, localrefs, fields)
            save(out / (c + "_" + stage + "_RESULT.json"), result)
            rt.submit(WORK, node["id"], job["claimToken"], result)
            if not args.defer_intermediate_views:
                render(rt, WORK, B / "generated")
            print("SUBMITTED " + node["id"], flush=True)
            continue

        # Prepare R04 only. No team/harness registration or PASS submission here.
        oldpending = load(B / ("evidence/CURRENT_" + c + "_R04_PENDING.json"))
        result = copy.deepcopy(oldpending["result"])
        for key in ("teamCollection", "aiReview", "capability_receipts", "evidence_refs"):
            result.pop(key, None)
        result.update(verdict="UNVERIFIED", evidence_refs=localrefs, capability_receipts=job["receipts"],
                      proposal_hash=state["plan"]["proposal"]["hash"], patch_plan="scroll-review/PROPOSED_PATCH.json" if bid == "n13" else "r3/N14_PROPOSED_PATCH.json",
                      verification_plan="Approved SCROLL-001 + P003: new product four-width CI and wrong-only/correct/manual-row/no-op checks; N14 validation after leaf application.",
                      scrollSupplement=supplement, draftStatus="UNSUBMITTED: actual fresh A/B review and M semantic verdict required")
        result["aiReview"] = {"requestHash": job["aiRequest"]["requestHash"], "inputHash": job["aiRequest"]["task"]["input_hash"],
                              "reviewer": "PENDING M integration of actual new A/B reports", "evidence": localrefs}
        pending = out / (c + "_R04_PENDING.json")
        resultpath = out / (c + "_R04_RESULT_DRAFT.json")
        save(pending, {"job": job, "result": result})
        save(resultpath, result)
        config = copy.deepcopy(load(B / ("evidence/CURRENT_" + c + "_R04_TEAM_CONFIG.json")))
        config.update(root=str(ROOT), store=str(rt.store.root), inputHash=job["aiRequest"]["task"]["input_hash"],
                      artifactRefs=job["receipts"], evidenceRefs=localrefs)
        config["roleEpoch"] += 1
        h = config["inputHash"][:12]
        for reviewer in config["reviewers"]:
            logical = reviewer["logical"]
            reviewer["agentRef"] = args.agent_a if logical == "A" else args.agent_b
            reviewer["taskRef"] = "W048-SCROLL-R04-" + bid + "-" + logical + "-" + h
            reviewer["artifactHashes"] = {reviewer["claim"]: sha(B / (c + "_LEARNER_REVIEW.json")), "scrollSupplement": sha(HERE / "PROPOSED_PATCH.json")}
            packet = reviewer["packet"]
            packet["baseNodeInputHash"] = config["inputHash"]
            packet.pop("packetHash", None)
            packet["contextExposure"] = {"forkMode": "all", "authorRationaleVisibleAtFirstPass": True,
                                          "priorExposure": "Approved exposed nonauthor re-review; actual A/B already saw prior design and scroll proposal. No blind/first-pass/model independence claim."}
            context_ref = rt.state(WORK).get("block_contexts", {}).get(bid, {}).get(reviewer["facet"])
            if context_ref:
                # Export the actual registered context losslessly. Its file hash
                # equals the Store content address; no invented provenance.
                context_path = out / (c + "_" + reviewer["facet"] + "_CONTEXT.json")
                context_path.write_bytes(canonical(rt.store.get(context_ref)))
                assert sha(context_path) == context_ref
                config["evidenceRefs"].extend(evidence(rt, [context_path]))
                reviewer["artifactHashes"][reviewer["facet"] + "Context"] = context_ref
            reviewer["reportPath"] = str(out / (c + "_R04_" + logical + "_" + h + ".json"))
            reviewer["launchPath"] = str(out / (c + "_R04_LAUNCH_" + logical + "_" + h + ".json"))
            reviewer["finalPath"] = str(out / (c + "_R04_FINAL_" + logical + "_" + h + ".json"))
        configpath = out / (c + "_R04_TEAM_CONFIG.json")
        save(configpath, config)
        prepared.append({"node": node["id"], "pending": str(pending), "draftResult": str(resultpath), "teamConfig": str(configpath),
                         "nextAction": "bind_target then actual new A/B followups/register/finals/collect. M must set reviewed verdict; this driver does not submit R04."})
        render(rt, WORK, B / "generated")
        break
    save(out / "PREPARED.json", {"prepared": prepared, "next": rt.next(WORK), "productChanged": False})
    print(json.dumps({"prepared": prepared, "next": rt.next(WORK), "productChanged": False}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
