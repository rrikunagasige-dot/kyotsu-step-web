"""教師ラベルへの誤採用を拒否する。意味の妥当性は判定しない。"""
import json
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent

def assess(case):
    reasons=[]
    if case['quality_label'] not in ('POSITIVE','NEGATIVE'):
        reasons.append('品質ラベル未確定')
    if case['evidence_level'] not in ('current_user_feedback_with_numbered_image','primary_conversation_bound_to_artifact'):
        reasons.append('ユーザー発言原典と対象成果物の直接対応が未回復')
    if not case['artifact_version']:
        reasons.append('評価対象の版が未確定')
    if not case['source_url']:
        reasons.append('原成果物への固定参照が未確定')
    if case['later_events']:
        reasons.append('後続評価との整合確認が必要')
    if case['feedback_signal'] in ('CONTINUE_ONLY','DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY','NO_TARGETED_EVALUATION') and case['quality_label']!='UNKNOWN':
        reasons.append('続行・技術合格・無評価から品質を推定している')
    return reasons

def main():
    data=json.loads((ROOT/'cases.json').read_text())
    cases=data['cases']
    errors=[]
    if len({c['id'] for c in cases})!=len(cases): errors.append('ID重複')
    for c in cases:
        if c['quality_label'] not in data['quality_labels']: errors.append(c['id']+': 不正ラベル')
        if c['training_eligible'] != (not assess(c)): errors.append(c['id']+': 採用状態不一致')
        if c['exclusion_reasons'] != assess(c): errors.append(c['id']+': 除外理由不一致')
        if c['split']=='HOLDOUT': errors.append(c['id']+': 今回は全例収集・検討済みなので未使用評価不可')
        if c['training_eligible'] and not c.get('source_anchor'): errors.append(c['id']+': 評価位置なし')
    report=dict(total=len(cases),by_subject=dict(Counter(c['subject'] for c in cases)),
                by_label=dict(Counter(c['quality_label'] for c in cases)),
                feedback_signals=dict(Counter(c['feedback_signal'] for c in cases)),
                direct_evidence_eligible=sum(c['training_eligible'] for c in cases),
                positive_training_cases=sum(c['training_eligible'] and c['quality_label']=='POSITIVE' for c in cases),
                training_run=False,heldout_evaluation=False,
                integrity_check='FAIL' if errors else 'PASS')
    (ROOT/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(report=report,errors=errors),ensure_ascii=False,indent=2))
    raise SystemExit(bool(errors))

if __name__=='__main__': main()
