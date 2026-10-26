"""Real supervised fit with unknown-label masking and group-aware evaluability."""
import time,json
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold
from sklearn.metrics import precision_recall_fscore_support
from ..corpus.core import digest,split_groups

def train(rows,encoder,output,accepted_feature_schemas=None):
    from pathlib import Path
    schemas={r.get('featureInputSchema', 'legacy') for r in rows}
    if 'learner-visible-json/3' in schemas and not schemas <= set(accepted_feature_schemas or []):
        raise ValueError('new visible schema requires explicit acceptedFeatureSchemas')
    started=time.monotonic();X=[];receipts=[]
    for row in rows:
        x,r=encoder.encode(row['text']);X.append(x);receipts.append({'rowId':row['id'],**r})
    X=np.asarray(X);heads={};evaluations={};splits={};omitted=[]
    for dim in sorted({r['dimension'] for r in rows}):
        selected=[i for i,r in enumerate(rows) if r['dimension']==dim and r.get('label') in (0,1)]
        data=[rows[i] for i in selected];y=np.array([r['label'] for r in data]);x=X[selected]
        if len(set(y))<2:omitted.append({'dimension':dim,'reason':'NOT_TRAINABLE_SINGLE_CLASS','rows':len(y)});continue
        split=split_groups(data);splits[dim]=split
        predictions=[];folds=[]
        if split['groupCount']>=2:
            for train_idx,test_idx in GroupKFold(n_splits=min(3,split['groupCount'])).split(x,y,split['groups']):
                if len(set(y[train_idx]))<2:folds.append({'status':'NOT_TRAINABLE_SINGLE_CLASS','testIds':[data[i]['id'] for i in test_idx]});continue
                clf=LogisticRegression(C=1,class_weight='balanced',random_state=17,max_iter=1000).fit(x[train_idx],y[train_idx])
                pred=clf.predict(x[test_idx]);predictions.extend((int(y[i]),int(p)) for i,p in zip(test_idx,pred));folds.append({'status':'PASS','trainIds':[data[i]['id'] for i in train_idx],'testIds':[data[i]['id'] for i in test_idx]})
        evaluable=bool(folds) and all(f['status']=='PASS' for f in folds) and len(set(y))==2 and split['groupCount']>=3
        metrics=None
        if predictions:
            a,b=zip(*predictions);pr,rc,f1,_=precision_recall_fscore_support(a,b,labels=[0,1],zero_division=0)
            metrics={'precision':pr.tolist(),'recall':rc.tolist(),'f1':f1.tolist(),'rowsPredicted':len(a),'notAnUnseenTest':True}
        evaluations[dim]={'status':'DEVELOPMENT_ONLY' if evaluable else 'NOT_ESTIMABLE','folds':folds,'metrics':metrics,'allExamplesSeenDuringDesign':all(r.get('seen',True) for r in data)}
        clf=LogisticRegression(C=1,class_weight='balanced',random_state=17,max_iter=1000).fit(x,y)
        heads[dim]={'coef':clf.coef_[0].tolist(),'intercept':float(clf.intercept_[0]),'classes':clf.classes_.tolist(),'rowIds':[r['id'] for r in data]}
    manifest={'schemaVersion':'quality-model/1','trainingRun':bool(heads),'trainingMethod':'frozen-pretrained-encoder + LogisticRegression.fit','encoder':encoder.manifest,'encoderHash':encoder.manifestHash,'featureSchema':encoder.manifest['featureSchema'],
        'datasetHash':digest(rows),'splitManifest':splits,'heads':heads,'omittedHeads':omitted,'evaluation':evaluations,'status':'OFFLINE_ONLY','advisoryEligible':False,
        'durationSeconds':time.monotonic()-started,'featureReceipts':receipts,'warning':'No unseen holdout; this run demonstrates learning, not production quality.'}
    if 'learner-visible-json/3' in schemas: manifest['inputFeatureSchemas']=sorted(schemas)
    manifest['modelHash']=digest(manifest);Path(output).parent.mkdir(parents=True,exist_ok=True);Path(output).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');return manifest

def finetune(rows,encoder,dimension,output):
    """Only complete inputs fitting the encoder are eligible for SetFit training."""
    from datasets import Dataset
    from setfit import SetFitModel,Trainer,TrainingArguments
    data=[r for r in rows if r['dimension']==dimension and r.get('label') in (0,1)]
    complete=[r for r in data if len(encoder.tokenizer.encode('query: '+r['text']))<=encoder.max_length]
    if len({r['label'] for r in complete})<2:return {'status':'NOT_TRAINABLE','reason':'complete-context labels insufficient; no truncation allowed','eligible':len(complete),'excluded':len(data)-len(complete),'trainingRun':False}
    model=SetFitModel.from_pretrained(encoder.id,revision=encoder.revision,normalize_embeddings=True)
    ds=Dataset.from_dict({'text':['query: '+r['text'] for r in complete],'label':[r['label'] for r in complete]})
    args=TrainingArguments(output_dir=output,num_epochs=1,batch_size=8,seed=17,report_to='none')
    Trainer(model=model,args=args,train_dataset=ds).train();model.save_pretrained(output)
    return {'status':'OFFLINE_ONLY','trainingRun':True,'method':'SetFit encoder and head fit','rows':[r['id'] for r in complete]}
