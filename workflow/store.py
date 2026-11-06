"""追記イベントの正本。状態・Markdownは再生成する。Python標準ライブラリのみ。"""
import hashlib,json,os,time,uuid,math,stat
from pathlib import Path

class Conflict(RuntimeError):pass
class CorruptLedger(RuntimeError):pass

def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def digest(value):return hashlib.sha256(canonical(value)).hexdigest()

# A namespace-local pid alone is not comparable with a differently mounted /proc.
_PROC=Path('/proc')
_LOCK_IDENTITY='linux-procfs-writer/1'

def _proc_stat(path):
    raw=path.read_text(); end=raw.rfind(')'); fields=raw[end+1:].split()
    if end<0 or len(fields)<20:raise Conflict('proc statを解釈できない')
    pid=int(raw.split(' ',1)[0]); start=int(fields[19])
    if pid<=0 or start<=0:raise Conflict('proc pid/startが不正')
    return pid,start

def _nspid(path):
    rows=[line.split(':',1)[1].split() for line in path.read_text().splitlines() if line.startswith('NSpid:')]
    if len(rows)!=1 or not rows[0]:raise Conflict('NSpidを確認できない')
    values=[int(v) for v in rows[0]]
    if any(v<=0 for v in values):raise Conflict('NSpidが不正')
    return values

def _observe_proc():
    try:
        pid,start=_proc_stat(_PROC/'self/stat'); nspid=_nspid(_PROC/'self/status')
        if nspid[0]!=pid or nspid[-1]!=os.getpid():raise Conflict('procfsとnamespace pidの対応が不明')
        if _proc_stat(_PROC/str(pid)/'stat')!=(pid,start) or _nspid(_PROC/str(pid)/'status')!=nspid:raise Conflict('procfs selfを同じviewから参照できない')
        init_pid,init_start=_proc_stat(_PROC/'1/stat');init_nspid=_nspid(_PROC/'1/status')
        if init_pid!=1 or init_nspid[0]!=1:raise Conflict('procfs init anchorが不明')
        mounts=[]
        for line in (_PROC/'self/mountinfo').read_text().splitlines():
            left,right=line.split(' - ',1); a=left.split();b=right.split()
            if len(a)>=6 and len(b)>=3 and a[4]=='/proc' and b[0]=='proc':mounts.append((a,b))
        if len(mounts)!=1:raise Conflict('procfs mount viewが一意でない')
        a,b=mounts[0];options=(a[5]+','+b[2]).split(',')
        if any(x.startswith('hidepid=') and x!='hidepid=0' for x in options):raise Conflict('非表示pidを死活判定しない')
        boot=(_PROC/'sys/kernel/random/boot_id').read_text().strip()
        if str(uuid.UUID(boot))!=boot:raise Conflict('boot_idが不正')
        device=_PROC.stat().st_dev
        if a[2]!=str(os.major(device))+':'+str(os.minor(device)):raise Conflict('procfs mount deviceが不整合')
        view={'device':device,'mount_major_minor':a[2],'mount_root':a[3],'init_start_ticks':init_start,'init_nspid':init_nspid}
        return {'procfsPid':pid,'start_ticks':start,'boot_id':boot,'procfs_view':view,'nspid':nspid}
    except Conflict:raise
    except (OSError,ValueError,IndexError) as ex:raise Conflict('procfs identityを安全に観測できない') from ex

def _lock_record():
    return {'pid':os.getpid(),'time':time.time(),'identity_version':_LOCK_IDENTITY,**_observe_proc()}

def _remove_observed_lock(path,raw,identity):
    # An administrative caller must serialize recovery. Never remove changed bytes.
    try:
        current=path.lstat()
        if path.is_symlink() or not stat.S_ISREG(current.st_mode) or (current.st_dev,current.st_ino)!=(identity.st_dev,identity.st_ino) or path.read_bytes()!=raw:raise Conflict('照合中にlockが変化した')
        path.unlink()
    except Conflict:raise
    except OSError as ex:raise Conflict('lockの同一性を再確認できない') from ex

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
        record=_lock_record()
        try:fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)
        except FileExistsError as ex:raise Conflict('書込ロックあり。実行中または中断を照合するまで再実行しない') from ex
        try:
            os.write(fd,canonical(record));os.fsync(fd)
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
        try:
            identity=p.lstat()
            if p.is_symlink() or not stat.S_ISREG(identity.st_mode):raise Conflict('regular file以外のlockは解除しない')
            raw=p.read_bytes();data=json.loads(raw)
            if not isinstance(data,dict) or type(data.get('pid')) is not int or data['pid']<=0:raise Conflict('lock pidが不正')
        except Conflict:raise
        except (OSError,ValueError) as ex:raise Conflict('lockを安全に解釈できない') from ex
        if 'identity_version' not in data:
            # A namespace-local legacy pid is not a verifiable procfs identity.
            # Refuse even apparently absent PIDs; never use pid-only os.kill recovery.
            raise Conflict('legacy lockはprocfs writer identityが無い。明示的な原物保全・終了照合が必要')
        try:
            if data['identity_version']!=_LOCK_IDENTITY:raise Conflict('未対応lock identity')
            if set(data)!={'pid','time','identity_version','procfsPid','start_ticks','boot_id','procfs_view','nspid'} or type(data.get('time')) not in (int,float) or not math.isfinite(data['time']) or data['time']<=0:raise Conflict('malformed lock identity fields')
            if type(data.get('procfsPid')) is not int or data['procfsPid']<=0 or type(data.get('start_ticks')) is not int or data['start_ticks']<=0:raise Conflict('lock procfs identityが不正')
            nspid=data.get('nspid')
            if not isinstance(nspid,list) or not nspid or any(type(v) is not int or v<=0 for v in nspid) or nspid[0]!=data['procfsPid'] or nspid[-1]!=data['pid']:raise Conflict('lock NSpidが不正')
            current=_observe_proc()
            if data.get('boot_id')!=current['boot_id'] or data.get('procfs_view')!=current['procfs_view']:raise Conflict('同じboot/procfs viewを確認できない')
            try:pid,start=_proc_stat(_PROC/str(data['procfsPid'])/'stat')
            except FileNotFoundError:
                try:(_PROC/str(data['procfsPid'])).stat()
                except FileNotFoundError:reason='PROCFS_PID_GONE'
                else:raise Conflict('procfs pid directoryの観測が不明')
            else:
                if pid!=data['procfsPid']:raise Conflict('procfs pid参照が不整合')
                if start==data['start_ticks']:raise Conflict('同じwriter processが存在する。解除しない')
                reason='PROCFS_PID_REUSED_DIFFERENT_START'
        except Conflict:raise
        except (OSError,ValueError,IndexError,KeyError) as ex:raise Conflict('writer identityの死活が不明') from ex
        final_view=_observe_proc()
        if final_view['boot_id']!=current['boot_id'] or final_view['procfs_view']!=current['procfs_view']:raise Conflict('照合中にboot/procfs viewが変化した')
        _remove_observed_lock(p,raw,identity)
        return {'removed_dead_pid':data['pid'],'procfsPid':data['procfsPid'],'identity_version':_LOCK_IDENTITY,'reason':reason}
