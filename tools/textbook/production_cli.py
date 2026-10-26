#!/usr/bin/env python3
"""Corpus/ML subprocess adapter. Workflow events stay in workflow.Runtime."""
import argparse,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.textbook.corpus.core import collect,curate,examples,user_seed

def main():
    p=argparse.ArgumentParser();p.add_argument('operation',choices=['collect','curate','seed','train','prefetch','predict','retrieve','finetune','solution-context','solution-observation','solution-evaluability','construction-context']);p.add_argument('--out');a=p.parse_args();data=json.load(sys.stdin)
    if a.operation=='construction-context':
        from tools.textbook.corpus.construction_context import snapshot
        result=snapshot(data['visible'])
    elif a.operation.startswith('solution-'):
        from tools.textbook.corpus.solution_context import snapshot,observation,evaluability
        if a.operation=='solution-context':result=snapshot(data['visible'])
        elif a.operation=='solution-observation':result=observation(data['quote'],data['sourceRef'],data['artifactVersion'],data.get('scope'))
        else:result=evaluability(data['corpus'])
    elif a.operation=='collect':result=collect(data['root'],data['index'])
    elif a.operation=='curate':result=curate(data['observations'],data['decisions'])
    elif a.operation=='seed':
        obs,decisions=user_seed(data['root']);c=curate(obs,decisions);result={'corpus':c,'examples':examples(c)}
    else:
        try:
            from tools.textbook.ml.encode import Encoder
            e=Encoder(data['cache'],**data.get('encoder',{}))
        except (ModuleNotFoundError,FileNotFoundError) as exc:
            if a.operation!='retrieve':raise
            from tools.textbook.corpus.scoped_catalog import scoped_catalog
            print(json.dumps(scoped_catalog(data,str(exc)),ensure_ascii=False));return
        except OSError as exc:
            # Only an explicitly local encoder with absent weights permits fallback.
            cache=Path(data['cache'])/'hub'
            if a.operation!='retrieve' or not data.get('encoder',{}).get('local_only') or any(cache.rglob('*.safetensors')):raise
            from tools.textbook.corpus.scoped_catalog import scoped_catalog
            print(json.dumps(scoped_catalog(data,str(exc)),ensure_ascii=False));return
        if a.operation=='prefetch':result=e.file_manifest()
        elif a.operation=='train':
            from tools.textbook.ml.train import train
            if not a.out:raise ValueError('--out required')
            result=train(data['examples'],e,a.out,accepted_feature_schemas=data.get('acceptedFeatureSchemas'))
        elif a.operation=='finetune':
            from tools.textbook.ml.train import finetune
            if not a.out:raise ValueError('--out required')
            result=finetune(data['examples'],e,data['dimension'],a.out)
        elif a.operation=='predict':
            from tools.textbook.ml.predict import predict
            result=predict(data.get('model'),data['text'],e,data['dimension'],input_schema=data.get('featureInputSchema'))
        else:
            from tools.textbook.ml.retrieve import retrieve
            result=retrieve(data['query'],data['cases'],e,data['scope'])
    if a.out and a.operation not in ('train','finetune'):Path(a.out).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(result,ensure_ascii=False))
if __name__=='__main__':
    try:main()
    except (ValueError,KeyError,OSError) as e:print(json.dumps({'status':'FAIL','error':str(e)}));sys.exit(2)
