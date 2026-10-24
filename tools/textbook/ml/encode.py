"""Pinned multilingual encoder, complete chunk accounting, content-addressed cache."""
import hashlib,json,os
from pathlib import Path
import numpy as np
from ..corpus.core import digest

MODEL='intfloat/multilingual-e5-small'
REVISION='fd1525a9fd15316a2d503bf26ab031a61d056e98'
FEATURE_SCHEMA='learner-context-chunk-mean/1'

class Encoder:
    def __init__(self,cache,model=MODEL,revision=REVISION,local_only=False):
        os.environ.setdefault('HF_HUB_ETAG_TIMEOUT','15');os.environ.setdefault('HF_HUB_DOWNLOAD_TIMEOUT','30')
        import torch
        from sentence_transformers import SentenceTransformer
        torch.set_num_threads(2)
        self.cache=Path(cache);self.cache.mkdir(parents=True,exist_ok=True)
        self.model=SentenceTransformer(model,revision=revision,cache_folder=str(self.cache/'hub'),device='cpu',local_files_only=local_only,trust_remote_code=False)
        self.id=model;self.revision=revision
        tok=self.model.tokenizer;self.max_length=min(512,self.model.max_seq_length);self.tokenizer=tok
        self.manifest={'model':model,'revision':revision,'featureSchema':FEATURE_SCHEMA,'prefixClassification':'query: ','prefixPassage':'passage: ','maxLength':self.max_length,'dimension':self.model.get_sentence_embedding_dimension(),'pooling':repr(self.model[1]),'device':'cpu'}
        files=self._files()
        if not any(p.endswith('.safetensors') for p in files):raise ValueError('safetensors model snapshot required')
        self.manifest['artifactFilesHash']=digest(files)
        self.manifestHash=digest(self.manifest)
    def encode(self,text,prefix='query: '):
        ids=self.tokenizer.encode(text,add_special_tokens=False)
        budget=self.max_length-len(self.tokenizer.encode(prefix,add_special_tokens=True))-8
        # Split JSON/prose by token windows; retain every token and record boundaries.
        windows=[ids[i:i+budget] for i in range(0,len(ids),budget)] or [[]]
        chunks=[prefix+self.tokenizer.decode(x,skip_special_tokens=False) for x in windows]
        if any(len(self.tokenizer.encode(c,add_special_tokens=True))>self.max_length for c in chunks):raise ValueError('chunk retokenization exceeds limit')
        key=digest({'text':text,'prefix':prefix,'encoder':self.manifestHash})
        p=self.cache/'features'/(key+'.json');p.parent.mkdir(exist_ok=True)
        if p.exists():
            v=json.loads(p.read_text())
            if v['inputHash']!=digest(text) or v['encoderHash']!=self.manifestHash:raise ValueError('feature cache mismatch')
            return np.array(v['vector']),v['receipt']
        encoded=self.model.encode(chunks,normalize_embeddings=True,batch_size=16,show_progress_bar=False)
        weights=np.array([max(1,len(w)) for w in windows]);v=np.average(encoded,axis=0,weights=weights);v=v/max(np.linalg.norm(v),1e-12)
        receipt={'inputTokens':len(ids),'processedTokens':sum(map(len,windows)),'chunks':len(windows),'truncated':False,'aggregation':'token-weighted-mean','encoderHash':self.manifestHash}
        p.write_text(json.dumps({'inputHash':digest(text),'encoderHash':self.manifestHash,'vector':v.tolist(),'receipt':receipt}))
        return v,receipt
    def _files(self):
        hub=self.cache/'hub';entries={}
        snapshot=hub/('models--'+self.id.replace('/','--'))/'snapshots'/self.revision
        for p in sorted(snapshot.rglob('*')):
            if p.is_file() and 'snapshots' in p.parts:entries[str(p.relative_to(hub))]=hashlib.sha256(p.read_bytes()).hexdigest()
        return entries
    def file_manifest(self):
        entries=self._files()
        return {'encoder':self.manifest,'encoderHash':self.manifestHash,'files':entries,'weightFilesVerified':any(p.endswith('.safetensors') for p in entries)}
