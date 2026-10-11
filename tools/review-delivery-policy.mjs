/** Checks review-delivery RECORD completeness only: not a live URL or human approval proof. */
export function checkReviewDelivery(w = {}) {
  const fail = reason => ({recordComplete: false, userReviewReady: false, reason})
  if (!['APP_UI','CODE','DOCUMENT','OTHER'].includes(w.reviewType)) return fail('REVIEW_TYPE_MISSING')
  if (!w.approvedScope) return fail('SCOPE_NOT_APPROVED')
  if (w.proposedMeansOutsideScope) return fail('REVISE_PROPOSAL_REQUIRED')
  if (!w.deliveryPlan) return fail('DELIVERY_PLAN_MISSING')
  if (w.reviewType === 'APP_UI') {
    if (!w.appUrl) return fail('PREVIEW_MISSING')
    let u
    try { u = new URL(w.appUrl) } catch { return fail('INVALID_APP_URL') }
    if (!['http:','https:'].includes(u.protocol)) return fail('INVALID_APP_URL')
    if (['localhost','127.0.0.1','0.0.0.0'].includes(u.hostname)) return fail('LOCAL_ONLY')
    if (u.hostname === 'github.com' || /\.(zip|cmd|ps1)$/i.test(u.pathname)) return fail('NOT_AN_APP')
    if (!/^[0-9a-f]{40}$/i.test(w.targetCommit ?? '')) return fail('TARGET_COMMIT_MISSING')
    if (w.servedCommit !== w.targetCommit) return fail('COMMIT_MISMATCH')
    const b=w.browserEvidence
    if (!b || b.status !== 'PASS' || b.checkedUrl !== w.appUrl ||
        b.checkedCommit !== w.targetCommit || b.routeAndAssets !== 'PASS' || !b.evidenceUrl)
      return fail('BROWSER_EVIDENCE_MISSING')
    return {recordComplete:true,userReviewReady:false,reason:'RECORD_ONLY_EXTERNAL_BROWSER_CHECK_REQUIRED'}
  }
  if (w.reviewType === 'CODE') {
    if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/.test(w.reviewUrl ?? ''))
      return fail('CODE_PR_MISSING')
  } else if (!/^https:\/\//.test(w.reviewUrl ?? '')) return fail('ARTIFACT_URL_MISSING')
  return {recordComplete:true,userReviewReady:false,reason:'RECORD_ONLY_HUMAN_REVIEW_REQUIRED'}
}
