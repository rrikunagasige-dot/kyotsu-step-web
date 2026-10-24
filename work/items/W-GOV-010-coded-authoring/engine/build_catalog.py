"""過去事例の版とラベルを制作パイプラインへ渡す。学習は行わない。"""
import hashlib,json,sys
from pathlib import Path

def main():
    source=Path(sys.argv[1]);raw=source.read_bytes();data=json.loads(raw)
    cases={c['id']:{k:c.get(k) for k in ('quality_label','training_eligible','artifact_version','source_url','feedback_signal','evidence_level')} for c in data['cases']}
    catalog={'source':'W-GOV-010/corpus/cases.json','source_sha256':hashlib.sha256(raw).hexdigest(),'cases':cases,
             'policy':'UNKNOWNを正例として採用しない。今回、正例による学習は行わない。'}
    Path(__file__).with_name('catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
    print('catalog:',len(cases),'cases; positive labels:',sum(c['quality_label']=='POSITIVE' for c in cases.values()))

if __name__=='__main__':main()
