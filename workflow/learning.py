"""Versioned case catalogs and ML dataset binding, on the existing Store and curation code."""
import json,subprocess,sys
from contracts import need
from store import digest


def finalize(rt,work,inputs):
    if str(rt.root) not in sys.path:sys.path.insert(0,str(rt.root))
    s=rt.state(work);rows=inputs.get('caseUpdates',[])
    need(len({r.get('caseId') for r in rows})==len(rows),'同じ事例の重複確定')
    valid=all(r.get('caseId') and r.get('regressionRef') and r.get('ruleDisposition') and r.get('datasetDisposition') for r in rows)
    expected={e['payload']['id'] for e in rt.store.events() if e['work']==work and e['kind']=='feedback_captured'}|set(s['issues'])
    if not valid or not expected<={r['caseId'] for r in rows}:return {'status':'FAIL','reason':'case finalization lacks disposition or captured IDs'}
    catalog={'schemaVersion':1,'caseUpdates':rows,'inputHash':digest(rows),'trainingRun':False}
    corpus=inputs.get('curation')
    if corpus:
        if s['plan'].get('solution_pipeline')=='solution/1':
            # Reconstruct every new solution snapshot from visible inputs, never from rationale/answers.
            from tools.textbook.corpus.solution_context import snapshot
            contexts={r['observationId']:snapshot(r['visible']) for r in inputs.get('solutionContexts',[])}
            for d in corpus['decisions']:
                if d.get('inputSnapshot',{}).get('contextSchema')=='solution-visible/1':
                    need(d['observationId'] in contexts and d['inputSnapshot']==contexts[d['observationId']],'solution学習入力を可視状態から再生成できない')
        # Incoming USER_GOLD must match a real explicit evaluation. Existing corpus cases retain their provenance.
        prior=rt.store.get(inputs['baseCatalogArtifact']).get('curatedCorpus',{}).get('cases',[]) if inputs.get('baseCatalogArtifact') else []
        previous={c['id']:c for c in prior}
        users=s['users'];captures={e['payload']['id']:e['payload'] for e in rt.store.events() if e['work']==work and e['kind']=='feedback_captured'}
        for d in corpus['decisions']:
            if d['observationId'] not in captures and d.get('quality')!='UNKNOWN' and d.get('evidenceTier') in ('USER_GOLD','REPO_ATTESTED'):
                old=previous.get(d.get('id'),{})
                need(old and all(d.get(k)==old.get(k) for k in ('quality','artifactVersion','scope','dimension','evidenceRef','inputSnapshot','familyId','episodeId','evidenceTier')),'新しいGold labelには原評価イベント又は検証済み既存catalogが必要')
            if d['observationId'] in captures and d.get('quality')!='UNKNOWN':
                captured=captures[d['observationId']];u=users[captured['evaluation_event']]
                expected_quality='POSITIVE' if u['intent']=='quality_positive' else 'NEGATIVE'
                need(d['quality']==expected_quality and d.get('artifactVersion')==captured['target_version'] and d.get('evidenceRef')==captured['evaluation_event'],'学習labelの原発言・対象版が違う')
        proc=subprocess.run([sys.executable,str(rt.root/'tools/textbook/production_cli.py'),'curate'],input=json.dumps(corpus),cwd=rt.root,capture_output=True,text=True,timeout=60)
        if proc.returncode:return {'status':'FAIL','stderr':proc.stderr,'stdout':proc.stdout}
        curated=json.loads(proc.stdout);catalog['curatedCorpus']=curated
        if s['plan'].get('solution_pipeline')=='solution/1':
            from tools.textbook.corpus.solution_context import evaluability
            catalog['solutionEvaluability']=evaluability(curated)
    ref=rt.store.put(catalog)
    return {'status':'PASS','caseUpdates':rows,'catalogArtifact':ref,'curatedCorpusHash':catalog.get('curatedCorpus',{}).get('hash'),'trainingRun':False}


def training_inputs(rt,inputs):
    """The training examples must come from the catalog actually finalized in this workflow."""
    ref=inputs.get('corpus_artifact');need(ref,'学習は確定したcatalog artifactへ接続する')
    catalog=rt.store.get(ref);need(catalog.get('curatedCorpus'),'観点別のcurated corpusがない')
    # The existing examples function rejects feedback/label leakage and non-learner snapshots.
    root=str(rt.root)
    if root not in sys.path:sys.path.insert(0,root)
    from tools.textbook.corpus.core import examples
    derived=examples(catalog['curatedCorpus']);request=dict(inputs['request'])
    need('examples' not in request or request['examples']==derived,'学習例が確定したcorpusと違う')
    request['examples']=derived
    return dict(inputs,request=request)
