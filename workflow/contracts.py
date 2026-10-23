"""結果の内容を証明せず、必要な構造・出典・未解決の扱いを強制する。"""
from pathlib import Path,PurePosixPath
import hashlib

class Rejected(ValueError):pass
def need(test,message):
    if not test:raise Rejected(message)

def relative(path):
    need(isinstance(path,str) and path and '\\' not in path,'パスは相対POSIX形式')
    p=PurePosixPath(path)
    need(not p.is_absolute() and '..' not in p.parts and str(p)==path and '.git' not in p.parts,'範囲外または非正規のパス')
    return p

def file(root,path):
    p=Path(root).resolve()/relative(path)
    need(p.resolve().is_relative_to(Path(root).resolve()),'正本ルート外への参照')
    cursor=p
    while cursor!=Path(root).resolve():
        need(not cursor.is_symlink(),'シンボリックリンクはこの実行器では対象外');cursor=cursor.parent
    return p

def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def manifest(root,paths):return {p:sha(file(root,p)) for p in paths}

def plan_check(p):
    for k in ['work_id','profile','command','subject','mode','source_sha','rules','proposal','scope','blocks','source_manifest']:
        need(k in p,'計画の必須項目なし:'+k)
    need(p['profile'] in ('material','technical'),'Work種別が不明')
    need(p['command'] in ('CMD-WORK-001','CMD-WORK-002','GOVERNANCE'),'命令が未登録')
    need(p['profile']=='technical' or p['command'] in ('CMD-WORK-001','CMD-WORK-002'),'教材の命令が不正')
    need(len(p['source_sha'])==40 and all(c in '0123456789abcdef' for c in p['source_sha']),'元SHAが不正')
    need(p['blocks'] and len({b['id'] for b in p['blocks']})==len(p['blocks']),'ブロックが空または重複')
    for b in p['blocks']:
        need(b['sources'] and set(b['sources'])<=set(p['source_manifest']),'ブロックの原資料が未登録')
    for name in p['source_manifest']:relative(name)
    for name in p['rules']:relative(name)
    for name in p['scope']['paths']:relative(name.removesuffix('/'))
    need(p['proposal'].get('hash') and p['proposal'].get('id'),'具体的な提案版が必要')

def result_check(node,result):
    need(isinstance(result,dict),'結果はオブジェクト')
    for k in node['required']:need(k in result and result[k] is not None,'分析結果の必須項目なし:'+k)
    need(result.get('evidence_refs'),'分析結果の証拠参照がない')
    need(result.get('verdict') in ('PASS','UNVERIFIED','FAIL'),'判定はPASS/FAIL/UNVERIFIED')
    need(not result.get('approved'),'分析結果のapprovedフラグを承認へ転用しない')
    if result.get('unknowns') or result.get('unresolved'):
        need(result['verdict']!='PASS','未解決をPASSにしている')
    for key in node['required']:
        if key not in ('unknowns','unresolved','figures','case_updates','rule_links','regression_links','hypotheses','missing_learning_actions'):
            need(bool(result[key]),'分析結果が空:'+key)
    if node['id'].startswith('R03_'):
        need(result['impact_rows'],'影響表が空')
        for row in result['impact_rows']:
            need(row.get('status') in ('AFFECTED','NOT-AFFECTED','UNVERIFIED'),'影響の判定が未定義')
            need(row.get('artifact') and row.get('version') and row.get('evidence_refs'),'影響表の版・出典が不足')
            need(row['status']!='UNVERIFIED' or result['verdict']!='PASS','資料不足を影響なしへ読み替えない')
    if node['actor']=='AUDITOR':
        need(result['independence'].get('method') and result['independence'].get('reviewer'),'独立性の根拠がない')
        for row in result['audit_rows']:
            need(row.get('status') in ('PASS','FAIL','UNVERIFIED','OUT_OF_SCOPE'),'監査判定が不正')
            need(row.get('evidence_refs') and row.get('surface'),'監査証拠が不足')
            need(row['status'] not in ('FAIL','UNVERIFIED') or result['verdict']!='PASS','未完監査を合格にしている')
    if node['id'].startswith(('L01','R08')):
        for case in result['case_updates']:
            need(case.get('id') and case.get('disposition') in ('EXISTING_RULE','RULE_CANDIDATE','PATTERN_CANDIDATE','TEST','SEMANTIC_REVIEW','UNRESOLVED'),'指摘の更新先がない')
            need(case.get('quality') in ('POSITIVE','NEGATIVE','UNKNOWN'),'品質ラベルが不正')
            if case['quality']!='UNKNOWN':need(case.get('evaluation_event') and case.get('target_version'),'品質の原発言と対象版がない')
            need(case.get('links'),'事例の対応先がない')
            need(case['disposition']!='UNRESOLVED' or result['verdict']!='PASS','未解決事例を完了へ転用しない')
