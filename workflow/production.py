"""P-003 definitions and adapters on the existing Runtime/Store, not a second ledger."""
import json, subprocess, sys
from pathlib import Path
from contracts import need, result_check
from store import digest

VERSION='production/1'
_NAMES=['現在地復元','正本固定','完全抽出','問題契約','規則・事例取得','既習台帳','完全解法','数理検証','教える順','小段階','穴と選択肢','表現設計','教材全文','図表','静的検査','原資料監査','初学者監査','具体設計確定','compile','実UI検査','影響監査','既存公開先','ユーザー評価','回帰・規則','実学習・統合']
_DEPS={0:[],1:[0],2:[1],3:[2],4:[3],5:[3],6:[5],7:[6],8:[4,7],9:[8],10:[9],11:[10],12:[11],13:[11],14:[12,13],15:[14],16:[14],17:[15,16],18:[17],19:[18],20:[19],21:[20],22:[21],23:[22],24:[23]}
_RETURNS={7:['S06'],14:['S11','S12'],15:['S03','S12'],16:['S05','S08','S09','S10','S12'],19:['S18'],20:['S11'],23:['S11'],24:['S04']}

def instantiate(plan):
    if plan.get('workflow_version') == 'production/2':
        from graphs import instantiate as cr_nodes
        return cr_nodes(plan)
    need(plan.get('workflow_version')==VERSION,'未対応の制作工程版')
    return {f'S{i:02}':{'id':f'S{i:02}','name':name,'actor':'USER' if i in (17,22) else 'AI' if i in (15,16) else 'TOOL',
            'depends_on':[f'S{x:02}' for x in _DEPS[i]],'required':['checks','artifacts','unknowns'],
            'block':None,'watch':'production','returns_to':_RETURNS.get(i,[]),
            'ai_required':i in (0,1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,20,23),
            'ml_advisory':i in (4,8,10,14,16,24)} for i,name in enumerate(_NAMES)}

def check_result(rt,work,node,result):
    if rt.state(work)['plan'].get('workflow_version') == 'production/2':
        from integration import check_result as cr_check
        return cr_check(rt,work,node,result)
    result_check(node,result)
    need(result.get('artifacts'),'成果物参照がない')
    artifacts=[rt.store.get(ref) for ref in result['artifacts']]
    simulation=rt.state(work)['plan'].get('simulation',False)
    if not simulation:
        code=[a for a in artifacts if a.get('producer',{}).get('kind')=='code']
        need(code,'コード実行の成果物がない')
        for a in code:
            producer=a['producer']
            need(producer.get('stageId')==node['id'] and producer.get('inputHash')==rt.task(work,node['id'])['input_hash'],'別工程・古い入力のコード結果')
            need(producer.get('implementationHash')==digest(implementation_manifest(rt.root)),'コード実装の版が違う')
            need(result['verdict']!='PASS' or a.get('status') in ('PASS','NEEDS_AI_REVIEW'),'コードの失敗・未対応をAIで合格にしない')
        if node['id']=='S07' and code[0].get('status')=='NEEDS_AI_REVIEW':need(result.get('proofStatus')=='AI_ARGUMENT_REVIEWED' and result.get('formalProof') is False,'意味監査と機械証明を区別する')
        if node['id']=='S24':need(result.get('trainingRun')==code[0].get('trainingRun'),'学習の実行記録と報告が違う')
        if node['id']=='S19':need(any(rt.state(work)['evidence'].get(ref,{}).get('kind') in ('ci','check') for ref in result['evidence_refs']),'実UI検証の証拠がない')
        if node['id']=='S21':need(any(rt.state(work)['evidence'].get(ref,{}).get('kind')=='app' for ref in result['evidence_refs']),'実配信アプリの証拠がない')
    need(isinstance(result.get('checks'),list) and all(isinstance(x,dict) and x.get('status') in ('PASS','FAIL','UNVERIFIED','OUT_OF_SCOPE') and x.get('id') and x.get('evidence') for x in result['checks']),'項目ごとの検査根拠が必要')
    need(result['verdict']!='PASS' or all(x['status'] in ('PASS','OUT_OF_SCOPE') for x in result['checks']),'未完検査を合格にしない')
    if node['ai_required']:
        review=result.get('aiReview',{})
        need(review.get('requestHash')==ai_request(rt,work,node['id'])['requestHash'] and review.get('reviewer') and review.get('evidence'),'意味監査の根拠又は要求版が違う')
        need(review.get('inputHash')==rt.task(work,node['id'])['input_hash'],'古い入力のAI監査')
    if node['id']=='S18':
        state=rt.state(work);need(rt.approval(state),'具体設計の承認がない')
        approved_hash=state['plan']['proposal'].get('contentDesignHash')
        artifacts=[rt.store.get(ref) for ref in result['artifacts']]
        need(approved_hash and any((a.get('compiled',a)).get('irHash')==approved_hash for a in artifacts),'compileしたIRと承認済み内容hashが違う')
    if node['id'] in ('S19','S20','S21'):
        need(result.get('sourceSHA')==rt.state(work)['candidate_sha'],'検査・公開のSHAが異なる')
    if node['id']=='S21':
        receipt=result.get('release',{})
        need(receipt.get('verified') is True and receipt.get('sourceSHA')==result['sourceSHA'] and receipt.get('url','').startswith('https://'),'配信版未確認')
    if node['id']=='S23':
        state=rt.state(work);quality={k for k,v in state['users'].items() if v['intent'] in ('quality_positive','quality_negative','reject_block','reject_app','accept_app')}
        covered={c.get('evaluationEvent') for c in result.get('caseUpdates',[])}
        need(quality<=covered,'未取込のユーザー評価がある')
    if node['id']=='S24':
        need('trainingRun' in result and result.get('modelDisposition') in ('SHADOW','ADVISORY','NOT_TRAINABLE','REJECTED'),'学習実態・採否を明記する')

