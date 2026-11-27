"""作成・修正の状態機械。AIの自動起動や自然言語判断の正しさは保証しない。"""
import copy,time,uuid
from pathlib import Path
from store import Store,open_store,digest,Conflict
from contracts import need,Rejected,plan_check,result_check,manifest,file,sha,transition_sources,transition_block_paths
from definitions import instantiate,DEFINITION_HASH,VERSION

USER_INTENTS={'approve_proposal','authorize_team_policy','accept_block','accept_app','reject_block','reject_app','pause','resume','priority_override','authorize_merge','authorize_deploy','authorize_cost','quality_positive','quality_negative','continue'}

class Runtime:
    def __init__(self,store,root):
        self.store=open_store(store);self.root=Path(root).resolve();self._head=self.store.head
        if getattr(self.store, 'checkpoint_mode', False):
            from checkpoint import current_core_identity
            self._checkpoint_core_identity = current_core_identity()
    def append(self,kind,work,payload,**kwargs):
        event=self.store.append(kind,work,payload,expected=self._head,**kwargs);self._head=event['hash'];return event
    def state(self,work):
        checkpoint = getattr(self.store, 'checkpoint_mode', False)
        s = self.store.state_base(work) if checkpoint else None
        events = self.store.suffix_events() if checkpoint else self.store.events()
        # The expected HEAD belongs to this exact read, not a later reread.
        self._head = events[-1]['hash'] if events else self.store.checkpoint_anchor['head'] if checkpoint else '0'*64
        if s is not None:
            s.pop('_status_cache', None); s.pop('_nodes', None)
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
                elif k=='checkpoint_definition_migrated':
                    s['definition_hash']=p['to'];s['candidate_sha']=p['candidateSHA'];s['candidate_manifest']=p['candidateManifest']
                    s['release_versions']['qf01-p035']=p['candidateSHA'];s['checkpoint_definition_migration']=p;s['closed']=None
                elif k=='informed_review_method_adopted':
                    need(checkpoint and work=='W-MATH-QF01-FULL-RELEASE-P035-20261115','D02_CHECKPOINT_WORK_REQUIRED')
                    s['informed_review_method']=copy.deepcopy(p);s['closed']=None
                elif k=='informed_review_method_revoked':
                    need(checkpoint and work=='W-MATH-QF01-FULL-RELEASE-P035-20261115','D02_CHECKPOINT_WORK_REQUIRED')
                    if s.get('informed_review_method',{}).get('authorityRef')==p['authorityRef']:
                        s['informed_review_method']['revoked']=True
                        s['informed_review_method']['revocation']=copy.deepcopy(p);s['closed']=None
                elif k=='informed_technical_candidate_reconciled':
                    need(checkpoint and work=='W-TECH-QF01-CHECKPOINT-RECOVERY-20261122',
                         'D02_EXISTING_TECHNICAL_OWNER_REQUIRED')
                    s['candidate_sha']=p['proof']['candidateSHA']
                    s['candidate_manifest']=copy.deepcopy(p['proof']['candidateManifest'])
                    s['informed_technical_candidate_reconciliation']=copy.deepcopy(p);s['closed']=None
                elif k=='production_context':s['production_context']=p['context']
                elif k=='correction_adopted':s.setdefault('adopted_corrections',[]).append(p)
                elif k=='approval_coverage_migrated':s['users'][p['user_event']]['approved_bundles']=p['approved_bundles']
                elif k=='block_context':s['block_contexts'].setdefault(p['block'],{}).update(p['facets'])
                elif k=='release_bound':s['release_versions'].update({u:p['sha'] for u in p['units']})
                elif k=='migration_verified':
                    s['plan']=p['plan'];s['definition_hash']=p['definition_hash'];s['claims']={};s['results']={}
                    s['migration']=p
                elif k=='version_transition_prepared':
                    s['plan']=p['plan'];s['version_transition']=p['transition'];s['block_contexts'].setdefault('qf01-full-lesson',{})['source']=p['source_context'];s['candidate_manifest'].update(p['transition']['existing']);s['results']={n:r for n,r in s['results'].items() if n in ('S00_RECOVER','S01_ROUTE')};s['closed']=None
                elif k=='version_transition_reconciled':
                    s['plan']=p['plan'];s['candidate_manifest']=p['candidate_manifest'];s['block_contexts']=p['block_contexts'];s['version_transition']=dict(s['version_transition'],status=p['outcome']);s['closed']=None
                elif k=='materialization_bound':s['plan']=p['plan'];s['materialization']=p
                elif k=='team_policy_adopted':
                    for node_id in p.get('reviewer_handoff',{}).get('interruptedClaims',[]):s['claims'].pop(node_id,None)
                    s['plan']=p['plan']
                    for node_id in p.get('invalidated_results', []): s['results'].pop(node_id, None)
                    s['team_migration']=p;s['closed']=None
                elif k=='revised':s['plan']=p['plan'];s['revised']=True
                elif k=='claim_reconciled':s['claims'].pop(p['node'],None)
                elif k=='external_intent':s['external'][p['id']]=p
                elif k=='external_outcome':s['external'][p['id']]['outcome']=p['outcome'];s['external'][p['id']]['evidence']=p['evidence']
        need(s is not None,'Workが存在しない');return s
    def open(self,plan):
        self._head=self.store.head;need(not plan.get('source_extension'),'版移行の拡張は正規prepareのみ');plan_check(plan)
        team_policy_path=self.root/'governance/TEAM_POLICY.json'
        if not plan.get('simulation') and plan['profile']=='material' and team_policy_path.exists():
            import json
            configured=json.loads(team_policy_path.read_text())
            need(plan.get('workflow_version') == 'production/2' and plan.get('agent_team'), '新規教材Workはproduction/2＋承認済みteam policyを指定する')
            from team import validate_policy
            need(validate_policy(plan['agent_team']) == validate_policy(configured['default_policy']), '標準team policyと異なる方針は先に具体案として承認する')
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
            from checkpoint import history_events
            duplicate=next((e['work'] for e in history_events(self,'complete') if e['kind']=='opened' and e['payload']['plan'].get('parent_impact')==parent),None)
            need(not duplicate,'同じ原因・対象・版の既存子修正Workを再利用する:'+str(duplicate))
        if getattr(self.store, 'checkpoint_mode', False):
            need(self.store.can_open(plan['work_id']), 'Work IDが既に存在')
        else:
            need(not any(e['work']==plan['work_id'] for e in self.store.events()),'Work IDが既に存在')
        need(manifest(self.root,plan['source_manifest'])==plan['source_manifest'],'元資料の固定版と不一致')
        need(manifest(self.root,plan['rules'])==plan['rules'],'規則の固定版と不一致')
        snapshots={p:file(self.root,p).read_bytes().hex() for p in plan['source_manifest']}
        ref=self.store.put({'source_sha':plan['source_sha'],'files_hex':snapshots})
        return self.append('opened',plan['work_id'],{'plan':copy.deepcopy(plan),'definition_hash':DEFINITION_HASH,'original_snapshot':ref})
    def integrity(self,s):
        if getattr(self.store, 'checkpoint_mode', False):
            import hashlib
            engine = Path(__file__).resolve().parent
            try:
                if any(hashlib.sha256((engine/name).read_bytes()).hexdigest()!=wanted
                       for name,wanted in self._checkpoint_core_identity['files'].items()):
                    return 'checkpoint実行器sourceが開始後に変化した。fresh processで再読込みが必要'
            except OSError:
                return 'checkpoint実行器sourceを照合できない'
        try:
            need(s['definition_hash']==DEFINITION_HASH,'工程定義の版が変わった。移行照合が必要')
            if s['plan'].get('workflow_version')=='production/2':need(manifest(self.root,s['plan'].get('protected_manifest',{}))==s['plan'].get('protected_manifest',{}),'保護対象に差分がある')
            need(manifest(self.root,s['plan']['rules'])==s['plan']['rules'],'憲法・規則の版が変わった')
            if (getattr(self.store,'checkpoint_mode',False) and s['plan']['work_id']=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
                    and s['plan']['proposal'].get('publisherRevision') is not None):
                need(manifest(self.root,s['plan']['protected_manifest'])==s['plan']['protected_manifest'],
                     'PUB_REVISION_CURRENT_PROTECTED_BYTES_CHANGED')
            need(manifest(self.root,s['candidate_manifest'])==s['candidate_manifest'],'未記録の候補差分がある')
        except (Rejected,FileNotFoundError) as e:return str(e)
        return None
    def block_manifest(self,s,bid):
        b=next(b for b in s['plan']['blocks'] if b['id']==bid)
        return {p:s['candidate_manifest'].get(p) for p in transition_block_paths(s['plan'],b)}
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
        reconciliation=s.get('informed_technical_candidate_reconciliation')
        if (getattr(self.store,'checkpoint_mode',False)
                and p['work_id']=='W-TECH-QF01-CHECKPOINT-RECOVERY-20261122'
                and node['id'] in ('T01_ANALYSIS','T02_APPROVAL','T03_BUILD','T04_VERIFY')
                and reconciliation):
            base['informed_technical_candidate']={
                'proofRef':reconciliation['proofRef'],
                'methodAuthorityRef':reconciliation['proof']['methodAuthorityRef'],
                'candidateSHA':s['candidate_sha'],
                'candidateManifestSHA256':digest(s['candidate_manifest'])}
        if (getattr(self.store,'checkpoint_mode',False) and p['work_id']=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
                and p['proposal'].get('publisherRevision') is not None):
            base['publisher_revision']=digest(p['proposal']['publisherRevision'])
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
        from checkpoint import queue_coverage, UnknownContext
        if queue_coverage(self)['status'] != 'COMPLETE':
            raise UnknownContext('GLOBAL_PENDING_ISSUES_NOT_RECOVERED')
        outstanding=[]
        for w in {e['work'] for e in self.store.events() if e['kind']=='opened'}:
            for i in self.state(w)['issues'].values():
                if not i.get('resolved_by'):outstanding.append(dict(i,work=w))
        return outstanding
    def user(self,work,intent,quote,reply_to,source_ref,*,block=None,scope=None,event_id=None,verification_level='conversation_transcribed',bundle_ids=None,release_unit=None,team_policy_hash=None):
        s=self.state(work);need(intent in USER_INTENTS,'ユーザー意図の種別が不明')
        need(quote and reply_to and source_ref,'発言原文・対応先・出所が必要')
        need(verification_level in ('conversation_transcribed','authenticated_connector','simulation'),'出所の検証段階が不明')
        need(verification_level!='simulation' or s['plan'].get('simulation'),'実Workに模擬承認を入れない')
        if intent in ('approve_proposal','authorize_team_policy'):need(reply_to==s['plan']['proposal']['hash'],'承認が現在の具体的な提案版に対応しない')
        if intent=='authorize_team_policy':
            need(team_policy_hash is not None and bundle_ids is None and block is None and release_unit is None,'担当方針専用承認にはpolicy hashが必要。教材bundle・受入を付与しない')
            need(scope is None or scope==s['plan']['scope'],'担当方針承認のWork範囲が違う')
        if intent in ('accept_block','reject_block'):
            need(block in [b['id'] for b in s['plan']['blocks']],'確認対象ブロックが不明')
        p={'id':event_id or str(uuid.uuid4()),'intent':intent,'quote':quote,'reply_to':reply_to,'source_ref':source_ref,'block':block,
           'proposal_hash':s['plan']['proposal']['hash'],'scope':scope or s['plan']['scope'],'candidate_sha':s['candidate_sha'],
           'block_manifest':self.block_manifest(s,block) if block else None,'verification_level':verification_level}
        if team_policy_hash is not None:
            need(intent in ('approve_proposal','authorize_team_policy') and isinstance(team_policy_hash, str) and len(team_policy_hash) == 64 and all(c in '0123456789abcdef' for c in team_policy_hash), 'team policy承認のhashが不正')
            p['team_policy_hash'] = team_policy_hash
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
    def _publisher_revision_history(self, state=None):
        from checkpoint import (PUBLISHER_WORK,FIXED_WORK,publisher_revision_frames)
        need(getattr(self.store,'checkpoint_mode',False),'PUB_REVISION_CHECKPOINT_REQUIRED')
        expected_head=self._head
        rows=self.store.suffix_events()
        need(rows and rows[-1]['hash']==expected_head==self.store.head,
             'PUB_REVISION_EXPECTED_HEAD_UNCHANGED')
        original=self.store.state_base(FIXED_WORK)
        replayed=publisher_revision_frames(rows,self.store.get,original,self.store.checkpoint_epoch,
                                           instantiate((state or self.state(PUBLISHER_WORK))['plan']))
        current=replayed['current']
        need(current and current['state']['plan']['work_id']==PUBLISHER_WORK,
             'PUB_REVISION_ACTUAL_EXISTING_OWNER')
        if state is not None:
            need(all(current['state'].get(key)==state.get(key) for key in
                 ('plan','definition_hash','claims','results','evidence','users','issues',
                  'paused','candidate_sha','candidate_manifest','patches','external')),
                 'PUB_REVISION_NORMAL_STATE_REPLAY_EQUALITY')
        need(self._head==expected_head==self.store.head,'PUB_REVISION_EXPECTED_HEAD_UNCHANGED')
        return replayed,rows

    def _publisher_revision_validate(self, state, new_plan):
        from checkpoint import validate_publisher_revision_plan
        from adapters import _checkpoint_publisher_revision_primary
        from checkpoint import publisher_revision_carrier
        publisher_revision_carrier(new_plan)
        replayed,rows=self._publisher_revision_history(state)
        expected_head=self._head
        frame=replayed['current']
        # 別read-only primary観測は、このRuntimeのCAS headを更新しない。
        primary=_checkpoint_publisher_revision_primary(self,new_plan,replayed,rows)
        need(self._head==expected_head==self.store.head,'PUB_REVISION_EXPECTED_HEAD_UNCHANGED')
        validated=validate_publisher_revision_plan(replayed['frames'][0]['state']['plan'],
            frame,new_plan,primary,self.store.get,rows[-1])
        need(manifest(self.root,validated['protected_manifest'])==validated['protected_manifest']
             and manifest(self.root,frame['state']['candidate_manifest'])==frame['state']['candidate_manifest'],
             'PUB_REVISION_CURRENT_EXECUTION_BEFORE_BYTES')
        need(self._head==expected_head==self.store.head,'PUB_REVISION_EXPECTED_HEAD_UNCHANGED')
        return validated

    def approval(self,s,node=None):
        if (getattr(self.store,'checkpoint_mode',False) and s['plan']['work_id']=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
                and s['plan']['proposal'].get('publisherRevision') is not None):
            from checkpoint import publisher_revision_approval
            replayed,_=self._publisher_revision_history(s)
            return publisher_revision_approval(replayed['current'])
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
                if capture.get('kind')=='capture' and capture.get('data',{}).get('source_ci_ref'):
                    from adapters import source_ci_verify_capture
                    source_ci_verify_capture(self,work,capture['data'])
                    need(data.get('source_sha')==capture['data']['source_sha'],'source_ci画像の対象sourceが違う')
                if capture.get('kind')=='local_capture':
                    from local_render_evidence import validate_local_capture
                    verified=validate_local_capture(self,work,data['capture_ref'])
                    need(verified['files'].get(data['path'])==actual and data.get('source_sha')==s['candidate_sha'],'ローカル画像成果物との対応がない')
                else:
                    need(capture.get('kind')=='capture' and capture['data']['files'].get(data['path'])==actual,'CI画像成果物との対応がない')
        elif kind=='local_capture':
            need(verification_level=='local_execution','ローカル捕捉の実行出所が必要')
            from local_render_evidence import verify_local_capture
            data=verify_local_capture(self,work,data)
        elif kind=='source_ci':
            from adapters import source_ci_verify
            data=source_ci_verify(self,work,data)
        elif kind=='ci':
            need(data.get('status')=='completed' and data.get('conclusion')=='success','CIが成功していない')
            need(data.get('head_sha')==s['candidate_sha'],'別SHAのCIは採用できない')
            need(data.get('id') and data.get('html_url','').startswith('https://github.com/'),'CIの実行参照が不足')
        elif kind=='capture':
            ci=s['evidence'].get(data.get('ci_ref'),{})
            if ci.get('kind')=='source_ci':
                from adapters import source_ci_verify_capture
                source_ci_verify_capture(self,work,data)
            else:
                need(ci.get('kind')=='ci' and ci['data']['head_sha']==data.get('source_sha'),'画像とCIのSHA対応がない')
            need(data.get('artifact_sha256') and data.get('files'),'画像成果物の対応表がない')
        elif kind=='app':
            if s['plan'].get('workflow_version')=='production/2':
                need(data.get('release_unit') in {u['id'] for u in s['plan']['release_units']},'app証拠にrelease unitが必要')
                route=next(u.get('review_route') for u in s['plan']['release_units'] if u['id']==data['release_unit'])
                if route:
                    from urllib.parse import urlsplit
                    need(urlsplit(data.get('url','')).fragment==route.removeprefix('#'),'実物確認URLが対象unitのrouteと違う')
            need(data.get('source_sha')==s['candidate_sha'] and data.get('manifest_sha')==s['candidate_sha'],'アプリと対象SHAが異なる')
            need(data.get('url','').startswith('https://') and data.get('reachable') and data.get('auth_wall') is False,'実働URL・到達性・認証壁が未確認')
            need(data.get('mobile') and data.get('desktop') and data.get('progress_isolated'),'端末・履歴分離の証拠が不足')
        elif kind=='check':
            if (getattr(self.store,'checkpoint_mode',False)
                and work=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
                and isinstance(data.get('checks'),dict)
                and data['checks'].get('purpose')=='D06_PUBLISHER_REVISION_CI_FAILURE'):
                from checkpoint import (INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,
                    PUBLISHER_REVISION_PATHS,validate_publisher_failure_objects,
                    validate_publisher_failure_evidence)
                need(set(data)=={'status','source_sha','checks'}
                     and data['status']=='PASS' and data['source_sha']==s['candidate_sha']
                     and set(data['checks'])=={'purpose','runRaw','jobsRaw'},
                     'PUB_REVISION_FAILURE_INPUT_FIELDS')
                need(s['plan']['proposal']['hash']==INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256
                     and set(s['plan']['scope']['paths'])==PUBLISHER_REVISION_PATHS
                     and s['plan'].get('parent_work')=='W-MATH-QF01-FULL-RELEASE-P035-20261115'
                     and not s['claims'] and not s['paused']
                     and verification_level in ('tool_result_transcribed','local_execution'),
                     'PUB_REVISION_FAILURE_CHECK_SCOPE')
                raw=copy.deepcopy(data['checks'])
                result=validate_publisher_failure_objects(raw['runRaw'],raw['jobsRaw'],
                    s['candidate_sha'],s['plan']['proposal']['sourceCIPolicy'])
                need(source_ref=='https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/'+str(result['runID']),
                     'PUB_REVISION_FAILURE_SOURCE_REF')
                checks={'purpose':raw['purpose'],
                    'runRawRef':self.store.put(raw['runRaw']),
                    'jobsRawRef':self.store.put(raw['jobsRaw']),
                    **{key:result[key] for key in ('runRawSHA256','jobsRawSHA256',
                        'failedJobIDs','producerQAPassed','formalT04Accepted')}}
                data={'status':'PASS','source_sha':s['candidate_sha'],'checks':checks}
                validate_publisher_failure_evidence({'kind':'check','data':data,
                    'source_ref':source_ref,'verification_level':verification_level},
                    s['candidate_sha'],s['plan']['proposal']['sourceCIPolicy'],self.store.get)
            need(data.get('status')=='PASS' and data.get('source_sha')==s['candidate_sha'],'検査対象版または結果が不正')
            need(data.get('checks'),'検査項目がない')
        else:raise Rejected('証拠の種類が未登録')
        ref=eid or str(uuid.uuid4());self.append('evidence',work,{'id':ref,'kind':kind,'data':data,'source_ref':source_ref,'verification_level':verification_level},event_id='evidence-'+ref)
        return ref
    def fingerprint_refs(self,s,refs):
        team_refs=set()
        if s['plan'].get('agent_team'):
            from checkpoint import history_events
            for event in history_events(self,'team',s['plan']['work_id']):
                if event['work'] != s['plan']['work_id']: continue
                if event['kind'] == 'team_output_recorded': team_refs.add(event['payload']['outputRef'])
                elif event['kind'] == 'team_harness_captured': team_refs.add(event['payload']['artifactRef'])
        for ref in refs:
            need(ref in s['evidence'] or ref in s['users'] or ref in team_refs,'未登録の証拠参照:'+ref)
            if ref in s['evidence']:
                from adapters import source_ci_verify_evidence_chain
                source_ci_verify_evidence_chain(self,s['plan']['work_id'],ref)
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
    def claim(self,work,node_id,actor,seconds=900,agent_guard_ref=None):
        from agent_guard import consume_inventory
        if self.state(work)['plan'].get('workflow_version') == 'production/2':
            consume_inventory(self,work,'claim',agent_guard_ref)
        need(actor,'実行者IDがない');nxt=self.next(work)
        need(nxt.get('status')=='READY' and nxt['task']['node']['id']==node_id,'現在実行可能なノードではない')
        task=nxt['task'];need(task['node']['actor'] in ('AI','AUDITOR','TOOL'),'このノードはclaim対象外')
        p={'node':node_id,'actor':actor,'input_hash':task['input_hash'],'task_id':task['task_id'],'token':uuid.uuid4().hex,'expires_at':time.time()+seconds}
        self.append('claimed',work,p);return dict(task,claim_token=p['token'])
    def _finish(self,work,node,result,input_hash,actor):
        s=self.state(work);need(input_hash==self.input_hash(s,node),'入力版が変わった結果を受理しない')
        append_options={}
        if (getattr(self.store,'checkpoint_mode',False) and work=='W-MATH-QF01-FULL-RELEASE-P035-20261115'
                and node['actor'] in ('AI','TOOL','AUDITOR')):
            from checkpoint import validate_append_deadline
            claim=s['claims'].get(node['id'])
            need(claim and claim.get('input_hash')==input_hash and claim.get('actor')==actor,
                 'CHECKPOINT_RESULT_ACTUAL_CLAIM_REQUIRED')
            deadline=claim.get('expires_at');validate_append_deadline(deadline)
            append_options['not_after']=deadline
        h=self.store.put(result)
        self.append('result',work,{'node':node['id'],'artifact':h,'input_hash':input_hash,'actor':actor,'verdict':result['verdict']},**append_options)
        return h
    def submit(self,work,node_id,token,result,agent_guard_ref=None):
        from agent_guard import consume_inventory
        if self.state(work)['plan'].get('workflow_version') == 'production/2':
            consume_inventory(self,work,'submit',agent_guard_ref)
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
            need(any(e['kind'] in ('ci','check') and not (e['kind']=='check' and isinstance(e['data'].get('checks'),dict) and e['data']['checks'].get('purpose')=='D06_PUBLISHER_REVISION_CI_FAILURE') and e['data'].get('head_sha',e['data'].get('source_sha'))==s['candidate_sha'] for e in es),'現在のSHAの検査証拠がない')
        elif node_id=='G3_HOST':need(any(e['kind']=='app' and e['data']['source_sha']==s['candidate_sha'] for e in es),'到達確認済みの実働アプリ証拠がない')
        return self._finish(work,n,{'verdict':'PASS','evidence_refs':list(evidence_refs)},c['input_hash'],c['actor'])
    def execute(self,work,node_id,agent_guard_ref=None):
        from agent_guard import consume_inventory
        if self.state(work)['plan'].get('workflow_version') == 'production/2':
            consume_inventory(self,work,'execute',agent_guard_ref)
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
            from checkpoint import queue_coverage
            coverage=queue_coverage(self)
            queue=pending(self,s) if coverage['status']=='COMPLETE' else None
            result.update(correction_queue=queue,command=s['plan']['command'],rules=s['plan']['rules'],blocks=s['plan']['blocks'],approval_bundles=s['plan']['approval_bundles'],release_units=s['plan']['release_units'])
            if coverage['status']!='COMPLETE':result['correction_queue_coverage']=coverage
        ref=self._finish(work,n,result,self.input_hash(s,n),'deterministic-code')
        if node_id=='Z01_CLOSE' and s['plan'].get('workflow_version')=='production/2':
            self.append('work_closed',work,{'result':ref,'sourceSHA':s['candidate_sha'],'definition_hash':s['definition_hash'],'proposal_hash':s['plan']['proposal']['hash'],'manifest':s['candidate_manifest']})
        return ref
    def bind_candidate(self,work,commit_sha,paths=None,release_units=None):
        s=self.state(work);need(len(commit_sha)==40 and all(c in '0123456789abcdef' for c in commit_sha),'候補SHAが不正')
        if (getattr(self.store,'checkpoint_mode',False) and work=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
                and s['plan']['proposal'].get('publisherRevision') is not None):
            replayed,_=self._publisher_revision_history(s);frame=replayed['current']
            policy=s['plan']['proposal']['sourceCIPolicy']
            need(frame['patchApplied'] and frame['t03ResultEvent'] and frame['bindEvent'] is None
                 and s['candidate_manifest']==policy['ownerAfterManifest']
                 and policy['buildArtifactName']=='qf01-build-'+commit_sha+'-1'
                 and policy['qaArtifactName']=='qf01-reports-'+commit_sha+'-1',
                 'PUB_REVISION_BIND_REQUIRES_CURRENT_T03_AND_CANDIDATE')
        current=manifest(self.root,paths or s['candidate_manifest'])
        changed=[p for p,h in current.items() if s['candidate_manifest'].get(p)!=h]
        if changed:
            from adapters import in_scope
            need(self.approval(s) and all(in_scope(p,s['plan']['scope']) for p in changed),'未承認範囲の変更を候補として登録しない')
            need(False,'実ファイルの変更は限定修正アダプタで差分・安定ID・履歴を照合してから候補へ固定する')
        need(set(current)==set(s['candidate_manifest']),'候補の収録範囲が変わった。提案改訂が必要')
        if s.get('version_transition'):
            from adapters import _vt_verify_candidate_git
            _vt_verify_candidate_git(self,s,commit_sha)
        if s['plan'].get('workflow_version') == 'production/2':
            units=release_units if release_units is not None else [u['id'] for u in s['plan']['release_units']]
            need(units and set(units) <= {u['id'] for u in s['plan']['release_units']},'固定するrelease unitが不明')
            affected={b['release_unit'] for b in s['plan']['blocks'] if any(s['candidate_manifest'].get(path)!=s['plan']['source_manifest'].get(path) for path in b['sources'])}
            need(all(u in units or self.node_status(s,instantiate(s['plan'])['G3_FINAL@'+u])=='PASSED' for u in affected),'変更unitの固定が不足')
            self.append('release_bound',work,{'sha':commit_sha,'units':units})
        self.append('candidate',work,{'sha':commit_sha,'manifest':current})
    def revise(self,work,new_plan):
        before = self.state(work)['plan']
        need(new_plan.get('source_extension')==before.get('source_extension'),'改訂で版移行proofを注入・変更しない')
        need(before.get('agent_team') == new_plan.get('agent_team'), 'team方針の変更には専用移行を使う')
        s=self.state(work);plan_check(new_plan);need(new_plan['work_id']==work,'別Workへの改訂')
        need(new_plan['profile']==s['plan']['profile'] and new_plan['command']==s['plan']['command'],'作成／修正の経路変更は別Workへ')
        need(new_plan.get('workflow_version')==s['plan'].get('workflow_version'),'工程版は明示移行を使う')
        for key in ('parent_impact','parent_issue','parent_request','parent_case','parent_work'):
            need(new_plan.get(key)==s['plan'].get(key),'改訂で親子関係を付け替えない')
        if getattr(self.store,'checkpoint_mode',False) and work=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122':
            from checkpoint import INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256
            need(new_plan['proposal']['hash']==s['plan']['proposal']['hash'],
                 'PUB_REVISION_SAME_D06_HASH_REQUIRED')
        if new_plan['proposal']['hash']==s['plan']['proposal']['hash']:
            if (getattr(self.store,'checkpoint_mode',False) and work=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
                    and new_plan['proposal']['hash']==INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256):
                new_plan=self._publisher_revision_validate(s,new_plan)
            else:
                from checkpoint import (RECOVERY_WORK,FIXED_WORK,MATH_RENDERING_REPAIR_PROPOSAL_SHA256,MIXED_INLINE_REPAIR_PROPOSAL_SHA256,INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,
                    current_core_identity,history_events,validate_math_rendering_owner_revision)
                need(getattr(self.store,'checkpoint_mode',False) and work==RECOVERY_WORK
                    and new_plan['proposal']['hash'] in (MATH_RENDERING_REPAIR_PROPOSAL_SHA256,MIXED_INLINE_REPAIR_PROPOSAL_SHA256,INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256),
                    '意味の変更には新しい提案版が必要')
                expected_head=self._head;primary=self.state(FIXED_WORK)
                need(self._head==self.store.head==expected_head,'D04_OWNER_REVISION_HEAD_CHANGED')
                from team import current_informed_authority
                need(current_informed_authority(self,FIXED_WORK,primary),'D04_OWNER_REVISION_CURRENT_AUTHORITY')
                rows=history_events(self,'suffix')
                opened=[e for e in rows if e['work']==work and e['kind']=='opened']
                prior=[e for e in rows if e['work']==work and e['kind']=='informed_technical_candidate_reconciled']
                need(len(opened)==1 and prior and prior[-1]['payload']==s.get('informed_technical_candidate_reconciliation'),
                    'D04_OWNER_REVISION_LAST_ACTUAL_OWNER_PROOF')
                wrapper=s['informed_technical_candidate_reconciliation']
                need(self.store.get(wrapper['proofRef'])==wrapper['proof'],'D04_OWNER_REVISION_LAST_PROOF_ARTIFACT')
                records=[e['payload']['mathRenderingRepair'] for e in rows
                    if e['work']==FIXED_WORK and e['kind']=='checkpoint_definition_migrated'
                    and e['payload'].get('mathRenderingRepair') is not None and e['payload'].get('mixedInlineRepair') is None]
                mixed_records=[e['payload']['mixedInlineRepair'] for e in rows
                    if e['work']==FIXED_WORK and e['kind']=='checkpoint_definition_migrated'
                    and e['payload'].get('mixedInlineRepair') is not None]
                layout_records=[e['payload']['inlineLayoutRepair'] for e in rows
                    if e['work']==FIXED_WORK and e['kind']=='checkpoint_definition_migrated'
                    and e['payload'].get('inlineLayoutRepair') is not None]
                new_plan=validate_math_rendering_owner_revision(s,primary,new_plan,original_plan=opened[0]['payload']['plan'],
                    math_records=records,mixed_records=mixed_records,layout_records=layout_records,epoch=self.store.checkpoint_epoch,check=need)
                from adapters import _checkpoint_git_proof
                identity=current_core_identity()
                need(identity==primary['informed_review_method']['authority']['core'],
                    'D04_OWNER_REVISION_CURRENT_AUTHORITY')
                _checkpoint_git_proof(self,primary,self.store.state_base(FIXED_WORK),identity,review_method=True)
                need(self._head==self.store.head==expected_head and current_core_identity()==identity,
                    'D04_OWNER_REVISION_HEAD_CHANGED')
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

    def production_result(self,work,node_id,token,result,agent_guard_ref=None):
        from agent_guard import consume_inventory
        if self.state(work)['plan'].get('workflow_version') == 'production/2':
            consume_inventory(self,work,'production-result',agent_guard_ref)
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

    @staticmethod
    def create_recovery_copy(root, archive_path, prefix, work):
        """Extract a verified Store into a dedicated copy namespace, never in place.

        The source archive remains immutable. This is local recovery provenance,
        not authentication of a user decision or a new accepted result.
        """
        import zipfile,json,hashlib
        root=Path(root).resolve();archive=Path(archive_path).resolve()
        import re
        need(isinstance(work,str) and re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*',work),'コピーWork名が不正')
        destination=root/'work'/'recovery-copies'/work/'store'
        need(destination.resolve()==destination,'コピー先のsymlink aliasを拒否する')
        need(not destination.exists() and not destination.is_symlink(),'コピー先は新しい空の専用pathが必要')
        destination.mkdir(parents=True)
        archive_hash=sha(archive);files={}
        with zipfile.ZipFile(archive) as z:
            names=[n for n in z.namelist() if n.startswith(prefix+'/events/') or n.startswith(prefix+'/artifacts/')]
            need(names and len(names)==len(set(names)),'原Storeの出所が空・重複')
            for name in names:
                rel=name[len(prefix)+1:];parts=Path(rel).parts
                need(len(parts)==2 and parts[0] in ('events','artifacts') and parts[1].endswith('.json'),'原Storeのpathが不正')
                target=destination/rel;target.parent.mkdir(exist_ok=True);raw=z.read(name);target.write_bytes(raw);files[rel]=hashlib.sha256(raw).hexdigest()
        store=Store(destination);events=store.events()
        need(events and any(e['work']==work and e['kind']=='opened' for e in events),'原Storeに対象Workがない')
        for p in (destination/'artifacts').glob('*.json'):store.get(p.stem)
        need(sha(archive)==archive_hash,'原archiveがコピー中に変化した')
        origin={'schemaVersion':'recovery-copy-origin/1','storeRoot':str(destination),'sourceArchive':str(archive),'sourceArchiveSHA256':archive_hash,'sourcePrefix':prefix,'work':work,'originalHead':store.head,'originalEventCount':len(events),'files':files}
        (destination/'.recovery-copy-origin.json').write_text(json.dumps(origin,ensure_ascii=False,indent=2)+'\n')
        return destination

    def verify_recovery_copy_origin(self,work):
        import zipfile,json,hashlib
        expected=self.root/'work'/'recovery-copies'/work/'store'
        need(expected.resolve()==expected and self.store.root==expected,'回収移行はaliasではない専用コピーStoreだけで行う')
        current=self.root
        for part in expected.relative_to(self.root).parts:
            current=current/part
            need(not current.is_symlink(),'コピーStoreのsymlink componentを拒否する')
        marker=self.store.root/'.recovery-copy-origin.json'
        need(marker.is_file() and not marker.is_symlink(),'原archiveから作成したコピー出所が必要')
        origin=json.loads(marker.read_text())
        need(origin.get('schemaVersion')=='recovery-copy-origin/1' and origin.get('storeRoot')==str(self.store.root) and origin.get('work')==work,'コピーStore実体と出所が違う')
        archive=Path(origin['sourceArchive']).resolve()
        need(self.store.root not in archive.parents and sha(archive)==origin['sourceArchiveSHA256'],'原archiveの出所・版が違う')
        with zipfile.ZipFile(archive) as z:
            prefix=origin['sourcePrefix'];names=[n for n in z.namelist() if n.startswith(prefix+'/events/') or n.startswith(prefix+'/artifacts/')]
            files={n[len(prefix)+1:]:hashlib.sha256(z.read(n)).hexdigest() for n in names}
        need(files and files==origin['files'],'コピー出所の収録範囲が違う')
        for rel,h in files.items():need(sha(self.store.root/rel)==h,'コピー元の履歴・成果物が変わった:'+rel)
        events=self.store.events();count=origin['originalEventCount']
        need(type(count)is int and 0<count<=len(events) and events[count-1]['hash']==origin['originalHead'],'コピー元の台帳prefixが違う')
        return origin

    def migrate_definition(self,work,from_hash,evidence_refs):
        s=self.state(work);need(s['definition_hash']==from_hash and from_hash!=DEFINITION_HASH,'移行前の版が違う')
        need(not s['claims'] and evidence_refs,'実行中又は移行照合証拠がない')
        self.fingerprint_refs(s,evidence_refs)
        if (getattr(self.store,'checkpoint_mode',False) and work=='W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122'
                and s['plan']['proposal'].get('publisherRevision') is not None):
            replayed,_=self._publisher_revision_history(s);frame=replayed['current']
            need(frame['ordinal']>0 and frame['migrationEvent'] is None and not frame['resultEvents']
                 and s['plan']['proposal']['sourceCIPolicy']['definitionHash']==DEFINITION_HASH
                 ==replayed['primary']['core']['definitionHash'],
                 'PUB_REVISION_CURRENT_NORMAL_MIGRATION_REQUIRED')
        # A real production Work requires an explicit immutable preflight, not a
        # bare evidence ID used as a route around a definition mismatch.
        recovery_proof = None
        if s['plan'].get('workflow_version')=='production/2' and not s['plan'].get('simulation'):
            import json
            from store import digest
            origin=self.verify_recovery_copy_origin(work)
            expected={'work':work,'fromDefinition':from_hash,'toDefinition':DEFINITION_HASH,'storeRoot':str(self.store.root),'copyOriginHash':digest(origin),
                      'planHash':digest(s['plan']),'sourceManifestHash':digest(s['plan']['source_manifest']),
                      'candidateManifestHash':digest(s['candidate_manifest']),'rulesHash':digest(s['plan']['rules']),
                      'userRecordsHash':digest(s['users']), 'ledgerHead':self.store.head}
            for ref in evidence_refs:
                e=s['evidence'].get(ref,{})
                if e.get('kind')!='file':continue
                raw=file(self.root,e['data']['path'])
                need(sha(raw)==e['data']['sha256'],'移行証拠が差し替えられた')
                try:proof=json.loads(raw.read_text())
                except (ValueError,UnicodeError):continue
                if proof.get('schemaVersion')!='recovery-definition-preflight/1':continue
                # The registered evidence event follows the preflight's observed
                # head; all subsequent events must only register this proof.
                head=proof.get('ledgerHead');events=self.store.events()
                position=next((i for i,x in enumerate(events) if x['hash']==head),None)
                need(position is not None and all(x['kind']=='evidence' and x['work']==work and x['payload']['id'] in evidence_refs for x in events[position+1:]),'移行preflight後のWork状態が変わった')
                target={**expected,'ledgerHead':head}
                need(all(proof.get(k)==v for k,v in target.items()),'移行preflightの版・範囲・承認が違う')
                need(proof.get('copyOnly') is True and proof.get('sourceRoot')==str(self.root),'作業コピーだけの移行証拠が必要')
                need(manifest(self.root,s['plan'].get('protected_manifest',{}))==s['plan'].get('protected_manifest',{}),'移行前の保護対象が違う')
                need(manifest(self.root,s['plan']['rules'])==s['plan']['rules'],'移行前の規則が違う')
                need(manifest(self.root,s['candidate_manifest'])==s['candidate_manifest'],'移行前の候補が違う')
                from agent_guard import validate_policy_work
                from team import validate_policy
                validate_policy_work(validate_policy(s['plan'].get('agent_team')) or {},work)
                rows=proof.get('resultDispositions',[])
                need({r.get('node') for r in rows}==set(s['results']) and len(rows)==len(s['results']),'全旧結果の扱いを照合する')
                need(all(r.get('artifact')==s['results'][r['node']]['artifact'] and r.get('disposition')=='INVALIDATED_BY_DEFINITION' and r.get('reason') for r in rows),'旧PASSを新PASSに移植しない')
                recovery_proof={'evidence':ref,'sha256':e['data']['sha256'],'resultDispositions':rows,'preservedUserRecordsHash':digest(s['users'])}
            need(recovery_proof is not None,'回収Workの照合済み移行preflightが必要')
        return self.append('definition_migrated',work,{'from':from_hash,'to':DEFINITION_HASH,'evidence_refs':evidence_refs,**({'recoveryProof':recovery_proof} if recovery_proof else {})})

    def checkpoint_preflight(self,work,*,candidate_sha=None,informed_adoption_ref=None,repair_adoption_ref=None,
                             math_rendering_adoption_ref=None,mixed_inline_adoption_ref=None,inline_layout_adoption_ref=None):
        from checkpoint import FIXED_WORK, CURRENT_REPAIR_AFTER, RECOVERY_PROPOSAL_SHA256, current_core_identity, verify_candidate_git, sha as bytes_sha
        need(getattr(self.store,'checkpoint_mode',False) and work==FIXED_WORK,'対象限定checkpointだけのpreflight')
        s=self.state(work);origin=self.store._view.state_snapshot(work)
        need(not s['claims'] and not any(not p.get('completed') for p in s['patches'].values()),'実行権又は未確定patchがある')
        need(not any(not op.get('outcome') for op in s['external'].values()),'未確定の外部操作を引き継がない')
        need(not s['paused'],'本人pause中の定義移行は行わない')
        for key in ('rules','source_manifest','protected_manifest'):
            need(s['plan'].get(key)==origin['plan'].get(key),'原規則・原source・保護manifestを変更しない:'+key)
        need(all(s['users'].get(key)==value for key,value in origin['users'].items()),'原承認/本人発言を変更しない')
        identity=current_core_identity();need(s['definition_hash']!=identity['definitionHash'],'既に同じ定義。二重移行しない')
        need(manifest(self.root,s['plan']['rules'])==s['plan']['rules'],'規則の実bytesが違う')
        need(manifest(self.root,s['plan'].get('protected_manifest',{}))==s['plan'].get('protected_manifest',{}),'保護対象の実bytesが違う')
        current=manifest(self.root,s['candidate_manifest'])
        changed={name:value for name,value in current.items() if value!=s['candidate_manifest'][name]}
        prior_repair=s.get('checkpoint_definition_migration',{}).get('repairAdoption')
        prior_math=s.get('checkpoint_definition_migration',{}).get('mathRenderingRepair')
        prior_mixed=s.get('checkpoint_definition_migration',{}).get('mixedInlineRepair')
        prior_layout=s.get('checkpoint_definition_migration',{}).get('inlineLayoutRepair')
        from checkpoint import INLINE_LAYOUT_ACTUAL_ADOPTION_SHA256
        actual_layout_refs=[ref for ref,e in s['evidence'].items() if e.get('kind')=='file'
            and e.get('verification_level')!='simulation' and e.get('data',{}).get('sha256')==INLINE_LAYOUT_ACTUAL_ADOPTION_SHA256]
        need(not actual_layout_refs or inline_layout_adoption_ref in actual_layout_refs,
            'D06_ACTUAL_ADOPTION_REQUIRES_JOINT_FIRST_MIGRATION')
        if inline_layout_adoption_ref is not None or prior_layout is not None:
            need(inline_layout_adoption_ref and mixed_inline_adoption_ref,'D06_CURRENT_JOINT_MIGRATION_ADOPTIONS_REQUIRED')
            need(prior_layout is not None or prior_mixed is None,'D06_FIRST_LAYOUT_REQUIRES_JOINT_D3_MIGRATION')
        if mixed_inline_adoption_ref is not None or prior_mixed is not None:
            from checkpoint import MIXED_INLINE_REPAIR_PRODUCT_PATHS
            need(mixed_inline_adoption_ref,'D05_CURRENT_MIGRATION_ADOPTION_REQUIRED')
            need(set(changed)<=set(MIXED_INLINE_REPAIR_PRODUCT_PATHS),'D05_CANDIDATE_DIFF_OUTSIDE_TWO_PATHS')
        elif math_rendering_adoption_ref is not None or prior_math is not None:
            from checkpoint import MATH_RENDERING_REPAIR_PRODUCT_PATHS
            need(math_rendering_adoption_ref,'D04_CURRENT_MIGRATION_ADOPTION_REQUIRED')
            need(set(changed)<=set(MATH_RENDERING_REPAIR_PRODUCT_PATHS),'D04_CANDIDATE_DIFF_OUTSIDE_TWO_PATHS')
        elif repair_adoption_ref is None and prior_repair is None:
            need(not changed or set(changed)==set(CURRENT_REPAIR_AFTER) and changed==CURRENT_REPAIR_AFTER,
                 '採用済み5path以外/部分状態の候補差分')
        else:
            from checkpoint import NEARBY_REPAIR_PRODUCT_PATHS
            need(repair_adoption_ref,'D03_CURRENT_MIGRATION_ADOPTION_REQUIRED')
            need(set(changed)<=set(NEARBY_REPAIR_PRODUCT_PATHS),'D03_CANDIDATE_DIFF_OUTSIDE_TWO_PATHS')
        after=candidate_sha or s['candidate_sha']
        if changed or after!=s['candidate_sha']:verify_candidate_git(self.root,after,current)
        frozen=self.store.source_snapshot(work)['snapshot']
        need({name:bytes_sha(bytes.fromhex(value)) for name,value in frozen['files_hex'].items()}==s['plan']['source_manifest'],
             'Git由来原snapshotが原manifestに一致しない')
        from capabilities import implementation_hash
        proof={'schemaVersion':'qf01-checkpoint-definition-preflight/1','work':work,
                'proposalSHA256':RECOVERY_PROPOSAL_SHA256,'checkpointEpoch':self.store.checkpoint_epoch,
                'anchor':self.store.checkpoint_anchor,'ledgerHead':self._head,'sourceRoot':str(self.root),
                'fromDefinition':s['definition_hash'],'toDefinition':identity['definitionHash'],'core':identity,
                'implementationHash':implementation_hash(self),'candidateBeforeSHA':s['candidate_sha'],
                'candidateAfterSHA':after,'candidateManifest':current,'changedCandidatePaths':changed,
                'planHash':digest(s['plan']),'rulesHash':digest(s['plan']['rules']),
                'sourceManifestHash':digest(s['plan']['source_manifest']),
                'protectedManifestHash':digest(s['plan'].get('protected_manifest',{})),
                'preservedUserRecordsHash':digest(s['users']),'originalSourceSnapshotHash':digest(frozen),
                'resultDispositions':[{'node':name,'artifact':row['artifact'],'oldInputHash':row['input_hash'],
                    'disposition':'INVALIDATED_BY_DEFINITION','reason':'Current definition/service must be verified; original result retained'}
                    for name,row in sorted(s['results'].items())],
                'globalQueueCoverage':'UNKNOWN','oldPassTransferred':False,'gateAccepted':False}
        # The original 1d mechanism remains recorded. Subsequent D02 upgrades
        # additionally require the actual new adoption, before authority can be
        # bound to the new definition/source. No old T02 is repurposed.
        if s['definition_hash']!=origin['definition_hash']:
            from checkpoint import INFORMED_REVIEW_PROPOSAL_SHA256,INFORMED_ADOPTION_CALL_ID,strict_json
            need(informed_adoption_ref,'D02_SUBSEQUENT_MIGRATION_ADOPTION_REQUIRED')
            e=s['evidence'].get(informed_adoption_ref,{})
            need(e.get('kind')=='file' and e.get('verification_level')!='simulation',
                 'D02_MIGRATION_ADOPTION_FILE_REQUIRED')
            data=e.get('data',{});raw=file(self.root,data['path']).read_bytes()
            need(bytes_sha(raw)==data.get('sha256'),'D02_MIGRATION_ADOPTION_FILE_CHANGED')
            adopted=strict_json(raw)
            need(adopted.get('schemaVersion')=='qf01-informed-review-user-adoption/1'
                 and adopted.get('proposalSHA256')==INFORMED_REVIEW_PROPOSAL_SHA256
                 and adopted.get('quote')=='限定D02案を採用して進める'
                 and adopted.get('source_ref')=='request_user_input_async/'+INFORMED_ADOPTION_CALL_ID
                 and adopted.get('verification_level')=='conversation_transcribed'
                 and adopted.get('adoptedForImplementation') is True,
                 'D02_ACTUAL_SUBSEQUENT_MIGRATION_ADOPTION')
            proof['reviewMethodAdoption']={'proposalSHA256':INFORMED_REVIEW_PROPOSAL_SHA256,
                'evidenceRef':informed_adoption_ref,'transcriptionSHA256':bytes_sha(raw),
                'quote':adopted['quote'],'source_ref':adopted['source_ref'],
                'verification_level':adopted['verification_level']}
        elif informed_adoption_ref is not None:
            need(False,'D02_INITIAL_MIGRATION_CANNOT_PRETEND_SUBSEQUENT')
        if mixed_inline_adoption_ref is not None:
            from checkpoint import (MIXED_INLINE_REPAIR_PROPOSAL_SHA256,MIXED_INLINE_REPAIR_INVENTORY_SHA256,
                MIXED_INLINE_REPAIR_BASELINE,MIXED_INLINE_REPAIR_BEFORE,MIXED_INLINE_REPAIR_PRODUCT_PATHS,
                MIXED_INLINE_REPAIR_D04_EVENT_HASH,MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256,
                mixed_inline_repair_adoption_file,validate_mixed_inline_repair_record,
                validate_mixed_inline_repair_continuation,preserved_math_rendering_repair,history_events,
                math_rendering_repair_adoption_file,nearby_repair_adoption_file,mixed_inline_earlier_after)
            need(proof.get('reviewMethodAdoption') and prior_math and prior_repair,'D05_PRIOR_ADOPTIONS_REQUIRED')
            need(math_rendering_adoption_ref==prior_math['evidenceRef']
                and repair_adoption_ref==prior_repair['evidenceRef'],'D05_PRESERVED_PRIOR_ADOPTION_REFS')
            for record,reader in ((prior_math,math_rendering_repair_adoption_file),(prior_repair,nearby_repair_adoption_file)):
                adopted_prior=reader(self,s,record['evidenceRef'])
                need(all(record.get(k)==v for k,v in adopted_prior.items()),'D05_ORIGINAL_ADOPTION_CHANGED')
            suffix=history_events(self,'suffix',work)
            original=[e for e in suffix if e['hash']==MIXED_INLINE_REPAIR_D04_EVENT_HASH]
            need(len(original)==1 and original[0]['kind']=='checkpoint_definition_migrated'
                and original[0]['payload'].get('mathRenderingRepair')==prior_math
                and digest(prior_math)==MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256
                and prior_math['candidateAfterSHA']==MIXED_INLINE_REPAIR_BASELINE
                and prior_math['afterRepair']==MIXED_INLINE_REPAIR_BEFORE,'D05_AUTHENTIC_D04_D3_REQUIRED')
            if prior_mixed is None:
                need(s['candidate_sha']==MIXED_INLINE_REPAIR_BASELINE
                    and all(s['candidate_manifest'].get(p)==v for p,v in MIXED_INLINE_REPAIR_BEFORE.items()),'D05_FIRST_MIGRATION_D3_PREIMAGE')
            else:
                validate_mixed_inline_repair_record(prior_mixed,epoch=self.store.checkpoint_epoch,check=need)
                need(prior_mixed['candidateAfterSHA']==s['candidate_sha']
                    and prior_mixed['definitionHash']==s['definition_hash']
                    and all(s['candidate_manifest'].get(p)==v for p,v in prior_mixed['afterRepair'].items()),'D05_PRIOR_ACTUAL_CANDIDATE_MANIFEST')
                preserved_math_rendering_repair(self,s)
            adopted=mixed_inline_repair_adoption_file(self,s,mixed_inline_adoption_ref)
            effective={**CURRENT_REPAIR_AFTER,**{p:sha(file(self.root,p)) for p in MIXED_INLINE_REPAIR_PRODUCT_PATHS}}
            need(all(current.get(p)==v for p,v in effective.items()),'D05_EXACT_CURRENT_FIVE_REPAIR_MANIFEST')
            repair={'schemaVersion':'qf01-mixed-inline-surfaces-supplement/1',
                'proposalSHA256':MIXED_INLINE_REPAIR_PROPOSAL_SHA256,'inventorySHA256':MIXED_INLINE_REPAIR_INVENTORY_SHA256,**adopted,
                'baselineSourceSHA':MIXED_INLINE_REPAIR_BASELINE,'candidateBeforeSHA':s['candidate_sha'],
                'candidateBeforeManifestSHA256':digest(s['candidate_manifest']),'candidateAfterSHA':after,
                'allowedProductPaths':list(MIXED_INLINE_REPAIR_PRODUCT_PATHS),'beforeRepair':copy.deepcopy(MIXED_INLINE_REPAIR_BEFORE),
                'afterRepair':{p:effective[p] for p in MIXED_INLINE_REPAIR_PRODUCT_PATHS},
                'originalD04MigrationEventHash':MIXED_INLINE_REPAIR_D04_EVENT_HASH,
                'originalD04SupplementSHA256':MIXED_INLINE_REPAIR_D04_SUPPLEMENT_SHA256,
                'definitionHash':identity['definitionHash'],'implementationHash':proof['implementationHash'],
                'checkpointEpoch':self.store.checkpoint_epoch}
            validate_mixed_inline_repair_record(repair,epoch=self.store.checkpoint_epoch,check=need)
            old_math_records=[e['payload']['mathRenderingRepair'] for e in suffix
                if e['kind']=='checkpoint_definition_migrated' and e['payload'].get('mathRenderingRepair')
                and e['payload'].get('mixedInlineRepair') is None]
            history=mixed_inline_earlier_after(old_math_records,check=need)+[e['payload']['mixedInlineRepair']['afterRepair'] for e in suffix
                if e['kind']=='checkpoint_definition_migrated' and e['payload'].get('mixedInlineRepair')]
            validate_mixed_inline_repair_continuation(prior_mixed,repair,earlier_after=history,check=need)
            layout=None
            if inline_layout_adoption_ref is not None:
                from checkpoint import (INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,inline_layout_repair_adoption_file,
                    validate_inline_layout_repair_record,validate_inline_layout_repair_continuation)
                layout_adopted=inline_layout_repair_adoption_file(self,s,inline_layout_adoption_ref)
                layout={'schemaVersion':'qf01-mixed-inline-layout-supplement/1',
                    'proposalSHA256':INLINE_LAYOUT_REPAIR_PROPOSAL_SHA256,**layout_adopted,
                    'mixedInlineRepairSHA256':digest(repair),'checkpointEpoch':self.store.checkpoint_epoch,
                    'allowedProductPaths':list(MIXED_INLINE_REPAIR_PRODUCT_PATHS)}
                validate_inline_layout_repair_record(layout,mixed=repair,epoch=self.store.checkpoint_epoch,check=need)
                validate_inline_layout_repair_continuation(prior_layout,layout,mixed=repair,previous_mixed=prior_mixed,check=need)
            from adapters import _checkpoint_git_proof
            target={**s,'candidate_sha':after,'candidate_manifest':current,'definition_hash':identity['definitionHash']}
            _checkpoint_git_proof(self,target,origin,identity,review_method=True,nearby_repair=prior_repair,
                math_rendering_repair=prior_math,mixed_inline_repair=repair,inline_layout_repair=layout)
            proof.update(repairAdoption=copy.deepcopy(prior_repair),mathRenderingRepair=copy.deepcopy(prior_math),mixedInlineRepair=repair)
            if layout is not None:proof['inlineLayoutRepair']=layout
        elif math_rendering_adoption_ref is not None:
            from checkpoint import (MATH_RENDERING_REPAIR_PROPOSAL_SHA256,MATH_RENDERING_REPAIR_BASELINE,
                MATH_RENDERING_REPAIR_BEFORE,MATH_RENDERING_REPAIR_PRODUCT_PATHS,
                MATH_RENDERING_REPAIR_D03_EVENT_HASH,MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256,
                math_rendering_repair_adoption_file,validate_math_rendering_repair_record,
                validate_math_rendering_repair_continuation,nearby_repair_adoption_file,
                validate_nearby_repair_record,history_events)
            need(proof.get('reviewMethodAdoption') and prior_repair,'D04_D02_AND_D03_ADOPTIONS_REQUIRED')
            validate_nearby_repair_record(prior_repair,epoch=self.store.checkpoint_epoch,check=need)
            need(digest(prior_repair)==MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256
                and prior_repair['candidateAfterSHA']==MATH_RENDERING_REPAIR_BASELINE
                and prior_repair['afterRepair']==MATH_RENDERING_REPAIR_BEFORE
                and repair_adoption_ref==prior_repair['evidenceRef'],'D04_PRESERVED_D03_C_RECORD')
            old_adopted=nearby_repair_adoption_file(self,s,repair_adoption_ref)
            need(all(prior_repair.get(k)==v for k,v in old_adopted.items()),'D04_ORIGINAL_D03_ADOPTION_CHANGED')
            suffix=history_events(self,'suffix',work)
            original=[e for e in suffix if e['hash']==MATH_RENDERING_REPAIR_D03_EVENT_HASH]
            need(len(original)==1 and original[0]['kind']=='checkpoint_definition_migrated'
                and original[0]['payload'].get('repairAdoption')==prior_repair,'D04_AUTHENTIC_D03_EVENT_REQUIRED')
            adopted=math_rendering_repair_adoption_file(self,s,math_rendering_adoption_ref)
            if prior_math is None:
                need(s['candidate_sha']==MATH_RENDERING_REPAIR_BASELINE
                    and all(s['candidate_manifest'].get(p)==v for p,v in MATH_RENDERING_REPAIR_BEFORE.items()),
                    'D04_FIRST_MIGRATION_C_PREIMAGE')
            else:
                validate_math_rendering_repair_record(prior_math,epoch=self.store.checkpoint_epoch,check=need)
                need(prior_math['candidateAfterSHA']==s['candidate_sha']
                    and prior_math['definitionHash']==s['definition_hash']
                    and all(s['candidate_manifest'].get(p)==v for p,v in prior_math['afterRepair'].items()),
                    'D04_PRIOR_ACTUAL_CANDIDATE_MANIFEST')
            effective={**CURRENT_REPAIR_AFTER,**{p:sha(file(self.root,p)) for p in MATH_RENDERING_REPAIR_PRODUCT_PATHS}}
            need(all(current.get(p)==v for p,v in effective.items()),'D04_EXACT_CURRENT_FIVE_REPAIR_MANIFEST')
            repair={'schemaVersion':'qf01-math-prose-rendering-supplement/1',
                'proposalSHA256':MATH_RENDERING_REPAIR_PROPOSAL_SHA256,**adopted,
                'baselineSourceSHA':MATH_RENDERING_REPAIR_BASELINE,
                'candidateBeforeSHA':s['candidate_sha'],'candidateBeforeManifestSHA256':digest(s['candidate_manifest']),
                'candidateAfterSHA':after,'allowedProductPaths':list(MATH_RENDERING_REPAIR_PRODUCT_PATHS),
                'beforeRepair':copy.deepcopy(MATH_RENDERING_REPAIR_BEFORE),
                'afterRepair':{p:effective[p] for p in MATH_RENDERING_REPAIR_PRODUCT_PATHS},
                'originalD03MigrationEventHash':MATH_RENDERING_REPAIR_D03_EVENT_HASH,
                'originalD03SupplementSHA256':MATH_RENDERING_REPAIR_D03_SUPPLEMENT_SHA256,
                'definitionHash':identity['definitionHash'],'implementationHash':proof['implementationHash'],
                'checkpointEpoch':self.store.checkpoint_epoch}
            validate_math_rendering_repair_record(repair,epoch=self.store.checkpoint_epoch,check=need)
            history=[e['payload']['mathRenderingRepair']['afterRepair'] for e in suffix
                if e['kind']=='checkpoint_definition_migrated' and e['payload'].get('mathRenderingRepair')]
            validate_math_rendering_repair_continuation(prior_math,repair,earlier_after=history,check=need)
            from adapters import _checkpoint_git_proof
            target={**s,'candidate_sha':after,'candidate_manifest':current,'definition_hash':identity['definitionHash']}
            _checkpoint_git_proof(self,target,origin,identity,review_method=True,
                nearby_repair=prior_repair,math_rendering_repair=repair)
            proof['repairAdoption']=copy.deepcopy(prior_repair);proof['mathRenderingRepair']=repair
        elif repair_adoption_ref is not None:
            from checkpoint import (NEARBY_REPAIR_BASELINE,NEARBY_REPAIR_PRODUCT_PATHS,
                NEARBY_REPAIR_PROPOSAL_SHA256,nearby_repair_adoption_file,validate_nearby_repair_record)
            need(proof.get('reviewMethodAdoption'),'D03_ORIGINAL_D02_ADOPTION_REQUIRED')
            adopted=nearby_repair_adoption_file(self,s,repair_adoption_ref)
            if prior_repair is None:
                need(s['candidate_sha']==NEARBY_REPAIR_BASELINE,'D03_FIRST_MIGRATION_REQUIRES_ACTUAL_B')
                need(all(s['candidate_manifest'].get(name)==CURRENT_REPAIR_AFTER[name] for name in NEARBY_REPAIR_PRODUCT_PATHS),
                     'D03_FIRST_MIGRATION_B_PREIMAGE')
            else:
                previous=validate_nearby_repair_record(prior_repair,epoch=self.store.checkpoint_epoch,check=need)
                need(previous['candidateAfterSHA']==s['candidate_sha']
                    and previous['definitionHash']==s['definition_hash']
                    and all(s['candidate_manifest'].get(name)==value for name,value in previous['afterRepair'].items())
                    and all(previous.get(key)==value for key,value in adopted.items()),'D03_PRIOR_REPAIR_OR_ADOPTION_CHANGED')
            effective={**CURRENT_REPAIR_AFTER,**{name:sha(file(self.root,name)) for name in NEARBY_REPAIR_PRODUCT_PATHS}}
            need(all(name in current and current[name]==value for name,value in effective.items()),'D03_EXACT_CURRENT_FIVE_REPAIR_MANIFEST')
            repair={'schemaVersion':'qf01-nearby-visibility-supplement/1',
                'proposalSHA256':NEARBY_REPAIR_PROPOSAL_SHA256,**adopted,'baselineSourceSHA':NEARBY_REPAIR_BASELINE,
                'candidateBeforeSHA':s['candidate_sha'],'candidateAfterSHA':after,
                'allowedProductPaths':list(NEARBY_REPAIR_PRODUCT_PATHS),
                'beforeRepair':{name:CURRENT_REPAIR_AFTER[name] for name in NEARBY_REPAIR_PRODUCT_PATHS},
                'afterRepair':{name:effective[name] for name in NEARBY_REPAIR_PRODUCT_PATHS},
                'definitionHash':identity['definitionHash'],'implementationHash':proof['implementationHash'],
                'checkpointEpoch':self.store.checkpoint_epoch}
            validate_nearby_repair_record(repair,epoch=self.store.checkpoint_epoch,check=need)
            from adapters import _checkpoint_git_proof
            target={**s,'candidate_sha':after,'candidate_manifest':current,'definition_hash':identity['definitionHash']}
            _checkpoint_git_proof(self,target,origin,identity,review_method=True,nearby_repair=repair)
            proof['repairAdoption']=repair
        return proof

    def migrate_checkpoint_definition(self,work,*,proof,expected_head):
        from checkpoint import FIXED_WORK
        need(getattr(self.store,'checkpoint_mode',False) and work==FIXED_WORK,'対象限定checkpointだけの定義移行')
        need(isinstance(proof,dict),'preflight objectが必要')
        current=self.checkpoint_preflight(work,candidate_sha=proof.get('candidateAfterSHA'),
            informed_adoption_ref=proof.get('reviewMethodAdoption',{}).get('evidenceRef'),
            repair_adoption_ref=proof.get('repairAdoption',{}).get('evidenceRef'),
            math_rendering_adoption_ref=proof.get('mathRenderingRepair',{}).get('evidenceRef'),
            mixed_inline_adoption_ref=proof.get('mixedInlineRepair',{}).get('evidenceRef'),
            inline_layout_adoption_ref=proof.get('inlineLayoutRepair',{}).get('evidenceRef'))
        need(current==proof and current['ledgerHead']==expected_head,'preflight後の版/承認/入力/HEADが違う')
        reference=self.store.put(proof)
        payload={
            'schemaVersion':'qf01-checkpoint-definition-migration/1','from':current['fromDefinition'],
            'to':current['toDefinition'],'preflightRef':reference,'checkpointEpoch':self.store.checkpoint_epoch,
            'candidateSHA':current['candidateAfterSHA'],'candidateManifest':current['candidateManifest'],
            'resultDispositions':current['resultDispositions'],
            'preservedUserRecordsHash':current['preservedUserRecordsHash'],
            'adoptionProposalSHA256':current['proposalSHA256'],'oldPassTransferred':False,'gateAccepted':False}
        if current.get('reviewMethodAdoption'):
            payload['reviewMethodAdoption']=current['reviewMethodAdoption']
        if current.get('repairAdoption'):
            payload['repairAdoption']=current['repairAdoption']
        if current.get('mathRenderingRepair'):
            payload['mathRenderingRepair']=current['mathRenderingRepair']
        if current.get('mixedInlineRepair'):
            payload['mixedInlineRepair']=current['mixedInlineRepair']
        if current.get('inlineLayoutRepair'):
            payload['inlineLayoutRepair']=current['inlineLayoutRepair']
        return self.append('checkpoint_definition_migrated',work,payload)

    def reconcile_checkpoint_candidate(self,work,node_id,token,*,owner_result_refs,
                                       compile_receipt_ref,verification_refs,expected_head):
        from adapters import reconcile_checkpoint_candidate
        return reconcile_checkpoint_candidate(self,work,node_id,token,
            owner_result_refs=owner_result_refs,compile_receipt_ref=compile_receipt_ref,
            verification_refs=verification_refs,expected_head=expected_head)

    def adopt_informed_review_method(self,work,*,proposal_sha256,quote,source_ref,
                                     author_matrix,evidence_refs,expected_head,
                                     verification_level='conversation_transcribed'):
        """Adopt only the explicitly approved D02 criterion; preserve the plan."""
        from checkpoint import (FIXED_WORK,FIXED_CONTRACT_SHA256,INFORMED_REVIEW_PROPOSAL_SHA256,
            INFORMED_REVIEWERS,INFORMED_REVIEW_NODES,INFORMED_FIRST_PASS_REFS,
            INFORMED_PROPOSAL_PATH,INFORMED_ADOPTION_CALL_ID,current_core_identity)
        from team import validate_informed_authority_body
        from capabilities import implementation_hash
        from adapters import _checkpoint_git_proof
        need(getattr(self.store,'checkpoint_mode',False) and work==FIXED_WORK,'D02_CHECKPOINT_WORK_REQUIRED')
        s=self.state(work);origin=self.store.state_base(work)
        need(self._head==expected_head==self.store.head,'D02_EXPECTED_HEAD_CHANGED')
        need(not s['claims'] and not s['paused'],'D02_CLAIM_OR_PAUSE_ACTIVE')
        need(proposal_sha256==INFORMED_REVIEW_PROPOSAL_SHA256
             and quote=='限定D02案を採用して進める'
             and verification_level=='conversation_transcribed'
             and isinstance(source_ref,str) and INFORMED_ADOPTION_CALL_ID in source_ref,
             'D02_EXACT_ACTUAL_ADOPTION_REQUIRED')
        need(sha(file(self.root,INFORMED_PROPOSAL_PATH))==proposal_sha256,'D02_ADOPTED_PROPOSAL_BYTES')
        identity=current_core_identity()
        need(s['definition_hash']==identity['definitionHash'],'D02_CURRENT_DEFINITION_REQUIRED')
        need(not self.integrity(s),'D02_CURRENT_CANDIDATE_INTEGRITY')
        _checkpoint_git_proof(self,s,origin,identity,review_method=True)
        body={'schemaVersion':'qf01-informed-rereview-authority/1','method':'qf01-informed-rereview/1',
              'proposalSHA256':proposal_sha256,'work':work,'checkpointEpoch':self.store.checkpoint_epoch,
              'expectedHead':expected_head,'originalPlanSHA256':digest(origin['plan']),
              'originalUsersSHA256':digest(origin['users']),'originalContractSHA256':FIXED_CONTRACT_SHA256,
              'originalAnchor':self.store.checkpoint_anchor,'originalSourceSHA':origin['plan']['source_sha'],
              'currentSourceSHA':s['candidate_sha'],'candidateManifestSHA256':digest(s['candidate_manifest']),
              'definitionHash':identity['definitionHash'],'implementationHash':implementation_hash(self),
              'core':identity,'reviewerRefs':list(INFORMED_REVIEWERS),'nodeIDs':list(INFORMED_REVIEW_NODES),
              'historicalFirstPassRefs':list(INFORMED_FIRST_PASS_REFS),'authorMatrix':copy.deepcopy(author_matrix),
              'adoption':{'quote':quote,'source_ref':source_ref,'verification_level':verification_level},
              'evidenceRefs':list(evidence_refs),'independent':False,'sourceFirst':False,'firstPass':False,
              'globalQueueCoverage':'UNKNOWN'}
        validate_informed_authority_body(self,work,s,body)
        need(self.store.head==expected_head and current_core_identity()==identity,
             'D02_CHANGED_DURING_ADOPTION')
        ref=self.store.put(body)
        event=self.append('informed_review_method_adopted',work,{'authorityRef':ref,'authority':body})
        return {'authorityRef':ref,'authority':body,'eventHash':event['hash'],'gateAccepted':False}

    def revoke_informed_review_method(self,work,*,authority_ref,quote,reason,source_ref,
                                      expected_head,verification_level='conversation_transcribed'):
        from checkpoint import FIXED_WORK
        need(getattr(self.store,'checkpoint_mode',False) and work==FIXED_WORK,'D02_CHECKPOINT_WORK_REQUIRED')
        s=self.state(work)
        need(self._head==expected_head==self.store.head,'D02_EXPECTED_HEAD_CHANGED')
        current=s.get('informed_review_method',{})
        need(current.get('authorityRef')==authority_ref and not current.get('revoked'),
             'D02_ACTIVE_AUTHORITY_REQUIRED')
        need(not s['claims'] and not s['paused'],'D02_CLAIM_OR_PAUSE_ACTIVE')
        need(all(isinstance(v,str) and v.strip() for v in (quote,reason,source_ref))
             and verification_level=='conversation_transcribed','D02_ACTUAL_REVOCATION_REQUIRED')
        return self.append('informed_review_method_revoked',work,{
            'authorityRef':authority_ref,'quote':quote,'reason':reason,'source_ref':source_ref,
            'verification_level':verification_level,'expectedHead':expected_head})

    def seal_informed_review(self,work,node_id,*,collection,capability_receipts,evidence_refs,
                             finding_dispositions):
        from checkpoint import FIXED_WORK,INFORMED_REVIEW_NODES
        from team import build_informed_review_receipt
        need(getattr(self.store,'checkpoint_mode',False) and work==FIXED_WORK
             and node_id in INFORMED_REVIEW_NODES,'D02_REVIEW_NODE_SCOPE')
        s=self.state(work);nodes=instantiate(s['plan']);node=nodes[node_id]
        claim=s['claims'].get(node_id)
        need(claim and claim.get('expires_at',0)>time.time()
             and claim.get('input_hash')==self.input_hash(s,node),'D02_CURRENT_REVIEW_CLAIM_REQUIRED')
        head=self._head
        receipt=build_informed_review_receipt(self,work,node,collection,capability_receipts,
                                             evidence_refs,finding_dispositions)
        need(self.store.head==head,'D02_CHANGED_DURING_REVIEW_SEAL')
        ref=self.store.put(receipt)
        payload={'node':node_id,'inputHash':claim['input_hash'],
                 'methodAuthorityRef':collection['methodAuthorityRef'],'methodReceiptRef':ref}
        event=self.append('informed_review_receipt_sealed',work,payload)
        return {'methodReceiptRef':ref,'receipt':receipt,'eventHash':event['hash'],
                'gateAccepted':False,'semanticValidityVerified':False}

    def run_informed_review(self,work,inputs,seconds=3600):
        """Run current CODE with an explicit lease for the two actual reviews."""
        from checkpoint import FIXED_WORK,INFORMED_REVIEW_NODES
        from team import current_informed_authority
        from capabilities import run_capability
        from production import ai_request
        need(getattr(self.store,'checkpoint_mode',False) and work==FIXED_WORK,'D02_CHECKPOINT_WORK_REQUIRED')
        need(type(seconds) is int and 900<=seconds<=7200,'D02_EXPLICIT_REVIEW_LEASE_RANGE')
        method=current_informed_authority(self,work)
        need(method,'D02_ACTIVE_AUTHORITY_REQUIRED')
        nxt=self.next(work)
        need(nxt.get('status')=='READY','D02_REVIEW_NODE_NOT_READY')
        node=nxt['task']['node']
        need(node['id'] in INFORMED_REVIEW_NODES and node['actor']=='AI','D02_REVIEW_NODE_SCOPE')
        need(isinstance(inputs,dict) and set(inputs)==set(node['capability_requests'])
             and all(isinstance(inputs[name],dict) for name in node['capability_requests']),
             'D02_EXACT_CURRENT_CODE_INPUTS_REQUIRED')
        claim=self.claim(work,node['id'],'capability-runner/D02',seconds=seconds)
        refs=[run_capability(self,work,node,name,dict(inputs[name])) for name in node['capability_requests']]
        return {'status':'NEEDS_REVIEW','node':node['id'],'claimToken':claim['claim_token'],
                'claimSeconds':seconds,'receipts':refs,'aiRequest':ai_request(self,work,node['id']),
                'automaticAcceptance':False,'reviewMethodAuthorityRef':method['authorityRef']}

    def reconcile_informed_technical_owner(self,work,*,candidate_sha,verification_refs,expected_head):
        """Verify existing D02 code; never replay its file writes or old T results."""
        from checkpoint import (FIXED_WORK,RECOVERY_WORK,RECOVERY_PROPOSAL_SHA256,
            INFORMED_REVIEW_PROPOSAL_SHA256,INFORMED_ADOPTION_CALL_ID,ADOPTION_CALL_ID,
            current_core_identity,history_events,sha as sha_bytes,current_nearby_repair,
            NEARBY_REPAIR_PROPOSAL_SHA256,NEARBY_REPAIR_ADOPTION_QUOTE,
            NEARBY_REPAIR_ADOPTION_CALL_ID,NEARBY_REPAIR_CORE_PATHS,current_product_repair_context,
            MATH_RENDERING_REPAIR_PROPOSAL_SHA256,MATH_RENDERING_REPAIR_ADOPTION_QUOTE,
            MATH_RENDERING_REPAIR_ADOPTION_CALL_ID,MIXED_INLINE_REPAIR_ADOPTION_QUOTE,MIXED_INLINE_REPAIR_ADOPTION_CALL_ID,
            INLINE_LAYOUT_REPAIR_ADOPTION_QUOTE,INLINE_LAYOUT_REPAIR_ADOPTION_CALL_ID)
        from team import current_informed_authority
        from adapters import (_checkpoint_informed_technical_git,_CHECKPOINT_D02_CORE_PATHS,
                              _CHECKPOINT_D02_BASELINE)
        from capabilities import implementation_hash
        need(getattr(self.store,'checkpoint_mode',False) and work==RECOVERY_WORK,
             'D02_EXISTING_TECHNICAL_OWNER_REQUIRED')
        owner=self.state(work);primary=self.state(FIXED_WORK)
        need(self._head==expected_head==self.store.head,'D02_EXPECTED_HEAD_CHANGED')
        method=current_informed_authority(self,FIXED_WORK,primary)
        need(method and candidate_sha==primary['candidate_sha'],'D02_CURRENT_MATERIAL_AUTHORITY_REQUIRED')
        repair_context=current_product_repair_context(self,primary)
        nearby=repair_context['nearbyRepair'];math_repair=repair_context['mathRenderingRepair']
        mixed=repair_context['mixedInlineRepair']
        layout=repair_context['inlineLayoutRepair']
        owner_proposal=repair_context['ownerProposalSHA256']
        owner_quote=INLINE_LAYOUT_REPAIR_ADOPTION_QUOTE if layout else MIXED_INLINE_REPAIR_ADOPTION_QUOTE if mixed else MATH_RENDERING_REPAIR_ADOPTION_QUOTE if math_repair else NEARBY_REPAIR_ADOPTION_QUOTE if nearby else '限定D02案を採用して進める'
        owner_call=INLINE_LAYOUT_REPAIR_ADOPTION_CALL_ID if layout else MIXED_INLINE_REPAIR_ADOPTION_CALL_ID if mixed else MATH_RENDERING_REPAIR_ADOPTION_CALL_ID if math_repair else NEARBY_REPAIR_ADOPTION_CALL_ID if nearby else INFORMED_ADOPTION_CALL_ID
        core=current_core_identity();plan=owner['plan']
        need(plan['profile']=='technical' and not plan.get('workflow_version')
             and not plan.get('simulation') and plan.get('parent_work')==FIXED_WORK
             and plan['proposal']['hash']==owner_proposal,
             'D02_REVISED_EXISTING_TECHNICAL_PLAN_REQUIRED')
        need(owner['definition_hash']==core['definitionHash'],'D02_CURRENT_TECHNICAL_DEFINITION_REQUIRED')
        need(not owner['claims'] and not primary['claims'] and not owner['paused'] and not primary['paused']
             and not any(not p.get('completed') for p in owner['patches'].values())
             and not any(not p.get('outcome') for p in owner['external'].values()),
             'D02_TECHNICAL_OPERATION_UNCERTAIN')
        events=history_events(self,'complete',work)
        opened=[e for e in events if e['kind']=='opened']
        need(len(opened)==1,'D02_TECHNICAL_GENESIS_REQUIRED')
        initial=opened[0]['payload']['plan'];snapshot_ref=opened[0]['payload']['original_snapshot']
        source=self.store.get(snapshot_ref)
        expected_protected=copy.deepcopy(initial.get('protected_manifest',{}))
        if nearby:
            need(all(expected_protected.get(name)==value for name,value in nearby['beforeRepair'].items()),
                 'D03_ORIGINAL_OWNER_PRODUCT_PROTECTION')
            expected_protected.update(nearby['afterRepair'])
        if math_repair:expected_protected.update(math_repair['afterRepair'])
        if mixed:expected_protected.update(mixed['afterRepair'])
        need(plan['source_sha']==initial['source_sha']==source.get('source_sha')==_CHECKPOINT_D02_BASELINE
             and plan['source_manifest']==initial['source_manifest']
             and plan['rules']==initial['rules'] and plan['scope']==initial['scope']
             and plan.get('protected_manifest',{})==expected_protected,
             'D02_ORIGINAL_TECHNICAL_SOURCE_OR_SCOPE_CHANGED')
        need(set(source.get('files_hex',{}))==set(plan['source_manifest'])
             and {p:sha_bytes(bytes.fromhex(v)) for p,v in source['files_hex'].items()}==plan['source_manifest'],
             'D02_ORIGINAL_TECHNICAL_SNAPSHOT_CHANGED')
        approval=self.approval(owner)
        need(approval and approval.get('reply_to')==owner_proposal
             and approval.get('quote')==owner_quote
             and approval.get('verification_level')=='conversation_transcribed'
             and approval.get('source_ref')=='request_user_input_async/'+owner_call,
             'D02_ACTUAL_TECHNICAL_ADOPTION_REQUIRED')
        need(any(e['kind']=='user' and e['payload'].get('reply_to')==RECOVERY_PROPOSAL_SHA256
                 and e['payload'].get('verification_level')=='conversation_transcribed'
                 and ADOPTION_CALL_ID in e['payload'].get('source_ref','') for e in events),
             'D02_ORIGINAL_RECOVERY_ADOPTION_NOT_RETAINED')
        if nearby:
            need(any(e['kind']=='user' and e['payload'].get('reply_to')==INFORMED_REVIEW_PROPOSAL_SHA256
                and e['payload'].get('quote')=='限定D02案を採用して進める'
                and e['payload'].get('source_ref')=='request_user_input_async/'+INFORMED_ADOPTION_CALL_ID
                and e['payload'].get('verification_level')=='conversation_transcribed' for e in events),
                'D03_ORIGINAL_D02_TECHNICAL_ADOPTION_NOT_RETAINED')
        if math_repair:
            need(any(e['kind']=='user' and e['payload'].get('reply_to')==NEARBY_REPAIR_PROPOSAL_SHA256
                and e['payload'].get('quote')==NEARBY_REPAIR_ADOPTION_QUOTE
                and e['payload'].get('source_ref')=='request_user_input_async/'+NEARBY_REPAIR_ADOPTION_CALL_ID
                and e['payload'].get('verification_level')=='conversation_transcribed' for e in events),
                'D04_ORIGINAL_D03_TECHNICAL_ADOPTION_NOT_RETAINED')
        if mixed:
            need(any(e['kind']=='user' and e['payload'].get('reply_to')==MATH_RENDERING_REPAIR_PROPOSAL_SHA256
                and e['payload'].get('quote')==MATH_RENDERING_REPAIR_ADOPTION_QUOTE
                and e['payload'].get('source_ref')=='request_user_input_async/'+MATH_RENDERING_REPAIR_ADOPTION_CALL_ID
                and e['payload'].get('verification_level')=='conversation_transcribed' for e in events),
                'D05_ORIGINAL_D04_TECHNICAL_ADOPTION_NOT_RETAINED')
        self.fingerprint_refs(owner,verification_refs);need(verification_refs,'D02_TECHNICAL_VERIFICATION_REQUIRED')
        current=manifest(self.root,plan['source_manifest'])
        need(set(current)==set(owner['candidate_manifest'])==set(plan['source_manifest']),
             'D02_TECHNICAL_CANDIDATE_INVENTORY_CHANGED')
        changed={p for p,h in current.items() if owner['candidate_manifest'].get(p)!=h}
        need(changed<=(NEARBY_REPAIR_CORE_PATHS if nearby else _CHECKPOINT_D02_CORE_PATHS),'D02_TECHNICAL_DIFF_OUTSIDE_PROPOSAL')
        need(candidate_sha!=owner['candidate_sha'] or changed,'D02_TECHNICAL_CANDIDATE_ALREADY_CURRENT')
        need(manifest(self.root,plan['rules'])==plan['rules']
             and manifest(self.root,plan.get('protected_manifest',{}))==plan.get('protected_manifest',{}),
             'D02_TECHNICAL_PROTECTED_OR_RULE_BYTES_CHANGED')
        gitproof=_checkpoint_informed_technical_git(self,owner,primary,core)
        proof={'schemaVersion':'qf01-informed-technical-candidate-proof/1','work':work,'parentWork':FIXED_WORK,
               'methodAuthorityRef':method['authorityRef'],'proposalSHA256':owner_proposal,
               'checkpointEpoch':self.store.checkpoint_epoch,'expectedHead':expected_head,
               'planSHA256':digest(plan),'originalSourceSHA':plan['source_sha'],
               'sourceManifestSHA256':digest(plan['source_manifest']),'originalSnapshotRef':snapshot_ref,
               'previousCandidateSHA':owner['candidate_sha'],
               'previousCandidateManifestSHA256':digest(owner['candidate_manifest']),
               'candidateSHA':candidate_sha,'candidateManifest':current,'core':core,
               'implementationHash':implementation_hash(self),'gitProof':gitproof,
               'verificationRefs':list(verification_refs),
               'resultDispositions':[{'node':name,'artifact':row['artifact'],'oldInputHash':row['input_hash'],
                    'disposition':'REVERIFY_CURRENT_D02_CANDIDATE','reason':'Existing actual result retained; current D02 input must be verified'}
                    for name,row in sorted(owner['results'].items())],
               'writesExecuted':False,'oldResultsTransferred':False}
        need(self.store.head==expected_head and current_core_identity()==core
             and manifest(self.root,current)==current,'D02_CHANGED_DURING_TECHNICAL_RECONCILIATION')
        reference=self.store.put(proof)
        event=self.append('informed_technical_candidate_reconciled',work,{'proofRef':reference,'proof':proof})
        return {'proofRef':reference,'proof':proof,'eventHash':event['hash'],
                'codeFilesWritten':False,'gateAccepted':False}

    def next_integration(self,work,s,nodes):
        from requests import pending
        if s['plan']['command']=='CMD-WORK-002':
            from checkpoint import queue_coverage
            coverage=queue_coverage(self)
            if coverage['status']!='COMPLETE':return {'status':'BLOCKED','reason':'GLOBAL_QUEUE_COVERAGE_UNKNOWN','coverage':coverage}
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
                if row.get('linkedCorrection'):
                    from requests import has_current_correction_receipt
                    need(self.next(row['linkedCorrection'])['status']=='DONE' or has_current_correction_receipt(self,row['linkedCorrection'],work),'引継いだ必須修正が未完了')
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
