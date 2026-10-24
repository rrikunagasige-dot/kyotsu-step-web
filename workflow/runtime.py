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
                   'candidate_sha':p['plan']['source_sha'],'candidate_manifest':copy.deepcopy(p['plan']['source_manifest']),'revised':False,'external':{},'patches':{},'closed':None,'block_contexts':{},'release_versions':{u['id']:p['plan']['source_sha'] for u in p['plan'].get('release_units',[])}}
            elif s is not None:
                if k in ('result_reopened','revised','candidate','patch_applied','block_context','production_context','definition_migrated','migration_verified','issue','feedback_captured'):s['closed']=None
                if k=='work_closed':s['closed']=p
                elif k=='claimed':s['claims'][p['node']]=p
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
                elif k=='correction_adopted':s.setdefault('adopted_corrections',[]).append(p)
                elif k=='approval_coverage_migrated':s['users'][p['user_event']]['approved_bundles']=p['approved_bundles']
                elif k=='block_context':s['block_contexts'].setdefault(p['block'],{}).update(p['facets'])
                elif k=='release_bound':s['release_versions'].update({u:p['sha'] for u in p['units']})
                elif k=='migration_verified':
                    s['plan']=p['plan'];s['definition_hash']=p['definition_hash'];s['claims']={};s['results']={}
                    s['migration']=p
                elif k=='revised':s['plan']=p['plan'];s['revised']=True
                elif k=='claim_reconciled':s['claims'].pop(p['node'],None)
                elif k=='external_intent':s['external'][p['id']]=p
                elif k=='external_outcome':s['external'][p['id']]['outcome']=p['outcome'];s['external'][p['id']]['evidence']=p['evidence']
        need(s is not None,'Workが存在しない');return s
    def open(self,plan):
        self._head=self.store.head;plan_check(plan)
        policy_path=self.root/'governance/REVIEW_POLICY.json'
        if not plan.get('simulation') and plan['profile']=='material' and plan['subject'] in ('math','math-1a') and plan['mode']=='textbook' and policy_path.exists():
            import json
            policy=json.loads(policy_path.read_text())
            if policy.get('screenshotApprovalRequired') is False:
                need(plan.get('workflow_version')=='production/2','新規数学教材Workはproduction/2を指定する。旧版は履歴再生・明示移行用')
        if plan.get('workflow_version') == 'production/2':
            from graphs import normalized
            plan=normalized(plan)
            need(manifest(self.root,plan['protected_manifest'])==plan['protected_manifest'],'保護対象の固定版が違う')
        if plan.get('parent_impact'):
            parent=plan['parent_impact']
            need(all(parent.get(k) for k in ('work','signature','artifact','version')),'子影響Workの対応が不足')
            self.state(parent['work'])
            duplicate=next((e['work'] for e in self.store.events() if e['kind']=='opened' and e['payload']['plan'].get('parent_impact')==parent),None)
            need(not duplicate,'同じ原因・対象・版の既存子修正Workを再利用する:'+str(duplicate))
        need(not any(e['work']==plan['work_id'] for e in self.store.events()),'Work IDが既に存在')
        need(manifest(self.root,plan['source_manifest'])==plan['source_manifest'],'元資料の固定版と不一致')
        need(manifest(self.root,plan['rules'])==plan['rules'],'規則の固定版と不一致')
        snapshots={p:file(self.root,p).read_bytes().hex() for p in plan['source_manifest']}
        ref=self.store.put({'source_sha':plan['source_sha'],'files_hex':snapshots})
        return self.append('opened',plan['work_id'],{'plan':copy.deepcopy(plan),'definition_hash':DEFINITION_HASH,'original_snapshot':ref})
    def integrity(self,s):
        try:
            need(s['definition_hash']==DEFINITION_HASH,'工程定義の版が変わった。移行照合が必要')
            if s['plan'].get('workflow_version')=='production/2':need(manifest(self.root,s['plan'].get('protected_manifest',{}))==s['plan'].get('protected_manifest',{}),'保護対象に差分がある')
            need(manifest(self.root,s['plan']['rules'])==s['plan']['rules'],'憲法・規則の版が変わった')
            need(manifest(self.root,s['candidate_manifest'])==s['candidate_manifest'],'未記録の候補差分がある')
        except (Rejected,FileNotFoundError) as e:return str(e)
        return None
    def block_manifest(self,s,bid):
        b=next(b for b in s['plan']['blocks'] if b['id']==bid)
        return {p:s['candidate_manifest'].get(p) for p in b['sources']}
    def input_hash(self,s,node):
        if s['plan'].get('workflow_version') == 'production/2':
            from integration import input_hash
            return input_hash(self,s,node)
        p=s['plan'];watch=node['watch'];base={'definition':s['definition_hash'],'rules':p['rules'],'node':node['id'],'subject':p['subject'],'mode':p['mode']}
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
        if s['plan'].get('workflow_version') == 'production/2':
            cache=s.setdefault('_status_cache',{})
            if node['id'] not in cache:cache[node['id']]=self._node_status(s,node)
            return cache[node['id']]
        return self._node_status(s,node)
    def _node_status(self,s,node):
        r=s['results'].get(node['id']);h=self.input_hash(s,node)
        c=s['claims'].get(node['id'])
        if c:return 'RUNNING' if c['input_hash']==h and c['expires_at']>time.time() else 'BLOCKED'
        if r:
            if s['plan'].get('workflow_version') == 'production/2' and any(self.node_status(s,s.setdefault('_nodes',instantiate(s['plan']))[d]) != 'PASSED' for d in node['depends_on']):return 'INVALIDATED'
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
    def user(self,work,intent,quote,reply_to,source_ref,*,block=None,scope=None,event_id=None,verification_level='conversation_transcribed',bundle_ids=None,release_unit=None):
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
        if s['plan'].get('workflow_version') == 'production/2':
            from integration import bundle_fingerprint
            if intent == 'approve_proposal':
                bundles=s['plan']['approval_bundles']
                selected=set(bundle_ids) if bundle_ids is not None else {b['id'] for b in bundles}
                need(selected and selected <= {b['id'] for b in bundles},'承認bundleが不明')
                p['approved_bundles']={b['id']:bundle_fingerprint(s,b) for b in bundles if b['id'] in selected}
            if release_unit is not None:need(release_unit in {u['id'] for u in s['plan']['release_units']},'受入単元が不明')
            p['release_unit']=release_unit
        self.append('user',work,p,event_id=p['id'])
        if s['plan'].get('workflow_version') == 'production/2':
            from requests import capture_feedback
            capture_feedback(self,work,p)
        if intent in ('pause','resume'):self.append('paused',work,{'value':intent=='pause','user_event':p['id']})
        if intent in ('reject_block','reject_app') or intent=='quality_negative' and s['plan'].get('workflow_version')=='production/2':
            self.issue(work,{'id':digest({'user':p['id'],'block':block})[:20],'block':block,'root_cause':'USER_REVIEW_PENDING_ANALYSIS','evidence_refs':[p['id']],
                             'description':quote,'version':s['candidate_sha'],'origin':'user'})
        return p['id']
    def approval(self,s,node=None):
        if s['plan'].get('workflow_version') == 'production/2':
            from integration import approval
            return approval(self,s,node)
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
            if s['plan'].get('workflow_version')=='production/2':need(data.get('release_unit') in {u['id'] for u in s['plan']['release_units']},'app証拠にrelease unitが必要')
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
        if s['plan'].get('workflow_version') == 'production/2':
            return self.next_integration(work,s,nodes)
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
        if s['plan'].get('workflow_version') == 'production/2':
            self.fingerprint_refs(s,result['evidence_refs'])
            if n['stage_kind'] in ('R03_IMPACT','R03_IMPACT_SWEEP'):
                from impact import record_visits
                record_visits(self,work,result['impact_rows'])
            return self._finish(work,n,result,c['input_hash'],c['actor'])
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
        if s['plan'].get('workflow_version') == 'production/2':
            from integration import accept
            return accept(self,work,n,user_ref,evidence_refs)
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
        if node_id=='Z01_CLOSE' and s['plan'].get('workflow_version') == 'production/2':
            self.close_integration_issues(work,s,nodes=instantiate(s['plan']))
            s=self.state(work)
        if node_id=='Z01_CLOSE':
            need(not any(not i.get('resolved_by') for i in s['issues'].values()),'未解決の修正指摘がある')
        result={'verdict':'PASS','checks':['入力・正本・依存・未解決の照合']}
        if s['plan'].get('workflow_version')=='production/2' and node_id in ('S00_RECOVER','S01_ROUTE'):
            from requests import pending
            result.update(correction_queue=pending(self,s),command=s['plan']['command'],rules=s['plan']['rules'],blocks=s['plan']['blocks'],approval_bundles=s['plan']['approval_bundles'],release_units=s['plan']['release_units'])
        ref=self._finish(work,n,result,self.input_hash(s,n),'deterministic-code')
        if node_id=='Z01_CLOSE' and s['plan'].get('workflow_version')=='production/2':
            self.append('work_closed',work,{'result':ref,'sourceSHA':s['candidate_sha'],'definition_hash':s['definition_hash'],'proposal_hash':s['plan']['proposal']['hash'],'manifest':s['candidate_manifest']})
        return ref
    def bind_candidate(self,work,commit_sha,paths=None,release_units=None):
        s=self.state(work);need(len(commit_sha)==40 and all(c in '0123456789abcdef' for c in commit_sha),'候補SHAが不正')
        current=manifest(self.root,paths or s['candidate_manifest'])
        changed=[p for p,h in current.items() if s['candidate_manifest'].get(p)!=h]
        if changed:
            from adapters import in_scope
            need(self.approval(s) and all(in_scope(p,s['plan']['scope']) for p in changed),'未承認範囲の変更を候補として登録しない')
            need(False,'実ファイルの変更は限定修正アダプタで差分・安定ID・履歴を照合してから候補へ固定する')
        need(set(current)==set(s['candidate_manifest']),'候補の収録範囲が変わった。提案改訂が必要')
        if s['plan'].get('workflow_version') == 'production/2':
            units=release_units if release_units is not None else [u['id'] for u in s['plan']['release_units']]
            need(units and set(units) <= {u['id'] for u in s['plan']['release_units']},'固定するrelease unitが不明')
            affected={b['release_unit'] for b in s['plan']['blocks'] if any(s['candidate_manifest'].get(path)!=s['plan']['source_manifest'].get(path) for path in b['sources'])}
            need(all(u in units or self.node_status(s,instantiate(s['plan'])['G3_FINAL@'+u])=='PASSED' for u in affected),'変更unitの固定が不足')
            self.append('release_bound',work,{'sha':commit_sha,'units':units})
        self.append('candidate',work,{'sha':commit_sha,'manifest':current})
    def revise(self,work,new_plan):
        s=self.state(work);plan_check(new_plan);need(new_plan['work_id']==work,'別Workへの改訂')
        need(new_plan['profile']==s['plan']['profile'] and new_plan['command']==s['plan']['command'],'作成／修正の経路変更は別Workへ')
        need(new_plan.get('workflow_version')==s['plan'].get('workflow_version'),'工程版は明示移行を使う')
        for key in ('parent_impact','parent_issue','parent_request','parent_case','parent_work'):
            need(new_plan.get(key)==s['plan'].get(key),'改訂で親子関係を付け替えない')
        need(new_plan['proposal']['hash']!=s['plan']['proposal']['hash'],'意味の変更には新しい提案版が必要')
        need(new_plan['source_sha']==s['plan']['source_sha'],'原資料の元SHAを改訂で差し替えない')
        need(new_plan['source_manifest']==s['plan']['source_manifest'] and new_plan['rules']==s['plan']['rules'],'原資料・規則の移行は新Workで照合する')
        if new_plan.get('workflow_version') == 'production/2':
            from graphs import normalized
            new_plan=normalized(new_plan)
        self.append('revised',work,{'plan':new_plan})
    def reconcile_claim(self,work,node_id,outcome,evidence_refs):
        s=self.state(work);need(node_id in s['claims'],'照合する実行権がない')
        need(outcome in ('NOT_EXECUTED','FAILED','RESULT_LOST_REVIEW_REQUIRED'),'完了は証拠付きの通常提出で受理する')
        self.fingerprint_refs(s,evidence_refs);need(evidence_refs,'照合根拠がない')
        self.append('claim_reconciled',work,{'node':node_id,'outcome':outcome,'evidence_refs':evidence_refs})
    def external_intent(self,work,operation,request_hash,operation_id,release_unit=None):
        s=self.state(work);need(not s['plan'].get('simulation'),'模擬Workから外部操作しない')
        allowed={'MERGE':'authorize_merge','DEPLOY':'authorize_deploy','COST':'authorize_cost'}
        need(operation in allowed,'外部操作が未登録')
        inherited=False
        if operation=='DEPLOY' and s['plan'].get('workflow_version'):
            import json
            policy=json.loads((self.root/'governance/REVIEW_POLICY.json').read_text())
            scoped=self.approval(s)
            hashes={s['plan']['proposal']['hash']}
            if s['plan'].get('workflow_version')=='production/2':
                need(release_unit in {u['id'] for u in s['plan']['release_units']},'公開操作にrelease unitが必要')
                node=instantiate(s['plan'])['G3_HOST@'+release_unit]
                need(all(self.node_status(s,instantiate(s['plan'])[d])=='PASSED' for d in node['depends_on']),'公開前の横断QAが未完了')
                need(self.node_status(s,node)!='PASSED','同じ公開結果を重複実行しない')
                scoped=self.approval(s,node)
                unit=next(u for u in s['plan']['release_units'] if u['id']==release_unit)
                hashes.update(a['proposal_hash'] for a in s['plan']['approval_bundles'] if set(a['block_ids']).intersection(unit['block_ids']))
            inherited=policy.get('repeatPublicationApproval') is False and policy.get('reviewSurface')=='existing-public-app' and bool(scoped) and request_hash in hashes
        need(inherited or any(u['intent']==allowed[operation] and u['reply_to']==request_hash for u in s['users'].values()),'外部操作の具体的な承認がない')
        need(operation_id not in s['external'],'同じ外部操作を二重発行しない')
        self.append('external_intent',work,{'id':operation_id,'operation':operation,'request_hash':request_hash,'release_unit':release_unit})
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

    def next_integration(self,work,s,nodes):
        from requests import pending
        if s['plan']['command']=='CMD-WORK-002':
            queue=pending(self,s)
            override=next((u for u in reversed(list(s['users'].values())) if u['intent']=='priority_override' and u['scope']==s['plan']['scope']),None)
            if queue and not override:return {'status':'BLOCKED','reason':'CORRECTION_FIRST','issues':queue,'resume_work':work,'preserved_results':list(s['results'])}
        # Priority is release unit, but only ready nodes compete. Shared approval cannot block another design.
        ordered=sorted(nodes.values(),key=lambda n:n['priority'])
        for n in ordered:
            nid=n['id'];status=self.node_status(s,n)
            if nid in s['claims']:return {'status':'WAITING' if status=='RUNNING' else 'BLOCKED','reason':'CLAIM_RECONCILIATION_OR_RESULT','node':nid}
            if status=='PASSED':continue
            if not all(self.node_status(s,nodes[d])=='PASSED' for d in n['depends_on']):continue
            if status in ('BLOCKED','FAILED'):return {'status':status,'reason':'修正・追加証拠・提案改訂が必要','node':nid}
            if n['actor']=='USER':return {'status':'WAITING','reason':'USER_DECISION','task':self.task(work,nid)}
            return {'status':'READY','task':self.task(work,nid)}
        return {'status':'DONE' if all(self.node_status(s,n)=='PASSED' for n in nodes.values()) else 'BLOCKED','reason':'全工程の有効な証拠を照合'}

    def block_context(self,work,block,facets,evidence_refs):
        from graphs import FACETS
        s=self.state(work);need(s['plan'].get('workflow_version')=='production/2','production/2のblock入力用')
        need(not s['claims'],'実行中の入力差替えは禁止')
        need(block in {b['id'] for b in s['plan']['blocks']} and facets and set(facets)<=FACETS,'block又は入力属性が不明')
        need(evidence_refs,'入力改訂の証拠が必要');self.fingerprint_refs(s,evidence_refs)
        need(all(isinstance(v,str) and len(v)==64 and all(c in '0123456789abcdef' for c in v) for v in facets.values()),'入力はStore artifact hash')
        for ref in facets.values():self.store.get(ref)
        self.append('block_context',work,{'block':block,'facets':facets,'evidence_refs':evidence_refs})

    def close_integration_issues(self,work,s,nodes):
        # Any mandatory related correction must be complete before parent closure, even if scoped release was allowed.
        for nid,r in s['results'].items():
            if not nid.startswith('G2_AUDIT@'):continue
            for row in self.store.get(r['artifact']).get('audit_rows',[]):
                if row.get('linkedCorrection'):need(self.next(row['linkedCorrection'])['status']=='DONE','引継いだ必須修正が未完了')
        if s['plan']['command']!='CMD-WORK-001':return
        # Related-child rows must already be verified by the post-fix contract; primary issue can close locally.
        for uid in [u['id'] for u in s['plan']['release_units']]:
            for stage in ('G3_FINAL','R03_IMPACT_SWEEP','L01_LEARNING'):
                need(self.node_status(s,nodes[stage+'@'+uid])=='PASSED','修正の受入・事後影響・事例確定が未完了')
        for issue in s['issues'].values():
            if issue.get('resolved_by'):continue
            blocks=[b for b in s['plan']['blocks'] if issue.get('block') in (None,b['id'])]
            need(blocks,'指摘の対象blockがない')
            for b in blocks:
                r=s['results'].get('R08_CAPTURE_LEARNING@'+b['id']);need(r,'修正事例が未確定')
                case=next((c for c in self.store.get(r['artifact'])['case_updates'] if c['id']==issue['id']),None)
                need(case and case.get('resolution')=='VERIFIED_FIXED' and case.get('repair_evidence_refs'),'原症状の修正証拠がない')
                self.fingerprint_refs(s,case['repair_evidence_refs'])
            self.append('issue_resolved',work,{'id':issue['id'],'child':work,'proof':{nid:r['artifact'] for nid,r in s['results'].items() if nid.startswith(('R07','R08','G3_FINAL','R03_IMPACT_SWEEP'))}})

    def resolve_request(self,work,request_id,child):
        s=self.state(work);cs=self.state(child)
        request=next((e for e in self.store.events() if e['work']==work and e['kind']=='request_received' and e['payload']['id']==request_id),None)
        need(request and cs['plan'].get('parent_request')=={'work':work,'id':request_id},'修正依頼と子Workの対応がない')
        need(self.next(child)['status']=='DONE' and (s['plan'].get('simulation') or not cs['plan'].get('simulation')),'子修正の完了証拠がない')
        return self.append('request_resolved',work,{'request_id':request_id,'child':child})

    def adopt_correction(self,work,child,block_map,evidence_refs):
        """Compose parent permission with a verified child's exact delta, without inventing a user approval."""
        from graphs import normalized
        from integration import bundle_fingerprint
        from adapters import in_scope
        s=self.state(work);c=self.state(child);p=normalized(s['plan']);cp=normalized(c['plan'])
        need(p['command']=='CMD-WORK-002' and cp['command']=='CMD-WORK-001' and cp.get('parent_work')==work,'親作成・子修正の対応が違う')
        need(not s['claims'] and self.next(child)['status']=='DONE','親が実行中又は子修正が未完了')
        need(p.get('simulation') or not cp.get('simulation'),'実Workへ模擬修正を取り込まない')
        old_approval=self.approval(s);child_approval=self.approval(c)
        need(old_approval and child_approval and evidence_refs,'親の不変範囲・子の差分を覆う承認が必要');self.fingerprint_refs(s,evidence_refs)
        parents={b['id']:b for b in p['blocks']};children={b['id']:b for b in cp['blocks']}
        need(block_map and set(block_map)<=parents.keys() and set(block_map.values())<=children.keys() and len(set(block_map.values()))==len(block_map),'block対応が不正')
        changed={path for path,h in c['candidate_manifest'].items() if cp['source_manifest'].get(path)!=h}
        need(changed and all(path in s['candidate_manifest'] and cp['source_manifest'][path]==s['candidate_manifest'][path] and in_scope(path,p['scope']) and in_scope(path,cp['scope']) for path in changed),'差分の元版・親子の承認範囲が違う')
        need(changed <= {path for bid in block_map for path in parents[bid]['sources']},'対応表にないblock差分')
        need({bid for bid,b in parents.items() if set(b['sources']).intersection(changed)} <= set(block_map),'共有ファイルで影響するblockが対応表から抜けている')
        need(manifest(self.root,c['candidate_manifest'])==c['candidate_manifest'],'子修正後の現行ファイルが違う')
        for b in p['blocks']:
            b.setdefault('content_design_hash',next(a['content_hash'] for a in p['approval_bundles'] if b['id'] in a['block_ids']))
        mapping={}
        for parent_id,child_id in block_map.items():
            cb=children[child_id];pb=parents[parent_id]
            need(set(cb['sources'])==set(pb['sources']),'親子で原資料scopeが違う')
            h=cb.get('content_design_hash') or next(a['content_hash'] for a in cp['approval_bundles'] if child_id in a['block_ids'])
            pb['content_design_hash']=h
            mapping[parent_id]={'child_block':child_id,'content_hash':h,'facets':cb['change_facets']}
        composite=digest({'parent_proposal':p['proposal']['hash'],'child':child,'child_proposal':cp['proposal']['hash'],'mapping':mapping})
        p['proposal']={'id':p['proposal']['id']+'+'+child,'hash':composite}
        for bundle in p['approval_bundles']:
            if set(bundle['block_ids']).intersection(block_map):
                bundle['proposal_hash']=composite;bundle['content_hash']=digest({b:parents[b]['content_design_hash'] for b in bundle['block_ids']})
        proof=self.store.put({'parent_approval':old_approval['id'],'child_approval':child_approval['id'],'child_work':child,'mapping':mapping,'child_results':{k:r['artifact'] for k,r in c['results'].items()},'changed_manifest':{path:c['candidate_manifest'][path] for path in changed}})
        self.append('revised',work,{'plan':p})
        for bid,row in mapping.items():
            self.append('block_context',work,{'block':bid,'facets':{facet:proof for facet in row['facets']},'evidence_refs':evidence_refs})
        updated=dict(s['candidate_manifest']);updated.update({path:c['candidate_manifest'][path] for path in changed})
        self.append('candidate',work,{'sha':c['candidate_sha'],'manifest':updated})
        self.append('release_bound',work,{'sha':c['candidate_sha'],'units':list({parents[bid]['release_unit'] for bid in block_map})})
        current=self.state(work)
        self.append('approval_coverage_migrated',work,{'user_event':old_approval['id'],'approved_bundles':{b['id']:bundle_fingerprint(current,b) for b in p['approval_bundles']},'evidence_refs':evidence_refs,'composite_proof':proof})
        self.append('correction_adopted',work,{'child':child,'proof':proof,'blocks':list(block_map)})
        return {'proof':proof,'proposal_hash':composite,'required_rechecks':self.next(work)}
