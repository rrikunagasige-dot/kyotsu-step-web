#!/usr/bin/env python3
"""Reproduce S24 artifacts without modifying learner data or promoting a model."""
import argparse,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.textbook.corpus.core import user_seed,curate,examples,collect
from tools.textbook.ml.encode import Encoder
from tools.textbook.ml.train import train,finetune
from tools.textbook.ml.retrieve import retrieve

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--root',default='.');parser.add_argument('--cache',required=True);parser.add_argument('--out',required=True);parser.add_argument('--local-only',action='store_true');a=parser.parse_args()
    root=Path(a.root).resolve();out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True)
    if out.is_relative_to(root/'src') or out.is_relative_to(root/'public'):raise ValueError('experiment writes cannot target learner source')
    def save(name,value):(out/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    obs,decisions=user_seed(root);c=curate(obs,decisions);rows=examples(c)
    index=json.loads((root/'work/items/W-GOV-010-learning-production-workflow/redesign/RECOVERED_CASE_INDEX.json').read_text());recovery=collect(root,index)
    save('CORPUS_RECOVERY.json',recovery);save('CURATED_CASES.json',c)
    save('TRAINING_EXAMPLES.json',{'format':'example-index/1','regenerate':'examples(curated_corpus)','examples':[{k:v for k,v in x.items() if k!='text'} for x in rows]})
    encoder=Encoder(a.cache,local_only=a.local_only);save('ENCODER_MANIFEST.json',encoder.file_manifest());m=train(rows,encoder,out/'MODEL_OFFLINE.json')
    save('SETFIT_EXPERIMENT.json',finetune(rows,encoder,'layout_discomfort',str(out/'setfit-candidate')))
    query='上の式から下の式を引く。どちらの式を引くかと目的を説明する。'
    save('RETRIEVAL_RECEIPT.json',retrieve(query,c['cases'],encoder,{'subject':'math','mode':'textbook','dimensions':['unmotivated_operation','broken_derivation']},3))
    print(json.dumps({'trainingRun':m['trainingRun'],'heads':list(m['heads']),'status':m['status'],'curatedCases':len(rows),'rawObservations':len(recovery['observations'])}))
if __name__=='__main__':main()