def ai_request(rt,work,node_id):
    task=rt.task(work,node_id);state=rt.state(work)
    dependencies={d:rt.store.get(v['artifact']) for d,v in task['previous_results'].items() if v}
    solution_contract={'visibleFirst':True,'required':['sourceLocations','learnerDecision','availableInformation','reasonToProceed','nextWholeState','misconception','reducedSupportVariant'],'findings':['problemId','stepId','state','quoteOrMathRef','reason','affectedRefs','resolution'],'sameAssistantIsIndependent':False} if state['plan'].get('solution_pipeline')=='solution/1' else None
    request = {'schemaVersion':state['plan'].get('workflow_version',VERSION),'solutionReview':solution_contract,'adoptedCorrections':state.get('adopted_corrections',[]),'reusableHistory':state.get('migration',{}).get('artifact_mapping',[]),'task':task,'context':state.get('production_context',{}),'dependencies':dependencies,
            'constraints':['原資料・既習・可視状態だけを根拠にする','作成者の自己評価を監査根拠にしない','未解決は未解決と記録','承認を生成しない'],
            'requestHash':digest({'task':task,'dependencies':dependencies,'context':state.get('production_context',{}),**({'solutionReview':solution_contract} if solution_contract else {})})}

    if state['plan'].get('agent_team'):
        from team import node_requirements
        descriptor = {'policyHash': digest(state['plan']['agent_team']),
                      'requirements': node_requirements(state['plan']['agent_team'], task['node']),
                      'submissionActor': 'M',
                      'constraints': ['実agent taskを登録する', '対象claimの作者履歴を維持する', '個別taskは固定packetを先に読む', 'agentの合意をUSER評価へ昇格しない']}
        request['teamReview'] = descriptor
        request['requestHash'] = digest({'baseRequestHash': request['requestHash'], 'teamReview': descriptor})
    return request


def textbook_job(rt,work,node_id,command,args):
    """Existing Node jobs are subprocess work, while claims/events belong to Runtime."""
    need(command in ('author','verify','compile','export-proposal'),'未登録の制作コマンド')
    task=rt.claim(work,node_id,'textbook-adapter')
    root=rt.root
    proc=subprocess.run(['node',str(root/'tools/textbook/cli.mjs'),command,*args],cwd=root,capture_output=True,text=True)
    receipt={'command':command,'args':args,'returncode':proc.returncode,'stdout':proc.stdout,'stderr':proc.stderr,'parentRun':{'work':work,'node':node_id,'inputHash':task['input_hash']}}
    ref=rt.store.put(receipt)
    # Never fabricate the human/AI meaning audit when a subprocess passed.
    return {'claimToken':task['claim_token'],'artifact':ref,'status':'NEEDS_REVIEW' if proc.returncode==0 else 'FAIL'}

def diagram(rt,work):
    if rt.state(work)['plan'].get('workflow_version') == 'production/2':
        from views import integration_diagrams,snapshot
        return integration_diagrams(snapshot(rt,work))['FIRE_DIAGRAM.md']
    state=rt.state(work);lines=['# 制作火柴図（台帳から生成）','','```mermaid','flowchart TD']
    for nid,n in instantiate(state['plan']).items():
        lines.append(f'  {nid}["{nid} {n["name"]} / {rt.node_status(state,n)}"]')
        for dep in n['depends_on']:lines.append(f'  {dep} --> {nid}')
        for target in n['returns_to']:lines.append(f'  {nid} -. 差戻し .-> {target}')
    return '\n'.join(lines+['```',''])

