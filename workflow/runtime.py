"""作成・修正の状態機械。AIの自動起動や自然言語判断の正しさは保証しない。"""
import copy,time,uuid
from pathlib import Path
from store import Store,digest,Conflict
from contracts import need,Rejected,plan_check,result_check,manifest,file,sha
from definitions import instantiate,DEFINITION_HASH,VERSION

USER_INTENTS={'approve_proposal','accept_block','accept_app','reject_block','reject_app','pause','resume','priority_override','authorize_merge','authorize_deploy','authorize_cost','quality_positive','quality_negative','continue'}

class Runtime:
    def __init__(self,store,root):self.store=Store(store);self.root=Path(root).resolve();self._head=self.store.head
    def append(self,kind,work,payload,**kwargs):
        event=self.store.append(kind,work,payload,expected=self._head,**kwargs);self._head=event['hash'];return event
    def state(self,work):
        s=None;events=self.store.events();self._head=events[-1]['hash'] if events else '0'*64
        for e in events:
            if e['work']!=work:continue
            p=e['payload'];k=e['kind']
            if k=='opened':
                s={'plan':p['plan'],'definition_hash':p['definition_hash'],'claims':{},'results':{},'evidence':{},'users':{},'issues':{},'paused':False,
                   'candidate_sha':p['plan']['source_sha'],'candidate_manifest':copy.deepcopy(p['plan']['source_manifest']),'revised':False,'external':{},'patches':{}}
            elif s is not None:
                if k=='claimed':s['claims'][p['node']]=p
                elif k=='result_reopened':s['results'].pop(p['node'],None)
                elif k=='result':s['results'][p['node']]=p;s['claims'].pop(p['node'],None)
                elif k=='evidence':s['evidence'][p['id']]=p
                elif k=='user':s['users'][p['id']]=p
                elif k=='paused':s['paused']=p['value']
                elif k=='issue':s['issues'][p['id']]=p
                elif k=='issue_resolved':s['issues'][p['id']]['resolved_by']=p['child']
                elif k=='candidate':s['candidate_sha']=p['sha'];s['candidate_manifest']=p['manifest']
                elif k=='patch_intent':s['patches'][e['id']]=p
                elif k=='patch_applied':
                    s['candidate_sha']=None;s['candidate_manifest'].update(p['after_manifest']);s['patches'][p['operation']]['completed']=True
                elif k=='patch_aborted':s['patches'][p['operation']]['completed']=True
                elif k=='definition_migrated':s['definition_hash']=p['to']
                elif k=='production_context':s['production_context']=p['context']
                elif k=='revised':s['plan']=p['plan'];s['revised']=True
                elif k=='claim_reconciled':s['claims'].pop(p['node'],None)
                elif k=='external_intent':s['external'][p['id']]=p
                elif k=='external_outcome':s['external'][p['id']]['outcome']=p['outcome'];s['external'][p['id']]['evidence']=p['evidence']
        need(s is not None,'Workが存在しない');return s
    def open(self,plan):
        self._head=self.store.head;plan_check(plan)
        need(not any(e['work']==plan['work_id'] for e in self.store.events()),'Work IDが既に存在')
        need(manifest(self.root,plan['source_manifest'])==plan['source_manifest'],'元資料の固定版と不一致')
        need(manifest(self.root,plan['rules'])==plan['rules'],'規則の固定版と不一致')
        snapshots={p:file(self.root,p).read_bytes().hex() for p in plan['source_manifest']}
        ref=self.store.put({'source_sha':plan['source_sha'],'files_hex':snapshots})
        return self.append('opened',plan['work_id'],{'plan':copy.deepcopy(plan),'definition_hash':DEFINITION_HASH,'original_snapshot':ref})
    def integrity(self,s):
        try:
            need(s['definition_hash']==DEFINITION_HASH,'工程定義の版が変わった。移行照合が必要')
            need(manifest(self.root,s['plan']['rules'])==s['plan']['rules'],'憲法・規則の版が変わった')
            need(manifest(self.root,s['candidate_manifest'])==s['candidate_manifest'],'未記録の候補差分がある')
        except (Rejected,FileNotFoundError) as e:return str(e)
        return None
    def block_manifest(self,s,bid):
        b=next(b for b in s['plan']['blocks'] if b['id']==bid)
        return {p:s['candidate_manifest'].get(p) for p in b['sources']}
    def input_hash(self,s,node):
        p=s['plan'];watch=node['watch'];base={'definition':DEFINITION_HASH,'rules':p['rules'],'node':node['id'],'subject':p['subject'],'mode':p['mode']}
        if node['block']:
            paths=next(b['sources'] for b in p['blocks'] if b['id']==node['block'])
            base['source']={x:p['source_manifest'][x] for x in paths}
        else:base['source']=p['source_manifest']
        if watch in ('candidate_block','visual'):base['candidate_block']=self.block_manifest(s,node['block'])
        if watch=='candidate' or node['id'].startswith(('C08_VERIFY','R07_VERIFY')):base['candidate_sha']=s['candidate_sha']
        if watch in ('candidate','all'):base['candidate_manifest']=s['candidate_manifest']
        if not node['id'].startswith('G1_'):
            base['dependencies']={d:s['results'].get(d,{}).get('artifact') for d in node['depends_on']}
        if watch in ('learning','all'):base['quality_events']={k:v for k,v in s['users'].items() if v['intent'] in ('quality_positive','quality_negative','reject_block','reject_app')}
        if node['id'].startswith('G1_'):base['rejections']=[u for u in s['users'].values() if u['intent']=='reject_block' and u['block']==node['block']]
        if node['id']=='G3_FINAL':base['rejections']=[u for u in s['users'].values() if u['intent']=='reject_app']
        if watch in ('learning','all'):base['issues']=s['issues'];base['result_refs']={n:r['artifact'] for n,r in s['results'].items() if n!=node['id'] and not n.startswith('Z01')}
        # 版が変わった提案の承認を流用しない。既存分析は必要以上に再実行させない。
        if node['id'].startswith(('C05','C06','C07','R04','R05','R06','T02','T03')):base['proposal']=p['proposal'];base['scope']=p['scope']
        if watch=='production':
            from production import implementation_manifest
            base['producer_implementation']=implementation_manifest(self.root)
            if node['id'] in ('S22','S23','S24'):
                base['quality_events']={k:v for k,v in s['users'].items() if v['intent'] in ('quality_positive','quality_negative','reject_block','reject_app','accept_app')}
                base['issues']=s['issues']
        if watch=='production':base.update(context=s.get('production_context',{}),candidate_sha=s['candidate_sha'],candidate_manifest=s['candidate_manifest'],proposal=p['proposal'],scope=p['scope'])
        return digest(base)
    def node_status(self,s,node):
        r=s['results'].get(node['id']);h=self.input_hash(s,node)
        c=s['claims'].get(node['id'])
        if c:return 'RUNNING' if c['input_hash']==h and c['expires_at']>time.time() else 'BLOCKED'
        if r:
            if r['input_hash']!=h:return 'INVALIDATED'
            return 'PASSED' if r['verdict']=='PASS' else 'FAILED' if r['verdict']=='FAIL' else 'BLOCKED'
        c=s['claims'].get(node['id'])
        if c:return 'RUNNING' if c['input_hash']==h and c['expires_at']>time.time() else 'BLOCKED'
        return 'PENDING'
    def pending_issues(self):
        outstanding=[]
        for w in {e['work'] for e in self.store.events() if e['kind']=='opened'}:
            for i in self.state(w)['issues'].values():
                if not i.get('resolved_by'):outstanding.append(dict(i,work=w))
        return outstanding
    def user(self,work,intent,quote,reply_to,source_ref,*,block=None,scope=None,event_id=None,verification_level='conversation_transcribed'):
        s=self.state(work);need(intent in USER_INTENTS,'ユーザー意図の種別が不明')
        need(quote and reply_to and source_ref,'発言原文・対応先・出所が必要')
        need(verification_level in ('conversation_transcribed','authenticated_connector','simulation'),'出所の検証段階が不明')
        need(verification_level!='simulation' or s['plan'].get('simulation'),'実Workに模擬承認を入れない')
        if intent=='approve_proposal':need(reply_to==s['plan']['proposal']['hash'],'承認が現在の具体的な提案版に対応しない')
        if intent in ('accept_block','reject_block'):
            need(block in [b['id'] for b in s['plan']['blocks']],'確認対象ブロックが不明')
        p={'id':event_id or str(uuid.uuid4()),'intent':intent,'quote':quote,'reply_to':reply_to,'source_ref':source_ref,'block':block,
           'proposal_hash':s['plan']['proposal']['hash'],'scope':scope or s['plan']['scope'],'candidate_sha':s['candidate_sha'],
           'block_manifest':self.block_manifest(s,block) if block else None,'verification_level':verification_level}
        self.append('user',work,p,event_id=p['id'])
        if intent in ('pause','resume'):self.append('paused',work,{'value':intent=='pause','user_event':p['id']})
        if intent in ('reject_block','reject_app'):
            self.issue(work,{'id':digest({'user':p['id'],'block':block})[:20],'block':block,'root_cause':'USER_REVIEW_PENDING_ANALYSIS','evidence_refs':[p['id']],
                             'description':quote,'version':s['candidate_sha'],'origin':'user'})
        return p['id']
    def approval(self,s):
        return next((x for x in reversed(list(s['users'].values())) if x['intent']=='approve_proposal' and x['proposal_hash']==s['plan']['proposal']['hash'] and x['scope']==s['plan']['scope']),None)
    def issue(self,work,issue):
        need(all(issue.get(k) for k in ['id','root_cause','evidence_refs','description','version']),'不具合の根拠が不足')
        s=self.state(work);self.fingerprint_refs(s,issue['evidence_refs'])
        for old in s['issues'].values():
            if (old['root_cause'],old.get('block'),old['version'])==(issue['root_cause'],issue.get('block'),issue['version']):return old['id']
        self.append('issue',work,issue,event_id='issue-'+issue['id']);return issue['id']
    def evidence(self,work,kind,data,*,source_ref,verification_level='tool_result_transcribed',eid=None):
        s=self.state(work);need(source_ref,'証拠の出所がない')
        need(verification_level in ('tool_result_transcribed','local_execution','simulation'),'証拠の検証段階が不明')
        need(verification_level!='simulation' or s['plan'].get('simulation'),'実Workへの模擬証拠は禁止')
        if kind in ('file','screenshot'):
            actual=sha(file(self.root,data['path']));need(actual==data['sha256'],'ファイル証拠のハッシュ不一致')
            if kind=='screenshot':
                need(file(self.root,data['path']).read_bytes().startswith(b'\x89PNG\r\n\x1a\n'),'実画像としてPNGが必要')
                capture=s['evidence'].get(data.get('capture_ref'),{})
                need(capture.get('kind')=='capture' and capture['data']['files'].get(data['path'])==actual,'CI画像成果物との対応がない')
        elif kind=='ci':
            need(data.get('status')=='completed' and data.get('conclusion')=='success','CIが成功していない')
            need(data.get('head_sha')==s['candidate_sha'],'別SHAのCIは採用できない')
            need(data.get('id') and data.get('html_url','').startswith('https://github.com/'),'CIの実行参照が不足')
        elif kind=='capture':
            ci=s['evidence'].get(data.get('ci_ref'),{})
            need(ci.get('kind')=='ci' and ci['data']['head_sha']==data.get('source_sha'),'画像とCIのSHA対応がない')
            need(data.get('artifact_sha256') and data.get('files'),'画像成果物の対応表がない')
        elif kind=='app':
            need(data.get('source_sha')==s['candidate_sha'] and data.get('manifest_sha')==s['candidate_sha'],'アプリと対象SHAが異なる')
            need(data.get('url','').startswith('https://') and data.get('reachable') and data.get('auth_wall') is False,'実働URL・到達性・認証壁が未確認')
            need(data.get('mobile') and data.get('desktop') and data.get('progress_isolated'),'端末・履歴分離の証拠が不足')
        elif kind=='check':
            need(data.get('status')=='PASS' and data.get('source_sha')==s['candidate_sha'],'検査対象版または結果が不正')
            need(data.get('checks'),'検査項目がない')
        else:raise Rejected('証拠の種類が未登録')
        ref=eid or str(uuid.uuid4());self.append('evidence',work,{'id':ref,'kind':kind,'data':data,'source_ref':source_ref,'verification_level':verification_level},event_id='evidence-'+ref)
        return ref
    def fingerprint_refs(self,s,refs):
        for ref in refs:
            need(ref in s['evidence'] or ref in s['users'],'未登録の証拠参照:'+ref)
    def task(self,work,node_id):
        s=self.state(work);nodes=instantiate(s['plan']);need(node_id in nodes,'ノードがない');n=nodes[node_id]
        return {'work_id':work,'node':n,'task_id':digest({'work':work,'node':node_id,'input_hash':self.input_hash(s,n)}),
                'input_hash':self.input_hash(s,n),'source_sha':s['plan']['source_sha'],'candidate_sha':s['candidate_sha'],
                'rules':s['plan']['rules'],'proposal':s['plan']['proposal'],'scope':s['plan']['scope'],
                'source_manifest':s['plan']['source_manifest'],'previous_results':{d:s['results'].get(d) for d in n['depends_on']},
                'do_not_touch':s['plan']['scope'].get('preserve',[]),'completion_is_not_semantic_proof':True}
    def next(self,work):
        s=self.state(work);nodes=instantiate(s['plan']);drift=self.integrity(s)
        if drift:return {'status':'BLOCKED','reason':drift}
        if any(not p.get('completed') for p in s['patches'].values()):return {'status':'BLOCKED','reason':'限定修正の結果が未確定。実ファイルと差分を照合する'}
        if s['paused']:return {'status':'WAITING','reason':'USER_PAUSED'}
        if any(not x.get('outcome') for x in s['external'].values()):return {'status':'BLOCKED','reason':'外部操作の成否が未記録。実状態の照合が必要'}
        if s['plan']['command']=='CMD-WORK-002' and self.pending_issues():
            override=next((u for u in s['users'].values() if u['intent']=='priority_override' and u['scope']==s['plan']['scope']),None)
            if not override:return {'status':'BLOCKED','reason':'CORRECTION_FIRST','issues':self.pending_issues()}
        for nid,n in nodes.items():
            status=self.node_status(s,n)
            if status=='RUNNING':return {'status':'WAITING','reason':n['actor']+'_RESULT','node':nid,'claim':s['claims'][nid]}
            if nid in s['claims']:return {'status':'BLOCKED','reason':'実行権の期限切れまたは入力変更。成否を照合するまで再実行しない','node':nid}
            if status=='BLOCKED':return {'status':'BLOCKED','reason':'分析・検証の未解決','node':nid}
            if status=='FAILED':return {'status':'FAILED','reason':'修正または提案改訂が必要','node':nid}
            if status=='PASSED':continue
            if not all(self.node_status(s,nodes[d])=='PASSED' for d in n['depends_on']):continue
            if n['actor']=='USER':return {'status':'WAITING','reason':'USER_DECISION','task':self.task(work,nid)}
            return {'status':'READY','task':self.task(work,nid)}
        return {'status':'DONE' if all(self.node_status(s,n)=='PASSED' for n in nodes.values()) else 'BLOCKED','reason':'全工程の有効な証拠を照合'}
    def claim(self,work,node_id,actor,seconds=900):
        need(actor,'実行者IDがない');nxt=self.next(work)
        need(nxt.get('status')=='READY' and nxt['task']['node']['id']==node_id,'現在実行可能なノードではない')
        task=nxt['task'];need(task['node']['actor'] in ('AI','AUDITOR','TOOL'),'このノードはclaim対象外')
        p={'node':node_id,'actor':actor,'input_hash':task['input_hash'],'task_id':task['task_id'],'token':uuid.uuid4().hex,'expires_at':time.time()+seconds}
        self.append('claimed',work,p);return dict(task,claim_token=p['token'])
    def _finish(self,work,node,result,input_hash,actor):
        s=self.state(work);need(input_hash==self.input_hash(s,node),'入力版が変わった結果を受理しない')
        h=self.store.put(result)
        self.append('result',work,{'node':node['id'],'artifact':h,'input_hash':input_hash,'actor':actor,'verdict':result['verdict']})
        return h
    def submit(self,work,node_id,token,result):
        s=self.state(work);n=instantiate(s['plan'])[node_id];need(n['actor'] in ('AI','AUDITOR'),'AI分析の提出先ではない')
        c=s['claims'].get(node_id);need(c and c['token']==token and c['expires_at']>time.time(),'有効な課題受領がない')
        need(not self.integrity(s),'正本または候補に未記録の変更がある')
        if s['plan'].get('workflow_version'):
            from production import check_result
            check_result(self,work,n,result)
        result_check(n,result);self.fingerprint_refs(s,result['evidence_refs'])
        for row in result.get('impact_rows',[])+result.get('audit_rows',[]):self.fingerprint_refs(s,row['evidence_refs'])
        if n['actor']=='AUDITOR':
            creators={r['actor'] for k,r in s['results'].items() if k.startswith(('C02','C04','C05','R02','R04'))}
            need(result['independence']['reviewer']==c['actor'],'監査の課題担当と結果の担当が異なる')
            need(result['independence']['reviewer'] not in creators,'作成者と同じ担当を独立監査と呼べない')
            self.fingerprint_refs(s,result['original_source_refs'])
        if n['id'].startswith('R03'):
            inventory=s['plan'].get('impact_inventory') or [{'block_id':b['id'],'artifact':path} for b in s['plan']['blocks'] for path in b['sources']]
            required={(row['block_id'],row['artifact']) for row in inventory}
            supplied={(row.get('block_id'),row['artifact']) for row in result['impact_rows']}
            need(required<=supplied,'全影響範囲の表から既知のブロックが抜けている')
            for row in result['impact_rows']:
                need(row['version'] in (s['plan']['source_sha'],s['candidate_sha']),'影響調査の対象版が現在のWorkと対応しない')
        if n['id'].startswith('R04'):need(result['proposal_hash']==s['plan']['proposal']['hash'],'提出した修正案と承認対象の版が違う')
        if n['id'].startswith(('L01','R08')):
            covered={x['id'] for x in result['case_updates']};need(set(s['issues'])<=covered,'未取込の指摘がある')
            for case in result['case_updates']:
                if case['quality']!='UNKNOWN':
                    u=s['users'].get(case.get('evaluation_event'),{})
                    expect='quality_positive' if case['quality']=='POSITIVE' else 'quality_negative'
                    need(u.get('intent')==expect and u.get('candidate_sha')==case['target_version'],'続行・承認を品質評価へ転用しない')
        return self._finish(work,n,result,c['input_hash'],c['actor'])
    def accept(self,work,node_id,user_ref,evidence_refs=()):
        s=self.state(work);nodes=instantiate(s['plan']);n=nodes[node_id];need(n['actor']=='USER','ユーザーノードではない')
        nxt=self.next(work);need(nxt.get('task',{}).get('node',{}).get('id')==node_id,'この判断の工程に到達していない')
        u=s['users'].get(user_ref);need(u,'ユーザー発言イベントがない')
        if s['plan'].get('workflow_version') and node_id=='S17':
            need(u==self.approval(s),'具体設計の版・範囲の承認ではない')
        elif s['plan'].get('workflow_version') and node_id=='S22':
            need(u['intent'] in ('accept_app','quality_positive','quality_negative','reject_app'),'実物への評価ではない')
            need(u['candidate_sha']==s['candidate_sha'],'評価対象版が違う')
        elif 'APPROVAL' in node_id:need(u==self.approval(s),'現在の提案・範囲の承認ではない')
        elif node_id.startswith('G1'):
            need(u['intent']=='accept_block' and u['block']==n['block'],'細部確認の承認ではない')
            need(u['block_manifest']==self.block_manifest(s,n['block']),'細部確認の対象内容が変わった')
            screenshots=[s['evidence'].get(r,{}) for r in evidence_refs]
            need(any(e.get('kind')=='screenshot' and e['data'].get('block')==n['block'] and e['data'].get('source_sha')==s['candidate_sha'] for e in screenshots),'対象SHAの実画像がない')
            need(u['reply_to'] in evidence_refs,'発言と実画像確認票の対応がない')
        elif node_id=='G3_FINAL':
            need(u['intent']=='accept_app' and '総チェックOK' in u['quote'],'全体をプレイした明示的な総チェックOKがない')
            need(u['candidate_sha']==s['candidate_sha'] and u['scope']==s['plan']['scope'],'総チェックの対象SHA・範囲が異なる')
            host=s['results'].get('G3_HOST');need(host and u['reply_to'] in self.store.get(host['artifact'])['evidence_refs'],'ユーザーが確認した実働URLとの対応がない')
        self.fingerprint_refs(s,list(evidence_refs)+[user_ref])
        return self._finish(work,n,{'verdict':'PASS','user_event':user_ref,'evidence_refs':list(evidence_refs)},self.input_hash(s,n),'user-record/'+u['verification_level'])
    def tool_result(self,work,node_id,token,evidence_refs):
        s=self.state(work);need(not s['plan'].get('workflow_version'),'制作工程はproduction_resultで検査する');n=instantiate(s['plan'])[node_id];need(n['actor']=='TOOL','外部処理ノードではない')
        c=s['claims'].get(node_id);need(c and c['token']==token and c['expires_at']>time.time(),'実行権がない')
        need(not self.integrity(s),'正本・候補の版に未記録の変更がある')
        self.fingerprint_refs(s,evidence_refs);es=[s['evidence'][r] for r in evidence_refs if r in s['evidence']]
        if any(x in node_id for x in ('BUILD','PATCH')):
            need(self.approval(s),'実装範囲の承認がない')
            from adapters import in_scope
            need(any(e['kind']=='file' and in_scope(e['data']['path'],s['plan']['scope']) and sha(file(self.root,e['data']['path']))==e['data']['sha256'] for e in es),'承認範囲内の現行成果物証拠がない')
        elif 'VERIFY' in node_id:
            need(s['candidate_sha'],'候補コミットがまだ固定されていない')
            need(any(e['kind'] in ('ci','check') and e['data'].get('head_sha',e['data'].get('source_sha'))==s['candidate_sha'] for e in es),'現在のSHAの検査証拠がない')
        elif node_id=='G3_HOST':need(any(e['kind']=='app' and e['data']['source_sha']==s['candidate_sha'] for e in es),'到達確認済みの実働アプリ証拠がない')
        return self._finish(work,n,{'verdict':'PASS','evidence_refs':list(evidence_refs)},c['input_hash'],c['actor'])
    def execute(self,work,node_id):
        s=self.state(work);n=instantiate(s['plan'])[node_id];nxt=self.next(work)
        need(n['actor']=='CODE' and nxt.get('task',{}).get('node',{}).get('id')==node_id,'実行可能なコードノードではない')
        if node_id=='S00_RECOVER':need(not self.integrity(s),'正本が変わった')
        if node_id=='Z01_CLOSE':
            need(not any(not i.get('resolved_by') for i in s['issues'].values()),'未解決の修正指摘がある')
        return self._finish(work,n,{'verdict':'PASS','checks':['入力・正本・依存・未解決の照合']},self.input_hash(s,n),'deterministic-code')
    def bind_candidate(self,work,commit_sha,paths=None):
        s=self.state(work);need(len(commit_sha)==40 and all(c in '0123456789abcdef' for c in commit_sha),'候補SHAが不正')
        current=manifest(self.root,paths or s['candidate_manifest'])
        changed=[p for p,h in current.items() if s['candidate_manifest'].get(p)!=h]
        if changed:
            from adapters import in_scope
            need(self.approval(s) and all(in_scope(p,s['plan']['scope']) for p in changed),'未承認範囲の変更を候補として登録しない')
            need(False,'実ファイルの変更は限定修正アダプタで差分・安定ID・履歴を照合してから候補へ固定する')
        need(set(current)==set(s['candidate_manifest']),'候補の収録範囲が変わった。提案改訂が必要')
        self.append('candidate',work,{'sha':commit_sha,'manifest':current})
    def revise(self,work,new_plan):
        s=self.state(work);plan_check(new_plan);need(new_plan['work_id']==work,'別Workへの改訂')
        need(new_plan['profile']==s['plan']['profile'] and new_plan['command']==s['plan']['command'],'作成／修正の経路変更は別Workへ')
        need(new_plan['proposal']['hash']!=s['plan']['proposal']['hash'],'意味の変更には新しい提案版が必要')
        need(new_plan['source_manifest']==s['plan']['source_manifest'] and new_plan['rules']==s['plan']['rules'],'原資料・規則の移行は新Workで照合する')
        self.append('revised',work,{'plan':new_plan})
    def reconcile_claim(self,work,node_id,outcome,evidence_refs):
        s=self.state(work);need(node_id in s['claims'],'照合する実行権がない')
        need(outcome in ('NOT_EXECUTED','FAILED','RESULT_LOST_REVIEW_REQUIRED'),'完了は証拠付きの通常提出で受理する')
        self.fingerprint_refs(s,evidence_refs);need(evidence_refs,'照合根拠がない')
        self.append('claim_reconciled',work,{'node':node_id,'outcome':outcome,'evidence_refs':evidence_refs})
    def external_intent(self,work,operation,request_hash,operation_id):
        s=self.state(work);need(not s['plan'].get('simulation'),'模擬Workから外部操作しない')
        allowed={'MERGE':'authorize_merge','DEPLOY':'authorize_deploy','COST':'authorize_cost'}
        need(operation in allowed,'外部操作が未登録')
        inherited=False
        if operation=='DEPLOY' and s['plan'].get('workflow_version'):
            import json
            policy=json.loads((self.root/'governance/REVIEW_POLICY.json').read_text())
            inherited=policy.get('repeatPublicationApproval') is False and policy.get('reviewSurface')=='existing-public-app' and bool(self.approval(s)) and request_hash==s['plan']['proposal']['hash']
        need(inherited or any(u['intent']==allowed[operation] and u['reply_to']==request_hash for u in s['users'].values()),'外部操作の具体的な承認がない')
        need(operation_id not in s['external'],'同じ外部操作を二重発行しない')
        self.append('external_intent',work,{'id':operation_id,'operation':operation,'request_hash':request_hash})
    def external_outcome(self,work,operation_id,outcome,evidence_ref):
        s=self.state(work);need(operation_id in s['external'] and not s['external'][operation_id].get('outcome'),'未照合の外部操作ではない')
        need(outcome in ('SUCCESS','FAILED','NOT_EXECUTED'),'外部操作の成否が不明');self.fingerprint_refs(s,[evidence_ref])
        self.append('external_outcome',work,{'id':operation_id,'outcome':outcome,'evidence':evidence_ref})
    def resolve_issue(self,work,issue_id,child):
        s=self.state(work);need(issue_id in s['issues'],'修正指摘がない');c=self.state(child)
        need(c['plan'].get('parent_issue')=={'work':work,'id':issue_id},'子Workとの対応がない')
        need(self.next(child)['status']=='DONE','子修正の検証・事例更新が閉じていない')
        need(not c['plan'].get('simulation') or s['plan'].get('simulation'),'実際の修正を模擬完了で閉じない')
        self.append('issue_resolved',work,{'id':issue_id,'child':child})

    def reopen(self,work,node_id,reason,evidence_refs):
        s=self.state(work);n=instantiate(s['plan'])[node_id]
        need(self.node_status(s,n) in ('BLOCKED','FAILED'),'未解決・失敗結果の再分析だけを開き直せる')
        need(node_id in s['results'] and reason and evidence_refs,'元結果・再分析理由・証拠が必要')
        self.fingerprint_refs(s,evidence_refs)
        self.append('result_reopened',work,{'node':node_id,'previous_result':s['results'][node_id]['artifact'],'reason':reason,'evidence_refs':evidence_refs})

    def production_result(self,work,node_id,token,result):
        from production import check_result
        s=self.state(work);n=instantiate(s['plan'])[node_id]
        need(s['plan'].get('workflow_version') and n['actor']=='TOOL','制作ツール工程ではない')
        c=s['claims'].get(node_id)
        need(c and c['token']==token and c['expires_at']>time.time(),'有効な実行権がない')
        need(not self.integrity(s),'正本の版が変わった')
        check_result(self,work,n,result);self.fingerprint_refs(s,result['evidence_refs'])
        return self._finish(work,n,result,c['input_hash'],c['actor'])

    def production_context(self,work,context):
        s=self.state(work);need(s['plan'].get('workflow_version'),'制作工程ではない')
        need(not s['claims'],'実行中の入力は差し替えない')
        for key in ('corpusHash','modelHash','rulesHash','featureSchema'):
            need(key in context,'制作入力の版が足りない:'+key)
        return self.append('production_context',work,{'context':context})

    def migrate_definition(self,work,from_hash,evidence_refs):
        s=self.state(work);need(s['definition_hash']==from_hash and from_hash!=DEFINITION_HASH,'移行前の版が違う')
        need(not s['claims'] and evidence_refs,'実行中又は移行照合証拠がない')
        self.fingerprint_refs(s,evidence_refs)
        return self.append('definition_migrated',work,{'from':from_hash,'to':DEFINITION_HASH,'evidence_refs':evidence_refs})
