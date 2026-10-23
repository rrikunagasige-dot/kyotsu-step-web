"""追記イベントの正本。状態・Markdownは再生成する。Python標準ライブラリのみ。"""
import hashlib,json,os,time,uuid
from pathlib import Path

class Conflict(RuntimeError):pass
class CorruptLedger(RuntimeError):pass

def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def digest(value):return hashlib.sha256(canonical(value)).hexdigest()

class Store:
    def __init__(self,path):
        self.root=Path(path).resolve();(self.root/'events').mkdir(parents=True,exist_ok=True);(self.root/'artifacts').mkdir(exist_ok=True)
    def events(self):
        previous='0'*64;result=[]
        for i,p in enumerate(sorted((self.root/'events').glob('*.json')),1):
            try:e=json.loads(p.read_text())
            except Exception as ex:raise CorruptLedger('イベントを読めない:'+p.name) from ex
            signature=e.pop('hash',None)
            if e.get('seq')!=i or e.get('previous')!=previous or digest(e)!=signature:raise CorruptLedger('イベント連鎖が不一致:'+p.name)
            e['hash']=signature;result.append(e);previous=signature
        return result
    @property
    def head(self):
        events=self.events();return events[-1]['hash'] if events else '0'*64
    def append(self,kind,work,payload,expected=None,event_id=None):
        lock=self.root/'.writer-lock'
        try:fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)
        except FileExistsError as ex:raise Conflict('書込ロックあり。実行中または中断を照合するまで再実行しない') from ex
        try:
            os.write(fd,canonical({'pid':os.getpid(),'time':time.time()}));os.fsync(fd)
            events=self.events();head=events[-1]['hash'] if events else '0'*64
            if expected is not None and expected!=head:raise Conflict('期待するイベントHEADが異なる')
            eid=event_id or str(uuid.uuid4())
            if not isinstance(eid,str) or not eid or any(c not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_' for c in eid):raise Conflict('操作IDが不正')
            for old in events:
                if old['id']==eid:
                    if old['kind']==kind and old['work']==work and old['payload']==payload:return old
                    raise Conflict('同じ操作IDに異なる内容')
            e={'seq':len(events)+1,'previous':head,'id':eid,'time':time.time(),'kind':kind,'work':work,'payload':payload}
            e['hash']=digest(e)
            tmp=self.root/'events'/('.'+eid+'.tmp');target=self.root/'events'/f'{e["seq"]:08d}-{eid}.json'
            with tmp.open('xb') as f:f.write(canonical(e)+b'\n');f.flush();os.fsync(f.fileno())
            os.replace(tmp,target)
            return e
        finally:os.close(fd);lock.unlink(missing_ok=True)
    def put(self,value):
        h=digest(value);p=self.root/'artifacts'/(h+'.json')
        if not p.exists():
            tmp=p.with_suffix('.'+uuid.uuid4().hex+'.tmp')
            with tmp.open('xb') as f:f.write(canonical(value)+b'\n');f.flush();os.fsync(f.fileno())
            os.replace(tmp,p)
        return h
    def get(self,h):
        if len(h)!=64 or any(c not in '0123456789abcdef' for c in h):raise CorruptLedger('成果物IDが不正')
        value=json.loads((self.root/'artifacts'/(h+'.json')).read_text())
        if digest(value)!=h:raise CorruptLedger('成果物ハッシュが不一致')
        return value
    def recover_lock(self):
        p=self.root/'.writer-lock'
        data=json.loads(p.read_text())
        try:os.kill(data['pid'],0)
        except ProcessLookupError:p.unlink();return {'removed_dead_pid':data['pid']}
        raise Conflict('ロックの所有プロセスが存在する。自動解除しない')
