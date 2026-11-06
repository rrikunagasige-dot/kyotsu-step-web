"""Isolated temporary Store tests; real procfs/processes, no mocks/os.kill spoof.
CLI phases permit M to test two real sessions both having namespace-local PID2.
These fixtures never accept a native Store path and never remove a native lock.
"""
import hashlib, json, os, pathlib, shutil, subprocess, sys, tempfile, unittest
import store as m

def statline(pid,start):
    return f'{pid} (name with ) spaces) '+' '.join(['S']+['0']*18+[str(start)]+['0']*4)+'\n'

class IdentityTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(prefix='w050-lock-identity-fixture-')
        self.root=pathlib.Path(self.tmp.name);(self.root/'.fixture-only').write_text('TEMP_TEST_ONLY')
        self.s=m.Store(self.root);self.lock=self.root/'.writer-lock'
    def tearDown(self): self.tmp.cleanup()
    def put(self,data):
        raw=m.canonical(data);self.lock.write_bytes(raw);return raw
    def kept(self,raw):
        with self.assertRaises(m.Conflict):self.s.recover_lock()
        self.assertEqual(raw,self.lock.read_bytes());self.assertEqual([],self.s.events())
    def test_real_observable_identity(self):
        v=m._observe_proc();self.assertEqual(v['nspid'][-1],os.getpid())
        self.assertEqual(v['nspid'][0],v['procfsPid']);self.assertGreater(v['start_ticks'],0)
        self.assertEqual(m._proc_stat(pathlib.Path('/proc')/str(v['procfsPid'])/'stat'),(v['procfsPid'],v['start_ticks']))
    def test_append_chain_and_canonical_unchanged(self):
        a=self.s.append('one','TEST_ONLY',{'x':1});b=self.s.append('two','TEST_ONLY',{'x':2},expected=a['hash'])
        self.assertEqual(self.s.events(),[a,b]);self.assertFalse(self.lock.exists())
        self.assertEqual(m.digest({'a':1}),hashlib.sha256(b'{"a":1}').hexdigest())
    def test_expected_head_conflict_preserved(self):
        with self.assertRaises(m.Conflict):self.s.append('no','TEST_ONLY',{},expected='1'*64)
        self.assertEqual([],self.s.events());self.assertFalse(self.lock.exists())
    def test_live_self_rejected_even_old_time(self):
        v=m._lock_record();v['time']=1;self.kept(self.put(v))
    def test_legacy_reader_pid_rejected(self):self.kept(self.put({'pid':os.getpid(),'time':1}))
    def test_legacy_pid2_rejected_without_liveness_guess(self):self.kept(self.put({'pid':2,'time':1}))
    def test_legacy_apparently_absent_pid_also_rejected(self):self.kept(self.put({'pid':2147483647,'time':1}))
    def test_missing_version_never_legacy_fallback(self):
        d=m._lock_record();d.pop('identity_version');self.kept(self.put(d))
    def test_unknown_version_rejected(self):
        d=m._lock_record();d['identity_version']='future-unknown';self.kept(self.put(d))
    def test_different_boot_rejected(self):
        d=m._lock_record();d['boot_id']='11111111-1111-4111-8111-111111111111';self.kept(self.put(d))
    def test_different_view_rejected(self):
        d=m._lock_record();d['procfs_view']['init_start_ticks']+=1;self.kept(self.put(d))
    def test_invalid_identity_fields_rejected(self):
        for key,value in [('procfsPid',0),('start_ticks',0),('nspid',[]),('nspid',[1,999]),('time',float('nan')),('time',-1),('pid',True)]:
            with self.subTest(key=key,value=value):
                d=m._lock_record();d[key]=value;self.kept(self.put(d))
    def test_truncated_lock_rejected(self):
        raw=b'{"pid":';self.lock.write_bytes(raw);self.kept(raw)
    def test_unexpected_identity_field_rejected(self):
        d=m._lock_record();d['unreviewed']=True;self.kept(self.put(d))
    def test_symlink_lock_rejected(self):
        p=self.root/'other';raw=m.canonical(m._lock_record());p.write_bytes(raw);self.lock.symlink_to(p)
        with self.assertRaises(m.Conflict):self.s.recover_lock()
        self.assertTrue(self.lock.is_symlink());self.assertEqual(p.read_bytes(),raw)
    def test_nonregular_fifo_lock_rejected_without_read(self):
        os.mkfifo(self.lock)
        with self.assertRaises(m.Conflict):self.s.recover_lock()
        self.assertTrue(self.lock.exists());self.assertEqual([],self.s.events())
    def test_changed_lock_bytes_refuse_removal(self):
        raw=self.put(m._lock_record());identity=self.lock.lstat();self.lock.write_bytes(raw+b' ')
        with self.assertRaises(m.Conflict):m._remove_observed_lock(self.lock,raw,identity)
        self.assertEqual(self.lock.read_bytes(),raw+b' ')
    def test_proc_stat_comm_parentheses_spaces(self):
        p=self.root/'stat-fixture';p.write_text(statline(123,456));self.assertEqual(m._proc_stat(p),(123,456))
    def test_proc_stat_malformed_refused(self):
        p=self.root/'stat-fixture';p.write_text('nonsense')
        with self.assertRaises((m.Conflict,ValueError)):m._proc_stat(p)
    def test_real_foreign_live_then_crashed_writer(self):
        p=subprocess.Popen([sys.executable,__file__,'--fixture-phase','writer','--fixture-dir',str(self.root),'--wait-for-input'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
        try:
            line=p.stdout.readline();obs=json.loads(line);raw=self.lock.read_bytes()
            self.assertEqual(obs['rawSHA256'],hashlib.sha256(raw).hexdigest())
            self.assertIsNone(p.poll());self.kept(raw)  # Real foreign writer alive: refuse.
            p.stdin.write('exit\n');p.stdin.flush();out,err=p.communicate(timeout=20)
            self.assertEqual(p.returncode,73,err);result=self.s.recover_lock()
            self.assertEqual(result['reason'],'PROCFS_PID_GONE');self.assertFalse(self.lock.exists())
            e=self.s.append('recovered','TEST_ONLY',{'fixture':True});self.assertEqual(self.s.events(),[e])
            print(json.dumps({'scope':'REAL_TEMP_LIVE_AND_DEAD_CHILD_NOT_NATIVE','writer':obs,'reader':m._observe_proc(),'recovery':result,'nativeTouched':False}),flush=True)
        finally:
            if p.poll() is None:
                p.stdin.write('exit\n');p.stdin.flush();p.communicate(timeout=20)


def fixture_driver():
    import argparse
    p=argparse.ArgumentParser();p.add_argument('--fixture-phase',choices=['init','writer','reader'],required=True)
    p.add_argument('--fixture-dir');p.add_argument('--require-inner-pid',type=int)
    p.add_argument('--expected-lock-sha256');p.add_argument('--wait-for-input',action='store_true');a=p.parse_args()
    if a.fixture_phase=='init':
        d=pathlib.Path(tempfile.mkdtemp(prefix='w050-lock-identity-fixture-'));(d/'.fixture-only').write_text('TEMP_TEST_ONLY');m.Store(d)
        print(json.dumps({'status':'TEMP_FIXTURE_CREATED','directory':str(d)}));return
    requested=pathlib.Path(a.fixture_dir).absolute();d=requested.resolve();base=pathlib.Path(tempfile.gettempdir()).resolve()
    assert requested==d and not requested.is_symlink() and d.parent==base and d.name.startswith('w050-lock-identity-fixture-') and (d/'.fixture-only').read_text()=='TEMP_TEST_ONLY','temporary fixture Store only'
    assert {p.name for p in d.iterdir()} <= {'.fixture-only','events','artifacts','.writer-lock'},'unknown fixture files'
    if a.require_inner_pid is not None and os.getpid()!=a.require_inner_pid:
        print(json.dumps({'status':'UNVERIFIED_NAMESPACE_PID_NOT_REQUESTED','actual':os.getpid(),'required':a.require_inner_pid}));raise SystemExit(3)
    if a.fixture_phase=='writer':
        class AbruptCrashAfterRealLock(m.Store):
            # Test-only fault injection after actual production append acquires/fsyncs lock.
            def events(self):
                lock=self.root/'.writer-lock'
                if lock.exists():
                    raw=lock.read_bytes();print(json.dumps({'status':'REAL_TEMP_WRITER_LOCK_THEN_ABRUPT_EXIT','innerPid':os.getpid(),'record':json.loads(raw),'rawSHA256':hashlib.sha256(raw).hexdigest()}),flush=True)
                    if a.wait_for_input:sys.stdin.readline()
                    os._exit(73)
                return super().events()
        AbruptCrashAfterRealLock(d).append('fixture','TEST_ONLY',{})
    else:
        s=m.Store(d);raw=(d/'.writer-lock').read_bytes()
        assert a.expected_lock_sha256 and hashlib.sha256(raw).hexdigest()==a.expected_lock_sha256,'actual writer raw SHA required'
        assert s.events()==[],'fixture not empty'
        result=s.recover_lock();event=s.append('recovered','TEST_ONLY',{'fixture':True});assert len(s.events())==1
        print(json.dumps({'status':'REAL_TEMP_RECOVERY_PASS','readerInnerPid':os.getpid(),'writerInnerPid':json.loads(raw)['pid'],'rawSHA256':hashlib.sha256(raw).hexdigest(),'recovery':result,'eventHash':event['hash'],'nativeTouched':False}))

if __name__=='__main__':
    if '--fixture-phase' in sys.argv:fixture_driver()
    else:unittest.main()