def implementation_manifest(root):
    import hashlib, re
    root = Path(root).resolve()
    suffixes = ('.mjs', '.py', '.ts', '.tsx', '.css', '.json', '.txt', '.lock', '.yaml')
    paths = {p for p in list((root/'tools/textbook').rglob('*')) + list((root/'work/items/W-GOV-010-coded-authoring/engine').glob('*'))
             if p.is_file() and p.suffix in suffixes and '__pycache__' not in p.parts}
    # The receipt includes actual browser code, catalog/route/Store bridges,
    # locked dependencies and their local import closure. A source change in a
    # transitive helper or a referenced image must invalidate the same cache.
    entries = (
        'src/main.tsx',
        'src/components/textbook/nestedMathTemplate.ts',
        'src/components/textbook/NestedConstructionMath.tsx',
        'src/components/textbook/nested-construction-math.css',
        'src/components/textbook/nestedMathGeometry.ts',
        'src/components/textbook/ConstructionLessonReadingFlow.tsx',
        'src/components/textbook/construction-lesson-reading.css',
        'src/components/textbook/GuidedMathReadingFlow.tsx',
        'src/domain/nestedLesson.ts', 'src/domain/compiledNestedLesson.ts',
        'src/domain/nestedMigration.ts', 'src/domain/nestedLessonStorage.ts',
        'src/domain/textbook.ts', 'src/domain/textbookSchema.ts',
        'src/stores/useAppStore.ts', 'src/pages/N0910RevisionPage.tsx',
        'src/pages/N0910ArchivePage.tsx', 'src/pages/TextbookUnitPage.tsx',
        'src/data/textbook/math/index.ts',
        'src/data/textbook/math/numbers/n09Lesson.ts',
        'src/data/textbook/math/numbers/n10Lesson.ts',
        'src/data/textbook/math/numbers/n09Revision4.json',
        'src/data/textbook/math/numbers/n10Revision3.json',
        'src/data/textbook/math/numbers/n09ConstructionCompiled.json',
        'src/data/textbook/math/numbers/n10ConstructionCompiled.json',
        'src/data/textbook/math/numbers/n0910CandidatePins.json',
        'package.json', 'pnpm-lock.yaml',
    )
    pending = [root/name for name in entries]
    scanned = set()
    root_absolute = root.resolve()
    imports = re.compile(r"(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)[\"']([^\"']+)[\"']")

    def internal(candidate):
        try:
            candidate.resolve().relative_to(root_absolute)
            return True
        except ValueError:
            return False

    # Preserve logical in-checkout symlink aliases in the initial tool tree.
    # Canonical imported paths may name the same bytes twice; both loader paths
    # remain visible, so deleting an alias changes the manifest. No external
    # target is opened, including aliases found by the initial glob.
    paths = {p for p in paths if internal(p)}

    def json_assets(value):
        if isinstance(value, dict):
            src = value.get('src')
            if isinstance(src, str) and src.lstrip('/').startswith('assets/'):
                asset = root/'public'/src.lstrip('/')
                if asset.is_file() and internal(asset):
                    paths.add(asset)
            for child in value.values():
                json_assets(child)
        elif isinstance(value, list):
            for child in value:
                json_assets(child)

    while pending:
        current = pending.pop()
        if current in scanned or not current.is_file() or not internal(current):
            continue
        scanned.add(current)
        paths.add(current)
        if current.suffix == '.json':
            try:
                json_assets(json.loads(current.read_text(encoding='utf-8')))
            except (ValueError, UnicodeError):
                pass  # Invalid JSON still has a different byte fingerprint.
        if current.suffix not in ('.ts', '.tsx', '.mjs', '.js', '.css'):
            continue
        text = current.read_text(encoding='utf-8')
        for ref in imports.findall(text):
            if not ref.startswith('.'):
                continue  # External versions are bound by package + lock.
            candidate = current.parent/ref.split('?', 1)[0]
            candidates = [candidate] + [Path(str(candidate) + suffix) for suffix in ('.ts', '.tsx', '.mjs', '.js', '.json', '.css')] + [candidate/('index' + suffix) for suffix in ('.ts', '.tsx', '.mjs', '.js')]
            dependency = next((p for p in candidates if p.is_file() and internal(p)), None)
            if dependency is not None:
                pending.append(dependency.resolve())
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(paths) if internal(p) and p.is_file()}
