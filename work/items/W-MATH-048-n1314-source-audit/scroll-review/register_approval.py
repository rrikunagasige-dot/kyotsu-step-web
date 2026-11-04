"""M-only registration of the approved scroll supplement; never patches product files.

Run once after checking the live branch and approval provenance. Existing P003
events remain immutable. The new fingerprint composes its unchanged content with
the explicitly approved Page-only supplement, rather than inventing reapproval.
"""
from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
WORK_DIR = HERE.parent
ROOT = WORK_DIR.parents[2]
sys.path.insert(0, str(ROOT / "workflow"))

from definitions import instantiate
from runtime import Runtime
from store import digest
from views import render


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    work = "W-MATH-048"
    rt = Runtime(ROOT / "work/items/W-MATH-032-n07-semantic-repair/runtime", ROOT)
    state = rt.state(work)
    assert not state["claims"], "Reconcile outstanding claims before registration"
    assert rt.integrity(state) is None, rt.integrity(state)
    old_plan = copy.deepcopy(state["plan"])
    assert old_plan["proposal"]["id"] == "P-W048-003", "One-shot registration; inspect existing revision before retry"
    prior_approval = rt.approval(state)
    assert prior_approval, "Preserve verified P003 approval before composing supplement"
    approval = read(HERE / "APPROVAL.json")
    assert approval["proposal"] == "P-W048-SCROLL-001"
    assert approval["quote"] and approval["source_ref"] and approval["acceptance"] is False
    patch = read(HERE / "PROPOSED_PATCH.json")
    assert len(patch["files"]) == 1
    row = patch["files"][0]
    assert row["path"] == "src/pages/TextbookUnitPage.tsx"
    assert sha(ROOT / row["path"]) == row["before_sha256"]
    assert hashlib.sha256(row["after_text"].encode()).hexdigest() == row["after_sha256"]
    proposal_path = WORK_DIR / "P-W048-SCROLL-001.md"
    composite = {
        "schema": "w048-approved-scroll-composition/1",
        "retainedProposal": old_plan["proposal"],
        "retainedApprovalEvent": prior_approval["id"],
        "supplementProposal": {"id": approval["proposal"], "sha256": sha(proposal_path)},
        "supplementPatchHash": digest(patch),
        "retainedContentDesignHashes": {b["id"]: b["content_design_hash"] for b in old_plan["blocks"]},
        "retainedApprovalBundles": old_plan["approval_bundles"],
        "approvalSource": approval["source_ref"],
    }
    evidence_paths = [proposal_path, HERE / "APPROVAL.json", HERE / "PROPOSED_PATCH.json", HERE / "SCROLL_FIX.diff", HERE / "REVIEW_A.md", HERE / "REVIEW_B.md"]
    refs = [rt.evidence(work, "file", {"path": str(p.relative_to(ROOT)), "sha256": sha(p)},
                        source_ref="Approved P-W048-SCROLL-001 supplement: " + approval["source_ref"],
                        verification_level="local_execution") for p in evidence_paths]
    plan = copy.deepcopy(old_plan)
    plan["proposal"] = {"id": "P-W048-003-SCROLL-001", "hash": digest(composite)}
    plan["approved_supplement_composition"] = composite
    assert len(plan["approval_bundles"]) == 1 and set(plan["approval_bundles"][0]["block_ids"]) == {"n13", "n14"}
    plan["approval_bundles"][0]["proposal_hash"] = plan["proposal"]["hash"]
    next(b for b in plan["blocks"] if b["id"] == "n13")["patch_hash"] = digest(patch)
    for key in ("source_sha", "source_manifest", "rules", "scope", "agent_team"):
        assert plan.get(key) == old_plan.get(key), key
    assert next(b for b in plan["blocks"] if b["id"] == "n14") == next(b for b in old_plan["blocks"] if b["id"] == "n14")
    rt.revise(work, plan)
    render_ref = rt.store.put({"kind": "approved-shared-page-scroll-supplement", "composition": composite,
                               "pageBeforeSHA256": row["before_sha256"], "pageAfterSHA256": row["after_sha256"],
                               "affectedBlocks": ["n13", "n14"], "productApplied": False})
    for bid in ("n13", "n14"):
        rt.block_context(work, bid, {"render": render_ref}, refs)
    user_ref = rt.user(work, "approve_proposal", approval["quote"], plan["proposal"]["hash"], approval["source_ref"],
                       event_id="W048-SCROLL-001-APPROVAL-20261104", bundle_ids=[plan["approval_bundles"][0]["id"]],
                       verification_level="conversation_transcribed")
    current = rt.state(work)
    assert rt.approval(current)["id"] == user_ref
    assert sha(ROOT / row["path"]) == row["before_sha256"], "Registration must not patch product"
    (WORK_DIR / "WORKFLOW_PLAN.json").write_text(json.dumps(current["plan"], ensure_ascii=False, indent=2) + "\n")
    render(rt, work, WORK_DIR / "generated")
    statuses = {nid: rt.node_status(current, node) for nid, node in instantiate(current["plan"]).items()}
    print(json.dumps({"registered": plan["proposal"], "approvalEvent": user_ref,
                      "retainedP003ApprovalEvent": prior_approval["id"], "productApplied": False,
                      "next": rt.next(work), "nodeStatuses": statuses}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
