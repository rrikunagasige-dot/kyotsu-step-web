"""Actual L01 supervised fitting, through the existing runtime capability adapter."""
from pathlib import Path
import json,sys
ROOT=Path(__file__).resolve().parents[3];B=Path(__file__).resolve().parent;sys.path.insert(0,str(ROOT/'workflow'))
from runtime import Runtime
from runner import run_code
r=Runtime(B/'runtime',ROOT);job=run_code(r,'W-MATH-032',json.loads((B/'LEARNING_JOB_INPUT.json').read_text()))
outputs={r.store.get(ref)['capability']:r.store.get(r.store.get(ref)['output']) for ref in job['receipts']}
(B/'LEARNING_JOB.json').write_text(json.dumps(job,ensure_ascii=False,indent=2)+'\n');(B/'MODEL_RESULT.json').write_text(json.dumps(outputs['ml.train'],ensure_ascii=False,indent=2)+'\n')
model=outputs['ml.train'];print(json.dumps({'status':model['status'],'trainingRun':model.get('trainingRun'),'modelDisposition':model.get('modelDisposition'),'heads':list(model.get('heads',{})),'omitted':model.get('omittedHeads'),'failure':model.get('trainingFailure')},ensure_ascii=False)[:2500])
